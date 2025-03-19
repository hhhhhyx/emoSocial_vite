<script setup>
import {ElDatePicker, ElInput, ElMessage, ElSelect, ElText} from 'element-plus';
import {reactive, ref} from "vue";
import cons from "../../components/Apis/constant.js";
import {v4 as uuidv4} from 'uuid';
import http from "../../utils/index.js";
import router from "../../router/index.js";

const uuid = uuidv4()


let buttonText = ref('next')
let Account_FormVisible = ref(true)
let Profile_FormVisible = ref(false)
let dialogVisible = ref(false)
const register_ruleFormRef = ref()
const register_DataForm = reactive({
  id: '',
  account: '',
  password: '',
  idNumber: '',
  name: '',
  email: '',
  gender: '',
  birthday: '',
})
const CheckAccount = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9]{6,12}$/
  if (!value.match(reg)) {
    callback(new Error('User name format: 6 to 12 digits (letters, numbers)'))
  } else {
    callback()
  }
}
const CheckPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please enter your password again'));
  } else if (value !== register_DataForm.password) {
    callback(new Error('Inconsistency between two password entries！'));
  } else {
    callback();
  }
};
const register_handleButtonClick = (register_ruleFormRef) => {
  if (buttonText.value === 'next') {
    register_ruleFormRef.validateField(['account', 'password', 'confirm_password', 'type'], valid => {
      if (valid) {
        register_DataForm.id = uuidv4()
        http.post(cons.checkAccount_apis, register_DataForm).then((res) => {
          if (res.data === "success") {
            Account_FormVisible.value = false;
            Profile_FormVisible.value = true;
            buttonText.value = 'success';
          } else {
            ElMessage.error('Account already exists!')
          }
        })
      } else {
        console.log('error')
      }
    })
  } else {

    http.post(cons.register_apis, register_DataForm).then((res) => {
      if (res.data === "success") {
        ElMessage({
          message: 'Congratulations! Successful creation!',
          type: 'success',
        })
        buttonText.value = 'next'
        dialogVisible.value = false
        Account_FormVisible.value = true
        Profile_FormVisible.value = false
      } else {
        ElMessage.error('Creation Failed!')
        buttonText.value = 'next'
        dialogVisible.value = false
        Account_FormVisible.value = true
        Profile_FormVisible.value = false
      }
    })
    register_ruleFormRef.resetFields()

  }
}
const register_rules = ref({
  account: [
    {
      required: true,
      message: 'Please fill in your account',
      trigger: 'blur'
    },
    {
      validator: CheckAccount,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: 'blur'
    },
    {
 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: 'Password format: 8-16 characters (at least 1 uppercase letter, 1 lowercase letter and 1 number)',
      trigger: 'blur'
    }
  ],
  confirm_password: [
    {
      required: true,
      validator: CheckPassword,
      trigger: 'blur'
    }
  ],
  idNumber: [
    {
      required: true,
      message: 'Please enter your ID number',
    },
  ],
  name: [
    {
      required: true,
      message: 'Please enter your name',
      trigger: 'blur'
    },
  ],
  email: [
    {
      required: true,
      message: 'Please input your email',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: 'Please enter the correct email format',
    }
  ],
  gender: [
    {
      required: true,
      message: 'Please select your gender',
      trigger: 'blur'
    },
  ],
  birthday: [
    {
      required: true,
      message: 'Please select your birthday',
      trigger: 'blur'
    },
  ],
})



let checkCodeBtn = reactive({
  text: 'Verified Code',
  loading: false,
  disabled: false,
  duration: 10,
  timer: null
})
let Retrieve_dialogVisible = ref(false)
let random_code = ref('')
const retrieve_ruleFormRef = ref()
const retrieve_DataForm = reactive({
  retrieve_account: '',
  retrieve_password: '',
  retrieve_password_confirm: '',
  retrieve_confirm_code: '',
})
const CheckRetrievePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please enter your password again'));
  } else if (value !== retrieve_DataForm.retrieve_password) {
    callback(new Error('The two passwords entered do not match!'));
  } else {
    callback();
  }
};
const retrieve_rules = ref({
  retrieve_account: [
    {
      required: true,
      message: 'Please fill in your account',
      trigger: 'blur'
    },
  ],
  retrieve_password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: 'Password format: 8-16 characters (at least 1 uppercase letter, 1 lowercase letter and 1 number)',
      trigger: 'blur'
    }
  ],
  retrieve_password_confirm: [
    {
      required: true,
      validator: CheckRetrievePassword,
      trigger: 'blur'
    }
  ],
  retrieve_confirm_code: [
    {
      required: true,
      trigger: 'blur',
      message: 'Please enter the verification code'
    }
  ],
})
const getCheckCode = () => {
  checkCodeBtn.disabled = true

  checkCodeBtn.timer && clearInterval(checkCodeBtn.timer)

  checkCodeBtn.timer = setInterval(() => {
    const tmp = checkCodeBtn.duration--
    checkCodeBtn.text = `${tmp}s`
    if (tmp <= 0) {
      clearInterval(checkCodeBtn.timer)
      checkCodeBtn.duration = 10
      checkCodeBtn.text = 'Resend'
      checkCodeBtn.disabled = false
    }
  }, 1000)
  http.post(cons.retrieveAccount_apis, retrieve_DataForm)
}
const retrieve_handleButtonClick = (retrieve_ruleFormRef) => {
  retrieve_ruleFormRef.validate(valid => {
    if (valid) {
      http.put(cons.retrieveAccount_apis, retrieve_DataForm).then((res) => {
        if (res.data === 'success') {
          ElMessage({
            message: 'Modified successfully!',
            type: 'success',
          })
          Retrieve_dialogVisible.value = false;
          retrieve_ruleFormRef.resetFields()
        } else {
          ElMessage.error('Wrong verified code! ')
        }
      })

    } else {
      console.log('error!')
    }
  })
}



let login_dialogVisible = ref(false)
let user_profile = ref('')
const login_ruleFormRef = ref()
const login_Form = reactive({
  account: '',
  password: '',
})
const getProfileRequest = () => {
  console.log(localStorage.getItem('user_info'))
  http.get(cons.getProfile_apis, {
    params: {token: localStorage.getItem('token')}
  }).then((res) => {
    localStorage.setItem('user_info', JSON.stringify(res.data))
  })
  console.log(localStorage.getItem('user_info'))
}
const getRecommendRequest = () => {
  http.get(cons.getRecommendUsers_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    localStorage.setItem('recommend_info', JSON.stringify(res.data))
  })
}
const login_handleButtonClick = (login_ruleFormRef) => {
  console.log("login !")
  console.log(cons.login_apis)

  http.post(cons.login_apis, login_Form).then((res) => {
    console.log("diaoyong !")
    if (res.data.mes === 'NoAccount') {
      ElMessage.error('No such account! Please check before entering')
    }
    if (res.data.mes === 'InputError') {
      ElMessage.error('Please enter complete information!')
    }
    if (res.data.mes === 'WrongPassword') {
      ElMessage.error('The password is wrong! Please check and re-enter')
    }
    if (res.data.mes === 'LoginSuccess') {
      ElMessage({
        message: 'Login Success!',
        type: 'success',
      })
      localStorage.setItem("token", res.data.access_token)
      localStorage.setItem("userType", res.data.type)
      getProfileRequest()
      getRecommendRequest()
      login_ruleFormRef.resetFields()
      login_dialogVisible.value = false
      if (res.data.type === '普通用户') {
        router.push('/default_moments')
      } else {
        router.push('/users_manage')
      }
    }
  })
}
</script>

<template>
  <video class="videoElement" muted loop autoplay
         disablepictureinpicture>
    <source src="/src/assets/login_bp_video.mp4" type="video/mp4">
  </video>
  <el-container class="outer">
    <el-container class="outer">

      <el-aside style="display: flex;align-items: center;justify-content: center" width="55%">

      </el-aside>
      <el-aside style="display: flex;align-items: center;justify-content: center" width="45%">
        <el-main style="padding: 30px" type="flex">
          <el-row style="height: 37%;color: white">
            <h1 style="bottom: 70px;font-size: 75px;margin: 0">Occurring</h1>
          </el-row>
          <el-row style="height: 60%;flex-direction: column">
            <el-row style="height: 60%;flex-direction: column">
              <el-row>
                <h1 style="font-size: 35px;margin: 0;display: flex;color: white">Join now.</h1>
              </el-row>
              <el-row>
                <el-button id="login_button"
                           :style="{fontWeight:'bold',fontSize: '17px',color: 'black',backgroundColor:white,}"
                           @click="dialogVisible=true">
                  Sign Up
                </el-button>
                <el-dialog v-if="dialogVisible" v-model="dialogVisible" :show-close="false"
                           style="height: 710px; border-radius: 20px" width="670"
                >
                  <template #header>
                    <el-container>
                      <el-image src="src/assets/logo.png" style="width: 250px;margin: auto"></el-image>
                      <el-button id="close_button"
                                 style="height: 40px;width: 40px;border-radius: 50%;border: none;transition:all .5s;position: absolute; top: 10px;right: 10px"
                                 @click="dialogVisible = false">
                        <el-icon :size="23" color="black" style="font-weight: 5;">
                          <Close/>
                        </el-icon>
                      </el-button>
                    </el-container>
                  </template>
                  <el-container style="margin-top: 50px; justify-content: center;">
                    <el-form ref="register_ruleFormRef" :model="register_DataForm" :rules="register_rules">
                      <div v-show="Account_FormVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-bottom: 30px;margin-top: 40px;color: black">
                            Create Account</h1>
                        </el-form-item>
                        <el-form-item prop="account">
                          <el-input v-model="register_DataForm.account" label="Account"
                                    placeholder="Account"></el-input>

                        </el-form-item>
                        <el-form-item prop="password">

                          <el-input v-model="register_DataForm.password" label="Password" placeholder="Password"
                                    show-password type="password"></el-input>

                        </el-form-item>
                        <el-form-item prop="confirm_password">
                          <el-input v-model="register_DataForm.confirm_password" label="Confirm Password" placeholder="Confirm Password"
                                    show-password type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="idNumber">
                          <el-input v-model="register_DataForm.idNumber" label="IDNumber"
                                    placeholder="IDNumber"></el-input>
                        </el-form-item>
                      </div>
                      <div v-show="Profile_FormVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-bottom: 30px;margin-top: 40px;color: black">
                            Create your account</h1>
                        </el-form-item>
                        <el-form-item prop="name">
                          <el-input v-model="register_DataForm.name" label="Name" placeholder="Name"></el-input>
                        </el-form-item>
                        <el-form-item prop="email">
                          <el-input v-model="register_DataForm.email" label="Email" placeholder="Email"></el-input>
                        </el-form-item>
                        <el-form-item prop="birthday">
                          <el-date-picker v-model="register_DataForm.birthday" :editable="false"
                                          format="YYYY/MM/DD"
                                          value-format="YYYY-MM-DD"
                                          label="Birthday" placeholder="Birthday"
                                          style="width:500px;height: 50px"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="gender">
                          <el-select v-model="register_DataForm.gender" placeholder="Gender">
                            <el-option value="Male"></el-option>
                            <el-option value="Female"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-form>

                  </el-container>
                  <template #footer>
                    <el-container style="justify-content: center;margin-bottom: 20px">
                      <el-button style="width: 500px;height: 50px;border-radius: 25px;font-size: 20px;font-weight: bold"
                                 type="primary"
                                 @click="register_handleButtonClick(register_ruleFormRef)">
                        {{ buttonText }}
                      </el-button>
                    </el-container>
                  </template>
                </el-dialog>
              </el-row>
              <!--            Forget Password-->
              <el-row>
                <el-button id="login_button" style="font-weight: bolder;color: black;font-size: 17px"
                           @click="Retrieve_dialogVisible=true">
                  Forget Password
                </el-button>
                <el-dialog v-if="Retrieve_dialogVisible" v-model="Retrieve_dialogVisible" :show-close="false"
                           style="height: 710px; border-radius: 20px" width="670"
                >
                  <template #header>
                    <el-container>
                      <el-image src="src/assets/logo.png" style="width: 250px;margin: auto"></el-image>
                      <el-button id="close_button"
                                 style="height: 40px;width: 40px;border-radius: 50%;border: none;transition:all .5s;position: absolute; top: 10px;right: 10px"
                                 @click="Retrieve_dialogVisible = false">
                        <el-icon :size="23" color="black" style="font-weight: 5;">
                          <Close/>
                        </el-icon>
                      </el-button>
                    </el-container>
                  </template>
                  <el-container style="margin-top: 50px; justify-content: center;">
                    <el-form ref="retrieve_ruleFormRef" :model="retrieve_DataForm" :rules="retrieve_rules">
                      <div v-show="Retrieve_dialogVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-bottom: 30px;margin-top: 40px;color: black">
                            Forget Password</h1>
                        </el-form-item>
                        <el-form-item prop="retrieve_account">
                          <el-input v-model="retrieve_DataForm.retrieve_account" label="Account"
                                    placeholder="Account"></el-input>
                        </el-form-item>
                        <el-form-item prop="retrieve_confirm_code" style="display: flex;flex-direction: column">
                          <el-input v-model="retrieve_DataForm.retrieve_confirm_code" label="verification code"
                                    placeholder="verification code is sended to your email" style="width: 78%">
                          </el-input>
                          <el-button style="margin-left: 7px;height: 50px;width: 103px" @click="getCheckCode"
                                     :disabled="checkCodeBtn.disabled" :loading="checkCodeBtn.loading">
                            {{ checkCodeBtn.text }}
                          </el-button>
                        </el-form-item>
                        <el-form-item prop="retrieve_password">
                          <el-input v-model="retrieve_DataForm.retrieve_password" label="New Password"
                                    placeholder="New Password"
                                    show-password type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="retrieve_password_confirm">
                          <el-input v-model="retrieve_DataForm.retrieve_password_confirm" label="Comfirm New Password"
                                    placeholder="Comfirm New Password"
                                    show-password type="password"></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </el-container>
                  <template #footer>
                    <el-container style="justify-content: center;margin-bottom: 20px">
                      <el-button style="width: 500px;height: 50px;border-radius: 25px;font-size: 20px;font-weight: bold"
                                 type="primary"
                                 @click="retrieve_handleButtonClick(retrieve_ruleFormRef)">
                        Complete
                      </el-button>
                    </el-container>
                  </template>
                </el-dialog>
              </el-row>
              <el-row>
                <el-text style="font-size: 12px">By continuing, you agree to <a href="/public"
                                                                  style="color:#1D9BF0;text-decoration: none">Customer Agreement</a> of our <a
                    href="/public" style="color:#1D9BF0;text-decoration: none">Services</a>.
                </el-text>
              </el-row>
            </el-row>
            <el-row style="flex-direction: column;margin-top: 20px;height: 30%">
              <el-row style="margin-bottom: 10px">
                <el-text style="font-size: 20px;font-weight: bolder;color: black;color: white">
                  Already have an account?
                </el-text>
              </el-row>
              <el-row style="flex: 3;height: 100%">
                <el-button id="login_button" style="font-size: 17px;font-weight: bold ;color: #1D9BF0"
                           @click="login_dialogVisible=true">
                  Sign In
                </el-button>
                <el-dialog v-model="login_dialogVisible" :show-close="false" style="height: 510px; border-radius: 20px"
                           width="670">
                  <template #header>
                    <el-container>
                      <el-image src="src/assets/logo.png" style="width: 250px;margin: auto"></el-image>
                      <el-button id="close_button"
                                 style="height: 40px;width: 40px;border-radius: 50%;border: none;transition:all .5s;position: absolute; top: 10px;right: 10px"
                                 @click="login_dialogVisible = false">
                        <el-icon :size="23" color="black" style="font-weight: 5;">
                          <Close/>
                        </el-icon>
                      </el-button>
                    </el-container>
                  </template>
                  <el-container style="justify-content: center;">
                    <el-form ref="login_ruleFormRef" :model="login_Form">
                      <div v-show="Account_FormVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-top: 40px;color: black;margin-bottom: 0">
                            Sign In</h1>
                        </el-form-item>
                        <el-form-item prop="account" style="margin-top: 50px">
                          <el-input v-model="login_Form.account" label="Account" placeholder="Account"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" style="margin-bottom: 0">
                          <el-input v-model="login_Form.password" label="Password" placeholder="Password" show-password
                                    type="password"></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </el-container>
                  <template #footer>
                    <el-container style="justify-content: center;margin-bottom: 20px">
                      <el-button style="width: 500px;height: 50px;border-radius: 25px;font-size: 20px;font-weight: bold"
                                 type="primary"
                                 @click="login_handleButtonClick(login_ruleFormRef)">
                        Sign In
                      </el-button>
                    </el-container>
                  </template>
                </el-dialog>

              </el-row>
            </el-row>
          </el-row>
        </el-main>
      </el-aside>
    </el-container>
    <!--footer-->
    <el-footer style="text-align: center; display: flex; justify-content: center; align-items: flex-end;">
      <el-text>
        <a id="login_footer_link" href="/public">About</a>
      </el-text>
      <el-text>
        <a id="login_footer_link" href="/public">Status</a>
      </el-text>
      <el-text>
        <a id="login_footer_link" href="/public">Version</a>
      </el-text>
      <el-text>
        <a id="login_footer_link" href="/public">Tech</a>
      </el-text>
    </el-footer>
  </el-container>
</template>

<style scoped>

.videoElement {
  z-index: -1;
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: fill;
}

.outer {
  height: 100%;
  width: 100%;
}

#login_logo {
  font-size: 150px;
  font-family: HyFABadBoy, serif;
}

#login_button {
  width: 200px;
  height: 100%;
  opacity: 0.7;
}

#login_footer_link {
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 50px;
  text-decoration: none;
  font-size: 13px;
  color: #536471;
}

.el-text {
  margin-top: 10px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
  padding: 0;
}

#close_button:hover {
  background-color: rgb(231, 231, 232);
}

.el-form-item {
  width: 500px;
}

.el-input, .el-select {
  width: 100%;
  height: 50px;
}

 .el-select__wrapper {
  height: 50px;
}

.el-row {
  margin-top: 10px;
}

.el-form-item {
  margin-bottom: 30px;
}


</style>

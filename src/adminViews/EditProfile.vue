<script setup>
import {ElDatePicker, ElMessage} from "element-plus";
import {reactive, onMounted, ref} from "vue";
import http from "/src/utils/index.js"
import cons from "/src/components/Apis/constant.js";
import {Plus} from "@element-plus/icons-vue";


const imageUrl = ref('')
let id = ref('')
onMounted(() => {
  imageUrl.value = JSON.parse(localStorage.getItem('user_info'))['avatar_url']
  console.log(imageUrl.value)
  let user_info = JSON.parse(localStorage.getItem('user_info'))
  id = user_info['id']
})
const account_info = reactive({
  name: '',
  avatar_url: ' ',
  signature: '',
  gender: '',
  email: '',
  birthday: ''
})
const clear_form = () => {
  account_info.name = ''
  account_info.avatar_url = ''
  account_info.signature = ''
  account_info.gender = ''
  account_info.email = ''
  account_info.birthday = ''
}
const save_cancel = () => {
  ElMessage('You canceled this edit')
  clear_form()
}
const save_wrong = () => {
  ElMessage.error({
    message: 'Save failed! Clearly fill in the correct format',
  })
}
const save_success = () => {
  ElMessage({
    message: 'success!',
    type: 'success',
  })
}
const save_edit = () => {
  http.put(cons.editProfile_apis, {
    'account_info': account_info,
    token: localStorage.getItem('token'),
    'avatar_url': imageUrl.value
  }).then((res) => {
    if (res.data.mes === 'success') {
      save_success()
      localStorage.setItem('user_info', JSON.stringify(res.data.user_info))
    } else {
      save_wrong()
    }
  })
}
const handleAvatarSuccess = (res) => {
  // new imageUrl <"http://localhost:8000/media/user/"+filename>
  imageUrl.value = "http://localhost:8000/media/user/" + res.file;
  account_info.avatar_url = imageUrl.value
}
const beforeAvatarUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 200;
  if (!isLt10M) {
    console.log('The size of the uploaded avatar image must not exceed 200MB!');
  }
  return isLt10M;
}

</script>

<template>
  <el-container class="outside">
    <div class="inside">
      <el-container class="title">Edit Profile</el-container>
      <el-container style="flex: 9;width: 100% ;flex-direction: column">
        <el-container style="flex:3;justify-content: center;">
          <!--          <el-avatar class="avatar" :src=avatar></el-avatar>-->

          <el-upload
              style="border: none"
              :action=cons.uploadAvatar_apis
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
          >
            <el-avatar v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>

        </el-container>
        <el-row style="flex: 1;flex-direction: row">
          <el-text class="input_pre">Name</el-text>
          <input v-model="account_info.name" class="input_type1" placeholder="please input your name"/>
        </el-row>
        <el-row style="flex: 1">
          <el-text class="input_pre">State</el-text>
          <input v-model="account_info.signature" class="input_type1" placeholder="please input your state message"/></el-row>
        <el-row style="flex: 1">
          <el-text class="input_pre">Gender</el-text>
          <input v-model="account_info.gender" class="input_type1" placeholder="please input your gender"/></el-row>
        <el-row style="flex: 1">
          <el-text class="input_pre">Email</el-text>
          <input v-model="account_info.email" class="input_type1" placeholder="please input your email address"/></el-row>
        <el-row style="flex: 1">
          <el-date-picker v-model="account_info.birthday" :editable="false"
                          format="YYYY/MM/DD"
                          value-format="YYYY-MM-DD"
                          label="Birthday" placeholder="Birthday"
                          style="width: 89.5%;height: 40px;border: 1px solid rgb(214, 214, 214);
                          border-radius: 5px;"
          ></el-date-picker>
        </el-row>
      </el-container>
      <el-container class="button_container">
        <el-button :plain="true" @click="save_edit" type="success">Save</el-button>
        <el-button :plain="true" @click="save_cancel">Cancel</el-button>
      </el-container>
    </div>
  </el-container>
</template>

<style scoped>
.outside {
  width: 100%;
  height: 100%;
  justify-content: center; 
  align-items: center;
}

.inside {
  width: 65%;
  height: 90%;
  border: 1px solid rgb(239, 243, 244);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1),  0px 5px 10px rgba(0, 0, 0, 0.1); 
}

.title {
  height: 50px;
  font-size: 35px;
  font-weight: bold;
  width: 100%;
  border-bottom: 2px solid rgb(226, 226, 226);
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1); 
  justify-content: center;
  align-items: center;
  flex: 1;
}

.el-row {
  padding: 10px;
  align-items: center;
  height: 45px;
}

.input_type1 {
  border: none;
  border-top: 2px solid rgb(214, 214, 214);
  border-bottom: 2px solid rgb(214, 214, 214);
  border-right: 2px solid rgb(214, 214, 214);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  font-size: 13px;
  outline: rgb(0, 153, 255);
  width: 80%;
  height: 40px;
}

.input_pre {
  height: 42px;
  width: 50px;
  border-top: 2px solid rgb(214, 214, 214);
  border-bottom: 2px solid rgb(214, 214, 214);
  border-left: 2px solid rgb(214, 214, 214);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: none;
  padding-left: 15px;
  line-height: 42px;
  font-size: 15px;
  color: black;
}

.button_container {
  flex: 1.5;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 20px
}

.el-button {
  width: 120px;
  height: 50px;
  border: 2px solid rgb(214, 214, 214);
}

.avatar {
  width: 120px;
  height: 120px;
  margin-top: 30px;
  background-color: blue;
  border: 2px solid rgb(224, 224, 224);
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1),  0px 5px 10px rgba(0, 0, 0, 0.1); 
}

::v-deep .el-input__prefix-inner {
  margin-left: 16px;
  font-size: 20px;
  color: black;
}

::v-deep .el-input__inner {
  margin-left: 22px;
  color: black;
  font-size: 13px;
  outline: rgb(0, 153, 255);
}
</style>



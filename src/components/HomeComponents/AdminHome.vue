<script setup>
import {ref, reactive} from "vue"
import {MoreFilled} from "@element-plus/icons-vue";
import {v4 as uuidv4} from "uuid";
import http from "../../utils/index.js";
import cons from "../Apis/constant.js";
import {ElDatePicker, ElMessage} from "element-plus";

const uuid = uuidv4()

const dialogFormVisible = ref(false)
const activeIndex = ref(null);
const formLabelWidth = '120px'
const form = reactive({
  id: '',
  account: '',
  password: '',
  idNumber: '',
  name: '',
  email: '',
  gender: '',
  birthday: '',
})
const options = [
  {
    value: 'MALE',
    label: 'MALE',
  },
  {
    value: 'FEMALE',
    label: 'FEMALE',
  },

]
const addNewAdmin = () => {
  dialogFormVisible.value = true
}
const cancelAdd = () => {
  dialogFormVisible.value = false
  form.account = ''
  form.password = ''
  form.idNumber = ''
  form.name = ''
  form.email = ''
  form.gender = ''
  form.birthday = ''
}
const confirmAdd = () => {
  // dialogFormVisible.value = false
  form.id = uuidv4()
  http.post(cons.createAdminAccount_apis, {
    dataForm: form,
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: 'success!',
        type: 'success'
      })
      form.account = ''
      form.password = ''
      form.idNumber = ''
      form.name = ''
      form.email = ''
      form.gender = ''
      form.birthday = ''
      dialogFormVisible.value = false
    }
    if (res.data['code'] === 'already') {
      ElMessage({
        message: 'Duplicate account number!',
        type: 'error'
      })
    }
    if (res.data['code'] === 'error') {
      ElMessage({
        message: 'Formatting errors!',
        type: 'error'
      })
    }
  })

}
///

const menuItems = ref([
  {label: 'User Management', icon: 'User', route: '/users_manage', clickEvent: ''},
  {label: 'Moments Management', icon: 'Film', route: '/moments_manage', clickEvent: ''},
  {label: 'Broad Management', icon: 'Service', route: '/notice_board', clickEvent: ''},
  {label: 'Profile Management', icon: 'Postcard', route: '/edit_profile', clickEvent: ''},
  {label: 'Add Users', icon: 'Plus', route: '#', clickEvent: addNewAdmin},
]);


function handleMouseOver(index) {
  activeIndex.value = index;
}

function handleMouseOut() {
  activeIndex.value = null;
}


</script>

<template>
  <el-container style="height: 100%;width: 100%">
    <!--    menu-->
    <el-aside style="border-right:1px solid #EFF3F4;overflow: hidden;height: 100%;width: 20%;">
      <el-row style="float: right;height: 100%;width: 100%;">
        <el-menu router
                 style="border: none;display: flex;flex-direction: column;width: 100%;height: 100% ;align-items: center;">
          <a href="" style="display: block;margin-top: 50px;">
            <el-image src="src/assets/logo.png" style="width: 70%;margin-left: 40px"></el-image>
          </a>
          <el-menu-item v-for="(item, index) in menuItems" :key="index" :class="{'active': activeIndex === index}"
                        @mouseout="handleMouseOut" @mouseover="handleMouseOver(index)">

            <router-link :to="item.route" @click=item.clickEvent>
              <el-icon :style="{ transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)' }">
                <component :is="item.icon"/>
              </el-icon>
              <span
                  :style="{transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)','font-weight': activeIndex === index ? '600' : '400'}">
      {{ item.label }}
      </span>
            </router-link>
          </el-menu-item>
          <el-dialog v-model="dialogFormVisible" title="Add an administrator user" width="500">
            <el-form :model="form">
              <el-form-item label="Administrator account" :label-width="formLabelWidth">
                <el-input v-model="form.account" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="Administrator password" :label-width="formLabelWidth">
                <el-input v-model="form.password" autocomplete="off" show-password type="password"/>
              </el-form-item>
              <el-form-item label="Administrator id" :label-width="formLabelWidth">
                <el-input v-model="form.idNumber" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="Name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="Email" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="Gender" :label-width="formLabelWidth">
                <el-select v-model="form.gender">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Birthday" :label-width="formLabelWidth">
                <el-date-picker v-model="form.birthday" :editable="false"
                                format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD"
                                label="Birthday" placeholder="Birthday"
                                style="width:500px;"></el-date-picker>
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click=cancelAdd>Cancel</el-button>
                <el-button type="primary" @click=confirmAdd>
                  Commit
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-menu>
      </el-row>
    </el-aside>
    <!--header-->
    <el-container style="flex: 2">
      <el-main style="padding: 0">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<style scoped>

.el-menu-item {
  margin-bottom: 20px;
  width: 90%;
  font-size: 17px;
  border-radius: 10px;
  height: 50px;
}

.el-menu-item .el-icon {
  font-size: 25px;
  width: 30px;
  padding-right: 20px;
  transition: transform 0.2s ease-in-out;
}

.el-menu-item:hover .el-icon {
  width: 35px;
}


.el-menu-item:hover {
  background-color: rgb(243, 243, 243);
}

.el-menu-item:first-of-type {
  margin-top: 50px;
}

.active {
  font-weight: 600;
}

a {
  color: black;
  text-decoration: none;
}

</style>

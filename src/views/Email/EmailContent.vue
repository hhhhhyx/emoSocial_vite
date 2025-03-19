<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRoute} from "vue-router";
import http from "/src/utils/index.js"
import cons from "../../components/Apis/constant.js";
import {Delete} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import router from "../../router/index.js";

const route = useRoute()
const receiveEmail_info = ref({
  email_topic: '',
  email_sendPerson: '',
  email_receivePerson: '',
  email_sendEmail: '',
  email_receiveEmail: '',
  email_sendTime: '',
  email_content: '',
  email_id: '',
});

onMounted(() => {
  receiveEmail_info.value.email_id = route.query.data
  http.get(cons.checkEmailContent_apis, {
    params: {
      email_id: route.query.data
    }
  }).then((res) => {
    let email_info = res.data['email_info']
    receiveEmail_info.value.email_topic = email_info['email_topic']
    receiveEmail_info.value.email_sendPerson = email_info['send_name']
    receiveEmail_info.value.email_receivePerson = email_info['receive_name']
    receiveEmail_info.value.email_sendEmail = email_info['send_email']
    receiveEmail_info.value.email_receiveEmail = email_info['receive_email']
    receiveEmail_info.value.email_sendTime = email_info['send_time']
    receiveEmail_info.value.email_content = email_info['email_content']
  })
})
const selectAll = ref(false);

watch(selectAll, (value) => {
  email_info.value.forEach(item => {
    item.check = value;
  });
});

const confirm_delete = (item) => {


  http.delete(cons.deleteEmails_apis, {
    params: {
      email_id: receiveEmail_info.value.email_id
    }
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '删除成功!',
        type: 'success',
      })
      router.push('/email_default')
    }
  })

}
</script>

<template>
  <el-container style="height: 100%;width: 100%;background-color: rgb(239,245,251);border-radius: 10px">
    <el-header
        style="display: flex;flex:1;padding:10px;border-radius:10px 10px 0 0;background-color:rgb(193,217,243) ">
      <div style="padding-top: 10px">
        <el-text style="font-size: 30px;color: black;font-weight: bolder;">
          Welcome to read your emails
        </el-text>
        
      </div>
    </el-header>
    <el-main style="display: flex;flex: 10;flex-direction: column;padding: 0">
      <el-container style="flex: 1;flex-direction: column;padding-left: 10px;padding-top: 10px">
        <el-row>
          <el-text style="font-weight: bold;font-size: 17px;color: black">{{ receiveEmail_info.email_topic }}
          </el-text>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-text style="font-weight: bold;margin-right: 10px;">Sender :</el-text>
          <el-text style="font-weight: bold;margin-right: 10px;">{{ receiveEmail_info.email_sendPerson }}</el-text>
          <el-text style="font-size: 13px"><{{ receiveEmail_info.email_sendEmail }}></el-text>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-text style="font-weight: bold;margin-right: 10px;">Receive :</el-text>
          <el-text style="font-weight: bold;margin-right: 10px;">{{ receiveEmail_info.email_receivePerson }}</el-text>
          <el-text style="font-size: 13px"><{{ receiveEmail_info.email_receiveEmail }}></el-text>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-text style="font-weight: bold;margin-right: 10px;">Time :</el-text>
          <el-text style="font-size: 13px">{{ receiveEmail_info.email_sendTime }}</el-text>
        </el-row>
      </el-container>
      <el-container style="flex: 7;background-color:white;border: 1px solid black;margin-top: 15px">
        <textarea style="width: 100%;border: none;resize: none;outline: none;padding: 0;margin: 0;line-height: normal"
                  readonly>
          {{receiveEmail_info.email_content}}
        </textarea>
      </el-container>
      <el-row style="flex: 1;align-items: center;margin-left: auto;margin-right: 20px">
        <el-popconfirm
            width="220"
            confirm-button-text="Yes"
            cancel-button-text="No"
            icon-color="#626AEF"
            title="Sure you want to delete the email?"
            @confirm="confirm_delete(item)"
        >
          <template #reference>
            <el-button type="primary" :icon="Delete"></el-button>
          </template>
        </el-popconfirm>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
input {
  width: 80%;
  margin-left: 20px;
  outline: none;
  border: 1px solid black;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}

a:hover {
  background-color: rgb(243, 243, 243);
  transition: background-color 0.3s;
}
</style>
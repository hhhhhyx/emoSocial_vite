<script setup>

import {onMounted, ref} from "vue"
import http from "/src/utils/index.js";
import cons from "/src/components/Apis/constant.js";
import {ElNotification} from "element-plus";

const tableData = ref([
  {
    id: '',
    account: '',
    avatar: '',
    name: '',
    content: '',
    video: '',
    pic: '',
    postTime: '',
    _likes: '',
    momentId: '',
  },
])
onMounted(() => {
  http.get(cons.getAllMoments_apis).then((res) => {
    let data = res.data['data']
    tableData.value = data.map((item) => {
      const obj = {
        avatar: item.avatar,
        content: item.content,
        video: item.video,
        pic: item.pic,
        postTime: item.postTime,
        _likes: item._likes,
        account: item.account,
        id: item.id,
        name: item.name,
        momentId: item.momentId,
      }
      return obj
    })
  })
})
const handleClick = () => {
}
const delete_moment = (id) => {
  http.delete(cons.deleteMoments_apis, {
    params: {
      id: id
    }
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElNotification({
        message: 'Success!',
        type: 'success',
      })
    }
  })
}
</script>

<template>
  <div style="height: 100%;width: 100%;padding: 50px;box-sizing: inherit">
    <el-container
        style="height: 100%;width: 100%;;background-color: white;
        box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)
        ;border-radius: 10px;padding: 30px 30px 10px;flex-direction: column;align-items: center">
      <el-table :data="tableData" border height="100%"
                style="width: 100%;box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2),  0px 5px 10px rgba(0, 0, 0, 0.2);"
                stripe>
        <el-table-column prop="avatar" width="80">
          <template #default="scope">
            <el-image :src="scope.row.avatar" style="width:50px;height:50px"/>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="User id" width="180"/>
        <el-table-column prop="account" label="User account" width="120"/>
        <el-table-column prop="name" label="Name" width="90"/>
        <el-table-column prop="content" label="Moments content" width="200">
          <template #default="scope">
            <div style="display: flex; align-items: center;flex-direction: column">
              <el-text style="flex: 1;">{{ scope.row.content }}</el-text> 
              <div>
                <el-image v-if="scope.row.pic !== ''" :src="scope.row.pic" style="width: 100px; height: 100px"/>
                <video v-if="scope.row.video !== ''" :src="scope.row.video" style="width: 100px; height: 100px"/>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="postTime" label="Post time" width="150"/>
        <el-table-column prop="_likes" label="Total likes"/>
        <el-table-column fixed="right" label="Operate" width="120">
          <template #default="scope">
            <el-popconfirm confirm-button-text="yes"
                           cancel-button-text="no"
                           title="Are you sure to delete??"
                           width="200"
                           @confirm="delete_moment(scope.row.momentId)">
              <template #reference>
                <el-button link type="primary" size="small">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="10" style="margin-top: 10px"/>
    </el-container>
  </div>
</template>

<style scoped>

</style>
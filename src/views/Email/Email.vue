<script setup>
import {onMounted, ref} from 'vue'

const contact_form = ref([])
let friends_info = ref(null)
onMounted(() => {
  const storedUserProfile = localStorage.getItem('friends_info')
  friends_info = JSON.parse(storedUserProfile)
  contact_form.value = friends_info.map((item) => {
    const obj = {
      contact_avatar: item.friend_avatar,
      contact_name: item.friend_name,
      contact_email: item.friend_email,
      contact_id: item.friend_id
    }
    return obj
  })
})
</script>


<template>
  <el-container style="height: 100%;width: 100%;padding: 20px;opacity: 0.9">
    <el-container style="height: 100%;width: 100%;padding:10px;background-color: rgb(137,181,233);border-radius: 10px;
box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2),  0px 5px 10px rgba(0, 0, 0, 0.2); ">
      <el-aside
          style="width:200px;height: 100%;padding-right: 10px;justify-content: center;align-items: center;display: flex;flex-direction: column">
        <el-container
            style="flex: 1;width: 100%;background-color: white;border-radius: 10px;flex-direction: column;padding:10px">
          <el-row style="width: 100%;height:60px;margin-bottom: 3px">
            <router-link :to="{path:'email_edit'}" style="text-decoration: none;width: 100%;padding-right: 10px">
              <a href="#" class="email_options">
                <el-icon>
                  <Edit/>
                </el-icon>
                <el-text style="margin-left: 15px;font-size: 18px;font-weight: bold">
                  Compose
                </el-text>
              </a>
            </router-link>
          </el-row>
          <el-row style="width: 100%;height: 1px;background-color: rgb(218,227,240)"></el-row>
          <el-row style="width: 100%;height: 60px;margin-top: 3px;margin-bottom: 3px">
            <router-link :to="{path:'email_box'}" style="text-decoration: none;width: 100%;padding-right: 10px">
              <a href="#" class="email_options">
                <el-icon>
                  <Files/>
                </el-icon>
                <el-text style="margin-left: 15px;font-size: 18px;font-weight: bold">
                  Check
                </el-text>
              </a>
            </router-link>
          </el-row>
          <el-row style="width: 100%;height: 1px;background-color: rgb(218,227,240);margin-bottom: 3px"></el-row>
        </el-container>
        <el-container
            style="flex: 6;width: 100%;margin-top: 10px;background-color: white;border-radius: 10px;flex-direction: column;padding: 10px">
          <el-row style="width: 100%;height: 60px;margin-bottom: 3px">
            <a href="#" class="email_options">
              <el-icon>
                <User/>
              </el-icon>
              <el-text style="margin-left: 15px;font-size: 18px;font-weight: bold">
                Contacts
              </el-text>
            </a>
          </el-row>
          <el-row style="width: 100%;height: 1px;background-color: rgb(218,227,240)"></el-row>
          <el-scrollbar style="display: flex;height: 300px;width: 100%">
            <template style="flex-direction: column" v-for="(contact_person, index) in contact_form">
              <el-row style="width: 100%;height: 60px;margin-bottom: 3px;margin-top: 3px">
                <router-link :to="{path:'email_edit',query:{data:JSON.stringify(contact_person)}}"
                             class="contact_options">
                  <el-avatar :src="contact_person.contact_avatar"
                             style="height: 35px;width: 35px;margin-left: 5px;"></el-avatar>
                  <el-text style="font-size: 17px;font-weight: bold;margin-left: 10px;">
                    {{ contact_person.contact_name }}
                  </el-text>
                </router-link>
              </el-row>
              <el-row v-if="index < contact_form.length"
                      style="width: 100%;height: 1px;background-color: rgb(218,227,240)"></el-row>
            </template>
          </el-scrollbar>
        </el-container>
      </el-aside>
      <el-container style="height: 100%;width: 500px;border-radius: 10px;background-color: white;padding:10px">
        <router-view :key="$route.fullPath"></router-view>
      </el-container>
    </el-container>
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

.email_options {
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  font-size: 25px;
}

.contact_options {
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 25px;
}

.contact_options:hover {
  background-color: rgb(224, 236, 249);
  transition: background-color 0.3s;
}

.email_options:hover {
  background-color: rgb(224, 236, 249);
  transition: background-color 0.3s;
}

.el-aside::-webkit-scrollbar {
  display: none;
}

::v-deep .el-scrollbar__wrap {
  width: 100%;
  height: 100%;
}
</style>
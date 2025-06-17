<script setup lang="ts">
import { ref } from "vue";
import { UserApi } from "./api/UserApi";
import ProjectCrud from "./views/ProjectCrud.vue";

// mock usera i zapisany do zmiennej
const user = ref(UserApi.getCurrentUser());

const users = ref(UserApi.getAllUsers());
</script>

<template>
  <div>
    <div style="margin-bottom: 16px;">
      Zalogowany uzytkownika: {{ user.firstName }} {{ user.lastName }}
    </div>

    <div>
      <h3>Mock user</h3>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.firstName }} {{ user.lastName }} {{ user.role }}
        </li>
      </ul>
    </div>


  </div>
  <ProjectCrud />
</template>
<script setup lang="ts">
import ProjectCrud from "./views/ProjectCrud.vue";
import LoginView from "./views/LoginView.vue";

// mock usera i zapisany do zmiennej
const user = (JSON.parse(localStorage.getItem('user') || 'null'));

const token = localStorage.getItem('token');


</script>

<template>
  <div>
    <div v-if="user" style="margin-bottom: 16px;">
      Zalogowany uzytkownika: {{ user.firstName }} {{ user.lastName }} {{ user.role }}
    </div>
    <div v-else style="margin-bottom: 16px;">
      nie jestes alogowany zaloguj sie by kontuwoac
    </div>
    
    <LoginView v-if="!token" />
    <ProjectCrud v-else />
  <ProjectCrud />
  </div>
</template>
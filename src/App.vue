<script setup lang="ts">
import { ref } from "vue";
import { UserApi } from "./api/UserApi";
import ProjectCrud from "./views/ProjectCrud.vue";

// mock usera i zapisany do zmiennej
const user = ref(UserApi.getCurrentUser());
</script>

<template>
  <div>
    <div style="margin-bottom: 16px;">
      Zalogowany uzytkownika: {{ user.firstName }} {{ user.lastName }}
    </div>
  </div>
  <ProjectCrud />
</template>
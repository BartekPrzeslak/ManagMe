<template>
  <div>
    <h1>ManagMe</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <b>{{ project.name }}</b> – {{ project.description }}
        <button @click="removeProject(project.id)">Usuń</button>
        <button @click="editProject(project)">Edytuj</button>
      </li>
    </ul>

    <h2>{{ isEditing ? "Edytuj" : "dodaj" }} projekt</h2>
    <form @submit.prevent="saveProject">
      <input v-model="form.name" placeholder="Nazwa" required />
      <input v-model="form.description" placeholder="Opis" required />
      <button type="submit">{{ isEditing ? "Zapisz" : "Dodaj" }}</button>
      <button v-if="isEditing" @click="cancelEdit" type="button">Anuluj</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// TODO poprawic to bo cos sie importy zepsuyl
import { ProjectApi } from "../api/ProjectApi";

import type { Project } from "@/models/Project";

const projects = ref<Project[]>(ProjectApi.getAll());

const form = ref<{ id?: string; name: string; description: string }>({
  name: "",
  description: "",
});
const isEditing = ref(false);

//CRUD

function saveProject() {
  if (isEditing.value && form.value.id) {
    ProjectApi.update({ id: form.value.id, name: form.value.name, description: form.value.description });
  } else {
    ProjectApi.add({ id: Date.now().toString(), name: form.value.name, description: form.value.description });
  }
  projects.value = ProjectApi.getAll();
  resetForm();
}

function removeProject(id: string) {
  ProjectApi.remove(id);
  projects.value = ProjectApi.getAll();
}

function editProject(project: Project) {
  form.value = { ...project };
  isEditing.value = true;
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  form.value = { name: "", description: "" };
  isEditing.value = false;
}
</script>

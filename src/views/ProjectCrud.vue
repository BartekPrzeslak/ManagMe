<template>
  <div>
    <h1>ManagMe</h1>
    <div style="margin-bottom: 16px;">
      <label>
        Wybierz aktywny projekt
        <select v-model="activeProjectId" @change="changeActiveProject">
          <option v-for="project in projects" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </label>
    </div>
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

    <h2>Historyjka aktywnego projektu</h2>
    <label>
      Pokaz:
      <select v-model="filterState">
        <option value="">Wszystkie</option>
        <option value="todo">Do zrobienia</option>
        <option value="doing">W trakcie</option>
        <option value="done">Zrobione</option>
      </select>
    </label>    

    <ul>
      <li v-for="story in filteredStories" :key="story.id">
        <b>{{ story.name }}</b> ({{ story.priority }}) – {{ story.description }} [{{ story.state }}]
        <button @click="editStory(story)">Edytuj</button>
        <button @click="removeStory(story.id)">Usuń</button>
      </li>
    </ul>

    <h3>{{ isStoryEditing ? "Edytuj" : "Dodaj" }} historyjkę</h3>
      <form @submit.prevent="saveStory">
        <input v-model="storyForm.name" placeholder="Nazwa" required />
        <input v-model="storyForm.description" placeholder="Opis" required />
        <select v-model="storyForm.priority">
          <option value="niski">Niski</option>
          <option value="sredni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <select v-model="storyForm.state">
          <option value="todo">Do zrobienia</option>
          <option value="doing">W trakcie</option>
          <option value="done">Zrobione</option>
        </select>
        <button type="submit">{{ isStoryEditing ? "Zapisz" : "Dodaj" }}</button>
        <button v-if="isStoryEditing" @click="cancelStoryEdit" type="button">Anuluj</button>
      </form>
  </div>


</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";

// TODO poprawic to bo cos sie importy zepsuyl
import { ProjectApi } from "../api/ProjectApi";
import { ActiveProjectApi } from "../api/ActiveProjectApi";
import { StoryApi } from "../api/StoryApi";
import { UserApi } from "../api/UserApi";

import type { Story, StoryState, StoryPriority } from "../models/Story";
import type { Project } from "../models/Project";

const projects = ref<Project[]>(ProjectApi.getAll());

const form = ref<{ id?: string; name: string; description: string }>({
  name: "",
  description: "",
});
const isEditing = ref(false);

const activeProjectId = ref<string | null>(ActiveProjectApi.get());

const stories = ref<Story[]>(StoryApi.getAll().filter(s => s.projectId === activeProjectId.value));
const storyForm = ref<{ id?: string; name: string; description: string; priority: StoryPriority; state: StoryState }>({
  name: "",
  description: "",
  priority: "sredni",
  state: "todo",
});
const isStoryEditing = ref(false);

const filterState = ref<string>("");

const filteredStories = computed(() =>
  filterState.value
    ? stories.value.filter(story => story.state === filterState.value)
    : stories.value
);

// zaladuj liste historyjek po zmianie projektu - gpt
watch(activeProjectId, () => {
  stories.value = StoryApi.getAll().filter(s => s.projectId === activeProjectId.value);
});


function changeActiveProject() {
  if (activeProjectId.value) {
    ActiveProjectApi.set(activeProjectId.value);
  }
}

function saveStory() {
  if(!activeProjectId.value) return;
  const user = UserApi.getCurrentUser();
  if(isStoryEditing.value && storyForm.value.id){
    StoryApi.update({
      id: storyForm.value.id,
      name: storyForm.value.name,
      description: storyForm.value.description,
      priority: storyForm.value.priority,
      projectId: activeProjectId.value,
      createdAt: new Date().toISOString(),
      state: storyForm.value.state,
      ownerId: user.id,
    });
  } else {
    StoryApi.add({
      id: Date.now().toString(),
      name: storyForm.value.name,
      description: storyForm.value.description,
      priority: storyForm.value.priority,
      projectId: activeProjectId.value,
      createdAt: new Date().toISOString(),
      state: storyForm.value.state,
      ownerId: user.id,
    });
  }
  stories.value = StoryApi.getAll().filter(s => s.projectId === activeProjectId.value);
  resetStoryForm();

}

function removeStory(id: string) {
  StoryApi.remove(id);
  stories.value = StoryApi.getAll().filter(s => s.projectId === activeProjectId.value);
}

function editStory(story: Story) {
  storyForm.value = { ...story };
  isStoryEditing.value = true;
}

function cancelStoryEdit() {
  resetStoryForm();
}

function resetStoryForm() {
  storyForm.value = { name: "", description: "", priority: "sredni", state: "todo" };
  isStoryEditing.value = false;
}

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

<template>
  <div>
    <h1>ManagMe</h1>
    <div v-if="user" style="margin-bottom: 16px;">
      Zalogowany: <b>{{ user.firstName }} {{ user.lastName }} ({{ user.role }})</b>
    </div>    
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

      <div v-if="stories.length > 0 " style="margin-top: 24px;">
        <label>
          Wybierz historyjke:
          <select v-model="selectedStoryId">
            <option :value="null"> - wybierz - </option>
            <option v-for="story in stories" :value="story.id" :key="story.id">
              {{ story.name }}
            </option>
          </select>
        </label>
      </div>
      <div v-if="selectedStoryId">
        <h4>dodaj zadnaie historyjki</h4>
        <form @submit.prevent="saveTask">
          <input v-model="taskForm.name" placeholder="Nazwa zadania" required />
          <input v-model="taskForm.description" placeholder="opis zadania" required />
          <select v-model="taskForm.priority">
            <option value="niski">Niski</option>
            <option value="sredni">Średni</option>
            <option value="wysoki">Wysoki</option>
          </select>
          <!-- <input v-model="taskForm.estimatedHours" type="number" min="1" placeholder="Szacowany czas godziny" required /> -->
          <button type="submit">Dodaj zadanie</button>
          <button v-if="isTaskEditing" @click="resetTaskForm" type="button">Anuluj</button>
        </form>
      </div>
      <div v-if="selectedStoryId">
        <h4>Zadamoa wubramek historyjki</h4>
        <ul>
          <li v-for="task in tasks" :key="task.id">
            <b>{{ task.name }}</b> ({{ task.priority }}) – {{ task.description }} ({{ task.estimatedHours }}h)
            <span> | Stan: {{ task.state }}</span>
              <span v-if="task.assigneeId">
                | Odpowiedzialny: {{
                  assignees.value.find(u => u.id === task.assigneeId)?.firstName
                }} {{
                  assignees.value.find(u => u.id === task.assigneeId)?.lastName
                }}
              </span>
            <button @click="removeTask(task.id)">Usun</button>
            <button @click="editTask(task)">edituj</button>
            <button v-if="task.state === 'todo' && task.assigneeId" @click="startTask(task)">Rozpocznij</button>
            <button v-if="task.state === 'doing'" @click="finishTask(task)">Zakoncz</button>
          </li>
        </ul>
        <select v-model="taskForm.assigneeId">
          <option value="">Przypisz osobę</option>
            <option v-for="user in assignees" :key="user.id" :value="user.id">
              {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
        </option>
        </select>
      </div>
      <!-- TABLICA KANBAN -->
      <div style="display: flex; gap: 16px; margin-top: 32px;">
        <div style="flex:1">
          <h4>Do zrobienia</h4>
          <ul>
            <li v-for="task in tasks.filter(t => t.state === 'todo')" :key="task.id">
              <b>{{ task.name }}</b> <button @click="editTask(task)">Edytuj</button>
            </li>
          </ul>
        </div>
        <div style="flex:1">
          <h4>w trkacie</h4>
          <ul>
            <li v-for="task in tasks.filter(t => t.state === 'doing')" :key="task.id">
              <b>{{ task.name }}</b> <button @click="editTask(task)">Edytuj</button>
            </li>
          </ul>
        </div>
        <div style="flex:1">
          <h4>zrobione</h4>
          <ul>
            <li v-for="task in tasks.filter(t => t.state === 'done')" :key="task.id">
              <b>{{ task.name }}</b> <button @click="editTask(task)">Edytuj</button>
            </li>
          </ul>
        </div>
      </div>
  </div>


</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";

// TODO poprawic to bo cos sie importy zepsuyl
import { ProjectApi } from "../api/ProjectApi";
import { ActiveProjectApi } from "../api/ActiveProjectApi";
import { StoryApi } from "../api/StoryApi";
import { UserApi } from "../api/UserApi";
import { TaskApi } from "../api/TaskApi";

import type { Story, StoryState, StoryPriority } from "../models/Story";
import type { Project } from "../models/Project";
import type { Task, TaskState, TaskPriority } from "../models/Task";

const user = JSON.parse(localStorage.getItem('user') || 'null');

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
const tasks = ref<Task[]>([]);
const selectedStoryId = ref<string | null>(null);
const taskForm = ref<{
  id?: string;
  name: string;
  description: string;
  priority: TaskPriority;
  estimatedHours: number;
  assigneeId?: string;
  state: TaskState;
}>({
  name: "",
  description: "",
  priority: "sredni",
  estimatedHours: 1,
  assigneeId: "",
  state: "todo",
});
const isTaskEditing = ref(false);

function saveTask() {
  if (!selectedStoryId.value) return;
  if (isTaskEditing.value && taskForm.value.id) {

    if(
      taskForm.value.state === "todo" &&
      taskForm.value.assigneeId &&
      !taskForm.value.startedAt
    ){
      taskForm.value.state = "doing";
      (taskForm.value as any).startedAt = new Date().toISOString();
    }
    TaskApi.update({
      ...taskForm.value,
      storyId: selectedStoryId.value,
    });
    tasks.value = TaskApi.getAll().filter(t => t.storyId === selectedStoryId.value);
    resetTaskForm();
  } else {  
    let newState: "todo" | "doing" = "todo";
    let startedAt: string | undefined = undefined;
  if (taskForm.value.assigneeId) {
    newState = "doing";
    startedAt = new Date().toISOString();
  }
  TaskApi.add({
    id: Date.now().toString(),
    name: taskForm.value.name,
    description: taskForm.value.description,
    priority: taskForm.value.priority,
    storyId: selectedStoryId.value,
    estimatedHours: taskForm.value.estimatedHours,
    state: newState,
    createdAt: new Date().toISOString(),
    startedAt: startedAt
  });
  // Odśwież listę zadań
  tasks.value = TaskApi.getAll().filter(t => t.storyId === selectedStoryId.value);
  // Wyczyść formularz
  resetTaskForm();
  }
} // xd 
function resetTaskForm() {
  taskForm.value = {
    name: "",
    description: "",
    priority: "sredni",
    estimatedHours: 1,
    assigneeId: "",
    state: "todo"
  };
  isTaskEditing.value = false;
}


function removeTask(id: string) {
  TaskApi.remove(id);
  tasks.value = TaskApi.getAll().filter(t => t.storyId === selectedStoryId.value);
}

function startTask(task: Task) {
  TaskApi.update({
    ...task,
    state: "doing",
    startedAt: new Date().toISOString()
  });
  tasks.value = TaskApi.getAll().filter(t => t.storyId === selectedStoryId.value);
}

function finishTask(task: Task) {
  TaskApi.update({
    ...task,
    state: "done",
    finishedAt: new Date().toISOString()
  });
  tasks.value = TaskApi.getAll().filter(t => t.storyId === selectedStoryId.value);
}
function editTask(task: Task) {
  taskForm.value = { ...task };
  isTaskEditing.value = true;
}


// zaladuj zadania gdy zmienia sie wybrana historyjka - gpt
watch(selectedStoryId, () => {
  if (selectedStoryId.value) {
    tasks.value = TaskApi.getAll().filter(t => t.storyId === selectedStoryId.value);
  } else {
    tasks.value = [];
  }
});

// zaladuj liste historyjek po zmianie projektu - gpt
watch(activeProjectId, () => {
  stories.value = StoryApi.getAll().filter(s => s.projectId === activeProjectId.value);
});

const assignees = computed(() =>
  user ? [user] : []
);



function changeActiveProject() {
  if (activeProjectId.value) {
    ActiveProjectApi.set(activeProjectId.value);
  }
}

function saveStory() {
  if(!activeProjectId.value) return;
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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

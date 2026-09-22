<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AuthPanel from './components/AuthPanel.vue'
import TaskCard from './components/TaskCard.vue'
import TaskForm from './components/TaskForm.vue'
import { useTasks } from './composables/useTasks.js'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'

const { tasks, addTask, updateTask, deleteTask, syncForUser } = useTasks()
const currentUser = ref(null)
const editingTask = ref(null)
const isFormOpen = ref(false)
const draggedTaskId = ref(null)
const theme = ref(window.localStorage.getItem('task-manager:theme') ?? 'light')
const isDark = computed(() => theme.value === 'dark')
const columns = [
  { id: 'todo', title: '待办', accent: 'border-slate-300' },
  { id: 'in-progress', title: '进行中', accent: 'border-blue-400' },
  { id: 'done', title: '已完成', accent: 'border-emerald-400' },
]
const tasksByStatus = computed(() => Object.fromEntries(columns.map((column) => [column.id, tasks.value.filter((task) => task.status === column.id)])))
watch(theme, (value) => window.localStorage.setItem('task-manager:theme', value))

function openCreateForm() { editingTask.value = null; isFormOpen.value = true }
function openEditForm(task) { editingTask.value = task; isFormOpen.value = true }
function closeForm() { isFormOpen.value = false; editingTask.value = null }
function saveTask(values) {
  if (editingTask.value) updateTask(editingTask.value.id, values)
  else addTask(values)
  closeForm()
}
function removeTask(task) {
  if (window.confirm(`确定要删除“${task.title}”吗？`)) deleteTask(task.id)
}
function startDrag(task, event) {
  draggedTaskId.value = task.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', task.id)
}
function endDrag() { draggedTaskId.value = null }
function dropTask(status, event) {
  const id = event.dataTransfer.getData('text/plain') || draggedTaskId.value
  const task = tasks.value.find((item) => item.id === id)
  if (task && task.status !== status) updateTask(id, { status })
  endDrag()
}
function toggleTheme() { theme.value = isDark.value ? 'light' : 'dark' }
async function signIn(credentials) { const { data, error } = await supabase.auth.signInWithPassword(credentials); if (error) throw error; currentUser.value = data.user; await syncForUser(data.user) }
async function signUp(credentials) { const { error } = await supabase.auth.signUp(credentials); if (error) throw error }
async function signOut() { await supabase.auth.signOut(); currentUser.value = null }
onMounted(async () => {
  if (!isSupabaseConfigured) return
  const { data: { user } } = await supabase.auth.getUser()
  currentUser.value = user
  if (user) await syncForUser(user)
  supabase.auth.onAuthStateChange((_event, session) => { currentUser.value = session?.user ?? null; if (session?.user) syncForUser(session.user) })
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100" :class="{ dark: isDark }">
    <AppHeader :is-dark="isDark" @toggle-theme="toggleTheme" />
    <section class="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold tracking-wide text-indigo-600">任务工作台</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">把计划变成进展</h1>
          <p class="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">创建、编辑或删除任务；所有更改会自动保存在当前浏览器中。</p>
          <AuthPanel :configured="isSupabaseConfigured" :user="currentUser" @sign-in="signIn" @sign-up="signUp" @sign-out="signOut" />
        </div>
        <button class="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" type="button" @click="openCreateForm">+ 新建任务</button>
      </div>

      <div class="mt-9 grid gap-5 lg:grid-cols-3">
        <section
          v-for="column in columns"
          :key="column.id"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
          :class="draggedTaskId ? 'ring-2 ring-indigo-200 ring-offset-2 dark:ring-indigo-700 dark:ring-offset-slate-950' : ''"
          @dragover.prevent
          @drop="dropTask(column.id, $event)"
        >
          <div class="flex items-center justify-between border-l-4 pl-3" :class="column.accent">
            <h2 class="font-semibold">{{ column.title }}</h2>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ tasksByStatus[column.id].length }}</span>
          </div>
          <div v-if="tasksByStatus[column.id].length" class="mt-4 space-y-3">
            <TaskCard
              v-for="task in tasksByStatus[column.id]"
              :key="task.id"
              :task="task"
              :is-dragging="draggedTaskId === task.id"
              @edit="openEditForm(task)"
              @delete="removeTask(task)"
              @dragstart="startDrag(task, $event)"
              @dragend="endDrag"
            />
          </div>
          <p v-else class="py-12 text-center text-sm text-slate-400 dark:text-slate-500">暂无任务</p>
        </section>
      </div>
    </section>
    <TaskForm v-if="isFormOpen" :task="editingTask" @save="saveTask" @cancel="closeForm" />
  </main>
</template>

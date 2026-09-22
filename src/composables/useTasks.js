import { ref, watch } from 'vue'

const STORAGE_KEY = 'task-manager:tasks'

function loadTasks() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function useTasks() {
  const tasks = ref(loadTasks())
  watch(tasks, (currentTasks) => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks)), { deep: true })

  function addTask(values) {
    const now = new Date().toISOString()
    const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
    tasks.value.unshift({ id, ...values, createdAt: now, updatedAt: now })
  }
  function updateTask(id, values) {
    const index = tasks.value.findIndex((task) => task.id === id)
    if (index !== -1) tasks.value[index] = { ...tasks.value[index], ...values, updatedAt: new Date().toISOString() }
  }
  function deleteTask(id) { tasks.value = tasks.value.filter((task) => task.id !== id) }

  return { tasks, addTask, updateTask, deleteTask }
}

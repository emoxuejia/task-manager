import { ref, watch } from 'vue'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const STORAGE_KEY = 'task-manager:tasks'
const toAppTask = (task) => ({ id: task.id, title: task.title, description: task.description, status: task.status, priority: task.priority, createdAt: task.created_at, updatedAt: task.updated_at })
const toDbTask = (task, userId) => ({ id: task.id, user_id: userId, title: task.title, description: task.description, status: task.status, priority: task.priority, created_at: task.createdAt, updated_at: task.updatedAt })
function loadLocal() { try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(data) ? data : [] } catch { return [] } }

export function useTasks() {
  const tasks = ref(loadLocal())
  const user = ref(null)
  watch(tasks, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

  async function syncForUser(nextUser) {
    user.value = nextUser
    if (!isSupabaseConfigured || !nextUser) return
    const { data, error } = await supabase.from('tasks').select('*').order('updated_at', { ascending: false })
    if (error) throw error
    tasks.value = data.map(toAppTask)
  }
  async function persist(task) {
    if (!isSupabaseConfigured || !user.value) return
    const { error } = await supabase.from('tasks').upsert(toDbTask(task, user.value.id))
    if (error) throw error
  }
  async function addTask(values) {
    const now = new Date().toISOString(); const id = crypto.randomUUID()
    const task = { id, ...values, createdAt: now, updatedAt: now }
    tasks.value.unshift(task); await persist(task)
  }
  async function updateTask(id, values) {
    const index = tasks.value.findIndex((task) => task.id === id); if (index === -1) return
    const task = { ...tasks.value[index], ...values, updatedAt: new Date().toISOString() }
    tasks.value[index] = task; await persist(task)
  }
  async function deleteTask(id) {
    tasks.value = tasks.value.filter((task) => task.id !== id)
    if (isSupabaseConfigured && user.value) { const { error } = await supabase.from('tasks').delete().eq('id', id); if (error) throw error }
  }
  return { tasks, addTask, updateTask, deleteTask, syncForUser }
}

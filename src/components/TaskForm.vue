<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({ task: { type: Object, default: null } })
const emit = defineEmits(['save', 'cancel'])
const error = ref('')
const form = reactive({ title: props.task?.title ?? '', description: props.task?.description ?? '', status: props.task?.status ?? 'todo', priority: props.task?.priority ?? 'medium' })

function submit() {
  const title = form.title.trim()
  if (!title) { error.value = '请填写任务标题。'; return }
  emit('save', { ...form, title, description: form.description.trim() })
}
</script>

<template>
  <div class="fixed inset-0 z-10 grid place-items-center bg-slate-950/40 p-5" role="presentation" @click.self="$emit('cancel')">
    <form class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" @submit.prevent="submit">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-bold">{{ task ? '编辑任务' : '新建任务' }}</h2>
        <button class="text-2xl leading-none text-slate-400 hover:text-slate-700" type="button" aria-label="关闭" @click="$emit('cancel')">×</button>
      </div>
      <label class="mt-6 block text-sm font-semibold text-slate-700" for="task-title">任务标题 <span class="text-red-600">*</span></label>
      <input id="task-title" v-model="form.title" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="text" maxlength="100" autocomplete="off" @input="error = ''">
      <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
      <label class="mt-5 block text-sm font-semibold text-slate-700" for="task-description">描述 <span class="font-normal text-slate-400">（选填）</span></label>
      <textarea id="task-description" v-model="form.description" class="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" maxlength="500" />
      <div class="mt-5 grid gap-5 sm:grid-cols-2">
        <label class="block text-sm font-semibold text-slate-700" for="task-status">状态
          <select id="task-status" v-model="form.status" class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"><option value="todo">待办</option><option value="in-progress">进行中</option><option value="done">完成</option></select>
        </label>
        <label class="block text-sm font-semibold text-slate-700" for="task-priority">优先级
          <select id="task-priority" v-model="form.priority" class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select>
        </label>
      </div>
      <div class="mt-7 flex justify-end gap-3">
        <button class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100" type="button" @click="$emit('cancel')">取消</button>
        <button class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700" type="submit">保存任务</button>
      </div>
    </form>
  </div>
</template>

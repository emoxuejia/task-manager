<script setup>
import { reactive, ref } from 'vue'

defineProps({ user: { type: Object, default: null }, configured: Boolean })
const emit = defineEmits(['sign-in', 'sign-up', 'sign-out'])
const form = reactive({ email: '', password: '' })
const message = ref('')

async function submit(mode) {
  message.value = ''
  try {
    await emit(mode, { ...form })
    if (mode === 'sign-up') message.value = '注册成功，请前往邮箱完成验证后登录。'
  } catch (error) { message.value = error.message }
}
</script>

<template>
  <div v-if="configured" class="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-100">
    <div v-if="user" class="flex flex-wrap items-center justify-between gap-3"><span>已登录：{{ user.email }}，任务将自动同步。</span><button class="font-semibold underline" type="button" @click="$emit('sign-out')">退出</button></div>
    <form v-else class="flex flex-wrap gap-2" @submit.prevent="submit('sign-in')">
      <input v-model="form.email" class="rounded-lg border border-indigo-200 bg-white px-3 py-2 dark:border-indigo-800 dark:bg-slate-900" placeholder="邮箱" type="email" required>
      <input v-model="form.password" class="rounded-lg border border-indigo-200 bg-white px-3 py-2 dark:border-indigo-800 dark:bg-slate-900" placeholder="密码（至少 6 位）" type="password" minlength="6" required>
      <button class="rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white" type="submit">登录</button>
      <button class="rounded-lg border border-indigo-300 px-3 py-2 font-semibold" type="button" @click="submit('sign-up')">注册</button>
    </form>
    <p v-if="message" class="mt-2">{{ message }}</p>
  </div>
</template>

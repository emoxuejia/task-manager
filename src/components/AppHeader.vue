<script setup>
defineProps({ isDark: { type: Boolean, default: false } })
defineEmits(['toggle-theme'])
</script>

<template>
  <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
      <a class="flex items-center gap-3 font-bold tracking-tight" href="#" aria-label="任务管理器首页">
        <span class="grid size-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">✓</span>
        任务管理器
      </a>
      <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" type="button" :aria-label="isDark ? '切换至浅色模式' : '切换至深色模式'" @click="$emit('toggle-theme')">
        {{ isDark ? '☀️ 浅色' : '🌙 深色' }}
      </button>
    </div>
  </header>
</template>

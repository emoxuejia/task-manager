<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />

    <section class="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div class="max-w-2xl">
        <p class="text-sm font-semibold tracking-wide text-indigo-600">任务工作台</p>
        <h1 class="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">专注完成每一件重要的事</h1>
        <p class="mt-4 text-base leading-7 text-slate-600">任务管理功能将在下一轮接入。当前已完成应用骨架、页面基础与样式系统。</p>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-3">
        <article v-for="column in ['待办', '进行中', '已完成']" :key="column" class="min-h-52 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">{{ column }}</h2>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">0</span>
          </div>
          <p class="mt-10 text-center text-sm text-slate-400">暂无任务</p>
        </article>
      </div>
    </section>
  </main>
</template>

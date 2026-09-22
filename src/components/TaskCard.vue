<script setup>
defineProps({
  task: { type: Object, required: true },
  isDragging: { type: Boolean, default: false },
})
defineEmits(['edit', 'delete', 'dragstart', 'dragend'])

const priorityStyles = {
  high: 'bg-red-50 text-red-700 ring-red-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}
const priorityLabels = { high: '高', medium: '中', low: '低' }
</script>

<template>
  <article
    class="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition active:cursor-grabbing"
    :class="isDragging ? 'opacity-40' : ''"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend')"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="font-semibold leading-6 text-slate-800">{{ task.title }}</h3>
      <span class="shrink-0 rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset" :class="priorityStyles[task.priority]">{{ priorityLabels[task.priority] }}优先级</span>
    </div>
    <p v-if="task.description" class="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{{ task.description }}</p>
    <div class="mt-4 flex justify-end gap-3 text-sm font-medium">
      <button class="text-slate-500 hover:text-indigo-600" type="button" @click="$emit('edit')">编辑</button>
      <button class="text-slate-500 hover:text-red-600" type="button" @click="$emit('delete')">删除</button>
    </div>
  </article>
</template>

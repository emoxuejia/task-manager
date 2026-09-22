# 任务管理器

基于 Vue 3、Vite 和 Tailwind CSS 实现的浏览器本地任务管理应用，适合作为前端课程实践项目。

## 功能

- 新增、编辑、删除任务；任务标题必填，描述选填。
- 三种任务状态：待办、进行中、完成。
- 三档优先级：高（红）、中（黄）、低（绿）。
- 三列看板视图；将卡片拖放到目标列即可更新状态。
- 支持浅色与深色主题切换，并会记住用户选择。
- 使用 `localStorage` 保存任务和主题，刷新页面后数据不会丢失。

## 技术栈

- Vue 3
- Vite
- Tailwind CSS 4
- Browser localStorage

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址，通常为 `http://localhost:5173`。

## 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```text
src/
├── components/
│   ├── AppHeader.vue    # 应用标题栏与主题开关
│   ├── TaskCard.vue     # 可拖拽任务卡片
│   └── TaskForm.vue     # 新建与编辑任务表单
├── composables/
│   └── useTasks.js      # 任务状态与 localStorage 持久化
├── types/
│   └── task.js          # 任务数据结构说明
├── App.vue              # 看板和交互编排
├── main.js              # Vue 应用入口
└── style.css            # Tailwind 与全局样式
```

## 任务数据结构

每个任务包含：`id`、`title`、`description`、`status`、`priority`、`createdAt` 和 `updatedAt`。

## Git 提交记录

- `chore: initialize task manager project`
- `feat: add task CRUD and local persistence`
- `feat: add draggable kanban board`
- `feat: add persistent dark mode and polish UI`

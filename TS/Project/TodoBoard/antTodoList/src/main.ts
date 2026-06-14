import './style.css'

type TaskStatus = 'todo' | 'done'
type TaskFilter = 'all' | TaskStatus

interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: number
}

const STORAGE_KEY = 'ts-task-board.tasks'

let tasks: Task[] = loadTasks()
let currentFilter: TaskFilter = 'all'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="board-shell">
    <section class="board-header">
      <div>
        <p class="eyebrow">TypeScript Practice</p>
        <h1>Todo Board</h1>
      </div>
      <div class="stats" aria-live="polite">
        <span><strong id="total-count">0</strong> 全部</span>
        <span><strong id="todo-count">0</strong> 进行中</span>
        <span><strong id="done-count">0</strong> 已完成</span>
      </div>
    </section>

    <form class="task-form" id="task-form">
      <label class="sr-only" for="task-title">任务标题</label>
      <input
        id="task-title"
        type="text"
        autocomplete="off"
        placeholder="输入一个新任务..."
      />
      <button type="submit">添加任务</button>
    </form>

    <section class="toolbar" aria-label="任务筛选">
      <button class="filter-button active" type="button" data-filter="all">全部</button>
      <button class="filter-button" type="button" data-filter="todo">进行中</button>
      <button class="filter-button" type="button" data-filter="done">已完成</button>
    </section>

    <section class="task-panel">
      <ul class="task-list" id="task-list"></ul>
      <p class="empty-state" id="empty-state">还没有任务，先添加一个吧。</p>
    </section>
  </main>
`

const taskForm = queryElement<HTMLFormElement>('#task-form')
const taskInput = queryElement<HTMLInputElement>('#task-title')
const taskList = queryElement<HTMLUListElement>('#task-list')
const emptyState = queryElement<HTMLParagraphElement>('#empty-state')
const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-button')
const totalCount = queryElement<HTMLElement>('#total-count')
const todoCount = queryElement<HTMLElement>('#todo-count')
const doneCount = queryElement<HTMLElement>('#done-count')

taskForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const title = taskInput.value.trim()

  if (!title) {
    taskInput.focus()
    return
  }

  tasks = [createTask(title), ...tasks]
  taskInput.value = ''
  persistAndRender()
})

taskList.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof HTMLElement)) {
    return
  }

  const actionButton = target.closest<HTMLButtonElement>('[data-action]')

  if (!actionButton) {
    return
  }

  const taskItem = actionButton.closest<HTMLLIElement>('[data-task-id]')
  const taskId = taskItem?.dataset.taskId

  if (!taskId) {
    return
  }

  const action = actionButton.dataset.action

  if (action === 'toggle') {
    toggleTask(taskId)
  }

  if (action === 'delete') {
    deleteTask(taskId)
  }
})

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter

    if (!isTaskFilter(filter)) {
      return
    }

    currentFilter = filter
    render()
  })
})

render()

function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title,
    status: 'todo',
    createdAt: Date.now(),
  }
}

function toggleTask(id: string): void {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
      : task,
  )
  persistAndRender() //persistAndRender函数负责将当前的任务列表保存到本地存储，并重新渲染界面，以反映最新的任务状态和统计信息。
}

function deleteTask(id: string): void {
  tasks = tasks.filter((task) => task.id !== id)
  persistAndRender()
}

function filterTasks(filter: TaskFilter): Task[] {
  if (filter === 'all') {
    return tasks
  }

  return tasks.filter((task) => task.status === filter)
}

function persistAndRender(): void {
  saveTasks(tasks)
  render() //persistAndRender函数负责将当前的任务列表保存到本地存储，并重新渲染界面，以反映最新的任务状态和统计信息。
}

function render(): void {
  const visibleTasks = filterTasks(currentFilter)

  taskList.innerHTML = visibleTasks.map(renderTask).join('')
  emptyState.hidden = visibleTasks.length > 0

  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === currentFilter)
  })

  updateStats()
}

function renderTask(task: Task): string {
  const isDone = task.status === 'done'
  const formattedDate = new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(task.createdAt)

  return `
    <li class="task-item ${isDone ? 'completed' : ''}" data-task-id="${task.id}">
      <button
        class="check-button"
        type="button"
        data-action="toggle"
        aria-label="${isDone ? '标记为进行中' : '标记为已完成'}"
      >
        ${isDone ? '✓' : ''}
      </button>
      <div class="task-content">
        <p>${escapeHtml(task.title)}</p>
        <time datetime="${new Date(task.createdAt).toISOString()}">${formattedDate}</time>
      </div>
      <button class="delete-button" type="button" data-action="delete">删除</button>
    </li>
  `
}

function updateStats(): void {
  const doneTasks = tasks.filter((task) => task.status === 'done')
  const todoTasks = tasks.filter((task) => task.status === 'todo')

  totalCount.textContent = String(tasks.length)
  todoCount.textContent = String(todoTasks.length)
  doneCount.textContent = String(doneTasks.length)
}

function loadTasks(): Task[] {
  const rawTasks = localStorage.getItem(STORAGE_KEY)

  if (!rawTasks) {
    return []
  }

  try {
    const parsedTasks: unknown = JSON.parse(rawTasks)

    if (!Array.isArray(parsedTasks)) {
      return []
    }

    return parsedTasks.filter(isTask)
  } catch {
    return []
  }
}

function saveTasks(nextTasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks))
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') {
    return false
  }

  const task = value as Record<string, unknown>

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    isTaskStatus(task.status) &&
    typeof task.createdAt === 'number'
  )
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'todo' || value === 'done'
}

function isTaskFilter(value: unknown): value is TaskFilter {
  return value === 'all' || isTaskStatus(value)
}

function queryElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Missing element: ${selector}`)
  }

  return element
}

function escapeHtml(value: string): string {
  const replacements: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return value.replace(/[&<>"']/g, (character) => replacements[character])
}

import { useEffect, useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd'

type TaskStatus = 'todo' | 'done'
type TaskFilter = 'all' | TaskStatus
type TaskPriority = 'low' | 'medium' | 'high'
type TaskIdHandler = (id: string) => void

interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  createdAt: number
  updatedAt?: number
}

type TaskFormValues = Pick<Task, 'title' | 'priority' | 'tags'>
type TaskUpdate = Partial<Pick<Task, 'title' | 'priority' | 'tags' | 'status'>>

const STORAGE_KEY = 'ts-task-board.tasks'
const API_DELAY_MS = 450

const filterOptions: Array<{ label: string; value: TaskFilter }> = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'todo' },
  { label: '已完成', value: 'done' },
]

const priorityOptions: Array<{ label: string; value: TaskPriority }> = [
  { label: '低优先级', value: 'low' },
  { label: '中优先级', value: 'medium' },
  { label: '高优先级', value: 'high' },
]

const priorityMeta: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: '低', color: 'default' },
  medium: { label: '中', color: 'warning' },
  high: { label: '高', color: 'error' },
}

function App() {
  const [createForm] = Form.useForm<TaskFormValues>()
  const [editForm] = Form.useForm<TaskFormValues>()
  const [messageApi, contextHolder] = message.useMessage()
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const visibleTasks = useMemo(() => filterTasks(tasks, currentFilter), [tasks, currentFilter])
  const doneCount = useMemo(
    () => tasks.filter((task) => task.status === 'done').length,
    [tasks],
  )
  const todoCount = tasks.length - doneCount

  useEffect(() => {
    async function loadInitialTasks(): Promise<void> {
      setIsLoading(true)

      try {
        const remoteTasks = await fetchTasks()
        setTasks(remoteTasks)
      } finally {
        setIsLoading(false)
      }
    }

    void loadInitialTasks()
  }, [])

  useEffect(() => {
    if (isLoading) {
      return
    }

    void saveTasksToApi(tasks, setIsSaving)
  }, [tasks, isLoading])

  function addTask(values: TaskFormValues): void {
    const title = values.title.trim()

    if (!title) {
      return
    }

    setTasks((currentTasks) => [createTask(values), ...currentTasks])
    createForm.resetFields()
    messageApi.success('任务已添加')
  }

  function updateTask(id: string, patch: TaskUpdate): void {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, ...patch, updatedAt: Date.now() } : task,
      ),
    )
  }

  const toggleTask: TaskIdHandler = (id) => {
    const task = tasks.find((item) => item.id === id)

    if (!task) {
      return
    }

    updateTask(id, { status: task.status === 'done' ? 'todo' : 'done' })
    messageApi.info('任务状态已更新')
  }

  const deleteTask: TaskIdHandler = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    messageApi.success('任务已删除')
  }

  function openEditModal(task: Task): void {
    setEditingTask(task)
    editForm.setFieldsValue({
      title: task.title,
      priority: task.priority,
      tags: task.tags,
    })
  }

  function closeEditModal(): void {
    setEditingTask(null)
    editForm.resetFields()
  }

  function saveEditedTask(values: TaskFormValues): void {
    if (!editingTask) {
      return
    }

    updateTask(editingTask.id, {
      title: values.title.trim(),
      priority: values.priority,
      tags: values.tags ?? [],
    })
    closeEditModal()
    messageApi.success('任务已更新')
  }

  return (
    <main className="board-shell">
      {contextHolder}
      <section className="board-header">
        <div>
          <Typography.Text className="eyebrow">React + TypeScript + Ant Design</Typography.Text>
          <Typography.Title level={1}>Todo Board</Typography.Title>
          <Typography.Text type="secondary">
            {isSaving ? '正在模拟保存...' : '任务会保存到 localStorage，并模拟 API 延迟'}
          </Typography.Text>
        </div>

        <Row className="stats" gutter={[12, 12]}>
          <Col xs={8}>
            <Card>
              <Statistic title="总任务数" value={tasks.length} />
            </Card>
          </Col>
          <Col xs={8}>
            <Card>
              <Statistic title="未完成数" value={todoCount} />
            </Card>
          </Col>
          <Col xs={8}>
            <Card>
              <Statistic title="已完成数" value={doneCount} />
            </Card>
          </Col>
        </Row>
      </section>

      <Card className="task-card">
        <Form<TaskFormValues>
          form={createForm}
          className="task-form"
          initialValues={{ priority: 'medium', tags: [] }}
          onFinish={addTask}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={10}>
              <Form.Item
                name="title"
                rules={[
                  { required: true, whitespace: true, message: '请输入任务标题' },
                  { max: 80, message: '任务标题不能超过 80 个字符' },
                ]}
              >
                <Input allowClear placeholder="输入一个新任务..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={5}>
              <Form.Item
                name="priority"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select options={priorityOptions} placeholder="优先级" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="tags">
                <Select mode="tags" placeholder="输入标签后回车" tokenSeparators={[',']} />
              </Form.Item>
            </Col>
            <Col xs={24} md={3}>
              <Button block type="primary" htmlType="submit" icon={<PlusOutlined />}>
                添加
              </Button>
            </Col>
          </Row>
        </Form>

        <Segmented<TaskFilter>
          block
          className="task-filter"
          options={filterOptions}
          value={currentFilter}
          onChange={setCurrentFilter}
        />

        <Spin spinning={isLoading} tip="正在模拟请求任务...">
          <List
            className="task-list"
            dataSource={visibleTasks}
            locale={{
              emptyText: <Empty description="还没有任务，先添加一个吧。" />,
            }}
            renderItem={(task) => (
              <TaskListItem
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={openEditModal}
              />
            )}
          />
        </Spin>
      </Card>

      <Modal
        title="编辑任务"
        open={Boolean(editingTask)}
        okText="保存"
        cancelText="取消"
        onCancel={closeEditModal}
        onOk={() => editForm.submit()}
        destroyOnHidden
      >
        <Form<TaskFormValues> form={editForm} layout="vertical" onFinish={saveEditedTask}>
          <Form.Item
            label="任务标题"
            name="title"
            rules={[
              { required: true, whitespace: true, message: '请输入任务标题' },
              { max: 80, message: '任务标题不能超过 80 个字符' },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item label="优先级" name="priority" rules={[{ required: true }]}>
            <Select options={priorityOptions} />
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Select mode="tags" placeholder="输入标签后回车" tokenSeparators={[',']} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  )
}

interface TaskListItemProps {
  task: Task
  onToggle: TaskIdHandler
  onDelete: TaskIdHandler
  onEdit: (task: Task) => void
}

function TaskListItem({ task, onToggle, onDelete, onEdit }: TaskListItemProps) {
  const isDone = task.status === 'done'
  const priority = priorityMeta[task.priority]

  return (
    <List.Item
      actions={[
        <Tag key="priority" color={priority.color}>
          {priority.label}优先级
        </Tag>,
        <Tag key="status" color={isDone ? 'success' : 'processing'}>
          {isDone ? '已完成' : '进行中'}
        </Tag>,
        <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => onEdit(task)}>
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="删除任务"
          description="确认删除这个任务吗？"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(task.id)}
        >
          <Button danger type="text" icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <Checkbox checked={isDone} onChange={() => onToggle(task.id)}>
            <span className="sr-only">{isDone ? '设为进行中' : '标记完成'}</span>
          </Checkbox>
        }
        title={
          <span className={isDone ? 'task-title task-title-done' : 'task-title'}>
            {task.title}
          </span>
        }
        description={
          <Space className="task-meta" size={[8, 8]} wrap>
            <span>{formatDate(task.createdAt)}</span>
            {task.updatedAt ? <span>更新于 {formatDate(task.updatedAt)}</span> : null}
            {task.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        }
      />
    </List.Item>
  )
}

function createTask(values: TaskFormValues): Task {
  return {
    id: crypto.randomUUID(),
    title: values.title.trim(),
    status: 'todo',
    priority: values.priority,
    tags: values.tags ?? [],
    createdAt: Date.now(),
  }
}

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === 'all') {
    return tasks
  }

  return tasks.filter((task) => task.status === filter)
}

async function fetchTasks(): Promise<Task[]> {
  await delay(API_DELAY_MS)
  return loadTasks()
}

async function saveTasksToApi(
  nextTasks: Task[],
  setIsSaving: (isSaving: boolean) => void,
): Promise<void> {
  setIsSaving(true)
  await delay(API_DELAY_MS)
  saveTasks(nextTasks)
  setIsSaving(false)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
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

    return parsedTasks.filter(isTask).map(normalizeTask)
  } catch {
    return []
  }
}

function saveTasks(nextTasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks))
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    priority: task.priority ?? 'medium',
    tags: task.tags ?? [],
  }
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
    typeof task.createdAt === 'number' &&
    (task.updatedAt === undefined || typeof task.updatedAt === 'number') &&
    (task.priority === undefined || isTaskPriority(task.priority)) &&
    (task.tags === undefined ||
      (Array.isArray(task.tags) && task.tags.every((tag) => typeof tag === 'string')))
  )
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'todo' || value === 'done'
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return value === 'low' || value === 'medium' || value === 'high'
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp)
}

export default App

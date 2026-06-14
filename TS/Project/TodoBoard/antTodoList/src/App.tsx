import { useEffect, useMemo, useState } from 'react'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Form,
  Input,
  List,
  Popconfirm,
  Row,
  Col,
  Segmented,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd'

type TaskStatus = 'todo' | 'done'
type TaskFilter = 'all' | TaskStatus

interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: number
}

interface TaskFormValues {
  title: string
}

const STORAGE_KEY = 'ts-task-board.tasks'

const filterOptions: Array<{ label: string; value: TaskFilter }> = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'todo' },
  { label: '已完成', value: 'done' },
]

function App() {
  const [form] = Form.useForm<TaskFormValues>()
  const [messageApi, contextHolder] = message.useMessage()
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>('all')

  const visibleTasks = useMemo(() => filterTasks(tasks, currentFilter), [tasks, currentFilter])
  const todoCount = useMemo(
    () => tasks.filter((task) => task.status === 'todo').length,
    [tasks],
  )
  const doneCount = useMemo(
    () => tasks.filter((task) => task.status === 'done').length,
    [tasks],
  )

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function addTask(values: TaskFormValues): void {
    const title = values.title.trim()

    if (!title) {
      return
    }

    setTasks((currentTasks) => [createTask(title), ...currentTasks])
    form.resetFields()
    messageApi.success('任务已添加')
  }

  function toggleTask(id: string): void {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task,
      ),
    )
    messageApi.info('任务状态已更新')
  }

  function deleteTask(id: string): void {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    messageApi.success('任务已删除')
  }

  return (
    <main className="board-shell">
      {contextHolder}
      <section className="board-header">
        <div>
          <Typography.Text className="eyebrow">React + TypeScript + Ant Design</Typography.Text>
          <Typography.Title level={1}>Todo Board</Typography.Title>
        </div>

        <Row className="stats" gutter={[12, 12]}>
          <Col xs={8}>
            <Card>
              <Statistic title="全部" value={tasks.length} />
            </Card>
          </Col>
          <Col xs={8}>
            <Card>
              <Statistic title="进行中" value={todoCount} />
            </Card>
          </Col>
          <Col xs={8}>
            <Card>
              <Statistic title="已完成" value={doneCount} />
            </Card>
          </Col>
        </Row>
      </section>

      <Card className="task-card">
        <Form<TaskFormValues> form={form} className="task-form" onFinish={addTask}>
          <Space.Compact className="task-input-group">
            <Form.Item
              name="title"
              noStyle
              rules={[
                { required: true, whitespace: true, message: '请输入任务标题' },
                { max: 80, message: '任务标题不能超过 80 个字符' },
              ]}
            >
              <Input allowClear placeholder="输入一个新任务..." />
            </Form.Item>
            <Button type="primary" htmlType="submit"  icon={<PlusOutlined />}>
              添加任务
            </Button>
          </Space.Compact>
        </Form>

        <Segmented<TaskFilter>
          block
          className="task-filter"
          options={filterOptions}
          value={currentFilter}
          onChange={setCurrentFilter}
        />

        <List
          className="task-list"
          dataSource={visibleTasks}
          locale={{
            emptyText: <Empty description="还没有任务，先添加一个吧。" />,
          }}
          renderItem={(task) => {
            const isDone = task.status === 'done'

            return (
              <List.Item
                actions={[
                  <Tag key="status" color={isDone ? 'success' : 'processing'}>
                    {isDone ? '已完成' : '进行中'}
                  </Tag>,
                  <Popconfirm
                    key="delete"
                    title="删除任务"
                    description="确认删除这个任务吗？"
                    okText="删除"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => deleteTask(task.id)}
                  >
                    <Button danger type="text" icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox checked={isDone} onChange={() => toggleTask(task.id)}>
                      <span className="sr-only">{isDone ? '设为进行中' : '标记完成'}</span>
                    </Checkbox>
                  }
                  title={
                    <span className={isDone ? 'task-title task-title-done' : 'task-title'}>
                      {task.title}
                    </span>
                  }
                  description={new Intl.DateTimeFormat('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(task.createdAt)}
                />
              </List.Item>
            )
          }}
        />
      </Card>
    </main>
  )
}

function createTask(title: string): Task {
  return {
    id: crypto.randomUUID(),
    title,
    status: 'todo',
    createdAt: Date.now(),
  }
}

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === 'all') {
    return tasks
  }

  return tasks.filter((task) => task.status === filter)
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

export default App

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  Clock,
  Download,
  FileText,
  Home,
  Plus,
  Search,
  Users,
  Video,
  X,
  Copy,
} from 'lucide-react'

type Page =
  | 'dashboard'
  | 'meetings'
  | 'meetingDetail'
  | 'tasks'
  | 'minutes'
  | 'participants'

type Task = {
  id: number
  title: string
  owner: string
  deadline: string
  priority: '高' | '中' | '低'
  status: '未开始' | '进行中' | '已完成'
  source: string
}

type Meeting = {
  id: number
  title: string
  time: string
  participants: string
  type: string
  status: '未开始' | '进行中' | '已结束'
  background: string
  agenda: string
}

type MinuteResult = {
  summary: string
  points: string[]
  decisions: string[]
  tasks: Task[]
  risks: string[]
  nextSteps: string[]
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: '完成首页原型设计',
    owner: '张三',
    deadline: '明天',
    priority: '高',
    status: '进行中',
    source: '视频会议助手需求评审',
  },
  {
    id: 2,
    title: '整理会议纪要模板',
    owner: '李四',
    deadline: '本周五',
    priority: '中',
    status: '未开始',
    source: '视频会议助手需求评审',
  },
  {
    id: 3,
    title: '确认 AI 接口接入方案',
    owner: '王五',
    deadline: '待确认',
    priority: '高',
    status: '未开始',
    source: '视频会议助手需求评审',
  },
]

const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: '视频会议助手需求评审',
    time: '10:00 - 11:00',
    participants: '产品组、研发组、设计组',
    type: '需求评审',
    status: '进行中',
    background: '讨论轻量级视频会议助手的产品范围、页面结构与开发优先级。',
    agenda: '明确 MVP 功能范围、确认页面结构、确定开发优先级。',
  },
  {
    id: 2,
    title: '前端开发进度同步',
    time: '14:30 - 15:00',
    participants: '前端组',
    type: '进度同步',
    status: '未开始',
    background: '同步首页、会议详情页和待办事项页的开发进度。',
    agenda: '确认已完成页面、梳理遗留问题、安排后续开发任务。',
  },
]

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
  const savedMeetings = localStorage.getItem('meetflow-meetings')
  return savedMeetings ? JSON.parse(savedMeetings) : initialMeetings
})
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting>(initialMeetings[0])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '',
    participants: '',
    type: '',
    background: '',
    agenda: '',
  })

  const [meetingNote, setMeetingNote] = useState(
    '本次会议主要讨论视频会议助手工具的核心功能。产品侧认为首页需要展示今日会议、待办任务和最近纪要；研发侧建议第一版先使用本地模拟 AI 生成纪要，避免接口不稳定影响演示；设计侧建议采用左侧导航和卡片式布局。会议决定优先完成会议详情页、纪要生成和待办提取功能。张三负责首页原型设计，李四负责会议纪要模板整理，王五负责确认 AI 接口接入方案。'
  )

  const [minuteResult, setMinuteResult] = useState<MinuteResult | null>(null)
  const [tasks, setTasks] = useState<Task[]>(() => {
  const savedTasks = localStorage.getItem('meetflow-tasks')
  return savedTasks ? JSON.parse(savedTasks) : initialTasks
})
useEffect(() => {
  localStorage.setItem('meetflow-meetings', JSON.stringify(meetings))
}, [meetings])

useEffect(() => {
  localStorage.setItem('meetflow-tasks', JSON.stringify(tasks))
}, [tasks])

  const generateMinutes = () => {
    const result: MinuteResult = {
      summary:
        '本次会议围绕视频会议助手的产品定位、核心功能、页面结构和开发优先级展开讨论。团队一致认为第一版应聚焦会前准备、会中记录、会后纪要生成和待办事项跟进，先保证完整工作流可演示，再考虑接入真实 AI 接口。',
      points: [
        '首页需要集中展示今日会议、待生成纪要、未完成待办和历史纪要。',
        '会议详情页是核心页面，需要支持会议记录输入和结构化纪要生成。',
        '第一版采用本地模拟 AI 生成方式，降低接口依赖，提高演示稳定性。',
        '页面采用左侧导航、顶部搜索、主体卡片式布局，突出办公工具属性。',
      ],
      decisions: [
        'MVP 阶段不开发真实视频通话功能。',
        '优先完成会议详情页、会议纪要生成和待办事项提取。',
        '暂不接入复杂后端，先使用前端状态和本地数据完成演示闭环。',
      ],
      tasks: [
        {
          id: 4,
          title: '完善会议详情页交互',
          owner: '张三',
          deadline: '明天',
          priority: '高',
          status: '未开始',
          source: selectedMeeting.title,
        },
        {
          id: 5,
          title: '整理结构化会议纪要模板',
          owner: '李四',
          deadline: '本周五',
          priority: '中',
          status: '未开始',
          source: selectedMeeting.title,
        },
        {
          id: 6,
          title: '评估真实 AI 接口接入成本',
          owner: '王五',
          deadline: '待确认',
          priority: '中',
          status: '未开始',
          source: selectedMeeting.title,
        },
      ],
      risks: [
        '如果过早接入真实 AI 接口，可能受到网络、密钥和调用失败影响。',
        '如果功能范围过大，48 小时内可能难以完成稳定可演示版本。',
      ],
      nextSteps: [
        '先完成前端核心页面和主流程。',
        '补充会议列表、待办管理和纪要归档页面。',
        '最后进行视觉优化、README 编写和在线部署。',
      ],
    }

    setMinuteResult(result)

    const existingIds = new Set(tasks.map((task) => task.id))
    const newTasks = result.tasks.filter((task) => !existingIds.has(task.id))
    setTasks([...tasks, ...newTasks])
  }

  const generateMinutesByAI = async () => {
  setIsAiGenerating(true)

  try {
    const response = await fetch('/.netlify/functions/generate-minutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meeting: selectedMeeting,
        meetingNote,
      }),
    })

    if (!response.ok) {
      throw new Error('AI 生成失败')
    }

    const aiResult = await response.json()

    const formattedTasks: Task[] = (aiResult.tasks || []).map(
      (task: Omit<Task, 'id'>, index: number) => ({
        id: Date.now() + index,
        title: task.title || '待确认任务',
        owner: task.owner || '待确认',
        deadline: task.deadline || '待确认',
        priority: task.priority || '中',
        status: task.status || '未开始',
        source: selectedMeeting.title,
      })
    )

    const result: MinuteResult = {
      summary: aiResult.summary || '暂无会议摘要。',
      points: aiResult.points || [],
      decisions: aiResult.decisions || [],
      tasks: formattedTasks,
      risks: aiResult.risks || [],
      nextSteps: aiResult.nextSteps || [],
    }

    setMinuteResult(result)
    setTasks([...tasks, ...formattedTasks])

    setCopyMessage('AI 会议纪要生成成功')
    setTimeout(() => setCopyMessage(''), 2000)
  } catch (error) {
    generateMinutes()
    setCopyMessage('AI 生成失败，已使用本地规则生成纪要')
    setTimeout(() => setCopyMessage(''), 2500)
  } finally {
    setIsAiGenerating(false)
  }
}

  const formatMinutesMarkdown = () => {
    if (!minuteResult) return ''

    return `# ${selectedMeeting.title} 会议纪要

## 一、会议基本信息

- 会议主题：${selectedMeeting.title}
- 会议时间：${selectedMeeting.time}
- 参会人员：${selectedMeeting.participants}
- 会议类型：${selectedMeeting.type}

## 二、会议背景

${selectedMeeting.background}

## 三、会议摘要

${minuteResult.summary}

## 四、讨论要点

${minuteResult.points.map((item, index) => `${index + 1}. ${item}`).join('\n')}

## 五、关键结论

${minuteResult.decisions.map((item, index) => `${index + 1}. ${item}`).join('\n')}

## 六、待办事项

${minuteResult.tasks
  .map(
    (task, index) =>
      `${index + 1}. ${task.title}｜负责人：${task.owner}｜截止时间：${task.deadline}｜优先级：${task.priority}｜状态：${task.status}`
  )
  .join('\n')}

## 七、风险与问题

${minuteResult.risks.map((item, index) => `${index + 1}. ${item}`).join('\n')}

## 八、下一步计划

${minuteResult.nextSteps.map((item, index) => `${index + 1}. ${item}`).join('\n')}
`
  }

  const copyMinutes = async () => {
    if (!minuteResult) return

    await navigator.clipboard.writeText(formatMinutesMarkdown())
    setCopyMessage('会议纪要已复制')
    setTimeout(() => setCopyMessage(''), 2000)
  }

  const exportMarkdown = () => {
    if (!minuteResult) return

    const content = formatMinutesMarkdown()
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = `${selectedMeeting.title}-会议纪要.md`
    a.click()

    URL.revokeObjectURL(url)
    setCopyMessage('Markdown 文件已导出')
    setTimeout(() => setCopyMessage(''), 2000)
  }

  const createMeeting = () => {
    if (!newMeeting.title.trim()) {
      setCopyMessage('请先填写会议标题')
      setTimeout(() => setCopyMessage(''), 2000)
      return
    }

    const meeting: Meeting = {
      id: Date.now(),
      title: newMeeting.title,
      time: newMeeting.time || '待确认',
      participants: newMeeting.participants || '待确认',
      type: newMeeting.type || '普通会议',
      status: '未开始',
      background: newMeeting.background || '暂无会议背景。',
      agenda: newMeeting.agenda || '暂无会议议题。',
    }

    setMeetings([meeting, ...meetings])
    setNewMeeting({
      title: '',
      time: '',
      participants: '',
      type: '',
      background: '',
      agenda: '',
    })
    setShowCreateModal(false)
    setCopyMessage('会议创建成功')
    setTimeout(() => setCopyMessage(''), 2000)
  }

  const openMeetingDetail = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setMinuteResult(null)
    setCurrentPage('meetingDetail')
  }

  const updateTaskStatus = (id: number, status: Task['status']) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, status }
        }
        return task
      })
    )
  }

  const getParticipantList = () => {
    const participantSet = new Set<string>()

    meetings.forEach((meeting) => {
      meeting.participants
        .split(/[、,，\s]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => participantSet.add(item))
    })

    return Array.from(participantSet)
  }

  const Sidebar = () => (
    <aside className="w-64 bg-slate-950 text-white">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Video size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold">MeetFlow</h1>
            <p className="text-xs text-slate-400">视频会议助手</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-3">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            currentPage === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Home size={18} />
          工作台
        </button>

        <button
          onClick={() => setCurrentPage('meetings')}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            currentPage === 'meetings'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <CalendarDays size={18} />
          我的会议
        </button>

        <button
          onClick={() => setCurrentPage('minutes')}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            currentPage === 'minutes'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileText size={18} />
          会议纪要
        </button>

        <button
          onClick={() => setCurrentPage('tasks')}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            currentPage === 'tasks'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <CheckSquare size={18} />
          待办事项
        </button>

        <button
          onClick={() => setCurrentPage('participants')}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
            currentPage === 'participants'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users size={18} />
          参会人管理
        </button>
      </nav>
    </aside>
  )

  const Header = () => (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {currentPage === 'dashboard' && '会议工作台'}
          {currentPage === 'meetings' && '我的会议'}
          {currentPage === 'meetingDetail' && '会议详情'}
          {currentPage === 'tasks' && '待办事项'}
          {currentPage === 'minutes' && '会议纪要'}
          {currentPage === 'participants' && '参会人管理'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          聚合会议安排、纪要生成与待办跟进，提升视频会议协作效率
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            className="w-56 bg-transparent text-sm outline-none"
            placeholder="搜索会议、纪要或任务"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          新建会议
        </button>
      </div>
    </header>
  )

  const Dashboard = () => (
    <section className="p-8">
      <div className="grid grid-cols-4 gap-5">
        <StatCard title="今日会议" value={String(meetings.length)} tag="待参加" color="blue" />
        <StatCard title="待生成纪要" value="2" tag="需处理" color="orange" />
        <StatCard
          title="未完成待办"
          value={String(tasks.filter((t) => t.status !== '已完成').length)}
          tag="跟进中"
          color="red"
        />
        <StatCard title="已归档纪要" value="12" tag="已完成" color="green" />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">今日会议</h3>
              <p className="mt-1 text-sm text-slate-500">
                集中查看即将开始和需要整理纪要的会议
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('meetings')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部
            </button>
          </div>

          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{meeting.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {meeting.time}｜{meeting.participants}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      meeting.status === '进行中'
                        ? 'bg-blue-50 text-blue-600'
                        : meeting.status === '未开始'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openMeetingDetail(meeting)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                  >
                    进入会议详情
                  </button>
                  <button
                    onClick={() => openMeetingDetail(meeting)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    生成纪要
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold">待办提醒</h3>
            <p className="mt-1 text-sm text-slate-500">
              从会议纪要中提取出的关键任务
            </p>
          </div>

          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-medium">{task.title}</p>
                <p className="mt-2 text-xs text-slate-500">
                  负责人：{task.owner}｜截止：{task.deadline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  const MeetingDetail = () => (
    <section className="p-8">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        返回工作台
      </button>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedMeeting.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{selectedMeeting.background}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
                {selectedMeeting.status}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <InfoCard title="会议时间" value={selectedMeeting.time} icon={<Clock size={18} />} />
              <InfoCard title="参会人员" value={selectedMeeting.participants} icon={<Users size={18} />} />
              <InfoCard title="会议类型" value={selectedMeeting.type} icon={<Video size={18} />} />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">会议议题</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{selectedMeeting.agenda}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">会议记录输入</h3>
            <p className="mt-1 text-sm text-slate-500">
              可粘贴会议转写内容或手动输入会议讨论要点
            </p>

            <textarea
              value={meetingNote}
              onChange={(e) => setMeetingNote(e.target.value)}
              className="mt-5 h-72 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 outline-none focus:border-blue-500 focus:bg-white"
              placeholder="请输入会议记录内容..."
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={generateMinutes}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium hover:bg-slate-50"
              >
                生成会议纪要与待办
              </button>

              <button
                onClick={generateMinutesByAI}
                disabled={isAiGenerating}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isAiGenerating ? 'AI 正在生成中...' : 'AI 生成纪要与待办'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">AI 会议助手</h3>
          <p className="mt-1 text-sm text-slate-500">
            自动整理摘要、结论、风险和待办事项
          </p>

          {!minuteResult ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
              <FileText className="mx-auto text-slate-400" size={34} />
              <p className="mt-4 text-sm text-slate-500">
                点击“生成会议纪要与待办”后，这里会展示结构化结果。
              </p>
            </div>
          ) : (
            <MinuteResultView
              result={minuteResult}
              onCopy={copyMinutes}
              onExport={exportMarkdown}
            />
          )}
        </div>
      </div>
    </section>
  )

  const TasksPage = () => (
    <section className="p-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">会议待办事项</h3>
            <p className="mt-1 text-sm text-slate-500">
              统一管理从会议纪要中提取出的任务
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            共 {tasks.length} 项
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">任务内容</th>
                <th className="px-4 py-3">负责人</th>
                <th className="px-4 py-3">截止时间</th>
                <th className="px-4 py-3">优先级</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">来源会议</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t border-slate-200">
                  <td className="px-4 py-4 font-medium">{task.title}</td>
                  <td className="px-4 py-4">{task.owner}</td>
                  <td className="px-4 py-4">{task.deadline}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="未开始">未开始</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{task.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )

  const MinutesPage = () => (
    <section className="p-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">最近会议纪要</h3>
        <p className="mt-1 text-sm text-slate-500">
          查看已经生成和归档的结构化会议纪要
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">视频会议助手需求评审</h4>
                <p className="mt-2 text-sm text-slate-500">
                  已生成摘要、讨论要点、关键结论、待办事项和风险问题。
                </p>
              </div>
              <button
                onClick={() => openMeetingDetail(initialMeetings[0])}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
              >
                查看详情
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">前端开发进度同步</h4>
                <p className="mt-2 text-sm text-slate-500">
                  记录前端页面开发进度、遗留问题和后续计划。
                </p>
              </div>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                查看纪要
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const MeetingsPage = () => (
  <section className="p-8">
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">我的会议</h3>
          <p className="mt-1 text-sm text-slate-500">
            统一查看全部会议，并快速进入详情或生成纪要
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          新建会议
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:bg-blue-50/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-semibold">{meeting.title}</h4>
                <p className="mt-2 text-sm text-slate-500">
                  {meeting.time}｜{meeting.participants}｜{meeting.type}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {meeting.background}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  meeting.status === '进行中'
                    ? 'bg-blue-50 text-blue-600'
                    : meeting.status === '未开始'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {meeting.status}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openMeetingDetail(meeting)}
                className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                进入会议详情
              </button>

              <button
                type="button"
                onClick={() => openMeetingDetail(meeting)}
                className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-white"
              >
                生成纪要
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const ParticipantsPage = () => {
  const participants = getParticipantList()

  return (
    <section className="p-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">参会人管理</h3>
            <p className="mt-1 text-sm text-slate-500">
              根据会议参会人员自动汇总，便于查看成员参与情况
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
            共 {participants.length} 位参会人/团队
          </span>
        </div>

        {participants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            暂无参会人信息，请先新建会议。
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {participants.map((participant) => {
              const relatedMeetings = meetings.filter((meeting) =>
                meeting.participants.includes(participant)
              )

              return (
                <div
                  key={participant}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {participant.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{participant}</h4>
                      <p className="text-xs text-slate-500">
                        参与 {relatedMeetings.length} 场会议
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {relatedMeetings.map((meeting) => (
                      <button
                        key={meeting.id}
                        onClick={() => openMeetingDetail(meeting)}
                        className="block w-full rounded-xl bg-white px-3 py-2 text-left text-xs text-slate-600 hover:text-blue-600"
                      >
                        {meeting.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <Header />

          {copyMessage && (
            <div className="fixed right-8 top-24 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
              {copyMessage}
            </div>
          )}

          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'meetings' && <MeetingsPage />}
          {currentPage === 'meetingDetail' && <MeetingDetail />}
          {currentPage === 'tasks' && <TasksPage />}
          {currentPage === 'minutes' && <MinutesPage />}
          {currentPage === 'participants' && <ParticipantsPage />}
        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40">
          <div className="w-[620px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">新建会议</h3>
                <p className="mt-1 text-sm text-slate-500">
                  创建会议后，可在工作台中进入详情并生成纪要
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="会议标题"
                value={newMeeting.title}
                placeholder="例如：产品需求评审"
                onChange={(value) => setNewMeeting({ ...newMeeting, title: value })}
              />

              <InputField
                label="会议时间"
                value={newMeeting.time}
                placeholder="例如：16:00 - 17:00"
                onChange={(value) => setNewMeeting({ ...newMeeting, time: value })}
              />

              <InputField
                label="参会人员"
                value={newMeeting.participants}
                placeholder="例如：产品组、研发组"
                onChange={(value) => setNewMeeting({ ...newMeeting, participants: value })}
              />

              <InputField
                label="会议类型"
                value={newMeeting.type}
                placeholder="例如：需求评审"
                onChange={(value) => setNewMeeting({ ...newMeeting, type: value })}
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700">会议背景</label>
              <textarea
                value={newMeeting.background}
                onChange={(e) => setNewMeeting({ ...newMeeting, background: e.target.value })}
                className="mt-2 h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                placeholder="请输入会议背景"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700">会议议题</label>
              <textarea
                value={newMeeting.agenda}
                onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                className="mt-2 h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                placeholder="请输入会议议题"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={createMeeting}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                创建会议
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  tag,
  color,
}: {
  title: string
  value: string
  tag: string
  color: 'blue' | 'orange' | 'red' | 'green'
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`rounded-full px-3 py-1 text-xs ${colorMap[color]}`}>
          {tag}
        </span>
      </div>
    </div>
  )
}

function InfoCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 text-blue-600">{icon}</div>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function MinuteResultView({
  result,
  onCopy,
  onExport,
}: {
  result: MinuteResult
  onCopy: () => void
  onExport: () => void
}) {
  return (
    <div className="mt-6 space-y-5">
      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Copy size={16} />
          复制纪要
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          <Download size={16} />
          导出 Markdown
        </button>
      </div>

      <div>
        <h4 className="font-semibold">会议摘要</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">{result.summary}</p>
      </div>

      <ResultBlock title="讨论要点" items={result.points} />
      <ResultBlock title="关键结论" items={result.decisions} />
      <ResultBlock title="风险与问题" items={result.risks} />
      <ResultBlock title="下一步计划" items={result.nextSteps} />

      <div>
        <h4 className="font-semibold">待办事项</h4>
        <div className="mt-3 space-y-3">
          {result.tasks.map((task) => (
            <div key={task.id} className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-medium">{task.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                负责人：{task.owner}｜截止：{task.deadline}｜优先级：{task.priority}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResultBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm leading-6 text-slate-600">
            {index + 1}. {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
        placeholder={placeholder}
      />
    </div>
  )
}

export default App
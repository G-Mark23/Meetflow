type TaskItem = {
  title: string
  owner: string
  deadline: string
  priority: '高' | '中' | '低'
  status: '未开始' | '进行中' | '已完成'
  source: string
}

type MinuteResult = {
  summary: string
  points: string[]
  decisions: string[]
  tasks: TaskItem[]
  risks: string[]
  nextSteps: string[]
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST requests are allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ message: 'Missing DEEPSEEK_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { meeting, meetingNote } = body

    const prompt = `
你是一个专业的视频会议助手。请根据会议基本信息和会议记录，生成结构化会议纪要。

请严格返回 JSON，不要返回 Markdown，不要添加解释文字。

JSON 格式必须如下：
{
  "summary": "会议摘要",
  "points": ["讨论要点1", "讨论要点2"],
  "decisions": ["关键结论1", "关键结论2"],
  "tasks": [
    {
      "title": "任务内容",
      "owner": "负责人",
      "deadline": "截止时间",
      "priority": "高",
      "status": "未开始",
      "source": "来源会议"
    }
  ],
  "risks": ["风险或问题1", "风险或问题2"],
  "nextSteps": ["下一步计划1", "下一步计划2"]
}

要求：
1. 待办事项必须尽量从会议记录中提取。
2. 如果负责人不明确，owner 写“待确认”。
3. 如果截止时间不明确，deadline 写“待确认”。
4. priority 只能是“高”“中”“低”。
5. status 默认写“未开始”。
6. source 使用会议标题。

会议基本信息：
会议标题：${meeting.title}
会议时间：${meeting.time}
参会人员：${meeting.participants}
会议类型：${meeting.type}
会议背景：${meeting.background}
会议议题：${meeting.agenda}

会议记录：
${meetingNote}
`

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业、严谨的会议纪要生成助手，只返回合法 JSON。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({
          message: 'AI API request failed',
          detail: errorText,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return new Response(JSON.stringify({ message: 'Empty AI response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const cleanedContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const result: MinuteResult = JSON.parse(cleanedContent)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to generate minutes',
        detail: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
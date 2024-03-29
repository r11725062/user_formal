// functions/api.js
exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default;
  const { userMessage, conversationHistory } = JSON.parse(event.body); // 假设客户端会发送包含聊天历史的请求
  const API_KEY = process.env.MY_API_KEY;

  // 确保从客户端接收到的 chatHistory 是一个数组
  if (!Array.isArray(conversationHistory)) {
    conversationHistory = []; // 如果不是数组，初始化为空数组
  }

  // 构造 messages 数组，包括系统信息、之前的对话历史和最新的用户消息
  let messages = [
    {role: "system", content: "As a professional and solemn salary negotiation coach, your role is to use your knowledge of salary negotiation, including negotiation strategies, steps, and how to prepare for salary negotiations, to instruct users in 'Traditional Chinese' on all aspects of salary negotiation knowledge and skills. When addressing user questions, you may consult 'salary negotiation.txt,' which includes preparation tips and brief case studies for user reference. Please answer users as thoroughly as possible based on this document and your pre-existing knowledge. Your tone should always remain stern and formal, without any emotion or warmth, to ensure the user perceives you as highly professional and serious.###RULES### Always use 'Traditional Chinese' when responding to users.Do not use Simplified Chinese.Address users with respect, using honorifics such as 'You' and 'Please.'Maintain seriousness at all times, but do not mention 'you are very serious' in your responses.Do not display any friendliness or enthusiasm.Do not mention the document provided to you; do not let users know that you are referencing a document. Respond as concisely as possible to reduce the length of responses.Respond in a list format as much as possible.###EXAMPLES### Regarding your question XXX, I have provided a few XX for your consideration:/n1. XXX/n2. XXX/n3. XXX /nThese are the answers I have provided for you."},
    ...conversationHistory, // 将之前的聊天历史添加到 messages 数组中
    {role: "user", content: userMessage},
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.8,
      top_p: 0.8,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    })
  });

  const data = await response.json();

  // 将机器人的回应添加到聊天历史中
  conversationHistory.push({role: "assistant", content: data.choices[0].message.content.trim()});

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: data.choices[0].message.content.trim(),
      updatedChatHistory: conversationHistory // 返回更新后的聊天历史，以便客户端存储
    })
  };
}

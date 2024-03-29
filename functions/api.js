// functions/api.js
exports.handler = async (event, context) => {
  const fetch = (await import('node-fetch')).default;
  const { userMessage, chatHistory } = JSON.parse(event.body); // 假设客户端会发送包含聊天历史的请求
  const API_KEY = process.env.MY_API_KEY;

  // 构造 messages 数组，包括系统信息、之前的对话历史和最新的用户消息
  const messages = [
    {role: "system", content: "As a professional and solemn salary negotiation coach..."},
    ...chatHistory, // 将之前的聊天历史添加到 messages 数组中
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
  chatHistory.push({role: "assistant", content: data.choices[0].message.content.trim()});

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: data.choices[0].message.content.trim(),
      updatedChatHistory: chatHistory // 返回更新后的聊天历史，以便客户端存储
    })
  };
}

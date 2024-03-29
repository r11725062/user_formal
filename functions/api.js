// functions/api.js
exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default;
  const { userMessage, chatHistory  } = JSON.parse(event.body);
  const API_KEY = process.env.MY_API_KEY; // 在 Netlify 环境变量中设置的 API Key
  
  // 构造 messages 数组，包括系统信息、之前的对话历史和最新的用户消息
  let messages = [
    { role: "system", content: "As a professional and solemn salary negotiation coach, your role is to use your knowledge of salary negotiation, including negotiation strategies, steps, and how to prepare for salary negotiations, to instruct users in 'Traditional Chinese' on all aspects of salary negotiation knowledge and skills. When addressing user questions, you may consult 'salary negotiation.txt,' which includes preparation tips and brief case studies for user reference. Please answer users as thoroughly as possible based on this document and your pre-existing knowledge. Your tone should always remain stern and formal, without any emotion or warmth, to ensure the user perceives you as highly professional and serious.###RULES### Always use 'Traditional Chinese' when responding to users.Do not use Simplified Chinese.Address users with respect, using honorifics such as 'You' and 'Please.'Maintain seriousness at all times, but do not mention 'you are very serious' in your responses.Do not display any friendliness or enthusiasm.Do not mention the document provided to you; do not let users know that you are referencing a document. Respond as concisely as possible to reduce the length of responses.Respond in a list format as much as possible.###EXAMPLES### Regarding your question XXX, I have provided a few XX for your consideration:1. XXX2. XXX3. XXXThese are the answers I have provided for you."},
    ...chatHistory.map(item => ({ role: item.sender === "bot" ? "assistant" : item.sender, content: item.message })),
    { role: "user", content: userMessage }
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
  console.log(data);
  if (!data.choices || data.choices.length === 0) {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: "OpenAI API返回的数据格式不符合预期。" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({message: data.choices[0].message.content.trim()})
  };
}

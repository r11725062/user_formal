// functions/api.js
exports.handler = async function(event, context) {
  const API_KEY = process.env.MY_API_KEY; // 將 API Key 存儲在 Netlify 的環境變數中
  const response = await fetch('API_URL', {
    headers: {
      // 將 API Key 添加到請求頭中
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  const data = await response.json();
  
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

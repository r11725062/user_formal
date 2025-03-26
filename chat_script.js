const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // 儲存使用者訊息的變數
const API_KEY = ""; // 在此貼上你的 API 金鑰
const inputInitHeight = chatInput.scrollHeight;

let chatHistory = []; 
function addToChatHistory(sender, message) {
    chatHistory.push({sender: sender, message: message});
}

const createChatLi = (message, className) => {
    // 建立一個帶有訊息和類別名稱的 <li> 聊天元素
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    const avatarSrc = localStorage.getItem("avatarSrc") || "ava_images/ava_default.png";
    let chatContent = className === "outgoing" ? `<p></p>` : `<img class="ava_image" src="${avatarSrc}"><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // 回傳 <li> 聊天元素
}

const generateResponse = (chatElement) => {
    const netlifyFunctionURL = "/.netlify/functions/api"; // Netlify 函數的路徑
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
         body: JSON.stringify({ 
            userMessage: userMessage, 
            chatHistory: chatHistory // 將目前對話歷史傳送給伺服器
        })
    };

    fetch(netlifyFunctionURL, requestOptions).then(res => res.json()).then(data => {
        // 假設回傳的資料包含在 'message' 欄位
        messageElement.textContent = data.message;
        addToChatHistory("bot", messageElement.textContent); 
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "哎呀！出錯了。請再試一次。";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // 取得使用者輸入並移除多餘空白
    if(!userMessage) return;

    // 清空輸入框並重設高度
    chatInput.value = "";
    addToChatHistory("user", userMessage); 
    chatInput.style.height = `${inputInitHeight}px`;

    // 將使用者訊息加到聊天視窗中
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // 顯示「正在輸入...」訊息，等待回應
        var userName = localStorage.getItem("userName");
        const incomingChatLi = createChatLi(userName+"正在輸入訊息...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // 根據內容調整輸入框的高度
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

let enterPressed = false; // 用來追蹤使用者是否按下 Enter 鍵

chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        // 檢查輸入框中是否有候選字面板開啟
        const isCandidatePanelOpen = document.querySelector(".CompositionArea-caretMenu") !== null;
        if (!isCandidatePanelOpen) {
            e.preventDefault(); // 阻止預設 Enter 行為
            if (!enterPressed) {
                enterPressed = true; // 第一次按 Enter
            } else {
                handleChat(); // 第二次按 Enter 送出訊息
                enterPressed = false; // 重置旗標
            }
        }
    } else {
        enterPressed = false;
    }
});

document.addEventListener("DOMContentLoaded", () => { 
    // 頁面載入時開啟聊天視窗
    document.body.classList.add("show-chatbot");
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
//chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

function submitChatHistoryToGoogleForm() {
    // 將聊天紀錄轉為字串
    let chatHistoryString = chatHistory.map(item => `${item.sender}: ${item.message}`).join('\n');
    const avatarSrc = localStorage.getItem("avatarSrc") || "default.png";
    const userName = localStorage.getItem("userName") || "default_name";
    // 構造表單資料
    let formData = new FormData();
    formData.append("entry.938012830", 'user');
    formData.append("entry.25562195", "formal");
    formData.append("entry.22358687", userName);
    formData.append("entry.1553700084", avatarSrc);
    formData.append("entry.801005873", chatHistoryString);
     // 使用 fetch 提交表單
    fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSedu6Xgk9J57Z7p1NmCSabbymfZ5XfTVDj1Qobu6p5IFJv0mw/formResponse", {
        method: "POST",
        mode: "no-cors", // 注意：這將導致無法讀取回應，但允許發送請求
        body: new URLSearchParams(formData)
    }).then(response => {
        console.log("表單已提交");
    }).catch(error => {
        console.error("提交失敗", error);
    });
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "剩餘時間：" + minutes + "：" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            submitChatHistoryToGoogleForm()
            window.location.href = 'https://tassel.syd1.qualtrics.com/jfe/form/SV_9ZwsyfyiF8tD1v8'; // 替換為實際的跳轉網址
        }
    }, 1000);
}

window.onload = function () {   
    var avatarSrc = localStorage.getItem("avatarSrc");
    var userName = localStorage.getItem("userName");
  
    // 如果有資訊，則更新頁面上的頭像與姓名
    if (avatarSrc && userName) {
      document.querySelector(".ava_image").src = avatarSrc;
      document.getElementById("user-name-display").textContent = userName;
    }
};

document.querySelector('.material-symbols-outlined').addEventListener('click', function() {
    var popupBox = document.querySelector('.popup-box');
    if (popupBox.style.display === 'none') {
      popupBox.style.display = 'block';
    } else {
      popupBox.style.display = 'none';
    }
});

$(document).ready(function() {
    // 顯示遮罩層與第一個指引
    $(".modal-overlay").show();
    $("#guideModal1").show();
  
    // 當使用者點選任一個關閉按鈕時
    $(".close-guide").click(function() {
        var guideNumber = $(this).data("guide"); // 取得是第幾個指引
        $("#guideModal" + guideNumber).hide(); // 隱藏目前指引
  
        if (guideNumber == 1) {
            $("#guideModal2").show();
        } else if (guideNumber == 2) {
            $("#guideModal3").show();
        } else {
            // 關閉最後一個指引後，隱藏遮罩層並開始倒數
            $(".modal-overlay").hide();
            const duration = 300, // 倒數總秒數（這裡為 5 分鐘）
                display = document.querySelector('#timer');
            startTimer(duration, display);
        }
    });

    // 點選右上角關閉圖示時關閉問題庫視窗
    $(".popup-close-icon").click(function() {
        $(this).closest(".popup-box").hide();
    });

    // 關閉問題庫
    $('.close-popup').click(function() {
        $(this).parent('.popup-box').hide();
    });
});
  
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // 避免顯示在畫面上
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? '成功' : '失敗';
        console.log('備援：複製結果 ' + msg);
    } catch (err) {
        console.error('備援：無法複製文字', err);
    }

    document.body.removeChild(textArea);
    alert('已複製問題');
}

$(document).on('click', '.question', function() {
    const questionText = $(this).data('copy');
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(questionText).then(() => {
            alert('已複製問題');
        }).catch(err => {
            console.error('複製失敗，使用備援方案', err);
            fallbackCopyTextToClipboard(questionText);
        });
    } else {
        console.log('Clipboard API 不可用，使用備援方案');
        fallbackCopyTextToClipboard(questionText);
    }

    // 關閉問題庫
    $('.close-popup').click(function() {
        $(this).parent('.popup-box').hide();
    });
});


// script.js
document.addEventListener('DOMContentLoaded', function () {
    const avatarForm = document.getElementById('avatarForm');
    const avatarInputs = document.querySelectorAll('input[name="avatar"]');
    const avatarImage = document.getElementById('avatarImage');
    const nameInput = document.getElementById('nameInput');

    avatarInputs.forEach(input => {
        input.addEventListener('change', function () {
            if(this.checked) {
                avatarImage.src = this.value;
                avatarImage.classList.remove('hidden');
            }
        });
    });

    avatarForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
        if (selectedAvatar && nameInput.value) {
            document.querySelector('.avatar-preview').style.display = 'none';
            document.querySelector('.avatar-options').style.display = 'none';
            document.getElementById('nameInput').style.display = 'none';
    
            var submitContent = document.querySelector('.submit-content');
            submitContent.innerHTML = `
                <img src="${avatarImage.src}" alt="用戶頭像" style="width: 310px; height: 310px; border-radius: 50%; margin-bottom: 1px;">
                <h2 style="margin-top: 5px; margin-bottom: 5px;">${nameInput.value}</h2>
                <p>您好，我是您的薪資談判指導員${nameInput.value}，在接下來的實驗中，我將透過對話指導您關於薪資談判的技巧和細節。<br><br>
                實驗會計時五分鐘，請您在這期間儘可能詢問您想知道關於薪資談判的任何事。<br>
                <b>若您無法自行想出問題，可以點選左上角 <span class="material-symbols-outlined">info</span> 標示查看問題庫，並將問題複製到對話框中。</b><br><br>
                <span style="background-color: yellow;"><b>在實驗結束後，將會進行相關測驗，因此請您務必仔細觀看我提供的內容，並且認真回應我。</b></span><br>
                在您準備好後，請按下「實驗開始」的按鈕後，即可開始。</p>
            `;
            submitContent.classList.remove('hidden');
            submitContent.style.display = 'block';

            var selectedAvatarSrc = document.getElementById("avatarImage").src;
            var userName = document.getElementById("nameInput").value;
            // 存儲選擇的頭像和姓名到LocalStorage
            localStorage.setItem("avatarSrc", selectedAvatarSrc);
            localStorage.setItem("userName", userName);
            // 更新按鈕文字並添加跳轉功能
            submitBtn.textContent = '實驗開始';
            submitBtn.removeEventListener('click', this);
            submitBtn.addEventListener('click', function () {
                window.location.href = 'chat.html'; // 跳轉到另一頁
            });
        } else {
            alert('請選擇一個頭像並填寫姓名');
        }
    });
    
});

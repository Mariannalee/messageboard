import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@latest';
        const supabase = createClient('https://nikhhegzfihqipkzkeiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2hoZWd6ZmlocWlwa3prZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTQ0MTgsImV4cCI6MjA0NzM5MDQxOH0.OSrLKkyJKAkrxtsczcyOXQCk032I6MhveGap8YueERY');

// 假設有更多留言資料未來從 API 加載
function menuAnimation() {
    const items = document.querySelectorAll(".category-btn");
    items.forEach(item => {
        item.classList.toggle("clicked");
    });
}

// 新增留言功能
const addMessageBtn = document.getElementById("addMessageBtn");
const messageModal = document.getElementById("messageModal");
const closeModal = document.getElementById("closeModal");
const submitMessage = document.getElementById("submitMessage");
const messageList = document.getElementById("messageList");

// 點擊 + 按鈕，顯示彈窗
addMessageBtn.addEventListener("click", () => {
    messageModal.classList.add("show");
});

// 點擊關閉按鈕，隱藏彈窗
closeModal.addEventListener("click", () => {
    messageModal.classList.remove("show");
});

// 點擊送出按鈕，新增留言
submitMessage.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const content = document.getElementById("messageContent").value.trim();

    if (username && content) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        const timestamp = new Date().toLocaleString();

        messageDiv.innerHTML = `
            <div class="user-info">${username} <span class="timestamp">${timestamp}</span></div>
            <div class="content">${content}</div>
            <div class="actions">
                <button class="like-btn">👍 0</button>
            </div>
        `;

        // 把新增的留言加入到留言列表
        messageList.prepend(messageDiv);

        // 為新的按讚按鈕新增點擊事件監聽器
        const likeButton = messageDiv.querySelector(".like-btn");
        likeButton.addEventListener("click", () => {
            let count = parseInt(likeButton.textContent.split(" ")[1]);
            likeButton.textContent = `👍 ${count + 1}`;
        });

        // 清空輸入框並關閉彈窗
        document.getElementById("username").value = '';
        document.getElementById("messageContent").value = '';
        messageModal.classList.remove("show");
    }
});


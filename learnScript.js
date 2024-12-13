import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@latest';

// 初始化 Supabase 客戶端
const supabase = createClient('https://nikhhegzfihqipkzkeiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2hoZWd6ZmlocWlwa3prZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTQ0MTgsImV4cCI6MjA0NzM5MDQxOH0.OSrLKkyJKAkrxtsczcyOXQCk032I6MhveGap8YueERY');

// 參考 DOM 元素
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

// 點擊送出按鈕，新增留言並儲存至 Supabase
submitMessage.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const content = document.getElementById("messageContent").value.trim();

    if (username && content) {
        // 儲存留言到 Supabase
        const { data, error } = await supabase
            .from('MessageBoard')  // 假設資料表名稱為 MessageBoard
            .insert([
                insert([{ username, content: messageContent }]);
  

        if (error) {
            console.error('新增留言錯誤:', error);
            return;
        }

        // 顯示新增的留言
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

// 讀取 Supabase 資料並顯示留言
const loadMessages = async () => {
    const { data, error } = await supabase
        .from('MessageBoard')  // 假設資料表名稱為 MessageBoard
        .select('id, username, content, created_at')
        .order('created_at', { ascending: false });  // 按照時間排序顯示留言

    if (error) {
        console.error('讀取留言錯誤:', error);
        return;
    }

    // 清空留言列表，並重新載入
    messageList.innerHTML = '';
    data.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        messageDiv.innerHTML = `
            <div class="user-info">${message.username} <span class="timestamp">${new Date(message.created_at).toLocaleString()}</span></div>
            <div class="content">${message.content}</div>
            <div class="actions">
                <button class="like-btn">👍 0</button>
            </div>
        `;

        // 為每條留言新增按讚事件
        const likeButton = messageDiv.querySelector(".like-btn");
        likeButton.addEventListener("click", () => {
            let count = parseInt(likeButton.textContent.split(" ")[1]);
            likeButton.textContent = `👍 ${count + 1}`;
        });

        messageList.appendChild(messageDiv);
    });
};

// 初始化留言列表
loadMessages();

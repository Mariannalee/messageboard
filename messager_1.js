import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://nikhhegzfihqipkzkeiu.supabase.co'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2hoZWd6ZmlocWlwa3prZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTQ0MTgsImV4cCI6MjA0NzM5MDQxOH0.OSrLKkyJKAkrxtsczcyOXQCk032I6MhveGap8YueERY'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const messageList = document.getElementById("messageList");
    const addMessageBtn = document.getElementById("addMessageBtn");
    const messageModal = document.getElementById("messageModal");
    const closeModal = document.getElementById("closeModal");
    const submitMessage = document.getElementById("submitMessage");

    // 顯示留言
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

            // 新增按讚事件
            const likeButton = messageDiv.querySelector(".like-btn");
            likeButton.addEventListener("click", () => {
                let count = parseInt(likeButton.textContent.split(" ")[1]);
                likeButton.textContent = `👍 ${count + 1}`;
            });

            messageList.appendChild(messageDiv);
        });
    };

    // 初始化留言
    loadMessages();

    // 點擊 + 按鈕，顯示彈窗
    addMessageBtn.addEventListener("click", () => {
        messageModal.classList.add("show");
    });

    // 點擊關閉按鈕，隱藏彈窗
    closeModal.addEventListener("click", () => {
        messageModal.classList.remove("show");
    });

    // 點擊送出按鈕，新增留言到 Supabase
    submitMessage.addEventListener("click", async () => {
        const username = document.getElementById("username").value.trim();
        const content = document.getElementById("messageContent").value.trim();

        if (username && content) {
            // 儲存留言到 Supabase
            const { error } = await supabase
                .from('MessageBoard')  // 假設資料表名稱為 MessageBoard
                .insert([
                    { username, content }
                ]);

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
});

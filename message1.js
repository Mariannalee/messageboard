import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
const supabase = createClient('https://nikhhegzfihqipkzkeiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2hoZWd6ZmlocWlwa3prZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTQ0MTgsImV4cCI6MjA0NzM5MDQxOH0.OSrLKkyJKAkrxtsczcyOXQCk032I6MhveGap8YueERY');

document.addEventListener('DOMContentLoaded', async () => {
    const messageList = document.getElementById("messageList");
    const addMessageBtn = document.getElementById("addMessageBtn");
    const messageModal = document.getElementById("messageModal");
    const closeModal = document.getElementById("closeModal");
    const submitMessage = document.getElementById("submitMessage");

    // 顯示留言
    const loadMessages = async () => {
        const { data, error } = await supabase
            .from('MessageBoard')
            .select('id, username, content, created_at, likes')
            .order('created_at', { ascending: false });

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
                    <button class="like-btn">👍 ${message.likes}</button>
                </div>
            `;

            // 新增按讚事件
            const likeButton = messageDiv.querySelector(".like-btn");
            likeButton.addEventListener("click", async () => {
                let count = message.likes;
                const { error } = await supabase
                    .from('MessageBoard')
                    .update({ likes: count + 1 })
                    .eq('id', message.id);

                if (error) {
                    console.error('更新按讚數錯誤:', error);
                    return;
                }

                // 更新畫面上的按讚數
                message.likes++;
                likeButton.textContent = `👍 ${message.likes}`;
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
            const { data, error } = await supabase
                .from('MessageBoard')
                .insert([
                    { username, content, likes: 0 }  // 初始化 likes 為 0
                ])
                .select();

            if (error) {
                console.error('新增留言錯誤:', error);
                return;
            }

            const newMessage = data[0];
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");

            messageDiv.innerHTML = `
                <div class="user-info">${newMessage.username} <span class="timestamp">${new Date(newMessage.created_at).toLocaleString()}</span></div>
                <div class="content">${newMessage.content}</div>
                <div class="actions">
                    <button class="like-btn">👍 ${newMessage.likes}</button>
                </div>
            `;

            // 新增按讚事件
            const likeButton = messageDiv.querySelector(".like-btn");
            likeButton.addEventListener("click", async () => {
                let count = newMessage.likes;
                const { error } = await supabase
                    .from('MessageBoard')
                    .update({ likes: count + 1 })
                    .eq('id', newMessage.id);

                if (error) {
                    console.error('更新按讚數錯誤:', error);
                    return;
                }

                newMessage.likes++;
                likeButton.textContent = `👍 ${newMessage.likes}`;
            });

            // 把新增的留言加入到留言列表
            messageList.prepend(messageDiv);

            // 清空輸入框並關閉彈窗
            document.getElementById("username").value = '';
            document.getElementById("messageContent").value = '';
            messageModal.classList.remove("show");
        }
    });
});


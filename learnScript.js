submitMessage.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const content = document.getElementById("messageContent").value.trim();
    if (username && content) {
        // 儲存留言到 Supabase
        const { data, error } = await supabase
            .from('MessageBoard')  // 假設資料表名稱為 MessageBoard
            .insert([
                { username, message: content }  // 正確的寫法
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


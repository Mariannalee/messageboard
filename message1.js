
document.addEventListener('DOMContentLoaded', async () => {
    const messageList = document.getElementById('messageList');
    const addMessageBtn = document.getElementById('addMessageBtn');
    const messageModal = document.getElementById('messageModal');
    const submitMessage = document.getElementById('submitMessage');
    const closeModal = document.getElementById('closeModal');
    const usernameInput = document.getElementById('username');
    const messageContentInput = document.getElementById('messageContent');
  
    // 開啟彈窗
    addMessageBtn.addEventListener('click', () => {
      messageModal.style.display = 'block';
    });
  
    // 關閉彈窗
    closeModal.addEventListener('click', () => {
      messageModal.style.display = 'none';
    });
  
    // 提交留言
    submitMessage.addEventListener('click', async () => {
      const username = usernameInput.value.trim();
      const messageContent = messageContentInput.value.trim();
      if (!username || !messageContent) {
        alert('請填寫名稱和留言內容');
        return;
      }
  
      // 將資料插入 Supabase 資料庫
      const { data, error } = await supabase.from('messages').insert([{ username, content: messageContent }]);
      console.log('插入成功')
      if (error) {
        console.error('Error inserting message:', error);
        alert('留言失敗，請稍後再試');
        return;
      }
  
      // 清空輸入欄位並關閉彈窗
      usernameInput.value = '';
      messageContentInput.value = '';
      messageModal.style.display = 'none';
      console.log('關閉成功');
      // 將留言即時顯示到留言板
      
      displayMessages();
      console.log('即將執行 displayMessages()');
    });
  
    // 讀取並顯示留言
    async function displayMessages() {
      console.log('開始執行 displayMessages');
      const { data, error } = await supabase.from('messages').select('*').order('id', { ascending: false });
      console.log('開始執行 displayMessages');
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      console.log('成功讀取留言:', data);
  
      // 清空舊留言並渲染新留言
      messageList.innerHTML = '';
      if (data.length === 0) {
      const noMessages = document.createElement('div');
      console.log('顯示留言', data);
      noMessages.textContent = '目前沒有留言';
      messageList.appendChild(noMessages);
      return;
  }
      data.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<strong>${message.username}</strong>: ${message.content}`;
        messageList.appendChild(messageDiv);
        console.log('顯示留言', data);
      });
    }
  
    // 初次載入時顯示留言
    displayMessages();
  });
  

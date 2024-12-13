import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@latest';
        const supabase = createClient('https://nikhhegzfihqipkzkeiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2hoZWd6ZmlocWlwa3prZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTQ0MTgsImV4cCI6MjA0NzM5MDQxOH0.OSrLKkyJKAkrxtsczcyOXQCk032I6MhveGap8YueERY');
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
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return;
  }

  // 取得留言容器
  const messageList = document.getElementById('messageList');
  messageList.innerHTML = ''; // 清空現有留言

  // 如果沒有資料，顯示提示訊息
  if (!Array.isArray(data) || data.length === 0) {
    messageList.innerHTML = '<p>目前沒有留言。</p>';
    return;
  }

  // 渲染每一條留言
  data.forEach(message => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
      <div class="message-header">
        <strong>${message.username}</strong> 於 ${new Date(message.created_at).toLocaleString()}
      </div>
      <div class="message-content">
        <p>${message.content}</p>
      </div>
    `;
    messageList.appendChild(messageDiv);
  });
}

// 記得在頁面加載時呼叫 displayMessages()
document.addEventListener('DOMContentLoaded', () => {
  displayMessages();
});

import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://nikhhegzfihqipkzkeiu.supabase.co'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pa2hoZWd6ZmlocWlwa3prZWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTQ0MTgsImV4cCI6MjA0NzM5MDQxOH0.OSrLKkyJKAkrxtsczcyOXQCk032I6MhveGap8YueERY'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);

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
  
      if (error) {
        console.error('Error inserting message:', error);
        alert('留言失敗，請稍後再試');
        return;
      }
  
      // 清空輸入欄位並關閉彈窗
      usernameInput.value = '';
      messageContentInput.value = '';
      messageModal.style.display = 'none';
  
      // 將留言即時顯示到留言板
      displayMessages();
    });
  
    // 讀取並顯示留言
    async function displayMessages() {
      const { data, error } = await supabase.from('messages').select('*').order('id', { ascending: false });
  
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
  
      // 清空舊留言並渲染新留言
      messageList.innerHTML = '';
      data.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
          <strong>${message.username}</strong>: ${message.content}
        `;
        messageList.appendChild(messageDiv);
      });
    }
  
    // 初次載入時顯示留言
    displayMessages();
  });
  
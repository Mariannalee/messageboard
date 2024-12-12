import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://iunfsvxrmneynpnzcjmq.supabase.co'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);

// 初始化課程計數
async function initializeCounts(courseId) {
    try {
        const { data, error } = await supabase
            .from('reactions')
            .select('reaction_type, count') // 確保 reaction_type 和 count 是資料表中的正確欄位名
            .eq('course_id', courseId);

        if (error) throw error;

        // 更新 UI
        data.forEach((reaction) => {
            const elementId = `${reaction.reaction_type}-count-${courseId}`; // reaction_type
            const countElement = document.getElementById(elementId);

            if (!countElement) {
                console.warn(`未找到元素: ${elementId}`);
                return;
            }

            countElement.innerText = `${reaction.count}人`;
        });
    } catch (error) {
        console.error('初始化計數失敗:', error);
    }
}


// 更新反應計數
async function updateReaction(courseId, reactionType) {
    try {
        const { error } = await supabase.rpc('increment_reaction', {
            p_course_id: courseId,
            p_reaction_type: reactionType,
        });

        if (error) throw error;

        // 獲取當前的數值並更新 UI
        const countElement = document.getElementById(`${reactionType}-count-${courseId}`);
        if (!countElement) {
            console.warn(`未找到更新元素: ${reactionType}-count-${courseId}`);
            return;
        }

        const currentCount = parseInt(countElement.innerText, 10) || 0; // 確保數字默認為 0
        countElement.innerText = `${currentCount + 1}人`;
    } catch (error) {
        console.error('更新反應計數失敗:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    // 綁定 "涼+1" 和 "硬+1" 按鈕
    const reactionButtons = document.querySelectorAll('.reaction-btn');
    reactionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const courseId = parseInt(button.getAttribute('data-course-id'), 10);
            const action = button.getAttribute('data-action'); // "cool" 或 "hard"

            if (!courseId || !action) {
                console.error('無效的按鈕屬性:', { courseId, action });
                return;
            }

            updateReaction(courseId, action); // 更新按鈕計數
        });
    });

    // 初始化所有課程的計數
    const { data: courses, error } = await supabase
        .from('courses') // 假設有課程表
        .select('id');

    if (error) {
        console.error('獲取課程列表失敗:', error);
    } else {
        for (const course of courses) {
            await initializeCounts(course.id); // 為每個課程初始化計數
        }
    }
});

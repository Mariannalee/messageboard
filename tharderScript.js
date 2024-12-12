// Menu 按鈕點擊動畫效果
function menuAnimation() {
    const items = document.querySelectorAll(".menu-item");
    items.forEach(item => {
        item.classList.toggle("clicked");
    });
}


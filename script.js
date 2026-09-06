document.addEventListener('DOMContentLoaded', () => {
    // 保存されている苗字・名前を入力欄にセット
    const savedSei = localStorage.getItem('dream_sei');
    const savedMei = localStorage.getItem('dream_mei');
    
    if (savedSei && document.getElementById('seiInput')) {
        document.getElementById('seiInput').value = savedSei;
    }
    if (savedMei && document.getElementById('meiInput')) {
        document.getElementById('meiInput').value = savedMei;
    }

    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
});

function saveName() {
    const seiInput = document.getElementById('seiInput');
    const meiInput = document.getElementById('meiInput');
    
    const sei = seiInput.value.trim() || 'ミョウジ';
    const mei = meiInput.value.trim() || 'ナマエ';
    
    localStorage.setItem('dream_sei', sei);
    localStorage.setItem('dream_mei', mei);
    
    alert('名前を「' + sei + ' ' + mei + '」に設定しました！');
    
    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
}

// ▼ ここを新しいものに差し替え！
let originalNovelHtml = null;

function updateNovelText() {
    const sei = localStorage.getItem('dream_sei') || 'ミョウジ';
    const mei = localStorage.getItem('dream_mei') || 'ナマエ';
    const novelContent = document.getElementById('novelContent');
    
    if (!novelContent) return;
    
    // 初回だけ、タグの中身（ルビや改行を含むHTML）を記憶する
    if (originalNovelHtml === null) {
        originalNovelHtml = novelContent.innerHTML;
    }
    
    // 記憶しておいたオリジナルに対して、[苗字] と [名前] を置き換える
    let convertedText = originalNovelHtml
        .replaceAll('[苗字]', sei)
        .replaceAll('[名前]', mei);
    
    // innerHTML を使って、<ruby> などのタグや改行を有効にする
    novelContent.innerHTML = convertedText;
}

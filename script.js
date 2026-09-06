document.addEventListener('DOMContentLoaded', () => {
    // works.htmlを開いたとき：保存されている名前を入力欄にセット
    const savedSei = localStorage.getItem('dream_sei');
    const savedMei = localStorage.getItem('dream_mei');
    
    if (savedSei && document.getElementById('seiInput')) {
        document.getElementById('seiInput').value = savedSei;
    }
    if (savedMei && document.getElementById('meiInput')) {
        document.getElementById('meiInput').value = savedMei;
    }

    // 小説ページを開いたとき：自動で本文の文字を変換する
    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
});

// works.htmlで「変換」ボタンを押したときの処理
function saveName() {
    const seiInput = document.getElementById('seiInput');
    const meiInput = document.getElementById('meiInput');
    
    if (!seiInput || !meiInput) return;

    const sei = seiInput.value.trim() || 'ミョウジ';
    const mei = meiInput.value.trim() || 'ナマエ';
    
    // ブラウザに名前を記憶させる
    localStorage.setItem('dream_sei', sei);
    localStorage.setItem('dream_mei', mei);
    
    // フォームの下に「○○に変換しました」を表示する
    const messageArea = document.getElementById('saveMessage');
    if (messageArea) {
        messageArea.textContent = `「${sei} ${mei}」に設定しました！`;
    }
}

// 小説本文の文字を置き換える関数
let originalNovelHtml = null;

function updateNovelText() {
    const sei = localStorage.getItem('dream_sei') || 'ミョウジ';
    const mei = localStorage.getItem('dream_mei') || 'ナマエ';
    const novelContent = document.getElementById('novelContent');
    
    if (!novelContent) return;
    
    // 初回だけ、ルビや改行を含む元のHTMLを記憶する
    if (originalNovelHtml === null) {
        originalNovelHtml = novelContent.innerHTML;
    }
    
    // [苗字] と [名前] を保存された名前に置き換える
    let convertedText = originalNovelHtml
        .replaceAll('[苗字]', sei)
        .replaceAll('[名前]', mei);
    
    novelContent.innerHTML = convertedText;
}

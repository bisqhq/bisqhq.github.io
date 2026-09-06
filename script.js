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

    // 小説本文のページであれば自動で変換を実行
    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
});

function saveName() {
    const seiInput = document.getElementById('seiInput');
    const meiInput = document.getElementById('meiInput');
    
    if (!seiInput || !meiInput) return;

    const sei = seiInput.value.trim() || 'ミョウジ';
    const mei = meiInput.value.trim() || 'ナマエ';
    
    // ローカルストレージに保存
    localStorage.setItem('dream_sei', sei);
    localStorage.setItem('dream_mei', mei);
    
    // ②③ 変換ボタンを押したときの「手ごたえ」と「メッセージ表示」
    const messageArea = document.getElementById('saveMessage');
    if (messageArea) {
        messageArea.textContent = `「${sei} ${mei}」に変換しました！`;
    }

    // アラートは邪魔になることが多いので削除し、代わりに画面内のテキストで分かりやすくする

    // 小説ページにいる場合は、即座に本文を書き換える
    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
}

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
    // ※ 注意: 実際の小説本文側の表記が 「[苗字]」「[名前]」 になっているか確認してください
    let convertedText = originalNovelHtml
        .replaceAll('[苗字]', sei)
        .replaceAll('[名前]', mei);
    
    // innerHTML を使って反映
    novelContent.innerHTML = convertedText;
}

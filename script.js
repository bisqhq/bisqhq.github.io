// ページが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', () => {
    // 保存されている名前があれば入力欄にセットする
    const savedName = localStorage.getItem('dream_name');
    const nameInput = document.getElementById('nameInput');
    if (savedName && nameInput) {
        nameInput.value = savedName;
    }

    // 小説ページの場合、名前変換を実行して表示する
    const novelContent = document.getElementById('novelContent');
    if (novelContent) {
        updateNovelText();
    }
});

// 名前の保存ボタンが押されたとき
function saveName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim() || '名無し'; // 未入力なら「名無し」
    localStorage.setItem('dream_name', name);
    alert('名前を「' + name + '」に設定しました！');
    
    // 小説ページにいる場合は即時反映
    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
}

// 本文中の 〇〇 を変換する関数
function updateNovelText() {
    const name = localStorage.getItem('dream_name') || '名無し';
    const novelContent = document.getElementById('novelContent');
    
    // 元のテキスト（HTMLから取得、またはJS内に持たせる）
    // ここではサンプルとして直接書き換えています
    let rawText = novelContent.getAttribute('data-text');
    
    // 記事内の「[名前]」という文字をすべて変換
    let convertedText = rawText.replaceAll('[名前]', name);
    
    novelContent.textContent = convertedText;
}

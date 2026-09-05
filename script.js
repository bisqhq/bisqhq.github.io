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
    
    const sei = seiInput.value.trim() || '山田';
    const mei = meiInput.value.trim() || '花子';
    
    localStorage.setItem('dream_sei', sei);
    localStorage.setItem('dream_mei', mei);
    
    alert('名前を「' + sei + ' ' + mei + '」に設定しました！');
    
    if (document.getElementById('novelContent')) {
        updateNovelText();
    }
}

function updateNovelText() {
    const sei = localStorage.getItem('dream_sei') || '山田';
    const mei = localStorage.getItem('dream_mei') || '花子';
    const novelContent = document.getElementById('novelContent');
    
    let rawText = novelContent.getAttribute('data-text');
    
    // [苗字] と [名前] をそれぞれ置き換える
    let convertedText = rawText.replaceAll('[苗字]', sei).replaceAll('[名前]', mei);
    
    novelContent.textContent = convertedText;
}

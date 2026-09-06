// ==========================================
// 1. ブログ記事のデータ（ここに新しい記事をどんどん追加していく！）
// ==========================================
const blogPosts = [
    {
        date: "2026.06.06",
        text: "新しいお話を追加しました！（<a href='../novel/novel37.html'>黒尾に告白される話</a>）<br>名前変換機能も無事に実装完了です。
            "
    },
    {
        date: "2026.06.01",
        text: "サイトをオープンしました。これから小説や日常の雑記をまとめていきます。よろしくお願いします。
            "
    },
    // ※3件目以降はここにカンマで追加していく
    // { date: "2026.05.25", text: "本文をここに書く..." }
];

// ==========================================
// 2. ページ送りや描画の仕組み
// ==========================================
let currentPage = 1;
const itemsPerPage = 10; // 1ページに表示する件数（10件を超えると自動でページが分かれます）

document.addEventListener('DOMContentLoaded', () => {
    renderUpdates();
});

function renderUpdates() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPosts = blogPosts.slice(startIndex, endIndex);

    // 記事リストのHTMLを生成（タイトルと追記を削除し、日付と本文のみに！）
    let postsHtml = '';
    if (currentPosts.length === 0) {
        postsHtml = '<div class="memo"><div class="memo-inner"><p>記事がありません。</p></div></div>';
    } else {
        currentPosts.forEach(post => {
            postsHtml += `
                <div class="memo">
                    <div class="memo-inner">
                        <span class="date">${post.date}</span><br><br>
                        <p>${post.text}</p>
                    </div>
                </div>
            `;
        });
    }

    // ページ送りボタンのHTMLを生成
    const totalPages = Math.ceil(blogPosts.length / itemsPerPage) || 1;
    let paginationHtml = '';
    
    // 「新しい記事へ」リンク
    if (currentPage > 1) {
        paginationHtml += `<a href="#" onclick="changePage(-1); return false;">&lt;&lt; next</a>`;
    } else {
        paginationHtml += `<span style="color: #ccc;">&lt;&lt; next</span>`;
    }

    paginationHtml += ` | ${currentPage} / ${totalPages} | `;

    // 「古い記事へ」リンク
    if (endIndex < blogPosts.length) {
        paginationHtml += `<a href="#" onclick="changePage(1); return false;">prev &gt;&gt;</a>`;
    } else {
        paginationHtml += `<span style="color: #ccc;">prev &gt;&gt;</span>`;
    }

    // main要素の中身を更新
    mainElement.innerHTML = `
        ${postsHtml}
        <div class="page">
            ${paginationHtml}
        </div>
    `;
}

// ページ切り替え用関数
function changePage(direction) {
    currentPage += direction;
    renderUpdates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

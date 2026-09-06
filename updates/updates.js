// ==========================================
// 1. ブログ記事のデータ（ここに新しい記事をどんどん追加していく！）
// ==========================================
const blogPosts = [
    {
        date: "2026.06.06",
        
        text: "黒尾に告白される話をアップしました！名前変換機能も無事に実装完了です。",
        
    },
    {
        date: "2026.06.01",
   
        text: "個人サイトを公開しました。これから小説や日常の雑記をまとめていきます。よろしくお願いします。",
 
    },
    // ※3件目以降はここにカンマで追加していく
];

// ==========================================
// 2. ページ送りや描画の仕組み
// ==========================================
let currentPage = 1;
const itemsPerPage = 10; // 1ページに表示する記事の数（ここで何件ごとに分けるか設定できます）

document.addEventListener('DOMContentLoaded', () => {
    renderUpdates();
});

function renderUpdates() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    // テンプレートの原型（HTMLファイルから「1記事分のブロック」と「ページ送り部分」を自動で保持・複製する）
    // 最初からHTMLに書いてあるタグをベースにします
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPosts = blogPosts.slice(startIndex, endIndex);

    // 記事リストのHTMLを生成
    let postsHtml = '';
    if (currentPosts.length === 0) {
        postsHtml = '<div class="memo"><div class="memo-inner"><p>記事がありません。</p></div></div>';
    } else {
        currentPosts.forEach(post => {
            postsHtml += `
                <div class="memo">
                    <div class="memo-inner">
                        <span class="date">${post.date}</span><br>
                        <p class="title">${post.title}</p>
                        <p>${post.text}</p>
                        <br>
                        <span class="readmore">${post.readmore}</span>
                    </div>
                </div>
            `;
        });
    }

    // ページ送りボタンのHTMLを生成
    const totalPages = Math.ceil(blogPosts.length / itemsPerPage) || 1;
    let paginationHtml = '';
    
    // 「前のページへ」リンク
    if (currentPage > 1) {
        paginationHtml += `<a href="#" onclick="changePage(-1); return false;">&lt;&lt; next</a>`;
    } else {
        paginationHtml += `<span style="color: #ccc;">&lt;&lt; next</span>`;
    }

    paginationHtml += ` | ${currentPage} / ${totalPages} ページ | `;

    // 「次のページへ」リンク
    if (endIndex < blogPosts.length) {
        paginationHtml += `<a href="#" onclick="changePage(1); return false;">prev &gt;&gt;</a>`;
    } else {
        paginationHtml += `<span style="color: #ccc;">prev &gt;&gt;</span>`;
    }

    // main要素の中身を、記事＋ページ送りに丸ごと置き換える
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

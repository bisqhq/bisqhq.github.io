// ==========================================
// 1. メモ・ブログ記事データ（新しい記事を上に追記していきます）
// ==========================================
const memoPosts = [
    {
        title: "新刊のお知らせと雑記",
        date: "2026.09.14",
        text: "秋のWebイベントに参加します！<br>新刊のサンプルをアップしました。",
        moreText: "ここが「続きを読む」を押した時に開く追記部分です。<br>長い文章やネタバレ感想などはここに入力できます。",
        clapUrl: "https://example.com/clap", // 拍手ページのURL
        formUrl: "https://example.com/form"  // お問い合わせページのURL
    },
    {
        title: "サイトを新しくしました",
        date: "2026.09.01",
        text: "GitHub Pagesにmemo（ログ）を移行しました！",
        moreText: "", // 追記がない場合は空欄にする
        clapUrl: "",
        formUrl: ""
    }
];

// ==========================================
// 2. 画面描画とページ送りの処理
// ==========================================
let currentPage = 1;
const itemsPerPage = 5; // 1ページに表示する記事数

$(function() {
    renderMemo();

    // ハンバーガーメニューの開閉挙動
    $('header span.lnr').click(function() {
        if ($(this).hasClass('lnr-menu')) {
            $('nav').addClass('active');
            $(this).removeClass('lnr-menu').addClass('lnr-cross');
        } else {
            $('nav').removeClass('active');
            $(this).removeClass('lnr-cross').addClass('lnr-menu');
        }
    });

    // PAGETOPボタンの挙動
    $('.top').click(function() {
        $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
    });
});

function renderMemo() {
    const container = $('#memo-container');
    container.empty();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPosts = memoPosts.slice(startIndex, endIndex);

    if (currentPosts.length === 0) {
        container.html('<section><p style="text-align:center;">記事がありません。</p></section>');
        return;
    }

    $.each(currentPosts, function(index, post) {
        // 追記（続きを読む）の有無を判定
        let moreHtml = '';
        if (post.moreText && post.moreText.trim() !== '') {
            moreHtml = `
                <p class="more">
                    <a href="javascript:void(0);" onclick="toggleMore(this)">続きを読む</a>
                </p>
            `;
        }

        // 各アイコンのリンク先
        const clapLink = post.clapUrl || 'javascript:void(0);';
        const formLink = post.formUrl || 'javascript:void(0);';

        const postHtml = `
            <section>
                <h2>${post.title}</h2>
                <p class="date">${post.date}</p>
                <main>
                    <p>${post.text}</p>
                    ${post.moreText ? `<div class="more-content">${post.moreText}</div>` : ''}
                    <div class="foot">
                        <p class="social">
                            <a href=""><span class="lnr lnr-smile"></span></a>
                            <a href="${clapLink}"><span class="lnr lnr-heart"></span></a>
                            <a href="${formLink}"><span class="lnr lnr-bubble"></span></a>
                        </p>
                        ${moreHtml}
                    </div>
                </main>
            </section>
        `;
        container.append(postHtml);
    });

    updatePagination(endIndex);
}

// 「続きを読む」の開閉処理
function toggleMore(element) {
    const $this = $(element);
    const $moreContent = $this.closest('main').find('.more-content');
    
    $moreContent.slideToggle(300, function() {
        if ($moreContent.is(':visible')) {
            $this.text('閉じる');
        } else {
            $this.text('続きを読む');
        }
    });
}

// ページ送りの更新（NEXT / PREV）
function updatePagination(endIndex) {
    // NEXT (古い記事へ進む)
    if (endIndex < memoPosts.length) {
        $('#btn-next').html(`<a href="javascript:void(0);" onclick="changePage(1)"><i>NEXT</i><span class="lnr lnr-arrow-left-circle"></span></a>`).removeClass('disabled');
    } else {
        $('#btn-next').html(`<i>NEXT</i><span class="lnr lnr-arrow-left-circle"></span>`).addClass('disabled');
    }

    // PREV (新しい記事へ戻る)
    if (currentPage > 1) {
        $('#btn-prev').html(`<a href="javascript:void(0);" onclick="changePage(-1)"><i>PREV</i><span class="lnr lnr-arrow-right-circle"></span></a>`).removeClass('disabled');
    } else {
        $('#btn-prev').html(`<i>PREV</i><span class="lnr lnr-arrow-right-circle"></span>`).addClass('disabled');
    }
}

// ページ切替動作
function changePage(direction) {
    currentPage += direction;
    renderMemo();
    $('body, html').animate({ scrollTop: 0 }, 300);
}

// ==========================================
// 3. 拍手ハートの連打アニメーション処理
// ==========================================
function animateClap(element) {
    const $btn = $(element);
    const $heart = $btn.find('.lnr-heart');

    // ぽよんアニメーション（クラスの付け外し）
    $heart.removeClass('bounce');
    // リフローを発生させてアニメーションを再動かすための記述
    void $heart[0].offsetWidth; 
    $heart.addClass('bounce');

    // 「+1」の数字が浮き上がるエフェクトを生成
    const $pop = $('<span class="clap-pop-num">+1</span>');
    $btn.append($pop);

    // アニメーションが終わったら要素を削除（0.6秒後）
    setTimeout(function() {
        $pop.remove();
    }, 600);
}

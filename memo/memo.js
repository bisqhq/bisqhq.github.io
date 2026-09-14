// ==========================================
// 0. Firebaseの初期化設定
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyC0TzyHi5D7yzpwy8mMXWAAv6eRPoVcjDs",
    authDomain: "memo-clap.firebaseapp.com",
    databaseURL: "https://memo-clap-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "memo-clap",
    storageBucket: "memo-clap.firebasestorage.app",
    messagingSenderId: "423068827849",
    appId: "1:423068827849:web:18b4db62aef819b94c8d18"
};

// Firebaseの初期化
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ==========================================
// 1. メモ・ブログ記事データ
// ==========================================
const memoPosts = [
    {
        id: "post-20260914",
        title: "新刊のお知らせと雑記",
        date: "2026.09.14",
        text: "秋のWebイベントに参加します！<br>新刊のサンプルをアップしました。",
        moreText: "ここが「続きを読む」を押した時に開く追記部分です。<br>長い文章やネタバレ感想などはここに入力できます。",
        formUrl: "https://wavebox.me/wave/bm4tc1fdf2s2zz8k/"
    },
    {
        id: "post-20260901",
        title: "サイトを新しくしました",
        date: "2026.09.01",
        text: "GitHub Pagesにmemo（ログ）を移行しました！",
        moreText: "",
        formUrl: ""
    }
];

// ==========================================
// 2. 画面描画とページ送りの処理
// ==========================================
let currentPage = 1;
const itemsPerPage = 5;

$(function() {
    renderMemo();

    // PAGETOP
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
        let moreHtml = '';
        if (post.moreText && post.moreText.trim() !== '') {
            moreHtml = `
                <p class="more">
                    <a href="javascript:void(0);" onclick="toggleMore(this)">続きを読む</a>
                </p>
            `;
        }

        const formLink = post.formUrl || 'https://wavebox.me/wave/bm4tc1fdf2s2zz8k/';

        const postHtml = `
            <section>
                <h2>${post.title}</h2>
                <p class="date">${post.date}</p>
                <main>
                    <p>${post.text}</p>
                    ${post.moreText ? `<div class="more-content">${post.moreText}</div>` : ''}
                    <div class="foot">
                        <p class="social">
                            <!-- スマイルアイコン（クリックでポップアップ＆イエロー持続） -->
                            <a href="javascript:void(0);" onclick="showSmileMessage(this)"><span class="lnr lnr-smile"></span></a>

                            <!-- ハートアイコン（クリックで拍手＋ピンク持続） -->
                            <a href="javascript:void(0);" class="clap-btn" onclick="animateClap(this, '${post.id}')"><span class="lnr lnr-heart"></span><span class="clap-count" id="count-${post.id}">0</span></a>

                            <!-- 吹き出しアイコン（クリックでWaveboxを別タブで開く＋黒色持続） -->
                            <a href="${formLink}" target="_blank" onclick="$(this).find('.lnr-bubble').addClass('active bounce');"><span class="lnr lnr-bubble"></span></a>
                        </p>
                        ${moreHtml}
                    </div>
                </main>
            </section>
        `;
        container.append(postHtml);

        // データベースから現在の拍手数をリアルタイム読み込み
        db.ref('claps/' + post.id).on('value', function(snapshot) {
            const count = snapshot.val() || 0;
            $(`#count-${post.id}`).text(count);
        });
    });

    updatePagination(endIndex);
}

// 続きを読むの開閉
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

// ページ送り
function updatePagination(endIndex) {
    if (endIndex < memoPosts.length) {
        $('#btn-next').html(`<a href="javascript:void(0);" onclick="changePage(1)"><i>NEXT</i><span class="lnr lnr-arrow-left-circle"></span></a>`).removeClass('disabled');
    } else {
        $('#btn-next').html(`<i>NEXT</i><span class="lnr lnr-arrow-left-circle"></span>`).addClass('disabled');
    }

    if (currentPage > 1) {
        $('#btn-prev').html(`<a href="javascript:void(0);" onclick="changePage(-1)"><i>PREV</i><span class="lnr lnr-arrow-right-circle"></span></a>`).removeClass('disabled');
    } else {
        $('#btn-prev').html(`<i>PREV</i><span class="lnr lnr-arrow-right-circle"></span>`).addClass('disabled');
    }
}

function changePage(direction) {
    currentPage += direction;
    renderMemo();
    $('body, html').animate({ scrollTop: 0 }, 300);
}

// ==========================================
// 3. 拍手ハートのアニメーション ＋ Firebase送信処理
// ==========================================
function animateClap(element, postId) {
    const $btn = $(element);
    const $heart = $btn.find('.lnr-heart');

    $heart.addClass('active');
    $heart.removeClass('bounce');
    void $heart[0].offsetWidth; 
    $heart.addClass('bounce');

    const $pop = $('<span class="clap-pop-num">+1</span>');
    $btn.append($pop);

    setTimeout(function() {
        $pop.remove();
    }, 600);

    // Firebaseに「+1」を送信
    db.ref('claps/' + postId).transaction(function(currentCount) {
        return (currentCount || 0) + 1;
    });
}

// ==========================================
// 4. スマイルアイコンの「今日のひとこと」処理
// ==========================================
const smileMessages = [
    "原稿がんばってます！✨",
    "今日のおやつはプリンでした🍮",
    "見に来てくれてありがとう！みかん🍊",
    "秋の気配がしてきましたね🍁",
    "進捗ダメです＼(^o^)／",
    "ポチッとありがとう！😊"
];

function showSmileMessage(element) {
    const $btn = $(element);
    const $smile = $btn.find('.lnr-smile');

    $smile.addClass('active');
    $smile.removeClass('bounce');
    void $smile[0].offsetWidth; 
    $smile.addClass('bounce');

    $btn.find('.smile-pop-bubble').remove();

    const randomMsg = smileMessages[Math.floor(Math.random() * smileMessages.length)];
    const $bubble = $(`<div class="smile-pop-bubble">${randomMsg}</div>`);
    $btn.append($bubble);

    setTimeout(function() {
        $bubble.remove();
    }, 2000);
}

// ==========================================
// 0. Firebaseの初期化設定
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyD9akRIqeCSudPy1x4KpkKZAh1u6fKrKzI",
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
        id: "post-20261029",
        date: "2026.10.29",
        text: "ぼやき",
        moreText: "Xがアカウントロックされたりずっとラベルを貼られていて普通の呟きすら恐々している状態が2週間以上も続いています。最近はWebイベであげていた絵の修正をしています。どうにも顔が気に入らず、なかなか完成しません。家族が立て続けに体調を崩しており、そんな状態からシームレスに私生活が忙しくなる時期に突入しそうで心休まりません。そんな近況。",
    },
    {
        id: "post-20261027",
        date: "2026.10.27",
        text: "第一印象最悪の状態から恋愛へ発展する男女が好きすぎる",
        moreText: "",
    },
    {
        id: "post-20261026",
        date: "2026.10.26",
        text: "またしても隠居をしに戻ってまいりました。定期的に訪れる隠居欲。絵の練習もですが、書きかけの小説も年内に書き上げられたらいいな〜とぽちぽち手をつけ始めました。果たして。",
        moreText: "",
    },
    {
        id: "post-20261018",
        date: "2026.10.18",
        text: "Webイベありがとうございました〜！楽しかった！",
        moreText: "",
    },
    {
        id: "post-20261017",
        date: "2026.10.17",
        text: "ついに本日Webイベです🎶楽しみ🎶",
        moreText: "",
    },
    {
        id: "post-20261012",
        date: "2026.10.12",
        text: "スマイルマークの内容を変えました。<br>〜10月12日までのは追記に。",
        moreText: "10月17～18日Webイベ出ます♪<br>イベ詳細はXをご確認ください♡<br>隣の♡は気軽に押してね～<br>なぜか家族が約ネバを観ている<br>Webイベで本出します～！人生初！<br>最近ドトールの牛乳たっぷりラテばかり飲んでる☕",
    },
    {
        id: "post-20261012",
        date: "2026.10.12",
        text: "サイトはやっぱり実家のような安心感がありとてもいい。",
        moreText: "",
    },
    {
        id: "post-20260922",
        date: "2026.09.22",
        text: "最近各SNSへのアクセスはPCのブラウザでのみしていたのだけど、なんとなくぼやきたいときのために出先でも触れる自サイトのサーバーのアプリを入れた。割と使いづらい。",
        moreText: "",
    },
    {
        id: "post-20260918",
        date: "2026.09.18",
        text: "爆裂に眠い。もしかしたら10月末には私生活が面白いほど忙しくなるかもしれず、気合十分だというのにも関わらず、とにかく眠たすぎる。",
        moreText: "",
    },
     {
        id: "post-20260916",
        date: "2026.09.16",
        text: "そんなわけで少し前にサーチに登録したり、たったいまブルスカに再掲していた小ネタの場所を作ったりなど。ちょこちょこ変えています。",
        moreText: "",
    },
    {
        id: "post-20260916",
        date: "2026.09.16",
        text: "実は、外部ツールを使っていつの記事に♡を何回押してくださったかがわかる。ぽちっとしてくださってうれしいです。",
        moreText: "追記機能も使っておこう。<br>とはいえ、あまりここを見てくださってる方はいらっしゃらないとも思うので今の素直なぼやきを。<br>またしてもSNSを整頓したい欲が出てきた。Xは自分の中での最適な距離感をつかめつつあるので、整頓するのであれば夢以外用の支部とブルスカを消すかもしれない。どうしてもその時々の最適化をし続けたい性分の為、不要と判断したものは保留にしておけない。ミニマルな人間なのである。",
    },
    {
        id: "post-20260915",
        date: "2026.09.15",
        text: "再録本を作るにあたって誤字脱字チェックをしているのだけど、自作を紙に印刷するというだけでも読み返す照れくささが倍増するような気がしている。",
        moreText: "",
    },
    {
        id: "post-20260914",
        date: "2026.09.14",
        text: "下のアイコンを押すとなんかかわいくなる仕様です。お試しあれ。スマイルのメッセージは気が向いたら変えます。",
        moreText: "",
    },
    {
        id: "post-20260914",
        date: "2026.09.14",
        text: "SNSを見る時間が激減して快適です。",
        moreText: "",
    }
];

// ==========================================
// 2. 画面描画とページ送りの処理
// ==========================================
let currentPage = 1;
const itemsPerPage = 10;

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
        $('#btn-next').html(`<a href="javascript:void(0);" onclick="changePage(1)"><i>NEXT</i><span class="lnr lnr-arrow-right-circle"></span></a>`).removeClass('disabled');
    } else {
        $('#btn-next').html(`<i>NEXT</i><span class="lnr lnr-arrow-right-circle"></span>`).addClass('disabled');
    }

    if (currentPage > 1) {
        $('#btn-prev').html(`<a href="javascript:void(0);" onclick="changePage(-1)"><i>PREV</i><span class="lnr lnr-arrow-left-circle"></span></a>`).removeClass('disabled');
    } else {
        $('#btn-prev').html(`<i>PREV</i><span class="lnr lnr-arrow-left-circle"></span>`).addClass('disabled');
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
    "Webイベありがとうございました🎶",
    "またイベント出たいな",
    "絵の修行をしています",
    "ガチアクタの続きが早く読みたい",
    "ずっとのんびりしていたい",
    "最近絵を描き始めました！きちんと描くのは人生初"
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

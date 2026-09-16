$(function() {
    const itemsPerPage = 10; // 1ページあたりの表示件数
    let postFiles = [];
    let currentPage = 1;
    let totalPages = 1;

    // 1. 記事リスト(posts.json)の読み込み
    $.getJSON('post/posts.json', function(data) {
        postFiles = data;
        totalPages = Math.ceil(postFiles.length / itemsPerPage);
        
        // 1ページ目を描画
        loadPage(1);
    }).fail(function() {
        $('#log-container').html('<p style="text-align:center;">記事リスト(post/posts.json)が読み込めませんでした。</p>');
    });

    // 2. 指定ページのMarkdown記事を取得して描画する関数
    function loadPage(page) {
        currentPage = page;
        const container = $('#log-container');
        container.empty().append('<p style="text-align:center; color:#888;">Loading...</p>');

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const targetFiles = postFiles.slice(startIndex, endIndex);

        if (targetFiles.length === 0) {
            container.html('<p style="text-align:center;">記事がありません。</p>');
            return;
        }

        // 非同期で該当ページの.mdファイルを一括読み込み
        const fetchPromises = targetFiles.map(filename => {
            return $.get(`post/${filename}`);
        });

        $.when.apply($, fetchPromises).done(function() {
            container.empty();

            // 引数が単一(1件)か複数(2件以上)かでjQueryのレスポンス構造が変わるのを補正
            const responses = targetFiles.length === 1 ? [arguments] : Array.from(arguments);

            responses.forEach(res => {
                const markdownContent = res[0];
                // markedライブラリを使ってMarkdownをHTML化
                const htmlContent = marked.parse(markdownContent);

                const $postBox = $('<div class="log-item"></div>').html(htmlContent);
                container.append($postBox);
            });

            // ページ送りボタンの更新
            updatePagination();

            // スクロールトップ
            $('body, html').animate({ scrollTop: 0 }, 300);

        }).fail(function() {
            container.html('<p style="text-align:center;">記事ファイルの読み込みに失敗しました。</p>');
        });
    }

    // 3. ページ送り（Prev / Next）の制御
    function updatePagination() {
        // Prev（新しい記事・前のページへ）
        if (currentPage > 1) {
            $('#btn-prev').replaceWith(`<a href="javascript:void(0);" id="btn-prev">prev</a>`);
            $('#btn-prev').off('click').on('click', function() {
                loadPage(currentPage - 1);
            });
        } else {
            $('#btn-prev').replaceWith(`<span id="btn-prev">prev</span>`);
        }

        // Next（古い記事・次のページへ）
        if (currentPage < totalPages) {
            $('#btn-next').replaceWith(`<a href="javascript:void(0);" id="btn-next">next</a>`);
            $('#btn-next').off('click').on('click', function() {
                loadPage(currentPage + 1);
            });
        } else {
            $('#btn-next').replaceWith(`<span id="btn-next">next</span>`);
        }
    }

    // TOPボタン
    $('#btn-top').on('click', function() {
        $('body, html').animate({ scrollTop: 0 }, 300);
    });
});

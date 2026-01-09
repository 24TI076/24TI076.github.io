// ============================================
// スライドショー機能
// ============================================

// 変数
const slide = document.getElementById('slide'); // スライドコンテナ
const prev = document.getElementById('prev'); // 前へボタン
const next = document.getElementById('next'); // 次へボタン
const indicator = document.getElementById('indicator'); // インジケーター
const lists = document.querySelectorAll('.list'); // インジケーターの各ドット
const totalSlides = lists.length; // スライドの総数
let count = 0; // 現在のスライド番号
let autoPlayInterval; // 自動再生のインターバルID

// 関数
function updateListBackground() {
    // インジケーターの色変更
    for (let i = 0; i < lists.length; i++) {
        lists[i].style.backgroundColor = (i === count % totalSlides) ? '#000' : '#fff';
    }
}

function prevClick() {
    // 前のスライドに戻る
    slide.classList.remove(`slide${count % totalSlides + 1}`);
    count--;
    if (count < 0) {
        count = totalSlides - 1;
    }
    slide.classList.add(`slide${count % totalSlides + 1}`);
    updateListBackground();
}

function nextClick() {
    // 次のスライドに進む
    slide.classList.remove(`slide${count % totalSlides + 1}`);
    count++;
    slide.classList.add(`slide${count % totalSlides + 1}`);
    updateListBackground();
}

function startAutoPlay() {
    // 自動再生を開始
    autoPlayInterval = setInterval(nextClick, 3000);
}

function resetAutoPlayInterval() {
    // 自動再生をリセット
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// イベントリスナー
prev.addEventListener('click', () => {
    prevClick();
    resetAutoPlayInterval();
});

next.addEventListener('click', () => {
    nextClick();
    resetAutoPlayInterval();
});

indicator.addEventListener('click', (event) => {
    // インジケーターがクリックされたら
    if (event.target.classList.contains('list')) {
        const index = Array.from(lists).indexOf(event.target);
        slide.classList.remove(`slide${count % totalSlides + 1}`);
        count = index;
        slide.classList.add(`slide${count % totalSlides + 1}`);
        updateListBackground();
        resetAutoPlayInterval();
    }
});

// 初期化
startAutoPlay();


// ============================================
// ページトップボタン機能
// ============================================

// 変数
const pageTopBtn = document.getElementById("pagetop"); // ページトップボタン
const scrollThreshold = 200; // ボタンを表示するスクロール位置の閾値（px）
let isScrolling; // スクロールイベントのデバウンス用タイマー

// 関数
function togglePageTopButton() {
    // ページトップボタンの表示/非表示を切り替え
    if (window.scrollY > scrollThreshold) {
        pageTopBtn.classList.add("visible");
    } else {
        pageTopBtn.classList.remove("visible");
    }
}

// イベントリスナー
window.addEventListener("scroll", function() {
    // スクロール時にデバウンス処理（パフォーマンス最適化）
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(function() {
        togglePageTopButton();
    }, 6);
});

pageTopBtn.addEventListener("click", function(e) {
    // ページトップボタンがクリックされたら
    e.preventDefault();
    window.scrollTo({ top: 0 });
});

// 初期化
togglePageTopButton();


// ============================================
// Booksセクション読み込み機能
// ============================================

// 変数
const booksContainer = document.getElementById('books-container');

// 関数
async function loadBooks() {
    // booksディレクトリ内のlist.jsonからファイルリストを取得
    try {
        const listResponse = await fetch('./books/list.json');
        if (!listResponse.ok) {
            const errorMsg = `list.jsonファイルの読み込みに失敗しました (HTTP ${listResponse.status})`;
            console.error(errorMsg);
            booksContainer.innerHTML = `<div class="mini-title"><p>${errorMsg}</p></div>`;
            return;
        }
        
        let fileList;
        try {
            fileList = await listResponse.json();
        } catch (parseError) {
            const errorMsg = 'list.jsonの形式が正しくありません（JSONのパースに失敗しました）';
            console.error(errorMsg, parseError);
            booksContainer.innerHTML = `<div class="mini-title"><p>${errorMsg}</p></div>`;
            return;
        }
        
        if (!Array.isArray(fileList)) {
            const errorMsg = 'list.jsonの形式が正しくありません（配列である必要があります）';
            console.error(errorMsg, fileList);
            booksContainer.innerHTML = `<div class="mini-title"><p>${errorMsg}</p></div>`;
            return;
        }
        
        if (fileList.length === 0) {
            booksContainer.innerHTML = '<div class="mini-title"><p>まだ本が登録されていません。list.jsonにファイル名を追加してください。</p></div>';
            return;
        }

        // 辞書順にソート
        const sortedFiles = [...fileList].sort();

        // 各ファイルを読み込んで表示
        for (const fileName of sortedFiles) {
            try {
                const response = await fetch(`./books/${fileName}`);
                if (!response.ok) {
                    console.warn(`ファイル ${fileName} が見つかりませんでした`);
                    continue; // 次のファイルへ
                }
                const text = await response.text();
                const bookTitle = fileName.replace(/\.(txt|md)$/i, ''); // 拡張子を除去してタイトルに
                
                const bookElement = document.createElement('div');
                bookElement.className = 'mini-title';
                bookElement.innerHTML = `
                    <h2>${bookTitle}</h2>
                    <p>${text.replace(/\n/g, '<br>')}</p>
                `;
                booksContainer.appendChild(bookElement);
            } catch (error) {
                console.error(`ファイル ${fileName} の読み込みに失敗しました:`, error);
            }
        }
    } catch (error) {
        console.error('list.jsonの読み込みに失敗しました:', error);
        booksContainer.innerHTML = '<div class="mini-title"><p>ファイルリストの読み込みに失敗しました。</p></div>';
    }
}

// 初期化
loadBooks();


// ============================================
// Codesセクション読み込み機能
// ============================================

// 変数
const codesContainer = document.getElementById('codes-container');

// 関数
async function loadCodes() {
    // codesディレクトリ内のlist.jsonからファイルリストを取得
    try {
        const listResponse = await fetch('./codes/list.json');
        if (!listResponse.ok) {
            codesContainer.innerHTML = '<div class="mini-title"><p>list.jsonファイルが見つかりませんでした。</p></div>';
            return;
        }
        const fileList = await listResponse.json();
        
        if (!Array.isArray(fileList) || fileList.length === 0) {
            codesContainer.innerHTML = '<div class="mini-title"><p>まだコードが登録されていません。</p></div>';
            return;
        }

        // 辞書順にソート
        const sortedFiles = [...fileList].sort();

        for (const fileName of sortedFiles) {
            try {
                const response = await fetch(`./codes/${fileName}`);
                if (!response.ok) {
                    console.warn(`ファイル ${fileName} が見つかりませんでした`);
                    continue;
                }
                const text = await response.text();
                const codeTitle = fileName; // ファイル名をそのまま使用（拡張子含む）
                
                // コード表示用の要素を作成
                const codeElement = document.createElement('div');
                codeElement.className = 'mini-title';
                codeElement.innerHTML = `
                    <h2>${codeTitle}</h2>
                    <pre class="code-text"><code>${escapeHtml(text)}</code></pre>
                `;
                codesContainer.appendChild(codeElement);
            } catch (error) {
                console.error(`ファイル ${fileName} の読み込みに失敗しました:`, error);
            }
        }
    } catch (error) {
        console.error('list.jsonの読み込みに失敗しました:', error);
        codesContainer.innerHTML = '<div class="mini-title"><p>ファイルリストの読み込みに失敗しました。</p></div>';
    }
}

// HTMLエスケープ関数（コード表示用）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初期化
loadCodes();


// ============================================
// Diaryセクション読み込み機能
// ============================================

// 変数
const diaryContainer = document.getElementById('diary-container');

// 関数
async function loadDiary() {
    // dialiesディレクトリ内のlist.jsonからファイルリストを取得
    try {
        const listResponse = await fetch('./dialies/list.json');
        if (!listResponse.ok) {
            diaryContainer.innerHTML = '<div class="mini-title"><p>list.jsonファイルが見つかりませんでした。</p></div>';
            return;
        }
        const fileList = await listResponse.json();
        
        if (!Array.isArray(fileList) || fileList.length === 0) {
            diaryContainer.innerHTML = '<div class="mini-title"><p>まだ日記が登録されていません。</p></div>';
            return;
        }

        // 辞書順にソート（新しい順に表示する場合はreverse()を追加）
        const sortedFiles = [...fileList].sort().reverse();

        for (const fileName of sortedFiles) {
            try {
                const response = await fetch(`./dialies/${fileName}`);
                if (!response.ok) {
                    console.warn(`ファイル ${fileName} が見つかりませんでした`);
                    continue;
                }
                const text = await response.text();
                // ファイル名から日付を抽出（例: 2026-01-07.txt → 1／7）
                const dateMatch = fileName.match(/(\d{4})-(\d{2})-(\d{2})/);
                let diaryTitle = fileName.replace(/\.(txt|md)$/i, ''); // デフォルトはファイル名（拡張子除去）
                
                // 日付形式のファイル名の場合、月/日の形式に変換
                if (dateMatch) {
                    const year = dateMatch[1]; // 年（使用しないが抽出）
                    const month = parseInt(dateMatch[2], 10); // 月
                    const day = parseInt(dateMatch[3], 10); // 日
                    diaryTitle = `${month}／${day}`; // 例: 1／7
                }
                
                const diaryElement = document.createElement('div');
                diaryElement.className = 'mini-title';
                diaryElement.innerHTML = `
                    <h2>${diaryTitle}</h2>
                    <p>${text.replace(/\n/g, '<br>')}</p>
                `;
                diaryContainer.appendChild(diaryElement);
            } catch (error) {
                console.error(`ファイル ${fileName} の読み込みに失敗しました:`, error);
            }
        }
    } catch (error) {
        console.error('list.jsonの読み込みに失敗しました:', error);
        diaryContainer.innerHTML = '<div class="mini-title"><p>ファイルリストの読み込みに失敗しました。</p></div>';
    }
}

// 初期化
loadDiary();

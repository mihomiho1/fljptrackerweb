document.addEventListener('DOMContentLoaded', async () => {
  await loadCosmeticsPage(); // 初期表示で最初のページを表示
});

let allCosmetics = []; // すべてのコスメティクスを格納する配列
let currentPage = 1; // 現在のページ
const itemsPerPage = 10; // 1ページに表示するアイテム数

// APIからコスメティクスを取得し、配列に保存
async function loadCosmeticsPage() {
  const resultsDiv = document.getElementById('results');

  // 読み込み中アニメーションを表示
  if (currentPage === 1) {
    resultsDiv.innerHTML = '<div class="loading">読み込み中...</div>';
  }

  try {
    const response = await fetch(
      `https://fortnite-api.com/v2/cosmetics?language=ja&page=${currentPage}&limit=${itemsPerPage}`,
    );

    if (!response.ok) {
      throw new Error(`APIリクエストが失敗しました: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 200 && Array.isArray(data.data.br)) {
      const cosmetics = data.data.br;
      allCosmetics = [...allCosmetics, ...cosmetics]; // 取得したデータを配列に追加
      displayItems(cosmetics); // 現在のページのアイテムを表示

      // 「もっと見る」ボタンを追加
      if (cosmetics.length === itemsPerPage) {
        addLoadMoreButton();
      }
    } else {
      resultsDiv.innerHTML = '<p>アイテムが見つかりませんでした。</p>';
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p>エラーが発生しました: ${error.message}</p>`;
  }
}

// アイテムを表示する
function displayItems(items) {
  const resultsContainer = document.getElementById('results');

  // 最初のページ以外では読み込み中アニメーションをクリア
  if (currentPage > 1) {
    document.querySelector('.loading').remove();
  }

  // 取得したアイテムをループで処理
  items.forEach((item) => {
    const iconUrl = item.images && item.images.icon ? item.images.icon : 'PS.png';

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <h3>ID：${item.id}</h3>
      <p><strong>説明:</strong> ${item.description}</p>
      <img src="${iconUrl}" alt="${item.name}" onerror="this.src='PS.png';">
    `;

    resultsContainer.appendChild(itemDiv);
  });
}

// 「もっと見る」ボタンを追加
function addLoadMoreButton() {
  const resultsContainer = document.getElementById('results');

  // 既にボタンが存在する場合は追加しない
  if (document.getElementById('load-more')) return;

  const loadMoreButton = document.createElement('button');
  loadMoreButton.id = 'load-more';
  loadMoreButton.textContent = 'もっと見る';
  loadMoreButton.addEventListener('click', () => {
    currentPage++; // 次のページを読み込む
    loadCosmeticsPage(); // 新しいページを取得して表示
  });

  resultsContainer.appendChild(loadMoreButton);
}

// 検索機能
function searchCosmetics() {
  const query = document.getElementById('query').value.toLowerCase();
  const resultsContainer = document.getElementById('results');

  resultsContainer.innerHTML = '<div class="searching">検索中...</div>';

  const filteredCosmetics = allCosmetics.filter(
    (item) =>
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );

  if (filteredCosmetics.length > 0) {
    displayItems(filteredCosmetics);
  } else {
    resultsContainer.innerHTML = '<p>アイテムが見つかりませんでした。</p>';
  }
}

// エンターキーによる検索
document.getElementById('query').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchCosmetics();
  }
});

// 検索ボタンがクリックされたときのデフォルト動作を防ぐ
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', async () => {
  await displayAllCosmetics(); // 初期表示で全コスメティクスを表示
});

let allCosmetics = []; // すべてのコスメティクスを格納する配列

async function displayAllCosmetics() {
  const resultsDiv = document.getElementById('results');

  // 読み込み中アニメーションを表示
  resultsDiv.innerHTML = '<div class="loading">読み込み中...</div>';

  try {
    // APIリクエスト
    const response = await fetch('https://fortnite-api.com/v2/cosmetics?language=ja');

    // レスポンスが正しいか確認
    if (!response.ok) {
      throw new Error(`APIリクエストが失敗しました: ${response.status}`);
    }

    const data = await response.json();

    // data配列を確認してから表示
    if (data.status === 200 && Array.isArray(data.data.br)) {
      allCosmetics = data.data.br; // 取得したコスメティクスを保存
      displayItems(allCosmetics); // 最初にすべてのコスメティクスを表示
    } else {
      resultsDiv.innerHTML = '<p>アイテムが見つかりませんでした。</p>';
    }
  } catch (error) {
    // エラーメッセージを表示
    resultsDiv.innerHTML = `<p>エラーが発生しました: ${error.message}</p>`;
  }
}

function displayItems(items) {
  const resultsContainer = document.getElementById('results');

  // 既存のアイテム表示をクリア
  resultsContainer.innerHTML = '';

  // 取得したアイテムをループで処理
  items.forEach((item) => {
    // 各アイテムの画像URLを設定。存在しない場合はデフォルト画像を使用
    const iconUrl = item.images && item.images.icon ? item.images.icon : 'PS.png';

    // アイテムをHTMLとして作成
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    // アイテムの内容を設定
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <h3>ID：${item.id}</h3>
      <p><strong>説明:</strong> ${item.description}</p>
      <img src="${iconUrl}" alt="${item.name}" onerror="this.src='PS.png';">
    `;

    // コンテナにアイテムを追加
    resultsContainer.appendChild(itemDiv);
  });
}

// 検索機能
function searchCosmetics() {
  const query = document.getElementById('query').value.toLowerCase(); // 検索キーワードを取得
  const resultsContainer = document.getElementById('results');

  // 検索中アニメーションを表示
  resultsContainer.innerHTML = '<div class="searching">検索中...</div>';

  // フィルタリング処理を行う
  const filteredCosmetics = allCosmetics.filter(
    (item) =>
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );

  // フィルタリングした結果が存在する場合は表示、存在しない場合はメッセージを表示
  if (filteredCosmetics.length > 0) {
    displayItems(filteredCosmetics); // フィルタリングした結果を表示
  } else {
    resultsContainer.innerHTML = '<p>アイテムが見つかりませんでした。</p>'; // アイテムが見つからない場合のメッセージ
  }
}

// エンターキーによる検索
document.getElementById('query').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    searchCosmetics(); // エンターキーが押されたら検索
  }
});

// 検索ボタンがクリックされたときのデフォルト動作を防ぐ
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault(); // デフォルトのフォーム送信を防ぐ
});

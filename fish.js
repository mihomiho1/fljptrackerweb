async function fetchFishList() {
  const apiUrl = 'https://fortniteapi.io/v1/loot/fish?lang=ja';
  const apiKey = '5ad61fd1-c149947d-1bb4a885-8cb8a6db';

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('魚データの取得に失敗しました');
    }

    const data = await response.json();
    displayFishList(data.fish);
  } catch (error) {
    console.error('エラー:', error);
  }
}

function displayFishList(fishArray) {
  const resultsContainer = document.getElementById('fish-results');
  resultsContainer.innerHTML = ''; // 既存のコンテンツをクリア

  fishArray.forEach((fish) => {
    const card = document.createElement('div');
    card.classList.add('fish-card');

    card.innerHTML = `
      <img src="${fish.image}" alt="${fish.name}" class="fish-image" />
      <h3>${fish.name}</h3>
      <p>${fish.description}</p>
      <p>回復量: ${fish.heal}</p>
      <p>最大スタック数: ${fish.maxStackSize}</p>
    `;

    resultsContainer.appendChild(card);
  });
}

// ページが読み込まれた後に、魚タブのクリックイベントを設定
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('a[href="#fishlist"]').addEventListener('click', () => {
    fetchFishList(); // 魚リストを取得
  });
});

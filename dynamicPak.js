let lastFetchTime = 0; // 最後にAPIを呼び出した時間
const fetchInterval = 30000; // 30秒（ミリ秒）

async function fetchDynamicKeys() {
  const currentTime = Date.now(); // 現在の時間を取得

  // 最後の呼び出しから30秒経っていない場合、警告を表示
  if (currentTime - lastFetchTime < fetchInterval) {
    const dynamicPakResults = document.getElementById('dynamic-pak-results');
    dynamicPakResults.innerHTML = '<h5>API呼び出しの回数制限が近づいています。\n APIの呼び出しは30秒に1回ですがあなたはそれ以上にAPIを呼び出しました。<h5>';
    return; // API呼び出しをスキップ
  }

  try {
    lastFetchTime = currentTime; // 最後の呼び出し時間を更新

    const response = await fetch('https://fortnitecentral.genxgames.gg/api/v1/aes');
    if (!response.ok) throw new Error('AES API fetch failed');
    const data = await response.json();

    const dynamicPakResults = document.getElementById('dynamic-pak-results');
    dynamicPakResults.innerHTML = ''; // 結果をリセット

    const displayedPakIds = new Set(); // 表示済みのPak IDを保持するセット

    // 各ファイルの情報を取得し、表示
    for (const file of data.dynamicKeys) {
      const match = file.name.match(/pakchunk(\d+)-WindowsClient\.utoc/);
      if (match) {
        const pakId = match[1];

        // すでに表示済みのPak IDか確認
        if (displayedPakIds.has(pakId)) {
          continue; // すでに表示されている場合はスキップ
        }
        displayedPakIds.add(pakId); // 新しいPak IDをセットに追加

        const cosmeticsResponse = await fetch(
          `https://fortnite-api.com/v2/cosmetics/br/search/all?dynamicPakId=${pakId}&language=ja`,
        );

        if (cosmeticsResponse.ok) {
          const cosmeticsData = await cosmeticsResponse.json();

          // ファイルごとのカードを作成
          const fileCard = document.createElement('div');
          fileCard.classList.add('file-card');
          fileCard.innerHTML = `<h3>${file.name}</h3>`;

          // アイテムを表示するためのコンテナ
          const itemContainer = document.createElement('div');
          itemContainer.classList.add('item-container'); // 横に5個並べるためのコンテナ

          // 各アイテムのカードを生成
          cosmeticsData.data.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-card');
            itemDiv.style.animationDelay = `${index * 0.1}s`; // アニメーションの遅延を設定

            itemDiv.innerHTML = `
              <img src="${item.images.icon}" alt="${item.name} アイコン" class="item-image" />
              <h4>${item.name}</h4>
              <p>ID: ${item.id}</p>
              <p>${item.description}</p>
            `;
            itemContainer.appendChild(itemDiv);
          });

          fileCard.appendChild(itemContainer);
          dynamicPakResults.appendChild(fileCard); // ファイルごとのカードを結果に追加
        } else {
          const errorDiv = document.createElement('div');
          errorDiv.classList.add('error');
          errorDiv.textContent = '';
          dynamicPakResults.appendChild(errorDiv);
        }
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = 'Pak IDを抽出できませんでした。';
        dynamicPakResults.appendChild(errorDiv);
      }
    }
  } catch (error) {
    console.error('Fetch Dynamic Keys Error:', error);
    document.getElementById('dynamic-pak-results').innerText =
      '複合化アイテムの取得中にエラーが発生しました。30秒後に再度読み込んでみてください。';
  }
}

// 複合化アイテムの詳細を取得する関数
function fetchCosmeticDetails(dynamicPakId) {
  const apiUrl = `https://fortnite-api.com/v2/cosmetics/br/search/all?dynamicPakId=${dynamicPakId}&language=ja`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        const results = data.data;
        const dynamicPakResults = document.getElementById('dynamic-pak-results');

        results.forEach((item) => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('item');
          itemElement.innerHTML = `
            <img src="${item.images.icon}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>ID: ${item.id}</p>
            <p>${item.description}</p>
          `;
          dynamicPakResults.appendChild(itemElement);
        });
      } else {
        console.error('Error fetching cosmetic details:', data);
      }
    })
    .catch((error) => console.error('Error fetching cosmetic details:', error));
}

function displayCosmetics(cosmetics) {
  const resultsContainer = document.getElementById('dynamic-pak-results');
  resultsContainer.innerHTML = ''; // 以前の結果をクリア

  if (cosmetics.length === 0) {
    resultsContainer.innerHTML = '<p>結果が見つかりませんでした。</p>';
    return;
  }

  cosmetics.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cosmetic-item');
    itemDiv.innerHTML = `
      <h3>${item.name}</h3>
      <p>ID: ${item.id}</p>
      <p>説明: ${item.description}</p>
      <img src="${item.images.icon}" alt="${item.name}アイコン" />
    `;
    resultsContainer.appendChild(itemDiv);
  });
}

async function fetchBattlePassItems() {
  const battlepassLoading = document.getElementById('battlepass-loading');
  const battlepassResults = document.getElementById('battlepass-results');

  battlepassLoading.style.display = 'block'; // ローディング表示
  battlepassResults.innerHTML = ''; // 前の結果をクリア

  try {
    const response = await fetch('https://fortniteapi.io/v2/battlepass?lang=ja&season=current', {
      headers: { Authorization: '5ad61fd1-c149947d-1bb4a885-8cb8a6db' },
    });
    const data = await response.json();

    if (!data.rewards || data.rewards.length === 0) {
      battlepassResults.innerHTML = 'バトルパスアイテムが見つかりません。';
      return;
    }

    data.rewards.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('battlepass-card');

      // 画像の取得
      const imageUrl = item.item.images?.full_background || item.item.images?.icon_background || '';
      const partOfText = item.item.set?.partOf ? `セット: ${item.item.set.partOf}` : 'セット: なし'; // partOfの処理

      card.innerHTML = `
                <img src="${imageUrl}" alt="${item.item.name}" />
                <h3>${item.item.name}</h3>
                <p>${item.item.description}</p>
                <p>${partOfText}</p>
                <p>${item.price.amount} バトルスター</p>
            `;

      battlepassResults.appendChild(card);
    });
  } catch (error) {
    console.error('Fetch Battle Pass Error:', error);
    battlepassResults.innerHTML = 'バトルパスアイテムの取得中にエラーが発生しました。';
  } finally {
    battlepassLoading.style.display = 'none'; // ローディング非表示
  }
}

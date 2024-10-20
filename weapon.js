async function fetchWeapons() {
  const loadingIndicator = document.getElementById('loading');
  const resultsContainer = document.getElementById('weapons-results');

  try {
    // ローディングインジケーターを表示
    loadingIndicator.style.display = 'flex';
    resultsContainer.innerHTML = ''; // 結果をリセット

    const response = await fetch('https://fortniteapi.io/v1/loot/list?lang=ja', {
      headers: {
        Authorization: '5ad61fd1-c149947d-1bb4a885-8cb8a6db',
      },
    });
    if (!response.ok) throw new Error('Weapon API fetch failed');

    const data = await response.json();
    const weapons = data.weapons; // APIからの武器データを取得

    if (weapons.length === 0) {
      resultsContainer.innerHTML = '<p>武器が見つかりませんでした。</p>';
      return;
    }

    weapons.forEach((weapon) => {
      const weaponDiv = document.createElement('div');
      weaponDiv.classList.add('weapon-item');
      weaponDiv.innerHTML = `
        <h3>${weapon.name}</h3>
        <p>ID: ${weapon.id}</p>
        <p>説明: ${weapon.description || '説明なし'}</p>
        <p>レアリティ: ${weapon.rarity}</p>
        <p>クリティカルダメージ: ${weapon.mainStats.DamageZone_Critical}</p>
        <p>ダメージ: ${weapon.mainStats.DmgPB}</p>
        <p>発射レート: ${weapon.mainStats.FiringRate} 発/秒</p>
        <p>リロード時間: ${weapon.mainStats.ReloadTime} 秒</p>
        <img src="${weapon.images.icon}" alt="${weapon.name}アイコン" />
      `;
      resultsContainer.appendChild(weaponDiv);
    });
  } catch (error) {
    console.error('Fetch Weapons Error:', error);
    resultsContainer.innerText = '武器情報の取得中にエラーが発生しました。';
  } finally {
    // ローディングインジケーターを非表示
    loadingIndicator.style.display = 'none';
  }
}

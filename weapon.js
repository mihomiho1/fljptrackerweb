async function fetchWeapons() {
  const loadingIndicator = document.getElementById('loading');
  const resultsContainer = document.getElementById('weapons-results');
  const searchInput = document.getElementById('search');

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

    // 重複アイテムを排除
    const uniqueWeapons = Array.from(new Set(weapons.map((weapon) => weapon.id))).map((id) =>
      weapons.find((weapon) => weapon.id === id),
    );

    if (uniqueWeapons.length === 0) {
      resultsContainer.innerHTML = '<p>武器が見つかりませんでした。</p>';
      return;
    }

    // 検索イベントの追加
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      displayWeapons(
        uniqueWeapons.filter(
          (weapon) =>
            weapon.id.toLowerCase().includes(searchTerm) ||
            weapon.name.toLowerCase().includes(searchTerm),
        ),
      );
    });

    // 初回表示
    displayWeapons(uniqueWeapons);
  } catch (error) {
    console.error('Fetch Weapons Error:', error);
    resultsContainer.innerText = '武器情報の取得中にエラーが発生しました。';
  } finally {
    // ローディングインジケーターを非表示
    loadingIndicator.style.display = 'none';
  }
}

// 武器情報を表示する関数
function displayWeapons(weapons) {
  const resultsContainer = document.getElementById('weapons-results');
  resultsContainer.innerHTML = ''; // 結果をリセット

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
      <p>${weapon.description || 'null'}</p>
      <p>レアリティ: ${weapon.rarity}</p>
      <p>クリティカルダメージ: ${weapon.mainStats.DamageZone_Critical}</p>
      <p>ダメージ: ${weapon.mainStats.DmgPB}</p>
      <p>発射レート: ${weapon.mainStats.FiringRate} 発/秒</p>
      <p>リロード時間: ${weapon.mainStats.ReloadTime} 秒</p>
      <img src="${weapon.images.background}" alt="${weapon.name}アイコン" />
    `;
    resultsContainer.appendChild(weaponDiv);
  });
}

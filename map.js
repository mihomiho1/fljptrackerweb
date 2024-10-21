async function fetchSeasons() {
  const url = 'https://fortniteapi.io/v1/seasons/list?lang=ja';
  const apiKey = '5ad61fd1-c149947d-1bb4a885-8cb8a6db';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('シーズンデータの取得に失敗しました');
    }

    const data = await response.json();
    return data.seasons; // シーズン情報を返す
  } catch (error) {
    console.error('エラー:', error);
    return [];
  }
}

async function populateSeasonDropdown() {
  const dropdown = document.getElementById('seasonSelect');
  // 読み込み中の表示を追加
  dropdown.innerHTML = `<option>読み込み中...</option>`;

  const seasons = await fetchSeasons();
  dropdown.innerHTML = ''; // 既存の選択肢をクリア

  // デフォルトの選択肢を追加
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- シーズンを選択 --';
  dropdown.appendChild(defaultOption);

  seasons.forEach((season) => {
    const option = document.createElement('option');
    option.value = season.displayName;
    option.textContent = season.displayName;
    dropdown.appendChild(option);
  });
}

async function handleSeasonChange() {
  const seasonName = document.getElementById('seasonSelect').value;
  const seasons = await fetchSeasons();
  const selectedSeason = seasons.find((season) => season.displayName === seasonName);

  if (!selectedSeason) {
    document.getElementById('map-results').innerHTML = '指定されたシーズンは見つかりませんでした。';
    return;
  }

  // バージョン入力フィールドをリセット
  document.getElementById('version-input').value = '';
}

async function searchMaps() {
  const resultsContainer = document.getElementById('map-results');
  // 読み込み中の表示を追加
  resultsContainer.innerHTML = `<div class="loading-spinner">読み込み中...</div>`;

  const seasonName = document.getElementById('seasonSelect').value;
  const versionInput = document.getElementById('version-input').value.trim();

  let maps = [];

  // シーズンが選択されている場合、マップを取得
  if (seasonName) {
    const seasons = await fetchSeasons();
    const selectedSeason = seasons.find((season) => season.displayName === seasonName);

    if (!selectedSeason) {
      resultsContainer.innerHTML = '指定されたシーズンは見つかりませんでした。';
      return;
    }

    const patchVersions = selectedSeason.patchList.map((patch) => patch.version);
    maps = await fetchMaps(patchVersions);
  } else {
    // シーズンが選択されていない場合、全マップを取得
    const allSeasons = await fetchSeasons();
    const allPatchVersions = allSeasons.flatMap((season) =>
      season.patchList.map((patch) => patch.version),
    );
    maps = await fetchMaps(allPatchVersions);
  }

  // バージョンでフィルタリング
  const filteredMaps = maps.filter(
    (map) => map.patchVersion === versionInput || versionInput === '',
  );

  displayMaps(filteredMaps);
}

async function fetchMaps(patchVersions) {
  const url = 'https://fortniteapi.io/v1/maps/list?lang=ja';
  const apiKey = '5ad61fd1-c149947d-1bb4a885-8cb8a6db';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('マップデータの取得に失敗しました');
    }

    const data = await response.json();
    return data.maps.filter((map) => patchVersions.includes(map.patchVersion));
  } catch (error) {
    console.error('エラー:', error);
    return [];
  }
}

function displayMaps(maps) {
  const resultsContainer = document.getElementById('map-results');
  resultsContainer.innerHTML = ''; // 既存のコンテンツをクリア

  if (maps.length === 0) {
    resultsContainer.innerHTML = '該当するマップは見つかりませんでした。';
    return;
  }

  maps.forEach((map) => {
    const card = document.createElement('div');
    card.classList.add('map-result');

    card.innerHTML = `
      <h3>バージョン: ${map.patchVersion}</h3>
      <p>${map.releaseDate}頃のマップ</p>
      <img src="${map.url}" alt="マップ画像" class="map-image" />
      <img src="${map.urlPOI}" alt="POIあり画像" class="map-image" />
      <a href="${map.url}" target="_blank">マップ画像を拡大</a>
      <a href="${map.urlPOI}" target="_blank" style="display:block; margin-top:5px;">POIあり画像を拡大</a>
    `;

    resultsContainer.appendChild(card);
  });
}

// ページ読み込み時にドロップダウンを初期化
window.onload = populateSeasonDropdown;

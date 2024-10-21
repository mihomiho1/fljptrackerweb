// エンターキーを押したときの処理
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ
    searchPreviousMap(); // 検索関数を呼び出す
  }
}

async function searchPreviousMap() {
  const patchVersion = document.getElementById('patchVersion').value;
  const url = `https://fortniteapi.io/v1/maps/list?lang=ja`;

  document.getElementById('map-results').innerHTML = '読み込み中...';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: '5ad61fd1-c149947d-1bb4a885-8cb8a6db', // APIキー
      },
    });
    const data = await response.json();

    // 検索対象のバージョンのインデックスを探す
    const maps = data.maps;
    const index = maps.findIndex((map) => map.patchVersion === patchVersion);

    if (index === -1) {
      document.getElementById('map-results').innerHTML =
        '指定されたバージョンは見つかりませんでした。';
      return;
    }

    // 現在のバージョン、前後のバージョンを取得
    const mapList = [];
    if (index > 0) mapList.push(maps[index - 1]); // 前のバージョン
    mapList.push(maps[index]); // 指定したバージョン
    if (index < maps.length - 1) mapList.push(maps[index + 1]); // 次のバージョン

    // 結果を表示
    document.getElementById('map-results').innerHTML = mapList
      .map(
        (map) => `
      <div class="map-result">
        <h3>バージョン: ${map.patchVersion}</h3>
        <p>${map.releaseDate}頃のマップ</p>
        <img src="${map.url}" alt="マップ画像" style="width:100%; height:auto; border-radius:8px;" />
        <img src="${map.urlPOI}" alt="POIあり画像" style="width:100%; height:auto; border-radius:8px; margin-top:10px;" />
        <a href="${map.url}" target="_blank">マップ画像を拡大</a>
        <a href="${map.urlPOI}" target="_blank" style="display:block; margin-top:5px;">POIあり画像を拡大</a>
      </div>
    `,
      )
      .join('');
  } catch (error) {
    console.error('Error fetching map data:', error);
    document.getElementById('map-results').innerHTML = 'マップ情報の取得に失敗しました。';
  }
}

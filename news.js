// ニュースを取得する関数
async function fetchNews() {
  try {
    const response = await fetch('https://fortnite-api.com/v2/news?language=ja');
    const result = await response.json();

    // ステータスコードが200であることを確認
    if (result.status !== 200) {
      throw new Error('APIエラー: ' + result.status);
    }

    // データの構造を確認
    const newsData = result.data;
    if (!newsData || !newsData.br || !newsData.br.motds) {
      throw new Error('不正なデータ形式です。');
    }

    // MOTD（メッセージ）を取得
    const motds = newsData.br.motds;

    // MOTDを表示するためのHTMLを生成
    const newsContainer = document.getElementById('news-results');
    newsContainer.innerHTML = ''; // 既存の内容をクリア
    motds.forEach((motd) => {
      const newsCard = document.createElement('div');
      newsCard.classList.add('news-card');

      const titleElement = document.createElement('h3');
      titleElement.textContent = motd.title;
      newsCard.appendChild(titleElement);

      const bodyElement = document.createElement('p');
      bodyElement.textContent = motd.body;
      newsCard.appendChild(bodyElement);

      const imageElement = document.createElement('img');
      imageElement.src = motd.image;
      imageElement.alt = motd.title; // 画像の代替テキスト
      newsCard.appendChild(imageElement);

      newsContainer.appendChild(newsCard);
    });
  } catch (error) {
    console.error('fetchNews:', error);
  }
}

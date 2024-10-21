async function fetchCalendar() {
  const loadingIndicator = document.getElementById('calendar-loading');
  const resultsContainer = document.getElementById('calendar-results');
  const modal = document.getElementById('event-modal');
  const modalContent = document.getElementById('modal-event-details');
  const closeModalBtn = document.querySelector('.close-modal');

  try {
    // ローディングインジケーターを表示
    loadingIndicator.style.display = 'flex';
    resultsContainer.innerHTML = ''; // 結果をリセット

    const response = await fetch('https://fortniteapi.io/v1/events/list?lang=ja&region=ASIA', {
      headers: {
        Authorization: '5ad61fd1-c149947d-1bb4a885-8cb8a6db',
      },
    });
    if (!response.ok) throw new Error('イベント情報の取得に失敗しました。');

    const data = await response.json();
    const events = data.events; // APIからイベントデータを取得

    if (events.length === 0) {
      resultsContainer.innerHTML = '<p>イベントが見つかりませんでした。</p>';
      return;
    }

    events.forEach((event, index) => {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('calendar-event');
      eventDiv.innerHTML = `
        <img src="${event.poster}" alt="${event.name_line1}" />
        <h3>${event.name_line1}${event.name_line2 || ''}</h3>
        <p>期間: ${new Date(event.beginTime).toLocaleString()} - ${new Date(
        event.endTime,
      ).toLocaleString()}</p>
        <p>${event.short_description || '説明なし'}</p>
        <p>プラットフォーム: ${event.platforms.join(', ')}</p>
      `;

      // イベントクリックでモーダル表示
      eventDiv.addEventListener('click', () => {
        modalContent.innerHTML = `
          <h2>${event.name_line1}${event.name_line2 || ''}</h2>
          <p>期間: ${new Date(event.beginTime).toLocaleString()} - ${new Date(
          event.endTime,
        ).toLocaleString()}</p>
          <p>${event.long_description || event.short_description || '説明なし'}</p>
          <div class="windows-container">
            ${event.windows
              .map(
                (window) => `
              <div class="window-card">
                <p>大会日程: ${new Date(window.beginTime).toLocaleString()} - ${new Date(
                  window.endTime,
                ).toLocaleString()}</p>
                <img src="${window.tileImage}" alt="" />
              </div>
            `,
              )
              .join('')}
          </div>
        `;
        modal.style.display = 'flex'; // モーダルを表示
        modalContent.classList.add('modal-show');
      });

      resultsContainer.appendChild(eventDiv);
    });

    // モーダルを閉じる処理
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modalContent.classList.remove('modal-show');
    });

    // モーダル外クリックで閉じる処理
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        modalContent.classList.remove('modal-show');
      }
    });
  } catch (error) {
    console.error('Fetch Calendar Error:', error);
    resultsContainer.innerText = 'カレンダー情報の取得中にエラーが発生しました。';
  } finally {
    loadingIndicator.style.display = 'none'; // ローディングインジケーターを非表示
  }
}

// イベントの詳細をモーダルウィンドウ形式で表示
function showEventDetails(event) {
  const modal = document.getElementById('event-modal');
  const modalContent = modal.querySelector('.modal-content');

  // name_line1とname_line2を連結
  const eventName = `${event.name_line1} ${event.name_line2 || ''}`.trim();

  // モーダルウィンドウの内容を設定
  modalContent.innerHTML = `
    <h2>${eventName}</h2>
    <p>期間: ${new Date(event.beginTime).toLocaleString()} - ${new Date(
    event.endTime,
  ).toLocaleString()}</p>
    <p>${event.long_description || '詳細なし'}</p>
    <p>プラットフォーム: ${event.platforms.join(', ')}</p>
    <div class="windows-container">
      <h3>大会日程</h3>
      ${event.windows
        .map(
          (window) => `
          <div class="window-card">
            <p>日程: ${new Date(window.beginTime).toLocaleString()} - ${new Date(
            window.endTime,
          ).toLocaleString()}</p>
            <img src="${window.tileImage}" alt="" />
          </div>`,
        )
        .join('')}
    </div>
  `;

  // モーダルを表示
  modal.style.display = 'block';
  modalContent.classList.add('modal-show'); // アニメーションクラスを追加
  
  // モーダルの閉じるボタンのイベントリスナー
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
    modalContent.classList.remove('modal-show'); // アニメーションクラスをリセット
  });
}

// タブがアクティブになったときに表示を切り替える
document.querySelectorAll('.tabs a').forEach((tab) => {
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = tab.getAttribute('href');

    document.querySelectorAll('section').forEach((section) => {
      section.style.display = 'none';
    });

    document.querySelectorAll('.tabs a').forEach((link) => {
      link.classList.remove('active');
    });

    tab.classList.add('active');
    const targetSection = document.querySelector(targetId);
    targetSection.style.display = 'block';

    if (targetId === '#calendar') {
      fetchCalendar();
    }
  });
});

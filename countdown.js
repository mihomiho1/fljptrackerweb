document.addEventListener('DOMContentLoaded', function () {
  // シーズン終了のカウントダウン
  initializeCountdown('countdown1', '2024-12-01T15:00:00');

  // 次のアップデートのカウントダウン
  initializeCountdown('countdown2', '2024-11-12T15:00:00');

  // チャプター6のカウントダウン
  initializeCountdown('countdown3', '2024-12-01T21:00:00');

  // チャプター6の最初のアップデートカウントダウン
  initializeCountdown('countdown4', '2024-12-10T17:00:00');
});

function initializeCountdown(elementId, endTime) {
  const countdownElement = document.getElementById(elementId);

  function updateCountdown() {
    const now = new Date().getTime();
    const targetTime = new Date(endTime).getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      countdownElement.innerHTML = '';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <span class="time-unit days">${days}</span>
      <span class="time-unit-label">日</span>
      <span class="time-unit hours">${hours}</span>
      <span class="time-unit-label">時間</span>
      <span class="time-unit minutes">${minutes}</span>
      <span class="time-unit-label">分</span>
      <span class="time-unit seconds">${seconds}</span>
      <span class="time-unit-label">秒</span>
    `;
  }

  setInterval(updateCountdown, 1000); // 1秒ごとにカウントダウンを更新
}

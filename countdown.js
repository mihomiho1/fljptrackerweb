document.addEventListener('DOMContentLoaded', function () {
  // 11月2日15時までのカウントダウン
  initializeCountdown('countdown1', '2024-11-02T15:00:00');

  // 次のアップデート（2024年10月29日17時まで）のカウントダウン
  initializeCountdown('countdown2', '2024-10-29T17:00:00');

});

function initializeCountdown(elementId, endTime) {
  const countdownElement = document.getElementById(elementId);

  function updateCountdown() {
    const now = new Date().getTime();
    const targetTime = new Date(endTime).getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      countdownElement.innerHTML = '終了しました';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
  }

  setInterval(updateCountdown, 1000); // 1秒ごとにカウントダウンを更新
}

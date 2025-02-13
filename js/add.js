const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("min");
const seconds = document.getElementById("sec");

const timerSet = new Date(2025, 1, 17, 0, 0, 0);

function updateCountDown(){
  const currentTime = new Date();
  const diff = timerSet - currentTime;
  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  const h = Math.floor(diff / 1000 / 60 / 60 ) % 24;
  const m = Math.floor(diff / 1000 / 60 ) % 60;
  const s = Math.floor(diff / 1000) % 60;

  days.innerHTML = d;
  hours.innerHTML = h < 10 ? '0'+ h : h;
  minutes.innerHTML = m < 10 ? '0'+ m : m;
  seconds.innerHTML = s < 10 ? '0'+ s : s;
}
setInterval(updateCountDown,1000)


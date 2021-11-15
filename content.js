let docLoaded = false;

const createButtons = () => {
  let title = document.querySelector(".btns__1OeZ");
  if (!title) {
    title = document.querySelector(".editor-popover");
  }

  const $startButton = document.createElement("button");
  const $pauseButton = document.createElement("button");

  const $timerH2 = document.createElement("h2");
  $startButton.classList = "generated_class";

  $startButton.innerHTML = "Start";
  $pauseButton.innerHTML = "Pause";

  const btnCSS = {
    border: "none",
    backgroundColor: "#03AD1E",
    padding: "4px 32px 4px 32px",
    color: "white",
    marginLeft: 20,
  };
  const pauseBtnCSS = {
    border: "none",
    backgroundColor: "#6E8898",
    padding: "4px 32px 4px 32px",
    color: "white",
    marginLeft: 20,
    visibility: "hidden",
  };
  Object.assign($startButton.style, btnCSS);
  Object.assign($pauseButton.style, pauseBtnCSS);

  const timerCSS = {
    margin: "0px 20px 0px 20px",
  };
  Object.assign($timerH2.style, timerCSS);
  title.parentNode.insertBefore($startButton, title);
  title.parentNode.insertBefore($pauseButton, title);
  title.parentNode.insertBefore($timerH2, title);

  return [$startButton, $pauseButton, $timerH2];
};

const removeNavBar = () => {
  const navbar =
    document.getElementById("navbar-root") ||
    document.querySelector(".header__3STC");
  if (navbar) {
    navbar.remove();
  }
};

const startTimer = (totalTime, $timerH2, done) => {
  let timerInterval = setInterval(() => {
    let [min, sec] = updateCountDown(totalTime);

    if (parseInt(min) === 0 && parseInt(sec) === 0) {
      clearInterval(timerInterval);
    }
    let time = min + " : " + sec;
    if (parseInt(min) < 10 && !done) {
      $timerH2.style.color = "red";
      done = true;
    }

    $timerH2.innerHTML = time;
  }, 1000);
  return [timerInterval, done];
};

const doStuff = () => {
  if (document.querySelector(".generated_class")) {
    return;
  }

  let [$startButton, $pauseButton, $timerH2] = createButtons();

  let timerInterval = null;
  let totalTime = null;
  let pausedAtThisTime = null;
  let done = false;
  $startButton.addEventListener("click", () => {
    if ($startButton.innerHTML === "Stop") {
      $pauseButton.style.visibility = "hidden";
      $pauseButton.innerHTML = "Pause";
      $pauseButton.style.backgroundColor = "#6E8898";

      clearInterval(timerInterval);
      timerInterval = null;
      $timerH2.innerHTML = "";
      $startButton.style.backgroundColor = "#03AD1E";
      $startButton.innerHTML = "Start";
    } else {
      if (!timerInterval) {
        $pauseButton.style.visibility = "visible";

        done = false;
        $startButton.style.backgroundColor = "#ff7477";
        $startButton.innerHTML = "Stop";
        $timerH2.innerHTML = "30:00";

        totalTime = Date.now() + 30 * 60 * 1000 + 200;

        [timerInterval, done] = startTimer(totalTime, $timerH2, done);
      }
    }
  });
  $pauseButton.addEventListener("click", () => {
    if ($pauseButton.innerHTML === "Resume") {
      $pauseButton.style.backgroundColor = "#6E8898";

      $pauseButton.innerHTML = "Pause";
      totalTime = totalTime + Date.now() - pausedAtThisTime + 1000;
      [timerInterval, done] = startTimer(totalTime, $timerH2, done);
    } else {
      pausedAtThisTime = Date.now();
      clearInterval(timerInterval);
      $pauseButton.innerHTML = "Resume";
      $pauseButton.style.backgroundColor = "#1D3354";
    }
  });
};

const updateCountDown = (totalTime) => {
  let currentTime = Date.now();
  let diff = totalTime - currentTime;
  let min = `${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}`;
  let sec = `${Math.floor((diff % (1000 * 60)) / 1000)}`;
  sec = sec.length == 1 ? `0${sec}` : sec;
  min = min.length == 1 ? `0${min}` : min;
  return [min, sec];
};

let k = 0;

const start = (n) => {
  let repeated = 0;
  k = setInterval(() => {
    let m = n;

    repeated++;
    docLoaded =
      document.querySelector(".btns__1OeZ") ||
      document.querySelector(".editor-popover");
    if (docLoaded) {
      clearInterval(k);
      doStuff();
    }
    if (repeated > 10) {
      clearInterval(k);
      repeated = 0;
    }
  }, 1000);
};
start(1);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "CHANGED") {
    console.log("Yes");
    clearInterval(k);
    start(12);
  }
});

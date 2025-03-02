// Function to hide all screens and show only the selected one
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
  }
  
  // ======== Game Code ========
  
  const URL = 'https://teachablemachine.withgoogle.com/models/rVWTvKLNQ/';
  let model, webcam, labelContainer, maxPredictions;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  let currentFacingMode = "user";
  let scores = { cans: 0, plastic: 0, glass: 0, paper: 0, cardboard: 0 };
  
  function loadScores() {
    const savedScores = localStorage.getItem("scores");
    if (savedScores) {
      scores = JSON.parse(savedScores);
      updateScoreboard();
    }
  }
  
  function updateScoreboard() {
    document.getElementById('score-cans').textContent = scores.cans;
    document.getElementById('score-plastic').textContent = scores.plastic;
    document.getElementById('score-glass').textContent = scores.glass;
    document.getElementById('score-paper').textContent = scores.paper;
    document.getElementById('score-cardboard').textContent = scores.cardboard;
    const total = scores.cans + scores.plastic + scores.glass + scores.paper + scores.cardboard;
    document.getElementById('score-total').textContent = total;
    localStorage.setItem("scores", JSON.stringify(scores));
  }
  
  async function submitScore(playerName, score) {
    try {
      await firebase.firestore().collection("leaderboard").add({
        name: playerName,
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("Score submitted!");
    } catch (error) {
      console.error("Error submitting score: ", error);
    }
  }
  
  async function loadLeaderboard() {
    try {
      const leaderboardRef = firebase.firestore().collection("leaderboard").orderBy("score", "desc").limit(10);
      const snapshot = await leaderboardRef.get();
      let leaderboardHtml = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        leaderboardHtml += `<li>${data.name}: ${data.score}</li>`;
      });
      document.getElementById("leaderboard-list").innerHTML = leaderboardHtml;
    } catch (error) {
      console.error("Error loading leaderboard: ", error);
    }
  }
  
  async function init() {
    loadScores();
    console.log("Initializing model and webcam...");
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("Model loaded with", maxPredictions, "classes.");
    await initWebcam();
  
    labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      const barContainer = document.createElement('div');
      barContainer.classList.add('label-bar');
      const barFill = document.createElement('div');
      barFill.classList.add('label-bar-fill');
      const barText = document.createElement('div');
      barText.classList.add('label-text');
      barText.innerHTML = "";
      barContainer.appendChild(barFill);
      barContainer.appendChild(barText);
      labelContainer.appendChild(barContainer);
    }
    window.requestAnimationFrame(loop);
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('capture-btn').style.display = 'inline-block';
  }
  
  async function initWebcam() {
    const flip = true;
    const width = 200;
    const height = 200;
    if (webcam) {
      webcam.stop();
      document.getElementById("webcam-container").innerHTML = "";
    }
    webcam = new tmImage.Webcam(width, height, flip, currentFacingMode);
    await webcam.setup();
    if (isMobile) {
      document.getElementById('webcam-container').appendChild(webcam.webcam);
      const webCamVideo = document.getElementsByTagName('video')[0];
      webCamVideo.setAttribute("playsinline", true);
      webCamVideo.muted = "true";
      webCamVideo.style.width = width + 'px';
      webCamVideo.style.height = height + 'px';
    } else {
      document.getElementById("webcam-container").appendChild(webcam.canvas);
    }
    webcam.play();
  }
  
  async function toggleCamera() {
    if (!isMobile) {
      console.log("Toggle camera is disabled on desktop devices.");
      return;
    }
    if (webcam) {
      webcam.stop();
    }
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
    await initWebcam();
  }
  
  async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }
  
  async function predict() {
    let prediction;
    if (isMobile) {
      prediction = await model.predict(webcam.webcam);
    } else {
      prediction = await model.predict(webcam.canvas);
    }
    for (let i = 0; i < maxPredictions; i++) {
      const probability = prediction[i].probability;
      const percentage = (probability * 100).toFixed(0);
      const barContainer = labelContainer.childNodes[i];
      const barFill = barContainer.querySelector('.label-bar-fill');
      const barText = barContainer.querySelector('.label-text');
      barFill.style.width = percentage + '%';
      barText.innerHTML = prediction[i].className + ': ' + percentage + '%';
    }
  }
  
  async function capture() {
    console.log("Capture button clicked.");
    document.getElementById('capture-btn').style.display = 'none';
    try {
      const photoUri = webcam.canvas.toDataURL("image/jpeg", 0.7);
      console.log("Captured photo URI:", photoUri);
      document.getElementById('captured-image').src = photoUri;
  
      const tempImg = new Image();
      tempImg.src = photoUri;
      tempImg.onload = async function() {
        const prediction = await model.predict(tempImg);
        let bestResult = prediction[0];
        for (let i = 1; i < prediction.length; i++) {
          if (prediction[i].probability > bestResult.probability) {
            bestResult = prediction[i];
          }
        }
        const percentage = Math.round(bestResult.probability * 100);
        document.getElementById('result-text').textContent = "This object is an " + bestResult.className + " (" + percentage + "%)";
        document.getElementById('modal').style.display = 'block';
  
        const category = bestResult.className.toLowerCase();
        if (scores.hasOwnProperty(category)) {
          scores[category]++;
        }
        updateScoreboard();
  
        const playerName = localStorage.getItem("playerName") || "Anonymous";
        const totalScore = scores.cans + scores.plastic + scores.glass + scores.paper + scores.cardboard;
        await submitScore(playerName, totalScore);
        loadLeaderboard();
      };
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('capture-btn').style.display = 'inline-block';
  }
  
  window.onload = function() {
    if (!isMobile) {
      document.getElementById("toggle-camera").style.display = "none";
    }
    const storedName = localStorage.getItem("playerName");
    if (!storedName) {
      const playerName = prompt("Please enter your nickname:");
      localStorage.setItem("playerName", playerName ? playerName : "Anonymous");
    }
  };
  
# Recyclable.io

Recyclable.io is a fun, interactive application that uses your device’s webcam and a Machine image model to identify recyclable objects. Score points by collecting items such as cans, plastic, glass, paper, and cardboard—and see how you stack up against players from around the world on a realtime global leaderboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview

Recyclable.io combines modern web technologies like HTML, CSS, and JavaScript with Firebase and TensorFlow.js to deliver an engaging experience. Players can:

- Start the game on their device with a simple click.
- Use their webcam to capture images of objects.
- Get realtime feedback on what recyclable category the object belongs to.
- See their scores update locally and submit them to a global leaderboard that updates in realtime.
- Switch between front and back cameras on mobile devices for a flexible experience.

We are at www.recyclables.life or idyllic-biscuit-383a62.netlify.app  

## Features

- **Realtime Global Leaderboard:**  
  Uses Firebase Firestore’s realtime listeners to instantly update and display scores from all players.
  
- **Teachable Machine Integration:**  
  Loads a team trained Teachable Machine model to recognize recyclable objects via the device’s webcam.
  
- **Responsive Design:**  
  A simple home screen, about section, and game screen with smooth transitions and mobile-friendly controls.
  
- **Camera Toggle for Mobile:**  
  Allows users to switch between front and back cameras (when supported).

## Technology Stack

- **Frontend:**  
  HTML, CSS
- **Machine Learning:**  
  [TensorFlow.js](https://www.tensorflow.org/js) and [Teachable Machine Image Model](https://teachablemachine.withgoogle.com/)
- **Backend/Realtime Database:**  
  JavaScript [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Hosting:**  
  Netlify

## Setup & Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Nihyli/Recyclable.io.git
   cd recyclable.io
   ```

2. **Configure Firebase:**

   The Firebase configuration is included in the code. If you want to use your own Firebase project, update the `firebaseConfig` object in `script.js` with your project's settings.

3. **Install Dependencies (Optional):**

   This project is built as a static web application, so there are no dependencies to install unless you want to use a build tool.

4. **Deploy Locally:**

   Open `index.html` in your browser. For a complete local test with all Firebase functionality, it’s recommended to use a local server (for example, via the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code).

## Usage

- **Home Screen:**  
  Launch the app, and you’ll see the home screen featuring a large recycle emoji, the game name, and buttons to play or read about the project.

- **Game Screen:**  
  Once you click “Play,” the game screen is displayed.  
  - Click **"Start Webcam"** to initialize the camera.
  - After the camera starts, the **"Capture"** button will appear.
  - On mobile, you can also toggle between front and back cameras.
  - Capture images of recyclable objects, and see realtime predictions and your updated score.
  
- **Global Leaderboard:**  
  Your score is submitted to Firebase and the global leaderboard is updated in realtime for all users.

- **About Screen:**  
  Provides background information about the project and a button to navigate back to the home screen.


## Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests with improvements or new features. Please open an issue first to discuss what you would like to change.



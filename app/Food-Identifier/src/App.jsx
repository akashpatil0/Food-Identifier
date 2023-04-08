import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // go do sum tings with the img here
  }

  const handleCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true})
      setMediaStream(stream)
    } catch(error) {
      console.error('camera function error here: ', error)
    }
  }

  const handleCapture = () => {
    const video = document.createElement('video')
    video.srcObject = MediaStream
    video.play()

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageUrl = canvas.toDataURL('image/jpeg')
  }

  return (
    <div className="App">
      <h1>give us a pic</h1>

      <div className="upload-btn">
<<<<<<< HEAD
        <input
          type="file"
          accept=".jpeg, .jpg"
          onChange={(event) => {
            const file = event.target.files[0];
          }}
        />
      </div>
=======
       <input type = "file" accept='.jpeg, .jpg' onChange={handleImageUpload}/>
      </div>
      
      {/* <button className='camera-btn' onClick={handleCameraPermission}>
        Use Camera
      </button>

      <button className='camera-btn' onClick={handleCapture}>
        Take Pic
      </button>  */}
     
>>>>>>> 7c5f1c661f7b795603caf675a627dc431cfc8b1b
    </div>
  );
}

export default App;

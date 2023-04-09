import { useState, useRef, useCallback, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NutritionFacts from "./NutritionFacts";
import Webcam from "react-webcam";

function App() {
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // go do sum tings with the img here
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);

  const videoConstraints = {
    width: 720,
    height: 480,
    imageSmoothing: true,
  };

  return (
    <div className="App">
      <h1>give us a pic</h1>

      <div className="upload-btn">
        <input
          type="file"
          accept=".jpeg, .jpg"
          onChange={(event) => {
            const file = event.target.files[0];
          }}
        />
      </div>
      <input type="file" accept=".jpeg, .jpg" onChange={handleImageUpload} />
      <NutritionFacts />
      <div className="Container">
        {img === null ? (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
          </>
        ) : (
          <>
            <img src={img} alt="screenshot" />
            <button onClick={() => setImg(null)}>Retake</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

import { useState, useRef, useCallback, useEffect } from "react";

import "./App.css";
import NutritionFacts from "./NutritionFacts";
import Webcam from "react-webcam";

function App() {
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);

  const getArray = (file) => {
    const reader = new FileReader()

    reader.onload = () => {
      const byteArray = new Uint8Array(reader.result)
      console.log(byteArray)
    }
    reader.readAsArrayBuffer(file) 
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    getArray(file)
  } 

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot() 
    setImg(imageSrc) 
    const reader = new FileReader();
  reader.onload = () => {
    const byteArray = new Uint8Array(reader.result);
    console.log(byteArray);
  };
  reader.readAsArrayBuffer(fetch(imageSrc).then(res => res.blob()));
  }, [webcamRef]) 

  const videoConstraints = {
    width: 720,
    height: 480,
    imageSmoothing: true,
  } 

  return (
    <div className="App">
      <h1>give us a pic</h1>

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

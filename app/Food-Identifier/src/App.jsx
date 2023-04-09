import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

import "./App.css";
import NutritionFacts from "./NutritionFacts";
import Webcam from "react-webcam";

function App() {
  const [img, setImg] = useState(null);
  const [imgArray, setImgArray] = useState(null);
  const webcamRef = useRef(null);

  useEffect(()=>{
    const fetch = async ()=>{
        const data = await axios.post(
          "http://129.2.192.66:8080/prediction",
          {
            image: [1,2,3]
          }
        );
        console.log(data);
      }   
    
    

    fetch(imgArray);
  },[imgArray])

  const getArray = (file) => {
    const reader = new FileReader()

    reader.onload = () => {
      const byteArray = new Uint8Array(reader.result)
      console.log(byteArray)
      setImgArray(byteArray);
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
            <button onClick={capture}>Capture Piture</button>
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

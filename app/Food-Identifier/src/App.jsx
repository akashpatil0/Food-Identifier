import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

import "./App.css";
import NutritionFacts from "./NutritionFacts";
import Webcam from "react-webcam";

function App() {
  const [img, setImg] = useState(null);
  const [imgArray, setImgArray] = useState(null);
  const webcamRef = useRef(null);

  function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
  
      // Register event listeners
      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
  
      // Read file
      reader.readAsArrayBuffer(file)
    })
  }

  async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
  }

  const getArray = (file) => {
    const reader = new FileReader()

    reader.onload = () => {
      const byteArray = new Uint8Array(reader.result)
      byteArray
      setImgArray(byteArray);
    }
    reader.readAsArrayBuffer(file) 
  }

  const handleSubmit = (e) => {
    const file = e.target.files[0]
    var reader = new FileReader

    reader.onloadend = () => {
        var image = reader.result
        // Parameters
        const params = {image}
        axios
        .post('http://localhost:8080/prediction', params)
        .then((res) => {
        const data = res.data.data
        const parameters = JSON.stringify(params)
        const msg = `Prediction: ${data.prediction}`
        alert(msg)
        })
        .catch((error) => alert(`Error: ${error.message}`)) 
    }  

    reader.readAsDataURL(file)
  }



  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    //handleSubmit(getArray(file))
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

      <input type="file" accept=".jpeg, .jpg" onChange={handleSubmit} />
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

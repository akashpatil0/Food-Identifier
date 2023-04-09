import { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";
import NutritionFacts from "./NutritionFacts";
import Camera from "./Camera";
import axios from "Axios";

function App() {
  const [img, setImg] = useState(null);
  const [foodName, setFoodName] = useState(null);
  const [NutritionFacts, setNutritionFacts] = useState(null);
  const webcamRef = useRef(null);

  const getArray = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      const byteArray = new Uint8Array(reader.result);
      console.log(byteArray);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    getArray(file);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    console.log(imageSrc);
  }, [webcamRef]);

  const videoConstraints = {
    width: 720,
    height: 480,
    imageSmoothing: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        {
          query: "chicken tender",
        },
        {
          headers: {
            "x-app-id": "181d71d9",
            "x-app-key": "80c28984cab26c118e5636377ff5913b",
            "x-remote-user-id": "0",
          },
        }
      );
      console.log(data);
    };

    // call the function
    fetchData();
    console.log(NutritionFacts);
  }, []);

  return (
    <div className="App">
      <h1>give us a pic</h1>
      <input type="file" accept=".jpeg, .jpg" onChange={handleImageUpload} />
      {/* {<NutritionFacts />} */}
      <Camera
        webcamRef={webcamRef}
        capture={capture}
        img={img}
        setImg={setImg}
      />
    </div>
  );
}

export default App;

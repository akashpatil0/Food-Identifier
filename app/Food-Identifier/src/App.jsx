import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [image, setImage] = useState("");

  return (
    <div className="App">
      <h1>bitch give us an img pls</h1>
      <div className="upload-btn">
        <input
          type="file"
          accept=".jpeg, .jpg"
          onChange={(event) => {
            const file = event.target.files[0];
          }}
        />
      </div>
    </div>
  );
}

export default App;

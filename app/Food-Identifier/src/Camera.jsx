import React from "react";
import Webcam from "react-webcam";

const Camera = ({ img, setImg, webcamRef, capture }) => {
  const videoConstraints = {
    width: 720,
    height: 480,
    imageSmoothing: true,
  };

  return (
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
  );
};

export default Camera;

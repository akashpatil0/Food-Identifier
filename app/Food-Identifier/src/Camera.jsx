import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const Camera = () => {
  const webcamRef = useRef < any > null;
  const [imgSrc, setImgSrc] = useState < any > null;

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    // get array
    console.log("here1");
    const reader = new FileReader();
    reader.onload = () => {
      const byteArray = new Uint8Array(reader.result);
      console.log("here2");
      console.log(byteArray);
    };
    reader.readAsArrayBuffer(fetch(imageSrc).then((res) => res.blob()));
  }, [webcamRef, setImgSrc]);

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

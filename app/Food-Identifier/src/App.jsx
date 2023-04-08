import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const apiKey = 'AIzaSyD0Cqmy0qjI3AypAu20z-hNn05abRQZt40'
  const handelImageUpload = (event) => {
    const file = event.target.files[0]
    const imageUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const base64Img = canvas.toDataURL('image/jpeg').replace(/^data:image\/(jpeg|png);base64,/, '')
      const encodedImg = base64Img.toString('base64');
      const data = {
        requests: [
          {
            image: {
              source: imageUrl,
              content: encodedImg
            },
            features: [
              {
                type: 'LABEL_DETECTION'
              }
            ]
          }
        ]
      }
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      console.log(response)
      const responseData = await response.json();
      console.log(responseData.responses[0].labelAnnotations)
    }
    img.src = imageUrl
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
       <input type = "file" accept='.jpeg, .jpg' onChange={handelImageUpload}/>
      </div>
      
      {/* <button className='camera-btn' onClick={handleCameraPermission}>
        Use Camera
      </button>

      <button className='camera-btn' onClick={handleCapture}>
        Take Pic
      </button>  */}
     
    </div>
  )
}

export default App

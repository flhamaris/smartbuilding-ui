import React, { useState, useEffect, useRef } from "react"
import RecordRTC from "recordrtc"

let timeoutId = null
let recorder = null

// Define styles
const videoStyles = {
  width: "75%%",
  height: "auto",
  maxHeight: "500px",
}

const buttonStyles = {
  margin: "10px",
}

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const VideoRecord = () => {
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = function (e) {
          videoRef.current.play()
        }
      })
      .catch((err) => {
        console.error("Error getting user media:", err)
      })
  }, [])

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Start recording
          recorder = RecordRTC(stream, { type: "video" })
          recorder.startRecording()

          // Stop recording after MAX_RECORDING_TIME seconds
          timeoutId = setTimeout(() => {
            stopRecording()
          }, process.env.REACT_APP_MAX_RECORDING_TIME)
        })
        .catch((err) => {
          console.error("Error getting user media:", err)
        })
    } else if (recorder) {
      stopRecording()
    }
  }, [isRecording])

  const startRecording = () => {
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recorder) {
      recorder.stopRecording(() => {
        let blob = recorder.getBlob()

        // Create a FormData instance
        let formData = new FormData()

        // Append the blob to the FormData instance
        formData.append("video", blob)

        let label = window.prompt("Please enter a label for the video")

        // Append the subjectId to the FormData instance
        formData.append("label", label)

        // Send the FormData instance to the server
        fetch(`${process.env.REACT_APP_API_HOSTNAME}/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error(error))
      })
    }
  }

  return (
    <div style={containerStyles}>
      <div>
        <video ref={videoRef} autoPlay muted style={videoStyles} />
      </div>
      <div>
        <button onClick={startRecording} style={buttonStyles}>
          Start
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          style={buttonStyles}
        >
          Stop Recording
        </button>
      </div>
    </div>
  )
}

export default VideoRecord

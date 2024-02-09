import React, { useState, useEffect, useRef } from "react"
import RecordRTC from "recordrtc"
import { FaCircle, FaStop } from "react-icons/fa"
import { ClipLoader } from "react-spinners"

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

const backdropStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
}

const VideoRecord = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
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
      clearTimeout(timeoutId)
      recorder.stopRecording(() => {
        let blob = recorder.getBlob()

        // Create a FormData instance
        let formData = new FormData()

        // Append the blob to the FormData instance
        formData.append("video", blob)

        let label = window.prompt("Please enter a label for the subject")
        let sequenceName = window.prompt("Please enter a name for the sequence")

        // Append the subjectId to the FormData instance
        formData.append("label", label)

        // Append the sequence name to the FormData instance
        formData.append("sequenceName", sequenceName)

        // Set isProcessing to true before starting the upload
        setIsProcessing(true)

        // Send the FormData instance to the server
        fetch(`${process.env.REACT_APP_API_HOSTNAME}/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            // Set isProcessing back to false when the upload is done
            setIsProcessing(false)
          })
          .catch((error) => {
            console.error(error)
            // Set isProcessing back to false if an error occurs
            setIsProcessing(false)
          })
      })
    }
  }

  return (
    <div style={containerStyles}>
      <div>
        <video ref={videoRef} autoPlay muted style={videoStyles} />
      </div>
      <div>
        <button
          onClick={startRecording}
          disabled={isRecording} // Disable the start button when recording
          style={{
            ...buttonStyles,
            borderRadius: "50%", // Make the button circular
            padding: "10px", // Add some padding
          }}
        >
          <FaCircle /> {/* Add record icon */}
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          style={{
            ...buttonStyles,
            borderRadius: "50%", // Make the button circular
            padding: "10px", // Add some padding
          }}
        >
          <FaStop /> {/* Add stop icon */}
        </button>
      </div>
      {isProcessing && (
        <div style={backdropStyles}>
          <ClipLoader color="#ffffff" loading={isProcessing} size={150} />
        </div>
      )}
    </div>
  )
}

export default VideoRecord

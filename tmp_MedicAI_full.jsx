import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Sparkles,
  Camera,
  Brain,
  Stethoscope,
  X,
} from "lucide-react";

export default function MedicAI() {
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // ====== Microphone Recording ======
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);

        // You would add your AI speech → text processing here
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // ====== Camera Handling ======
  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const imgData = canvas.toDataURL("image/png");
    setCapturedImg(imgData);
    stopCamera();
  };
    // ====== AI Processing Simulation ======
  const sendToAI = async (input) => {
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      setAiResponse(
        "This is your AI medical assistant. I’ve analyzed your input and generated feedback for you."
      );
      setIsLoading(false);
    }, 1500);
  };

  // ====== Form Submission ======
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    sendToAI(transcript);
  };

  return (
    <div className="medic-ai-container" style={styles.container}>
      <h1 style={styles.title}>
        <Sparkles size={28} color="#4da6ff" /> MedicAI Assistant
      </h1>

      {/* AI Response Card */}
      <div style={styles.responseBox}>
        {isLoading ? (
          <p style={styles.loading}>Analyzing your request...</p>
        ) : aiResponse ? (
          <p>{aiResponse}</p>
        ) : (
          <p style={{ color: "#777" }}>Your medical insights will appear here.</p>
        )}
      </div>

      {/* Text Input */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Explain your symptoms or ask a question..."
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          <Brain size={18} /> Analyze
        </button>
      </form>

      {/* Audio Recorder */}
      <div style={styles.audioControls}>
        <button onClick={startRecording} style={styles.iconButton}>
          <Mic size={20} />
        </button>
        <button onClick={stopRecording} style={styles.iconButton}>
          <X size={20} />
        </button>

        {audioURL && (
          <audio controls style={{ marginTop: 10 }}>
            <source src={audioURL} type="audio/wav" />
          </audio>
        )}
      </div>

      {/* Camera Capture */}
      <div style={styles.cameraSection}>
        {!showCamera && (
          <button onClick={startCamera} style={styles.button}>
            <Camera size={18} /> Open Camera
          </button>
        )}

        {showCamera && (
          <div style={styles.cameraBox}>
            <video ref={videoRef} autoPlay style={styles.video} />
            <button onClick={capturePhoto} style={styles.buttonSmall}>
              Capture
            </button>
            <button onClick={stopCamera} style={styles.buttonSmallRed}>
              Close
            </button>
          </div>
        )}

        {capturedImg && (
          <div style={styles.photoHolder}>
            <img src={capturedImg} alt="Captured" style={styles.capturedImg} />
          </div>
        )}
      </div>
    </div>
  );
}

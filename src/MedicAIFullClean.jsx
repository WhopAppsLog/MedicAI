import React, { useState, useRef } from "react";
import { Mic, Sparkles, Camera, Brain, X } from "lucide-react";

const styles = {
  container: { maxWidth: 760, margin: "40px auto", padding: 20 },
  title: { fontSize: 26, display: "flex", alignItems: "center", gap: 8 },
  responseBox: { minHeight: 80, padding: 16, background: "#f7fafc", borderRadius: 12 },
  loading: { color: "#666" },
  form: { marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start" },
  textarea: { flex: 1, minHeight: 80, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" },
  button: { padding: "10px 14px", background: "#2563eb", color: "#fff", borderRadius: 8, border: "none", display: "flex", gap: 8, alignItems: "center" },
  audioControls: { marginTop: 12, display: "flex", gap: 8, alignItems: "center" },
  iconButton: { padding: 8, background: "#f3f4f6", borderRadius: 8, border: "none" },
  cameraSection: { marginTop: 16 },
  cameraBox: { background: "#f8fafc", padding: 8, borderRadius: 8 },
  video: { width: "100%", borderRadius: 8 },
  buttonSmall: { padding: "8px 10px", background: "#10b981", color: "#fff", borderRadius: 8, border: "none" },
  buttonSmallRed: { padding: "8px 10px", background: "#ef4444", color: "#fff", borderRadius: 8, border: "none" },
  photoHolder: { marginTop: 12 },
  capturedImg: { maxWidth: "100%", borderRadius: 8 },
};

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioURL(URL.createObjectURL(audioBlob));
      };
      mediaRecorderRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { console.error(e); }
  };

  const stopCamera = () => { setShowCamera(false); if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop()); };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d'); ctx.drawImage(videoRef.current,0,0);
    setCapturedImg(canvas.toDataURL('image/png'));
    stopCamera();
  };

  const sendToAI = async (input) => {
    setIsLoading(true);
    setTimeout(()=>{ setAiResponse('This is a simulated AI response.'); setIsLoading(false); }, 800);
  };

  const handleSubmit = (e)=>{ e.preventDefault(); if (!transcript.trim()) return; sendToAI(transcript); };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}><Sparkles size={28} color="#4da6ff"/> MedicAI Assistant</h1>
      <div style={styles.responseBox}>{isLoading? <p style={styles.loading}>Analyzing...</p> : (aiResponse? <p>{aiResponse}</p> : <p style={{color:'#777'}}>Your medical insights will appear here.</p>)}</div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea value={transcript} onChange={(e)=>setTranscript(e.target.value)} placeholder="Explain symptoms or ask a question..." style={styles.textarea} />
        <button type="submit" style={styles.button}><Brain size={18}/> Analyze</button>
      </form>
      <div style={styles.audioControls}>
        <button onClick={startRecording} style={styles.iconButton}><Mic size={20}/></button>
        <button onClick={stopRecording} style={styles.iconButton}><X size={20}/></button>
        {audioURL && <audio controls style={{marginTop:10}} src={audioURL}/>}
      </div>
      <div style={styles.cameraSection}>
        {!showCamera && <button onClick={startCamera} style={styles.button}><Camera size={18}/> Open Camera</button>}
        {showCamera && (
          <div style={styles.cameraBox}><video ref={videoRef} autoPlay style={styles.video}/><div style={{display:'flex',gap:8,marginTop:8}}><button onClick={capturePhoto} style={styles.buttonSmall}>Capture</button><button onClick={stopCamera} style={styles.buttonSmallRed}>Close</button></div></div>
        )}
        {capturedImg && <div style={styles.photoHolder}><img src={capturedImg} alt="captured" style={styles.capturedImg}/></div>}
      </div>
    </div>
  );
}

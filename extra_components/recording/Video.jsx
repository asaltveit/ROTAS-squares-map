import { useState, useRef, useEffect, useMemo } from 'react';
//import './App.css';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';

function Video() {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('MediaDevices API is not available in this browser');
      }
      // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
          frameRate: 30,
        },
        audio: false,
      });

      setStream(mediaStream);
      recorderRef.current = new RecordRTC(mediaStream, { type: 'video' });
      recorderRef.current.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      // Handle error gracefully - could show user a message
    }
  };

  const handleStop = () => {
    if (!recorderRef.current) {
      console.warn('Cannot stop recording: no active recorder');
      return;
    }
    try {
      recorderRef.current.stopRecording(() => {
        const recordedBlob = recorderRef.current.getBlob();
        setBlob(recordedBlob);
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleSave = () => {
    if (!blob) {
      console.warn('Cannot save: no recorded video');
      return;
    }
    try {
      invokeSaveAsDialog(blob);
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  // Cleanup: stop tracks when component unmounts or stream changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Create object URL for video blob
  const videoUrl = useMemo(() => {
    if (!blob) return null;
    return URL.createObjectURL(blob);
  }, [blob]);

  // Cleanup: revoke object URLs when component unmounts or blob changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleSave}>save</button>
        {blob && videoUrl && (
          <video
            src={videoUrl}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: '700px', margin: '1em' }}
            aria-label="Recorded screen capture video"
          />
        )}
      </header>
    </div>
  );
}

export default Video;
import { Download, PauseCircle, Trash, ChevronDown, ChevronUp, Play, PlayCircle, StopCircle, } from "lucide-react";
import { useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useMapStore} from '../../utilities/MapStore'
import { useShallow } from 'zustand/react/shallow';
// From - https://medium.com/@pritam-debnath/how-to-record-screen-in-a-react-app-0cd98e5d6879

// todo - remove package if not used
// TODO - add video recordings and savings to stats

const Recorder = () => {
    const { playAnimation, scrollToMap } = useMapStore(
            useShallow((state) => ({ 
              playAnimation: state.playAnimation,
              scrollToMap: state.scrollToMap,
            })),
          )
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ 
        screen: true, 
        audio: false, 
        //askPermissionOnMount: true,
     });
    // TODO: fix - on mount runs twice

    // TODO: re-center page on map before it starts recording
    // Can it zoom in to the map?
    // Can it press play?
    //<video src={mediaBlobUrl} controls autoPlay loop />

    const setupRecording = async () => {
        scrollToMap() // scrolls to map
        try {
          // Option 2: Manual permission request before starting
          await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          startRecording();
        } catch (err) {
          console.error("Permission denied or media not found:", err);
          // Handle permission denial or errors
        }
        //playAnimation() // play the timeline - TODO: fix - state problem
    }

  return (
    <div>
      <p>{status}</p>
      <button onClick={setupRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
}
export default Recorder;
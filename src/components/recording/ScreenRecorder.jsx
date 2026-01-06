import { Download, PauseCircle, Trash, ChevronDown, ChevronUp, Play, PlayCircle, StopCircle, } from "lucide-react";
import { useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useMapStore} from '@/stores/MapStore'
import { useShallow } from 'zustand/react/shallow';
// From - https://medium.com/@pritam-debnath/how-to-record-screen-in-a-react-app-0cd98e5d6879

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
    <div className="flex flex-col gap-3">
        <p className="text-base text-gray-700" aria-live="polite">
            {status}
        </p>
        <button 
          onClick={setupRecording}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Start Recording
        </button>
        <button 
          onClick={stopRecording}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Stop Recording
        </button>
    </div>
  );
}
export default Recorder;
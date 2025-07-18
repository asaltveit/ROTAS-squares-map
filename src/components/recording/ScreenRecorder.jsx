import { Download, PauseCircle, Trash, ChevronDown, ChevronUp, Play, PlayCircle, StopCircle, } from "lucide-react";
import { useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useMapStore} from '../../stores/MapStore'
import { useShallow } from 'zustand/react/shallow';
import { Stack, Button, Box, Typography } from '@mui/material';
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
    <Stack>
        <Typography>
            {status}
        </Typography>
        <Button onClick={setupRecording}>Start Recording</Button>
        <Button onClick={stopRecording}>Stop Recording</Button>
    </Stack>
  );
}
export default Recorder;
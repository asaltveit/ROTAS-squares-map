import { useShallow } from 'zustand/react/shallow';
import { useMapStore} from '../../stores/MapStore'
import { useReactMediaRecorder } from "react-media-recorder";
import * as htmlToImage from "html-to-image";

export default function RecordingSection({ screenRef }) {
    const { scrollToMap } = useMapStore(
        useShallow((state) => ({ 
            scrollToMap: state.scrollToMap,
        })),
    );

    const { status, startRecording, stopRecording } = useReactMediaRecorder({ 
        screen: true, 
        audio: false, 
    });

    const handleScreenshotDownload = async () => {
        if (!screenRef || !screenRef.current) return;
        if (scrollToMap) scrollToMap();
        await htmlToImage.toJpeg(screenRef.current).then((image) => {
            const a = document.createElement("a");
            a.href = image;
            a.download = "map-shot.jpg";
            a.click();
        });
    };

    const setupRecording = async () => {
        if (scrollToMap) scrollToMap();
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            startRecording();
        } catch (err) {
            console.error("Permission denied or media not found:", err);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-2">Take a screenshot</h3>
                <button
                    onClick={handleScreenshotDownload}
                    className="w-full px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center justify-center gap-2"
                >
                    Download Screenshot
                </button>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-2">Take a screen recording</h3>
                <div className="space-y-2">
                    <div className="text-sm text-amber-700">
                        Status: {status}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={setupRecording}
                            className="flex-1 px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors"
                        >
                            Start Recording
                        </button>
                        <button
                            onClick={stopRecording}
                            className="flex-1 px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors"
                        >
                            Stop Recording
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

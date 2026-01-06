import * as htmlToImage from "html-to-image";
import { useMapStore } from '@/stores/MapStore'
import { useShallow } from 'zustand/react/shallow';

// screenshot? - https://medium.com/@pro.grb.studio/how-to-screencapture-in-reactjs-step-by-step-guide-b435e8b53e11
// specific component - https://stackoverflow.com/questions/76656140/how-to-capture-a-screenshot-of-a-specific-component-in-a-react-application-using

const createFileName = (extension = "", ...names) => {
  if (!extension) {
    return "";
  }
  return `${names.join("")}.${extension}`;
};

// TODO: add some key/id to the name?
const downloadFile = (image, { name = "map-shot", extension = "jpg" } = {}) => {
    console.log("image: ", image)
  /*const a = document.createElement("a");
  a.href = image;
  a.download = createFileName(extension, name);
  a.click();*/
};

export default function Screenshot({ screenRef }) {
  const { 
    scrollToMap 
  } = useMapStore(
    useShallow((state) => ({ 
      scrollToMap: state.scrollToMap,
    })),
  )

  const handleScreenshotDownload = async () => {
    if (!screenRef && !screenRef.current) return;
    scrollToMap() // scroll up to map before taking the pic
    await htmlToImage.toJpeg(screenRef.current).then(downloadFile);
    alert("Screenshot saved as map-shot.jpg");
  };

  return (
    <div>
      <button 
        onClick={handleScreenshotDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Download
      </button>
    </div>  
  );
}
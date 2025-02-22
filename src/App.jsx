// Import dependencies
import React, { useRef,  useEffect } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd"
import Webcam from "react-webcam";
import { drawRect } from "./utils/drawRect";
// e.g. import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();

    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      console.log(obj)

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Update drawing utility
      drawRect(obj,ctx)
    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/background.jpg')] bg-cover bg-center text-white p-2 relative">
      <h1 className="text-xl md:text-3xl font-bold mb-4 text-center">REAL-TIME OBJECT DETECTION</h1>
      <div className="relative w-full max-w-8xl h-auto px-2">
        <Webcam
          ref={webcamRef}
          muted={true}
          className="w-full h-[90vh] md:h-[85vh] rounded-lg shadow-lg object-cover border-2 border-white"
          videoConstraints={{
            facingMode: "user",
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      <footer className="absolute bottom-0 m-auto text-white/50">Made with ❤️ by Surya</footer>
    </div>
  );
}

export default App;

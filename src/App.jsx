// Import dependencies
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd"
import Webcam from "react-webcam";
import { drawRect } from "./utils/drawRect";
import { Dot, LoaderCircleIcon } from "lucide-react";
// e.g. import { drawRect } from "./utilities";

function App() {

  const [facingMode, setFacingMode] = useState("user");

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Main function
  const runCoco = async () => {
    setLoading(true);
    try {
      const net = await cocossd.load();
      setInterval(() => {
        detect(net);
      }, 100);
    } catch (error) {

    }
    finally {
      setLoading(false)
    }
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

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Update drawing utility
      drawRect(obj, ctx)
    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    loading ? (
      <div className="w-screen h-screen bg-zinc-800 flex flex-col items-center justify-center">
        <LoaderCircleIcon size={64} className={`animate-spin mb-2 text-emerald-500`} />
        <h2 className="text-white text-2xl md:text-3xl">Model is Loading Please Wait</h2>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center max-h-[90vh] md:min-h-screen bg-[url('/background.jpg')] bg-cover bg-center text-white relative">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center absolute top-4 z-10 bg-black/30 p-2 rounded-md">REAL-TIME OBJECT DETECTION</h1>
        <div className="relative w-full max-w-8xl h-auto">
          <Webcam
            ref={webcamRef}
            muted={true}
            className="w-full h-screen md:h-screen rounded-lg shadow-lg object-cover border-2 border-black"
            videoConstraints={{
              facingMode: facingMode,
              width: 3840,
              height: 2160,
              frameRate: 60,
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        <div className="mt-4 flex gap-4 absolute bottom-5">
          <button onClick={switchCamera} className="bg-green-500 hover:bg-green-600 md:hidden px-2 py-2 rounded-md mb-5">
            Switch Camera
          </button>
        </div>
        <footer className="absolute bottom-0 m-auto text-white/50">Made with ❤️ by Surya</footer>
      </div>
    )
  );
}

export default App;

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";

const INPUT_MP4_FILE = "input.mp4";
const OUTPUT_MP4_FILE = "output.mp4";

function App() {
  const [videoSrc, setVideoSrc] = useState("");

  const ffmpeg = createFFmpeg({
    log: true,
  });

  const trimRecording = async () => {
    await ffmpeg.load();
    ffmpeg.FS(
      "writeFile",
      INPUT_MP4_FILE,
      await fetchFile(`/${INPUT_MP4_FILE}`)
    );
    const args = [
      "-i",
      INPUT_MP4_FILE,
      "-ss",
      "30",
      "-to",
      "40",
      "-c",
      "copy",
      OUTPUT_MP4_FILE,
    ];
    await ffmpeg.run(...args);
    const data = ffmpeg.FS("readFile", OUTPUT_MP4_FILE);
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <div>
          <video src={INPUT_MP4_FILE} controls></video>
        </div>
        <div>{videoSrc && <video src={videoSrc} controls></video>}</div>
        <button onClick={trimRecording}>Trim a recording</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;

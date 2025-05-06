import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];
        onRecordingComplete(blob); // Send the blob back to parent (message bar)
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex gap-2 items-center bg-transparent">
      {/* {!isRecording ? (
        <Button onClick={startRecording} variant="outline" className="text-white text-2xl w-[35px] h-[35px]  text-center m-auto items-center bg-transparent outline-none border-none hover:bg-transparent hover:text-white">
          <Mic size={24} className=" !w-5 !h-5 " /> 
        </Button>
      ) : (
        <Button onClick={stopRecording} variant="destructive" className="text-white text-2xl w-[35px] h-[35px]  text-center m-auto items-center bg-transparent outline-none border-none bg-none hover:bg-white hover:bg-transparent" >
          <StopCircle className="!w-5 !h-5" />
        </Button>
      )} */}
      {!isRecording ? (
        <button
          className="focus:outline-none focus:border-none focus:text-white text-neutral-500 duration-300 transition-all"
          onClick={startRecording}
        >
          <Mic size={24} />
        </button>
      ) : (
        <button
          className="focus:outline-none focus:border-none text-red-500 animate-pulse duration-300 transition-all"
          onClick={stopRecording}
        >
          <StopCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;

import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const VoiceInput = ({ display, showDisplay }) => {
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // ✅ Up-to-date transcript
  

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser 😢');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcriptRef.current += result[0].transcript; // ✅ Append safely
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // ✅ Always display full final + interim
      showDisplay(transcriptRef.current + interimTranscript);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicToggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <button
      onClick={handleMicToggle}
      className={`absolute bottom-8 right-14 p-2 rounded-md transition
        shadow-[0_2px_5px_rgba(0,0,0,0.4)] hover:bg-black hover:text-white
        ${listening ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {listening ? <FaMicrophoneSlash size={23} /> : <FaMicrophone size={23} />}
    </button>
  );
};

export default VoiceInput;

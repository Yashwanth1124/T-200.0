import { useState, useEffect, useCallback } from 'react';
import VoiceAssistantIcon from './VoiceAssistantIcon';

function VoiceAssistant() {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [taskDetails, setTaskDetails] = useState<{ title: string; dueDate: string; priority: string }>({
    title: '',
    dueDate: '',
    priority: '',
  });
  const [pendingDetail, setPendingDetail] = useState<'dueDate' | 'priority' | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.onresult = handleVoiceResult;
      recognitionInstance.onerror = handleVoiceError;
      setRecognition(recognitionInstance);
    } else {
      console.error('SpeechRecognition is not supported in this browser.');
    }
  }, []);

  // Handle speech recognition results
  const handleVoiceResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Transcript:', transcript);

      if (pendingDetail) {
        // Handle specific questions based on the pending detail
        if (pendingDetail === 'dueDate') {
          setTaskDetails((prev) => ({ ...prev, dueDate: transcript.trim() }));
          setPendingDetail('priority'); // Move to the next question
          speak('Got it. What priority should I set? High, medium, or low?');
        } else if (pendingDetail === 'priority') {
          setTaskDetails((prev) => ({ ...prev, priority: transcript.trim() }));
          setPendingDetail(null); // Clear pending details
        }
      } else if (transcript.includes('add task') || transcript.includes('create task')) {
        const taskTitle = transcript.replace('add task', '').replace('create task', '').trim();
        if (taskTitle) {
          setTaskDetails((prev) => ({ ...prev, title: taskTitle }));
          setPendingDetail('dueDate'); // Start asking for due date
          speak('Task title set. Do you want to set a due date?');
        } else {
          speak('What is the task title?');
        }
      } else {
        speak("I didn't understand that. You can say 'Add task' followed by the task title.");
      }
    },
    [pendingDetail]
  );

  // Handle errors during speech recognition
  const handleVoiceError = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech Recognition Error:', event.error);
    speak('There was an error with speech recognition. Please try again.');
  };

  // Text-to-speech helper function
  const speak = (text: string): void => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };

  // Handle task creation
  useEffect(() => {
    if (taskDetails.title && taskDetails.dueDate && taskDetails.priority) {
      createTask(taskDetails);
      setTaskDetails({ title: '', dueDate: '', priority: '' });
    }
  }, [taskDetails]);

  const createTask = (task: { title: string; dueDate: string; priority: string }): void => {
    console.log('Task created:', task);
    speak(`Task "${task.title}" with priority ${task.priority} is created.`);
  };

  return <VoiceAssistantIcon onActivate={toggleListening} />;
}

export default VoiceAssistant;

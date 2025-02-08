import { useState, useEffect, useRef } from 'react'
import { 
  IonFab, 
  IonFabButton, 
  IonIcon,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonAlert
} from '@ionic/react'
import { 
  micOutline, 
  micOffOutline 
} from 'ionicons/icons'
import { useTasks } from '../context/TaskContext'
import { useHistory } from 'react-router-dom'

// Add this helper function at the top of the file, outside the component
const normalizeText = (text) => {
  // Common homophones and misspellings
  const homophones = {
    'by': 'buy',
    'bye': 'buy',
    'bi': 'buy',
    'to': 'two',
    'too': 'two',
    'their': 'there',
    'they\'re': 'there',
    'for': 'four',
    'fore': 'four',
    'hear': 'here',
    'wright': 'write',
    'rite': 'write',
    'right': 'write',
    'wood': 'would',
    'weather': 'whether',
    'meet': 'meat',
    'mail': 'male',
    'made': 'maid',
    'higher': 'hire'
  }

  return text.toLowerCase()
    .split(' ')
    .map(word => homophones[word] || word)
    .join(' ')
}

function VoiceCommand() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const { addTask, toggleTaskStatus, deleteTask, updateTask, tasks } = useTasks()
  const history = useHistory()
  const [hasMicrophone, setHasMicrophone] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const recognitionRef = useRef(null)

  // Initialize speech recognition
  useEffect(() => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser')
      }

      const SpeechRecognition = window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      const recognition = recognitionRef.current

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        console.log('Recognition started')
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase()
        console.log('Recognized command:', command)
        setTranscript(command)
        processCommand(command)
      }

      recognition.onerror = (event) => {
        console.error('Recognition error:', event)
        setError(`Error: ${event.error}`)
        setIsListening(false)
        setDialogOpen(false)
      }

      recognition.onend = () => {
        console.log('Recognition ended')
        setIsListening(false)
      }

    } catch (err) {
      console.error('Initialization error:', err)
      setError(err.message)
    }
  }, [])

  // Check for microphone at startup
  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasAudioInput = devices.some(device => device.kind === 'audioinput')
        setHasMicrophone(hasAudioInput)
        if (!hasAudioInput) {
          setError('No microphone detected. Please connect a microphone to use voice commands.')
        }
      } catch (err) {
        console.error('Failed to check for microphone:', err)
        setHasMicrophone(false)
        setError('Unable to detect audio devices. Voice commands may not work.')
      }
    }

    checkMicrophone()
  }, [])

  const handleMicClick = async () => {
    if (!hasMicrophone) {
      setDialogOpen(true)
      return
    }
    console.log('Mic clicked, current state:', { isListening, recognitionRef: !!recognitionRef.current })
    
    if (isListening) {
      stopListening()
      return
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())

      // Start recognition
      if (recognitionRef.current) {
        setDialogOpen(true)
        setTranscript('')
        setError(null)
        recognitionRef.current.start()
        console.log('Recognition started')
      } else {
        throw new Error('Speech recognition not initialized')
      }
    } catch (err) {
      console.error('Start listening error:', err)
      setError(err.message)
      setDialogOpen(true)
    }
  }

  const stopListening = () => {
    console.log('Stopping recognition')
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setDialogOpen(false)
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      
      // Optional: customize voice
      utterance.rate = 1.0  // Speed: 0.1 to 10
      utterance.pitch = 1.0 // Pitch: 0 to 2
      utterance.volume = 1.0 // Volume: 0 to 1
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const findTaskByKeyword = (taskKeyword) => {
    const normalizedKeyword = normalizeText(taskKeyword)
    console.log('Searching for task with normalized keyword:', normalizedKeyword)
    console.log('Available tasks:', tasks)
    
    const foundTask = tasks.find(task => {
      const normalizedTitle = normalizeText(task.title)
      console.log(`Comparing with task "${task.title}":`, {
        normalizedTitle,
        normalizedKeyword,
        matches: normalizedTitle.includes(normalizedKeyword) ||
                 normalizedKeyword.includes(normalizedTitle)
      })
      return normalizedTitle.includes(normalizedKeyword) ||
             normalizedKeyword.includes(normalizedTitle)
    })
    
    console.log('Found task:', foundTask)
    return foundTask
  }

  const processCommand = (command) => {
    console.log('Processing command:', command)
    const normalizedCommand = normalizeText(command)
    console.log('Normalized command:', normalizedCommand)

    // Change priority commands
    if (normalizedCommand.includes('change') && normalizedCommand.includes('priority')) {
      console.log('Detected change priority command')
      const match = normalizedCommand.match(/change (.*?) to (high|medium|low) priority/)
      console.log('Regex match:', match)
      
      if (match) {
        const [_, taskKeyword, newPriority] = match
        console.log({
          fullMatch: match[0],
          taskKeyword,
          newPriority
        })
        
        const task = findTaskByKeyword(taskKeyword)
        
        if (task) {
          const updatedTask = { ...task, priority: newPriority }
          console.log('Updating task with:', updatedTask)
          updateTask(task.id, updatedTask)
          speak(`Changed ${task.title} to ${newPriority} priority`)
        } else {
          speak(`Sorry, I couldn't find a task matching: ${taskKeyword}`)
        }
      } else {
        speak("Please specify both the task name and the new priority (high, medium, or low)")
      }
    }
    // Add task commands
    else if (normalizedCommand.includes('add task') || normalizedCommand.includes('create task')) {
      const taskTitle = normalizedCommand.replace(/add task|create task/i, '').trim()
      if (taskTitle) {
        addTask({
          title: taskTitle,
          priority: normalizedCommand.includes('high priority') ? 'high' : 
                   normalizedCommand.includes('low priority') ? 'low' : 'medium'
        })
        speak(`Added task: ${taskTitle}`)
      }
    }
    // Complete task commands
    else if (normalizedCommand.includes('complete') || normalizedCommand.includes('finish')) {
      const taskKeyword = normalizedCommand.replace(/complete|finish/i, '').trim()
      const task = findTaskByKeyword(taskKeyword)
      if (task && task.status === 'pending') {
        toggleTaskStatus(task.id)
        speak(`Completed task: ${task.title}`)
      } else if (task) {
        speak(`That task is already completed`)
      } else {
        speak(`Sorry, I couldn't find a pending task matching: ${taskKeyword}`)
      }
    }
    // Delete task commands
    else if (normalizedCommand.includes('delete') || normalizedCommand.includes('remove')) {
      const taskKeyword = normalizedCommand.replace(/delete|remove/i, '').trim()
      const task = findTaskByKeyword(taskKeyword)
      if (task) {
        deleteTask(task.id)
        speak(`Deleted task: ${task.title}`)
      } else {
        speak(`Sorry, I couldn't find a task matching: ${taskKeyword}`)
      }
    }
    // Navigation commands
    else if (normalizedCommand.includes('go to create') || normalizedCommand.includes('new task')) {
      history.push('/create')
      speak('Opening create task form')
    }
    else if (normalizedCommand.includes('go home') || normalizedCommand.includes('show tasks')) {
      history.push('/')
      speak('Showing all tasks')
    }
    // Help command
    else if (normalizedCommand.includes('help') || normalizedCommand.includes('what can you do')) {
      speak('You can say commands like: Add task, Complete task, Delete task, Change task priority, or Go home')
    }
    // Unknown command
    else {
      speak("Sorry, I didn't understand that command. Try saying Help for a list of commands")
    }

    // Close dialog after processing
    setTimeout(() => {
      setDialogOpen(false)
    }, 1500)
  }

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton 
          color="secondary"
          onClick={handleMicClick}
          disabled={!hasMicrophone}
        >
          <IonIcon icon={isListening ? micOffOutline : micOutline} />
        </IonFabButton>
      </IonFab>

      <IonModal 
        isOpen={dialogOpen} 
        onDidDismiss={stopListening}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{isListening ? 'Listening...' : 'Voice Commands'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {error ? (
            <IonAlert
              isOpen={true}
              header="Error"
              message={error}
              buttons={['OK']}
            />
          ) : (
            <>
              {isListening && (
                <div className="ion-text-center ion-padding">
                  <IonSpinner />
                </div>
              )}
              
              <IonText color="medium" className="ion-text-center">
                <p>{transcript || 'Click the microphone to start'}</p>
              </IonText>

              <div className="ion-padding-top">
                <IonText>
                  <h2>Example commands:</h2>
                </IonText>
                <IonList>
                  {[
                    'Add task buy groceries',
                    'Add task meeting with team high priority',
                    'Complete buy groceries',
                    'Delete meeting',
                    'Change buy groceries to high priority',
                    'Go to create',
                    'Show tasks'
                  ].map((cmd, index) => (
                    <IonItem key={index}>
                      <IonLabel className="ion-text-wrap">
                        "{cmd}"
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  )
}

export default VoiceCommand
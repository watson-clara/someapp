import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonDatetime,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert
} from '@ionic/react'
import { useTasks } from '../context/TaskContext'

function EditTask() {
  const history = useHistory()
  const { taskId } = useParams()
  const { getTask, updateTask } = useTasks()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const task = getTask(taskId)
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate
      })
    } else {
      setError('Task not found')
    }
  }, [taskId, getTask])

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.detail.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim()) {
      updateTask(taskId, {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      })
      history.push('/')
    }
  }

  if (error) {
    return (
      <IonAlert
        isOpen={true}
        header="Error"
        message={error}
        buttons={[
          {
            text: 'Go Back',
            handler: () => history.push('/')
          }
        ]}
      />
    )
  }

  return (
    <IonContent>
      <form onSubmit={handleSubmit}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Edit Task</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Task Title</IonLabel>
                <IonInput
                  value={formData.title}
                  onIonInput={handleChange('title')}
                  placeholder="Enter task title"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={formData.description}
                  onIonInput={handleChange('description')}
                  placeholder="Enter task description"
                  rows={3}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Priority</IonLabel>
                <IonSelect
                  value={formData.priority}
                  onIonChange={handleChange('priority')}
                >
                  <IonSelectOption value="high">High</IonSelectOption>
                  <IonSelectOption value="medium">Medium</IonSelectOption>
                  <IonSelectOption value="low">Low</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Due Date</IonLabel>
                <IonDatetime
                  value={formData.dueDate}
                  onIonChange={handleChange('dueDate')}
                  presentation="date"
                />
              </IonItem>
            </IonList>

            <div className="ion-padding">
              <IonButton
                expand="block"
                type="submit"
                disabled={!formData.title.trim()}
              >
                Save Changes
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => history.push('/')}
              >
                Cancel
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </form>
    </IonContent>
  )
}

export default EditTask 
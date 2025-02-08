import { useState } from 'react'
import { 
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonChip,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonContent
} from '@ionic/react'
import { 
  add as addIcon, 
  trash as trashIcon, 
  pencil as editIcon,
  chevronDown as expandMoreIcon,
  chevronUp as expandLessIcon
} from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { format } from 'date-fns'

function TaskList() {
  const history = useHistory()
  const { 
    tasks, 
    deleteTask, 
    toggleTaskStatus,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority
  } = useTasks()

  const [expandedId, setExpandedId] = useState(null)

  const pendingTasks = tasks.filter(task => task.status === 'pending')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'primary'
      default: return 'medium'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const TaskSection = ({ title, tasks }) => (
    <div className="ion-padding-vertical">
      <h2 className="ion-padding-horizontal">
        {title}
        <IonChip>{tasks.length}</IonChip>
      </h2>
      <IonList>
        {tasks.map((task) => (
          <IonCard key={task.id}>
            <IonItem lines="none">
              <IonCheckbox
                slot="start"
                checked={task.status === 'completed'}
                onIonChange={() => toggleTaskStatus(task.id)}
              />
              <IonLabel 
                className={task.status === 'completed' ? 'ion-text-strike' : ''}
              >
                {task.title}
                <div className="ion-padding-top">
                  <IonChip color={getPriorityColor(task.priority)}>
                    {task.priority}
                  </IonChip>
                  {task.dueDate && (
                    <IonChip outline={true}>
                      {formatDate(task.dueDate)}
                    </IonChip>
                  )}
                </div>
              </IonLabel>
              <IonButton
                fill="clear"
                onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
              >
                <IonIcon icon={expandedId === task.id ? expandLessIcon : expandMoreIcon} />
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => history.push(`/edit/${task.id}`)}
              >
                <IonIcon icon={editIcon} />
              </IonButton>
              <IonButton
                fill="clear"
                color="danger"
                onClick={() => deleteTask(task.id)}
              >
                <IonIcon icon={trashIcon} />
              </IonButton>
            </IonItem>
            {expandedId === task.id && task.description && (
              <IonCardContent>
                {task.description}
              </IonCardContent>
            )}
          </IonCard>
        ))}
      </IonList>
    </div>
  )

  return (
    <IonContent>
      <div className="ion-padding">
        <IonSearchbar
          value={searchQuery}
          onIonInput={e => setSearchQuery(e.detail.value)}
          placeholder="Search tasks..."
        />
        
        <IonSelect
          value={filterPriority}
          onIonChange={e => setFilterPriority(e.detail.value)}
          placeholder="Filter by priority"
        >
          <IonSelectOption value="all">All Priorities</IonSelectOption>
          <IonSelectOption value="high">High</IonSelectOption>
          <IonSelectOption value="medium">Medium</IonSelectOption>
          <IonSelectOption value="low">Low</IonSelectOption>
        </IonSelect>

        {pendingTasks.length > 0 && (
          <TaskSection title="Pending Tasks" tasks={pendingTasks} />
        )}
        
        {completedTasks.length > 0 && (
          <TaskSection title="Completed Tasks" tasks={completedTasks} />
        )}

        {tasks.length === 0 && (
          <div className="ion-text-center ion-padding">
            <p>No tasks yet. Click the + button to add one!</p>
          </div>
        )}
      </div>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => history.push('/create')}>
          <IonIcon icon={addIcon} />
        </IonFabButton>
      </IonFab>
    </IonContent>
  )
}

export default TaskList
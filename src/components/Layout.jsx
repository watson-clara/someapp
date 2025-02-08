import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonBackButton,
  IonRouterOutlet
} from '@ionic/react'
import VoiceCommand from './VoiceCommand'
import TaskList from './TaskList'
import CreateTask from './CreateTask'
import EditTask from './EditTask'

function Layout() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>TaskAI</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/" component={TaskList} />
            <Route path="/create" component={CreateTask} />
            <Route path="/edit/:taskId" component={EditTask} />
          </Switch>
        </IonRouterOutlet>
        <VoiceCommand />
      </IonContent>
    </IonPage>
  )
}

export default Layout 
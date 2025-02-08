import { IonReactRouter } from '@ionic/react-router'
import { IonRouterOutlet, IonApp } from '@ionic/react'
import { Route } from 'react-router-dom'
import { setupIonicReact } from '@ionic/react'
import Layout from './components/Layout'

// Configure Ionic animations
setupIonicReact({
  mode: 'ios', // Use iOS style animations
  animated: true,
  rippleEffect: true,
  hardwareBackButton: true
})

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={Layout} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
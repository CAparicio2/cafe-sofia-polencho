import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Toast from './components/Toast.jsx'
import { useCafe } from './context/CafeContext.jsx'
import Inicio from './screens/Inicio.jsx'
import Carta from './screens/Carta.jsx'
import Sofia from './screens/Sofia.jsx'
import Tocadiscos from './screens/Tocadiscos.jsx'
import Acertijo from './screens/Acertijo.jsx'
import Membresia from './screens/Membresia.jsx'
import Pago from './screens/Pago.jsx'
import Recibo from './screens/Recibo.jsx'

const SCREENS = { inicio: Inicio, carta: Carta, sofia: Sofia, tocadiscos: Tocadiscos, acertijo: Acertijo, membresia: Membresia, pago: Pago, recibo: Recibo }

export default function App() {
  const { screen, mainRef } = useCafe()
  const Screen = SCREENS[screen] || Inicio
  return (
    <>
      <div className="app">
        <Header />
        <main ref={mainRef}>
          <Screen />
        </main>
        <BottomNav />
      </div>
      <Toast />
    </>
  )
}

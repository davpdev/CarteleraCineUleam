//import './App.css'
// import register from './pages/register'
// import home from './pages/home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
// import home from './pages/home'
import Register from './pages/register'
import Reservar from './pages/reservar'
import SalasList from './pages/salas'
import SalasView from './pages/salasView'



function App() {
  return (
    <Routes>
      <Route path='/' element = {< Login/>} /> 
      <Route path='register' element = {< Register/>} />
      <Route path='reservar_sala' element = {< Reservar/>} />
      {/* <Route path='home' element = {< home/>} /> */}
      <Route path = "/" element = {<SalasList />} />
      <Route path = "//:idSalas" element = {<SalasView />} />
    </Routes>
  )
}

export default App

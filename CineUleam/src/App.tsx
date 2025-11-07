//import './App.css'
// import register from './pages/register'
// import home from './pages/home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/home'
import Register from './pages/register'
import SubirPeliculas from './pages/subirPeliculas'
import SalasView from './pages/salasView'
import SalasList from './pages/salas'



function App() {
  return (
    <Routes>
      <Route path='/' element = {< Login/>} /> 
      <Route path='register' element = {< Register/>} />
      <Route path='home' element = {< Home/>} />
      <Route path='subir-peliculas' element = {< SubirPeliculas/>} />
      <Route path='salas' element = {< SalasList/>} />
      <Route path='salas/:idSalas' element = {< SalasView/>} />
    </Routes>
  )
}

export default App

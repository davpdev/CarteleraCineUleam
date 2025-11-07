//import './App.css'
// import register from './pages/register'
// import home from './pages/home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import home from './pages/home'
import Register from './pages/register'



function App() {
  return (
    <Routes>
      <Route path='/' element = {< Login/>} />
      <Route path='register' element = {< Register/>} />
      <Route path='home' element = {< home/>} />
    </Routes>
  )
}

export default App

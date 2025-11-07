import './App.css'
// import register from './pages/register'
// import home from './pages/home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'


function App() {
  return (
    <Routes>
      <Route path='/' element = {< Login/>} />
      {/* <Route path='register' element = {<register />} />
      <Route path='home' element = {<home />} /> */}
    </Routes>
  )
}

export default App

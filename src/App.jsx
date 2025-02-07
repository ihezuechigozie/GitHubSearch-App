import { useState } from 'react'
// import './App.css'
import { Route, BrowserRouter , Routes } from 'react-router-dom'
import GitHub from './Components/Github'
import Display from './Components/Display'


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/Github' element={<GitHub/>}/>
        <Route path='/' element={<Display/>}/>
      </Routes>
      
    </BrowserRouter>
    
    </>
  )
}

export default App

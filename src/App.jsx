import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Bin from './pages/Bin'
import Authentication from './pages/Authentication'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route exact path='/bin' Component={Bin} />
          <Route exact path='/authentication' Component={Authentication} />
          <Route exact path='/profile' Component={Profile} />
          <Route path='/*' Component={NotFound} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App

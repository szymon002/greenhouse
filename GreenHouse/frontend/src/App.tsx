import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import Wallet from './pages/Wallet';

function App() {


  return (
    <>
      <Router>
        <nav>
        <Link to="/">Home</Link> | <Link to="/Board">Board</Link> | <Link to="/Wallet">Wallet</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Board" element={<Board/>} />
          <Route path="/Wallet" element={<Wallet/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App

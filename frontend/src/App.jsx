import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './Page/Home';
import Register from './Page/Register';
import Login from './Page/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;

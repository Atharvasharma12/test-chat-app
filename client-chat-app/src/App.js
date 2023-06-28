import logo from './logo.svg';
import { Route, Routes } from "react-router-dom"
import './App.css';
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
 // "proxy": "https://react-chat-backend-qw1qwfxnw-aishwaryvishwa.vercel.app",
function App() {
  return (
    <>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatPage" element={<ChatPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

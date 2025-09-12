import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/`);
        const data = await response.json();
        setMessage(data.message);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessage();
  }, [BASE_URL]);


  return (
    <>
      <div>
        {message}
      </div>
    </>
  )
}

export default App

import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  const BASE_URL = 'http://127.0.0.1:8000'

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

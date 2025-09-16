import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState<any[]>([]);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessage();
  }, [BASE_URL]);


  return (
    <>
      <div>
        {projects.map((project) => (
          <div key={project.id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            {project.tags.map((tag: string) => (
              <span className="bg-gray-200 px-2 py-1 rounded mr-2 text-sm">{tag}</span>
            ))}
            <p>Difficulty: {project.difficulty}</p>
            <br />
          </div>
        ))}
      </div>
    </>
  )
}

export default App

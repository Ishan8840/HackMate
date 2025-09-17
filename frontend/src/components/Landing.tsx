import { motion } from "framer-motion";
import { useEffect, useState } from "react";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Landing() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/projects`);
        const data = await response.json();
        setProjects(data)
      } catch (e) {
        console.error(e)
      }
    };

    fetchMessage();
  }, [BASE_URL])


  return (
    <div className="grid place-items-center min-h-screen">
      {projects.map((project) => {
        return <Card key={project.id} {...project}/>;
      })}
    </div>
  );
}

const Card = ({id, title, description, tags, difficulty} : {id: number, title: string, description: string, tags: string[], difficulty: string}) => {
  return (
    <motion.div 
      className="w-[25vw] max-w-md h-[60vh] bg-gray-800 rounded-2xl shadow-xl p-12 flex flex-col justify-between gap-6 text-center hover:cursor-grab active:cursor-grabbing"
      style={{gridRow: 1, gridColumn: 1,}}
      drag="x"
      dragConstraints={{
        left: 0, right: 0,
      }}
    >
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-gray-300">{description}</p>

      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm rounded bg-white text-black font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm font-medium text-red-400">
        Difficulty: <span className="text-white">{difficulty}</span>
      </p>
    </motion.div>
  )
}

export default Landing;

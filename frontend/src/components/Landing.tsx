import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { FaTrash, FaHeart } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Landing() {
  const [projects, setProjects] = useState<any[]>([])
  const [buffer, setBuffer] = useState<any[]>([]);

  const [right, setRight] = useState<any[]>(() => {
    const saved = localStorage.getItem("saved");
    return saved ? JSON.parse(saved) : [];
  });  

  const fetchRandomProjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/projects?limit=20`);
      const data = await res.json();
      setBuffer(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRandomProjects();
  }, [])

  useEffect(() => {
    if (projects.length === 0 && buffer.length > 0) {
      setProjects(buffer);
      setBuffer([]);
    }
  }, [projects, buffer]);

  useEffect(() => {
    localStorage.setItem('saved', JSON.stringify(right))
  }, [right])

  useEffect(() => {
    if (projects.length > 0 && projects.length <= 10 && buffer.length === 0) {
      fetchRandomProjects();
    }
  }, [projects, buffer]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="grid place-items-center min-h-screen relative z-10 p-4">
        {projects.map((project, index) => {
          return (
            <Card 
              key={project.id} 
              id={project.id} 
              setProjects={setProjects} 
              projects={projects} 
              setRight={setRight} 
              right={right} 
              index={index}
              {...project}
            />
          );
        })}
        
        {projects.length === 0 && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl font-light">Loading amazing projects...</p>
          </div>
        )}
      </div>
    </div>
  );
}

type CardProps = {
  id: number;
  projects: any[];
  right: any[];
  setProjects: Dispatch<SetStateAction<any[]>>;
  setRight: Dispatch<SetStateAction<any[]>>;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  index: number;
};

const Card = ({ id, projects, setProjects, setRight, right, title, description, tags, difficulty, index }: CardProps) => {
  const x = useMotionValue(0);

  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
  const rotate = useTransform(x, [-150, 150], [-18, 18])
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])

  // Color coding for difficulty
  const getDifficultyColor = (diff: string) => {
    const diffLower = diff.toLowerCase();
    if (diffLower.includes('easy') || diffLower.includes('beginner')) {
      return 'from-green-700 to-emerald-700';
    } else if (diffLower.includes('medium') || diffLower.includes('intermediate')) {
      return 'from-blue-700 to-blue-900';
    } else if (diffLower.includes('hard') || diffLower.includes('advanced')) {
      return 'from-red-700 to-pink-700';
    }
    return 'from-blue-800 to-purple-950';
  };

  const handleDragEnd = () => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    if (Math.abs(x.get()) > 50) {
      if (x.get() > 0 && !right.some(p => p.id === project.id)) {
        setRight([...right, project]);
      }

      setProjects(pv => pv.filter((v) => v.id !== id));
    }
  };

  const swipeLeft = () => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    // Animate x to left
    animate(x, -200, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        setProjects(pv => pv.filter(v => v.id !== id));
      },
    });
  };

  const swipeRight = () => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    // Animate x to right
    animate(x, 200, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        setRight([...right, project]);
        setProjects(pv => pv.filter(v => v.id !== id));
      },
    });
  };

  return (
    <motion.div 
      className="w-[90vw] sm:w-[25vw] max-w-md h-[70vh] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-3xl shadow-base p-8 flex flex-col justify-between gap-6 text-center hover:cursor-grab active:cursor-grabbing border border-gray-300 backdrop-blur-lg"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        scale,
        zIndex: projects.length - index,
      }}
      drag="x"
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: index * 0.1
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}
    >
      {/* Card Header */}
      <div className="space-y-4">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          {title}
        </motion.h2>
        
        <motion.div 
          className={`h-1 w-20 mx-auto rounded-full bg-gradient-to-r ${getDifficultyColor(difficulty)}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        ></motion.div>
      </div>

      {/* Description */}
      <motion.p 
        className="text-gray-300 text-lg leading-relaxed flex-grow flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + index * 0.1 }}
      >
        {description}
      </motion.p>

      {/* Tags */}
      <motion.div 
        className="flex flex-wrap justify-center gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {tags.map((tag, tagIndex) => (
          <motion.span
            key={tagIndex}
            className="px-3 py-2 text-sm rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:border-white/40"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.6 + index * 0.1 + tagIndex * 0.05,
              type: "spring",
              stiffness: 300
            }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Difficulty Badge */}
      <motion.div 
        className="flex justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 + index * 0.1 }}
      >
        <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white font-semibold shadow-lg`}>
          <span className="text-sm opacity-90">Difficulty: </span>
          <span className="text-base">{difficulty}</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex justify-center gap-8 mt-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 + index * 0.1 }}
      >
        <motion.button
          className="w-16 h-16 bg-gradient-to-r from-red-700 to-red-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:cursor-pointer  flex items-center justify-center group relative overflow-hidden"
          onClick={swipeLeft}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100"></div>
          <FaTrash className="relative z-10 text-xl" />
          <div className="absolute -inset-2 bg-red-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-md"></div>
        </motion.button>
        
        <motion.button
          className="w-16 h-16 bg-gradient-to-r from-green-700 to-green-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:cursor-pointer flex items-center justify-center group relative overflow-hidden"
          onClick={swipeRight}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100"></div>
          <FaHeart className="relative z-10 text-xl" />
          <div className="absolute -inset-2 bg-green-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-md"></div>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default Landing;
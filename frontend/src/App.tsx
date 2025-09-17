import { useState, useEffect, useMemo, useRef } from 'react'
import './App.css'
import TinderCard from 'react-tinder-card'
import React from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL

function App() {
  const [projects, setProjects] = useState<any[]>([]);
  const [lastDirection, setLastDirection] = useState<string>()
  const [currentIndex, setCurrentIndex] = useState(projects.length - 1)
  const currentIndexRef = useRef(currentIndex)

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


  const childRefs: React.RefObject<any>[] = useMemo(
    () =>
      Array(projects.length)
        .fill(0)
        .map(() => React.createRef()),
    []
  )
  
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < projects.length - 1

  const canSwipe = currentIndex >= 0

  const swiped = (direction: string, id: number, index: number) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (index: number) => {
    currentIndexRef.current >= index && childRefs[index].current.restoreCard()
  }

  const swipe = async (dir: any) => {
    if (canSwipe && currentIndex < projects.length) {
      await childRefs[currentIndex].current.swipe(dir)
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }



  return (
    <div>
      <h1>React Tinder Card</h1>
      <div className='cardContainer'>
        {projects.map((project, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={project.name}
            onSwipe={(dir) => swiped(dir, project.name, index)}
            onCardLeftScreen={() => outOfFrame(index)}
          >
            <div className='card'>
              <h2>{project.title}</h2>
              <p>{project.discription}</p>
              <p>{project.tags}</p>
              <p>{project.difficulty}</p>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className='buttons'>
        <button onClick={() => swipe('left')}>Swipe left!</button>
        <button onClick={() => goBack()}>Undo swipe!</button>
        <button onClick={() => swipe('right')}>Swipe right!</button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  )
}

export default App

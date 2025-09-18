import { useEffect, useState } from "react"

function Saved() {
  const [saved, setSaved] = useState<any[]>([])

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("saved") || '[]')

    if (items) {
      setSaved(items)
    }
  }, [])

  const deleteSaved = (id: number) => {
    setSaved(prevItems => {
      const updated = prevItems.filter(item => item.id !== id)
      localStorage.setItem("saved", JSON.stringify(updated))
      return updated
    })
  }

  // Color coding for difficulty (matching Landing component)
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
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Saved Projects
          </h1>
          <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
        </div>

        {saved.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((project, index) => {
              return (
                <div 
                  key={project.id} 
                  className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 flex flex-col justify-between gap-6 text-center border border-gray-300 backdrop-blur-lg hover:scale-105 transition-all duration-300 hover:shadow-pink-500/20 hover:shadow-2xl min-h-[400px]"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Card Header */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                      {project.title}
                    </h2>
                    <div className={`h-1 w-16 mx-auto rounded-full bg-gradient-to-r ${getDifficultyColor(project.difficulty)}`}></div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-base leading-relaxed flex-grow flex items-center justify-center">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.isArray(project.tags) ? project.tags.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-2 text-sm rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-200"
                      >
                        {tag}
                      </span>
                    )) : (
                      <span className="px-3 py-2 text-sm rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white font-medium border border-white/20">
                        {project.tags}
                      </span>
                    )}
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex justify-center">
                    <div className={`px-6 py-3 rounded-full bg-gradient-to-r ${getDifficultyColor(project.difficulty)} text-white font-semibold shadow-lg`}>
                      <span className="text-sm opacity-90">Difficulty: </span>
                      <span className="text-base">{project.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button onClick={() => deleteSaved(project.id)} className="px-5 py-2 rounded-full bg-gradient-to-r from-red-800 to-pink-900 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-500/40 transition-all duration-300">Remove</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center border border-gray-500">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              No Saved Projects
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Save some projects from the main page to see them here
            </p>
            <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-gray-600 to-gray-700"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Saved
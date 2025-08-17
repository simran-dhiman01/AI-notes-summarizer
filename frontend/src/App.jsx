import React from 'react'
import InputSection from './components/InputSection'

const App = () => {
  return (
    <div className='flex flex-col p-10 min-h-screen items-center justify-center gap-10'>
      <h1 className='bg-sky-100 font-semibold text-2xl shadow-sky-200 rounded-2xl p-6 shadow-md text-black'>
                    AI Powered Notes Summarizer
                </h1>

  <InputSection/>
    </div>
  )
}

export default App

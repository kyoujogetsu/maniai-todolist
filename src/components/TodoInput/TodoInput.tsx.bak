import React, { useState } from 'react'
import { NewTodo, LANGUAGES } from '../../types/todo'

interface TodoInputProps {
  onAdd: (todo: NewTodo) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    onAdd({
      text: text.trim(),
      deadline: new Date(),
      language: selectedLanguage
    })
    
    setText('')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-2 mb-4">
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setSelectedLanguage(lang.id)}
            className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            {lang.nativeName}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="添加新任务..."
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          添加
        </button>
      </form>
    </div>
  )
}

import React, { useState } from 'react'
import { LANGUAGES, Language } from '../../types/todo'
import styles from './TodoInput.module.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface TodoInputProps {
  onAdd: (todo: any) => void
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ja')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !date) return

    onAdd({
      title: text.trim(),    // 这里改成 title
      deadline: date,
      language: selectedLanguage
    })

    setText('')
    setDate(null)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.languageSelector}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            type="button"
            className={`${styles.languageButton} ${selectedLanguage === lang.id ? styles.selected : ''}`}
            onClick={() => setSelectedLanguage(lang.id)}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="タスクを入力..."
          className={styles.input}
        />
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          placeholderText="期限を選択..."
          className={styles.datePicker}
        />
        <button type="submit" className={styles.button}>
          追加
        </button>
      </div>
    </form>
  )
}

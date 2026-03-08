import { useState, useRef } from 'react'

export function useFileInput({ accept, maxSize }) {
  const [fileName, setFileName]     = useState('')
  const [error, setError]           = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef                = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File must be under ${maxSize}MB`)
      return
    }
    setError('')
    setFileName(file.name)
    setSelectedFile(file)
  }

  const clearFile = () => {
    setFileName('')
    setError('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return { fileName, error, fileInputRef, handleFileSelect, clearFile, selectedFile }
}

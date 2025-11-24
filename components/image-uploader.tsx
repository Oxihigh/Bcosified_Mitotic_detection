"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  onUpload: (file: File) => void
  loading: boolean
}

export default function ImageUploader({ onUpload, loading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFileName(file.name)
        setFileSize(formatFileSize(file.size))
      }
      reader.readAsDataURL(file)
      onUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="text-4xl mb-2">📤</div>
        <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {preview && (
        <div className="relative group">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full rounded-lg max-h-96 object-cover" />
          <div className="absolute top-2 left-2 bg-background/90 backdrop-blur px-3 py-1 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
            <span>✅</span>
            <div>
              <p className="font-medium text-foreground">{fileName}</p>
              <p className="text-muted-foreground">{fileSize}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setPreview("")
              setFileName("")
              setFileSize("")
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
          <p className="text-sm font-medium text-foreground">Processing image...</p>
          <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
        </div>
      )}
    </div>
  )
}

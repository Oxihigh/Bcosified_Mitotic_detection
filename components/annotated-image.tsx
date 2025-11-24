"use client"

import { useEffect, useRef } from "react"

interface Detection {
  class: string
  confidence: number
  bbox: [number, number, number, number]
}

interface AnnotatedImageProps {
  imageSrc: string
  detections: Detection[]
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"]

export default function AnnotatedImage({ imageSrc, detections }: AnnotatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageSrc) return

    const image = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const drawAnnotations = () => {
      // Set canvas size to match image
      canvas.width = image.width
      canvas.height = image.height

      // Draw image
      ctx.drawImage(image, 0, 0)

      // Draw detections
      detections.forEach((detection, idx) => {
        const [x1, y1, x2, y2] = detection.bbox
        const color = COLORS[idx % COLORS.length]

        // Draw bounding box
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)

        // Draw label background
        const label = `${detection.class} ${(detection.confidence * 100).toFixed(1)}%`
        ctx.font = "14px Arial"
        const textMetrics = ctx.measureText(label)
        const textHeight = 20

        ctx.fillStyle = color
        ctx.fillRect(x1, y1 - textHeight, textMetrics.width + 8, textHeight)

        // Draw label text
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(label, x1 + 4, y1 - 5)
      })
    }

    if (image.complete) {
      drawAnnotations()
    } else {
      image.onload = drawAnnotations
    }
  }, [imageSrc, detections])

  return (
    <div className="relative w-full">
      <img ref={imageRef} src={imageSrc || "/placeholder.svg"} alt="Source" className="hidden" />
      <canvas ref={canvasRef} className="w-full rounded-lg border border-border" />
    </div>
  )
}

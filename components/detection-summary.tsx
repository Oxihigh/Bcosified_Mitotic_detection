"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react"

interface Detection {
  class: string
  confidence: number
  bbox: [number, number, number, number]
}

interface DetectionSummaryProps {
  detections: Detection[]
  processingTime: number
}

export default function DetectionSummary({ detections, processingTime }: DetectionSummaryProps) {
  const highConfidence = detections.filter((d) => d.confidence > 0.8).length
  const lowConfidence = detections.filter((d) => d.confidence < 0.6).length
  const avgConfidence =
    detections.length > 0 ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-3 bg-green-500/10 border-green-500/20">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle size={16} className="text-green-500" />
          <span className="text-xs font-medium text-muted-foreground">High Confidence</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{highConfidence}</p>
      </Card>

      <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle size={16} className="text-yellow-500" />
          <span className="text-xs font-medium text-muted-foreground">Low Confidence</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{lowConfidence}</p>
      </Card>

      <Card className="p-3 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-blue-500" />
          <span className="text-xs font-medium text-muted-foreground">Avg Confidence</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{(avgConfidence * 100).toFixed(1)}%</p>
      </Card>

      <Card className="p-3 bg-purple-500/10 border-purple-500/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground">Processing</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{processingTime.toFixed(2)}s</p>
      </Card>
    </div>
  )
}

"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Download } from "lucide-react"

interface HistoryItem {
  id: string
  timestamp: string
  fileName: string
  detectionCount: number
  avgConfidence: number
  processingTime: number
}

interface ResultsHistoryProps {
  items: HistoryItem[]
  onDelete: (id: string) => void
  onSelect: (id: string) => void
}

export default function ResultsHistory({ items, onDelete, onSelect }: ResultsHistoryProps) {
  if (items.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed">
        <p className="text-muted-foreground">No detection history yet</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card
          key={item.id}
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border"
          onClick={() => onSelect(item.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.fileName}</p>
              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                <span>{item.detectionCount} detections</span>
                <span>{(item.avgConfidence * 100).toFixed(1)}% avg confidence</span>
                <span>{item.processingTime.toFixed(2)}s</span>
                <span>{item.timestamp}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Export functionality
                }}
              >
                <Download size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

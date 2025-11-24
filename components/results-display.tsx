"use client"

import Image from "next/image"

// --- STEP 1: Update the Detection interface ---
interface Detection {
  id: number
  class: string
  confidence: number
  bbox: [number, number, number, number]
  heatmap_image: string | null // <-- THIS IS THE FIX
}

// This interface now matches the JSON from our 'main.py'
interface ResultsDisplayProps {
  results: {
    original_image: string
    yolo_annotated_image: string
    final_annotated_image: string
    detections: Detection[]
    summary: {
      total_candidates: number
      mitotic_count: number
      non_mitotic_count: number
    }
  }
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  
  const { detections, summary } = results

  return (
    <div className="space-y-6">
      
      {/* 3-Panel Image Display (no changes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Original uploaded WSI image</h3>
          <Image
            src={`data:image/png;base64,${results.original_image}`}
            alt="Original Upload"
            width={512}
            height={512}
            className="rounded-lg border"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Stage 1: candidate identification</h3>
          <Image
            src={`data:image/png;base64,${results.yolo_annotated_image}`}
            alt="YOLO Detections"
            width={512}
            height={512}
            className="rounded-lg border"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Stage 2: mitotic recognition</h3>
          <Image
            src={`data:image/png;base64,${results.final_annotated_image}`}
            alt="Final Results with Saliency"
            width={512}
            height={512}
            className="rounded-lg border"
          />
        </div>
      </div>

      {/* Stats Grid (no changes) */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-muted-foreground">Total Candidates</p>
          <p className="text-2xl font-bold text-foreground">{summary.total_candidates}</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-muted-foreground">Confirmed Mitotic</p>
          <p className="text-2xl font-bold text-green-500">{summary.mitotic_count}</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-muted-foreground">Other</p>
          <p className="text-2xl font-bold text-foreground">{summary.total_candidates - summary.mitotic_count}</p>
        </div>
      </div>

      {/* Detections List (no changes) */}
      <div className="space-y-2">
        <h3 className="font-semibold">All Candidates List</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {detections.map((detection) => (
            <div key={detection.id} className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium text-foreground capitalize ${
                    detection.class === 'mitotic' ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {detection.class} (Candidate #{detection.id})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Position: ({detection.bbox[0]}, {detection.bbox[1]}) to ({detection.bbox[2]}, {detection.bbox[3]})
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-8 bg-gradient-to-r from-red-500 to-green-500 rounded relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{(detection.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"use client"

import Image from "next/image"

// --- STEP 1: Update the interfaces ---
interface Detection {
  id: number // <-- ADD THIS
  class: string
  confidence: number
  bbox: [number, number, number, number]
  heatmap_image: string | null // <-- ADD THIS
}

interface Summary {
  total_candidates: number
  mitotic_count: number
  non_mitotic_count: number
}

interface ExplainabilityPanelProps {
  detections: Detection[]
  summary: Summary
}

export default function ExplainabilityPanel({ detections, summary }: ExplainabilityPanelProps) {

  const classDistribution = detections.reduce(
    (acc, d) => {
      const existing = acc.find((item) => item.name === d.class)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: d.class, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )
  
  // --- NEW: Filter for patches that have a heatmap ---
  const mitoticPatches = detections.filter(
    (d) => d.class === 'mitotic' && d.heatmap_image && d.confidence >= 0.7
  );

  return (
    <div className="space-y-6">
    
      {/* --- NEW: Individual Patch Display --- */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold mb-4">
          Confirmed Mitotic Patches ({mitoticPatches.length})
        </h3>
        {mitoticPatches.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mitoticPatches.map((patch) => (
              <div key={patch.id} className="text-center">
                <Image
                  src={`data:image/png;base64,${patch.heatmap_image}`}
                  alt={`Mitotic patch ${patch.id}`}
                  width={224}
                  height={224}
                  className="rounded-lg border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Patch #{patch.id} ({(patch.confidence * 100).toFixed(0)}%)
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No patches were confirmed as mitotic (above the 70% threshold) in this image.
          </p>
        )}
      </div>

      {/* --- Confidence & Distribution Grids --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold mb-4">Confidence Scores (All Candidates)</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {detections.map((detection, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className={`text-sm font-medium capitalize ${
                    detection.class === 'mitotic' ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {detection.class}
                  </span>
                  <span className="text-sm text-muted-foreground">{(detection.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${detection.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold mb-4">Detection Distribution</h3>
          <div className="space-y-2">
            {classDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium capitalize">{item.name}</span>
                <span className="text-sm font-bold text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Model Explanation --- */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold mb-3">Model Explanation</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Stage 1 (Detection):</span> YOLOv11 + SAHI Sliced Inference
          </p>
          <p>
            <span className="font-medium text-foreground">Stage 2 (Classification):</span> B-cos ResNet50
          </p>
          <p>
            <span className="font-medium text-foreground">Explainability:</span> B-cos Saliency Maps
          </p>
          <p>
            <span className="font-medium text-foreground">Total Candidates Found:</span> {summary.total_candidates}
          </p>
          <p>
            <span className="font-medium text-foreground">Confirmed Mitotic Cells:</span> {summary.mitotic_count}
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUploader from "@/components/image-uploader"
import ResultsDisplay from "@/components/results-display"
import ExplainabilityPanel from "@/components/explainability-panel"

type DemoSectionProps = {}

export default function DemoSection({}: DemoSectionProps) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageUpload = async (file: File) => {
    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Detection failed")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 gradient-text">Try the Demo</h2>
          <p className="text-lg text-muted-foreground">Upload a histopathological image to see our models in action</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Panel */}
          <div>
            <Card className="glass p-8 sticky top-32">
              <h3 className="text-xl font-semibold mb-6">Upload Image</h3>
              <ImageUploader onUpload={handleImageUpload} loading={loading} />
            </Card>
          </div>

          {/* Results Panel */}
          {results && (
            <div className="lg:col-span-2">
              <Card className="glass p-8">
                <Tabs defaultValue="results" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
                    <TabsTrigger value="results">Detection Results</TabsTrigger>
                    <TabsTrigger value="explainability">Explainability</TabsTrigger>
                  </TabsList>

                  <TabsContent value="results" className="mt-4">
                    <ResultsDisplay results={results} />
                  </TabsContent>

                  <TabsContent value="explainability" className="mt-4">
                <ExplainabilityPanel detections={results.detections} summary={results.summary} />
</TabsContent>
                </Tabs>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!results && !loading && (
            <div className="lg:col-span-2">
              <Card className="glass p-12 text-center border-dashed">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">No image uploaded yet</h3>
                <p className="text-muted-foreground">
                  Upload an image to see detection results and explainability visualizations
                </p>
              </Card>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"

export default function AboutSection() {
  const features = [
    {
      icon: "🔍",
      title: "Stage 1: Detection",
      description: "YOLO 11 L detects candidate regions (potential mitotic figures) in histopathological images",
    },
    {
      icon: "👁️",
      title: "Stage 2: Classification",
      description: "B-COSified ResNet50 classifies each detected region as Mitotic or Non-Mitotic",
    },
    {
      icon: "⚡",
      title: "Explainability",
      description: "B-COS visualization shows which image features contribute to each prediction",
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">About the Project</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A two-stage deep learning pipeline for interpretable breast cancer grading using histopathological images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index}>
              <Card className="glass p-8 h-full hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="glass p-12 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">Why Explainability Matters</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            In medical AI, understanding how models make decisions is crucial for clinical adoption. Our B-COSified
            models provide transparent, interpretable predictions that clinicians can trust and validate.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By visualizing which image features contribute to each prediction, we enable medical professionals to
            understand the model's reasoning and identify potential biases or errors.
          </p>
        </div>
      </div>
    </div>
  )
}

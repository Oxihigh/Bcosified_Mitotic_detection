"use client"

interface LandingSectionProps {
  onNavigate: (section: string) => void
}

export default function LandingSection({ onNavigate }: LandingSectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="text-center max-w-4xl mx-auto px-6">
        <div className="mb-6 flex justify-center">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-sm text-primary">✨</span>
            <span className="text-sm text-muted-foreground">Cutting-edge AI Research</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
          Explainable AI for Histopathological Interpretation
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          B-COSified Deep Learning Models for Interpretable Breast Cancer Grading. Understand how AI makes decisions.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate("demo")}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 glow hover:shadow-xl transition-shadow"
          >
            Try Demo →
          </button>
          <button
            onClick={() => onNavigate("team")}
            className="px-8 py-3 glass rounded-full font-semibold hover:bg-white/10 transition-colors"
          >
            Meet the Team
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Explainable AI Detection</h1>
            <p className="text-sm text-muted-foreground mt-1">Advanced object detection with model interpretability</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="text-right">
              <p className="font-medium text-foreground">Model Status</p>
              <p className="text-green-500 text-xs">Ready</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

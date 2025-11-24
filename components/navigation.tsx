"use client"

interface NavigationProps {
  activeSection: string
  onNavigate: (section: string) => void
}

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const navItems = [
    { id: "landing", label: "Home" },
    { id: "demo", label: "Demo" },
    { id: "about", label: "About" },
    { id: "team", label: "Team" },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("landing")}>
          <span className="text-xl font-bold text-primary">🧠</span>
          <span className="font-semibold text-lg">ExplainableAI</span>
        </div>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative text-sm font-medium transition-colors ${
                activeSection === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

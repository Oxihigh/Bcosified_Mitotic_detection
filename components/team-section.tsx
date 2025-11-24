"use client"

import { Card } from "@/components/ui/card"

interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
  color: string
}

export default function TeamSection() {
  const team: TeamMember[] = [
    {
      name: "Prof. Rashmi",
      role: "Project Guide",
      bio: "Associate Professor, Dept. of Information Science",
      initials: "R",
      color: "from-primary to-accent",
    },
    {
      name: "Sai Skanda",
      role: "Student",
      bio: "Web Development",
      initials: "S",
      color: "from-accent to-secondary",
    },
    {
      name: "Skanda",
      role: "Student",
      bio: "Data Scientist",
      initials: "S",
      color: "from-secondary to-primary",
    },
    {
      name: "Dhruti",
      role: "Student",
      bio: "Data Scientist",
      initials: "D",
      color: "from-primary to-secondary",
    },
    {
      name: "Rajesh Kumar",
      role: "Student",
      bio: "ML Engineer",
      initials: "R",
      color: "from-primary to-secondary",
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">Meet the Team</h2>
          <p className="text-lg text-muted-foreground">Students of Dept. of information science and engineering</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index}>
              <Card className="glass p-6 h-full flex flex-col items-center text-center hover:bg-white/10 transition-colors group">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-xl font-bold text-white mb-4 glow`}
                >
                  {member.initials}
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

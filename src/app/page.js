import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, Facebook, Twitter, Instagram } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" />
            <span className="font-semibold">Opportunity Lens</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Empowering You to Explore, Learn, and Grow with Precision.
            </h1>
            <p className="text-lg text-muted-foreground">
            A smarter way to unlock new opportunities and enhance your potential.n
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "85%", label: "Customer Satisfaction" },
              { value: "95%", label: "Growth Rate" },
              { value: "90%", label: "User Retention" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-1 border-4 border-primary rounded-full border-t-transparent transform -rotate-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{stat.value}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                      <Image
                        src="/placeholder.svg"
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">John Doe</h3>
                      <p className="text-sm text-muted-foreground">CEO, Company Inc</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "This platform has revolutionized how we manage our business. Highly recommended!"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="logo" />
                <span className="font-semibold">Opportunity Lens</span>
              </div>
              <p className="text-sm text-muted-foreground">Making business management simple and efficient</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <Instagram className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


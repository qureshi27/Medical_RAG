import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Database, Search, Users, FileText, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MediPedia</h1>
                <p className="text-xs text-muted-foreground">Smart AI Medical Database</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#research" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Research
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            Department of Technology, The University of Lahore
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Empowering Healthcare with AI
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            MediPedia is an intelligent medical database that leverages artificial intelligence to provide healthcare
            professionals and students with instant access to comprehensive medical knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Start A Demo
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Learn More
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Developed under supervision of <span className="font-semibold">Mr. Nasir Noman</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how MediPedia transforms medical research and learning through advanced AI capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Search</CardTitle>
                <CardDescription>
                  Intelligent search capabilities that understand medical terminology and context
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Comprehensive Database</CardTitle>
                <CardDescription>
                  Extensive collection of medical documents, research papers, and clinical data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Secure user management with different access levels for students and administrators
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Easy upload, organization, and retrieval of medical documents and research materials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Smart Suggestions</CardTitle>
                <CardDescription>
                  AI-driven query suggestions to help users discover relevant medical information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security ensuring data privacy and system reliability
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About MediPedia</h2>
              <p className="text-lg text-muted-foreground mb-6">
                MediPedia represents the cutting edge of medical information technology, combining artificial
                intelligence with comprehensive medical databases to create an unparalleled resource for healthcare
                education and research.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Developed at the Department of Technology, The University of Lahore, under the expert supervision of Mr.
                Nasir Noman, this platform serves both educational institutions and healthcare professionals worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Advanced AI-powered medical search</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Comprehensive document management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Secure role-based access control</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Brain className="w-20 h-20 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground">AI-Powered Intelligence</p>
                  <p className="text-muted-foreground">Transforming Medical Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Medical Research?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of healthcare professionals and students who trust MediPedia for their medical information
            needs.
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-6">
              Start A Demo Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">MediPedia</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Empowering healthcare with AI-driven medical database solutions.
              </p>
              <p className="text-sm text-muted-foreground">
                Department of Technology
                <br />
                The University of Lahore
                <br />
                Supervised by Mr. Nasir Noman
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Search</li>
                <li>Document Management</li>
                <li>User Roles</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MediPedia. All rights reserved. Developed at The University of Lahore.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

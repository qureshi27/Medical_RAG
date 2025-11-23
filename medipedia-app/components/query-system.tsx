"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Lightbulb,
  History,
  Search,
  TrendingUp,
  BookOpen,
  Heart,
  Brain,
  Stethoscope,
  Microscope,
  Pill,
  Activity,
  ChevronRight,
} from "lucide-react"

interface QueryTemplate {
  id: string
  title: string
  query: string
  category: string
  icon: React.ReactNode
  description: string
}

interface QueryHistory {
  id: string
  query: string
  timestamp: Date
  category?: string
}

interface SmartSuggestion {
  text: string
  category: string
  confidence: number
  reason: string
}

interface QuerySystemProps {
  onQuerySelect: (query: string) => void
  isLoading?: boolean
  documents: any[]
  recentQueries?: QueryHistory[]
}

export function QuerySystem({ onQuerySelect, isLoading = false, documents, recentQueries = [] }: QuerySystemProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([])
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>(recentQueries)
  const [showAutoComplete, setShowAutoComplete] = useState(false)

  // Enhanced query templates organized by medical categories
  const queryTemplates: QueryTemplate[] = [
    // Cardiology
    {
      id: "cardio-1",
      title: "Heart Disease Basics",
      query: "What are the main types of heart disease and their symptoms?",
      category: "Cardiology",
      icon: <Heart className="w-4 h-4" />,
      description: "Learn about cardiovascular conditions",
    },
    {
      id: "cardio-2",
      title: "Hypertension Management",
      query: "How is high blood pressure diagnosed and treated?",
      category: "Cardiology",
      icon: <Activity className="w-4 h-4" />,
      description: "Blood pressure management strategies",
    },

    // Neurology
    {
      id: "neuro-1",
      title: "Neurological Disorders",
      query: "What are common neurological disorders and their treatments?",
      category: "Neurology",
      icon: <Brain className="w-4 h-4" />,
      description: "Brain and nervous system conditions",
    },
    {
      id: "neuro-2",
      title: "Stroke Prevention",
      query: "What are the risk factors and prevention methods for stroke?",
      category: "Neurology",
      icon: <Brain className="w-4 h-4" />,
      description: "Cerebrovascular health information",
    },

    // General Medicine
    {
      id: "general-1",
      title: "Diagnostic Procedures",
      query: "What are common diagnostic tests and when are they used?",
      category: "General Medicine",
      icon: <Stethoscope className="w-4 h-4" />,
      description: "Medical testing and diagnostics",
    },
    {
      id: "general-2",
      title: "Preventive Care",
      query: "What preventive care measures are recommended by age group?",
      category: "General Medicine",
      icon: <BookOpen className="w-4 h-4" />,
      description: "Health maintenance guidelines",
    },

    // Pharmacology
    {
      id: "pharma-1",
      title: "Drug Interactions",
      query: "How do drug interactions occur and how can they be prevented?",
      category: "Pharmacology",
      icon: <Pill className="w-4 h-4" />,
      description: "Medication safety information",
    },
    {
      id: "pharma-2",
      title: "Antibiotic Resistance",
      query: "What is antibiotic resistance and how can it be addressed?",
      category: "Pharmacology",
      icon: <Microscope className="w-4 h-4" />,
      description: "Antimicrobial stewardship",
    },

    // Research & AI
    {
      id: "research-1",
      title: "Medical AI Applications",
      query: "How is artificial intelligence being used in medical diagnosis?",
      category: "Medical AI",
      icon: <Brain className="w-4 h-4" />,
      description: "AI in healthcare applications",
    },
    {
      id: "research-2",
      title: "Clinical Research Methods",
      query: "What are the different types of clinical studies and their purposes?",
      category: "Research",
      icon: <BookOpen className="w-4 h-4" />,
      description: "Evidence-based medicine principles",
    },
  ]

  // Auto-completion suggestions based on input
  const autoCompleteSuggestions = [
    "What is the treatment for",
    "How is diagnosed",
    "What are the symptoms of",
    "What causes",
    "How to prevent",
    "What are the side effects of",
    "How does work",
    "What is the difference between",
    "When should I see a doctor for",
    "What are the risk factors for",
  ]

  // Generate smart suggestions based on document categories
  useEffect(() => {
    const categories = new Set(documents.map((doc) => doc.category || "general"))
    const suggestions: SmartSuggestion[] = []

    categories.forEach((category) => {
      const categoryQueries = queryTemplates.filter(
        (template) =>
          template.category.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(template.category.toLowerCase()),
      )

      categoryQueries.slice(0, 2).forEach((template) => {
        suggestions.push({
          text: template.query,
          category: template.category,
          confidence: 0.8,
          reason: `Based on ${category} documents in your knowledge base`,
        })
      })
    })

    setSmartSuggestions(suggestions.slice(0, 6))
  }, [documents])

  // Add query to history
  const addToHistory = (query: string) => {
    const newHistoryItem: QueryHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      category: "Recent",
    }

    setQueryHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]) // Keep last 10
  }

  const handleQuerySelect = (query: string) => {
    addToHistory(query)
    onQuerySelect(query)
    setShowAutoComplete(false)
  }

  const getFilteredTemplates = (category?: string) => {
    if (!category) return queryTemplates
    return queryTemplates.filter((template) => template.category === category)
  }

  const categories = [...new Set(queryTemplates.map((t) => t.category))]

  const getAutoCompleteOptions = () => {
    if (!searchTerm) return []

    return autoCompleteSuggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((suggestion) => `${suggestion} ${searchTerm}`)
      .slice(0, 5)
  }

  return (
    <div className="space-y-6">
      {/* Smart Query Input with Auto-complete */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Smart Query Assistant
          </CardTitle>
          <CardDescription>Start typing for intelligent suggestions or browse templates below</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={showAutoComplete} onOpenChange={setShowAutoComplete}>
            <PopoverTrigger asChild>
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowAutoComplete(e.target.value.length > 2)
                }}
                placeholder="Type your medical question or search templates..."
                className="w-full"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    handleQuerySelect(searchTerm)
                    setSearchTerm("")
                  }
                }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search suggestions..." />
                <CommandList>
                  <CommandEmpty>No suggestions found.</CommandEmpty>
                  <CommandGroup heading="Auto-complete">
                    {getAutoCompleteOptions().map((option, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => {
                          handleQuerySelect(option)
                          setSearchTerm("")
                        }}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Query Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Query Templates
          </CardTitle>
          <CardDescription>Pre-designed queries organized by medical specialty</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.slice(0, 5).map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid md:grid-cols-2 gap-3">
                {queryTemplates.slice(0, 8).map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-auto p-4 justify-start text-left hover:bg-primary/5 bg-transparent"
                    onClick={() => handleQuerySelect(template.query)}
                    disabled={isLoading}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="text-primary mt-0.5">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">{template.title}</p>
                        <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 gap-3">
                  {getFilteredTemplates(category).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="h-auto p-4 justify-start text-left hover:bg-primary/5 bg-transparent"
                      onClick={() => handleQuerySelect(template.query)}
                      disabled={isLoading}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="text-primary mt-0.5">{template.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm mb-1">{template.title}</p>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Smart Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Smart Suggestions
            </CardTitle>
            <CardDescription>AI-powered suggestions based on your knowledge base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                  onClick={() => handleQuerySelect(suggestion.text)}
                  disabled={isLoading}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{suggestion.text}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(suggestion.confidence * 100)}% match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Query History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Queries
            </CardTitle>
            <CardDescription>Your recent search history</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {queryHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No recent queries yet</p>
                ) : (
                  queryHistory.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                      onClick={() => handleQuerySelect(item.query)}
                      disabled={isLoading}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.query}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp.toLocaleString()}</p>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

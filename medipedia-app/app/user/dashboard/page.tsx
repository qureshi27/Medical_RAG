"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { DocumentManager } from "@/components/document-manager"
import { QuerySystem } from "@/components/query-system"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Brain, Clock, User, Bot, Database, AlertCircle, Loader2, Sparkles } from "lucide-react"
import { APIService, type Document } from "@/lib/api"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isLoading?: boolean
  relatedQueries?: string[]
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string>("")
  const [queryHistory, setQueryHistory] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchDocuments = async () => {
    try {
      const data = await APIService.getDocuments()
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  useEffect(() => {
    fetchDocuments()
    // Add welcome message
    setMessages([
      {
        id: "welcome",
        type: "assistant",
        content:
          "Welcome to MediPedia! I'm your AI assistant ready to help you explore our medical knowledge base. Ask me anything about the uploaded documents or use the query templates and suggestions below.",
        timestamp: new Date(),
        relatedQueries: [
          "What medical specialties are covered in the knowledge base?",
          "How can I search for specific medical conditions?",
          "What types of documents are available?",
        ],
      },
    ])
  }, [])

  // Generate related queries based on response
  const generateRelatedQueries = (query: string, response: string): string[] => {
    const relatedQueries = [
      `Tell me more about ${query.split(" ").slice(-2).join(" ")}`,
      `What are the latest research findings on ${query.split(" ").slice(-1)[0]}?`,
      `How is this related to other medical conditions?`,
      `What are the treatment options available?`,
      `Are there any preventive measures?`,
    ]
    return relatedQueries.slice(0, 3)
  }

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputValue.trim()
    if (!query || isLoading) return

    setError("")
    setInputValue("")

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    }

    // Add loading assistant message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setIsLoading(true)

    setQueryHistory((prev) => [
      {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        category: "Recent",
        user_id: user?.id || "anonymous",
      },
      ...prev.filter((q) => q.user_id === (user?.id || "anonymous")).slice(0, 9),
    ])

    try {
      const response = await APIService.sendQuery(user?.id || "anonymous", query)

      const responseContent = `${response.response}

**References:**
${response.references.map((ref) => `• ${ref}`).join("\n")}

*Confidence: ${Math.round(response.confidence * 100)}%*`

      // Replace loading message with actual response and related queries
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: responseContent,
                isLoading: false,
                relatedQueries: generateRelatedQueries(query, response.response),
              }
            : msg,
        ),
      )
    } catch (error) {
      setError("Failed to send query. Please try again.")
      // Remove loading message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Knowledge Explorer</h1>
            <p className="text-muted-foreground">
              Ask questions and explore our medical knowledge base with AI-powered assistance
            </p>
          </div>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="queries">Query Assistant</TabsTrigger>
              <TabsTrigger value="documents">Document Library</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar - Document Stats */}
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="w-5 h-5" />
                        Knowledge Base
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Documents</span>
                        <Badge variant="secondary">{documents.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Categories</span>
                        <Badge variant="secondary">{new Set(documents.map((d) => d.category || "general")).size}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Queries Today</span>
                        <Badge variant="secondary">{queryHistory.length}</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Access to comprehensive medical literature and research papers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Chat Interface */}
                <div className="lg:col-span-3">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        AI Assistant
                      </CardTitle>
                      <CardDescription>Ask questions about medical topics and research</CardDescription>
                    </CardHeader>

                    {/* Messages Area */}
                    <CardContent className="flex-1 p-0">
                      <ScrollArea className="h-full p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id} className="space-y-3">
                              <div
                                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      message.type === "user" ? "bg-primary" : "bg-secondary"
                                    }`}
                                  >
                                    {message.type === "user" ? (
                                      <User className="w-4 h-4 text-primary-foreground" />
                                    ) : (
                                      <Bot className="w-4 h-4 text-secondary-foreground" />
                                    )}
                                  </div>
                                  <div
                                    className={`rounded-lg p-3 ${
                                      message.type === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {message.isLoading ? (
                                      <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Thinking...</span>
                                      </div>
                                    ) : (
                                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    )}
                                    <p
                                      className={`text-xs mt-2 ${
                                        message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                      }`}
                                    >
                                      {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {message.type === "assistant" && message.relatedQueries && !message.isLoading && (
                                <div className="ml-11 space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Related questions you might ask:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {message.relatedQueries.map((relatedQuery, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 hover:bg-primary/5 bg-transparent"
                                        onClick={() => handleSendMessage(relatedQuery)}
                                        disabled={isLoading}
                                      >
                                        {relatedQuery}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                    </CardContent>

                    {/* Input Area */}
                    <div className="border-t p-4">
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about medical topics..."
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim()}>
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Press Enter to send, Shift+Enter for new line</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="queries" className="space-y-6">
              <QuerySystem
                onQuerySelect={handleSendMessage}
                isLoading={isLoading}
                documents={documents}
                recentQueries={queryHistory}
              />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <DocumentManager isAdmin={false} showUpload={false} showDelete={false} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

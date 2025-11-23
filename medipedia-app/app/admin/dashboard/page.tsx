"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { DocumentManager } from "@/components/document-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { APIService, type Document } from "@/lib/api"
import {
  Users,
  BarChart3,
  Plus,
  AlertCircle,
  CheckCircle,
  Search,
  Calendar,
  FileText,
  Upload,
  MessageSquare,
  Send,
  Bot,
  User,
} from "lucide-react"

interface QueryStat {
  user_id: string
  query: string
  timestamp: string
  response_time?: number
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  references?: string[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [users, setUsers] = useState<{ id: string; email: string; role: "user" | "admin"; created_at?: string }[]>([])
  const [queries, setQueries] = useState<QueryStat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalUsers: 0,
    totalQueries: 0,
    recentUploads: 0,
  })
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  const fetchDocuments = async () => {
    try {
      const data = await APIService.getDocuments()
      setDocuments(data)
      setStats((prev) => ({ ...prev, totalDocuments: data.length }))
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      setMessage({ type: "error", text: "Please select a file to upload" })
      setIsLoading(false)
      return
    }

    try {
      const result = await APIService.uploadDocument(file, category)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        fetchDocuments()
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error during upload" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDocument = async (documentName: string) => {
    if (!confirm(`Are you sure you want to delete "${documentName}"?`)) return

    setIsLoading(true)
    try {
      const result = await APIService.deleteDocument(documentName)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        fetchDocuments()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error during deletion" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const newUser = {
          id: email,
          email,
          role: role as "user" | "admin",
          created_at: new Date().toISOString(),
        }
        setUsers((prev) => [...prev, newUser])
        setMessage({ type: "success", text: "User added successfully!" })
        ;(e.target as HTMLFormElement).reset()
      } else {
        const errorData = await response.json()
        setMessage({ type: "error", text: errorData.detail || "Failed to add user" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error while adding user" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminChat = async () => {
    if (!chatInput.trim() || isChatLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await APIService.sendQuery(user?.id || "admin", chatInput)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.response,
        timestamp: new Date(),
        references: response.references,
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
    setUsers([
      { id: "1", email: "admin@uol.edu.pk", role: "admin", created_at: "2024-01-01" },
    ])
    setQueries([
      { user_id: "2", query: "What is Reinforcement Learning?", timestamp: "2024-02-15T10:30:00Z", response_time: 1.2 },
      { user_id: "3", query: "Machine Learning algorithms", timestamp: "2024-02-15T11:45:00Z", response_time: 0.8 },
      { user_id: "2", query: "Deep Learning applications", timestamp: "2024-02-15T14:20:00Z", response_time: 1.5 },
    ])
    setStats((prev) => ({ ...prev, totalUsers: 3, totalQueries: 3, recentUploads: 2 }))

    setChatMessages([
      {
        id: "welcome",
        type: "assistant",
        content:
          "Hello Admin! I can help you test queries, analyze system performance, and provide insights about the knowledge base. What would you like to know?",
        timestamp: new Date(),
      },
    ])
  }, [])

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage documents, users, and monitor system activity</p>
          </div>

          {/* Message Alert */}
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <p className="text-xs text-muted-foreground">In knowledge base</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQueries}</div>
                <p className="text-xs text-muted-foreground">AI queries made</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentUploads}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="queries">Queries</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <DocumentManager isAdmin={true} showUpload={true} showDelete={true} />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Add User Form */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add User
                    </CardTitle>
                    <CardDescription>Create new user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email</Label>
                        <Input id="user-email" name="email" type="email" placeholder="user@uol.edu.pk" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-password">Password</Label>
                        <Input
                          id="user-password"
                          name="password"
                          type="password"
                          placeholder="Create password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-role">Role</Label>
                        <Select name="role" defaultValue="user">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add User"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Users List */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage user accounts and roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">
                                Created: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                              </p>
                            </div>
                          </div>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Queries Tab */}
            <TabsContent value="queries" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Query History
                  </CardTitle>
                  <CardDescription>Monitor all AI queries made by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {queries.map((query, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{query.query}</p>
                          <Badge variant="outline">{query.response_time}s</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>User: {query.user_id}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(query.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Admin AI Chat
                  </CardTitle>
                  <CardDescription>Test queries and interact with the AI system</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="space-y-3">
                          <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
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
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                {message.references && (
                                  <div className="mt-3 pt-2 border-t border-muted-foreground/20">
                                    <p className="text-xs font-medium mb-1">References:</p>
                                    {message.references.map((ref, index) => (
                                      <p key={index} className="text-xs opacity-80">
                                        • {ref}
                                      </p>
                                    ))}
                                  </div>
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
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAdminChat()}
                      placeholder="Test a query or ask about system performance..."
                      disabled={isChatLoading}
                      className="flex-1"
                    />
                    <Button onClick={handleAdminChat} disabled={isChatLoading || !chatInput.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      System Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <Badge>{users.filter((u) => u.role === "user").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Admin Users</span>
                      <Badge>{users.filter((u) => u.role === "admin").length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Documents by Category</span>
                      <Badge>{documents.length} total</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Query Response</span>
                      <Badge>
                        {queries.length > 0
                          ? (queries.reduce((acc, q) => acc + (q.response_time || 0), 0) / queries.length).toFixed(1)
                          : "0"}
                        s
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>New document uploaded</span>
                        <span className="text-muted-foreground ml-auto">2h ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>User query processed</span>
                        <span className="text-muted-foreground ml-auto">4h ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>New user registered</span>
                        <span className="text-muted-foreground ml-auto">1d ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
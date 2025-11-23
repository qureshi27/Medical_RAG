"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Upload, Trash2, Search, Filter, Eye, Calendar, Tag, AlertCircle, CheckCircle } from "lucide-react"
import { APIService, type Document } from "@/lib/api"

interface DocumentManagerProps {
  isAdmin?: boolean
  showUpload?: boolean
  showDelete?: boolean
}

export function DocumentManager({ isAdmin = false, showUpload = false, showDelete = false }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const categories = ["general", "research", "clinical", "education", "cardiology", "neurology", "oncology"]

  const fetchDocuments = async () => {
    try {
      const data = await APIService.getDocuments()
      const enhancedData = data.map((doc: any) => ({
        ...doc,
        type: doc.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        description: `Medical document in ${doc.category || "general"} category`,
      }))
      setDocuments(enhancedData)
      setFilteredDocuments(enhancedData)
    } catch (error) {
      console.error("Error fetching documents:", error)
      setMessage({ type: "error", text: "Failed to fetch documents" })
    }
  }

  // Filter documents based on search and category
  useEffect(() => {
    let filtered = documents

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.category && doc.category.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }, [documents, searchTerm, selectedCategory])

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

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently uploaded"
    return new Date(dateString).toLocaleDateString()
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Upload Section (Admin Only) */}
        {showUpload && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Document
              </CardTitle>
              <CardDescription>Add new documents to the knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.txt" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="general">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Upload Document"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        <Card className={showUpload ? "lg:col-span-3" : "lg:col-span-4"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Library
                </CardTitle>
                <CardDescription>
                  {isAdmin ? "Manage uploaded documents" : "Browse available documents"}
                </CardDescription>
              </div>
              <Badge variant="secondary">{filteredDocuments.length} documents</Badge>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== "all"
                      ? "No documents match your filters"
                      : "No documents uploaded yet"}
                  </p>
                </div>
              ) : (
                filteredDocuments.map((doc, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm mb-1 truncate">{doc.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <Badge variant="outline" className="text-xs">
                                  {doc.category || "General"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(doc.uploaded_at)}</span>
                              </div>
                              {doc.size && <span>{formatFileSize(doc.size)}</span>}
                              <Badge variant="secondary" className="text-xs">
                                {doc.type}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{doc.name}</DialogTitle>
                                <DialogDescription>Document Information</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Category</Label>
                                  <p className="text-sm text-muted-foreground">{doc.category || "General"}</p>
                                </div>
                                <div>
                                  <Label>Type</Label>
                                  <p className="text-sm text-muted-foreground">{doc.type}</p>
                                </div>
                                <div>
                                  <Label>Uploaded</Label>
                                  <p className="text-sm text-muted-foreground">{formatDate(doc.uploaded_at)}</p>
                                </div>
                                {doc.size && (
                                  <div>
                                    <Label>Size</Label>
                                    <p className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</p>
                                  </div>
                                )}
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {showDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.name)}
                              disabled={isLoading}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

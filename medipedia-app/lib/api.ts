export interface QueryRequest {
  user_id: string
  query: string
}

export interface QueryResponse {
  response: string
  references: string[]
  confidence: number
}

export interface Document {
  name: string
  size: number
  uploaded_at: string
  category: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export class APIService {
  private static async fetchWithTimeout(
    url: string, 
    options: RequestInit, 
    timeoutMs: number = 30000
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  static async sendQuery(userId: string, query: string): Promise<QueryResponse> {
    try {
      const requestBody: QueryRequest = {
        user_id: userId,
        query: query
      }

      const response = await this.fetchWithTimeout(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform the response to match our expected format
      return {
        response: data.response || data.answer || 'No response received',
        references: data.references || data.sources || [],
        confidence: data.confidence || 0.8
      }
    } catch (error) {
      console.error('Error sending query:', error)
      
      // Fallback error response
      throw new Error('Failed to get response from the server. Please check if the API is running.')
    }
  }

  static async getDocuments(): Promise<Document[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/documents`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching documents:', error)
      // Return empty array as fallback
      return []
    }
  }

  static async uploadDocument(file: File, category: string): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const response = await this.fetchWithTimeout(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, message: data.message || 'Document uploaded successfully!' }
    } catch (error) {
      console.error('Error uploading document:', error)
      return { success: false, message: 'Failed to upload document. Please try again.' }
    }
  }

  static async deleteDocument(documentName: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/documents/${encodeURIComponent(documentName)}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, message: data.message || 'Document deleted successfully!' }
    } catch (error) {
      console.error('Error deleting document:', error)
      return { success: false, message: 'Failed to delete document. Please try again.' }
    }
  }
}

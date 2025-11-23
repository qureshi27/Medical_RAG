export interface Document {
  name: string
  size: number
  uploaded_at: string
  category: string
}

export interface QueryResponse {
  response: string
  references: string[]
  confidence: number
}

// Mock documents data
export const mockDocuments: Document[] = [
  {
    name: "Cardiology_Guidelines_2024.pdf",
    size: 2048576,
    uploaded_at: "2024-01-15T10:30:00Z",
    category: "Cardiology",
  },
  {
    name: "Neurology_Research_Papers.pdf",
    size: 3145728,
    uploaded_at: "2024-01-20T14:45:00Z",
    category: "Neurology",
  },
  {
    name: "Pharmacology_Drug_Interactions.pdf",
    size: 1572864,
    uploaded_at: "2024-02-01T09:15:00Z",
    category: "Pharmacology",
  },
  {
    name: "General_Medicine_Handbook.pdf",
    size: 4194304,
    uploaded_at: "2024-02-10T16:20:00Z",
    category: "General Medicine",
  },
  {
    name: "Emergency_Medicine_Protocols.pdf",
    size: 2621440,
    uploaded_at: "2024-02-15T11:30:00Z",
    category: "Emergency Medicine",
  },
]

// Mock API functions
export const mockAPI = {
  async getDocuments(): Promise<Document[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDocuments
  },

  async uploadDocument(file: File, category: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newDoc: Document = {
      name: file.name,
      size: file.size,
      uploaded_at: new Date().toISOString(),
      category,
    }

    mockDocuments.push(newDoc)
    return { success: true, message: "Document uploaded successfully!" }
  },

  async deleteDocument(documentName: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = mockDocuments.findIndex((doc) => doc.name === documentName)
    if (index > -1) {
      mockDocuments.splice(index, 1)
      return { success: true, message: "Document deleted successfully!" }
    }
    return { success: false, message: "Document not found" }
  },

  async sendQuery(userId: string, query: string): Promise<QueryResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Generate contextual response based on query
    const responses = {
      cardiology:
        "Based on the latest cardiology guidelines, heart disease remains the leading cause of death globally. Key risk factors include hypertension, diabetes, smoking, and high cholesterol. Early detection through regular screening and lifestyle modifications are crucial for prevention.",
      neurology:
        "Neurological disorders affect millions worldwide. Recent research shows promising developments in treating conditions like Alzheimer's, Parkinson's, and stroke. Early intervention and personalized treatment approaches are showing improved outcomes.",
      pharmacology:
        "Drug interactions are a critical consideration in patient care. Always check for contraindications, especially in elderly patients or those with multiple comorbidities. The latest pharmacokinetic studies provide valuable insights into optimal dosing strategies.",
      general:
        "Modern medicine emphasizes evidence-based practice and patient-centered care. Regular health screenings, preventive measures, and early intervention strategies significantly improve patient outcomes and quality of life.",
    }

    const queryLower = query.toLowerCase()
    let response = responses.general
    let category = "General Medicine"

    if (queryLower.includes("heart") || queryLower.includes("cardiac") || queryLower.includes("cardio")) {
      response = responses.cardiology
      category = "Cardiology"
    } else if (queryLower.includes("brain") || queryLower.includes("neuro") || queryLower.includes("alzheimer")) {
      response = responses.neurology
      category = "Neurology"
    } else if (queryLower.includes("drug") || queryLower.includes("medication") || queryLower.includes("pharma")) {
      response = responses.pharmacology
      category = "Pharmacology"
    }

    return {
      response,
      references: [
        `${category}_Guidelines_2024.pdf - Page 15-23`,
        `Medical_Research_Journal_2024.pdf - Section 4.2`,
        `Clinical_Studies_Database - Study #2024-${Math.floor(Math.random() * 1000)}`,
      ],
      confidence: 0.85 + Math.random() * 0.1,
    }
  },
}

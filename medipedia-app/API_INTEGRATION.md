# FastAPI Integration Guide

This project has been updated to use a real FastAPI backend instead of mock APIs. Here's everything you need to know about the integration.

## Changes Made

### 1. New API Service (`lib/api.ts`)
- Created a comprehensive API service class that handles all communication with the FastAPI backend
- Implements proper error handling and timeout management
- Supports all CRUD operations for documents and query processing

### 2. Updated Components
The following components have been updated to use the real API:
- `app/user/dashboard/page.tsx` - User dashboard query system
- `app/admin/dashboard/page.tsx` - Admin dashboard with chat functionality
- `components/document-manager.tsx` - Document management system

### 3. Environment Configuration
- API base URL is now configurable via environment variables
- Copy `.env.example` to `.env.local` and configure as needed

## FastAPI Endpoint Integration

### Query Endpoint
The project now integrates with your FastAPI query endpoint:

```bash
curl -X 'POST' \
  'http://localhost:8000/query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "60c72b2f9b1d8e1f88e1a1b1",
    "query": "What is Reinforcement Learning"
  }'
```

### Expected Response Format
The API service expects responses in this format:
```json
{
  "response": "Your AI response text here",
  "references": ["Reference 1", "Reference 2"],
  "confidence": 0.85
}
```

## Additional Endpoints (Optional)

The API service also supports these endpoints if implemented in your FastAPI backend:

### Document Management
- `GET /documents` - Fetch all documents
- `POST /upload` - Upload a new document
- `DELETE /documents/{document_name}` - Delete a document

## Setup Instructions

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure API URL:**
   Edit `.env.local` and set the correct API base URL if different from `http://localhost:8000`

3. **Start your FastAPI backend:**
   Make sure your FastAPI server is running on the configured port

4. **Start the Next.js application:**
   ```bash
   npm run dev
   ```

## Error Handling

The API service includes comprehensive error handling:
- Network timeouts (30 seconds default)
- HTTP error responses
- Fallback responses for failed requests
- User-friendly error messages

## Testing the Integration

1. Start your FastAPI backend server
2. Start the Next.js development server
3. Navigate to the user dashboard
4. Try sending a query - it should now use the real API
5. Check the browser's Network tab to verify API calls are being made

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   Make sure your FastAPI backend has CORS properly configured:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Connection Refused:**
   Verify your FastAPI server is running on the correct port

3. **Response Format Issues:**
   Check that your FastAPI endpoint returns data in the expected format

### Debug Mode

Set `NEXT_PUBLIC_DEV_MODE=true` in your environment file to enable additional console logging for debugging API calls.

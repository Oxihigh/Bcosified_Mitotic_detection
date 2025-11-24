import { type NextRequest, NextResponse } from "next/server"

// This is the URL of your Python backend server
const BACKEND_API_URL = "http://localhost:8000/predict"

export async function POST(request: NextRequest) {
  try {
    // 1. Get the form data (which includes the image) from the frontend
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // 2. Create new form data to send to the Python backend
    // We can't just forward the 'request' object, we must rebuild the form data
    const backendFormData = new FormData()
    backendFormData.append("image", file)

    // 3. Send the image to the Python backend
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      body: backendFormData,
      // Note: We don't set Content-Type, 'fetch' does it automatically for FormData
    })

    if (!response.ok) {
      // If the Python server returned an error, forward it
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json(
        { error: "Prediction failed on the backend", details: errorText },
        { status: response.status }
      )
    }

    // 4. Get the full JSON response from the Python backend
    const results = await response.json()

    // 5. Send the *real* results back to the frontend
    return NextResponse.json(results)

  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json(
      { error: "Internal server error in Next.js API route" },
      { status: 500 }
    )
  }
}
export const debugApiResponse = async (response: Response, context: string) => {
  console.log(`🔍 API Debug - ${context}:`)
  console.log(`Status: ${response.status}`)
  console.log(`Status Text: ${response.statusText}`)

  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    try {
      const data = await response.clone().json()
      console.log(`JSON Response:`, JSON.stringify(data))
    } catch (error) {
      console.error(`Failed to parse JSON:`, error)
    }
  } else {
    const text = await response.clone().text()
    console.log(`Non-JSON Response (first 200 chars):`, text.substring(0, 200))
  }
}

export const debugApiRequest = (
  url: string,
  options: RequestInit,
  context: string,
) => {
  console.log(`🚀 API Request - ${context}:`)
  console.log(`URL: ${url}`)
  console.log(`Method: ${options.method || 'GET'}`)
  console.log(`Headers:`, options.headers)
  if (options.body) {
    console.log(`Body:`, options.body)
  }
}

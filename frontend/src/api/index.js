const apiConfig = {
  serverUrls: {
    development: import.meta.env.VITE_DEV_SERVER,
    production: import.meta.env.VITE_PROD_SERVER,
    test: import.meta.env.VITE_TEST_SERVER
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}

// const BASE_PATH = apiConfig.serverUrls[import.meta.env.MODE]
const BASE_PATH = `${window.location.origin}/api/` // this is temporary only

export const Method = Object.freeze({
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
})

export const api = async (
  url,
  method = Method.GET,
  payload = null,
  hdrs = {}
) => {
  const listOfHeader = { ...apiConfig.defaultHeaders, ...hdrs }
  const headers = new Headers()

  Object.keys(listOfHeader).forEach((key) => {
    headers.append(key, listOfHeader[key])
  })

  const requestInit = { method, headers }

  // if method is GET no need for body
  if (method != Method.GET) {
    requestInit.body = JSON.stringify(payload ? payload : {})
  }

  const request = new Request(`${BASE_PATH}${url}`, requestInit)

  const response = await fetch(request)

  const contentType = response.headers.get('Content-Type')
  let responseData

  if (contentType) {
    if (contentType.includes('application/json')) {
      responseData = await response.json()
    } else if (contentType.includes('text/')) {
      responseData = await response.text()
    } else if (
      contentType.includes('image/') ||
      contentType.includes('audio/') ||
      contentType.includes('video/') ||
      contentType.includes('application/octet-stream')
    ) {
      responseData = await response.blob()
    } else {
      responseData = await response.text() // Fallback for other content types
    }
  }

  return responseData
}

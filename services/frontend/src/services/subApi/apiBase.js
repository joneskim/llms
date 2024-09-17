// Function to determine the base URL dynamically
const getApiBaseUrl = () => {
    const { protocol, hostname } = window.location;
    const port = 8000; // Your API server's port
  
    // If the hostname is localhost or 127.0.0.1, use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//localhost:${port}`;
    }
  
    // Use the local IP address
    return `${protocol}//${hostname}:${port}`;
  };

export default getApiBaseUrl;
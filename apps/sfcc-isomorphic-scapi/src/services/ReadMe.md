### Genesis

SCAPI does not support CORS, so client side requests must use a reverse proxy.

As the documentation suggests, setting up a reverse proxy on your server is the recommended approach for development. A reverse proxy acts as an intermediary between your client-side application and the SCAPI endpoint. It fetches the data from the SCAPI endpoint and forwards it to your application, handling CORS headers in the process.

### Server-Side Component (SSR or Serverless Functions or API Routes)

To effectively handle the SCAPI request and bypass CORS restrictions, you should create a serverless function in Next.js. This function will act as a proxy, forwarding the request to the SCAPI endpoint and returning the response to the client.

## Example:

/api/fetchAccessToken.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
// ... fetch logic using `fetch` or an HTTP client
// ... handle response and send it back to the client
}

Key points:

1. The API route handles incoming requests and forwards them to the SCAPI endpoint.
2. CORS restrictions are bypassed as the request originates from the server.
3. The API route can handle various HTTP methods (GET, POST, etc.) by checking the req.method.
4. Error handling is included to gracefully handle API call failures.

##

### Alternatives:

It is one of the easiest way CORS can be mitigated staying in same application and any operational overhead.

Following are the other ways:

1. ## Dedicated Reverse Proxy Server:

   You can set up a dedicated reverse proxy server like Nginx or Apache in front of your application to handle CORS for all SCAPI requests.

2. ## Custom Fetch Implementation:

   Create a custom fetch function: Implement a custom fetch function that handles CORS and other requirements.
   Configure the commerce-sdk-isomorphic library: Modify the library's behavior to use your custom fetch function.

3. ## SDK-Specific Workarounds (If Available):

   Check the SDK documentation: Some SDKs might offer specific configurations or workarounds for CORS issues.

4. If you only need sample data for testing purposes during development, consider mocking the SCAPI responses on your client-side application. This avoids actual communication with the SCAPI endpoint and bypasses CORS restrictions.

##

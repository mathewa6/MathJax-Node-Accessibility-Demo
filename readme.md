# MathJax-Node-Accessibility-Demo
## What it is:
A *Node.js* application that receives *HTML* combined with raw *LaTeX* syntax as an input string.
It processes the string and returns the original *HTML* with the *LaTeX* elements converted into *SVG* and invisible *MathML*.

## Installation:
1. [Node.js](https://nodejs.org/en/) must be installed on the system.
2. Setup application values:
   2.1 Open `modules/accessor.js`
   2.2 Change:
   - `apiKey` (line 9)
   - `salt` (line 10)
   - `username`(line 16)
   - `password` (line 16)
 
   2.3 Open `server.js`:
   2.4 Change:
   - Port `3000` (line18)

3. Install application dependencies:
   3.1 Navigate into the application root path.
   3.2 Exectue `npm install` command.
4. Run `node server.js`. A process manager like [PM2](https://www.npmjs.com/package/pm2) is recommended for production use.

## Endpoints:
- /access (**GET**)
   - Requires username and password (*Basic Auth*).
   - Returns *Bearer token*.
- /process (**POST**)
   - Requires valid token (*Bearer token*) and *JSON* input in body.
   - Returns *HTML* output.
   **Input structure (body)**
      ```
      {
          latex: value
      }
      ```
      latex-value can be Text, *HTML* combined with *LaTeX* notations

      **Output structure:**
      ```
      {
          success: value,
          content: value
      }
      ```
      The success-value will be 1 (true) or 0 (false).
      The content-value will contain information about occuring errors. 
      If everything is fine, the output will contain the returned *HTML* string.

## Todos:
- Apply *TLS* support:
Currently *TLS* is not used in this prototype. Add *TLS* support.
- Validate requests:
Requests from the client must be validated.
- Prevent brute-force attacks against authorization:
Add mechanics to limit the number of requests.
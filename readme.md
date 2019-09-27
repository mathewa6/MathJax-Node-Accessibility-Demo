# MathJax-Node-Accessibility-Demo
## What it is:
A *Node.js* application that receives *HTML* combined with raw *LaTeX* syntax as an input string.
It processes the string and returns the original *HTML* with the *LaTeX* elements converted into *SVG* and invisible *MathML*.

## Installation:
1. Make sure [Node.js](https://nodejs.org/en/) is installed on the system.
2. Download *MathJax-Node-Accessibility-Demo* and extract `MathJax-Node-Accessibility-Demo-master`. You can rename this folder.
3. Navigate into the extracted folder.
4. Adjust following *MathJax-Node-Accessibility-Demo* presets to your preffered values:  
   4.1 Open `modules/accessor.js` and adjust:
   - `apiKey` (line 9)
   - `salt` (line 10)
   - `username`(line 16)
   - `password` (line 16)
 
   4.2 Open `/server.js`:   
   4.3 Adjust Port `3000` (line18) to the port number under which *MathJax-Node-Accessibility-Demo* should be accessed.
      If you run *MathJax-Node-Accessibility-Demo* locally the port does not necessarily need to be changed.

5. You are done with the presets now. *MathJax-Node-Accessibility-Demo* requires a number of *Node.js* modules in order to be executed. To install these modules just follow these two steps:     
   5.1 With commandline navigate to the *MathJax-Node-Accessibility-Demo* folder. `server.js` is located in this folder.   
   5.2 Exectue the `npm install` command. This will trigger the Node Package Manager to install all dependencies (which are defined in package.json) for you.   

6. Everything is set up now. Run `node server.js` to start the application.
 Process manager like [PM2](https://www.npmjs.com/package/pm2) are recommended for production use.

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


## cUrl Commands

#### /access
```
curl --user username:password http://127.0.0.1:3000/access
```

- username
  Your defined username. Please refer **Installation 4.1**
- password
  Your defined password. Please refer **Installation 4.1**
- http://127.0.0.1
  If run on localhost
- :3000
  The application Port. Please refer **Installation 4.3**
- /access
  Access route. Used to retrieve bearer token Please refer **Endpoints**

#### /process
```
curl -X POST \
  http://127.0.0.1:3000/process \
  -H 'Authorization: Bearer bearertoken' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{"latex":"latexformula"}'
```


- http://127.0.0.1 
 If run on localhost
- :3000
  the application Port. Please refer **Installation 4.3**
- /process
  Process route. Used to retrieve bearer token Please refer **Endpoints**
- bearertoken
  Your bearertoken
- latexformula
  Your Latex formula (Backslashes must currently be escaped with another backslash)

## Todos:
- Apply *TLS* support:
Currently *TLS* is not used in this prototype. Add *TLS* support.
- Validate requests:
Requests from the client must be validated.
- Prevent brute-force attacks against authorization:
Add mechanics to limit the number of requests.

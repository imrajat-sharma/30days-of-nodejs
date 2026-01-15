const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const app = http.createServer((req, res) => {
  if (req.url === "/") {
  
    const filePath = path.join(__dirname, "index.html");

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Internal Server Error");
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.url === "/submit" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
    const bodyobj = new URLSearchParams(body);
    const data = Object.fromEntries(bodyobj);
      console.log("Received form data:", data);
      res.end(`Form submission received: ${data.name}`);
    });
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Us");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

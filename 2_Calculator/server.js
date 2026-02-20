const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`Received request for: ${req.url}`);

  switch (req.url) {
    case "/":
      fs.readFile(path.join(__dirname, "home.html"), "utf-8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
      break;
    case "/calculator":
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          const params = new URLSearchParams(body);
          console.log("Calculator input received" + params);
          const num1 = parseFloat(params.get("num1"));
          const num2 = parseFloat(params.get("num2"));
          const sum = num1 + num2;
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(`The sum is: ${sum}`);
        });
      } else {
        fs.readFile(
          path.join(__dirname, "calculator.html"),
          "utf-8",
          (err, data) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("Internal Server Error");
              return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          }
        );
      }
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      break;
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

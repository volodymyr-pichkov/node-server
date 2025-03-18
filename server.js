const http = require("node:http");
const fs = require("node:fs");

const port = 8080;

fs.writeFile("user.txt", "hi", err => {
  if (err) {
    console.error(err);
  } else {
    console.log("Файл user.txt успешно создан");
  }
});

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    fs.readFile("user.txt", "utf8", (err, data) => res.end(err || data));
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () =>
      fs.appendFile("user.txt", body + "\n", () => res.end("OK"))
    );
  }
});

server.listen(port, () => console.log("Сервер запущен на 8080 порту"));
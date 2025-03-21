const http = require("node:http");
const fs = require("node:fs");

const port = 8080;

const users = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: String.fromCharCode(97 + index),
  age: 22 + index,
}));

fs.writeFile("users.txt", JSON.stringify(users, null, 1), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Файл users.txt успешно создан");
  }
});

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    fs.readFile("users.txt", "utf8", (err, data) => res.end(err || data));
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () =>
      fs.appendFile("users.txt", body + "\n", () => res.end("OK"))
    );
  } else if (req.method === "DELETE") {
    fs.readFile("users.txt", "utf8", (err, data) => {
      const updatedUsers = JSON.parse(data).filter(
        (users) => users.id != req.url.split("/")[1]
      );
      fs.writeFile("users.txt", JSON.stringify(updatedUsers, null, 1), (err) =>
        res.end(err || "Пользователь удален")
      );
    });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    fs.readFile("users.txt", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Ошибка чтения файла");
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          let users = JSON.parse(data);
          let updatedUser = JSON.parse(body);
          let userId = req.url.split("/")[1];

          let userIndex = users.findIndex((user) => user.id == userId);
          if (userIndex === -1) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("Пользователь не найден");
          }

          users[userIndex] =
            req.method === "PUT"
              ? updatedUser
              : { ...users[userIndex], ...updatedUser };

          fs.writeFile("users.txt", JSON.stringify(users, null, 1), (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              return res.end("Ошибка записи в файл");
            }
            res.end("Пользователь обновлен");
          });
        } catch (parseError) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Ошибка парсинга JSON");
        }
      });
    });
  }
});

server.listen(port, () =>
  console.log(`Сервер запущен http://localhost:${port}`)
);

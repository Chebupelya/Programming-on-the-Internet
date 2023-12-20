const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const path = require("path");
const formidable = require("formidable");
const mv = require("mv");

let keepAliveTimeout = 0;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(`Request - Method: ${req.method}, Path: ${req.url}, Time: ${new Date()}`);

  if (req.url.startsWith("/public/") && req.method === "GET") {
    const filename = req.url.slice(8);
    const filePath = path.join(__dirname, "public", filename);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.url === "/upload" && req.method === "GET") {
    // Respond with the HTML form for file upload
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <head>
          <title>File Upload Form</title>
        </head>
        <body>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <label for="file">Select a file:</label>
            <input type="file" name="file" id="file"><br>
            <input type="submit" value="Upload">
          </form>
        </body>
      </html>
    `);
  } else if (req.url === "/upload" && req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        const file = files.file;
        const uploadPath = path.join(String(__dirname), "public",String(file[0].originalFilename));

        mv(String(file[0].filepath), uploadPath, (err) => {
          if (err) {
            console.error("Error when moving a file:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`The file is uploaded along the path: ${uploadPath}`);
          }
        });
      }
    });
  } else if (req.url === "/json" && req.method === "POST") {
    let body = "";

    req.setEncoding("utf8");

    req.on("data", (chunk) => {body += chunk;}).on("end", () => { console.log("Received data:", body);
        try {
          const requestData = JSON.parse(body);

          const response = {
            __comment: "Ответ.Лабораторная работа 8/10",
            x_plus_y:
              requestData.x && requestData.y
                ? requestData.x + requestData.y
                : null,
            Concatination_s_o: `Сообщение: ${requestData.s}, ${
              requestData.o ? requestData.o.surname || "N/A" : "N/A"
            }, ${requestData.o ? requestData.o.name || "N/A" : "N/A"}`,
            Length_m: requestData.m ? requestData.m.length : 0,
          };

          console.log("Response:", response);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Invalid JSON data");
        }
      });
  } else if (req.url.startsWith("/user/") && req.method === "GET") {
    const userId = parseInt(req.url.slice(6), 10);

    if (isNaN(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid parameter: id must be a number");
    } else {
      fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          const users = JSON.parse(data);
          const user = users.find((user) => user.id === userId);

          if (user) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end(`User with id ${userId} not found`);
          }
        }
      });
    }
  } else if (req.url === "/headers" && req.method === "GET") {
    const headers = JSON.stringify(req.headers);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(headers);
  } else if (req.url.startsWith("/connection")) {
    if (req.url.includes("set")) {
      const queryParams = new URLSearchParams(req.url.split("?")[1]);
      const setParam = queryParams.get("set");
      if (setParam) {
        keepAliveTimeout = parseInt(setParam, 10);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`keepAliveTimeout set to ${keepAliveTimeout}`);
        return;
      }
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`keepAliveTimeout: ${keepAliveTimeout}`);
    return;
  } else if (req.method === "POST" && req.url === "/formparameter") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      // Извлекаем значения параметров из данных формы
      const textValue = fields.text || "Not provided";
      const numberValue = fields.number || "Not provided";
      const checkboxValue = fields.checkbox ? "Checked" : "Unchecked";
      const radiobuttonValue = fields.radiobutton || "Not provided";
      const textareaValue = fields.textarea || "Not provided";

      // Формируем HTML-страницу с полученными значениями
      const responseHtml = `
        <html>
          <head>
            <title>Form Parameter Result</title>
          </head>
          <body>
            <h1>Form Parameter Values</h1>
            <p>Text: ${textValue}</p>
            <p>Number: ${numberValue}</p>
            <p>Checkbox: ${checkboxValue}</p>
            <p>Radio Button: ${radiobuttonValue}</p>
            <p>Textarea: ${textareaValue}</p>
            <p><a href="/formparameter">Back to Form</a></p>
          </body>
        </html>
      `;

      // Отправляем HTML-страницу в ответе
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(responseHtml);
    });

    return;
  } else if (req.method === "GET" && req.url === "/formparameter") {
    const formPath = path.join(__dirname, "public", "form.html");
    fs.readFile(formPath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
    return;
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

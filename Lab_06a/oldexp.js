const express = require("express");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const mv = require("mv");

const app = express();
const port = 3000;

let keepAliveTimeout = 0;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`Request - Method: ${req.method}, Path: ${req.url}, Date: ${(new Date()).toDateString()}, Time: ${(new Date()).toLocaleTimeString()}`);
  next();
});

// Middleware for serving static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Route for file upload form
app.get("/upload", (req, res) => {
  res.send(`
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
});

// Route for handling file upload
app.post("/upload", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      sendResponse(res, 500, "text/plain", "Internal Server Error");
    } else {
      const file = files.file;
      const uploadPath = path.join(__dirname, "public", String(file[0].originalFilename));

      mv(String(file[0].filepath), uploadPath, (err) => {
        if (err) {
          console.error("Error when moving a file:", err);
          sendResponse(res, 500, "text/plain", "Internal Server Error");
        } else {
          sendResponse(res, 200, "text/plain", `The file is uploaded along the path: ${uploadPath}`);
        }
      });
    }
  });
});

// Route for handling JSON post
app.post("/json", express.json(), (req, res) => {
  const requestData = req.body;

  const response = {
    __comment: "Ответ.Лабораторная работа 8/10",
    x_plus_y: requestData.x && requestData.y ? requestData.x + requestData.y : null,
    Concatination_s_o: `Сообщение: ${requestData.s}, ${
      requestData.o ? requestData.o.surname || "N/A" : "N/A"
    }, ${requestData.o ? requestData.o.name || "N/A" : "N/A"}`,
    Length_m: requestData.m ? requestData.m.length : 0,
  };

  console.log("Response:", response);

  sendResponse(res, 200, "application/json", response);
});

// Route for getting user data
app.get("/user/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    sendResponse(res, 400, "text/plain", "Invalid parameter: id must be a number");
  } else {
    fs.readFile("users.json", "utf8", (err, data) => {
      if (err) {
        sendResponse(res, 500, "text/plain", "Internal Server Error");
      } else {
        const users = JSON.parse(data);
        const user = users.find((user) => user.id === userId);

        if (user) {
          sendResponse(res, 200, "application/json", user);
        } else {
          sendResponse(res, 404, "text/plain", `User with id ${userId} not found`);
        }
      }
    });
  }
});

// Route for getting headers
app.get("/headers", (req, res) => {
  const headers = JSON.stringify(req.headers);
  sendResponse(res, 200, "application/json", headers);
});

// Route for setting connection timeout
app.get("/connection", (req, res) => {
  if (req.query.set) {
    keepAliveTimeout = parseInt(req.query.set, 10);
    sendResponse(res, 200, "text/plain", `keepAliveTimeout set to ${keepAliveTimeout}`);
  } else {
    sendResponse(res, 200, "text/plain", `keepAliveTimeout: ${keepAliveTimeout}`);
  }
});

// Route for handling form parameter post
app.post("/formparameter", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields) => {
    if (err) {
      sendResponse(res, 500, "text/plain", "Internal Server Error");
      return;
    }

    const textValue = fields.text || "Not provided";
    const numberValue = fields.number || "Not provided";
    const checkboxValue = fields.checkbox ? "Checked" : "Unchecked";
    const radiobuttonValue = fields.radiobutton || "Not provided";
    const textareaValue = fields.textarea || "Not provided";

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
        </body>
      </html>
    `;

    sendResponse(res, 200, "text/html", responseHtml);
  });
});

// Route for serving form parameter form
app.get("/formparameter", (req, res) => {
  fs.readFile("public/form.html", (err, data) => {
    if (err) {
      sendResponse(res, 500, "text/plain", "Internal Server Error");
    } else {
      sendResponse(res, 200, "text/html", data);
    }
  });
});

// Route for handling not found
app.use((req, res) => {
  sendResponse(res, 404, "text/plain", "Not Found");
});

// Function to send response
function sendResponse(res, statusCode, contentType, data) {
  res.status(statusCode).set("Content-Type", contentType).send(data);
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

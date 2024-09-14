const { app, BrowserWindow } = require("electron");
const path = require("node:path");
var express = require("./express");
var debug = require("debug")("electron:server");
var http = require("http");

var port = normalizePort(process.env.PORT || "3000");
express.set("port", port);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  createWindow(addr);
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(addr);
  });
}

function createWindow(addr) {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  const url = typeof addr === "string" ? `http://localhost/${addr}` : `http://localhost:${addr.port}`;
  mainWindow.loadURL(url).catch((err) => {
    console.error("Failed to load URL:", err);
  });
  console.log("Server is running on " + url);
}

var server = http.createServer(express);

app.whenReady().then(() => {
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
    server.close();
  }
});

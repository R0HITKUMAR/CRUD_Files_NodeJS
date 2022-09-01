import express from "express";
import fileupload from "express-fileupload";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var filestore = express.Router();

filestore.use(fileupload());
filestore.post("/upload/:location", (req, res) => {
  const location = req.params.location;
  const DIR = __dirname + "/files/" + location;
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);
  }
  const newpath = __dirname + `/files/${location}/`;
  console.log(newpath);
  const file = req.files.file;
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  const filename =
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase() +
    path.extname(file.name);

  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log(err);
      return res.send({ status: "fail", message: "File upload failed" });
    } else {
      console.log("File uploaded");
      return res.send({
        status: "success",
        message: "File uploaded successfully",
        filename: filename,
        url: `https://filestore.aboutrohit.in/${location}/${filename}`,
      });
    }
  });
});

filestore.get("/getFiles/:location", (req, res) => {
  const location = req.params.location;
  const DIR = __dirname + "/files/" + location;
  const directoryPath = path.join(DIR);
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.send({
        status: "fail",
        message: "Unable to scan directory: " + err,
      });
    }
    var filesArray = [];
    files.forEach(function (file) {
      filesArray.push(file);
    });
    return res.send({
      status: "success",
      message: "Files found",
      files: filesArray,
    });
  });
});

filestore.delete("/deleteFile/:location/:filename", (req, res) => {
  const location = req.params.location;
  const filename = req.params.filename;
  const DIR = __dirname + "/files/" + location;
  const file = `${DIR}/${filename}`;
  if (fs.existsSync(file)) {
    fs.unlink(file, (err) => {
      if (err) {
        return res.send({
          status: "fail",
          message: "Unable to delete file: " + err,
        });
      } else {
        return res.send({
          status: "success",
          message: "File deleted successfully",
        });
      }
    });
  } else {
    return res.send({
      status: "fail",
      message: "File not found",
    });
  }
});

export default filestore;

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import AdmZip from "adm-zip";
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT = process.env.PORT || 9000;
import files from "./files.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var filestore = express();
filestore.use(express.json());
filestore.use(express.urlencoded());
filestore.use(cors());
filestore.use(bodyParser.json(), urlencodedParser);
filestore.use(express.static("files"));
filestore.use("/files", express.static(__dirname + "/files"));
filestore.use("/backup", express.static(__dirname + "/backup"));
filestore.use("/", files);

async function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = "./backup/Filestore.zip";
  zip.addLocalFolder("./files");
  zip.writeZip(outputFile);
  console.log(`Created ${outputFile} successfully`);
}

filestore.get("/extract", async (req, res) => {
  console.log(req);
  await createZipArchive();
  res.send({
    status: "success",
    message: "Extraction successfully",
  });
});

filestore.get("/", (req, res) => {
  res.send("Welcome to File Store");
});

filestore.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// import modules
const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const connectDb = require("./config/connectDb");
const fs = require("fs");
const path = require("path");

const errorMiddleware = require("./middleware/error.middleware");
const authRoute = require("./routes/auth.route");

// configuration
const app = express();
dotenv.config();
connectDb();

// =============================================================file upload functions================================================

// file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "images";
    // const dir = "images/uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      // fs.mkdirSync(dir, { recursive: true }); this will allow creation of sub-folder images/uploads
    }

    cb(null, dir);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    req.errorMessage("File is not a valid image");
    cb(null, false);
  }
};

// =============================================================single image upload================================================

// single image upload middleware
const upload = multer({ storage, fileFilter });
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);

  if (req.errorMessage) {
    return res.status(422).json({ message: req.errorMessage });
  }

  return res.status(200).json({ message: "Image uploaded successfully" });
});

// =============================================================mulitple document(pdf) upload================================================
// multiple pdf file upload middleware
const uploadDocuments = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      !req.invalidFiles
        ? (req.invalidFiles = [file.originalname])
        : req.invalidFiles.push(file.originalname);
      cb(null, false);
    }
  },
});

app.post("/multiple-files", uploadDocuments.array("documents"), (req, res) => {
  console.log(req.files);

  if (req.invalidFiles) {
    return res.status(200).json({
      warning: true,
      message:
        "Some documents did not uploaded due to wrong type: " +
        req.invalidFiles.join(", "),
    });
  }

  return res.status(200).json({
    warning: false,
    message: "Documents uploaded successfully",
  });
});

// =============================================================mixture upload (picture & pdf) ================================================

// 1. week free
// 2. 50,000

// multiple field  upload (mixture of picture & pdf  from different input fields)
const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = "images/profile";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },

    filename: function (req, file, cb) {
      // const now = new Date();
      // const date =
      //   String(now.getDate()).padStart(2, "0") +
      //   "-" +
      //   String(now.getMonth() + 1).padStart(2, "0") +
      //   "-" +
      //   now.getFullYear();
      cb(
        null,
        Date.now() + "_" + file.fieldname + path.extname(file.originalname), // this Date.now() added random value
        // date + "_" + file.fieldname + path.extname(file.originalname),   //this and above commented added real date data instead of random value
      );
    },
  }),

  fileFilter: function (req, file, cb) {
    let acceptFile = false;

    if (file.fieldname == "avatar" || file.fieldname == "banner") {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
        acceptFile = true;
      }
    } else if (file.fieldname == "document") {
      if (file.mimetype == "application/pdf") {
        acceptFile = true;
      }
    }

    if (!acceptFile) {
      const message = `Fields ${file.fieldname} wrong type (${file.mimetype})`;
      !req.invalidFiles
        ? (req.invalidFiles = [message])
        : req.invalidFiles.push([message]);
    }
    cb(null, acceptFile);
  },
});

const fields = [
  {
    name: "avatar",
    maxCount: 1,
  },
  {
    name: "banner",
    maxCount: 1,
  },
  {
    name: "document",
    maxCount: 1,
  },
];
app.post("/multiple-fields", uploadProfile.fields(fields), (req, res) => {
  console.log(req.files);

  if (req.invalidFiles) {
    return res.status(200).json({
      warning: true,
      message: "Some files did not uploaded: " + req.invalidFiles.join(", "),
    });
  }

  return res.status(200).json({
    warning: false,
    message: "Files uploaded successfully",
  });
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use(errorMiddleware);

// server creation
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running port 5000"));

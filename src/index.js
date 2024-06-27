const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

const multer = require("multer");
const fs = require('fs');


// const methodOverride = require('method-override');
const { read } = require("fs");
// app.use(methodOverride('_method'));

//this line is also important even also for dynamic websites. It will load css files and images
const staticPath = path.join(__dirname, "../public");

//add viewsPath
const viewsPath = path.join(__dirname, "../views");

const partialPath = path.join(__dirname, "../partials");

app.use(express.json());
// app.use(cookieParser());
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));

//this line is also important even also for dynamic websites. It will load css files and images
app.use(express.static(staticPath));

//to register partials
hbs.registerPartials(partialPath);

// for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // return cb(null,"./uploads");
        // return cb(null,"./public/uploads");
        return cb(null, "./public/image");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// const upload=multer({dest:"uploads/"});
// const upload = multer({ storage });
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
});

// app.use(flash());


app.get("/", async (req, res) => {
    try {
        res.render("invoice_inputs");
    } catch (error) {
        res.send(error);
    }
});

app.post("/input_invoice", upload.single("SignatureImage"), async (req, res) => {
    let full_image_link = req.file.path;
    let cut_image_link = full_image_link.slice(6);
    console.log(cut_image_link);
    const x = req.body;
    
    res.render("invoice",{
        x,cut_image_link
    })
    // res.send(x);
})

app.listen(8000, () => {
    console.log("Connected...");
});
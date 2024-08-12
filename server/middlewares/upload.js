const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');

// Storage configuration for general file uploads
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
}).single('file'); // 'file' is the input field name for this upload

// Storage configuration for thread picture uploads
const threadStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/uploads/threadPictures'));
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

const threadUpload = multer({
    storage: threadStorage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
}).single('file'); // 'file' is the input field name for this upload

// Storage configuration for profile picture uploads
const ppstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/profilePics'));
    },
    filename: function (req, file, cb) {
        cb(null, nanoid(10) + path.extname(file.originalname));
    }
});

const ppupload = multer({ 
    storage: ppstorage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
}).single('profilePic'); // 'profilePic' is the input field name for this upload

// Storage configuration for lesson slides uploads (pptx and pdf)
const slidesStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/uploads/slides'));
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

const slidesUpload = multer({
    storage: slidesStorage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit for slides
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|pptx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .pdf and .pptx files are allowed!'));
        }
    }
}).single('file'); // 'slidesPath' is the input field name for this upload

// Storage configuration for product picture uploads
const productStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/uploads/productPictures'));
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

const productUpload = multer({
    storage: productStorage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
}).single('file'); // 'file' is the input field name for this upload

// Exporting all the upload middlewares
module.exports = { 
    upload,
    threadUpload,
    ppupload,
    slidesUpload,
    productUpload
};

const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');

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
    limits: { fileSize: 1024 * 1024 }
}).single('file'); // file input name


// const ppstorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../public/uploads/profilePics'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, nanoid(10) + path.extname(file.originalname));
//     }
// });

const ppupload = multer({
    storage: ppstorage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
}).single('profilePic');

// Storage configuration for thread picture uploads
const threadStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/uploads/threadPictures'));
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

// Middleware for thread picture uploads
const threadUpload = multer({
    storage: threadStorage,
    limits: { fileSize: 1024 * 1024 } // 1MB limit
}).single('file'); // 'file' is the input field name

// Exporting all the upload middlewares
module.exports = { 
    upload,
    ppupload,
    threadUpload
};
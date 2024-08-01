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

// const ppupload = multer({ 
//     storage: ppstorage,
//     limits: { fileSize: 1024 * 1024 } // 1MB limit
// }).single('profilePic');

module.exports = { upload };


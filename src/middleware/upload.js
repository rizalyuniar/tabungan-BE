const multer = require('multer')
const createError = require('http-errors')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/upload')
    
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + '-' + (file.originalname.replace(/ /g, '-')))
  }
})

const fileFiltered = (req, file, cb) => {
  const fileSize = parseInt(req.headers['content-length']);
  try {
    if (fileSize > 2 * 1024 * 1024) throw ('File Picture more than 2MB')
    if ((!file.originalname.match(/\.(jpg|jpeg|png)$/))) throw ('File Picture format must PNG, JPG , or JPEG')
    cb(null, true);
  } catch (error) {
    cb(new createError(400, error))
  }
}


const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 2 * 1024 * 1024 // (limit size 2mb)
  },
  fileFilter: fileFiltered
})
// const upload = multer({ storage:storage })

module.exports = upload
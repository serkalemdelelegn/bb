const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

exports.uploadFile = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please upload a file",
    });
  }

  const uploadPromises = req.files.map(file => {
    const customFileName = `${file.originalname.split(".")[0]}-${Date.now().toString()}`;
    
    return streamUpload(file, customFileName);
  });

  Promise.all(uploadPromises)
    .then(results => {
      res.status(200).json({
        status: "success",
        data: results,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        status: "fail",
        message: "Error uploading files",
      });
    });
};

const streamUpload = (file, customFileName) => {
  return new Promise((resolve, reject) => {
    let uploadOptions = { public_id: customFileName };

    if (file.mimetype.startsWith("image/")) {
      // If it's an image, let Cloudinary handle it normally
      uploadOptions.resource_type = "auto";
    } else {
      // If it's not an image (or if mimetype is unknown), force PDF format
      uploadOptions.resource_type = "raw";
      uploadOptions.format = "pdf";
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

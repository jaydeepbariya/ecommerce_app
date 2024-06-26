const cloudinary = require("cloudinary");

exports.fileUploader = async (file, folder, height, quality) => {
  let options = {};

  if (height) {
    options.height = height;
  }

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

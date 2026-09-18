import connectCloudinary from "../config/cloudinary.js";

async function uploadFile(files) {
    const uploadedFiles=[];
  for (const file of files) {
 const result = await new Promise((resolve, reject) => {
            connectCloudinary().uploader
      .upload_stream(
        {
          folder: "206189",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, data) => {
          if (error) return reject(error);

          resolve (data);
        },
      )
      .end(file.buffer);
        
    })
    uploadedFiles.push(result);

  }
  return uploadedFiles;
}

export default uploadFile;

import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage"
import React, { useState } from "react"
import { auth, storage } from "lib/firebase"
import Loader from "./Loader"

const ImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState("")

  const uploadFile = async (files: FileList) => {
    const file = Array.from(files)[0]
    const extension = file.type.split("/")[1]

    // Makes reference to the storage bucket location
    const gref = ref(storage, `uploads/${auth.currentUser!.uid}/${Date.now()}.${extension}`)
    setIsUploading(true)

    // Starts the upload
    const task = uploadBytesResumable(gref, file, { contentType: "image/x-png,image/gif,image/jpeg" })

    // Listen to updates to upload task
    task.on(
      "state_changed",
      snapshot => {
        const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
        setProgress(parseInt(pct))
      },
      err => console.log(err),
      () => {
        getDownloadURL(task.snapshot.ref).then(downloadURL => {
          setDownloadURL(downloadURL)
          setIsUploading(false)
        })
      }
    )
  }

  return (
    <div className="box">
      <Loader show={isUploading} />
      {isUploading && <h3>{progress}%</h3>}

      {!isUploading && (
        <>
          <label className="btn">
            🖼️ Upload Img
            <input
              type="file"
              onChange={e => e.target.files && uploadFile(e.target.files)}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  )
}

export default ImageUploader

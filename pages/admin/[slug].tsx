import React from "react"
import styles from "styles/Admin.module.css"
import AuthCheck from "components/AuthCheck"
import ImageUploader from "components/ImageUploader"
import { firestore, auth, serverTS } from "lib/firebase"

import { useState } from "react"
import { useRouter } from "next/router"

import { useDocumentData } from "react-firebase-hooks/firestore"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import toast from "react-hot-toast"
import { collection, doc, DocumentData, DocumentReference, updateDoc } from "@firebase/firestore"

const PostManager = () => {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  const postRef = doc(
    collection(doc(collection(firestore, "users"), auth.currentUser!.uid), "posts"),
    Array.isArray(slug) ? slug[slug.length - 1] : slug
  )
  const [post] = useDocumentData(postRef)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? "Edit" : "Preview"}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue" style={{ width: "-moz-available" }}>
                Live view
              </button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

type PostFormProps = {
  postRef: DocumentReference<DocumentData>
  defaultValues: DocumentData | undefined
  preview: boolean
}

const PostForm = ({ postRef, defaultValues, preview }: PostFormProps) => {
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: "onChange" })

  const { isValid, isDirty, errors } = formState

  const updatePost = async ({ content, published }: DocumentData) => {
    await updateDoc(postRef, { content, published, updatedAt: serverTS() })

    reset({ content, published })

    toast.success("Post updated succesfully!")
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register("content", {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" }
          })}
        />
        <fieldset>
          <input {...register("published")} className={styles.checkbox} type="checkbox" />
          <label>Published</label>
        </fieldset>
        {errors.content && <p className="text-danger">{`${errors?.content?.message}`}</p>}
        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  )
}

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

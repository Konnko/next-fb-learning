import AuthCheck from "components/AuthCheck"
import { firestore, auth, serverTS } from "lib/firebase"
import { collection, doc, orderBy, query, getDocs, setDoc, DocumentData } from "firebase/firestore"
import PostFeed from "components/PostFeed"
import { useRouter } from "next/router"
import styles from "../../styles/Home.module.css"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "lib/context"
import toast from "react-hot-toast"

export default function Admin() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

const PostList = () => {
  const [userPosts, setUserPosts] = useState<DocumentData[]>([])

  useEffect(() => {
    const userCollection = collection(firestore, "users")
    const currentUser = doc(userCollection, auth.currentUser!.uid)
    const currentUserPosts = collection(currentUser, "posts")
    getDocs(query(currentUserPosts, orderBy("createdAt"))).then(res => setUserPosts(res.docs.map(doc => doc.data())))
  }, [])

  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={userPosts} />
    </>
  )
}

const CreateNewPost = () => {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uid = auth.currentUser!.uid
    const ref = doc(collection(doc(collection(firestore, "users"), uid), "posts"), slug)

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "hw",
      createdAt: serverTS(),
      updatedAt: serverTS(),
      heartCount: 0
    }

    await setDoc(ref, data)

    toast.success("Post created")

    router.push(`/admin/${slug}`)
  }
  //TODO: check slug input for /[a-z0-9-]*/, then check if it already exists
  return (
    <form onSubmit={createPost}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Article" className={styles.input} />
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" className={styles.input} />
      <button type="submit" className="btn-green">
        Create new post
      </button>
    </form>
  )
}

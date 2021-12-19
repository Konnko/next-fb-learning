import React from "react"
import Loader from "components/Loader"
import { collectionGroup, DocumentData, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore"
import { firestore } from "lib/firebase"
import { postToJson } from "lib/helpers"
import { useState } from "react"
import PostFeed from "components/PostFeed"

const LIMIT = 1

export const getServerSideProps = async () => {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJson)

  return {
    props: { posts }
  }
}

export default function Home(props: { posts: DocumentData[] }) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]
    const cursor = typeof last.createdAt === "number" ? Timestamp.fromMillis(last.createdAt) : last.createdAt

    const nextPostsQ = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(cursor)
    )

    const nextPosts = (await getDocs(nextPostsQ)).docs.map(doc => doc.data())

    setPosts({ ...posts, ...nextPosts })
    setLoading(false)

    if (nextPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }
  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  )
}

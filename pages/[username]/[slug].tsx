import styles from "styles/Post.module.css"
import PostContent from "components/PostComponent"
import { collection, collectionGroup, doc, DocumentData, getDoc, getDocs } from "firebase/firestore"
import { firestore } from "lib/firebase"
import { getUserWithUsername, postToJson } from "lib/helpers"
import HeartButton from "components/HeartButton"

import { useDocumentData } from "react-firebase-hooks/firestore"
import AuthCheck from "components/AuthCheck"
import Link from "next/link"
import { GetStaticProps } from "next"

export const getStaticProps: GetStaticProps = async (params: any) => {
  const { username, slug } = params.params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = doc(collection(userDoc.ref, "posts"), slug)
    post = postToJson(await getDoc(postRef))

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 10000
  }
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore, "posts"))

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data()

    return {
      params: { username, slug }
    }
  })

  return {
    paths,
    fallback: "blocking"
  }
}

export default function Post(props: { path: any; post: DocumentData }) {
  const postRef = doc(firestore, props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}

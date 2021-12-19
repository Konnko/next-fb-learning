import UserProfile from "components/UserProfile"
import PostFeed from "components/PostFeed"
import { getUserWithUsername, postToJson } from "lib/helpers"
import { collection, DocumentData, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import React from "react"

export const getServerSideProps = async (props: any) => {
  const { username } = props.query

  const userDoc = await getUserWithUsername(username)

  if (!userDoc) {
    return {
      notFound: true
    }
  }

  let user
  let posts

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = query(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    )

    posts = (await getDocs(postsQuery)).docs.map(postToJson)
  }

  return {
    props: { user, posts }
  }
}

type ProfileProps = {
  user?: DocumentData
  posts?: DocumentData[]
}

const UserProfilePage: React.FC<ProfileProps> = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}

export default UserProfilePage

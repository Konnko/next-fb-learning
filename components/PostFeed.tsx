import React, { FC } from "react"
import Link from "next/link"
import { DocumentData } from "firebase/firestore"

type FeedProps = {
  posts?: DocumentData[] | null
}

type ItemProps = {
  post: DocumentData
}

const PostItem: FC<ItemProps> = ({ post }) => {
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <strong>By @{post.username}</strong>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>{post.title}</h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} minutes to read
        </span>
        <span>❤️ {post.heartCount} Likes</span>
      </footer>
    </div>
  )
}

const PostFeed: FC<FeedProps> = ({ posts }) => {
  return posts ? (
    <>
      {posts.map(post => (
        <PostItem post={post} key={post.slug} />
      ))}
    </>
  ) : null
}

export default PostFeed

import Link from "next/link"
import React, { FC, useContext } from "react"
import { UserContext } from "lib/context"

type Props = {
  fallback?: React.ReactNode
  children: React.ReactNode
}

const AuthCheck: FC<Props> = ({ fallback, children }) => {
  const { username } = useContext(UserContext)

  return username ? <>{children}</> : fallback ? <>{fallback}</> : <Link href="/enter">You must be signed in</Link>
}

export default AuthCheck

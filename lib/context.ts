import { createContext } from "react"

type Props = {
  user: any
  username: null | string
}

export const UserContext = createContext<Props>({ user: null, username: null })

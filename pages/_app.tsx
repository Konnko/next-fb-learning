import { AppProps } from "next/app"
import "../styles/globals.css"
import Navbar from "components/Navbar"
import { Toaster } from "react-hot-toast"
import { UserContext } from "lib/context"

import { useUserData } from "lib/hooks"

function MyApp({ Component, pageProps }: AppProps) {
  const userData = useUserData()

  return (
    <UserContext.Provider value={userData}>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp

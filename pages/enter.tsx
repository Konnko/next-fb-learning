import React, { FC, useContext, useEffect, useMemo, useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, firestore, googleAuthProvider } from "lib/firebase"
import { UserContext } from "lib/context"
import { doc, getDoc, writeBatch } from "firebase/firestore"
import debounce from "lodash.debounce"

export default function Enter() {
  const { user, username } = useContext(UserContext)

  return <main>{user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}</main>
}

const SignInButton: FC = () => {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
  }

  return (
    <button type="button" className="btn-google" onClick={signInWithGoogle}>
      <img width={30} height={30} src="/google.png" alt="google.png" />
      &nbsp;Sign in with Google
    </button>
  )
}

const SignOutButton: FC = () => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

type Props = {
  username: string | null
  isValid: boolean
  loading: boolean
  isTaken: boolean
}

const UsernameMessage: FC<Props> = ({ username, isValid, loading, isTaken }) => {
  if (!username) {
    return <p />
  }

  if (loading) {
    return <p>Checking...</p>
  }

  if (isValid) {
    return <p className="text-success">{username} is available</p>
  }

  if (username && !isValid) {
    return (
      <p className="text-danger">
        Username should be 3 to 15 characters long and contain only english letters, numbers, . and _
      </p>
    )
  }

  if (isTaken) {
    return <p className="text-danger">That username is taken</p>
  }

  return <p />
}

const UsernameForm: FC = () => {
  const { user, username } = useContext(UserContext)
  const [formValue, setFormValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isTaken, setIsTaken] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userDoc = doc(firestore, `users/${user.uid}`)
    const usernameDoc = doc(firestore, `usernames/${formValue}`)

    const batch = writeBatch(firestore)
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase()
    const rgxp = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    setFormValue(val)

    if (rgxp.test(val)) {
      setLoading(true)
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  const checkUsername = useMemo(
    () =>
      debounce(async (username: string) => {
        if (username.length >= 3) {
          const ref = doc(firestore, `usernames/${username}`)
          const gotRef = await getDoc(ref)
          setLoading(false)
          setIsTaken(!gotRef.data())
        }
      }, 500),
    []
  )

  useEffect(() => {
    isValid && checkUsername(formValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue])

  return username ? null : (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="username" value={formValue} onChange={onChange} />
        <UsernameMessage username={formValue} loading={loading} isValid={isValid} isTaken={isTaken} />
        <button type="submit" className="btn-green" disabled={!isValid || loading}>
          Choose
        </button>
      </form>
    </section>
  )
}

import "./firebase"
import { collection, getDocs, limit, query, QueryDocumentSnapshot, where } from "firebase/firestore"
import { firestore } from "./firebase"

export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, "users")
  const queryRes = query(usersRef, where("username", "==", username), limit(1))
  const userDoc = (await getDocs(queryRes)).docs[0]

  return userDoc
}

export function postToJson(doc: QueryDocumentSnapshot<any>) {
  const data = doc.data()

  return {
    ...data,
    createdAt: data?.createdAt.toMillis(),
    updatedAt: data?.updatedAt.toMillis()
  }
}

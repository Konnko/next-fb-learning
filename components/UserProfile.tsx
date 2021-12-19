import React, { FC } from "react"

type Props = {
  user: any
}

const UserProfile: FC<Props> = ({ user }) => {
  return (
    <div className="box-center">
      <img src={user?.photoURL} alt="avatar" className="card-img-center" />
      <p>
        <i>@{user?.username}</i>
      </p>
      <h1>{user?.displayName}</h1>
    </div>
  )
}

export default UserProfile

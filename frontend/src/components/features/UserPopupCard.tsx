type User = {
  userId: string
  username: string | null
  profile_public: boolean
}

type Props = {
  user: User
}

export default function UserPopupCard({ user }: Props) {
  const name = user.profile_public
    ? user.username || "Usuario"
    : "Usuario anónimo"

  return (
    <div
      style={{
        padding: "8px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <span style={{ fontSize: 13 }}>{name}</span>

      {user.profile_public && (
        <a
          href={`/album/${user.userId}`}
          style={{
            fontSize: 12,
            color: "#ff671f",
            textDecoration: "none",
            fontWeight: 500
          }}
        >
          Ver álbum
        </a>
      )}
    </div>
  )
}
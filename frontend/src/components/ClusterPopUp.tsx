import UserPopupCard from "@/components/features/UserPopupCard"

type User = {
  userId: string
  username: string | null
  profile_public: boolean
}

type Props = {
  users: User[]
}

export default function ClusterPopup({ users }: Props) {
  return (
    <div style={{ minWidth: 220 }}>
      <h4 style={{ marginBottom: 8, 
        color: "#000000",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold"
      }}>Usuarios cercanos</h4>

      <div>
        {users.map((user) => (
          <UserPopupCard key={user.userId} user={user} />
        ))}
      </div>
    </div>
  )
}
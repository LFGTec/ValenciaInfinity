import { useEffect, useMemo, useState } from "react";

import {
  type FriendUser,
  friendsService,
} from "@/services/friendsService";

export function useFriends() {
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data =
        await friendsService.getUsersWithFriendship();

      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error loading users";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const myFriends = useMemo(
    () =>
      users.filter(
        (u) => u.friendship_status === "FRIENDS"
      ),
    [users]
  );

  const pendingRequests = useMemo(
    () =>
      users.filter(
        (u) =>
          u.friendship_status ===
          "PENDING_RECEIVED"
      ),
    [users]
  );

  const searchUsers = (query: string) => {

  if (!query.trim()) return [];

  return users.filter((user) => {

    const normalizedQuery =
      query.toLowerCase();
    

    return (
      user.full_name
        ?.toLowerCase()
        .startsWith(normalizedQuery) 
    );
  });
};

  const sendRequest = async (
    receiverId: string
  ) => {
    await friendsService.sendFriendRequest(
      receiverId
    );

    await loadUsers();
  };

  const acceptRequest = async (
    requestId: string
  ) => {
    await friendsService.acceptFriendRequest(
      requestId
    );

    await loadUsers();
  };

  const rejectRequest = async (
    requestId: string
  ) => {
    await friendsService.rejectFriendRequest(
      requestId
    );

    await loadUsers();
  };

  const removeFriend = async (
    requestId: string
  ) => {
    await friendsService.removeFriend(
      requestId
    );

    await loadUsers();
  };

  return {
    users,

    loading,
    error,

    myFriends,
    pendingRequests,

    searchUsers,

    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,

    reload: loadUsers,
  };
}
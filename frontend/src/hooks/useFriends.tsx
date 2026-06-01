import { useEffect, useMemo, useState } from "react";

import {
  type FriendUser,
  friendsService,
} from "@/services/friendsService";

export function useFriends() {
  const [myFriends, setMyFriends] = useState<FriendUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendUser[]>([]);
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [friends, pending] = await Promise.all([
        friendsService.getMyFriends(),
        friendsService.getPendingRequests(),
      ]);

      setMyFriends(friends);
      setPendingRequests(pending);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results =
      await friendsService.searchUsers(query);

    setSearchResults(results);
  };

  const sendRequest = async (userId: string) => {
    await friendsService.sendFriendRequest(userId);

    setSearchResults((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              friendship_status: "PENDING_SENT",
            }
          : user
      )
    );

    await loadData();
  };

  const acceptRequest = async (requestId: string) => {
    await friendsService.acceptFriendRequest(requestId);

    await loadData();
  };

  const rejectRequest = async (requestId: string) => {
    await friendsService.rejectFriendRequest(requestId);

    await loadData();
  };

  const removeFriend = async (requestId: string) => {
    await friendsService.removeFriend(requestId);

    await loadData();
  };

  return {
    myFriends,
    pendingRequests,
    searchResults,

    searchUsers,

    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,

    reload: loadData,

    loading,
  };
}
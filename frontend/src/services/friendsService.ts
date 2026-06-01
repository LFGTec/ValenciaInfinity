import { supabase } from "./supabaseClient";

export type FriendshipStatus =
    | "NONE"
    | "PENDING_SENT"
    | "PENDING_RECEIVED"
    | "FRIENDS";

export interface FriendUser {
  id: string;

  full_name: string;

  avatar_url?: string;

  level: number;
  puntos: number;
  location: string;
  friend_pin: string;


  friendship_status: FriendshipStatus;

  friendship_id?: string;
  
}

export const friendsService = {
   async getMyFriends(): Promise<FriendUser[]> {
    const { data, error } = await supabase.rpc(
      "get_my_friends"
    );

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async getPendingRequests(): Promise<FriendUser[]> {
    const { data, error } = await supabase.rpc(
      "get_pending_requests"
    );

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async searchUsers(
    searchTerm: string
  ): Promise<FriendUser[]> {
    const { data, error } = await supabase.rpc(
      "search_users",
      {
        p_search: searchTerm,
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async sendFriendRequest(receiverId: string) {
    const { error } = await supabase.rpc(
      "send_friend_request",
      {
        p_receiver_id: receiverId,
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  },

  async acceptFriendRequest(requestId: string) {
    const { error } = await supabase.rpc(
      "accept_friend_request",
      {
        request_id: requestId,
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  },

  async rejectFriendRequest(requestId: string) {
    const { error } = await supabase.rpc(
      "reject_friend_request",
      {
        request_id: requestId,
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  },

  async removeFriend(requestId: string) {
    const { error } = await supabase.rpc(
      "remove_friendship",
      {
        request_id: requestId,
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase.rpc(
      "get_user_profile",
      {
        p_user_id: userId,
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    return data?.[0] ?? null;
  },
};
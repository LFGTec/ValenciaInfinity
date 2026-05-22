
import { useEffect, useState } from "react";
import { friendsService } from "@/services/friendsService";

export interface VisitingProfile {
  id: string;
  full_name: string;
  avatar_url?: string;

  puntos: number;
  level: number;

  friendship_status:
    | "NONE"
    | "PENDING_SENT"
    | "PENDING_RECEIVED"
    | "FRIENDS";

  friendship_id?: string;
}

export function useVisitingAlbum(
  targetUserId?: string
) {

  const [profile, setProfile] =
    useState<VisitingProfile | null>(null);

  const [loadingVisiting, setLoading] =
    useState(true);

  useEffect(() => {

    if (!targetUserId) {
      setLoading(false);
      return;
    }

    loadProfile();

  }, [targetUserId]);

  async function loadProfile() {

    setLoading(true);

    try {

      const users =
        await friendsService.getUsersWithFriendship();

      const foundUser =
        users.find(
          (u) => u.id === targetUserId
        );

      if (foundUser) {
        setProfile({
          id: foundUser.id,
          full_name: foundUser.full_name,
          avatar_url: foundUser.avatar_url,
          points: foundUser.puntos,
          level: foundUser.level,
          friendship_status:
            foundUser.friendship_status,
          friendship_id: foundUser.friendship_id,
        } as VisitingProfile);
      } else {
        setProfile(null);
      }

    } catch (error) {

      console.error(
        "Error loading visiting profile:",
        error
      );

    } finally {

      setLoading(false);

    }
  }

  async function sendFriendRequest() {

    if (!profile) return;

    await friendsService.sendFriendRequest(
      profile.id
    );

    setProfile({
      ...profile,
      friendship_status: "PENDING_SENT",
    });
  }

  return {

    profile,

    loadingVisiting,

    sendFriendRequest,
  };
}
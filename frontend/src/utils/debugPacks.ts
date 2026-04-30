import { supabase } from "../services/supabaseClient";

export async function debugUserPacks() {
  try {
    // Get current authenticated user
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      console.error("No user authenticated");
      return;
    }

    console.log("=== DEBUG USER PACKS ===");
    console.log("Authenticated user ID:", userId);

    // Query 1: All packs for this user (no filters)
    const { data: userPacks, error: userPacksError } = await supabase
      .from("user_packs")
      .select("*")
      .eq("user_id", userId);

    if (userPacksError) {
      console.error("Error querying user_packs:", userPacksError);
    } else {
      console.log("Total packs found for this user:", userPacks?.length || 0);
      if (userPacks && userPacks.length > 0) {
        console.log("Packs details:", JSON.stringify(userPacks, null, 2));
      }
    }

    // Query 2: Raw query to see ALL packs in table (privacy warning)
    const { data: allPacks, error: allPacksError } = await supabase
      .from("user_packs")
      .select("id, user_id, pack_type, opened_at, created_at")
      .limit(20);

    if (allPacksError) {
      console.error("Error querying all packs:", allPacksError);
    } else {
      console.log("Sample of ALL packs in database (first 20):");
      console.log(JSON.stringify(allPacks, null, 2));
    }

    // Query 3: Count unopened packs for this user
    const { data: unopenedCount, error: unopenedError } = await supabase
      .from("user_packs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("opened_at", null);

    if (unopenedError) {
      console.error("Error counting unopened packs:", unopenedError);
    } else {
      console.log("Unopened packs count:", unopenedCount?.length || 0);
    }
  } catch (error) {
    console.error("Debug error:", error);
  }
}

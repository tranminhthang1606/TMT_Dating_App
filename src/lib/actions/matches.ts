"use server";

import { UserProfile } from "@/app/[locale]/profile/page";
import { createClient } from "../supabase/server";
import { calculateAge, calculateDistance } from "../helpers/calculate-age";

export async function getPotentialMatches(): Promise<UserProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  // Get current user's profile and preferences
  const { data: currentUser, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userError) {
    throw new Error("Failed to get current user profile");
  }

  const currentUserPrefs = currentUser.preferences as any;
  const currentUserAge = calculateAge(currentUser.birthdate);

  // Get all potential matches
  const { data: potentialMatches, error } = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id)
    .limit(100);

  if (error) {
    throw new Error("failed to fetch potential matches");
  }

  // Filter matches based on preferences
  const filteredMatches = potentialMatches
    .filter((match) => {
      // Filter by gender preference
      const genderPreference = currentUserPrefs?.gender_preference || [];
      if (genderPreference.length > 0 && !genderPreference.includes(match.gender)) {
        return false;
      }

      // Filter by age range
      const ageRange = currentUserPrefs?.age_range || { min: 18, max: 100 };
      const matchAge = calculateAge(match.birthdate);
      if (matchAge < ageRange.min || matchAge > ageRange.max) {
        return false;
      }

      // Check if the match's preferences also include the current user
      const matchPrefs = match.preferences as any;
      const matchGenderPref = matchPrefs?.gender_preference || [];
      const matchAgeRange = matchPrefs?.age_range || { min: 18, max: 100 };
      
      // Check if match is interested in current user's gender
      if (matchGenderPref.length > 0 && !matchGenderPref.includes(currentUser.gender)) {
        return false;
      }

      // Check if match is interested in current user's age
      if (currentUserAge < matchAgeRange.min || currentUserAge > matchAgeRange.max) {
        return false;
      }

      // Filter by distance if location data is available
      const maxDistance = currentUserPrefs?.distance || 100;
      if (currentUser.location_lat && currentUser.location_lng && 
          match.location_lat && match.location_lng) {
        const distance = calculateDistance(
          currentUser.location_lat,
          currentUser.location_lng,
          match.location_lat,
          match.location_lng
        );
        if (distance > maxDistance) {
          return false;
        }
      }
      
      return true;
    })
    .map((match) => ({
      id: match.id,
      full_name: match.full_name,
      username: match.username,
      email: "",
      gender: match.gender,
      birthdate: match.birthdate,
      bio: match.bio,
      avatar_url: match.avatar_url,
      preferences: match.preferences,
      location_lat: match.location_lat,
      location_lng: match.location_lng,
      last_active: new Date().toISOString(),
      is_verified: true,
      is_online: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })) || [];

  return filteredMatches;
}

export async function likeUser(toUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { error: likeError } = await supabase.from("likes").insert({
    from_user_id: user.id,
    to_user_id: toUserId,
  });

  if (likeError) {
    throw new Error("Failed to create like");
  }

  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("*")
    .eq("from_user_id", toUserId)
    .eq("to_user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error("Failed to check for match");
  }

  if (existingLike) {
    const { data: matchedUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", toUserId)
      .single();

    if (userError) {
      throw new Error("Failed to fetch matched user");
    }

    return {
      success: true,
      isMatch: true,
      matchedUser: matchedUser as UserProfile,
    };
  }

  return { success: true, isMatch: false };
}

export async function getUserMatches() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq("is_active", true);

  if (error) {
    throw new Error("Failed to fetch matches");
  }

  const matchedUsers: UserProfile[] = [];

  for (const match of matches || []) {
    const otherUserId =
      match.user1_id === user.id ? match.user2_id : match.user1_id;

    const { data: otherUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", otherUserId)
      .single();

    if (userError) {
      continue;
    }

    matchedUsers.push({
      id: otherUser.id,
      full_name: otherUser.full_name,
      username: otherUser.username,
      email: otherUser.email,
      gender: otherUser.gender,
      birthdate: otherUser.birthdate,
      bio: otherUser.bio,
      avatar_url: otherUser.avatar_url,
      preferences: otherUser.preferences,
      location_lat: otherUser.location_lat,
      location_lng: otherUser.location_lng,
      last_active: new Date().toISOString(),
      is_verified: true,
      is_online: false,
      created_at: match.created_at,
      updated_at: match.created_at,
    });
  }

  return matchedUsers;
}
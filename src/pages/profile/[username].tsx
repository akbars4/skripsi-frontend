import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import GameGrid from "@/components/GameGrid";
import FollowButton from "@/components/FollowButton";
import { fetchUserProfile, fetchUserFollowing } from "lib/api";
import { ProfileResponse } from "@/interfaces/api/ListsOfApiInterface";
import { Game } from "@/interfaces/Game";

export default function OtherProfilePage() {
  const router = useRouter();
  const { username: targetUsername } = router.query as { username: string };
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!targetUsername || !token) return;
    setLoading(true);

    fetchUserProfile(targetUsername, token)
      .then((data) => {
        setProfile(data);

        if (user && user.username !== targetUsername) {
          fetchUserFollowing(user.username, token).then((list) =>
            setIsFollowing(list.some((u) => u.id === data.id))
          );
        }
      })
      .catch(() => router.replace("/404"))
      .finally(() => setLoading(false));
  }, [targetUsername, token, user, router]);

  if (loading) return <div className="p-8 text-white">Loading…</div>;
  if (!profile) return null;

  const isOwn = user?.username === profile.username;

  // ✅ mapping aman ke Game interface
  const mapToGame = (item: any): Game => ({
  id: item.id ?? 0,
  igdb_id: item.igdb_id ?? 0,
  name: item.name,
  slug: item.slug ?? item.name?.toLowerCase().replace(/\s+/g, "-"),
  cover_url: item.cover_url ?? item.cover ?? "", // ✅ pakai cover_url bukan cover
  rating_count: item.rating_count ?? 0, // ✅ default 0 kalau ga ada
  href: `/games/${item.slug ?? item.name?.toLowerCase().replace(/\s+/g, "-")}`,
});;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
            {profile.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                📷
              </div>
            )}
          </div>
          {/* Username + Edit or Follow */}
          <div>
            <div className="text-2xl font-semibold flex items-center">
              {profile.username}
              {isOwn ? (
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="ml-4 text-gray-400 hover:text-white"
                >
                  ✏️
                </button>
              ) : (
                <FollowButton
                  userId={profile.id}
                  token={token!}
                  initialFollowing={isFollowing}
                  onChange={(now) =>
                    setProfile((p) =>
                      p
                        ? {
                            ...p,
                            follower_count:
                              p.follower_count + (now ? 1 : -1),
                          }
                        : p
                    )
                  }
                />
              )}
            </div>
            <p className="mt-2 text-gray-400 max-w-md">{profile.bio || ""}</p>
          </div>
        </div>
        {/* STATS */}
        <div className="flex space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.played_game_count}</div>
            <div className="text-sm text-gray-400">Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.diary_count}</div>
            <div className="text-sm text-gray-400">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.following_count}</div>
            <div className="text-sm text-gray-400">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.follower_count}</div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
        </div>
      </div>

      {/* FAVOURITES */}
      <h2 className="text-lg font-semibold mb-4">FAVOURITE GAMES</h2>
      {profile.favorites.length > 0 ? (
        <GameGrid games={profile.favorites.filter(Boolean).map(mapToGame)} />
      ) : (
        <p className="text-gray-400 mb-8">No favorite games yet.</p>
      )}

      {/* RECENTLY PLAYED */}
      <h2 className="text-lg font-semibold mb-4 mt-12">RECENTLY PLAYED</h2>
      {profile.recently_played.length > 0 ? (
        <GameGrid
          games={profile.recently_played
            .filter((entry) => entry && entry.game)
            .map((entry) => mapToGame(entry.game))}
        />
      ) : (
        <p className="text-gray-400">No recently played games.</p>
      )}
    </div>
  );
}

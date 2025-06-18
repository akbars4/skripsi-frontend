import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Game } from "@/interfaces/Game";
import { fetchUserProfile } from "lib/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProfileResponse } from "@/interfaces/api/ListsOfApiInterface";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(user.username, token);
        setProfile(data);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, token]);

  if (loading || !profile)
    return <div className="p-8 text-white">Loading...</div>;

  const mapToGame = (item: any): Game => ({
    id: item.id,
    igdb_id: item.igdb_id ?? item.id,
    name: item.name,
    slug: item.slug,
    cover: item.cover,
    href: `/games/${item.slug}`,
    rating_count: 0,
  });

  const avatarUrl = profile.profile_picture_url
    ? encodeURI(new URL(profile.profile_picture_url).pathname)
    : null;

  return (
    <div className="min-h-screen bg-[#11161D] text-gray-100 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/avatars/default.png";
                }}
              />
            )}
          </div>
          <div>
            <div className="text-2xl font-semibold flex items-center">
              {profile.username}
              <button
                onClick={() => router.push("/profile/edit")}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ✏️
              </button>
            </div>
            <p className="mt-2 text-gray-400 max-w-md">{profile.bio ?? ""}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap md:space-x-8 gap-4 md:gap-y-0 mt-4 md:mt-0">
          <Stat label="Games" value={profile.played_game_count} />
          <Link href="/activity">
            <Stat label="Review" value={profile.diary_count} />
          </Link>
          <Link href="/profile/following">
            <Stat label="Following" value={profile.following_count} />
          </Link>
          <Link href="/profile/follower">
            <Stat label="Followers" value={profile.follower_count} />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Section (Favorites + Recently Played) */}
        <div className="md:col-span-2 flex flex-col gap-12">
          {/* FAVORITES */}
          <Section title="FAVORITES GAMES">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.favorites.map((item) => {
                const game = mapToGame(item);
                return (
                  <Link key={game.id} href={game.href}>
                    <img
                      src={game.cover}
                      alt={game.name}
                      className="w-full aspect-[3/4] object-cover rounded-md shadow-md transition-transform hover:scale-105"
                    />
                  </Link>
                );
              })}
            </div>
          </Section>

          {/* RECENTLY PLAYED */}
          <Section title="RECENTLY PLAYED">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.recently_played.map((item) => {
                const game = mapToGame(item);
                return (
                  <Link key={game.id} href={game.href}>
                    <img
                      src={game.cover}
                      alt={game.name}
                      className="w-full aspect-[3/4] object-cover rounded-md shadow-md transition-transform hover:scale-105"
                    />
                  </Link>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Right Section (GameList + Button) */}
        <div className="flex flex-col gap-4">
          <Section title="GAMELIST">
            <div className="flex gap-2 flex-wrap">
              {profile.game_list_preview.map((item) => (
                <Link key={item.id} href={`/lists`}>
                  <img
                    src={item.cover}
                    alt=""
                    className="w-[100px] md:w-[120px] aspect-[2/3] object-cover rounded-md shadow-md"
                  />
                </Link>
              ))}
            </div>
          </Section>

          <Link href="/activity">
            <div className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm text-center">
              Go to {user!.username} Diary
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center w-24">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

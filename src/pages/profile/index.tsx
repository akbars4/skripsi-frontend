// src/pages/profile/index.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GameGrid from "@/components/GameGrid";
import { Game } from "@/interfaces/Game";
import { fetchUserProfile } from "lib/api";
import Image from "next/image";
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
    id: item.id, // ✅ tambahkan ini
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
    <div className="min-h-screen bg-[#11161D] text-gray-100 p-8">
      <div className="flex justify-between">
        <div className="flex items-center space-x-6 mb-12 just">
          {/* profile pic */}
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={profile.username}
                //   width={96}
                //   height={96}
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
        {/* stats */}
        <div className="flex space-x-8 mt-4">
          <Stat label="Games" value={profile.played_game_count} />
          <Stat label="Review" value={profile.diary_count} />
          <Link href="/profile/following">
            <Stat label="Following" value={profile.following_count} />
          </Link>
          <Link href="/profile/follower">
            <Stat label="Followers" value={profile.follower_count} />
          </Link>
        </div>
      </div>

      <Section title="FAVOURITES GAMES">
        <GameGrid games={profile.favorites.map(mapToGame)} />
      </Section>

      <Section title="RECENTLY PLAYED">
        <GameGrid games={profile.recently_played.map(mapToGame)} />
      </Section>

      <div className="mt-8 text-center">
        <Link href="/activity">
          <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg">
            Go to {user!.username} Diary
          </div>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
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
    <div className="mb-12">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

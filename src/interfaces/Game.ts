// interfaces/Game.ts

export interface Game {
  id: number;
 igdb_id: number;
  name: string;
  slug: string;
  cover: string;
  rating_count: number;
  href: string
    // Add any fields your Laravel API returns
  }

  export interface  GameLocal extends Game{
    id: number                // ← this is the field your forum create needs
  summary: string
  cover_url: string
  genres: string[]
  platforms: string[]
  release_date: string
  developer: string
  }
  
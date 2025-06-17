// src/components/GameGrid.tsx
import GameCard from "@/components/Gamecard";
import { Game } from "@/interfaces/Game";

type GameGridProps = {
  games: Game[];
  /** optionally override the base‐path for each card’s link */
  hrefPrefix?: string;
};

export default function GameGrid({
  games,
  hrefPrefix = "/games",   // default value
}: GameGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.slug}
          slug={game.slug}
          name={game.name}
          cover={game.cover}
          href={`${hrefPrefix}/${game.slug}`}
          game={game} // ✅ ini yang hilang dan bikin error
        />
      ))}
    </div>
  );
}

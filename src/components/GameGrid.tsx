import GameCard from "./Gamecard";
import { Game } from "../interfaces/Game";

type GameGridProps = {
  games: Game[];
};

export default function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {games.map((game) => (
        <GameCard key={game.igdb_id} {...game} />
      ))}
    </div>
  );
}

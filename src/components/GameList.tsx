import GameCard from "./Gamecard";
import { Game } from "../interfaces/Game";

type GameListProps = {
  games: Game[];
};

export default function GameList({ games }: GameListProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 w-fit px-2">
        {games.map((game) => (
          <div key={game.igdb_id} className="flex-shrink-0 w-[200px]">
            <GameCard {...game} />
          </div>
        ))}
      </div>
    </div>
  );
}

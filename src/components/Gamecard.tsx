import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  igdb_id: number;
  name: string;
  cover: string;
}

export default function GameCard({ igdb_id, name, cover }: GameCardProps) {
  return (
    <Link href={`/games/${igdb_id}`}>
      <div className="aspect-[4/5] w-full rounded-md overflow-hidden hover:scale-105 transition-transform">
        
        <Image
          src={cover}
          alt={name}
          width={200}
          height={250}
          className="object-cover w-full h-full"
        />
        {/* Optional: title overlay or text below */}
        {/* <div className="text-white mt-2 text-center">{name}</div> */}
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";

export interface GameCardProps {
  slug: string;
  name: string;
  cover: string;
  href: string;
}

export default function GameCard({ slug, name, cover, href }: GameCardProps) {
  if (!href) {
    console.error("GameCard: missing href", GameCard);
    return null;
  }
  return (
    <Link href={href} prefetch={false} className="block group">
      <div className="aspect-[4/5] w-full rounded-md overflow-hidden transform transition-transform duration-200 group-hover:scale-105">
        <Image
          src={cover}
          alt={name}
          width={200}
          height={250}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      {/*
      <p className="mt-2 text-center text-sm font-medium text-white">
        {name}
      </p>
      */}
    </Link>
  );
}

// api Games page
export async function fetchGames({
  page = 1,
  perPage = 30,
  sortBy = "total_rating_count",
  sortDirection = "desc",
}: {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const url = `${baseUrl}/api/games?page=${page}&per_page=${perPage}&sort_by=${sortBy}&sort_direction=${sortDirection}`;

  const res = await fetch(url, {
    headers: {
      "X-API-KEY": apiKey || "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  const json = await res.json();
  return json.data;
}

// api homepage - Popular List
export async function fetchPopularGame() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(`${baseUrl}/api/popular-this-year`, {
    credentials: "include", // kalau memang perlu cookie/auth
    headers: {
      "X-API-KEY": "padil-ganteng-123",
    },
  });

  const json = await res.json();

  if (!json.data) {
    throw new Error("Data not found");
  }

  return json.data;
}

// api homepage - new release
export async function fetchNewRelease() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(`${baseUrl}/api/new-release`, {
    credentials: "include", // kalau memang perlu cookie/auth
    headers: {
      "X-API-KEY": "padil-ganteng-123",
    },
  });

  const json = await res.json();

  if (!json.data) {
    throw new Error("Data not found");
  }

  return json.data;
}

// api games page
// GET /api/games
export async function fetchGamesPages({
  page = 1,
  perPage = 30,
  sortBy = "total_rating_count",
  sortDirection = "desc",
}: {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(
    `${baseUrl}/api/games?page=${page}&per_page=${perPage}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
    {
      headers: {
        "X-API-KEY": apiKey || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch explore games");
  }

  const json = await res.json();
  return json.data; // isi "data" yang berisi array game + pagination info
}

//api log out
export async function logout() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  const json = await res.json();
  return json;
}

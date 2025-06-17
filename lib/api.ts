//  --------------------- api login user -------------------------------
// lib/api.ts

import { ActivityDetail, CreateDiaryBody, CreateListBody, CreateThreadBody, DiaryComment, DiaryDetail, DiaryEntry, FetchForumThreadsBySlugOpts, FollowerUser, FollowingUser, ForumThread, LoginResponse, ProfileResponse, Reply, UserList } from "@/interfaces/api/ListsOfApiInterface";
import { Game } from "@/interfaces/Game";



export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-KEY": apiKey || "",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  const token = data.data?.token;
  if (!token) throw new Error("Token not found");

  return{
    token: data.data?.token,
    username: data.data.user.username
  };
}

// ---------------------------- api Games page ---------------------------------
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
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const apiKey = process.env.NEXT_PUBLIC_API_KEY;

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

// ------------------------------- api homepage -> Popular List -----------------------------
export async function fetchPopularGame() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(`${baseUrl}/api/popular-this-year`, {
    credentials: "include", // kalau memang perlu cookie/auth
    headers: {
      "X-API-KEY": apiKey || "",
    },
  });

  const json = await res.json();

  if (!json.data) {
    throw new Error("Data not found");
  }

  return json.data;
}

//  ------------------------------- api homepage -> new release -------------------------
export async function fetchNewRelease() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const res = await fetch(`${baseUrl}/api/new-release`, {
    credentials: "include", // kalau memang perlu cookie/auth
    headers: {
      "X-API-KEY": apiKey || "",
    },
  });

  const json = await res.json();

  if (!json.data) {
    throw new Error("Data not found");
  }

  return json.data;
}

// ------------------------------ api games page ----------------------------------
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
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const apiKey = process.env.NEXT_PUBLIC_API_KEY;

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

// --------------------------- api log out ----------------------------
// api register msh di pages/register.tx
export async function logout() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  const json = await res.json();
  return json;
}

// api game detail
// ------------------------------- api button to add game to gamelist ----------------------------
// ([pages/game/[slug]/index.tsx])
export async function addToGameList(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const res = await fetch(`${baseUrl}/api/lists/${slug}/custom`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-API-KEY": apiKey || "",
    },
  });
  if (!res.ok) throw new Error("Gagal menambahkan ke gamelist");
}

// ------------------------ api buat button add to favourites --------------------
// ([slug]/index.tsx)
export async function addToFavorites(igdb_id: number, token: string) {
  const url = `${baseUrl}/api/lists/add-to-favorites`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey || "",
      // Jika backend memeriksa Bearer token, gunakan:
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include", // jika backend menggunakan cookie/session
    body: JSON.stringify({ igdb_id }),
  });

  if (!res.ok) {
    // Contoh: jika batas 4 game terlampaui atau error lain,
    // bisa throw error dengan pesan dari response
    let errMsg = `Failed to add to favorites (status ${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson?.message) errMsg = errJson.message;
    } catch (e) {
      // nothing
    }
    throw new Error(errMsg);
  }

  const json = await res.json();
  // response example:
  // {
  //   "code":200,
  //   "status":"OK",
  //   "message":"Game added to favorites.",
  //   "data": { "game_list_id":1, "igdb_id":114283, "name":"Persona 5 Royal" }
  // }
  return json.data;
}

// ---------------------------- api button add to review --------------------
// ([slug]/index.tsx)


export async function createDiaryEntry(body: CreateDiaryBody, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diary/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`Failed to save diary (${res.status})`);
  return res.json();
}

// ------------------------- api button add to want to play ---------------------
// ([slug]/index.tsx)
export async function addToWantToPlay(slug: string) {
  //     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  //   const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  //   const res = await fetch(`${baseUrl}/api/want-to-play/add/${slug}`, {
  //      method: "POST",
  //     credentials: "include",
  //     headers: {
  //         "X-API-KEY": apiKey || "",
  //     }
  //     });
  //   if (!res.ok) throw new Error("Gagal menambahkan ke want-to-play");
}

// ---------------------------- api game detail---------------------------------
// ([slug]/index.tsx)
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export async function getGameBySlug(slug: string) {
  const res = await fetch(`${baseUrl}/api/games/${slug}`, {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey || "",
    },
  });

  if (!res.ok) {
    // Jika status 404, berarti memang tidak ada game dengan slug itu
    throw new Error("Game not found");
  }
  const json = await res.json();
  return json.data;
}

// -------------------- api buat show game review di game detail --------------------
// ([slug]/index.tsx)
export async function getGameReviews(slug: string, page: number) {
  //   const res = await fetch(
  //     `${process.env.API_BASE_URL}/games/${slug}/reviews?page=${page}`
  //   );
  //   if (!res.ok) throw new Error("Reviews not found");
  //   const json = await res.json();
  //   return json.data; // diasumsikan bentuknya { current_page, per_page, next_page, prev_page, data: Review[] }
}



// ------------------------ api buat forum ------------------------
// ------------------------------------------------------------------
// Forum threads types + fetcher
// ------------------------------------------------------------------

/**
 * A single forum thread as returned by GET /api/forum/games/{slug}
 */


/**
 * Options for fetching a game’s forum threads
 */


/**
 * Fetch a paginated list of forum threads for a given game slug.
 */
export async function fetchForumThreadsBySlug({
  slug,
  page = 1,
  per_page = 30,
  sort_by = "created_at",
  sort_direction = "desc",
}: FetchForumThreadsBySlugOpts) {
  // Build the URL with query params
  const url = new URL(`${baseUrl}/api/forum/games/${slug}`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("per_page", per_page.toString());
  url.searchParams.set("sort_by", sort_by);
  url.searchParams.set("sort_direction", sort_direction);

  // Fetch with your API key header
  const res = await fetch(url.toString(), {
    headers: {
      "X-API-KEY": apiKey || "",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch forum threads (${res.status})`);
  }

  const json = await res.json();
  const pageData = json.data;
  // assuming the JSON comes back as { data: { current_page, per_page, next_page, data: ForumThread[] } }
  return {
    threads: pageData.data as ForumThread[],
    currentPage: pageData.meta.current_page as number,
    lastPage: pageData.meta.last_page as number,
    nextPage:
      pageData.links.next !== null ? pageData.meta.current_page + 1 : null,
  };
}

// ------------------------------ api reply forum ------------------------------------

// src/lib/api.ts (add near the bottom)


// export interface CreatedReply {
//   id: number;
//   content: string;
//   created_at: string;
//   user: {
//     id: number;
//     username: string;
//     profile_picture_url: string;
//   };
//   // etc...
// }

/**
 * POST a reply to a forum thread
 */
export async function createForumReply(
  threadId: number,
  body: { content: string },
  token: string
) : Promise<Reply> { 
  const res = await fetch(`${baseUrl}/api/forum/${threadId}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey || "",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to post reply");
  }
  const json = await res.json();
  return json.data.data as {
    id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    profile_picture_url: string;

  };
}};

// --------- show replies ---------
// src/lib/api.ts



export interface forumThreadDetail extends ForumThread{
    replies: Reply[];
}
/**
 * GET all replies for a given thread ID.
 */
// src/lib/api.ts
/**
 * GET a single forum thread by its ID (includes nested `replies`)
 */
export async function fetchThreadById(slug: string, threadId: number): Promise<forumThreadDetail> {
  const res = await fetch(`${baseUrl}/api/forum/${threadId}`, {
    headers: { "X-API-KEY": apiKey || "" },
  });
  if (!res.ok) throw new Error("Failed to load thread");
  const json = await res.json();
  // unwrap the nested `data.data`
  return json.data.data as ForumThread & { replies: Reply[] };
}

export async function fetchRepliesByThreadId(
    slug: string,
  threadId: number,
): Promise<Reply[]> {
  const detail = await fetchThreadById(slug, threadId);
  return detail.replies;
}


// ---------------------- api create forum --------------------------

// src/lib/api.ts




// call this when you POST a new thread
export async function createForumThread(
    slug: string,
  gameLocalId: number,
  body: CreateThreadBody,
  token: string
): Promise<ForumThread> {
  const res = await fetch(`${baseUrl}/api/forum/games/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey || "",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      game_local_id: gameLocalId,
      title: body.title,
      content: body.content,
    }),
  });
  if (!res.ok) throw new Error("Failed to create thread");
  const json = await res.json();
  return json.data as ForumThread;
}


// ---------------------- api List Page -------------------------------


// fetch all of the user’s lists
export async function fetchUserLists(username: string, token: string): Promise<UserList[]> {
  const res = await fetch(`${baseUrl}/api/user/${encodeURIComponent(username)}/lists`, {
    headers: {
      "X-API-KEY": apiKey || "",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load lists");
  const json = await res.json();
  return json.data as UserList[];
}

// create a new list
export async function createUserList(
  body: CreateListBody,
  token: string
): Promise<UserList> {
  console.log("body to send", body)
  const res = await fetch(`${baseUrl}/api/lists/custom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey || "",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to create list");
  }
  const json = await res.json();
  return json.data as UserList;
}

// ----------------------- api buat profile page -----------------------


export async function fetchUserProfile(
  username: string,
  token: string
): Promise<ProfileResponse> {
  const res = await fetch(
    `${baseUrl}/api/user/${encodeURIComponent(username)}`,
    {
      headers: {
        "X-API-KEY": apiKey || "",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  )
  if (!res.ok) throw new Error("Failed to fetch user profile")
  const json = await res.json()
  return json.data as ProfileResponse
}

export async function fetchUserFollowing(
  byUsername: string,
  token: string
): Promise<FollowingUser[]> {
  const res = await fetch(
    `${baseUrl}/api/user/${encodeURIComponent(byUsername)}/following`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey || "",
      },
      credentials: "include",
    }
  )
  if (!res.ok) throw new Error("Failed to load following list")
  const json = await res.json()
  return json.data as FollowingUser[]
}


export async function followUser(
  targetUserId: number,
  token: string
): Promise<void> {
  const res = await fetch(`${baseUrl}/api/user/follow/${targetUserId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-KEY": apiKey || "",
    },
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to follow user")
}

export async function unfollowUser(
  targetUserId: number,
  token: string
): Promise<void> {
  const res = await fetch(`${baseUrl}/api/user/unfollow/${targetUserId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-KEY": apiKey || "",
    },
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to unfollow user")
}

// ===== edit profile ====
// lib/api.ts
// … import baseUrl, apiKey, dll …

/**
 * Update user profile (multipart/form-data)
 */
export async function updateUserProfile(
  formData: FormData,
  token: string
): Promise<ProfileResponse> {
  const res = await fetch(`${baseUrl}/api/user/update`, {
    method: "POST",               // atau sesuai spec: PUT/PATCH
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-KEY": apiKey || "",
      // NOTE: Jangan set Content-Type: browser akan otomatis atur multipart boundary
    },
    body: formData,
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error("Update failed: " + err)
  }
  const json = await res.json()
  return json.data as ProfileResponse
}

// ======== get follower user =========
export async function fetchUserFollower(
  username: string,
  token: string
): Promise<FollowingUser[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${encodeURIComponent(
      username
    )}/following`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
      },
      credentials: "include",
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch follower list")
  }
  const json = await res.json()
  return json.data as FollowerUser[]
}

// ====== api search =========
export type ApiResponse<T> = {
  code: number;
  status: string;
  message: string;
  data: T;
};

export async function searchGames(query: string): Promise<ApiResponse<Game[]>> {
  const res = await fetch(
    `${baseUrl}/api/games/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "X-API-KEY": apiKey || "",
      },
    }
  );
  if (!res.ok) throw new Error('Gagal mengambil data game');
  return res.json();
}

export async function searchUsers(query: string): Promise<ApiResponse<ProfileResponse[]>> {
  const res = await fetch(
    `${baseUrl}/api/user/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "X-API-KEY": apiKey || "",
      },
    }
  );
  if (!res.ok) throw new Error('Gagal mengambil data user');
  return res.json();
}

export async function searchForums(query: string): Promise<ApiResponse<ForumThread[]>> {
  const res = await fetch(
    `${baseUrl}/api/games/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "X-API-KEY": apiKey || "",
      },
    }
  );
  if (!res.ok) throw new Error('Gagal mengambil data forum');
  return res.json();
}

// ============= fetch api activity ===================
export async function fetchDiaryList(): Promise<ApiResponse<DiaryEntry[]>> {
  const res = await fetch(`${baseUrl}/api/diary`, {
    headers: {
      "X-API-KEY": apiKey || "",
      "Accept":    "application/json",
    },
    credentials: "include",           // kirim cookie kalau pakai session
  });
  if (!res.ok) throw new Error(`Gagal ambil diary list (${res.status})`);
  return res.json();
}

/**
 * Fetch detail satu entry berdasarkan ID
 */
export async function fetchDiaryDetail(
  id: number
): Promise<ApiResponse<DiaryDetail>> {
  const res = await fetch(`${baseUrl}/api/diary/${id}`, {
    headers: {
      "X-API-KEY": apiKey || "",
      "Accept":    "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Gagal ambil diary detail (${res.status})`);
  return res.json();
}

export const fetchActivityDetail = async (
  id: number,
  ctx?: { req?: { headers?: { cookie?: string } } }
): Promise<{ data: ActivityDetail }> => {
  const headers = {  "X-API-KEY": apiKey || "",
      "Accept":    "application/json", } as Record<string, string>
  if (ctx?.req?.headers?.cookie) {
    headers['cookie'] = ctx.req.headers.cookie
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/{username}/activity/${id}`,
    { headers }
  )
  if (!res.ok) throw new Error(`Status ${res.status}`)
  return res.json()
}

// lib/api.ts

//========= api activity / diary fix ===========
export async function fetchUserDiary(username: string, token: string): Promise<DiaryEntry[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${username}/diary`,
    {
      method: 'GET',
      headers: {
        "X-API-KEY": apiKey || "",
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch diary: ${res.status}`);
  }

  const json = await res.json();
  return json.data; // array of DiaryEntry
}


export async function fetchDiaryComments(diaryId: number): Promise<DiaryComment[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diary/${diaryId}/comments`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
    }
  )
  if (!res.ok) throw new Error('Gagal mengambil komentar')
  const json = await res.json()
  return json.data
}

export async function postDiaryComment(
  diaryId: number,
  comment: string,
  token: string
): Promise<DiaryComment> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diary/comments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ diary_id: diaryId, comment }),
    }
  )
  if (!res.ok) throw new Error('Gagal mengirim komentar')
  const json = await res.json()
  return json.data
}

export type CommunityPost = {
  wr_id: number;
  subject: string;
  datetime: string;
  date: string;
  name: string;
  hit: number;
  comment: number;
  category: string;
  href: string;
};

export type CommunityBoardList = {
  ok: true;
  board: {
    bo_table: string;
    subject: string;
    listHref: string;
  };
  count: number;
  items: CommunityPost[];
};

const API_URL = '/api/community.php';

export async function fetchCommunityBoard(
  board: 'notice' | 'faq' | 'youtube' = 'notice',
  limit = 100
): Promise<CommunityBoardList> {
  const params = new URLSearchParams({
    action: 'list',
    board,
    limit: String(limit),
  });
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  const data = (await res.json()) as CommunityBoardList | { ok: false; message?: string };
  if (!res.ok || !data || (data as { ok?: boolean }).ok !== true) {
    const msg =
      data && typeof data === 'object' && 'message' in data && data.message
        ? String(data.message)
        : '게시글을 불러오지 못했습니다.';
    throw new Error(msg);
  }
  return data as CommunityBoardList;
}
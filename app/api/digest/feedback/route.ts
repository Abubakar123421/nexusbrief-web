import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/route';

export async function POST(req: Request) {
  const { user, supabase, errorResponse } = await requireUser();
  if (errorResponse) return errorResponse;

  const { itemId, rating, reason } = await req.json();
  if (!itemId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // Upsert feedback (delete + insert)
  await supabase.from('feedbacks').delete().eq('item_id', itemId).eq('user_id', user.id);
  const { error } = await supabase.from('feedbacks').insert({
    item_id: itemId,
    user_id: user.id,
    rating,
    reason: reason ?? '',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Action = 'hide' | 'unhide' | 'list_hidden'
type Payload = {
  token?: string
  action?: Action
  post_id?: string
  game?: string
  class?: string
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405)

  let body: Payload
  try { body = await req.json() } catch { return json({ ok: false, error: 'INVALID_JSON' }, 400) }

  const expected = Deno.env.get('WALL_MODERATOR_TOKEN') || ''
  if (!expected || body.token !== expected) return json({ ok: false, error: 'UNAUTHORIZED' }, 401)

  const url = Deno.env.get('SUPABASE_URL') || ''
  // 새 sb_secret_ 키를 WALL_SUPABASE_SECRET_KEY로 주입하는 방식을 우선한다.
  // 레거시 프로젝트라면 SUPABASE_SERVICE_ROLE_KEY를 폴백으로 사용할 수 있다.
  const secret = Deno.env.get('WALL_SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!url || !secret) return json({ ok: false, error: 'SERVER_SECRET_MISSING' }, 500)

  const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const action = body.action

  if (action === 'list_hidden') {
    if (!body.game || !body.class) return json({ ok: false, error: 'GAME_AND_CLASS_REQUIRED' }, 400)
    const { data, error } = await supabase
      .from('wall_posts')
      .select('id,created_at,game,class,content,hidden')
      .eq('hidden', true)
      .eq('game', body.game)
      .eq('class', body.class)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) return json({ ok: false, error: 'DB_ERROR', detail: error.message }, 500)
    return json({ ok: true, posts: data || [] })
  }

  if (action === 'hide' || action === 'unhide') {
    if (!body.post_id) return json({ ok: false, error: 'POST_ID_REQUIRED' }, 400)
    let q = supabase.from('wall_posts').update({ hidden: action === 'hide' }).eq('id', body.post_id)
    if (body.game) q = q.eq('game', body.game)
    if (body.class) q = q.eq('class', body.class)
    const { data, error } = await q.select('id,hidden').maybeSingle()
    if (error) return json({ ok: false, error: 'DB_ERROR', detail: error.message }, 500)
    if (!data) return json({ ok: false, error: 'NOT_FOUND' }, 404)
    return json({ ok: true, post: data })
  }

  return json({ ok: false, error: 'INVALID_ACTION' }, 400)
})

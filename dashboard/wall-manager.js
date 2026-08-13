/* geunal1945 wall manager panel — paste/import into teacher dashboard only */
(function(){
  'use strict';
  const GAME='geunal1945';
  const TOKEN_KEY='wallModeratorToken';
  const FALLBACK_CONFIG={
    supabaseUrl:'https://xgniwztlrakkrbzcfklb.supabase.co',
    supabasePublishableKey: 'sb_publishable_mYZObIGh4nOLKqfnjXHsow_eIARb5U9'
  };

  function cfg(){return window.GEUNAL_WALL_CONFIG||window.CHARLIE_CONFIG||FALLBACK_CONFIG}
  function publicHeaders(){const key=cfg().supabasePublishableKey||'';const h={apikey:key};if(key.startsWith('eyJ'))h.Authorization=`Bearer ${key}`;return h}
  function css(){
    if(document.getElementById('wall-manager-style'))return;
    const s=document.createElement('style');s.id='wall-manager-style';s.textContent=`
    .wm{font-family:inherit;color:var(--text,#e8dcc8)}.wm h2,.wm h3{font-family:var(--font-serif,serif);color:var(--gold-lt,#e8c97a)}.wm>p{color:var(--text-muted,#9a8e7a);margin:.5rem 0}.wm-controls{display:grid;grid-template-columns:1fr auto auto;gap:8px;margin:12px 0}.wm input{min-width:0;padding:9px;border:1px solid var(--gold-line,rgba(201,160,82,.25));background:var(--ink-card,#1e2430);color:var(--text,#e8dcc8)}.wm button{padding:9px 12px;cursor:pointer;border:1px solid var(--gold-line,rgba(201,160,82,.25));background:var(--gold-dim,rgba(201,160,82,.15));color:var(--gold-lt,#e8c97a)}.wm button:disabled{opacity:.5;cursor:wait}.wm-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px}.wm-card{border:1px solid var(--gold-line,rgba(201,160,82,.25));padding:12px;background:var(--ink-card,#1e2430)}.wm-row{border-top:1px solid var(--gold-line,rgba(201,160,82,.25));padding:10px 0}.wm-row:first-child{border-top:0}.wm-content{white-space:pre-wrap;word-break:break-word;margin-bottom:7px}.wm-meta{font-size:11px;color:var(--text-muted,#9a8e7a);margin-bottom:6px}.wm-empty{color:var(--text-muted,#9a8e7a);padding:14px 0}#wm-status{color:var(--text-muted,#9a8e7a);font-size:.85rem}@media(max-width:720px){.wm-grid{grid-template-columns:1fr}.wm-controls{grid-template-columns:1fr}}`;
    document.head.appendChild(s)
  }
  function token(){let t=sessionStorage.getItem(TOKEN_KEY)||'';if(!t){t=prompt('벽보 관리 토큰을 입력하세요.')||'';if(t)sessionStorage.setItem(TOKEN_KEY,t)}return t}
  async function invoke(body){const c=cfg();if(!c.supabaseUrl)throw new Error('CHARLIE_CONFIG.supabaseUrl 없음');const t=token();if(!t)throw new Error('토큰 없음');const r=await fetch(`${c.supabaseUrl}/functions/v1/wall-moderate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,token:t})});const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||`HTTP ${r.status}`);return j}
  async function visible(cls){const c=cfg();if(!c.supabaseUrl||!c.supabasePublishableKey||c.supabasePublishableKey.startsWith('__'))throw new Error('공통 Supabase 설정 없음');const u=`${c.supabaseUrl}/rest/v1/wall_posts?select=id,created_at,content,hidden&game=eq.${GAME}&class=eq.${encodeURIComponent(cls)}&hidden=eq.false&order=created_at.desc&limit=200`;const r=await fetch(u,{headers:publicHeaders()});if(!r.ok)throw new Error(`visible HTTP ${r.status}`);return r.json()}
  function row(p,hidden,cls){const d=document.createElement('div');d.className='wm-row';const c=document.createElement('div');c.className='wm-content';c.textContent=p.content||'';d.appendChild(c);const m=document.createElement('div');m.className='wm-meta';m.textContent=new Date(p.created_at).toLocaleString('ko-KR');d.appendChild(m);const b=document.createElement('button');b.textContent=hidden?'복원':'숨김';b.onclick=async()=>{b.disabled=true;try{await invoke({action:hidden?'unhide':'hide',post_id:p.id,game:GAME,class:cls});await load()}catch(e){alert(e.message)}finally{b.disabled=false}};d.appendChild(b);return d}
  let root, classInput, visibleBox, hiddenBox, status;
  function empty(box,message){const d=document.createElement('div');d.className='wm-empty';d.textContent=message;box.appendChild(d)}
  async function load(){const cls=(classInput?.value||'').trim();if(!cls){status.textContent='수업회차 class 코드를 입력하세요.';return}status.textContent='불러오는 중…';try{const [v,h]=await Promise.all([visible(cls),invoke({action:'list_hidden',game:GAME,class:cls})]);visibleBox.textContent='';hiddenBox.textContent='';for(const p of v)visibleBox.appendChild(row(p,false,cls));for(const p of h.posts||[])hiddenBox.appendChild(row(p,true,cls));if(!v.length)empty(visibleBox,'표시 중인 벽보 없음');if(!(h.posts||[]).length)empty(hiddenBox,'숨긴 벽보 없음');status.textContent=`표시 ${v.length} · 숨김 ${(h.posts||[]).length}`;}catch(e){status.textContent=`오류: ${e.message}`}}
  function mount(target){css();root=typeof target==='string'?document.querySelector(target):target;if(!root)throw new Error('wall manager mount target 없음');root.classList.add('wm');root.innerHTML=`<h2>벽보 관리</h2><p>「그날, 아무도 몰랐다」 공개 벽보를 숨기거나 복원합니다.</p><div class="wm-controls"><input id="wm-class" placeholder="반×수업회차별 1회용 class 코드"><button id="wm-load">불러오기</button><button id="wm-token">토큰 다시 입력</button></div><div id="wm-status"></div><div class="wm-grid"><section class="wm-card"><h3>표시 중</h3><div id="wm-visible"></div></section><section class="wm-card"><h3>숨김</h3><div id="wm-hidden"></div></section></div>`;classInput=root.querySelector('#wm-class');visibleBox=root.querySelector('#wm-visible');hiddenBox=root.querySelector('#wm-hidden');status=root.querySelector('#wm-status');root.querySelector('#wm-load').onclick=load;root.querySelector('#wm-token').onclick=()=>{sessionStorage.removeItem(TOKEN_KEY);token()};}
  window.GeunalWallManager={mount,load};
})();

// ===== Kuby: Paint Puzzle — Supabase kayıt eşitleme =====
// Oyun her şeyi telefonda (localStorage) tutar. Bu dosya aynı verileri oyuncunun Supabase kaydına da yazar,
// açılışta buluttaki kayıt daha yeniyse onu geri yükler. Oyuncu hesap açmaz: Supabase "anonim giriş" kullanılır.
(function(){
  const CFG=window.KUBY_SUPABASE||{};
  if(!CFG.url||!CFG.anonKey||!window.supabase){console.info('[kayıt] Supabase ayarı yok, yalnızca cihazda saklanıyor');return}
  const KEYS=['tirtil-progress','tirtil-coins','tirtil-inv','tirtil-gifts','tirtil-seen','tirtil-look','tirtil-daily','tirtil-lives','tirtil-set','tirtil-sound','tirtil-howto'];
  const STAMP='kuby-saved-at';
  const sb=window.supabase.createClient(CFG.url,CFG.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
  let uid=null,timer=null,ready=false,last='';
  const snapshot=()=>{const d={};KEYS.forEach(k=>{try{const v=localStorage.getItem(k);if(v!==null)d[k]=v}catch(e){}});return d};
  async function push(){if(!uid)return;const snap=snapshot(),js=JSON.stringify(snap);if(js===last)return;last=js;const now=new Date().toISOString();
    const {error}=await sb.from('saves').upsert({user_id:uid,data:snap,updated_at:now});if(error)last='';
    if(error)console.warn('[kayıt] yazılamadı',error.message);else try{localStorage.setItem(STAMP,now)}catch(e){}}
  // en fazla 2 saniyede bir yazılır; değişmeyen kayıt hiç gönderilmez
  const schedule=()=>{if(!ready||timer)return;timer=setTimeout(()=>{timer=null;push()},2000)};
  // oyun bir şey kaydettiğinde buluta da gönder (kısa bir bekleme ile toplu)
  const orig=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){orig.call(this,k,v);if(this===localStorage&&KEYS.includes(k))schedule()};
  window.addEventListener('pagehide',()=>{if(ready){clearTimeout(timer);timer=null;push()}});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&ready){clearTimeout(timer);timer=null;push()}});
  (async()=>{
    let {data:{session}}=await sb.auth.getSession();
    if(!session){const r=await sb.auth.signInAnonymously();if(r.error){console.warn('[kayıt] giriş olmadı',r.error.message);return}session=r.data.session}
    uid=session.user.id;
    const {data,error}=await sb.from('saves').select('data,updated_at').eq('user_id',uid).maybeSingle();
    if(error){console.warn('[kayıt] okunamadı',error.message);ready=true;return}
    let local=null;try{local=localStorage.getItem(STAMP)}catch(e){}
    if(data&&(!local||data.updated_at>local)&&data.data&&Object.keys(data.data).length){
      // buluttaki kayıt daha yeni: telefona yaz ve oyunu bir kez yeniden aç
      Object.entries(data.data).forEach(([k,v])=>{try{orig.call(localStorage,k,v)}catch(e){}});
      try{orig.call(localStorage,STAMP,data.updated_at)}catch(e){}
      if(!sessionStorage.getItem('kuby-restored')){sessionStorage.setItem('kuby-restored','1');location.reload();return}
    }
    ready=true;if(!data)push()})();
})();

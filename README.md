# Kuby: Paint Puzzle

Boya tüplerini doğru sırayla gönderip piksel resimleri boyadığın, 50 bölümlük bir bulmaca oyunu. Tek bir HTML dosyası; derleme gerekmez.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Oyunun tamamı (görseller, sesler, bölümler içinde) |
| `config.js` | Supabase adresi ve herkese açık anahtar |
| `sync.js` | Oyuncu ilerlemesini Supabase'e kaydeder ve geri yükler |
| `supabase/schema.sql` | Veritabanı tablosu ve güvenlik kuralları |

## Kayıt nasıl çalışıyor

- Oyun her şeyi önce telefonda (localStorage) tutar; internet yokken de oynanır.
- `sync.js`, oyuncuyu Supabase'e **anonim** olarak giriş yaptırır (hesap açmak gerekmez) ve ilerlemeyi `saves` tablosuna yazar: yıldızlar, açılan bölüm, altın, güçler, kıyafetler, günlük hediye, canlar, ayarlar.
- Açılışta buluttaki kayıt telefondakinden yeniyse onu geri yükler.
- Değişiklikler en fazla 2 saniyede bir, yalnızca bir şey değiştiyse gönderilir.

Not: Anonim giriş o cihaza bağlıdır. Oyuncu uygulamayı silerse ya da telefon değiştirirse kaydına dönemez. Cihazlar arası taşıma için ileride Apple / Google / e-posta ile giriş eklenmeli.

## Kurulum

1. [supabase.com](https://supabase.com) üzerinde bir proje aç.
2. **SQL Editor**'de `supabase/schema.sql` dosyasının içeriğini çalıştır.
3. **Authentication → Sign In / Providers** bölümünde **Allow anonymous sign-ins** seçeneğini aç.
4. **Project Settings → API** sayfasından *Project URL* ve *anon public* anahtarını `config.js` içine yaz.
5. Dosyaları herhangi bir statik barındırmaya koy (GitHub Pages, Netlify, Vercel). `index.html`'i doğrudan bilgisayardan açmak da çalışır.

## GitHub Pages ile yayınlama

Depo ayarlarında **Settings → Pages → Branch: main / root** seç. Birkaç dakika sonra oyun `https://<kullanıcı>.github.io/<depo>/` adresinde açılır.

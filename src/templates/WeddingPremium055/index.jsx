import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Calendar, MapPin, Music, VolumeX, Copy, Check, 
  Send, Users, Image as ImageIcon, Gift, Clock 
} from 'lucide-react';

export default function WeddingPremium055({ data, onSendWish }) {
  // Ambil nama tamu dari URL query: ?to=Nama+Tamu
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Audio reference
  const audioRef = useRef(null);

  // Form Ucapan & RSVP
  const [wisherName, setWisherName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [attendance, setAttendance] = useState('hadir');
  const [wishesList, setWishesList] = useState(data?.wishes || []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
      setWisherName(to);
    }
  }, []);

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(data?.event_date || '2026-12-12T08:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.event_date]);

  // Handle Buka Undangan & Play Audio
  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Autoplay dicegah oleh browser:', err);
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleSubmitWish = (e) => {
    e.preventDefault();
    if (!wisherName.trim() || !wishMessage.trim()) return;

    const newWish = {
      name: wisherName,
      message: wishMessage,
      attendance: attendance,
      created_at: new Date().toISOString()
    };

    setWishesList([newWish, ...wishesList]);
    if (onSendWish) onSendWish(newWish);
    setWishMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans relative selection:bg-rose-200">
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={data?.music_url || 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3'} 
        loop 
      />

      {/* ================= 1. COVER / SPLASH SCREEN MODAL ================= */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6 bg-gradient-to-b from-stone-900/90 via-stone-900/80 to-stone-900 text-white text-center">
          <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-40 blur-xs" 
               style={{ backgroundImage: `url(${data?.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'})` }} 
          />
          
          <div className="space-y-2 animate-fade-in">
            <p className="text-sm tracking-widest uppercase text-stone-300">The Wedding Of</p>
            <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide text-rose-200">
              {data?.groom_short_name || 'Hamzah'} & {data?.bride_short_name || 'Anissa'}
            </h1>
          </div>

          <div className="space-y-4 max-w-sm w-full bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <p className="text-xs uppercase tracking-wider text-stone-300">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <h2 className="text-2xl font-semibold text-white capitalize">{guestName}</h2>
            <p className="text-xs text-stone-300 italic">
              Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </p>
            
            <button
              onClick={handleOpenInvitation}
              className="w-full mt-4 py-3.5 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/30 transition-all duration-300 group cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>Buka Undangan</span>
            </button>
          </div>

          <p className="text-xs text-stone-400">Toko Undangan Digital</p>
        </div>
      )}

      {/* ================= 2. TOMBOL MUSIK MENGAMBANG ================= */}
      {isOpened && (
        <button
          onClick={toggleMusic}
          className={`fixed top-5 right-5 z-40 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-stone-200 text-stone-700 transition-all ${
            isPlaying ? 'animate-spin' : 'opacity-80'
          }`}
          style={{ animationDuration: '6s' }}
          title={isPlaying ? 'Pause Musik' : 'Putar Musik'}
        >
          {isPlaying ? <Music className="w-5 h-5 text-rose-600" /> : <VolumeX className="w-5 h-5 text-stone-500" />}
        </button>
      )}

      {/* ================= 3. FLOATING BOTTOM NAVIGATION ================= */}
      {isOpened && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-2xl rounded-full px-4 py-2 flex items-center gap-4 text-xs font-medium text-stone-600">
          <a href="#mempelai" className="hover:text-rose-600 transition-colors">Mempelai</a>
          <a href="#acara" className="hover:text-rose-600 transition-colors">Acara</a>
          <a href="#galeri" className="hover:text-rose-600 transition-colors">Galeri</a>
          <a href="#amplop" className="hover:text-rose-600 transition-colors">Kado</a>
          <a href="#ucapan" className="hover:text-rose-600 transition-colors">Ucapan</a>
        </nav>
      )}

      {/* ================= 4. KONTEN UTAMA UNDANGAN ================= */}
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl pb-24 overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative h-[550px] flex flex-col justify-end items-center p-8 text-center text-white bg-cover bg-center"
                 style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url(${data?.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'})` }}>
          <p className="text-xs uppercase tracking-widest text-stone-300 mb-2">Walimatul 'Ursy</p>
          <h2 className="font-serif text-4xl font-light text-rose-200 mb-2">
            {data?.groom_short_name || 'Hamzah'} & {data?.bride_short_name || 'Anissa'}
          </h2>
          <p className="text-sm text-stone-200 mb-6">{data?.event_date_formatted || 'Sabtu, 12 Desember 2026'}</p>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs text-stone-900">
            {[
              { val: timeLeft.days, label: 'Hari' },
              { val: timeLeft.hours, label: 'Jam' },
              { val: timeLeft.minutes, label: 'Menit' },
              { val: timeLeft.seconds, label: 'Detik' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-xl py-2 px-1 text-center shadow-md">
                <span className="block text-xl font-bold text-rose-700">{item.val}</span>
                <span className="text-[10px] uppercase text-stone-600">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ayat / Quote Section */}
        <section className="py-12 px-8 text-center bg-stone-50 border-b border-stone-100">
          <Heart className="w-6 h-6 mx-auto mb-4 text-rose-500" />
          <p className="font-serif italic text-sm text-stone-600 leading-relaxed mb-4">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
          </p>
          <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase">(QS. Ar-Rum: 21)</span>
        </section>

        {/* Mempelai Section */}
        <section id="mempelai" className="py-14 px-6 text-center space-y-12">
          <div>
            <h3 className="font-serif text-3xl text-rose-800 font-light mb-2">Pasangan Mempelai</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami:
            </p>
          </div>

          {/* Mempelai Pria */}
          <div className="space-y-4">
            <img 
              src={data?.groom_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'} 
              alt="Mempelai Pria"
              className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-rose-100 shadow-lg"
            />
            <h4 className="font-serif text-2xl font-medium text-stone-900">{data?.groom_name || 'Hamzah Yusuf, S.Kom'}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {data?.groom_parents || 'Putra dari Bapak H. Yusuf & Ibu Hj. Siti Maryam'}
            </p>
          </div>

          <div className="font-serif text-2xl text-rose-400">&</div>

          {/* Mempelai Wanita */}
          <div className="space-y-4">
            <img 
              src={data?.bride_photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'} 
              alt="Mempelai Wanita"
              className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-rose-100 shadow-lg"
            />
            <h4 className="font-serif text-2xl font-medium text-stone-900">{data?.bride_name || 'Anissa Maryam, S.Farm'}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {data?.bride_parents || 'Putri dari Bapak H. Ahmad Subarjo & Ibu Hj. Fatimah'}
            </p>
          </div>
        </section>

        {/* Acara Section */}
        <section id="acara" className="py-14 px-6 bg-rose-50/50 space-y-8">
          <div className="text-center">
            <h3 className="font-serif text-3xl text-rose-900 font-light mb-1">Rangkaian Acara</h3>
            <p className="text-xs text-stone-500">Waktu & Tempat Pelaksanaan</p>
          </div>

          {/* Akad */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100/60 text-center space-y-3">
            <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">Akad Nikah</span>
            <p className="text-stone-800 font-medium">Sabtu, 12 Desember 2026</p>
            <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 08:00 WIB - Selesai
            </p>
            <p className="text-sm font-semibold text-stone-800 mt-2">Masjid Agung Al-Falah</p>
            <p className="text-xs text-stone-500">Jl. Pangeran Diponegoro No. 15, Surabaya</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 py-2 px-4 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
            </a>
          </div>

          {/* Resepsi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100/60 text-center space-y-3">
            <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">Resepsi Pernikahan</span>
            <p className="text-stone-800 font-medium">Sabtu, 12 Desember 2026</p>
            <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 11:00 - 14:00 WIB
            </p>
            <p className="text-sm font-semibold text-stone-800 mt-2">Grand Ballroom Hotel Harmoni</p>
            <p className="text-xs text-stone-500">Jl. Jenderal Sudirman Kav. 22, Surabaya</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 py-2 px-4 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
            </a>
          </div>
        </section>

        {/* Galeri Section */}
        <section id="galeri" className="py-14 px-6 space-y-6">
          <div className="text-center">
            <h3 className="font-serif text-3xl text-rose-900 font-light mb-1">Momen Bahagia</h3>
            <p className="text-xs text-stone-500">Galeri Foto Prewedding</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
            ].map((imgUrl, i) => (
              <img 
                key={i} 
                src={imgUrl} 
                alt={`Galeri ${i + 1}`} 
                className="w-full h-40 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        </section>

        {/* Amplop Digital / Gift Section */}
        <section id="amplop" className="py-14 px-6 bg-stone-50 space-y-6 text-center">
          <div>
            <Gift className="w-7 h-7 mx-auto mb-2 text-rose-600" />
            <h3 className="font-serif text-3xl text-rose-900 font-light mb-1">Tanda Kasih</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberikan tanda kasih:
            </p>
          </div>

          <div className="space-y-4 max-w-xs mx-auto">
            {/* Rekening 1 */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-left relative">
              <span className="text-xs font-bold text-blue-700 block mb-1">BANK BCA</span>
              <p className="text-lg font-mono font-bold tracking-wider text-stone-800">1234567890</p>
              <p className="text-xs text-stone-500 mb-3">a.n. Hamzah Yusuf</p>
              <button
                onClick={() => handleCopy('1234567890', 1)}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Tersalin ke Clipboard!' : 'Salin Nomor Rekening'}</span>
              </button>
            </div>

            {/* Rekening 2 */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-left relative">
              <span className="text-xs font-bold text-amber-700 block mb-1">BANK MANDIRI</span>
              <p className="text-lg font-mono font-bold tracking-wider text-stone-800">9876543210123</p>
              <p className="text-xs text-stone-500 mb-3">a.n. Anissa Maryam</p>
              <button
                onClick={() => handleCopy('9876543210123', 2)}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'Tersalin ke Clipboard!' : 'Salin Nomor Rekening'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Buku Tamu & Ucapan Section */}
        <section id="ucapan" className="py-14 px-6 space-y-6">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-rose-600" />
            <h3 className="font-serif text-3xl text-rose-900 font-light mb-1">Ucapan & Doa</h3>
            <p className="text-xs text-stone-500">Kirimkan doa dan konfirmasi kehadiran Anda</p>
          </div>

          <form onSubmit={handleSubmitWish} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Nama Anda</label>
              <input
                type="text"
                value={wisherName}
                onChange={(e) => setWisherName(e.target.value)}
                required
                placeholder="Nama lengkap"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Konfirmasi Kehadiran</label>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-rose-500"
              >
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
                <option value="ragu">Masih Ragu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Ucapan & Doa Restu</label>
              <textarea
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                required
                rows={3}
                placeholder="Tulis ucapan selamat dan doa untuk mempelai..."
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Ucapan</span>
            </button>
          </form>

          {/* Daftar Ucapan Tamu */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {wishesList.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-6">Belum ada ucapan. Jadilah yang pertama!</p>
            ) : (
              wishesList.map((w, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-stone-100 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">{w.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      w.attendance === 'hadir' ? 'bg-emerald-100 text-emerald-700' :
                      w.attendance === 'tidak_hadir' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {w.attendance === 'hadir' ? 'Hadir' : w.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{w.message}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-stone-100 space-y-1 text-xs text-stone-400">
          <p>Terima Kasih</p>
          <p className="font-serif text-stone-700 font-medium">
            {data?.groom_short_name || 'Hamzah'} & {data?.bride_short_name || 'Anissa'}
          </p>
          <p className="text-[10px] pt-4">Dibuat dengan ❤️ di Toko Undangan Digital</p>
        </footer>

      </main>
    </div>
  );
}

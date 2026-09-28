
import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   TEMPLATE: WeddingPremium055 (Sage Green & Gold)
   Props dari PublicInvitation:
   data / invitation, guestName, wishes, onRsvpSubmit
   ========================================================= */

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const DEFAULT_EVENTS = [
  {
    title: "Akad Nikah",
    date: "2026-10-23",
    start_time: "09:00",
    end_time: "",
    location_name: "Rumah Dina",
    address: "",
    map_url: "",
  },
  {
    title: "Resepsi",
    date: "2026-10-23",
    start_time: "19:00",
    end_time: "",
    location_name: "Rumah Dina",
    address: "Jl Utama, Kludan, Tanggulangin, Kabupaten Sidoarjo",
    map_url: "https://maps.app.goo.gl/u3jFPLhv3hRiqeCo8",
  },
];

const DEFAULT_BANKS = [
  { bank_name: "BCA", account_number: "6155574805", account_holder: "NUR AYU MAULIDINA" },
];

const DEFAULT_GALLERY = [
  "/galeri1.jpg",
  "/bg-hero.jpg",
  "/sampul.jpg",
  "/galeri2.jpg",
  "/galeri3.jpg",
  "/galeri4.jpg",
  "/galeri5.jpg",
];

const GALLERY_LAYOUT = [
  { wrap: "col-span-2 h-60", anim: "reveal-up" },
  { wrap: "h-60", anim: "reveal-left" },
  { wrap: "h-60", anim: "reveal-right" },
  { wrap: "h-60", anim: "reveal-left" },
  { wrap: "h-60", anim: "reveal-right" },
  { wrap: "col-span-2 h-60", anim: "reveal-up" },
  { wrap: "col-span-2 h-[22rem]", anim: "reveal-up" },
];

const TAILWIND_CONFIG = {
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "#F9F8F6",
          primary: "#566E5D",
          dark: "#2A382E",
          gold: "#C2A366",
          text: "#4A4A4A",
          light: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Montserrat", "sans-serif"],
        script: ["Great Vibes", "cursive"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgba(194, 163, 102, 0.4)",
      },
    },
  },
};

const LEAF_SVGS = [
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="#C2A366"><path d="M12 2C11 7 8 10 3 11C8 12 11 15 12 20C13 15 16 12 21 11C16 10 13 7 12 2Z"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="#78937F"><path d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C18 8.6 17.6 8.2 17 8Z"/></svg>`,
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="#E2C788"><path d="M12 3C11 8 7 11 2 12C7 13 11 16 12 21C13 16 17 13 22 12C17 11 13 8 12 3Z"/></svg>`,
];

const CSS = `
.wp055-root { overflow-x: hidden; background-color: #1a231c; color: #4A4A4A; }
.wp055-root .section-wrapper { width:100%; position:relative; background-attachment:fixed; background-position:center; background-size:cover; background-repeat:no-repeat; }
.wp055-root .content-container { max-width:500px; margin:0 auto; position:relative; z-index:10; }
.wp055-root .arch-frame { border-radius: 999px 999px 0 0; }

@keyframes wp055-spin-slow { 100% { transform: rotate(360deg); } }
.wp055-root .animate-spin-slow { animation: wp055-spin-slow 8s linear infinite; }
@keyframes wp055-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.wp055-root .animate-float { animation: wp055-float 4s ease-in-out infinite; }
@keyframes wp055-pulse-ring {
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(194,163,102,0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(194,163,102,0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(194,163,102,0); }
}
.wp055-root .btn-pulse { animation: wp055-pulse-ring 2s infinite; }
.wp055-root .no-scrollbar::-webkit-scrollbar { display: none; }
.wp055-root .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.wp055-root .reveal-up, .wp055-root .reveal-left, .wp055-root .reveal-right {
  opacity: 0; filter: blur(4px); will-change: opacity, transform, filter;
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), filter .9s cubic-bezier(.16,1,.3,1);
}
.wp055-root .reveal-up { transform: translateY(45px) scale(.96); }
.wp055-root .reveal-left { transform: translateX(-80px) scale(.95); }
.wp055-root .reveal-right { transform: translateX(80px) scale(.95); }
.wp055-root .reveal-up.active, .wp055-root .reveal-left.active, .wp055-root .reveal-right.active {
  opacity: 1; transform: none; filter: blur(0);
}

@keyframes wp055-flowerTL { 0%,100% { transform: rotate(0) scale(1) translateY(0); } 50% { transform: rotate(6deg) scale(1.08) translateY(4px); } }
.wp055-root .animate-flower-tl { animation: wp055-flowerTL 5.5s ease-in-out infinite; }
@keyframes wp055-flowerBR { 0%,100% { transform: rotate(0) scale(1) translateY(0); } 50% { transform: rotate(-6deg) scale(1.08) translateY(-4px); } }
.wp055-root .animate-flower-br { animation: wp055-flowerBR 6s ease-in-out infinite; }

@keyframes wp055-sway { 0%,100% { transform: rotate(-8deg) translateY(0) scale(1); } 50% { transform: rotate(14deg) translateY(-10px) scale(1.08); } }
.wp055-root .animate-sway-leaf { animation: wp055-sway 4.5s ease-in-out infinite; }
@keyframes wp055-swayRev { 0%,100% { transform: rotate(12deg) translateY(0) scale(1); } 50% { transform: rotate(-10deg) translateY(-12px) scale(1.1); } }
.wp055-root .animate-sway-leaf-reverse { animation: wp055-swayRev 5.5s ease-in-out infinite; }

.wp055-root .glass { background: rgba(255,255,255,.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.6); }
.wp055-root .glass-dark { background: rgba(42,56,46,.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(194,163,102,.3); }

@keyframes wp055-galleryZoom { 0% { transform: scale(1); } 50% { transform: scale(1.12); } 100% { transform: scale(1); } }
.wp055-root .gallery-img-animated { animation: wp055-galleryZoom 7s ease-in-out infinite; transition: filter .3s ease; }
.wp055-root .gallery-item:nth-child(1) .gallery-img-animated { animation-delay: 0s; }
.wp055-root .gallery-item:nth-child(2) .gallery-img-animated { animation-delay: 1.5s; }
.wp055-root .gallery-item:nth-child(3) .gallery-img-animated { animation-delay: 3s; }
.wp055-root .gallery-item:nth-child(4) .gallery-img-animated { animation-delay: 4.5s; }
.wp055-root .gallery-item:nth-child(5) .gallery-img-animated { animation-delay: 2s; }

.wp055-leaf-container { position: fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:90; overflow:hidden; }
.wp055-falling-leaf { position:absolute; top:-40px; pointer-events:none; opacity:.8; animation-name: wp055-fall; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes wp055-fall {
  0% { top:-40px; transform: translateX(0) rotate(0); opacity:0; }
  10% { opacity:.9; }
  90% { opacity:.8; }
  100% { top:105vh; transform: translateX(120px) rotate(360deg); opacity:0; }
}
`;

/* ---------- helpers ---------- */
function parseDate(v) {
  if (!v) return null;
  const s = String(v);
  const d = new Date(s.length === 10 ? `${s}T00:00:00` : s);
  return isNaN(d.getTime()) ? null : d;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function loadExternalAssets() {
  if (typeof document === "undefined") return;

  if (!document.getElementById("wp055-fonts")) {
    const link = document.createElement("link");
    link.id = "wp055-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }

  if (!document.getElementById("wp055-phosphor")) {
    const s = document.createElement("script");
    s.id = "wp055-phosphor";
    s.src = "https://unpkg.com/@phosphor-icons/web";
    document.head.appendChild(s);
  }

  if (!document.getElementById("wp055-tailwind")) {
    window.tailwind = window.tailwind || {};
    window.tailwind.config = TAILWIND_CONFIG;
    const s = document.createElement("script");
    s.id = "wp055-tailwind";
    s.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(s);
  }
}

function CornerFlower({ rotate }) {
  const body = (
    <>
      <path d="M0 0C40 10 70 30 90 70C70 50 40 40 0 0Z" fill="#78937F" opacity="0.8" />
      <path d="M0 0C25 45 50 85 110 100C80 75 50 50 0 0Z" fill="#566E5D" opacity="0.9" />
      <path d="M20 0C45 30 80 50 130 60C90 45 55 25 20 0Z" fill="#C2A366" opacity="0.85" />
      <circle cx="45" cy="45" r="22" fill="#C2A366" opacity="0.9" />
      <circle cx="35" cy="35" r="16" fill="#E2C788" />
      <circle cx="55" cy="35" r="14" fill="#F4E8C1" />
      <circle cx="35" cy="55" r="14" fill="#D4B675" />
      <circle cx="50" cy="50" r="10" fill="#566E5D" />
      <path d="M0 70C20 65 40 75 50 95C35 85 15 80 0 70Z" fill="#C2A366" />
      <path d="M70 0C65 20 75 40 95 50C85 35 80 15 70 0Z" fill="#78937F" />
    </>
  );
  return (
    <svg
      className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 drop-shadow-xl"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {rotate ? <g transform="rotate(180 80 80)">{body}</g> : body}
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function WeddingPremium055({
  data,
  invitation,
  guestName = "Tamu Undangan",
  wishes = [],
  onRsvpSubmit,
}) {
  const inv = data || invitation || {};

  /* ---------- data dengan fallback ---------- */
  const groomName = inv.groom_name || inv.person_a_name || "Moh Ali Mustofa";
  const brideName = inv.bride_name || inv.person_b_name || "Nur Ayu Maulidina";
  const groomShort = inv.groom_nickname || groomName.split(" ")[0];
  const brideShort = inv.bride_nickname || brideName.split(" ")[0];

  const eventDateRaw = inv.event_date || "2026-10-23T19:00:00";
  const eventDateObj = parseDate(eventDateRaw) || new Date("2026-10-23T19:00:00");
  const heroDateText = `${pad(eventDateObj.getDate())} . ${pad(eventDateObj.getMonth() + 1)} . ${eventDateObj.getFullYear()}`;

  const coverBg = inv.cover_photo_url || "/bg-hero.jpg";
  const heroBg = inv.hero_photo_url || inv.cover_photo_url || "/bg-hero.jpg";
  const sectionBg = inv.background_photo_url || "/sampul.jpg";
  const groomPhoto = inv.groom_photo_url || "/pria.jpg";
  const bridePhoto = inv.bride_photo_url || "/wanita.jpg";
  const musicSrc = inv.music_url || "/bermuara.mp3";

  const quote =
    inv.quote ||
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.";
  const quoteSource = inv.quote_source || "QS. Ar-Rum: 21";

  const events = inv.events && inv.events.length ? inv.events : DEFAULT_EVENTS;
  const banks = inv.banks && inv.banks.length ? inv.banks : DEFAULT_BANKS;
  const galleryPhotos =
    inv.gallery_photos && inv.gallery_photos.length ? inv.gallery_photos : DEFAULT_GALLERY;
  const whatsappNumber = inv.whatsapp_number || "6285806127801";

  const gallery = useMemo(
    () =>
      galleryPhotos.map((p, i) => ({
        src: typeof p === "string" ? p : p.url || p.photo_url,
        ...GALLERY_LAYOUT[i % GALLERY_LAYOUT.length],
      })),
    [galleryPhotos]
  );

  /* ---------- state ---------- */
  const rootRef = useRef(null);
  const leafRef = useRef(null);
  const audioRef = useRef(null);

  const [opened, setOpened] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [toast, setToast] = useState({ show: false, text: "" });
  const [activeSection, setActiveSection] = useState("hero");

  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpCount, setRsvpCount] = useState("1");
  const [wishName, setWishName] = useState(guestName);
  const [wishMessage, setWishMessage] = useState("");
  const [wishList, setWishList] = useState(wishes || []);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setWishName(guestName);
  }, [guestName]);

  useEffect(() => {
    setWishList(wishes || []);
  }, [wishes]);

  /* ---------- load fonts / tailwind / icons ---------- */
  useEffect(() => {
    loadExternalAssets();
  }, []);

  /* ---------- lock scroll sebelum undangan dibuka ---------- */
  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  /* ---------- daun berguguran ---------- */
  useEffect(() => {
    const container = leafRef.current;
    if (!container) return;
    const timers = [];

    const createLeaf = () => {
      const leaf = document.createElement("div");
      leaf.className = "wp055-falling-leaf";
      leaf.innerHTML = LEAF_SVGS[Math.floor(Math.random() * LEAF_SVGS.length)];
      leaf.style.left = Math.random() * 100 + "vw";
      const duration = Math.random() * 5 + 6;
      leaf.style.animationDuration = duration + "s";
      leaf.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(leaf);
      timers.push(setTimeout(() => leaf.remove(), (duration + 2) * 1000));
    };

    const interval = setInterval(createLeaf, 700);
    for (let i = 0; i < 8; i++) timers.push(setTimeout(createLeaf, i * 300));

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
      container.innerHTML = "";
    };
  }, []);

  /* ---------- countdown ---------- */
  useEffect(() => {
    const target = eventDateObj.getTime();
    const tick = () => {
      const gap = target - Date.now();
      if (gap <= 0) return setCountdown({ d: 0, h: 0, m: 0, s: 0 });
      setCountdown({
        d: Math.floor(gap / 86400000),
        h: Math.floor((gap % 86400000) / 3600000),
        m: Math.floor((gap % 3600000) / 60000),
        s: Math.floor((gap % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDateRaw]);

  /* ---------- scroll reveal ---------- */
  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    rootRef.current
      .querySelectorAll(".reveal-up, .reveal-left, .reveal-right")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [gallery.length, events.length, banks.length]);

  /* ---------- nav aktif saat scroll ---------- */
  useEffect(() => {
    const onScroll = () => {
      if (!rootRef.current) return;
      let current = "hero";
      rootRef.current.querySelectorAll("section[id]").forEach((sec) => {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= top - 180) current = sec.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- handlers ---------- */
  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  };

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setCoverGone(true), 1000);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      showToast("Berhasil Disalin!");
    } catch {
      showToast("Gagal menyalin");
    }
  };

  const handleRsvpWhatsApp = (e) => {
    e.preventDefault();
    const text = `Halo, Saya *${guestName}* mengonfirmasi kehadiran: *${rsvpStatus}* (${rsvpCount} orang) pada acara pernikahan ${groomShort} & ${brideShort}.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleWishSubmit = async (e) => {
    e.preventDefault();
    const name = wishName.trim();
    const message = wishMessage.trim();
    if (!name || !message || sending) return;

    const tempId = `tmp-${Date.now()}`;
    setSending(true);
    setWishList((prev) => [
      { id: tempId, name, message, presence: "hadir", created_at: new Date().toISOString() },
      ...prev,
    ]);
    setWishMessage("");

    try {
      if (onRsvpSubmit) {
        await onRsvpSubmit({ name, message, wish: message, presence: "hadir" });
      }
      showToast("Ucapan terkirim!");
    } catch (err) {
      setWishList((prev) => prev.filter((w) => w.id !== tempId));
      setWishMessage(message);
      showToast("Gagal mengirim ucapan");
    } finally {
      setSending(false);
    }
  };

  const formatWishTime = (v) => {
    const d = parseDate(v);
    if (!d) return "Baru saja";
    return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
  };

  const navClass = (id) =>
    `nav-item flex flex-col items-center gap-1 transition-colors p-1 hover:text-theme-gold ${
      activeSection === id ? "text-theme-gold" : "text-white"
    }`;

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div ref={rootRef} className="wp055-root font-sans antialiased selection:bg-theme-gold selection:text-white">
      <style>{CSS}</style>

      {/* Daun berguguran */}
      <div ref={leafRef} className="wp055-leaf-container" />

      {/* Ornamen pojok */}
      <div className="fixed top-0 left-0 z-30 pointer-events-none animate-flower-tl origin-top-left opacity-90">
        <CornerFlower />
      </div>
      <div className="fixed bottom-0 right-0 z-30 pointer-events-none animate-flower-br origin-bottom-right opacity-90">
        <CornerFlower rotate />
      </div>

      {/* 1. COVER */}
      {!coverGone && (
        <div
          className="fixed inset-0 z-[100] flex justify-center items-center bg-[#1a231c]"
          style={{
            transition: "all 1s ease-in-out",
            transform: opened ? "translateY(-100vh)" : "translateY(0)",
          }}
        >
          <div
            className="w-full h-full flex flex-col justify-between items-center py-12 px-6 bg-cover bg-center relative"
            style={{ backgroundImage: `url('${coverBg}')` }}
          >
            <div className="absolute inset-0 bg-theme-dark/70 backdrop-blur-[2px]" />

            <div className="relative z-10 text-center w-full mt-10">
              <p className="text-xs uppercase tracking-[0.3em] text-theme-gold mb-4 font-semibold">The Wedding Of</p>
              <h1 className="font-script text-6xl md:text-7xl text-white mb-2 leading-tight drop-shadow-md">
                {groomShort} <br />
                <span className="text-theme-gold text-5xl">&amp;</span>
                <br /> {brideShort}
              </h1>
            </div>

            <div className="relative z-10 w-full max-w-[320px] text-center glass rounded-2xl p-6 animate-float mt-auto mb-10 shadow-glow">
              <p className="text-xs text-theme-dark uppercase tracking-widest mb-1 font-semibold">Kepada Yth.</p>
              <p className="text-[10px] text-theme-dark/70 mb-2">Bapak/Ibu/Saudara/i</p>
              <div className="font-serif text-2xl font-bold text-theme-primary capitalize mb-6 border-b border-theme-gold/40 pb-3">
                {guestName}
              </div>
              <button
                onClick={handleOpen}
                className="w-full py-3 px-6 bg-theme-primary hover:bg-theme-dark text-white rounded-full font-medium text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 btn-pulse shadow-lg cursor-pointer"
              >
                <i className="ph-fill ph-envelope-open text-theme-gold text-lg" />
                Buka Undangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="w-full">
        {/* Music button */}
        <button
          onClick={toggleMusic}
          className="fixed bottom-24 right-5 z-50 w-11 h-11 rounded-full bg-theme-gold text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 border-2 border-white/50 cursor-pointer"
        >
          <i className={`ph-fill ph-music-notes text-xl ${isPlaying ? "animate-spin-slow" : ""}`} />
        </button>
        <audio ref={audioRef} loop preload="auto" src={musicSrc} />

        {/* Bottom nav */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[420px] bg-transparent rounded-full py-2.5 px-6 shadow-none flex items-center justify-between border border-white/30">
          <a href="#hero" className={navClass("hero")}>
            <i className="ph ph-house text-xl" />
            <span className="text-[8px] uppercase tracking-wider font-semibold">Home</span>
          </a>
          <a href="#couple" className={navClass("couple")}>
            <i className="ph ph-heart text-xl" />
            <span className="text-[8px] uppercase tracking-wider font-semibold">Mempelai</span>
          </a>
          <a href="#events" className={navClass("events")}>
            <i className="ph ph-calendar-check text-xl" />
            <span className="text-[8px] uppercase tracking-wider font-semibold">Acara</span>
          </a>
          <a href="#gallery" className={navClass("gallery")}>
            <i className="ph ph-image text-xl" />
            <span className="text-[8px] uppercase tracking-wider font-semibold">Galeri</span>
          </a>
          <a href="#rsvp" className={navClass("rsvp")}>
            <i className="ph ph-chat-teardrop-text text-xl" />
            <span className="text-[8px] uppercase tracking-wider font-semibold">Ucapan</span>
          </a>
        </nav>

        {/* ===== BLOK 1: HERO -> QUOTE -> MEMPELAI ===== */}
        <div className="section-wrapper" style={{ backgroundImage: `url('${heroBg}')` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-theme-dark/70 via-theme-dark/60 to-theme-dark/85 backdrop-blur-[1px]" />

          <div className="content-container py-6">
            {/* HERO */}
            <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center text-white relative px-6 py-12">
              <svg className="w-28 h-28 text-theme-gold opacity-60 mb-4 reveal-up" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C60 25 75 40 100 50 C75 60 60 75 50 100 C40 75 25 60 0 50 C25 40 40 25 50 0 Z" />
              </svg>

              <p className="text-xs uppercase tracking-[0.4em] text-theme-gold mb-3 font-semibold reveal-up">PERNIKAHAN</p>
              <h1 className="font-script text-6xl md:text-7xl mb-4 drop-shadow-lg text-white reveal-up">
                {groomShort} <span className="text-4xl text-theme-gold">&amp;</span> {brideShort}
              </h1>
              <p className="font-serif italic text-lg text-gray-200 mb-8 border-t border-b border-theme-gold/40 inline-block py-2 px-8 reveal-up">
                {heroDateText}
              </p>

              <div className="w-full max-w-[340px] mx-auto glass p-5 rounded-2xl border border-white/40 shadow-xl text-theme-dark reveal-up">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-center text-theme-primary">Menuju Hari Bahagia</p>
                <div className="flex justify-between items-center gap-2">
                  {[
                    ["d", "Hari"],
                    ["h", "Jam"],
                    ["m", "Menit"],
                    ["s", "Detik"],
                  ].map(([key, label], i) => (
                    <React.Fragment key={key}>
                      {i > 0 && <span className="text-theme-gold font-bold text-lg">:</span>}
                      <div className="flex flex-col items-center bg-white/90 w-[64px] py-2.5 rounded-xl shadow-sm">
                        <span className="font-serif text-2xl font-bold text-theme-primary">{pad(countdown[key])}</span>
                        <span className="text-[8px] uppercase tracking-wider font-semibold text-gray-600">{label}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-12 animate-bounce text-white/80 flex flex-col items-center gap-1 reveal-up">
                <span className="text-[9px] uppercase tracking-widest font-semibold">Scroll Kebawah</span>
                <i className="ph ph-caret-double-down text-lg text-theme-gold" />
              </div>
            </section>

            {/* QUOTE */}
            <section className="py-16 px-6 text-center reveal-up relative">
              <div className="glass-dark p-8 rounded-3xl border border-theme-gold/30 shadow-2xl relative overflow-hidden">
                <i className="ph-fill ph-quotes text-4xl text-theme-gold opacity-60 mb-3 block" />
                <p className="text-xs text-gray-200 font-medium leading-relaxed mb-4 font-serif italic text-center">
                  "{quote}"
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-theme-gold">{quoteSource}</p>
              </div>
            </section>

            {/* COUPLE */}
            <section id="couple" className="py-16 px-6 text-center relative overflow-hidden">
              <div className="absolute top-10 left-2 text-theme-gold/30 animate-sway-leaf pointer-events-none z-0">
                <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C18 8.6 17.6 8.2 17 8Z" /></svg>
              </div>
              <div className="absolute top-1/2 right-2 text-theme-gold/30 animate-sway-leaf-reverse pointer-events-none z-0">
                <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C11 8 7 11 2 12C7 13 11 16 12 21C13 16 17 13 22 12C17 11 13 8 12 3Z" /></svg>
              </div>
              <div className="absolute bottom-12 left-4 text-theme-gold/20 animate-sway-leaf pointer-events-none z-0">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C11 7 8 10 3 11C8 12 11 15 12 20C13 15 16 12 21 11C16 10 13 7 12 2Z" /></svg>
              </div>

              <div className="mb-10 relative z-10 reveal-up">
                <h2 className="font-serif text-3xl font-bold text-white mb-2 tracking-wide">Mempelai</h2>
                <div className="w-16 h-[2px] bg-theme-gold mx-auto" />
              </div>

              <div className="space-y-12 relative z-10">
                <div className="flex flex-col items-center reveal-right">
                  <div className="relative w-52 h-72 mb-6 p-2 border-2 border-theme-gold/60 arch-frame shadow-2xl bg-white/10 backdrop-blur-sm">
                    <img src={groomPhoto} alt={groomName} className="w-full h-full object-cover arch-frame shadow-soft" />
                    <div className="absolute -bottom-4 -right-3 w-12 h-12 bg-theme-dark text-theme-gold rounded-full flex justify-center items-center shadow-lg border border-theme-gold/50 animate-sway-leaf">
                      <i className="ph-fill ph-plant text-2xl" />
                    </div>
                  </div>
                  <h3 className="font-script text-4xl text-theme-gold mb-1">{groomName}</h3>
                </div>

                <div className="font-serif text-5xl text-theme-gold opacity-70 animate-pulse reveal-up">&amp;</div>

                <div className="flex flex-col items-center reveal-left">
                  <div className="relative w-52 h-72 mb-6 p-2 border-2 border-theme-gold/60 arch-frame shadow-2xl bg-white/10 backdrop-blur-sm">
                    <img src={bridePhoto} alt={brideName} className="w-full h-full object-cover arch-frame shadow-soft" />
                    <div className="absolute -bottom-4 -left-3 w-12 h-12 bg-theme-dark text-theme-gold rounded-full flex justify-center items-center shadow-lg border border-theme-gold/50 animate-sway-leaf-reverse">
                      <i className="ph-fill ph-flower-tulip text-2xl" />
                    </div>
                  </div>
                  <h3 className="font-script text-4xl text-theme-gold mb-1">{brideName}</h3>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ===== BLOK 2: ACARA -> GALERI ===== */}
        <div className="section-wrapper" style={{ backgroundImage: `url('${sectionBg}')` }}>
          <div className="absolute inset-0 bg-theme-dark/85 backdrop-blur-sm" />

          <div className="content-container py-6">
            {/* EVENTS */}
            <section id="events" className="py-16 px-6 text-white text-center relative">
              <div className="mb-10 reveal-up">
                <h2 className="font-serif text-3xl font-bold text-theme-gold mb-2 tracking-wide">Rangkaian Acara</h2>
                <div className="w-16 h-[2px] bg-theme-gold mx-auto opacity-70" />
              </div>

              <div className="space-y-6">
                {events.map((ev, i) => {
                  const d = parseDate(ev.date);
                  const left = i % 2 === 0;
                  const mapUrl = ev.map_url || (i === events.length - 1 ? inv.location_map_url : "");
                  const time = ev.start_time
                    ? `${ev.start_time} - ${ev.end_time || "Selesai"}`
                    : "";
                  return (
                    <div
                      key={i}
                      className={`glass-dark p-8 rounded-[2rem] shadow-2xl relative overflow-hidden text-center ${
                        left ? "reveal-left" : "reveal-right"
                      }`}
                    >
                      <div
                        className={`absolute top-0 ${
                          left ? "right-0 rounded-bl-[100px]" : "left-0 rounded-br-[100px]"
                        } w-24 h-24 bg-theme-gold/10`}
                      />
                      <i
                        className={`ph-fill ${
                          i === 0 ? "ph-hands-praying" : "ph-champagne"
                        } text-4xl text-theme-gold mb-3 inline-block`}
                      />
                      <h3 className="font-serif text-2xl font-bold text-white mb-4">{ev.title}</h3>

                      {d && (
                        <div className="flex justify-center items-center gap-4 mb-4 border-y border-theme-gold/30 py-3">
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-theme-gold font-bold">{HARI[d.getDay()]}</p>
                            <p className="font-serif text-3xl font-bold text-white">{d.getDate()}</p>
                          </div>
                          <div className="w-px h-10 bg-theme-gold/30" />
                          <div className="text-left">
                            <p className="text-[10px] uppercase text-theme-gold font-bold">
                              {BULAN[d.getMonth()]} {d.getFullYear()}
                            </p>
                            {time && <p className="text-xs text-gray-200 mt-1">{time}</p>}
                          </div>
                        </div>
                      )}

                      {ev.location_name && <p className="font-bold text-sm text-theme-gold mb-1">{ev.location_name}</p>}
                      {ev.address && (
                        <p className={`text-[11px] text-gray-300 leading-relaxed ${mapUrl ? "mb-6" : ""}`}>{ev.address}</p>
                      )}

                      {mapUrl && (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-theme-gold hover:bg-white text-theme-dark rounded-xl text-[10px] font-bold uppercase tracking-widest transition shadow-lg"
                        >
                          <i className="ph-fill ph-map-pin text-base" /> Buka Google Maps
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* GALLERY */}
            <section id="gallery" className="py-16 px-6 text-center">
              <div className="mb-8 reveal-up">
                <h2 className="font-serif text-3xl font-bold text-white mb-2 tracking-wide">Galeri Foto</h2>
                <div className="w-16 h-[2px] bg-theme-gold mx-auto" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    className={`gallery-item ${g.wrap} rounded-2xl overflow-hidden shadow-xl cursor-pointer group relative border border-theme-gold/30 ${g.anim}`}
                  >
                    <img
                      src={g.src}
                      alt={`Galeri ${i + 1}`}
                      onClick={() => setLightboxSrc(g.src)}
                      className="gallery-img gallery-img-animated w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ===== BLOK 3: AMPLOP -> BUKU TAMU -> FOOTER ===== */}
        <div className="section-wrapper" style={{ backgroundImage: `url('${heroBg}')` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-theme-dark/90 via-theme-dark/85 to-theme-dark" />

          <div className="content-container py-6">
            {/* GIFT */}
            <section id="gift" className="py-16 px-6 text-center">
              <div className="mb-8 reveal-up">
                <h2 className="font-serif text-3xl font-bold text-white mb-2 tracking-wide">Amplop Digital</h2>
                <div className="w-16 h-[2px] bg-theme-gold mx-auto" />
                <p className="text-xs text-gray-200 mt-4 px-2 leading-relaxed font-light">
                  Doa restu Bapak/Ibu/Saudara/i merupakan karunia terindah bagi kami. Namun, apabila hendak memberikan tanda kasih, dapat melalui rekening berikut:
                </p>
              </div>

              <div className="space-y-4 reveal-up">
                {banks.map((b, i) => (
                  <div
                    key={i}
                    className="glass p-6 rounded-2xl border border-white/60 shadow-xl flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-[10px] font-extrabold text-blue-900 uppercase tracking-widest mb-1">
                        Bank {b.bank_name}
                      </p>
                      <p className="font-serif text-2xl font-bold text-theme-dark tracking-wide">{b.account_number}</p>
                      <p className="text-[11px] text-theme-primary font-semibold mt-0.5">a.n. {b.account_holder}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(b.account_number)}
                      className="flex flex-col items-center gap-1 bg-theme-primary text-white py-2 px-3.5 rounded-xl hover:bg-theme-dark transition shadow-md cursor-pointer active:scale-95"
                    >
                      <i className="ph ph-copy text-lg" />
                      <span className="text-[8px] font-bold uppercase">Salin</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP & WISHES */}
            <section id="rsvp" className="py-16 px-6">
              <div className="text-center mb-8 reveal-up">
                <h2 className="font-serif text-3xl font-bold text-white mb-2 tracking-wide">Buku Tamu</h2>
                <div className="w-16 h-[2px] bg-theme-gold mx-auto" />
              </div>

              {/* RSVP */}
              <div className="glass p-6 rounded-2xl border border-white/60 shadow-xl mb-8 reveal-up">
                <h3 className="font-bold text-sm text-theme-dark mb-4 text-center tracking-wide">Konfirmasi Kehadiran</h3>
                <form onSubmit={handleRsvpWhatsApp} className="space-y-4">
                  <input
                    type="text"
                    value={guestName}
                    readOnly
                    className="w-full py-3 px-4 bg-white/70 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 outline-none"
                  />
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value)}
                    className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-xs font-medium text-theme-dark outline-none focus:border-theme-primary appearance-none cursor-pointer"
                  >
                    <option value="Hadir">Ya, Saya akan Hadir</option>
                    <option value="Tidak Hadir">Maaf, Tidak Bisa Hadir</option>
                  </select>
                  <select
                    value={rsvpCount}
                    onChange={(e) => setRsvpCount(e.target.value)}
                    className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-xs font-medium text-theme-dark outline-none focus:border-theme-primary appearance-none cursor-pointer"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition flex justify-center items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                  >
                    <i className="ph-fill ph-whatsapp-logo text-lg" /> Konfirmasi via WhatsApp
                  </button>
                </form>
              </div>

              {/* Wishes */}
              <div className="glass p-6 rounded-2xl border border-white/60 shadow-xl reveal-up">
                <h3 className="font-bold text-sm text-theme-dark mb-4 text-center tracking-wide">Ucapan &amp; Doa Restu</h3>
                <form onSubmit={handleWishSubmit} className="space-y-3 mb-6">
                  <input
                    type="text"
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    placeholder="Nama Anda"
                    required
                    className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-xs font-medium text-theme-dark outline-none focus:border-theme-primary"
                  />
                  <textarea
                    rows={3}
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    placeholder="Berikan ucapan atau doa restu..."
                    required
                    className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-xs font-medium text-theme-dark outline-none focus:border-theme-primary"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 bg-theme-primary hover:bg-theme-dark disabled:opacity-60 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition shadow-md cursor-pointer active:scale-95"
                  >
                    {sending ? "Mengirim..." : "Kirim Ucapan"}
                  </button>
                </form>

                <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar scroll-smooth">
                  {wishList.length === 0 ? (
                    <p className="text-[11px] text-gray-500 text-center italic py-2">
                      Belum ada ucapan. Jadilah yang pertama memberikan ucapan!
                    </p>
                  ) : (
                    wishList.map((w, i) => (
                      <div key={w.id ?? i} className="bg-white/90 p-4 rounded-xl border border-gray-200 shadow-sm text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-theme-primary text-white flex items-center justify-center text-[10px] font-bold uppercase shadow-sm">
                            {(w.name || "?").charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-theme-dark">{w.name}</p>
                            <p className="text-[9px] text-gray-500">{formatWishTime(w.created_at)}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-700 mt-2 leading-relaxed font-light">
                          {w.message || w.wish}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 text-center text-white relative pb-28 reveal-up">
              <h3 className="font-script text-5xl mb-3 text-theme-gold">
                {groomShort} &amp; {brideShort}
              </h3>
              <p className="text-xs text-gray-300 max-w-[280px] mx-auto leading-relaxed font-light">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-6 right-6 text-white text-4xl p-2 focus:outline-none cursor-pointer"
          >
            &times;
          </button>
          <img
            src={lightboxSrc}
            alt="Zoom"
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl border-2 border-theme-gold/40"
          />
        </div>
      )}

      {/* TOAST */}
      <div
        className="fixed top-10 left-1/2 z-[200] bg-theme-dark text-white text-[10px] font-bold tracking-widest uppercase py-3 px-6 rounded-full shadow-2xl border border-theme-gold/50 pointer-events-none"
        style={{
          transition: "all .3s",
          opacity: toast.show ? 1 : 0,
          transform: `translate(-50%, ${toast.show ? "0px" : "-10px"})`,
        }}
      >
        {toast.text}
      </div>
    </div>
  );
}

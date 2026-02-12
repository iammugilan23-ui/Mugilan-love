"use client";

import Navigation from "@/app/components/Navigation";
import GiftReveal from "@/app/components/GiftReveal";
import HeartRibbon from "@/app/components/HeartRibbon";
import LoveParticles from "@/app/components/LoveParticles";
import ScrollProgress from "@/app/components/ScrollProgress";
import FloatingHearts from "@/app/components/FloatingHearts";
import ClickHearts from "@/app/components/ClickHearts";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaHeart, FaPlay, FaMusic, FaGift, FaPlane, FaUmbrellaBeach, FaMountain } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

/* ────── Data ────── */
const memories = [
  { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop", title: "First Date", desc: "The coffee shop where it all began.", tag: "Where it started ☕" },
  { src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=1000&fit=crop", title: "Paris Trip", desc: "Lost in the city of love.", tag: "City of Love 🗼" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1000&fit=crop", title: "Beach Sunset", desc: "Walking hand in hand by the ocean.", tag: "Golden Hour 🌅" },
  { src: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=600&fit=crop", title: "Cozy Nights", desc: "Warm blankets and endless conversations.", tag: "Our Happy Place 🏠" },
  { src: "https://images.unsplash.com/photo-1519167758481-83f29da8c686?w=800&h=1000&fit=crop", title: "Mountain Adventure", desc: "Conquering peaks together.", tag: "On Top of the World 🏔️" },
  { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=1000&fit=crop", title: "Stargazing", desc: "Counting stars and making wishes.", tag: "Under the Stars ✨" },
];

const songs = [
  { title: "Perfect", artist: "Ed Sheeran", duration: "4:23", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "A Thousand Years", artist: "Christina Perri", duration: "4:45", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "All of Me", artist: "John Legend", duration: "4:29", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", duration: "4:41", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

const futurePlans = [
  { title: "Paris Trip", desc: "A romantic getaway to the city of love.", time: "Next Spring", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop", icon: <FaPlane /> },
  { title: "Beach House", desc: "A week of sunsets, ocean waves, and quality time.", time: "Summer 2024", img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop", icon: <FaUmbrellaBeach /> },
  { title: "Mountain Cabin", desc: "A cozy retreat in the mountains.", time: "Next Winter", img: "https://images.unsplash.com/photo-1519167758481-83f29da8c686?w=800&h=600&fit=crop", icon: <FaMountain /> },
];

const mysteryMessages = [
  { title: "Surprise #1", hint: "A special gift waiting for you", content: "I booked us a table at your favorite restaurant tonight! 🍷" },
  { title: "Surprise #2", hint: "100 reasons why I love you", content: "Check your email for a digital book I made for you. 📖" },
  { title: "Surprise #3", hint: "Our journey in numbers", content: "We've been together for 848 days, and I've loved every second. ⏳" },
  { title: "Surprise #4", hint: "Hidden photo gallery", content: "Look under the bed... there's a physical album waiting! 📸" },
];

const stats = [
  { label: "Days Together", value: 847, sub: "And counting forever" },
  { label: "Photos Taken", value: 1293, sub: "Captured memories" },
  { label: "Love Letters", value: 156, sub: "Written from the heart" },
  { label: "Adventures", value: 42, sub: "With many more to come" },
];

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [revealedMessages, setRevealedMessages] = useState<number[]>([]);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMessage = (index: number) => {
    if (revealedMessages.includes(index)) {
      setRevealedMessages(revealedMessages.filter((i) => i !== index));
    } else {
      setRevealedMessages([...revealedMessages, index]);
    }
  };

  const playSong = (index: number) => {
    if (currentSong === index) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(index);
      setIsPlaying(true);
      // Timeout to allow state update before play
      setTimeout(() => audioRef.current?.play(), 0);
    }
  };

  useEffect(() => {
    // Letter-by-letter title reveal
    if (titleRef.current) {
      const text = titleRef.current.textContent || "";
      titleRef.current.innerHTML = text
        .split("")
        .map((char) => `<span class="inline-block opacity-0">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");

      const chars = titleRef.current.querySelectorAll("span");
      gsap.fromTo(chars,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "elastic.out(1, 0.5)", delay: 0.3 }
      );
    }

    gsap.fromTo(".hero-subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1, ease: "power3.out" });
    gsap.fromTo(".hero-description", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.3, ease: "power3.out" });
    gsap.fromTo(".hero-icon", { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.4)", delay: 0.1 });

    if (arrowRef.current) {
      gsap.to(arrowRef.current, { y: 10, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.fromTo(arrowRef.current, { opacity: 0 }, { opacity: 0.7, duration: 1, delay: 2 });
    }

    // Memories cards
    gsap.utils.toArray<HTMLElement>(".memory-card").forEach((card, i) => {
      const fromRot = (i % 2 === 0 ? -1 : 1) * (5 + Math.random() * 5);
      gsap.fromTo(card,
        { y: 80, opacity: 0, rotation: fromRot, scale: 0.9 },
        { y: 0, opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%" }, delay: i * 0.08 }
      );
    });

    // Letter paragraphs ink reveal
    gsap.utils.toArray<HTMLElement>(".letter-para").forEach((para, i) => {
      gsap.fromTo(para,
        { clipPath: "inset(0 100% 0 0)", opacity: 0.3 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: para, start: "top 85%" }, delay: i * 0.05 }
      );
    });

    // Heart dividers
    gsap.utils.toArray<HTMLElement>(".heart-divider-el").forEach((div) => {
      gsap.fromTo(div, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)", scrollTrigger: { trigger: div, start: "top 90%" } });
    });

    // Surprise fade ups
    gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
      gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    // Plan cards
    gsap.utils.toArray<HTMLElement>(".plan-card").forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" }, delay: i * 0.15 }
      );
    });

    // Surprise boxes
    gsap.utils.toArray<HTMLElement>(".surprise-box").forEach((box, i) => {
      gsap.fromTo(box,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: { trigger: box, start: "top 90%" }, delay: i * 0.1 }
      );
    });

    // Counter animation
    const counterEls = document.querySelectorAll(".counter-value");
    counterEls.forEach((el, i) => {
      const target = stats[i]?.value || 0;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2, ease: "power2.out",
        scrollTrigger: { trigger: ".counter-section", start: "top 80%" },
        onUpdate: () => { (el as HTMLElement).textContent = Math.floor(obj.val).toLocaleString(); },
      });
    });

    gsap.fromTo(".infinite-symbol", { scale: 0.8 }, { scale: 1.1, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

  }, []);

  // 3D card tilt
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
    gsap.to(card, { rotateX, rotateY, transformPerspective: 800, duration: 0.3, ease: "power2.out" });
  };
  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <GiftReveal>
      <div className="min-h-screen bg-[#FFF5F7]">
        <Navigation />
        <LoveParticles variant="hearts" />
        <ScrollProgress />
        <ClickHearts />

        {/* ═══════════════════ SECTION 1: HOME ═══════════════════ */}
        <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF1744] via-[#FF4081] to-[#E91E63]">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20" />
          </div>
          <FloatingHearts />

          {/* Heart with only title inside */}
          <div className="relative z-10 flex justify-center hero-icon mb-4 mt-4">
            <div className="big-heart-container">
              <div className="big-heart">
                <h1 ref={titleRef} className="font-script text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg heart-text">
                  Forever Us
                </h1>
              </div>
            </div>
          </div>

          {/* Text & button below heart */}
          <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
            <p className="hero-subtitle text-white text-lg md:text-2xl font-medium mb-2 opacity-0 font-sans leading-tight">
              Every love story is beautiful, but ours is my favorite
            </p>
            <p className="hero-description text-white text-sm md:text-lg mb-4 opacity-0 max-w-xl mx-auto font-sans leading-relaxed">
              A collection of moments, memories, and endless reasons why I fell in love with you
            </p>
            <div className="hero-description opacity-0">
              <button
                onClick={() => document.querySelector("#memories")?.scrollIntoView({ behavior: "smooth" })}
                className="glow-pulse bg-white text-[#FF1744] text-base md:text-lg font-semibold px-8 py-3 md:px-12 md:py-4 rounded-full shadow-2xl inline-block transition-transform hover:scale-105 active:scale-95 font-sans"
              >
                Enter Our Story
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-4 left-0 right-0 z-10 text-center">
            <div ref={arrowRef} className="text-white opacity-0">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs uppercase tracking-widest font-sans">Scroll Down</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ SECTION 2: MEMORIES (Clothesline) ═══════════════════ */}
        <section id="memories" className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-script text-4xl md:text-6xl text-[#FF1744] mb-4 drop-shadow-sm">Our Memories</h2>
              <p className="text-lg md:text-xl text-[#7D5A5E] font-sans">Frozen moments of time that I cherish forever</p>
            </div>

            <HeartRibbon sectionId="memories" title="Our Memories">
              {/* ── Mobile View: 2-Column Grid with Ropes ── */}
              <div className="md:hidden mt-8 space-y-12">
                {Array.from({ length: Math.ceil(memories.length / 2) }).map((_, rowIndex) => {
                  const rowMemories = memories.slice(rowIndex * 2, rowIndex * 2 + 2);
                  return (
                    <div key={rowIndex} className="relative pt-6">
                      {/* Mobile Rope SVG for this row */}
                      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 400 60" preserveAspectRatio="none" style={{ height: "50px", zIndex: 0 }}>
                        {/* A double-dip curve to hold two photos */}
                        <path
                          d="M-10 10 Q90 45 190 15 Q290 -15 410 20"
                          stroke="#8B6914"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                        />
                        <path
                          d="M-10 10 Q90 45 190 15 Q290 -15 410 20"
                          stroke="#A67C00"
                          strokeWidth="1"
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.4"
                          transform="translate(0, -2)"
                        />
                      </svg>

                      <div className="grid grid-cols-2 gap-4 px-2 relative z-10">
                        {rowMemories.map((mem, i) => {
                          const globalIndex = rowIndex * 2 + i;
                          // Rotate slightly left for first item, right for second
                          const rotation = i === 0 ? -3 : 3;
                          // Stagger vertical position to follow rope curve roughly
                          const marginTop = i === 0 ? "20px" : "5px";

                          return (
                            <div
                              key={globalIndex}
                              className="cursor-pointer group"
                              style={{
                                transform: `rotate(${rotation}deg)`,
                                marginTop: marginTop,
                              }}
                              onClick={() => setPreviewIdx(globalIndex)}
                            >
                              {/* Clothespin */}
                              <div className="flex justify-center mb-[-8px] relative z-20">
                                <div style={{ width: "14px", height: "24px" }}>
                                  <div style={{
                                    width: "10px", height: "20px",
                                    background: "linear-gradient(135deg, #DEB887, #D2A56E, #C4944A)",
                                    borderRadius: "2px", margin: "0 auto",
                                    boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", position: "relative",
                                  }}>
                                    <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "1.5px", height: "8px", background: "rgba(0,0,0,0.2)" }} />
                                  </div>
                                </div>
                              </div>

                              {/* Polaroid card */}
                              <div className="bg-white p-2 pb-6 rounded-sm shadow-md transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 mx-auto"
                                style={{ maxWidth: "160px" }}
                              >
                                <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4", borderRadius: "2px" }}>
                                  <Image src={mem.src} alt={mem.title} fill className="object-cover" />
                                </div>
                                <p className="text-center text-xs text-[#2D1B1F] mt-2 font-sans font-medium">{mem.title}</p>
                                <p className="text-center text-[10px] text-[#7D5A5E] font-sans mt-0.5">{mem.tag}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Desktop View: Original Continuous Clothesline ── */}
              <div className="hidden md:block relative mt-8" style={{ minHeight: "380px" }}>
                {/* Rope SVG */}
                <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1200 50" preserveAspectRatio="none" style={{ height: "45px" }}>
                  <path
                    d="M-20 35 Q200 8, 400 28 Q600 48, 800 18 Q1000 -2, 1220 30"
                    stroke="#8B6914"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                  />
                  <path
                    d="M-20 35 Q200 8, 400 28 Q600 48, 800 18 Q1000 -2, 1220 30"
                    stroke="#A67C00"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.4"
                    transform="translate(0, -2)"
                  />
                </svg>

                {/* Photos on rope */}
                <div className="flex justify-around items-start pt-3 gap-0">
                  {memories.map((mem, i) => {
                    const ropeOffsets = [28, 8, 38, 15, 2, 25];
                    const rotations = [-5, 4, -3, 6, -4, 3];
                    const delays = [0, 0.25, 0.5, 0.75, 1.0, 1.25];
                    return (
                      <div
                        key={i}
                        className="clothesline-photo flex-shrink-0 cursor-pointer group"
                        style={{
                          marginTop: `${ropeOffsets[i]}px`,
                          transform: `rotate(${rotations[i]}deg)`,
                          animationDelay: `${delays[i]}s`,
                        }}
                        onClick={() => setPreviewIdx(i)}
                      >
                        {/* Clothespin */}
                        <div className="flex justify-center mb-[-5px] relative z-10">
                          <div style={{ width: "18px", height: "30px" }}>
                            <div style={{
                              width: "14px", height: "26px",
                              background: "linear-gradient(135deg, #DEB887, #D2A56E, #C4944A)",
                              borderRadius: "3px 3px 2px 2px", margin: "0 auto",
                              boxShadow: "1px 2px 4px rgba(0,0,0,0.25)", position: "relative",
                            }}>
                              <div style={{ position: "absolute", top: "9px", left: "2px", right: "2px", height: "4px", background: "linear-gradient(90deg, #888, #CCC, #888)", borderRadius: "2px" }} />
                              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "2px", height: "10px", background: "rgba(0,0,0,0.12)" }} />
                            </div>
                          </div>
                        </div>

                        {/* Polaroid card */}
                        <div className="bg-white p-2.5 pb-10 rounded-sm transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2"
                          style={{
                            width: "clamp(130px, 15vw, 175px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)",
                          }}
                        >
                          <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "4/5", borderRadius: "2px" }}>
                            <Image src={mem.src} alt={mem.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                          <p className="text-center text-sm text-[#2D1B1F] mt-2 font-sans font-medium">{mem.title}</p>
                          <p className="text-center text-[11px] text-[#7D5A5E] font-sans mt-0.5">{mem.tag}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="font-script text-3xl text-[#FF4081]">And many more to come...</p>
              </div>

              {/* ── Preview overlay ON TOP of the whole section ── */}
              {previewIdx !== null && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl animate-preview-in">
                  <div className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-pink-100">
                    <button
                      className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg transition-colors"
                      onClick={() => setPreviewIdx(null)}
                    >
                      ✕
                    </button>
                    {/* Adaptive aspect ratio: 3/4 for mobile, 4/3 for desktop */}
                    <div className="relative w-full aspect-[3/4] md:aspect-[4/3]">
                      <Image src={memories[previewIdx].src} alt={memories[previewIdx].title} fill className="object-cover" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-script text-2xl text-[#FF1744] mb-1">{memories[previewIdx].title}</h3>
                      <p className="text-sm text-[#7D5A5E] font-sans">{memories[previewIdx].desc}</p>
                      <p className="text-xs text-[#FF4081] mt-1 font-sans">{memories[previewIdx].tag}</p>
                    </div>
                    {/* Nav arrows */}
                    <button
                      className="absolute left-2 top-[35%] w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-[#FF1744] text-lg transition-colors"
                      onClick={() => setPreviewIdx((previewIdx - 1 + memories.length) % memories.length)}
                    >
                      ‹
                    </button>
                    <button
                      className="absolute right-2 top-[35%] w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-[#FF1744] text-lg transition-colors"
                      onClick={() => setPreviewIdx((previewIdx + 1) % memories.length)}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </HeartRibbon>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="flex justify-center py-4">
          <div className="flex gap-3">{["♥", "✿", "✧", "♥", "✿"].map((s, i) => <span key={i} className="text-[#FF4081] text-xl heart-divider inline-block" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>)}</div>
        </div>

        {/* ═══════════════════ SECTION 3: LOVE LETTER ═══════════════════ */}
        <section id="love-letter" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-script text-4xl md:text-6xl text-[#FF1744] mb-4 drop-shadow-sm">To My Dearest Love</h2>
              <p className="text-lg md:text-xl text-[#7D5A5E] font-sans">February 14, 2024</p>
            </div>

            <HeartRibbon sectionId="love-letter" title="My Love Letter">
              <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-16 border border-red-50 mt-8">
                <div className="space-y-6 text-lg leading-relaxed font-serif text-[#2D1B1F]">
                  <p className="text-3xl font-script text-[#FF4081] mb-8 letter-para">My Beloved,</p>

                  <p className="letter-para">
                    As I sit down to write these words, my heart feels so full that I wonder if simple language can ever truly capture what I feel for you. Yet, I must try, because you deserve to know the depth of my love and the profound impact you&apos;ve had on my life.
                  </p>

                  <div className="flex justify-center py-2 heart-divider-el"><span className="heart-divider text-[#FF4081] text-xl inline-block">♥</span></div>

                  <p className="letter-para">
                    From the moment we met, something inside me shifted. It was as if the universe had been waiting for that exact moment to show me what true connection feels like. Your smile became my sunrise, your laughter the soundtrack to my happiest days, and your presence the home I never knew I was searching for.
                  </p>

                  <p className="letter-para">
                    You have this incredible way of making the ordinary feel extraordinary. A simple walk becomes an adventure when I&apos;m with you. A quiet evening at home transforms into the most precious moment of my week. You&apos;ve taught me that love isn&apos;t just about the grand gestures—it&apos;s in the way you remember how I take my coffee, in the gentle touch of your hand when I&apos;m stressed, in the way you look at me like I&apos;m the only person in the world.
                  </p>

                  <div className="flex justify-center py-2 heart-divider-el"><span className="heart-divider text-[#FF4081] text-xl inline-block">✿</span></div>

                  <p className="letter-para">
                    I love how you dream with your whole heart and chase those dreams with unwavering determination. I love your kindness, the way you see the good in people even when it&apos;s hard to find. I love your strength, how you face challenges with grace and courage. I love your quirks, your spontaneous dance moves in the kitchen, the way you sing off-key but with complete confidence.
                  </p>

                  <p className="letter-para">
                    You&apos;ve made me a better person. With you, I&apos;ve learned to be more patient, more understanding, more open with my feelings. You&apos;ve created a safe space where I can be completely myself, vulnerabilities and all, without fear of judgment. That gift is more precious than you could ever know.
                  </p>

                  <div className="flex justify-center py-2 heart-divider-el"><span className="heart-divider text-[#FF4081] text-xl inline-block">♥</span></div>

                  <p className="letter-para">
                    There are moments when I look at you and I&apos;m overwhelmed by gratitude. Gratitude that in this vast world, our paths crossed. Gratitude for every conversation we&apos;ve shared, every obstacle we&apos;ve overcome together, every memory we&apos;ve created.
                  </p>

                  <p className="letter-para">
                    I want you to know that my love for you isn&apos;t just a feeling—it&apos;s a choice I make every single day. Through every season of life, through every challenge that may come our way, I choose you. Always.
                  </p>

                  <div className="flex justify-center py-2 heart-divider-el"><span className="heart-divider text-[#FF4081] text-xl inline-block">✧</span></div>

                  <p className="letter-para">
                    You are my best friend, my confidant, my greatest adventure, and my safest harbor all at once. You are the answer to questions I didn&apos;t know to ask, the dream I didn&apos;t dare to dream. You are, quite simply, everything.
                  </p>

                  <p className="text-3xl font-script text-[#FF4081] mt-12 letter-para">Forever and always yours,</p>

                  <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
                    <div className="w-20 h-px bg-[#FF1744]" />
                    <span className="heart-divider text-lg inline-block">❤️</span>
                    <div className="w-20 h-px bg-[#FF1744]" />
                  </div>
                </div>
              </article>
            </HeartRibbon>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="flex justify-center py-4">
          <div className="flex gap-3">{["✧", "♥", "✿", "♥", "✧"].map((s, i) => <span key={i} className="text-[#FF4081] text-xl heart-divider inline-block" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>)}</div>
        </div>

        {/* ═══════════════════ SECTION 4: SURPRISE ═══════════════════ */}
        <section id="surprise" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-script text-4xl md:text-6xl text-[#FF1744] mb-4 drop-shadow-sm">A Special Surprise</h2>
              <p className="text-lg md:text-xl text-[#7D5A5E] font-sans">I&apos;ve prepared something beautiful just for you, my love</p>
            </div>

            <HeartRibbon sectionId="surprise" title="Your Surprise">
              {/* Video */}
              {/* Video with Facade Pattern */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 fade-up mt-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-[#2D1B1F] mb-2 font-sans">A Message From My Heart</h3>
                  <p className="text-[#7D5A5E] font-sans">Press play when you&apos;re ready</p>
                </div>
                <div className="aspect-video bg-gray-100 rounded-2xl relative overflow-hidden group shadow-inner">
                  {showVideo ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Our Love Story Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full rounded-2xl"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => setShowVideo(true)}
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1200&h=675&fit=crop"
                        alt="Video thumbnail"
                        fill
                        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-[#FF1744] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform glow-pulse">
                          <FaPlay className="text-white ml-2 text-2xl" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Playlist with Audio Player */}
              <div className="grid md:grid-cols-2 gap-8 mb-16 fade-up">
                <div className="bg-gradient-to-br from-[#FFE5EC] to-[#FFF5F7] rounded-3xl p-8 shadow-lg">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#FF1744] text-4xl">
                      {isPlaying ? <div className="animate-pulse"><FaMusic /></div> : <FaMusic />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#2D1B1F] font-sans">Our Soundtrack</h3>
                      <p className="text-[#7D5A5E] font-sans">{songs.length} songs • Memories in melody</p>
                    </div>
                  </div>

                  {/* Hidden Audio Element */}
                  <audio
                    ref={audioRef}
                    src={currentSong !== null ? songs[currentSong].src : ""}
                    onEnded={() => setIsPlaying(false)}
                  />

                  <div className="space-y-4">
                    {songs.map((song, i) => {
                      const isCurrent = currentSong === i;
                      return (
                        <div
                          key={i}
                          onClick={() => playSong(i)}
                          className={`rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all border ${isCurrent ? "bg-white border-pink-200 shadow-sm" : "bg-white/60 border-transparent hover:bg-white"}`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCurrent ? "bg-[#FF1744] text-white" : "bg-[#FFE5EC] text-[#FF1744] group-hover:bg-[#FF1744] group-hover:text-white"}`}>
                            {isCurrent && isPlaying ? <span className="text-xs">❚❚</span> : <span className="text-xs">▶</span>}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold font-sans ${isCurrent ? "text-[#FF1744]" : "text-[#2D1B1F]"}`}>{song.title}</p>
                            <p className="text-sm text-[#7D5A5E] font-sans">{song.artist}</p>
                          </div>
                          <span className="text-xs text-[#7D5A5E] font-sans">{song.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-6">
                  <div className="bg-[#FF1744] text-white p-8 rounded-3xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-4 font-sans">Why These Songs?</h3>
                    <p className="opacity-90 font-sans">Each song marks a special moment in our journey together. From our first date melody to the song that always makes you smile.</p>
                  </div>
                  <div className="bg-white border-2 border-[#FFE5EC] p-8 rounded-3xl shadow-sm transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2 text-[#2D1B1F] font-sans">Featured Memory</h3>
                    <p className="text-[#7D5A5E] font-sans">Remember when we danced in the kitchen at midnight to &quot;Perfect&quot;? That&apos;s when I knew every moment with you was magic.</p>
                  </div>
                </div>
              </div>

              {/* Future Plans */}
              <div className="mb-16 fade-up">
                <h3 className="text-center text-4xl font-bold text-[#2D1B1F] mb-4 font-sans">Our Future Adventures</h3>
                <p className="text-center text-xl text-[#7D5A5E] mb-8 font-sans">Beautiful plans I&apos;m dreaming of with you</p>
                <div className="grid md:grid-cols-3 gap-8">
                  {futurePlans.map((plan, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-xl overflow-hidden plan-card group will-change-transform" style={{ transformStyle: "preserve-3d" }}>
                      <div className="h-48 relative overflow-hidden">
                        <Image src={plan.img} alt={plan.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-4 right-4 bg-white rounded-full p-3 text-[#FF1744] shadow-lg group-hover:scale-110 transition-transform">{plan.icon}</div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-2xl font-semibold text-[#2D1B1F] mb-2 font-sans">{plan.title}</h4>
                        <p className="text-[#7D5A5E] mb-4 font-sans">{plan.desc}</p>
                        <div className="flex items-center gap-2 text-[#FF1744] font-medium font-sans"><span>📅</span><span>{plan.time}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mystery Messages */}
              <div className="mb-16 fade-up">
                <h3 className="text-center text-4xl font-bold text-[#2D1B1F] mb-4 font-sans">Mystery Messages</h3>
                <p className="text-center text-[#7D5A5E] mb-8 font-sans">Click each box to reveal a surprise ♥</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mysteryMessages.map((msg, i) => (
                    <div
                      key={i}
                      onClick={() => toggleMessage(i)}
                      className={`relative p-8 rounded-3xl text-center cursor-pointer transition-all duration-500 transform hover:-translate-y-2 surprise-box ${revealedMessages.includes(i) ? "bg-white shadow-xl" : "bg-gradient-to-br from-[#FF1744] to-[#FF4081] text-white shadow-lg hover:shadow-2xl"}`}
                    >
                      <div className="min-h-[180px] flex flex-col items-center justify-center">
                        {revealedMessages.includes(i) ? (
                          <>
                            <div className="text-3xl mb-3">🎉</div>
                            <p className="text-[#FF1744] font-bold text-lg mb-2 font-sans">Revealed!</p>
                            <p className="text-[#2D1B1F] font-sans">{msg.content}</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 text-3xl"><FaGift /></div>
                            <h4 className="font-bold text-xl mb-1 font-sans">{msg.title}</h4>
                            <p className="text-sm opacity-90 font-sans">{msg.hint}</p>
                            <p className="mt-4 text-xs uppercase tracking-widest opacity-75 font-sans">Click to reveal</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Love Counter */}
              <div className="counter-section fade-up">
                <div className="bg-white rounded-3xl shadow-2xl p-12">
                  <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold text-[#2D1B1F] mb-4 font-sans">Our Journey in Numbers</h3>
                    <p className="text-xl text-[#7D5A5E] font-sans">Every moment counted, every memory treasured</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                      <div key={i} className="text-center p-6 bg-gradient-to-br from-[#FFE5EC] to-[#FFF5F7] rounded-2xl group hover:shadow-lg transition-shadow">
                        <div className="counter-value text-5xl font-bold text-[#FF1744] mb-2 font-sans">0</div>
                        <p className="text-lg text-[#2D1B1F] font-medium font-sans">{stat.label}</p>
                        <p className="text-sm text-[#7D5A5E] mt-2 font-sans">{stat.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 flex justify-center">
                    <div className="bg-gradient-to-r from-[#FFE5EC] via-[#FFF5F7] to-[#FFE5EC] rounded-2xl p-8 text-center">
                      <div className="infinite-symbol text-6xl text-[#FF1744] mb-4">∞</div>
                      <p className="text-2xl font-bold text-[#2D1B1F] font-sans">Reasons I Love You</p>
                      <p className="text-[#7D5A5E] font-sans mt-1">Truly infinite</p>
                    </div>
                  </div>
                </div>
              </div>
            </HeartRibbon>
          </div>
        </section>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="py-20 px-6 text-center bg-gradient-to-b from-[#FFF5F7] to-[#FFE5EC]">
          <h2 className="font-script text-5xl md:text-7xl text-[#FF1744] mb-6">Forever Yours</h2>
          <p className="text-xl leading-relaxed text-[#7D5A5E] mb-8 font-sans max-w-2xl mx-auto">
            Every surprise, every song, every plan is my way of showing you how much you mean to me. Thank you for being my everything.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            {["♥", "✿", "✧", "💫", "♥"].map((sym, i) => (
              <span key={i} className="text-[#FF4081] text-2xl heart-divider inline-block" style={{ animationDelay: `${i * 0.4}s` }}>{sym}</span>
            ))}
          </div>
          <p className="text-lg text-[#7D5A5E] mt-8 font-sans opacity-70">With all my love, always and forever</p>
        </footer>
      </div>
    </GiftReveal>
  );
}

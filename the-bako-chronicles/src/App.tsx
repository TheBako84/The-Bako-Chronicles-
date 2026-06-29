import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Heart, 
  Compass, 
  MapPin, 
  Mail, 
  Globe, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  HeartHandshake, 
  Briefcase, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronRight, 
  Instagram, 
  Smile, 
  Camera, 
  Check, 
  Plane,
  AtSign
} from "lucide-react";

import { Story, TravelTip } from "./types";
import { INITIAL_STORIES, TRAVEL_TIPS, ALBUM_IMAGES } from "./data";

export default function App() {
  // Mobile menu open/close
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Blog Stories State (with local storage persistence)
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem("bako_stories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return INITIAL_STORIES.map(originalStory => {
            const savedStory = parsed.find(s => s.id === originalStory.id);
              if (savedStory) {
                return {
                  ...originalStory,
                  likes: savedStory.likes ?? originalStory.likes,
                  comments: (savedStory.comments ?? originalStory.comments).filter(
                    (c: any) => c.id !== "c1" && c.id !== "c2" && c.id !== "c3" && c.id !== "c4"
                  )
                };
              }
            return originalStory;
          });
        }
      } catch (e) {
        console.error("Failed to parse saved stories", e);
      }
    }
    return INITIAL_STORIES;
  });

  // Save stories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bako_stories", JSON.stringify(stories));
  }, [stories]);

  // Selected Story for the "Read Full Story" modal
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Comments temporary state per story (for simple text area input)
  const [newCommentText, setNewCommentText] = useState<{ [storyId: string]: string }>({});
  const [newCommentName, setNewCommentName] = useState<{ [storyId: string]: string }>({});

  // Expanded Travel Tip ID
  const [expandedTip, setExpandedTip] = useState<string | null>("tip-hair");

  // Photo Album Lightbox Image Index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Album Images State (with local storage persistence for customized locations & captions)
  const [albumImages, setAlbumImages] = useState(() => {
    const saved = localStorage.getItem("bako_album_images");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Merge to ensure code-defined URL updates are always respected
          return ALBUM_IMAGES.map((originalImg, idx) => {
            const savedImg = parsed[idx];
            if (savedImg) {
              return {
                ...savedImg,
                url: originalImg.url // Always prioritize the latest URL from code
              };
            }
            return originalImg;
          });
        }
      } catch (e) {
        console.error("Failed to parse saved album images", e);
      }
    }
    return ALBUM_IMAGES;
  });

  useEffect(() => {
    localStorage.setItem("bako_album_images", JSON.stringify(albumImages));
  }, [albumImages]);

  // Creator Mode for easy customization on the live page
  const [creatorMode, setCreatorMode] = useState(false);

  // Contact form submission state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Handle Likes
  const handleLike = (storyId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening modal
    setStories(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, likes: story.likes + 1 } : story
      )
    );
  };

  // Add Comment
  const handleAddComment = (storyId: string, event: React.FormEvent) => {
    event.preventDefault();
    const authorName = newCommentName[storyId]?.trim() || "Adventurous Sister";
    const commentText = newCommentText[storyId]?.trim();

    if (!commentText) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: authorName,
      text: commentText,
      timestamp: "Just now",
      avatarUrl: `https://images.unsplash.com/photo-${[
        "1531123897727-8f129e1688ce",
        "1544005313-94ddf0286df2",
        "1494790108377-be9c29b29330",
        "1508214751196-bcfd4ca60f91"
      ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=150&q=80`
    };

    setStories(prev => {
      const updated = prev.map(story => {
        if (story.id === storyId) {
          const updatedComments = [newComment, ...story.comments];
          
          // Also update active modal story if open
          if (activeStory && activeStory.id === storyId) {
            setActiveStory(prevActive => prevActive ? { ...prevActive, comments: updatedComments } : null);
          }
          
          return { ...story, comments: updatedComments };
        }
        return story;
      });
      return updated;
    });

    // Reset inputs
    setNewCommentText(prev => ({ ...prev, [storyId]: "" }));
    setNewCommentName(prev => ({ ...prev, [storyId]: "" }));
  };

  // Handle Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    // Reset form
    setContactForm({ name: "", email: "", message: "" });
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-slate-900 selection:bg-pink-600 selection:text-white">
      
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b-4 border-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            className="flex items-center space-x-2 group"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-yellow-400 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:rotate-12 transition-transform duration-300">
              BC
            </div>
            <span className="font-serif font-black text-2xl tracking-tighter text-pink-600 uppercase italic group-hover:opacity-90 transition-opacity">
              THE BAKO CHRONICLES
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8" id="nav-desktop">
            <button 
              onClick={() => scrollToSection("home")}
              className="font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
            >
              HOME
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
            >
              ABOUT
            </button>
            <button 
              onClick={() => scrollToSection("stories")}
              className="font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
            >
              STORIES
            </button>
            <button 
              onClick={() => scrollToSection("tips")}
              className="font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
            >
              TRAVEL TIPS
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
            >
              CONTACT
            </button>
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={() => scrollToSection("stories")}
              className="px-6 py-3.5 bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all cursor-pointer"
            >
              READ NOW
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-20 bottom-0 w-80 max-w-full bg-white z-45 shadow-2xl p-6 flex flex-col justify-between md:hidden border-l border-pink-100"
            >
              <div className="space-y-6">
                <p className="text-xs font-extrabold tracking-widest text-pink-600 uppercase border-b border-pink-100 pb-2">
                  Adventure Menu
                </p>
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => scrollToSection("home")}
                    className="flex items-center justify-between font-bold text-lg text-slate-800 hover:text-pink-600 text-left py-2"
                  >
                    <span>HOME</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => scrollToSection("about")}
                    className="flex items-center justify-between font-bold text-lg text-slate-800 hover:text-pink-600 text-left py-2"
                  >
                    <span>ABOUT ME</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => scrollToSection("stories")}
                    className="flex items-center justify-between font-bold text-lg text-slate-800 hover:text-pink-600 text-left py-2"
                  >
                    <span>STORIES</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => scrollToSection("tips")}
                    className="flex items-center justify-between font-bold text-lg text-slate-800 hover:text-pink-600 text-left py-2"
                  >
                    <span>TRAVEL TIPS</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => scrollToSection("contact")}
                    className="flex items-center justify-between font-bold text-lg text-slate-800 hover:text-pink-600 text-left py-2"
                  >
                    <span>CONTACT</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-400/10 to-pink-500/10 p-5 rounded-2xl border border-pink-500/20">
                <p className="font-serif font-bold text-pink-600 mb-1">Passports & Romance</p>
                <p className="text-xs text-slate-600">Sis, your next international chapter is waiting for you to write it.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <section 
        id="home" 
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20"
      >
        {/* Background Image with warm overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/bako_about_portrait_1782339469385.jpg" 
            alt="Bako Portrait" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#FFF8F0]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Small dynamic badge */}
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-600/90 backdrop-blur-sm text-xs font-black tracking-widest uppercase shadow-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-yellow-400" /> 
              The Bako Chronicles
            </span>

            {/* Headline */}
            <h1 className="font-serif font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none drop-shadow-lg">
              Places to go.<br />
              <span className="bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent drop-shadow-none">
                People to love.
              </span>
            </h1>

            {/* Bio Paragraph */}
            <p className="text-lg sm:text-2xl font-light text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
              I’m Bako—an African American woman navigating the globe, chasing golden sunsets, and finding romance across borders. Join me as I share raw stories, dating tips, and ultimate travel hacks for modern women who wander.
            </p>

            {/* Click Here Button */}
            <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                id="hero-click-here"
                onClick={() => scrollToSection("about")}
                className="w-full sm:w-auto px-10 py-5 bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:bg-pink-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Click Here</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => scrollToSection("stories")}
                className="w-full sm:w-auto px-8 py-5 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-base border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                Read Dating Chronicles
              </button>
            </div>

          </motion.div>
        </div>

        {/* Animated bounce scroll down */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() => scrollToSection("about")}
            className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center p-2 cursor-pointer bg-white/5 backdrop-blur-sm"
          >
            <div className="w-1.5 h-3 rounded-full bg-yellow-400" />
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 bg-white overflow-hidden relative">
        {/* Geometric background element from theme */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* About Image Container */}
            <div className="lg:col-span-5 relative" id="about-image-container">
              {/* Backing Card Decorative Layer */}
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-pink-500 to-yellow-400 opacity-15 blur-2xl -z-10" />
              
              <div className="relative">
                {/* Yellow frame */}
                <div className="absolute inset-0 rounded-[35px] border-4 border-yellow-400 translate-x-4 translate-y-4 -z-10" />
                
                {/* Actual Image */}
                <div className="overflow-hidden rounded-[35px] shadow-2xl border-8 border-white bg-slate-100">
                  <img 
                    src="/src/assets/images/bako_hero_sunset_1782339452668.jpg" 
                    alt="Bako Leaning on Red Fiat 500" 
                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>


              </div>
            </div>

            {/* About Text */}
            <div className="lg:col-span-7 space-y-6" id="about-text-content">
              <h3 className="text-cyan-600 font-black text-xs uppercase tracking-widest mb-2 underline decoration-2 underline-offset-4">The Mission</h3>
              <h2 className="font-serif font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
                Hey, Sis! Welcome to Your Global Love Sanctuary.
              </h2>
              
              <div className="w-20 h-1.5 bg-gradient-to-r from-pink-600 to-yellow-400 rounded-full" />

              <p className="text-slate-600 text-lg leading-relaxed">
                I created <strong>The Bako Chronicles</strong> because our travel experiences are unique—and so is our journey for connection abroad. As an African American woman from the US, exploring international cities opened my eyes to a world of romance, appreciation, and empowerment that goes far beyond what we’re told is possible.
              </p>

              <p className="text-slate-600 text-lg leading-relaxed mb-8 border-l-4 border-cyan-400 pl-4">
                Whether you are <strong>25 or 60</strong>, looking for a summer fling in Florence, a whirlwind weekend in Paris, or your lifelong partner, this is your safe space. No judgment, no filters—just pure, honest stories, tactical safety tips for solo jetsetters, and the undeniable liberation that comes from booking that flight and trusting your heart.
              </p>

              {/* Quick stats / Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm text-center">
                  <p className="font-serif font-black text-3xl text-pink-600">58</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Countries</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm text-center">
                  <p className="font-serif font-black text-3xl text-yellow-500">30+</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dating Stories</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm text-center">
                  <p className="font-serif font-black text-3xl text-cyan-600">0</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Regrets</p>
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="pt-4">
                <button 
                  onClick={() => scrollToSection("tips")}
                  className="inline-flex items-center gap-2 font-black text-sm tracking-wider uppercase text-pink-600 hover:text-pink-700 transition-colors cursor-pointer group"
                >
                  <span>See Travel & Safety Hacks</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. PHOTO ALBUM SECTION */}
      <section id="album" className="py-24 bg-[#FFF5F7] border-b-2 border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-pink-500 font-bold uppercase text-sm tracking-widest">Postcards From The Road</span>
          <h2 className="font-serif font-black text-4xl sm:text-5xl text-slate-900 mt-2 mb-4 tracking-tight">
            My Global Glow Album
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6 text-lg">
            Welcome to a journey where travel meets romance, culture meets confidence, and Black women are reminded that the world is ours to explore.
          </p>

          {/* Dynamic Album Controls */}
          <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setCreatorMode(!creatorMode)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all border shadow-sm cursor-pointer ${
                creatorMode
                  ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white border-pink-600 shadow-pink-100"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${creatorMode ? "text-yellow-300 animate-spin" : "text-pink-500 animate-pulse"}`} />
              {creatorMode ? "Exit Customizer" : "Customize Cities & Countries"}
            </button>
            {creatorMode && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to restore the original postcards?")) {
                    localStorage.removeItem("bako_album_images");
                    setAlbumImages(ALBUM_IMAGES);
                  }
                }}
                className="px-4 py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
              >
                Reset Default
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="photo-album-grid">
            {albumImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setLightboxIndex(idx)}
                className={`bg-white p-4 rounded-3xl shadow-md border border-slate-100 cursor-pointer group transition-all duration-300 ${
                  idx % 2 === 1 ? "sm:translate-y-4" : ""
                }`}
              >
                {/* Photo frame */}
                <div className="relative overflow-hidden rounded-2xl h-72 bg-slate-200 border-4 border-white shadow-md">
                  <img 
                    src={img.url} 
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:brightness-105 group-hover:saturate-110 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Location badge */}
                  <div className="absolute top-4 left-4 bg-black/65 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    {img.location}
                  </div>

                  {creatorMode && (
                    <div className="absolute top-4 right-4 bg-pink-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-pulse shadow-md z-10">
                      Edit Info
                    </div>
                  )}

                  {/* Magnify overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white text-pink-600 flex items-center justify-center shadow-lg">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Description below image resembling physical polaroid postcard */}
                <div className="pt-4 pb-2 text-left px-1">
                  <p className="font-serif font-bold text-slate-800 text-base line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {img.caption}
                  </p>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                    {creatorMode ? "✏️ Click to customize details" : "Tap to expand"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close trigger outside */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxIndex(null)} />
            
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-55 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-55 max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex flex-col md:flex-row"
            >
              {/* Image side */}
              <div className="md:w-3/5 bg-neutral-900 h-96 md:h-[550px]">
                <img 
                  src={albumImages[lightboxIndex].url} 
                  alt="Expanded travel view" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text side */}
              <div className="md:w-2/5 p-8 flex flex-col justify-between bg-white text-slate-900">
                <div className="space-y-6">
                  {creatorMode ? (
                    <div className="space-y-4 bg-pink-50/50 p-5 rounded-2xl border border-pink-100 text-left">
                      <div className="flex items-center gap-2 text-pink-600 font-extrabold text-xs tracking-wider uppercase">
                        <Sparkles className="w-4 h-4 animate-spin text-pink-500" />
                        <span>Customize Details</span>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                          City & Country
                        </label>
                        <input
                          type="text"
                          value={albumImages[lightboxIndex].location}
                          onChange={(e) => {
                            const updated = [...albumImages];
                            updated[lightboxIndex] = {
                              ...updated[lightboxIndex],
                              location: e.target.value
                            };
                            setAlbumImages(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
                          placeholder="e.g. Rome, Italy"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                          Postcard Caption
                        </label>
                        <textarea
                          rows={3}
                          value={albumImages[lightboxIndex].caption}
                          onChange={(e) => {
                            const updated = [...albumImages];
                            updated[lightboxIndex] = {
                              ...updated[lightboxIndex],
                              caption: e.target.value
                            };
                            setAlbumImages(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 leading-relaxed"
                          placeholder="e.g. Chasing adventures in a vintage red Fiat 500."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={albumImages[lightboxIndex].url}
                          onChange={(e) => {
                            const updated = [...albumImages];
                            updated[lightboxIndex] = {
                              ...updated[lightboxIndex],
                              url: e.target.value
                            };
                            setAlbumImages(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-xs tracking-wider uppercase">
                        <MapPin className="w-4 h-4 text-yellow-500" />
                        <span>{albumImages[lightboxIndex].location}</span>
                      </div>

                      <p className="font-serif font-bold text-2xl text-slate-900 leading-tight">
                        Postcard Diary
                      </p>
                      
                      <p className="text-slate-600 text-lg italic leading-relaxed">
                        "{albumImages[lightboxIndex].caption}"
                      </p>

                      <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs text-slate-500">
                        <p className="font-bold text-pink-600 mb-1">Traveler Secret</p>
                        Each photo is a chapter in my journey. Dating abroad taught me to define my standards on a global scale. Don't be afraid to take up space!
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-extrabold tracking-wider uppercase">
                    Postcard {lightboxIndex + 1} of {albumImages.length}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + albumImages.length) % albumImages.length : null)}
                      className="p-2 rounded-full border border-neutral-200 text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % albumImages.length : null)}
                      className="p-2 rounded-full border border-neutral-200 text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. STORIES & COMMENTS SECTION */}
      <section id="stories" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-pink-600 font-extrabold text-sm tracking-widest uppercase">The Dating Chronicles</span>
            <h2 className="font-serif font-black text-4xl sm:text-5xl text-slate-900 mt-2 mb-4 tracking-tight">
              Short Stories & Matchmaking Adventures
            </h2>
            <p className="text-slate-600 text-lg">
              Grab a glass of wine, sister, and dive into my personal diary of romantic encounters. Click "Read Full Story" to unlock the raw, uncensored logs, or leave your thoughts below!
            </p>
          </div>

          {/* Stories List */}
          <div className="space-y-12" id="stories-list">
            {stories.map(story => (
              <div 
                key={story.id}
                className="bg-white rounded-3xl border-t-4 border-cyan-400 border-x border-b border-slate-100 shadow-md hover:shadow-xl hover:border-pink-500/20 transition-all duration-300 overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Story Image Side */}
                <div className="relative h-64 lg:h-auto bg-slate-100 min-h-[250px] lg:w-1/3">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Location Tag Overlay */}
                  <div className="absolute top-4 left-4 bg-pink-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {story.location}
                  </div>
                </div>

                {/* Story Text & Comments Side */}
                <div className="p-6 sm:p-10 flex flex-col justify-between lg:w-2/3">
                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {story.date}
                      </span>
                      <span className="text-cyan-600">{story.location}</span>
                    </div>

                    {/* Story Title */}
                    <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mb-4 hover:text-pink-600 transition-colors leading-tight">
                      {story.title}
                    </h3>

                    {/* Excerpt / Intro */}
                    <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                      {story.excerpt}
                    </p>

                    {/* Read Full Story Button or Toggle */}
                    <div className="mb-6">
                      <button
                        onClick={() => setActiveStory(story)}
                        className="px-6 py-2.5 rounded-full border-2 border-pink-600 text-pink-600 font-bold text-sm hover:bg-pink-600 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        Read Full Story
                      </button>
                    </div>
                  </div>

                  {/* Likes and Comment Summary Area */}
                  <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    
                    {/* Like and total comments counter */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={(e) => handleLike(story.id, e)}
                        className="flex items-center gap-2 group cursor-pointer"
                      >
                        <span className="w-9 h-9 rounded-full bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center text-pink-600 transition-colors">
                          <Heart className="w-5 h-5 fill-current" />
                        </span>
                        <span className="font-extrabold text-sm text-slate-700 group-hover:text-pink-600 transition-colors">
                          {story.likes} Likes
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                          <MessageSquare className="w-5 h-5 fill-current" />
                        </span>
                        <span className="font-extrabold text-sm text-slate-700">
                          {story.comments.length} Comments
                        </span>
                      </div>
                    </div>

                    {/* Leave quick comment form inside Card */}
                    <form 
                      onSubmit={(e) => handleAddComment(story.id, e)}
                      className="w-full md:w-auto flex-1 max-w-lg flex flex-col sm:flex-row gap-2"
                    >
                      <input 
                        type="text" 
                        placeholder="Your Name (optional)" 
                        value={newCommentName[story.id] || ""}
                        onChange={(e) => setNewCommentName(prev => ({ ...prev, [story.id]: e.target.value }))}
                        className="px-4 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-pink-500 bg-neutral-50/50 flex-shrink-0 sm:w-40"
                      />
                      <div className="flex-1 flex gap-2">
                        <input 
                          type="text" 
                          required
                          placeholder="Speak your mind, sister..." 
                          value={newCommentText[story.id] || ""}
                          onChange={(e) => setNewCommentText(prev => ({ ...prev, [story.id]: e.target.value }))}
                          className="flex-grow px-4 py-2 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-pink-500 bg-neutral-50/50"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm"
                          aria-label="Submit comment"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>

                  </div>

                  {/* Collapsed view of the last 2 comments */}
                  {story.comments.length > 0 && (
                    <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5">
                      <p className="text-xs font-black uppercase tracking-widest text-pink-600 mb-3">Conversation</p>
                      <div className="space-y-3">
                        {story.comments.slice(0, 2).map(c => (
                          <div key={c.id} className="flex items-start gap-3 text-sm">
                            <img 
                              src={c.avatarUrl || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80"} 
                              alt={c.author} 
                              className="w-8 h-8 rounded-full object-cover bg-neutral-200 border-2 border-white shadow-sm shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-neutral-800">{c.author}</span>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase">{c.timestamp}</span>
                              </div>
                              <p className="text-neutral-600 mt-0.5 leading-relaxed">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FULL STORY MODAL */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Backdrop Close */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveStory(null)} />

            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="relative z-55 bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8 max-h-[90vh]"
            >
              {/* Header Image banner */}
              <div className="relative h-60 sm:h-72 bg-neutral-100 shrink-0">
                <img 
                  src={activeStory.imageUrl} 
                  alt={activeStory.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button
                  onClick={() => setActiveStory(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <span className="px-3 py-1 bg-yellow-400 text-neutral-900 font-black text-[10px] uppercase tracking-widest rounded-full shadow-md">
                    {activeStory.location}
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl mt-2 drop-shadow">
                    {activeStory.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
                
                {/* Story Meta */}
                <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase pb-4 border-b border-neutral-100">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-pink-600" /> {activeStory.date}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-cyan-600" /> {activeStory.location}</span>
                </div>

                {/* Main Text Content */}
                <div className="prose max-w-none space-y-4">
                  {activeStory.content.split(/\n+/).map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    if (index === 0) {
                      return (
                        <p key={index} className="text-slate-700 text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-black first-letter:text-pink-600 first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                          {trimmed}
                        </p>
                      );
                    }
                    return (
                      <p key={index} className="text-slate-700 text-lg leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* Quote Block */}
                <div className="bg-gradient-to-tr from-pink-50 to-yellow-50/50 p-5 rounded-2xl border-l-4 border-pink-600 italic text-slate-700">
                  "Dating outside your zip code breaks all conventional rules. It forces you to stand in your authentic glory, demanding to be cherished exactly as you are." — Bako
                </div>

                {/* Comments Section */}
                <div className="space-y-6 pt-6 border-t border-neutral-100">
                  <h4 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-600" />
                    Conversations ({activeStory.comments.length})
                  </h4>

                  {/* Add comment in modal */}
                  <form 
                    onSubmit={(e) => handleAddComment(activeStory.id, e)}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3"
                  >
                    <p className="text-xs font-black uppercase text-pink-600 tracking-wider">Leave your thoughts, Sis!</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Your Name (e.g., Destiny R.)" 
                        value={newCommentName[activeStory.id] || ""}
                        onChange={(e) => setNewCommentName(prev => ({ ...prev, [activeStory.id]: e.target.value }))}
                        className="px-4 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none bg-white"
                      />
                      <p className="text-xs text-slate-400 flex items-center font-medium italic">Your voice builds our community!</p>
                    </div>
                    <div className="flex gap-2">
                      <textarea 
                        required
                        rows={2}
                        placeholder="Speak truth to sisterhood..." 
                        value={newCommentText[activeStory.id] || ""}
                        onChange={(e) => setNewCommentText(prev => ({ ...prev, [activeStory.id]: e.target.value }))}
                        className="flex-grow px-4 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none bg-white"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {activeStory.comments.length === 0 ? (
                      <p className="text-sm text-neutral-400 italic">No comments yet. Start the conversation!</p>
                    ) : (
                      activeStory.comments.map(c => (
                        <div key={c.id} className="flex items-start gap-3 text-sm pb-4 border-b border-neutral-50 last:border-b-0">
                          <img 
                            src={c.avatarUrl || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80"} 
                            alt={c.author} 
                            className="w-10 h-10 rounded-full object-cover bg-neutral-100 border-2 border-white shadow-sm shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-neutral-800">{c.author}</span>
                              <span className="text-[10px] text-neutral-400 font-bold uppercase">{c.timestamp}</span>
                            </div>
                            <p className="text-neutral-600 mt-1 leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. TRAVEL TIPS & HACKS */}
      <section id="tips" className="py-24 bg-[#121212] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Explanatory text */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-yellow-400 font-extrabold text-sm tracking-widest uppercase">Travel Smart, Sis</span>
              <h2 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight leading-tight">
                Travel & Safety Hacks for the Elite Jetsetter
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full" />
              <p className="text-neutral-400 text-lg leading-relaxed">
                Traveling solo and dating across countries requires more than just booking a flight. It's about styling, hair logistics, digital safety systems, and match-vetting procedures. 
              </p>
              <p className="text-cyan-400 font-bold text-base flex items-center gap-2">
                <Smile className="w-5 h-5" /> Click any card to expand my detailed handbook!
              </p>

              {/* Quick graphic/fact */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hidden lg:block">
                <p className="font-serif italic text-white/90">"The best travel protection is absolute confidence, impeccable planning, and a protective hairstyle that survives any climate."</p>
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mt-3">— Bako</p>
              </div>
            </div>

            {/* Accordion / Tab System */}
            <div className="lg:col-span-7 space-y-4" id="travel-tips-accordion">
              {TRAVEL_TIPS.map(tip => {
                const isOpen = expandedTip === tip.id;
                
                // Icon resolver mapping
                let TipIcon = Sparkles;
                if (tip.icon === "ShieldAlert") TipIcon = ShieldAlert;
                if (tip.icon === "HeartHandshake") TipIcon = HeartHandshake;
                if (tip.icon === "Briefcase") TipIcon = Briefcase;

                return (
                  <div 
                    key={tip.id}
                    className={`rounded-3xl border transition-all duration-300 ${
                      isOpen 
                        ? "bg-gradient-to-br from-pink-950/40 to-yellow-950/10 border-pink-500 shadow-lg shadow-pink-500/5" 
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setExpandedTip(isOpen ? null : tip.id)}
                      className="w-full p-6 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isOpen ? "bg-pink-600 text-white" : "bg-white/10 text-yellow-400"
                        }`}>
                          <TipIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{tip.category}</p>
                          <h3 className="font-serif font-bold text-lg sm:text-xl mt-0.5">{tip.title}</h3>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-90 text-pink-500" : ""}`} />
                    </button>

                    {/* Expandable details */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 border-t border-white/10 space-y-4 bg-black/10">
                            <p className="text-yellow-400 font-bold text-sm italic">
                              "{tip.summary}"
                            </p>
                            <ul className="space-y-3">
                              {tip.details.map((detail, dIdx) => (
                                <li key={dIdx} className="flex items-start space-x-2.5 text-neutral-300 text-sm sm:text-base leading-relaxed">
                                  <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 mt-0.5 shrink-0 font-bold text-xs">
                                    <Check className="w-3 h-3" />
                                  </span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-pink-600/5 blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-pink-600 font-extrabold text-sm tracking-widest uppercase">Let's Connect</span>
          <h2 className="font-serif font-black text-4xl sm:text-5xl text-slate-900 mt-2 mb-4 tracking-tight">
            Work With Me & Share Your Chronicles
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-12">
            Want to share your own international dating adventures? Looking to collaborate, book a matchmaking travel consult, or just ask a question? Shoot me a message, Sis!
          </p>

          <div className="bg-white rounded-[32px] p-6 sm:p-12 border-2 border-slate-100 shadow-xl text-left" id="contact-form-container">
            
            <AnimatePresence mode="wait">
              {!contactSubmitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleContactSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-extrabold text-neutral-700 uppercase tracking-widest mb-2">First Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Destiny"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-pink-500 focus:ring-0 bg-white text-neutral-950 font-medium transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-extrabold text-neutral-700 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. destiny@domain.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-pink-500 focus:ring-0 bg-white text-neutral-950 font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-neutral-700 uppercase tracking-widest mb-2">Tell me about your travel dreams...</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Share a story, pitch a collab, or ask a question. This is a secure channel!"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-pink-500 focus:ring-0 bg-white text-neutral-950 font-medium transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-yellow-500 text-white font-black text-base uppercase tracking-widest shadow-md hover:shadow-xl hover:brightness-105 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send to Bako</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-tr from-pink-600 to-yellow-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-pink-500/25">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-serif font-black text-3xl text-neutral-900">Your message is off, Sis!</h3>
                    <p className="text-neutral-600 text-lg max-w-md mx-auto">
                      Thank you for sharing your thoughts with me. Pack your bags and keep your passport ready—I will get back to you soon!
                    </p>
                  </div>

                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border-2 border-pink-600 text-pink-600 font-bold text-sm hover:bg-pink-600 hover:text-white transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social media connections */}
            <div className="mt-12 pt-8 border-t border-slate-100 text-center space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-600">Get Social With The Bako Chronicles</p>
              <div className="flex justify-center items-center gap-6">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-pink-600 font-bold text-sm transition-colors"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
                <span className="text-neutral-300">|</span>
                <a 
                  href="https://threads.net" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-pink-600 font-bold text-sm transition-colors"
                >
                  <AtSign className="w-4 h-4" /> Threads
                </a>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#000000] text-neutral-500 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-white/5 pb-12 mb-12">
            
            {/* Logo details */}
            <div className="text-left space-y-2">
              <span className="font-serif font-black text-2xl tracking-tighter text-white italic uppercase">
                THE BAKO CHRONICLES
              </span>
              <p className="text-sm text-neutral-400">
                Created with love, passport stamps, and sisterhood. Helping women date with courage and explore with absolute style.
              </p>
            </div>

            {/* Quote of the day */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center text-sm italic text-neutral-300">
              "You are the author of your own life. Make sure your stories have incredible views."
            </div>

            {/* Quick Links */}
            <div className="text-left md:text-right space-y-2 text-sm">
              <p className="font-bold text-white uppercase tracking-wider text-xs">Quick Navigation</p>
              <div className="flex flex-wrap md:justify-end gap-x-4 gap-y-2">
                <button onClick={() => scrollToSection("home")} className="hover:text-yellow-400 transition-colors cursor-pointer">Home</button>
                <button onClick={() => scrollToSection("about")} className="hover:text-yellow-400 transition-colors cursor-pointer">About</button>
                <button onClick={() => scrollToSection("stories")} className="hover:text-yellow-400 transition-colors cursor-pointer">Stories</button>
                <button onClick={() => scrollToSection("tips")} className="hover:text-yellow-400 transition-colors cursor-pointer">Travel Tips</button>
                <button onClick={() => scrollToSection("contact")} className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</button>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs space-y-4 sm:space-y-0 text-neutral-600 font-bold">
            <p>&copy; {new Date().getFullYear()} The Bako Chronicles. All rights reserved. Designed for women who wander. 🌍💖</p>
            <p className="flex items-center gap-1">Made by Bako <Smile className="w-3.5 h-3.5 text-yellow-400" /></p>
          </div>
        </div>
      </footer>

    </div>
  );
}

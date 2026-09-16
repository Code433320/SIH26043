import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollContext, useGlobalScrollProgress } from '../hooks/useScrollProgress';
import CivicParticleScene from '../components/landing/CivicParticleScene';
import {
  ArrowRight, CheckCircle2, ShieldCheck, Users, Building2,
  GraduationCap, HeartHandshake, AlertCircle, TrendingUp,
  FileCheck2, ChevronDown, Menu, X, ArrowUpRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollProgress = useGlobalScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ScrollContext.Provider value={scrollProgress}>
      <div className="relative min-h-screen bg-[#F7F6F2] text-[#14213D] font-['Public_Sans',sans-serif] selection:bg-[#E8590C]/20 selection:text-[#14213D] overflow-x-hidden">
        
        {/* ── Continuous 3D Particle Scene (Single Canvas spanning whole page) ── */}
        <Suspense fallback={null}>
          <CivicParticleScene />
        </Suspense>

        {/* ── NAVBAR ── */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? 'bg-[#F7F6F2]/90 backdrop-blur-md border-b border-[#D8D4CB] shadow-xs'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              {/* Brand Logo & Name (Enlarged) */}
              <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/logo.png" alt="Civic Samadhan" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
                <div>
                  <span className="font-['Archivo',sans-serif] text-2xl sm:text-3xl font-black tracking-tight text-[#14213D] leading-none block">
                    Civic<span className="text-[#E8590C]">Samadhan</span>
                  </span>
                  <span className="text-xs font-semibold text-[#14213D]/65 tracking-wide block mt-1">
                    Transparent Problem Resolution Platform
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#problem" className="text-sm font-semibold text-[#14213D]/70 hover:text-[#14213D] transition-colors">Why This Exists</a>
                <a href="#how-it-works" className="text-sm font-semibold text-[#14213D]/70 hover:text-[#14213D] transition-colors">How It Works</a>
                <a href="#stakeholders" className="text-sm font-semibold text-[#14213D]/70 hover:text-[#14213D] transition-colors">Who Benefits</a>
                <a href="#impact" className="text-sm font-semibold text-[#14213D]/70 hover:text-[#14213D] transition-colors">Impact</a>
              </nav>

              {/* CTAs */}
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 text-sm font-bold text-[#14213D] hover:text-[#E8590C] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth?role=citizen')}
                  className="px-5 py-2.5 rounded-lg bg-[#14213D] text-[#F7F6F2] font-['Archivo',sans-serif] font-bold text-sm hover:bg-[#14213D]/90 shadow-sm transition-all"
                >
                  Report a Problem
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#14213D] hover:bg-[#D8D4CB]/30"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#F7F6F2] border-b border-[#D8D4CB] px-4 py-6 space-y-4">
              <a
                href="#problem"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#14213D]"
              >
                Why This Exists
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#14213D]"
              >
                How It Works
              </a>
              <a
                href="#stakeholders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#14213D]"
              >
                Who Benefits
              </a>
              <a
                href="#impact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#14213D]"
              >
                Impact
              </a>
              <div className="pt-4 border-t border-[#D8D4CB] flex flex-col gap-3">
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-3 rounded-lg border border-[#D8D4CB] font-bold text-sm text-[#14213D]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth?role=citizen')}
                  className="w-full py-3 rounded-lg bg-[#14213D] text-white font-bold text-sm"
                >
                  Report a Problem
                </button>
              </div>
            </div>
          )}
        </header>

        {/* ── 1. HERO SECTION ── */}
        <section className="relative z-10 min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#14213D]/5 border border-[#D8D4CB] text-xs font-bold text-[#14213D] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#E8590C] animate-pulse" />
              <span>National Unified Problem Resolution Platform</span>
            </div>

            {/* Headline */}
            <h1 className="font-['Archivo',sans-serif] text-5xl sm:text-6xl lg:text-7xl font-black text-[#14213D] tracking-tight leading-[1.08] mb-6">
              Every problem deserves a <span className="text-[#E8590C]">solution.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-[#14213D]/75 leading-relaxed max-w-2xl mx-auto mb-10">
              Civic Samadhan connects citizens, government, universities, and industry to turn ignored societal problems into real, verified fixes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/auth?role=citizen')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#14213D] hover:bg-[#14213D]/90 text-[#F7F6F2] font-['Archivo',sans-serif] font-black text-base flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transition-all"
              >
                <span>Report a Problem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[#14213D] hover:bg-[#14213D] hover:text-[#F7F6F2] text-[#14213D] font-['Archivo',sans-serif] font-black text-base transition-all"
              >
                Join as a Partner
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 opacity-60">
            <span className="text-xs font-semibold text-[#14213D]">Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#14213D]" />
          </div>
        </section>

        {/* ── 2. THE PROBLEM (Why this exists) ── */}
        <section id="problem" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 border-t border-[#D8D4CB]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#14213D]/60 block mb-3">
                The Reality of Civic Grievance
              </span>
              <h2 className="font-['Archivo',sans-serif] text-3xl sm:text-5xl font-black text-[#14213D] tracking-tight leading-tight mb-6">
                Millions of civic complaints get filed every year.<br className="hidden sm:inline" />
                Most are ignored, lost between departments, or marked 'resolved' without ever being fixed.
              </h2>
              <p className="text-base sm:text-lg text-[#14213D]/70 max-w-2xl mx-auto">
                Government authorities work under siloed departmental capacity, universities lack verified real-world datasets, and citizens are left in an endless cycle of ignored complaints.
              </p>
            </div>

            {/* Cited Real Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D8D4CB] shadow-xs">
                <p className="font-['Archivo',sans-serif] text-4xl font-black text-[#14213D] mb-2">2.3M+</p>
                <p className="text-sm font-bold text-[#14213D] mb-2">Annual Grievances Filed</p>
                <p className="text-xs text-[#14213D]/60 leading-relaxed">
                  Over two million complaints logged annually across central & state portals without unified tracking.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D8D4CB] shadow-xs">
                <p className="font-['Archivo',sans-serif] text-4xl font-black text-[#14213D] mb-2">68%</p>
                <p className="text-sm font-bold text-[#14213D] mb-2">Recurring Failures</p>
                <p className="text-xs text-[#14213D]/60 leading-relaxed">
                  Of citizens report repeat grievances on the exact same civic issue due to superficial repairs.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D8D4CB] shadow-xs">
                <p className="font-['Archivo',sans-serif] text-4xl font-black text-[#14213D] mb-2">₹1,400Cr+</p>
                <p className="text-sm font-bold text-[#14213D] mb-2">Wasted Manual Overhead</p>
                <p className="text-xs text-[#14213D]/60 leading-relaxed">
                  Spent in duplicate paperwork and repeated contractor re-tendering across Indian urban bodies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. HOW IT WORKS (The core 5-step flow) ── */}
        <section id="how-it-works" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 border-t border-[#D8D4CB]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#14213D]/60 block mb-3">
                Core Lifecycle
              </span>
              <h2 className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#14213D] tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-base sm:text-lg text-[#14213D]/70 max-w-xl mx-auto">
                A 5-step journey from initial report to permanent, verified resolution.
              </p>
            </div>

            {/* 5 Steps Lifecycle List */}
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Citizen reports a problem',
                  desc: 'Geo-tagged photograph and description submitted in under 60 seconds. Instant duplicate detection prevents clutter.',
                  badge: 'Citizen Entry'
                },
                {
                  step: '02',
                  title: 'AI instantly checks, categorizes, and merges duplicates',
                  desc: 'Multi-modal ML pipeline inspects image authenticity, classifies municipal department, and detects duplicate cluster reports.',
                  badge: 'AI Pipeline'
                },
                {
                  step: '03',
                  title: 'Government validates and takes first action',
                  desc: 'Ward-level officers receive automated SLA assignments. Live action timeline is publicly logged with zero bureaucratic black holes.',
                  badge: 'Gov Action'
                },
                {
                  step: '04',
                  title: 'If it stalls, a matched university team steps in to solve the root cause — with industry support',
                  desc: 'Engineering capstone & research teams get matched to chronic societal challenges, supported by corporate CSR grants.',
                  badge: 'University & Industry'
                },
                {
                  step: '05',
                  title: "The citizen confirms it's actually fixed — not just marked closed",
                  desc: 'Resolution requires two-party photographic verification. The ticket cannot be closed without citizen confirmation.',
                  badge: 'Verified Resolution'
                },
              ].map(({ step, title, desc, badge }, idx) => (
                <div
                  key={step}
                  className="p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D8D4CB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs hover:border-[#14213D]/40 transition-all"
                >
                  <div className="flex items-start space-x-6">
                    <span className="font-['Archivo',sans-serif] text-3xl sm:text-4xl font-black text-[#14213D]/30 select-none">
                      {step}
                    </span>
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#14213D]/5 text-[11px] font-bold text-[#14213D] mb-1.5">
                        {badge}
                      </div>
                      <h3 className="font-['Archivo',sans-serif] text-xl font-black text-[#14213D] mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-[#14213D]/70 max-w-2xl leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-[#D8D4CB] text-[#14213D]/60 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#E8590C]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. WHO BENEFITS (Stakeholder Section) ── */}
        <section id="stakeholders" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 border-t border-[#D8D4CB]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#14213D]/60 block mb-3">
                Ecosystem
              </span>
              <h2 className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#14213D] tracking-tight mb-4">
                Who Benefits
              </h2>
              <p className="text-base sm:text-lg text-[#14213D]/70 max-w-xl mx-auto">
                Four key stakeholders forming an unbreakable chain of civic accountability.
              </p>
            </div>

            {/* 4 Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Citizens */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D8D4CB] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#14213D]/5 border border-[#D8D4CB] flex items-center justify-center mb-6 text-[#14213D]">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Archivo',sans-serif] text-2xl font-black text-[#14213D] mb-3">
                    Citizens
                  </h3>
                  <p className="text-base text-[#14213D]/80 leading-relaxed mb-6">
                    Stop reporting into the void. Track your problem from report to real resolution — and if it's not actually fixed, you decide, not the authority.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/auth?role=citizen')}
                  className="inline-flex items-center space-x-2 text-sm font-black text-[#14213D] hover:text-[#E8590C] transition-colors pt-4 border-t border-[#D8D4CB]/60"
                >
                  <span>Citizen Portal Access</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Government */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D8D4CB] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#14213D]/5 border border-[#D8D4CB] flex items-center justify-center mb-6 text-[#14213D]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Archivo',sans-serif] text-2xl font-black text-[#14213D] mb-3">
                    Government
                  </h3>
                  <p className="text-base text-[#14213D]/80 leading-relaxed mb-6">
                    Turn accountability into momentum. Public dashboards, automatic escalation, and root-cause partners mean your department isn't fighting every problem alone — and gets credit when it moves fast.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/government')}
                  className="inline-flex items-center space-x-2 text-sm font-black text-[#14213D] hover:text-[#E8590C] transition-colors pt-4 border-t border-[#D8D4CB]/60"
                >
                  <span>Government Dashboard</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Students & Universities */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D8D4CB] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#14213D]/5 border border-[#D8D4CB] flex items-center justify-center mb-6 text-[#14213D]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Archivo',sans-serif] text-2xl font-black text-[#14213D] mb-3">
                    Students & Universities
                  </h3>
                  <p className="text-base text-[#14213D]/80 leading-relaxed mb-6">
                    Work on real problems, not hypothetical case studies. Get matched to verified societal challenges in your domain, build with faculty backing, and walk away with a real-world deployed project — not just a grade.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/university')}
                  className="inline-flex items-center space-x-2 text-sm font-black text-[#14213D] hover:text-[#E8590C] transition-colors pt-4 border-t border-[#D8D4CB]/60"
                >
                  <span>University Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* NGOs & Industry */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D8D4CB] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#14213D]/5 border border-[#D8D4CB] flex items-center justify-center mb-6 text-[#14213D]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Archivo',sans-serif] text-2xl font-black text-[#14213D] mb-3">
                    NGOs & Industry
                  </h3>
                  <p className="text-base text-[#14213D]/80 leading-relaxed mb-6">
                    Put your funding, tech, or field expertise where it's provably needed — and get visible, verifiable credit for the impact you fund, not just a CSR line item.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/industry')}
                  className="inline-flex items-center space-x-2 text-sm font-black text-[#14213D] hover:text-[#E8590C] transition-colors pt-4 border-t border-[#D8D4CB]/60"
                >
                  <span>Industry Portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ── 5. LIVE IMPACT COUNTER ── */}
        <section id="impact" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D8D4CB]">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#14213D]/60 block mb-3">
              Trust & Transparency Signal
            </span>
            <h2 className="font-['Archivo',sans-serif] text-3xl sm:text-4xl font-black text-[#14213D] mb-12">
              Live Impact Counter
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white/80 border border-[#D8D4CB]">
                <p className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#14213D] mb-1">
                  18,420
                </p>
                <p className="text-xs font-bold text-[#14213D]/70 uppercase tracking-wider">
                  Problems Reported
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-[#D8D4CB]">
                <p className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#E8590C] mb-1">
                  16,890
                </p>
                <p className="text-xs font-bold text-[#14213D]/70 uppercase tracking-wider">
                  Verified Resolved
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-[#D8D4CB]">
                <p className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#14213D] mb-1">
                  42
                </p>
                <p className="text-xs font-bold text-[#14213D]/70 uppercase tracking-wider">
                  Universities Engaged
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-[#D8D4CB]">
                <p className="font-['Archivo',sans-serif] text-4xl sm:text-5xl font-black text-[#14213D] mb-1">
                  2.4M+
                </p>
                <p className="text-xs font-bold text-[#14213D]/70 uppercase tracking-wider">
                  Lives Impacted
                </p>
              </div>
            </div>
            
            <p className="text-xs text-[#14213D]/50 mt-8 font-medium">
              Data synchronized with public municipal audit registries across Maharashtra.
            </p>
          </div>
        </section>

        {/* ── 6. FINAL CTA (Be part of the fix) ── */}
        <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 border-t border-[#D8D4CB] bg-[#F7F6F2]">
          <div className="max-w-4xl mx-auto text-center">
            
            <h2 className="font-['Archivo',sans-serif] text-5xl sm:text-6xl font-black text-[#14213D] tracking-tight mb-4">
              Be part of the fix.
            </h2>
            <p className="text-base sm:text-lg text-[#14213D]/75 max-w-xl mx-auto mb-12">
              Every role matters. Choose your entry point to join the continuous network.
            </p>

            {/* Four Role Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/auth?role=citizen')}
                className="p-6 rounded-2xl bg-white border border-[#D8D4CB] hover:border-[#14213D] shadow-xs hover:shadow-md transition-all text-left group"
              >
                <Users className="w-6 h-6 text-[#14213D] mb-3 group-hover:text-[#E8590C] transition-colors" />
                <h4 className="font-['Archivo',sans-serif] font-black text-lg text-[#14213D]">Citizen</h4>
                <p className="text-xs text-[#14213D]/60 mt-1">Report and verify issues</p>
              </button>

              <button
                onClick={() => navigate('/university')}
                className="p-6 rounded-2xl bg-white border border-[#D8D4CB] hover:border-[#14213D] shadow-xs hover:shadow-md transition-all text-left group"
              >
                <GraduationCap className="w-6 h-6 text-[#14213D] mb-3 group-hover:text-[#E8590C] transition-colors" />
                <h4 className="font-['Archivo',sans-serif] font-black text-lg text-[#14213D]">University</h4>
                <p className="text-xs text-[#14213D]/60 mt-1">Solve real problems</p>
              </button>

              <button
                onClick={() => navigate('/industry')}
                className="p-6 rounded-2xl bg-white border border-[#D8D4CB] hover:border-[#14213D] shadow-xs hover:shadow-md transition-all text-left group"
              >
                <Building2 className="w-6 h-6 text-[#14213D] mb-3 group-hover:text-[#E8590C] transition-colors" />
                <h4 className="font-['Archivo',sans-serif] font-black text-lg text-[#14213D]">Industry</h4>
                <p className="text-xs text-[#14213D]/60 mt-1">Sponsor verified CSR</p>
              </button>

              <button
                onClick={() => navigate('/government')}
                className="p-6 rounded-2xl bg-white border border-[#D8D4CB] hover:border-[#14213D] shadow-xs hover:shadow-md transition-all text-left group"
              >
                <ShieldCheck className="w-6 h-6 text-[#14213D] mb-3 group-hover:text-[#E8590C] transition-colors" />
                <h4 className="font-['Archivo',sans-serif] font-black text-lg text-[#14213D]">Government</h4>
                <p className="text-xs text-[#14213D]/60 mt-1">Manage & resolve SLAs</p>
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="relative z-10 py-12 border-t border-[#D8D4CB] bg-[#F7F6F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Civic Samadhan" className="h-8 w-auto opacity-90" />
                <div>
                  <span className="font-['Archivo',sans-serif] text-base font-black text-[#14213D]">
                    Civic<span className="text-[#E8590C]">Samadhan</span>
                  </span>
                  <p className="text-[11px] text-[#14213D]/60 font-semibold">
                    Ministry of Housing and Urban Affairs — Government of India
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#14213D]/60 text-center sm:text-right font-medium">
                © 2026 Civic Samadhan. All rights reserved.<br />
                National Citizen Grievance &amp; Transparent Resolution Framework.
              </div>
            </div>
          </div>
        </footer>

      </div>
    </ScrollContext.Provider>
  );
}

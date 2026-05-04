import { Laptop, Smartphone } from "lucide-react";
import WorkflowLoop from "@/components/home/WorkflowLoop";
import HeroLanding from "@/components/home/HeroLanding";
import PillarFlow from "@/components/home/PillarFlow";
import AgenticSection from "@/components/home/AgenticSection";
import SectionSpy from "@/components/home/SectionSpy";
import Reveal from "@/components/home/Reveal";

const BETA_LINK = "/beta";

function CTAButton({ children, large = false }: { children: React.ReactNode; large?: boolean }) {
  return (
    <a
      href={BETA_LINK}
      className={`inline-flex items-center justify-center rounded-lg font-semibold text-white
        bg-[#c25b3a] hover:bg-[#d96c47] transition-all duration-300
        shadow-[0_10px_40px_-10px_rgba(194,91,58,0.6)] hover:shadow-[0_14px_50px_-8px_rgba(217,108,71,0.75)]
        hover:scale-[1.03] active:scale-[0.99]
        ${large ? "px-9 py-4 text-lg" : "px-7 py-3 text-base"}`}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#c25b3a] font-medium mb-5">
      {children}
    </p>
  );
}

const Index = () => {
  return (
    <>
      <SectionSpy />

      <main className="relative" style={{ zIndex: 2, color: "#e8ecf1" }}>
        <HeroLanding />

        {/* ─────────── HERO ─────────── */}
        <section
          id="hero"
          className="cc-anchor relative min-h-screen flex items-center justify-center px-5 md:px-8 pt-24 pb-16 md:pt-28 md:pb-24"
        >
          <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal className="text-center lg:text-left">
              <Eyebrow>The Operating System for Ag Services</Eyebrow>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                The operating system for{" "}
                <span className="text-[#d96c47]">Ag services.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#b9c2d2] max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
                From quote to insight, one platform runs your business — so you can focus on the farmers you serve.
              </p>
              <div className="flex justify-center lg:justify-start">
                <CTAButton large>Join the Beta</CTAButton>
              </div>
            </Reveal>

            <Reveal delayMs={150} className="flex items-center justify-center">
              <div className="relative w-full">
                <div className="absolute inset-0 -z-10 rounded-full bg-[#c25b3a]/10 blur-3xl" />
                <WorkflowLoop />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── 2 · AI THAT WORKS FOR YOU ─────────── */}
        <section id="ai" className="cc-anchor relative px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Eyebrow>AI-Native · Human-Led</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-7">
                AI is here. We use it to make your business better —{" "}
                <span className="text-[#d96c47]">not to replace you.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#b9c2d2] leading-relaxed">
                Spray applicators, custom harvesters, and ag service operators built this industry on
                relationships, expertise, and grit. We're not here to automate that away. We're here to take
                the tedious off your plate — quoting, routing, paperwork, the back-and-forth — so you can
                spend your time on the farmers you serve.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─────────── 3 · 4-PILLAR WALKTHROUGH ─────────── */}
        <section id="pillars" className="cc-anchor relative px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto">
            <Reveal className="text-center mb-14">
              <Eyebrow>One Platform · Four Connected Pillars</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
                Every job <span className="text-[#d96c47]">feeds the next.</span>
              </h2>
              <p className="text-[#b9c2d2] text-lg max-w-2xl mx-auto">
                One platform connects every part of your operation. Each pillar produces data the next pillar uses to get smarter — automation and insight you cannot get from a stack of disconnected tools.
              </p>
            </Reveal>
            <Reveal delayMs={120}>
              <PillarFlow />
            </Reveal>
          </div>
        </section>

        {/* ─────────── 3.5 · BUILT ON AN AGENTIC PLATFORM ─────────── */}
        <section id="agentic" className="cc-anchor relative px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <Reveal>
              <Eyebrow>Built on an Agentic Platform</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-7">
                Bespoke. Local. <span className="text-[#d96c47]">Private by default.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#b9c2d2] leading-relaxed">
                Cloud Cowboy isn't built on someone else's API. The agents that quote your jobs, plan your missions, and run your operations are bespoke and local — purpose-built for your business and running entirely within Cloud Cowboy. Your data, your customers' data, your contracts — all handled internally, end to end.
              </p>
            </Reveal>
          </div>
          <Reveal delayMs={120}>
            <AgenticSection />
          </Reveal>
        </section>

        {/* ─────────── 4 · HARDWARE AGNOSTIC ─────────── */}
        <section id="hardware" className="cc-anchor relative px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Eyebrow>Hardware Agnostic</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-7">
                All you need is a computer{" "}
                <span className="text-[#d96c47]">and a phone.</span>
              </h2>
              <p className="text-lg text-[#b9c2d2] leading-relaxed mb-14 max-w-3xl mx-auto">
                Cloud Cowboy doesn't sell you a drone. We don't sell you a tractor. We work with the
                equipment you already own and the equipment you'll own next. No proprietary hardware. No
                vendor lock-in. Just software that bends to your business — not the other way around.
              </p>
            </Reveal>

            <Reveal delayMs={150}>
              <div className="flex items-center justify-center gap-8 md:gap-14">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative p-6 rounded-2xl bg-[#1a2332]/70 border border-[#c25b3a]/30 backdrop-blur-sm animate-pulse-glow">
                    <Laptop className="w-12 h-12 md:w-14 md:h-14 text-[#d96c47]" />
                  </div>
                  <span className="text-xs tracking-[0.25em] text-[#8b95a8]">COMPUTER</span>
                </div>

                <div className="flex-1 max-w-[180px] h-px relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c25b3a]/0 via-[#d96c47] to-[#c25b3a]/0" />
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-[#d96c47] shadow-[0_0_12px_rgba(217,108,71,0.9)] animate-pulse-glow" />
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="relative p-6 rounded-2xl bg-[#1a2332]/70 border border-[#c25b3a]/30 backdrop-blur-sm animate-pulse-glow">
                    <Smartphone className="w-12 h-12 md:w-14 md:h-14 text-[#d96c47]" />
                  </div>
                  <span className="text-xs tracking-[0.25em] text-[#8b95a8]">PHONE</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── 5 · FOCUS ─────────── */}
        <section id="focus" className="cc-anchor relative px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Eyebrow>What Matters</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-7">
                Get out of the weeds.{" "}
                <span className="text-[#d96c47]">Back to the field.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#b9c2d2] leading-relaxed">
                Most Ag service owners spend half their day on quoting, scheduling, dispatch, and chasing
                payment. That's the time you're not in the field. That's the time you're not with the farmers
                who trust you. Cloud Cowboy takes that work off your plate — so the time you spend running
                your business goes back to the people you serve.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─────────── 6 · WE BELIEVE IN AG ─────────── */}
        <section id="believe" className="cc-anchor relative px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Eyebrow>Our Stand</Eyebrow>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                We believe in <span className="text-[#d96c47]">Ag.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#b9c2d2] leading-relaxed">
                This industry feeds the country. It's also one of the last industries where most of the work
                still runs on phone calls, paper, and word of mouth. We built Cloud Cowboy to change that —
                not by getting in your way, but by getting the noise out of it. Cloud Cowboy is here to serve
                the Ag industry, however we can.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─────────── 7 · FINAL CTA ─────────── */}
        <section
          id="cta"
          className="cc-anchor relative px-5 md:px-8 py-20 md:py-28 flex items-center justify-center"
        >
          <Reveal className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-10">
              Ready to focus on{" "}
              <span className="text-[#d96c47]">what matters?</span>
            </h2>
            <CTAButton large>Join the Beta</CTAButton>
          </Reveal>
        </section>
      </main>
    </>
  );
};

export default Index;

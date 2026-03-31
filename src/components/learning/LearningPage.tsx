import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Beaker, Clock, ChevronRight, Trophy, ArrowRight, Lock, CheckCircle } from "lucide-react";

import { CHAPTERS } from "../../lib/learningData";
import ConceptModal from "./ConceptModal";

type Props = { onEnterLab: () => void };

const STAT_ITEMS = [
  { value: "4", label: "Core Modules", color: "#4fc3f7" },
  { value: "12", label: "Sections", color: "#81c784" },
  { value: "12", label: "Quiz Questions", color: "#ffb74d" },
  { value: "2023", label: "FDA Approved", color: "#ce93d8" },
];

export default function LearningPage({ onEnterLab }: Props) {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("crispr-completed");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const chapter = CHAPTERS.find(c => c.id === activeChapter) ?? null;
  const allDone = completed.size === CHAPTERS.length;
  const progressPct = Math.round((completed.size / CHAPTERS.length) * 100);

  useEffect(() => {
    if (allDone && completed.size > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [allDone, completed.size]);

  const handleComplete = (id: string) => {
    setCompleted(prev => {
      const updated = new Set([...prev, id]);
      localStorage.setItem("crispr-completed", JSON.stringify([...updated]));
      return updated;
    });
    setActiveChapter(null);
  };

  return (
    <div className="lp-root">
      {/* Ambient background orbs */}
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />

      {/* Confetti burst */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="lp-confetti-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="lp-confetti-dot"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ["#4fc3f7", "#81c784", "#ffb74d", "#ce93d8", "#ef9a9a"][i % 5],
                }}
                initial={{ y: -20, opacity: 1, scale: 0 }}
                animate={{ y: window.innerHeight + 100, opacity: 0, scale: 1, rotate: Math.random() * 720 }}
                transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.5, ease: "easeIn" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <motion.div
          className="lp-hero-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="lp-hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BookOpen size={14} />
            INTERACTIVE LEARNING PATH
          </motion.div>

          <h1 className="lp-hero-title">
            Master <span className="lp-gradient-text">CRISPR</span><br />
            Gene Editing
          </h1>

          <p className="lp-hero-sub">
            From molecular scissors to FDA-approved therapies. Four research-grade
            modules with interactive diagrams, real clinical examples, and knowledge checks.
          </p>

          {/* Stat row */}
          <div className="lp-stats-row">
            {STAT_ITEMS.map((s, i) => (
              <motion.div
                key={s.label}
                className="lp-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="lp-stat-value" style={{ color: s.color }}>{s.value}</span>
                <span className="lp-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            className="lp-progress-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="lp-progress-header">
              <span className="lp-progress-label">Your Progress</span>
              <span className="lp-progress-pct" style={{ color: progressPct === 100 ? "#81c784" : "#4fc3f7" }}>
                {progressPct}%
              </span>
            </div>
            <div className="lp-progress-track">
              <motion.div
                className="lp-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="lp-progress-sub">{completed.size} of {CHAPTERS.length} modules complete</div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── CHAPTER GRID ── */}
      <section className="lp-chapters-section">
        <div className="lp-section-label">
          <Beaker size={14} />
          SELECT A MODULE
        </div>

        <div className="lp-chapter-grid">
          {CHAPTERS.map((ch, i) => {
            const isCompleted = completed.has(ch.id);
            const isLocked = i > 0 && !completed.has(CHAPTERS[i - 1].id);
            const isHovered = hoveredCard === ch.id;

            return (
              <motion.div
                key={ch.id}
                className={`lp-chapter-card ${isCompleted ? "lp-card-done" : ""} ${isLocked ? "lp-card-locked" : ""}`}
                style={{ "--ch-color": ch.color, "--ch-dark": ch.accentDark } as React.CSSProperties}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                whileHover={!isLocked ? { y: -6, transition: { duration: 0.2 } } : {}}
                onClick={() => !isLocked && setActiveChapter(ch.id)}
                onHoverStart={() => setHoveredCard(ch.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                {/* Glow effect */}
                <div className="lp-card-glow" />

                {/* Top row */}
                <div className="lp-card-top">
                  <span className="lp-card-num" style={{ color: ch.color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="lp-card-badges">
                    <span className="lp-card-time">
                      <Clock size={11} />
                      {ch.estimatedMinutes} min
                    </span>
                    {isCompleted && (
                      <motion.span
                        className="lp-card-done-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle size={12} />
                        Done
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Emoji icon */}
                <div className="lp-card-emoji">{ch.emoji}</div>

                {/* Text */}
                <h3 className="lp-card-title">{ch.title}</h3>
                <p className="lp-card-sub">{ch.subtitle}</p>

                {/* Section pills */}
                <div className="lp-card-sections">
                  {ch.sections.map((s, si) => (
                    <span key={si} className="lp-section-pill">{s.heading}</span>
                  ))}
                </div>

                {/* CTA */}
                <div className="lp-card-cta">
                  {isLocked ? (
                    <span className="lp-card-locked-msg">
                      <Lock size={12} />
                      Complete previous module
                    </span>
                  ) : (
                    <motion.span
                      className="lp-card-start"
                      style={{ color: ch.color }}
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isCompleted ? "Review" : "Start"} <ChevronRight size={14} />
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── ALL DONE CTA ── */}
      <AnimatePresence>
        {allDone && (
          <motion.section
            className="lp-finish-section"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lp-finish-card">
              <div className="lp-finish-glow" />
              <Trophy className="lp-finish-trophy" size={52} strokeWidth={1.5} />
              <div className="lp-finish-badge">All Modules Complete</div>
              <h2 className="lp-finish-title">You're ready to design.</h2>
              <p className="lp-finish-sub">
                You now understand the biology, the deletion strategy, how cells repair DNA,
                and how CRISPR is delivered. Time to put it into practice.
              </p>
              <motion.button
                className="lp-finish-btn"
                onClick={onEnterLab}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Open the Designer Tool
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {chapter && (
          <ConceptModal
            chapter={chapter}
            onClose={() => setActiveChapter(null)}
            onComplete={() => handleComplete(chapter.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
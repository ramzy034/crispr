import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Beaker, Clock, ChevronRight, Trophy, ArrowRight, Lock, CheckCircle, RotateCcw } from "lucide-react";

import { CHAPTERS } from "../../lib/learningData";
import { CHAPTERS_TR } from "../../lib/learningDataTR";
import ConceptModal from "./ConceptModal";
import TimelineSection from "./TimelineSection";
import { useLang } from "../../lib/LangContext";
import { UI } from "../../lib/translations";

type Props = { onEnterLab: () => void };

const FUN_FACTS_EN = [
  "Bacteria use CRISPR to 'remember' viruses that infected them — storing viral DNA fragments as immune memory.",
  "The first CRISPR-edited food to reach consumers was a soybean with reduced saturated fat, approved by the FDA.",
  "Scientists encoded an animated GIF into bacteria's DNA using CRISPR — information stored in living cells.",
  "The Cas9 protein is about 160,000 daltons — roughly the weight of 160 million hydrogen atoms.",
  "Over 10,000 scientific papers on CRISPR were published in 2022 alone.",
  "CRISPR can target a sequence 1 in 3.2 billion — equivalent to finding one specific word in a 3,200-book library.",
  "Victoria Gray, treated with CRISPR for sickle cell in 2019, reported being pain-free for the first time in her life.",
  "The Nobel Prize for CRISPR was awarded just 8 years after its programmability was demonstrated — extraordinarily fast.",
];

const FUN_FACTS_TR = [
  "Bakteriler, viral DNA parçalarını bağışıklık belleği olarak saklayarak kendilerini enfekte eden virüsleri 'hatırlamak' için CRISPR kullanır.",
  "Tüketicilere ulaşan ilk CRISPR düzenlenmiş gıda, FDA tarafından onaylanan düşük doymuş yağlı bir soya fasulyesiydi.",
  "Bilim insanları, CRISPR kullanarak bakterilerin DNA'sına animasyonlu bir GIF kodladı — canlı hücrelerde depolanan bilgi.",
  "Cas9 proteini yaklaşık 160.000 Dalton ağırlığındadır — yaklaşık 160 milyon hidrojen atomu ağırlığı.",
  "2022 yılında yalnızca tek yılda 10.000'den fazla CRISPR bilimsel makalesi yayımlandı.",
  "CRISPR, 3,2 milyar içinden 1 diziyi hedef alabilir — bu, 3.200 kitaplık bir kütüphanede tek bir kelimeyi bulmaya eşdeğerdir.",
  "2019'da orak hücre için CRISPR ile tedavi edilen Victoria Gray, hayatında ilk kez ağrısız olduğunu bildirdi.",
  "CRISPR için Nobel Ödülü, programlanabilirliğinin gösterilmesinden sadece 8 yıl sonra verildi — inanılmaz derecede hızlı.",
];

export default function LearningPage({ onEnterLab }: Props) {
  const { lang } = useLang();
  const T = UI[lang];
  const chapters = lang === "tr" ? CHAPTERS_TR : CHAPTERS;

  const STAT_ITEMS = [
    { value: "5", label: T.lpStatModules, color: "#4fc3f7" },
    { value: "15", label: T.lpStatSections, color: "#81c784" },
    { value: "15", label: T.lpStatQuiz, color: "#ffb74d" },
    { value: "2023", label: T.lpStatFDA, color: "#ce93d8" },
  ];

  const funFacts = lang === "tr" ? FUN_FACTS_TR : FUN_FACTS_EN;
  const [factIndex, setFactIndex] = useState(0);

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const chapter = chapters.find((c) => c.id === activeChapter) ?? null;
  const allDone = completed.size === chapters.length;
  const progressPct = Math.round((completed.size / chapters.length) * 100);

  useEffect(() => {
    if (allDone && completed.size > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [allDone, completed.size]);

  // Cycle fun facts every 8 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setFactIndex((i) => (i + 1) % funFacts.length);
    }, 8000);
    return () => clearInterval(t);
  }, [funFacts.length]);

  const handleComplete = (id: string) => {
    setCompleted((prev) => {
      const updated = new Set([...prev, id]);
      localStorage.setItem("crispr-completed", JSON.stringify([...updated]));
      return updated;
    });
    setActiveChapter(null);
  };

  const handleReset = () => {
    localStorage.removeItem("crispr-completed");
    setCompleted(new Set());
    setShowResetConfirm(false);
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
            {T.lpBadge}
          </motion.div>

          <h1 className="lp-hero-title">
            {T.lpTitleBefore}
            <span className="lp-gradient-text">CRISPR</span>
            <br />
            {T.lpTitleAfter}
          </h1>

          <p className="lp-hero-sub">{T.lpSub}</p>

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
                <span className="lp-stat-value" style={{ color: s.color }}>
                  {s.value}
                </span>
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
              <span className="lp-progress-label">{T.lpProgressLabel}</span>
              <span
                className="lp-progress-pct"
                style={{ color: progressPct === 100 ? "#81c784" : "#4fc3f7" }}
              >
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
            <div className="lp-progress-footer">
              <span className="lp-progress-sub">
                {completed.size} {T.lpModulesOf} {chapters.length} {T.lpModulesComplete}
              </span>
              {completed.size > 0 && (
                <button
                  className="lp-reset-btn"
                  onClick={() => setShowResetConfirm(true)}
                  title={T.resetProgressBtn}
                >
                  <RotateCcw size={12} />
                  {T.resetProgressBtn}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FUN FACT CARD ── */}
      <section className="lp-fact-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            className="lp-fact-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <span className="lp-fact-label">💡 {T.factCardTitle}</span>
            <p className="lp-fact-text">{funFacts[factIndex]}</p>
            <div className="lp-fact-dots">
              {funFacts.map((_, i) => (
                <button
                  key={i}
                  className={`lp-fact-dot ${i === factIndex ? "lp-fact-dot-active" : ""}`}
                  onClick={() => setFactIndex(i)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── CHAPTER GRID ── */}
      <section className="lp-chapters-section">
        <div className="lp-section-label">
          <Beaker size={14} />
          {T.lpSelectModule}
        </div>

        <div className="lp-chapter-grid">
          {chapters.map((ch, i) => {
            const isCompleted = completed.has(ch.id);
            const isLocked = i > 0 && !completed.has(chapters[i - 1].id);
            const isHovered = hoveredCard === ch.id;

            return (
              <motion.div
                key={ch.id}
                className={`lp-chapter-card ${isCompleted ? "lp-card-done" : ""} ${isLocked ? "lp-card-locked" : ""}`}
                style={{ "--ch-color": ch.color, "--ch-dark": ch.accentDark } as React.CSSProperties}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
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
                        {T.lpDone}
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
                    <span key={si} className="lp-section-pill">
                      {s.heading}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="lp-card-cta">
                  {isLocked ? (
                    <span className="lp-card-locked-msg">
                      <Lock size={12} />
                      {T.lpLocked}
                    </span>
                  ) : (
                    <motion.span
                      className="lp-card-start"
                      style={{ color: ch.color }}
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isCompleted ? T.lpReview : T.lpStart}{" "}
                      <ChevronRight size={14} />
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <TimelineSection />

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
              <Trophy
                className="lp-finish-trophy"
                size={52}
                strokeWidth={1.5}
              />
              <div className="lp-finish-badge">{T.lpAllDone}</div>
              <h2 className="lp-finish-title">{T.lpReadyTitle}</h2>
              <p className="lp-finish-sub">{T.lpReadySub}</p>
              <motion.button
                className="lp-finish-btn"
                onClick={onEnterLab}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {T.lpOpenLab}
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

      {/* Reset confirm dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="lp-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              className="lp-confirm-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="lp-confirm-msg">{T.resetConfirmMsg}</p>
              <div className="lp-confirm-actions">
                <button className="lp-confirm-cancel" onClick={() => setShowResetConfirm(false)}>
                  {T.resetConfirmNo}
                </button>
                <button className="lp-confirm-yes" onClick={handleReset}>
                  {T.resetConfirmYes}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy, Shuffle } from "lucide-react";
import type { QuizQuestion } from "../../lib/learningData";
import { useLang } from "../../lib/LangContext";
import { UI } from "../../lib/translations";

// How many questions to draw per attempt (random subset when pool is larger)
const QUESTIONS_PER_ATTEMPT = 3;

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

type Props = {
  questions: QuizQuestion[];
  color: string;
  onPass: () => void;
};

export default function QuizBlock({ questions, color, onPass }: Props) {
  const { lang } = useLang();
  const T = UI[lang];

  // Randomized subset — regenerated on each retry via retryKey
  const [retryKey, setRetryKey] = useState(0);
  const active = useMemo(
    () => questions.length > QUESTIONS_PER_ATTEMPT
      ? pickRandom(questions, QUESTIONS_PER_ATTEMPT)
      : [...questions].sort(() => Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [retryKey, questions],
  );

  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleRetry = () => {
    setRetryKey(k => k + 1); // triggers new random set
    setQi(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setDone(false);
    setAnswers([]);
  };

  const q = active[qi];

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === q.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, correct]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (qi + 1 < active.length) {
      setQi(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const pct = Math.round((score / active.length) * 100);
    const passed = score >= Math.ceil(active.length * 0.6);
    return (
      <motion.div
        className="qb-results"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="qb-score-ring" style={{ "--ring-color": passed ? color : "#ef9a9a", "--ring-pct": `${pct}` } as React.CSSProperties}>
          <Trophy size={28} color={passed ? color : "#ef9a9a"} />
          <div className="qb-score-number" style={{ color: passed ? color : "#ef9a9a" }}>
            {score}/{active.length}
          </div>
        </div>

        <h3 className="qb-result-title">
          {pct === 100 ? T.qbPerfect : passed ? T.qbPassed : T.qbFailed}
        </h3>
        <p className="qb-result-sub">
          {passed ? T.qbPassSub : T.qbFailSub}
        </p>

        {questions.length > QUESTIONS_PER_ATTEMPT && (
          <p className="qb-pool-note">
            <Shuffle size={11} style={{ display: "inline", marginRight: 4 }} />
            {active.length} of {questions.length} questions drawn at random — retry for a different set.
          </p>
        )}

        <div className="qb-answer-row">
          {answers.map((correct, i) => (
            <div key={i} className={`qb-answer-dot ${correct ? "qb-dot-correct" : "qb-dot-wrong"}`}>
              {correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
            </div>
          ))}
        </div>

        <div className="qb-result-actions">
          <button className="qb-retry-btn" onClick={handleRetry}>
            ↺ {T.qbRetry}
            {questions.length > QUESTIONS_PER_ATTEMPT && <span className="qb-retry-shuffle"> · new questions</span>}
          </button>
          <button
            className="qb-complete-btn"
            style={{ background: color }}
            onClick={onPass}
          >
            {passed ? T.qbComplete : T.qbCompleteAnyway}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="qb-wrap">
      {/* Progress dots + running score */}
      <div className="qb-progress-row">
        <div className="qb-dots">
          {active.map((_, i) => (
            <div
              key={i}
              className={`qb-q-dot ${i < qi ? "qb-dot-done" : ""} ${i === qi ? "qb-dot-current" : ""}`}
              style={i === qi ? { background: color } : {}}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {questions.length > QUESTIONS_PER_ATTEMPT && (
            <span className="qb-pool-badge" title={`${questions.length} questions in pool — ${active.length} drawn randomly`}>
              <Shuffle size={10} /> {active.length}/{questions.length}
            </span>
          )}
          {answers.length > 0 && (
            <div className="qb-running-score">
              <span style={{ color: score === answers.length ? "#4ADE80" : "#ffca28" }}>{score}</span>
              <span className="qb-running-denom">/{answers.length}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qi}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="qb-q-label" style={{ color }}>
            {T.qbQuestion} {qi + 1} <span className="qb-q-label-of">{T.qbOf} {active.length}</span>
          </div>
          <h3 className="qb-question">{q.question}</h3>

          <div className="qb-options">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = submitted && i === q.correct;
              const isWrong = submitted && isSelected && i !== q.correct;

              return (
                <motion.button
                  key={i}
                  className={`qb-option ${isSelected ? "qb-opt-selected" : ""} ${isCorrect ? "qb-opt-correct" : ""} ${isWrong ? "qb-opt-wrong" : ""}`}
                  style={isSelected && !submitted ? { borderColor: color, background: `${color}15` } : {}}
                  onClick={() => !submitted && setSelected(i)}
                  whileHover={!submitted ? { x: 3 } : {}}
                  transition={{ duration: 0.1 }}
                >
                  <span className="qb-opt-letter" style={isSelected && !submitted ? { background: color, color: "#0a0f1e" } : {}}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="qb-opt-text">{opt}</span>
                  {isCorrect && <CheckCircle size={16} className="qb-opt-icon" color="#81c784" />}
                  {isWrong && <XCircle size={16} className="qb-opt-icon" color="#ef9a9a" />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div
                className="qb-explanation"
                style={{ borderColor: selected === q.correct ? "#81c784" : "#ef9a9a" }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <span className="qb-exp-icon">
                  {selected === q.correct ? "✅" : "❌"}
                </span>
                <p>{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="qb-footer">
        {!submitted ? (
          <motion.button
            className="qb-submit-btn"
            style={{ background: selected !== null ? color : "#1c2a38" }}
            onClick={handleSubmit}
            disabled={selected === null}
            whileHover={selected !== null ? { scale: 1.03 } : {}}
            whileTap={selected !== null ? { scale: 0.97 } : {}}
          >
            {T.qbSubmit}
          </motion.button>
        ) : (
          <motion.button
            className="qb-submit-btn"
            style={{ background: color }}
            onClick={handleNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {qi + 1 < active.length ? T.qbNextQ : T.qbSeeResults}
          </motion.button>
        )}
      </div>
    </div>
  );
}

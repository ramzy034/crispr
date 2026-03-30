import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import type { QuizQuestion } from "../../lib/learningData";

type Props = {
  questions: QuizQuestion[];
  color: string;
  onPass: () => void;
};

export default function QuizBlock({ questions, color, onPass }: Props) {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = questions[qi];

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === q.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, correct]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (qi + 1 < questions.length) {
      setQi(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = score >= Math.ceil(questions.length * 0.6);
    return (
      <motion.div
        className="qb-results"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="qb-score-ring" style={{ "--ring-color": passed ? color : "#ef9a9a", "--ring-pct": `${pct}` } as React.CSSProperties}>
          <Trophy size={28} color={passed ? color : "#ef9a9a"} />
          <div className="qb-score-number" style={{ color: passed ? color : "#ef9a9a" }}>
            {score}/{questions.length}
          </div>
        </div>

        <h3 className="qb-result-title">
          {pct === 100 ? "Perfect Score! 🎉" : passed ? "Module Passed! ✓" : "Keep Learning 📚"}
        </h3>
        <p className="qb-result-sub">
          {passed
            ? "You've demonstrated a solid understanding of this topic."
            : "Review the material and try again — the concepts take time to stick."}
        </p>

        <div className="qb-answer-row">
          {answers.map((correct, i) => (
            <div key={i} className={`qb-answer-dot ${correct ? "qb-dot-correct" : "qb-dot-wrong"}`}>
              {correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
            </div>
          ))}
        </div>

        <button
          className="qb-complete-btn"
          style={{ background: color }}
          onClick={onPass}
        >
          {passed ? "Complete Module →" : "Complete Anyway →"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="qb-wrap">
      {/* Progress dots */}
      <div className="qb-dots">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`qb-q-dot ${i < qi ? "qb-dot-done" : ""} ${i === qi ? "qb-dot-current" : ""}`}
            style={i === qi ? { background: color } : {}}
          />
        ))}
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
            Question {qi + 1} <span className="qb-q-label-of">of {questions.length}</span>
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
            Submit Answer
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
            {qi + 1 < questions.length ? "Next Question →" : "See Results →"}
          </motion.button>
        )}
      </div>
    </div>
  );
}

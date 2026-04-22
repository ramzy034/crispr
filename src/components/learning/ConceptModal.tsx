import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import type { Chapter } from "../../lib/learningData";
import QuizBlock from "./QuizBlock";
import AnimatedDNA from "./AnimatedDNA";
import SVGDiagrams from "./SVGDiagrams";
import { useLang } from "../../lib/LangContext";
import { UI } from "../../lib/translations";

type Props = {
  chapter: Chapter;
  onClose: () => void;
  onComplete: () => void;
};

export default function ConceptModal({ chapter, onClose, onComplete }: Props) {
  const { lang } = useLang();
  const T = UI[lang];
  const [sectionIndex, setSectionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const section = chapter.sections[sectionIndex];
  const isLastSection = sectionIndex === chapter.sections.length - 1;
  const totalSteps = chapter.sections.length + 1; // sections + quiz
  const currentStep = showQuiz ? totalSteps - 1 : sectionIndex;

  return (
    <motion.div
      className="cm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="cm-panel"
        style={{ "--ch-color": chapter.color } as React.CSSProperties}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cm-header">
          <div className="cm-header-left">
            <span className="cm-emoji">{chapter.emoji}</span>
            <div>
              <div className="cm-chapter-name" style={{ color: chapter.color }}>{chapter.title}</div>
              {!showQuiz && (
                <div className="cm-section-name">{section.heading}</div>
              )}
              {showQuiz && (
                <div className="cm-section-name">{T.cmKnowledgeCheck}</div>
              )}
            </div>
          </div>
          <button className="cm-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Step progress */}
        <div className="cm-steps">
          {chapter.sections.map((_, i) => (
            <div
              key={i}
              className={`cm-step ${i < currentStep ? "cm-step-done" : ""} ${i === currentStep && !showQuiz ? "cm-step-active" : ""}`}
              style={i === currentStep && !showQuiz ? { background: chapter.color } : {}}
            />
          ))}
          <div
            className={`cm-step cm-step-quiz ${showQuiz ? "cm-step-active" : ""}`}
            style={showQuiz ? { background: chapter.color } : {}}
            title="Quiz"
          >
            <HelpCircle size={8} />
          </div>
        </div>

        {/* Body */}
        <div className="cm-body">
          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="cm-section-content"
              >
                {/* Visual */}
                <div className="cm-visual">
                  {section.visual === "dna-animation" && <AnimatedDNA color={chapter.color} />}
                  {section.visual === "cas9-diagram" && <SVGDiagrams type="cas9" color={chapter.color} />}
                  {section.visual === "grna-diagram" && <SVGDiagrams type="grna" color={chapter.color} />}
                  {section.visual === "nhej-diagram" && <SVGDiagrams type="nhej" color={chapter.color} />}
                  {section.visual === "delivery-diagram" && <SVGDiagrams type="delivery" color={chapter.color} />}
                  {section.visual === "video" && (() => {
                    const videoBlock = section.content.find(b => b.type === "video");
                    if (videoBlock && videoBlock.type === "video") {
                      return (
                        <div className="cm-video-wrap">
                          <iframe
                            src={videoBlock.url}
                            title={videoBlock.caption}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          <p className="cm-video-caption">{videoBlock.caption}</p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Content blocks */}
                <div className="cm-content-blocks">
                  <h2 className="cm-section-heading">{section.heading}</h2>
                  {section.content.map((block, bi) => {
                    if (block.type === "video") return null; // handled in visual

                    if (block.type === "paragraph") return (
                      <p key={bi} className="cm-paragraph">{block.text}</p>
                    );

                    if (block.type === "highlight") return (
                      <div key={bi} className="cm-highlight" style={{ borderColor: block.color || chapter.color, background: `${block.color || chapter.color}11` }}>
                        <span className="cm-highlight-icon">💡</span>
                        <p>{block.text}</p>
                      </div>
                    );

                    if (block.type === "steps") return (
                      <div key={bi} className="cm-steps-list">
                        {block.steps.map((step, si) => (
                          <div key={si} className="cm-step-item">
                            <div className="cm-step-icon">{step.icon}</div>
                            <div>
                              <div className="cm-step-title" style={{ color: chapter.color }}>{step.title}</div>
                              <div className="cm-step-body">{step.body}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );

                    if (block.type === "fact-grid") return (
                      <div key={bi} className="cm-fact-grid">
                        {block.facts.map((f, fi) => (
                          <div key={fi} className="cm-fact" style={{ borderColor: `${f.color}44` }}>
                            <div className="cm-fact-value" style={{ color: f.color }}>{f.value}</div>
                            <div className="cm-fact-label">{f.label}</div>
                          </div>
                        ))}
                      </div>
                    );

                    if (block.type === "comparison") return (
                      <div key={bi} className="cm-comparison">
                        {[block.left, block.right].map((side, si) => (
                          <div key={si} className="cm-comparison-side" style={{ borderColor: `${side.color}44` }}>
                            <div className="cm-comparison-title" style={{ color: side.color }}>{side.title}</div>
                            {side.items.map((item, ii) => (
                              <div key={ii} className="cm-comparison-item">
                                <span className="cm-comparison-dot" style={{ background: side.color }} />
                                {item}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );

                    return null;
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <QuizBlock
                  questions={chapter.quiz}
                  color={chapter.color}
                  onPass={onComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!showQuiz && (
          <div className="cm-footer">
            <button
              className="cm-nav-btn cm-nav-back"
              onClick={() => sectionIndex > 0 && setSectionIndex(i => i - 1)}
              disabled={sectionIndex === 0}
            >
              <ChevronLeft size={16} /> {T.cmBack}
            </button>
            <span className="cm-nav-count">
              {sectionIndex + 1} / {chapter.sections.length}
            </span>
            {!isLastSection ? (
              <button
                className="cm-nav-btn cm-nav-next"
                style={{ background: chapter.color }}
                onClick={() => setSectionIndex(i => i + 1)}
              >
                {T.cmNext} <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="cm-nav-btn cm-nav-next"
                style={{ background: chapter.color }}
                onClick={() => setShowQuiz(true)}
              >
                {T.cmTakeQuiz} <HelpCircle size={15} />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

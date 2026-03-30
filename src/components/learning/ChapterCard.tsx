import { Clock, ChevronRight, Lock, CheckCircle } from "lucide-react";
import type { Chapter } from "../../lib/learningData";

type Props = {
  chapter: Chapter;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
};

export default function ChapterCard({ chapter, index, isCompleted, isLocked, onClick }: Props) {
  return (
    <div
      className={`chapter-card ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
      onClick={isLocked ? undefined : onClick}
      role={isLocked ? undefined : "button"}
      tabIndex={isLocked ? undefined : 0}
      onKeyDown={isLocked ? undefined : (e) => e.key === "Enter" && onClick()}
      style={{ "--card-color": chapter.color } as React.CSSProperties}
      aria-disabled={isLocked}
    >
      {/* Top row: number + time badge */}
      <div className="card-top-row">
        <div className="card-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="card-time-badge">
          <Clock size={11} />
          {chapter.estimatedMinutes ?? 5} min
        </div>
      </div>

      {/* Icon */}
      <div className="card-icon">{chapter.emoji}</div>

      {/* Title & subtitle */}
      <h3>{chapter.title}</h3>
      <p>{chapter.subtitle}</p>

      {/* Section pills */}
      <div className="card-sections">
        {chapter.sections.map((s, i) => (
          <span key={i} className="card-section-tag">{s.heading}</span>
        ))}
      </div>

      {/* Status / CTA */}
      <div className="card-status">
        {isLocked ? (
          <>
            <Lock size={12} />
            Complete previous module
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle size={12} />
            Completed
          </>
        ) : (
          <>
            Start <ChevronRight size={13} />
          </>
        )}
      </div>

      <div className="card-glow" />
    </div>
  );
}
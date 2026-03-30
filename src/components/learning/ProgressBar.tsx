import { motion } from "framer-motion";

type Props = { completed: number; total: number };

export default function ProgressBar({ completed, total }: Props) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="lp-progress-wrap">
      <div className="lp-progress-header">
        <span className="lp-progress-label">Your Progress</span>
        <span className="lp-progress-pct">{pct}%</span>
      </div>
      <div className="lp-progress-track">
        <motion.div
          className="lp-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="lp-progress-sub">{completed} of {total} modules complete</div>
    </div>
  );
}

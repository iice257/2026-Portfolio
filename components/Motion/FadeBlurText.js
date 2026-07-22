import { AnimatePresence, motion } from "framer-motion";
import { fadeBlurMotion } from "../../utils/motion";

const FadeBlurText = ({ stateKey, children, className = "" }) => (
  <span className={`system-fade-blur-text ${className}`.trim()}>
    <AnimatePresence initial={false} mode="sync">
      <motion.span
        key={stateKey}
        initial={fadeBlurMotion.initial}
        animate={fadeBlurMotion.animate}
        exit={fadeBlurMotion.exit}
        transition={fadeBlurMotion.transition}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  </span>
);

export default FadeBlurText;

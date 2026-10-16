import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeSlide, scaleIn } from "./motion";

type PageTransitionProps = {
  pageKey: string;
  children: ReactNode;
};

/** Subtle page/panel swap for desktop navigation. */
export function PageTransition({ pageKey, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={fadeSlide.initial}
        animate={fadeSlide.animate}
        exit={fadeSlide.exit}
        transition={fadeSlide.transition}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={fadeSlide.initial}
      animate={fadeSlide.animate}
      transition={{ ...fadeSlide.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

type ScalePresenceProps = {
  show: boolean;
  children: ReactNode;
};

export function ScalePresence({ show, children }: ScalePresenceProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={scaleIn.initial}
          animate={scaleIn.animate}
          exit={scaleIn.exit}
          transition={scaleIn.transition}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

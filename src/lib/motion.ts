import type { Transition, Variants } from "framer-motion";

export function springGentle(reducedMotion: boolean): Transition {
  if (reducedMotion) {
    return { duration: 0.15 };
  }
  return { type: "spring", stiffness: 380, damping: 28 };
}

const dayCellItem: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
};

export function dayCellVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.12 } },
    };
  }
  return dayCellItem;
}

/** Month grid wrapper: fade + stagger of day cells */
export function gridMonthContainer(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.12 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.014,
        delayChildren: 0.05,
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };
}

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

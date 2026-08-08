import { motion } from "motion/react";
import { fadeUp } from "../lib/motion";
import { cn } from "../lib/cn";

export default function SectionReveal({ children, className, as = "div", ...props }) {
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

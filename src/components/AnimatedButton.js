import { motion } from "framer-motion";

export default function AnimatedButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`animated-btn ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

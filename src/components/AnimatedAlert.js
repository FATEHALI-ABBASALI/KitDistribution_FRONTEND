import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedAlert({ message, type = "success" }) {
  const typeClass = {
    success: "alert-box success",
    error: "alert-box error",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={typeClass[type]}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserFormModal({
  open,
  type,
  initialData,
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    state_City: "",
  });

  // ===== LOAD DATA WHEN EDIT OPENS =====
  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.FullName || "",
        mobile: initialData.Mobile || "",
        state_City: initialData.State_City || "",
      });
    } else {
      setForm({
        fullName: "",
        mobile: "",
        state_City: "",
      });
    }
  }, [initialData, open]);

  const submit = () => {
    onSubmit(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* ===== MODAL BOX ===== */}
          <motion.div
            className="form-modal"
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="form-title">
              {initialData ? "Edit" : "Add"}{" "}
              {type === "beneficiary" ? "Beneficiary" : "Terminal User"}
            </h2>

            {/* FULL NAME */}
            <input
              className="form-input"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            {/* MOBILE (ONLY BENEFICIARY) */}
            {type === "beneficiary" && (
              <input
                className="form-input"
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            )}

            {/* CITY */}
            {type === "beneficiary" && (
              <input
                className="form-input"
                placeholder="City / State"
                value={form.state_City}
                onChange={(e) =>
                  setForm({ ...form, state_City: e.target.value })
                }
              />
            )}

            {/* ACTION BUTTONS */}
            <div className="form-actions">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>

              <button className="primary-btn" onClick={submit}>
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

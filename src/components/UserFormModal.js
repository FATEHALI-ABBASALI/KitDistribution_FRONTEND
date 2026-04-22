import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserFormModal({
  open,
  type,
  initialData,
  onSubmit,
  onClose,
  centers = []
}) {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    state_City: "",
    centerId: "",
    quantity: 1   // 🔥 NEW
  });

  // ===== LOAD DATA WHEN EDIT OPENS =====
  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.FullName || initialData.fullName || "",
        mobile: initialData.Mobile || "",
        state_City: initialData.State_City || "",
        centerId: initialData.centerId || "",
        quantity: initialData.Quantity || initialData.quantity || 1   // 🔥 NEW
      });
    } else {
      setForm({
        fullName: "",
        mobile: "",
        state_City: "",
        centerId: "",
        quantity: 1   // 🔥 NEW
      });
    }
  }, [initialData, open]);

  const submit = () => {
    if (type === "terminal" && !form.centerId) {
      return alert("Please select center");
    }

    if (type === "beneficiary" && (!form.quantity || form.quantity <= 0)) {
      return alert("Quantity must be at least 1");
    }

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

            {/* 🔥 CENTER DROPDOWN (ONLY TERMINAL) */}
            {type === "terminal" && (
              <select
                className="form-input"
                value={form.centerId}
                onChange={(e) =>
                  setForm({ ...form, centerId: e.target.value })
                }
              >
                <option value="">Select Center</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            )}

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

            {/* 🔥 QUANTITY (ONLY BENEFICIARY) */}
            {type === "beneficiary" && (
              <input
                className="form-input"
                type="number"
                placeholder="Quantity (No. of Kits)"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: parseInt(e.target.value) })
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
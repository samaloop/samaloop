"use client";
import { useState } from "react";
import axios from "axios";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5"; // Tambahkan ikon success
import { t } from "@/helper/helper";

const CoachingModal = ({ coach, isOpen, onClose, locale }: any) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone_number"),
      domicile: formData.get("domicile"),
      position: formData.get("position"),
      organization: formData.get("organization"),
      coach_id: coach?.id,
    };

    try {
      await axios.post('/api/coach-registration', payload);
      setIsSuccess(true); // Ganti alert dengan state success
      form.reset();
    } catch (err) {
      console.error("Error:", err);
      alert(t("Failed to send data.", locale));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          
          {/* Bagian Header yang lebih elegan */}
          <div className="modal-header border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
            {!isSuccess && (
              <div>
                <h4 className="fw-bold mb-0" style={{ color: '#0055A5' }}>{t("Coaching Registration", locale)}</h4>
                <p className="text-muted small mb-0">{t("Register for a session with", locale)} <strong>{coach?.name}</strong></p>
              </div>
            )}
            <button type="button" className="btn-close" onClick={() => { onClose(); setIsSuccess(false); }}></button>
          </div>

          <div className="modal-body p-4">
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <input name="name" className="form-control py-2 shadow-sm border-light" placeholder={t("Full Name", locale) as string} required />
                  </div>
                  <div className="col-12">
                    <input name="email" type="email" className="form-control py-2 shadow-sm border-light" placeholder={t("Email Address", locale) as string} required />
                  </div>
                  <div className="col-12">
                    <input name="phone_number" className="form-control py-2 shadow-sm border-light" placeholder={t("WhatsApp Number", locale) as string} required />
                  </div>
                  <div className="col-12">
                    <input name="domicile" className="form-control py-2 shadow-sm border-light" placeholder={t("Domicile", locale) as string} required />
                  </div>
                  <div className="col-md-6">
                    <input name="position" className="form-control py-2 shadow-sm border-light" placeholder={t("Current Position", locale) as string} required />
                  </div>
                  <div className="col-md-6">
                    <input name="organization" className="form-control py-2 shadow-sm border-light" placeholder={t("Organization / Company", locale) as string} required />
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn w-100 py-2 fw-bold text-white transition-all shadow" 
                    style={{ backgroundColor: '#f59e42', borderRadius: '8px', border: 'none' }}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : t("Submit Application", locale)}
                  </button>
                </div>
              </form>
            ) : (
              /* --- TAMPILAN SUKSES --- */
              <div className="text-center py-4 transition-all">
                <IoCheckmarkCircle size={80} color="#28a745" className="mb-3" />
                <h4 className="fw-bold text-dark">{t("Registration successful!", locale)}</h4>
                <p className="text-muted">
                  {locale === "en" 
                    ? "Please wait, your coach will contact you shortly." 
                    : "Mohon tunggu, coach Anda akan menghubungi dalam waktu dekat."}
                </p>
                <button 
                  className="btn mt-3 px-5 text-white" 
                  style={{ backgroundColor: '#f59e42', borderRadius: '8px' }}
                  onClick={() => { onClose(); setIsSuccess(false); }}
                >
                  {t("Close", locale)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingModal;
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoCheckmarkCircle, IoCardOutline } from "react-icons/io5"; // Tambah icon kartu
import { t } from "@/helper/helper";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const CoachingModal = ({ coach, isOpen, onClose, locale }: any) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null); // State untuk simpan link Xendit

  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const supabase = createClientComponentClient();
  useEffect(() => {
    if (isSuccess && registrationId && !paymentConfirmed) {
      console.log("Memulai Realtime Listener untuk ID:", registrationId);

      const channel = supabase
        .channel(`payment-check-${registrationId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'coaching_registrations',
            filter: `id=eq.${registrationId}`, // Pastikan ini UUID yang valid
          },
          (payload) => {
            console.log("PAYLOAD REALTIME DITERIMA:", payload);
            // Gunakan .toUpperCase() jika Anda khawatir soal perbedaan besar/kecil huruf
            if (payload.new.payment_status?.toUpperCase() === 'SUCCESS') {
              setPaymentConfirmed(true);
            }
          }
        )
        .subscribe((status) => {
          console.log("Status Subscribe Realtime:", status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isSuccess, registrationId, paymentConfirmed, supabase]);


  // State untuk validasi checkbox syarat & ketentuan
  const [agreed, setAgreed] = useState({
    ethics: false,
    consistency: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const focusAreas = formData.getAll("focus_areas");

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone_number"),
      domicile: formData.get("domicile"),
      position: formData.get("position"),
      organization: formData.get("organization"),
      coach_id: coach?.id,
      coaching_goal: formData.get("coaching_goal"),
      focus_areas: focusAreas,
      expected_result: formData.get("expected_result"),
      language_preference: formData.get("language_preference"),
      gender_preference: formData.get("gender_preference"),
      industry_preference: formData.get("industry_preference"),
      session_format: formData.get("session_format"),
      session_frequency: formData.get("session_frequency"),
      readiness_to_start: formData.get("readiness_to_start"),
      ethics_agreement: formData.get("ethics_agreement") === "on",
      consistency_agreement: formData.get("consistency_agreement") === "on"
    };

    try {
      const res = await axios.post('/api/coach_registration', payload);
      if (res.data.paymentUrl) {
        setRegistrationId(res.data.id); // 5. PASTIKAN API Anda mengirimkan 'id' registrasi
        setPaymentUrl(res.data.paymentUrl);
        setIsSuccess(true);
        window.open(res.data.paymentUrl, '_blank');
      }
    } catch (err) {
      alert("Gagal memproses.");
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah semua syarat sudah dicentang
  const canSubmit = agreed.ethics && agreed.consistency;

  return (

    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
          <div className="modal-header bg-light p-4">
            <h4 className="fw-bold mb-0" style={{ color: '#0055A5' }}>{t("Samaloop Coaching Inquiry Form", locale)}</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="row g-3">
                {/* SEKSI 1: DATA DIRI */}
                <h6 className="fw-bold border-bottom pb-2" style={{ color: '#0055A5' }}>{t("Personal Information", locale)}</h6>
                <div className="col-md-6">
                  <input name="name" className="form-control" placeholder={t("Full Name", locale) as string + " *"} required />
                </div>
                <div className="col-md-6">
                  <input name="email" type="email" className="form-control" placeholder={t("Email Address", locale) as string + " *"} required />
                </div>
                <div className="col-md-6">
                  <input name="phone_number" className="form-control" placeholder={t("WhatsApp Number", locale) as string + " *"} required />
                </div>
                <div className="col-md-6">
                  <input name="domicile" className="form-control" placeholder={t("Domicile", locale) as string + " *"} required />
                </div>
                <div className="col-md-6">
                  <input name="position" className="form-control" placeholder={t("Current Position", locale) as string + " *"} required />
                </div>
                <div className="col-md-6">
                  <input name="organization" className="form-control" placeholder={t("Organization / Company", locale) as string + " *"} required />
                </div>

                {/* SEKSI 2: TUJUAN & KEBUTUHAN */}
                <h6 className="fw-bold border-bottom pb-2 mt-4" style={{ color: '#0055A5' }}>{t("Coaching Goals & Needs", locale)}</h6>
                <div className="col-12">
                  <label className="small mb-1 fw-semibold">{t("What drives you to seek coaching now? *", locale)}</label>
                  <textarea name="coaching_goal" className="form-control" rows={2} required></textarea>
                </div>
                <div className="col-12">
                  <label className="small mb-1 fw-semibold">{t("Focus areas you want to develop: *", locale)}</label>
                  <div className="d-flex flex-wrap gap-3">
                    {["Leadership", "Career Transition", "Personal Growth", "Wellbeing", "Business Development", "Team / Organizational"].map(item => (
                      <div key={item} className="form-check">
                        <input className="form-check-input" type="checkbox" name="focus_areas" value={item} id={item} />
                        <label className="form-check-label small" htmlFor={item}>{t(item, locale)}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <label className="small mb-1 fw-semibold">{t("What kind of result do you want to achieve? *", locale)}</label>
                  <textarea name="expected_result" className="form-control" rows={2} required></textarea>
                </div>

                {/* SEKSI 3: PREFERENSI & LOGISTIK */}
                <h6 className="fw-bold border-bottom pb-2 mt-4" style={{ color: '#0055A5' }}>{t("Coach Preference & Logistics", locale)}</h6>
                <div className="col-md-6">
                  <label className="small mb-1 fw-semibold">{t("Session language preference: *", locale)}</label>
                  <select name="language_preference" className="form-select shadow-none" required>
                    <option value="Bahasa Indonesia">{t("Bahasa Indonesia", locale)}</option>
                    <option value="English">{t("English", locale)}</option>
                    <option value="Bilingual">{t("Bilingual", locale)}</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="small mb-1 fw-semibold">{t("Session format: *", locale)}</label>
                  <select name="session_format" className="form-select shadow-none" required>
                    <option value="Online">{t("Online", locale)}</option>
                    <option value="Offline">{t("Offline", locale)}</option>
                    <option value="Hybrid">{t("Hybrid", locale)}</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="small mb-1 fw-semibold">{t("Session frequency: *", locale)}</label>
                  <select name="session_frequency" className="form-select shadow-none" required>
                    <option value="Weekly">{t("Weekly", locale)}</option>
                    <option value="Bi-weekly">{t("Bi-weekly", locale)}</option>
                    <option value="Monthly">{t("Monthly", locale)}</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="small mb-1 fw-semibold">{t("Readiness to start: *", locale)}</label>
                  <select name="readiness_to_start" className="form-select shadow-none" required>
                    <option value="Immediately">{t("Immediately", locale)}</option>
                    <option value="Within 1 month">{t("Within 1 month", locale)}</option>
                    <option value="Planning for future">{t("Planning for future", locale)}</option>
                  </select>
                </div>

                {/* SEKSI 4: KOMITMEN & ETIKA (Hanya sebagai syarat daftar) */}
                <h6 className="fw-bold border-bottom pb-2 mt-4" style={{ color: '#0055A5' }}>{t("Commitment & Ethics", locale)}</h6>
                <div className="col-12">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      id="ethic"
                      checked={agreed.ethics}
                      onChange={(e) => setAgreed({ ...agreed, ethics: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="ethic">
                      {t("I understand that coaching is not therapy or counseling *", locale)}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      id="consist"
                      checked={agreed.consistency}
                      onChange={(e) => setAgreed({ ...agreed, consistency: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="consist">
                      {t("I am willing to follow the sessions consistently *", locale)}
                    </label>
                  </div>
                </div>

                <div className="col-12 mt-4 text-end">
                  <button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className="btn px-5 py-2 text-white fw-bold shadow-sm"
                    style={{
                      backgroundColor: canSubmit ? '#f59e42' : '#cccccc',
                      borderRadius: '8px',
                      cursor: canSubmit ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      // Tambahkan info harga di sini
                      `${t("Submit & Pay", locale)} IDR 150.000`
                    )}
                  </button>
                  {!canSubmit && <p className="text-danger small mt-2">{t("Please accept the terms to proceed", locale)}</p>}
                </div>
              </form>
            ) : paymentConfirmed ? (
              <div className="text-center py-5">
                <IoCheckmarkCircle size={80} color="#28a745" className="mb-3" />
                <h4 className="fw-bold">Pembayaran Berhasil!</h4>
                <p>Akun Anda telah aktif. Silakan cek WhatsApp/Email untuk detail login.</p>
                <button className="btn btn-primary" onClick={onClose}>Selesai</button>
              </div>) : (

              <div className="text-center py-5">
                <IoCardOutline size={80} color="#f59e42" className="mb-3 animate__animated animate__pulse animate__infinite" />
                <h4 className="fw-bold text-dark">{t("One last step!", locale)}</h4>
                <p className="text-muted">
                  {locale === "en"
                    ? "Please complete your payment to finalize your registration."
                    : "Silakan selesaikan pembayaran Anda untuk memfinalisasi pendaftaran."}
                </p>

                <div className="d-grid gap-2 col-md-8 mx-auto mt-4">
                  <a
                    href={paymentUrl as string}
                    target="_blank"
                    className="btn btn-lg text-white fw-bold shadow-sm"
                    style={{ backgroundColor: '#0055A5', borderRadius: '10px' }}
                  >
                    {t("Pay Now (Xendit)", locale)}
                  </a>
                  <button className="btn btn-link text-muted small" onClick={onClose}>
                    {t("Close and pay later via email", locale)}
                  </button>
                </div>

                <p className="mt-4 small text-secondary">
                  {locale === "en"
                    ? "*Your account will be created automatically after payment is confirmed."
                    : "*Akun Anda akan dibuat secara otomatis setelah pembayaran dikonfirmasi."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CoachingModal;
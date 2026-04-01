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

  // Tambahkan state ini di dalam komponen CoachingModal
  const [paymentStep, setPaymentStep] = useState<"FORM" | "CHOOSE" | "XENDIT_PENDING" | "MANUAL_INSTRUCTION">("FORM");
  const adminWhatsApp = "6285770916763"; // Sesuaikan nomor admin

  useEffect(() => {
    let pollingInterval: any;

    if (isSuccess && registrationId && !paymentConfirmed) {
      console.log("Memulai Polling untuk ID:", registrationId);

      pollingInterval = setInterval(async () => {
        const { data } = await supabase
          .from('coaching_registrations')
          .select('payment_status')
          .eq('id', registrationId)
          .single();

        console.log("Cek Status Database:", data?.payment_status);

        if (data?.payment_status === 'SUCCESS' || data?.payment_status === 'PAID') {
          setPaymentConfirmed(true);
          clearInterval(pollingInterval);
        }
      }, 2000); // Cek tiap 2 detik
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [isSuccess, registrationId, paymentConfirmed]);


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
        // setRegistrationId(res.data.id); // 5. PASTIKAN API Anda mengirimkan 'id' registrasi
        // setPaymentUrl(res.data.paymentUrl);
        // setIsSuccess(true);
        // window.open(res.data.paymentUrl, '_blank');

        setRegistrationId(res.data.id);
        setPaymentUrl(res.data.paymentUrl); // URL Xendit sudah siap di background
        setPaymentStep("CHOOSE"); // <--- PINDAH KE PILIHAN PEMBAYARAN
        setIsSuccess(true);
      }
    } catch (err) {
      alert("Gagal memproses pendaftaran.");
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
            <h4 className="fw-bold mb-0" style={{ color: '#ff7403' }}>{t("Samaloop Coaching Inquiry Form", locale)}</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {paymentStep === "FORM" && (
              <form onSubmit={handleSubmit} className="row g-3">
                {/* SEKSI 1: DATA DIRI */}
                <h6 className="fw-bold border-bottom pb-2" style={{ color: '#ff7403' }}>{t("Personal Information", locale)}</h6>
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
                <h6 className="fw-bold border-bottom pb-2 mt-4" style={{ color: '#ff7403' }}>{t("Coaching Goals & Needs", locale)}</h6>
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
                <h6 className="fw-bold border-bottom pb-2 mt-4" style={{ color: '#ff7403' }}>{t("Coach Preference & Logistics", locale)}</h6>
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
                {/* SEKSI 4: KOMITMEN & ETIKA */}
                <h6 className="fw-bold border-bottom pb-2 mt-4" style={{ color: '#ff7403' }}>{t("Commitment & Ethics", locale)}</h6>
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
                      {t("I understand that this is a consutation session *", locale)}
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

                {/* RINCIAN BIAYA (Bukan dalam bentuk Button) */}
                <div className="col-12 mt-4">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#fff0e3', border: '1px dashed #dee2e6' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold d-block" style={{ color: '#0055A5' }}>{t("Initial Consultation Fee", locale)}</span>
                        <small className="text-muted">{t("Administrative fee for coach matching & 1st consultation", locale)}</small>
                      </div>
                      <div className="text-end">
                        <span className="fs-5 fw-bold text-dark">IDR 150.000</span>
                      </div>
                    </div>
                  </div>

                  {/* NOTE TAMBAHAN DI BAWAH KOTAK BIAYA */}
                  <p className="mt-2 mb-0" style={{ fontSize: '11.5px', color: '#6c757d', fontStyle: 'italic', lineHeight: '1.4' }}>
                    * {locale === "en"
                      ? "Please note: This initial payment is for the consultation session only. Package coaching fees (if applicable) will be discussed separately after your consultation."
                      : "Catatan: Pembayaran awal ini hanya untuk sesi konsultasi. Biaya paket coaching selanjutnya (jika ada) akan dibahas terpisah setelah sesi konsultasi selesai."
                    }
                  </p>
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
                      t("Submit Application", locale)
                    )}
                  </button>
                  {!canSubmit && <p className="text-danger small mt-2 text-end">{t("Please accept the terms to proceed", locale)}</p>}
                </div>
              </form>
            )}
            {/* STEP 2: PILIH METODE PEMBAYARAN */}
            {paymentStep === "CHOOSE" && (
              <div className="text-center py-4">
                <h5 className="fw-bold mb-4">{t("Choose Payment Method", locale)}</h5>
                <div className="row g-3">
                  {/* OPSI XENDIT */}
                  <div className="col-12">
                    <div
                      className="p-3 border rounded-3 shadow-sm d-flex align-items-center justify-content-between"
                      style={{ cursor: 'pointer', borderLeft: '5px solid #0055A5' }}
                      onClick={() => {
                        setPaymentStep("XENDIT_PENDING");
                        window.open(paymentUrl as string, '_blank');
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <IoCardOutline size={30} color="#0055A5" />
                        <div className="text-start">
                          <p className="mb-0 fw-bold">Otomatis (E-Wallet, VA, QRIS)</p>
                          <small className="text-muted">Konfirmasi instan via Xendit</small>
                        </div>
                      </div>
                      <span className="badge bg-primary">Rekomendasi</span>
                    </div>
                  </div>

                  {/* OPSI MANUAL */}
                  <div className="col-12">
                    <div
                      className="p-3 border rounded-3 shadow-sm d-flex align-items-center gap-3"
                      style={{ cursor: 'pointer', borderLeft: '5px solid #f59e42' }}
                      onClick={() => setPaymentStep("MANUAL_INSTRUCTION")}
                    >
                      <div className="p-2 bg-light rounded text-primary">
                        <span className="fw-bold">BCA</span>
                      </div>
                      <div className="text-start">
                        <p className="mb-0 fw-bold">Transfer Bank Manual (BCA)</p>
                        <small className="text-muted">Konfirmasi manual oleh admin</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3A: XENDIT PENDING (Tampilan yang lama) */}
            {paymentStep === "XENDIT_PENDING" && !paymentConfirmed && (
              <div className="text-center py-5">
                <IoCardOutline size={80} color="#0055A5" className="mb-3 animate__animated animate__pulse animate__infinite" />
                <h4 className="fw-bold">Menunggu Pembayaran Otomatis</h4>
                <p>Silakan selesaikan pembayaran pada tab yang baru dibuka.</p>
                <a href={paymentUrl as string} target="_blank" className="btn btn-primary mt-3">Buka Kembali Halaman Xendit</a>
                <button className="btn btn-link d-block mx-auto mt-2" onClick={() => setPaymentStep("CHOOSE")}>Ganti Metode Pembayaran</button>
              </div>
            )}

            {/* STEP 3B: MANUAL INSTRUCTION */}
            {paymentStep === "MANUAL_INSTRUCTION" && (
              <div className="text-center py-4">
                <div className="p-4 bg-light rounded-4 mb-4">
                  <p className="small text-muted mb-2 text-uppercase fw-bold">Transfer ke Rekening:</p>
                  <h4 className="fw-bold text-primary mb-1">Bank BCA</h4>
                  <h3 className="fw-bold mb-1">1234 567 890</h3>
                  <p className="mb-0">a/n PT Linkar Indonesia Cendekia</p>
                  <div className="mt-3 p-2 bg-white rounded border border-warning">
                    <p className="mb-0 small fw-bold text-danger">Nominal: IDR 150.000</p>
                  </div>
                </div>

                <p className="small mb-4">Setelah transfer, mohon kirim bukti bayar ke Admin untuk aktivasi akun.</p>

                <div className="d-grid gap-2">
                  <a
                    href={`https://wa.me/${adminWhatsApp}?text=Halo%20Admin,%20saya%20sudah%20transfer%20manual%20untuk%20inkuiri%20ID:%20${registrationId}`}
                    target="_blank"
                    className="btn btn-success btn-lg fw-bold"
                  >
                    Konfirmasi via WhatsApp
                  </a>
                  <button className="btn btn-outline-secondary" onClick={() => setPaymentStep("CHOOSE")}>Kembali</button>
                </div>
              </div>
            )}

            {/* STEP FINAL: SUKSES (Tampilan centang hijau) */}
            {paymentConfirmed && (
              <div className="text-center py-5">
                <IoCheckmarkCircle size={80} color="#28a745" className="mb-3" />
                <h4 className="fw-bold">Pembayaran Berhasil!</h4>
                <p>Sesi Anda akan segera dijadwalkan oleh admin.</p>
                <button className="btn btn-primary" onClick={onClose}>Selesai</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
export default CoachingModal;
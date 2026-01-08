"use client";
import React, { useState } from 'react';
import { t } from "@/helper/helper"; 

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  coachName?: string;
  locale?: string;
}

export default function ContactModal({ isOpen, onClose, onSubmit, coachName, locale = "id" }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (!formData.name || !formData.email) {
      return alert(locale === 'en' ? "Please fill in your Name and Email." : "Mohon isi Nama dan Email Anda.");
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500)); 
    onSubmit(formData);
    setIsLoading(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --samaloop-orange: #F79F1F; 
          --samaloop-orange-hover: #e08b0b; 
        }

        /* Animasi Backdrop */
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Animasi Pop Up Smooth */
        @keyframes popUpScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .samaloop-modal-backdrop {
          background-color: rgba(0,0,0,0.6); 
          animation: fadeInBackdrop 0.3s ease-out forwards;
        }
        
        .samaloop-modal-content {
          border: none;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          animation: popUpScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          overflow: hidden;
        }

        .samaloop-title { color: #333; font-weight: 700; }
        .samaloop-highlight { color: var(--samaloop-orange); }

        /* Input Style */
        .samaloop-input {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px 12px;
            transition: all 0.3s;
            font-size: 0.95rem;
        }
        .samaloop-input:focus {
            border-color: var(--samaloop-orange);
            box-shadow: 0 0 0 3px rgba(247, 159, 31, 0.1);
            outline: none;
        }
        .form-label-sm {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 4px;
            font-weight: 500;
        }
        .required-star { color: var(--samaloop-orange); }

        /* Tombol Utama */
        .btn-samaloop-primary {
            background-color: var(--samaloop-orange) !important;
            border-color: var(--samaloop-orange) !important;
            color: white !important;
            border-radius: 50px;
            padding: 10px 24px;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s ease;
        }
        .btn-samaloop-primary:hover:not(:disabled) {
             background-color: var(--samaloop-orange-hover) !important;
             border-color: var(--samaloop-orange-hover) !important;
             transform: translateY(-2px);
             box-shadow: 0 4px 12px rgba(247, 159, 31, 0.3);
        }
      `}</style>

      <div className="modal d-block samaloop-modal-backdrop" tabIndex={-1} role="dialog" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered px-3" role="document">
          <div className="modal-content samaloop-modal-content bg-white">
            
            {/* Header */}
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
              <h5 className="modal-title fs-5 samaloop-title">
                  {locale === 'en' ? 'Interested in ' : 'Tertarik dengan '} 
                  <span className="samaloop-highlight">{coachName}</span>?
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            {/* Body */}
            <div className="modal-body pt-2 px-4">
              <p className="text-muted mb-4 small" style={{lineHeight: '1.6'}}>
                 {locale === 'en' 
                   ? 'Please complete your details below to view the full profile.' 
                   : 'Mohon lengkapi data diri Anda di bawah ini untuk melihat profil lengkap.'}
              </p>
              
              <form onSubmit={handleSubmit}>
                {/* Field Nama */}
                <div className="mb-3">
                  <label className="form-label form-label-sm">
                    {locale === 'en' ? 'Full Name' : 'Nama Lengkap'} <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control samaloop-input"
                    value={formData.name}
                    onChange={handleChange}
                    // placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>

                {/* Field Email */}
                <div className="mb-3">
                  <label className="form-label form-label-sm">
                    Email <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control samaloop-input"
                    value={formData.email}
                    onChange={handleChange}
                    // placeholder="nama@email.com"
                    required
                  />
                </div>

                {/* Field Telepon */}
                <div className="mb-4">
                  <label className="form-label form-label-sm">
                    {locale === 'en' ? 'Phone Number (Optional)' : 'Nomor Telepon (Opsional)'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control samaloop-input"
                    value={formData.phone}
                    onChange={handleChange}
                    // placeholder="Contoh: 0812..."
                  />
                </div>

                <div className="d-grid gap-2 mb-2">
                  <button type="submit" className="btn btn-samaloop-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : (locale === 'en' ? 'View Full Profile' : 'Lihat Profil Lengkap')}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top-0 justify-content-center pt-0 pb-4">
               <small className="text-muted" style={{fontSize: '0.7rem', opacity: 0.8}}>
                  {locale === 'en' ? 'Your privacy is protected.' : 'Data privasi Anda aman.'}
               </small>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
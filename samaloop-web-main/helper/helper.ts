export function generateSlug(value: string) {
    return value
        .toLowerCase()                      // Convert to lowercase
        .trim()                             // Remove leading and trailing whitespace
        .replace(/[^a-z0-9\s-]/g, '')       // Remove special characters
        .replace(/\s+/g, '-')               // Replace multiple spaces with a single hyphen
        .replace(/-+/g, '-');              // Replace multiple hyphens with a single hyphen
}

export function t(key: string, locale: string) {
    const common: any = {
        'Home': {
            en: 'Home',
            id: 'Beranda'
        },
        'Find a Coach': {
            en: 'Find a Coach',
            id: 'Cari Coach'
        },
        'Search': {
            en: 'Search',
            id: 'Cari'
        },
        'Find Your Preferred Coach': {
            en: 'Find Your Preferred Coach',
            id: 'Cari Coach Pilihan Anda'
        },
        'About Us': {
            en: 'About Us',
            id: 'Tentang Kami'
        },
        'About Samaloop': {
            en: 'About Samaloop',
            id: 'Tentang Samaloop'
        },
        'Cookie Policy': {
            en: 'Cookie Policy',
            id: 'Kebijakan Cookie'
        },
        'Privacy Policy': {
            en: 'Privacy Policy',
            id: 'Kebijakan Privasi'
        },
        'Terms and Conditions': {
            en: 'Terms and Conditions',
            id: 'Syarat dan Ketentuan'
        },
        'years': {
            en: 'years',
            id: 'tahun'
        },
        'hours': {
            en: 'hours',
            id: 'jam'
        },
        'clients': {
            en: 'clients',
            id: 'Klien'
        },
        'Coaching Methods': {
            en: 'Coaching Methods',
            id: 'Metode Pelatihan'
        },
        'Other Credentials': {
            en: 'Other Credentials',
            id: 'Kredensial Lainnya'
        },
        'Awards': {
            en: 'Awards',
            id: 'Penghargaan'
        },
        'Social Media': {
            en: 'Social Media',
            id: 'Sosial Media'
        },
        'Share': {
            en: 'Share',
            id: 'Bagikan'
        },
        'book Now': {
            en: 'Book Now',
            id: 'Daftar Sekarang'
        },
        'Contact Us': {
            en: 'Contact Us',
            id: 'Hubungi Kami'
        },
        'Hello, I am': {
            en: 'Hello, I am',
            id: 'Halo, Saya'
        },
        'Link has been copied!': {
            en: 'Link has been copied!',
            id: 'Tautan telah disalin!!'
        },
        'Select Coach Category': {
            en: 'Select Coach Category',
            id: 'Pilih Kategori Coach'
        },
        'Find Your Best Coach': {
            en: 'Find Your Best Coach',
            id: 'Cari Coach Terbaikmu'
        },
        'Method': {
            en: 'Method',
            id: 'Metode'
        },
        'Coaching Hours': {
            en: 'Coaching Hours',
            id: 'Jam Pelatihan'
        },
        'Number of Clients': {
            en: 'Number of Clients',
            id: 'Jumlah Klien'
        },
        'Coaching Experience': {
            en: 'Coaching Experience',
            id: 'Pengalaman Melatih'
        },
        'Client Type': {
            en: 'Client Type',
            id: 'Tipe Klien'
        },
        'Specialities': {
            en: 'Specialities',
            id: 'Spesialisasi'
        },
        'Price': {
            en: 'Price',
            id: 'Harga'
        },
        'Credentials': {
            en: 'Credentials',
            id: 'Kredensial'
        },
        'Fee / Hour': {
            en: 'Fee / Hour',
            id: 'Biaya / Jam'
        },
        'Gender': {
            en: 'Gender',
            id: 'Jenis kelamin'
        },
        'Age': {
            en: 'Age',
            id: 'Usia'
        },
        'Coach Profile Information': {
            en: 'Coach Profile Information',
            id: 'Informasi Profil Coach'
        },
        'Personal Information': {
            en: 'Personal Information',
            id: 'Informasi Pribadi'
        },
        'What is your full name as you’d like it to appear on your profile?': {
            en: 'What is your full name as you’d like it to appear on your profile?',
            id: 'Apa nama lengkap Anda yang ingin ditampilkan di profil Anda?'
        },
        'Full Name': {
            en: 'Full Name',
            id: 'Nama Lengkap'
        },
        'What is your gender, as you’d like it to be displayed on your profile?': {
            en: 'What is your gender, as you’d like it to be displayed on your profile?',
            id: 'Apa gender Anda untuk ditampilkan di profil Anda?'
        },
        'Could you please provide your age for your profile?': {
            en: 'Could you please provide your age for your profile?',
            id: 'Berapa rentang usia Anda untuk tampilan di profil Anda?'
        },
        'Please provide your phone number': {
            en: 'Please provide your phone number',
            id: 'Silakan berikan nomor telepon Anda'
        },
        'Phone Number': {
            en: 'Phone Number',
            id: 'Nomor telepon'
        },
        'Please provide your email address': {
            en: 'Please provide your email address',
            id: 'Silakan berikan alamat email Anda'
        },
        'Please provide your current profession or job title for your profile': {
            en: 'Please provide your current profession or job title for your profile',
            id: 'Silakan berikan profesi atau pekerjaan Anda saat ini untuk tampilan di profil Anda'
        },
        'Profession or Job Title': {
            en: 'Profession or Job Title',
            id: 'Profesi atau Jabatan'
        },
        'Please provide a profile picture you’d like to feature on your coaching profile': {
            en: 'Please provide a profile picture you’d like to feature on your coaching profile',
            id: 'Silakan berikan foto profil Anda untuk ditampilkan di profil Anda'
        },
        'Save': {
            en: 'Save',
            id: 'Simpan'
        },
        'Coaching Information': {
            en: 'Coaching Information',
            id: 'Informasi Pelatihan'
        },
        'What certifications or credentials do you hold as a coach?': {
            en: 'What certifications or credentials do you hold as a coach?',
            id: 'Apa Sertifikasi atau kredensial yang Anda miliki sebagai Coach? '
        },
        'What are your coaching specialties or areas of expertise?': {
            en: 'What are your coaching specialties or areas of expertise?',
            id: 'Apa spesialisasi atau area keahliaan Anda dalam Coaching?'
        },
        'Do you offer coaching sessions online, offline, or a combination of both (hybrid)?': {
            en: 'Do you offer coaching sessions online, offline, or a combination of both (hybrid)?',
            id: 'Apakah Anda menawarkan sesi coaching melalui online, onsite atau keduanya (Hybrid)?'
        },
        'How many total hours of coaching experience do you have?': {
            en: 'How many total hours of coaching experience do you have?',
            id: 'Berapa total jam pengalaman coaching sejauh ini yang Anda miliki?'
        },
        'How long have you been working as a professional coach?': {
            en: 'How long have you been working as a professional coach?',
            id: 'Berapa lama Anda telah menjalani profesi sebagai professional Coach?'
        },
        'How many clients have you coached in total?': {
            en: 'How many clients have you coached in total?',
            id: 'Berapa banyak klien yang telah Anda Coach secara total?'
        },
        'What types of clients do you typically work with?': {
            en: 'What types of clients do you typically work with?',
            id: 'Apa tipe klien coaching yang biasanya bekerjasama dengan Anda?'
        },
        'What is your typical price range for coaching sessions or packages?': {
            en: 'What is your typical price range for coaching sessions or packages?',
            id: 'Berapa kisaran biaya coaching Anda per sesi coaching?'
        },
        'Have you received any awards or recognition for your coaching work?': {
            en: 'Have you received any awards or recognition for your coaching work?',
            id: 'Apa saja pencapaian atau pengakuan di bidang coaching yang pernah Anda dapatkan?'
        },
        'Provide a brief bio highlighting your background, coaching style, specialties, and how you help clients achieve their goals': {
            en: 'Provide a brief bio highlighting your background, coaching style, specialties, and how you help clients achieve their goals',
            id: 'Berikan biografi singkat yang menggambarkan latar belakang, gaya coaching, spesialisasi, dan cara Anda membantu klien mencapai tujuan mereka.'
        },
        'Submit': {
            en: 'Submit',
            id: 'Kirim'
        },
        'Thank you for filling out your Coach Information.': {
            en: 'Thank you for filling out your Coach Information.',
            id: 'Terima kasih telah mengisi Informasi Coach Anda.'
        },
        'Indonesian': {
            en: 'Indonesian',
            id: 'Bahasa Indonesia'
        },
        'English': {
            en: 'English',
            id: 'Bahasa Inggris'
        },
        'Please provide your Linkedin account link for your profile': {
            en: 'Please provide your Linkedin account link for your profile',
            id: 'Silakan berikan link akun Linkedin Anda untuk profil Anda'
        },
        'Linkedin account link': {
            en: 'Linkedin account link',
            id: 'Tautan akun Linkedin'
        },
        'Please provide your Instagram account link for your profile': {
            en: 'Please provide your Instagram account link for your profile',
            id: 'Silakan berikan link akun Instagram Anda untuk profil Anda'
        },
        'Instagram account link': {
            en: 'Instagram account link',
            id: 'Tautan akun Instagram'
        },
        'Please provide your Tiktok account link for your profile': {
            en: 'Please provide your Tiktok account link for your profile',
            id: 'Silakan berikan link akun Tiktok Anda  untuk profil Anda'
        },
        'Tiktok account link': {
            en: 'Tiktok account link',
            id: 'Tautan akun Tiktok'
        },
        'Please provide your Facebook account link for your profile': {
            en: 'Please provide your Facebook account link for your profile',
            id: 'Silakan berikan link Akun Facebook untuk profil Anda'
        },
        'Facebook account link': {
            en: 'Facebook account link',
            id: 'Tautan akun Facebook'
        },
        'Select...': {
            en: 'Select...',
            id: 'Pilih...'
        },
        'What other certifications or credentials do you have to be featured on your profile?': {
            en: 'What other certifications or credentials do you have to be featured on your profile?',
            id: 'Apa saja sertifikasi atau kredensial lain yang pernah Anda dapatkan untuk ditampilkan di profil Anda?'
        },
        'View Profile': {
            en: 'View Profile',
            id: 'Lihat Profil'
        },
        'Others': {
            en: 'Others',
            id: 'Lainnya'
        },
        'Reset': {
            en: 'Reset',
            id: 'Atur Ulang'
        },
        'Filter': {
            en: 'Filter',
            id: 'Saring'
        },
        'Coaching Registration': {
            en: 'Coaching Registration',
            id: 'Pendaftaran Coaching'
        },
        'Register for a session with': {
            en: 'Register for a session with',
            id: 'Daftar untuk sesi bersama'
        },

        'Email Address': {
            en: 'Email Address',
            id: 'Alamat Email'
        },
        'WhatsApp Number': {
            en: 'WhatsApp Number',
            id: 'Nomor WhatsApp'
        },
        'Domicile': {
            en: 'Domicile',
            id: 'Domisili'
        },
        'Current Position': {
            en: 'Current Position',
            id: 'Jabatan Saat Ini'
        },
        'Organization / Company': {
            en: 'Organization / Company',
            id: 'Organisasi / Perusahaan'
        },
        'Cancel': {
            en: 'Cancel',
            id: 'Batal'
        },
        'Submit Application': {
            en: 'Submit Application',
            id: 'Kirim Pendaftaran'
        },
        'Registration successful!': {
            en: 'Registration successful!',
            id: 'Pendaftaran berhasil!'
        },
        'Failed to send data.': {
            en: 'Failed to send data.',
            id: 'Gagal mengirim data.'
        },
        'Book Coaching Now': {
            en: 'Book Coaching Now',
            id: 'Daftar Coaching Sekarang'
        },
        'Close': {
            en: 'Close',
            id: 'Tutup'
        },
        'Samaloop Coaching Inquiry Form': {
            en: 'Samaloop Coaching Inquiry Form',
            id: 'Formulir Inkuiri Coaching Samaloop'
        },
        'Coaching Goals & Needs': {
            en: 'Coaching Goals & Needs',
            id: 'Tujuan & Kebutuhan Coaching'
        },
        'What drives you to seek coaching now? *': {
            en: 'What drives you to seek coaching now? *',
            id: 'Apa yang mendorong Anda mencari coaching saat ini? *'
        },
        'Focus areas you want to develop: *': {
            en: 'Focus areas you want to develop: *',
            id: 'Area fokus yang ingin Anda kembangkan: *'
        },
        'Leadership': { en: 'Leadership', id: 'Kepemimpinan' },
        'Career Transition': { en: 'Career Transition', id: 'Transisi Karir' },
        'Personal Growth': { en: 'Personal Growth', id: 'Pertumbuhan Pribadi' },
        'Wellbeing': { en: 'Wellbeing', id: 'Kesejahteraan' },
        'Business Development': { en: 'Business Development', id: 'Pengembangan Bisnis' },
        'Team / Organizational': { en: 'Team / Organizational', id: 'Tim / Organisasi' },
        'What kind of result do you want to achieve? *': {
            en: 'What kind of result do you want to achieve? *',
            id: 'Hasil seperti apa yang ingin Anda capai? *'
        },
        'Coach Preference & Logistics': {
            en: 'Coach Preference & Logistics',
            id: 'Preferensi Coach & Logistik'
        },
        'Session language preference: *': {
            en: 'Session language preference: *',
            id: 'Preferensi bahasa sesi: *'
        },
        'Session format: *': {
            en: 'Session format: *',
            id: 'Format sesi: *'
        },
        'Commitment & Ethics': {
            en: 'Commitment & Ethics',
            id: 'Komitmen & Etika'
        },
        'I understand that this is a consutation session *': {
            en: 'I understand that this is a consultation session *',
            id: 'Saya memahami bahwa ini adalah sesi konsultasi *'
        },
        'I am willing to follow the sessions consistently *': {
            en: 'I am willing to follow the sessions consistently *',
            id: 'Saya bersedia mengikuti sesi secara konsisten *'
        },
        'Online': {
            en: 'Online',
            id: 'Online'
        },
        'Offline': {
            en: 'Offline',
            id: 'Offline'
        },
        'Hybrid': {
            en: 'Hybrid',
            id: 'Hybrid'
        },
        'Bahasa Indonesia': {
            en: 'Bahasa Indonesia',
            id: 'Bahasa Indonesia' 
        },
        'Bilingual': {
            en: 'Bilingual',
            id: 'Bilingual'
        },
        'Session frequency: *': {
            en: 'Session frequency: *',
            id: 'Frekuensi sesi: *'
        },
        'Weekly': { en: 'Weekly', id: 'Mingguan' },
        'Bi-weekly': { en: 'Bi-weekly', id: 'Dua mingguan' },
        'Monthly': { en: 'Monthly', id: 'Bulanan' },
        'Readiness to start: *': {
            en: 'Readiness to start: *',
            id: 'Kesiapan untuk memulai: *'
        },
        'Immediately': { en: 'Immediately', id: 'Segera' },
        'Within 1 month': { en: 'Within 1 month', id: 'Dalam 1 bulan' },
        'Planning for future': { en: 'Planning for future', id: 'Perencanaan masa depan' },
        'Pay Now (Xendit)':
        {
            en: 'Pay Now (Xendit)',
            id: 'Bayar Sekarang (Xendit)'
        },
        'Close and pay later via email':{
            en: 'Close and pay later via email',
            id: 'Tutup dan bayar nanti melalui email'
        },
        'Administrative fee for coach matching & 1st consultation': {
            en: 'Administrative fee for coach matching & 1st consultation',
            id: 'Biaya administrasi untuk pencocokan coach & konsultasi pertama'
        }


    }

    if (common[key] === undefined || common[key][locale] === undefined) {
        return '';
    } else {
        return common[key][locale];
    }
};
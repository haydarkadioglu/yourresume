"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

const translations = {
  en: {
    dashboard: "Dashboard",
    viewMyCV: "View My CV",
    logout: "Log Out",
    content: "Content",
    appearance: "Appearance",
    settings: "Settings",
    personalInfo: "Personal Information",
    personalInfoDesc: "This information will appear at the top of your resume.",
    username: "Username",
    usernameDesc: "URL: /cv/{username}",
    fullName: "Full Name",
    title: "Title",
    email: "Email",
    phone: "Phone",
    website: "Website",
    linkedin: "LinkedIn",
    github: "GitHub",
    summary: "Summary",
    saveSection: "Save Section",
    saving: "Saving...",
    skills: "Skills",
    skillsDesc: "List your technical and professional skills, separated by commas.",
    experience: "Work Experience",
    experienceDesc: "Detail your professional history.",
    addExperience: "Add Experience",
    company: "Company",
    location: "Location",
    startDateEndDate: "Start - End Date",
    description: "Description",
    education: "Education",
    educationDesc: "List your academic background.",
    addEducation: "Add Education",
    degree: "Degree",
    institution: "Institution",
    projects: "Projects",
    projectsDesc: "Showcase your work.",
    addProject: "Add Project",
    projectName: "Project Name",
    url: "URL",
    tags: "Tags (comma-separated)",
    certifications: "Certifications",
    certificationsDesc: "List your certifications.",
    addCertification: "Add Certification",
    certificationName: "Certificate Name",
    issuer: "Issuer",
    date: "Date",
    templateSelection: "Template Selection",
    templateSelectionDesc: "Choose a template for your resume.",
    saveAppearance: "Save Appearance",
    classic: "Classic",
    modern: "Modern",
    minimalist: "Minimalist",
    passwordChange: "Password Change",
    passwordChangeDesc: "Update your password here. You will be logged out after a successful change.",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    updatePassword: "Update Password",
    passwordsDoNotMatch: "Passwords do not match.",
    passwordUpdated: "Password updated successfully. Please log in again.",
    passwordUpdateError: "Password Update Error",
    sectionSaved: "{section} Saved",
    sectionSavedDesc: "Your information has been successfully updated.",
    saveError: "Save Error",
  },
  tr: {
    dashboard: "Pano",
    viewMyCV: "CV'mi Görüntüle",
    logout: "Çıkış Yap",
    content: "İçerik",
    appearance: "Görünüm",
    settings: "Ayarlar",
    personalInfo: "Kişisel Bilgiler",
    personalInfoDesc: "Bu bilgiler özgeçmişinizin en üstünde görünecektir.",
    username: "Kullanıcı Adı",
    usernameDesc: "URL: /cv/{username}",
    fullName: "Tam Adınız",
    title: "Unvan",
    email: "E-posta",
    phone: "Telefon",
    website: "Web Sitesi",
    linkedin: "LinkedIn",
    github: "GitHub",
    summary: "Özet",
    saveSection: "Bölümü Kaydet",
    saving: "Kaydediliyor...",
    skills: "Yetenekler",
    skillsDesc: "Teknik ve profesyonel yeteneklerinizi virgülle ayırarak listeleyin.",
    experience: "İş Deneyimi",
    experienceDesc: "Profesyonel geçmişinizi detaylandırın.",
    addExperience: "Deneyim Ekle",
    company: "Şirket",
    location: "Konum",
    startDateEndDate: "Başlangıç - Bitiş Tarihi",
    description: "Açıklama",
    education: "Eğitim",
    educationDesc: "Akademik geçmişinizi listeleyin.",
    addEducation: "Eğitim Ekle",
    degree: "Bölüm",
    institution: "Kurum",
    projects: "Projeler",
    projectsDesc: "Çalışmalarınızı sergileyin.",
    addProject: "Proje Ekle",
    projectName: "Proje Adı",
    url: "URL",
    tags: "Etiketler (virgülle ayırın)",
    certifications: "Sertifikalar",
    certificationsDesc: "Sahip olduğunuz sertifikaları listeleyin.",
    addCertification: "Sertifika Ekle",
    certificationName: "Sertifika Adı",
    issuer: "Veren Kurum",
    date: "Tarih",
    templateSelection: "Şablon Seçimi",
    templateSelectionDesc: "Özgeçmişiniz için bir şablon seçin.",
    saveAppearance: "Görünümü Kaydet",
    classic: "Klasik",
    modern: "Modern",
    minimalist: "Minimalist",
    passwordChange: "Şifre Değiştirme",
    passwordChangeDesc: "Şifrenizi buradan güncelleyin. Başarılı bir değişiklikten sonra çıkış yapılacaktır.",
    newPassword: "Yeni Şifre",
    confirmNewPassword: "Yeni Şifreyi Onayla",
    updatePassword: "Şifreyi Güncelle",
    passwordsDoNotMatch: "Şifreler eşleşmiyor.",
    passwordUpdated: "Şifre başarıyla güncellendi. Lütfen tekrar giriş yapın.",
    passwordUpdateError: "Şifre Güncelleme Hatası",
    sectionSaved: "{section} Kaydedildi",
    sectionSavedDesc: "Bilgileriniz başarıyla güncellendi.",
    saveError: "Kaydetme Hatası",
  },
};

type Language = keyof typeof translations;
type TranslationKeys = keyof typeof translations['tr'];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys, params?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("tr");

  const t = useCallback((key: TranslationKeys, params?: { [key: string]: string }) => {
    let translation = translations[language][key] || translations['en'][key];
    if (params) {
      for (const paramKey in params) {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      }
    }
    return translation;
  }, [language]);

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

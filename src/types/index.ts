

export interface CustomTemplate {
  id: string;
  name: string;
  layout: 'single' | 'two-column' | 'three-column';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  headerStyle: 'centered' | 'left-aligned' | 'right-aligned';
  sectionStyle: 'minimal' | 'bordered' | 'colored-headers';
  showIcons: boolean;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  pageMargin: 'tight' | 'normal' | 'wide';
  sectionOrder: string[];
  columnConfig?: {
    leftColumn: string[];
    centerColumn?: string[];
    rightColumn: string[];
  };
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
    username?: string;
    template: 'classic' | 'modern' | 'minimalist' | 'two-column' | 'custom';
    themeColor?: string;
  };
  customTemplate?: CustomTemplate;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  customSections?: CustomSection[];
  sectionOrder?: string[];
  layout?: {
    sidebar: string[];
    main: string[];
  };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface LoginHistory {
  timestamp: any; // Firestore Timestamp
  ipAddress: string;
  userAgent: string;
  os: string;
}

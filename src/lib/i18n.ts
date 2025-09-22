export type SupportedLanguage = 'en' | 'mn' | 'es' | 'fr' | 'de' | 'zh';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const translations = {
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    privacy: 'Privacy',
    appearance: 'Appearance',
    
    // Appearance
    theme: 'Theme',
    language: 'Language',
    fontSize: 'Font Size',
    compactMode: 'Compact Mode',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    
    // Profile
    fullName: 'Full Name',
    bio: 'Bio',
    institution: 'Institution',
    githubUsername: 'GitHub Username',
    preferredLanguages: 'Preferred Programming Languages',
  },
  mn: {
    // Common
    save: 'Хадгалах',
    cancel: 'Цуцлах',
    loading: 'Ачааллаж байна...',
    error: 'Алдаа',
    success: 'Амжилттай',
    
    // Settings
    settings: 'Тохиргоо',
    profile: 'Профайл',
    notifications: 'Мэдэгдэл',
    privacy: 'Нууцлал',
    appearance: 'Харагдах байдал',
    
    // Appearance
    theme: 'Сэдэв',
    language: 'Хэл',
    fontSize: 'Үсгийн хэмжээ',
    compactMode: 'Компакт горим',
    light: 'Цагаан',
    dark: 'Хар',
    system: 'Систем',
    small: 'Жижиг',
    medium: 'Дунд',
    large: 'Том',
    
    // Profile
    fullName: 'Бүтэн нэр',
    bio: 'Товч танилцуулга',
    institution: 'Байгууллага',
    githubUsername: 'GitHub хэрэглэгчийн нэр',
    preferredLanguages: 'Дуртай програмчлалын хэл',
  },
  es: {
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Settings
    settings: 'Configuración',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    appearance: 'Apariencia',
    
    // Appearance
    theme: 'Tema',
    language: 'Idioma',
    fontSize: 'Tamaño de fuente',
    compactMode: 'Modo compacto',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    
    // Profile
    fullName: 'Nombre completo',
    bio: 'Biografía',
    institution: 'Institución',
    githubUsername: 'Nombre de usuario de GitHub',
    preferredLanguages: 'Lenguajes de programación preferidos',
  },
  fr: {
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Settings
    settings: 'Paramètres',
    profile: 'Profil',
    notifications: 'Notifications',
    privacy: 'Confidentialité',
    appearance: 'Apparence',
    
    // Appearance
    theme: 'Thème',
    language: 'Langue',
    fontSize: 'Taille de police',
    compactMode: 'Mode compact',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    small: 'Petit',
    medium: 'Moyen',
    large: 'Grand',
    
    // Profile
    fullName: 'Nom complet',
    bio: 'Biographie',
    institution: 'Institution',
    githubUsername: 'Nom d\'utilisateur GitHub',
    preferredLanguages: 'Langages de programmation préférés',
  },
  de: {
    // Common
    save: 'Speichern',
    cancel: 'Abbrechen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    
    // Settings
    settings: 'Einstellungen',
    profile: 'Profil',
    notifications: 'Benachrichtigungen',
    privacy: 'Datenschutz',
    appearance: 'Erscheinungsbild',
    
    // Appearance
    theme: 'Design',
    language: 'Sprache',
    fontSize: 'Schriftgröße',
    compactMode: 'Kompakter Modus',
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
    small: 'Klein',
    medium: 'Mittel',
    large: 'Groß',
    
    // Profile
    fullName: 'Vollständiger Name',
    bio: 'Biografie',
    institution: 'Institution',
    githubUsername: 'GitHub-Benutzername',
    preferredLanguages: 'Bevorzugte Programmiersprachen',
  },
  zh: {
    // Common
    save: '保存',
    cancel: '取消',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    
    // Settings
    settings: '设置',
    profile: '个人资料',
    notifications: '通知',
    privacy: '隐私',
    appearance: '外观',
    
    // Appearance
    theme: '主题',
    language: '语言',
    fontSize: '字体大小',
    compactMode: '紧凑模式',
    light: '浅色',
    dark: '深色',
    system: '系统',
    small: '小',
    medium: '中',
    large: '大',
    
    // Profile
    fullName: '全名',
    bio: '个人简介',
    institution: '机构',
    githubUsername: 'GitHub 用户名',
    preferredLanguages: '首选编程语言',
  },
};

export function getTranslation(key: string, language: SupportedLanguage = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || translations.en[key as keyof typeof translations.en] || key;
}

export function getLanguageConfig(code: SupportedLanguage): LanguageConfig {
  return supportedLanguages.find(lang => lang.code === code) || supportedLanguages[0];
}

// Komponen berisi SVG yang valid untuk digunakan di seluruh aplikasi

export const QuestionMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Ikon SVG dengan path yang sangat sederhana dan dijamin valid

export const ChartBarIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className="w-6 h-6"
  >
    <rect x="2" y="12" width="4" height="8" rx="1" />
    <rect x="8" y="8" width="4" height="12" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const InfoIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className="w-6 h-6"
  >
    <circle cx="10" cy="10" r="9" />
    <circle cx="10" cy="6" r="1" fill="white" />
    <rect x="9" y="9" width="2" height="7" rx="1" fill="white" />
  </svg>
);

export const WarningIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className="stroke-current shrink-0 h-6 w-6"
  >
    <path d="M10 1L1 18H19L10 1Z" />
    <rect x="9" y="7" width="2" height="6" rx="1" fill="white" />
    <circle cx="10" cy="15" r="1" fill="white" />
  </svg>
);

export const UsersIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className="w-6 h-6"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="14" cy="6" r="3" />
    <path d="M1 18C1 14.6863 3.68629 12 7 12H9C12.3137 12 15 14.6863 15 18H1Z" />
    <path d="M13 18C13 16.3431 14.3431 15 16 15H18C19.6569 15 21 16.3431 21 18H13Z" />
  </svg>
);

export const SearchIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
  >
    <circle cx="8" cy="8" r="6" />
    <line x1="14" y1="14" x2="18" y2="18" />
  </svg>
);

export const DownloadIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path d="M10 1V13M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M1 15V18C1 18.5523 1.44772 19 2 19H18C18.5523 19 19 18.5523 19 18V15" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const ExternalLinkIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className="w-4 h-4 ml-1"
  >
    <path d="M11 3C10.4477 3 10 3.44772 10 4C10 4.55228 10.4477 5 11 5H13.5858L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L15 6.41421V9C15 9.55228 15.4477 10 16 10C16.5523 10 17 9.55228 17 9V4C17 3.44772 16.5523 3 16 3H11Z" />
    <path d="M5 5C3.89543 5 3 5.89543 3 7V15C3 16.1046 3.89543 17 5 17H13C14.1046 17 15 16.1046 15 15V12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V15H5V7H8C8.55228 7 9 6.55228 9 6C9 5.44772 8.55228 5 8 5H5Z" />
  </svg>
);

// Opsi alternatif - gunakan teks daripada ikon
export const TextIcons = {
  chart: "📊",
  info: "ℹ️",
  warning: "⚠️",
  users: "👥",
  search: "🔍",
  download: "💾",
  external: "↗️"
};
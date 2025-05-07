export const translations = {
  en: {
    // Header
    appTitle: "Instagram Unfollowers Checker",
    home: "Home",
    tutorial: "Tutorial",
    
    // Welcome modal
    welcomeTitle: "Welcome to Instagram Unfollowers Checker!",
    step1Title: "Step 1: Download your Instagram data",
    step1Instructions: [
      "Open Instagram app or website",
      "Go to your profile and tap on the menu icon",
      "Go to Settings and privacy",
      "Find Accounts Center",
      "Select Your information and permissions",
      "Tap Download your information",
      "Request a download in JSON format"
    ],
    step2Title: "Step 2: Upload your JSON files",
    step2Instructions: [
      "Once Instagram emails you the data, download and extract the ZIP file",
      "Find the followers_and_following folder",
      "Locate these files:",
      "Upload both files using the file upload buttons",
      "Click on Find Unfollowers button"
    ],
    followersFile: "followers_1.json (your followers)",
    followingFile: "following.json (accounts you follow)",
    step3Title: "Step 3: Review your results",
    step3Instructions: [
      "View statistics about your followers and following",
      "See the complete list of users who don't follow you back",
      "Search for specific usernames in the list",
      "Export the unfollowers list for later reference",
      "Click on any user to view their Instagram profile"
    ],
    dataPrivacyNote: "Your data remains private and is processed entirely on your device.",
    previous: "Previous",
    next: "Next",
    getStarted: "Get Started",
    
    // Main page
    tagline: "Find out who doesn't follow you back on Instagram by uploading your followers and following data",
    showTutorial: "Show Tutorial",
    
    // File Upload
    uploadTitle: "Upload Instagram Data",
    uploadInstructions: "Upload your Instagram followers and following JSON files to find who doesn't follow you back",
    followersJson: "Followers JSON",
    followingJson: "Following JSON",
    peopleWhoFollowYou: "People who follow you",
    peopleYouFollow: "People you follow",
    bothFilesLoaded: "Both files loaded successfully",
    pleaseUploadFiles: "Please upload both files",
    stillNeedToUpload: "Still need to upload {fileType} file",
    findUnfollowers: "Find Unfollowers",
    processing: "Processing...",
    
    // Stats
    accountStatistics: "Account Statistics",
    followers: "Followers",
    peopleFollowingYou: "People following you",
    following: "Following",
    dontFollowBack: "Don't Follow Back",
    ofYourFollowing: "% of your following",
    followBackRatio: "Follow-back ratio",
    usersFollowYouBack: "{count} users follow you back",
    usersDontFollowYouBack: "{count} users don't follow you back",
    
    // Unfollowers List
    usersWhoDoNotFollowBack: "Users Who Don't Follow You Back",
    searchUsers: "Search users...",
    export: "Export",
    noUsersFound: "No users found matching your search criteria.",
    profile: "Profile",
    username: "Username",
    fullName: "Full Name",
    action: "Action",
    viewProfile: "View Profile",
    
    // How to
    howToGetData: "How to get your Instagram data",
    howToInstructions: [
      "Open Instagram on your mobile or web browser",
      "Go to your profile and tap on the menu (three lines)",
      "Select Settings and privacy",
      "Tap on Accounts Center",
      "Select Your information and permissions",
      "Tap Download your information",
      "Select Request a download",
      "Choose JSON format and select Followers and following",
      "Submit the request and wait for Instagram to prepare your data",
      "Once ready, download and extract the zip file",
      "You will need: followers_1.json and following.json files"
    ],
    important: "Important",
    dataPrivacyWarning: "Your data remains on your device and is not uploaded to any server",
    
    // Errors & Success Messages
    error: "Error",
    errorUploadBoth: "Please upload both followers and following data files first",
    errorInvalidFormat: "Invalid data format: Expected arrays for followers and following",
    successFoundUnfollowers: "Found {count} users who don't follow you back",
    
    
    // Language
    language: "Language",
    english: "English",
    indonesian: "Indonesian"
  },
  id: {
    // Header
    appTitle: "Pemeriksa Unfollowers Instagram",
    home: "Beranda",
    tutorial: "Tutorial",
    
    // Welcome modal
    welcomeTitle: "Selamat datang di Pemeriksa Unfollowers Instagram!",
    step1Title: "Langkah 1: Unduh data Instagram Anda",
    step1Instructions: [
      "Buka aplikasi atau situs web Instagram",
      "Buka profil Anda dan ketuk ikon menu",
      "Buka Pengaturan dan privasi",
      "Temukan Pusat Akun",
      "Pilih Informasi dan izin Anda",
      "Ketuk Unduh informasi Anda",
      "Minta unduhan dalam format JSON"
    ],
    step2Title: "Langkah 2: Unggah file JSON Anda",
    step2Instructions: [
      "Setelah Instagram mengirimkan data ke email Anda, unduh dan ekstrak file ZIP",
      "Temukan folder followers_and_following",
      "Temukan file-file ini:",
      "Unggah kedua file menggunakan tombol unggah file",
      "Klik tombol Temukan Unfollowers"
    ],
    followersFile: "followers_1.json (pengikut Anda)",
    followingFile: "following.json (akun yang Anda ikuti)",
    step3Title: "Langkah 3: Tinjau hasil Anda",
    step3Instructions: [
      "Lihat statistik tentang pengikut dan yang Anda ikuti",
      "Lihat daftar lengkap pengguna yang tidak mengikuti Anda kembali",
      "Cari nama pengguna tertentu dalam daftar",
      "Ekspor daftar unfollowers untuk referensi nanti",
      "Klik pada pengguna untuk melihat profil Instagram mereka"
    ],
    dataPrivacyNote: "Data Anda tetap privat dan diproses sepenuhnya di perangkat Anda.",
    previous: "Sebelumnya",
    next: "Selanjutnya",
    getStarted: "Mulai",
    
    // Main page
    tagline: "Temukan siapa yang tidak mengikuti Anda kembali di Instagram dengan mengunggah data pengikut dan yang Anda ikuti",
    showTutorial: "Tampilkan Tutorial",
    
    // File Upload
    uploadTitle: "Unggah Data Instagram",
    uploadInstructions: "Unggah file JSON pengikut dan yang Anda ikuti untuk menemukan siapa yang tidak mengikuti Anda kembali",
    followersJson: "JSON Pengikut",
    followingJson: "JSON Yang Diikuti",
    peopleWhoFollowYou: "Orang yang mengikuti Anda",
    peopleYouFollow: "Orang yang Anda ikuti",
    bothFilesLoaded: "Kedua file berhasil dimuat",
    pleaseUploadFiles: "Silakan unggah kedua file",
    stillNeedToUpload: "Masih perlu mengunggah file {fileType}",
    findUnfollowers: "Temukan Unfollowers",
    processing: "Memproses...",
    
    // Stats
    accountStatistics: "Statistik Akun",
    followers: "Pengikut",
    peopleFollowingYou: "Orang yang mengikuti Anda",
    following: "Mengikuti",
    dontFollowBack: "Tidak Mengikuti Balik",
    ofYourFollowing: "% dari yang Anda ikuti",
    followBackRatio: "Rasio follow-back",
    usersFollowYouBack: "{count} pengguna mengikuti Anda kembali",
    usersDontFollowYouBack: "{count} pengguna tidak mengikuti Anda kembali",
    
    // Unfollowers List
    usersWhoDoNotFollowBack: "Pengguna yang Tidak Mengikuti Anda Kembali",
    searchUsers: "Cari pengguna...",
    export: "Ekspor",
    noUsersFound: "Tidak ada pengguna yang sesuai dengan kriteria pencarian Anda.",
    profile: "Profil",
    username: "Username",
    fullName: "Nama Lengkap",
    action: "Tindakan",
    viewProfile: "Lihat Profil",
    
    // How to
    howToGetData: "Cara mendapatkan data Instagram Anda",
    howToInstructions: [
      "Buka Instagram di ponsel atau browser web Anda",
      "Buka profil Anda dan ketuk menu (tiga garis)",
      "Pilih Pengaturan dan privasi",
      "Ketuk Pusat Akun",
      "Pilih Informasi dan izin Anda",
      "Ketuk Unduh informasi Anda",
      "Pilih Minta unduhan",
      "Pilih format JSON dan pilih Pengikut dan mengikuti",
      "Kirim permintaan dan tunggu Instagram menyiapkan data Anda",
      "Setelah siap, unduh dan ekstrak file zip",
      "Anda akan membutuhkan: file followers_1.json dan following.json"
    ],
    important: "Penting",
    dataPrivacyWarning: "Data Anda tetap berada di perangkat Anda dan tidak diunggah ke server mana pun",
    
    // Errors & Success Messages
    error: "Error",
    errorUploadBoth: "Silakan unggah file data pengikut dan yang diikuti terlebih dahulu",
    errorInvalidFormat: "Format data tidak valid: Diharapkan array untuk pengikut dan yang diikuti",
    successFoundUnfollowers: "Ditemukan {count} pengguna yang tidak mengikuti Anda kembali",
        
    // Language
    language: "Bahasa",
    english: "Inggris",
    indonesian: "Indonesia"
  }
}
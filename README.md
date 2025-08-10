# Dismissal App (Expo SDK 53 + React Native + Firebase) — with QR/Barcode Scan

Features
- Anonymous login with a friendly school splash
- Students: live list + search; seed 30 demo students
- Check In: enter a car number -> adds all matching students to the queue
- Queue: live ordered list across devices; Cone = index by createdAt; Clear to complete
- Scan: QR/Barcode scanning via `expo-barcode-scanner` (extracts digits from scanned text)

Quick Start
1) Create Firebase project; enable Anonymous Auth + Firestore
2) Copy .env.example to .env and fill in keys
3) Install & run:
   npm i
   npx expo install expo-barcode-scanner
   npx expo start -c

Notes
- SDK 53 compatible with current Expo Go
- Keep project out of iCloud/Dropbox to avoid EMFILE watch errors
- Scan tab extracts the first number sequence from the code (e.g., 'CAR-20' -> '20') and pre-fills Check In

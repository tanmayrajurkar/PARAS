# PARAS

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://paras-v1.netlify.app)

A full-stack parking management solution with real-time availability tracking, AI-powered analytics, and integrated mapping.

## Features ✨
- 🗺️ Interactive map-based parking selection (MapBookings.jsx:34-36)
- 🕓 Real time street parking availability
- 🤖 AI-generated congestion reports (GovDashboard.jsx:62-75)
- 📱 Mobile-responsive UI with geolocation
- 🔐 User authentication with Supabase
- 📊 Admin dashboard with booking analytics
- 📄 PDF report generation (GovDashboard.jsx:77-209)

## Installation 🛠️

```bash
git clone https://github.com/tanmayrajurkar/PARAS.git
cd parkease
npm install
```

## Configuration ⚙️

Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
VITE_GEMINI_API_KEY=your_gemini_key
```

## Database Setup 🛄️


## Running the App 🚀

```bash
npm run dev  # Start development server
npm run build  # Create production build
npm run preview  # Preview production build
```

## Tech Stack 🛠

| Component          | Technology                          |
|---------------------|-------------------------------------|
| Frontend Framework  | React 18 + Vite                     |
| State Management    | Redux Toolkit                       |
| Mapping             | Google Maps JavaScript API          |
| AI Integration      | Google Gemini                       |
| Database            | Supabase PostgreSQL                 |
| Styling             | Tailwind CSS                        |

## File Structure 📂

```
src/
├── components/       # Reusable UI components
├── features/         # Redux slices (bookingsSlice.js:1-108)
├── pages/            # Application routes
├── services/         # API services (supabase.js:97-171)
├── hooks/            # Custom hooks
└── assets/           # Images & icons
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## License 📄
MIT License - See [LICENSE](LICENSE) for details

> **Note**: Requires Google Maps API key and Supabase credentials for full functionality.


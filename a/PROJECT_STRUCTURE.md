# Accountesy Project Structure

## 📁 Final Production Structure

```
accountesy/
├── 📄 Configuration Files
│   ├── .env.example              # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── render.yaml              # Render deployment config
│   ├── requirements.txt          # Python dependencies
│   ├── package.json             # Node.js dependencies
│   ├── vite.config.js           # Vite build config
│   └── tailwind.config.js       # Tailwind CSS config
│
├── 🐍 Backend (FastAPI)
│   └── app/
│       ├── core/
│       │   └── config.py       # Settings & env management
│       ├── db/
│       │   └── database.py    # Supabase connection
│       ├── models/
│       │   └── schemas.py     # Pydantic models
│       ├── routes/
│       │   ├── auth.py         # Authentication
│       │   ├── convert.py      # File conversion
│       │   ├── preview.py      # Transaction preview
│       │   ├── history.py      # Conversion history
│       │   ├── admin.py        # Admin panel
│       │   ├── downloads.py    # Download center
│       │   └── free_tool.py   # Free converter
│       └── services/
│           ├── file_converter.py   # File processing
│           ├── ai_mapper.py       # AI mapping
│           ├── xml_generator.py   # XML export
│           └── credit_service.py # Credit management
│
├── ⚛️ Frontend (React)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx      # Navigation
│       │   ├── Footer.jsx      # Footer
│       │   └── ProtectedRoute.jsx # Route protection
│       ├── pages/
│       │   ├── Landing.jsx     # Homepage
│       │   ├── Login.jsx       # Login page
│       │   ├── Register.jsx    # Registration
│       │   ├── Dashboard.jsx   # User dashboard
│       │   ├── Convert.jsx     # File upload
│       │   ├── Preview.jsx     # Transaction preview
│       │   ├── History.jsx     # Conversion history
│       │   ├── Account.jsx     # User account
│       │   ├── Pricing.jsx     # Pricing plans
│       │   ├── FreeConverter.jsx # Free tool
│       │   ├── Downloads.jsx    # Download center
│       │   └── Admin.jsx       # Admin panel
│       ├── contexts/
│       │   └── AuthContext.jsx # Authentication context
│       ├── index.css           # Global styles
│       └── main.jsx           # App entry
│
├── 🖼️ Static Files
│   └── static/
│       ├── assets/
│       │   ├── logo.png        # Main brand logo
│       │   ├── logo1.png       # Sponsor logo
│       │   ├── index-*.js     # Built JS
│       │   └── index-*.css    # Built CSS
│       └── temp/               # Temporary files
│
├── 📄 Templates
│   └── templates/
│       └── index.html          # HTML template
│
├── 🚀 Deployment
│   ├── main.py               # FastAPI application
│   ├── deploy.sh             # Deployment script
│   └── .github/
│       └── workflows/
│           └── deploy.yml      # GitHub Actions
│
└── 📚 Documentation
    ├── README.md              # Project documentation
    ├── DEPLOYMENT.md          # Deployment guide
    └── supabase_schema.sql   # Database schema
```

## 🔑 Environment Variables

### Required for Production:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase public key
- `SUPABASE_SERVICE_KEY` - Supabase service key
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration
- `VITE_SUPABASE_URL` - Frontend Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Frontend Supabase key
- `VITE_API_URL` - API base URL

## 🚀 Deployment Commands

### Local Development:
```bash
# Backend
python main.py

# Frontend (dev)
npm run dev
```

### Production Build:
```bash
# Full build
pip install --upgrade pip
pip install -r requirements.txt
npm install
npm run build
```

### Render Deployment:
```bash
# Automatic via GitHub Actions
git push main

# Manual deployment
./deploy.sh
```

## 🌐 Key Features

### ✅ Authentication:
- JWT token-based auth
- Remember me functionality
- Protected routes
- Session management

### ✅ Core Features:
- Multi-format file conversion (PDF, Excel, CSV)
- AI-powered ledger mapping
- XML generation
- Credit system
- Conversion history
- Admin panel

### ✅ UI/UX:
- Modern SaaS design
- Mobile responsive
- Toast notifications
- Loading states
- Error handling

### ✅ Production Ready:
- Environment variable management
- Static file serving
- Error handling
- Logging
- Health checks

## 📦 Dependencies

### Backend:
- FastAPI
- Supabase
- Pandas
- PDFPlumber
- Python-JOSE
- Tailwind CSS

### Frontend:
- React 18
- React Router
- Axios
- Lucide Icons
- Vite

## 🔧 Configuration

### FastAPI:
- CORS enabled
- Static file serving
- API documentation
- Health checks

### Vite:
- Proxy configuration
- Build optimization
- Environment variables
- Asset bundling

## 📊 Architecture

```
┌─────────────────┐
│   Browser     │
└─────────┬─────┘
          │
    ┌─────┴─────┐
    │   React     │
    │   Frontend  │
    └─────┬─────┘
          │
    ┌─────┴─────┐
    │   FastAPI    │
    │   Backend    │
    └─────┬─────┘
          │
    ┌─────┴─────┐
    │  Supabase    │
    │  Database    │
    └─────────────┘
```

## 🎯 Production Checklist

- [x] Environment variables configured
- [x] Static files properly served
- [x] Build process tested
- [x] Authentication working
- [x] Database connection tested
- [x] Frontend routes protected
- [x] Error handling implemented
- [x] Logging configured
- [x] Health checks added
- [x] Deployment scripts ready

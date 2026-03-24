# Accountesy - Smart Accounting for Modern Business

A production-ready SaaS web application that converts bank statements to Tally XML using AI-powered mapping. Supports all Indian banks, NBFCs, and Post Office statements.

## 🚀 Features

- **AI-Powered Ledger Mapping**: Automatic transaction categorization with confidence scoring
- **Manual Selection**: Full control over ledger assignments
- **Multiple File Formats**: PDF, Excel, CSV support with OCR capabilities
- **All Indian Banks**: Comprehensive support for Indian banking systems
- **Credit-Based Pricing**: Pay-per-use model with transparent pricing
- **Free Tool**: PDF to Excel converter without registration
- **Admin Panel**: Complete user and system management
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Supabase**: PostgreSQL database with real-time capabilities
- **JWT Authentication**: Secure token-based authentication
- **Python**: Core backend language with extensive libraries

### Frontend
- **React**: Modern UI framework with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### File Processing
- **PyPDF2**: PDF text extraction
- **Tesseract OCR**: Advanced OCR capabilities
- **Pandas**: Data manipulation and analysis
- **OpenPyXL**: Excel file handling

## 📋 Requirements

- Python 3.11+
- Node.js 18+
- Supabase account
- Render account (for deployment)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd accountesy
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Build for production
npm run build
```

### 4. Database Setup

The application will automatically create the necessary tables on first run. Make sure your Supabase project is configured with the correct connection settings in `.env`.

### 5. Run Locally

```bash
# Start the FastAPI server
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The application will be available at `http://localhost:8000`

## 🌐 Deployment

### Render Deployment

1. Connect your repository to Render
2. Configure environment variables in Render dashboard
3. Deploy using the provided `render.yaml` configuration

**Build Command:**
```bash
pip install --upgrade pip && pip install -r requirements.txt && npm install && npm run build
```

**Start Command:**
```bash
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

## 📊 Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `credits`: Available credits
- `role`: User role (user/admin)
- `active_plan`: Current subscription plan
- `valid_till`: Plan expiration date
- `created_at`: Account creation timestamp

### Plans Table
- `id`: UUID (Primary Key)
- `name`: Plan name
- `credits`: Credits included
- `validity_months`: Plan duration
- `price`: Plan cost
- `is_active`: Plan availability status

### History Table
- `id`: UUID (Primary Key)
- `user_id`: User reference
- `file_name`: Original filename
- `xml_data`: Generated Tally XML
- `created_at`: Conversion timestamp

### Notifications Table
- `id`: UUID (Primary Key)
- `user_id`: User reference (nullable for broadcasts)
- `title`: Notification title
- `message`: Notification content
- `created_at`: Notification timestamp
- `read`: Read status

## 💳 Pricing Model

- **AI Auto Mapping**: 0.1 credits per voucher
- **Manual Selection**: 0.05 credits per voucher
- **Free Plan**: 10 credits, 1 month validity
- **Starter Plan**: 100 credits, 1 month, ₹299
- **Professional Plan**: 500 credits, 3 months, ₹999

## 🔐 Security Features

- JWT-based authentication with secure token handling
- Password hashing using bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- SQL injection prevention through ORM

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - User profile
- `GET /api/users/history` - Conversion history
- `POST /api/users/deduct-credits` - Credit deduction

### Upload & Processing
- `POST /api/upload/upload` - File upload
- `POST /api/upload/process` - Transaction processing
- `POST /api/upload/generate-xml` - XML generation

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - User management
- `POST /api/admin/users/create` - Create user
- `GET /api/admin/plans` - Plan management

## 🧪 Testing

```bash
# Run backend tests
python -m pytest

# Run frontend tests
npm test
```

## 📝 Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256

# Admin User
ADMIN_EMAIL=admin@accountesy.com
ADMIN_PASSWORD=secure_password

# Application Settings
APP_NAME=Accountesy
APP_VERSION=1.0.0
DEBUG=False
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@accountesy.com
- Documentation: [docs.accountesy.com](https://docs.accountesy.com)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🎯 Roadmap

- [ ] Mobile applications (iOS/Android)
- [ ] Advanced AI models for better accuracy
- [ ] Integration with accounting software
- [ ] Multi-currency support
- [ ] Advanced reporting and analytics
- [ ] API for third-party integrations
- [ ] Enterprise features and SSO

---

**Built with ❤️ for Indian businesses**

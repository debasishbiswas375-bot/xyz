# Accountesy - Smart Accounting SaaS

Accountesy is a production-ready SaaS platform that converts financial documents (CSV, Excel, PDF) into standardized XML vouchers using AI-powered ledger mapping.

## 🚀 Features

- **Multi-format Support**: Convert CSV, Excel, and PDF files
- **AI-Powered Mapping**: Intelligent ledger assignment with confidence scoring
- **Preview & Edit**: Review and edit transactions before generation
- **Credit System**: Pay-per-use pricing model
- **Free Tool**: PDF to Excel converter (no registration required)
- **Download Center**: Sample files and templates
- **Admin Panel**: User and system management
- **Responsive Design**: Works on all devices

## 🏗️ Architecture

- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite (served by FastAPI)
- **Database**: Supabase (PostgreSQL)
- **File Processing**: pandas, pdfplumber
- **AI Mapping**: Rule-based engine with learning capabilities

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Supabase account

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd accountesy
```

### 2. Set up Supabase
1. Create a new Supabase project
2. Run the SQL schema from `supabase_schema.sql`
3. Get your Supabase URL and keys
4. Update `.env` file with your credentials

### 3. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Update .env file with your Supabase credentials
cp .env.example .env
# Edit .env with your actual values
```

### 4. Frontend Setup
```bash
# Install Node dependencies
npm install

# Build the frontend
npm run build
```

### 5. Start the Application
```bash
# Start the FastAPI server
python main.py
```

The application will be available at `http://127.0.0.1:8000`

## 🔧 Configuration

### Environment Variables
Update `.env` with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Supabase Setup
1. Run the SQL schema in Supabase SQL editor
2. Enable authentication in Supabase
3. Set up storage buckets for file uploads
4. Configure RLS policies

## 📊 Database Schema

- `users`: User accounts and credits
- `ai_memory`: AI learning data for ledger mapping
- `history`: Conversion history and XML exports
- `downloads`: Downloadable files and templates

## 🔄 Core Flow

1. **Upload**: User uploads CSV/Excel/PDF file
2. **Parse**: Extract and normalize transaction data
3. **Map**: AI assigns ledgers with confidence scores
4. **Preview**: User reviews and edits if needed
5. **Generate**: Create XML vouchers (deducts credits)
6. **Download**: User downloads XML file
7. **Learn**: System learns from user edits

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Conversion
- `POST /api/convert/upload` - Upload and convert file
- `POST /api/convert/preview` - Preview transactions

### Preview
- `POST /api/preview/edit` - Edit transaction ledger
- `POST /api/preview/bulk-update` - Bulk update ledgers
- `GET /api/preview/filter` - Filter transactions

### History
- `POST /api/history/generate-xml` - Generate XML
- `GET /api/history/` - Get conversion history
- `GET /api/history/download/{id}` - Download XML file

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/{id}/add-credits` - Add user credits
- `GET /api/admin/stats` - Get system statistics

### Free Tool
- `POST /api/free/pdf-to-excel` - Convert PDF to Excel

### Downloads
- `GET /api/downloads/` - Get downloadable files
- `GET /api/downloads/download/{id}` - Download file

## 💳 Credit System

- **Rate**: 0.1 credit per voucher
- **New Users**: 10 free credits
- **Plans**: Free (10 credits), Pro (500/month), Enterprise (unlimited)

## 🎨 Frontend Pages

### Public
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/pricing` - Pricing plans
- `/free-tool` - Free PDF to Excel converter
- `/downloads` - Download center

### User (Protected)
- `/dashboard` - User dashboard
- `/convert` - File conversion
- `/preview` - Transaction preview and editing
- `/history` - Conversion history
- `/account` - Account settings

### Admin (Protected)
- `/admin` - Admin panel

## 🔒 Security Features

- JWT authentication
- Row Level Security (RLS)
- File upload validation
- Input sanitization
- CORS protection
- Rate limiting (recommended for production)

## 🚀 Deployment

### Production Setup
1. Set up reverse proxy (nginx)
2. Configure SSL certificates
3. Set up environment variables
4. Configure Supabase for production
5. Set up monitoring and logging

### Docker Deployment
```dockerfile
# Dockerfile example
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN npm install && npm run build

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📈 Monitoring

- Application logs
- Error tracking
- Performance metrics
- User analytics
- Credit usage tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@accountesy.com or create an issue in the repository.

## 🔄 Updates

Regular updates include:
- New AI mapping rules
- Additional file format support
- Enhanced security features
- Performance improvements
- New integrations

---

Built with ❤️ using FastAPI, React, and Supabase

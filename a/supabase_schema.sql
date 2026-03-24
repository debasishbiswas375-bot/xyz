-- Accountesy Database Schema
-- Run this in your Supabase SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    credits INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Memory table
CREATE TABLE IF NOT EXISTS ai_memory (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    narration TEXT NOT NULL,
    ledger TEXT NOT NULL,
    confidence INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- History table
CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    voucher_count INTEGER NOT NULL,
    credits_used DECIMAL(10,2) NOT NULL,
    xml_path TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- AI Memory policies
CREATE POLICY "Users can view own AI memory" ON ai_memory
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage own AI memory" ON ai_memory
    FOR ALL USING (auth.uid()::text = user_id);

-- History policies
CREATE POLICY "Users can view own history" ON history
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own history" ON history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Downloads policies (public read access)
CREATE POLICY "Anyone can view downloads" ON downloads
    FOR SELECT USING (true);

-- Admin policies (for admin user)
CREATE POLICY "Admin can manage all users" ON users
    FOR ALL USING (auth.uid()::text = 'admin');

CREATE POLICY "Admin can view all AI memory" ON ai_memory
    FOR SELECT USING (auth.uid()::text = 'admin');

CREATE POLICY "Admin can manage all AI memory" ON ai_memory
    FOR ALL USING (auth.uid()::text = 'admin');

CREATE POLICY "Admin can view all history" ON history
    FOR SELECT USING (auth.uid()::text = 'admin');

CREATE POLICY "Admin can manage downloads" ON downloads
    FOR ALL USING (auth.uid()::text = 'admin');

-- Insert sample downloads
INSERT INTO downloads (name, description, file_url, category) VALUES
('Sample Bank Statement', 'Sample CSV file with bank transaction data', '/static/downloads/sample_bank_statement.csv', 'templates'),
('Excel Template', 'Pre-formatted Excel template for transaction data', '/static/downloads/transaction_template.xlsx', 'templates'),
('PDF Guide', 'PDF formatting guide for best conversion results', '/static/downloads/pdf_guide.pdf', 'guides'),
('API Documentation', 'Technical documentation for API integration', '/static/downloads/api_docs.pdf', 'documentation')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_memory_user_id ON ai_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_narration ON ai_memory(narration);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp);
CREATE INDEX IF NOT EXISTS idx_downloads_category ON downloads(category);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

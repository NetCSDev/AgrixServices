-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  language VARCHAR(50) DEFAULT 'en',
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  mobile VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_otp_user_id ON otp_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp_verifications(mobile);

-- Insert sample data (optional)
INSERT INTO users (name, mobile, language, address) VALUES 
  ('John Doe', '1234567890', 'en', '123 Main Street'),
  ('Jane Smith', '0987654321', 'en', '456 Oak Avenue')
ON CONFLICT (mobile) DO NOTHING;

-- Create APMC table
CREATE TABLE IF NOT EXISTS apmc (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  apmc VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for complaints
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);

-- Insert APMC options
INSERT INTO apmc (name) VALUES 
  ('Mumbai APMC'),
  ('Pune APMC'),
  ('Nashik APMC'),
  ('Nagpur APMC'),
  ('Aurangabad APMC'),
  ('Solapur APMC'),
  ('Kolhapur APMC')
ON CONFLICT (name) DO NOTHING;

-- Insert Subject options
INSERT INTO subjects (name) VALUES 
  ('Price Issues'),
  ('Quality of Produce'),
  ('Weighing Scale Problems'),
  ('Payment Delays'),
  ('Facility Maintenance'),
  ('Staff Behavior'),
  ('Documentation Issues'),
  ('Transportation'),
  ('Storage Facilities'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- Create News Articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  source VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  url TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for news articles
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_title ON news_articles USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_news_description ON news_articles USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_news_content ON news_articles USING gin(to_tsvector('english', content));

-- Insert sample news articles
INSERT INTO news_articles (title, description, content, image_url, source, author, url, category, tags) VALUES 
  (
    'New Government Scheme for Farmers',
    'Government announces new subsidy scheme to support small farmers',
    'The government has announced a comprehensive support scheme for small and marginal farmers. The scheme includes direct benefit transfers, subsidized seeds, and low-interest loans. This initiative aims to boost agricultural productivity and farmer income.',
    'https://via.placeholder.com/800x400?text=Government+Scheme',
    'Agriculture India',
    'Rajesh Kumar',
    'https://example.com/news/government-scheme',
    'Government Schemes',
    ARRAY['subsidy', 'farmers', 'government', 'agriculture']
  ),
  (
    'Organic Farming: The Future of Agriculture',
    'More farmers are switching to organic farming methods',
    'Organic farming is gaining popularity among farmers across the country. The demand for organic produce has increased significantly, leading to better prices for organic farmers. Experts believe this trend will continue to grow.',
    'https://via.placeholder.com/800x400?text=Organic+Farming',
    'Farm Today',
    'Priya Sharma',
    'https://example.com/news/organic-farming',
    'Farming Techniques',
    ARRAY['organic', 'sustainable', 'farming']
  ),
  (
    'Technology in Agriculture: AI and IoT Solutions',
    'How technology is transforming traditional farming',
    'Artificial Intelligence and Internet of Things are revolutionizing agriculture. From smart irrigation systems to AI-powered crop monitoring, technology is helping farmers increase yields and reduce costs. Several startups are developing innovative solutions for Indian farmers.',
    'https://via.placeholder.com/800x400?text=AgriTech',
    'Tech Farmer Magazine',
    'Amit Patel',
    'https://example.com/news/agritech',
    'Technology',
    ARRAY['technology', 'AI', 'IoT', 'innovation']
  ),
  (
    'Market Prices Stabilize After Monsoon',
    'Vegetable and grain prices show stability',
    'After months of fluctuation, agricultural commodity prices have stabilized following a good monsoon season. Farmers are optimistic about getting fair prices for their produce at APMCs across the country.',
    'https://via.placeholder.com/800x400?text=Market+Prices',
    'Market Watch',
    'Sneha Desai',
    'https://example.com/news/market-prices',
    'Market News',
    ARRAY['prices', 'market', 'monsoon']
  )
ON CONFLICT (id) DO NOTHING;

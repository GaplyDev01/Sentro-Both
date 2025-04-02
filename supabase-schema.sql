-- Schema for the News Impact Platform

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create Users Table (in addition to Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  business_industry TEXT,
  business_location TEXT,
  setup_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  source_id TEXT,
  source_name TEXT NOT NULL,
  author TEXT,
  url TEXT UNIQUE NOT NULL,
  url_to_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  relevance_categories TEXT[] DEFAULT '{}',
  impact_score INTEGER NOT NULL CHECK (impact_score >= -100 AND impact_score <= 100),
  sentiment_analysis JSONB DEFAULT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  overall_impact INTEGER NOT NULL CHECK (overall_impact >= -100 AND overall_impact <= 100),
  impact_areas JSONB NOT NULL,
  timeframes JSONB NOT NULL,
  confidence_level INTEGER NOT NULL CHECK (confidence_level >= 0 AND confidence_level <= 100),
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_impact_score ON news_articles(impact_score DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_relevance ON news_articles USING GIN(relevance_categories);

CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_news_article_id ON predictions(news_article_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_predictions_user_article ON predictions(user_id, news_article_id);

-- Add RLS (Row Level Security) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- News articles policies (all users can read any article)
CREATE POLICY news_articles_select_all ON news_articles
  FOR SELECT USING (true);

-- Predictions policies (users can only read their own predictions)
CREATE POLICY predictions_select_own ON predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY predictions_insert_own ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 
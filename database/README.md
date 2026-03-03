-- Instructions for setting up PostgreSQL database

-- 1. Create database
CREATE DATABASE product_management;

-- 2. Connect to the database
\c product_management;

-- 3. Run schema.sql
-- psql -U your_user -d product_management -f schema.sql

-- 4. Verify tables
\dt;

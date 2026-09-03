CREATE DATABASE IF NOT EXISTS portfolio;

USE portfolio;

-- =========================================
-- PERSONAL INFORMATION
-- =========================================

CREATE TABLE IF NOT EXISTS personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    about TEXT,
    email VARCHAR(150),
    linkedin VARCHAR(255),
    location VARCHAR(150),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================
-- EDUCATION
-- =========================================

CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree VARCHAR(100) NOT NULL,
    college VARCHAR(200) NOT NULL,
    marks VARCHAR(50),
    year VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- SKILLS
-- =========================================

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- PROJECTS
-- =========================================

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    icon VARCHAR(20),
    tech VARCHAR(255),
    description TEXT,
    github VARCHAR(255),
    demo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- HOBBIES
-- =========================================

CREATE TABLE IF NOT EXISTS hobbies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hobby_name VARCHAR(100) NOT NULL
);


-- =========================================
-- LANGUAGES
-- =========================================

CREATE TABLE IF NOT EXISTS languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    flag VARCHAR(20),
    level VARCHAR(100)
);


-- =========================================
-- CERTIFICATIONS
-- =========================================

CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    certification_name VARCHAR(255) NOT NULL
);


-- =========================================
-- INSERT PERSONAL INFORMATION
-- =========================================

INSERT INTO personal_info
(name, role, about, email, linkedin, location, phone)
VALUES
(
    'Chandani Kumari',
    'Frontend Developer',
    'Computer Science Graduate with hands-on experience in React.js, Node.js, Express.js, MySQL, and JavaScript. Seeking Software Developer and Full Stack Developer opportunities.',
    'kumarichandanipali@gmail.com',
    'https://www.linkedin.com/in/chandani-kumari-781136261/',
    'Madhubani, Bihar',
    '+91 7987053391'
);


-- =========================================
-- INSERT EDUCATION
-- =========================================

INSERT INTO education
(degree, college, marks, year)
VALUES
(
    'B.Tech',
    'IES College of Technology',
    '8.36 CGPA',
    'June 2026 - Completed'
),
(
    '12th',
    'JN College Madhubani',
    '71.2%',
    '2021 - 2022'
),
(
    '10th',
    'Bilat Singh Girls School Khajauli',
    '71.2%',
    '2019 - Jan 2020'
);


-- =========================================
-- INSERT LANGUAGES
-- =========================================

INSERT INTO skills
(category, skill_name)
VALUES
('languages', 'C'),
('languages', 'C++'),
('languages', 'Core Java'),
('languages', 'JavaScript'),
('languages', 'SQL');


-- =========================================
-- INSERT FRONTEND SKILLS
-- =========================================

INSERT INTO skills
(category, skill_name)
VALUES
('frontend', 'HTML'),
('frontend', 'CSS'),
('frontend', 'React.js'),
('frontend', 'Tailwind CSS'),
('frontend', 'Material Tailwind');


-- =========================================
-- INSERT BACKEND SKILLS
-- =========================================

INSERT INTO skills
(category, skill_name)
VALUES
('backend', 'Node.js'),
('backend', 'Express.js'),
('backend', 'REST APIs');


-- =========================================
-- INSERT DATABASE SKILLS
-- =========================================

INSERT INTO skills
(category, skill_name)
VALUES
('database', 'MySQL'),
('database', 'Oracle SQL');


-- =========================================
-- INSERT TOOLS
-- =========================================

INSERT INTO skills
(category, skill_name)
VALUES
('tools', 'Git'),
('tools', 'GitHub'),
('tools', 'VS Code'),
('tools', 'Postman');


-- =========================================
-- INSERT CORE SUBJECTS
-- =========================================

INSERT INTO skills
(category, skill_name)
VALUES
('coreSubjects', 'Data Structures & Algorithms'),
('coreSubjects', 'DBMS'),
('coreSubjects', 'OOP'),
('coreSubjects', 'Operating Systems'),
('coreSubjects', 'Computer Networks'),
('coreSubjects', 'Cloud Computing');


-- =========================================
-- INSERT PROJECTS
-- =========================================

INSERT INTO projects
(title, icon, tech, description, github, demo)
VALUES
(
    'Vedant Devotions',
    '🙏',
    'React.js + Tailwind CSS',
    'Developed a responsive devotional website using reusable React components and Tailwind CSS.',
    '#',
    '#'
),
(
    'Kahaniland',
    '📖',
    'React.js + Node.js + MySQL + Tailwind CSS',
    'Developed a full-stack storytelling platform with user authentication, RESTful APIs, and MySQL database integration.',
    '#',
    '#'
),
(
    'Fee Management System',
    '💰',
    'React.js + Tailwind CSS + MySQL',
    'Developed a responsive web application for managing student fee records with add, update, search, and record management features.',
    '#',
    '#'
);


-- =========================================
-- INSERT HOBBIES
-- =========================================

INSERT INTO hobbies
(hobby_name)
VALUES
('Painting'),
('Listening to Music');


-- =========================================
-- INSERT LANGUAGES
-- =========================================

INSERT INTO languages
(name, flag, level)
VALUES
('English', '🇬🇧', 'Fluent'),
('Hindi', '🇮🇳', 'Native'),
('Maithili', '🧡', 'Mother Tongue');


-- =========================================
-- INSERT CERTIFICATIONS
-- =========================================

INSERT INTO certifications
(certification_name)
VALUES
('NPTEL – Database Management System (DBMS)'),
('NPTEL – Cloud Computing'),
('HackerRank – Problem Solving (C Programming)');
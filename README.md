# Q-A-BOT
📖 Project Overview
This project is a full-stack web application that allows users to upload and manage files, interact with a Telegram bot, and query an AI model (via OpenAI API) for responses. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), the app features user authentication with JWT and session management using Redis.

🎯 Key Features
-> User Authentication: JWT-based authentication with session management via Redis for secure and scalable user sessions.
-> File Management: Upload, download, and delete files with file storage backed by Google Cloud Storage.
-> AI-Powered Q&A: Integrates with the OpenAI API to provide users with intelligent, AI-driven responses to their questions.
-> Telegram Bot Integration: A Telegram bot allows users to ask questions through the bot, which are then answered using OpenAI.
-> Responsive UI: Built using React.js, the user interface is clean, intuitive, and fully responsive.
-> Real-Time Operations: Get real-time responses from OpenAI via the Telegram bot and manage files instantly.
🚀 Tech Stack
Backend->
Node.js: JavaScript runtime environment.
Express.js: Web framework for Node.js.
MongoDB: NoSQL database for data storage.
Redis: Session management and token storage.
Google Cloud Storage: Secure storage for file management.
OpenAI API: For AI-powered responses.

Frontend->
React.js: Frontend JavaScript library for building user interfaces.
HTML5: For structuring web pages.
CSS3: For styling the UI components.
DevOps
Ngrok/Localtunnel: For exposing the local development environment to the internet for testing Telegram webhook integration.
Git: Version control system.
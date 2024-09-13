# Medical Products Import System

A NestJS application for importing and managing medical product data, featuring GPT-4 enhanced descriptions and scheduled daily imports.

## Setup

1. Clone the repository and install dependencies:

   ```
   git clone https://github.com/your-username/medical-products-import.git
   cd medical-products-import
   npm install
   ```

2. Create a `.env` file in the project root:
   ```
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   OPENAI_API_KEY=your_openai_api_key
   ```

## Usage

Start the application:

```
npm run start:dev
```

The app runs on `http://localhost:3000` and performs daily product imports at midnight.

## Requirements

- Node.js (v14+)
- MongoDB
- OpenAI API key

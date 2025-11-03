# 🎬 MoodFlix

**AI-Powered Mood-Based Movie Recommendation System**

MoodFlix uses sentiment analysis and machine learning to recommend movies based on your current mood. Tell us how you're feeling, and we'll suggest the perfect movie for you!

---

## 🌟 Features

- 🎭 **Mood-Based Recommendations** - Enter your mood (happy, sad, excited, thoughtful) and get personalized movie suggestions
- 🎯 **Genre Filtering** - Refine recommendations by selecting specific genres (Action, Drama, Comedy, etc.)
- 🤖 **AI-Powered** - Uses VADER sentiment analysis and TF-IDF vectorization for accurate mood matching
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- ⚡ **Real-Time** - Instant movie recommendations as you type
- 📊 **Rich Movie Data** - IMDB ratings, genres, posters, and detailed overviews

---

## 🚀 Live Demo

- **Frontend:** [https://moodflix-a4r33r9f2-aarush-tandons-projects.vercel.app/#](https://moodflix-a4r33r9f2-aarush-tandons-projects.vercel.app/#) 
- **Backend API:** [https://moodflix-backend-5si9.onrender.com](https://moodflix-backend-5si9.onrender.com)

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ React 18 with TypeScript
- ⚡ Vite (Build tool)
- 🎨 Tailwind CSS + Shadcn/UI
- 🎭 Framer Motion (Animations)
- 📦 React Router

### **Backend**
- 🐍 Python 3.11
- 🚀 FastAPI (REST API)
- 🧠 VADER Sentiment Analysis
- 📊 Scikit-learn (TF-IDF, ML)
- 🐼 Pandas + NumPy (Data processing)

### **Deployment**
- 🎨 Frontend: Vercel
- 🔥 Backend: Render
- 📦 GitHub (Version control)

---

## 📂 Project Structure

```
moodflix/
│
├── backend/                    # FastAPI Backend
│   ├── app.py                 # Main API server
│   ├── model.py               # Recommendation engine
│   ├── requirements.txt       # Python dependencies
│   ├── render.yaml            # Render deployment config
│   └── imdb_top_1000.csv      # Movie dataset
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── MovieCard.tsx  # Movie display card
│   │   │   └── TrendCard.tsx  # Trending movies sidebar
│   │   ├── pages/
│   │   │   └── Index.tsx      # Main page
│   │   ├── lib/               # Utilities
│   │   └── hooks/             # Custom React hooks
│   ├── public/                # Static assets
│   ├── package.json           # npm dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── vercel.json            # Vercel deployment config
│
└── .gitignore
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm
- Python 3.11+
- Git

---

### **1. Clone Repository**

```bash
git clone https://github.com/AarushTandon/moodflix.git
cd moodflix
```

---

### **2. Setup Backend**

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python app.py
```

Backend will run at: `http://localhost:8000`

---

### **3. Setup Frontend**

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at: `http://localhost:8080`

---

## 🔧 Configuration

### **Backend Environment Variables**

Create `.env` file in `backend/` (optional):

```env
PYTHON_VERSION=3.11.0
PORT=8000
```

### **Frontend API Configuration**

The frontend automatically detects the environment:

- **Development:** Uses `http://localhost:8000`
- **Production:** Uses your Render backend URL

Edit `frontend/src/pages/Index.tsx` to change the production API URL:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? "https://your-backend-url.onrender.com"
  : "http://localhost:8000";
```

---

## 📊 API Endpoints

### **Health Check**
```
GET /
```

**Response:**
```json
{
  "message": "✅ MoodFlix API is running!",
  "version": "1.0.0",
  "endpoints": {
    "recommend": "/recommend?mood=happy&genre=Action&top_n=15"
  }
}
```

---

### **Get Recommendations**
```
GET /recommend?mood={mood}&genre={genre}&top_n={number}
```

**Parameters:**
- `mood` (required): User's current mood (e.g., "happy", "sad", "excited")
- `genre` (optional): Filter by genre (e.g., "Action", "Drama", "Comedy")
- `top_n` (optional): Number of results (default: 15)

**Example:**
```
GET /recommend?mood=happy&genre=Comedy&top_n=10
```

**Response:**
```json
{
  "results": [
    {
      "title": "The Pursuit of Happyness",
      "genre": "Biography, Drama",
      "year": 2006,
      "rating": 8.0,
      "poster": "https://...",
      "overview": "Based on a true story..."
    },
    ...
  ],
  "count": 10
}
```

---

## 🧠 How It Works

1. **User Input:** User enters their mood (e.g., "feeling happy")
2. **Sentiment Analysis:** VADER analyzes the mood sentiment (-1 to +1)
3. **Feature Extraction:** TF-IDF vectorizes movie genres
4. **Mood Matching:** Algorithm compares user sentiment with movie overview sentiment
5. **Ranking:** Movies scored by: `0.6 × Mood_Similarity + 0.4 × IMDB_Rating`
6. **Results:** Top N movies returned, sorted by score

---

## 🎨 Screenshots

### Home Page
<img width="1915" height="878" alt="image" src="https://github.com/user-attachments/assets/62268ee2-a8c4-4f35-8b69-bd19bef6325b" />


### Movie Recommendations
<img width="812" height="784" alt="image" src="https://github.com/user-attachments/assets/98601cf6-1bf2-420a-af31-8d02b469a1b8" />


### Trending Sidebar
<img width="249" height="402" alt="image" src="https://github.com/user-attachments/assets/3482615b-cb81-4db5-8e0e-ebcc7089e03f" />


---

## 🚀 Deployment

### **Deploy Backend (Render)**

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Deploy!

---

### **Deploy Frontend (Vercel)**

1. Push code to GitHub
2. Import project on Vercel
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Aarush Tandon**

- GitHub: [@AarushTandon](https://github.com/AarushTandon)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/aarush-tandon) 

---

## 🙏 Acknowledgments

- IMDB for movie data
- VADER Sentiment Analysis
- Shadcn/UI for beautiful components
- Render & Vercel for free hosting

---

## 📧 Contact

Have questions or suggestions? Feel free to reach out!

- Email: tandonaarush2003@gmail.com
- GitHub Issues: [Create an issue](https://github.com/AarushTandon/moodflix/issues)

---

<div align="center">

**⭐ Star this repo if you like it! ⭐**

Made with ❤️ by Aarush Tandon

</div>

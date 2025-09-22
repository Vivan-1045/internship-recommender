# Internship Recommendation Engine

🔗 **Live Demo**: [internship-recommender-sase.onrender.com](https://internship-recommender-sase.onrender.com)

An **AI-powered lightweight recommendation system** that helps students and freshers find the most relevant internships based on their **skills, education, interests, and location preferences**.

Instead of scrolling through hundreds of irrelevant listings, candidates get **3–5 personalized suggestions**, displayed in a simple, **mobile-friendly card UI**.

---

## 🎯 Target Audience

- 🎓 **Students & Fresh Graduates** → Often confused about which internships suit them best.  
- 🏫 **Universities & Training Cells** → Want to guide students toward the right opportunities without manual filtering.  
- 🌍 **Portals & Career Platforms** → Looking to add smart recommendations without heavy infrastructure or costly ML models.

---

## 🛑 Background

Many internship seekers come from diverse backgrounds — **rural areas, urban slums, remote colleges**, and even **first-generation learners with limited digital exposure**.

With hundreds of internships listed on platforms, it becomes overwhelming for candidates to identify the most relevant ones. This often leads to:

- ❌ Misaligned applications  
- ❌ Missed opportunities  
- ❌ Frustration due to irrelevant results  

There’s a clear need for a **simple, intuitive, and resource-efficient system** that makes internship discovery **easy and personalized**.

---

## 💡 Solution

We built a **lightweight recommendation engine** that:

- Captures candidate inputs (skills, education, sector, location)  
- Converts profiles and internships into vector embeddings using **TF-IDF**  
- Measures similarity via **Cosine Similarity**  
- Returns the **top 3–5 best-matched internships**  
- Displays them in **intuitive cards** with details and “Apply Now” links  
- Supports a **feedback loop**, so user responses dynamically improve future recommendations  

---

## ⚡ Why Lightweight?

A lightweight engine ensures **accessibility and adoption**:

- ⚡ **Low Latency** → TF-IDF + Cosine Similarity is CPU-efficient, delivering instant results even on mid-range servers  
- 📊 **Handles Scale** → With indexing + caching, the engine can process millions of internships without bottlenecks  
- 🔄 **Upgrade Path** → Start with TF-IDF (transparent, lightweight), then scale into embeddings, multilingual support, or reinforcement learning  
- 🌍 **Accessible for All** → Works in low-connectivity regions, mobile-compatible, and adaptable to regional languages in future  

✅ This ensures **fast adoption** by universities, training cells, and portals **without infrastructure changes**.

---

## 🏗️ Architecture

### 1. Frontend (HTML/JavaScript + CSS)
- User inputs → Skills, Education, Location, Sector  
- Clean UI → Card-based recommendations  
- Feedback buttons → “Useful / Not Useful / Applied”

### 2. Backend (Node.js + Express)
- TF-IDF vectorization of internships + user profile  
- Cosine similarity scoring  
- Returns top N internships (JSON API)  
- Stores feedback to adjust weightings dynamically  

### 3. Database (JSON / MongoDB / SQL)
- Internship metadata (title, company, sector, education, location, link)  
- Feedback history for weight adjustment  

---

## 🔄 Feedback Loop

- Users give feedback (“useful”, “not useful”, “applied”)  
- Backend adjusts scoring weights (skills, education, location, sector)  
- Over time → engine **self-learns user preferences**  
- **Future-ready** for reinforcement learning, where applications/acceptances reward the model  

---

## 🛠️ Tech Stack

- **Frontend** → HTML, CSS, JS (with [Tagify](https://github.com/yairEO/tagify) for skill input)  
- **Backend** → Node.js + Express  
- **ML Layer** → TF-IDF + Cosine Similarity  
- **Database** → MongoDB / JSON for internships & feedback  
- **Hosting** → Works on Vercel / Render
  
---

## 📌 Why It ?

✅ **Lightweight & Fast** → No GPUs, no high infra costs  
✅ **Accessible** → Works in rural + urban setups, mobile-first  
✅ **Self-Learning** → Feedback loop improves recommendations over time  
✅ **Flexible** → Easy to integrate into any existing portal  
✅ **Hackathon to Production** → Start simple, scale seamlessly  

---

## 🛠️ Getting Started

```bash
# Clone repo
git clone https://github.com/Vivan-1045/internship-recommender.git  

# Install dependencies
cd internship-recommender
npm install  

# Run service 
node server.js

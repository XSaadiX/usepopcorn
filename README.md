# 🍿 usePopcorn - Movie Discovery & Watchlist App

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![OMDB API](https://img.shields.io/badge/OMDB_API-000000?style=for-the-badge)](https://www.omdbapi.com/)

A React-based movie exploration application that helps users discover films, view detailed information, and manage their watchlist. Integrated with the OMDB API for real-time movie data.

[usePopcorn Record.webm](https://github.com/user-attachments/assets/8ac30b7c-c202-4b74-8a05-6dad687ac21d)


## ✨ Features

- 🔍 Real-time movie search with debouncing
- 🎬 Detailed movie information (plot, ratings, runtime)
- ⭐ Custom star rating system
- 📌 Watchlist management (add/remove movies)
- 📊 Watchlist statistics dashboard
- 🎥 Responsive UI with smooth transitions
- 🚦 Error handling and loading states
- ⌨️ Keyboard navigation support



## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/usePopcorn.git
```

2. Install dependencies
```bash
npm install
```

3. Get OMDB API key
- Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
- Create a free API key

4. Create `.env` file in root directory
```env
REACT_APP_OMDB_API_KEY=your_api_key_here
```

5. Start the development server
```bash
npm start
```

## 🛠️ Technologies Used

- React (Hooks: useState, useEffect)
- React Icons
- OMDB API
- CSS Modules
- Create-React-App
- JavaScript (ES6+)
- HTML5

## 📚 Key Learnings

This project helped me solidify:
- React component architecture
- State management with hooks
- API integration and data fetching
- Error handling and loading states
- Responsive UI design principles
- Performance optimization techniques
- Clean code organization

## 📂 Project Structure

```bash
├── public
├── src
│   ├── components
│   │   ├── StarRating.jsx
│   │ 
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├─
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License



## 🙏 Acknowledgments

- OMDB API for movie data
- Jonas Schmedtmann for project inspiration
- React documentation and community

import React from "react";
import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card"
import { MovieView } from "../movie-view/movie-view"
import { LoginView } from "../login-view/login-view"

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://mosfilm-api.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const moviesFromApi = data.map((doc) => {
          return {
            id: doc.id,
            title: doc.Title,
            url: doc.URL,
            director: doc.Director.Name
          };
        });

        setMovies(moviesFromApi);
      });
  }, [token]);

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (!user) {
    return (
      <LoginView onLoggedIn={(user, token) => {
        setUser(user);
        setToken(token);
      }}
      />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty! Oh no!</div>
  }

  return (
    <div>
      <h1>Доброе день</h1>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
      <button onClick={() => { setUser(null); setToken(null); }}>Logout</button>
    </div>
  );
};
import React from "react";
import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card"
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col, Image } from "react-bootstrap";
import Github from "./github.svg";
import Portfolio from "./portfolio.svg";
import Youtube from "./youtube.svg";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://mosfilm-api.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        /*console.log(data)*/
        const moviesFromApi = data.map((doc) => {
          return {
            id: doc._id,
            title: doc.Title,
            url: doc.URL,
            director: doc.Director.Name
          };
        });

        setMovies(moviesFromApi);
      });
  }, [token]);

  return (
    <Row className="justify-content-md-center">
      {!user ? (
        <>
          <Col md={5}>
            <LoginView onLoggedIn={(user, token) => {
              setUser(user);
              setToken(token);
            }}
            />
          </Col>
          <Col md={5}>
            <SignupView />
          </Col>
        </>
      ) : selectedMovie ? (
        <Col md={8}>
          <MovieView
            movie={selectedMovie} onBackClick={() => setSelectedMovie(null)}
          />
        </Col>
      ) : movies.length === 0 ? (
        <div>The list is empty! Oh no!</div>
      ) : (
        <>
          <Col className="text-center mb-3" md={2}>
            <div>
              <a href="https://will-maple.github.io/Portfolio-Website/portfolio.html">
                <Image src={Portfolio} alt="Portfolio Link" style={{ height: "50px", width: "100px" }} />
              </a>
            </div>
            <div>
              <a href="https://github.com/Will-Maple">
                <Image src={Github} alt="Github Link" style={{ height: "50px", width: "100px" }} />
              </a>
            </div>
          </Col>
          <Col className="text-center mb-3" md={6}>
            <h1 className="display-1">Доброе день</h1>
          </Col>
          <Col className="text-center mb-3" md={2}>
            <div>
              <a href="https://www.youtube.com/channel/UCm5U4zqpahzyNXBv5ZT51Jw">
                <Image src={Youtube} alt="Youtube Link" style={{ height: "65px", width: "150px" }} />
              </a>
            </div>
            <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
          </Col>
          {movies.map((movie) => (
            <Col className="mb-4" key={movie.id} md={3}>
              <MovieCard
                movie={movie}
                onMovieClick={(newSelectedMovie) => {
                  setSelectedMovie(newSelectedMovie);
                }}
              />
            </Col>
          ))}
        </>
      )}
    </Row>
  );
};
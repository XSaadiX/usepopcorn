import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apiKey = "2b6b0403";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  function handleMovieClick(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? "" : movieId));
  }

  function handleCloseMovieDetails() {
    setSelectedId("");
  }

  function handleAddWatchedMovie(movie) {
    setWatched((prevWatched) => [...prevWatched, movie]);
  }

  function handleRemoveWatchedMovie(movieId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== movieId)
    );
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(() => {
    //Don't do anything if query is less than 3 characters
    if (!query || query.length < 3) {
      // setMovies([]);
      setError("");
      return;
    }
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with finding movies ");

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not Found");
        }

        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery}>
        <FoundedMoviesNumber movies={movies} />
      </NavBar>

      <Main className='main'>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} handleMovieClick={handleMovieClick} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovieDetails}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <WatchedMovies
              watched={watched}
              onDeleteWatched={handleRemoveWatchedMovie}
            />
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>❌</span>
      {message}
    </p>
  );
}

function NavBar({ children, query, setQuery }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      <MoviesSearchBar query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function MoviesSearchBar({ query, setQuery }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function FoundedMoviesNumber({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, handleMovieClick }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          handleMovieClick={handleMovieClick}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleMovieClick }) {
  return (
    <li onClick={() => handleMovieClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Actors: actors,
    Title: title,
    Year: year,
    Poster: poster,
    Plot: plot,
    imdbRating,
    Genre: genre,
    Runtime: runtime,
  } = movieDetails;

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );
        const data = await res.json();
        setMovieDetails(data);
        setIsLoading(false);
      }
      if (selectedId) {
        getMovieDetails();
      }
    },
    [selectedId]
  );

  useEffect(() => {
    if (!title) return;
    document.title = `Movie: ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(
    function () {
      function callBack(e) {
        if (e.key === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseMovie]
  );

  function handleAddWatchedMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating) || 0,
      runtime: Number(runtime?.split(" ")[0]) || 0,
      userRating,
    };
    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button className='btn-back' onClick={onCloseMovie}>
            &larr;
          </button>
          {movieDetails && (
            <>
              <img src={poster} alt={`${title} poster`} />
              <div className='details-overview'>
                <h2>{title}</h2>
                <p>
                  {year} - {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <b>Actors : </b>
                  {actors}
                </p>
                <p>
                  <b>Rating : </b>
                  {imdbRating}
                </p>
              </div>
              <section className='details-plot'>
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size='30'
                      defaultRating={userRating}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button
                        className='btn-add'
                        onClick={handleAddWatchedMovie}>
                        Add to List
                      </button>
                    )}
                  </>
                ) : (
                  <h2>Already watched Rated : {watchedUserRating}⭐️</h2>
                )}

                <p>{plot}</p>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function WatchedMovies({ watched, onDeleteWatched }) {
  const avgImdbRating = watched.length
    ? average(watched.map((movie) => movie.imdbRating))
    : 0;
  const avgUserRating = watched.length
    ? average(watched.map((movie) => movie.userRating))
    : 0;
  const avgRuntime = watched.length
    ? average(watched.map((movie) => movie.runtime))
    : 0;

  return (
    <>
      <div className='summary'>
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating.toFixed(2)}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating.toFixed(2)}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime.toFixed(0)} min</span>
          </p>
        </div>
      </div>

      <ul className='list'>
        {watched.map((movie) => (
          <WatchedList
            key={movie.imdbID}
            movie={movie}
            onDeleteWatched={onDeleteWatched}
          />
        ))}
      </ul>
    </>
  );
}

function WatchedList({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating || "N/A"}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating || "N/A"}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime || "N/A"} min</span>
        </p>
        <button
          onClick={() => onDeleteWatched(movie.imdbID)}
          className='btn-delete'>
          X
        </button>
      </div>
    </li>
  );
}

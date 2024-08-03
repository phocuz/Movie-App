import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY= '61472b44'

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading,setIsLoading]= useState(false)
  const [selectedId,setSelectedId]= useState(null);
  const [error,setError] =useState (null);
  // const movieSearched = 'interstellar';
// useEffect(()=>{
//   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`).then((res)=>res.json()).then((data) => setMovies(data.Search))
// },[])

//The code below means that that if the selectedId has been set to id(movie.imdbID),set it back to null and if the id is set to null then set it  to id(movie.imdbID) 
function handleSelect(id){
setSelectedId((selectedId)=>(id ===selectedId? null:id))
}

function handleClosedMovie (){
  setSelectedId(null)
}

function handleAddWatched(movie){
  setWatched((watched)=>[...watched,movie])
}

function handleDeleteWatched(id){
  setWatched((watched)=>watched.filter((movie)=>movie.imdbID !==id));
}


useEffect(()=>{

  const controller = new AbortController();
  async function fetchMovies(){
          try{
            setIsLoading(true);
            setError('');
          const res =  await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
             {signal:controller.signal}
          );

          if(!res.ok) throw new Error ("Something went wrong with fetching movies")
            const data= await res.json();
          if(data.Response=== "False") throw new Error("Movie not found");
          setMovies(data.Search); 
          // setError(" ");  
  } catch(err){

    if(err.name !== "AbortError"){
       setError(err.message);
    }
   
  } finally{
    setIsLoading(false); 
  }

  if(query.length < 3){
    setMovies([]);
    setError('');
    return;
  }
}
handleClosedMovie()
fetchMovies();

return function(){
  controller.abort();
};
}, [query])

  return (
    <>
    <Navbar> 
         <Logo /> 
         <Search  query={query} setQuery={setQuery}/>
          <SearchResult movies={movies} />

        </Navbar>
    <Main> 
      <Box >
        {/* below are three mutually exclusive conditons,only one of the three can be true at the same time */}
        {isLoading && <Loader />}
        {!isLoading && !error && <MovieList movies={movies} onSelectMovie ={handleSelect}/>}
        {error && <ErrorMessage message={error}/>}
        </Box>
      <Box>
        { selectedId? <MovieDetails 
        selectedId={selectedId} 
        onClosedMovie={handleClosedMovie} 
        onAddWatched={handleAddWatched}
        watched={watched}/> :
       <> <MovieSummary watched={watched}/>
        <WatchedMovieList watched={watched} onDeletedWatched={handleDeleteWatched}/></>}
        </Box>
      </Main>
      </>
      )
}

function Loader(){
  return(
    <div>
      <div className="loader">LOADING...</div>
    </div>
  )
}

function ErrorMessage({message}){
  return <p className="error"><span>⛔</span>{message}</p>
  
}

function Navbar({children}){

  return(
       <nav className="nav-bar">
       {children}
      </nav>
  )
}

function Logo(){
 return(
   <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
 )
}

function Search({query,setQuery}){
  return(
     <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
  )
}

function SearchResult({movies}){
 return(
   <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
 )
}

function Main ({children}){
  return(
    <div className="main">
      {children}
    </div>
  )
};


// this is the section for the Numlist 

function Box({children}){
   const [isOpen1, setIsOpen1] = useState(true);
  return(
     <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((open) => !open)}
          >
            {isOpen1 ? "–" : "+"}
          </button>
          {isOpen1 && children}
        </div>
  )
}

function MovieList({movies,onSelectMovie}){
  return(
     <ul className="list list-movies">
              {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
              ))}
            </ul>
  )
}

function Movie({movie,onSelectMovie}){
  return(
    <li onClick={()=>onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
         <div>
          <p>
             <span>🗓</span>
            <span>{movie.Year}</span>
         </p>
         </div>
   </li>
  )
};

// function WatchedBox(){
   
//   const [isOpen2, setIsOpen2] = useState(true);

//   return(
//   <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>
//               <MovieSummary watched={watched}/>
//               <WatchedMovieList watched={watched} />
//             </>
//           )}
//         </div>
//   )
// }

function MovieDetails({selectedId,onClosedMovie,onAddWatched,watched}){
  const [movie,setMovie]=useState({});
  const [isLoading,setIsLoading]= useState(false)
  const[error,setError] =useState(null)
  const[userRating,setUserRating] = useState('');

    const isWatched = watched.map(movie=>movie.imdbID).includes(selectedId);
    const watchedUserRating = watched.find(movie=>movie.imdbID===selectedId)?.userRating;

    const {
      Title:title,
      Year:year,
      Poster:poster,
      Runtime:runtime,
      imdbRating,
      Plot:plot,
      Released:released,
      Actors:actors,
      Director:director,
      Genre:genre,
    } = movie;
    

    function handleAdd() {
  const newWatchedMovie = {
    imdbID: selectedId,
    title,
    year,
    poster,
    imdbRating: Number(imdbRating), 
    runtime: Number(runtime.split(" ").at(0)),
    userRating
  };

  onAddWatched(newWatchedMovie);
  onClosedMovie()
}

useEffect(()=>{

  function callback(e){
    if(e.code==="Escape"){
      onClosedMovie()
    }
  
  }
  document.addEventListener("keydown",callback);
  return function(){
    document.removeEventListener("keydown", callback);
  }
 },[onClosedMovie]);

  useEffect(()=>{

    async function getMovieDetails(){
       try{
        setIsLoading(true)
        setError("");
        const res =  await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`); 

      if(!res.ok) throw new Error("something went wrong with fetching movies")
      const data = await res.json();
      if(data.Response==="false") throw new Error("Movie not found")
      setMovie(data)
       } catch(err){
      setError(err.message)
    } finally{
      setIsLoading(false)
    }
  }
    getMovieDetails();
   },[selectedId])
   
   useEffect(()=>{
    if(!title) return;
       document.title=`Movie | ${title}`

     return function (){
        document.title='usePopcorn'
       }
       
   },[title])
return <div>
      {isLoading && <Loader />}
      {!isLoading &&!error&&<div className="details">
      <header>
         <button className="btn-back" onClick={onClosedMovie}>&larr;</button>

         
         <img src={poster} alt={`poster of ${movie} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>{year}</p>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>{imdbRating} IMDb Rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          { !isWatched?
           <>
           <StarRating onSetRating={setUserRating}/>

          { userRating>0 && <button className="btn-add" onClick={handleAdd}>+ add movie</button>}
          </> : <p>you rated with movie {watchedUserRating}<span>🌟</span></p>}
        </div>
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
          </section>
    </div>}
    
    {error && <ErrorMessage message={error} />}
    </div>
}


function MovieSummary({watched}){

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
     <div className="summary">
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
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  )
}

function WatchedMovieList({watched, onDeletedWatched}){
 return(
   <ul className="list">
                {watched.map((movie) => (
                 <WatchMovie movie={movie} key={movie.imdbID} onDeletedWatched={onDeletedWatched}/>
                ))}
              </ul>
 )
}

 function WatchMovie({movie, onDeletedWatched}){
  return(
     <li >
                    <img src={movie.poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>

                      <button className="btn-delete" onClick={()=> onDeletedWatched(movie.imdbID)}>X</button>
                    </div>
                  </li>
  )
}
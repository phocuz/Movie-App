import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <App />
  </React.Fragment>
);

// function Test(){
// //   const[movieRating,setMovieRating]= useState(0);
  // <StarRating  maxRating={5} color="#fcc419" size={30} messages={['Terrible',"bad","okay","Good","amazing"]}/>
  // <StarRating  maxRating={7} color="red" size={33} className="test" />
  // <StarRating  maxRating={10} color="green" size={36} defaultRating={3}/>

  // <Test />
// //   return(
// //     <div>
// //       {/* <StarRating color="blue" maxRating={13} size={39}  onSetRating={setMovieRating}/>
// //       <p>This movie war rated {movieRating} stars</p> */}
// //     </div>
// //   )
// // }


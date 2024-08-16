import { useState,useEffect } from "react";


  //The callback function is used to initialize or call a function stored in the localStorage which explains that useState can also initialize a callback function but without an argument.in summary,Aside passing on a single value,we can also pass in a callback function into a useState Hooks.

 
export  function useLocaleStorageState(initialState,key){
 const [value,setValue]= useState(function(){
    const storedValue=localStorage.getItem(key);
    return storedValue? JSON.parse(storedValue) : initialState;
  })

  //we stored our Watched Movie into a localStorage to display initially after render. 
useEffect(()=>{
  localStorage.setItem("watched", JSON.stringify(value))

  },[value,key]);

  return[value,setValue]
}
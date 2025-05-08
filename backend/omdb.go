package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Movie struct {
	Title    string `json:"Title"`
	Year     string `json:"Year"`
	Rated    string `json:"Rated"`
	Released string `json:"Released"`
	Genre    string `json:"Genre"`
	Director string `json:"Director"`
	Poster   string `json:"Poster"`
}

func omdbSingle(w http.ResponseWriter, r *http.Request) { //https://github.com/martinstarkov/movie-posters/blob/master/js/javascript.js
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	movieTitle := r.URL.Query().Get("title")
	movieIMDB := r.URL.Query().Get("id")
	if movieTitle == "" && movieIMDB == "" {
		http.Error(w, "Both Movie Title and ID were not Provided", http.StatusBadRequest)
		return
	} else if movieTitle != "" && movieIMDB != "" {
		http.Error(w, "Both Movie Title and ID were Provided", http.StatusBadRequest)
		return
	}
	var req *http.Request
	var err error
	if movieTitle == "" {
		req, err = http.NewRequest("GET", "http://www.omdbapi.com/?i="+movieIMDB+"&apikey="+OMDB_API_KEY, nil)
		if err != nil {
			panic(err)
		}
	} else {
		req, err = http.NewRequest("GET", "http://www.omdbapi.com/?t="+movieTitle+"&apikey="+OMDB_API_KEY, nil)
		if err != nil {
			panic(err)
		}
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested for Movie titled: " + movieTitle + " / With ID: " + movieIMDB)

	var movie Movie
	err2 := json.NewDecoder(resp.Body).Decode(&movie)
	if err2 != nil {
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(movie)
}

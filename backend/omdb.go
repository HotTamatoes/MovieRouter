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
	Plot     string `json:"Plot"`
	Poster   string `json:"Poster"`
	ImdbID   string `json:"ImdbID"`
}

func omdbSingle(w http.ResponseWriter, r *http.Request) {
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
	var movie Movie
	if movieTitle == "" {
		movie = getMovieSQLId(movieIMDB)
	} else {
		movie = getMovieSQLTitle(movieTitle)
	}
	if movie.Poster != "" {
		fmt.Println("got " + movie.Title + " from database")
		json.NewEncoder(w).Encode(movie)
		return
	}

	var req *http.Request
	var err error
	if movieTitle == "" {
		req, err = http.NewRequest("GET", "http://www.omdbapi.com/?apikey="+secrets.Keys.Omdb+"&plot=full&i="+movieIMDB, nil)
		if err != nil {
			panic(err)
		}
	} else {
		req, err = http.NewRequest("GET", "http://www.omdbapi.com/?apikey="+secrets.Keys.Omdb+"&plot=full&t="+movieTitle, nil)
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

	err2 := json.NewDecoder(resp.Body).Decode(&movie)
	if err2 != nil {
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}
	putMovieSQL(movie)
	json.NewEncoder(w).Encode(movie)
}

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

func omdbDefault(w http.ResponseWriter) {
	movieList := [12]string{"tt11655566", "tt9603208", "tt1674782", "tt32246771", "tt9619824",
		"tt26743210", "tt30840798", "tt30253514", "tt31193180", "tt20969586", "tt32299316", "tt8115900"}

	var movies [len(movieList)]Movie
	for index, movieIMDB := range movieList {
		movies[index] = getOmdbSingle("", movieIMDB)
	}
	json.NewEncoder(w).Encode(movies)
}

func omdbHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "max-age=3600")

	movieTitle := r.URL.Query().Get("title")
	movieIMDB := r.URL.Query().Get("id")
	if movieTitle != "" && movieIMDB != "" {
		http.Error(w, "Both Movie Title and ID were Provided", http.StatusBadRequest)
		return
	} else if movieTitle == "" && movieIMDB == "" {
		omdbDefault(w)
		return
	} else if movieTitle != "" || movieIMDB[:2] == "tt" {
		json.NewEncoder(w).Encode(getOmdbSingle(movieTitle, movieIMDB))
		return
	}
	http.Error(w, "Title was not provided and IMDB ID is not valid", http.StatusBadRequest)
}

func getOmdbSingle(movieTitle string, movieIMDB string) Movie {
	var movie Movie
	if movieTitle == "" {
		movie = getMovieSQLId(movieIMDB)
	} else {
		movie = getMovieSQLTitle(movieTitle)
	}
	if movie.Poster != "" {
		return movie
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

	json.NewDecoder(resp.Body).Decode(&movie)
	putMovieSQL(movie)
	return movie
}

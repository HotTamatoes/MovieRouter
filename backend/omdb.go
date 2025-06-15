package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
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
		http.Error(w, "Neither Title and IMDB ID were provided", http.StatusBadRequest)
	} else if movieTitle != "" || movieIMDB[:2] == "tt" {
		json.NewEncoder(w).Encode(getOmdbSingle(movieTitle, movieIMDB))
		return
	}
	http.Error(w, "Valid Title and IMDB ID were both not provided", http.StatusBadRequest)
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
		baseURL := "http://www.omdbapi.com/"
		params := url.Values{}
		params.Add("apikey", secrets.Keys.Omdb)
		params.Add("plot", "full")
		params.Add("t", movieTitle)
		fullURL := baseURL + "?" + params.Encode()
		req, err = http.NewRequest("GET", fullURL, nil)
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
	if movie.Poster != "" {
		putMovieSQL(movie)
	}
	return movie
}

func getOmdbSingleYear(title string, year string) Movie {
	movie := getMovieSQLTitleYear(title, year)
	if movie.Poster != "" {
		return movie
	}

	baseURL := "http://www.omdbapi.com/"
	params := url.Values{}
	params.Add("apikey", secrets.Keys.Omdb)
	params.Add("plot", "full")
	params.Add("t", title)
	params.Add("y", year)
	fullURL := baseURL + "?" + params.Encode()
	req, err := http.NewRequest("GET", fullURL, nil)
	if err != nil {
		panic(err)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested for Movie titled: " + title + " with year: " + year)

	json.NewDecoder(resp.Body).Decode(&movie)
	if movie.Poster != "" {
		putMovieSQL(movie)
	}
	return movie
}

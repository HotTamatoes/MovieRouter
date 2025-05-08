package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type Theater struct {
	Name        string      `json:"name"`
	Address     string      `json:"vicinity"`
	Rating      json.Number `json:"rating"`
	RatingCount json.Number `json:"user_ratings_total"`
	Geometry    Geometry    `json:"geometry"`
}

type Geometry struct {
	Location Location `json:"location"`
}
type Location struct {
	Lat json.Number `json:"lat"`
	Lng json.Number `json:"lng"`
}

func getTheaterList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var theaters struct {
		Results []Theater `json:"results"`
	}
	fmt.Println("Starting movie info search with location: " + r.URL.Query().Get("location"))

	location := r.URL.Query().Get("location")
	if location == "" {
		http.Error(w, "Location not provided", http.StatusBadRequest)
		return
	}

	var url []string = []string{
		"https://maps.googleapis.com/maps/api/place/nearbysearch/json",
		"?key=" + GOOGLE_API_KEY,
		"&location=" + location,
		"&radius=25000",
		"&type=movie_theater"}

	searchURL := strings.Join(url, "")

	fmt.Println("searchURL: ", searchURL)

	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Add("Accept-Charset", "utf-8")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested for nearby" + location)

	err2 := json.NewDecoder(resp.Body).Decode(&theaters)
	if err2 != nil {
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(theaters)
}

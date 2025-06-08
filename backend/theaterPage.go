package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Theater struct {
	Name        Name        `json:"displayName"`
	Address     string      `json:"formattedAddress"`
	Rating      json.Number `json:"rating"`
	RatingCount json.Number `json:"userRatingCount"`
	Location    Location    `json:"location"`
}
type Name struct {
	Text         string `json:"text"`
	LanguageCode string `json:"languageCode"`
}
type Location struct {
	Lat json.Number `json:"latitude"`
	Lng json.Number `json:"longitude"`
}

func getTheaterList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "max-age=3600")
	var theaters struct {
		Places []Theater `json:"places"`
	}
	fmt.Println("Starting movie info search with location: " + r.URL.Query().Get("location"))

	lat := r.URL.Query().Get("lat")
	if lat == "" {
		http.Error(w, "Latitude not provided", http.StatusBadRequest)
		return
	}
	lng := r.URL.Query().Get("lng")
	if lng == "" {
		http.Error(w, "Longitude not provided", http.StatusBadRequest)
		return
	}

	postUrl := "https://places.googleapis.com/v1/places:searchNearby"
	payload := map[string]interface{}{
		"includedPrimaryTypes": []string{"movie_theater"},
		"maxResultCount":       10,
		"rankPreference":       "DISTANCE",
		"locationRestriction": map[string]interface{}{
			"circle": map[string]interface{}{
				"center": map[string]string{
					"latitude":  lat,
					"longitude": lng,
				},
				"radius": 50000,
			},
		},
	}
	post, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", postUrl, bytes.NewBuffer(post))
	if err != nil {
		panic(err)
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept-Charset", "utf-8")
	req.Header.Add("X-Goog-Api-Key", secrets.Keys.Google)
	req.Header.Add("X-Goog-FieldMask", "places.displayName,places.location,places.formattedAddress,places.rating,places.userRatingCount")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested for nearby " + lat + "," + lng)

	err2 := json.NewDecoder(resp.Body).Decode(&theaters)
	if err2 != nil {
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(theaters)
}

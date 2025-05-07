package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

var port = ":8080"
var API_KEY string

func main() {
	byteAPIKey, err := os.ReadFile("../google-maps-api-key.txt")
	if err != nil {
		log.Fatal(err)
	}
	API_KEY = string(byteAPIKey)

	router := mux.NewRouter()
	router.HandleFunc("/api/theaterlist", getTheaterList).Methods("GET")
	router.HandleFunc("/api/movieinfo", getMovieInfo).Methods("GET")
	router.HandleFunc("/api/test", test).Methods("GET")
	router.HandleFunc("/api/testjson", testJson).Methods("GET")

	fmt.Println("http://localhost" + port)

	log.Fatal(http.ListenAndServe(port, router))
}

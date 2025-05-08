package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

var port = ":8080"
var GOOGLE_API_KEY string
var OMDB_API_KEY string
var db *sql.DB

func main() {
	byteGAPIKey, err := os.ReadFile("../google-maps-api-key.txt")
	if err != nil {
		log.Fatal(err)
	}
	GOOGLE_API_KEY = string(byteGAPIKey)

	byteOAPIKey, err := os.ReadFile("../omdb-api-key.txt")
	if err != nil {
		log.Fatal(err)
	}
	OMDB_API_KEY = string(byteOAPIKey)

	db = connectToSQL()
	defer disconnectSQL()

	router := mux.NewRouter()
	router.HandleFunc("/api/theaterlist", getTheaterList).Methods("GET")
	router.HandleFunc("/api/movieinfo", getMovieInfo).Methods("GET")
	router.HandleFunc("/api/test", test).Methods("GET")
	router.HandleFunc("/api/testjson", testJson).Methods("GET")
	router.HandleFunc("/api/omdb", omdbSingle).Methods("GET")

	fmt.Println("http://localhost" + port)

	log.Fatal(http.ListenAndServe(port, router))
}

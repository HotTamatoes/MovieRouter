package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/joho/godotenv/autoload"
)

type Secrets struct {
	Keys     ApiKey
	DBConStr string
	Port     string
}
type ApiKey struct {
	Google string
	Omdb   string
}

var secrets Secrets
var db *sql.DB

func loadSecrets() Secrets {
	out := Secrets{
		Keys: ApiKey{
			Google: os.Getenv("GOOGLE_MAPS_API_KEY"),
			Omdb:   os.Getenv("OMDB_API_KEY"),
		},
		DBConStr: os.Getenv("POSTGRES_CON_STR"),
		Port:     os.Getenv("GO_PORT"),
	}
	return out
}

func main() {
	secrets = loadSecrets()
	db = connectToSQL()
	defer disconnectSQL()

	router := mux.NewRouter()
	router.HandleFunc("/theaterlist", getTheaterList).Methods("GET")
	router.HandleFunc("/movieinfo", getMovieInfo).Methods("GET")
	router.HandleFunc("/postalCode", getPostalWrap).Methods("GET")
	router.HandleFunc("/latlng", getLatLngWrap).Methods("GET")
	router.HandleFunc("/test", test).Methods("GET")
	router.HandleFunc("/testjson", testJson).Methods("GET")
	router.HandleFunc("/omdb", omdbHandler).Methods("GET")

	log.Fatal(http.ListenAndServe(":"+secrets.Port, router))
}

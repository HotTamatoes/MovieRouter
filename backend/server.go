package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/joho/godotenv/autoload"
)

type Secrets struct {
	Keys ApiKey
	DB   PostgresSecret
	Port string
}
type ApiKey struct {
	Google string
	Omdb   string
}
type PostgresSecret struct {
	Postgres_user string
	Postgres_pass string
	Postgres_port string
	Postgres_db   string
}

var secrets Secrets
var db *sql.DB

func loadSecrets() Secrets {
	out := Secrets{
		Keys: ApiKey{
			Google: os.Getenv("GOOGLE_MAPS_API_KEY"),
			Omdb:   os.Getenv("OMDB_API_KEY"),
		},
		DB: PostgresSecret{
			Postgres_user: os.Getenv("POSTGRES_USER"),
			Postgres_pass: os.Getenv("POSTGRES_PASS"),
			Postgres_port: os.Getenv("POSTGRES_PORT"),
			Postgres_db:   os.Getenv("POSTGRES_DB"),
		},
		Port: os.Getenv("GO_PORT"),
	}
	return out
}

func main() {
	secrets = loadSecrets()
	db = connectToSQL()
	defer disconnectSQL()

	router := mux.NewRouter()
	router.HandleFunc("/api/theaterlist", getTheaterList).Methods("GET")
	router.HandleFunc("/api/movieinfo", getMovieInfo).Methods("GET")
	router.HandleFunc("/api/test", test).Methods("GET")
	router.HandleFunc("/api/testjson", testJson).Methods("GET")
	router.HandleFunc("/api/omdb", omdbSingle).Methods("GET")

	fmt.Println("http://localhost" + secrets.Port)

	log.Fatal(http.ListenAndServe(secrets.Port, router))
}

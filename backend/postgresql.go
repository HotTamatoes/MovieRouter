package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func connectToSQL() *sql.DB {
	sqlConnectionString := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
		secrets.DB.Postgres_user, secrets.DB.Postgres_pass, secrets.DB.Postgres_port, secrets.DB.Postgres_db)

	db, err := sql.Open("postgres", sqlConnectionString)
	if err != nil {
		log.Fatal(err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal("Cannot connect to DB:", err)
	}
	fmt.Println("Connected to PostgreSQL")
	return db
}

func disconnectSQL() {
	db.Close()
}

func putMovieSQL(mov Movie) {
	sqlStatement := `
		INSERT INTO movie (title, released, genre, director, plot, poster, id, rated, year, expires)
		VALUES ($1, to_date($2, 'DD Mon YYYY'), $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP + INTERVAL '7 days')
	;`

	_, err := db.Exec(sqlStatement,
		mov.Title, mov.Released, mov.Genre, mov.Director, mov.Plot, mov.Poster, mov.ImdbID[2:], mov.Rated, mov.Year)
	if err != nil {
		fmt.Println("Failed to execute SQL command:" + err.Error())
	}
}

func getMovieSQLId(id string) Movie {

	sqlStatement := `
		SELECT title, year, rated, TO_CHAR(released, 'DD Mon YYYY'), genre, director, plot, poster
		FROM movie
		WHERE id=$1
		AND expires >= CURRENT_TIMESTAMP
	;`

	rows, err := db.Query(sqlStatement, id[2:])
	if err != nil {
		log.Fatal("Failed to execute SQL command:", err)
	}

	var movie Movie
	for rows.Next() {
		err := rows.Scan(
			&movie.Title,
			&movie.Year,
			&movie.Rated,
			&movie.Released,
			&movie.Genre,
			&movie.Director,
			&movie.Plot,
			&movie.Poster)
		if err != nil {
			log.Fatal("Scan failed:", err)
		}
	}
	if err = rows.Err(); err != nil {
		log.Fatal("Row iteration error:", err)
	}
	movie.ImdbID = id
	return movie
}

func getMovieSQLTitle(title string) Movie {

	sqlStatement := `
		SELECT year, rated, TO_CHAR(released, 'DD Mon YYYY'), genre, director, plot, poster, id
		FROM movie
		WHERE title=$1
		AND expires >= CURRENT_TIMESTAMP
	;`

	rows, err := db.Query(sqlStatement, title)
	if err != nil {
		log.Fatal("Failed to execute SQL command:", err)
	}

	var movie Movie
	for rows.Next() {
		err := rows.Scan(
			&movie.Year,
			&movie.Rated,
			&movie.Released,
			&movie.Genre,
			&movie.Director,
			&movie.Plot,
			&movie.Poster,
			&movie.ImdbID)
		if err != nil {
			log.Fatal("Scan failed:", err)
		}
	}
	if err = rows.Err(); err != nil {
		log.Fatal("Row iteration error:", err)
	}
	movie.ImdbID = "tt" + movie.ImdbID
	movie.Title = title
	return movie
}

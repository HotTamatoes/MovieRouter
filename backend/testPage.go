package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func test(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Println("test called")
	fmt.Fprintf(w, "server responded :)")
}

func testJson(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Println("testJson called")

	content, err := os.ReadFile("html.html")
	if err != nil {
		log.Fatal(err)
	}
	html := string(content)

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		log.Fatalf("Failed to parse HTML: %v", err)
	}

	uniqueMovieGets := make(map[string]MovieGet)
	uniqueTheaterNames := make(map[string]bool)
	links := []TheaterMoviesLink{}
	doc.Find("div.theater.show-more-module").Each(func(i int, theaterSel *goquery.Selection) {
		theaterName := strings.TrimSpace(theaterSel.Find("h3.title a.theater-name").Text())
		if theaterName != "" {
			uniqueTheaterNames[theaterName] = true
			theaterMovies := []string{}

			theaterSel.Find("div.movie-listing").Each(func(j int, movieSel *goquery.Selection) {
				titleStr := strings.TrimSpace(movieSel.Find("div.showtimes-movie-data h3.showtimes-movie-data-title a").Text())
				if len(titleStr) < 6 {
					titleStr = strings.TrimSpace(movieSel.Find("div.showtimes-movie-data h3.showtimes-movie-data-title").Text())
				}
				fmt.Printf("title: %s, ", titleStr)
				if len(titleStr) >= 6 && titleStr[len(titleStr)-1:] == ")" {
					title := strings.TrimSpace(titleStr[:len(titleStr)-6])
					year := titleStr[len(titleStr)-5 : len(titleStr)-1]
					uniqueMovieGets[title] = MovieGet{Title: title, Year: year}
					theaterMovies = append(theaterMovies, title)
				}
			})
			links = append(links, TheaterMoviesLink{
				Theater:       theaterName,
				TheaterMovies: theaterMovies,
			})
		}
	})

	fmt.Println("Unique movies: ")
	for _, movieGet := range uniqueMovieGets {
		fmt.Println(movieGet.Title)
	}
	fmt.Println("--------------------")

	movies := make([]Movie, 0, len(uniqueMovieGets))
	for _, movieGet := range uniqueMovieGets {
		movie := getOmdbSingleYear(movieGet.Title, movieGet.Year)
		if movie.Poster == "" || !fuzzyCompare(movie.Title, movieGet.Title) {
			fmt.Printf("!!!!Movie year failed for %s (%s)!!!! Compared to %s\n", movieGet.Title, movieGet.Year, movie.Title)
			fmt.Println(movie)
			movie = getOmdbSingle(movieGet.Title, "")
			if movie.Poster == "" || !fuzzyCompare(movie.Title, movieGet.Title) {
				fmt.Printf("!!!!Movie year failed for %s (%s)!!!! Compared to %s\n", movieGet.Title, movieGet.Year, movie.Title)
				fmt.Println(movie)
				continue
			}
		}
		movies = append(movies, movie)
	}

	theaters := make([]TheaterGet, 0, len(uniqueTheaterNames))
	for theater := range uniqueTheaterNames {
		theaters = append(theaters, TheaterGet{Name: theater})
	}

	json.NewEncoder(w).Encode(Result{
		Movies:   movies,
		Theaters: theaters,
		Links:    links,
	})
}

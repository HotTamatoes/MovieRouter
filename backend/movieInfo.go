package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/PuerkitoBio/goquery"
	"github.com/chromedp/chromedp"
)

type MovieGet struct {
	Title string `json:"Title"`
	Year  string `json:"Year"`
}
type TheaterGet struct {
	Name string `json:"Name"`
}
type TheaterMoviesLink struct {
	Theater       string   `json:"Theater"`
	TheaterMovies []string `json:"Theater_movies"`
}
type Result struct {
	Movies   []Movie             `json:"Movies"`
	Theaters []TheaterGet        `json:"Theaters"`
	Links    []TheaterMoviesLink `json:"Links"`
}

func getMovieInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "max-age=3600")

	lat := r.URL.Query().Get("lat")
	lng := r.URL.Query().Get("lng")
	if lat == "" || lng == "" {
		http.Error(w, "Valid lat and lng were not both provided", http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(getMovieInfoHelper(getPostalCode(lat, lng)))
}

func getMovieInfoHelper(postalCode string) Result {
	fmt.Println("requesting from moviefone with")
	searchURL := fmt.Sprintf("https://www.moviefone.com/showtimes/theaters/a/%s", postalCode)
	fmt.Println("requesting from moviefone with " + searchURL)

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	var html string
	err := chromedp.Run(ctx,
		chromedp.Navigate(searchURL),
		chromedp.WaitReady("body", chromedp.ByQuery),
		chromedp.WaitVisible("div.theater.show-more-module", chromedp.ByQuery),
		chromedp.OuterHTML("html", &html),
	)
	if err != nil {
		log.Fatalf("failed to load page with chromdp: %v", err)
		return Result{
			Movies:   []Movie{},
			Theaters: []TheaterGet{},
			Links:    []TheaterMoviesLink{},
		}
	}

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

	movies := make([]Movie, 0, len(uniqueMovieGets))
	for _, movieGet := range uniqueMovieGets {
		movie := getOmdbSingleYear(movieGet.Title, movieGet.Year)
		if movie.Poster == "" || !fuzzyCompare(movie.Title, movieGet.Title) {
			movie = getOmdbSingle(movieGet.Title, "")
			if movie.Poster == "" || !fuzzyCompare(movie.Title, movieGet.Title) {
				fmt.Printf("!!!!Both movie gets failed for %s (%s)!!!!\n", movieGet.Title, movieGet.Year)
				continue
			}
		}
		movies = append(movies, movie)
	}

	theaters := make([]TheaterGet, 0, len(uniqueTheaterNames))
	for theater := range uniqueTheaterNames {
		theaters = append(theaters, TheaterGet{Name: theater})
	}

	return Result{
		Movies:   movies,
		Theaters: theaters,
		Links:    links,
	}
}

func removeWeirdChars(s string) string {
	var b strings.Builder
	for _, c := range s {
		if unicode.IsLetter(c) || unicode.IsDigit(c) || unicode.IsSpace(c) {
			b.WriteRune(unicode.ToUpper(c))
		}
	}
	return strings.Join(strings.Fields(b.String()), " ")
}
func fuzzyCompare(a string, b string) bool {
	return removeWeirdChars(a) == removeWeirdChars(b)
}

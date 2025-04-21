package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func main() {
	searchURL := "https://www.google.com/search?q=minecraft+showtimes+Westminster+CO"

	req, _ := http.NewRequest("GET", searchURL, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc.Find("div.Evln0c").Each(func(i int, s *goquery.Selection) {
		theaterName, _ := s.Attr("data-theater-name")
		fmt.Printf("🎭 Theater: %s\n", theaterName)

		// Loop through format sections (e.g., Standard, 3D)
		s.Find("div.iAkOed").Each(func(j int, formatSection *goquery.Selection) {
			format := formatSection.Find("div.swoqy").Text()
			fmt.Printf("  🎞 Format: %s\n", format)

			// Find showtimes inside this format
			formatSection.Find("div.std-ts").Each(func(k int, timeSpan *goquery.Selection) {
				showtime := strings.TrimSpace(timeSpan.Text())
				fmt.Printf("    🕒 %s\n", showtime)
			})
		})
		fmt.Println(strings.Repeat("-", 40))
	})
}

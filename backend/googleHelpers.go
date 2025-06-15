package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type Place struct {
	Addresses []AddrComp `json:"address_components"`
}

type AddrComp struct {
	Name  string   `json:"long_name"`
	Types []string `json:"types"`
}

func getPostalCode(lat string, lng string) string {
	var results struct {
		Places []Place `json:"results"`
	}

	var url []string = []string{
		"https://maps.googleapis.com/maps/api/geocode/json",
		"?key=" + secrets.Keys.Google,
		"&latlng=" + fmt.Sprintf("%s,%s", lat, lng),
		"&result_type=postal_code",
	}

	searchURL := strings.Join(url, "")

	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept-Charset", "utf-8")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested for nearby " + lat + "," + lng)

	err2 := json.NewDecoder(resp.Body).Decode(&results)
	if err2 != nil {
		log.Fatal(err2.Error())
	}
	for _, addrComp := range results.Places[0].Addresses {
		for _, addrCompType := range addrComp.Types {
			if addrCompType == "postal_code" {
				fmt.Println("Found Postal Code: " + addrComp.Name)
				return addrComp.Name
			}
		}
	}
	log.Fatal("was not able to find a postal code")
	return ""
}

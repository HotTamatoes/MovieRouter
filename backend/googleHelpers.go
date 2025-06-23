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

type GeoCode_Place struct {
	Geometries GeoCode_Geometry `json:"geometry"`
}
type GeoCode_Geometry struct {
	Location GeoCode_Location `json:"location"`
}
type GeoCode_Location struct {
	Lat json.Number `json:"lat"`
	Lng json.Number `json:"lng"`
}
type Out_LatLng struct {
	Lat json.Number `json:"Lat"`
	Lng json.Number `json:"Lng"`
}

func getPostalWrap(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "max-age=3600")

	lat := r.URL.Query().Get("lat")
	lng := r.URL.Query().Get("lng")
	if lat == "" || lng == "" {
		http.Error(w, "Valid lat and lng were not both provided", http.StatusBadRequest)
		return
	}
	fmt.Fprint(w, getPostalCode(lat, lng))
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
	fmt.Println("Web has been requested for postal code of " + lat + "," + lng)

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

func getLatLngWrap(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Cache-Control", "max-age=3600")

	postalCode := r.URL.Query().Get("postalCode")
	if postalCode == "" {
		http.Error(w, "Valid postal code was not provided", http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(getLatLng(postalCode))
}

func getLatLng(postalCode string) Out_LatLng {
	var results struct {
		Places []GeoCode_Place `json:"results"`
	}

	var url []string = []string{
		"https://maps.googleapis.com/maps/api/geocode/json",
		"?key=" + secrets.Keys.Google,
		"&address=" + postalCode,
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
	fmt.Println("Web has been requested for LatLng with " + postalCode)

	err2 := json.NewDecoder(resp.Body).Decode(&results)
	if err2 != nil {
		log.Fatal(err2.Error())
	}
	if results.Places[0].Geometries.Location.Lat != "" && results.Places[0].Geometries.Location.Lng != ""{
		return Out_LatLng{
			Lat: results.Places[0].Geometries.Location.Lat,
			Lng: results.Places[0].Geometries.Location.Lng,
		}
	}
	return Out_LatLng{
		Lat: "",
		Lng: "",
	}
}

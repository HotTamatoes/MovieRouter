package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func test(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Println("test called")
	fmt.Fprintf(w, "server responded :)")
}

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func testJson(w http.ResponseWriter, r *http.Request) {
	fmt.Println("testJson called")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	req, _ := http.NewRequest("GET", "https://jsonplaceholder.typicode.com/users", nil)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested")

	var users []User
	err2 := json.NewDecoder(resp.Body).Decode(&users)
	if err2 != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(users)
}

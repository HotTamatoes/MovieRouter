#Movie Router Website Server + Client

Before you can run this project locally, you will need a google maps api key. Instructions from the google website:

Go to the Google Maps Platform > Credentials page.
On the Credentials page, click Create credentials > API key.

You will also need a free OMDb API key, from http://www.omdbapi.com/


##Server
Server is written in go, and heavily uses google search results to pull nearby movie information.

after installing go,
run the server by using a command prompt of powershell instance and changing directory to the backend folder (./backend).
use go run .

The required env variables (either in a .env file inside /backend or injected) are:
GOOGLE_MAPS_API_KEY =
OMDB_API_KEY =
POSTGRES_CON_STR = postgres://username:password@port/databasename?sslmode=disable //something like this
GO_PORT =


##Client
Client is a react-router typescript single-page web page. It uses react + vite

after installing node/npm
run the client by using a command prompt or powershell instance and changing directory to the frontend folder (./frontend).
use npm run

The required env variables (either in a .env file inside /frontend or injected) are:
VITE_GOOGLE_MAPS_API_KEY =
VITE_GOSERVER_DOMAIN =
VITE_GOSERVER_PORT =

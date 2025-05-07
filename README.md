#Movie Router Website Server + Client

Before you can run this project locally, you will need a google maps api key. Instructions from the google website:

Go to the Google Maps Platform > Credentials page.
On the Credentials page, click Create credentials > API key.

Store this api-key in the root folder of the project (./) in a text file named google-maps-api-key.txt

You will also need a free OMDb API key, from http://www.omdbapi.com/. store this in omdb-api-key.txt


##Server
Server is written in go, and heavily uses google search results to pull nearby movie information.

after installing go,
run the server by using a command prompt of powershell instance and changing directory to the backend folder (./backend).
use go run .

##Client
Client is a react-router typescript single-page web page. It uses react + vite

after installing node/npm
run the client by using a command prompt or powershell instance and changing directory to the frontend folder (./frontend).
use npm run

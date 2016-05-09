Are you team #red or #blue team?
=====================

Build for Riot API Challenge May 2016

## What is it?

I created a website which will look at the last few matches played. Based on this information it creates a visualization to show which team the player is on for most of the time. To top this off I've added the ability to check some statistics based on the red or blue team. For example: How many kills did I make in the blue team.

This is how it works:
- Enter your summoner name into the input field and select the region for example: Timvdv - euw
- Thats it! We're done
- (optional) Send a tweet with your favorite team #teamred or #teamblue

### Demo:

http://timvandevathorst.nl/red-vs-blue/

### Or install it locally

```
Just download this project and run the index.html file
```

### Development

I used ReactJS, BabelJS and d3.js to create this project.
Everything is written in ES6 and comipled to (browser) readable JS
Webpack to run a local server based on NodeJS

```
Download the project and cd into the folder
mkdir node_modules
npm install
npm start
open http://localhost:3000
```

### Enable own API key

```
Run the api.php file on a php server
Edit the api.php file and enter your own API key
Edit the src/App.js and change the api_url variable to api.php file on your server
```

document.addEventListener("DOMContentLoaded", () => {
    //Select buttons and containers//
    const dogButton = document.getElementById("dog-button");
    const dogOutput = document.getElementById("dog-output");
    const catButton = document.getElementById("cat-button");
    const catOutput = document.getElementById("cat-output");
    const weatherButton = document.getElementById("weather-button");
    const weatherOutput = document.getElementById("weather-output");
    const weatherInput = document.getElementById("city-input");
    const currencyOutput = document.getElementById("currency-output");
    const currencyButton = document.getElementById("currency-button");
    const currencyInput = document.getElementById("currency-input");
    const toCurrencySelect = document.getElementById("to-currency");
    const bibleVerseInput = document.getElementById("bible-verse");
    const bibleVersionInput = document.getElementById("bible-version");
    const bibleButton = document.getElementById("bible-button");
    const bibleOutput = document.getElementById("bible-output");
    const githubOutput = document.getElementById("github-output");
    const githubButton = document.getElementById("github-button");
    const githubUsernameInput = document.getElementById("github-username");
    const jokeButton = document.getElementById("joke-button");
    const jokeOutput = document.getElementById("joke-output");
    const recipeButton = document.getElementById("recipe-button");
    const recipeInput = document.getElementById("recipe-input");
    const recipeOutput = document.getElementById("recipe-output");

    // Function to fetch and display a random dog image//
    async function getDogImage() {

        //Fetch data from Dog API//
        const response = await fetch ("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        console.log(data);

        //Clear previous image//
        dogOutput.innerHTML = "";

        //Create an image element and set its source to the fetched image URL//
        const img = document.createElement('img');
        img.src = data.message;

        //Append the image to the container//
        dogOutput.appendChild(img);
    }

    // Function to fetch and display a random cat image//
    async function getCatImage() {

        //Fetch data from Cat API//
        const response = await fetch ("https://api.thecatapi.com/v1/images/search?limit=10");
        const data = await response.json();
        console.log(data);

        //Clear previous image//
        catOutput.innerHTML = "";

        //Create an image element and set its source to the fetched image URL//
        const img = document.createElement('img');
        img.src = data[0].url;

        //Append the image to the container//
        catOutput.appendChild(img);
    }

    //Function to fetch and display weather data from OpenWeatherMap API//
    async function getWeatherByCity() {
        const city = document.getElementById("city-input").value.trim();
        if (!city){
            alert("Please enter a city name.");
            return;
        }
        try {
            //Geolocate the city to get latitude and longitude//
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoResponse.json();
            console.log(geoData);

            if (!geoData.results || geoData.results.length === 0) {
                alert("City not found.");
                return;
            }
            //Extract latitude and longitude//
            const { latitude, longitude, name, country } = geoData.results[0];
            console.log(`Coordinates of ${name}, ${country}: ${latitude}, ${longitude}`);

            //Fetch weather data using the latitude and longitude//
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true`);
            const weatherData = await weatherResponse.json();
            console.log(weatherData);

            //Clear previous output//
            weatherOutput.innerHTML = "";

            //Append weather information to the output container//
            const weatherInfo = `
                <h3>Weather in ${city}</h3>
                <p><strong>Temperature:</strong> ${weatherData.current_weather.temperature}°C</p> `;
            weatherOutput.innerHTML = weatherInfo;
        
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Failed to fetch weather data. Please try again later.");
        }
    }

    //Function to convert USD to 10 popular currencies//
    async function currencyExchange() {
        const amountStr = currencyInput.value.trim();
        const amount = parseFloat(amountStr) || 1;
        const from = "usd";
        let to = toCurrencySelect.value;
        
        try {
            // Fetch exchange rate to convert USD to the selected currency //
            const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`);
            const data = await response.json();

            //Clear previous output//
            currencyOutput.innerHTML = "";

            // The API returns rates relative to 1 unit of the base currency
            const rate = data[from][to];

            if (data && typeof rate !== "undefined") {
                const convertedAmount = (amount * rate).toFixed(2);
                currencyOutput.innerHTML = `${amount} ${from.toUpperCase()} = ${convertedAmount} ${to.toUpperCase()}`;
            } else {
                currencyOutput.innerHTML = "Failed to retrieve exchange rate.";
            }
        } catch (error) {
            console.error("Error fetching currency data:", error);
            alert("Failed to fetch currency data. Please try again later.");
        }
    }

    //Function to get Bible verses//
    async function getBibleVerses() {
        const verse = bibleVerseInput.value.trim();
    // Default to 'kjv' if empty
    const version = bibleVersionInput.value.trim() || "kjv";
        if (!verse) {
            alert("Please enter a Bible verse.");
            return;
        }

        try {
            const response = await fetch(`https://bible-api.com/${verse}?translation=${version}`);
            const data = await response.json();
            console.log(data);

            //Clear previous output//
            bibleOutput.innerHTML = "";

            //Display Bible verse information//
            if (data && data.text) {
                const verseInfo = `
                    <h3>${data.reference}</h3>
                    <p>${data.text}</p>
                    <p><small><strong>Version:</strong> ${data.translation_name}</small></p>
                `;
                bibleOutput.innerHTML = verseInfo;
            } else {
                bibleOutput.innerHTML = "Failed to retrieve Bible verse.";
            }
        } catch (error) {
            console.error("Error fetching Bible verse:", error);
            alert("Failed to fetch Bible verse. Please try again later.");   
        }
    }

    //Function to fetch and display GitHub user data//
    async function getGitHubUser() {
        const username = githubUsernameInput.value.trim();
        if (!username) {
            alert("Please enter a GitHub username.");
            return;
        }

        //Fetch data from GitHub API//
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            const data = await response.json();
            console.log(data);

            //Clear previous output//
            githubOutput.innerHTML = "";

        //Display user information//
        if (data.message === "Not Found") {
            githubOutput.innerHTML = "User not found.";
        } else {
            const userInfo = `
                <h3>${data.login}</h3>
                <img src="${data.avatar_url}" alt="${data.login}" width="100" />
                <p><strong>Bio:</strong> ${data.bio || "No bio available."}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Following:</strong> ${data.following}</p>
            `;
            githubOutput.innerHTML = userInfo;
        }
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        alert("Failed to fetch GitHub data. Please try again later.");
    } 
    }

    //Function to fetch and display a random joke//
    async function getJoke() {

        //Fetch data from Joke API//
        const response = await fetch ("https://official-joke-api.appspot.com/random_joke");
        const data = await response.json();
        console.log(data);

        //Clear previous joke//
        jokeOutput.innerHTML = "";

        //Style the joke output//
        jokeOutput.style.border = "1px solid #ccc";
        jokeOutput.style.backgroundColor = "antiquewhite";

        //Display the joke//
        if (data.setup && data.punchline) {
            const jokeInfo = `
                <p><strong>${data.setup}</strong></p>
                <p>${data.punchline}</p>
            `;
            jokeOutput.innerHTML = jokeInfo;
        }

    }


    //Function to search for recipes //
        const getRecipe = async (query) => {
            if (!query) {
                alert("Please enter a recipe name.");
                return;
            }

            try {
                const response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${query}`);
                const data = await response.json();
                console.log(data);
                //Clear previous output//
                recipeOutput.innerHTML = "";

                //Display recipe information//
                if (data.meals && data.meals.length > 0) {
                    data.meals.forEach(recipe => {
                        const recipeInfo = `
                            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="100" />
                            <h3>${recipe.strMeal}</h3>
                            <p><strong>Category:</strong> ${recipe.strCategory}</p>
                            <p><strong>Area:</strong> ${recipe.strArea}</p>
                            <p>${recipe.strInstructions}</p>
                        
                        `;
                        recipeOutput.innerHTML += recipeInfo;
                    });
                } else {
                    recipeOutput.innerHTML = "No recipes found.";
                }
            } catch (error) {
                console.error("Error fetching recipe data:", error);
                alert("Failed to fetch recipe data. Please try again later.");
            }
        }

    //Add event listeners to buttons//
    dogButton.addEventListener("click", getDogImage);
    catButton.addEventListener("click", getCatImage);
    weatherButton.addEventListener("click", getWeatherByCity);
    currencyButton.addEventListener("click", currencyExchange);
    bibleButton.addEventListener("click", getBibleVerses);
    githubButton.addEventListener("click", getGitHubUser);
    jokeButton.addEventListener("click", getJoke);
    recipeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const searchInput = recipeInput.value.trim();
        getRecipe(searchInput);
    });
});
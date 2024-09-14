# Weather Web App

A simple weather web application built with vanilla JavaScript, using Visual Crossing's weather API to fetch and display weather information for different cities. Users can search for a city, view weather data for the past 24 hours and the last 3 days, add cities to their watch list, and toggle between Fahrenheit and Celsius.

## Features

- **City Search**: Type in the name of any city to get the weather data for the past 24 hours and the last 3 days.
- **Watch List**: Add favorite cities to a watch list for quick access next time.
- **Temperature Toggle**: A toggle button in the top-right corner allows switching between Fahrenheit and Celsius.
- **Dynamic Background**: The app changes its background according to the current weather conditions (e.g., sunny, rainy, cloudy).
  
## Built With

- **JavaScript**: Vanilla JavaScript for the app logic and interaction.
- **HTML/CSS**: For structuring and styling the application.
- **Visual Crossing Weather API**: Provides the weather data.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- An API key from [Visual Crossing](https://www.visualcrossing.com/) to fetch weather data.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/RainCheck.git
    ```

2. Open the project directory:
    ```bash
    cd RainCheck
    ```

3. Open `index.html` in your web browser to run the application.

### Usage

1. Type the name of a city in the search input to view the weather information for the last 24 hours and the past 3 days.
2. Use the toggle button in the top-right corner to switch between Fahrenheit and Celsius.
3. Click "Add to Watch List" to save the city for quick access in future sessions.
4. The background will automatically change according to the weather conditions of the selected city.

## API Integration

This app uses the [Visual Crossing Weather API](https://www.visualcrossing.com/) to fetch weather data. Make sure to replace the placeholder API key in the JavaScript file with your own key.

## Acknowledgements

- [Visual Crossing](https://www.visualcrossing.com/) for providing weather data.

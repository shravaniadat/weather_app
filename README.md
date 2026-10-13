# 🌦️ SkyCast | Premium Weather Insights

SkyCast is a modern, responsive weather application that provides real-time weather data and 5-day forecasts with a sleek glassmorphism design. Built with vanilla JavaScript and Tailwind CSS, it offers a premium user experience with dynamic backgrounds and intuitive controls.

![SkyCast Preview](https://via.placeholder.com/800x450.png?text=SkyCast+Weather+App+Preview) <!-- Replace with actual screenshot if available -->

## ✨ Features

- **Real-time Weather**: Get current temperature, humidity, wind speed, and weather conditions for any city.
- **5-Day Forecast**: Plan ahead with a detailed 5-day weather outlook.
- **Geolocation**: Automatically detect your location for instant local weather updates.
- **Smart Search**: Search for any city worldwide with a built-in search history for quick access.
- **Dynamic UI**: Backgrounds and icons change dynamically based on the current weather conditions (Clear, Cloudy, Rain, Snow, etc.).
- **Unit Conversion**: Seamlessly toggle between Celsius (Metric) and Fahrenheit (Imperial) units.
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens using a "glassmorphism" aesthetic.

## 🚀 Tech Stack

- **HTML5**: Semantic structure.
- **Tailwind CSS**: Modern utility-first styling with glassmorphism effects.
- **Vanilla JavaScript (ES6+)**: Functional logic and API integration.
- **OpenWeatherMap API**: Reliable source for global weather data.
- **Font Awesome**: Beautiful iconography.
- **Google Fonts (Inter)**: Clean and modern typography.

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shravaniadat/weather_app.git
   cd weather_app
   ```

2. **API Configuration**:
   - Obtain an API key from [OpenWeatherMap](https://openweathermap.org/api).
   - Create a `config.js` file in the project root:
     ```javascript
     const API_KEY = 'YOUR_API_KEY_HERE';
     export default API_KEY;
     ```
   - (Optional) Use `config.example.js` as a template.

3. **Run the app**:
   - Simply open `index.html` in your favorite browser, or use a live server extension (like VS Code Live Server).

## 📝 Usage

- Enter a city name in the search bar and press **Enter**.
- Click the **Location** icon to fetch weather for your current coordinates.
- Click the **C** or **F** icons to switch temperature units.
- Revisit recent searches using the chips below the search bar.




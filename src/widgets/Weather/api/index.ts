export const fetchWeather = async ({latitude, longitude}: {latitude: number | undefined, longitude: number | undefined}) => {
  if (latitude && longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&hourly=temperature_2m&forecast_days=1`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  } else {
    throw new Error('Network response was not ok')
  }
}


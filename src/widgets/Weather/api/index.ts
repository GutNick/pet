import {locationCoords} from "@/widgets/Weather/ui/Weather";

export const getWeatherData = async (coordinates:locationCoords): Promise<Response> => {
	return await fetch('/weather-api', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(coordinates)
	});
}
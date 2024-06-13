'use client'
import {Line} from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip} from "chart.js";
import {getCurrentPosition} from "@/widgets/Weather/lib";
import {useEffect, useState} from "react";
import {fetchWeather} from "@/widgets/Weather/api";
import moment from "moment";

export type locationCoords = { latitude: number | undefined; longitude: number | undefined } | null;
interface IData {
  hourly: {
    time: Date[],
    temperature_2m: number[]
  }
}

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export const Weather = () => {

  const [coordinates, setCoordinates] = useState<locationCoords>(null)
  const [data, setData] = useState<null | IData>(null)
  const [dates, setDates] = useState<null | string[]>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const setCoords = (coords: locationCoords) => setCoordinates({
    latitude: coords?.latitude,
    longitude: coords?.longitude
  })

  const renderWeatherResponse = () => {
    switch (true) {
      case isLoading:
        return <p>Loading weather data</p>
      case isError:
        return <p>Something went wrong</p>
      case coordinates === null:
        return <p>Please confirm geolocation access</p>
      default:
        return ""
    }
  }

  useEffect(() => {
    getCurrentPosition(setCoords)
    const a = moment("2016-11-09T22:23:27.861")
    console.debug(a.format())
  }, []);

  useEffect(() => {
    if (coordinates) {
      setIsLoading(true)
      fetchWeather({...coordinates})
        .then((data:IData) => {
          setData(data)
          setDates(() => ([...data.hourly.time.map(date => moment(date).format("DD.MM HH:mm"))]))
          console.debug(data)
        })
        .catch((e) => {
          console.error(e)
          setIsError(true)
        })
        .finally(() => setIsLoading(false))
    }

  }, [coordinates]);

  return (
    <section style={{width: "100%", height: "300px"}}>
      <h1>Weather</h1>
      {renderWeatherResponse()}
      {data &&
        <>
          <h2>Temperature</h2>
          <p>Low {Math.min( ...data.hourly.temperature_2m )}°C, High {Math.max( ...data.hourly.temperature_2m )}°C</p>
          <Line
            data={{
              labels: dates || [],
              datasets: [
                {
                  label: "",
                  data: data.hourly.temperature_2m,
                },
              ],
            }}
            options={{
              backgroundColor: '#F60018',
              // borderColor: "#F60018",
              responsive: true,
            }}
            plugins={[Tooltip]}
            width={"100vw"}
            height={10}

          />
        </>
      }
    </section>
  )
}
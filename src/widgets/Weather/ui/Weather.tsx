'use client'
import {Line} from 'react-chartjs-2';
import {CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip} from "chart.js";
import {getCurrentPosition} from "@/widgets/Weather/lib";
import {useEffect, useState} from "react";
import moment from "moment";

export type locationCoords = { latitude: number | undefined; longitude: number | undefined } | null;
type responseData = {
  data: IData
}

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
  const [todayDate, setTodayDate] = useState<null | string>(null)
  const [walkHoursTempr, setWalkHoursTempr] = useState<null | (number | undefined)[]>(null)
  const [widgetHeight, setWidgetHeight] = useState(10)

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
    setTodayDate(new Date().toISOString())
    resize()
  }, []);

  useEffect(() => {
    if (coordinates) {
      setIsLoading(true)
      fetch('/weather-api', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coordinates)
      })
        .then((res) => {
          return res.json()
        })
        .then(({data}: responseData) => {
          setData(data)
          setDates(() => ([...data.hourly.time.map(date => moment(date).format("DD.MM HH:mm"))]))
        })
        .catch((e) => {
          console.error(e)
          setIsError(true)
        })
        .finally(() => setIsLoading(false))
    }

  }, [coordinates]);

  const resize = () => {
    if (window.innerWidth > 760) {
      setWidgetHeight(10)
    } else {
      setWidgetHeight(100)
    }
  }

  const handleClothesSelect = () => {
    const hourIndex = dates?.findIndex(item => item === String(moment(todayDate).format("DD.MM HH:00")))
    if (hourIndex && hourIndex !== -1) {
      const temps = []
      for (let i = hourIndex; i < hourIndex + 3; i++) {
        temps.push(data?.hourly.temperature_2m[i])
      }
      setWalkHoursTempr(temps)
    }
  }

  return (
    <section style={{width: "100%", height: "300px"}}>
      <h1>Weather</h1>
      <p>Today is {moment(todayDate).format("DD MMMM")}</p>
      <button onClick={handleClothesSelect} disabled={isLoading || isError || !data}>What to wear child</button>
      {
        Array.isArray(walkHoursTempr) ?
          <p>Temperature for 2 hours
            from {walkHoursTempr[0]}°C to {walkHoursTempr[2]}°C</p> :
          ""
      }
      {renderWeatherResponse()}
      {data &&
        <>
          <h2>Temperature</h2>
          <p>Low {Math.min(...data.hourly.temperature_2m)}°C, High {Math.max(...data.hourly.temperature_2m)}°C</p>
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
                responsive: true,
              }}
              plugins={[Tooltip]}
              width={"100vw"}
              height={widgetHeight}

            />
        </>
      }
    </section>
  )
}
'use client'
import {getCurrentPosition} from "@/widgets/Weather/lib";
import {useEffect, useState} from "react";
import moment from "moment";
import { Line, ReferenceLine } from 'recharts';
import {Chart} from "@/entities/Chart";
import {getWeatherData} from "@/widgets/Weather/api";
import {useCN} from "@/shared/utils/hooks/useCN";
import "./styles.scss"


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

const CustomizedLabel = ({ x, y, value }: {x?: number, y?: number, value?: string}) => {
    return (
      <text x={x} y={y} dy={-14} fill={"red"} fontSize={14} textAnchor="middle">
        {value}
      </text>
    );
}

export const Weather = () => {

  const [coordinates, setCoordinates] = useState<locationCoords>(null)
  const [data, setData] = useState<null | IData>(null)
  const [dates, setDates] = useState<null | string[]>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [todayDate, setTodayDate] = useState<null | string>(null)
  const [walkHoursTemperature, setWalkHoursTemperature] = useState<null | (number | undefined)[]>(null)
  const [chartData, setChartData] = useState<null | { name: string; Temperature: number; }[]>(null)

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

  const combineHourlyData = (data: IData) => {
    const times = data.hourly.time;
    const temperatures = data.hourly.temperature_2m;

    return times.map((time, index) => ({
      name: moment(time).format("HH:mm"),
      Temperature: temperatures[index]
    }));
  }

  const handleClothesSelect = () => {
    const hourIndex = dates?.findIndex(item => item === String(moment(todayDate).format("DD.MM HH:00")))
    if (hourIndex && hourIndex !== -1) {
      const temps = []
      for (let i = hourIndex; i < hourIndex + 3; i++) {
        temps.push(data?.hourly.temperature_2m[i])
      }
      setWalkHoursTemperature(temps)
    }
  }

  const getCN = useCN("Weather")

  useEffect(() => {
    getCurrentPosition(setCoords)
    setTodayDate(new Date().toISOString())
  }, []);

  useEffect(() => {
    if (coordinates) {
      setIsLoading(true)
      getWeatherData(coordinates)
        .then((res) => {
          return res.json()
        })
        .then(({data}: responseData) => {
          setChartData(combineHourlyData(data))
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

  return (
    <section className={getCN()}>
      <h1>Weather</h1>
      <p>Today is {moment(todayDate).format("DD MMMM")}</p>
      <button onClick={handleClothesSelect} disabled={isLoading || isError || !data}>What to wear child</button>
      {
        Array.isArray(walkHoursTemperature) ?
          <p>Temperature for 2 hours
            from {walkHoursTemperature[0]}°C to {walkHoursTemperature[2]}°C</p> :
          ""
      }
      {renderWeatherResponse()}
      {data &&
        <>
          <h2>Temperature</h2>
          <p>Low {Math.min(...data.hourly.temperature_2m)}°C, High {Math.max(...data.hourly.temperature_2m)}°C</p>
        </>
      }
      {
        !!chartData && <Chart data={chartData} >
          <ReferenceLine x={moment().format("HH:00")} stroke="red" label="Now" />
          <Line type="monotone" dataKey="Temperature" stroke="#8884d8" label={<CustomizedLabel />}/>
        </Chart>
      }
    </section>
  )
}
export async function GET() {
  const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
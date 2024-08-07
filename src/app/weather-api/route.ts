export async function POST(request: Request) {
  const { latitude, longitude } = await request.json()
  if (latitude && longitude) {
    const res = await fetch(`${process.env.BASE_URL_METEO}?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&hourly=temperature_2m&forecast_days=1`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()

    return Response.json({data})
  } else {
    throw new Error('Network response was not ok')
  }
}
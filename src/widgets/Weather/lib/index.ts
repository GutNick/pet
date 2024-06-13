import {locationCoords} from "@/widgets/Weather/ui/Weather";

export const getCurrentPosition = (callback: (a: locationCoords) => void) => {
  let isError = false

  const success = (pos: {coords: {latitude: number, longitude: number, accuracy: number}}) => {
    callback(pos.coords)
  }

  function error(err: any) {
    isError = true
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error);

  if (isError) {
    callback(null)
    throw new Error('Geolocation is not supported')
  }
}
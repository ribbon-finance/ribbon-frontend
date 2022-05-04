// Hook that automatically geofences an app
import axios from "axios";
import { useEffect, useState } from "react";

export enum GeofenceCountry {
  SINGAPORE = "SG",
  US = "US",
}

// and then redirects to a URL if not applicable
export const useGeofence = (country: GeofenceCountry) => {
  // If rejected, redirect to rejectedUrl
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://ipapi.co/json")
      .then(({ data }) => {
        const { country_code } = data;
        if (country_code === country) {
          setRejected(true);
        } else {
          setRejected(false);
        }
      })
      .catch((e) => {
        // Geofence failed. Should we default to rejected or ok?
        setRejected(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [country]);

  return {
    rejected,
    loading,
  };
};

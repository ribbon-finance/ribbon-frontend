// Hook that automatically geofences an app
import axios from "axios";
import { useEffect, useState } from "react";

export enum GeofenceCountry {
  SINGAPORE = "SG",
  US = "US",
}

export enum REarnGeofenceCountry {
  BELARUS = "BY",
  CUBA = "CU",
  NORTHKOREA = "KP",
  CONGO = "CD",
  IRAN = "IR",
  IRAQ = "IQ",
  LEBANON = "LB",
  LIBYA = "LY",
  MALI = "ML",
  MYANMAR = "MM",
  NICARAGUA = "NI",
  RUSSIA = "RU",
  SOMALIA = "SO",
  SOUTHSUDAN = "SS",
  SUDAN = "SD",
  SYRIA = "SY",
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
      .get("https://ipapi.co/country")
      .then(({ data }) => {
        if (data === country) {
          setRejected(true);
        } else {
          setRejected(false);
        }
      })
      .catch((e) => {
        // Geofence failed. Should we default to rejected or ok?
        setRejected(false);
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

// and then redirects to a URL if not applicable
export const useREarnGeofence = (countries: string[]) => {
  // If rejected, redirect to rejectedUrl
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://ipapi.co/country")
      .then(({ data }) => {
        if (countries.includes(data)) {
          setRejected(true);
        } else {
          setRejected(false);
        }
      })
      .catch((e) => {
        // Geofence failed. Should we default to rejected or ok?
        setRejected(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    rejected,
    loading,
  };
};

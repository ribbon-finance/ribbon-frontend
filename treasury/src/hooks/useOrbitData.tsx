import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export type OrbitData = {
  loading: boolean;
  pv: number;
};

export const defaultOrbitData = {
  loading: true,
  pv: 0,
};

export const useOrbitData = () => {
  const [data, setData] = useState<OrbitData>();

  const fetchOrbitData = useCallback(async () => {
    if (data) {
      return;
    }

    const apiURL = `https://j5oe0qeawb.execute-api.us-east-2.amazonaws.com/1/readOrbitData`;

    try {
      const response = await axios.get(apiURL);

      const { data } = response;

      const orbitData = { loading: false, pv: data.orbitData } as OrbitData;

      setData(orbitData);
    } catch (error) {
      setData(defaultOrbitData);
    }
  }, [data]);

  useEffect(() => {
    fetchOrbitData();
  }, [fetchOrbitData]);

  return data || defaultOrbitData;
};

import axios from "axios";

module.exports = async (req: any, res: any) => {
  const apiURL = `https://platform.credora.io/api/v2/risk`;

  const headers = {
    headers: {
      clientId: process.env.REACT_APP_CREDORA_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CREDORA_CLIENT_SECRET,
    },
  };

  const body: string[] = []; //empty body to get all available counterparties
  const response = await axios.post(apiURL, body, headers);

  const data = response.data;

  res.json({ data });
};

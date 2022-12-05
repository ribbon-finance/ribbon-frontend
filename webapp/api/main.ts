import axios from "axios";

module.exports = async (req, res) => {
  const apiURL = `https://platform.credora.io/api/v2/risk`;

  const headers = {
    headers: {
      clientId: process.env.REACT_APP_CREDORA_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CREDORA_CLIENT_SECRET,
    },
  };

  const response = await axios.request({
    url: apiURL,
    method: "POST",
    headers: headers,
    data: "{[]}",
  });

  // Process the response data...
  const data = response.data;

  res.json({ data });
};

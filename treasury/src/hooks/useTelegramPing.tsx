import axios from "axios";

const token = process.env.REACT_APP_TELEGRAM_BOT_TOKEN_ID;
const chatId = process.env.REACT_APP_TELEGRAM_GROUP_ID;

export const sendMessage = async (message: string) => {
  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
  } catch (error) {
    console.error(error);
  }
};

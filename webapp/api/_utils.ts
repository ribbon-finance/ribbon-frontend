import moment, { Moment } from "moment";
import { NextApiRequest } from "next";

export const parseExpiryFromRequest = (request: NextApiRequest) => {
  const ex = request.query["expiry"] as string;
  let expiryTimestamp: number;
  if (ex === "latest") {
    expiryTimestamp = getLastFriday();
  } else {
    expiryTimestamp = parseInt(request.query["expiry"] as string);
  }
  return expiryTimestamp;
};

export const getLastFriday = () => {
  const now = moment().utc();
  let friday;

  switch (now.isoWeekday()) {
    case 1:
    case 2:
    case 3:
    case 4:
      friday = moment().utc().day(5).subtract(1, "week");
      break;
    case 5:
      // On Fridays, if before 8am UTC return last week. If after, return today
      if (now.hours() < 8) {
        friday = moment().utc().day(5).subtract(1, "week");
      } else {
        friday = moment().utc().day(5);
      }
      break;
    case 6:
    case 7:
      friday = moment().utc().day(5);
      break;
  }
  return (friday as Moment).hours(8).minutes(0).seconds(0).unix();
};

export const getNextFridayTimestamp = () => {
  const now = moment().utc();
  let friday;

  switch (now.isoWeekday()) {
    case 1:
    case 2:
    case 3:
      friday = moment().utc().day(5);
      break;
    case 4:
    case 5:
    case 6:
    case 7:
      friday = moment().utc().day(5).add(1, "week");
      break;
  }
  return (friday as Moment).hours(8).minutes(0).seconds(0).unix();
};

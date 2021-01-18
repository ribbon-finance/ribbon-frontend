export const timeToExpiry = (expiry: string) => {
  const now = new Date();
  const total = Date.parse(expiry) - now.valueOf();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  const res = {
    total,
    days,
    hours,
    minutes,
    seconds,
  };

  return formatTimeToExpiry(res);
};

export const formatTimeToExpiry = (dateTime: any) => {
  if (dateTime.days < 0) {
    return "Expired";
  } else if (dateTime.days === 0) {
    return `${dateTime.hours} hours`;
  } else {
    return `${dateTime.days}d ${dateTime.hours}h`;
  }
};

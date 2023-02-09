export default function convertDateToLocalTime(dateString) {
  var date = new Date(dateString);

  date.setMinutes(date.getMinutes());

  var localTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return localTime;
}

export const combineDateTime = ({ dateInput, timeInput }) => {
  let date = new Date(dateInput);
  let time = new Date(timeInput);

  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  date.setSeconds(time.getSeconds());

  return date;
};

export const TimeNMinsInFuture = (min) => {
  const currentTime = new Date();
  const thirtyMinutesInMs = min * 60 * 1000;
  const newTime = new Date(currentTime.getTime() + thirtyMinutesInMs);
  return newTime;
};

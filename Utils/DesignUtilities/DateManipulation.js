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

export const convertDateToReadable = (dateStr) => {
  let date = new Date(dateStr);
  let options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  let datePart = date.toLocaleDateString("en-US", options);

  const split = new Date().toString().split(" ");
  const timeZone = split.slice(-3).join(" ");
  let timeZoneString = "";

  timeZone
    .replace("(", "")
    .replace(")", "")
    .split(" ")
    .forEach((item) => {
      timeZoneString = timeZoneString + item[0];
    });

  return `${datePart} (${timeZoneString.toUpperCase()})`;
};

export default function convertDateToLocalTime(dateString) {
  var date = new Date(dateString);

  date.setMinutes(date.getMinutes());

  var localTime = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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

export const getNthMonthFromCurrentMonth = (n) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const targetMonth = (currentMonth + n) % 12; // Ensure the month is within 0-11 range
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNumber = targetMonth + 1; // Months are 0-based, so add 1 to get the month number
  const monthName = monthNames[targetMonth];

  return { number: monthNumber, name: monthName };
};

export const getDaysAndDateForNthMonthOfCurrentYear = (n, xDay) => {
  const year = new Date().getFullYear(); // get current year
  const month = n - 1; // convert month number to 0-based index

  // create a new date object for the first day of the specified month
  const firstDayOfMonth = new Date(year, month, 1);

  // create a new date object for the last day of the specified month
  const lastDayOfMonth = new Date(year, month + 1, 0);

  if (xDay) {
    const date = firstDayOfMonth;
    date.setDate(xDay);
    const dayName = date.toLocaleString("en-US", { weekday: "short" }); // get 3 char day name
    const dateString = date.toLocaleDateString("en-US", { day: "2-digit" }); // get date string in DD format
    return { dayName, dateString: parseInt(dateString) };
  }

  const daysAndDates = [];

  // iterate over each day of the month
  for (
    let date = firstDayOfMonth;
    date <= lastDayOfMonth;
    date.setDate(date.getDate() + 1)
  ) {
    const dayName = date.toLocaleString("en-US", { weekday: "short" }); // get 3 char day name
    const dateString = date.toLocaleDateString("en-US", { day: "2-digit" }); // get date string in DD format
    daysAndDates.push({ dayName, dateString: parseInt(dateString) });
  }

  return daysAndDates;
};

export const MonthAndDateToISOStringForCurrentYear = (month, date) => {
  const currentYear = new Date().getFullYear();
  const localDate = new Date(currentYear, month - 1, date);
  const timezoneOffsetInMinutes = localDate.getTimezoneOffset();
  const adjustedDate = new Date(
    localDate.getTime() - timezoneOffsetInMinutes * 60 * 1000
  );
  const isoDate = adjustedDate.toISOString();
  return isoDate;
};

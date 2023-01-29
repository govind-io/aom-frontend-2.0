export default function convertDateToLocalTime(dateString) {
  var date = new Date(dateString);

  date.setMinutes(date.getMinutes());

  var localTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return localTime;
}

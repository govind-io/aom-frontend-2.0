export const getTopUsers = (obj, arr, num) => {
  const sortedUsers = arr.sort((a, b) => {
    if (obj[a.uid] === obj[b.uid]) return 0;
    return obj[a.uid] > obj[b.uid] ? -1 : 1;
  });

  const topUsers = sortedUsers.slice(0, num);
  const restOfUsers = sortedUsers.slice(num);

  return [topUsers, restOfUsers];
};

export const getTopUsers = (map, num) => {
  const sortedUsers = new Map(
    [...map.entries()].sort((a, b) => {
      if (a[1].audioLevel === b[1].audioLevel) return 0;
      return a[1].audioLevel > b[1].audioLevel ? -1 : 1;
    })
  );

  const topUsers = new Map([...sortedUsers.entries()].slice(0, num));
  const restOfUsers = new Map([...sortedUsers.entries()].slice(num));

  return [topUsers, restOfUsers];
};

export const formatStatus = (state) => {
  // 0 CREATED, 1 OPEN, 2 CLOSED, 3 RESOLVED
  if (state === 1) return "OPEN";
  if (state === 2) return "CLOSED";
  if (state === 3) return "RESOLVED";
  return "CREATED";
};

export const formatEndsIn = (endTime) => {
  const diff = endTime * 1000 - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
};

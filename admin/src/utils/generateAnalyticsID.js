//src/utils/generateAnalyticsID.js
export const generateAnalyticsID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let analyticsid = '';
  for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      analyticsid += chars[randomIndex];
  }
  return analyticsid;
};

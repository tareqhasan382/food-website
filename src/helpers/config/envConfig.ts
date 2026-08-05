export const getBaseUrl = (): string => {
  return (
    import.meta.env.VITE_API_BASE_URL ??
    "https://food-website-backend.vercel.app"
  );
};

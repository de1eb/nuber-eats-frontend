export const useQueryParams = (string: string) => {
  return window.location.href.split(`${string}`)[1];
};

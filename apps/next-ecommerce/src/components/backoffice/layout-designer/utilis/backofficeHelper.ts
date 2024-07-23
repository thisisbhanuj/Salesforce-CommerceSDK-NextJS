export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_URL_DEV;
  } else {
    return process.env.NEXT_PUBLIC_URL_PROD;
  }
};

export const getBackofficeUrl = () => {
  return `${getBaseUrl()}/backoffice/`;
};

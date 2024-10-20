export const ERROR_STATUS_CODE: {
  [type: string]: {
    [error: string]: number;
  };
} = {
  server: {
    internalError: 500,
  },
  client: {
    notFound: 404,
    unauthorized:401
  },
};

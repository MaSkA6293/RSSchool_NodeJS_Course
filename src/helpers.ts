const getUserId = (queryString: string | null): string | undefined => {
  if (queryString) {
    return queryString.split('/').slice(-1)[0];
  }
  return undefined;
};

export default getUserId;

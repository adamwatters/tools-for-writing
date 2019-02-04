function mmddyyyy(seperator: string) {
  const today = new Date();
  const dNum = today.getDate();
  const mNum = today.getMonth() + 1; //January is 0!
  const dd = dNum < 10 ? `0${dNum}` : `${dNum}`;
  const mm = mNum < 10 ? `0${mNum}` : `${mNum}`;
  return `${mm}${seperator}${dd}${seperator}${today.getFullYear()}`;
}

export { mmddyyyy };

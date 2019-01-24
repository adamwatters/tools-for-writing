function mmddyyyy() {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}/${dd}/${today.getFullYear()}`;
}

export { mmddyyyy };

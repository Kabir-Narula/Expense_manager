export const parseDateToLocal = (iso) => {
  if (!iso) return new Date(NaN);
  const ymd = iso.toString().slice(0, 10).split("-");
  const y = Number(ymd[0]);
  const m = Number(ymd[1]) - 1;
  const d = Number(ymd[2]);
  return new Date(y, m, d);
};

export const formatDateToSend = (dateToFormat) => {
  console.log("format date function: " + dateToFormat);
  if (!dateToFormat) {
    return "";
  }
  let formattedDate = "";
  const date = new Date(
    `${dateToFormat}`.replace(/-/g, "\/").replace(/T.+/, ""),
  );
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

  export const parseDateToLocal = (iso) => {
    if (!iso) return new Date(NaN);
    const ymd = iso.toString().slice(0, 10).split("-");
    const y = Number(ymd[0]);
    const m = Number(ymd[1]) - 1;
    const d = Number(ymd[2]);
    return new Date(y, m, d);
  };
// * Formats a date value as DD/MM/YYYY using the en-GB locale.
// *
// * Accepts `Date`, ISO strings, or epoch numbers because the mock adapter
// * (and any future real backend) serializes responses through JSON — which
// * turns `Date` fields into strings by the time they reach the UI. Normalizing
// * here keeps every list/row component free of parsing logic.
//
// @param date - the date value to format
export const formatDate = (date: Date | string | number): string => {
  const parsed: Date = date instanceof Date ? date : new Date(date);

  // ! Guard against invalid inputs so a single bad row doesn't crash the list.
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleDateString('en-GB');
};

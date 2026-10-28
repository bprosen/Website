const formatters = new Map<string, Intl.DateTimeFormat>();

const formatterFor = (timeZone: string) => {
  let formatter = formatters.get(timeZone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      hour: 'numeric',
      hour12: true,
      minute: '2-digit',
      second: '2-digit',
      timeZone,
    });
    formatters.set(timeZone, formatter);
  }

  return formatter;
};

export const formatClock = (date: Date | number, timeZone: string) =>
  formatterFor(timeZone).format(date).replace(/\./g, '').toUpperCase();

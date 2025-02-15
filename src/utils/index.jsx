export const generateHourOptions = (startHour = 8, endHour = 22) =>
  Array.from({ length: endHour - startHour + 1 }, (_, i) => {
    const hour = startHour + i;
    return {
      value: hour,
      option: `${hour < 10 ? "0" : ""}${hour}:00`,
    };
  });

export const generateDurationOptions = (number) => {
  return Array.from({ length: number }, (_, index) => {
    const duration = index + 1;
    return duration
  });
};

export const getDateRange = () => {
  const today = new Date()
  const formattedToday = today.toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 3)
  const formattedMaxDate = maxDate.toISOString().split('T')[0]

  return{
    min: formattedToday,
    max: formattedMaxDate
  }
}

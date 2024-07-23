export const countdownTime = () => {
  const currentDate: Date = new Date();
  // Calculate target date 120 minutes from current time
  const targetDate = new Date(currentDate.getTime() + 120 * 60 * 1000);
  const difference: number = targetDate.getTime() - currentDate.getTime();

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};
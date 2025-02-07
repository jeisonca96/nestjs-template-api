export function getSecondsFromDuration(duration: string): number {
  const regex = /(\d+)([smhd])/;
  const match = duration.match(regex);

  if (!match) {
    throw new Error('Invalid duration format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      throw new Error('Not a valid unit');
  }
}

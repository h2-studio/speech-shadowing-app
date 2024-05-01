export function formatTime(num: number): string {
  num = Math.ceil(num);

  let min = (num / 60).toString().padStart(2, "0");
  let sec = (num % 60).toString().padStart(2, "0");

  return `${min}:${sec}`;
}

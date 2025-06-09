import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(input: Date | string): string {
    const date = new Date(input);
    const millisecondsDiff = new Date().getTime() - date.getTime();

    const secondsDiff = Math.floor(millisecondsDiff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    const monthsDiff = Math.floor(daysDiff / 30);
    const yearsDiff = Math.floor(daysDiff / 365);

    if (secondsDiff < 60) {
      return 'Just now';
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
    } else if (daysDiff < 30) {
      return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
    } else if (monthsDiff < 12) {
      return `${monthsDiff} month${monthsDiff !== 1 ? 's' : ''} ago`;
    } else {
      return `${yearsDiff} year${yearsDiff !== 1 ? 's' : ''} ago`;
    }
  }
}

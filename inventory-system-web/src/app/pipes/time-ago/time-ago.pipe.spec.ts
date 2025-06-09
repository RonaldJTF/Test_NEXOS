import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('should return "Just now" for dates within the last 60 seconds', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 30 * 1000);
    expect(pipe.transform(date)).toBe('Just now');
  });

  it('should return "1 minute ago" for exactly 1 minute ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 60 * 1000);
    expect(pipe.transform(date)).toBe('1 minute ago');
  });

  it('should return "5 minutes ago" for 5 minutes ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 5 * 60 * 1000);
    expect(pipe.transform(date)).toBe('5 minutes ago');
  });

  it('should return "1 hour ago" for 1 hour ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 hour ago');
  });

  it('should return "3 hours ago" for 3 hours ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('3 hours ago');
  });

  it('should return "1 day ago" for 1 day ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 day ago');
  });

  it('should return "10 days ago" for 10 days ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('10 days ago');
  });

  it('should return "1 month ago" for 30 days ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 month ago');
  });

  it('should return "6 months ago" for 180 days ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('6 months ago');
  });

  it('should return "1 year ago" for 365 days ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('1 year ago');
  });

  it('should return "2 years ago" for 800 days ago', () => {
    const now = new Date();
    const date = new Date(now.getTime() - 800 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date)).toBe('2 years ago');
  });

  it('should parse string dates correctly', () => {
    const now = new Date();
    const dateString = new Date(now.getTime() - 60 * 1000).toISOString();
    expect(pipe.transform(dateString)).toBe('1 minute ago');
  });
});

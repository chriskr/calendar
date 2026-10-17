import { getEasterSunday } from './dateExtensions';

const EASTER_RELATIVE = /^easter([+-]\d+)?$/;

class LocalHolidays {
  /**
   * Takes a list of tuples, short date and name of a holiday. The year yyyy is
   * a place holder for any year. Movable holidays are given relative to
   * Easter Sunday as easter, easter+n or easter-n (n days) and are computed
   * for each year.
   * E.g.
   *
   * [
   * ['01.01.yyyy', 'New Year\'s Day'],
   * ...
   * ['easter+1', 'Easter Monday'],
   * ...
   * ]
   * @param {Array} holidays - A list of short date and name tuples.
   *
   */
  constructor(holidays) {
    this.holidays_ = new Map();
    this.easterRelative_ = [];
    this.computedYears_ = new Set();
    for (const [date, name] of holidays) {
      const match = EASTER_RELATIVE.exec(date);
      if (match) {
        this.easterRelative_.push([Number.parseInt(match[1] || '0', 10), name]);
      } else {
        const [day, month, year] = date.split('.').map(
          i => i === 'yyyy' ? 0 : Number.parseInt(i, 10));
        this.holidays_.set(this.toKey_(year, month - 1, day), name);
      }
    }
  }

  isHoliday(year, month, day) {
    this.computeYear_(year);
    return this.holidays_.has(this.toKey_(year, month, day)) ||
        this.holidays_.has(this.toKey_(0, month, day));
  }

  /**
   * Returns a list of tuples, date and name of the according holidays.
   * E.g <Holidays>.getHolidays(2017, 4) returns
   *
   * [
   *   [1, 'Labor Day'],
   *   [17, 'Constitution Day'],
   *   [25, 'Ascension Day']
   * ]
   * @param {number} year - The year.
   * @param {number} month - The month.
   * @return {Array} List of the holidays tuples with short date and name.
   *
   */
  getHolidays(year, month) {
    this.computeYear_(year);
    const holidays = [];
    for (const [key, value] of this.holidays_) {
      const [keyYear, keyMonth, keyDay] = this.fromKey_(key);
      if ((keyYear === year || keyYear === 0) && keyMonth === month) {
        holidays.push([keyDay, value]);
      }
    }
    return holidays.sort((a, b) => a[0] - b[0]);
  }

  /**
   * Adds the holidays relative to Easter Sunday for the given year, once.
   * @param {number} year - The year.
   */
  computeYear_(year) {
    if (this.computedYears_.has(year)) {
      return;
    }
    this.computedYears_.add(year);
    const easter = getEasterSunday(year);
    for (const [offset, name] of this.easterRelative_) {
      const date = new Date(year, easter.getMonth(), easter.getDate() + offset);
      this.holidays_.set(
        this.toKey_(date.getFullYear(), date.getMonth(), date.getDate()), name);
    }
  }

  toKey_(year, month, day) {
    return (year << 9) | (month << 5) | day;
  }

  fromKey_(key) {
    return [key >> 9, (key >> 5) & 0xf, key & 0x1f];
  }
}

export default LocalHolidays;

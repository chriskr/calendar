class LocalHolidays {
  /**
   * Takes a list of tuples, short date and name of a holiday. The year yyyy is
   * a place holder for any year.
   * E.g.
   *
   * [
   * ['01.01.yyyy', 'New Year\'s Day'],
   * ...
   * ['25.04.2011', 'Easter Monday'],
   * ...
   * ]
   * @param {Array} holidays - A list of short date and name tuples.
   *
   */
  constructor(holidays) {
    this.holidays_ = new Map(holidays.map(([date, name]) => {
      const [day, month, year] =
          date.split('.').map(i => i === 'yyyy' ? 0 : Number.parseInt(i, 10));
      return [this.toKey_(year, month - 1, day), name];
    }));
  }

  isHoliday(year, month, day) {
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
    const holidays = [];
    for (const [key, value] of this.holidays_) {
      const [keyYear, keyMonth, keyDay] = this.fromKey_(key);
      if ((keyYear === year || keyYear === 0) && keyMonth === month) {
        holidays.push([keyDay, value]);
      }
    }
    return holidays.sort((a, b) => a[0] - b[0]);
  }

  toKey_(year, month, day) {
    return (year << 9) | (month << 5) | day;
  }

  fromKey_(key) {
    return [key >> 9, (key >> 5) & 0xf, key & 0x1f];
  }
}

export default LocalHolidays;

import { createDom, render } from 'uldu';
import { getWeeksOfMonth } from './dateExtensions';
import { MONTH_NAMES, WEEK_DAYS_LONG, WEEK_DAYS_SHORT } from './ui_strings';
import { range, rotate, classes } from './utils';

const isToday = (today, year, month, day) =>
  today.year === year && today.month === month && today.date === day;

const INDEX_SUNDAY = 6;
const isHoliday = (index, holidays, year, month, day) =>
  index === INDEX_SUNDAY || holidays.isHoliday(year, month, day);

class Calendar {
  static getToday() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const day = d.getDay();
    return { year, month, date, day };
  }

  constructor(holidays) {
    this.holidays_ = holidays;
    this.today_ = Calendar.getToday();
    this.year_ = this.today_.year;
    this.element_ = null;
  }

  onChange() {}

  destroy() {
    if (this.element_) {
      this.element_.remove();
      this.element_.removeEventListener('click', this.clickHandler_);
    }
    this.clickHandler_ = null;
    this.element_ = null;
    this.holidays_ = null;
    this.today_ = null;
    this.year_ = null;
  }

  getElement() {
    if (this.element_ === null) {
      this.clickHandler_ = this.clickHandler_.bind(this);
      this.element_ = createDom(
        Calendar.Templates.calendar(this.year_, this.today_, this.holidays_)
      );
      this.element_.addEventListener('click', this.clickHandler_);
    }
    return this.element_;
  }

  clickHandler_(event) {
    const element = event.target.closest('[data-handler]');
    if (element !== null) {
      const delta = element.dataset.handler === 'next-year' ? 1 : -1;
      this.year += delta;
      this.updateView_();
      this.onChange();
    }
  }

  get year() {
    return this.year_;
  }

  set year(year) {
    this.year_ = year;
  }

  updateView_() {
    if (this.element_ === null) {
      return;
    }
    this.element_.querySelector('section').remove();
    render(
      Calendar.Templates.year(this.year_, this.today_, this.holidays_),
      this.element_
    );
  }

  rerender() {
    this.today_ = Calendar.getToday();
    //this.year_ = this.today_.year;
    this.updateView_();
  }
}

Calendar.Templates = class {
  static calendar(year, today, holidays) {
    return [
      'div',
      { class: 'calendar' },
      this.today(today),
      this.year(year, today, holidays),
    ];
  }

  static today(today) {
    const todayStr = [
      WEEK_DAYS_LONG[today.day],
      MONTH_NAMES[today.month],
      String(today.date),
    ].join(' ');

    return [
      'header',
      [
        'span',
        { 'data-handler': 'previous-year' },
        ['i', { class: 'material-icons' }, 'chevron_left'],
      ],
      ['h1', todayStr],
      [
        'span',
        { 'data-handler': 'next-year' },
        ['i', { class: 'material-icons' }, 'chevron_right'],
      ],
    ];
  }

  static year(year, today, holidays) {
    const tables = Array.from(range(12)).map((month) =>
      this.month(year, month, today, holidays)
    );

    return ['section', ...tables];
  }

  static month(year, month, today, holidays) {
    const weeksOfMonth = getWeeksOfMonth(year, month);
    const weekDays = rotate(WEEK_DAYS_SHORT, 1);
    const weekLabels = weekDays.map((wday) => ['th', wday]);
    const weekRows = weeksOfMonth.map((week) =>
      this.week(year, month, week, today, holidays)
    );
    const holidaysList = this.holidays(year, month, holidays);

    return [
      'div',
      [
        'table',
        [
          'caption',
          ['span', { class: 'month-name' }, MONTH_NAMES[month]],
          ['span', { class: 'year-number' }, String(year)],
        ],
        ['thead', ['tr', ['th', 'Week'], ...weekLabels]],
        ['tbody', ...weekRows],
        holidaysList.length === 0
          ? []
          : ['tfoot', ['tr', ['td', { colspan: '8' }, holidaysList]]],
      ],
    ];
  }

  static week(year, month, week, today, holidays) {
    const [weekNumber, weekDays] = week;
    const weekRow = weekDays.map((day, index) => {
      const className = classes(
        isToday(today, year, month, day) && 'today',
        isHoliday(index, holidays, year, month, day) && 'holiday'
      );
      return ['td', { class: className }, day > 0 ? String(day) : ''];
    });

    return [
      'tr',
      ['td', ['span', { class: 'week-number' }, String(weekNumber)]],
      ...weekRow,
    ];
  }

  static holidays(year, month, holidays) {
    const holidaysOfMonth = holidays.getHolidays(year, month);

    return holidaysOfMonth.length === 0
      ? []
      : [
          'ul',
          { class: 'holidays' },
          ...holidaysOfMonth.map(([day, name]) => ['li', `${day}. ${name}`]),
        ];
  }
};

export default Calendar;

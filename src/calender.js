'use strict';

class Calendar {
  static get WEEK_DAYS_SHORT() {
    return [
      'Su',
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
    ];
  }

  static get WEEK_DAYS_LONG() {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
  }

  static get MONTH_NAMES() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }

  static getToday() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const day = d.getDay();
    return {year, month, date, day};
  }

  constructor() {
    this.currentYear_ = new Date().getFullYear();
  }

  get currentYear() {
    return this.currentYear_;
  }

  set currentYear(year) {
    this.currentYear_ = year;
  }
}

Calendar.Templates = class {
  static year(year, today, holidays) {
    return [
      this.today(today),
      [
        'section',
        ...Array.from(Utils.range(12))
            .map(month => this.month(year, month, today, holidays))
      ],
    ];
  }

  static today(today) {
    return [
      'header',
      ['span', {'data-handler': 'previous-year'}, '<'],
      [
        'h1',
        `${Calendar.WEEK_DAYS_LONG[today.day]}` +
            ` ${Calendar.MONTH_NAMES[today.month]} ${today.date}`
      ],
      ['span', {'data-handler': 'next-year'}, '>'],
    ];
  }

  static month(year, month, today, holidays, withWeekNubers = true) {
    const weeksOfMonth = Date.getWeeksOfMonth(year, month);
    const table = ['table'];

    table.push([
      'caption',
      ['span', {'class': 'month-name'}, Calendar.MONTH_NAMES[month]],
      ['span', {'class': 'year-number'}, String(year)],
    ]);

    const headRow = [];
    if (withWeekNubers) {
      headRow.push(['th', 'Week']);
    }
    const weekDays = Utils.rotate(Calendar.WEEK_DAYS_SHORT, 1);
    headRow.push(...weekDays.map(wday => ['th', wday]));
    table.push(['thead', ['tr', ...headRow]]);

    table.push([
      'tbody',
      ...weeksOfMonth.map(week => this.week(year, month, week, today, holidays))
    ]);

    table.push(this.holidays(year, month, holidays));

    return table;
  }

  static week(year, month, week, today, holidays, withWeekNubers = true) {
    const INDEX_SUNDAY = 6;
    const [weekNumber, weekDays] = week;
    const tr = ['tr'];
    if (withWeekNubers) {
      tr.push(['td', ['span', {'class': 'week-number'}, String(weekNumber)]]);
    }
    tr.push(...weekDays.map((day, index) => {
      const isToday =
          today.year === year && today.month === month && today.date === day;
      const isHoliday =
          index === INDEX_SUNDAY || holidays.isHoliday(year, month, day);
      const className =
          `${isToday ? 'today' : ''} ${isHoliday ? 'holiday' : ''}`.trim();
      return ['td', {'class': className}, day > 0 ? String(day) : ''];
    }));
    return tr;
  }

  static holidays(year, month, holidays, withWeekNubers = true) {
    const holidaysOfMonth = holidays.getHolidays(year, month);

    if (holidaysOfMonth.length === 0) {
      return [];
    }

    return [
      'tfoot',
      [
        'tr',
        [
          'td', {'colspan': withWeekNubers ? '8' : '7'},
          [
            'ul', {'class': 'holidays'},
            ...holidaysOfMonth.map(([day, name]) => ['li', `${day}. ${name}`])
          ]
        ]
      ]
    ];
  }
}

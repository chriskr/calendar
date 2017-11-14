'use strict';

window.onload =
    function() {
  const calendar = new Calendar();
  const holidays = new Holidays(window.localizedHolidays.norway);
  const updateView = () =>
      document.body.cleanAppendTemplate(Calendar.Templates.year(
          calendar.currentYear, Calendar.getToday(), holidays));
  updateView();
  setInterval(updateView, 1000 * 60);
  document.addEventListener('click' , event => {
    const element = event.target.closest('[data-handler]');
    if (element !== null) {
      switch (element.dataset.handler) {
        case 'next-year':
          calendar.currentYear++;
          updateView();
          break;

        case 'previous-year':
          calendar.currentYear--;
          updateView();
          break;
      }
    }
  });
}

window.xonload = function() {
  const calendar = new Calendar();
  const holidays = new Holidays(window.localizedHolidays.norway);
  const updateView = year => document.body.appendTemplate(
      Calendar.Templates.year(year, Calendar.getToday(), holidays));
  const year = calendar.currentYear;
  for (let i = year; i < year + 100; i++) {
    updateView(i);
  }
}
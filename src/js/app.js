import Calendar from './calender';
import LocalHolidays from './LocalHolidays';
import localHolidaysNorway from './localHolidaysNorway';

class App {
  render(container, header) {
    const holidays = new LocalHolidays(localHolidaysNorway);
    const calendar = new Calendar(holidays);
    container.appendChild(calendar.getElement());
    calendar.onChange = () =>
      (header.textContent = `Calendar ${calendar.year}`);
    calendar.onChange();
    setInterval(() => calendar.rerender(), 60 * 1000);
  }
}

export default App;

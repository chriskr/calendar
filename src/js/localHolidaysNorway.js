const localHolidaysNorway = [
  ['01.01.yyyy', "New Year's Day"],
  ['01.05.yyyy', 'Labor Day'],
  ['17.05.yyyy', 'Constitution Day'],
  ['25.12.yyyy', 'Christmas Day'],
  ['26.12.yyyy', 'Second Day of Christmas'],

  // Relative to Easter Sunday. Easter Sunday and Pentecost Sunday are
  // holidays too, but always on a Sunday anyway.
  ['easter-3', 'Maundy Thursday'],
  ['easter-2', 'Good Friday'],
  ['easter+1', 'Easter Monday'],
  ['easter+39', 'Ascension Day'],
  ['easter+50', 'Pentecost Monday'],
];

export default localHolidaysNorway;

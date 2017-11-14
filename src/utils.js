'use strict';

class Utils {
  static * range(end, start = 0, iter = 1) {
    for (let i = start; i < end; i += iter) {
      yield i;
    }
  }

  static rotate(iterable, delta) {
    const l = iterable.length;
    return Array.from(this.range(l)).map(i => iterable[(i + delta) % l]);
  }
}
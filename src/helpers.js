import fecha from 'fecha';

export default {
  getNextDate(datesOrRangeArray, referenceDate) {
    var reference = new Date(referenceDate);
    var closest = Infinity;

    datesOrRangeArray.forEach(dateOrRange => {
      if (this.isDayInRange(reference, dateOrRange))
        return reference;
      const date = new Date(dateOrRange.start || dateOrRange); // use range start (if it's a range), or the value itself (if it's a Date or String)
      if (this.compareDay(date, reference) == 0)
        return reference; // stop parsing: we won't find a better candidate
      if (date >= reference && date < closest)
        closest = date;
    });

    if (closest === Infinity) return null;
    return closest;
  },

  compareDay(day1, day2) {
    if (!day1 || !day2) return null;

    const date1 = fecha.format(new Date(day1), 'YYYYMMDD');
    const date2 = fecha.format(new Date(day2), 'YYYYMMDD');

    if (date1 > date2) return 1;
    if (date1 == date2) return 0;
    if (date1 < date2) return -1;
  },

  isDayInRange(day, range) {
    if (!day || !range.start || !range.end) return null;
    return this.compareDay(day, range.start) >= 0 && this.compareDay(day, range.end) <= 0;
  },

  isRangeObject(object) {
    return typeof object === 'object' && object !== null && object.start && object.end;
  },

  countDays(start, end) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(start);
    const secondDate = new Date(end);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  },

  addDays(date, quantity) {
    let result = new Date(date);
    result.setDate(result.getDate() + quantity);
    return result;
  },

  getFirstDay(date, firstDayOfWeek) {
    var firstDay =  this.getFirstDayOfMonth(date);
    var offset = 0;
    if (firstDayOfWeek > 0) {
      offset = firstDay.getDay() === 0 ? -7 + firstDayOfWeek : firstDayOfWeek;
    }
    return new Date(
      firstDay.setDate(
        firstDay.getDate()
        - (firstDay.getDay() - offset)
      )
    );
  },

  getFirstDayOfMonth(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(), 1
    );
  },

  getNextMonth(date) {
    let nextMonth;

    if (date.getMonth() == 11) {
      nextMonth = new Date(date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    return nextMonth;
  },

  pluralizedTranslation(i18nKey, count) {
    const translation = i18nKey[count === 1 ? 'one' : 'other'];
    return translation?.replace('%{count}', count);
  },

  swipeAfterScroll(direction) {
    if (this.screenSize !== 'desktop' && this.isOpen) {
      const swiperWrapper = document.getElementById('swiperWrapper');

      // If wrapper has vertical scroll
      if (swiperWrapper.scrollHeight > swiperWrapper.clientHeight) {
        if (swiperWrapper.scrollTop === (swiperWrapper.scrollHeight - swiperWrapper.offsetHeight)) {
          this.renderNextMonth();
        }
        else if (swiperWrapper.scrollTop === 0) {
          this.renderPreviousMonth();
        }
        else {
          return;
        }
      }
      else if (direction == 'up') {
        this.renderNextMonth();
      }
      else if (direction == 'down') {
        this.renderPreviousMonth();
      }
    }
  },

  handleTouchStart(evt) {
    this.xDown = evt.touches[0].clientX;
    this.yDown = evt.touches[0].clientY;
  },

  getMonthDiff(d1, d2) {
    d1 = new Date(d1);
    d2 = new Date(d2);
    const d1Y = d1.getFullYear();
    const d2Y = d2.getFullYear();
    const d1M = d1.getMonth();
    const d2M = d2.getMonth();
    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  },

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    this.xUp = evt.touches[0].clientX;
    this.yUp = evt.touches[0].clientY;

    let xDiff = this.xDown - this.xUp;
    let yDiff = this.yDown - this.yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        // swipe right
      } else {
        // swipe left
      }
    } else {
      if (yDiff > 0) {
        // swipe up
        this.swipeAfterScroll('up');
      } else {
        // swipe down
        this.swipeAfterScroll('down');
      }
    }
    this.xDown = null;
    this.yDown = null;
  },

  shortenString(arr, sLen) {
    let newArr = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  },
};

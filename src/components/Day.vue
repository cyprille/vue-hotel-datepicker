<template lang="pug">
  div
    .datepicker__tooltip(v-if='showTooltip' v-html='tooltipMessage')
    .datepicker__month-day(
      @click.prevent.stop='dayClicked(date)'
      @keyup.enter.prevent.stop='dayClicked(date)'
      :class='dayClass'
      :style='isToday ? currentDateStyle : ""'
      :tabindex="tabIndex"
    )
      .day-number {{ dayNumber }}
      .day-price(v-if='showPrice') {{ price }}
</template>

<script>
import Helpers from '../helpers.js';

export default {
  name: 'Day',

  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    i18n: {
      type: Object,
      required: true
    },
    disabledDatesForCheckIn: {
      type: Array,
      default: () => []
    },
    disabledDatesForCheckOut: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object
    },
    checkIn: {
      type: Date
    },
    checkOut: {
      type: Date
    },
    choosingCheckOut: {
      type: Boolean
    },
    hoveringDate: {
      type: Date
    },
    belongsToThisMonth: {
      type: Boolean
    },
    activeMonthIndex: {
      type: Number
    },
    date: {
      type: Date
    },
    dayNumber: {
      type: String
    },
    minCheckOutDate: {
      type: [Date, Number, String]
    },
    maxCheckOutDate: {
      type: [Date, Number, String]
    },
    hoveringTooltip: {
      default: true,
      type: Boolean
    },
    staticTooltipMessage: {
      default: null,
      type: String
    },
    currentDateStyle: {
      type: [Object, null, String],
      required: true
    },
    price: {
      type: [Number, String],
      default: null
    },
    minNights: {
      type: Number,
      default: null
    }
  },

  computed: {
    tabIndex() {
      if (
        !this.isOpen ||
        !this.belongsToThisMonth ||
        this.isDisabled
      ) {
        return -1;
      }
      return 0;
    },

    nightsCount() {
      return this.countDays(this.checkIn, this.date);
    },

    dynamicTooltipMessage() {
      if (this.choosingCheckOut) return this.pluralizedTranslation(this.i18n.nights, this.nightsCount);
      if (!this.minNights) return null;
      return this.pluralizedTranslation(this.i18n.minNights, this.minNights);
    },

    tooltipMessage() {
      return this.staticTooltipMessage || this.dynamicTooltipMessage;
    },

    showTooltip() {
      return this.options.hoveringTooltip
          && this.isHovered
          && this.isEnabled
          && this.belongsToThisMonth
          && this.tooltipMessage;
    },

    isHovered() {
      return this.compareDay(this.hoveringDate, this.date) == 0;
    },

    isToday() {
      return this.compareDay(new Date(), this.date) == 0;
    },

    isCheckInDay() {
      return this.compareDay(this.checkIn, this.date) == 0;
    },

    isCheckOutDay() {
      return this.compareDay(this.checkOut, this.date) == 0;
    },

    isInDisabledDates() {
      return this.disabledDates.some(dateOrRange =>
        this.isRangeObject(dateOrRange) ? this.isDayInRange(this.date, dateOrRange) : this.compareDay(this.date, dateOrRange) == 0
      );
    },

    isBeforeGlobalStartDate() {
      return this.compareDay(this.date, this.options.startDate) == -1;
    },

    isAfterGlobalEndDate() {
      return this.compareDay(this.date, this.options.endDate) == 1;
    },

    isBeforeCheckInDay() {
      if (!this.choosingCheckOut) return null;
      return this.compareDay(this.date, this.checkIn) == -1;
    },

    isBeforeMinCheckOutDate() {
      if (!this.choosingCheckOut) return null;
      return this.compareDay(this.date, this.minCheckOutDate) == -1;
    },

    isAfterMaxCheckOutDate() {
      if (!this.maxCheckOutDate) return null;
      return this.compareDay(this.date, this.maxCheckOutDate) == 1;
    },

    isMissingPrice() {
      return this.options.disableDatesWithoutPrice && !this.price;
    },

    hasDisabledDatesBeforeMinNightsThreshold() {
      const nextDay = this.addDays(this.date, 1);
      const nextDisabledDate = this.getNextDate(this.disabledDatesForCheckOut, nextDay);
      const minNightsThreshold = this.addDays(this.date, this.minNights);

      return this.isDayInRange(nextDisabledDate, {start: nextDay, end: minNightsThreshold});
    },

    isDisabled() {
      return this.isInDisabledDates
          || this.isBeforeGlobalStartDate
          || this.isAfterGlobalEndDate
          || this.isMissingPrice
          || this.isBeforeCheckInDay
          || (this.choosingCheckOut && this.isCheckInDay)
          || this.isBeforeMinCheckOutDate
          || this.isAfterMaxCheckOutDate
          || (!this.choosingCheckOut && this.hasDisabledDatesBeforeMinNightsThreshold);
    },

    isEnabled() {
      return !this.isDisabled;
    },

    isHighlighted() {
      if (!this.checkIn) return false;
      if (this.isAfterMaxCheckOutDate) return false;
      if (this.choosingCheckOut) return this.isDayInRange(this.date, {start: this.checkIn, end: this.hoveringDate});
      return this.isDayInRange(this.date, {start: this.checkIn, end: this.checkOut});
    },

    isCurrentCheckOutCandidate() {
      if (!this.choosingCheckOut) return false;
      if (!this.isHighlighted) return false;
      if (this.isCheckInDay) return false;
      return this.compareDay(this.date, Math.min(this.maxCheckOutDate, this.hoveringDate)) == 0;
    },

    forbidsCheckIn() {
      return this.disabledDatesForCheckIn.some(dateOrRange =>
        this.isRangeObject(dateOrRange) ? this.isDayInRange(this.date, dateOrRange) : this.compareDay(this.date, dateOrRange) == 0
      );
    },

    forbidsCheckOut() {
      return this.disabledDatesForCheckOut.some(dateOrRange =>
        this.isRangeObject(dateOrRange) ? this.isDayInRange(this.date, dateOrRange) : this.compareDay(this.date, dateOrRange) == 0
      );
    },

    dayClass() {
      if (!this.belongsToThisMonth) return this.cssClass('hidden');

      const classes = [this.cssClass(this.isDisabled ? 'disabled' : 'valid')];

      // Selection
      if (this.isHighlighted) classes.push(this.cssClass('selected'));
      if (this.isCheckInDay) classes.push(this.cssClass('first-day-selected'));
      if (this.isCheckOutDay || this.isCurrentCheckOutCandidate) classes.push(this.cssClass('last-day-selected'));

      // Half-days
      if (this.forbidsCheckIn) classes.push(this.cssClass('check-in-forbidden'));
      if (this.forbidsCheckOut) classes.push(this.cssClass('check-out-forbidden'));

      return classes.join(' ');
    },

    disabledDates() {
      return this.choosingCheckOut ? this.disabledDatesForCheckOut : this.disabledDatesForCheckIn;
    },

    showPrice() {
      return this.isEnabled || this.isCheckInDay;
    },
  },

  methods: {
    ...Helpers,

    dayClicked(date) {
      if (this.isEnabled)
        this.$emit('day-clicked', date);
    },

    cssClass(suffix) {
      return `datepicker__month-day--${suffix}`;
    },
  },
};
</script>

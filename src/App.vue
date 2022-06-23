<template lang="pug">
  .datepicker__wrapper(v-on-click-outside='clickOutside' @blur="clickOutside")
    .datepicker__close-button.-hide-on-desktop(v-if='isOpen' @click='hideDatepicker') ＋
    .datepicker__dummy-wrapper(:class="isOpen ? 'datepicker__dummy-wrapper--is-active' : ''")
      .datepicker__input(
        @click="toggleDatepicker"
        @keyup.enter.stop.prevent="toggleDatepicker"
        v-text="checkIn ? formatDate(checkIn) : i18n['check-in']"
        :tabindex="0"
      )
      .datepicker__input(
        @click="toggleDatepicker"
        @keyup.enter.stop.prevent="toggleDatepicker"
        v-text="checkOut ? formatDate(checkOut) : i18n['check-out']"
        :tabindex="1"
      )
    .datepicker__clear-button(tabindex="0" @click='clearSelection' v-if="showClearSelectionButton")
      svg(xmlns='http://www.w3.org/2000/svg' viewBox="0 0 68 68")
        path(d='M6.5 6.5l55 55M61.5 6.5l-55 55')

    .datepicker(:class='datepickerClass')
      .-hide-on-desktop
        .datepicker__dummy-wrapper.datepicker__dummy-wrapper--no-border(
          @click='toggleDatepicker' :class="isOpen ? 'datepicker__dummy-wrapper--is-active' : ''"
          v-if='isOpen'
        )
          .datepicker__input(
            v-text="checkIn ? formatDate(checkIn) : i18n['check-in']"
            tabindex="0"
          )
          .datepicker__input(
            v-text="checkOut ? formatDate(checkOut) : i18n['check-out']"
            tabindex="1"
          )
      .datepicker__inner
        .datepicker__header
          span.datepicker__month-button.datepicker__month-button--prev.-hide-up-to-tablet(
            @click='renderPreviousMonth'
            @keyup.enter.stop.prevent='renderPreviousMonth'
            :tabindex='isOpen ? 0 : -1'
          )
          span.datepicker__month-button.datepicker__month-button--next.-hide-up-to-tablet(
            @click='renderNextMonth'
            @keyup.enter.stop.prevent='renderNextMonth'
            :tabindex='isOpen ? 0 : -1'
          )
        .datepicker__months(v-if='screenSize == "desktop"' :class="paneStyleClass")
          div.datepicker__month(v-for='n in indexesOfMonthsToDisplay'  :key='n')
            p.datepicker__month-name(v-text='getMonth(months[activeMonthIndex+n].days[15].date)')
            .datepicker__week-row.-hide-up-to-tablet
              .datepicker__week-name(v-for='dayName in i18n["day-names"]') {{ dayName }}
            .square(
              v-for='day in months[activeMonthIndex+n].days'
              @mouseover='hoveringDate = day.date'
            )
              Day(
                :is-open="isOpen"
                :options="$props"
                :i18n="i18n"
                @day-clicked='handleDayClick($event)'
                :date='day.date'
                :choosingCheckOut='choosingCheckOut'
                :disabledDatesForCheckIn='disabledDatesForCheckIn'
                :disabledDatesForCheckOut='disabledDatesForCheckOut'
                :minCheckOutDate='minCheckOutDate'
                :maxCheckOutDate='maxCheckOutDate'
                :activeMonthIndex='activeMonthIndex'
                :hoveringDate='hoveringDate'
                :staticTooltipMessage='staticTooltipMessage'
                :dayNumber='getDay(day.date)'
                :belongsToThisMonth='day.belongsToThisMonth'
                :checkIn='checkIn'
                :checkOut='checkOut'
                :currentDateStyle='currentDateStyle'
                :price='getPrice(day.date)'
                :minNights='getMinNights(day.date)'
              )
        div(v-if='screenSize !== "desktop" && isOpen')
          .datepicker__week-row
            .datepicker__week-name(
              v-for='dayName in this.i18n["day-names"]'
              v-text='dayName'
            )
          .datepicker__months#swiperWrapper
            div.datepicker__month(
              v-for='(a, n) in months'
              :key='n'
            )
              p.datepicker__month-name(
                v-text='getMonth(months[n].days[15].date)'
              )
              .datepicker__week-row.-hide-up-to-tablet
                .datepicker__week-name(
                  v-for='dayName in i18n["day-names"]'
                  v-text='dayName'
                )
              .square(v-for='(day, index) in months[n].days'
                @mouseover='hoveringDate = day.date'
                @focus='hoveringDate = day.date'
                :key='index'
              )
                Day(
                  :is-open="isOpen"
                  :options="$props"
                  :i18n="i18n"
                  @day-clicked='handleDayClick($event)'
                  :date='day.date'
                  :choosingCheckOut='choosingCheckOut'
                  :disabledDatesForCheckIn='disabledDatesForCheckIn'
                  :disabledDatesForCheckOut='disabledDatesForCheckOut'
                  :minCheckOutDate='minCheckOutDate'
                  :maxCheckOutDate='maxCheckOutDate'
                  :activeMonthIndex='activeMonthIndex'
                  :hoveringDate='hoveringDate'
                  :staticTooltipMessage='staticTooltipMessage'
                  :dayNumber='getDay(day.date)'
                  :belongsToThisMonth='day.belongsToThisMonth'
                  :checkIn='checkIn'
                  :checkOut='checkOut'
                  :currentDateStyle='currentDateStyle'
                  :price='getPrice(day.date)'
                  :minNights='getMinNights(day.date)'
                )
            button.next--mobile(
              @click='renderNextMonth' type="button"
            )

</template>

<script>
import throttle from 'lodash.throttle';
import { directive as onClickOutside } from 'vue-on-click-outside';
import fecha from 'fecha';
import defaultI18n from './i18n.js';

import Day from './components/Day.vue';
import Helpers from './helpers.js';
import './assets/scss/main.scss';

export default {
  name: 'VueHotelDatePicker',

  directives: {
    'on-click-outside': onClickOutside
  },

  components: {
    Day,
  },

  props: {
    currentDateStyle: {
      type: [Object, null, String],
      default: () => ({ border: '1px solid #00c690' })
    },
    initialCheckIn: {
      default: null,
      type: [Date, String]
    },
    initialCheckOut: {
      default: null,
      type: [Date, String]
    },
    alwaysOpenOnDesktop: {
      type: Boolean,
      default: false
    },
    numberOfMonthsToDisplay: {
      type: Number,
      default: 2
    },
    format: {
      default: 'YYYY-MM-DD',
      type: String
    },
    startDate: {
      type: [Date, String],
      default: () => new Date()
    },
    endDate: {
      type: [Date, String],
      default: () => new Date(8640000000000000) // maximum date value
    },
    firstDayOfWeek: {
      default: 0,
      type: Number
    },
    disabledDates: {
      default: () => [],
      type: Array
    },
    hoveringTooltip: {
      default: true,
      type: Boolean
    },
    staticTooltipMessage: {
      default: null,
      type: String
    },
    customI18n: {
      default: null,
      type: Object
    },
    lang: {
      default: 'en',
      type: String
    },
    showYear: {
      default: false,
      type: Boolean
    },
    closeDatepickerOnClickOutside: {
      default: true,
      type: Boolean
    },
    displayClearButton: {
      default: true,
      type: Boolean
    },
    disableDatesWithoutPrice: {
      default: false,
      type: Boolean
    },
    priceDefault: {
      default: '',
      type: [Number, String, null]
    },
    priceByDate: {
      type: Array,
      default: () => []
    },
    minNightsByDate: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      hoveringDate: null,
      checkIn: this.initialCheckIn ? new Date(this.initialCheckIn) : null,
      checkOut: this.initialCheckOut ? new Date(this.initialCheckOut) : null,
      months: [],
      activeMonthIndex: 0,
      isOpen: window.innerWidth >= 768 ? this.alwaysOpenOnDesktop : false,
      xDown: null,
      yDown: null,
      xUp: null,
      yUp: null
    };
  },

  computed: {
    i18n() {
      const i18nStore = this.customI18n || defaultI18n;
      return i18nStore[this.lang] || i18n['en'];
    },
    showClearSelectionButton() {
      return Boolean(
        (this.checkIn || this.checkOut) && this.displayClearButton
      );
    },
    disabledDatesForCheckIn() {
      return this.disabledDates;
    },
    disabledDatesForCheckOut() {
      return this.disabledDates.map(dateOrRange => {
        if (this.isRangeObject(dateOrRange))
          return {
            start: this.addDays(dateOrRange.start, 1),
            end: this.addDays(dateOrRange.end, 1)
          };
        return this.addDays(dateOrRange, 1);
      });
    },
    choosingCheckOut() {
      return this.checkIn && !this.checkOut;
    },
    minCheckOutDate() {
      if (!this.checkIn) return null;
      return this.addDays(this.checkIn, this.getMinNights(this.checkIn));
    },
    maxCheckOutDate() {
      if (!this.choosingCheckOut) return null;
      const nextDisabledDate = this.getNextDate(this.disabledDatesForCheckOut, this.addDays(this.checkIn, 1));
      const maxDateValue = new Date(8640000000000000);
      return this.addDays(nextDisabledDate || maxDateValue, -1);
    },
    indexesOfMonthsToDisplay() {
      return Array.from(Array(this.numberOfMonthsToDisplay).keys());
    },
    paneStyleClass() {
      if (this.numberOfMonthsToDisplay === 1) return 'datepicker__months-singlepane';
      return 'datepicker__months-dualpane';
    },
    datepickerClass() {
      return `datepicker--${this.isOpen ? 'open' : 'closed'}`;
    },
    screenSize() {
      if (window.innerWidth < 480) return 'smartphone';
      if (window.innerWidth < 768) return 'tablet';
      return 'desktop'; // window.innerWidth >= 768
    },
    alwaysOpen() {
      if (this.alwaysOpenOnDesktop && this.screenSize === 'desktop') return true;
      return false;
    }
  },

  watch: {
    isOpen(value) {
      if (!value && this.alwaysOpen) { // Prevent setting isOpen to false
        this.isOpen = true;
        return;
      }

      if (!value) {
        this.$emit('closed', this);
      }

      if (this.screenSize !== 'desktop') {
        const bodyClassList = document.querySelector('body').classList;

        if (value) {
          bodyClassList.add('-overflow-hidden');
          this.$nextTick(() => {
            const swiperWrapper = document.getElementById('swiperWrapper');
            const monthEl = document.querySelector('.datepicker__month');
            const monthHeight = monthEl ? monthEl.offsetHeight : 1;
            swiperWrapper.scrollTop = this.activeMonthIndex * monthHeight;
          });
        } else {
          bodyClassList.remove('-overflow-hidden');
        }
      }
    },
    checkIn(newDate) {
      this.$emit('check-in-changed', newDate);
    },
    checkOut(newDate) {
      if (this.checkOut !== null && this.checkOut !== null) {
        this.hoveringDate = null;
        this.hideDatepicker();
      }

      this.$emit('check-out-changed', newDate);
    }
  },

  beforeMount() {
    fecha.i18n = {
      dayNames: this.i18n['day-names'],
      dayNamesShort: this.shortenString(this.i18n['day-names'], 3),
      monthNames: this.i18n['month-names'],
      monthNamesShort: this.shortenString(this.i18n['month-names'], 3),
      amPm: ['am', 'pm'],
      // D is the day of the month, function returns something like...  3rd or 11th
      DoFn: function(D) {
        return (
          D +
          ['th', 'st', 'nd', 'rd'][
            D % 10 > 3 ? 0 : ((D - (D % 10) !== 10) * D) % 10
          ]
        );
      }
    };
    if (
      this.checkIn &&
      (this.getMonthDiff(
        this.getNextMonth(new Date(this.startDate)),
        this.checkIn
      ) > 0 ||
        this.getMonthDiff(this.startDate, this.checkIn) > 0)
    ) {
      this.createMonth(new Date(this.startDate));
      const count = this.getMonthDiff(this.startDate, this.checkIn);
      let nextMonth = new Date(this.startDate);
      for (let i = 0; i <= count; i++) {
        let tempNextMonth = this.getNextMonth(nextMonth);
        this.createMonth(tempNextMonth);
        nextMonth = tempNextMonth;
      }
      if (this.checkOut && this.getMonthDiff(this.checkIn, this.checkOut) > 0) {
        this.createMonth(this.getNextMonth(nextMonth));
        this.activeMonthIndex = 1;
      }
      this.activeMonthIndex += count;
    } else {
      this.createMonth(new Date(this.startDate));
      this.createMonth(this.getNextMonth(new Date(this.startDate)));
    }
  },

  mounted() {
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
    window.addEventListener('resize', this.forceScreenSizeRecomputation);

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent();
    });
  },

  destroyed() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('resize', this.forceScreenSizeRecomputation);
  },
  methods: {
    ...Helpers,

    formatDate(date) {
      if (date) {
        return fecha.format(date, this.format);
      }
      return '';
    },

    forceScreenSizeRecomputation() {
      this._computedWatchers.screenSize.run();
      this._computedWatchers.alwaysOpen.run();
      this.isOpen = this.screenSize === 'desktop' ? this.alwaysOpenOnDesktop : false;
      this.$forceUpdate();
    },

    onElementHeightChange(el, callback) {
      let lastHeight = el.clientHeight;
      let newHeight = lastHeight;

      (function run() {
        newHeight = el.clientHeight;

        if (lastHeight !== newHeight) {
          callback();
        }

        lastHeight = newHeight;

        if (el.onElementHeightChangeTimer) {
          clearTimeout(el.onElementHeightChangeTimer);
        }

        el.onElementHeightChangeTimer = setTimeout(run, 1000);
      })();
    },

    emitHeighChangeEvent() {
      this.$emit('height-changed');
    },

    clearSelection() {
      this.isOpen = false;
      this.hoveringDate = null;
      this.checkIn = null;
      this.checkOut = null;
    },

    hideDatepicker() {
      if (!this.alwaysOpen) this.isOpen = false;
    },

    showDatepicker() {
      if (!this.alwaysOpen) this.isOpen = true;
    },

    toggleDatepicker() {
      if (!this.alwaysOpen) this.isOpen = !this.isOpen;
    },

    clickOutside() {
      if (this.closeDatepickerOnClickOutside && this.screenSize === 'desktop')
        this.hideDatepicker();
    },

    handleDayClick(date) {
      if (!this.checkIn) {
        this.checkIn = date;
      } else if (this.checkIn && !this.checkOut) {
        this.checkOut = date;
        this.isOpen = false;
      } else {
        this.checkOut = null;
        this.checkIn = date;
      }
    },

    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--;
      } else return;
    },

    renderNextMonth: throttle(function throttleRenderNextMonth() {
      if (this.activeMonthIndex < this.months.length - 2) {
        this.activeMonthIndex++;
        return;
      }

      let firstDayOfLastMonth;

      if (this.screenSize !== 'desktop') {
        firstDayOfLastMonth = this.months[this.months.length - 1].days.filter(
          day => day.belongsToThisMonth === true
        );
      } else {
        firstDayOfLastMonth = this.months[
          this.activeMonthIndex + 1
        ].days.filter(day => day.belongsToThisMonth === true);
      }

      if (this.compareDay(firstDayOfLastMonth[0].date, this.endDate) == 0)
        return;

      this.createMonth(this.getNextMonth(firstDayOfLastMonth[0].date));

      this.activeMonthIndex++;
    }, 200),

    getDay(date) {
      return fecha.format(date, 'D');
    },

    getMonth(date) {
      return (
        this.i18n['month-names'][fecha.format(date, 'M') - 1] +
        (this.showYear ? fecha.format(date, ' YYYY') : '')
      );
    },

    createMonth(date) {
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
      let month = {
        days: []
      };

      for (let i = 0; i < 42; i++) {
        month.days.push({
          date: this.addDays(firstDay, i),
          belongsToThisMonth:
            this.addDays(firstDay, i).getMonth() === date.getMonth(),
          isInRange: false
        });
      }
      this.months.push(month);
    },

    getPrice(date) {
      const currentRange = this.priceByDate.find(range => this.isDayInRange(date, range));
      return currentRange?.price || this.priceDefault;
    },

    getMinNights(date) {
      const currentRange = this.minNightsByDate.find(range => this.isDayInRange(date, range));
      return currentRange?.minNights || 1;
    },
  },
};
</script>

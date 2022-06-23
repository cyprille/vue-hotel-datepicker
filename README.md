[![Code Climate](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/gpa.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/)
[![Issue Count](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker/badges/issue_count.svg)](https://codeclimate.com/github/krystalcampioni/vue-hotel-datepicker)
[![dependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker) [![devDependencies Status](https://david-dm.org/krystalcampioni/vue-hotel-datepicker/dev-status.svg)](https://david-dm.org/krystalcampioni/vue-hotel-datepicker?type=dev)
[![npm](https://img.shields.io/npm/dt/vue-hotel-datepicker.svg)](vue-hotel-datepicker)
[![Build Status](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker.svg?branch=master)](https://travis-ci.org/krystalcampioni/vue-hotel-datepicker)

# vue-hotel-datepicker
A responsive date range picker for Vue.js that displays the number of nights selected and allow several useful options like custom check-in/check-out rules, localisation support and more.


![demo gif](https://github.com/krystalcampioni/vue-hotel-datepicker/blob/master/demo.gif?raw=true)



## Demo
[https://krystalcampioni.github.io/vue-hotel-datepicker/](https://krystalcampioni.github.io/vue-hotel-datepicker/)

## Installation

#### NPM

Install the package:

```
npm install vue-hotel-datepicker --save
```

```javascript
import HotelDatePicker from 'vue-hotel-datepicker'

export default {
  components: {
    HotelDatePicker,
  },
}
```

```html
<HotelDatePicker />
```


## Props/Options

### format

- Type: `String`
- Default: `YYYY-MM-DD`

The date format string.

### startDate

- Type: `Date` or `String`
- Default: `new Date()`

The start view date. All the dates before this date will be disabled.

### endDate

- Type: `Date` or `String` or `Boolean`
- Default: `false`

The end view date. All the dates after this date will be disabled.

### initialCheckIn

- Type: `Date`
- Default: `null`

The initial check-in date (as if the user selected it).

### initialCheckOut

- Type: `Date`
- Default: `null`

The initial check-out date (as if the user selected it).

### alwaysOpenOnDesktop

- Type: `Boolean`
- Default: `false`

If true calendar is always open on desktop-size screens.

### numberOfMonthsToDisplay

- Type: `Number`
- Default: `2`

Number of months displayed (only `1` and `2` are supported values).

### firstDayOfWeek

- Type: `Number`
- Default: `0`

The first day of the week. Where Sun = 0, Mon = 1, ... Sat = 6.

You need to set the right order in `i18n.day-names` too.

### minNightsByDate

- Type: `Array`
- Default: `[]`

Minimum nights required to select a range of dates, by date range.

Example:

```js
[
  {start: '2021-01-01', end: '2021-06-30', minNights: 1},
  {start: '2021-07-01', end: '2021-08-31', minNights: 7},
  {start: '2021-09-01', end: '2021-12-31', minNights: 1}
]
```

### disabledDates

- Type: `Array`
- Default: `[]`

An array of mixed:
- `Date` objects
- strings in `YYYY-MM-DD` format
- ranges in format (values can be either `Date` objects or string in `YYYY-MM-DD` format):

    ```js
    {
      start: new Date(),
      end: 'YYYY-MM-DD'
    }
    ```

All the dates passed to the list (or in ranges passed to this list) will be disabled.

### hoveringTooltip

- Type: `Boolean` or `Function`
- Default: `true`

Shows a tooltip with the number of nights when hovering a date.

### staticTooltipMessage

- Type: `String`
- Default `null`

If provided, it will override the default tooltip ("X nights min." when choosing check-in, "X nights" when choosing check-out) with the text provided. You can use HTML in the string.

## showYear

- Type `boolean`
- Default `false`

Shows the year next to the month

## closeDatepickerOnClickOutside
- Type: `boolean`
- Default: `true`

## displayClearButton
- Type: `boolean`
- Default: `true`

If set to true, displays a clear button on the right side of the input if there are dates set

## disableDatesWithoutPrice

- Type: `boolean`
- Default: `false`

Is set to true, all dates not matching a price range in `priceByDate` will be disabled.

### customI18n

- Type: `Object`

Default:

```js
{
  en: {
    nights: { one: '%{count} night', other: '%{count} nights' },
    minNights: { one: '%{count} night minimum', other: '%{count} nights minimum' },
    'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    'check-in': 'Check-in',
    'check-out': 'Check-out',
    'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  fr: {
    nights: { one: '%{count} nuit', other: '%{count} nuits' },
    minNights: { one: '%{count} nuit minimum', other: '%{count} nuits minimum' },
    'check-in': 'Arrivée',
    'check-out': 'Départ',
    'day-names': ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    'month-names': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  }
}
```

I18n object with multiple languages that completely overrides the default one (see `src/i18n.js`).

### lang

- Type: `String`
- Default: `'en'`

Language code to access translation in the (default or custom) i18n object.

## API
⚠️ In order to open/close the datepicker from an external element, such as a button make sure to set `closeDatepickerOnClickOutside` to false

### hideDatepicker()

Hide datepicker

### showDatepicker()

Show datepicker

### toggleDatepicker()

Toggle datepicker

## Events

### checkInChanged
Emitted every time a new check in date is selected with the new date as payload

### checkOutChanged
Emitted every time a new check out date is selected with the new date as payload

## Credits
This component was originally built as a Vue wrapper component for the [Hotel Datepicker](https://github.com/benitolopez/hotel-datepicker) by @benitolopez. Version 2.0.0 was completely rewritten with Vue, removing the original library, removing some features and introducing others.

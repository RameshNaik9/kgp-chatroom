// src/utils/dateUtils.js

import moment from 'moment';

export const formatDateLabel = (date) => {
  const today = moment();
  const yesterday = moment().subtract(1, 'days');

  if (moment(date).isSame(today, 'day')) {
    return "Today";
  } else if (moment(date).isSame(yesterday, 'day')) {
    return "Yesterday";
  } else {
    return moment(date).format("MMMM D, YYYY");
  }
};

export const getDateLabel = (currentDate, previousDate) => {
  if (!previousDate) {
    return formatDateLabel(currentDate);
  }

  const currentMoment = moment(currentDate);
  const previousMoment = moment(previousDate);

  if (currentMoment.isSame(previousMoment, 'day')) {
    return null;
  }

  return formatDateLabel(currentDate);
};

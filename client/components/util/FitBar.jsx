import React from 'react';

const getClass = (number, average) => {
  let result = 'fit-border ';
  if (number <= 11 && (average - 1) * 25 <= 11) {
    result = 'fit-slider';
  } else if (number >= 90 && (average - 1) * 25 >= 90) {
    result = 'fit-slider';
  } else if (Math.abs(number - ((average - 1) * 25)) <= 5) {
    result = 'fit-slider';
  } else if (number % 50 === 1) {
    result += 'fit-border fit-border-left';
  } else if (number % 50 === 0 || number % 25 === 0) {
    result += 'fit-border fit-border-right';
  }
  return result;
};

const FitBar = (props) => {
  const classes = { ...props };
  const numbers = Array.from({ length: 100 }, (v, k) => k + 1);
  return (
    <span id="fit-bar">
      {numbers.map((number, index) => (
        <div
          key={numbers[index]}
          className={getClass(number, classes.average)}
        />
      ))
      }
    </span>
  );
};

export default FitBar;

const dayjs = require('./day');

// 修改console.log
const cl = console.log;
console.log = function () {
  cl(dayjs().format('YYYY-MM-DD HH:mm:ss Z'), ...arguments);
};

// 修改console.info
const ci = console.info;
console.info = function () {
  ci(dayjs().format('YYYY-MM-DD HH:mm:ss Z'), ...arguments);
};

// 修改console.warn
const cw = console.warn;
console.warn = function () {
  cw(dayjs().format('YYYY-MM-DD HH:mm:ss Z'), ...arguments);
};

// 修改console.error
const ce = console.error;
console.error = function () {
  ce(dayjs().format('YYYY-MM-DD HH:mm:ss Z'), ...arguments);
};

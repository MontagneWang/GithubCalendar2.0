const dayjs = require('dayjs');
require('dayjs/locale/zh-cn');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('zh-cn');

dayjs.tz.setDefault('Asia/Shanghai');

module.exports = dayjs;

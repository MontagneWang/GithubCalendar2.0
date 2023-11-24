const router = require('koa-router')();
const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const config = require('../../config/config');

router.prefix('/api');

router.get('/githubcalendar/api', async (ctx, next) => {
  const user = Object.keys(ctx.request.query)[0];
  if (!user) {
    return;
  }
  // 读取缓存
  let data = global.cacheLRU.get(`githubcalendar:${user}`);
  if ((data ?? '') !== '') {
    return (ctx.body = data);
  }

  data = await getdata(user);
  //   console.log(data);
  // 获取成功,设置缓存
  if (data.code === 200) {
    global.cacheLRU.set(`githubcalendar:${user}`, data, {
      ttl: config.githubcalendar ? config.githubcalendar : 1000 * 60 * 10 //缓存时间(ms)
    });
  }

  ctx.body = data;
  //   console.log(name);
});


// async function getdata(name) {
//   // 忽略证书
//   const agent = new https.Agent({
//     rejectUnauthorized: false
//   });
//   let { data: res } = await axios
//     .get('https://github.com/' + name, { httpsAgent: agent })
//     .catch(err => err);

//   if (!res) {
//     return {
//       total: 0,
//       contributions: [],
//       code: 201,
//       message: '请求失败'
//     };
//   }

//   //   console.log(res);
//   const $ = cheerio.load(res);
//   const data = $('#user-profile-frame > div > div.mt-4.position-relative > div.js-yearly-contributions > div > div > div > div:nth-child(1)  table > tbody > tr');

//   let contributions = [];
//   let total = 0;
//   for (let i = 0; i < data.length; i++) {
//     const data2 = $(data[i]).children('td');
//     for (let j = 0; j < data2.length; j++) {
//       // console.log($(data2[j]).attr('data-date'));
//       //   console.log($(data2[j]).attr('data-level'));

//       let count = $(data2[j])
//         .text()
//         .replace(/^(.*) contribution(.*)$/, '$1');
//       count = count === 'No' ? 0 : Number(count);

//       if (!isNaN(count) && $(data2[j]).attr('data-date')) {
//         total += count;
//         contributions.push({
//           date: $(data2[j]).attr('data-date'),
//           count: count
//         });
//       }
//     }
//   }
//   const sortedData = contributions.sort((a, b) => {
//     const dateA = dayjs(a.date);
//     const dateB = dayjs(b.date);
//     return dateA - dateB;
//   });

//   return {
//     total: total,
//     contributions: list_split(sortedData, 7),
//     code: 200,
//     message: 'ok'
//   };
// }

async function getdata(name) {
  // 忽略证书
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  const url = 'https://github.com/' + name;

  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const { total, contributions } = parseData(data);
        resolve({
          total,
          contributions,
          code: 200,
          message: 'ok'
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        total: 0,
        contributions: [],
        code: 201,
        message: '请求失败'
      });
    });
  });
}

function parseData(html) {
  const data = extractData(html);
  const contributions = [];
  let total = 0;

  for (let i = 0; i < data.length; i++) {
    const data2 = data[i].children;
    for (let j = 0; j < data2.length; j++) {
      let count = data2[j].textContent;
      count = count === 'No' ? 0 : Number(count);

      if (!isNaN(count) && data2[j].getAttribute('data-date')) {
        total += count;
        contributions.push({
          date: data2[j].getAttribute('data-date'),
          count: count
        });
      }
    }
  }

  const sortedData = contributions.sort((a, b) => {
    const dateA = dayjs(a.date);
    const dateB = dayjs(b.date);
    return dateA - dateB;
  });

  return {
    total,
    contributions: list_split(sortedData, 7)
  };
}

function extractData(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('#user-profile-frame > div > div.mt-4.position-relative > div.js-yearly-contributions > div > div > div > div:nth-child(1) table');
  const rows = table.querySelectorAll('tbody tr');
  const data = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    data.push(row);
  }

  return data;
}

function list_split(items, n) {
  let result = [];
  for (let i = 0, len = items.length; i < len; i += n) {
    result.push(items.slice(i, i + n));
  }
  return result;
}

module.exports = router;

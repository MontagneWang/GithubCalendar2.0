const router = require("koa-router")();
const axios = require("axios");
const https = require("https");
const cheerio = require("cheerio");
const dayjs = require("dayjs");
const config = require("../../config/config");

router.prefix("/api");

router.get("/githubcalendar/api", async (ctx, next) => {
  const user = Object.keys(ctx.request.query)[0];
  if (!user) {
    return;
  }
  // 读取缓存
  let data = global.cacheLRU.get(`githubcalendar:${user}`);
  if ((data ?? "") !== "") {
    return (ctx.body = data);
  }

  data = await getdata(user);
  //   console.log(data);
  // 获取成功,设置缓存
  if (data.code === 200) {
    global.cacheLRU.set(`githubcalendar:${user}`, data, {
      ttl: config.githubcalendar ? config.githubcalendar : 1000 * 60 * 10, //缓存时间(ms)
    });
  }

  ctx.body = data;
  //   console.log(name);
});

async function getdata(name) {
  // 忽略证书
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  let { data: res } = await axios
    .get("https://github.com/" + name, { httpsAgent: agent })
    .catch((err) => err);

  console.log("通过url获取的数据");
  console.log(res);

  if (!res) {
    return {
      total: 0,
      contributions: [],
      code: 201,
      message: "请求失败",
    };
  }

  //   console.log(res);
  const $ = cheerio.load(res);
  const data = $(
    "#user-profile-frame > div > div.mt-4.position-relative > div.js-yearly-contributions > div > div > div > div:nth-child(1)  table > tbody > tr"
  );

  console.log("通过css选择器后筛选的数据");
  console.log(data);

  let contributions = [];
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const data2 = $(data[i]).children("td");

    console.log("筛选的td数据");
    console.log(data2);

    for (let j = 0; j < data2.length; j++) {
      // console.log($(data2[j]).attr('data-date'));
      // console.log($(data2[j]).attr('data-level'));

      let count = $(data2[j])
        .text()
        .replace(/^(.*) contribution(.*)$/, "$1");

      console.log("正则筛选后的数据");
      console.log(count);

      count = count === "No" ? 0 : Number(count);

      console.log("类型转换后的数据");
      console.log(count);

      if (!isNaN(count) && $(data2[j]).attr("data-date")) {
        total += count;

        console.log("写入贡献的每天数据");
        console.log({
          date: $(data2[j]).attr("data-date"),
          count: count,
        });

        contributions.push({
          date: $(data2[j]).attr("data-date"),
          count: count,
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
    total: total,
    contributions: list_split(sortedData, 7),
    code: 200,
    message: "ok",
  };
}

function list_split(items, n) {
  let result = [];
  for (let i = 0, len = items.length; i < len; i += n) {
    result.push(items.slice(i, i + n));
  }
  return result;
}

module.exports = router;

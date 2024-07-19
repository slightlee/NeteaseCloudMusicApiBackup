// 歌曲链接 - v1
// 此版本不再采用 br 作为音质区分的标准
// 而是采用 standard, exhigh, lossless, hires, jyeffect(高清环绕声), sky(沉浸环绕声), jymaster(超清母带) 进行音质判断

const createOption = require('../util/option.js')
// module.exports = (query, request) => {
//   const data = {
//     ids: '[' + query.id + ']',
//     level: query.level,
//     encodeType: 'flac',
//   }
//   if (data.level == 'sky') {
//     data.immerseType = 'c51'
//   }
//   return request(
//     'POST',
//     `/api/song/enhance/player/url/v1`,
//     data,
//     createOption(query),
//   )
// }

const crypto = require('crypto')
const match = require('@unblockneteasemusic/server')

module.exports = async (query, request) => {
  const data = {
    ids: '[' + query.id + ']',
    level: query.level,
    encodeType: 'flac',
  }

  if (data.level == 'sky') {
    data.immerseType = 'c51'
  }

  const res = await request(
    'POST',
    `/api/song/enhance/player/url/v1`,
    data,
    createOption(query),
  )

  const result = res.body.data
  const song = result[0]

  // 把url地址为空的、VIP可听/所在专辑需单独付费，就添加魔法
  // https://github.com/Binaryify/NeteaseCloudMusicApi/issues/899#issuecomment-680002883
  if (!song.url || [1, 4].includes(song.fee)) {
    const source = query.source || 'migu'
    const { url } = await match(query.id, [source]) // 这里只设置一个源，避免多个产生随机选择问题
    song.url = url
  }

  return res
}

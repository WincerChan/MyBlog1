'use strict';

hexo.extend.tag.register('netease', (args) => {
  let musicId = args.shift();
  const musicStr = 'musicid=',
    APIPrefix="https://blog.itswincer.com/music/v1/?id=";
  if (musicId.startsWith(musicStr)) {
    musicId = musicId.slice(musicStr.length);
    console.log(`<iframe id="music" frameborder="no" width="100%" height="0" src="${APIPrefix}${musicId}"></iframe>`)
    return `<iframe id="music" frameborder="no" width="100%" height="0" src="${APIPrefix}${musicId}"></iframe>`;
  }
  return null;
})

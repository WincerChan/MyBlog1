'use strict';

hexo.extend.tag.register('netease', (args) => {
  let musicId = args.shift();
  const musicStr = 'musicid=',
    APIPrefix="https://blog.itswincer.com/music/v1/?id=";
  if (musicId.startsWith(musicStr)) {
    musicId = musicId.slice(musicStr.length);
    return `<iframe id="music" frameborder="no" width="100%" height="0" src="${APIPrefix}${musicId}"></iframe>`;
  }
  return null;
})

hexo.extend.tag.register('gist', args => {
  let User = args.shift(),
    GistId = args.shift(),
    APIPrefix='https://blog.itswincer.com/gist/v1/?user=';
  let iframe = `<iframe style="height: 0;" frameborder="0" name=${User} id="displayGist" width="100%" data-src="${APIPrefix}${User}&gist=${GistId}"></iframe>`;
  iframe += `<button onclick="let frame = document.querySelector('#displayGist');frame.src=''+frame.getAttribute('data-src')">Click me to load GIST</button>`;
  return iframe;
})


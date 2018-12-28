'use strict';

hexo.extend.tag.register('netease', (args) => {
  let musicId = args.shift();
  const musicStr = 'musicid=',
    APIPrefix="https://api.itswincer.com/music/v1/";
  if (musicId.startsWith(musicStr)) {
    musicId = musicId.slice(musicStr.length);
    return `<div id="aplayer" musicid="${musicId}"></div><script src="${APIPrefix}" async></script>`;
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

hexo.extend.filter.register('after_post_render', (data) => {
  if (data.mathrender) {
      data.content = data.content.replace(/\$\$(.+?)\$\$/g, '</p><div class="mathrender" style="overflow-x: scroll;padding: .75rem 1rem .2rem 1rem;border: 1px solid #eaecee;border-radius: 3px;">' + '$1' + '</div><p>');
      data.content = data.content.replace(/\$(.+?)\$/g, '<span class="mathrender">' + '$1' + '</span>');
  }
})

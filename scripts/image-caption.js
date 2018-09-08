

function extractAllText(str){
  const re = /href="(.*?)"\ class="headerlink"/g;
  const result = [];
  let current;
  while (current = re.exec(str)) {
    result.push(current.pop());
  }
  return result.length > 0
    ? result
    : [str];
}

hexo.extend.filter.register('after_post_render', function(data){
  if (hexo.config.image_caption && hexo.config.image_caption.enable === true) {
    var className = hexo.config.image_caption.class_name || 'image-caption';
    if (data.layout == 'post' || data.layout == 'page' || data.layout == 'about') {
      data.content = data.content.replace(/(<img [^>]*alt="([^"]+)"[^>]*>)/g, '$1' + '<figure style="font-size: 14px; color: #747474; text-align: center" class="' + className + '">$2</figure>')
    }
    if (data.layout == 'post') {
      var all = extractAllText(data.content);
      all.forEach(element => {
        data.content = data.content.replace(element, data.path+element)
      });
      console.log(all)
    }
  }
})

hexo.extend.filter.register('before_post_render', function(data) {
  // console.log(data.permalink)
  // console.log(data.path)
  // console.log(data.slug)
})
hexo.extend.filter.register('after_post_render', function(data){
  if (hexo.config.image_caption && hexo.config.image_caption.enable === true) {
    var className = hexo.config.image_caption.class_name || 'image-caption';
    if (data.layout == 'post' || data.layout == 'page' || data.layout == 'about') {
      data.content = data.content.replace(/(<img [^>]*alt="([^"]+)"[^>]*>)/g, '$1' + '<figure style="font-size: 14px; color: #747474; text-align: center" class="' + className + '">$2</figure>')
    }
  }
})

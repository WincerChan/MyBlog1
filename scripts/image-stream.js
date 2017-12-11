'use strict';

var config = {
    'jquery': '//cdn.bootcss.com/jquery/2.1.0/jquery.min.js',
    'jquery_lazyload': '//cdn.bootcss.com/jquery.lazyload/1.9.1/jquery.lazyload.min.js',
    'img_placeholder': 'http://ww4.sinaimg.cn/large/e724cbefgw1etyppy7bgwg2001001017.gif'
}

if (hexo.config.image_stream) {
    for (var key in config) {
        if (hexo.config.image_stream[key] != null) {
            config[key] = hexo.config.image_stream[key];
        }
    }
}

hexo.extend.tag.register('stream', function(args, content) {
    var result = '';
    if (config['jquery']) {
        result += '<script src="' + config['jquery'] + '"></script>';
    }
    if (config['jquery_lazyload']) {
        result += '<script src="' + config['jquery_lazyload'] + '"></script>';
    }
    result += '<div class="hexo-img-stream">';
    result += '<style type="text/css">';
    result += '.post-gallery {border-bottom: 0; padding-bottom: 3px;} figcaption{text-align: center; line-height: 1.5; font-size: .6rem; color: #999; text-overflow: ellipsis; white-space: nowrap;overflow: hidden;} figure{ background: #fefefe; box-shadow: 0 1px 2px rgba(34, 25, 25, 0.2); margin: 0 0.5% 3%; padding: 0%; padding-bottom: 3px; display: inline-block; max-width: 23%;} .lazyload{ max-width: 95%; padding-top: 0.7em;}';
    result += '</style>';
    result += content;
    result += '</div>';
    return result;
}, {
    ends: true
});

hexo.extend.tag.register('figure', function(args) {
    var imgUrl = args.shift();
    //var title = args.join(' ');
    var title = args.shift();
    var placeholder = config['img_placeholder'];
    var wordUrl = args.shift();
    var result = '<figure>';

    result += '<a class="post-gallery" href="' + wordUrl + '" target="_blank" rel="external">';
    result += '<img class="lazyload" data-original="' + imgUrl + '"/>';
    result += '</a>';
    result += '<figcaption>' + title + '</figcaption>';
    result += '</figure>';
    return result;
});

'use strict';

var config = {
    'jquery': false,
    'jquery_lazyload': false,
    'img_placeholder': 'https://ww4.sinaimg.cn/large/e724cbefgw1etyppy7bgwg2001001017.gif'
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
    //result += '.article img {margin: 0} figcaption{height: 15px; text-align: center; line-height: 1.5; font-size: .7em; color: #999; text-overflow: ellipsis; white-space: nowrap;overflow: hidden;} article figure{ background: #fefefe; box-shadow: 0 1px 2px rgba(34, 25, 25, 0.2); margin: 0 0 2.6% 0; padding: 0%; padding-bottom: 3px; display: inline-block; width: 23.9%;} .lazyload{ padding:0.7em 6px 0;}';
    result += '.post-gallery {border-bottom: 0; padding-bottom: 3px;} figcaption{height: 15px; text-align: center; line-height: 1.5; font-size: .6rem; color: #999; text-overflow: ellipsis; white-space: nowrap;overflow: hidden;} #post-content figure{ background: #fefefe; box-shadow: 0 1px 2px rgba(34, 25, 25, 0.2); margin: 0 0.5% 2.6%; padding: 0%; padding-bottom: 3px; display: inline-block; width: 24%;} .lazyload{ padding:0.7em 6px 0;}';
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
    var date = args.shift();
    var result = '<figure>';

    result += '<a href="' + wordUrl + '" target="_blank" rel="external">';
    //result += '<img title="' + date + '" class="lazyload" src="' + imgUrl + '"/>';
    result += '<img title="' + date + '" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=" data-original="' + imgUrl + '"/>';
    result += '</a>';
    result += '<figcaption>' + title + '</figcaption>';
    result += '</figure>';
    return result;
});

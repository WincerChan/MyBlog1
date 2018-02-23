 "use strict";
 (function() {
     var cacheVersion = "-180222";
     var staticImageCacheName = "image" + cacheVersion;
     var staticAssetsCacheName = "assets" + cacheVersion;
     var contentCacheName = "content" + cacheVersion;
     var vendorCacheName = "vendor" + cacheVersion;
     var maxEntries = 100;
     // self.importScripts("https://s.nfz.yecdn.com/static/js/sw-t.js");
     self.importScripts("https://cdnjs.cat.net/ajax/libs/sw-toolbox/3.6.1/sw-toolbox.js");
     self.toolbox.options.debug = false;
     self.toolbox.options.networkTimeoutSeconds = 3;

     /* staticImageCache */
     self.toolbox.router.get("/(.*)",self.toolbox.cacheFirst, {
     	origin: /upload-images\.jianshu\.io/,
     	cache: {
     	 name: staticImageCacheName,
             maxEntries: maxEntries
     	}
     })
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /i\.loli\.net/,
         cache: {
             name: staticImageCacheName,
             maxEntries: maxEntries
         }
     });

     /* StaticAssetsCache */
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /fonts\.googleapis\.com/,
         cache: {
             name: staticAssetsCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /cdnjs\.cat\.net/,
         cache: {
             name: staticAssetsCacheName,
             maxEntries: maxEntries
         }
     });

     /* ContentCache */
     self.toolbox.router.get("/posts/(.*)/", self.toolbox.networkFirst, {
         cache: {
             name: contentCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/(tags|about|archives|life|categories)(.*)", self.toolbox.networkFirst, {
         cache: {
             name: contentCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/\?(.*)$", self.toolbox.networkFirst, {
         cache: {
             name: contentCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("", self.toolbox.networkFirst, {
         cache: {
             name: contentCacheName,
             maxEntries: maxEntries
         }
     });

     /* VendorCache */
     self.toolbox.router.get("/next/config.json", self.toolbox.networkOnly, {
         origin: /disqus\.com/,
     });
     self.toolbox.router.get("/api/(.*)", self.toolbox.networkOnly, {
         origin: /disqus\.com/,
     });
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /a\.disquscdn\.com/,
         cache: {
             name: vendorCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /c\.disquscdn\.com/,
         cache: {
             name: vendorCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /uploads\.disquscdn\.com/,
         cache: {
             name: vendorCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /media\.disquscdn\.com/,
         cache: {
             name: vendorCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
         origin: /referrer\.disqus\.com/,
         cache: {
             name: vendorCacheName,
             maxEntries: maxEntries
         }
     });
     self.toolbox.router.get("/*.js", self.toolbox.cacheFirst, {
         origin: /(www\.google-analytics\.com|ssl\.google-analytics\.com)/,
         cache: {
             name: vendorCacheName,
             maxEntries: maxEntries
         }
     });

     /* NoCache */
     self.toolbox.router.get("/sw.js", self.toolbox.networkFirst);
     self.addEventListener("install",
         function(event) {
             return event.waitUntil(self.skipWaiting())
         });
     self.addEventListener("activate",
         function(event) {
             return event.waitUntil(self.clients.claim())
         })
 })();

/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "ce851e0fab020a7909b98b6fd3dcd33c"
  },
  {
    "url": "chunk-2760dca5.js",
    "revision": "e6086c8650479909032edae99baab8c3"
  },
  {
    "url": "chunk-fc5b03b8.js",
    "revision": "322f9661eb8b94eacbc7f5f41f58eda7"
  },
  {
    "url": "index-912d319a.js",
    "revision": "3c854beb3a501bd30ee34c138ad43f8c"
  },
  {
    "url": "index-bb6a7eb9.js",
    "revision": "833470f5f74e80ba3b0aa2c506bf731c"
  },
  {
    "url": "index.js",
    "revision": "e38d8b90aace4055d473301aba257564"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("index.html"));

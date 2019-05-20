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
    "revision": "509f645285e814a88a70193839224758"
  },
  {
    "url": "dist/cart-04aba04e.js",
    "revision": "ed7cac7a21b7420df39bbdb4e92439d8"
  },
  {
    "url": "dist/chunk-863279da.js",
    "revision": "434c2ffedc8f4b7f9aff9c2a7e25f9be"
  },
  {
    "url": "dist/chunk-edfac312.js",
    "revision": "b6ec353db94ca84c6a5f26e927446ca6"
  },
  {
    "url": "dist/index.js",
    "revision": "fbf8bb4603885a6b883473b9bc6eb430"
  },
  {
    "url": "dist/products-03654883.js",
    "revision": "e5b5cddf9d52fb3f9f19a0a3425c7b96"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("index.html"));

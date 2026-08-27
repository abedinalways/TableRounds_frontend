'use strict';
(() => {
  try {
    self['workbox:core:7.4.0'] && _();
  } catch {}
  var Me = (r, ...e) => {
    let t = r;
    return (e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t);
  };
  var Ce = Me;
  var l = class extends Error {
    constructor(e, t) {
      let o = Ce(e, t);
      (super(o), (this.name = e), (this.details = t));
    }
  };
  var B = new Set();
  function re(r) {
    B.add(r);
  }
  var w = {
      googleAnalytics: 'googleAnalytics',
      precache: 'precache-v2',
      prefix: 'workbox',
      runtime: 'runtime',
      suffix: typeof registration < 'u' ? registration.scope : '',
    },
    oe = r => [w.prefix, r, w.suffix].filter(e => e && e.length > 0).join('-'),
    Ke = r => {
      for (let e of Object.keys(w)) r(e);
    },
    p = {
      updateDetails: r => {
        Ke(e => {
          typeof r[e] == 'string' && (w[e] = r[e]);
        });
      },
      getGoogleAnalyticsName: r => r || oe(w.googleAnalytics),
      getPrecacheName: r => r || oe(w.precache),
      getPrefix: () => w.prefix,
      getRuntimeName: r => r || oe(w.runtime),
      getSuffix: () => w.suffix,
    };
  function ve(r, e) {
    let t = new URL(r);
    for (let o of e) t.searchParams.delete(o);
    return t.href;
  }
  async function se(r, e, t, o) {
    let s = ve(e.url, t);
    if (e.url === s) return r.match(e, o);
    let n = Object.assign(Object.assign({}, o), { ignoreSearch: !0 }),
      a = await r.keys(e, n);
    for (let i of a) {
      let c = ve(i.url, t);
      if (s === c) return r.match(i, o);
    }
  }
  var O;
  function ne() {
    if (O === void 0) {
      let r = new Response('');
      if ('body' in r)
        try {
          (new Response(r.body), (O = !0));
        } catch {
          O = !1;
        }
      O = !1;
    }
    return O;
  }
  function U(r) {
    r.then(() => {});
  }
  var $ = class {
    constructor() {
      this.promise = new Promise((e, t) => {
        ((this.resolve = e), (this.reject = t));
      });
    }
  };
  async function ae() {
    for (let r of B) await r();
  }
  var H = r =>
    new URL(String(r), location.href).href.replace(
      new RegExp(`^${location.origin}`),
      '',
    );
  function R(r) {
    return new Promise(e => setTimeout(e, r));
  }
  function j(r, e) {
    let t = e();
    return (r.waitUntil(t), t);
  }
  async function ce(r, e) {
    let t = null;
    if ((r.url && (t = new URL(r.url).origin), t !== self.location.origin))
      throw new l('cross-origin-copy-response', { origin: t });
    let o = r.clone(),
      s = {
        headers: new Headers(o.headers),
        status: o.status,
        statusText: o.statusText,
      },
      n = e ? e(s) : s,
      a = ne() ? o.body : await o.blob();
    return new Response(a, n);
  }
  function le() {
    self.addEventListener('activate', () => self.clients.claim());
  }
  function ue(r) {
    p.updateDetails(r);
  }
  try {
    self['workbox:precaching:7.4.0'] && _();
  } catch {}
  var He = '__WB_REVISION__';
  function ke(r) {
    if (!r) throw new l('add-to-cache-list-unexpected-type', { entry: r });
    if (typeof r == 'string') {
      let n = new URL(r, location.href);
      return { cacheKey: n.href, url: n.href };
    }
    let { revision: e, url: t } = r;
    if (!t) throw new l('add-to-cache-list-unexpected-type', { entry: r });
    if (!e) {
      let n = new URL(t, location.href);
      return { cacheKey: n.href, url: n.href };
    }
    let o = new URL(t, location.href),
      s = new URL(t, location.href);
    return (o.searchParams.set(He, e), { cacheKey: o.href, url: s.href });
  }
  var G = class {
    constructor() {
      ((this.updatedURLs = []),
        (this.notUpdatedURLs = []),
        (this.handlerWillStart = async ({ request: e, state: t }) => {
          t && (t.originalRequest = e);
        }),
        (this.cachedResponseWillBeUsed = async ({
          event: e,
          state: t,
          cachedResponse: o,
        }) => {
          if (
            e.type === 'install' &&
            t &&
            t.originalRequest &&
            t.originalRequest instanceof Request
          ) {
            let s = t.originalRequest.url;
            o ? this.notUpdatedURLs.push(s) : this.updatedURLs.push(s);
          }
          return o;
        }));
    }
  };
  var Q = class {
    constructor({ precacheController: e }) {
      ((this.cacheKeyWillBeUsed = async ({ request: t, params: o }) => {
        let s =
          o?.cacheKey || this._precacheController.getCacheKeyForURL(t.url);
        return s ? new Request(s, { headers: t.headers }) : t;
      }),
        (this._precacheController = e));
    }
  };
  try {
    self['workbox:strategies:7.4.0'] && _();
  } catch {}
  function J(r) {
    return typeof r == 'string' ? new Request(r) : r;
  }
  var L = class {
    constructor(e, t) {
      ((this._cacheKeys = {}),
        Object.assign(this, t),
        (this.event = t.event),
        (this._strategy = e),
        (this._handlerDeferred = new $()),
        (this._extendLifetimePromises = []),
        (this._plugins = [...e.plugins]),
        (this._pluginStateMap = new Map()));
      for (let o of this._plugins) this._pluginStateMap.set(o, {});
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    async fetch(e) {
      let { event: t } = this,
        o = J(e);
      if (
        o.mode === 'navigate' &&
        t instanceof FetchEvent &&
        t.preloadResponse
      ) {
        let a = await t.preloadResponse;
        if (a) return a;
      }
      let s = this.hasCallback('fetchDidFail') ? o.clone() : null;
      try {
        for (let a of this.iterateCallbacks('requestWillFetch'))
          o = await a({ request: o.clone(), event: t });
      } catch (a) {
        if (a instanceof Error)
          throw new l('plugin-error-request-will-fetch', {
            thrownErrorMessage: a.message,
          });
      }
      let n = o.clone();
      try {
        let a;
        a = await fetch(
          o,
          o.mode === 'navigate' ? void 0 : this._strategy.fetchOptions,
        );
        for (let i of this.iterateCallbacks('fetchDidSucceed'))
          a = await i({ event: t, request: n, response: a });
        return a;
      } catch (a) {
        throw (
          s &&
            (await this.runCallbacks('fetchDidFail', {
              error: a,
              event: t,
              originalRequest: s.clone(),
              request: n.clone(),
            })),
          a
        );
      }
    }
    async fetchAndCachePut(e) {
      let t = await this.fetch(e),
        o = t.clone();
      return (this.waitUntil(this.cachePut(e, o)), t);
    }
    async cacheMatch(e) {
      let t = J(e),
        o,
        { cacheName: s, matchOptions: n } = this._strategy,
        a = await this.getCacheKey(t, 'read'),
        i = Object.assign(Object.assign({}, n), { cacheName: s });
      o = await caches.match(a, i);
      for (let c of this.iterateCallbacks('cachedResponseWillBeUsed'))
        o =
          (await c({
            cacheName: s,
            matchOptions: n,
            cachedResponse: o,
            request: a,
            event: this.event,
          })) || void 0;
      return o;
    }
    async cachePut(e, t) {
      let o = J(e);
      await R(0);
      let s = await this.getCacheKey(o, 'write');
      if (!t) throw new l('cache-put-with-no-response', { url: H(s.url) });
      let n = await this._ensureResponseSafeToCache(t);
      if (!n) return !1;
      let { cacheName: a, matchOptions: i } = this._strategy,
        c = await self.caches.open(a),
        u = this.hasCallback('cacheDidUpdate'),
        E = u ? await se(c, s.clone(), ['__WB_REVISION__'], i) : null;
      try {
        await c.put(s, u ? n.clone() : n);
      } catch (f) {
        if (f instanceof Error)
          throw (f.name === 'QuotaExceededError' && (await ae()), f);
      }
      for (let f of this.iterateCallbacks('cacheDidUpdate'))
        await f({
          cacheName: a,
          oldResponse: E,
          newResponse: n.clone(),
          request: s,
          event: this.event,
        });
      return !0;
    }
    async getCacheKey(e, t) {
      let o = `${e.url} | ${t}`;
      if (!this._cacheKeys[o]) {
        let s = e;
        for (let n of this.iterateCallbacks('cacheKeyWillBeUsed'))
          s = J(
            await n({
              mode: t,
              request: s,
              event: this.event,
              params: this.params,
            }),
          );
        this._cacheKeys[o] = s;
      }
      return this._cacheKeys[o];
    }
    hasCallback(e) {
      for (let t of this._strategy.plugins) if (e in t) return !0;
      return !1;
    }
    async runCallbacks(e, t) {
      for (let o of this.iterateCallbacks(e)) await o(t);
    }
    *iterateCallbacks(e) {
      for (let t of this._strategy.plugins)
        if (typeof t[e] == 'function') {
          let o = this._pluginStateMap.get(t);
          yield n => {
            let a = Object.assign(Object.assign({}, n), { state: o });
            return t[e](a);
          };
        }
    }
    waitUntil(e) {
      return (this._extendLifetimePromises.push(e), e);
    }
    async doneWaiting() {
      for (; this._extendLifetimePromises.length; ) {
        let e = this._extendLifetimePromises.splice(0),
          o = (await Promise.allSettled(e)).find(s => s.status === 'rejected');
        if (o) throw o.reason;
      }
    }
    destroy() {
      this._handlerDeferred.resolve(null);
    }
    async _ensureResponseSafeToCache(e) {
      let t = e,
        o = !1;
      for (let s of this.iterateCallbacks('cacheWillUpdate'))
        if (
          ((t =
            (await s({
              request: this.request,
              response: t,
              event: this.event,
            })) || void 0),
          (o = !0),
          !t)
        )
          break;
      return (o || (t && t.status !== 200 && (t = void 0)), t);
    }
  };
  var h = class {
    constructor(e = {}) {
      ((this.cacheName = p.getRuntimeName(e.cacheName)),
        (this.plugins = e.plugins || []),
        (this.fetchOptions = e.fetchOptions),
        (this.matchOptions = e.matchOptions));
    }
    handle(e) {
      let [t] = this.handleAll(e);
      return t;
    }
    handleAll(e) {
      e instanceof FetchEvent && (e = { event: e, request: e.request });
      let t = e.event,
        o = typeof e.request == 'string' ? new Request(e.request) : e.request,
        s = 'params' in e ? e.params : void 0,
        n = new L(this, { event: t, request: o, params: s }),
        a = this._getResponse(n, o, t),
        i = this._awaitComplete(a, n, o, t);
      return [a, i];
    }
    async _getResponse(e, t, o) {
      await e.runCallbacks('handlerWillStart', { event: o, request: t });
      let s;
      try {
        if (((s = await this._handle(t, e)), !s || s.type === 'error'))
          throw new l('no-response', { url: t.url });
      } catch (n) {
        if (n instanceof Error) {
          for (let a of e.iterateCallbacks('handlerDidError'))
            if (((s = await a({ error: n, event: o, request: t })), s)) break;
        }
        if (!s) throw n;
      }
      for (let n of e.iterateCallbacks('handlerWillRespond'))
        s = await n({ event: o, request: t, response: s });
      return s;
    }
    async _awaitComplete(e, t, o, s) {
      let n, a;
      try {
        n = await e;
      } catch {}
      try {
        (await t.runCallbacks('handlerDidRespond', {
          event: s,
          request: o,
          response: n,
        }),
          await t.doneWaiting());
      } catch (i) {
        i instanceof Error && (a = i);
      }
      if (
        (await t.runCallbacks('handlerDidComplete', {
          event: s,
          request: o,
          response: n,
          error: a,
        }),
        t.destroy(),
        a)
      )
        throw a;
    }
  };
  var x = class r extends h {
    constructor(e = {}) {
      ((e.cacheName = p.getPrecacheName(e.cacheName)),
        super(e),
        (this._fallbackToNetwork = e.fallbackToNetwork !== !1),
        this.plugins.push(r.copyRedirectedCacheableResponsesPlugin));
    }
    async _handle(e, t) {
      let o = await t.cacheMatch(e);
      return (
        o ||
        (t.event && t.event.type === 'install'
          ? await this._handleInstall(e, t)
          : await this._handleFetch(e, t))
      );
    }
    async _handleFetch(e, t) {
      let o,
        s = t.params || {};
      if (this._fallbackToNetwork) {
        let n = s.integrity,
          a = e.integrity,
          i = !a || a === n;
        if (
          ((o = await t.fetch(
            new Request(e, {
              integrity: e.mode !== 'no-cors' ? a || n : void 0,
            }),
          )),
          n && i && e.mode !== 'no-cors')
        ) {
          this._useDefaultCacheabilityPluginIfNeeded();
          let c = await t.cachePut(e, o.clone());
        }
      } else
        throw new l('missing-precache-entry', {
          cacheName: this.cacheName,
          url: e.url,
        });
      return o;
    }
    async _handleInstall(e, t) {
      this._useDefaultCacheabilityPluginIfNeeded();
      let o = await t.fetch(e);
      if (!(await t.cachePut(e, o.clone())))
        throw new l('bad-precaching-response', {
          url: e.url,
          status: o.status,
        });
      return o;
    }
    _useDefaultCacheabilityPluginIfNeeded() {
      let e = null,
        t = 0;
      for (let [o, s] of this.plugins.entries())
        s !== r.copyRedirectedCacheableResponsesPlugin &&
          (s === r.defaultPrecacheCacheabilityPlugin && (e = o),
          s.cacheWillUpdate && t++);
      t === 0
        ? this.plugins.push(r.defaultPrecacheCacheabilityPlugin)
        : t > 1 && e !== null && this.plugins.splice(e, 1);
    }
  };
  x.defaultPrecacheCacheabilityPlugin = {
    async cacheWillUpdate({ response: r }) {
      return !r || r.status >= 400 ? null : r;
    },
  };
  x.copyRedirectedCacheableResponsesPlugin = {
    async cacheWillUpdate({ response: r }) {
      return r.redirected ? await ce(r) : r;
    },
  };
  var P = class {
    constructor({
      cacheName: e,
      plugins: t = [],
      fallbackToNetwork: o = !0,
    } = {}) {
      ((this._urlsToCacheKeys = new Map()),
        (this._urlsToCacheModes = new Map()),
        (this._cacheKeysToIntegrities = new Map()),
        (this._strategy = new x({
          cacheName: p.getPrecacheName(e),
          plugins: [...t, new Q({ precacheController: this })],
          fallbackToNetwork: o,
        })),
        (this.install = this.install.bind(this)),
        (this.activate = this.activate.bind(this)));
    }
    get strategy() {
      return this._strategy;
    }
    precache(e) {
      (this.addToCacheList(e),
        this._installAndActiveListenersAdded ||
          (self.addEventListener('install', this.install),
          self.addEventListener('activate', this.activate),
          (this._installAndActiveListenersAdded = !0)));
    }
    addToCacheList(e) {
      let t = [];
      for (let o of e) {
        typeof o == 'string'
          ? t.push(o)
          : o && o.revision === void 0 && t.push(o.url);
        let { cacheKey: s, url: n } = ke(o),
          a = typeof o != 'string' && o.revision ? 'reload' : 'default';
        if (this._urlsToCacheKeys.has(n) && this._urlsToCacheKeys.get(n) !== s)
          throw new l('add-to-cache-list-conflicting-entries', {
            firstEntry: this._urlsToCacheKeys.get(n),
            secondEntry: s,
          });
        if (typeof o != 'string' && o.integrity) {
          if (
            this._cacheKeysToIntegrities.has(s) &&
            this._cacheKeysToIntegrities.get(s) !== o.integrity
          )
            throw new l('add-to-cache-list-conflicting-integrities', {
              url: n,
            });
          this._cacheKeysToIntegrities.set(s, o.integrity);
        }
        if (
          (this._urlsToCacheKeys.set(n, s),
          this._urlsToCacheModes.set(n, a),
          t.length > 0)
        ) {
          let i = `Workbox is precaching URLs without revision info: ${t.join(', ')}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
          console.warn(i);
        }
      }
    }
    install(e) {
      return j(e, async () => {
        let t = new G();
        this.strategy.plugins.push(t);
        for (let [n, a] of this._urlsToCacheKeys) {
          let i = this._cacheKeysToIntegrities.get(a),
            c = this._urlsToCacheModes.get(n),
            u = new Request(n, {
              integrity: i,
              cache: c,
              credentials: 'same-origin',
            });
          await Promise.all(
            this.strategy.handleAll({
              params: { cacheKey: a },
              request: u,
              event: e,
            }),
          );
        }
        let { updatedURLs: o, notUpdatedURLs: s } = t;
        return { updatedURLs: o, notUpdatedURLs: s };
      });
    }
    activate(e) {
      return j(e, async () => {
        let t = await self.caches.open(this.strategy.cacheName),
          o = await t.keys(),
          s = new Set(this._urlsToCacheKeys.values()),
          n = [];
        for (let a of o) s.has(a.url) || (await t.delete(a), n.push(a.url));
        return { deletedURLs: n };
      });
    }
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }
    getCacheKeyForURL(e) {
      let t = new URL(e, location.href);
      return this._urlsToCacheKeys.get(t.href);
    }
    getIntegrityForCacheKey(e) {
      return this._cacheKeysToIntegrities.get(e);
    }
    async matchPrecache(e) {
      let t = e instanceof Request ? e.url : e,
        o = this.getCacheKeyForURL(t);
      if (o) return (await self.caches.open(this.strategy.cacheName)).match(o);
    }
    createHandlerBoundToURL(e) {
      let t = this.getCacheKeyForURL(e);
      if (!t) throw new l('non-precached-url', { url: e });
      return o => (
        (o.request = new Request(e)),
        (o.params = Object.assign({ cacheKey: t }, o.params)),
        this.strategy.handle(o)
      );
    }
  };
  var pe,
    g = () => (pe || (pe = new P()), pe);
  try {
    self['workbox:routing:7.4.0'] && _();
  } catch {}
  var Y = 'GET';
  var C = r => (r && typeof r == 'object' ? r : { handle: r });
  var m = class {
    constructor(e, t, o = Y) {
      ((this.handler = C(t)), (this.match = e), (this.method = o));
    }
    setCatchHandler(e) {
      this.catchHandler = C(e);
    }
  };
  var S = class extends m {
    constructor(e, t, o) {
      let s = ({ url: n }) => {
        let a = e.exec(n.href);
        if (a && !(n.origin !== location.origin && a.index !== 0))
          return a.slice(1);
      };
      super(s, t, o);
    }
  };
  var A = class {
    constructor() {
      ((this._routes = new Map()), (this._defaultHandlerMap = new Map()));
    }
    get routes() {
      return this._routes;
    }
    addFetchListener() {
      self.addEventListener('fetch', e => {
        let { request: t } = e,
          o = this.handleRequest({ request: t, event: e });
        o && e.respondWith(o);
      });
    }
    addCacheListener() {
      self.addEventListener('message', e => {
        if (e.data && e.data.type === 'CACHE_URLS') {
          let { payload: t } = e.data,
            o = Promise.all(
              t.urlsToCache.map(s => {
                typeof s == 'string' && (s = [s]);
                let n = new Request(...s);
                return this.handleRequest({ request: n, event: e });
              }),
            );
          (e.waitUntil(o),
            e.ports && e.ports[0] && o.then(() => e.ports[0].postMessage(!0)));
        }
      });
    }
    handleRequest({ request: e, event: t }) {
      let o = new URL(e.url, location.href);
      if (!o.protocol.startsWith('http')) return;
      let s = o.origin === location.origin,
        { params: n, route: a } = this.findMatchingRoute({
          event: t,
          request: e,
          sameOrigin: s,
          url: o,
        }),
        i = a && a.handler,
        c = [],
        u = e.method;
      if (
        (!i &&
          this._defaultHandlerMap.has(u) &&
          (i = this._defaultHandlerMap.get(u)),
        !i)
      )
        return;
      let E;
      try {
        E = i.handle({ url: o, request: e, event: t, params: n });
      } catch (T) {
        E = Promise.reject(T);
      }
      let f = a && a.catchHandler;
      return (
        E instanceof Promise &&
          (this._catchHandler || f) &&
          (E = E.catch(async T => {
            if (f)
              try {
                return await f.handle({
                  url: o,
                  request: e,
                  event: t,
                  params: n,
                });
              } catch (Re) {
                Re instanceof Error && (T = Re);
              }
            if (this._catchHandler)
              return this._catchHandler.handle({
                url: o,
                request: e,
                event: t,
              });
            throw T;
          })),
        E
      );
    }
    findMatchingRoute({ url: e, sameOrigin: t, request: o, event: s }) {
      let n = this._routes.get(o.method) || [];
      for (let a of n) {
        let i,
          c = a.match({ url: e, sameOrigin: t, request: o, event: s });
        if (c)
          return (
            (i = c),
            ((Array.isArray(i) && i.length === 0) ||
              (c.constructor === Object && Object.keys(c).length === 0) ||
              typeof c == 'boolean') &&
              (i = void 0),
            { route: a, params: i }
          );
      }
      return {};
    }
    setDefaultHandler(e, t = Y) {
      this._defaultHandlerMap.set(t, C(e));
    }
    setCatchHandler(e) {
      this._catchHandler = C(e);
    }
    registerRoute(e) {
      (this._routes.has(e.method) || this._routes.set(e.method, []),
        this._routes.get(e.method).push(e));
    }
    unregisterRoute(e) {
      if (!this._routes.has(e.method))
        throw new l('unregister-route-but-not-found-with-method', {
          method: e.method,
        });
      let t = this._routes.get(e.method).indexOf(e);
      if (t > -1) this._routes.get(e.method).splice(t, 1);
      else throw new l('unregister-route-route-not-registered');
    }
  };
  var q,
    X = () => (
      q || ((q = new A()), q.addFetchListener(), q.addCacheListener()),
      q
    );
  function y(r, e, t) {
    let o;
    if (typeof r == 'string') {
      let n = new URL(r, location.href),
        a = ({ url: i }) => i.href === n.href;
      o = new m(a, e, t);
    } else if (r instanceof RegExp) o = new S(r, e, t);
    else if (typeof r == 'function') o = new m(r, e, t);
    else if (r instanceof m) o = r;
    else
      throw new l('unsupported-route-type', {
        moduleName: 'workbox-routing',
        funcName: 'registerRoute',
        paramName: 'capture',
      });
    return (X().registerRoute(o), o);
  }
  function De(r, e = []) {
    for (let t of [...r.searchParams.keys()])
      e.some(o => o.test(t)) && r.searchParams.delete(t);
    return r;
  }
  function* Te(
    r,
    {
      ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/],
      directoryIndex: t = 'index.html',
      cleanURLs: o = !0,
      urlManipulation: s,
    } = {},
  ) {
    let n = new URL(r, location.href);
    ((n.hash = ''), yield n.href);
    let a = De(n, e);
    if ((yield a.href, t && a.pathname.endsWith('/'))) {
      let i = new URL(a.href);
      ((i.pathname += t), yield i.href);
    }
    if (o) {
      let i = new URL(a.href);
      ((i.pathname += '.html'), yield i.href);
    }
    if (s) {
      let i = s({ url: n });
      for (let c of i) yield c.href;
    }
  }
  var V = class extends m {
    constructor(e, t) {
      let o = ({ request: s }) => {
        let n = e.getURLsToCacheKeys();
        for (let a of Te(s.url, t)) {
          let i = n.get(a);
          if (i) {
            let c = e.getIntegrityForCacheKey(i);
            return { cacheKey: i, integrity: c };
          }
        }
      };
      super(o, e.strategy);
    }
  };
  function he(r) {
    let e = g(),
      t = new V(e, r);
    y(t);
  }
  var je = '-precache-',
    Oe = async (r, e = je) => {
      let o = (await self.caches.keys()).filter(
        s => s.includes(e) && s.includes(self.registration.scope) && s !== r,
      );
      return (await Promise.all(o.map(s => self.caches.delete(s))), o);
    };
  function me() {
    self.addEventListener('activate', r => {
      let e = p.getPrecacheName();
      r.waitUntil(Oe(e).then(t => {}));
    });
  }
  function de(r) {
    return g().matchPrecache(r);
  }
  function fe(r) {
    g().precache(r);
  }
  function ge(r, e) {
    (fe(r), he(e));
  }
  var v = class extends h {
    async _handle(e, t) {
      let o = [],
        s = await t.cacheMatch(e),
        n;
      if (!s)
        try {
          s = await t.fetchAndCachePut(e);
        } catch (a) {
          a instanceof Error && (n = a);
        }
      if (!s) throw new l('no-response', { url: e.url, error: n });
      return s;
    }
  };
  var we = {
    cacheWillUpdate: async ({ response: r }) =>
      r.status === 200 || r.status === 0 ? r : null,
  };
  var k = class extends h {
    constructor(e = {}) {
      (super(e),
        this.plugins.some(t => 'cacheWillUpdate' in t) ||
          this.plugins.unshift(we),
        (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0));
    }
    async _handle(e, t) {
      let o = [],
        s = [],
        n;
      if (this._networkTimeoutSeconds) {
        let { id: c, promise: u } = this._getTimeoutPromise({
          request: e,
          logs: o,
          handler: t,
        });
        ((n = c), s.push(u));
      }
      let a = this._getNetworkPromise({
        timeoutId: n,
        request: e,
        logs: o,
        handler: t,
      });
      s.push(a);
      let i = await t.waitUntil(
        (async () => (await t.waitUntil(Promise.race(s))) || (await a))(),
      );
      if (!i) throw new l('no-response', { url: e.url });
      return i;
    }
    _getTimeoutPromise({ request: e, logs: t, handler: o }) {
      let s;
      return {
        promise: new Promise(a => {
          s = setTimeout(async () => {
            a(await o.cacheMatch(e));
          }, this._networkTimeoutSeconds * 1e3);
        }),
        id: s,
      };
    }
    async _getNetworkPromise({
      timeoutId: e,
      request: t,
      logs: o,
      handler: s,
    }) {
      let n, a;
      try {
        a = await s.fetchAndCachePut(t);
      } catch (i) {
        i instanceof Error && (n = i);
      }
      return (
        e && clearTimeout(e),
        (n || !a) && (a = await s.cacheMatch(t)),
        a
      );
    }
  };
  var I = class extends h {
    constructor(e = {}) {
      (super(e), (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0));
    }
    async _handle(e, t) {
      let o, s;
      try {
        let n = [t.fetch(e)];
        if (this._networkTimeoutSeconds) {
          let a = R(this._networkTimeoutSeconds * 1e3);
          n.push(a);
        }
        if (((s = await Promise.race(n)), !s))
          throw new Error(
            `Timed out the network response after ${this._networkTimeoutSeconds} seconds.`,
          );
      } catch (n) {
        n instanceof Error && (o = n);
      }
      if (!s) throw new l('no-response', { url: e.url, error: o });
      return s;
    }
  };
  try {
    self['workbox:cacheable-response:7.4.0'] && _();
  } catch {}
  var W = class {
    constructor(e = {}) {
      ((this._statuses = e.statuses), (this._headers = e.headers));
    }
    isResponseCacheable(e) {
      let t = !0;
      return (
        this._statuses && (t = this._statuses.includes(e.status)),
        this._headers &&
          t &&
          (t = Object.keys(this._headers).some(
            o => e.headers.get(o) === this._headers[o],
          )),
        t
      );
    }
  };
  var N = class {
    constructor(e) {
      ((this.cacheWillUpdate = async ({ response: t }) =>
        this._cacheableResponse.isResponseCacheable(t) ? t : null),
        (this._cacheableResponse = new W(e)));
    }
  };
  var Ge = (r, e) => e.some(t => r instanceof t),
    Ue,
    $e;
  function Qe() {
    return (
      Ue ||
      (Ue = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
    );
  }
  function Je() {
    return (
      $e ||
      ($e = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey,
      ])
    );
  }
  var Le = new WeakMap(),
    Ee = new WeakMap(),
    Pe = new WeakMap(),
    ye = new WeakMap(),
    be = new WeakMap();
  function Ye(r) {
    let e = new Promise((t, o) => {
      let s = () => {
          (r.removeEventListener('success', n),
            r.removeEventListener('error', a));
        },
        n = () => {
          (t(d(r.result)), s());
        },
        a = () => {
          (o(r.error), s());
        };
      (r.addEventListener('success', n), r.addEventListener('error', a));
    });
    return (
      e
        .then(t => {
          t instanceof IDBCursor && Le.set(t, r);
        })
        .catch(() => {}),
      be.set(e, r),
      e
    );
  }
  function Xe(r) {
    if (Ee.has(r)) return;
    let e = new Promise((t, o) => {
      let s = () => {
          (r.removeEventListener('complete', n),
            r.removeEventListener('error', a),
            r.removeEventListener('abort', a));
        },
        n = () => {
          (t(), s());
        },
        a = () => {
          (o(r.error || new DOMException('AbortError', 'AbortError')), s());
        };
      (r.addEventListener('complete', n),
        r.addEventListener('error', a),
        r.addEventListener('abort', a));
    });
    Ee.set(r, e);
  }
  var Ne = {
    get(r, e, t) {
      if (r instanceof IDBTransaction) {
        if (e === 'done') return Ee.get(r);
        if (e === 'objectStoreNames') return r.objectStoreNames || Pe.get(r);
        if (e === 'store')
          return t.objectStoreNames[1]
            ? void 0
            : t.objectStore(t.objectStoreNames[0]);
      }
      return d(r[e]);
    },
    set(r, e, t) {
      return ((r[e] = t), !0);
    },
    has(r, e) {
      return r instanceof IDBTransaction && (e === 'done' || e === 'store')
        ? !0
        : e in r;
    },
  };
  function Se(r) {
    Ne = r(Ne);
  }
  function ze(r) {
    return r === IDBDatabase.prototype.transaction &&
      !('objectStoreNames' in IDBTransaction.prototype)
      ? function (e, ...t) {
          let o = r.call(z(this), e, ...t);
          return (Pe.set(o, e.sort ? e.sort() : [e]), d(o));
        }
      : Je().includes(r)
        ? function (...e) {
            return (r.apply(z(this), e), d(Le.get(this)));
          }
        : function (...e) {
            return d(r.apply(z(this), e));
          };
  }
  function Ze(r) {
    return typeof r == 'function'
      ? ze(r)
      : (r instanceof IDBTransaction && Xe(r),
        Ge(r, Qe()) ? new Proxy(r, Ne) : r);
  }
  function d(r) {
    if (r instanceof IDBRequest) return Ye(r);
    if (ye.has(r)) return ye.get(r);
    let e = Ze(r);
    return (e !== r && (ye.set(r, e), be.set(e, r)), e);
  }
  var z = r => be.get(r);
  function qe(
    r,
    e,
    { blocked: t, upgrade: o, blocking: s, terminated: n } = {},
  ) {
    let a = indexedDB.open(r, e),
      i = d(a);
    return (
      o &&
        a.addEventListener('upgradeneeded', c => {
          o(d(a.result), c.oldVersion, c.newVersion, d(a.transaction), c);
        }),
      t && a.addEventListener('blocked', c => t(c.oldVersion, c.newVersion, c)),
      i
        .then(c => {
          (n && c.addEventListener('close', () => n()),
            s &&
              c.addEventListener('versionchange', u =>
                s(u.oldVersion, u.newVersion, u),
              ));
        })
        .catch(() => {}),
      i
    );
  }
  function Ve(r, { blocked: e } = {}) {
    let t = indexedDB.deleteDatabase(r);
    return (
      e && t.addEventListener('blocked', o => e(o.oldVersion, o)),
      d(t).then(() => {})
    );
  }
  var et = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
    tt = ['put', 'add', 'delete', 'clear'],
    xe = new Map();
  function Ae(r, e) {
    if (!(r instanceof IDBDatabase && !(e in r) && typeof e == 'string'))
      return;
    if (xe.get(e)) return xe.get(e);
    let t = e.replace(/FromIndex$/, ''),
      o = e !== t,
      s = tt.includes(t);
    if (
      !(t in (o ? IDBIndex : IDBObjectStore).prototype) ||
      !(s || et.includes(t))
    )
      return;
    let n = async function (a, ...i) {
      let c = this.transaction(a, s ? 'readwrite' : 'readonly'),
        u = c.store;
      return (
        o && (u = u.index(i.shift())),
        (await Promise.all([u[t](...i), s && c.done]))[0]
      );
    };
    return (xe.set(e, n), n);
  }
  Se(r => ({
    ...r,
    get: (e, t, o) => Ae(e, t) || r.get(e, t, o),
    has: (e, t) => !!Ae(e, t) || r.has(e, t),
  }));
  try {
    self['workbox:expiration:7.4.0'] && _();
  } catch {}
  var rt = 'workbox-expiration',
    F = 'cache-entries',
    Ie = r => {
      let e = new URL(r, location.href);
      return ((e.hash = ''), e.href);
    },
    Z = class {
      constructor(e) {
        ((this._db = null), (this._cacheName = e));
      }
      _upgradeDb(e) {
        let t = e.createObjectStore(F, { keyPath: 'id' });
        (t.createIndex('cacheName', 'cacheName', { unique: !1 }),
          t.createIndex('timestamp', 'timestamp', { unique: !1 }));
      }
      _upgradeDbAndDeleteOldDbs(e) {
        (this._upgradeDb(e), this._cacheName && Ve(this._cacheName));
      }
      async setTimestamp(e, t) {
        e = Ie(e);
        let o = {
            url: e,
            timestamp: t,
            cacheName: this._cacheName,
            id: this._getId(e),
          },
          n = (await this.getDb()).transaction(F, 'readwrite', {
            durability: 'relaxed',
          });
        (await n.store.put(o), await n.done);
      }
      async getTimestamp(e) {
        let o = await (await this.getDb()).get(F, this._getId(e));
        return o?.timestamp;
      }
      async expireEntries(e, t) {
        let o = await this.getDb(),
          s = await o
            .transaction(F)
            .store.index('timestamp')
            .openCursor(null, 'prev'),
          n = [],
          a = 0;
        for (; s; ) {
          let c = s.value;
          (c.cacheName === this._cacheName &&
            ((e && c.timestamp < e) || (t && a >= t) ? n.push(s.value) : a++),
            (s = await s.continue()));
        }
        let i = [];
        for (let c of n) (await o.delete(F, c.id), i.push(c.url));
        return i;
      }
      _getId(e) {
        return this._cacheName + '|' + Ie(e);
      }
      async getDb() {
        return (
          this._db ||
            (this._db = await qe(rt, 1, {
              upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
            })),
          this._db
        );
      }
    };
  var M = class {
    constructor(e, t = {}) {
      ((this._isRunning = !1),
        (this._rerunRequested = !1),
        (this._maxEntries = t.maxEntries),
        (this._maxAgeSeconds = t.maxAgeSeconds),
        (this._matchOptions = t.matchOptions),
        (this._cacheName = e),
        (this._timestampModel = new Z(e)));
    }
    async expireEntries() {
      if (this._isRunning) {
        this._rerunRequested = !0;
        return;
      }
      this._isRunning = !0;
      let e = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0,
        t = await this._timestampModel.expireEntries(e, this._maxEntries),
        o = await self.caches.open(this._cacheName);
      for (let s of t) await o.delete(s, this._matchOptions);
      ((this._isRunning = !1),
        this._rerunRequested &&
          ((this._rerunRequested = !1), U(this.expireEntries())));
    }
    async updateTimestamp(e) {
      await this._timestampModel.setTimestamp(e, Date.now());
    }
    async isURLExpired(e) {
      if (this._maxAgeSeconds) {
        let t = await this._timestampModel.getTimestamp(e),
          o = Date.now() - this._maxAgeSeconds * 1e3;
        return t !== void 0 ? t < o : !0;
      } else return !1;
    }
    async delete() {
      ((this._rerunRequested = !1),
        await this._timestampModel.expireEntries(1 / 0));
    }
  };
  var b = class {
    constructor(e = {}) {
      ((this.cachedResponseWillBeUsed = async ({
        event: t,
        request: o,
        cacheName: s,
        cachedResponse: n,
      }) => {
        if (!n) return null;
        let a = this._isResponseDateFresh(n),
          i = this._getCacheExpiration(s);
        U(i.expireEntries());
        let c = i.updateTimestamp(o.url);
        if (t)
          try {
            t.waitUntil(c);
          } catch {}
        return a ? n : null;
      }),
        (this.cacheDidUpdate = async ({ cacheName: t, request: o }) => {
          let s = this._getCacheExpiration(t);
          (await s.updateTimestamp(o.url), await s.expireEntries());
        }),
        (this._config = e),
        (this._maxAgeSeconds = e.maxAgeSeconds),
        (this._cacheExpirations = new Map()),
        e.purgeOnQuotaError && re(() => this.deleteCacheAndMetadata()));
    }
    _getCacheExpiration(e) {
      if (e === p.getRuntimeName()) throw new l('expire-custom-caches-only');
      let t = this._cacheExpirations.get(e);
      return (
        t || ((t = new M(e, this._config)), this._cacheExpirations.set(e, t)),
        t
      );
    }
    _isResponseDateFresh(e) {
      if (!this._maxAgeSeconds) return !0;
      let t = this._getDateHeaderTimestamp(e);
      if (t === null) return !0;
      let o = Date.now();
      return t >= o - this._maxAgeSeconds * 1e3;
    }
    _getDateHeaderTimestamp(e) {
      if (!e.headers.has('date')) return null;
      let t = e.headers.get('date'),
        s = new Date(t).getTime();
      return isNaN(s) ? null : s;
    }
    async deleteCacheAndMetadata() {
      for (let [e, t] of this._cacheExpirations)
        (await self.caches.delete(e), await t.delete());
      this._cacheExpirations = new Map();
    }
  };
  try {
    self['workbox:navigation-preload:7.4.0'] && _();
  } catch {}
  function ee() {
    return !!(self.registration && self.registration.navigationPreload);
  }
  function _e(r) {
    ee() &&
      self.addEventListener('activate', e => {
        e.waitUntil(
          self.registration.navigationPreload.enable().then(() => {
            r && self.registration.navigationPreload.setHeaderValue(r);
          }),
        );
      });
  }
  var D = 'v1',
    We = `tablerounds-runtime-pages-${D}-Da6g9byOmfXJysKy9lAG7`,
    st = `tablerounds-runtime-images-${D}`,
    nt = `tablerounds-runtime-fonts-${D}`,
    at = `tablerounds-api-readonly-${D}`,
    it = '/offline.html';
  ue({ prefix: 'tablerounds' });
  ge([
    { revision: 'a2760511c65806022ad20adf74370ff3', url: '/window.svg' },
    { revision: 'c0af2f507b369b085b35ef4bbe3bcf1e', url: '/vercel.svg' },
    { revision: '6ef60e8bf9024da8479efb385984ac7a', url: '/offline.html' },
    { revision: '8e061864f388b47f33a1c3780831193e', url: '/next.svg' },
    { revision: 'cfa6bb48cba8aa85a485ee103d1f4da5', url: '/navbar-logo.png' },
    {
      revision: '069f9acbcd4f397d0cddb77fb421e31d',
      url: '/manifest.webmanifest',
    },
    { revision: '2aaafa6a49b6563925fe440891e32717', url: '/globe.svg' },
    { revision: 'b2e99430cf722e112f62b8464074cc64', url: '/footer-logo.png' },
    { revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71', url: '/file.svg' },
    { revision: 'cbf7dd379600de0c876d414aa7df7a31', url: '/favicon.ico' },
    { revision: 'eea2f6b994ec2fe07b3981af3acac3fc', url: '/images/welcom.png' },
    { revision: '2fe4c3faf20da0f904277acb5223092b', url: '/images/play.png' },
    { revision: '9fae7295b0fb725f42cba9331a29e39b', url: '/images/pic02.svg' },
    { revision: '54fa7f18a3c41961965257e7cf51e261', url: '/images/pic01.svg' },
    { revision: '7ce70c6d62a649940b7f9f18750dc56f', url: '/images/oms.png' },
    {
      revision: 'cfa6bb48cba8aa85a485ee103d1f4da5',
      url: '/images/navbar-logo.png',
    },
    {
      revision: 'd08a2b95e94f55844a03e2c74dd1bc60',
      url: '/images/loading.json',
    },
    { revision: '56a5dbcac5f5be8a4f4614d78dfc850f', url: '/images/img008.png' },
    { revision: 'b6cf99555ff5e2e1a6c0a3c236273c2f', url: '/images/icon03.png' },
    { revision: '1918e6a62a0b4c471198934f53484cba', url: '/images/icon02.png' },
    { revision: '49750d5249eb86a0f3933dc56e6c6063', url: '/images/icon01.png' },
    { revision: '79d670690ac8cd035b8980e830dfb2a7', url: '/images/icon.png' },
    {
      revision: 'a288ddf263d8129265d53f52373cdc09',
      url: '/images/heartbit.png',
    },
    {
      revision: 'b2e99430cf722e112f62b8464074cc64',
      url: '/images/footer_logo.png',
    },
    {
      revision: 'eea2f6b994ec2fe07b3981af3acac3fc',
      url: '/images/footer-logo.png',
    },
    {
      revision: '6f3e4d3878a8eeb506ff22dc19ef9016',
      url: '/images/footer-background.png',
    },
    {
      revision: '0b40dba579cef7312c7d198bebab9566',
      url: '/images/documents.jpg',
    },
    { revision: '5718c8874b2d4c12b87cbde522994bdd', url: '/images/doc.png' },
    {
      revision: 'c84878e01543bbea98e639fd6be55fe3',
      url: '/images/bg-footer.png',
    },
    { revision: '072cb0d9956b48f809513e8cc2291a07', url: '/images/TR.png' },
    {
      revision: 'cd9e3897d5f041f1b74821584f9d87c3',
      url: '/images/Little_DNA.png',
    },
    {
      revision: '06f92d273eccc3938c448f4faaf4f981',
      url: '/images/Heartbeat.json',
    },
    { revision: '6a0ae08987c14603e4903bf0d4cd7aca', url: '/images/Header.png' },
    {
      revision: 'b9ed3cdbb40c1c2d21fc4ca9cf8f2b5a',
      url: '/images/Background+HorizontalBorder.png',
    },
    {
      revision: 'c0ef9fbfb11bcaba14bdbe527818de77',
      url: '/images/speciality/img11.png',
    },
    {
      revision: '4cc3e90f4a9e3614e732721847b55c1b',
      url: '/images/speciality/img10.png',
    },
    {
      revision: '9c86e3cbcd313d0007b94426bfbd2d26',
      url: '/images/speciality/img09.png',
    },
    {
      revision: '0289adc471f150b46ef98b0b03ff6d3d',
      url: '/images/speciality/img08.png',
    },
    {
      revision: '81b777ed8ba3a8bc4b9858079ef5e5e2',
      url: '/images/speciality/img07.png',
    },
    {
      revision: 'd20031800309f192fff4a233102686d3',
      url: '/images/speciality/img06.png',
    },
    {
      revision: 'd1b98e9892dfbf17918db7d558c9f55b',
      url: '/images/speciality/img05.png',
    },
    {
      revision: 'e4461defae5ed234bf9c5ca8f5e1604e',
      url: '/images/speciality/img04.png',
    },
    {
      revision: '2944ca9b65a2d2c00239ef94887f4750',
      url: '/images/speciality/img03.png',
    },
    {
      revision: '1ebcfd3a053d0ec2987a67758be2ca40',
      url: '/images/speciality/img02.png',
    },
    {
      revision: '3fe380ce2618070e9874b88d698b3298',
      url: '/images/speciality/img01.png',
    },
    {
      revision: 'c818f74afcac35213977913081e1e17b',
      url: '/images/speciality/dermatology/dermatology.png',
    },
    {
      revision: '9c2019ccf7c5444560191b814514bd24',
      url: '/images/speciality/dermatology/Inflammatory⁄Autoimmune.png',
    },
    {
      revision: '85bb01169b4db4ca4ffdbeea30bf6e35',
      url: '/images/speciality/dermatology/Hair⁄Nails.png',
    },
    {
      revision: '4de788dd3028b74f75ab36cb841987d6',
      url: '/images/speciality/dermatology/Dermatopathology.png',
    },
    {
      revision: '250601ba73d7b534eead1b4985e7bbd7',
      url: '/images/speciality/dermatology/Cosmetic⁄Procedural.png',
    },
    {
      revision: '86668244a604bfd8353cd20bf0c7ee73',
      url: '/images/speciality/Urology/general.png',
    },
    {
      revision: '4d1fc0fa63b8a653da0818cf50c1f791',
      url: '/images/speciality/Urology/Transplant⁄Renal Medicine.png',
    },
    {
      revision: '3423234d7d9d5714c9c607e36810c921',
      url: '/images/speciality/Urology/Stones⁄Endourology.png',
    },
    {
      revision: '9315ff15eddbebbba6ee6c25e52ea929',
      url: '/images/speciality/Urology/Perioperative Medicine.png',
    },
    {
      revision: 'ae38f7a4718d2043d1229639b1130e57',
      url: '/images/speciality/Urology/Neurourology⁄Urodynamics.png',
    },
    {
      revision: '42703ea9a83aea41d470e7d3c2af68f9',
      url: '/images/speciality/Urology/Male Lower Urinary Tract.png',
    },
    {
      revision: '3ab95b4a5419709ad2cc054eda33e0f9',
      url: '/images/speciality/Urology/Female Pelvic Medicine.png',
    },
    {
      revision: 'c8061c056a737234406259cc2728e8b9',
      url: '/images/speciality/Urology/Andrology⁄Male Infertility.png',
    },
    {
      revision: '8699c5b7b381b460bc42ea0b8269b794',
      url: '/images/speciality/Psychiatry/Substance⁄Addiction.png',
    },
    {
      revision: '6fcbbbbea408e5c439c517429f2acc67',
      url: '/images/speciality/Psychiatry/Somatic⁄Eating Disorders.png',
    },
    {
      revision: '046544aca80495003df78a7129a931a1',
      url: '/images/speciality/Psychiatry/Psychotic Disorders.png',
    },
    {
      revision: '28766c1add9ed3f5c1efcbed0b6b58ac',
      url: '/images/speciality/Psychiatry/Psychotherapy⁄Neuromodulation .png',
    },
    {
      revision: '1513cef3a676aaa272d8c6642180fd51',
      url: '/images/speciality/Psychiatry/Personality⁄Behavioral Disorders.png',
    },
    {
      revision: '42321948dbf27db44603f7696e36792e',
      url: '/images/speciality/Psychiatry/Neurodevelopmental Disorders.png',
    },
    {
      revision: '6cc0b60d3a6fa2bc5a463ec7d7234a94',
      url: '/images/speciality/Psychiatry/Neurocognitive Disorders.png',
    },
    {
      revision: '66075b53716a23bbf9edef1a152495ac',
      url: '/images/speciality/Psychiatry/Mood Disorders.png',
    },
    {
      revision: '8ff3fa6c05b9cd945cf41abfeeba1975',
      url: '/images/speciality/Psychiatry/Emergency⁄Consultation Psychiatry.png',
    },
    {
      revision: 'b3ce57970a7a8454c855b4f287eccd66',
      url: '/images/speciality/Psychiatry/Assessment ⁄ Psychology.png',
    },
    {
      revision: 'd4ab734ee59afbade9d3d531648029fd',
      url: '/images/speciality/Psychiatry/Anxiety⁄OCD⁄Trauma.png',
    },
    {
      revision: '411ded92d1017fd4d2921afe909ca496',
      url: '/images/speciality/Plastic Surgery/Principles⁄Wound Reconstruction.png',
    },
    {
      revision: '42b3b6df361f645ae92421daf37beeff',
      url: '/images/speciality/Plastic Surgery/Perioperative Medicine.png',
    },
    {
      revision: '5da8ed704b110c1d48b718227d79d84d',
      url: '/images/speciality/Plastic Surgery/Microsurgery⁄Lymphatics.png',
    },
    {
      revision: 'd0804e162a63aaab993e918bdf35de31',
      url: '/images/speciality/Plastic Surgery/Hand⁄Peripheral Nerve.png',
    },
    {
      revision: '8fb0475b532126190a1b83012bd389d5',
      url: '/images/speciality/Plastic Surgery/Genitourinary⁄Gender-Affirming.png',
    },
    {
      revision: '9ccb9efb7c59c2ddc87772be71e542b6',
      url: '/images/speciality/Plastic Surgery/Facial Trauma.png',
    },
    {
      revision: '49666202fc93dcdbcd7304eb0a8eec80',
      url: '/images/speciality/Plastic Surgery/Facial Plastics⁄Reconstruction.png',
    },
    {
      revision: '552d196c449876cd57418c09d65c4be5',
      url: '/images/speciality/Plastic Surgery/Cleft⁄Craniofacial.png',
    },
    {
      revision: 'bb8e97e68d3d05c9d2f6322532d9be21',
      url: '/images/speciality/Plastic Surgery/Burns⁄Complex Wounds.png',
    },
    {
      revision: '7e0c50b129f6bb764633724ed722e0b5',
      url: '/images/speciality/Plastic Surgery/Breast.png',
    },
    {
      revision: '6a04d5171ce2ddbb09021034ce9b96a3',
      url: '/images/speciality/Plastic Surgery/Body Contouring⁄Aesthetics.png',
    },
    {
      revision: 'd48d9946568e4ad206e91aa7657ddb12',
      url: '/images/speciality/Pediatric Dentistry/Trauma.png',
    },
    {
      revision: '3e7bf78b8af69b035bfe0dc450325741',
      url: '/images/speciality/Pediatric Dentistry/Special Care ⁄ Disability.png',
    },
    {
      revision: '8cf2847eeaa77d9e3ba297eb4c49923a',
      url: '/images/speciality/Pediatric Dentistry/Sedation⁄Anesthesia.png',
    },
    {
      revision: '535e7f31222ddaba1b41c28341170ff3',
      url: '/images/speciality/Pediatric Dentistry/Restorative Dentistry.png',
    },
    {
      revision: '2cd275804e48547f315b801fdcff1263',
      url: '/images/speciality/Pediatric Dentistry/Pulp Therapy.png',
    },
    {
      revision: '9be077500cee36a9aef4742251566d18',
      url: '/images/speciality/Pediatric Dentistry/Prevention⁄Caries Management.png',
    },
    {
      revision: '8500ac6610b1195b1aec53433a7af34d',
      url: '/images/speciality/Pediatric Dentistry/Oral Pathology⁄Surgery.png',
    },
    {
      revision: '9adda86b5e0db36674f73e4ee1d3c378',
      url: '/images/speciality/Pediatric Dentistry/Occlusion⁄Space Management.png',
    },
    {
      revision: 'dc584fc473bc050f284a779a748cd1e0',
      url: '/images/speciality/Pediatric Dentistry/Medicine.png',
    },
    {
      revision: '382d25ee0aa67dae2a1b96770c7c0c73',
      url: '/images/speciality/Pediatric Dentistry/Growth⁄Development.png',
    },
    {
      revision: '86ea957a955748bfb40a1458cf1b6a3f',
      url: '/images/speciality/Pediatric Dentistry/Behavior Guidance.png',
    },
    {
      revision: 'd457fd3aeb956131a9b46d083325f9ee',
      url: '/images/speciality/Obstetrics and Gynecology/Urogynecology⁄Pelvic Floor.png',
    },
    {
      revision: 'a176c1319c57941d49b3d98d85da5adb',
      url: '/images/speciality/Obstetrics and Gynecology/Reproductive Endocrinology⁄Infertility.png',
    },
    {
      revision: '4eaa354a9d61d81328b2901d6ce91479',
      url: '/images/speciality/Obstetrics and Gynecology/Perioperative Medicine.png',
    },
    {
      revision: 'db63b0e270c60d09fc4c05dc997cbf6d',
      url: '/images/speciality/Obstetrics and Gynecology/Pediatric⁄Adolescent Gynecology.png',
    },
    {
      revision: 'daca8dde2796b80ae3128ba3ce310bd6',
      url: '/images/speciality/Obstetrics and Gynecology/Maternal-Fetal Medicine.png',
    },
    {
      revision: '94938592a86c56e588fe1d7ae9075024',
      url: '/images/speciality/Obstetrics and Gynecology/Gynecologic Oncology.png',
    },
    {
      revision: 'efd69d18c4548eb4df064e3f80fcf79f',
      url: '/images/speciality/Obstetrics and Gynecology/General Obstetrics.png',
    },
    {
      revision: '3f133d519a11da1651404cf02eb84faf',
      url: '/images/speciality/Obstetrics and Gynecology/Complex Family Planning.png',
    },
    {
      revision: 'f5fca5e71333d5eee0bab696aa9c3709',
      url: '/images/speciality/Obstetrics and Gynecology/Benign Gynecology⁄MIGS.png',
    },
    {
      revision: '26ba8745851854b48ce7c16d38e56560',
      url: '/images/speciality/Neurosurgery/Trauma⁄Neurocritical Care .png',
    },
    {
      revision: 'bb9ac9db66c40eaf9be9c3a646405400',
      url: '/images/speciality/Neurosurgery/Spine.png',
    },
    {
      revision: '3a1eadfd47bdc940a9f27698bc723dc5',
      url: '/images/speciality/Neurosurgery/Skull Base⁄Pituitary.png',
    },
    {
      revision: 'f418114bf576b8a863680de0f3e6ae62',
      url: '/images/speciality/Neurosurgery/Peripheral Nerve.png',
    },
    {
      revision: '87a9f8b102e51c99b6c18824297399ff',
      url: '/images/speciality/Neurosurgery/Perioperative Medicine.png',
    },
    {
      revision: 'e178b3f1d869568b0b703ad87a44cb25',
      url: '/images/speciality/Neurosurgery/Pediatric.png',
    },
    {
      revision: 'd94976ef51cafdfd47432112822fe479',
      url: '/images/speciality/Neurosurgery/Neuro-Oncology.png',
    },
    {
      revision: '2ac4debb3d4289a60653afa2eaba042d',
      url: '/images/speciality/Neurosurgery/General.png',
    },
    {
      revision: '8ee4d6dcb980f366f7de452688dff7ee',
      url: '/images/speciality/Neurosurgery/Functional⁄Epilepsy.png',
    },
    {
      revision: '8154a05c5e50fc2b0faa41e1d7118e9b',
      url: '/images/speciality/Neurosurgery/Cerebrovascular⁄Endovascular.png',
    },
    {
      revision: '5e6f78faf18f7f84bcf5fb92c1e84682',
      url: '/images/speciality/Neurosurgery/CSF⁄Hydrocephalus.png',
    },
    {
      revision: 'f32a1dc8e528eeebf62a5bc99a0ab120',
      url: '/images/speciality/Neurology/Vascular⁄Stroke.png',
    },
    {
      revision: 'e178b3f1d869568b0b703ad87a44cb25',
      url: '/images/speciality/Neurology/Pediatric⁄Neurogenetics.png',
    },
    {
      revision: '37d0ce0ddccbdbd87a2fc9be2ad15d28',
      url: '/images/speciality/Neurology/Neuromuscular⁄Autonomic.png',
    },
    {
      revision: '0e5909857171742412decef03545f633',
      url: '/images/speciality/Neurology/Neuroimmunology⁄Demyelinating.png',
    },
    {
      revision: 'e02fe21760da5d1313a053f380e275af',
      url: '/images/speciality/Neurology/Neurocritical Care.png',
    },
    {
      revision: 'a3e0e74dec42b7707b58028922d494c8',
      url: '/images/speciality/Neurology/Neuro-Ophthalmology⁄Vestibular.png',
    },
    {
      revision: 'cfec5fb659e3676ae1eddde587cbe15a',
      url: '/images/speciality/Neurology/Neuro-Oncology.png',
    },
    {
      revision: '57f43ab716f7e9302d4ce9f9e88f1f81',
      url: '/images/speciality/Neurology/Movement Disorders.png',
    },
    {
      revision: 'bf99b35e802a0372a2b11c5e1759b6fb',
      url: '/images/speciality/Neurology/Headache⁄Pain.png',
    },
    {
      revision: '11f45b5bc248d6601f592324fb796409',
      url: '/images/speciality/Neurology/Foundations⁄Localization.png',
    },
    {
      revision: 'a9599a1f2c909295ea890a5662a497e1',
      url: '/images/speciality/Neurology/Epilepsy⁄Neurophysiology.png',
    },
    {
      revision: '28556cc16c9d0a71d5a18243bb8e4a6e',
      url: '/images/speciality/Neurology/Cognitive⁄Behavioral.png',
    },
    {
      revision: '6500856ee547cb680af96c30d34fc542',
      url: '/images/speciality/General Surgery/vascular.png',
    },
    {
      revision: '27dc47d3d384adeb6cc0a511bed4bda7',
      url: '/images/speciality/General Surgery/Trauma, Acute Care & Critical Care.png',
    },
    {
      revision: '7aa0cc5e4af7a42b5522b701f1e84e9c',
      url: '/images/speciality/General Surgery/Transplant.png',
    },
    {
      revision: '4804c4ce927caddd93f15ace3a8b1fa8',
      url: '/images/speciality/General Surgery/Thoracic.png',
    },
    {
      revision: '735cb00e249837401eb17ed58069689a',
      url: '/images/speciality/General Surgery/Perioperative Medicine .png',
    },
    {
      revision: '842c0f91f1cb6c32bbd5344405b6eac6',
      url: '/images/speciality/General Surgery/Pediatric.png',
    },
    {
      revision: '7eccdb4dde6e74c43e5aba6379f2b328',
      url: '/images/speciality/General Surgery/MIS⁄Foregut.png',
    },
    {
      revision: '61f3b996be710645bf5414498fea6525',
      url: '/images/speciality/General Surgery/Hernia⁄Abdominal Wall.png',
    },
    {
      revision: 'd8c7f67fa7e18384fef79fe0be7bd8bd',
      url: '/images/speciality/General Surgery/Hepatopancreatobiliary.png',
    },
    {
      revision: '2dbb7267853310e54ddba006c33f0d54',
      url: '/images/speciality/General Surgery/General Surgery.png',
    },
    {
      revision: '9de93c3a29d696d1edb73700f542f4e6',
      url: '/images/speciality/General Surgery/Endocrine.png',
    },
    {
      revision: '67956201179cd394ba679b187ee96b7b',
      url: '/images/speciality/General Surgery/Colorectal.png',
    },
    {
      revision: 'b0e6ac3aaba42e16ad734de2e9ecb4a4',
      url: '/images/speciality/General Surgery/Breast.png',
    },
    {
      revision: '06f6446aa719355d5645f59f4a316d87',
      url: '/images/speciality/General Surgery/Bariatric⁄Metabolic.png',
    },
    {
      revision: '3ae217d80df1df6b32a759396de4851d',
      url: '/images/speciality/Endodontics/medicine.png',
    },
    {
      revision: 'fdf5cd79d79bd522693bbbd3ef5063f3',
      url: '/images/speciality/Endodontics/Vital Pulp Therapy⁄Regeneration.png',
    },
    {
      revision: 'b107c4d39f5af0391d13c5e0252b58c3',
      url: '/images/speciality/Endodontics/Treatment Planning⁄Prognosis.png',
    },
    {
      revision: '39323252b85bf24776f8f3ad4f52f155',
      url: '/images/speciality/Endodontics/Trauma⁄Resorption.png',
    },
    {
      revision: '0da77aeca7cf0e0a71bc3764552d7373',
      url: '/images/speciality/Endodontics/Surgical Endodontics.png',
    },
    {
      revision: '0d9f98089eee2dc8414f41732b54caaf',
      url: '/images/speciality/Endodontics/Retreatment⁄Complications.png',
    },
    {
      revision: '4e33acf0541a9c3ae66e056260558c2b',
      url: '/images/speciality/Endodontics/Restorative⁄Interdisciplinary.png',
    },
    {
      revision: 'c43fa3593aa092883e266f4f01ef00d6',
      url: '/images/speciality/Endodontics/Pulp Biology⁄Pathology.png',
    },
    {
      revision: 'd4fa9115a369c6ef8d52c1163ab6ada6',
      url: '/images/speciality/Endodontics/Pain⁄Anesthesia.png',
    },
    {
      revision: '1f97a4bf82c665740100cedfc006332e',
      url: '/images/speciality/Endodontics/Nonsurgical Treatment.png',
    },
    {
      revision: '064197ebd49dd43c65c368e4478639de',
      url: '/images/speciality/Endodontics/Endodontics.png',
    },
    {
      revision: '8bd2dc7148aa9b7e5e8a80d5da81dd76',
      url: '/images/speciality/Endodontics/Diagnosis⁄Imaging.png',
    },
    {
      revision: 'a52e70910456ea25f82edafd96ac54bf',
      url: '/images/speciality/ENT/thyroid⁄Parathyroid.png',
    },
    {
      revision: 'a93abde466792c84836adf9156e25143',
      url: '/images/speciality/ENT/sleep.png',
    },
    {
      revision: 'dea089dc80c5f677eaea5b6301f104dc',
      url: '/images/speciality/ENT/rhinology.png',
    },
    {
      revision: '8c027b03e6533d60e0f866fe3451ce42',
      url: '/images/speciality/ENT/reconstruction.png',
    },
    {
      revision: 'd0eb5b4eeeb43fcc182cba78a32d528e',
      url: '/images/speciality/ENT/pediatric.png',
    },
    {
      revision: '1e8f7f43aa36dff16b5b97c5885cfc90',
      url: '/images/speciality/ENT/otology.png',
    },
    {
      revision: 'a31d7b711c3d58af923a89d222ea16b5',
      url: '/images/speciality/ENT/otolaryngology.png',
    },
    {
      revision: '7ffd213853e08f82e4d585fe01a793b1',
      url: '/images/speciality/ENT/laryngology.png',
    },
    {
      revision: 'a0ba4a1e1b29caff99818f132cb999b6',
      url: '/images/speciality/ENT/Perioperative Medicine.png',
    },
    {
      revision: '721217c008a21cc3ba01278678db6cf8',
      url: '/images/speciality/ENT/Head⁄Neck Oncology.png',
    },
    {
      revision: 'a1e53b73a524884a133fc579174d0c2d',
      url: '/images/speciality/Anesthesiology/Regional Anesthesia⁄Acute Pain.png',
    },
    {
      revision: 'f3cb6ebd8f95f84c31b6d3b74b6d4260',
      url: '/images/speciality/Anesthesiology/Pediatric.png',
    },
    {
      revision: '6d068a0b99af017d62a35327ba871814',
      url: '/images/speciality/Anesthesiology/Obstetrics.png',
    },
    {
      revision: '65c9a9818a5dc51afbd699a4fe336dd2',
      url: '/images/speciality/Anesthesiology/Neuroanesthesia.png',
    },
    {
      revision: '6fcf8bad213b9fd8c45725132093bdec',
      url: '/images/speciality/Anesthesiology/General.png',
    },
    {
      revision: 'bb30ab99dff66e439f1fff7fb2b041e9',
      url: '/images/speciality/Anesthesiology/Critical Care ⁄ ICU.png',
    },
    {
      revision: 'e2c1b5757197f54224bba2b638c928e0',
      url: '/images/speciality/Anesthesiology/Cardiothoracic.png',
    },
    {
      revision: 'c7780d2ea7376e49c669faea16b65f64',
      url: '/images/speciality/Anesthesiology/Airway Management.png',
    },
    {
      revision: 'db8ece556c8638eb273a1f302c454a42',
      url: '/images/speciality/Anesthesiology/ Pain ⁄ Medicine.png',
    },
    {
      revision: 'aa783f751e4f0b4de5cde6ef6876aba1',
      url: '/images/settings/img01.png',
    },
    {
      revision: '81c5d30636da7dd59d4af846b0d13e7d',
      url: '/images/osm/osm.png',
    },
    {
      revision: '1e6ebf0adc2c2c73e8bf93d5aa0b7273',
      url: '/images/osm/img04.png',
    },
    {
      revision: '0b1ce2133e3d62b734ab2cb8071c6f1d',
      url: '/images/osm/img03.png',
    },
    {
      revision: '32bca92171ed8132da26aedc7ea74be2',
      url: '/images/osm/img02.png',
    },
    {
      revision: '99874105e0fdd67a2fb148f4e3da0223',
      url: '/images/osm/img01.png',
    },
    {
      revision: 'cf2274873d7b74769f094b3606c8b7cd',
      url: '/images/osm/elevate.png',
    },
    {
      revision: '1b59b4038e9a2826c018d7d54fa776b5',
      url: '/images/osm/banner.png',
    },
    {
      revision: '3079ec61736c6c7aa597b4815b4e1bc3',
      url: '/images/osm/TR Urology logo.png',
    },
    {
      revision: '0db6c9dff213844029a46c00585aa757',
      url: '/images/osm/TR Psychiatry logo.png',
    },
    {
      revision: '76f6af585469b3e4c5723ee3f0c684f5',
      url: '/images/osm/TR Plastic Surgery logo.png',
    },
    {
      revision: '3436541a0858399caa409695f99dfd08',
      url: '/images/osm/TR Physical Medicine _ Rehabilitation logo.png',
    },
    {
      revision: '2cdc2637fabac55ac32321a01e65af62',
      url: '/images/osm/TR Pediatrics logo.png',
    },
    {
      revision: 'ec0e3e11e171e4a2e18ec7ec480aa6fc',
      url: '/images/osm/TR Pediatric Dentistry logo.png',
    },
    {
      revision: '5ee3240553f7d966ba74b8fbcfcf7ad3',
      url: '/images/osm/TR Orthodontics logo.png',
    },
    {
      revision: '9f3c9fd4042dee3843af54d720b596ab',
      url: '/images/osm/TR Ophthalmology logo.png',
    },
    {
      revision: 'ac11b934b8fe14ef2ea37302953d1654',
      url: '/images/osm/TR Obstetrics and Gynecology logo.png',
    },
    {
      revision: '0225a706c25efd7e7d4848d2de1cb669',
      url: '/images/osm/TR Neurosurgery logo.png',
    },
    {
      revision: 'b9cdfb1500794f613759adcd04430d08',
      url: '/images/osm/TR Neurology logo.png',
    },
    {
      revision: '5fe7075ac0a7244ff19e74033c9cf1b2',
      url: '/images/osm/TR Internal Medicine logo.png',
    },
    {
      revision: '1ac32bf1f948952314f65cae29bb8d9c',
      url: '/images/osm/TR General Surgery logo.png',
    },
    {
      revision: '3bab5b5dae0dadd4d7f862cad7ee7e7c',
      url: '/images/osm/TR Family Medicine logo.png',
    },
    {
      revision: '71bbe62ffcccf52f5d752674c32a6c02',
      url: '/images/osm/TR Endodontics logo.png',
    },
    {
      revision: '063705a664a1d72b9d2db8d19c4bb6bd',
      url: '/images/osm/TR Emergency Medicine logo.png',
    },
    {
      revision: 'f361738d0c75e17a8e1fa93b7a9c02db',
      url: '/images/osm/TR ENT logo.png',
    },
    {
      revision: '3d3b485e7aa147ed408c062460fda13c',
      url: '/images/osm/TR Dermatology logo2.png',
    },
    {
      revision: '3d3b485e7aa147ed408c062460fda13c',
      url: '/images/osm/TR Dermatology logo.png',
    },
    {
      revision: 'd797c93f46f13d53e3d34b1e6a8748b5',
      url: '/images/osm/TR Anesthesiology logo.png',
    },
    {
      revision: '4d4a5451cbf5a1a46f9801eff84b531d',
      url: '/images/function/img06.png',
    },
    {
      revision: '2fcb630c7fbd88e0160013a877d20b5b',
      url: '/images/function/img04.png',
    },
    {
      revision: '14e203f52fc1994b2c5b74f51f8f18aa',
      url: '/images/function/img03.png',
    },
    {
      revision: '99874105e0fdd67a2fb148f4e3da0223',
      url: '/images/function/img02.png',
    },
    {
      revision: 'b28d1feed2a737cb72b15afff26249ef',
      url: '/images/function/img01.png',
    },
    {
      revision: '82cd272f55ec3319e4a5e338db4bc2b5',
      url: '/images/error/success.svg',
    },
    {
      revision: '1baefc47c2b7f4aec6695cf22136607b',
      url: '/images/error/success-dark.svg',
    },
    {
      revision: 'a4e5961e553c4b9f51611a8f8bf5008b',
      url: '/images/error/maintenance.svg',
    },
    {
      revision: 'a6bbc1b90bb022a7b0828f8b665be273',
      url: '/images/error/maintenance-dark.svg',
    },
    {
      revision: '313ba928ca4e41588ed456a74a9d0bbc',
      url: '/images/error/grid-01.svg',
    },
    {
      revision: '8d65c1c308bf90e2e3011a1386c9fe9e',
      url: '/images/error/503.svg',
    },
    {
      revision: '6793e8ed5c368b84da04d0920816bad1',
      url: '/images/error/503-dark.svg',
    },
    {
      revision: '686a544b5e77449b9d0a65c1f5de41eb',
      url: '/images/error/500.svg',
    },
    {
      revision: '134222aa3a6cf8b3160f8dbf1b1f728e',
      url: '/images/error/500-dark.svg',
    },
    {
      revision: '6b18fd47b77d70989a13392c059585cb',
      url: '/images/error/4040.png',
    },
    {
      revision: '3d9db6ca82e16e2697d2abf54f0c0813',
      url: '/images/error/404.svg',
    },
    {
      revision: 'f028ed2a1f11700d14f698a64432925e',
      url: '/images/error/404.png',
    },
    {
      revision: 'fb9f1f25421a5013428ad1c8671206b8',
      url: '/images/error/404-dark.svg',
    },
    {
      revision: '88a16c5b9d5339126fd7b75eb1065b23',
      url: '/images/elevate/img04.png',
    },
    {
      revision: '6b4e3f42322b58fd272a45e9233317b4',
      url: '/images/elevate/img03.png',
    },
    {
      revision: 'fca1ba79fafaf86d4d482578c1be3359',
      url: '/images/elevate/img02.png',
    },
    {
      revision: '07c731be572a276680e8acd731fb1480',
      url: '/images/elevate/img01.png',
    },
    {
      revision: '807d590844123b8f5d9dd886c3573d5f',
      url: '/images/elevate/bg.png',
    },
    {
      revision: '6f3e4d3878a8eeb506ff22dc19ef9016',
      url: '/images/elevate/background.png',
    },
    {
      revision: 'ca5509a924a7601bd05bbc8a914e37cb',
      url: '/images/elevate/Vector.png',
    },
    {
      revision: '17def5410c0e1c3b0358df00c4ed72a1',
      url: '/images/elevate/Ellipse05.png',
    },
    {
      revision: '3a659af5970d7a7fb90f2accd778c9da',
      url: '/images/elevate/Ellipse03.png',
    },
    {
      revision: '96dd651344421cc10d4f54daf0a28100',
      url: '/images/elevate/Ellipse02.png',
    },
    {
      revision: '56b031f69ea79a7530273bd26d2ba38b',
      url: '/images/elevate/Ellipse01.png',
    },
    {
      revision: '6549b773b8f2c6f79bdb28a392204d0b',
      url: '/images/details/heartbit02.png',
    },
    {
      revision: '9c9b9b9748214b9cf7433600efa328dc',
      url: '/images/details/heartbit.png',
    },
    {
      revision: '3f3a23692eaf3b2626269c1370ca86ad',
      url: '/images/dashboard/statistics.png',
    },
    {
      revision: '6cf6704d40457b29432dc0dc0fa43fce',
      url: '/images/dashboard/img33.png',
    },
    {
      revision: 'bab0aa2d767a1c4b0cc95610ceb7fcad',
      url: '/images/dashboard/img16.png',
    },
    {
      revision: '96c9f64806fb10d2fe38af1bd259026c',
      url: '/images/dashboard/img12.png',
    },
    {
      revision: '600b0ced92e8d3b4722b3fd244d62b15',
      url: '/images/dashboard/img11.png',
    },
    {
      revision: '7ec666d3a413c0c192f30fbd7d784917',
      url: '/images/dashboard/img10.png',
    },
    {
      revision: '5d59a27fbad5669e2b9e79a4ae5673bb',
      url: '/images/dashboard/img09.png',
    },
    {
      revision: 'a9a8f3f768c46d53f9cf44f9926d7507',
      url: '/images/dashboard/img08.png',
    },
    {
      revision: '344dc4418b4d1d38c16f820a0d7e1880',
      url: '/images/dashboard/img07.png',
    },
    {
      revision: 'e8421729a351faab798c13917a583f11',
      url: '/images/dashboard/img06.png',
    },
    {
      revision: '6a45e14beea2697e1c19c9290b0bb6d8',
      url: '/images/dashboard/img05.png',
    },
    {
      revision: 'dbdc9836bd2ef5367d9fae3847a8864d',
      url: '/images/dashboard/img04.png',
    },
    {
      revision: 'cc177ff958d81d2e8a4f3a84c7c16875',
      url: '/images/dashboard/img03.png',
    },
    {
      revision: '694cff19d9be2b91da592864eaff0a41',
      url: '/images/dashboard/img02.png',
    },
    {
      revision: '7cdd14c4f9604e02d9ff3b1d66da7ccd',
      url: '/images/dashboard/img01.png',
    },
    {
      revision: '56a5dbcac5f5be8a4f4614d78dfc850f',
      url: '/images/dashboard/img008.png',
    },
    {
      revision: 'bdd9589d8ee022070d809395b748c5ac',
      url: '/images/dashboard/img007.png',
    },
    {
      revision: 'd1a6d9389c435efdde240557867a0f08',
      url: '/images/dashboard/img0008.png',
    },
    {
      revision: 'f45b6d8abcfce2aa0dbbe4b85cc0a798',
      url: '/images/dashboard/img00008.png',
    },
    {
      revision: 'd03942dc099acae9367ae07c4028a2f5',
      url: '/images/dashboard/doctor.png',
    },
    {
      revision: 'fa3a1f9743560db9715334b2b193ccc6',
      url: '/images/dashboard/topbar/message.png',
    },
    {
      revision: '370e1dfca228e53c42b5eb0d8f15a43b',
      url: '/images/dashboard/topbar/doctor.png',
    },
    {
      revision: 'df5ba86f8dcf1e3ab81f1ad2cc42ec99',
      url: '/images/dashboard/topbar/bell.png',
    },
    {
      revision: 'e1021985967cd5f56b343b373f7edc4b',
      url: '/images/dashboard/test/img05.png',
    },
    {
      revision: '07d12a8259491897ad0fef792952a096',
      url: '/images/dashboard/test/img04.png',
    },
    {
      revision: 'd7058484c9eac5bba461946d7b605154',
      url: '/images/dashboard/test/img002.png',
    },
    {
      revision: '585eb2b61a6cff815de73f833c199d54',
      url: '/images/dashboard/test/img001.png',
    },
    {
      revision: '3f3a23692eaf3b2626269c1370ca86ad',
      url: '/images/dashboard/statistics/statistics.png',
    },
    {
      revision: '4c6c819cbf60656056edadcb77413190',
      url: '/images/dashboard/statistics/img12.png',
    },
    {
      revision: 'b4eb80f68368ec369f094e488c6eb997',
      url: '/images/dashboard/statistics/img11.png',
    },
    {
      revision: '25599eaa9beb881bcf7e38615c6c76b8',
      url: '/images/dashboard/statistics/img10.png',
    },
    {
      revision: '70823ed8b668fb26b719d4d70673a746',
      url: '/images/dashboard/statistics/img09.png',
    },
    {
      revision: '527095b8fc621f606b1daa7cbf808334',
      url: '/images/dashboard/statistics/img08.png',
    },
    {
      revision: '82c148f72ddf981cdc9cc508fdd2bc31',
      url: '/images/dashboard/statistics/img07.png',
    },
    {
      revision: '067017d2e2e3eaade038417259f7ad8f',
      url: '/images/dashboard/statistics/img06.png',
    },
    {
      revision: 'cfb78fa2f608869e7fb93191778c788c',
      url: '/images/dashboard/statistics/img05.png',
    },
    {
      revision: '540aeec46ccb148d3e87d714499429c5',
      url: '/images/dashboard/statistics/img04.png',
    },
    {
      revision: 'e9934084e1b3d340e469ff993f52d68a',
      url: '/images/dashboard/statistics/img03.png',
    },
    {
      revision: 'b7ffefb33cc8137daab9224af2800c3d',
      url: '/images/dashboard/statistics/img02.png',
    },
    {
      revision: '2327d2ae61fa1f20fd7283c99f159071',
      url: '/images/dashboard/statistics/img01.png',
    },
    {
      revision: '90421ea8cde6b2df7591b9061c69d33e',
      url: '/images/dashboard/profile/plus02.png',
    },
    {
      revision: 'd3f457efaaddf98f73121c20c6f356b8',
      url: '/images/dashboard/profile/plus.png',
    },
    {
      revision: 'aa783f751e4f0b4de5cde6ef6876aba1',
      url: '/images/dashboard/profile/img01.png',
    },
    {
      revision: '96252727de8e7baafd517143c80f39c9',
      url: '/images/dashboard/notification/doc-06.png',
    },
    {
      revision: 'a1ab5a81432755742e6c090da4173369',
      url: '/images/dashboard/notification/doc-05.png',
    },
    {
      revision: '5718c8874b2d4c12b87cbde522994bdd',
      url: '/images/dashboard/notification/doc-04.png',
    },
    {
      revision: '94084de60176e24ed24c5bc6a2c6c3ab',
      url: '/images/dashboard/notification/doc-03.png',
    },
    {
      revision: '9f8b24e053586c30978acf17a6f0e948',
      url: '/images/dashboard/notification/doc-02.png',
    },
    {
      revision: 'e83afff554dfbb069a1d9bee139d23d6',
      url: '/images/dashboard/notification/doc-01.png',
    },
    {
      revision: '0d8f9a95fec3580eb5b5e52d46ce1977',
      url: '/images/dashboard/message/me.png',
    },
    {
      revision: 'd03942dc099acae9367ae07c4028a2f5',
      url: '/images/dashboard/message/doctor.png',
    },
    {
      revision: '77a84f452f9921f30d0403f7e73be62e',
      url: '/images/dashboard/main_dashboard/tr.png',
    },
    {
      revision: '2cf5db140fe0acd007a2a0fff2a9bcea',
      url: '/images/dashboard/main_dashboard/qns.png',
    },
    {
      revision: '8b77002e161df1579995cfb4d90b5dd3',
      url: '/images/dashboard/main_dashboard/img45.png',
    },
    {
      revision: '7517f608b576e52de3589e40a5d25b13',
      url: '/images/dashboard/main_dashboard/img01.png',
    },
    {
      revision: 'c56bb629f1a74e989c5e3ad3ec3bf426',
      url: '/images/dashboard/main_dashboard/doctor.png',
    },
    {
      revision: '370e1dfca228e53c42b5eb0d8f15a43b',
      url: '/images/dashboard/main_dashboard/doc04.png',
    },
    {
      revision: '188b23a1f468fa6379751aaf0f634a2e',
      url: '/images/dashboard/main_dashboard/doc03.png',
    },
    {
      revision: 'ffc57df64c82addb2bdb793b35553899',
      url: '/images/dashboard/main_dashboard/doc02.png',
    },
    {
      revision: 'ebc42de9f2925b36fcc4e15354aa9958',
      url: '/images/dashboard/main_dashboard/doc01.png',
    },
    {
      revision: '529b37c8f356d19109037acd7ef1c4c7',
      url: '/images/dashboard/main_dashboard/doc.png',
    },
    {
      revision: '709989b05160ee3a166868356ab6235f',
      url: '/images/dashboard/main_dashboard/card03.png',
    },
    {
      revision: '5f524b6f655ffd81331e774f0f2b1a15',
      url: '/images/dashboard/main_dashboard/card02.png',
    },
    {
      revision: 'fdf1f005cee74faccac2ce27a6a11bbe',
      url: '/images/dashboard/main_dashboard/card01.png',
    },
    {
      revision: '321c0b16f5f0898ab02620790ce3ae80',
      url: '/images/dashboard/main_dashboard/card003.png',
    },
    {
      revision: 'e55dde0b6b187ba19ed2133320173dc1',
      url: '/images/dashboard/main_dashboard/card002.png',
    },
    {
      revision: 'a4d29cede0d8c70436551395560b5adc',
      url: '/images/dashboard/main_dashboard/card001.png',
    },
    {
      revision: 'fcefefdeeffc79e6ad9ed87463462d99',
      url: '/images/dashboard/main_dashboard/answer.png',
    },
    {
      revision: 'a1eb8c688e39f894d5b25117b4de7a41',
      url: '/images/dashboard/leaderboard/rank-3.png',
    },
    {
      revision: '13407e2d85d050bbe72e147805943e09',
      url: '/images/dashboard/leaderboard/rank-2.png',
    },
    {
      revision: '3494838138f4d9a1079effb4fe1682ba',
      url: '/images/dashboard/leaderboard/rank-1.png',
    },
    {
      revision: 'eac07353466356f92d5168b734e5ed6d',
      url: '/images/dashboard/leaderboard/location.png',
    },
    {
      revision: '515d949adb91351c46b9bddc44220546',
      url: '/images/dashboard/leaderboard/img01.png',
    },
    {
      revision: 'afc38d658bf760a899f2f8a0f5d19c49',
      url: '/images/dashboard/leaderboard/Group01.png',
    },
    {
      revision: '551a85c81c42050fb6b48ab5c1a10678',
      url: '/images/dashboard/leaderboard/Frame03.png',
    },
    {
      revision: '245f3e519f6e16ded3f1d9452e169c23',
      url: '/images/dashboard/leaderboard/Frame02.png',
    },
    {
      revision: '7933350724569c4107b2e74b14c5c91b',
      url: '/images/dashboard/leaderboard/Frame.png',
    },
    {
      revision: '70f6cd8b4a543c32feba4d1d4b425fe2',
      url: '/images/dashboard/Admin/img04.png',
    },
    {
      revision: 'f9a22ec82238ebf8b13a32b191c26786',
      url: '/images/dashboard/Admin/img03.png',
    },
    {
      revision: '82e8d8c2f2ffd123153c26eaeac04c4b',
      url: '/images/dashboard/Admin/img02.png',
    },
    {
      revision: '69eff36fc4f666847ccfb68cc3222539',
      url: '/images/dashboard/Admin/img01.png',
    },
    {
      revision: '0b7fe242392fcbc250d13ed1d30efbc4',
      url: '/images/dashboard/Admin/admin.png',
    },
    {
      revision: '1f3ef9fbc014debf5b375de337a5ba37',
      url: '/images/contact/TR.png',
    },
    {
      revision: '87dde5ab1226ed9dd34b07b2c0487a0f',
      url: '/images/auth/stethoscope.png',
    },
    {
      revision: '08f0cd88b6ebbd63d936acc31906040d',
      url: '/images/auth/logo.png',
    },
    {
      revision: '20d4760ead4b875353c6ba0a3483b885',
      url: '/icons/maskable-512.png',
    },
    {
      revision: '95d09bb122f9e3e9d3fbfa125635358d',
      url: '/icons/maskable-192.png',
    },
    { revision: '3e31987b8fd6b590801cea0e9c968bb5', url: '/icons/icon.svg' },
    {
      revision: 'b80a38e83c2ec34286b75e2212afdf8f',
      url: '/icons/icon-512.png',
    },
    {
      revision: 'c779c2062c66b39ec37cc651ffff6e8b',
      url: '/icons/icon-192.png',
    },
    { revision: 'cbf7dd379600de0c876d414aa7df7a31', url: '/icons/favicon.ico' },
    {
      revision: 'e560abc5277d07238e57759e4f0150c8',
      url: '/icons/apple-touch-icon.png',
    },
    {
      revision: 'e0cff11bcf427780f018b6cba519a42c',
      url: '/data/test-history.json',
    },
    { revision: 'c478fc32468c1982b7956d46f79eb08d', url: '/data/stats.json' },
    {
      revision: '1a337e675d0d448cc21979c8f20b419b',
      url: '/data/statistics.json',
    },
    {
      revision: '1a46e9cf88095616e91fda68db7ba62b',
      url: '/data/leadership-stat.json',
    },
    {
      revision: '2f09d9f0c1de40e766c3f23aa4718872',
      url: '/data/help-support.json',
    },
    {
      revision: '23c7a1f1032a46f8678ba02708dd22ff',
      url: '/data/features.json',
    },
    {
      revision: 'a99dc3da6b625ae0b58add4d5f3ab2e3',
      url: '/data/colleagues.json',
    },
    {
      revision: null,
      url: '/_next/static/media/marker-icon.0i9~u_difxrfa.png',
    },
    { revision: null, url: '/_next/static/media/layers.1220hx8ja1.sy.png' },
    { revision: null, url: '/_next/static/media/layers-2x.0olxl6i2vnf_c.png' },
    {
      revision: null,
      url: '/_next/static/media/fba5a26ea33df6a3-s.p.0eehd8tgys7nv.woff2',
    },
    { revision: null, url: '/_next/static/media/favicon.0w.lsto3tnnws.ico' },
    {
      revision: null,
      url: '/_next/static/media/fad568eea626db0e-s.04s-lri-1fnua.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/f7d6090e8b3debad-s.00qosz~21_9iq.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/e6c3b2b7c3a61f79-s.0akjet91qu_z..woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/e629b5bc06499d58-s.0b_~8bw~gzh90.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/e557826f452dbd06-s.0m_.8nb7sv3tq.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/e4505858a30c79c2-s.p.093j32h9etvau.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/d3fe2f289711ac3f-s.0i6ci0u~g4zml.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/ce62453a442c7f35-s.p.0333ktddfbsxy.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/ccee61546c0358b7-s.17kgvx8~8.fj6.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/bfc7db5c00d21bc5-s.0dyk20wuvya7a.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/b35b0dbffda7f2c4-s.0fu677rwbv-.g.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/b2ea385cb5ae8625-s.0kjod.kaq1k69.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/ad66f9afd8947f86-s.11u06r12fd6v_.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/a343f882a40d2cc9-s.p.0kho-wj7-y-w1.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/a342834df7752944-s.10ev4cu2inrn-.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/a0ffaa6a9384d9d3-s.0rpo5i9-tpup~.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/9d30e1ac529a223a-s.16h94gcaft.36.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/9c72aa0f40e4eef8-s.0m6w47a4e5dy9.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/9056bf441d45cedc-s.06okiszhq3vzf.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/8fcf71678f67d0c5-s.0kn0u2cosumsr.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/83afe278b6a6bb3c-s.p.0q-301v4kxxnr.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/6ab0db14f70d8ed6-s.0ctuso5mgh_i..woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/62d4b50592542c9f-s.0id408x23fv8q.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/58c4895d0a0ef7cc-s.0x1a9yg0jkq20.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/572c13468b8cff87-s.0k68dgt5gi4w6.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/5476f68d60460930-s.0wxq9webf.ew4.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/38772d1e0cde909c-s.06sf8d84-9n3w.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/2c55a0e60120577a-s.0bjc5tiuqdqro.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/2bbe8d2671613f1f-s.067x_6k0k23tk.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/1e219c03c996efbd-s.0vlx5hthn2t7i.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/1bffadaabf893a1e-s.16ipb6fqu393i.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/1b99372b3eaef0c8-s.p.0gx2haw2tmll8.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/1a099d89ee94ee96-s.0_qb~~5cn13jl.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/1497d94d4ac5c969-s.0zw8maj75452d.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/0fec32c78403d184-s.0clmy8uas2o02.woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/0b1dc8ddaa74ba49-s.04o39dzmj.ey..woff2',
    },
    {
      revision: null,
      url: '/_next/static/media/03bda585a99c6450-s.p.0zzh68k1~whtc.woff2',
    },
    { revision: null, url: '/_next/static/chunks/turbopack-172i1drjfp9e8.js' },
    { revision: null, url: '/_next/static/chunks/17u52a.wwkeb_.js' },
    { revision: null, url: '/_next/static/chunks/17tsyiwhi45xg.css' },
    { revision: null, url: '/_next/static/chunks/16k0g7kt~whml.js' },
    { revision: null, url: '/_next/static/chunks/15tgrg9xe-a94.js' },
    { revision: null, url: '/_next/static/chunks/15p9k.d-jg5t..js' },
    { revision: null, url: '/_next/static/chunks/13795r~~-usb_.js' },
    { revision: null, url: '/_next/static/chunks/11zq49daay3s5.js' },
    { revision: null, url: '/_next/static/chunks/11zns0~76s1in.js' },
    { revision: null, url: '/_next/static/chunks/11mhi7uxdanmg.css' },
    { revision: null, url: '/_next/static/chunks/11j4.qo_t9aa..js' },
    { revision: null, url: '/_next/static/chunks/11.6ao4js2dpn.js' },
    { revision: null, url: '/_next/static/chunks/10~x95jhs6ns3.js' },
    { revision: null, url: '/_next/static/chunks/10_y~3djroegl.js' },
    { revision: null, url: '/_next/static/chunks/0~0h1ljt15gbx.js' },
    { revision: null, url: '/_next/static/chunks/0zh06eaok.d98.js' },
    { revision: null, url: '/_next/static/chunks/0z-s_m-52xwhc.js' },
    { revision: null, url: '/_next/static/chunks/0yk19nyztokt~.js' },
    { revision: null, url: '/_next/static/chunks/0yb2wil16uz6h.js' },
    { revision: null, url: '/_next/static/chunks/0xzldz3onjkbk.js' },
    { revision: null, url: '/_next/static/chunks/0xuez72~z4~wq.js' },
    { revision: null, url: '/_next/static/chunks/0xmkxg7-nvgzd.js' },
    { revision: null, url: '/_next/static/chunks/0xlov7as0j21e.js' },
    { revision: null, url: '/_next/static/chunks/0vtkk13zi8tnp.js' },
    { revision: null, url: '/_next/static/chunks/0vqi.z_1oyu7i.js' },
    { revision: null, url: '/_next/static/chunks/0uo_x4f2cz2pd.js' },
    { revision: null, url: '/_next/static/chunks/0uf1ekyfejh9k.js' },
    { revision: null, url: '/_next/static/chunks/0tvvmvy.2xiqc.js' },
    { revision: null, url: '/_next/static/chunks/0tuqdikt56.~1.js' },
    { revision: null, url: '/_next/static/chunks/0tmmdnju3qz89.js' },
    { revision: null, url: '/_next/static/chunks/0t48hzs_6fshe.css' },
    { revision: null, url: '/_next/static/chunks/0si_7glw0qala.js' },
    { revision: null, url: '/_next/static/chunks/0seufd_f3zo87.js' },
    { revision: null, url: '/_next/static/chunks/0sc6w1wk6z40b.js' },
    { revision: null, url: '/_next/static/chunks/0s08~rb.1qbsy.js' },
    { revision: null, url: '/_next/static/chunks/0rei8iuccnezz.js' },
    { revision: null, url: '/_next/static/chunks/0r8.heduv_8~k.js' },
    { revision: null, url: '/_next/static/chunks/0r5wxr5h6znjr.js' },
    { revision: null, url: '/_next/static/chunks/0qzfvnigf4oek.js' },
    { revision: null, url: '/_next/static/chunks/0pqt~8bl3ukh4.js' },
    { revision: null, url: '/_next/static/chunks/0nw.wmtb6w8s-.js' },
    { revision: null, url: '/_next/static/chunks/0mjfm_eujhog_.js' },
    { revision: null, url: '/_next/static/chunks/0mhmvr5fpg8k3.js' },
    { revision: null, url: '/_next/static/chunks/0lrs_naw2wjzr.js' },
    { revision: null, url: '/_next/static/chunks/0laqcn_k98hk9.js' },
    { revision: null, url: '/_next/static/chunks/0l-4qkc1xa2ih.js' },
    { revision: null, url: '/_next/static/chunks/0kt21tg3zaab3.js' },
    { revision: null, url: '/_next/static/chunks/0klpyve0fzjs1.js' },
    { revision: null, url: '/_next/static/chunks/0ke3tg~1zgumo.js' },
    { revision: null, url: '/_next/static/chunks/0kd2fiwchdadx.js' },
    { revision: null, url: '/_next/static/chunks/0k63444or8hpt.js' },
    { revision: null, url: '/_next/static/chunks/0k2eh~rwj8_po.js' },
    { revision: null, url: '/_next/static/chunks/0iqicjgl5-myz.js' },
    { revision: null, url: '/_next/static/chunks/0ip-flrhztr38.js' },
    { revision: null, url: '/_next/static/chunks/0i.-dj37l~g~3.js' },
    { revision: null, url: '/_next/static/chunks/0hphsegbv19nj.js' },
    { revision: null, url: '/_next/static/chunks/0hfg8ayql6f15.js' },
    { revision: null, url: '/_next/static/chunks/0gq4r_gqwljhw.js' },
    { revision: null, url: '/_next/static/chunks/0ge6rjw3zvm1i.js' },
    { revision: null, url: '/_next/static/chunks/0fgzr9y6yn0sy.js' },
    { revision: null, url: '/_next/static/chunks/0e6l0tpnwl77i.js' },
    { revision: null, url: '/_next/static/chunks/0e3kuq2rv~gd5.js' },
    { revision: null, url: '/_next/static/chunks/0c~qzj981k1nj.js' },
    { revision: null, url: '/_next/static/chunks/0ckol~d-sutq_.js' },
    { revision: null, url: '/_next/static/chunks/0cadhbo4lu_iy.js' },
    { revision: null, url: '/_next/static/chunks/0bnzeu3d-v.dd.js' },
    { revision: null, url: '/_next/static/chunks/0blu_hps24lp9.js' },
    { revision: null, url: '/_next/static/chunks/0bcwpyag5ruqz.js' },
    { revision: null, url: '/_next/static/chunks/0asbkc9zzw8ar.js' },
    { revision: null, url: '/_next/static/chunks/0_g3mt.ny8cx2.js' },
    { revision: null, url: '/_next/static/chunks/0_1z.gn86d0tf.js' },
    { revision: null, url: '/_next/static/chunks/0_0e~r~~.h70x.js' },
    { revision: null, url: '/_next/static/chunks/09w3uh_by5hht.js' },
    { revision: null, url: '/_next/static/chunks/09w1118cbx2d4.js' },
    { revision: null, url: '/_next/static/chunks/08stn3a4skcmz.js' },
    { revision: null, url: '/_next/static/chunks/0838_5zsfwebq.js' },
    { revision: null, url: '/_next/static/chunks/07oehvf63b4os.js' },
    { revision: null, url: '/_next/static/chunks/06mhnv-yfno7h.js' },
    { revision: null, url: '/_next/static/chunks/06gf03f.naaof.js' },
    { revision: null, url: '/_next/static/chunks/056ebb9oom2rd.js' },
    { revision: null, url: '/_next/static/chunks/03~yq9q893hmn.js' },
    { revision: null, url: '/_next/static/chunks/02d3tgq13~7zm.js' },
    { revision: null, url: '/_next/static/chunks/01xlw8hd842-c.js' },
    { revision: null, url: '/_next/static/chunks/0178a6mtah7i0.js' },
    { revision: null, url: '/_next/static/chunks/00xk3w.qs9p2r.js' },
    { revision: null, url: '/_next/static/chunks/0.ogt9h43_ph8.js' },
    { revision: null, url: '/_next/static/chunks/0.m4k8gt~~jxp.js' },
    { revision: null, url: '/_next/static/chunks/0.gm3xoxv60qu.js' },
    { revision: null, url: '/_next/static/chunks/0.f_4~0wrwq_7.js' },
    { revision: null, url: '/_next/static/chunks/0-~ovskle.5.w.js' },
    { revision: null, url: '/_next/static/chunks/0-0rk_w3u3.t5.js' },
    {
      revision: null,
      url: '/_next/static/Da6g9byOmfXJysKy9lAG7/_ssgManifest.js',
    },
    {
      revision: null,
      url: '/_next/static/Da6g9byOmfXJysKy9lAG7/_clientMiddlewareManifest.js',
    },
    {
      revision: null,
      url: '/_next/static/Da6g9byOmfXJysKy9lAG7/_buildManifest.js',
    },
  ]);
  me();
  var K = '',
    te = '';
  try {
    let r = new URL('https://backend.tablerounds.ai/api');
    ((K = r.origin), (te = r.pathname.replace(/\/+$/, '')));
  } catch {}
  function Fe(r) {
    return K && r.origin === K
      ? r.pathname.startsWith(te || '/')
      : r.origin === self.location.origin && r.pathname.startsWith('/api/');
  }
  function ct(r) {
    return r.origin === K && te
      ? r.pathname.slice(te.length) || '/'
      : r.pathname.replace(/^\/api/, '') || '/';
  }
  if (K) {
    let r = new I();
    for (let e of ['POST', 'PUT', 'PATCH', 'DELETE'])
      y(({ url: t }) => Fe(t), r, e);
  }
  var lt = new RegExp(
    '^/(?:profile(?:/(?:stats|connections|discover))?|test/(?:question-count|histories-stats|histories)|statistic|leaderboard(?:/map-data)?|admin/help)/?$',
  );
  y(
    ({ url: r }) => Fe(r) && lt.test(ct(r)),
    new k({
      cacheName: at,
      networkTimeoutSeconds: 5,
      plugins: [
        new N({ statuses: [200] }),
        new b({
          maxEntries: 100,
          maxAgeSeconds: 10080 * 60,
          purgeOnQuotaError: !0,
        }),
      ],
    }),
    'GET',
  );
  y(
    ({ url: r, request: e }) =>
      e.method === 'GET' &&
      (r.origin === self.location.origin ||
        r.origin === 'https://fonts.gstatic.com') &&
      /\.(?:woff2?|ttf|otf)$/i.test(r.pathname),
    new v({
      cacheName: nt,
      plugins: [
        new N({ statuses: [0, 200] }),
        new b({
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
          purgeOnQuotaError: !0,
        }),
      ],
    }),
  );
  y(
    ({ url: r, request: e }) =>
      r.origin === self.location.origin &&
      e.method === 'GET' &&
      (/\.(?:png|jpe?g|gif|webp|avif|ico|svg)$/i.test(r.pathname) ||
        r.pathname.startsWith('/_next/image')),
    new v({
      cacheName: st,
      plugins: [
        new N({ statuses: [200] }),
        new b({
          maxEntries: 60,
          maxAgeSeconds: 720 * 60 * 60,
          purgeOnQuotaError: !0,
        }),
      ],
    }),
  );
  _e();
  var ut = new k({
    cacheName: We,
    networkTimeoutSeconds: 4,
    plugins: [
      new N({ statuses: [200] }),
      new b({
        maxEntries: 30,
        maxAgeSeconds: 10080 * 60,
        purgeOnQuotaError: !0,
      }),
    ],
  });
  async function pt(r) {
    let e = r.event,
      t = r.request,
      o;
    try {
      o = await ut.handle({ event: e, request: t });
    } catch {}
    if (o) return o;
    try {
      let s = await de(it);
      if (s) return s;
    } catch {}
    return Response.error();
  }
  y(({ request: r }) => r.mode === 'navigate', pt);
  var ht = /^tablerounds-(shell|assets|api)-v\d+$/,
    mt = `tablerounds-runtime-pages-${D}-`;
  self.addEventListener('activate', r => {
    r.waitUntil(
      (async () => {
        let e = await caches.keys();
        (await Promise.all(
          e
            .filter(t => ht.test(t))
            .concat(e.filter(t => t.startsWith(mt) && t !== We))
            .map(t => caches.delete(t)),
        ),
          console.log(`[SW] active (${D}, Da6g9byOmfXJysKy9lAG7)`));
      })(),
    );
  });
  le();
  self.addEventListener('message', r => {
    r.data?.type === 'SKIP_WAITING' && self.skipWaiting();
  });
})();

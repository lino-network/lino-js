!(function(e) {
  if ('object' == typeof exports && 'undefined' != typeof module) module.exports = e();
  else if ('function' == typeof define && define.amd) define([], e);
  else {
    var n;
    (n =
      'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
            ? self
            : this),
      (n.debug = e());
  }
})(function() {
  return (function e(n, t, r) {
    function o(i, a) {
      if (!t[i]) {
        if (!n[i]) {
          var c = 'function' == typeof require && require;
          if (!a && c) return c(i, !0);
          if (s) return s(i, !0);
          var u = new Error("Cannot find module '" + i + "'");
          throw ((u.code = 'MODULE_NOT_FOUND'), u);
        }
        var f = (t[i] = { exports: {} });
        n[i][0].call(
          f.exports,
          function(e) {
            var t = n[i][1][e];
            return o(t ? t : e);
          },
          f,
          f.exports,
          e,
          n,
          t,
          r
        );
      }
      return t[i].exports;
    }
    for (var s = 'function' == typeof require && require, i = 0; i < r.length; i++) o(r[i]);
    return o;
  })(
    {
      1: [
        function(e, n, t) {
          function r() {
            throw new Error('setTimeout has not been defined');
          }
          function o() {
            throw new Error('clearTimeout has not been defined');
          }
          function s(e) {
            if (l === setTimeout) return setTimeout(e, 0);
            if ((l === r || !l) && setTimeout) return (l = setTimeout), setTimeout(e, 0);
            try {
              return l(e, 0);
            } catch (n) {
              try {
                return l.call(null, e, 0);
              } catch (n) {
                return l.call(this, e, 0);
              }
            }
          }
          function i(e) {
            if (C === clearTimeout) return clearTimeout(e);
            if ((C === o || !C) && clearTimeout) return (C = clearTimeout), clearTimeout(e);
            try {
              return C(e);
            } catch (n) {
              try {
                return C.call(null, e);
              } catch (n) {
                return C.call(this, e);
              }
            }
          }
          function a() {
            m && p && ((m = !1), p.length ? (h = p.concat(h)) : (g = -1), h.length && c());
          }
          function c() {
            if (!m) {
              var e = s(a);
              m = !0;
              for (var n = h.length; n; ) {
                for (p = h, h = []; ++g < n; ) p && p[g].run();
                (g = -1), (n = h.length);
              }
              (p = null), (m = !1), i(e);
            }
          }
          function u(e, n) {
            (this.fun = e), (this.array = n);
          }
          function f() {}
          var l,
            C,
            d = (n.exports = {});
          !(function() {
            try {
              l = 'function' == typeof setTimeout ? setTimeout : r;
            } catch (e) {
              l = r;
            }
            try {
              C = 'function' == typeof clearTimeout ? clearTimeout : o;
            } catch (e) {
              C = o;
            }
          })();
          var p,
            h = [],
            m = !1,
            g = -1;
          (d.nextTick = function(e) {
            var n = new Array(arguments.length - 1);
            if (arguments.length > 1)
              for (var t = 1; t < arguments.length; t++) n[t - 1] = arguments[t];
            h.push(new u(e, n)), 1 !== h.length || m || s(c);
          }),
            (u.prototype.run = function() {
              this.fun.apply(null, this.array);
            }),
            (d.title = 'browser'),
            (d.browser = !0),
            (d.env = {}),
            (d.argv = []),
            (d.version = ''),
            (d.versions = {}),
            (d.on = f),
            (d.addListener = f),
            (d.once = f),
            (d.off = f),
            (d.removeListener = f),
            (d.removeAllListeners = f),
            (d.emit = f),
            (d.binding = function(e) {
              throw new Error('process.binding is not supported');
            }),
            (d.cwd = function() {
              return '/';
            }),
            (d.chdir = function(e) {
              throw new Error('process.chdir is not supported');
            }),
            (d.umask = function() {
              return 0;
            });
        },
        {}
      ],
      2: [
        function(e, n, t) {
          function r(e) {
            if (((e = String(e)), !(e.length > 100))) {
              var n = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
                e
              );
              if (n) {
                var t = parseFloat(n[1]),
                  r = (n[2] || 'ms').toLowerCase();
                switch (r) {
                  case 'years':
                  case 'year':
                  case 'yrs':
                  case 'yr':
                  case 'y':
                    return t * l;
                  case 'days':
                  case 'day':
                  case 'd':
                    return t * f;
                  case 'hours':
                  case 'hour':
                  case 'hrs':
                  case 'hr':
                  case 'h':
                    return t * u;
                  case 'minutes':
                  case 'minute':
                  case 'mins':
                  case 'min':
                  case 'm':
                    return t * c;
                  case 'seconds':
                  case 'second':
                  case 'secs':
                  case 'sec':
                  case 's':
                    return t * a;
                  case 'milliseconds':
                  case 'millisecond':
                  case 'msecs':
                  case 'msec':
                  case 'ms':
                    return t;
                  default:
                    return;
                }
              }
            }
          }
          function o(e) {
            return e >= f
              ? Math.round(e / f) + 'd'
              : e >= u
                ? Math.round(e / u) + 'h'
                : e >= c
                  ? Math.round(e / c) + 'm'
                  : e >= a
                    ? Math.round(e / a) + 's'
                    : e + 'ms';
          }
          function s(e) {
            return (
              i(e, f, 'day') ||
              i(e, u, 'hour') ||
              i(e, c, 'minute') ||
              i(e, a, 'second') ||
              e + ' ms'
            );
          }
          function i(e, n, t) {
            if (!(e < n))
              return e < 1.5 * n ? Math.floor(e / n) + ' ' + t : Math.ceil(e / n) + ' ' + t + 's';
          }
          var a = 1e3,
            c = 60 * a,
            u = 60 * c,
            f = 24 * u,
            l = 365.25 * f;
          n.exports = function(e, n) {
            n = n || {};
            var t = typeof e;
            if ('string' === t && e.length > 0) return r(e);
            if ('number' === t && isNaN(e) === !1) return n.long ? s(e) : o(e);
            throw new Error(
              'val is not a non-empty string or a valid number. val=' + JSON.stringify(e)
            );
          };
        },
        {}
      ],
      3: [
        function(e, n, t) {
          function r(e) {
            var n,
              r = 0;
            for (n in e) (r = (r << 5) - r + e.charCodeAt(n)), (r |= 0);
            return t.colors[Math.abs(r) % t.colors.length];
          }
          function o(e) {
            function n() {
              if (n.enabled) {
                var e = n,
                  r = +new Date(),
                  s = r - (o || r);
                (e.diff = s), (e.prev = o), (e.curr = r), (o = r);
                for (var i = new Array(arguments.length), a = 0; a < i.length; a++)
                  i[a] = arguments[a];
                (i[0] = t.coerce(i[0])), 'string' != typeof i[0] && i.unshift('%O');
                var c = 0;
                (i[0] = i[0].replace(/%([a-zA-Z%])/g, function(n, r) {
                  if ('%%' === n) return n;
                  c++;
                  var o = t.formatters[r];
                  if ('function' == typeof o) {
                    var s = i[c];
                    (n = o.call(e, s)), i.splice(c, 1), c--;
                  }
                  return n;
                })),
                  t.formatArgs.call(e, i);
                var u = n.log || t.log || console.log.bind(console);
                u.apply(e, i);
              }
            }
            var o;
            return (
              (n.namespace = e),
              (n.enabled = t.enabled(e)),
              (n.useColors = t.useColors()),
              (n.color = r(e)),
              (n.destroy = s),
              'function' == typeof t.init && t.init(n),
              t.instances.push(n),
              n
            );
          }
          function s() {
            var e = t.instances.indexOf(this);
            return e !== -1 && (t.instances.splice(e, 1), !0);
          }
          function i(e) {
            t.save(e), (t.names = []), (t.skips = []);
            var n,
              r = ('string' == typeof e ? e : '').split(/[\s,]+/),
              o = r.length;
            for (n = 0; n < o; n++)
              r[n] &&
                ((e = r[n].replace(/\*/g, '.*?')),
                '-' === e[0]
                  ? t.skips.push(new RegExp('^' + e.substr(1) + '$'))
                  : t.names.push(new RegExp('^' + e + '$')));
            for (n = 0; n < t.instances.length; n++) {
              var s = t.instances[n];
              s.enabled = t.enabled(s.namespace);
            }
          }
          function a() {
            t.enable('');
          }
          function c(e) {
            if ('*' === e[e.length - 1]) return !0;
            var n, r;
            for (n = 0, r = t.skips.length; n < r; n++) if (t.skips[n].test(e)) return !1;
            for (n = 0, r = t.names.length; n < r; n++) if (t.names[n].test(e)) return !0;
            return !1;
          }
          function u(e) {
            return e instanceof Error ? e.stack || e.message : e;
          }
          (t = n.exports = o.debug = o.default = o),
            (t.coerce = u),
            (t.disable = a),
            (t.enable = i),
            (t.enabled = c),
            (t.humanize = e('ms')),
            (t.instances = []),
            (t.names = []),
            (t.skips = []),
            (t.formatters = {});
        },
        { ms: 2 }
      ],
      4: [
        function(e, n, t) {
          (function(r) {
            function o() {
              return (
                !(
                  'undefined' == typeof window ||
                  !window.process ||
                  'renderer' !== window.process.type
                ) ||
                (('undefined' == typeof navigator ||
                  !navigator.userAgent ||
                  !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) &&
                  (('undefined' != typeof document &&
                    document.documentElement &&
                    document.documentElement.style &&
                    document.documentElement.style.WebkitAppearance) ||
                    ('undefined' != typeof window &&
                      window.console &&
                      (window.console.firebug ||
                        (window.console.exception && window.console.table))) ||
                    ('undefined' != typeof navigator &&
                      navigator.userAgent &&
                      navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                      parseInt(RegExp.$1, 10) >= 31) ||
                    ('undefined' != typeof navigator &&
                      navigator.userAgent &&
                      navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))))
              );
            }
            function s(e) {
              var n = this.useColors;
              if (
                ((e[0] =
                  (n ? '%c' : '') +
                  this.namespace +
                  (n ? ' %c' : ' ') +
                  e[0] +
                  (n ? '%c ' : ' ') +
                  '+' +
                  t.humanize(this.diff)),
                n)
              ) {
                var r = 'color: ' + this.color;
                e.splice(1, 0, r, 'color: inherit');
                var o = 0,
                  s = 0;
                e[0].replace(/%[a-zA-Z%]/g, function(e) {
                  '%%' !== e && (o++, '%c' === e && (s = o));
                }),
                  e.splice(s, 0, r);
              }
            }
            function i() {
              return (
                'object' == typeof console &&
                console.log &&
                Function.prototype.apply.call(console.log, console, arguments)
              );
            }
            function a(e) {
              try {
                null == e ? t.storage.removeItem('debug') : (t.storage.debug = e);
              } catch (e) {}
            }
            function c() {
              var e;
              try {
                e = t.storage.debug;
              } catch (e) {}
              return !e && 'undefined' != typeof r && 'env' in r && (e = r.env.DEBUG), e;
            }
            function u() {
              try {
                return window.localStorage;
              } catch (e) {}
            }
            (t = n.exports = e('./debug')),
              (t.log = i),
              (t.formatArgs = s),
              (t.save = a),
              (t.load = c),
              (t.useColors = o),
              (t.storage =
                'undefined' != typeof chrome && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : u()),
              (t.colors = [
                '#0000CC',
                '#0000FF',
                '#0033CC',
                '#0033FF',
                '#0066CC',
                '#0066FF',
                '#0099CC',
                '#0099FF',
                '#00CC00',
                '#00CC33',
                '#00CC66',
                '#00CC99',
                '#00CCCC',
                '#00CCFF',
                '#3300CC',
                '#3300FF',
                '#3333CC',
                '#3333FF',
                '#3366CC',
                '#3366FF',
                '#3399CC',
                '#3399FF',
                '#33CC00',
                '#33CC33',
                '#33CC66',
                '#33CC99',
                '#33CCCC',
                '#33CCFF',
                '#6600CC',
                '#6600FF',
                '#6633CC',
                '#6633FF',
                '#66CC00',
                '#66CC33',
                '#9900CC',
                '#9900FF',
                '#9933CC',
                '#9933FF',
                '#99CC00',
                '#99CC33',
                '#CC0000',
                '#CC0033',
                '#CC0066',
                '#CC0099',
                '#CC00CC',
                '#CC00FF',
                '#CC3300',
                '#CC3333',
                '#CC3366',
                '#CC3399',
                '#CC33CC',
                '#CC33FF',
                '#CC6600',
                '#CC6633',
                '#CC9900',
                '#CC9933',
                '#CCCC00',
                '#CCCC33',
                '#FF0000',
                '#FF0033',
                '#FF0066',
                '#FF0099',
                '#FF00CC',
                '#FF00FF',
                '#FF3300',
                '#FF3333',
                '#FF3366',
                '#FF3399',
                '#FF33CC',
                '#FF33FF',
                '#FF6600',
                '#FF6633',
                '#FF9900',
                '#FF9933',
                '#FFCC00',
                '#FFCC33'
              ]),
              (t.formatters.j = function(e) {
                try {
                  return JSON.stringify(e);
                } catch (e) {
                  return '[UnexpectedJSONParseError]: ' + e.message;
                }
              }),
              t.enable(c());
          }.call(this, e('_process')));
        },
        { './debug': 3, _process: 1 }
      ]
    },
    {},
    [4]
  )(4);
});

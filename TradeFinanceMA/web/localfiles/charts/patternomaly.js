/**
 * Minified by jsDelivr using UglifyJS v3.4.4.
 * Original file: /npm/patternomaly@1.3.2/dist/patternomaly.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.pattern = e()
}(this, function() {
    "use strict";
    var t = "round",
        o = (function() {
            function c(t) {
                this.value = t
            }

            function t(o) {
                var r, s;

                function a(t, e) {
                    try {
                        var i = o[t](e),
                            n = i.value;
                        n instanceof c ? Promise.resolve(n.value).then(function(t) {
                            a("next", t)
                        }, function(t) {
                            a("throw", t)
                        }) : h(i.done ? "return" : "normal", i.value)
                    } catch (t) {
                        h("throw", t)
                    }
                }

                function h(t, e) {
                    switch (t) {
                        case "return":
                            r.resolve({
                                value: e,
                                done: !0
                            });
                            break;
                        case "throw":
                            r.reject(e);
                            break;
                        default:
                            r.resolve({
                                value: e,
                                done: !1
                            })
                    }(r = r.next) ? a(r.key, r.arg): s = null
                }
                this._invoke = function(n, o) {
                    return new Promise(function(t, e) {
                        var i = {
                            key: n,
                            arg: o,
                            resolve: t,
                            reject: e,
                            next: null
                        };
                        s ? s = s.next = i : (r = s = i, a(n, o))
                    })
                }, "function" != typeof o.return && (this.return = void 0)
            }
            "function" == typeof Symbol && Symbol.asyncIterator && (t.prototype[Symbol.asyncIterator] = function() {
                return this
            }), t.prototype.next = function(t) {
                return this._invoke("next", t)
            }, t.prototype.throw = function(t) {
                return this._invoke("throw", t)
            }, t.prototype.return = function(t) {
                return this._invoke("return", t)
            }
        }(), function(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }),
        i = function() {
            function n(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }
            return function(t, e, i) {
                return e && n(t.prototype, e), i && n(t, i), t
            }
        }(),
        e = Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n])
            }
            return t
        },
        n = function(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        },
        r = function(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        },
        s = function() {
            function n() {
                var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 20,
                    e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "rgba(100, 100, 100, 0.7)",
                    i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "rgba(255, 255, 255, 0.8)";
                return o(this, n), this._canvas = document.createElement("canvas"), this._context = this._canvas.getContext("2d"), this._canvas.width = t, this._canvas.height = t, this._context.fillStyle = e, this._context.fillRect(0, 0, this._canvas.width, this._canvas.height), this._size = t, this._patternColor = i, this
            }
            return i(n, [{
                key: "setStrokeProps",
                value: function() {
                    this._context.strokeStyle = this._patternColor, this._context.lineWidth = this._size / 10, this._context.lineJoin = t, this._context.lineCap = t
                }
            }, {
                key: "setFillProps",
                value: function() {
                    this._context.fillStyle = this._patternColor
                }
            }]), n
        }(),
        a = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawPlus(), this.drawPlus(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawPlus",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2,
                        o = i / 4;
                    this._context.moveTo(o + t, 0 + e), this._context.lineTo(o + t, n + e), this._context.moveTo(0 + t, o + e), this._context.lineTo(n + t, o + e), this._context.closePath()
                }
            }]), e
        }(),
        h = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawCross(), this.drawCross(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawCross",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size / 2;
                    this._context.moveTo(t + 2, e + 2), this._context.lineTo(i - 2 + t, i - 2 + e), this._context.moveTo(t + 2, i - 2 + e), this._context.lineTo(i - 2 + t, e + 2), this._context.closePath()
                }
            }]), e
        }(),
        c = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawDash(), this.drawDash(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawDash",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size / 2;
                    this._context.moveTo(t + 2, e + 2), this._context.lineTo(i - 2 + t, i - 2 + e), this._context.closePath()
                }
            }]), e
        }(),
        l = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), (new h).drawCross.call(this), (new c).drawDash.call(this, t, t), this._context.stroke(), this._canvas
                }
            }]), e
        }(),
        u = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setFillProps(), this.drawDot(), this.drawDot(t, t), this._context.fill(), this._canvas
                }
            }, {
                key: "drawDot",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : this._size / 10,
                        n = this._size / 4,
                        o = n + t,
                        r = n + e;
                    this._context.moveTo(o + n, r), this._context.arc(o, r, i, 0, 2 * Math.PI), this._context.closePath()
                }
            }]), e
        }(),
        _ = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), (new c).drawDash.call(this, t, t), this._context.closePath(), this._context.stroke(), this.setFillProps(), (new u).drawDot.call(this), this._context.fill(), this._canvas
                }
            }]), e
        }(),
        v = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, u), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2,
                        e = this._size / 5;
                    return this._context.beginPath(), this.setFillProps(), this.drawDot(0, 0, e), this.drawDot(t, t, e), this._context.fill(), this._canvas
                }
            }]), e
        }(),
        f = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, u), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2,
                        e = this._size / 5;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawDot(0, 0, e), this.drawDot(t, t, e), this._context.stroke(), this._canvas
                }
            }]), e
        }(),
        d = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawLine(), this.drawLine(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawLine",
                value: function() {
                    0 < arguments.length && void 0 !== arguments[0] && arguments[0];
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        e = this._size / 4;
                    this._context.moveTo(0, e + t), this._context.lineTo(this._size, e + t), this._context.closePath()
                }
            }]), e
        }(),
        p = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, d), i(e, [{
                key: "drawTile",
                value: function() {
                    return this._context.translate(this._size, 0), this._context.rotate(90 * Math.PI / 180), d.prototype.drawTile.call(this), this._canvas
                }
            }]), e
        }(),
        x = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    return this._context.beginPath(), this.setStrokeProps(), this.drawWeave(0, 0), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawWeave",
                value: function(t, e) {
                    var i = this._size,
                        n = i / 2;
                    this._context.moveTo(t + 1, e + 1), this._context.lineTo(n - 1, n - 1), this._context.moveTo(n + 1, i - 1), this._context.lineTo(i - 1, n + 1), this._context.closePath()
                }
            }]), e
        }(),
        y = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    return this._context.beginPath(), this.setStrokeProps(), this.drawZigzag(), this.drawZigzag(this._size / 2), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawZigzag",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = this._size,
                        i = e / 4,
                        n = e / 2,
                        o = e / 10;
                    this._context.moveTo(0, o + t), this._context.lineTo(i, n - o + t), this._context.lineTo(n, o + t), this._context.lineTo(e - i, n - o + t), this._context.lineTo(e, o + t)
                }
            }]), e
        }(),
        g = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, y), i(e, [{
                key: "drawTile",
                value: function() {
                    return this._context.translate(this._size, 0), this._context.rotate(90 * Math.PI / 180), y.prototype.drawTile.call(this), this._canvas
                }
            }]), e
        }(),
        w = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawDiagonalLine(), this.drawDiagonalLine(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawDiagonalLine",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2;
                    this._context.moveTo(n - 1 - t, -1 + e), this._context.lineTo(i + 1 - t, n + 1 + e), this._context.closePath()
                }
            }]), e
        }(),
        P = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, w), i(e, [{
                key: "drawTile",
                value: function() {
                    return this._context.translate(this._size, 0), this._context.rotate(90 * Math.PI / 180), w.prototype.drawTile.call(this), this._canvas
                }
            }]), e
        }(),
        k = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setFillProps(), this.drawSquare(), this.drawSquare(t, t), this._context.fill(), this._canvas
                }
            }, {
                key: "drawSquare",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2,
                        o = i / 20;
                    this._context.fillRect(t + o, e + o, n - 2 * o, n - 2 * o), this._context.closePath()
                }
            }]), e
        }(),
        b = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawBox(), this.drawBox(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawBox",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2,
                        o = i / 20;
                    this._context.strokeRect(t + o, e + o, n - 4 * o, n - 4 * o), this._context.closePath()
                }
            }]), e
        }(),
        T = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setFillProps(), this.drawTriangle(), this.drawTriangle(t, t), this._context.fill(), this._canvas
                }
            }, {
                key: "drawTriangle",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2,
                        o = i / 4;
                    this._context.moveTo(o + t, e), this._context.lineTo(n + t, n + e), this._context.lineTo(t, n + e), this._context.closePath()
                }
            }]), e
        }(),
        O = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, T), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size;
                    return this._context.translate(t, t), this._context.rotate(180 * Math.PI / 180), T.prototype.drawTile.call(this), this._canvas
                }
            }]), e
        }(),
        z = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, s), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setFillProps(), this.drawDiamond(), this.drawDiamond(t, t), this._context.fill(), this._canvas
                }
            }, {
                key: "drawDiamond",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2,
                        o = i / 4;
                    this._context.moveTo(o + t, e), this._context.lineTo(n + t, o + e), this._context.lineTo(o + t, n + e), this._context.lineTo(t, o + e), this._context.closePath()
                }
            }]), e
        }(),
        m = function(t) {
            function e() {
                return o(this, e), r(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments))
            }
            return n(e, z), i(e, [{
                key: "drawTile",
                value: function() {
                    var t = this._size / 2;
                    return this._context.beginPath(), this.setStrokeProps(), this.drawDiamond(), this.drawDiamond(t, t), this._context.stroke(), this._canvas
                }
            }, {
                key: "drawDiamond",
                value: function() {
                    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                        e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = this._size,
                        n = i / 2 - 1,
                        o = i / 4;
                    this._context.moveTo(o + t, e + 1), this._context.lineTo(n + t, o + e), this._context.lineTo(o + t, n + e), this._context.lineTo(t + 1, o + e), this._context.closePath()
                }
            }]), e
        }(),
        j = {
            plus: a,
            cross: h,
            dash: c,
            "cross-dash": l,
            dot: u,
            "dot-dash": _,
            disc: v,
            ring: f,
            line: d,
            "line-vertical": p,
            weave: x,
            zigzag: y,
            "zigzag-vertical": g,
            diagonal: w,
            "diagonal-right-left": P,
            square: k,
            box: b,
            triangle: T,
            "triangle-inverted": O,
            diamond: z,
            "diamond-box": m
        },
        S = {
            circle: j.disc,
            "triangle-vertical": j["triangle-inverted"],
            "line-horizontal": j.line,
            "line-diagonal-lr": j.diagonal,
            "line-diagonal-rl": j["diagonal-right-left"],
            "zigzag-horizontal": j.zigzag,
            "diamond-outline": j["diamond-box"]
        },
        D = [];

    function C() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [],
            e = Object.keys(j);
        t.forEach(function(t) {
            e.splice(e.indexOf(t), 1)
        });
        var i = Math.floor(Math.random() * e.length);
        return e[i]
    }

    function F() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "square",
            e = arguments[1],
            i = arguments[2],
            n = arguments[3],
            o = document.createElement("canvas"),
            r = o.getContext("2d"),
            s = 2 * n,
            a = new D[t](n, e, i),
            h = r.createPattern(a.drawTile(), "repeat");
        return o.width = s, o.height = s, h.shapeType = t, h
    }
    return e(D, j, S), {
        draw: F,
        generate: function(t) {
            var o = void 0,
                r = void 0;
            return t.map(function(t, e, i) {
                var n = void 0;
                return 0 === e ? (n = C(), o = r = n) : e === i.length - 1 ? n = C([r, o]) : (n = C([r]), r = n), F(n, t)
            })
        }
    }
});
//# sourceMappingURL=/sm/4786041c509d6bf0a3d2e0cabbd9647b82ef2a24ab34ecf6f8fdef86a5b8a7a0.map 
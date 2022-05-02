(function () {
    "use strict";
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (e) {
            return setTimeout(e, 1e3 / 60);
        };
    window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (e) {
            clearTimeout(e);
        };
    window.on = window.addEventListener;
    window.off = window.removeEventListener;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    try {
        if (window.orientation !== 0) {
            window.orientation = 0;
        }
    } catch (e) {}
    try {
        var k = document.querySelector.bind(document),
            a = document.querySelectorAll.bind(document),
            e = document.addEventListener.bind(document);
        Element.prototype.get = Element.prototype.querySelector;
        Element.prototype.getAll = Element.prototype.querySelectorAll;
        Element.prototype.on = Element.prototype.addEventListener;
        Element.prototype.off = Element.prototype.removeEventListener;
        Element.prototype.onScope = function (t, e, i, n) {
            this.on(
                e,
                function (e) {
                    i.call(t, e);
                },
                n === undefined ? false : n
            );
        };
        Element.prototype.show = function () {
            this.style.display = "block";
        };
        Element.prototype.hide = function () {
            this.style.display = "none";
        };
    } catch (e) {}
    var L = false;
    try {
        var t = Object.defineProperty({}, "passive", {
            get: function () {
                L = true;
            },
        });
        window.on("_", null, t);
        window.off("_", null, t);
    } catch (e) {}
    Math.clamp = function (e, t, i) {
        return Math.max(t, Math.min(e, i));
    };
    Array.prototype.shuffle = function () {
        var e, t;
        for (var i = this.length - 1; i > 0; i--) {
            e = Math.floor(Math.random() * (i + 1));
            t = this[i];
            this[i] = this[e];
            this[e] = t;
        }
        return this;
    };
    function A(e) {
        e.preventDefault();
    }
    function r(e) {
        e.stopImmediatePropagation();
    }
    function P(e) {
        var t = new Image();
        t.src = "/assets/images/" + e;
    }
    var U = (function () {
        var i = { gravity: 0 },
            e = false,
            n = { x: 0, y: 0 },
            t;
        function a() {
            D.fitBalls();
            F.width = window.innerWidth;
            var e = k(".stage");
            if (e) {
                F.height = parseFloat(window.getComputedStyle(e).getPropertyValue("height")) || window.innerHeight;
            } else {
                F.height = window.innerHeight;
            }
            window.scrollTo(0, 0);
            D.fitBalls();
        }
        function s(e) {
            if (document.hidden || document.webkitHidden || document.mozHidden) {
                D.pause();
            } else if (F.isEnabled()) {
                a();
                D.play();
            }
        }
        function o(e) {
            if (e && e.acceleration && e.acceleration.x !== undefined && e.acceleration.y !== undefined) {
                n.x = e.acceleration.x / 2;
                n.y = e.acceleration.y / 2;
            }
        }
        i.enableAwake = function () {
            if (t) {
                var e = t.play();
                if (e) {
                    e.catch(function () {});
                }
            }
        };
        i.disableAwake = function () {
            if (t) {
                t.pause();
            }
        };
        i.getForces = function () {
            var e, t;
            switch ((window.orientation + 360) % 360) {
                case 90:
                    e = -n.y;
                    t = i.gravity - n.x;
                    break;
                case 180:
                    e = -n.x;
                    t = i.gravity + n.y;
                    break;
                case 270:
                    e = n.y;
                    t = i.gravity + n.x;
                    break;
                default:
                    e = n.x;
                    t = i.gravity - n.y;
            }
            return { x: e, y: t };
        };
        function r() {
            var e = document.createElement("p"),
                t,
                i = { webkitTransform: "-webkit-transform", transform: "transform" };
            document.body.insertBefore(e, null);
            for (var n in i) {
                if (e.style[n] !== undefined) {
                    e.style[n] = "translate3d(1px,1px,1px)";
                    t = window.getComputedStyle(e).getPropertyValue(i[n]);
                }
            }
            document.body.removeChild(e);
            return t !== undefined && t.length > 0 && t !== "none";
        }
        i.init = function () {
            if (e || !document.body.classList || !r()) {
                return false;
            }
            e = true;
            if (navigator.standalone !== undefined) {
                document.body.classList.add("mobile");
            }
            i.isMobile = document.body.classList.contains("mobile");
            if (i.isMobile) {
                t = k(".awake");
                if (t) {
                    t.addEventListener("timeupdate", function (e) {
                        if (t.currentTime > 1.5) {
                            t.currentTime = 0;
                        }
                    });
                }
                window.on("devicemotion", o, false);
            }
            window.on("webkitvisibilitychange", s, false);
            window.on(
                "orientationchange",
                function () {
                    setTimeout(a, 250);
                },
                false
            );
            window.on("resize", a, false);
            a();
            return true;
        };
        return i;
    })();
    var F = (function () {
        var a = {},
            e = false,
            t = false,
            i;
        function n() {
            this.x = 0;
            this.y = 0;
            this.dx = 0;
            this.dy = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.down = false;
            this.size = 0;
        }
        n.prototype.move = function (e, t) {
            this.dx = e - this.x;
            this.dy = t - this.y;
            this.x = e;
            this.y = t;
        };
        n.prototype.offset = function (e, t, i, n) {
            this.x = e;
            this.y = t;
            this.offsetX = i;
            this.offsetY = n;
        };
        n.prototype.updateSize = function () {
            this.size = U.isMobile || a.getSquareSize() < 600 ? 50 : 120;
        };
        a.pointers = { mouse: new n() };
        a.addPointer = function (e) {
            var t = new n();
            a.pointers[e] = t;
            return t;
        };
        function s(e) {
            a.pointers.mouse.down = true;
            a.pointers.mouse.updateSize();
            D.bounceBalls(120);
            A(e);
        }
        function o(e) {
            if (e.touches) {
                for (var t = e.touches.length; t--; ) {
                    var i = e.touches[t];
                    if (!a.pointers[i.identifier]) {
                        var n = a.addPointer(i.identifier);
                        n.down = true;
                        n.updateSize();
                        n.move(i.clientX, i.clientY);
                    }
                }
            }
            A(e);
        }
        function r(e) {
            a.pointers.mouse.move(e.clientX, e.clientY);
        }
        function l(e) {
            if (e.changedTouches) {
                for (var t = e.changedTouches.length; t--; ) {
                    var i = e.changedTouches[t],
                        n = a.pointers[i.identifier];
                    if (n) {
                        n.move(i.clientX, i.clientY);
                    }
                }
            }
        }
        function f(e) {
            if (e.changedTouches) {
                for (var t = e.changedTouches.length; t--; ) {
                    var i = e.changedTouches[t].identifier;
                    D.releaseBall(i);
                    delete a.pointers[i];
                }
            }
            a.pointers.mouse.down = false;
            D.releaseBall("mouse");
        }
        a.width = 0;
        a.height = 0;
        a.error = false;
        a.getSquareSize = function () {
            return Math.sqrt(a.width * a.height);
        };
        a.swapMode = function (e, t) {
            if (i) {
                i.classList.remove(t);
                i.classList.add(e);
            }
        };
        a.add = function (e) {
            if (i) {
                i.appendChild(e);
            }
        };
        a.enable = function () {
            if (i) {
                i.classList.add("grab");
                t = true;
            }
        };
        a.isEnabled = function () {
            return t;
        };
        a.hide = function () {
            if (k) {
                k(".stage").style.display = "none";
            }
        };
        a.init = function () {
            if (e) {
                return;
            }
            e = true;
            i = k(".stage");
            if (i) {
                i.on("mousedown", s, false);
                i.on("mousemove", r, false);
                i.on("mouseup", f, false);
                i.on("mouseleave", f, false);
                i.on("contextmenu", A, false);
                i.on("touchstart", o, L ? { passive: false } : false);
                i.on("touchmove", l, L ? { passive: true } : false);
                i.on("touchend", f, L ? { passive: true } : false);
                i.on("touchcancel", f, L ? { passive: true } : false);
            }
        };
        return a;
    })();
    var R = (function () {
        var i = ["white", "purple", "yellow", "pink", "green", "red", "orange", "blue", "cyan", "black"],
            n = ["blue", "green", "brown", "gray", "pink", "purple", "yellow"];
        function e(e, t, i, n, a, s) {
            this.x = e;
            this.y = t;
            this.px = i;
            this.py = n;
            this.radius = a;
            this.overlap = 0;
            this.id = s;
            this.angle = 0;
            this.el = null;
            this.pointerID = null;
            this.isDragged = false;
            this.canPop = false;
            this.canRoll = false;
        }
        function a(e) {
            if (e) {
                if (this.canPop) {
                    D.popBubble(this);
                } else {
                    var t = e.clientX || 0,
                        i = e.clientY || 0,
                        n = F.pointers.mouse;
                    this.isDragged = true;
                    this.pointerID = "mouse";
                    n.offset(t, i, t - this.x, i - this.y);
                }
                A(e);
                r(e);
            }
        }
        function s(e) {
            if (e) {
                if (this.canPop) {
                    D.popBubble(this);
                } else if (e.touches) {
                    for (var t = e.touches.length; t--; ) {
                        var i = e.touches[t];
                        if (i.target === this.el && !F.pointers[i.identifier]) {
                            var n = i.clientX || 0,
                                a = i.clientY || 0,
                                s = F.addPointer(i.identifier);
                            this.isDragged = true;
                            this.pointerID = i.identifier;
                            s.offset(n, a, n - this.x, a - this.y);
                            break;
                        }
                    }
                }
                A(e);
                r(e);
            }
        }
        function o(e) {
            var t = document.createElement("div");
            t.onScope(e, "mousedown", a);
            t.onScope(e, "touchstart", s, L ? { passive: false } : false);
            return t;
        }
        e.prototype.setRadius = function (e) {
            this.radius = e;
            var t = e + this.overlap;
            this.el.style.width = this.el.style.height = t * 2 + "px";
            this.el.style.left = this.el.style.top = -t + "px";
        };
        e.prototype.setMode = function (e) {
            this.el = this.el || o(this);
            this.el.innerHTML = "";
            this.el.style.backgroundPosition = "";
            this.el.className = "ball";
            this.canRoll = false;
            this.isDragged = false;
            this.canPop = false;
            this.angle = 0;
            this.overlap = 0;
            switch (e) {
                case D.MODES.PLASTIC:
                    this.el.classList.add(i[this.id % i.length]);
                    break;
                case D.MODES.EMOJI:
                    this.el.style.backgroundPosition = (this.id % 6) * 20 + "% " + (Math.floor(this.id / 6) % 6) * 20 + "%";
                    this.canRoll = true;
                    this.overlap = Math.round(this.radius / 10);
                    break;
                case D.MODES.NUMBERS:
                    var t = (this.id % 10) + 1;
                    this.el.innerHTML = '<div class="number">' + t + "</div>";
                    this.el.classList.add("n" + t);
                    break;
                case D.MODES.BUBBLES:
                    this.canPop = true;
                    break;
                case D.MODES.EYES:
                    this.el.innerHTML = '<div class="outer-iris"><div class="iris"></div></div>';
                    this.el.classList.add(n[this.id % n.length]);
                    this.canRoll = true;
                    break;
            }
            if (this.canRoll) {
                this.angle = Math.random() * 360;
            }
            this.setRadius(this.radius);
            this.move();
        };
        e.prototype.force = function (e, t) {
            this.x += e;
            this.y += t;
            if (this.canRoll) {
                this.angle += ((this.x - this.px) / this.radius) * 36;
            }
            var i = this.x * 2 - this.px;
            var n = this.y * 2 - this.py;
            this.px = this.x;
            this.py = this.y;
            this.x = i;
            this.y = n;
        };
        e.prototype.release = function () {
            var e = F.pointers[this.pointerID];
            if (e && this.isDragged) {
                this.isDragged = false;
                this.px = this.x - e.dx * 0.3;
                this.py = this.y - e.dy * 0.3;
                this.pointerID = null;
            }
        };
        e.prototype.move = function (e) {
            var t = "translate3d(" + this.x + "px," + this.y + "px,0)";
            if (!this.canRoll) {
                this.angle = e;
            }
            if (this.angle) {
                t += "rotateZ(" + this.angle + "deg)";
            }
            this.el.style.webkitTransform = this.el.style.transform = t;
        };
        return e;
    })();
    var z = (function () {
        var e = {},
            t = false,
            i;
        function n() {
            i[1].className = "bg";
            i[1].hide();
        }
        e.show = function (e, t) {
            i[0].classList.add(e);
            i[1].classList.add("fade");
            i[1].style.opacity = 0;
            if (!t) {
                n();
            }
        };
        e.swap = function (e) {
            i[1].show();
            i[1].classList.add(e);
            i[1].style.opacity = 1;
            i[0].classList.remove(e);
        };
        e.init = function () {
            if (t) {
                return;
            }
            t = true;
            i = a(".bg");
            i[1].on("transitionend", n, false);
        };
        return e;
    })();
    var D = (function () {
        var o = {},
            i = false,
            r = true,
            t,
            l,
            f,
            d = [],
            u = { min: 0, max: 0 },
            a = 1,
            c = 1,
            s = 1,
            n = 0,
            h = 0,
            m = 0,
            p = 0,
            v = 25,
            y = 250,
            g = 0.8,
            w = 3;
        o.MODES = { PLASTIC: "plastic", EMOJI: "emoji", NUMBERS: "numbers", BUBBLES: "bubbles", EYES: "eyes" };
        try {
            if (window.localStorage) {
                s = parseFloat(localStorage.getItem("elasticity") || 1);
            }
        } catch (e) {}
        function b(e, t) {
            if (!e || !o.MODES[e.toUpperCase()]) {
                e = o.MODES.PLASTIC;
            }
            F.swapMode(e, l);
            z.show(e, t);
            l = e;
            try {
                if (window.localStorage) {
                    localStorage.setItem("mode", l);
                }
            } catch (e) {}
            B(t);
            r = true;
            V.enable();
            V.setMode(e);
        }
        function M(e) {
            c = isNaN(e) ? 1 : e;
            a = Math.pow(c / w, 2);
        }
        o.swapMode = function (e) {
            if (l && r) {
                N();
                o.bounceBalls(20 * U.gravity);
                f = e;
                p = 0;
                r = false;
                z.swap(l);
            } else {
                b(e, false);
            }
        };
        function x() {
            for (var e = m; e--; ) {
                var t = d[e],
                    i,
                    n,
                    a,
                    s,
                    o;
                for (var r in F.pointers) {
                    o = F.pointers[r];
                    if (o.down) {
                        i = t.x - o.x;
                        n = t.y - o.y;
                        a = Math.sqrt(i * i + n * n);
                        if (a > 0) {
                            s = a - t.radius - o.size;
                            if (s < 0) {
                                t.x -= (i * s) / a / 2;
                                t.y -= (n * s) / a / 2;
                            }
                        } else {
                            t.x += Math.random();
                            t.y -= Math.random();
                        }
                    }
                }
                for (var l = m; l--; ) {
                    if (l !== e) {
                        var f = d[l];
                        i = t.x - f.x;
                        n = t.y - f.y;
                        a = Math.sqrt(i * i + n * n);
                        if (a > 0) {
                            s = a - t.radius - f.radius;
                            if (s < 0) {
                                var u = (i * s) / a / 2;
                                var c = (n * s) / a / 2;
                                t.x -= u;
                                t.y -= c;
                                f.x += u;
                                f.y += c;
                            }
                        } else {
                            t.x += Math.random();
                            t.y -= Math.random();
                        }
                    }
                }
            }
        }
        function E() {
            var e = U.gravity < 0,
                t = 0;
            for (var i = m; i--; ) {
                var n = d[i];
                if (n && !n.isDragged) {
                    var a = n.px - n.x,
                        s = n.py - n.y;
                    if (n.x < n.radius) {
                        n.x = n.radius;
                        n.px = n.x - a * g;
                    } else if (n.x > F.width - n.radius) {
                        n.x = F.width - n.radius;
                        n.px = n.x - a * g;
                    }
                    if (e && n.y < n.radius) {
                        if (r) {
                            n.y = n.radius;
                            n.py = n.y - s * g;
                        } else if (n.y < n.radius * -2) {
                            t++;
                        }
                    } else if (n.y < F.height * -2 - n.radius) {
                        n.y = F.height * -2 - n.radius;
                        n.py = n.y - s * g;
                    } else if (!e && n.y > F.height - n.radius) {
                        if (r) {
                            n.y = F.height - n.radius;
                            n.py = n.y - s * g;
                        } else if (n.y > F.height + n.radius * 2) {
                            t++;
                        }
                    } else if (n.y > F.height * 3 - n.radius) {
                        n.y = F.height * 3 - n.radius;
                    }
                }
            }
            if (!r && t > m - 1) {
                b(f, true);
            }
        }
        function S(e, t, i) {
            for (var n = m; n--; ) {
                var a = d[n];
                if (a) {
                    var s = a.x - e,
                        o = a.y - t,
                        r = Math.sqrt(s * s + o * o);
                    if (r < a.radius + i) {
                        return true;
                    }
                }
            }
            return false;
        }
        function T() {
            for (var e = y; e--; ) {
                var t = new R(-200, -200, -200, -200, 50, d.length);
                t.setMode(l);
                d.push(t);
                F.add(t.el);
            }
        }
        function k(e) {
            var t = d[e];
            if (t) {
                t.x = t.y = t.px = t.py = -200;
                t.setRadius(50);
                t.move();
            }
        }
        function L(e, t, i) {
            var n = 50;
            while (n) {
                var a = Math.random() * (F.width - t * 2) + t,
                    s = Math.random() * (F.height * (i ? 2 : 1) - t * 2) + t;
                if (i) {
                    s += F.height * (U.gravity < 0 ? 1 : -2);
                }
                if (S(a, s, t) || H.hitTest(a, s, t)) {
                    n--;
                } else {
                    var o = d[e];
                    if (o) {
                        o.x = a;
                        o.y = s;
                        o.px = a + (Math.random() - 0.5) * 2 * c;
                        o.py = s + (Math.random() - 0.5) * c;
                        o.setRadius(t);
                        o.setMode(l);
                    }
                    return true;
                }
            }
            return false;
        }
        function A(e) {
            return Math.ceil(Math.clamp(e, v, D()));
        }
        function D() {
            var e = 1;
            switch (l) {
                case o.MODES.PLASTIC:
                    e = 140;
                    break;
                case o.MODES.EMOJI:
                    e = 120;
                    break;
                case o.MODES.NUMBERS:
                    e = 120;
                    break;
                case o.MODES.BUBBLES:
                    e = 140;
                    break;
                case o.MODES.EYES:
                    e = 170;
                    break;
            }
            return Math.clamp(Math.ceil(F.getSquareSize() / e) * 25 - v, v * 2, y);
        }
        function B(e) {
            if (p) {
                m = A(p);
            }
            var t = Math.ceil(F.getSquareSize()),
                i = 3,
                n = 0,
                a;
            switch (l) {
                case o.MODES.PLASTIC:
                    if (!p) {
                        m = A(t / 12);
                    }
                    u.min = t < 600 ? 6 : 4;
                    u.max = Math.clamp(m / 1.2, 45, 80);
                    U.gravity = 2;
                    break;
                case o.MODES.EMOJI:
                    if (!p) {
                        m = A(t < 800 ? 36 : t / 16);
                    }
                    u.min = u.max = t < 800 ? 22 : 28;
                    U.gravity = 1.5;
                    break;
                case o.MODES.NUMBERS:
                    if (!p) {
                        m = A(t < 800 ? 25 : t / 16);
                    }
                    u.min = u.max = 30;
                    U.gravity = 1.5;
                    break;
                case o.MODES.BUBBLES:
                    if (!p) {
                        m = A(t / 12);
                    }
                    u.min = 4;
                    u.max = Math.clamp(m / 1.1, 60, 100);
                    U.gravity = -1.5;
                    i = 4;
                    break;
                case o.MODES.EYES:
                    if (!p) {
                        m = A(t / 14);
                    }
                    u.min = 15;
                    u.max = Math.clamp(m / 1.3, 35, 80);
                    U.gravity = 2;
                    i = 2;
                    break;
            }
            for (a = y; a--; ) {
                k(a);
            }
            for (a = y; a--; ) {
                if (a < m) {
                    var s = Math.pow(a, i) / (Math.pow(m, i) / (u.max - u.min)) + u.min;
                    if (L(n, s, e)) {
                        n++;
                    } else {
                        m--;
                    }
                }
            }
            V.setTotal(m, D());
        }
        o.setTotal = function (e) {
            o.swapMode(l);
            p = e;
        };
        o.setElasticity = function (e) {
            s = Math.clamp(e, 0.1, 2);
        };
        function C() {
            var e = U.getForces();
            for (var t = m; t--; ) {
                var i = d[t];
                if (i) {
                    var n = F.pointers[i.pointerID];
                    if (i.isDragged && n) {
                        i.x = n.x - n.offsetX;
                        i.y = n.y - n.offsetY;
                    } else {
                        i.force(e.x * a, e.y * a);
                    }
                }
            }
        }
        function I() {
            for (var e = m; e--; ) {
                var t = d[e];
                if (t) {
                    t.move();
                }
            }
        }
        o.bounceBalls = function (e) {
            if (!e || !r) {
                return;
            }
            e = (Math.abs(e) / c) * a * s;
            for (var t = m; t--; ) {
                var i = d[t];
                if (i) {
                    if (U.gravity < 0 && i.y < i.radius * 2) {
                        i.force(0, e + Math.random());
                    } else if (i.y > F.height - i.radius * 2) {
                        i.force(0, -e - Math.random());
                    }
                }
            }
        };
        o.fitBalls = function () {
            if (!F.error && F.width && F.height) {
                var e = window.innerHeight - F.height || 0,
                    t = window.innerWidth - F.width || 0,
                    i;
                for (var n = m; n--; ) {
                    i = d[n];
                    if (i) {
                        if (F.isEnabled()) {
                            if (t < 0 || e < 0) {
                                i.x += t;
                                i.y += e;
                            }
                        } else {
                            i.x += t / 2;
                            i.y += e / 2;
                        }
                    }
                }
                for (n = w; n--; ) {
                    x();
                    E();
                }
                for (n = m; n--; ) {
                    i = d[n];
                    if (i) {
                        i.px = i.x;
                        i.py = i.y;
                    }
                }
                I();
                V.setTotal(m, D());
                V.setElasticity(s);
            }
        };
        o.releaseBall = function (e) {
            for (var t = m; t--; ) {
                var i = d[t];
                if (i && i.pointerID === e) {
                    i.release();
                    return;
                }
            }
        };
        function N() {
            for (var e = m; e--; ) {
                var t = d[e];
                if (t) {
                    t.release();
                }
            }
        }
        o.popBubble = function (e) {
            if (l === o.MODES.BUBBLES) {
                L(e.id, e.radius, true);
                e.py = e.y - Math.random() * 20;
            }
        };
        function O() {
            if (window.performance && performance.now) {
                return performance.now();
            }
            if (Date.now) {
                return Date.now();
            }
            return new Date().getTime();
        }
        function q() {
            h += (1e3 / (O() - n) - h) / 4;
            if (isNaN(h)) {
                h = 60;
            }
            n = O();
            M(60 / Math.clamp(h, 30, U.isMobile ? 120 : 60));
            if (Y.volume > 0) {
                o.bounceBalls(Math.sqrt(Y.volume * Y.volume));
                if (Y.volume * s > 80) {
                    V.showNoiseAlert();
                }
            }
            for (var e = w; e--; ) {
                C();
                x();
                E();
            }
            I();
            t = requestAnimationFrame(q);
        }
        o.pause = function () {
            cancelAnimationFrame(t);
        };
        o.play = function () {
            if (F.error) {
                return;
            }
            F.enable();
            cancelAnimationFrame(t);
            h = 60;
            q();
        };
        o.init = function (e) {
            if (i) {
                return;
            }
            i = true;
            M(c);
            V.setElasticity(s);
            z.init();
            T();
            b(e, false);
            var t = window.devicePixelRatio >= 1.3;
            P("emoji-new" + (t ? "-2x" : "") + ".png");
            P("underwater.jpg");
        };
        return o;
    })();
    var Y = (function () {
        var i = {},
            n = false,
            t = false,
            a,
            s,
            o,
            r,
            l,
            f,
            u,
            c = 4;
        function d() {
            if (!n) {
                return;
            }
            if (r) {
                r.getByteFrequencyData(f);
            }
            var e = 0;
            for (var t = f.length; t--; ) {
                e += f[t];
            }
            i.volume = (e / f.length) * (U.isMobile ? 2 : 1);
        }
        function e(e) {
            if (!window.AudioContext || !u) {
                return;
            }
            a = e;
            if (a && a.getAudioTracks) {
                var t = a.getAudioTracks();
                if (t.length > 0) {
                    s = t[0];
                    if (s && s.addEventListener) {
                        s.addEventListener("ended", h, false);
                    }
                } else {
                    return;
                }
            } else {
                return;
            }
            r = u.createAnalyser();
            r.fftSize = 1024;
            r.smoothingTimeConstant = 0.3;
            f = new Uint8Array(r.frequencyBinCount);
            l = u.createScriptProcessor(1024, 1, 1);
            if (l && l.addEventListener) {
                l.addEventListener("audioprocess", d, false);
                l.connect(u.destination);
            } else {
                return;
            }
            o = u.createMediaStreamSource(a);
            o.connect(r);
            if (c > 0) {
                c--;
            }
            n = true;
            V.useMic(true);
        }
        function h(e) {
            if (e) {
                switch (e.name) {
                    case "DevicesNotFoundError":
                    case "NO_DEVICES_FOUND":
                    case "NotFoundError":
                    case "NotFoundError: The object can not be found here.":
                        i.help();
                        break;
                }
            }
            if (o) {
                o.disconnect(0);
            }
            if (l) {
                if (l.removeEventListener) {
                    l.removeEventListener("audioprocess", d);
                }
                l.disconnect(0);
            }
            t = n = false;
            V.useMic(false);
            i.volume = 0;
            U.disableAwake();
        }
        i.volume = 0;
        function m() {
            return window.Promise && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
        }
        i.isOn = function () {
            return n;
        };
        i.isCapable = function () {
            return !!navigator.getUserMedia || m();
        };
        i.help = function () {
            var e = k(".item.mic");
            if (window.alert && e && e.dataset && e.dataset.error) {
                alert(e.dataset.error);
            }
        };
        i.toggle = function () {
            if (!u) {
                u = new AudioContext();
            }
            if (i.isCapable() && !n && !t) {
                t = true;
                if (u && u.resume) {
                    u.resume();
                }
                if (U.isMobile || c > 0) {
                    U.enableAwake();
                    if (m()) {
                        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(e).catch(h);
                    } else {
                        navigator.getUserMedia({ video: false, audio: true }, e, h);
                    }
                } else {
                    n = true;
                    V.useMic(true);
                }
            } else if (s) {
                if (U.isMobile || c > 0) {
                    U.disableAwake();
                    if (s.stop) {
                        s.stop();
                    } else if (a && a.stop) {
                        a.stop();
                    }
                    h();
                } else {
                    t = n = false;
                    V.useMic(false);
                    i.volume = 0;
                }
            }
        };
        return i;
    })();
    var f = (function () {
        var e = {},
            a = {},
            n = ["beep", "shush1", "shush2"],
            i;
        function t(e) {
            var t = new window.Audio(),
                i = "/assets/audio/" + e,
                n = document.createElement("source");
            n.type = "audio/mpeg";
            n.src = i + ".mp3";
            t.appendChild(n);
            n = document.createElement("source");
            n.type = "audio/ogg";
            n.src = i + ".ogg";
            t.appendChild(n);
            a[e] = t;
        }
        e.playTrack = function (t, e) {
            if (!!window.Audio) {
                clearTimeout(i);
                i = setTimeout(function () {
                    if (a[t]) {
                        a[t].muted = false;
                        var e = a[t].play();
                        if (e) {
                            e.catch(function () {});
                        }
                    }
                }, e || 0);
            }
        };
        e.prepareTracks = function () {
            if (!!window.Audio) {
                for (var e = 0; e < n.length; e++) {
                    var t = n[e];
                    if (a[t]) {
                        a[t].muted = true;
                        var i = a[t].play();
                        if (i) {
                            i.catch(function () {});
                        }
                    }
                }
            }
        };
        e.init = function () {
            if (!!window.Audio) {
                for (var e = 0; e < n.length; e++) {
                    t(n[e]);
                }
            }
        };
        return e;
    })();
    var H = (function () {
        var e = {},
            n = false,
            a,
            s,
            o,
            r;
        function t() {
            s.parentNode.removeChild(s);
        }
        function i(e) {
            if (e && e.propertyName === "top") {
                o.off("transitionend", i);
                t();
            }
        }
        function l(e) {
            A(e);
            document.title = "Bouncy Balls";
            r.off("click", l);
            r.off("touchstart", A, L ? { passive: false } : false);
            r.off("touchend", l, L ? { passive: false } : false);
            o.classList.remove("fade-in");
            o.classList.add("drop");
            if (s.classList.contains("bubbles")) {
                o.style.top = "-50%";
            } else {
                o.style.top = "125%";
            }
            o.style.opacity = 0;
            o.on("transitionend", i, false);
            r.parentNode.removeChild(r);
            a.parentNode.removeChild(a);
            var t = k(".intro-main .privacy");
            if (t && t.parentNode) {
                t.parentNode.removeChild(t);
            }
            if (U.isMobile) {
                f.prepareTracks();
            }
            setTimeout(function () {
                V.fadeIn(250);
                V.show(500);
                window.scrollTo(0, 0);
                D.fitBalls();
                D.play();
            }, 30);
        }
        e.hitTest = function (e, t) {
            if (F.isEnabled() || F.width < 601 || F.height < 481) {
                return false;
            }
            var i = F.width / 2,
                n = F.height / 2,
                a = 380,
                s = 190;
            if (e > i - a && e < i + a && t > n - s && t < n + s) {
                return true;
            }
            return false;
        };
        e.error = function () {
            F.hide();
            if (!document.querySelector) {
                return;
            }
            document.querySelector(".intro-text").style.display = "none";
            var e = document.querySelector(".intro-text.error");
            if (e) {
                e.style.display = "block";
                if (e.classList) {
                    e.classList.add("fade");
                    setTimeout(function () {
                        e.style.opacity = 1;
                    }, 20);
                } else {
                    e.style.opacity = 1;
                }
            }
        };
        e.init = function (e) {
            if (n) {
                return;
            }
            n = true;
            s = k(".intro-main");
            s.style.opacity = 0;
            s.show();
            s.classList.add("fade", e);
            a = k(".intro-text");
            a.classList.add("fade");
            setTimeout(function () {
                a.style.opacity = 1;
                s.style.opacity = 1;
            }, 20);
            o = s.get("h1");
            o.on("touchstart", A, L ? { passive: false } : false);
            var t = k(".intro-text.noscript");
            if (t && t.parentNode) {
                t.parentNode.removeChild(t);
            }
            var i = k(".intro-text.error");
            if (i && i.parentNode) {
                i.parentNode.removeChild(i);
            }
            r = s.get(".button");
            r.on("click", l, false);
            r.on("touchstart", A, L ? { passive: false } : false);
            r.on("touchend", l, L ? { passive: false } : false);
        };
        return e;
    })();
    var V = (function () {
        var i = {},
            u = false,
            c,
            d,
            h,
            m = new e(0, 2),
            p = new e(25, 250),
            v,
            n = 0,
            y,
            a,
            g,
            w = "",
            s;
        function e(e, t) {
            this.pressed = false;
            this.thumbWidth = 16;
            this.min = e;
            this.max = t;
        }
        e.prototype.initUI = function (e, t, i) {
            if (e) {
                this.bar = e;
                this.thumb = e.get(".thumb");
            }
            if (t) {
                this.title = t;
                this.text = t.innerHTML;
            }
            var n = this;
            function a(e) {
                e.preventDefault();
                if (!d.disabled) {
                    n.pressed = true;
                    o(n, e);
                }
            }
            e.on("mousedown", a, false);
            e.on("touchstart", a, L ? { passive: false } : false);
        };
        e.prototype.getThumbMax = function () {
            if (!this.bar) {
                return;
            }
            var e = 120,
                t = this.bar.getBoundingClientRect();
            if (t && t.width) {
                e = t.width;
            }
            return e - this.thumbWidth;
        };
        e.prototype.setThumb = function (e) {
            if (this.thumb && !isNaN(e)) {
                this.thumb.style.webkitTransform = this.thumb.style.transform = "translate3d(" + Math.clamp(Math.round(e), 0, this.getThumbMax()) + "px,0,0)";
            }
        };
        e.prototype.setThumbByValue = function (e) {
            if (!isNaN(e)) {
                this.setThumb(((e - this.min) / (this.max - this.min)) * this.getThumbMax());
            }
        };
        e.prototype.setValue = function (e) {
            this.value = Math.clamp(e, this.min, this.max);
            if (this.title && !isNaN(this.value)) {
                if (this === m) {
                    this.title.innerHTML = this.pressed ? Math.round(this.value * 100) + "%" : this.text;
                } else {
                    this.title.innerHTML = this.pressed ? Math.round(this.value) : this.text;
                }
            }
        };
        function o(e, t) {
            if (e.pressed && e.bar) {
                var i = e.bar.getBoundingClientRect();
                if (i && i.left) {
                    var n;
                    if (t.touches) {
                        if (t.touches.length === 1) {
                            n = t.touches[0].clientX;
                        } else {
                            return;
                        }
                    } else {
                        n = t.clientX;
                    }
                    n = n - i.left - e.thumbWidth / 2;
                    e.setThumb(n);
                    e.setValue((n / e.getThumbMax()) * (e.max - e.min) + e.min);
                }
            }
            if (e === m && e.pressed) {
                D.setElasticity(m.value);
            }
            A(t);
        }
        function b(e) {
            o(m, e);
            o(p, e);
        }
        function M(e) {
            if (p.pressed) {
                p.pressed = false;
                D.setTotal(p.value);
                i.disable();
            }
            if (m.pressed) {
                m.pressed = false;
                var t = m.value;
                D.setElasticity(t);
                i.setElasticity(t);
                try {
                    if (window.localStorage) {
                        localStorage.setItem("elasticity", Math.round(t * 100) / 100);
                    }
                } catch (e) {}
            }
        }
        function x(e) {
            A(e);
            D.swapMode(e.target.id || e.target.getAttribute("for"));
            i.disable();
        }
        function E(e) {
            A(e);
            w = e.target.id || e.target.getAttribute("for");
            var t = k('.item.noise .list input[id="' + w + '"]');
            if (t) {
                t.checked = true;
            }
            try {
                if (window.localStorage) {
                    localStorage.setItem("sound", w);
                }
            } catch (e) {}
        }
        i.setElasticity = function (e) {
            if (e < m.min) {
                return;
            }
            m.setValue(e);
            m.setThumbByValue(e);
        };
        i.setTotal = function (e, t) {
            if (e < p.min) {
                return;
            }
            p.max = t;
            p.setValue(Math.round(e));
            p.setThumbByValue(e);
        };
        i.setMode = function (e) {
            var t = k('.item.mode input[id="' + e + '"]');
            if (t) {
                t.checked = true;
            }
        };
        function S(e) {
            if (g) {
                if (!g.checked) {
                    clearTimeout(a);
                    v.style.opacity = 0;
                }
                try {
                    if (window.localStorage) {
                        localStorage.setItem("alert", g.checked);
                    }
                } catch (e) {}
                var t = k(".item.noise .list");
                if (t) {
                    clearTimeout(s);
                    t.show();
                    if (g.checked) {
                        s = setTimeout(function () {
                            t.style.opacity = 1;
                        }, 0);
                    } else {
                        t.style.opacity = 0;
                        s = setTimeout(function () {
                            t.hide();
                        }, 160);
                    }
                }
            }
        }
        i.useMic = function (e) {
            if (h) {
                if (e) {
                    h.classList.remove("off");
                    h.classList.add("on");
                } else {
                    h.classList.remove("on");
                    h.classList.add("off");
                }
            }
        };
        i.enable = function () {
            if (d) {
                d.disabled = false;
            }
        };
        i.disable = function () {
            if (d) {
                d.disabled = true;
            }
        };
        function T() {
            var e = y.length;
            for (var t = e; t--; ) {
                y[t].hide();
            }
            n++;
            if (n >= e) {
                n = 0;
                y.shuffle();
            }
        }
        i.showNoiseAlert = function () {
            if (v && g && g.checked) {
                if (/beep|shush/.test(w) && v.style.opacity < 1) {
                    var e = w;
                    if (w === "shush") {
                        e += Math.random() < 0.5 ? 1 : 2;
                    }
                    f.playTrack(e, 200);
                }
                y[n].show();
                v.style.opacity = 1;
                clearTimeout(a);
                a = setTimeout(function () {
                    v.style.opacity = 0;
                    a = setTimeout(T, 700);
                }, 2e3);
            }
        };
        i.fadeIn = function (e) {
            if (c) {
                c.style.opacity = 0;
                c.show();
                c.classList.add("fade");
                setTimeout(function () {
                    c.style.opacity = 1;
                }, e || 20);
            }
        };
        i.show = function (e) {
            if (c) {
                setTimeout(function () {
                    c.classList.remove("hidden");
                    c.classList.add("visible");
                }, e || 20);
            }
        };
        i.init = function () {
            if (u) {
                return;
            }
            u = true;
            c = k(".menu");
            d = c.get(".menu fieldset");
            d.on("touchmove", A, L ? { passive: false } : false);
            h = k(".item.mic .icon");
            if (Y.isCapable()) {
                P("microphone-on.svg");
                h.on("click", Y.toggle, false);
            } else {
                h.on("click", Y.help, false);
            }
            var e = c.get(".item.elasticity");
            m.initUI(e.get(".range"), e.get("h2"));
            var t = c.get(".item.total");
            p.initUI(t.get(".range"), t.get("h2"));
            c.on("mousemove", b, false);
            c.on("touchmove", b, L ? { passive: true } : false);
            document.body.on("mouseup", M, false);
            document.body.on("mouseleave", M, false);
            document.body.on("touchend", M, L ? { passive: true } : false);
            var i = c.getAll(".item.mode input"),
                n = c.getAll(".item.mode label");
            for (var a = i.length; a--; ) {
                i[a].on("change", x, false);
                n[a].on("touchstart", x, L ? { passive: false } : false);
            }
            v = k(".noise-alert");
            var s = v.getAll("h3");
            if (s) {
                y = [].slice.call(s);
            } else {
                y = [];
            }
            g = k("#noise");
            g.on("click", S, false);
            T();
            var o = U.isMobile ? "none" : "shush";
            try {
                if (window.localStorage) {
                    g.checked = localStorage.getItem("alert") !== "false";
                    o = localStorage.getItem("sound") || o;
                    S();
                }
            } catch (e) {}
            var r = c.getAll(".item.noise .list input"),
                l = c.getAll(".item.noise .list label");
            for (var a = r.length; a--; ) {
                var f = r[a];
                f.on("change", E, false);
                if (f.id === o) {
                    f.checked = true;
                    w = o;
                }
                l[a].on("touchstart", E, L ? { passive: false } : false);
            }
        };
        return i;
    })();
    if (e) {
        e("error", function (e) {
            e.preventDefault();
        });
    }
    var i = D.MODES.PLASTIC;
    try {
        if (window.localStorage) {
            i = localStorage.getItem("mode") || D.MODES.PLASTIC;
        }
    } catch (e) {}
    function n() {
        if (U.init()) {
            F.init();
            V.init();
            f.init();
            D.init(i);
            return true;
        } else {
            H.error();
            return false;
        }
    }
    if (e) {
        e("DOMContentLoaded", function (e) {
            if (window.innerWidth) {
                if (n()) {
                    window.onload = function (e) {
                        H.init(i);
                    };
                }
            } else {
                setTimeout(function () {
                    if (n()) {
                        H.init(i);
                    }
                }, 200);
            }
        });
    } else {
        H.error();
    }
})();
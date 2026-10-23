/**
 * DragDropTouch polyfill
 * Source: https://github.com/Bernardo-Castilho/dragdroptouch
 */
var DragDropTouch;
(function (DragDropTouch_1) {
    'use strict';
    var DataTransfer = (function () {
        function DataTransfer() {
            this._dropEffect = 'move';
            this._effectAllowed = 'all';
            this._data = {};
        }
        Object.defineProperty(DataTransfer.prototype, "dropEffect", {
            get: function () { return this._dropEffect; },
            set: function (value) { this._dropEffect = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
            get: function () { return this._effectAllowed; },
            set: function (value) { this._effectAllowed = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "types", {
            get: function () { return Object.keys(this._data); },
            enumerable: true,
            configurable: true
        });
        DataTransfer.prototype.clearData = function (type) {
            if (type !== null && type !== undefined) {
                delete this._data[type.toLowerCase()];
            }
            else {
                this._data = {};
            }
        };
        DataTransfer.prototype.getData = function (type) {
            return this._data[type.toLowerCase()] || '';
        };
        DataTransfer.prototype.setData = function (type, value) {
            this._data[type.toLowerCase()] = value;
        };
        DataTransfer.prototype.setDragImage = function (img, x, y) {
            this._dragImage = img;
            this._offset = { x: x, y: y };
        };
        return DataTransfer;
    }());
    DragDropTouch_1.DataTransfer = DataTransfer;
    var DragDropTouch = (function () {
        function DragDropTouch() {
            this._lastClick = 0;
            if (DragDropTouch._instance) {
                throw 'DragDropTouch instance already created.';
            }
            if ('ontouchstart' in document) {
                window.addEventListener('touchstart', this._touchstart.bind(this), { passive: false });
                window.addEventListener('touchmove', this._touchmove.bind(this), { passive: false });
                window.addEventListener('touchend', this._touchend.bind(this));
                window.addEventListener('touchcancel', this._touchend.bind(this));
            }
        }
        DragDropTouch.getInstance = function () {
            return DragDropTouch._instance;
        };
        DragDropTouch.prototype._touchstart = function (e) {
            var _this = this;
            if (this._shouldHandle(e)) {
                if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        e.preventDefault();
                        this._reset();
                        return;
                    }
                }
                this._reset();
                var src = this._closestDraggable(e.target);
                if (src) {
                    if (this._dispatchEvent(e, 'mousemove', e.target) ||
                        this._dispatchEvent(e, 'mousedown', e.target)) {
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastTouch = e;
                        e.preventDefault();
                        setTimeout(function () {
                            if (_this._dragSource == src && _this._img == null) {
                                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                    _this._reset();
                                }
                            }
                        }, DragDropTouch._CTXMENU);
                    }
                }
            }
        };
        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldHandle(e)) {
                var target = this._getTarget(e);
                if (this._dragSource && !this._img) {
                    var delta = this._getDelta(e);
                    if (delta > DragDropTouch._THRESHOLD) {
                        this._bootstrapDragStart(e);
                        this._bootstrapDragEnter(e);
                    }
                }
                if (this._img) {
                    this._lastTouch = e;
                    e.preventDefault();
                    if (target != this._lastTarget) {
                        this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                        this._dispatchEvent(e, 'dragenter', target);
                        this._lastTarget = target;
                    }
                    this._dispatchEvent(e, 'dragover', target);
                    this._moveImage(e);
                }
            }
        };
        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                if (this._img) {
                    this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                    this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                    this._reset();
                    e.preventDefault();
                }
                else if (this._dragSource) {
                    this._dispatchEvent(this._lastTouch, 'mouseup', e.target);
                    this._reset();
                }
                this._lastClick = Date.now();
            }
        };
        DragDropTouch.prototype._shouldHandle = function (e) {
            return e && !e.defaultPrevented && e.touches && e.touches.length < 2;
        };
        DragDropTouch.prototype._reset = function () {
            this._destroyImage();
            this._dragSource = null;
            this._lastTouch = null;
            this._lastTarget = null;
            this._ptDown = null;
            this._dataTransfer = new DataTransfer();
        };
        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches && e.touches.length) {
                return { x: page ? e.touches[0].pageX : e.touches[0].clientX, y: page ? e.touches[0].pageY : e.touches[0].clientY };
            }
            return { x: 0, y: 0 };
        };
        DragDropTouch.prototype._getDelta = function (e) {
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };
        DragDropTouch.prototype._getTarget = function (e) {
            var pt = this._getPoint(e);
            var el = document.elementFromPoint(pt.x, pt.y);
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        };
        DragDropTouch.prototype._closestDraggable = function (el) {
            for (; el; el = el.parentElement) {
                if (el.hasAttribute('draggable') && el.draggable) {
                    return el;
                }
            }
            return null;
        };
        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                this._copyProps(evt, e, DragDropTouch._kbdProps);
                this._copyProps(evt, t, DragDropTouch._ptProps);
                evt.dataTransfer = this._dataTransfer;
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };
        DragDropTouch.prototype._copyProps = function (dst, src, props) {
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                dst[p] = src[p];
            }
        };
        DragDropTouch.prototype._bootstrapDragStart = function (e) {
            if (this._dispatchEvent(e, 'dragstart', this._dragSource)) {
                this._dragSource.unselectable = 'on';
                this._createImage(e);
            }
        };
        DragDropTouch.prototype._bootstrapDragEnter = function (e) {
            var target = this._getTarget(e);
            this._dispatchEvent(e, 'dragenter', target);
            this._lastTarget = target;
        };
        DragDropTouch.prototype._createImage = function (e) {
            if (this._img) {
                this._destroyImage();
            }
            var src = this._imgCustom || this._dragSource;
            this._img = src.cloneNode(true);
            this._copyStyle(src, this._img);
            this._img.style.top = this._img.style.left = '-9999px';
            if (!this._imgCustom) {
                var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                this._img.style.opacity = '0.5';
            }
            this._img.style.position = 'fixed';
            this._img.style.pointerEvents = 'none';
            this._img.style.zIndex = '999999';
            document.body.appendChild(this._img);
            this._moveImage(e);
        };
        DragDropTouch.prototype._destroyImage = function () {
            if (this._img && this._img.parentElement) {
                this._img.parentElement.removeChild(this._img);
            }
            this._img = null;
            this._imgCustom = null;
        };
        DragDropTouch.prototype._moveImage = function (e) {
            var _this = this;
            requestAnimationFrame(function () {
                if (_this._img) {
                    var pt = _this._getPoint(e, true), s = _this._img.style;
                    s.position = 'absolute';
                    s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                    s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
                }
            });
        };
        DragDropTouch.prototype._copyStyle = function (src, dst) {
            DragDropTouch._rmvProps.forEach(function (p) {
                dst.removeAttribute(p);
            });
            if (src instanceof HTMLCanvasElement) {
                var cSrc = src, cDst = dst;
                cDst.width = cSrc.width;
                cDst.height = cSrc.height;
                cDst.getContext('2d').drawImage(cSrc, 0, 0);
            }
            var cs = getComputedStyle(src);
            for (var i = 0; i < cs.length; i++) {
                var key = cs[i];
                if (key.indexOf('transition') < 0) {
                    dst.style[key] = cs[key];
                }
            }
            dst.style.pointerEvents = 'none';
        };
        DragDropTouch._instance = new DragDropTouch();
        DragDropTouch._THRESHOLD = 5;
        DragDropTouch._CTXMENU = 900;
        DragDropTouch._DBLCLICK = 500;
        DragDropTouch._rmvProps = 'id,class,style,draggable'.split(',');
        DragDropTouch._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
        DragDropTouch._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY'.split(',');
        return DragDropTouch;
    }());
    DragDropTouch_1.DragDropTouch = DragDropTouch;
})(DragDropTouch || (DragDropTouch = {}));

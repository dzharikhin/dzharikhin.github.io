(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
const isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE)
  throw new Error("Non little-endian hardware is not supported");
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  let hex2 = "";
  for (let i = 0; i < bytes.length; i++) {
    hex2 += hexes[bytes[i]];
  }
  return hex2;
}
var buffer = {};
var base64Js = {};
var hasRequiredBase64Js;
function requireBase64Js() {
  if (hasRequiredBase64Js) return base64Js;
  hasRequiredBase64Js = 1;
  base64Js.byteLength = byteLength;
  base64Js.toByteArray = toByteArray;
  base64Js.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
  function getLens(b64) {
    var len2 = b64.length;
    if (len2 % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1) validLen = len2;
    var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i2;
    for (i2 = 0; i2 < len2; i2 += 4) {
      tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i2 = start; i2 < end; i2 += 3) {
      tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len2 = uint8.length;
    var extraBytes = len2 % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
      parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len2 - 1];
      parts.push(
        lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
      );
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(
        lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
      );
    }
    return parts.join("");
  }
  return base64Js;
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredIeee754;
function requireIeee754() {
  if (hasRequiredIeee754) return ieee754;
  hasRequiredIeee754 = 1;
  ieee754.read = function(buffer2, offset, isLE2, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE2 ? nBytes - 1 : 0;
    var d = isLE2 ? -1 : 1;
    var s = buffer2[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  ieee754.write = function(buffer2, value, offset, isLE2, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE2 ? 0 : nBytes - 1;
    var d = isLE2 ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer2[offset + i - d] |= s * 128;
  };
  return ieee754;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var hasRequiredBuffer;
function requireBuffer() {
  if (hasRequiredBuffer) return buffer;
  hasRequiredBuffer = 1;
  (function(exports) {
    const base64 = requireBase64Js();
    const ieee7542 = requireIeee754();
    const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    const K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer2.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer2, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer2 = Buffer2.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer2.length) {
            if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
            buf.copy(buffer2, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer2,
              buf,
              pos
            );
          }
        } else if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer2, pos);
        }
        pos += buf.length;
      }
      return buffer2;
    };
    function byteLength(string, encoding) {
      if (Buffer2.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
    }
    Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
      if (buffer2.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer2.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
      if (byteOffset >= buffer2.length) {
        if (dir) return -1;
        else byteOffset = buffer2.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    const MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer2.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee7542.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee7542.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee7542.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee7542.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }
      ieee7542.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }
      ieee7542.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    const errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE("offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        "offset",
        `>= ${0} and <= ${length}`,
        value
      );
    }
    const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    const hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  })(buffer);
  return buffer;
}
var bufferExports = requireBuffer();
var dist = {};
var utils$3 = {};
var _assert$1 = {};
var hasRequired_assert$1;
function require_assert$1() {
  if (hasRequired_assert$1) return _assert$1;
  hasRequired_assert$1 = 1;
  Object.defineProperty(_assert$1, "__esModule", { value: true });
  _assert$1.abool = abool;
  _assert$1.abytes = abytes2;
  _assert$1.aexists = aexists;
  _assert$1.ahash = ahash;
  _assert$1.anumber = anumber;
  _assert$1.aoutput = aoutput;
  _assert$1.isBytes = isBytes2;
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abytes2(b, ...lengths) {
    if (!isBytes2(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes2(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function abool(b) {
    if (typeof b !== "boolean")
      throw new Error(`boolean expected, not ${b}`);
  }
  return _assert$1;
}
var hasRequiredUtils$3;
function requireUtils$3() {
  if (hasRequiredUtils$3) return utils$3;
  hasRequiredUtils$3 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapCipher = exports.Hash = exports.nextTick = exports.isLE = exports.createView = exports.u32 = exports.u8 = void 0;
    exports.bytesToHex = bytesToHex2;
    exports.hexToBytes = hexToBytes;
    exports.hexToNumber = hexToNumber;
    exports.bytesToNumberBE = bytesToNumberBE;
    exports.numberToBytesBE = numberToBytesBE;
    exports.utf8ToBytes = utf8ToBytes;
    exports.bytesToUtf8 = bytesToUtf8;
    exports.toBytes = toBytes;
    exports.overlapBytes = overlapBytes;
    exports.complexOverlapBytes = complexOverlapBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.equalBytes = equalBytes;
    exports.getOutput = getOutput;
    exports.setBigUint64 = setBigUint64;
    exports.u64Lengths = u64Lengths;
    exports.isAligned32 = isAligned32;
    exports.copyBytes = copyBytes;
    exports.clean = clean;
    /*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
    const _assert_js_1 = /* @__PURE__ */ require_assert$1();
    const u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.u8 = u8;
    const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    exports.u32 = u32;
    const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.createView = createView;
    exports.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    if (!exports.isLE)
      throw new Error("Non little-endian hardware is not supported");
    const hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex2(bytes) {
      (0, _assert_js_1.abytes)(bytes);
      let hex2 = "";
      for (let i = 0; i < bytes.length; i++) {
        hex2 += hexes2[bytes[i]];
      }
      return hex2;
    }
    const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex2) {
      if (typeof hex2 !== "string")
        throw new Error("hex string expected, got " + typeof hex2);
      const hl = hex2.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex2.charCodeAt(hi));
        const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex2[hi] + hex2[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    function hexToNumber(hex2) {
      if (typeof hex2 !== "string")
        throw new Error("hex string expected, got " + typeof hex2);
      return BigInt(hex2 === "" ? "0" : "0x" + hex2);
    }
    function bytesToNumberBE(bytes) {
      return hexToNumber(bytesToHex2(bytes));
    }
    function numberToBytesBE(n, len) {
      return hexToBytes(n.toString(16).padStart(len * 2, "0"));
    }
    const nextTick = async () => {
    };
    exports.nextTick = nextTick;
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf8(bytes) {
      return new TextDecoder().decode(bytes);
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      else if ((0, _assert_js_1.isBytes)(data))
        data = copyBytes(data);
      else
        throw new Error("Uint8Array expected, got " + typeof data);
      return data;
    }
    function overlapBytes(a, b) {
      return a.buffer === b.buffer && // probably will fail with some obscure proxies, but this is best we can do
      a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
      b.byteOffset < a.byteOffset + a.byteLength;
    }
    function complexOverlapBytes(input, output) {
      if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
        throw new Error("complex overlap of input and output is not supported");
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        (0, _assert_js_1.abytes)(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts(defaults, opts) {
      if (opts == null || typeof opts !== "object")
        throw new Error("options must be defined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    function equalBytes(a, b) {
      if (a.length !== b.length)
        return false;
      let diff = 0;
      for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
      return diff === 0;
    }
    class Hash {
    }
    exports.Hash = Hash;
    const wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
      function wrappedCipher(key, ...args) {
        (0, _assert_js_1.abytes)(key);
        if (params.nonceLength !== void 0) {
          const nonce = args[0];
          if (!nonce)
            throw new Error("nonce / iv required");
          if (params.varSizeNonce)
            (0, _assert_js_1.abytes)(nonce);
          else
            (0, _assert_js_1.abytes)(nonce, params.nonceLength);
        }
        const tagl = params.tagLength;
        if (tagl && args[1] !== void 0) {
          (0, _assert_js_1.abytes)(args[1]);
        }
        const cipher = constructor(key, ...args);
        const checkOutput = (fnLength, output) => {
          if (output !== void 0) {
            if (fnLength !== 2)
              throw new Error("cipher output not supported");
            (0, _assert_js_1.abytes)(output);
          }
        };
        let called = false;
        const wrCipher = {
          encrypt(data, output) {
            if (called)
              throw new Error("cannot encrypt() twice with same key + nonce");
            called = true;
            (0, _assert_js_1.abytes)(data);
            checkOutput(cipher.encrypt.length, output);
            return cipher.encrypt(data, output);
          },
          decrypt(data, output) {
            (0, _assert_js_1.abytes)(data);
            if (tagl && data.length < tagl)
              throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
            checkOutput(cipher.decrypt.length, output);
            return cipher.decrypt(data, output);
          }
        };
        return wrCipher;
      }
      Object.assign(wrappedCipher, params);
      return wrappedCipher;
    };
    exports.wrapCipher = wrapCipher;
    function getOutput(expectedLength, out, onlyAligned = true) {
      if (out === void 0)
        return new Uint8Array(expectedLength);
      if (out.length !== expectedLength)
        throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
      if (onlyAligned && !isAligned32(out))
        throw new Error("invalid output, must be aligned");
      return out;
    }
    function setBigUint64(view, byteOffset, value, isLE2) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE2);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE2 ? 4 : 0;
      const l = isLE2 ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE2);
      view.setUint32(byteOffset + l, wl, isLE2);
    }
    function u64Lengths(ciphertext, AAD) {
      const num = new Uint8Array(16);
      const view = (0, exports.createView)(num);
      setBigUint64(view, 0, BigInt(AAD ? AAD.length : 0), true);
      setBigUint64(view, 8, BigInt(ciphertext.length), true);
      return num;
    }
    function isAligned32(bytes) {
      return bytes.byteOffset % 4 === 0;
    }
    function copyBytes(bytes) {
      return Uint8Array.from(bytes);
    }
    function clean(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
  })(utils$3);
  return utils$3;
}
var config = {};
var consts = {};
var hasRequiredConsts;
function requireConsts() {
  if (hasRequiredConsts) return consts;
  hasRequiredConsts = 1;
  Object.defineProperty(consts, "__esModule", { value: true });
  consts.AEAD_TAG_LENGTH = consts.XCHACHA20_NONCE_LENGTH = consts.CURVE25519_PUBLIC_KEY_SIZE = consts.ETH_PUBLIC_KEY_SIZE = consts.UNCOMPRESSED_PUBLIC_KEY_SIZE = consts.COMPRESSED_PUBLIC_KEY_SIZE = consts.SECRET_KEY_LENGTH = void 0;
  consts.SECRET_KEY_LENGTH = 32;
  consts.COMPRESSED_PUBLIC_KEY_SIZE = 33;
  consts.UNCOMPRESSED_PUBLIC_KEY_SIZE = 65;
  consts.ETH_PUBLIC_KEY_SIZE = 64;
  consts.CURVE25519_PUBLIC_KEY_SIZE = 32;
  consts.XCHACHA20_NONCE_LENGTH = 24;
  consts.AEAD_TAG_LENGTH = 16;
  return consts;
}
var hasRequiredConfig;
function requireConfig() {
  if (hasRequiredConfig) return config;
  hasRequiredConfig = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ephemeralKeySize = exports.symmetricNonceLength = exports.symmetricAlgorithm = exports.isHkdfKeyCompressed = exports.isEphemeralKeyCompressed = exports.ellipticCurve = exports.ECIES_CONFIG = void 0;
    var consts_1 = requireConsts();
    var Config = (
      /** @class */
      /* @__PURE__ */ function() {
        function Config2() {
          this.ellipticCurve = "secp256k1";
          this.isEphemeralKeyCompressed = false;
          this.isHkdfKeyCompressed = false;
          this.symmetricAlgorithm = "aes-256-gcm";
          this.symmetricNonceLength = 16;
        }
        return Config2;
      }()
    );
    exports.ECIES_CONFIG = new Config();
    var ellipticCurve = function() {
      return exports.ECIES_CONFIG.ellipticCurve;
    };
    exports.ellipticCurve = ellipticCurve;
    var isEphemeralKeyCompressed = function() {
      return exports.ECIES_CONFIG.isEphemeralKeyCompressed;
    };
    exports.isEphemeralKeyCompressed = isEphemeralKeyCompressed;
    var isHkdfKeyCompressed = function() {
      return exports.ECIES_CONFIG.isHkdfKeyCompressed;
    };
    exports.isHkdfKeyCompressed = isHkdfKeyCompressed;
    var symmetricAlgorithm = function() {
      return exports.ECIES_CONFIG.symmetricAlgorithm;
    };
    exports.symmetricAlgorithm = symmetricAlgorithm;
    var symmetricNonceLength = function() {
      return exports.ECIES_CONFIG.symmetricNonceLength;
    };
    exports.symmetricNonceLength = symmetricNonceLength;
    var ephemeralKeySize = function() {
      var mapping = {
        secp256k1: exports.ECIES_CONFIG.isEphemeralKeyCompressed ? consts_1.COMPRESSED_PUBLIC_KEY_SIZE : consts_1.UNCOMPRESSED_PUBLIC_KEY_SIZE,
        x25519: consts_1.CURVE25519_PUBLIC_KEY_SIZE,
        ed25519: consts_1.CURVE25519_PUBLIC_KEY_SIZE
      };
      if (exports.ECIES_CONFIG.ellipticCurve in mapping) {
        return mapping[exports.ECIES_CONFIG.ellipticCurve];
      } else {
        throw new Error("Not implemented");
      }
    };
    exports.ephemeralKeySize = ephemeralKeySize;
  })(config);
  return config;
}
var keys = {};
var PrivateKey = {};
var utils$2 = {};
var elliptic = {};
var webcrypto = {};
var crypto$1 = {};
var hasRequiredCrypto$1;
function requireCrypto$1() {
  if (hasRequiredCrypto$1) return crypto$1;
  hasRequiredCrypto$1 = 1;
  Object.defineProperty(crypto$1, "__esModule", { value: true });
  crypto$1.crypto = void 0;
  crypto$1.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  return crypto$1;
}
var hasRequiredWebcrypto;
function requireWebcrypto() {
  if (hasRequiredWebcrypto) return webcrypto;
  hasRequiredWebcrypto = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gcm = exports.ctr = exports.cbc = exports.utils = void 0;
    exports.randomBytes = randomBytes;
    exports.getWebcryptoSubtle = getWebcryptoSubtle;
    exports.managedNonce = managedNonce;
    const crypto_1 = /* @__PURE__ */ requireCrypto$1();
    const _assert_js_1 = /* @__PURE__ */ require_assert$1();
    const utils_js_1 = /* @__PURE__ */ requireUtils$3();
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return crypto_1.crypto.randomBytes(bytesLength);
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
    function getWebcryptoSubtle() {
      if (crypto_1.crypto && typeof crypto_1.crypto.subtle === "object" && crypto_1.crypto.subtle != null)
        return crypto_1.crypto.subtle;
      throw new Error("crypto.subtle must be defined");
    }
    function managedNonce(fn) {
      const { nonceLength } = fn;
      (0, _assert_js_1.anumber)(nonceLength);
      return (key, ...args) => ({
        encrypt(plaintext, ...argsEnc) {
          const nonce = randomBytes(nonceLength);
          const ciphertext = fn(key, nonce, ...args).encrypt(plaintext, ...argsEnc);
          const out = (0, utils_js_1.concatBytes)(nonce, ciphertext);
          ciphertext.fill(0);
          return out;
        },
        decrypt(ciphertext, ...argsDec) {
          const nonce = ciphertext.subarray(0, nonceLength);
          const data = ciphertext.subarray(nonceLength);
          return fn(key, nonce, ...args).decrypt(data, ...argsDec);
        }
      });
    }
    exports.utils = {
      async encrypt(key, keyParams, cryptParams, plaintext) {
        const cr = getWebcryptoSubtle();
        const iKey = await cr.importKey("raw", key, keyParams, true, ["encrypt"]);
        const ciphertext = await cr.encrypt(cryptParams, iKey, plaintext);
        return new Uint8Array(ciphertext);
      },
      async decrypt(key, keyParams, cryptParams, ciphertext) {
        const cr = getWebcryptoSubtle();
        const iKey = await cr.importKey("raw", key, keyParams, true, ["decrypt"]);
        const plaintext = await cr.decrypt(cryptParams, iKey, ciphertext);
        return new Uint8Array(plaintext);
      }
    };
    const mode = {
      CBC: "AES-CBC",
      CTR: "AES-CTR",
      GCM: "AES-GCM"
    };
    function getCryptParams(algo, nonce, AAD) {
      if (algo === mode.CBC)
        return { name: mode.CBC, iv: nonce };
      if (algo === mode.CTR)
        return { name: mode.CTR, counter: nonce, length: 64 };
      if (algo === mode.GCM) {
        if (AAD)
          return { name: mode.GCM, iv: nonce, additionalData: AAD };
        else
          return { name: mode.GCM, iv: nonce };
      }
      throw new Error("unknown aes block mode");
    }
    function generate(algo) {
      return (key, nonce, AAD) => {
        (0, _assert_js_1.abytes)(key);
        (0, _assert_js_1.abytes)(nonce);
        const keyParams = { name: algo, length: key.length * 8 };
        const cryptParams = getCryptParams(algo, nonce, AAD);
        let consumed = false;
        return {
          // keyLength,
          encrypt(plaintext) {
            (0, _assert_js_1.abytes)(plaintext);
            if (consumed)
              throw new Error("Cannot encrypt() twice with same key / nonce");
            consumed = true;
            return exports.utils.encrypt(key, keyParams, cryptParams, plaintext);
          },
          decrypt(ciphertext) {
            (0, _assert_js_1.abytes)(ciphertext);
            return exports.utils.decrypt(key, keyParams, cryptParams, ciphertext);
          }
        };
      };
    }
    exports.cbc = (() => generate(mode.CBC))();
    exports.ctr = (() => generate(mode.CTR))();
    exports.gcm = /* @__PURE__ */ (() => generate(mode.GCM))();
  })(webcrypto);
  return webcrypto;
}
var ed25519 = {};
var sha512 = {};
var _md = {};
var _assert = {};
var hasRequired_assert;
function require_assert() {
  if (hasRequired_assert) return _assert;
  hasRequired_assert = 1;
  Object.defineProperty(_assert, "__esModule", { value: true });
  _assert.anumber = anumber;
  _assert.abytes = abytes2;
  _assert.ahash = ahash;
  _assert.aexists = aexists;
  _assert.aoutput = aoutput;
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abytes2(b, ...lengths) {
    if (!isBytes2(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes2(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  return _assert;
}
var utils$1 = {};
var crypto = {};
var hasRequiredCrypto;
function requireCrypto() {
  if (hasRequiredCrypto) return crypto;
  hasRequiredCrypto = 1;
  Object.defineProperty(crypto, "__esModule", { value: true });
  crypto.crypto = void 0;
  crypto.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  return crypto;
}
var hasRequiredUtils$2;
function requireUtils$2() {
  if (hasRequiredUtils$2) return utils$1;
  hasRequiredUtils$2 = 1;
  (function(exports) {
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash = exports.nextTick = exports.byteSwapIfBE = exports.isLE = void 0;
    exports.isBytes = isBytes2;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.createView = createView;
    exports.rotr = rotr;
    exports.rotl = rotl;
    exports.byteSwap = byteSwap;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex2;
    exports.hexToBytes = hexToBytes;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes;
    exports.toBytes = toBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.wrapConstructor = wrapConstructor;
    exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
    exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
    exports.randomBytes = randomBytes;
    const crypto_1 = /* @__PURE__ */ requireCrypto();
    const _assert_js_1 = /* @__PURE__ */ require_assert();
    function isBytes2(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function createView(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function rotr(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    function rotl(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
    }
    const hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex2(bytes) {
      (0, _assert_js_1.abytes)(bytes);
      let hex2 = "";
      for (let i = 0; i < bytes.length; i++) {
        hex2 += hexes2[bytes[i]];
      }
      return hex2;
    }
    const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex2) {
      if (typeof hex2 !== "string")
        throw new Error("hex string expected, got " + typeof hex2);
      const hl = hex2.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex2.charCodeAt(hi));
        const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex2[hi] + hex2[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    const nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("utf8ToBytes expected string, got " + typeof str);
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      (0, _assert_js_1.abytes)(data);
      return data;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        (0, _assert_js_1.abytes)(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    class Hash {
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    }
    exports.Hash = Hash;
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("Options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    function wrapConstructor(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function wrapConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function wrapXOFConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return crypto_1.crypto.randomBytes(bytesLength);
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  })(utils$1);
  return utils$1;
}
var hasRequired_md;
function require_md() {
  if (hasRequired_md) return _md;
  hasRequired_md = 1;
  Object.defineProperty(_md, "__esModule", { value: true });
  _md.HashMD = void 0;
  _md.setBigUint64 = setBigUint64;
  _md.Chi = Chi;
  _md.Maj = Maj;
  const _assert_js_1 = /* @__PURE__ */ require_assert();
  const utils_js_1 = /* @__PURE__ */ requireUtils$2();
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  class HashMD extends utils_js_1.Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = (0, utils_js_1.createView)(this.buffer);
    }
    update(data) {
      (0, _assert_js_1.aexists)(this);
      const { view, buffer: buffer2, blockLen } = this;
      data = (0, utils_js_1.toBytes)(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = (0, utils_js_1.createView)(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer2.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      (0, _assert_js_1.aexists)(this);
      (0, _assert_js_1.aoutput)(out, this);
      this.finished = true;
      const { buffer: buffer2, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer2[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer2[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = (0, utils_js_1.createView)(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer: buffer2, outputLen } = this;
      this.digestInto(buffer2);
      const res = buffer2.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer2);
      return to;
    }
  }
  _md.HashMD = HashMD;
  return _md;
}
var _u64 = {};
var hasRequired_u64;
function require_u64() {
  if (hasRequired_u64) return _u64;
  hasRequired_u64 = 1;
  Object.defineProperty(_u64, "__esModule", { value: true });
  _u64.add5L = _u64.add5H = _u64.add4H = _u64.add4L = _u64.add3H = _u64.add3L = _u64.rotlBL = _u64.rotlBH = _u64.rotlSL = _u64.rotlSH = _u64.rotr32L = _u64.rotr32H = _u64.rotrBL = _u64.rotrBH = _u64.rotrSL = _u64.rotrSH = _u64.shrSL = _u64.shrSH = _u64.toBig = void 0;
  _u64.fromBig = fromBig;
  _u64.split = split;
  _u64.add = add;
  const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  const _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  const toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
  _u64.toBig = toBig;
  const shrSH = (h, _l, s) => h >>> s;
  _u64.shrSH = shrSH;
  const shrSL = (h, l, s) => h << 32 - s | l >>> s;
  _u64.shrSL = shrSL;
  const rotrSH = (h, l, s) => h >>> s | l << 32 - s;
  _u64.rotrSH = rotrSH;
  const rotrSL = (h, l, s) => h << 32 - s | l >>> s;
  _u64.rotrSL = rotrSL;
  const rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
  _u64.rotrBH = rotrBH;
  const rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
  _u64.rotrBL = rotrBL;
  const rotr32H = (_h, l) => l;
  _u64.rotr32H = rotr32H;
  const rotr32L = (h, _l) => h;
  _u64.rotr32L = rotr32L;
  const rotlSH = (h, l, s) => h << s | l >>> 32 - s;
  _u64.rotlSH = rotlSH;
  const rotlSL = (h, l, s) => l << s | h >>> 32 - s;
  _u64.rotlSL = rotlSL;
  const rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
  _u64.rotlBH = rotlBH;
  const rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
  _u64.rotlBL = rotlBL;
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  _u64.add3L = add3L;
  const add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  _u64.add3H = add3H;
  const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
  _u64.add4L = add4L;
  const add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
  _u64.add4H = add4H;
  const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
  _u64.add5L = add5L;
  const add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  _u64.add5H = add5H;
  const u64 = {
    fromBig,
    split,
    toBig,
    shrSH,
    shrSL,
    rotrSH,
    rotrSL,
    rotrBH,
    rotrBL,
    rotr32H,
    rotr32L,
    rotlSH,
    rotlSL,
    rotlBH,
    rotlBL,
    add,
    add3L,
    add3H,
    add4L,
    add4H,
    add5H,
    add5L
  };
  _u64.default = u64;
  return _u64;
}
var hasRequiredSha512;
function requireSha512() {
  if (hasRequiredSha512) return sha512;
  hasRequiredSha512 = 1;
  Object.defineProperty(sha512, "__esModule", { value: true });
  sha512.sha384 = sha512.sha512_256 = sha512.sha512_224 = sha512.sha512 = sha512.SHA384 = sha512.SHA512_256 = sha512.SHA512_224 = sha512.SHA512 = void 0;
  const _md_js_1 = /* @__PURE__ */ require_md();
  const _u64_js_1 = /* @__PURE__ */ require_u64();
  const utils_js_1 = /* @__PURE__ */ requireUtils$2();
  const [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => _u64_js_1.default.split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((n) => BigInt(n))))();
  const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
  const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
  class SHA512 extends _md_js_1.HashMD {
    constructor() {
      super(128, 64, 16, false);
      this.Ah = 1779033703 | 0;
      this.Al = 4089235720 | 0;
      this.Bh = 3144134277 | 0;
      this.Bl = 2227873595 | 0;
      this.Ch = 1013904242 | 0;
      this.Cl = 4271175723 | 0;
      this.Dh = 2773480762 | 0;
      this.Dl = 1595750129 | 0;
      this.Eh = 1359893119 | 0;
      this.El = 2917565137 | 0;
      this.Fh = 2600822924 | 0;
      this.Fl = 725511199 | 0;
      this.Gh = 528734635 | 0;
      this.Gl = 4215389547 | 0;
      this.Hh = 1541459225 | 0;
      this.Hl = 327033209 | 0;
    }
    // prettier-ignore
    get() {
      const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
      this.Ah = Ah | 0;
      this.Al = Al | 0;
      this.Bh = Bh | 0;
      this.Bl = Bl | 0;
      this.Ch = Ch | 0;
      this.Cl = Cl | 0;
      this.Dh = Dh | 0;
      this.Dl = Dl | 0;
      this.Eh = Eh | 0;
      this.El = El | 0;
      this.Fh = Fh | 0;
      this.Fl = Fl | 0;
      this.Gh = Gh | 0;
      this.Gl = Gl | 0;
      this.Hh = Hh | 0;
      this.Hl = Hl | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4) {
        SHA512_W_H[i] = view.getUint32(offset);
        SHA512_W_L[i] = view.getUint32(offset += 4);
      }
      for (let i = 16; i < 80; i++) {
        const W15h = SHA512_W_H[i - 15] | 0;
        const W15l = SHA512_W_L[i - 15] | 0;
        const s0h = _u64_js_1.default.rotrSH(W15h, W15l, 1) ^ _u64_js_1.default.rotrSH(W15h, W15l, 8) ^ _u64_js_1.default.shrSH(W15h, W15l, 7);
        const s0l = _u64_js_1.default.rotrSL(W15h, W15l, 1) ^ _u64_js_1.default.rotrSL(W15h, W15l, 8) ^ _u64_js_1.default.shrSL(W15h, W15l, 7);
        const W2h = SHA512_W_H[i - 2] | 0;
        const W2l = SHA512_W_L[i - 2] | 0;
        const s1h = _u64_js_1.default.rotrSH(W2h, W2l, 19) ^ _u64_js_1.default.rotrBH(W2h, W2l, 61) ^ _u64_js_1.default.shrSH(W2h, W2l, 6);
        const s1l = _u64_js_1.default.rotrSL(W2h, W2l, 19) ^ _u64_js_1.default.rotrBL(W2h, W2l, 61) ^ _u64_js_1.default.shrSL(W2h, W2l, 6);
        const SUMl = _u64_js_1.default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
        const SUMh = _u64_js_1.default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
        SHA512_W_H[i] = SUMh | 0;
        SHA512_W_L[i] = SUMl | 0;
      }
      let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      for (let i = 0; i < 80; i++) {
        const sigma1h = _u64_js_1.default.rotrSH(Eh, El, 14) ^ _u64_js_1.default.rotrSH(Eh, El, 18) ^ _u64_js_1.default.rotrBH(Eh, El, 41);
        const sigma1l = _u64_js_1.default.rotrSL(Eh, El, 14) ^ _u64_js_1.default.rotrSL(Eh, El, 18) ^ _u64_js_1.default.rotrBL(Eh, El, 41);
        const CHIh = Eh & Fh ^ ~Eh & Gh;
        const CHIl = El & Fl ^ ~El & Gl;
        const T1ll = _u64_js_1.default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
        const T1h = _u64_js_1.default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
        const T1l = T1ll | 0;
        const sigma0h = _u64_js_1.default.rotrSH(Ah, Al, 28) ^ _u64_js_1.default.rotrBH(Ah, Al, 34) ^ _u64_js_1.default.rotrBH(Ah, Al, 39);
        const sigma0l = _u64_js_1.default.rotrSL(Ah, Al, 28) ^ _u64_js_1.default.rotrBL(Ah, Al, 34) ^ _u64_js_1.default.rotrBL(Ah, Al, 39);
        const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
        const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
        Hh = Gh | 0;
        Hl = Gl | 0;
        Gh = Fh | 0;
        Gl = Fl | 0;
        Fh = Eh | 0;
        Fl = El | 0;
        ({ h: Eh, l: El } = _u64_js_1.default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
        Dh = Ch | 0;
        Dl = Cl | 0;
        Ch = Bh | 0;
        Cl = Bl | 0;
        Bh = Ah | 0;
        Bl = Al | 0;
        const All = _u64_js_1.default.add3L(T1l, sigma0l, MAJl);
        Ah = _u64_js_1.default.add3H(All, T1h, sigma0h, MAJh);
        Al = All | 0;
      }
      ({ h: Ah, l: Al } = _u64_js_1.default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
      ({ h: Bh, l: Bl } = _u64_js_1.default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
      ({ h: Ch, l: Cl } = _u64_js_1.default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
      ({ h: Dh, l: Dl } = _u64_js_1.default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
      ({ h: Eh, l: El } = _u64_js_1.default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
      ({ h: Fh, l: Fl } = _u64_js_1.default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
      ({ h: Gh, l: Gl } = _u64_js_1.default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
      ({ h: Hh, l: Hl } = _u64_js_1.default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
      this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
      SHA512_W_H.fill(0);
      SHA512_W_L.fill(0);
    }
    destroy() {
      this.buffer.fill(0);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  sha512.SHA512 = SHA512;
  class SHA512_224 extends SHA512 {
    constructor() {
      super();
      this.Ah = 2352822216 | 0;
      this.Al = 424955298 | 0;
      this.Bh = 1944164710 | 0;
      this.Bl = 2312950998 | 0;
      this.Ch = 502970286 | 0;
      this.Cl = 855612546 | 0;
      this.Dh = 1738396948 | 0;
      this.Dl = 1479516111 | 0;
      this.Eh = 258812777 | 0;
      this.El = 2077511080 | 0;
      this.Fh = 2011393907 | 0;
      this.Fl = 79989058 | 0;
      this.Gh = 1067287976 | 0;
      this.Gl = 1780299464 | 0;
      this.Hh = 286451373 | 0;
      this.Hl = 2446758561 | 0;
      this.outputLen = 28;
    }
  }
  sha512.SHA512_224 = SHA512_224;
  class SHA512_256 extends SHA512 {
    constructor() {
      super();
      this.Ah = 573645204 | 0;
      this.Al = 4230739756 | 0;
      this.Bh = 2673172387 | 0;
      this.Bl = 3360449730 | 0;
      this.Ch = 596883563 | 0;
      this.Cl = 1867755857 | 0;
      this.Dh = 2520282905 | 0;
      this.Dl = 1497426621 | 0;
      this.Eh = 2519219938 | 0;
      this.El = 2827943907 | 0;
      this.Fh = 3193839141 | 0;
      this.Fl = 1401305490 | 0;
      this.Gh = 721525244 | 0;
      this.Gl = 746961066 | 0;
      this.Hh = 246885852 | 0;
      this.Hl = 2177182882 | 0;
      this.outputLen = 32;
    }
  }
  sha512.SHA512_256 = SHA512_256;
  class SHA384 extends SHA512 {
    constructor() {
      super();
      this.Ah = 3418070365 | 0;
      this.Al = 3238371032 | 0;
      this.Bh = 1654270250 | 0;
      this.Bl = 914150663 | 0;
      this.Ch = 2438529370 | 0;
      this.Cl = 812702999 | 0;
      this.Dh = 355462360 | 0;
      this.Dl = 4144912697 | 0;
      this.Eh = 1731405415 | 0;
      this.El = 4290775857 | 0;
      this.Fh = 2394180231 | 0;
      this.Fl = 1750603025 | 0;
      this.Gh = 3675008525 | 0;
      this.Gl = 1694076839 | 0;
      this.Hh = 1203062813 | 0;
      this.Hl = 3204075428 | 0;
      this.outputLen = 48;
    }
  }
  sha512.SHA384 = SHA384;
  sha512.sha512 = (0, utils_js_1.wrapConstructor)(() => new SHA512());
  sha512.sha512_224 = (0, utils_js_1.wrapConstructor)(() => new SHA512_224());
  sha512.sha512_256 = (0, utils_js_1.wrapConstructor)(() => new SHA512_256());
  sha512.sha384 = (0, utils_js_1.wrapConstructor)(() => new SHA384());
  return sha512;
}
var curve = {};
var modular = {};
var utils = {};
var hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils;
  hasRequiredUtils$1 = 1;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(utils, "__esModule", { value: true });
  utils.notImplemented = utils.bitMask = void 0;
  utils.isBytes = isBytes2;
  utils.abytes = abytes2;
  utils.abool = abool;
  utils.bytesToHex = bytesToHex2;
  utils.numberToHexUnpadded = numberToHexUnpadded;
  utils.hexToNumber = hexToNumber;
  utils.hexToBytes = hexToBytes;
  utils.bytesToNumberBE = bytesToNumberBE;
  utils.bytesToNumberLE = bytesToNumberLE;
  utils.numberToBytesBE = numberToBytesBE;
  utils.numberToBytesLE = numberToBytesLE;
  utils.numberToVarBytesBE = numberToVarBytesBE;
  utils.ensureBytes = ensureBytes;
  utils.concatBytes = concatBytes;
  utils.equalBytes = equalBytes;
  utils.utf8ToBytes = utf8ToBytes;
  utils.inRange = inRange;
  utils.aInRange = aInRange;
  utils.bitLen = bitLen;
  utils.bitGet = bitGet;
  utils.bitSet = bitSet;
  utils.createHmacDrbg = createHmacDrbg;
  utils.validateObject = validateObject;
  utils.memoized = memoized;
  const _0n = /* @__PURE__ */ BigInt(0);
  const _1n = /* @__PURE__ */ BigInt(1);
  const _2n = /* @__PURE__ */ BigInt(2);
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abytes2(item) {
    if (!isBytes2(item))
      throw new Error("Uint8Array expected");
  }
  function abool(title, value) {
    if (typeof value !== "boolean")
      throw new Error(title + " boolean expected, got " + value);
  }
  const hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex2(bytes) {
    abytes2(bytes);
    let hex2 = "";
    for (let i = 0; i < bytes.length; i++) {
      hex2 += hexes2[bytes[i]];
    }
    return hex2;
  }
  function numberToHexUnpadded(num) {
    const hex2 = num.toString(16);
    return hex2.length & 1 ? "0" + hex2 : hex2;
  }
  function hexToNumber(hex2) {
    if (typeof hex2 !== "string")
      throw new Error("hex string expected, got " + typeof hex2);
    return hex2 === "" ? _0n : BigInt("0x" + hex2);
  }
  const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes(hex2) {
    if (typeof hex2 !== "string")
      throw new Error("hex string expected, got " + typeof hex2);
    const hl = hex2.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex2.charCodeAt(hi));
      const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex2[hi] + hex2[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex2(bytes));
  }
  function bytesToNumberLE(bytes) {
    abytes2(bytes);
    return hexToNumber(bytesToHex2(Uint8Array.from(bytes).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(n));
  }
  function ensureBytes(title, hex2, expectedLength) {
    let res;
    if (typeof hex2 === "string") {
      try {
        res = hexToBytes(hex2);
      } catch (e) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
      }
    } else if (isBytes2(hex2)) {
      res = Uint8Array.from(hex2);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes2(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  function equalBytes(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  const isPosBig = (n) => typeof n === "bigint" && _0n <= n;
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n;
  }
  function bitSet(n, pos, value) {
    return n | (value ? _1n : _0n) << BigInt(pos);
  }
  const bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
  utils.bitMask = bitMask;
  const u8n = (data) => new Uint8Array(data);
  const u8fr = (arr) => Uint8Array.from(arr);
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b);
    const reseed = (seed = u8n()) => {
      k = h(u8fr([0]), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8fr([1]), seed);
      v = h();
    };
    const gen = () => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  const validatorFns = {
    bigint: (val) => typeof val === "bigint",
    function: (val) => typeof val === "function",
    boolean: (val) => typeof val === "boolean",
    string: (val) => typeof val === "string",
    stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
  };
  function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
      const checkVal = validatorFns[type];
      if (typeof checkVal !== "function")
        throw new Error("invalid validator function");
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
      }
    };
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }
  const notImplemented = () => {
    throw new Error("not implemented");
  };
  utils.notImplemented = notImplemented;
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }
  return utils;
}
var hasRequiredModular;
function requireModular() {
  if (hasRequiredModular) return modular;
  hasRequiredModular = 1;
  Object.defineProperty(modular, "__esModule", { value: true });
  modular.isNegativeLE = void 0;
  modular.mod = mod;
  modular.pow = pow;
  modular.pow2 = pow2;
  modular.invert = invert;
  modular.tonelliShanks = tonelliShanks;
  modular.FpSqrt = FpSqrt;
  modular.validateField = validateField;
  modular.FpPow = FpPow;
  modular.FpInvertBatch = FpInvertBatch;
  modular.FpDiv = FpDiv;
  modular.FpLegendre = FpLegendre;
  modular.FpIsSquare = FpIsSquare;
  modular.nLength = nLength;
  modular.Field = Field;
  modular.FpSqrtOdd = FpSqrtOdd;
  modular.FpSqrtEven = FpSqrtEven;
  modular.hashToPrivateScalar = hashToPrivateScalar;
  modular.getFieldBytesLength = getFieldBytesLength;
  modular.getMinHashLength = getMinHashLength;
  modular.mapHashToField = mapHashToField;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const utils_js_1 = /* @__PURE__ */ requireUtils$1();
  const _0n = BigInt(0), _1n = BigInt(1), _2n = /* @__PURE__ */ BigInt(2), _3n = /* @__PURE__ */ BigInt(3);
  const _4n = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5), _8n = /* @__PURE__ */ BigInt(8);
  function mod(a, b) {
    const result = a % b;
    return result >= _0n ? result : b + result;
  }
  function pow(num, power, modulo) {
    if (power < _0n)
      throw new Error("invalid exponent, negatives unsupported");
    if (modulo <= _0n)
      throw new Error("invalid modulus");
    if (modulo === _1n)
      return _0n;
    let res = _1n;
    while (power > _0n) {
      if (power & _1n)
        res = res * num % modulo;
      num = num * num % modulo;
      power >>= _1n;
    }
    return res;
  }
  function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number, modulo) {
    if (number === _0n)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n, u = _1n;
    while (a !== _0n) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function tonelliShanks(P) {
    const legendreC = (P - _1n) / _2n;
    let Q, S, Z;
    for (Q = P - _1n, S = 0; Q % _2n === _0n; Q /= _2n, S++)
      ;
    for (Z = _2n; Z < P && pow(Z, legendreC, P) !== P - _1n; Z++) {
      if (Z > 1e3)
        throw new Error("Cannot find square root: likely non-prime P");
    }
    if (S === 1) {
      const p1div4 = (P + _1n) / _4n;
      return function tonelliFast(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    const Q1div2 = (Q + _1n) / _2n;
    return function tonelliSlow(Fp, n) {
      if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
        throw new Error("Cannot find square root");
      let r = S;
      let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
      let x = Fp.pow(n, Q1div2);
      let b = Fp.pow(n, Q);
      while (!Fp.eql(b, Fp.ONE)) {
        if (Fp.eql(b, Fp.ZERO))
          return Fp.ZERO;
        let m = 1;
        for (let t2 = Fp.sqr(b); m < r; m++) {
          if (Fp.eql(t2, Fp.ONE))
            break;
          t2 = Fp.sqr(t2);
        }
        const ge = Fp.pow(g, _1n << BigInt(r - m - 1));
        g = Fp.sqr(ge);
        x = Fp.mul(x, ge);
        b = Fp.mul(b, g);
        r = m;
      }
      return x;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n) {
      const p1div4 = (P + _1n) / _4n;
      return function sqrt3mod4(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    if (P % _8n === _5n) {
      const c1 = (P - _5n) / _8n;
      return function sqrt5mod8(Fp, n) {
        const n2 = Fp.mul(n, _2n);
        const v = Fp.pow(n2, c1);
        const nv = Fp.mul(n, v);
        const i = Fp.mul(Fp.mul(nv, _2n), v);
        const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    return tonelliShanks(P);
  }
  const isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n) === _1n;
  modular.isNegativeLE = isNegativeLE;
  const FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    return (0, utils_js_1.validateObject)(field, opts);
  }
  function FpPow(f, num, power) {
    if (power < _0n)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n)
      return f.ONE;
    if (power === _1n)
      return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n) {
      if (power & _1n)
        p = f.mul(p, d);
      d = f.sqr(d);
      power >>= _1n;
    }
    return p;
  }
  function FpInvertBatch(f, nums) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = acc;
      return f.mul(acc, num);
    }, f.ONE);
    const inverted = f.inv(lastMultiplied);
    nums.reduceRight((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = f.mul(acc, tmp[i]);
      return f.mul(acc, num);
    }, inverted);
    return tmp;
  }
  function FpDiv(f, lhs, rhs) {
    return f.mul(lhs, typeof rhs === "bigint" ? invert(rhs, f.ORDER) : f.inv(rhs));
  }
  function FpLegendre(order) {
    const legendreConst = (order - _1n) / _2n;
    return (f, x) => f.pow(x, legendreConst);
  }
  function FpIsSquare(f) {
    const legendre = FpLegendre(f.ORDER);
    return (x) => {
      const p = legendre(f, x);
      return f.eql(p, f.ZERO) || f.eql(p, f.ONE);
    };
  }
  function nLength(n, nBitLength) {
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLen, isLE2 = false, redef = {}) {
    if (ORDER <= _0n)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f = Object.freeze({
      ORDER,
      isLE: isLE2,
      BITS,
      BYTES,
      MASK: (0, utils_js_1.bitMask)(BITS),
      ZERO: _0n,
      ONE: _1n,
      create: (num) => mod(num, ORDER),
      isValid: (num) => {
        if (typeof num !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num);
        return _0n <= num && num < ORDER;
      },
      is0: (num) => num === _0n,
      isOdd: (num) => (num & _1n) === _1n,
      neg: (num) => mod(-num, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num) => mod(num * num, ORDER),
      add: (lhs, rhs) => mod(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
      pow: (num, power) => FpPow(f, num, power),
      div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num) => num * num,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num) => invert(num, ORDER),
      sqrt: redef.sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt(ORDER);
        return sqrtP(f, n);
      }),
      invertBatch: (lst) => FpInvertBatch(f, lst),
      // TODO: do we really need constant cmov?
      // We don't have const-time bigints anyway, so probably will be not very useful
      cmov: (a, b, c) => c ? b : a,
      toBytes: (num) => isLE2 ? (0, utils_js_1.numberToBytesLE)(num, BYTES) : (0, utils_js_1.numberToBytesBE)(num, BYTES),
      fromBytes: (bytes) => {
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        return isLE2 ? (0, utils_js_1.bytesToNumberLE)(bytes) : (0, utils_js_1.bytesToNumberBE)(bytes);
      }
    });
    return Object.freeze(f);
  }
  function FpSqrtOdd(Fp, elm) {
    if (!Fp.isOdd)
      throw new Error("Field doesn't have isOdd");
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? root : Fp.neg(root);
  }
  function FpSqrtEven(Fp, elm) {
    if (!Fp.isOdd)
      throw new Error("Field doesn't have isOdd");
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? Fp.neg(root) : root;
  }
  function hashToPrivateScalar(hash2, groupOrder, isLE2 = false) {
    hash2 = (0, utils_js_1.ensureBytes)("privateHash", hash2);
    const hashLen = hash2.length;
    const minLen = nLength(groupOrder).nByteLength + 8;
    if (minLen < 24 || hashLen < minLen || hashLen > 1024)
      throw new Error("hashToPrivateScalar: expected " + minLen + "-1024 bytes of input, got " + hashLen);
    const num = isLE2 ? (0, utils_js_1.bytesToNumberLE)(hash2) : (0, utils_js_1.bytesToNumberBE)(hash2);
    return mod(num, groupOrder - _1n) + _1n;
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num = isLE2 ? (0, utils_js_1.bytesToNumberLE)(key) : (0, utils_js_1.bytesToNumberBE)(key);
    const reduced = mod(num, fieldOrder - _1n) + _1n;
    return isLE2 ? (0, utils_js_1.numberToBytesLE)(reduced, fieldLen) : (0, utils_js_1.numberToBytesBE)(reduced, fieldLen);
  }
  return modular;
}
var hasRequiredCurve;
function requireCurve() {
  if (hasRequiredCurve) return curve;
  hasRequiredCurve = 1;
  Object.defineProperty(curve, "__esModule", { value: true });
  curve.wNAF = wNAF;
  curve.pippenger = pippenger;
  curve.precomputeMSMUnsafe = precomputeMSMUnsafe;
  curve.validateBasic = validateBasic;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const modular_js_1 = /* @__PURE__ */ requireModular();
  const utils_js_1 = /* @__PURE__ */ requireUtils$1();
  const _0n = BigInt(0);
  const _1n = BigInt(1);
  function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, bits) {
    validateW(W, bits);
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  }
  function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  const pointPrecomputes = /* @__PURE__ */ new WeakMap();
  const pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function wNAF(c, bits) {
    return {
      constTimeNegate,
      hasPrecomputes(elm) {
        return getW(elm) !== 1;
      },
      // non-const time multiplication ladder
      unsafeLadder(elm, n, p = c.ZERO) {
        let d = elm;
        while (n > _0n) {
          if (n & _1n)
            p = p.add(d);
          d = d.double();
          n >>= _1n;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param elm Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W) {
        const { windows, windowSize } = calcWOpts(W, bits);
        const points = [];
        let p = elm;
        let base = p;
        for (let window = 0; window < windows; window++) {
          base = p;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        const { windows, windowSize } = calcWOpts(W, bits);
        let p = c.ZERO;
        let f = c.BASE;
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
          const offset = window * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f = f.add(constTimeNegate(cond1, precomputes[offset1]));
          } else {
            p = p.add(constTimeNegate(cond2, precomputes[offset2]));
          }
        }
        return { p, f };
      },
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
        const { windows, windowSize } = calcWOpts(W, bits);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
          const offset = window * windowSize;
          if (n === _0n)
            break;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n;
          }
          if (wbits === 0)
            continue;
          let curr = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            curr = curr.negate();
          acc = acc.add(curr);
        }
        return acc;
      },
      getPrecomputes(W, P, transform) {
        let comp = pointPrecomputes.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W);
          if (W !== 1)
            pointPrecomputes.set(P, transform(comp));
        }
        return comp;
      },
      wNAFCached(P, n, transform) {
        const W = getW(P);
        return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
      },
      wNAFCachedUnsafe(P, n, transform, prev) {
        const W = getW(P);
        if (W === 1)
          return this.unsafeLadder(P, n, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
      },
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      setWindowSize(P, W) {
        validateW(W, bits);
        pointWindowSizes.set(P, W);
        pointPrecomputes.delete(P);
      }
    };
  }
  function pippenger(c, fieldN, points, scalars) {
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    if (points.length !== scalars.length)
      throw new Error("arrays of points and scalars must have equal length");
    const zero = c.ZERO;
    const wbits = (0, utils_js_1.bitLen)(BigInt(points.length));
    const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
    const MASK = (1 << windowSize) - 1;
    const buckets = new Array(MASK + 1).fill(zero);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero);
      for (let j = 0; j < scalars.length; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero;
      for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  function precomputeMSMUnsafe(c, fieldN, points, windowSize) {
    validateW(windowSize, fieldN.BITS);
    validateMSMPoints(points, c);
    const zero = c.ZERO;
    const tableSize = 2 ** windowSize - 1;
    const chunks = Math.ceil(fieldN.BITS / windowSize);
    const MASK = BigInt((1 << windowSize) - 1);
    const tables = points.map((p) => {
      const res = [];
      for (let i = 0, acc = p; i < tableSize; i++) {
        res.push(acc);
        acc = acc.add(p);
      }
      return res;
    });
    return (scalars) => {
      validateMSMScalars(scalars, fieldN);
      if (scalars.length > points.length)
        throw new Error("array of scalars must be smaller than array of points");
      let res = zero;
      for (let i = 0; i < chunks; i++) {
        if (res !== zero)
          for (let j = 0; j < windowSize; j++)
            res = res.double();
        const shiftBy = BigInt(chunks * windowSize - (i + 1) * windowSize);
        for (let j = 0; j < scalars.length; j++) {
          const n = scalars[j];
          const curr = Number(n >> shiftBy & MASK);
          if (!curr)
            continue;
          res = res.add(tables[j][curr - 1]);
        }
      }
      return res;
    };
  }
  function validateBasic(curve2) {
    (0, modular_js_1.validateField)(curve2.Fp);
    (0, utils_js_1.validateObject)(curve2, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...(0, modular_js_1.nLength)(curve2.n, curve2.nBitLength),
      ...curve2,
      ...{ p: curve2.Fp.ORDER }
    });
  }
  return curve;
}
var edwards = {};
var hasRequiredEdwards;
function requireEdwards() {
  if (hasRequiredEdwards) return edwards;
  hasRequiredEdwards = 1;
  Object.defineProperty(edwards, "__esModule", { value: true });
  edwards.twistedEdwards = twistedEdwards;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const curve_js_1 = /* @__PURE__ */ requireCurve();
  const modular_js_1 = /* @__PURE__ */ requireModular();
  const ut = /* @__PURE__ */ requireUtils$1();
  const utils_js_1 = /* @__PURE__ */ requireUtils$1();
  const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _8n = BigInt(8);
  const VERIFY_DEFAULT = { zip215: true };
  function validateOpts(curve2) {
    const opts = (0, curve_js_1.validateBasic)(curve2);
    ut.validateObject(curve2, {
      hash: "function",
      a: "bigint",
      d: "bigint",
      randomBytes: "function"
    }, {
      adjustScalarBytes: "function",
      domain: "function",
      uvRatio: "function",
      mapToCurve: "function"
    });
    return Object.freeze({ ...opts });
  }
  function twistedEdwards(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { Fp, n: CURVE_ORDER, prehash, hash: cHash, randomBytes, nByteLength, h: cofactor } = CURVE;
    const MASK = _2n << BigInt(nByteLength * 8) - _1n;
    const modP = Fp.create;
    const Fn = (0, modular_js_1.Field)(CURVE.n, CURVE.nBitLength);
    const uvRatio = CURVE.uvRatio || ((u, v) => {
      try {
        return { isValid: true, value: Fp.sqrt(u * Fp.inv(v)) };
      } catch (e) {
        return { isValid: false, value: _0n };
      }
    });
    const adjustScalarBytes = CURVE.adjustScalarBytes || ((bytes) => bytes);
    const domain = CURVE.domain || ((data, ctx, phflag) => {
      (0, utils_js_1.abool)("phflag", phflag);
      if (ctx.length || phflag)
        throw new Error("Contexts/pre-hash are not supported");
      return data;
    });
    function aCoordinate(title, n) {
      ut.aInRange("coordinate " + title, n, _0n, MASK);
    }
    function assertPoint(other) {
      if (!(other instanceof Point))
        throw new Error("ExtendedPoint expected");
    }
    const toAffineMemo = (0, utils_js_1.memoized)((p, iz) => {
      const { ex: x, ey: y, ez: z } = p;
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? _8n : Fp.inv(z);
      const ax = modP(x * iz);
      const ay = modP(y * iz);
      const zz = modP(z * iz);
      if (is0)
        return { x: _0n, y: _1n };
      if (zz !== _1n)
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    });
    const assertValidMemo = (0, utils_js_1.memoized)((p) => {
      const { a, d } = CURVE;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { ex: X, ey: Y, ez: Z, et: T } = p;
      const X2 = modP(X * X);
      const Y2 = modP(Y * Y);
      const Z2 = modP(Z * Z);
      const Z4 = modP(Z2 * Z2);
      const aX2 = modP(X2 * a);
      const left = modP(Z2 * modP(aX2 + Y2));
      const right = modP(Z4 + modP(d * modP(X2 * Y2)));
      if (left !== right)
        throw new Error("bad point: equation left != right (1)");
      const XY = modP(X * Y);
      const ZT = modP(Z * T);
      if (XY !== ZT)
        throw new Error("bad point: equation left != right (2)");
      return true;
    });
    class Point {
      constructor(ex, ey, ez, et) {
        this.ex = ex;
        this.ey = ey;
        this.ez = ez;
        this.et = et;
        aCoordinate("x", ex);
        aCoordinate("y", ey);
        aCoordinate("z", ez);
        aCoordinate("t", et);
        Object.freeze(this);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      static fromAffine(p) {
        if (p instanceof Point)
          throw new Error("extended point not allowed");
        const { x, y } = p || {};
        aCoordinate("x", x);
        aCoordinate("y", y);
        return new Point(x, y, _1n, modP(x * y));
      }
      static normalizeZ(points) {
        const toInv = Fp.invertBatch(points.map((p) => p.ez));
        return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
      }
      // Multiscalar Multiplication
      static msm(points, scalars) {
        return (0, curve_js_1.pippenger)(Point, Fn, points, scalars);
      }
      // "Private method", don't use it directly
      _setWindowSize(windowSize) {
        wnaf.setWindowSize(this, windowSize);
      }
      // Not required for fromHex(), which always creates valid points.
      // Could be useful for fromAffine().
      assertValidity() {
        assertValidMemo(this);
      }
      // Compare one point to another.
      equals(other) {
        assertPoint(other);
        const { ex: X1, ey: Y1, ez: Z1 } = this;
        const { ex: X2, ey: Y2, ez: Z2 } = other;
        const X1Z2 = modP(X1 * Z2);
        const X2Z1 = modP(X2 * Z1);
        const Y1Z2 = modP(Y1 * Z2);
        const Y2Z1 = modP(Y2 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      negate() {
        return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
      }
      // Fast algo for doubling Extended Point.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
      // Cost: 4M + 4S + 1*a + 6add + 1*2.
      double() {
        const { a } = CURVE;
        const { ex: X1, ey: Y1, ez: Z1 } = this;
        const A = modP(X1 * X1);
        const B = modP(Y1 * Y1);
        const C = modP(_2n * modP(Z1 * Z1));
        const D = modP(a * A);
        const x1y1 = X1 + Y1;
        const E = modP(modP(x1y1 * x1y1) - A - B);
        const G2 = D + B;
        const F = G2 - C;
        const H = D - B;
        const X3 = modP(E * F);
        const Y3 = modP(G2 * H);
        const T3 = modP(E * H);
        const Z3 = modP(F * G2);
        return new Point(X3, Y3, Z3, T3);
      }
      // Fast algo for adding 2 Extended Points.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
      // Cost: 9M + 1*a + 1*d + 7add.
      add(other) {
        assertPoint(other);
        const { a, d } = CURVE;
        const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
        const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
        if (a === BigInt(-1)) {
          const A2 = modP((Y1 - X1) * (Y2 + X2));
          const B2 = modP((Y1 + X1) * (Y2 - X2));
          const F2 = modP(B2 - A2);
          if (F2 === _0n)
            return this.double();
          const C2 = modP(Z1 * _2n * T2);
          const D2 = modP(T1 * _2n * Z2);
          const E2 = D2 + C2;
          const G3 = B2 + A2;
          const H2 = D2 - C2;
          const X32 = modP(E2 * F2);
          const Y32 = modP(G3 * H2);
          const T32 = modP(E2 * H2);
          const Z32 = modP(F2 * G3);
          return new Point(X32, Y32, Z32, T32);
        }
        const A = modP(X1 * X2);
        const B = modP(Y1 * Y2);
        const C = modP(T1 * d * T2);
        const D = modP(Z1 * Z2);
        const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
        const F = D - C;
        const G2 = D + C;
        const H = modP(B - a * A);
        const X3 = modP(E * F);
        const Y3 = modP(G2 * H);
        const T3 = modP(E * H);
        const Z3 = modP(F * G2);
        return new Point(X3, Y3, Z3, T3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      wNAF(n) {
        return wnaf.wNAFCached(this, n, Point.normalizeZ);
      }
      // Constant-time multiplication.
      multiply(scalar) {
        const n = scalar;
        ut.aInRange("scalar", n, _1n, CURVE_ORDER);
        const { p, f } = this.wNAF(n);
        return Point.normalizeZ([p, f])[0];
      }
      // Non-constant-time multiplication. Uses double-and-add algorithm.
      // It's faster, but should only be used when you don't care about
      // an exposed private key e.g. sig verification.
      // Does NOT allow scalars higher than CURVE.n.
      // Accepts optional accumulator to merge with multiply (important for sparse scalars)
      multiplyUnsafe(scalar, acc = Point.ZERO) {
        const n = scalar;
        ut.aInRange("scalar", n, _0n, CURVE_ORDER);
        if (n === _0n)
          return I;
        if (this.is0() || n === _1n)
          return this;
        return wnaf.wNAFCachedUnsafe(this, n, Point.normalizeZ, acc);
      }
      // Checks if point is of small order.
      // If you add something to small order point, you will have "dirty"
      // point with torsion component.
      // Multiplies point by cofactor and checks if the result is 0.
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      // Multiplies point by curve order and checks if the result is 0.
      // Returns `false` is the point is dirty.
      isTorsionFree() {
        return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
      }
      // Converts Extended point to default (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      toAffine(iz) {
        return toAffineMemo(this, iz);
      }
      clearCofactor() {
        const { h: cofactor2 } = CURVE;
        if (cofactor2 === _1n)
          return this;
        return this.multiplyUnsafe(cofactor2);
      }
      // Converts hash string or Uint8Array to Point.
      // Uses algo from RFC8032 5.1.3.
      static fromHex(hex2, zip215 = false) {
        const { d, a } = CURVE;
        const len = Fp.BYTES;
        hex2 = (0, utils_js_1.ensureBytes)("pointHex", hex2, len);
        (0, utils_js_1.abool)("zip215", zip215);
        const normed = hex2.slice();
        const lastByte = hex2[len - 1];
        normed[len - 1] = lastByte & -129;
        const y = ut.bytesToNumberLE(normed);
        const max = zip215 ? MASK : Fp.ORDER;
        ut.aInRange("pointHex.y", y, _0n, max);
        const y2 = modP(y * y);
        const u = modP(y2 - _1n);
        const v = modP(d * y2 - a);
        let { isValid, value: x } = uvRatio(u, v);
        if (!isValid)
          throw new Error("Point.fromHex: invalid y coordinate");
        const isXOdd = (x & _1n) === _1n;
        const isLastByteOdd = (lastByte & 128) !== 0;
        if (!zip215 && x === _0n && isLastByteOdd)
          throw new Error("Point.fromHex: x=0 and x_0=1");
        if (isLastByteOdd !== isXOdd)
          x = modP(-x);
        return Point.fromAffine({ x, y });
      }
      static fromPrivateKey(privKey) {
        return getExtendedPublicKey(privKey).point;
      }
      toRawBytes() {
        const { x, y } = this.toAffine();
        const bytes = ut.numberToBytesLE(y, Fp.BYTES);
        bytes[bytes.length - 1] |= x & _1n ? 128 : 0;
        return bytes;
      }
      toHex() {
        return ut.bytesToHex(this.toRawBytes());
      }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n, modP(CURVE.Gx * CURVE.Gy));
    Point.ZERO = new Point(_0n, _1n, _1n, _0n);
    const { BASE: G, ZERO: I } = Point;
    const wnaf = (0, curve_js_1.wNAF)(Point, nByteLength * 8);
    function modN(a) {
      return (0, modular_js_1.mod)(a, CURVE_ORDER);
    }
    function modN_LE(hash2) {
      return modN(ut.bytesToNumberLE(hash2));
    }
    function getExtendedPublicKey(key) {
      const len = Fp.BYTES;
      key = (0, utils_js_1.ensureBytes)("private key", key, len);
      const hashed = (0, utils_js_1.ensureBytes)("hashed private key", cHash(key), 2 * len);
      const head = adjustScalarBytes(hashed.slice(0, len));
      const prefix = hashed.slice(len, 2 * len);
      const scalar = modN_LE(head);
      const point = G.multiply(scalar);
      const pointBytes = point.toRawBytes();
      return { head, prefix, scalar, point, pointBytes };
    }
    function getPublicKey(privKey) {
      return getExtendedPublicKey(privKey).pointBytes;
    }
    function hashDomainToScalar(context = new Uint8Array(), ...msgs) {
      const msg = ut.concatBytes(...msgs);
      return modN_LE(cHash(domain(msg, (0, utils_js_1.ensureBytes)("context", context), !!prehash)));
    }
    function sign(msg, privKey, options = {}) {
      msg = (0, utils_js_1.ensureBytes)("message", msg);
      if (prehash)
        msg = prehash(msg);
      const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
      const r = hashDomainToScalar(options.context, prefix, msg);
      const R = G.multiply(r).toRawBytes();
      const k = hashDomainToScalar(options.context, R, pointBytes, msg);
      const s = modN(r + k * scalar);
      ut.aInRange("signature.s", s, _0n, CURVE_ORDER);
      const res = ut.concatBytes(R, ut.numberToBytesLE(s, Fp.BYTES));
      return (0, utils_js_1.ensureBytes)("result", res, Fp.BYTES * 2);
    }
    const verifyOpts = VERIFY_DEFAULT;
    function verify(sig, msg, publicKey, options = verifyOpts) {
      const { context, zip215 } = options;
      const len = Fp.BYTES;
      sig = (0, utils_js_1.ensureBytes)("signature", sig, 2 * len);
      msg = (0, utils_js_1.ensureBytes)("message", msg);
      publicKey = (0, utils_js_1.ensureBytes)("publicKey", publicKey, len);
      if (zip215 !== void 0)
        (0, utils_js_1.abool)("zip215", zip215);
      if (prehash)
        msg = prehash(msg);
      const s = ut.bytesToNumberLE(sig.slice(len, 2 * len));
      let A, R, SB;
      try {
        A = Point.fromHex(publicKey, zip215);
        R = Point.fromHex(sig.slice(0, len), zip215);
        SB = G.multiplyUnsafe(s);
      } catch (error) {
        return false;
      }
      if (!zip215 && A.isSmallOrder())
        return false;
      const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
      const RkA = R.add(A.multiplyUnsafe(k));
      return RkA.subtract(SB).clearCofactor().equals(Point.ZERO);
    }
    G._setWindowSize(8);
    const utils2 = {
      getExtendedPublicKey,
      // ed25519 private keys are uniform 32b. No need to check for modulo bias, like in secp256k1.
      randomPrivateKey: () => randomBytes(Fp.BYTES),
      /**
       * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
       * values. This slows down first getPublicKey() by milliseconds (see Speed section),
       * but allows to speed-up subsequent getPublicKey() calls up to 20x.
       * @param windowSize 2, 4, 8, 16
       */
      precompute(windowSize = 8, point = Point.BASE) {
        point._setWindowSize(windowSize);
        point.multiply(BigInt(3));
        return point;
      }
    };
    return {
      CURVE,
      getPublicKey,
      sign,
      verify,
      ExtendedPoint: Point,
      utils: utils2
    };
  }
  return edwards;
}
var hashToCurve = {};
var hasRequiredHashToCurve;
function requireHashToCurve() {
  if (hasRequiredHashToCurve) return hashToCurve;
  hasRequiredHashToCurve = 1;
  Object.defineProperty(hashToCurve, "__esModule", { value: true });
  hashToCurve.expand_message_xmd = expand_message_xmd;
  hashToCurve.expand_message_xof = expand_message_xof;
  hashToCurve.hash_to_field = hash_to_field;
  hashToCurve.isogenyMap = isogenyMap;
  hashToCurve.createHasher = createHasher;
  const modular_js_1 = /* @__PURE__ */ requireModular();
  const utils_js_1 = /* @__PURE__ */ requireUtils$1();
  const os2ip = utils_js_1.bytesToNumberBE;
  function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << 8 * length)
      throw new Error("invalid I2OSP input: " + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  }
  function anum(item) {
    if (!Number.isSafeInteger(item))
      throw new Error("number expected");
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    (0, utils_js_1.abytes)(msg);
    (0, utils_js_1.abytes)(DST);
    anum(lenInBytes);
    if (DST.length > 255)
      DST = H((0, utils_js_1.concatBytes)((0, utils_js_1.utf8ToBytes)("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = (0, utils_js_1.concatBytes)(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H((0, utils_js_1.concatBytes)(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H((0, utils_js_1.concatBytes)(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H((0, utils_js_1.concatBytes)(...args));
    }
    const pseudo_random_bytes = (0, utils_js_1.concatBytes)(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    (0, utils_js_1.abytes)(msg);
    (0, utils_js_1.abytes)(DST);
    anum(lenInBytes);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update((0, utils_js_1.utf8ToBytes)("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
    return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    (0, utils_js_1.validateObject)(options, {
      DST: "stringOrUint8Array",
      p: "bigint",
      m: "isSafeInteger",
      k: "isSafeInteger",
      hash: "hash"
    });
    const { p, k, m, hash: hash2, expand, DST: _DST } = options;
    (0, utils_js_1.abytes)(msg);
    anum(count);
    const DST = typeof _DST === "string" ? (0, utils_js_1.utf8ToBytes)(_DST) : _DST;
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8);
    const len_in_bytes = count * m * L;
    let prb;
    if (expand === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
    } else if (expand === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
    } else if (expand === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
      const e = new Array(m);
      for (let j = 0; j < m; j++) {
        const elm_offset = L * (j + i * m);
        const tv = prb.subarray(elm_offset, elm_offset + L);
        e[j] = (0, modular_js_1.mod)(os2ip(tv), p);
      }
      u[i] = e;
    }
    return u;
  }
  function isogenyMap(field, map) {
    const COEFF = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
      const [xNum, xDen, yNum, yDen] = COEFF.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      x = field.div(xNum, xDen);
      y = field.mul(y, field.div(yNum, yDen));
      return { x, y };
    };
  }
  function createHasher(Point, mapToCurve, def) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    return {
      // Encodes byte string to elliptic curve.
      // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      hashToCurve(msg, options) {
        const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
        const u0 = Point.fromAffine(mapToCurve(u[0]));
        const u1 = Point.fromAffine(mapToCurve(u[1]));
        const P = u0.add(u1).clearCofactor();
        P.assertValidity();
        return P;
      },
      // Encodes byte string to elliptic curve.
      // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      encodeToCurve(msg, options) {
        const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
        const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
        P.assertValidity();
        return P;
      },
      // Same as encodeToCurve, but without hash
      mapToCurve(scalars) {
        if (!Array.isArray(scalars))
          throw new Error("mapToCurve: expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("mapToCurve: expected array of bigints");
        const P = Point.fromAffine(mapToCurve(scalars)).clearCofactor();
        P.assertValidity();
        return P;
      }
    };
  }
  return hashToCurve;
}
var montgomery = {};
var hasRequiredMontgomery;
function requireMontgomery() {
  if (hasRequiredMontgomery) return montgomery;
  hasRequiredMontgomery = 1;
  Object.defineProperty(montgomery, "__esModule", { value: true });
  montgomery.montgomery = montgomery$1;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const modular_js_1 = /* @__PURE__ */ requireModular();
  const utils_js_1 = /* @__PURE__ */ requireUtils$1();
  const _0n = BigInt(0);
  const _1n = BigInt(1);
  function validateOpts(curve2) {
    (0, utils_js_1.validateObject)(curve2, {
      a: "bigint"
    }, {
      montgomeryBits: "isSafeInteger",
      nByteLength: "isSafeInteger",
      adjustScalarBytes: "function",
      domain: "function",
      powPminus2: "function",
      Gu: "bigint"
    });
    return Object.freeze({ ...curve2 });
  }
  function montgomery$1(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { P } = CURVE;
    const modP = (n) => (0, modular_js_1.mod)(n, P);
    const montgomeryBits = CURVE.montgomeryBits;
    const montgomeryBytes = Math.ceil(montgomeryBits / 8);
    const fieldLen = CURVE.nByteLength;
    const adjustScalarBytes = CURVE.adjustScalarBytes || ((bytes) => bytes);
    const powPminus2 = CURVE.powPminus2 || ((x) => (0, modular_js_1.pow)(x, P - BigInt(2), P));
    function cswap(swap, x_2, x_3) {
      const dummy = modP(swap * (x_2 - x_3));
      x_2 = modP(x_2 - dummy);
      x_3 = modP(x_3 + dummy);
      return [x_2, x_3];
    }
    const a24 = (CURVE.a - BigInt(2)) / BigInt(4);
    function montgomeryLadder(u, scalar) {
      (0, utils_js_1.aInRange)("u", u, _0n, P);
      (0, utils_js_1.aInRange)("scalar", scalar, _0n, P);
      const k = scalar;
      const x_1 = u;
      let x_2 = _1n;
      let z_2 = _0n;
      let x_3 = u;
      let z_3 = _1n;
      let swap = _0n;
      let sw;
      for (let t = BigInt(montgomeryBits - 1); t >= _0n; t--) {
        const k_t = k >> t & _1n;
        swap ^= k_t;
        sw = cswap(swap, x_2, x_3);
        x_2 = sw[0];
        x_3 = sw[1];
        sw = cswap(swap, z_2, z_3);
        z_2 = sw[0];
        z_3 = sw[1];
        swap = k_t;
        const A = x_2 + z_2;
        const AA = modP(A * A);
        const B = x_2 - z_2;
        const BB = modP(B * B);
        const E = AA - BB;
        const C = x_3 + z_3;
        const D = x_3 - z_3;
        const DA = modP(D * A);
        const CB = modP(C * B);
        const dacb = DA + CB;
        const da_cb = DA - CB;
        x_3 = modP(dacb * dacb);
        z_3 = modP(x_1 * modP(da_cb * da_cb));
        x_2 = modP(AA * BB);
        z_2 = modP(E * (AA + modP(a24 * E)));
      }
      sw = cswap(swap, x_2, x_3);
      x_2 = sw[0];
      x_3 = sw[1];
      sw = cswap(swap, z_2, z_3);
      z_2 = sw[0];
      z_3 = sw[1];
      const z2 = powPminus2(z_2);
      return modP(x_2 * z2);
    }
    function encodeUCoordinate(u) {
      return (0, utils_js_1.numberToBytesLE)(modP(u), montgomeryBytes);
    }
    function decodeUCoordinate(uEnc) {
      const u = (0, utils_js_1.ensureBytes)("u coordinate", uEnc, montgomeryBytes);
      if (fieldLen === 32)
        u[31] &= 127;
      return (0, utils_js_1.bytesToNumberLE)(u);
    }
    function decodeScalar(n) {
      const bytes = (0, utils_js_1.ensureBytes)("scalar", n);
      const len = bytes.length;
      if (len !== montgomeryBytes && len !== fieldLen) {
        let valid = "" + montgomeryBytes + " or " + fieldLen;
        throw new Error("invalid scalar, expected " + valid + " bytes, got " + len);
      }
      return (0, utils_js_1.bytesToNumberLE)(adjustScalarBytes(bytes));
    }
    function scalarMult(scalar, u) {
      const pointU = decodeUCoordinate(u);
      const _scalar = decodeScalar(scalar);
      const pu = montgomeryLadder(pointU, _scalar);
      if (pu === _0n)
        throw new Error("invalid private or public key received");
      return encodeUCoordinate(pu);
    }
    const GuBytes = encodeUCoordinate(CURVE.Gu);
    function scalarMultBase(scalar) {
      return scalarMult(scalar, GuBytes);
    }
    return {
      scalarMult,
      scalarMultBase,
      getSharedSecret: (privateKey, publicKey) => scalarMult(privateKey, publicKey),
      getPublicKey: (privateKey) => scalarMultBase(privateKey),
      utils: { randomPrivateKey: () => CURVE.randomBytes(CURVE.nByteLength) },
      GuBytes
    };
  }
  return montgomery;
}
var hasRequiredEd25519;
function requireEd25519() {
  if (hasRequiredEd25519) return ed25519;
  hasRequiredEd25519 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hash_to_ristretto255 = exports.hashToRistretto255 = exports.RistrettoPoint = exports.encodeToCurve = exports.hashToCurve = exports.edwardsToMontgomery = exports.x25519 = exports.ed25519ph = exports.ed25519ctx = exports.ed25519 = exports.ED25519_TORSION_SUBGROUP = void 0;
    exports.edwardsToMontgomeryPub = edwardsToMontgomeryPub;
    exports.edwardsToMontgomeryPriv = edwardsToMontgomeryPriv;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const sha512_1 = /* @__PURE__ */ requireSha512();
    const utils_1 = /* @__PURE__ */ requireUtils$2();
    const curve_js_1 = /* @__PURE__ */ requireCurve();
    const edwards_js_1 = /* @__PURE__ */ requireEdwards();
    const hash_to_curve_js_1 = /* @__PURE__ */ requireHashToCurve();
    const modular_js_1 = /* @__PURE__ */ requireModular();
    const montgomery_js_1 = /* @__PURE__ */ requireMontgomery();
    const utils_js_1 = /* @__PURE__ */ requireUtils$1();
    const ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
    const ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
    const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3);
    const _5n = BigInt(5), _8n = BigInt(8);
    function ed25519_pow_2_252_3(x) {
      const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
      const P = ED25519_P;
      const x2 = x * x % P;
      const b2 = x2 * x % P;
      const b4 = (0, modular_js_1.pow2)(b2, _2n, P) * b2 % P;
      const b5 = (0, modular_js_1.pow2)(b4, _1n, P) * x % P;
      const b10 = (0, modular_js_1.pow2)(b5, _5n, P) * b5 % P;
      const b20 = (0, modular_js_1.pow2)(b10, _10n, P) * b10 % P;
      const b40 = (0, modular_js_1.pow2)(b20, _20n, P) * b20 % P;
      const b80 = (0, modular_js_1.pow2)(b40, _40n, P) * b40 % P;
      const b160 = (0, modular_js_1.pow2)(b80, _80n, P) * b80 % P;
      const b240 = (0, modular_js_1.pow2)(b160, _80n, P) * b80 % P;
      const b250 = (0, modular_js_1.pow2)(b240, _10n, P) * b10 % P;
      const pow_p_5_8 = (0, modular_js_1.pow2)(b250, _2n, P) * x % P;
      return { pow_p_5_8, b2 };
    }
    function adjustScalarBytes(bytes) {
      bytes[0] &= 248;
      bytes[31] &= 127;
      bytes[31] |= 64;
      return bytes;
    }
    function uvRatio(u, v) {
      const P = ED25519_P;
      const v3 = (0, modular_js_1.mod)(v * v * v, P);
      const v7 = (0, modular_js_1.mod)(v3 * v3 * v, P);
      const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
      let x = (0, modular_js_1.mod)(u * v3 * pow, P);
      const vx2 = (0, modular_js_1.mod)(v * x * x, P);
      const root1 = x;
      const root2 = (0, modular_js_1.mod)(x * ED25519_SQRT_M1, P);
      const useRoot1 = vx2 === u;
      const useRoot2 = vx2 === (0, modular_js_1.mod)(-u, P);
      const noRoot = vx2 === (0, modular_js_1.mod)(-u * ED25519_SQRT_M1, P);
      if (useRoot1)
        x = root1;
      if (useRoot2 || noRoot)
        x = root2;
      if ((0, modular_js_1.isNegativeLE)(x, P))
        x = (0, modular_js_1.mod)(-x, P);
      return { isValid: useRoot1 || useRoot2, value: x };
    }
    exports.ED25519_TORSION_SUBGROUP = [
      "0100000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
      "0000000000000000000000000000000000000000000000000000000000000080",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
      "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
    ];
    const Fp = /* @__PURE__ */ (() => (0, modular_js_1.Field)(ED25519_P, void 0, true))();
    const ed25519Defaults = /* @__PURE__ */ (() => ({
      // Param: a
      a: BigInt(-1),
      // Fp.create(-1) is proper; our way still works and is faster
      // d is equal to -121665/121666 over finite field.
      // Negative number is P - number, and division is invert(number, P)
      d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
      // Finite field 𝔽p over which we'll do calculations; 2n**255n - 19n
      Fp,
      // Subgroup order: how many points curve has
      // 2n**252n + 27742317777372353535851937790883648493n;
      n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
      // Cofactor
      h: _8n,
      // Base point (x, y) aka generator point
      Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
      Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
      hash: sha512_1.sha512,
      randomBytes: utils_1.randomBytes,
      adjustScalarBytes,
      // dom2
      // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
      // Constant-time, u/√v
      uvRatio
    }))();
    exports.ed25519 = (() => (0, edwards_js_1.twistedEdwards)(ed25519Defaults))();
    function ed25519_domain(data, ctx, phflag) {
      if (ctx.length > 255)
        throw new Error("Context is too big");
      return (0, utils_1.concatBytes)((0, utils_1.utf8ToBytes)("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
    }
    exports.ed25519ctx = (() => (0, edwards_js_1.twistedEdwards)({
      ...ed25519Defaults,
      domain: ed25519_domain
    }))();
    exports.ed25519ph = (() => (0, edwards_js_1.twistedEdwards)(Object.assign({}, ed25519Defaults, {
      domain: ed25519_domain,
      prehash: sha512_1.sha512
    })))();
    exports.x25519 = (() => (0, montgomery_js_1.montgomery)({
      P: ED25519_P,
      a: BigInt(486662),
      montgomeryBits: 255,
      // n is 253 bits
      nByteLength: 32,
      Gu: BigInt(9),
      powPminus2: (x) => {
        const P = ED25519_P;
        const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
        return (0, modular_js_1.mod)((0, modular_js_1.pow2)(pow_p_5_8, _3n, P) * b2, P);
      },
      adjustScalarBytes,
      randomBytes: utils_1.randomBytes
    }))();
    function edwardsToMontgomeryPub(edwardsPub) {
      const { y } = exports.ed25519.ExtendedPoint.fromHex(edwardsPub);
      const _1n2 = BigInt(1);
      return Fp.toBytes(Fp.create((_1n2 + y) * Fp.inv(_1n2 - y)));
    }
    exports.edwardsToMontgomery = edwardsToMontgomeryPub;
    function edwardsToMontgomeryPriv(edwardsPriv) {
      const hashed = ed25519Defaults.hash(edwardsPriv.subarray(0, 32));
      return ed25519Defaults.adjustScalarBytes(hashed).subarray(0, 32);
    }
    const ELL2_C1 = /* @__PURE__ */ (() => (Fp.ORDER + _3n) / _8n)();
    const ELL2_C2 = /* @__PURE__ */ (() => Fp.pow(_2n, ELL2_C1))();
    const ELL2_C3 = /* @__PURE__ */ (() => Fp.sqrt(Fp.neg(Fp.ONE)))();
    function map_to_curve_elligator2_curve25519(u) {
      const ELL2_C4 = (Fp.ORDER - _5n) / _8n;
      const ELL2_J = BigInt(486662);
      let tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, _2n);
      let xd = Fp.add(tv1, Fp.ONE);
      let x1n = Fp.neg(ELL2_J);
      let tv2 = Fp.sqr(xd);
      let gxd = Fp.mul(tv2, xd);
      let gx1 = Fp.mul(tv1, ELL2_J);
      gx1 = Fp.mul(gx1, x1n);
      gx1 = Fp.add(gx1, tv2);
      gx1 = Fp.mul(gx1, x1n);
      let tv3 = Fp.sqr(gxd);
      tv2 = Fp.sqr(tv3);
      tv3 = Fp.mul(tv3, gxd);
      tv3 = Fp.mul(tv3, gx1);
      tv2 = Fp.mul(tv2, tv3);
      let y11 = Fp.pow(tv2, ELL2_C4);
      y11 = Fp.mul(y11, tv3);
      let y12 = Fp.mul(y11, ELL2_C3);
      tv2 = Fp.sqr(y11);
      tv2 = Fp.mul(tv2, gxd);
      let e1 = Fp.eql(tv2, gx1);
      let y1 = Fp.cmov(y12, y11, e1);
      let x2n = Fp.mul(x1n, tv1);
      let y21 = Fp.mul(y11, u);
      y21 = Fp.mul(y21, ELL2_C2);
      let y22 = Fp.mul(y21, ELL2_C3);
      let gx2 = Fp.mul(gx1, tv1);
      tv2 = Fp.sqr(y21);
      tv2 = Fp.mul(tv2, gxd);
      let e2 = Fp.eql(tv2, gx2);
      let y2 = Fp.cmov(y22, y21, e2);
      tv2 = Fp.sqr(y1);
      tv2 = Fp.mul(tv2, gxd);
      let e3 = Fp.eql(tv2, gx1);
      let xn = Fp.cmov(x2n, x1n, e3);
      let y = Fp.cmov(y2, y1, e3);
      let e4 = Fp.isOdd(y);
      y = Fp.cmov(y, Fp.neg(y), e3 !== e4);
      return { xMn: xn, xMd: xd, yMn: y, yMd: _1n };
    }
    const ELL2_C1_EDWARDS = /* @__PURE__ */ (() => (0, modular_js_1.FpSqrtEven)(Fp, Fp.neg(BigInt(486664))))();
    function map_to_curve_elligator2_edwards25519(u) {
      const { xMn, xMd, yMn, yMd } = map_to_curve_elligator2_curve25519(u);
      let xn = Fp.mul(xMn, yMd);
      xn = Fp.mul(xn, ELL2_C1_EDWARDS);
      let xd = Fp.mul(xMd, yMn);
      let yn = Fp.sub(xMn, xMd);
      let yd = Fp.add(xMn, xMd);
      let tv1 = Fp.mul(xd, yd);
      let e = Fp.eql(tv1, Fp.ZERO);
      xn = Fp.cmov(xn, Fp.ZERO, e);
      xd = Fp.cmov(xd, Fp.ONE, e);
      yn = Fp.cmov(yn, Fp.ONE, e);
      yd = Fp.cmov(yd, Fp.ONE, e);
      const inv = Fp.invertBatch([xd, yd]);
      return { x: Fp.mul(xn, inv[0]), y: Fp.mul(yn, inv[1]) };
    }
    const htf = /* @__PURE__ */ (() => (0, hash_to_curve_js_1.createHasher)(exports.ed25519.ExtendedPoint, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
      DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
      encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
      p: Fp.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha512_1.sha512
    }))();
    exports.hashToCurve = (() => htf.hashToCurve)();
    exports.encodeToCurve = (() => htf.encodeToCurve)();
    function assertRstPoint(other) {
      if (!(other instanceof RistPoint))
        throw new Error("RistrettoPoint expected");
    }
    const SQRT_M1 = ED25519_SQRT_M1;
    const SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
    const INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
    const ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
    const D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
    const invertSqrt = (number) => uvRatio(_1n, number);
    const MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    const bytes255ToNumberLE = (bytes) => exports.ed25519.CURVE.Fp.create((0, utils_js_1.bytesToNumberLE)(bytes) & MAX_255B);
    function calcElligatorRistrettoMap(r0) {
      const { d } = exports.ed25519.CURVE;
      const P = exports.ed25519.CURVE.Fp.ORDER;
      const mod = exports.ed25519.CURVE.Fp.create;
      const r = mod(SQRT_M1 * r0 * r0);
      const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
      let c = BigInt(-1);
      const D = mod((c - d * r) * mod(r + d));
      let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
      let s_ = mod(s * r0);
      if (!(0, modular_js_1.isNegativeLE)(s_, P))
        s_ = mod(-s_);
      if (!Ns_D_is_sq)
        s = s_;
      if (!Ns_D_is_sq)
        c = r;
      const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
      const s2 = s * s;
      const W0 = mod((s + s) * D);
      const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
      const W2 = mod(_1n - s2);
      const W3 = mod(_1n + s2);
      return new exports.ed25519.ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
    }
    class RistPoint {
      // Private property to discourage combining ExtendedPoint + RistrettoPoint
      // Always use Ristretto encoding/decoding instead.
      constructor(ep) {
        this.ep = ep;
      }
      static fromAffine(ap) {
        return new RistPoint(exports.ed25519.ExtendedPoint.fromAffine(ap));
      }
      /**
       * Takes uniform output of 64-byte hash function like sha512 and converts it to `RistrettoPoint`.
       * The hash-to-group operation applies Elligator twice and adds the results.
       * **Note:** this is one-way map, there is no conversion from point to hash.
       * https://ristretto.group/formulas/elligator.html
       * @param hex 64-byte output of a hash function
       */
      static hashToCurve(hex2) {
        hex2 = (0, utils_js_1.ensureBytes)("ristrettoHash", hex2, 64);
        const r1 = bytes255ToNumberLE(hex2.slice(0, 32));
        const R1 = calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(hex2.slice(32, 64));
        const R2 = calcElligatorRistrettoMap(r2);
        return new RistPoint(R1.add(R2));
      }
      /**
       * Converts ristretto-encoded string to ristretto point.
       * https://ristretto.group/formulas/decoding.html
       * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
       */
      static fromHex(hex2) {
        hex2 = (0, utils_js_1.ensureBytes)("ristrettoHex", hex2, 32);
        const { a, d } = exports.ed25519.CURVE;
        const P = exports.ed25519.CURVE.Fp.ORDER;
        const mod = exports.ed25519.CURVE.Fp.create;
        const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
        const s = bytes255ToNumberLE(hex2);
        if (!(0, utils_js_1.equalBytes)((0, utils_js_1.numberToBytesLE)(s, 32), hex2) || (0, modular_js_1.isNegativeLE)(s, P))
          throw new Error(emsg);
        const s2 = mod(s * s);
        const u1 = mod(_1n + a * s2);
        const u2 = mod(_1n - a * s2);
        const u1_2 = mod(u1 * u1);
        const u2_2 = mod(u2 * u2);
        const v = mod(a * d * u1_2 - u2_2);
        const { isValid, value: I } = invertSqrt(mod(v * u2_2));
        const Dx = mod(I * u2);
        const Dy = mod(I * Dx * v);
        let x = mod((s + s) * Dx);
        if ((0, modular_js_1.isNegativeLE)(x, P))
          x = mod(-x);
        const y = mod(u1 * Dy);
        const t = mod(x * y);
        if (!isValid || (0, modular_js_1.isNegativeLE)(t, P) || y === _0n)
          throw new Error(emsg);
        return new RistPoint(new exports.ed25519.ExtendedPoint(x, y, _1n, t));
      }
      static msm(points, scalars) {
        const Fn = (0, modular_js_1.Field)(exports.ed25519.CURVE.n, exports.ed25519.CURVE.nBitLength);
        return (0, curve_js_1.pippenger)(RistPoint, Fn, points, scalars);
      }
      /**
       * Encodes ristretto point to Uint8Array.
       * https://ristretto.group/formulas/encoding.html
       */
      toRawBytes() {
        let { ex: x, ey: y, ez: z, et: t } = this.ep;
        const P = exports.ed25519.CURVE.Fp.ORDER;
        const mod = exports.ed25519.CURVE.Fp.create;
        const u1 = mod(mod(z + y) * mod(z - y));
        const u2 = mod(x * y);
        const u2sq = mod(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod(u1 * u2sq));
        const D1 = mod(invsqrt * u1);
        const D2 = mod(invsqrt * u2);
        const zInv = mod(D1 * D2 * t);
        let D;
        if ((0, modular_js_1.isNegativeLE)(t * zInv, P)) {
          let _x = mod(y * SQRT_M1);
          let _y = mod(x * SQRT_M1);
          x = _x;
          y = _y;
          D = mod(D1 * INVSQRT_A_MINUS_D);
        } else {
          D = D2;
        }
        if ((0, modular_js_1.isNegativeLE)(x * zInv, P))
          y = mod(-y);
        let s = mod((z - y) * D);
        if ((0, modular_js_1.isNegativeLE)(s, P))
          s = mod(-s);
        return (0, utils_js_1.numberToBytesLE)(s, 32);
      }
      toHex() {
        return (0, utils_js_1.bytesToHex)(this.toRawBytes());
      }
      toString() {
        return this.toHex();
      }
      // Compare one point to another.
      equals(other) {
        assertRstPoint(other);
        const { ex: X1, ey: Y1 } = this.ep;
        const { ex: X2, ey: Y2 } = other.ep;
        const mod = exports.ed25519.CURVE.Fp.create;
        const one = mod(X1 * Y2) === mod(Y1 * X2);
        const two = mod(Y1 * Y2) === mod(X1 * X2);
        return one || two;
      }
      add(other) {
        assertRstPoint(other);
        return new RistPoint(this.ep.add(other.ep));
      }
      subtract(other) {
        assertRstPoint(other);
        return new RistPoint(this.ep.subtract(other.ep));
      }
      multiply(scalar) {
        return new RistPoint(this.ep.multiply(scalar));
      }
      multiplyUnsafe(scalar) {
        return new RistPoint(this.ep.multiplyUnsafe(scalar));
      }
      double() {
        return new RistPoint(this.ep.double());
      }
      negate() {
        return new RistPoint(this.ep.negate());
      }
    }
    exports.RistrettoPoint = (() => {
      if (!RistPoint.BASE)
        RistPoint.BASE = new RistPoint(exports.ed25519.ExtendedPoint.BASE);
      if (!RistPoint.ZERO)
        RistPoint.ZERO = new RistPoint(exports.ed25519.ExtendedPoint.ZERO);
      return RistPoint;
    })();
    const hashToRistretto255 = (msg, options) => {
      const d = options.DST;
      const DST = typeof d === "string" ? (0, utils_1.utf8ToBytes)(d) : d;
      const uniform_bytes = (0, hash_to_curve_js_1.expand_message_xmd)(msg, DST, 64, sha512_1.sha512);
      const P = RistPoint.hashToCurve(uniform_bytes);
      return P;
    };
    exports.hashToRistretto255 = hashToRistretto255;
    exports.hash_to_ristretto255 = exports.hashToRistretto255;
  })(ed25519);
  return ed25519;
}
var secp256k1 = {};
var sha256 = {};
var hasRequiredSha256;
function requireSha256() {
  if (hasRequiredSha256) return sha256;
  hasRequiredSha256 = 1;
  Object.defineProperty(sha256, "__esModule", { value: true });
  sha256.sha224 = sha256.sha256 = sha256.SHA256 = void 0;
  const _md_js_1 = /* @__PURE__ */ require_md();
  const utils_js_1 = /* @__PURE__ */ requireUtils$2();
  const SHA256_K = /* @__PURE__ */ new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  const SHA256_IV = /* @__PURE__ */ new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  class SHA256 extends _md_js_1.HashMD {
    constructor() {
      super(64, 32, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ W15 >>> 3;
        const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
        const T1 = H + sigma1 + (0, _md_js_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
        const T2 = sigma0 + (0, _md_js_1.Maj)(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  }
  sha256.SHA256 = SHA256;
  class SHA224 extends SHA256 {
    constructor() {
      super();
      this.A = 3238371032 | 0;
      this.B = 914150663 | 0;
      this.C = 812702999 | 0;
      this.D = 4144912697 | 0;
      this.E = 4290775857 | 0;
      this.F = 1750603025 | 0;
      this.G = 1694076839 | 0;
      this.H = 3204075428 | 0;
      this.outputLen = 28;
    }
  }
  sha256.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
  sha256.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());
  return sha256;
}
var _shortw_utils = {};
var hmac = {};
var hasRequiredHmac;
function requireHmac() {
  if (hasRequiredHmac) return hmac;
  hasRequiredHmac = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac = exports.HMAC = void 0;
    const _assert_js_1 = /* @__PURE__ */ require_assert();
    const utils_js_1 = /* @__PURE__ */ requireUtils$2();
    class HMAC extends utils_js_1.Hash {
      constructor(hash2, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0, _assert_js_1.ahash)(hash2);
        const key = (0, utils_js_1.toBytes)(_key);
        this.iHash = hash2.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash2.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        pad.fill(0);
      }
      update(buf) {
        (0, _assert_js_1.aexists)(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        (0, _assert_js_1.aexists)(this);
        (0, _assert_js_1.abytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    }
    exports.HMAC = HMAC;
    const hmac2 = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
    exports.hmac = hmac2;
    exports.hmac.create = (hash2, key) => new HMAC(hash2, key);
  })(hmac);
  return hmac;
}
var weierstrass = {};
var hasRequiredWeierstrass;
function requireWeierstrass() {
  if (hasRequiredWeierstrass) return weierstrass;
  hasRequiredWeierstrass = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DER = exports.DERErr = void 0;
    exports.weierstrassPoints = weierstrassPoints;
    exports.weierstrass = weierstrass2;
    exports.SWUFpSqrtRatio = SWUFpSqrtRatio;
    exports.mapToCurveSimpleSWU = mapToCurveSimpleSWU;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const curve_js_1 = /* @__PURE__ */ requireCurve();
    const modular_js_1 = /* @__PURE__ */ requireModular();
    const ut = /* @__PURE__ */ requireUtils$1();
    const utils_js_1 = /* @__PURE__ */ requireUtils$1();
    function validateSigVerOpts(opts) {
      if (opts.lowS !== void 0)
        (0, utils_js_1.abool)("lowS", opts.lowS);
      if (opts.prehash !== void 0)
        (0, utils_js_1.abool)("prehash", opts.prehash);
    }
    function validatePointOpts(curve2) {
      const opts = (0, curve_js_1.validateBasic)(curve2);
      ut.validateObject(opts, {
        a: "field",
        b: "field"
      }, {
        allowedPrivateKeyLengths: "array",
        wrapPrivateKey: "boolean",
        isTorsionFree: "function",
        clearCofactor: "function",
        allowInfinityPoint: "boolean",
        fromBytes: "function",
        toBytes: "function"
      });
      const { endo, Fp, a } = opts;
      if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
          throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");
        }
        if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
          throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function");
        }
      }
      return Object.freeze({ ...opts });
    }
    const { bytesToNumberBE: b2n, hexToBytes: h2b } = ut;
    class DERErr extends Error {
      constructor(m = "") {
        super(m);
      }
    }
    exports.DERErr = DERErr;
    exports.DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = exports.DER;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = ut.numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? ut.numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = ut.numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = exports.DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E } = exports.DER;
          if (num < _0n)
            throw new E("integer: negative integers are not allowed");
          let hex2 = ut.numberToHexUnpadded(num);
          if (Number.parseInt(hex2[0], 16) & 8)
            hex2 = "00" + hex2;
          if (hex2.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex2;
        },
        decode(data) {
          const { Err: E } = exports.DER;
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return b2n(data);
        }
      },
      toSig(hex2) {
        const { Err: E, _int: int, _tlv: tlv } = exports.DER;
        const data = typeof hex2 === "string" ? h2b(hex2) : hex2;
        ut.abytes(data);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = exports.DER;
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
    function weierstrassPoints(opts) {
      const CURVE = validatePointOpts(opts);
      const { Fp } = CURVE;
      const Fn = (0, modular_js_1.Field)(CURVE.n, CURVE.nBitLength);
      const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
        const a = point.toAffine();
        return ut.concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
      });
      const fromBytes = CURVE.fromBytes || ((bytes) => {
        const tail = bytes.subarray(1);
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      });
      function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x);
        const x3 = Fp.mul(x2, x);
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
      }
      if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error("bad generator point: equation left != right");
      function isWithinCurveOrder(num) {
        return ut.inRange(num, _1n, CURVE.n);
      }
      function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
        if (lengths && typeof key !== "bigint") {
          if (ut.isBytes(key))
            key = ut.bytesToHex(key);
          if (typeof key !== "string" || !lengths.includes(key.length))
            throw new Error("invalid private key");
          key = key.padStart(nByteLength * 2, "0");
        }
        let num;
        try {
          num = typeof key === "bigint" ? key : ut.bytesToNumberBE((0, utils_js_1.ensureBytes)("private key", key, nByteLength));
        } catch (error) {
          throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
        }
        if (wrapPrivateKey)
          num = (0, modular_js_1.mod)(num, N);
        ut.aInRange("private key", num, _1n, N);
        return num;
      }
      function assertPrjPoint(other) {
        if (!(other instanceof Point))
          throw new Error("ProjectivePoint expected");
      }
      const toAffineMemo = (0, utils_js_1.memoized)((p, iz) => {
        const { px: x, py: y, pz: z } = p;
        if (Fp.eql(z, Fp.ONE))
          return { x, y };
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp.ONE : Fp.inv(z);
        const ax = Fp.mul(x, iz);
        const ay = Fp.mul(y, iz);
        const zz = Fp.mul(z, iz);
        if (is0)
          return { x: Fp.ZERO, y: Fp.ZERO };
        if (!Fp.eql(zz, Fp.ONE))
          throw new Error("invZ was invalid");
        return { x: ax, y: ay };
      });
      const assertValidMemo = (0, utils_js_1.memoized)((p) => {
        if (p.is0()) {
          if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
            return;
          throw new Error("bad point: ZERO");
        }
        const { x, y } = p.toAffine();
        if (!Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("bad point: x or y not FE");
        const left = Fp.sqr(y);
        const right = weierstrassEquation(x);
        if (!Fp.eql(left, right))
          throw new Error("bad point: equation left != right");
        if (!p.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
        return true;
      });
      class Point {
        constructor(px, py, pz) {
          this.px = px;
          this.py = py;
          this.pz = pz;
          if (px == null || !Fp.isValid(px))
            throw new Error("x required");
          if (py == null || !Fp.isValid(py))
            throw new Error("y required");
          if (pz == null || !Fp.isValid(pz))
            throw new Error("z required");
          Object.freeze(this);
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
          const { x, y } = p || {};
          if (!p || !Fp.isValid(x) || !Fp.isValid(y))
            throw new Error("invalid affine point");
          if (p instanceof Point)
            throw new Error("projective point not allowed");
          const is0 = (i) => Fp.eql(i, Fp.ZERO);
          if (is0(x) && is0(y))
            return Point.ZERO;
          return new Point(x, y, Fp.ONE);
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
          const toInv = Fp.invertBatch(points.map((p) => p.pz));
          return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex2) {
          const P = Point.fromAffine(fromBytes((0, utils_js_1.ensureBytes)("pointHex", hex2)));
          P.assertValidity();
          return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
          return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // Multiscalar Multiplication
        static msm(points, scalars) {
          return (0, curve_js_1.pippenger)(Point, Fn, points, scalars);
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
          wnaf.setWindowSize(this, windowSize);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
          assertValidMemo(this);
        }
        hasEvenY() {
          const { y } = this.toAffine();
          if (Fp.isOdd)
            return !Fp.isOdd(y);
          throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
          const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
          return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
          return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
          const { a, b } = CURVE;
          const b3 = Fp.mul(b, _3n);
          const { px: X1, py: Y1, pz: Z1 } = this;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          let t0 = Fp.mul(X1, X1);
          let t1 = Fp.mul(Y1, Y1);
          let t2 = Fp.mul(Z1, Z1);
          let t3 = Fp.mul(X1, Y1);
          t3 = Fp.add(t3, t3);
          Z3 = Fp.mul(X1, Z1);
          Z3 = Fp.add(Z3, Z3);
          X3 = Fp.mul(a, Z3);
          Y3 = Fp.mul(b3, t2);
          Y3 = Fp.add(X3, Y3);
          X3 = Fp.sub(t1, Y3);
          Y3 = Fp.add(t1, Y3);
          Y3 = Fp.mul(X3, Y3);
          X3 = Fp.mul(t3, X3);
          Z3 = Fp.mul(b3, Z3);
          t2 = Fp.mul(a, t2);
          t3 = Fp.sub(t0, t2);
          t3 = Fp.mul(a, t3);
          t3 = Fp.add(t3, Z3);
          Z3 = Fp.add(t0, t0);
          t0 = Fp.add(Z3, t0);
          t0 = Fp.add(t0, t2);
          t0 = Fp.mul(t0, t3);
          Y3 = Fp.add(Y3, t0);
          t2 = Fp.mul(Y1, Z1);
          t2 = Fp.add(t2, t2);
          t0 = Fp.mul(t2, t3);
          X3 = Fp.sub(X3, t0);
          Z3 = Fp.mul(t2, t1);
          Z3 = Fp.add(Z3, Z3);
          Z3 = Fp.add(Z3, Z3);
          return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          const a = CURVE.a;
          const b3 = Fp.mul(CURVE.b, _3n);
          let t0 = Fp.mul(X1, X2);
          let t1 = Fp.mul(Y1, Y2);
          let t2 = Fp.mul(Z1, Z2);
          let t3 = Fp.add(X1, Y1);
          let t4 = Fp.add(X2, Y2);
          t3 = Fp.mul(t3, t4);
          t4 = Fp.add(t0, t1);
          t3 = Fp.sub(t3, t4);
          t4 = Fp.add(X1, Z1);
          let t5 = Fp.add(X2, Z2);
          t4 = Fp.mul(t4, t5);
          t5 = Fp.add(t0, t2);
          t4 = Fp.sub(t4, t5);
          t5 = Fp.add(Y1, Z1);
          X3 = Fp.add(Y2, Z2);
          t5 = Fp.mul(t5, X3);
          X3 = Fp.add(t1, t2);
          t5 = Fp.sub(t5, X3);
          Z3 = Fp.mul(a, t4);
          X3 = Fp.mul(b3, t2);
          Z3 = Fp.add(X3, Z3);
          X3 = Fp.sub(t1, Z3);
          Z3 = Fp.add(t1, Z3);
          Y3 = Fp.mul(X3, Z3);
          t1 = Fp.add(t0, t0);
          t1 = Fp.add(t1, t0);
          t2 = Fp.mul(a, t2);
          t4 = Fp.mul(b3, t4);
          t1 = Fp.add(t1, t2);
          t2 = Fp.sub(t0, t2);
          t2 = Fp.mul(a, t2);
          t4 = Fp.add(t4, t2);
          t0 = Fp.mul(t1, t4);
          Y3 = Fp.add(Y3, t0);
          t0 = Fp.mul(t5, t4);
          X3 = Fp.mul(t3, X3);
          X3 = Fp.sub(X3, t0);
          t0 = Fp.mul(t3, t1);
          Z3 = Fp.mul(t5, Z3);
          Z3 = Fp.add(Z3, t0);
          return new Point(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        is0() {
          return this.equals(Point.ZERO);
        }
        wNAF(n) {
          return wnaf.wNAFCached(this, n, Point.normalizeZ);
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(sc) {
          const { endo, n: N } = CURVE;
          ut.aInRange("scalar", sc, _0n, N);
          const I = Point.ZERO;
          if (sc === _0n)
            return I;
          if (this.is0() || sc === _1n)
            return this;
          if (!endo || wnaf.hasPrecomputes(this))
            return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
          let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
          let k1p = I;
          let k2p = I;
          let d = this;
          while (k1 > _0n || k2 > _0n) {
            if (k1 & _1n)
              k1p = k1p.add(d);
            if (k2 & _1n)
              k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n;
            k2 >>= _1n;
          }
          if (k1neg)
            k1p = k1p.negate();
          if (k2neg)
            k2p = k2p.negate();
          k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
          const { endo, n: N } = CURVE;
          ut.aInRange("scalar", scalar, _1n, N);
          let point, fake;
          if (endo) {
            const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
            let { p: k1p, f: f1p } = this.wNAF(k1);
            let { p: k2p, f: f2p } = this.wNAF(k2);
            k1p = wnaf.constTimeNegate(k1neg, k1p);
            k2p = wnaf.constTimeNegate(k2neg, k2p);
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
          } else {
            const { p, f } = this.wNAF(scalar);
            point = p;
            fake = f;
          }
          return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
          const G = Point.BASE;
          const mul = (P, a2) => a2 === _0n || a2 === _1n || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
          const sum = mul(this, a).add(mul(Q, b));
          return sum.is0() ? void 0 : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
          return toAffineMemo(this, iz);
        }
        isTorsionFree() {
          const { h: cofactor, isTorsionFree } = CURVE;
          if (cofactor === _1n)
            return true;
          if (isTorsionFree)
            return isTorsionFree(Point, this);
          throw new Error("isTorsionFree() has not been declared for the elliptic curve");
        }
        clearCofactor() {
          const { h: cofactor, clearCofactor } = CURVE;
          if (cofactor === _1n)
            return this;
          if (clearCofactor)
            return clearCofactor(Point, this);
          return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
          (0, utils_js_1.abool)("isCompressed", isCompressed);
          this.assertValidity();
          return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
          (0, utils_js_1.abool)("isCompressed", isCompressed);
          return ut.bytesToHex(this.toRawBytes(isCompressed));
        }
      }
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
      Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
      const _bits = CURVE.nBitLength;
      const wnaf = (0, curve_js_1.wNAF)(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
      return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder
      };
    }
    function validateOpts(curve2) {
      const opts = (0, curve_js_1.validateBasic)(curve2);
      ut.validateObject(opts, {
        hash: "hash",
        hmac: "function",
        randomBytes: "function"
      }, {
        bits2int: "function",
        bits2int_modN: "function",
        lowS: "boolean"
      });
      return Object.freeze({ lowS: true, ...opts });
    }
    function weierstrass2(curveDef) {
      const CURVE = validateOpts(curveDef);
      const { Fp, n: CURVE_ORDER } = CURVE;
      const compressedLen = Fp.BYTES + 1;
      const uncompressedLen = 2 * Fp.BYTES + 1;
      function modN(a) {
        return (0, modular_js_1.mod)(a, CURVE_ORDER);
      }
      function invN(a) {
        return (0, modular_js_1.invert)(a, CURVE_ORDER);
      }
      const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
        ...CURVE,
        toBytes(_c, point, isCompressed) {
          const a = point.toAffine();
          const x = Fp.toBytes(a.x);
          const cat = ut.concatBytes;
          (0, utils_js_1.abool)("isCompressed", isCompressed);
          if (isCompressed) {
            return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
          } else {
            return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
          }
        },
        fromBytes(bytes) {
          const len = bytes.length;
          const head = bytes[0];
          const tail = bytes.subarray(1);
          if (len === compressedLen && (head === 2 || head === 3)) {
            const x = ut.bytesToNumberBE(tail);
            if (!ut.inRange(x, _1n, Fp.ORDER))
              throw new Error("Point is not on curve");
            const y2 = weierstrassEquation(x);
            let y;
            try {
              y = Fp.sqrt(y2);
            } catch (sqrtError) {
              const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
              throw new Error("Point is not on curve" + suffix);
            }
            const isYOdd = (y & _1n) === _1n;
            const isHeadOdd = (head & 1) === 1;
            if (isHeadOdd !== isYOdd)
              y = Fp.neg(y);
            return { x, y };
          } else if (len === uncompressedLen && head === 4) {
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
          } else {
            const cl = compressedLen;
            const ul = uncompressedLen;
            throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
          }
        }
      });
      const numToNByteStr = (num) => ut.bytesToHex(ut.numberToBytesBE(num, CURVE.nByteLength));
      function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n;
        return number > HALF;
      }
      function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
      }
      const slcNum = (b, from, to) => ut.bytesToNumberBE(b.slice(from, to));
      class Signature {
        constructor(r, s, recovery) {
          this.r = r;
          this.s = s;
          this.recovery = recovery;
          this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex2) {
          const l = CURVE.nByteLength;
          hex2 = (0, utils_js_1.ensureBytes)("compactSignature", hex2, l * 2);
          return new Signature(slcNum(hex2, 0, l), slcNum(hex2, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex2) {
          const { r, s } = exports.DER.toSig((0, utils_js_1.ensureBytes)("DER", hex2));
          return new Signature(r, s);
        }
        assertValidity() {
          ut.aInRange("r", this.r, _1n, CURVE_ORDER);
          ut.aInRange("s", this.s, _1n, CURVE_ORDER);
        }
        addRecoveryBit(recovery) {
          return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
          const { r, s, recovery: rec } = this;
          const h = bits2int_modN((0, utils_js_1.ensureBytes)("msgHash", msgHash));
          if (rec == null || ![0, 1, 2, 3].includes(rec))
            throw new Error("recovery id invalid");
          const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
          if (radj >= Fp.ORDER)
            throw new Error("recovery id 2 or 3 invalid");
          const prefix = (rec & 1) === 0 ? "02" : "03";
          const R = Point.fromHex(prefix + numToNByteStr(radj));
          const ir = invN(radj);
          const u1 = modN(-h * ir);
          const u2 = modN(s * ir);
          const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
          if (!Q)
            throw new Error("point at infinify");
          Q.assertValidity();
          return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
          return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
          return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
          return ut.hexToBytes(this.toDERHex());
        }
        toDERHex() {
          return exports.DER.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
          return ut.hexToBytes(this.toCompactHex());
        }
        toCompactHex() {
          return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
      }
      const utils2 = {
        isValidPrivateKey(privateKey) {
          try {
            normPrivateKeyToScalar(privateKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */
        randomPrivateKey: () => {
          const length = (0, modular_js_1.getMinHashLength)(CURVE.n);
          return (0, modular_js_1.mapHashToField)(CURVE.randomBytes(length), CURVE.n);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
          point._setWindowSize(windowSize);
          point.multiply(BigInt(3));
          return point;
        }
      };
      function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
      }
      function isProbPub(item) {
        const arr = ut.isBytes(item);
        const str = typeof item === "string";
        const len = (arr || str) && item.length;
        if (arr)
          return len === compressedLen || len === uncompressedLen;
        if (str)
          return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
          return true;
        return false;
      }
      function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
          throw new Error("first arg must be private key");
        if (!isProbPub(publicB))
          throw new Error("second arg must be public key");
        const b = Point.fromHex(publicB);
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
      }
      const bits2int = CURVE.bits2int || function(bytes) {
        if (bytes.length > 8192)
          throw new Error("input is too large");
        const num = ut.bytesToNumberBE(bytes);
        const delta = bytes.length * 8 - CURVE.nBitLength;
        return delta > 0 ? num >> BigInt(delta) : num;
      };
      const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
        return modN(bits2int(bytes));
      };
      const ORDER_MASK = ut.bitMask(CURVE.nBitLength);
      function int2octets(num) {
        ut.aInRange("num < 2^" + CURVE.nBitLength, num, _0n, ORDER_MASK);
        return ut.numberToBytesBE(num, CURVE.nByteLength);
      }
      function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (["recovered", "canonical"].some((k) => k in opts))
          throw new Error("sign() legacy options not supported");
        const { hash: hash2, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts;
        if (lowS == null)
          lowS = true;
        msgHash = (0, utils_js_1.ensureBytes)("msgHash", msgHash);
        validateSigVerOpts(opts);
        if (prehash)
          msgHash = (0, utils_js_1.ensureBytes)("prehashed msgHash", hash2(msgHash));
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey);
        const seedArgs = [int2octets(d), int2octets(h1int)];
        if (ent != null && ent !== false) {
          const e = ent === true ? randomBytes(Fp.BYTES) : ent;
          seedArgs.push((0, utils_js_1.ensureBytes)("extraEntropy", e));
        }
        const seed = ut.concatBytes(...seedArgs);
        const m = h1int;
        function k2sig(kBytes) {
          const k = bits2int(kBytes);
          if (!isWithinCurveOrder(k))
            return;
          const ik = invN(k);
          const q = Point.BASE.multiply(k).toAffine();
          const r = modN(q.x);
          if (r === _0n)
            return;
          const s = modN(ik * modN(m + r * d));
          if (s === _0n)
            return;
          let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n);
          let normS = s;
          if (lowS && isBiggerThanHalfOrder(s)) {
            normS = normalizeS(s);
            recovery ^= 1;
          }
          return new Signature(r, normS, recovery);
        }
        return { seed, k2sig };
      }
      const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
      const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
      function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts);
        const C = CURVE;
        const drbg = ut.createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig);
      }
      Point.BASE._setWindowSize(8);
      function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        var _a;
        const sg = signature;
        msgHash = (0, utils_js_1.ensureBytes)("msgHash", msgHash);
        publicKey = (0, utils_js_1.ensureBytes)("publicKey", publicKey);
        const { lowS, prehash, format } = opts;
        validateSigVerOpts(opts);
        if ("strict" in opts)
          throw new Error("options.strict was renamed to lowS");
        if (format !== void 0 && format !== "compact" && format !== "der")
          throw new Error("format must be compact or der");
        const isHex = typeof sg === "string" || ut.isBytes(sg);
        const isObj = !isHex && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
        if (!isHex && !isObj)
          throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
        let _sig = void 0;
        let P;
        try {
          if (isObj)
            _sig = new Signature(sg.r, sg.s);
          if (isHex) {
            try {
              if (format !== "compact")
                _sig = Signature.fromDER(sg);
            } catch (derError) {
              if (!(derError instanceof exports.DER.Err))
                throw derError;
            }
            if (!_sig && format !== "der")
              _sig = Signature.fromCompact(sg);
          }
          P = Point.fromHex(publicKey);
        } catch (error) {
          return false;
        }
        if (!_sig)
          return false;
        if (lowS && _sig.hasHighS())
          return false;
        if (prehash)
          msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash);
        const is = invN(s);
        const u1 = modN(h * is);
        const u2 = modN(r * is);
        const R = (_a = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)) == null ? void 0 : _a.toAffine();
        if (!R)
          return false;
        const v = modN(R.x);
        return v === r;
      }
      return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils: utils2
      };
    }
    function SWUFpSqrtRatio(Fp, Z) {
      const q = Fp.ORDER;
      let l = _0n;
      for (let o = q - _1n; o % _2n === _0n; o /= _2n)
        l += _1n;
      const c1 = l;
      const _2n_pow_c1_1 = _2n << c1 - _1n - _1n;
      const _2n_pow_c1 = _2n_pow_c1_1 * _2n;
      const c2 = (q - _1n) / _2n_pow_c1;
      const c3 = (c2 - _1n) / _2n;
      const c4 = _2n_pow_c1 - _1n;
      const c5 = _2n_pow_c1_1;
      const c6 = Fp.pow(Z, c2);
      const c7 = Fp.pow(Z, (c2 + _1n) / _2n);
      let sqrtRatio = (u, v) => {
        let tv1 = c6;
        let tv2 = Fp.pow(v, c4);
        let tv3 = Fp.sqr(tv2);
        tv3 = Fp.mul(tv3, v);
        let tv5 = Fp.mul(u, tv3);
        tv5 = Fp.pow(tv5, c3);
        tv5 = Fp.mul(tv5, tv2);
        tv2 = Fp.mul(tv5, v);
        tv3 = Fp.mul(tv5, u);
        let tv4 = Fp.mul(tv3, tv2);
        tv5 = Fp.pow(tv4, c5);
        let isQR = Fp.eql(tv5, Fp.ONE);
        tv2 = Fp.mul(tv3, c7);
        tv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, isQR);
        tv4 = Fp.cmov(tv5, tv4, isQR);
        for (let i = c1; i > _1n; i--) {
          let tv52 = i - _2n;
          tv52 = _2n << tv52 - _1n;
          let tvv5 = Fp.pow(tv4, tv52);
          const e1 = Fp.eql(tvv5, Fp.ONE);
          tv2 = Fp.mul(tv3, tv1);
          tv1 = Fp.mul(tv1, tv1);
          tvv5 = Fp.mul(tv4, tv1);
          tv3 = Fp.cmov(tv2, tv3, e1);
          tv4 = Fp.cmov(tvv5, tv4, e1);
        }
        return { isValid: isQR, value: tv3 };
      };
      if (Fp.ORDER % _4n === _3n) {
        const c12 = (Fp.ORDER - _3n) / _4n;
        const c22 = Fp.sqrt(Fp.neg(Z));
        sqrtRatio = (u, v) => {
          let tv1 = Fp.sqr(v);
          const tv2 = Fp.mul(u, v);
          tv1 = Fp.mul(tv1, tv2);
          let y1 = Fp.pow(tv1, c12);
          y1 = Fp.mul(y1, tv2);
          const y2 = Fp.mul(y1, c22);
          const tv3 = Fp.mul(Fp.sqr(y1), v);
          const isQR = Fp.eql(tv3, u);
          let y = Fp.cmov(y2, y1, isQR);
          return { isValid: isQR, value: y };
        };
      }
      return sqrtRatio;
    }
    function mapToCurveSimpleSWU(Fp, opts) {
      (0, modular_js_1.validateField)(Fp);
      if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
        throw new Error("mapToCurveSimpleSWU: invalid opts");
      const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
      if (!Fp.isOdd)
        throw new Error("Fp.isOdd is not implemented!");
      return (u) => {
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u);
        tv1 = Fp.mul(tv1, opts.Z);
        tv2 = Fp.sqr(tv1);
        tv2 = Fp.add(tv2, tv1);
        tv3 = Fp.add(tv2, Fp.ONE);
        tv3 = Fp.mul(tv3, opts.B);
        tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
        tv4 = Fp.mul(tv4, opts.A);
        tv2 = Fp.sqr(tv3);
        tv6 = Fp.sqr(tv4);
        tv5 = Fp.mul(tv6, opts.A);
        tv2 = Fp.add(tv2, tv5);
        tv2 = Fp.mul(tv2, tv3);
        tv6 = Fp.mul(tv6, tv4);
        tv5 = Fp.mul(tv6, opts.B);
        tv2 = Fp.add(tv2, tv5);
        x = Fp.mul(tv1, tv3);
        const { isValid, value } = sqrtRatio(tv2, tv6);
        y = Fp.mul(tv1, u);
        y = Fp.mul(y, value);
        x = Fp.cmov(x, tv3, isValid);
        y = Fp.cmov(y, value, isValid);
        const e1 = Fp.isOdd(u) === Fp.isOdd(y);
        y = Fp.cmov(Fp.neg(y), y, e1);
        x = Fp.div(x, tv4);
        return { x, y };
      };
    }
  })(weierstrass);
  return weierstrass;
}
var hasRequired_shortw_utils;
function require_shortw_utils() {
  if (hasRequired_shortw_utils) return _shortw_utils;
  hasRequired_shortw_utils = 1;
  Object.defineProperty(_shortw_utils, "__esModule", { value: true });
  _shortw_utils.getHash = getHash;
  _shortw_utils.createCurve = createCurve;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const hmac_1 = /* @__PURE__ */ requireHmac();
  const utils_1 = /* @__PURE__ */ requireUtils$2();
  const weierstrass_js_1 = /* @__PURE__ */ requireWeierstrass();
  function getHash(hash2) {
    return {
      hash: hash2,
      hmac: (key, ...msgs) => (0, hmac_1.hmac)(hash2, key, (0, utils_1.concatBytes)(...msgs)),
      randomBytes: utils_1.randomBytes
    };
  }
  function createCurve(curveDef, defHash) {
    const create = (hash2) => (0, weierstrass_js_1.weierstrass)({ ...curveDef, ...getHash(hash2) });
    return { ...create(defHash), create };
  }
  return _shortw_utils;
}
var hasRequiredSecp256k1;
function requireSecp256k1() {
  if (hasRequiredSecp256k1) return secp256k1;
  hasRequiredSecp256k1 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeToCurve = exports.hashToCurve = exports.schnorr = exports.secp256k1 = void 0;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const sha256_1 = /* @__PURE__ */ requireSha256();
    const utils_1 = /* @__PURE__ */ requireUtils$2();
    const _shortw_utils_js_1 = /* @__PURE__ */ require_shortw_utils();
    const hash_to_curve_js_1 = /* @__PURE__ */ requireHashToCurve();
    const modular_js_1 = /* @__PURE__ */ requireModular();
    const utils_js_1 = /* @__PURE__ */ requireUtils$1();
    const weierstrass_js_1 = /* @__PURE__ */ requireWeierstrass();
    const secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
    const secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
    const _1n = BigInt(1);
    const _2n = BigInt(2);
    const divNearest = (a, b) => (a + b / _2n) / b;
    function sqrtMod(y) {
      const P = secp256k1P;
      const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
      const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
      const b2 = y * y * y % P;
      const b3 = b2 * b2 * y % P;
      const b6 = (0, modular_js_1.pow2)(b3, _3n, P) * b3 % P;
      const b9 = (0, modular_js_1.pow2)(b6, _3n, P) * b3 % P;
      const b11 = (0, modular_js_1.pow2)(b9, _2n, P) * b2 % P;
      const b22 = (0, modular_js_1.pow2)(b11, _11n, P) * b11 % P;
      const b44 = (0, modular_js_1.pow2)(b22, _22n, P) * b22 % P;
      const b88 = (0, modular_js_1.pow2)(b44, _44n, P) * b44 % P;
      const b176 = (0, modular_js_1.pow2)(b88, _88n, P) * b88 % P;
      const b220 = (0, modular_js_1.pow2)(b176, _44n, P) * b44 % P;
      const b223 = (0, modular_js_1.pow2)(b220, _3n, P) * b3 % P;
      const t1 = (0, modular_js_1.pow2)(b223, _23n, P) * b22 % P;
      const t2 = (0, modular_js_1.pow2)(t1, _6n, P) * b2 % P;
      const root = (0, modular_js_1.pow2)(t2, _2n, P);
      if (!Fpk1.eql(Fpk1.sqr(root), y))
        throw new Error("Cannot find square root");
      return root;
    }
    const Fpk1 = (0, modular_js_1.Field)(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
    exports.secp256k1 = (0, _shortw_utils_js_1.createCurve)({
      a: BigInt(0),
      // equation params: a, b
      b: BigInt(7),
      Fp: Fpk1,
      // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
      n: secp256k1N,
      // Curve order, total count of valid points in the field
      // Base point (x, y) aka generator point
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      h: BigInt(1),
      // Cofactor
      lowS: true,
      // Allow only low-S signatures by default in sign() and verify()
      endo: {
        // Endomorphism, see above
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar: (k) => {
          const n = secp256k1N;
          const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a1;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c1 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = (0, modular_js_1.mod)(k - c1 * a1 - c2 * a2, n);
          let k2 = (0, modular_js_1.mod)(-c1 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalar: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }
      }
    }, sha256_1.sha256);
    const _0n = BigInt(0);
    const TAGGED_HASH_PREFIXES = {};
    function taggedHash(tag, ...messages) {
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = (0, sha256_1.sha256)(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = (0, utils_js_1.concatBytes)(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return (0, sha256_1.sha256)((0, utils_js_1.concatBytes)(tagP, ...messages));
    }
    const pointToBytes = (point) => point.toRawBytes(true).slice(1);
    const numTo32b = (n) => (0, utils_js_1.numberToBytesBE)(n, 32);
    const modP = (x) => (0, modular_js_1.mod)(x, secp256k1P);
    const modN = (x) => (0, modular_js_1.mod)(x, secp256k1N);
    const Point = exports.secp256k1.ProjectivePoint;
    const GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
    function schnorrGetExtPubKey(priv) {
      let d_ = exports.secp256k1.utils.normPrivateKeyToScalar(priv);
      let p = Point.fromPrivateKey(d_);
      const scalar = p.hasEvenY() ? d_ : modN(-d_);
      return { scalar, bytes: pointToBytes(p) };
    }
    function lift_x(x) {
      (0, utils_js_1.aInRange)("x", x, _1n, secp256k1P);
      const xx = modP(x * x);
      const c = modP(xx * x + BigInt(7));
      let y = sqrtMod(c);
      if (y % _2n !== _0n)
        y = modP(-y);
      const p = new Point(x, y, _1n);
      p.assertValidity();
      return p;
    }
    const num = utils_js_1.bytesToNumberBE;
    function challenge(...args) {
      return modN(num(taggedHash("BIP0340/challenge", ...args)));
    }
    function schnorrGetPublicKey(privateKey) {
      return schnorrGetExtPubKey(privateKey).bytes;
    }
    function schnorrSign(message, privateKey, auxRand = (0, utils_1.randomBytes)(32)) {
      const m = (0, utils_js_1.ensureBytes)("message", message);
      const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
      const a = (0, utils_js_1.ensureBytes)("auxRand", auxRand, 32);
      const t = numTo32b(d ^ num(taggedHash("BIP0340/aux", a)));
      const rand = taggedHash("BIP0340/nonce", t, px, m);
      const k_ = modN(num(rand));
      if (k_ === _0n)
        throw new Error("sign failed: k is zero");
      const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
      const e = challenge(rx, px, m);
      const sig = new Uint8Array(64);
      sig.set(rx, 0);
      sig.set(numTo32b(modN(k + e * d)), 32);
      if (!schnorrVerify(sig, m, px))
        throw new Error("sign: Invalid signature produced");
      return sig;
    }
    function schnorrVerify(signature, message, publicKey) {
      const sig = (0, utils_js_1.ensureBytes)("signature", signature, 64);
      const m = (0, utils_js_1.ensureBytes)("message", message);
      const pub = (0, utils_js_1.ensureBytes)("publicKey", publicKey, 32);
      try {
        const P = lift_x(num(pub));
        const r = num(sig.subarray(0, 32));
        if (!(0, utils_js_1.inRange)(r, _1n, secp256k1P))
          return false;
        const s = num(sig.subarray(32, 64));
        if (!(0, utils_js_1.inRange)(s, _1n, secp256k1N))
          return false;
        const e = challenge(numTo32b(r), pointToBytes(P), m);
        const R = GmulAdd(P, s, modN(-e));
        if (!R || !R.hasEvenY() || R.toAffine().x !== r)
          return false;
        return true;
      } catch (error) {
        return false;
      }
    }
    exports.schnorr = (() => ({
      getPublicKey: schnorrGetPublicKey,
      sign: schnorrSign,
      verify: schnorrVerify,
      utils: {
        randomPrivateKey: exports.secp256k1.utils.randomPrivateKey,
        lift_x,
        pointToBytes,
        numberToBytesBE: utils_js_1.numberToBytesBE,
        bytesToNumberBE: utils_js_1.bytesToNumberBE,
        taggedHash,
        mod: modular_js_1.mod
      }
    }))();
    const isoMap = /* @__PURE__ */ (() => (0, hash_to_curve_js_1.isogenyMap)(Fpk1, [
      // xNum
      [
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
        "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
        "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
      ],
      // xDen
      [
        "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
        "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
        "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
        "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
        "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
      ],
      // yDen
      [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
        "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
        "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j)))))();
    const mapSWU = /* @__PURE__ */ (() => (0, weierstrass_js_1.mapToCurveSimpleSWU)(Fpk1, {
      A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
      B: BigInt("1771"),
      Z: Fpk1.create(BigInt("-11"))
    }))();
    const htf = /* @__PURE__ */ (() => (0, hash_to_curve_js_1.createHasher)(exports.secp256k1.ProjectivePoint, (scalars) => {
      const { x, y } = mapSWU(Fpk1.create(scalars[0]));
      return isoMap(x, y);
    }, {
      DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
      p: Fpk1.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha256_1.sha256
    }))();
    exports.hashToCurve = (() => htf.hashToCurve)();
    exports.encodeToCurve = (() => htf.encodeToCurve)();
  })(secp256k1);
  return secp256k1;
}
var hex = {};
var hasRequiredHex;
function requireHex() {
  if (hasRequiredHex) return hex;
  hasRequiredHex = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeHex = exports.remove0x = void 0;
    var utils_1 = /* @__PURE__ */ requireUtils$3();
    var remove0x = function(hex2) {
      return hex2.startsWith("0x") || hex2.startsWith("0X") ? hex2.slice(2) : hex2;
    };
    exports.remove0x = remove0x;
    var decodeHex = function(hex2) {
      return (0, utils_1.hexToBytes)((0, exports.remove0x)(hex2));
    };
    exports.decodeHex = decodeHex;
  })(hex);
  return hex;
}
var hasRequiredElliptic;
function requireElliptic() {
  if (hasRequiredElliptic) return elliptic;
  hasRequiredElliptic = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hexToPublicKey = exports.convertPublicKeyFormat = exports.getSharedPoint = exports.getPublicKey = exports.isValidPrivateKey = exports.getValidSecret = void 0;
    var webcrypto_1 = /* @__PURE__ */ requireWebcrypto();
    var ed25519_1 = /* @__PURE__ */ requireEd25519();
    var secp256k1_1 = /* @__PURE__ */ requireSecp256k1();
    var config_1 = requireConfig();
    var consts_1 = requireConsts();
    var hex_1 = requireHex();
    var getValidSecret = function() {
      var key;
      do {
        key = (0, webcrypto_1.randomBytes)(consts_1.SECRET_KEY_LENGTH);
      } while (!(0, exports.isValidPrivateKey)(key));
      return key;
    };
    exports.getValidSecret = getValidSecret;
    var isValidPrivateKey = function(secret) {
      return _exec((0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.utils.isValidPrivateKey(secret);
      }, function() {
        return true;
      }, function() {
        return true;
      });
    };
    exports.isValidPrivateKey = isValidPrivateKey;
    var getPublicKey = function(secret) {
      return _exec((0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.getPublicKey(secret);
      }, function(curve2) {
        return curve2.getPublicKey(secret);
      }, function(curve2) {
        return curve2.getPublicKey(secret);
      });
    };
    exports.getPublicKey = getPublicKey;
    var getSharedPoint = function(sk, pk, compressed) {
      return _exec((0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.getSharedSecret(sk, pk, compressed);
      }, function(curve2) {
        return curve2.getSharedSecret(sk, pk);
      }, function(curve2) {
        return getSharedPointOnEd25519(curve2, sk, pk);
      });
    };
    exports.getSharedPoint = getSharedPoint;
    var convertPublicKeyFormat = function(pk, compressed) {
      return _exec((0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.getSharedSecret(BigInt(1), pk, compressed);
      }, function() {
        return pk;
      }, function() {
        return pk;
      });
    };
    exports.convertPublicKeyFormat = convertPublicKeyFormat;
    var hexToPublicKey = function(hex2) {
      var decoded = (0, hex_1.decodeHex)(hex2);
      return _exec((0, config_1.ellipticCurve)(), function() {
        return compatEthPublicKey(decoded);
      }, function() {
        return decoded;
      }, function() {
        return decoded;
      });
    };
    exports.hexToPublicKey = hexToPublicKey;
    function _exec(curve2, secp256k1Callback, x25519Callback, ed25519Callback) {
      if (curve2 === "secp256k1") {
        return secp256k1Callback(secp256k1_1.secp256k1);
      } else if (curve2 === "x25519") {
        return x25519Callback(ed25519_1.x25519);
      } else if (curve2 === "ed25519") {
        return ed25519Callback(ed25519_1.ed25519);
      } else {
        throw new Error("Not implemented");
      }
    }
    var compatEthPublicKey = function(pk) {
      if (pk.length === consts_1.ETH_PUBLIC_KEY_SIZE) {
        var fixed = new Uint8Array(1 + pk.length);
        fixed.set([4]);
        fixed.set(pk, 1);
        return fixed;
      }
      return pk;
    };
    var getSharedPointOnEd25519 = function(curve2, sk, pk) {
      var scalar = curve2.utils.getExtendedPublicKey(sk).scalar;
      var point = curve2.ExtendedPoint.fromHex(pk).multiply(scalar);
      return point.toRawBytes();
    };
  })(elliptic);
  return elliptic;
}
var hash = {};
var hkdf = {};
var hasRequiredHkdf;
function requireHkdf() {
  if (hasRequiredHkdf) return hkdf;
  hasRequiredHkdf = 1;
  Object.defineProperty(hkdf, "__esModule", { value: true });
  hkdf.hkdf = void 0;
  hkdf.extract = extract;
  hkdf.expand = expand;
  const _assert_js_1 = /* @__PURE__ */ require_assert();
  const hmac_js_1 = /* @__PURE__ */ requireHmac();
  const utils_js_1 = /* @__PURE__ */ requireUtils$2();
  function extract(hash2, ikm, salt) {
    (0, _assert_js_1.ahash)(hash2);
    if (salt === void 0)
      salt = new Uint8Array(hash2.outputLen);
    return (0, hmac_js_1.hmac)(hash2, (0, utils_js_1.toBytes)(salt), (0, utils_js_1.toBytes)(ikm));
  }
  const HKDF_COUNTER = /* @__PURE__ */ new Uint8Array([0]);
  const EMPTY_BUFFER = /* @__PURE__ */ new Uint8Array();
  function expand(hash2, prk, info, length = 32) {
    (0, _assert_js_1.ahash)(hash2);
    (0, _assert_js_1.anumber)(length);
    if (length > 255 * hash2.outputLen)
      throw new Error("Length should be <= 255*HashLen");
    const blocks = Math.ceil(length / hash2.outputLen);
    if (info === void 0)
      info = EMPTY_BUFFER;
    const okm = new Uint8Array(blocks * hash2.outputLen);
    const HMAC = hmac_js_1.hmac.create(hash2, prk);
    const HMACTmp = HMAC._cloneInto();
    const T = new Uint8Array(HMAC.outputLen);
    for (let counter = 0; counter < blocks; counter++) {
      HKDF_COUNTER[0] = counter + 1;
      HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
      okm.set(T, hash2.outputLen * counter);
      HMAC._cloneInto(HMACTmp);
    }
    HMAC.destroy();
    HMACTmp.destroy();
    T.fill(0);
    HKDF_COUNTER.fill(0);
    return okm.slice(0, length);
  }
  const hkdf$1 = (hash2, ikm, salt, info, length) => expand(hash2, extract(hash2, ikm, salt), info, length);
  hkdf.hkdf = hkdf$1;
  return hkdf;
}
var hasRequiredHash;
function requireHash() {
  if (hasRequiredHash) return hash;
  hasRequiredHash = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSharedKey = exports.deriveKey = void 0;
    var utils_1 = /* @__PURE__ */ requireUtils$3();
    var hkdf_1 = /* @__PURE__ */ requireHkdf();
    var sha256_1 = /* @__PURE__ */ requireSha256();
    var deriveKey = function(master, salt, info) {
      return (0, hkdf_1.hkdf)(sha256_1.sha256, master, salt, info, 32);
    };
    exports.deriveKey = deriveKey;
    var getSharedKey = function() {
      var parts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
      }
      return (0, exports.deriveKey)(utils_1.concatBytes.apply(void 0, parts));
    };
    exports.getSharedKey = getSharedKey;
  })(hash);
  return hash;
}
var symmetric = {};
var noble$1 = {};
var aes = {};
var _polyval = {};
var hasRequired_polyval;
function require_polyval() {
  if (hasRequired_polyval) return _polyval;
  hasRequired_polyval = 1;
  Object.defineProperty(_polyval, "__esModule", { value: true });
  _polyval.polyval = _polyval.ghash = void 0;
  _polyval._toGHASHKey = _toGHASHKey;
  const _assert_js_1 = /* @__PURE__ */ require_assert$1();
  const utils_js_1 = /* @__PURE__ */ requireUtils$3();
  const BLOCK_SIZE = 16;
  const ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
  const ZEROS32 = (0, utils_js_1.u32)(ZEROS16);
  const POLY = 225;
  const mul2 = (s0, s1, s2, s3) => {
    const hiBit = s3 & 1;
    return {
      s3: s2 << 31 | s3 >>> 1,
      s2: s1 << 31 | s2 >>> 1,
      s1: s0 << 31 | s1 >>> 1,
      s0: s0 >>> 1 ^ POLY << 24 & -(hiBit & 1)
      // reduce % poly
    };
  };
  const swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
  function _toGHASHKey(k) {
    k.reverse();
    const hiBit = k[15] & 1;
    let carry = 0;
    for (let i = 0; i < k.length; i++) {
      const t = k[i];
      k[i] = t >>> 1 | carry;
      carry = (t & 1) << 7;
    }
    k[0] ^= -hiBit & 225;
    return k;
  }
  const estimateWindow = (bytes) => {
    if (bytes > 64 * 1024)
      return 8;
    if (bytes > 1024)
      return 4;
    return 2;
  };
  class GHASH {
    // We select bits per window adaptively based on expectedLength
    constructor(key, expectedLength) {
      this.blockLen = BLOCK_SIZE;
      this.outputLen = BLOCK_SIZE;
      this.s0 = 0;
      this.s1 = 0;
      this.s2 = 0;
      this.s3 = 0;
      this.finished = false;
      key = (0, utils_js_1.toBytes)(key);
      (0, _assert_js_1.abytes)(key, 16);
      const kView = (0, utils_js_1.createView)(key);
      let k0 = kView.getUint32(0, false);
      let k1 = kView.getUint32(4, false);
      let k2 = kView.getUint32(8, false);
      let k3 = kView.getUint32(12, false);
      const doubles = [];
      for (let i = 0; i < 128; i++) {
        doubles.push({ s0: swapLE(k0), s1: swapLE(k1), s2: swapLE(k2), s3: swapLE(k3) });
        ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2(k0, k1, k2, k3));
      }
      const W = estimateWindow(expectedLength || 1024);
      if (![1, 2, 4, 8].includes(W))
        throw new Error("ghash: invalid window size, expected 2, 4 or 8");
      this.W = W;
      const bits = 128;
      const windows = bits / W;
      const windowSize = this.windowSize = 2 ** W;
      const items = [];
      for (let w = 0; w < windows; w++) {
        for (let byte = 0; byte < windowSize; byte++) {
          let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
          for (let j = 0; j < W; j++) {
            const bit = byte >>> W - j - 1 & 1;
            if (!bit)
              continue;
            const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
            s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
          }
          items.push({ s0, s1, s2, s3 });
        }
      }
      this.t = items;
    }
    _updateBlock(s0, s1, s2, s3) {
      s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
      const { W, t, windowSize } = this;
      let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
      const mask = (1 << W) - 1;
      let w = 0;
      for (const num of [s0, s1, s2, s3]) {
        for (let bytePos = 0; bytePos < 4; bytePos++) {
          const byte = num >>> 8 * bytePos & 255;
          for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
            const bit = byte >>> W * bitPos & mask;
            const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
            o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
            w += 1;
          }
        }
      }
      this.s0 = o0;
      this.s1 = o1;
      this.s2 = o2;
      this.s3 = o3;
    }
    update(data) {
      data = (0, utils_js_1.toBytes)(data);
      (0, _assert_js_1.aexists)(this);
      const b32 = (0, utils_js_1.u32)(data);
      const blocks = Math.floor(data.length / BLOCK_SIZE);
      const left = data.length % BLOCK_SIZE;
      for (let i = 0; i < blocks; i++) {
        this._updateBlock(b32[i * 4 + 0], b32[i * 4 + 1], b32[i * 4 + 2], b32[i * 4 + 3]);
      }
      if (left) {
        ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
        this._updateBlock(ZEROS32[0], ZEROS32[1], ZEROS32[2], ZEROS32[3]);
        (0, utils_js_1.clean)(ZEROS32);
      }
      return this;
    }
    destroy() {
      const { t } = this;
      for (const elm of t) {
        elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
      }
    }
    digestInto(out) {
      (0, _assert_js_1.aexists)(this);
      (0, _assert_js_1.aoutput)(out, this);
      this.finished = true;
      const { s0, s1, s2, s3 } = this;
      const o32 = (0, utils_js_1.u32)(out);
      o32[0] = s0;
      o32[1] = s1;
      o32[2] = s2;
      o32[3] = s3;
      return out;
    }
    digest() {
      const res = new Uint8Array(BLOCK_SIZE);
      this.digestInto(res);
      this.destroy();
      return res;
    }
  }
  class Polyval extends GHASH {
    constructor(key, expectedLength) {
      key = (0, utils_js_1.toBytes)(key);
      const ghKey = _toGHASHKey((0, utils_js_1.copyBytes)(key));
      super(ghKey, expectedLength);
      (0, utils_js_1.clean)(ghKey);
    }
    update(data) {
      data = (0, utils_js_1.toBytes)(data);
      (0, _assert_js_1.aexists)(this);
      const b32 = (0, utils_js_1.u32)(data);
      const left = data.length % BLOCK_SIZE;
      const blocks = Math.floor(data.length / BLOCK_SIZE);
      for (let i = 0; i < blocks; i++) {
        this._updateBlock(swapLE(b32[i * 4 + 3]), swapLE(b32[i * 4 + 2]), swapLE(b32[i * 4 + 1]), swapLE(b32[i * 4 + 0]));
      }
      if (left) {
        ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
        this._updateBlock(swapLE(ZEROS32[3]), swapLE(ZEROS32[2]), swapLE(ZEROS32[1]), swapLE(ZEROS32[0]));
        (0, utils_js_1.clean)(ZEROS32);
      }
      return this;
    }
    digestInto(out) {
      (0, _assert_js_1.aexists)(this);
      (0, _assert_js_1.aoutput)(out, this);
      this.finished = true;
      const { s0, s1, s2, s3 } = this;
      const o32 = (0, utils_js_1.u32)(out);
      o32[0] = s0;
      o32[1] = s1;
      o32[2] = s2;
      o32[3] = s3;
      return out.reverse();
    }
  }
  function wrapConstructorWithKey(hashCons) {
    const hashC = (msg, key) => hashCons(key, msg.length).update((0, utils_js_1.toBytes)(msg)).digest();
    const tmp = hashCons(new Uint8Array(16), 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (key, expectedLength) => hashCons(key, expectedLength);
    return hashC;
  }
  _polyval.ghash = wrapConstructorWithKey((key, expectedLength) => new GHASH(key, expectedLength));
  _polyval.polyval = wrapConstructorWithKey((key, expectedLength) => new Polyval(key, expectedLength));
  return _polyval;
}
var hasRequiredAes;
function requireAes() {
  if (hasRequiredAes) return aes;
  hasRequiredAes = 1;
  Object.defineProperty(aes, "__esModule", { value: true });
  aes.unsafe = aes.aeskwp = aes.aeskw = aes.siv = aes.gcm = aes.cfb = aes.cbc = aes.ecb = aes.ctr = void 0;
  const _assert_js_1 = /* @__PURE__ */ require_assert$1();
  const _polyval_js_1 = /* @__PURE__ */ require_polyval();
  const utils_js_1 = /* @__PURE__ */ requireUtils$3();
  const BLOCK_SIZE = 16;
  const BLOCK_SIZE32 = 4;
  const EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE);
  const POLY = 283;
  function mul2(n) {
    return n << 1 ^ POLY & -(n >> 7);
  }
  function mul(a, b) {
    let res = 0;
    for (; b > 0; b >>= 1) {
      res ^= a & -(b & 1);
      a = mul2(a);
    }
    return res;
  }
  const sbox = /* @__PURE__ */ (() => {
    const t = new Uint8Array(256);
    for (let i = 0, x = 1; i < 256; i++, x ^= mul2(x))
      t[i] = x;
    const box = new Uint8Array(256);
    box[0] = 99;
    for (let i = 0; i < 255; i++) {
      let x = t[255 - i];
      x |= x << 8;
      box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
    }
    (0, utils_js_1.clean)(t);
    return box;
  })();
  const invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
  const rotr32_8 = (n) => n << 24 | n >>> 8;
  const rotl32_8 = (n) => n << 8 | n >>> 24;
  const byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  function genTtable(sbox2, fn) {
    if (sbox2.length !== 256)
      throw new Error("Wrong sbox length");
    const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
    const T1 = T0.map(rotl32_8);
    const T2 = T1.map(rotl32_8);
    const T3 = T2.map(rotl32_8);
    const T01 = new Uint32Array(256 * 256);
    const T23 = new Uint32Array(256 * 256);
    const sbox22 = new Uint16Array(256 * 256);
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        const idx = i * 256 + j;
        T01[idx] = T0[i] ^ T1[j];
        T23[idx] = T2[i] ^ T3[j];
        sbox22[idx] = sbox2[i] << 8 | sbox2[j];
      }
    }
    return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
  }
  const tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
  const tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => mul(s, 11) << 24 | mul(s, 13) << 16 | mul(s, 9) << 8 | mul(s, 14));
  const xPowers = /* @__PURE__ */ (() => {
    const p = new Uint8Array(16);
    for (let i = 0, x = 1; i < 16; i++, x = mul2(x))
      p[i] = x;
    return p;
  })();
  function expandKeyLE(key) {
    (0, _assert_js_1.abytes)(key);
    const len = key.length;
    if (![16, 24, 32].includes(len))
      throw new Error("aes: invalid key size, should be 16, 24 or 32, got " + len);
    const { sbox2 } = tableEncoding;
    const toClean = [];
    if (!(0, utils_js_1.isAligned32)(key))
      toClean.push(key = (0, utils_js_1.copyBytes)(key));
    const k32 = (0, utils_js_1.u32)(key);
    const Nk = k32.length;
    const subByte = (n) => applySbox(sbox2, n, n, n, n);
    const xk = new Uint32Array(len + 28);
    xk.set(k32);
    for (let i = Nk; i < xk.length; i++) {
      let t = xk[i - 1];
      if (i % Nk === 0)
        t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
      else if (Nk > 6 && i % Nk === 4)
        t = subByte(t);
      xk[i] = xk[i - Nk] ^ t;
    }
    (0, utils_js_1.clean)(...toClean);
    return xk;
  }
  function expandKeyDecLE(key) {
    const encKey = expandKeyLE(key);
    const xk = encKey.slice();
    const Nk = encKey.length;
    const { sbox2 } = tableEncoding;
    const { T0, T1, T2, T3 } = tableDecoding;
    for (let i = 0; i < Nk; i += 4) {
      for (let j = 0; j < 4; j++)
        xk[i + j] = encKey[Nk - i - 4 + j];
    }
    (0, utils_js_1.clean)(encKey);
    for (let i = 4; i < Nk - 4; i++) {
      const x = xk[i];
      const w = applySbox(sbox2, x, x, x, x);
      xk[i] = T0[w & 255] ^ T1[w >>> 8 & 255] ^ T2[w >>> 16 & 255] ^ T3[w >>> 24];
    }
    return xk;
  }
  function apply0123(T01, T23, s0, s1, s2, s3) {
    return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
  }
  function applySbox(sbox2, s0, s1, s2, s3) {
    return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
  }
  function encrypt(xk, s0, s1, s2, s3) {
    const { sbox2, T01, T23 } = tableEncoding;
    let k = 0;
    s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
    const rounds = xk.length / 4 - 2;
    for (let i = 0; i < rounds; i++) {
      const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
      const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
      const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
      const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
      s0 = t02, s1 = t12, s2 = t22, s3 = t32;
    }
    const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
    const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
    const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
    const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
    return { s0: t0, s1: t1, s2: t2, s3: t3 };
  }
  function decrypt(xk, s0, s1, s2, s3) {
    const { sbox2, T01, T23 } = tableDecoding;
    let k = 0;
    s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
    const rounds = xk.length / 4 - 2;
    for (let i = 0; i < rounds; i++) {
      const t02 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
      const t12 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
      const t22 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
      const t32 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
      s0 = t02, s1 = t12, s2 = t22, s3 = t32;
    }
    const t0 = xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1);
    const t1 = xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2);
    const t2 = xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3);
    const t3 = xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0);
    return { s0: t0, s1: t1, s2: t2, s3: t3 };
  }
  function ctrCounter(xk, nonce, src, dst) {
    (0, _assert_js_1.abytes)(nonce, BLOCK_SIZE);
    (0, _assert_js_1.abytes)(src);
    const srcLen = src.length;
    dst = (0, utils_js_1.getOutput)(srcLen, dst);
    (0, utils_js_1.complexOverlapBytes)(src, dst);
    const ctr = nonce;
    const c32 = (0, utils_js_1.u32)(ctr);
    let { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]);
    const src32 = (0, utils_js_1.u32)(src);
    const dst32 = (0, utils_js_1.u32)(dst);
    for (let i = 0; i + 4 <= src32.length; i += 4) {
      dst32[i + 0] = src32[i + 0] ^ s0;
      dst32[i + 1] = src32[i + 1] ^ s1;
      dst32[i + 2] = src32[i + 2] ^ s2;
      dst32[i + 3] = src32[i + 3] ^ s3;
      let carry = 1;
      for (let i2 = ctr.length - 1; i2 >= 0; i2--) {
        carry = carry + (ctr[i2] & 255) | 0;
        ctr[i2] = carry & 255;
        carry >>>= 8;
      }
      ({ s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
    }
    const start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
    if (start < srcLen) {
      const b32 = new Uint32Array([s0, s1, s2, s3]);
      const buf = (0, utils_js_1.u8)(b32);
      for (let i = start, pos = 0; i < srcLen; i++, pos++)
        dst[i] = src[i] ^ buf[pos];
      (0, utils_js_1.clean)(b32);
    }
    return dst;
  }
  function ctr32(xk, isLE2, nonce, src, dst) {
    (0, _assert_js_1.abytes)(nonce, BLOCK_SIZE);
    (0, _assert_js_1.abytes)(src);
    dst = (0, utils_js_1.getOutput)(src.length, dst);
    const ctr = nonce;
    const c32 = (0, utils_js_1.u32)(ctr);
    const view = (0, utils_js_1.createView)(ctr);
    const src32 = (0, utils_js_1.u32)(src);
    const dst32 = (0, utils_js_1.u32)(dst);
    const ctrPos = isLE2 ? 0 : 12;
    const srcLen = src.length;
    let ctrNum = view.getUint32(ctrPos, isLE2);
    let { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]);
    for (let i = 0; i + 4 <= src32.length; i += 4) {
      dst32[i + 0] = src32[i + 0] ^ s0;
      dst32[i + 1] = src32[i + 1] ^ s1;
      dst32[i + 2] = src32[i + 2] ^ s2;
      dst32[i + 3] = src32[i + 3] ^ s3;
      ctrNum = ctrNum + 1 >>> 0;
      view.setUint32(ctrPos, ctrNum, isLE2);
      ({ s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
    }
    const start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
    if (start < srcLen) {
      const b32 = new Uint32Array([s0, s1, s2, s3]);
      const buf = (0, utils_js_1.u8)(b32);
      for (let i = start, pos = 0; i < srcLen; i++, pos++)
        dst[i] = src[i] ^ buf[pos];
      (0, utils_js_1.clean)(b32);
    }
    return dst;
  }
  aes.ctr = (0, utils_js_1.wrapCipher)({ blockSize: 16, nonceLength: 16 }, function aesctr(key, nonce) {
    function processCtr(buf, dst) {
      (0, _assert_js_1.abytes)(buf);
      if (dst !== void 0) {
        (0, _assert_js_1.abytes)(dst);
        if (!(0, utils_js_1.isAligned32)(dst))
          throw new Error("unaligned destination");
      }
      const xk = expandKeyLE(key);
      const n = (0, utils_js_1.copyBytes)(nonce);
      const toClean = [xk, n];
      if (!(0, utils_js_1.isAligned32)(buf))
        toClean.push(buf = (0, utils_js_1.copyBytes)(buf));
      const out = ctrCounter(xk, n, buf, dst);
      (0, utils_js_1.clean)(...toClean);
      return out;
    }
    return {
      encrypt: (plaintext, dst) => processCtr(plaintext, dst),
      decrypt: (ciphertext, dst) => processCtr(ciphertext, dst)
    };
  });
  function validateBlockDecrypt(data) {
    (0, _assert_js_1.abytes)(data);
    if (data.length % BLOCK_SIZE !== 0) {
      throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size " + BLOCK_SIZE);
    }
  }
  function validateBlockEncrypt(plaintext, pcks5, dst) {
    (0, _assert_js_1.abytes)(plaintext);
    let outLen = plaintext.length;
    const remaining = outLen % BLOCK_SIZE;
    if (!pcks5 && remaining !== 0)
      throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
    if (!(0, utils_js_1.isAligned32)(plaintext))
      plaintext = (0, utils_js_1.copyBytes)(plaintext);
    const b = (0, utils_js_1.u32)(plaintext);
    if (pcks5) {
      let left = BLOCK_SIZE - remaining;
      if (!left)
        left = BLOCK_SIZE;
      outLen = outLen + left;
    }
    dst = (0, utils_js_1.getOutput)(outLen, dst);
    (0, utils_js_1.complexOverlapBytes)(plaintext, dst);
    const o = (0, utils_js_1.u32)(dst);
    return { b, o, out: dst };
  }
  function validatePCKS(data, pcks5) {
    if (!pcks5)
      return data;
    const len = data.length;
    if (!len)
      throw new Error("aes/pcks5: empty ciphertext not allowed");
    const lastByte = data[len - 1];
    if (lastByte <= 0 || lastByte > 16)
      throw new Error("aes/pcks5: wrong padding");
    const out = data.subarray(0, -lastByte);
    for (let i = 0; i < lastByte; i++)
      if (data[len - i - 1] !== lastByte)
        throw new Error("aes/pcks5: wrong padding");
    return out;
  }
  function padPCKS(left) {
    const tmp = new Uint8Array(16);
    const tmp32 = (0, utils_js_1.u32)(tmp);
    tmp.set(left);
    const paddingByte = BLOCK_SIZE - left.length;
    for (let i = BLOCK_SIZE - paddingByte; i < BLOCK_SIZE; i++)
      tmp[i] = paddingByte;
    return tmp32;
  }
  aes.ecb = (0, utils_js_1.wrapCipher)({ blockSize: 16 }, function aesecb(key, opts = {}) {
    const pcks5 = !opts.disablePadding;
    return {
      encrypt(plaintext, dst) {
        const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
        const xk = expandKeyLE(key);
        let i = 0;
        for (; i + 4 <= b.length; ) {
          const { s0, s1, s2, s3 } = encrypt(xk, b[i + 0], b[i + 1], b[i + 2], b[i + 3]);
          o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
        }
        if (pcks5) {
          const tmp32 = padPCKS(plaintext.subarray(i * 4));
          const { s0, s1, s2, s3 } = encrypt(xk, tmp32[0], tmp32[1], tmp32[2], tmp32[3]);
          o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
        }
        (0, utils_js_1.clean)(xk);
        return _out;
      },
      decrypt(ciphertext, dst) {
        validateBlockDecrypt(ciphertext);
        const xk = expandKeyDecLE(key);
        dst = (0, utils_js_1.getOutput)(ciphertext.length, dst);
        const toClean = [xk];
        if (!(0, utils_js_1.isAligned32)(ciphertext))
          toClean.push(ciphertext = (0, utils_js_1.copyBytes)(ciphertext));
        (0, utils_js_1.complexOverlapBytes)(ciphertext, dst);
        const b = (0, utils_js_1.u32)(ciphertext);
        const o = (0, utils_js_1.u32)(dst);
        for (let i = 0; i + 4 <= b.length; ) {
          const { s0, s1, s2, s3 } = decrypt(xk, b[i + 0], b[i + 1], b[i + 2], b[i + 3]);
          o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
        }
        (0, utils_js_1.clean)(...toClean);
        return validatePCKS(dst, pcks5);
      }
    };
  });
  aes.cbc = (0, utils_js_1.wrapCipher)({ blockSize: 16, nonceLength: 16 }, function aescbc(key, iv, opts = {}) {
    const pcks5 = !opts.disablePadding;
    return {
      encrypt(plaintext, dst) {
        const xk = expandKeyLE(key);
        const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
        let _iv = iv;
        const toClean = [xk];
        if (!(0, utils_js_1.isAligned32)(_iv))
          toClean.push(_iv = (0, utils_js_1.copyBytes)(_iv));
        const n32 = (0, utils_js_1.u32)(_iv);
        let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
        let i = 0;
        for (; i + 4 <= b.length; ) {
          s0 ^= b[i + 0], s1 ^= b[i + 1], s2 ^= b[i + 2], s3 ^= b[i + 3];
          ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
          o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
        }
        if (pcks5) {
          const tmp32 = padPCKS(plaintext.subarray(i * 4));
          s0 ^= tmp32[0], s1 ^= tmp32[1], s2 ^= tmp32[2], s3 ^= tmp32[3];
          ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
          o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
        }
        (0, utils_js_1.clean)(...toClean);
        return _out;
      },
      decrypt(ciphertext, dst) {
        validateBlockDecrypt(ciphertext);
        const xk = expandKeyDecLE(key);
        let _iv = iv;
        const toClean = [xk];
        if (!(0, utils_js_1.isAligned32)(_iv))
          toClean.push(_iv = (0, utils_js_1.copyBytes)(_iv));
        const n32 = (0, utils_js_1.u32)(_iv);
        dst = (0, utils_js_1.getOutput)(ciphertext.length, dst);
        if (!(0, utils_js_1.isAligned32)(ciphertext))
          toClean.push(ciphertext = (0, utils_js_1.copyBytes)(ciphertext));
        (0, utils_js_1.complexOverlapBytes)(ciphertext, dst);
        const b = (0, utils_js_1.u32)(ciphertext);
        const o = (0, utils_js_1.u32)(dst);
        let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
        for (let i = 0; i + 4 <= b.length; ) {
          const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
          s0 = b[i + 0], s1 = b[i + 1], s2 = b[i + 2], s3 = b[i + 3];
          const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
          o[i++] = o0 ^ ps0, o[i++] = o1 ^ ps1, o[i++] = o2 ^ ps2, o[i++] = o3 ^ ps3;
        }
        (0, utils_js_1.clean)(...toClean);
        return validatePCKS(dst, pcks5);
      }
    };
  });
  aes.cfb = (0, utils_js_1.wrapCipher)({ blockSize: 16, nonceLength: 16 }, function aescfb(key, iv) {
    function processCfb(src, isEncrypt, dst) {
      (0, _assert_js_1.abytes)(src);
      const srcLen = src.length;
      dst = (0, utils_js_1.getOutput)(srcLen, dst);
      if ((0, utils_js_1.overlapBytes)(src, dst))
        throw new Error("overlapping src and dst not supported.");
      const xk = expandKeyLE(key);
      let _iv = iv;
      const toClean = [xk];
      if (!(0, utils_js_1.isAligned32)(_iv))
        toClean.push(_iv = (0, utils_js_1.copyBytes)(_iv));
      if (!(0, utils_js_1.isAligned32)(src))
        toClean.push(src = (0, utils_js_1.copyBytes)(src));
      const src32 = (0, utils_js_1.u32)(src);
      const dst32 = (0, utils_js_1.u32)(dst);
      const next32 = isEncrypt ? dst32 : src32;
      const n32 = (0, utils_js_1.u32)(_iv);
      let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
      for (let i = 0; i + 4 <= src32.length; ) {
        const { s0: e0, s1: e1, s2: e2, s3: e3 } = encrypt(xk, s0, s1, s2, s3);
        dst32[i + 0] = src32[i + 0] ^ e0;
        dst32[i + 1] = src32[i + 1] ^ e1;
        dst32[i + 2] = src32[i + 2] ^ e2;
        dst32[i + 3] = src32[i + 3] ^ e3;
        s0 = next32[i++], s1 = next32[i++], s2 = next32[i++], s3 = next32[i++];
      }
      const start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
      if (start < srcLen) {
        ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
        const buf = (0, utils_js_1.u8)(new Uint32Array([s0, s1, s2, s3]));
        for (let i = start, pos = 0; i < srcLen; i++, pos++)
          dst[i] = src[i] ^ buf[pos];
        (0, utils_js_1.clean)(buf);
      }
      (0, utils_js_1.clean)(...toClean);
      return dst;
    }
    return {
      encrypt: (plaintext, dst) => processCfb(plaintext, true, dst),
      decrypt: (ciphertext, dst) => processCfb(ciphertext, false, dst)
    };
  });
  function computeTag(fn, isLE2, key, data, AAD) {
    const aadLength = AAD == null ? 0 : AAD.length;
    const h = fn.create(key, data.length + aadLength);
    if (AAD)
      h.update(AAD);
    h.update(data);
    const num = new Uint8Array(16);
    const view = (0, utils_js_1.createView)(num);
    if (AAD)
      (0, utils_js_1.setBigUint64)(view, 0, BigInt(aadLength * 8), isLE2);
    (0, utils_js_1.setBigUint64)(view, 8, BigInt(data.length * 8), isLE2);
    h.update(num);
    const res = h.digest();
    (0, utils_js_1.clean)(num);
    return res;
  }
  aes.gcm = (0, utils_js_1.wrapCipher)({ blockSize: 16, nonceLength: 12, tagLength: 16, varSizeNonce: true }, function aesgcm(key, nonce, AAD) {
    if (nonce.length < 8)
      throw new Error("aes/gcm: invalid nonce length");
    const tagLength = 16;
    function _computeTag(authKey, tagMask, data) {
      const tag = computeTag(_polyval_js_1.ghash, false, authKey, data, AAD);
      for (let i = 0; i < tagMask.length; i++)
        tag[i] ^= tagMask[i];
      return tag;
    }
    function deriveKeys() {
      const xk = expandKeyLE(key);
      const authKey = EMPTY_BLOCK.slice();
      const counter = EMPTY_BLOCK.slice();
      ctr32(xk, false, counter, counter, authKey);
      if (nonce.length === 12) {
        counter.set(nonce);
      } else {
        const nonceLen = EMPTY_BLOCK.slice();
        const view = (0, utils_js_1.createView)(nonceLen);
        (0, utils_js_1.setBigUint64)(view, 8, BigInt(nonce.length * 8), false);
        const g = _polyval_js_1.ghash.create(authKey).update(nonce).update(nonceLen);
        g.digestInto(counter);
        g.destroy();
      }
      const tagMask = ctr32(xk, false, counter, EMPTY_BLOCK);
      return { xk, authKey, counter, tagMask };
    }
    return {
      encrypt(plaintext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const out = new Uint8Array(plaintext.length + tagLength);
        const toClean = [xk, authKey, counter, tagMask];
        if (!(0, utils_js_1.isAligned32)(plaintext))
          toClean.push(plaintext = (0, utils_js_1.copyBytes)(plaintext));
        ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
        const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
        toClean.push(tag);
        out.set(tag, plaintext.length);
        (0, utils_js_1.clean)(...toClean);
        return out;
      },
      decrypt(ciphertext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const toClean = [xk, authKey, tagMask, counter];
        if (!(0, utils_js_1.isAligned32)(ciphertext))
          toClean.push(ciphertext = (0, utils_js_1.copyBytes)(ciphertext));
        const data = ciphertext.subarray(0, -16);
        const passedTag = ciphertext.subarray(-16);
        const tag = _computeTag(authKey, tagMask, data);
        toClean.push(tag);
        if (!(0, utils_js_1.equalBytes)(tag, passedTag))
          throw new Error("aes/gcm: invalid ghash tag");
        const out = ctr32(xk, false, counter, data);
        (0, utils_js_1.clean)(...toClean);
        return out;
      }
    };
  });
  const limit = (name, min, max) => (value) => {
    if (!Number.isSafeInteger(value) || min > value || value > max) {
      const minmax = "[" + min + ".." + max + "]";
      throw new Error("" + name + ": expected value in range " + minmax + ", got " + value);
    }
  };
  aes.siv = (0, utils_js_1.wrapCipher)({ blockSize: 16, nonceLength: 12, tagLength: 16, varSizeNonce: true }, function aessiv(key, nonce, AAD) {
    const tagLength = 16;
    const AAD_LIMIT = limit("AAD", 0, 2 ** 36);
    const PLAIN_LIMIT = limit("plaintext", 0, 2 ** 36);
    const NONCE_LIMIT = limit("nonce", 12, 12);
    const CIPHER_LIMIT = limit("ciphertext", 16, 2 ** 36 + 16);
    (0, _assert_js_1.abytes)(key, 16, 24, 32);
    NONCE_LIMIT(nonce.length);
    if (AAD !== void 0)
      AAD_LIMIT(AAD.length);
    function deriveKeys() {
      const xk = expandKeyLE(key);
      const encKey = new Uint8Array(key.length);
      const authKey = new Uint8Array(16);
      const toClean = [xk, encKey];
      let _nonce = nonce;
      if (!(0, utils_js_1.isAligned32)(_nonce))
        toClean.push(_nonce = (0, utils_js_1.copyBytes)(_nonce));
      const n32 = (0, utils_js_1.u32)(_nonce);
      let s0 = 0, s1 = n32[0], s2 = n32[1], s3 = n32[2];
      let counter = 0;
      for (const derivedKey of [authKey, encKey].map(utils_js_1.u32)) {
        const d32 = (0, utils_js_1.u32)(derivedKey);
        for (let i = 0; i < d32.length; i += 2) {
          const { s0: o0, s1: o1 } = encrypt(xk, s0, s1, s2, s3);
          d32[i + 0] = o0;
          d32[i + 1] = o1;
          s0 = ++counter;
        }
      }
      const res = { authKey, encKey: expandKeyLE(encKey) };
      (0, utils_js_1.clean)(...toClean);
      return res;
    }
    function _computeTag(encKey, authKey, data) {
      const tag = computeTag(_polyval_js_1.polyval, true, authKey, data, AAD);
      for (let i = 0; i < 12; i++)
        tag[i] ^= nonce[i];
      tag[15] &= 127;
      const t32 = (0, utils_js_1.u32)(tag);
      let s0 = t32[0], s1 = t32[1], s2 = t32[2], s3 = t32[3];
      ({ s0, s1, s2, s3 } = encrypt(encKey, s0, s1, s2, s3));
      t32[0] = s0, t32[1] = s1, t32[2] = s2, t32[3] = s3;
      return tag;
    }
    function processSiv(encKey, tag, input) {
      let block = (0, utils_js_1.copyBytes)(tag);
      block[15] |= 128;
      const res = ctr32(encKey, true, block, input);
      (0, utils_js_1.clean)(block);
      return res;
    }
    return {
      encrypt(plaintext) {
        PLAIN_LIMIT(plaintext.length);
        const { encKey, authKey } = deriveKeys();
        const tag = _computeTag(encKey, authKey, plaintext);
        const toClean = [encKey, authKey, tag];
        if (!(0, utils_js_1.isAligned32)(plaintext))
          toClean.push(plaintext = (0, utils_js_1.copyBytes)(plaintext));
        const out = new Uint8Array(plaintext.length + tagLength);
        out.set(tag, plaintext.length);
        out.set(processSiv(encKey, tag, plaintext));
        (0, utils_js_1.clean)(...toClean);
        return out;
      },
      decrypt(ciphertext) {
        CIPHER_LIMIT(ciphertext.length);
        const tag = ciphertext.subarray(-16);
        const { encKey, authKey } = deriveKeys();
        const toClean = [encKey, authKey];
        if (!(0, utils_js_1.isAligned32)(ciphertext))
          toClean.push(ciphertext = (0, utils_js_1.copyBytes)(ciphertext));
        const plaintext = processSiv(encKey, tag, ciphertext.subarray(0, -16));
        const expectedTag = _computeTag(encKey, authKey, plaintext);
        toClean.push(expectedTag);
        if (!(0, utils_js_1.equalBytes)(tag, expectedTag)) {
          (0, utils_js_1.clean)(...toClean);
          throw new Error("invalid polyval tag");
        }
        (0, utils_js_1.clean)(...toClean);
        return plaintext;
      }
    };
  });
  function isBytes32(a) {
    return a instanceof Uint32Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint32Array";
  }
  function encryptBlock(xk, block) {
    (0, _assert_js_1.abytes)(block, 16);
    if (!isBytes32(xk))
      throw new Error("_encryptBlock accepts result of expandKeyLE");
    const b32 = (0, utils_js_1.u32)(block);
    let { s0, s1, s2, s3 } = encrypt(xk, b32[0], b32[1], b32[2], b32[3]);
    b32[0] = s0, b32[1] = s1, b32[2] = s2, b32[3] = s3;
    return block;
  }
  function decryptBlock(xk, block) {
    (0, _assert_js_1.abytes)(block, 16);
    if (!isBytes32(xk))
      throw new Error("_decryptBlock accepts result of expandKeyLE");
    const b32 = (0, utils_js_1.u32)(block);
    let { s0, s1, s2, s3 } = decrypt(xk, b32[0], b32[1], b32[2], b32[3]);
    b32[0] = s0, b32[1] = s1, b32[2] = s2, b32[3] = s3;
    return block;
  }
  const AESW = {
    /*
    High-level pseudocode:
    ```
    A: u64 = IV
    out = []
    for (let i=0, ctr = 0; i<6; i++) {
      for (const chunk of chunks(plaintext, 8)) {
        A ^= swapEndianess(ctr++)
        [A, res] = chunks(encrypt(A || chunk), 8);
        out ||= res
      }
    }
    out = A || out
    ```
    Decrypt is the same, but reversed.
    */
    encrypt(kek, out) {
      if (out.length >= 2 ** 32)
        throw new Error("plaintext should be less than 4gb");
      const xk = expandKeyLE(kek);
      if (out.length === 16)
        encryptBlock(xk, out);
      else {
        const o32 = (0, utils_js_1.u32)(out);
        let a0 = o32[0], a1 = o32[1];
        for (let j = 0, ctr = 1; j < 6; j++) {
          for (let pos = 2; pos < o32.length; pos += 2, ctr++) {
            const { s0, s1, s2, s3 } = encrypt(xk, a0, a1, o32[pos], o32[pos + 1]);
            a0 = s0, a1 = s1 ^ byteSwap(ctr), o32[pos] = s2, o32[pos + 1] = s3;
          }
        }
        o32[0] = a0, o32[1] = a1;
      }
      xk.fill(0);
    },
    decrypt(kek, out) {
      if (out.length - 8 >= 2 ** 32)
        throw new Error("ciphertext should be less than 4gb");
      const xk = expandKeyDecLE(kek);
      const chunks = out.length / 8 - 1;
      if (chunks === 1)
        decryptBlock(xk, out);
      else {
        const o32 = (0, utils_js_1.u32)(out);
        let a0 = o32[0], a1 = o32[1];
        for (let j = 0, ctr = chunks * 6; j < 6; j++) {
          for (let pos = chunks * 2; pos >= 1; pos -= 2, ctr--) {
            a1 ^= byteSwap(ctr);
            const { s0, s1, s2, s3 } = decrypt(xk, a0, a1, o32[pos], o32[pos + 1]);
            a0 = s0, a1 = s1, o32[pos] = s2, o32[pos + 1] = s3;
          }
        }
        o32[0] = a0, o32[1] = a1;
      }
      xk.fill(0);
    }
  };
  const AESKW_IV = /* @__PURE__ */ new Uint8Array(8).fill(166);
  aes.aeskw = (0, utils_js_1.wrapCipher)({ blockSize: 8 }, (kek) => ({
    encrypt(plaintext) {
      if (!plaintext.length || plaintext.length % 8 !== 0)
        throw new Error("invalid plaintext length");
      if (plaintext.length === 8)
        throw new Error("8-byte keys not allowed in AESKW, use AESKWP instead");
      const out = (0, utils_js_1.concatBytes)(AESKW_IV, plaintext);
      AESW.encrypt(kek, out);
      return out;
    },
    decrypt(ciphertext) {
      if (ciphertext.length % 8 !== 0 || ciphertext.length < 3 * 8)
        throw new Error("invalid ciphertext length");
      const out = (0, utils_js_1.copyBytes)(ciphertext);
      AESW.decrypt(kek, out);
      if (!(0, utils_js_1.equalBytes)(out.subarray(0, 8), AESKW_IV))
        throw new Error("integrity check failed");
      out.subarray(0, 8).fill(0);
      return out.subarray(8);
    }
  }));
  const AESKWP_IV = 2790873510;
  aes.aeskwp = (0, utils_js_1.wrapCipher)({ blockSize: 8 }, (kek) => ({
    encrypt(plaintext) {
      if (!plaintext.length)
        throw new Error("invalid plaintext length");
      const padded = Math.ceil(plaintext.length / 8) * 8;
      const out = new Uint8Array(8 + padded);
      out.set(plaintext, 8);
      const out32 = (0, utils_js_1.u32)(out);
      out32[0] = AESKWP_IV;
      out32[1] = byteSwap(plaintext.length);
      AESW.encrypt(kek, out);
      return out;
    },
    decrypt(ciphertext) {
      if (ciphertext.length < 16)
        throw new Error("invalid ciphertext length");
      const out = (0, utils_js_1.copyBytes)(ciphertext);
      const o32 = (0, utils_js_1.u32)(out);
      AESW.decrypt(kek, out);
      const len = byteSwap(o32[1]) >>> 0;
      const padded = Math.ceil(len / 8) * 8;
      if (o32[0] !== AESKWP_IV || out.length - 8 !== padded)
        throw new Error("integrity check failed");
      for (let i = len; i < padded; i++)
        if (out[8 + i] !== 0)
          throw new Error("integrity check failed");
      out.subarray(0, 8).fill(0);
      return out.subarray(8, 8 + len);
    }
  }));
  aes.unsafe = {
    expandKeyLE,
    expandKeyDecLE,
    encrypt,
    decrypt,
    encryptBlock,
    decryptBlock,
    ctrCounter,
    ctr32
  };
  return aes;
}
var hasRequiredNoble$1;
function requireNoble$1() {
  if (hasRequiredNoble$1) return noble$1;
  hasRequiredNoble$1 = 1;
  Object.defineProperty(noble$1, "__esModule", { value: true });
  noble$1.aes256cbc = noble$1.aes256gcm = void 0;
  var aes_1 = /* @__PURE__ */ requireAes();
  var aes256gcm = function(key, nonce, AAD) {
    return (0, aes_1.gcm)(key, nonce, AAD);
  };
  noble$1.aes256gcm = aes256gcm;
  var aes256cbc = function(key, nonce, AAD) {
    return (0, aes_1.cbc)(key, nonce);
  };
  noble$1.aes256cbc = aes256cbc;
  return noble$1;
}
var noble = {};
var chacha = {};
var _arx = {};
var hasRequired_arx;
function require_arx() {
  if (hasRequired_arx) return _arx;
  hasRequired_arx = 1;
  Object.defineProperty(_arx, "__esModule", { value: true });
  _arx.rotl = rotl;
  _arx.createCipher = createCipher;
  const _assert_js_1 = /* @__PURE__ */ require_assert$1();
  const utils_js_1 = /* @__PURE__ */ requireUtils$3();
  const _utf8ToBytes = (str) => Uint8Array.from(str.split("").map((c) => c.charCodeAt(0)));
  const sigma16 = _utf8ToBytes("expand 16-byte k");
  const sigma32 = _utf8ToBytes("expand 32-byte k");
  const sigma16_32 = (0, utils_js_1.u32)(sigma16);
  const sigma32_32 = (0, utils_js_1.u32)(sigma32);
  function rotl(a, b) {
    return a << b | a >>> 32 - b;
  }
  function isAligned32(b) {
    return b.byteOffset % 4 === 0;
  }
  const BLOCK_LEN = 64;
  const BLOCK_LEN32 = 16;
  const MAX_COUNTER = 2 ** 32 - 1;
  const U32_EMPTY = new Uint32Array();
  function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
    const len = data.length;
    const block = new Uint8Array(BLOCK_LEN);
    const b32 = (0, utils_js_1.u32)(block);
    const isAligned = isAligned32(data) && isAligned32(output);
    const d32 = isAligned ? (0, utils_js_1.u32)(data) : U32_EMPTY;
    const o32 = isAligned ? (0, utils_js_1.u32)(output) : U32_EMPTY;
    for (let pos = 0; pos < len; counter++) {
      core(sigma, key, nonce, b32, counter, rounds);
      if (counter >= MAX_COUNTER)
        throw new Error("arx: counter overflow");
      const take = Math.min(BLOCK_LEN, len - pos);
      if (isAligned && take === BLOCK_LEN) {
        const pos32 = pos / 4;
        if (pos % 4 !== 0)
          throw new Error("arx: invalid block position");
        for (let j = 0, posj; j < BLOCK_LEN32; j++) {
          posj = pos32 + j;
          o32[posj] = d32[posj] ^ b32[j];
        }
        pos += BLOCK_LEN;
        continue;
      }
      for (let j = 0, posj; j < take; j++) {
        posj = pos + j;
        output[posj] = data[posj] ^ block[j];
      }
      pos += take;
    }
  }
  function createCipher(core, opts) {
    const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = (0, utils_js_1.checkOpts)({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts);
    if (typeof core !== "function")
      throw new Error("core must be a function");
    (0, _assert_js_1.anumber)(counterLength);
    (0, _assert_js_1.anumber)(rounds);
    (0, _assert_js_1.abool)(counterRight);
    (0, _assert_js_1.abool)(allowShortKeys);
    return (key, nonce, data, output, counter = 0) => {
      (0, _assert_js_1.abytes)(key);
      (0, _assert_js_1.abytes)(nonce);
      (0, _assert_js_1.abytes)(data);
      const len = data.length;
      if (output === void 0)
        output = new Uint8Array(len);
      (0, _assert_js_1.abytes)(output);
      (0, _assert_js_1.anumber)(counter);
      if (counter < 0 || counter >= MAX_COUNTER)
        throw new Error("arx: counter overflow");
      if (output.length < len)
        throw new Error(`arx: output (${output.length}) is shorter than data (${len})`);
      const toClean = [];
      let l = key.length;
      let k;
      let sigma;
      if (l === 32) {
        toClean.push(k = (0, utils_js_1.copyBytes)(key));
        sigma = sigma32_32;
      } else if (l === 16 && allowShortKeys) {
        k = new Uint8Array(32);
        k.set(key);
        k.set(key, 16);
        sigma = sigma16_32;
        toClean.push(k);
      } else {
        throw new Error(`arx: invalid 32-byte key, got length=${l}`);
      }
      if (!isAligned32(nonce))
        toClean.push(nonce = (0, utils_js_1.copyBytes)(nonce));
      const k32 = (0, utils_js_1.u32)(k);
      if (extendNonceFn) {
        if (nonce.length !== 24)
          throw new Error(`arx: extended nonce must be 24 bytes`);
        extendNonceFn(sigma, k32, (0, utils_js_1.u32)(nonce.subarray(0, 16)), k32);
        nonce = nonce.subarray(16);
      }
      const nonceNcLen = 16 - counterLength;
      if (nonceNcLen !== nonce.length)
        throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
      if (nonceNcLen !== 12) {
        const nc = new Uint8Array(12);
        nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
        nonce = nc;
        toClean.push(nonce);
      }
      const n32 = (0, utils_js_1.u32)(nonce);
      runCipher(core, sigma, k32, n32, data, output, counter, rounds);
      (0, utils_js_1.clean)(...toClean);
      return output;
    };
  }
  return _arx;
}
var _poly1305 = {};
var hasRequired_poly1305;
function require_poly1305() {
  if (hasRequired_poly1305) return _poly1305;
  hasRequired_poly1305 = 1;
  Object.defineProperty(_poly1305, "__esModule", { value: true });
  _poly1305.poly1305 = void 0;
  _poly1305.wrapConstructorWithKey = wrapConstructorWithKey;
  const _assert_js_1 = /* @__PURE__ */ require_assert$1();
  const utils_js_1 = /* @__PURE__ */ requireUtils$3();
  const u8to16 = (a, i) => a[i++] & 255 | (a[i++] & 255) << 8;
  class Poly1305 {
    constructor(key) {
      this.blockLen = 16;
      this.outputLen = 16;
      this.buffer = new Uint8Array(16);
      this.r = new Uint16Array(10);
      this.h = new Uint16Array(10);
      this.pad = new Uint16Array(8);
      this.pos = 0;
      this.finished = false;
      key = (0, utils_js_1.toBytes)(key);
      (0, _assert_js_1.abytes)(key, 32);
      const t0 = u8to16(key, 0);
      const t1 = u8to16(key, 2);
      const t2 = u8to16(key, 4);
      const t3 = u8to16(key, 6);
      const t4 = u8to16(key, 8);
      const t5 = u8to16(key, 10);
      const t6 = u8to16(key, 12);
      const t7 = u8to16(key, 14);
      this.r[0] = t0 & 8191;
      this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
      this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
      this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
      this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
      this.r[5] = t4 >>> 1 & 8190;
      this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
      this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
      this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
      this.r[9] = t7 >>> 5 & 127;
      for (let i = 0; i < 8; i++)
        this.pad[i] = u8to16(key, 16 + 2 * i);
    }
    process(data, offset, isLast = false) {
      const hibit = isLast ? 0 : 1 << 11;
      const { h, r } = this;
      const r0 = r[0];
      const r1 = r[1];
      const r2 = r[2];
      const r3 = r[3];
      const r4 = r[4];
      const r5 = r[5];
      const r6 = r[6];
      const r7 = r[7];
      const r8 = r[8];
      const r9 = r[9];
      const t0 = u8to16(data, offset + 0);
      const t1 = u8to16(data, offset + 2);
      const t2 = u8to16(data, offset + 4);
      const t3 = u8to16(data, offset + 6);
      const t4 = u8to16(data, offset + 8);
      const t5 = u8to16(data, offset + 10);
      const t6 = u8to16(data, offset + 12);
      const t7 = u8to16(data, offset + 14);
      let h0 = h[0] + (t0 & 8191);
      let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
      let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
      let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
      let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
      let h5 = h[5] + (t4 >>> 1 & 8191);
      let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
      let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
      let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
      let h9 = h[9] + (t7 >>> 5 | hibit);
      let c = 0;
      let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
      c = d0 >>> 13;
      d0 &= 8191;
      d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
      c += d0 >>> 13;
      d0 &= 8191;
      let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
      c = d1 >>> 13;
      d1 &= 8191;
      d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
      c += d1 >>> 13;
      d1 &= 8191;
      let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
      c = d2 >>> 13;
      d2 &= 8191;
      d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
      c += d2 >>> 13;
      d2 &= 8191;
      let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
      c = d3 >>> 13;
      d3 &= 8191;
      d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
      c += d3 >>> 13;
      d3 &= 8191;
      let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
      c = d4 >>> 13;
      d4 &= 8191;
      d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
      c += d4 >>> 13;
      d4 &= 8191;
      let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
      c = d5 >>> 13;
      d5 &= 8191;
      d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
      c += d5 >>> 13;
      d5 &= 8191;
      let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
      c = d6 >>> 13;
      d6 &= 8191;
      d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
      c += d6 >>> 13;
      d6 &= 8191;
      let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
      c = d7 >>> 13;
      d7 &= 8191;
      d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
      c += d7 >>> 13;
      d7 &= 8191;
      let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
      c = d8 >>> 13;
      d8 &= 8191;
      d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
      c += d8 >>> 13;
      d8 &= 8191;
      let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
      c = d9 >>> 13;
      d9 &= 8191;
      d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
      c += d9 >>> 13;
      d9 &= 8191;
      c = (c << 2) + c | 0;
      c = c + d0 | 0;
      d0 = c & 8191;
      c = c >>> 13;
      d1 += c;
      h[0] = d0;
      h[1] = d1;
      h[2] = d2;
      h[3] = d3;
      h[4] = d4;
      h[5] = d5;
      h[6] = d6;
      h[7] = d7;
      h[8] = d8;
      h[9] = d9;
    }
    finalize() {
      const { h, pad } = this;
      const g = new Uint16Array(10);
      let c = h[1] >>> 13;
      h[1] &= 8191;
      for (let i = 2; i < 10; i++) {
        h[i] += c;
        c = h[i] >>> 13;
        h[i] &= 8191;
      }
      h[0] += c * 5;
      c = h[0] >>> 13;
      h[0] &= 8191;
      h[1] += c;
      c = h[1] >>> 13;
      h[1] &= 8191;
      h[2] += c;
      g[0] = h[0] + 5;
      c = g[0] >>> 13;
      g[0] &= 8191;
      for (let i = 1; i < 10; i++) {
        g[i] = h[i] + c;
        c = g[i] >>> 13;
        g[i] &= 8191;
      }
      g[9] -= 1 << 13;
      let mask = (c ^ 1) - 1;
      for (let i = 0; i < 10; i++)
        g[i] &= mask;
      mask = ~mask;
      for (let i = 0; i < 10; i++)
        h[i] = h[i] & mask | g[i];
      h[0] = (h[0] | h[1] << 13) & 65535;
      h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
      h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
      h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
      h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
      h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
      h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
      h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
      let f = h[0] + pad[0];
      h[0] = f & 65535;
      for (let i = 1; i < 8; i++) {
        f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
        h[i] = f & 65535;
      }
      (0, utils_js_1.clean)(g);
    }
    update(data) {
      (0, _assert_js_1.aexists)(this);
      const { buffer: buffer2, blockLen } = this;
      data = (0, utils_js_1.toBytes)(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(data, pos);
          continue;
        }
        buffer2.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(buffer2, 0, false);
          this.pos = 0;
        }
      }
      return this;
    }
    destroy() {
      (0, utils_js_1.clean)(this.h, this.r, this.buffer, this.pad);
    }
    digestInto(out) {
      (0, _assert_js_1.aexists)(this);
      (0, _assert_js_1.aoutput)(out, this);
      this.finished = true;
      const { buffer: buffer2, h } = this;
      let { pos } = this;
      if (pos) {
        buffer2[pos++] = 1;
        for (; pos < 16; pos++)
          buffer2[pos] = 0;
        this.process(buffer2, 0, true);
      }
      this.finalize();
      let opos = 0;
      for (let i = 0; i < 8; i++) {
        out[opos++] = h[i] >>> 0;
        out[opos++] = h[i] >>> 8;
      }
      return out;
    }
    digest() {
      const { buffer: buffer2, outputLen } = this;
      this.digestInto(buffer2);
      const res = buffer2.slice(0, outputLen);
      this.destroy();
      return res;
    }
  }
  function wrapConstructorWithKey(hashCons) {
    const hashC = (msg, key) => hashCons(key).update((0, utils_js_1.toBytes)(msg)).digest();
    const tmp = hashCons(new Uint8Array(32));
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (key) => hashCons(key);
    return hashC;
  }
  _poly1305.poly1305 = wrapConstructorWithKey((key) => new Poly1305(key));
  return _poly1305;
}
var hasRequiredChacha;
function requireChacha() {
  if (hasRequiredChacha) return chacha;
  hasRequiredChacha = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.xchacha20poly1305 = exports.chacha20poly1305 = exports._poly1305_aead = exports.chacha12 = exports.chacha8 = exports.xchacha20 = exports.chacha20 = exports.chacha20orig = void 0;
    exports.hchacha = hchacha;
    const _arx_js_1 = /* @__PURE__ */ require_arx();
    const _poly1305_js_1 = /* @__PURE__ */ require_poly1305();
    const utils_js_1 = /* @__PURE__ */ requireUtils$3();
    function chachaCore(s, k, n, out, cnt, rounds = 20) {
      let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
      let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
      for (let r = 0; r < rounds; r += 2) {
        x00 = x00 + x04 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x00, 16);
        x08 = x08 + x12 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x08, 12);
        x00 = x00 + x04 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x00, 8);
        x08 = x08 + x12 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x08, 7);
        x01 = x01 + x05 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x01, 16);
        x09 = x09 + x13 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x09, 12);
        x01 = x01 + x05 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x01, 8);
        x09 = x09 + x13 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x09, 7);
        x02 = x02 + x06 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x02, 16);
        x10 = x10 + x14 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x10, 12);
        x02 = x02 + x06 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x02, 8);
        x10 = x10 + x14 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x10, 7);
        x03 = x03 + x07 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x03, 16);
        x11 = x11 + x15 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x11, 12);
        x03 = x03 + x07 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x03, 8);
        x11 = x11 + x15 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x11, 7);
        x00 = x00 + x05 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x00, 16);
        x10 = x10 + x15 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x10, 12);
        x00 = x00 + x05 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x00, 8);
        x10 = x10 + x15 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x10, 7);
        x01 = x01 + x06 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x01, 16);
        x11 = x11 + x12 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x11, 12);
        x01 = x01 + x06 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x01, 8);
        x11 = x11 + x12 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x11, 7);
        x02 = x02 + x07 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x02, 16);
        x08 = x08 + x13 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x08, 12);
        x02 = x02 + x07 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x02, 8);
        x08 = x08 + x13 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x08, 7);
        x03 = x03 + x04 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x03, 16);
        x09 = x09 + x14 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x09, 12);
        x03 = x03 + x04 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x03, 8);
        x09 = x09 + x14 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x09, 7);
      }
      let oi = 0;
      out[oi++] = y00 + x00 | 0;
      out[oi++] = y01 + x01 | 0;
      out[oi++] = y02 + x02 | 0;
      out[oi++] = y03 + x03 | 0;
      out[oi++] = y04 + x04 | 0;
      out[oi++] = y05 + x05 | 0;
      out[oi++] = y06 + x06 | 0;
      out[oi++] = y07 + x07 | 0;
      out[oi++] = y08 + x08 | 0;
      out[oi++] = y09 + x09 | 0;
      out[oi++] = y10 + x10 | 0;
      out[oi++] = y11 + x11 | 0;
      out[oi++] = y12 + x12 | 0;
      out[oi++] = y13 + x13 | 0;
      out[oi++] = y14 + x14 | 0;
      out[oi++] = y15 + x15 | 0;
    }
    function hchacha(s, k, i, o32) {
      let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
      for (let r = 0; r < 20; r += 2) {
        x00 = x00 + x04 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x00, 16);
        x08 = x08 + x12 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x08, 12);
        x00 = x00 + x04 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x00, 8);
        x08 = x08 + x12 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x08, 7);
        x01 = x01 + x05 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x01, 16);
        x09 = x09 + x13 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x09, 12);
        x01 = x01 + x05 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x01, 8);
        x09 = x09 + x13 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x09, 7);
        x02 = x02 + x06 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x02, 16);
        x10 = x10 + x14 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x10, 12);
        x02 = x02 + x06 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x02, 8);
        x10 = x10 + x14 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x10, 7);
        x03 = x03 + x07 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x03, 16);
        x11 = x11 + x15 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x11, 12);
        x03 = x03 + x07 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x03, 8);
        x11 = x11 + x15 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x11, 7);
        x00 = x00 + x05 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x00, 16);
        x10 = x10 + x15 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x10, 12);
        x00 = x00 + x05 | 0;
        x15 = (0, _arx_js_1.rotl)(x15 ^ x00, 8);
        x10 = x10 + x15 | 0;
        x05 = (0, _arx_js_1.rotl)(x05 ^ x10, 7);
        x01 = x01 + x06 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x01, 16);
        x11 = x11 + x12 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x11, 12);
        x01 = x01 + x06 | 0;
        x12 = (0, _arx_js_1.rotl)(x12 ^ x01, 8);
        x11 = x11 + x12 | 0;
        x06 = (0, _arx_js_1.rotl)(x06 ^ x11, 7);
        x02 = x02 + x07 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x02, 16);
        x08 = x08 + x13 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x08, 12);
        x02 = x02 + x07 | 0;
        x13 = (0, _arx_js_1.rotl)(x13 ^ x02, 8);
        x08 = x08 + x13 | 0;
        x07 = (0, _arx_js_1.rotl)(x07 ^ x08, 7);
        x03 = x03 + x04 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x03, 16);
        x09 = x09 + x14 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x09, 12);
        x03 = x03 + x04 | 0;
        x14 = (0, _arx_js_1.rotl)(x14 ^ x03, 8);
        x09 = x09 + x14 | 0;
        x04 = (0, _arx_js_1.rotl)(x04 ^ x09, 7);
      }
      let oi = 0;
      o32[oi++] = x00;
      o32[oi++] = x01;
      o32[oi++] = x02;
      o32[oi++] = x03;
      o32[oi++] = x12;
      o32[oi++] = x13;
      o32[oi++] = x14;
      o32[oi++] = x15;
    }
    exports.chacha20orig = (0, _arx_js_1.createCipher)(chachaCore, {
      counterRight: false,
      counterLength: 8,
      allowShortKeys: true
    });
    exports.chacha20 = (0, _arx_js_1.createCipher)(chachaCore, {
      counterRight: false,
      counterLength: 4,
      allowShortKeys: false
    });
    exports.xchacha20 = (0, _arx_js_1.createCipher)(chachaCore, {
      counterRight: false,
      counterLength: 8,
      extendNonceFn: hchacha,
      allowShortKeys: false
    });
    exports.chacha8 = (0, _arx_js_1.createCipher)(chachaCore, {
      counterRight: false,
      counterLength: 4,
      rounds: 8
    });
    exports.chacha12 = (0, _arx_js_1.createCipher)(chachaCore, {
      counterRight: false,
      counterLength: 4,
      rounds: 12
    });
    const ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
    const updatePadded = (h, msg) => {
      h.update(msg);
      const left = msg.length % 16;
      if (left)
        h.update(ZEROS16.subarray(left));
    };
    const ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
    function computeTag(fn, key, nonce, data, AAD) {
      const authKey = fn(key, nonce, ZEROS32);
      const h = _poly1305_js_1.poly1305.create(authKey);
      if (AAD)
        updatePadded(h, AAD);
      updatePadded(h, data);
      const num = new Uint8Array(16);
      const view = (0, utils_js_1.createView)(num);
      (0, utils_js_1.setBigUint64)(view, 0, BigInt(AAD ? AAD.length : 0), true);
      (0, utils_js_1.setBigUint64)(view, 8, BigInt(data.length), true);
      h.update(num);
      const res = h.digest();
      (0, utils_js_1.clean)(authKey, num);
      return res;
    }
    const _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
      const tagLength = 16;
      return {
        encrypt(plaintext, output) {
          const plength = plaintext.length;
          output = (0, utils_js_1.getOutput)(plength + tagLength, output, false);
          output.set(plaintext);
          const oPlain = output.subarray(0, -16);
          xorStream(key, nonce, oPlain, oPlain, 1);
          const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
          output.set(tag, plength);
          (0, utils_js_1.clean)(tag);
          return output;
        },
        decrypt(ciphertext, output) {
          output = (0, utils_js_1.getOutput)(ciphertext.length - tagLength, output, false);
          const data = ciphertext.subarray(0, -16);
          const passedTag = ciphertext.subarray(-16);
          const tag = computeTag(xorStream, key, nonce, data, AAD);
          if (!(0, utils_js_1.equalBytes)(passedTag, tag))
            throw new Error("invalid tag");
          output.set(ciphertext.subarray(0, -16));
          xorStream(key, nonce, output, output, 1);
          (0, utils_js_1.clean)(tag);
          return output;
        }
      };
    };
    exports._poly1305_aead = _poly1305_aead;
    exports.chacha20poly1305 = (0, utils_js_1.wrapCipher)({ blockSize: 64, nonceLength: 12, tagLength: 16 }, (0, exports._poly1305_aead)(exports.chacha20));
    exports.xchacha20poly1305 = (0, utils_js_1.wrapCipher)({ blockSize: 64, nonceLength: 24, tagLength: 16 }, (0, exports._poly1305_aead)(exports.xchacha20));
  })(chacha);
  return chacha;
}
var hasRequiredNoble;
function requireNoble() {
  if (hasRequiredNoble) return noble;
  hasRequiredNoble = 1;
  Object.defineProperty(noble, "__esModule", { value: true });
  noble.chacha20 = noble.xchacha20 = void 0;
  var chacha_1 = /* @__PURE__ */ requireChacha();
  var xchacha20 = function(key, nonce, AAD) {
    return (0, chacha_1.xchacha20poly1305)(key, nonce, AAD);
  };
  noble.xchacha20 = xchacha20;
  var chacha20 = function(key, nonce, AAD) {
    return (0, chacha_1.chacha20poly1305)(key, nonce, AAD);
  };
  noble.chacha20 = chacha20;
  return noble;
}
var hasRequiredSymmetric;
function requireSymmetric() {
  if (hasRequiredSymmetric) return symmetric;
  hasRequiredSymmetric = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aesDecrypt = exports.aesEncrypt = exports.symDecrypt = exports.symEncrypt = void 0;
    var utils_1 = /* @__PURE__ */ requireUtils$3();
    var webcrypto_1 = /* @__PURE__ */ requireWebcrypto();
    var aes_1 = requireNoble$1();
    var chacha_1 = requireNoble();
    var config_1 = requireConfig();
    var consts_1 = requireConsts();
    var symEncrypt = function(key, plainText, AAD) {
      return _exec(_encrypt, key, plainText, AAD);
    };
    exports.symEncrypt = symEncrypt;
    var symDecrypt = function(key, cipherText, AAD) {
      return _exec(_decrypt, key, cipherText, AAD);
    };
    exports.symDecrypt = symDecrypt;
    exports.aesEncrypt = exports.symEncrypt;
    exports.aesDecrypt = exports.symDecrypt;
    function _exec(callback, key, data, AAD) {
      var algorithm = (0, config_1.symmetricAlgorithm)();
      if (algorithm === "aes-256-gcm") {
        return callback(aes_1.aes256gcm, key, data, (0, config_1.symmetricNonceLength)(), consts_1.AEAD_TAG_LENGTH, AAD);
      } else if (algorithm === "xchacha20") {
        return callback(chacha_1.xchacha20, key, data, consts_1.XCHACHA20_NONCE_LENGTH, consts_1.AEAD_TAG_LENGTH, AAD);
      } else if (algorithm === "aes-256-cbc") {
        return callback(aes_1.aes256cbc, key, data, 16, 0);
      } else {
        throw new Error("Not implemented");
      }
    }
    function _encrypt(func, key, data, nonceLength, tagLength, AAD) {
      var nonce = (0, webcrypto_1.randomBytes)(nonceLength);
      var cipher = func(key, nonce, AAD);
      var encrypted = cipher.encrypt(data);
      if (tagLength === 0) {
        return (0, utils_1.concatBytes)(nonce, encrypted);
      }
      var cipherTextLength = encrypted.length - tagLength;
      var cipherText = encrypted.subarray(0, cipherTextLength);
      var tag = encrypted.subarray(cipherTextLength);
      return (0, utils_1.concatBytes)(nonce, tag, cipherText);
    }
    function _decrypt(func, key, data, nonceLength, tagLength, AAD) {
      var nonce = data.subarray(0, nonceLength);
      var cipher = func(key, Uint8Array.from(nonce), AAD);
      var encrypted = data.subarray(nonceLength);
      if (tagLength === 0) {
        return cipher.decrypt(encrypted);
      }
      var tag = encrypted.subarray(0, tagLength);
      var cipherText = encrypted.subarray(tagLength);
      return cipher.decrypt((0, utils_1.concatBytes)(cipherText, tag));
    }
  })(symmetric);
  return symmetric;
}
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils$2;
  hasRequiredUtils = 1;
  (function(exports) {
    var __createBinding = utils$2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = utils$2.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireElliptic(), exports);
    __exportStar(requireHash(), exports);
    __exportStar(requireHex(), exports);
    __exportStar(requireSymmetric(), exports);
  })(utils$2);
  return utils$2;
}
var PublicKey = {};
var hasRequiredPublicKey;
function requirePublicKey() {
  if (hasRequiredPublicKey) return PublicKey;
  hasRequiredPublicKey = 1;
  Object.defineProperty(PublicKey, "__esModule", { value: true });
  PublicKey.PublicKey = void 0;
  var utils_1 = /* @__PURE__ */ requireUtils$3();
  var utils_2 = requireUtils();
  var PublicKey$1 = (
    /** @class */
    function() {
      function PublicKey2(data) {
        var compressed = (0, utils_2.convertPublicKeyFormat)(data, true);
        var uncompressed = (0, utils_2.convertPublicKeyFormat)(data, false);
        this.data = compressed;
        this.dataUncompressed = compressed.length !== uncompressed.length ? uncompressed : null;
      }
      PublicKey2.fromHex = function(hex2) {
        return new PublicKey2((0, utils_2.hexToPublicKey)(hex2));
      };
      Object.defineProperty(PublicKey2.prototype, "_uncompressed", {
        get: function() {
          return this.dataUncompressed !== null ? this.dataUncompressed : this.data;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PublicKey2.prototype, "uncompressed", {
        /** @deprecated - use `PublicKey.toBytes(false)` instead. You may also need `Buffer.from`. */
        get: function() {
          return Buffer.from(this._uncompressed);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PublicKey2.prototype, "compressed", {
        /** @deprecated - use `PublicKey.toBytes()` instead. You may also need `Buffer.from`. */
        get: function() {
          return Buffer.from(this.data);
        },
        enumerable: false,
        configurable: true
      });
      PublicKey2.prototype.toBytes = function(compressed) {
        if (compressed === void 0) {
          compressed = true;
        }
        return compressed ? this.data : this._uncompressed;
      };
      PublicKey2.prototype.toHex = function(compressed) {
        if (compressed === void 0) {
          compressed = true;
        }
        return (0, utils_1.bytesToHex)(this.toBytes(compressed));
      };
      PublicKey2.prototype.decapsulate = function(sk, compressed) {
        if (compressed === void 0) {
          compressed = false;
        }
        var senderPoint = this.toBytes(compressed);
        var sharedPoint = sk.multiply(this, compressed);
        return (0, utils_2.getSharedKey)(senderPoint, sharedPoint);
      };
      PublicKey2.prototype.equals = function(other) {
        return (0, utils_1.equalBytes)(this.data, other.data);
      };
      return PublicKey2;
    }()
  );
  PublicKey.PublicKey = PublicKey$1;
  return PublicKey;
}
var hasRequiredPrivateKey;
function requirePrivateKey() {
  if (hasRequiredPrivateKey) return PrivateKey;
  hasRequiredPrivateKey = 1;
  Object.defineProperty(PrivateKey, "__esModule", { value: true });
  PrivateKey.PrivateKey = void 0;
  var utils_1 = /* @__PURE__ */ requireUtils$3();
  var utils_2 = requireUtils();
  var PublicKey_1 = requirePublicKey();
  var PrivateKey$1 = (
    /** @class */
    function() {
      function PrivateKey2(secret) {
        if (secret === void 0) {
          this.data = (0, utils_2.getValidSecret)();
        } else if ((0, utils_2.isValidPrivateKey)(secret)) {
          this.data = secret;
        } else {
          throw new Error("Invalid private key");
        }
        this.publicKey = new PublicKey_1.PublicKey((0, utils_2.getPublicKey)(this.data));
      }
      PrivateKey2.fromHex = function(hex2) {
        return new PrivateKey2((0, utils_2.decodeHex)(hex2));
      };
      Object.defineProperty(PrivateKey2.prototype, "secret", {
        /** @description From version 0.5.0, `Uint8Array` will be returned instead of `Buffer`. */
        get: function() {
          return Buffer.from(this.data);
        },
        enumerable: false,
        configurable: true
      });
      PrivateKey2.prototype.toHex = function() {
        return (0, utils_1.bytesToHex)(this.data);
      };
      PrivateKey2.prototype.encapsulate = function(pk, compressed) {
        if (compressed === void 0) {
          compressed = false;
        }
        var senderPoint = this.publicKey.toBytes(compressed);
        var sharedPoint = this.multiply(pk, compressed);
        return (0, utils_2.getSharedKey)(senderPoint, sharedPoint);
      };
      PrivateKey2.prototype.multiply = function(pk, compressed) {
        if (compressed === void 0) {
          compressed = false;
        }
        return (0, utils_2.getSharedPoint)(this.data, pk.toBytes(true), compressed);
      };
      PrivateKey2.prototype.equals = function(other) {
        return (0, utils_1.equalBytes)(this.data, other.data);
      };
      return PrivateKey2;
    }()
  );
  PrivateKey.PrivateKey = PrivateKey$1;
  return PrivateKey;
}
var hasRequiredKeys;
function requireKeys() {
  if (hasRequiredKeys) return keys;
  hasRequiredKeys = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PublicKey = exports.PrivateKey = void 0;
    var PrivateKey_1 = requirePrivateKey();
    Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function() {
      return PrivateKey_1.PrivateKey;
    } });
    var PublicKey_1 = requirePublicKey();
    Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function() {
      return PublicKey_1.PublicKey;
    } });
  })(keys);
  return keys;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utils = exports.PublicKey = exports.PrivateKey = exports.ECIES_CONFIG = void 0;
    exports.encrypt = encrypt;
    exports.decrypt = decrypt;
    var utils_1 = /* @__PURE__ */ requireUtils$3();
    var config_1 = requireConfig();
    var keys_1 = requireKeys();
    var utils_2 = requireUtils();
    function encrypt(receiverRawPK, data) {
      return Buffer.from(_encrypt(receiverRawPK, data));
    }
    function _encrypt(receiverRawPK, data) {
      var ephemeralSK = new keys_1.PrivateKey();
      var receiverPK = receiverRawPK instanceof Uint8Array ? new keys_1.PublicKey(receiverRawPK) : keys_1.PublicKey.fromHex(receiverRawPK);
      var sharedKey = ephemeralSK.encapsulate(receiverPK, (0, config_1.isHkdfKeyCompressed)());
      var ephemeralPK = ephemeralSK.publicKey.toBytes((0, config_1.isEphemeralKeyCompressed)());
      var encrypted = (0, utils_2.symEncrypt)(sharedKey, data);
      return (0, utils_1.concatBytes)(ephemeralPK, encrypted);
    }
    function decrypt(receiverRawSK, data) {
      return Buffer.from(_decrypt(receiverRawSK, data));
    }
    function _decrypt(receiverRawSK, data) {
      var receiverSK = receiverRawSK instanceof Uint8Array ? new keys_1.PrivateKey(receiverRawSK) : keys_1.PrivateKey.fromHex(receiverRawSK);
      var keySize = (0, config_1.ephemeralKeySize)();
      var ephemeralPK = new keys_1.PublicKey(data.subarray(0, keySize));
      var encrypted = data.subarray(keySize);
      var sharedKey = ephemeralPK.decapsulate(receiverSK, (0, config_1.isHkdfKeyCompressed)());
      return (0, utils_2.symDecrypt)(sharedKey, encrypted);
    }
    var config_2 = requireConfig();
    Object.defineProperty(exports, "ECIES_CONFIG", { enumerable: true, get: function() {
      return config_2.ECIES_CONFIG;
    } });
    var keys_2 = requireKeys();
    Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function() {
      return keys_2.PrivateKey;
    } });
    Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function() {
      return keys_2.PublicKey;
    } });
    exports.utils = {
      // TODO: remove these after 0.5.0
      aesEncrypt: utils_2.aesEncrypt,
      aesDecrypt: utils_2.aesDecrypt,
      symEncrypt: utils_2.symEncrypt,
      symDecrypt: utils_2.symDecrypt,
      decodeHex: utils_2.decodeHex,
      getValidSecret: utils_2.getValidSecret,
      remove0x: utils_2.remove0x
    };
  })(dist);
  return dist;
}
var distExports = requireDist();
globalThis.Buffer = bufferExports.Buffer;
distExports.ECIES_CONFIG.is_ephemeral_key_compressed = false;
const encoder = new TextEncoder();
function setup(pkContainer, contentContainer, encodingTriggerElement, resultContainer) {
  const handleEciesForm = () => {
    let publicKey = distExports.PublicKey.fromHex(pkContainer.value);
    let encrypted = distExports.encrypt(publicKey.toHex(), encoder.encode(contentContainer.value));
    resultContainer.value = bytesToHex(encrypted);
  };
  encodingTriggerElement.addEventListener("submit", () => handleEciesForm());
}
setup(
  document.querySelector("#pk"),
  document.querySelector("#content"),
  document.querySelector("#ecies-form"),
  document.querySelector("#result")
);

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.lino = {})));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var long_1 = createCommonjsModule(function (module) {
	/*
	 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
	 Copyright 2009 The Closure Library Authors. All Rights Reserved.

	 Licensed under the Apache License, Version 2.0 (the "License");
	 you may not use this file except in compliance with the License.
	 You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

	 Unless required by applicable law or agreed to in writing, software
	 distributed under the License is distributed on an "AS-IS" BASIS,
	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 See the License for the specific language governing permissions and
	 limitations under the License.
	 */

	/**
	 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
	 * Released under the Apache License, Version 2.0
	 * see: https://github.com/dcodeIO/long.js for details
	 */
	(function(global, factory) {

	    /* AMD */ if (typeof undefined === 'function' && undefined["amd"])
	        undefined([], factory);
	    /* CommonJS */ else if (typeof commonjsRequire === 'function' && 'object' === "object" && module && module["exports"])
	        module["exports"] = factory();
	    /* Global */ else
	        (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

	})(commonjsGlobal, function() {

	    /**
	     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
	     *  See the from* functions below for more convenient ways of constructing Longs.
	     * @exports Long
	     * @class A Long class for representing a 64 bit two's-complement integer value.
	     * @param {number} low The low (signed) 32 bits of the long
	     * @param {number} high The high (signed) 32 bits of the long
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @constructor
	     */
	    function Long(low, high, unsigned) {

	        /**
	         * The low 32 bits as a signed value.
	         * @type {number}
	         */
	        this.low = low | 0;

	        /**
	         * The high 32 bits as a signed value.
	         * @type {number}
	         */
	        this.high = high | 0;

	        /**
	         * Whether unsigned or not.
	         * @type {boolean}
	         */
	        this.unsigned = !!unsigned;
	    }

	    Object.defineProperty(Long.prototype, "__isLong__", {
	        value: true,
	        enumerable: false,
	        configurable: false
	    });

	    /**
	     * @function
	     * @param {*} obj Object
	     * @returns {boolean}
	     * @inner
	     */
	    function isLong(obj) {
	        return (obj && obj["__isLong__"]) === true;
	    }

	    /**
	     * Tests if the specified object is a Long.
	     * @function
	     * @param {*} obj Object
	     * @returns {boolean}
	     */
	    Long.isLong = isLong;

	    /**
	     * A cache of the Long representations of small integer values.
	     * @type {!Object}
	     * @inner
	     */
	    var INT_CACHE = {};

	    /**
	     * A cache of the Long representations of small unsigned integer values.
	     * @type {!Object}
	     * @inner
	     */
	    var UINT_CACHE = {};

	    /**
	     * @param {number} value
	     * @param {boolean=} unsigned
	     * @returns {!Long}
	     * @inner
	     */
	    function fromInt(value, unsigned) {
	        var obj, cachedObj, cache;
	        if (unsigned) {
	            value >>>= 0;
	            if (cache = (0 <= value && value < 256)) {
	                cachedObj = UINT_CACHE[value];
	                if (cachedObj)
	                    return cachedObj;
	            }
	            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
	            if (cache)
	                UINT_CACHE[value] = obj;
	            return obj;
	        } else {
	            value |= 0;
	            if (cache = (-128 <= value && value < 128)) {
	                cachedObj = INT_CACHE[value];
	                if (cachedObj)
	                    return cachedObj;
	            }
	            obj = fromBits(value, value < 0 ? -1 : 0, false);
	            if (cache)
	                INT_CACHE[value] = obj;
	            return obj;
	        }
	    }

	    /**
	     * Returns a Long representing the given 32 bit integer value.
	     * @function
	     * @param {number} value The 32 bit integer in question
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromInt = fromInt;

	    /**
	     * @param {number} value
	     * @param {boolean=} unsigned
	     * @returns {!Long}
	     * @inner
	     */
	    function fromNumber(value, unsigned) {
	        if (isNaN(value) || !isFinite(value))
	            return unsigned ? UZERO : ZERO;
	        if (unsigned) {
	            if (value < 0)
	                return UZERO;
	            if (value >= TWO_PWR_64_DBL)
	                return MAX_UNSIGNED_VALUE;
	        } else {
	            if (value <= -TWO_PWR_63_DBL)
	                return MIN_VALUE;
	            if (value + 1 >= TWO_PWR_63_DBL)
	                return MAX_VALUE;
	        }
	        if (value < 0)
	            return fromNumber(-value, unsigned).neg();
	        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
	    }

	    /**
	     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
	     * @function
	     * @param {number} value The number in question
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromNumber = fromNumber;

	    /**
	     * @param {number} lowBits
	     * @param {number} highBits
	     * @param {boolean=} unsigned
	     * @returns {!Long}
	     * @inner
	     */
	    function fromBits(lowBits, highBits, unsigned) {
	        return new Long(lowBits, highBits, unsigned);
	    }

	    /**
	     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
	     *  assumed to use 32 bits.
	     * @function
	     * @param {number} lowBits The low 32 bits
	     * @param {number} highBits The high 32 bits
	     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromBits = fromBits;

	    /**
	     * @function
	     * @param {number} base
	     * @param {number} exponent
	     * @returns {number}
	     * @inner
	     */
	    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

	    /**
	     * @param {string} str
	     * @param {(boolean|number)=} unsigned
	     * @param {number=} radix
	     * @returns {!Long}
	     * @inner
	     */
	    function fromString(str, unsigned, radix) {
	        if (str.length === 0)
	            throw Error('empty string');
	        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
	            return ZERO;
	        if (typeof unsigned === 'number') {
	            // For goog.math.long compatibility
	            radix = unsigned,
	            unsigned = false;
	        } else {
	            unsigned = !! unsigned;
	        }
	        radix = radix || 10;
	        if (radix < 2 || 36 < radix)
	            throw RangeError('radix');

	        var p;
	        if ((p = str.indexOf('-')) > 0)
	            throw Error('interior hyphen');
	        else if (p === 0) {
	            return fromString(str.substring(1), unsigned, radix).neg();
	        }

	        // Do several (8) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        var radixToPower = fromNumber(pow_dbl(radix, 8));

	        var result = ZERO;
	        for (var i = 0; i < str.length; i += 8) {
	            var size = Math.min(8, str.length - i),
	                value = parseInt(str.substring(i, i + size), radix);
	            if (size < 8) {
	                var power = fromNumber(pow_dbl(radix, size));
	                result = result.mul(power).add(fromNumber(value));
	            } else {
	                result = result.mul(radixToPower);
	                result = result.add(fromNumber(value));
	            }
	        }
	        result.unsigned = unsigned;
	        return result;
	    }

	    /**
	     * Returns a Long representation of the given string, written using the specified radix.
	     * @function
	     * @param {string} str The textual representation of the Long
	     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
	     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
	     * @returns {!Long} The corresponding Long value
	     */
	    Long.fromString = fromString;

	    /**
	     * @function
	     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
	     * @returns {!Long}
	     * @inner
	     */
	    function fromValue(val) {
	        if (val /* is compatible */ instanceof Long)
	            return val;
	        if (typeof val === 'number')
	            return fromNumber(val);
	        if (typeof val === 'string')
	            return fromString(val);
	        // Throws for non-objects, converts non-instanceof Long:
	        return fromBits(val.low, val.high, val.unsigned);
	    }

	    /**
	     * Converts the specified value to a Long.
	     * @function
	     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
	     * @returns {!Long}
	     */
	    Long.fromValue = fromValue;

	    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
	    // no runtime penalty for these.

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_16_DBL = 1 << 16;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_24_DBL = 1 << 24;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

	    /**
	     * @type {number}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

	    /**
	     * @type {!Long}
	     * @const
	     * @inner
	     */
	    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var ZERO = fromInt(0);

	    /**
	     * Signed zero.
	     * @type {!Long}
	     */
	    Long.ZERO = ZERO;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var UZERO = fromInt(0, true);

	    /**
	     * Unsigned zero.
	     * @type {!Long}
	     */
	    Long.UZERO = UZERO;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var ONE = fromInt(1);

	    /**
	     * Signed one.
	     * @type {!Long}
	     */
	    Long.ONE = ONE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var UONE = fromInt(1, true);

	    /**
	     * Unsigned one.
	     * @type {!Long}
	     */
	    Long.UONE = UONE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var NEG_ONE = fromInt(-1);

	    /**
	     * Signed negative one.
	     * @type {!Long}
	     */
	    Long.NEG_ONE = NEG_ONE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

	    /**
	     * Maximum signed value.
	     * @type {!Long}
	     */
	    Long.MAX_VALUE = MAX_VALUE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

	    /**
	     * Maximum unsigned value.
	     * @type {!Long}
	     */
	    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

	    /**
	     * @type {!Long}
	     * @inner
	     */
	    var MIN_VALUE = fromBits(0, 0x80000000|0, false);

	    /**
	     * Minimum signed value.
	     * @type {!Long}
	     */
	    Long.MIN_VALUE = MIN_VALUE;

	    /**
	     * @alias Long.prototype
	     * @inner
	     */
	    var LongPrototype = Long.prototype;

	    /**
	     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
	     * @returns {number}
	     */
	    LongPrototype.toInt = function toInt() {
	        return this.unsigned ? this.low >>> 0 : this.low;
	    };

	    /**
	     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
	     * @returns {number}
	     */
	    LongPrototype.toNumber = function toNumber() {
	        if (this.unsigned)
	            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
	        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
	    };

	    /**
	     * Converts the Long to a string written in the specified radix.
	     * @param {number=} radix Radix (2-36), defaults to 10
	     * @returns {string}
	     * @override
	     * @throws {RangeError} If `radix` is out of range
	     */
	    LongPrototype.toString = function toString(radix) {
	        radix = radix || 10;
	        if (radix < 2 || 36 < radix)
	            throw RangeError('radix');
	        if (this.isZero())
	            return '0';
	        if (this.isNegative()) { // Unsigned Longs are never negative
	            if (this.eq(MIN_VALUE)) {
	                // We need to change the Long value before it can be negated, so we remove
	                // the bottom-most digit in this base and then recurse to do the rest.
	                var radixLong = fromNumber(radix),
	                    div = this.div(radixLong),
	                    rem1 = div.mul(radixLong).sub(this);
	                return div.toString(radix) + rem1.toInt().toString(radix);
	            } else
	                return '-' + this.neg().toString(radix);
	        }

	        // Do several (6) digits each time through the loop, so as to
	        // minimize the calls to the very expensive emulated div.
	        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
	            rem = this;
	        var result = '';
	        while (true) {
	            var remDiv = rem.div(radixToPower),
	                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
	                digits = intval.toString(radix);
	            rem = remDiv;
	            if (rem.isZero())
	                return digits + result;
	            else {
	                while (digits.length < 6)
	                    digits = '0' + digits;
	                result = '' + digits + result;
	            }
	        }
	    };

	    /**
	     * Gets the high 32 bits as a signed integer.
	     * @returns {number} Signed high bits
	     */
	    LongPrototype.getHighBits = function getHighBits() {
	        return this.high;
	    };

	    /**
	     * Gets the high 32 bits as an unsigned integer.
	     * @returns {number} Unsigned high bits
	     */
	    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
	        return this.high >>> 0;
	    };

	    /**
	     * Gets the low 32 bits as a signed integer.
	     * @returns {number} Signed low bits
	     */
	    LongPrototype.getLowBits = function getLowBits() {
	        return this.low;
	    };

	    /**
	     * Gets the low 32 bits as an unsigned integer.
	     * @returns {number} Unsigned low bits
	     */
	    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
	        return this.low >>> 0;
	    };

	    /**
	     * Gets the number of bits needed to represent the absolute value of this Long.
	     * @returns {number}
	     */
	    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
	        if (this.isNegative()) // Unsigned Longs are never negative
	            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
	        var val = this.high != 0 ? this.high : this.low;
	        for (var bit = 31; bit > 0; bit--)
	            if ((val & (1 << bit)) != 0)
	                break;
	        return this.high != 0 ? bit + 33 : bit + 1;
	    };

	    /**
	     * Tests if this Long's value equals zero.
	     * @returns {boolean}
	     */
	    LongPrototype.isZero = function isZero() {
	        return this.high === 0 && this.low === 0;
	    };

	    /**
	     * Tests if this Long's value is negative.
	     * @returns {boolean}
	     */
	    LongPrototype.isNegative = function isNegative() {
	        return !this.unsigned && this.high < 0;
	    };

	    /**
	     * Tests if this Long's value is positive.
	     * @returns {boolean}
	     */
	    LongPrototype.isPositive = function isPositive() {
	        return this.unsigned || this.high >= 0;
	    };

	    /**
	     * Tests if this Long's value is odd.
	     * @returns {boolean}
	     */
	    LongPrototype.isOdd = function isOdd() {
	        return (this.low & 1) === 1;
	    };

	    /**
	     * Tests if this Long's value is even.
	     * @returns {boolean}
	     */
	    LongPrototype.isEven = function isEven() {
	        return (this.low & 1) === 0;
	    };

	    /**
	     * Tests if this Long's value equals the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.equals = function equals(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
	            return false;
	        return this.high === other.high && this.low === other.low;
	    };

	    /**
	     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.eq = LongPrototype.equals;

	    /**
	     * Tests if this Long's value differs from the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.notEquals = function notEquals(other) {
	        return !this.eq(/* validates */ other);
	    };

	    /**
	     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.neq = LongPrototype.notEquals;

	    /**
	     * Tests if this Long's value is less than the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lessThan = function lessThan(other) {
	        return this.comp(/* validates */ other) < 0;
	    };

	    /**
	     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lt = LongPrototype.lessThan;

	    /**
	     * Tests if this Long's value is less than or equal the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
	        return this.comp(/* validates */ other) <= 0;
	    };

	    /**
	     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.lte = LongPrototype.lessThanOrEqual;

	    /**
	     * Tests if this Long's value is greater than the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.greaterThan = function greaterThan(other) {
	        return this.comp(/* validates */ other) > 0;
	    };

	    /**
	     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.gt = LongPrototype.greaterThan;

	    /**
	     * Tests if this Long's value is greater than or equal the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
	        return this.comp(/* validates */ other) >= 0;
	    };

	    /**
	     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {boolean}
	     */
	    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

	    /**
	     * Compares this Long's value with the specified's.
	     * @param {!Long|number|string} other Other value
	     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
	     *  if the given one is greater
	     */
	    LongPrototype.compare = function compare(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        if (this.eq(other))
	            return 0;
	        var thisNeg = this.isNegative(),
	            otherNeg = other.isNegative();
	        if (thisNeg && !otherNeg)
	            return -1;
	        if (!thisNeg && otherNeg)
	            return 1;
	        // At this point the sign bits are the same
	        if (!this.unsigned)
	            return this.sub(other).isNegative() ? -1 : 1;
	        // Both are positive if at least one is unsigned
	        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
	    };

	    /**
	     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
	     * @function
	     * @param {!Long|number|string} other Other value
	     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
	     *  if the given one is greater
	     */
	    LongPrototype.comp = LongPrototype.compare;

	    /**
	     * Negates this Long's value.
	     * @returns {!Long} Negated Long
	     */
	    LongPrototype.negate = function negate() {
	        if (!this.unsigned && this.eq(MIN_VALUE))
	            return MIN_VALUE;
	        return this.not().add(ONE);
	    };

	    /**
	     * Negates this Long's value. This is an alias of {@link Long#negate}.
	     * @function
	     * @returns {!Long} Negated Long
	     */
	    LongPrototype.neg = LongPrototype.negate;

	    /**
	     * Returns the sum of this and the specified Long.
	     * @param {!Long|number|string} addend Addend
	     * @returns {!Long} Sum
	     */
	    LongPrototype.add = function add(addend) {
	        if (!isLong(addend))
	            addend = fromValue(addend);

	        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

	        var a48 = this.high >>> 16;
	        var a32 = this.high & 0xFFFF;
	        var a16 = this.low >>> 16;
	        var a00 = this.low & 0xFFFF;

	        var b48 = addend.high >>> 16;
	        var b32 = addend.high & 0xFFFF;
	        var b16 = addend.low >>> 16;
	        var b00 = addend.low & 0xFFFF;

	        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
	        c00 += a00 + b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xFFFF;
	        c16 += a16 + b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xFFFF;
	        c32 += a32 + b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c48 += a48 + b48;
	        c48 &= 0xFFFF;
	        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
	    };

	    /**
	     * Returns the difference of this and the specified Long.
	     * @param {!Long|number|string} subtrahend Subtrahend
	     * @returns {!Long} Difference
	     */
	    LongPrototype.subtract = function subtract(subtrahend) {
	        if (!isLong(subtrahend))
	            subtrahend = fromValue(subtrahend);
	        return this.add(subtrahend.neg());
	    };

	    /**
	     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
	     * @function
	     * @param {!Long|number|string} subtrahend Subtrahend
	     * @returns {!Long} Difference
	     */
	    LongPrototype.sub = LongPrototype.subtract;

	    /**
	     * Returns the product of this and the specified Long.
	     * @param {!Long|number|string} multiplier Multiplier
	     * @returns {!Long} Product
	     */
	    LongPrototype.multiply = function multiply(multiplier) {
	        if (this.isZero())
	            return ZERO;
	        if (!isLong(multiplier))
	            multiplier = fromValue(multiplier);
	        if (multiplier.isZero())
	            return ZERO;
	        if (this.eq(MIN_VALUE))
	            return multiplier.isOdd() ? MIN_VALUE : ZERO;
	        if (multiplier.eq(MIN_VALUE))
	            return this.isOdd() ? MIN_VALUE : ZERO;

	        if (this.isNegative()) {
	            if (multiplier.isNegative())
	                return this.neg().mul(multiplier.neg());
	            else
	                return this.neg().mul(multiplier).neg();
	        } else if (multiplier.isNegative())
	            return this.mul(multiplier.neg()).neg();

	        // If both longs are small, use float multiplication
	        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
	            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

	        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
	        // We can skip products that would overflow.

	        var a48 = this.high >>> 16;
	        var a32 = this.high & 0xFFFF;
	        var a16 = this.low >>> 16;
	        var a00 = this.low & 0xFFFF;

	        var b48 = multiplier.high >>> 16;
	        var b32 = multiplier.high & 0xFFFF;
	        var b16 = multiplier.low >>> 16;
	        var b00 = multiplier.low & 0xFFFF;

	        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
	        c00 += a00 * b00;
	        c16 += c00 >>> 16;
	        c00 &= 0xFFFF;
	        c16 += a16 * b00;
	        c32 += c16 >>> 16;
	        c16 &= 0xFFFF;
	        c16 += a00 * b16;
	        c32 += c16 >>> 16;
	        c16 &= 0xFFFF;
	        c32 += a32 * b00;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c32 += a16 * b16;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c32 += a00 * b32;
	        c48 += c32 >>> 16;
	        c32 &= 0xFFFF;
	        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
	        c48 &= 0xFFFF;
	        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
	    };

	    /**
	     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
	     * @function
	     * @param {!Long|number|string} multiplier Multiplier
	     * @returns {!Long} Product
	     */
	    LongPrototype.mul = LongPrototype.multiply;

	    /**
	     * Returns this Long divided by the specified. The result is signed if this Long is signed or
	     *  unsigned if this Long is unsigned.
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Quotient
	     */
	    LongPrototype.divide = function divide(divisor) {
	        if (!isLong(divisor))
	            divisor = fromValue(divisor);
	        if (divisor.isZero())
	            throw Error('division by zero');
	        if (this.isZero())
	            return this.unsigned ? UZERO : ZERO;
	        var approx, rem, res;
	        if (!this.unsigned) {
	            // This section is only relevant for signed longs and is derived from the
	            // closure library as a whole.
	            if (this.eq(MIN_VALUE)) {
	                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
	                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
	                else if (divisor.eq(MIN_VALUE))
	                    return ONE;
	                else {
	                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
	                    var halfThis = this.shr(1);
	                    approx = halfThis.div(divisor).shl(1);
	                    if (approx.eq(ZERO)) {
	                        return divisor.isNegative() ? ONE : NEG_ONE;
	                    } else {
	                        rem = this.sub(divisor.mul(approx));
	                        res = approx.add(rem.div(divisor));
	                        return res;
	                    }
	                }
	            } else if (divisor.eq(MIN_VALUE))
	                return this.unsigned ? UZERO : ZERO;
	            if (this.isNegative()) {
	                if (divisor.isNegative())
	                    return this.neg().div(divisor.neg());
	                return this.neg().div(divisor).neg();
	            } else if (divisor.isNegative())
	                return this.div(divisor.neg()).neg();
	            res = ZERO;
	        } else {
	            // The algorithm below has not been made for unsigned longs. It's therefore
	            // required to take special care of the MSB prior to running it.
	            if (!divisor.unsigned)
	                divisor = divisor.toUnsigned();
	            if (divisor.gt(this))
	                return UZERO;
	            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
	                return UONE;
	            res = UZERO;
	        }

	        // Repeat the following until the remainder is less than other:  find a
	        // floating-point that approximates remainder / other *from below*, add this
	        // into the result, and subtract it from the remainder.  It is critical that
	        // the approximate value is less than or equal to the real value so that the
	        // remainder never becomes negative.
	        rem = this;
	        while (rem.gte(divisor)) {
	            // Approximate the result of division. This may be a little greater or
	            // smaller than the actual value.
	            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

	            // We will tweak the approximate result by changing it in the 48-th digit or
	            // the smallest non-fractional digit, whichever is larger.
	            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
	                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

	            // Decrease the approximation until it is smaller than the remainder.  Note
	            // that if it is too large, the product overflows and is negative.
	                approxRes = fromNumber(approx),
	                approxRem = approxRes.mul(divisor);
	            while (approxRem.isNegative() || approxRem.gt(rem)) {
	                approx -= delta;
	                approxRes = fromNumber(approx, this.unsigned);
	                approxRem = approxRes.mul(divisor);
	            }

	            // We know the answer can't be zero... and actually, zero would cause
	            // infinite recursion since we would make no progress.
	            if (approxRes.isZero())
	                approxRes = ONE;

	            res = res.add(approxRes);
	            rem = rem.sub(approxRem);
	        }
	        return res;
	    };

	    /**
	     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
	     * @function
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Quotient
	     */
	    LongPrototype.div = LongPrototype.divide;

	    /**
	     * Returns this Long modulo the specified.
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Remainder
	     */
	    LongPrototype.modulo = function modulo(divisor) {
	        if (!isLong(divisor))
	            divisor = fromValue(divisor);
	        return this.sub(this.div(divisor).mul(divisor));
	    };

	    /**
	     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
	     * @function
	     * @param {!Long|number|string} divisor Divisor
	     * @returns {!Long} Remainder
	     */
	    LongPrototype.mod = LongPrototype.modulo;

	    /**
	     * Returns the bitwise NOT of this Long.
	     * @returns {!Long}
	     */
	    LongPrototype.not = function not() {
	        return fromBits(~this.low, ~this.high, this.unsigned);
	    };

	    /**
	     * Returns the bitwise AND of this Long and the specified.
	     * @param {!Long|number|string} other Other Long
	     * @returns {!Long}
	     */
	    LongPrototype.and = function and(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
	    };

	    /**
	     * Returns the bitwise OR of this Long and the specified.
	     * @param {!Long|number|string} other Other Long
	     * @returns {!Long}
	     */
	    LongPrototype.or = function or(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
	    };

	    /**
	     * Returns the bitwise XOR of this Long and the given one.
	     * @param {!Long|number|string} other Other Long
	     * @returns {!Long}
	     */
	    LongPrototype.xor = function xor(other) {
	        if (!isLong(other))
	            other = fromValue(other);
	        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
	    };

	    /**
	     * Returns this Long with bits shifted to the left by the given amount.
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shiftLeft = function shiftLeft(numBits) {
	        if (isLong(numBits))
	            numBits = numBits.toInt();
	        if ((numBits &= 63) === 0)
	            return this;
	        else if (numBits < 32)
	            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
	        else
	            return fromBits(0, this.low << (numBits - 32), this.unsigned);
	    };

	    /**
	     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
	     * @function
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shl = LongPrototype.shiftLeft;

	    /**
	     * Returns this Long with bits arithmetically shifted to the right by the given amount.
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shiftRight = function shiftRight(numBits) {
	        if (isLong(numBits))
	            numBits = numBits.toInt();
	        if ((numBits &= 63) === 0)
	            return this;
	        else if (numBits < 32)
	            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
	        else
	            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
	    };

	    /**
	     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
	     * @function
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shr = LongPrototype.shiftRight;

	    /**
	     * Returns this Long with bits logically shifted to the right by the given amount.
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
	        if (isLong(numBits))
	            numBits = numBits.toInt();
	        numBits &= 63;
	        if (numBits === 0)
	            return this;
	        else {
	            var high = this.high;
	            if (numBits < 32) {
	                var low = this.low;
	                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
	            } else if (numBits === 32)
	                return fromBits(high, 0, this.unsigned);
	            else
	                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
	        }
	    };

	    /**
	     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
	     * @function
	     * @param {number|!Long} numBits Number of bits
	     * @returns {!Long} Shifted Long
	     */
	    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

	    /**
	     * Converts this Long to signed.
	     * @returns {!Long} Signed long
	     */
	    LongPrototype.toSigned = function toSigned() {
	        if (!this.unsigned)
	            return this;
	        return fromBits(this.low, this.high, false);
	    };

	    /**
	     * Converts this Long to unsigned.
	     * @returns {!Long} Unsigned long
	     */
	    LongPrototype.toUnsigned = function toUnsigned() {
	        if (this.unsigned)
	            return this;
	        return fromBits(this.low, this.high, true);
	    };

	    /**
	     * Converts this Long to its byte representation.
	     * @param {boolean=} le Whether little or big endian, defaults to big endian
	     * @returns {!Array.<number>} Byte representation
	     */
	    LongPrototype.toBytes = function(le) {
	        return le ? this.toBytesLE() : this.toBytesBE();
	    };

	    /**
	     * Converts this Long to its little endian byte representation.
	     * @returns {!Array.<number>} Little endian byte representation
	     */
	    LongPrototype.toBytesLE = function() {
	        var hi = this.high,
	            lo = this.low;
	        return [
	             lo         & 0xff,
	            (lo >>>  8) & 0xff,
	            (lo >>> 16) & 0xff,
	            (lo >>> 24) & 0xff,
	             hi         & 0xff,
	            (hi >>>  8) & 0xff,
	            (hi >>> 16) & 0xff,
	            (hi >>> 24) & 0xff
	        ];
	    };

	    /**
	     * Converts this Long to its big endian byte representation.
	     * @returns {!Array.<number>} Big endian byte representation
	     */
	    LongPrototype.toBytesBE = function() {
	        var hi = this.high,
	            lo = this.low;
	        return [
	            (hi >>> 24) & 0xff,
	            (hi >>> 16) & 0xff,
	            (hi >>>  8) & 0xff,
	             hi         & 0xff,
	            (lo >>> 24) & 0xff,
	            (lo >>> 16) & 0xff,
	            (lo >>>  8) & 0xff,
	             lo         & 0xff
	        ];
	    };

	    return Long;
	});
	});

	var bytebuffer = createCommonjsModule(function (module) {
	/*
	 Copyright 2013-2014 Daniel Wirtz <dcode@dcode.io>

	 Licensed under the Apache License, Version 2.0 (the "License");
	 you may not use this file except in compliance with the License.
	 You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

	 Unless required by applicable law or agreed to in writing, software
	 distributed under the License is distributed on an "AS IS" BASIS,
	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 See the License for the specific language governing permissions and
	 limitations under the License.
	 */

	/**
	 * @license bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
	 * Backing buffer: ArrayBuffer, Accessor: Uint8Array
	 * Released under the Apache License, Version 2.0
	 * see: https://github.com/dcodeIO/bytebuffer.js for details
	 */
	(function(global, factory) {

	    /* AMD */ if (typeof undefined === 'function' && undefined["amd"])
	        undefined(["long"], factory);
	    /* CommonJS */ else if (typeof commonjsRequire === 'function' && 'object' === "object" && module && module["exports"])
	        module['exports'] = (function() {
	            var Long; try { Long = long_1; } catch (e) {}
	            return factory(Long);
	        })();
	    /* Global */ else
	        (global["dcodeIO"] = global["dcodeIO"] || {})["ByteBuffer"] = factory(global["dcodeIO"]["Long"]);

	})(commonjsGlobal, function(Long) {

	    /**
	     * Constructs a new ByteBuffer.
	     * @class The swiss army knife for binary data in JavaScript.
	     * @exports ByteBuffer
	     * @constructor
	     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @expose
	     */
	    var ByteBuffer = function(capacity, littleEndian, noAssert) {
	        if (typeof capacity === 'undefined')
	            capacity = ByteBuffer.DEFAULT_CAPACITY;
	        if (typeof littleEndian === 'undefined')
	            littleEndian = ByteBuffer.DEFAULT_ENDIAN;
	        if (typeof noAssert === 'undefined')
	            noAssert = ByteBuffer.DEFAULT_NOASSERT;
	        if (!noAssert) {
	            capacity = capacity | 0;
	            if (capacity < 0)
	                throw RangeError("Illegal capacity");
	            littleEndian = !!littleEndian;
	            noAssert = !!noAssert;
	        }

	        /**
	         * Backing ArrayBuffer.
	         * @type {!ArrayBuffer}
	         * @expose
	         */
	        this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity);

	        /**
	         * Uint8Array utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.
	         * @type {?Uint8Array}
	         * @expose
	         */
	        this.view = capacity === 0 ? null : new Uint8Array(this.buffer);

	        /**
	         * Absolute read/write offset.
	         * @type {number}
	         * @expose
	         * @see ByteBuffer#flip
	         * @see ByteBuffer#clear
	         */
	        this.offset = 0;

	        /**
	         * Marked offset.
	         * @type {number}
	         * @expose
	         * @see ByteBuffer#mark
	         * @see ByteBuffer#reset
	         */
	        this.markedOffset = -1;

	        /**
	         * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.
	         * @type {number}
	         * @expose
	         * @see ByteBuffer#flip
	         * @see ByteBuffer#clear
	         */
	        this.limit = capacity;

	        /**
	         * Whether to use little endian byte order, defaults to `false` for big endian.
	         * @type {boolean}
	         * @expose
	         */
	        this.littleEndian = littleEndian;

	        /**
	         * Whether to skip assertions of offsets and values, defaults to `false`.
	         * @type {boolean}
	         * @expose
	         */
	        this.noAssert = noAssert;
	    };

	    /**
	     * ByteBuffer version.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ByteBuffer.VERSION = "5.0.1";

	    /**
	     * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.
	     * @type {boolean}
	     * @const
	     * @expose
	     */
	    ByteBuffer.LITTLE_ENDIAN = true;

	    /**
	     * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.
	     * @type {boolean}
	     * @const
	     * @expose
	     */
	    ByteBuffer.BIG_ENDIAN = false;

	    /**
	     * Default initial capacity of `16`.
	     * @type {number}
	     * @expose
	     */
	    ByteBuffer.DEFAULT_CAPACITY = 16;

	    /**
	     * Default endianess of `false` for big endian.
	     * @type {boolean}
	     * @expose
	     */
	    ByteBuffer.DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN;

	    /**
	     * Default no assertions flag of `false`.
	     * @type {boolean}
	     * @expose
	     */
	    ByteBuffer.DEFAULT_NOASSERT = false;

	    /**
	     * A `Long` class for representing a 64-bit two's-complement integer value. May be `null` if Long.js has not been loaded
	     *  and int64 support is not available.
	     * @type {?Long}
	     * @const
	     * @see https://github.com/dcodeIO/long.js
	     * @expose
	     */
	    ByteBuffer.Long = Long || null;

	    /**
	     * @alias ByteBuffer.prototype
	     * @inner
	     */
	    var ByteBufferPrototype = ByteBuffer.prototype;

	    Object.defineProperty(ByteBufferPrototype, "__isByteBuffer__", {
	        value: true,
	        enumerable: false,
	        configurable: false
	    });

	    // helpers

	    /**
	     * @type {!ArrayBuffer}
	     * @inner
	     */
	    var EMPTY_BUFFER = new ArrayBuffer(0);

	    /**
	     * String.fromCharCode reference for compile-time renaming.
	     * @type {function(...number):string}
	     * @inner
	     */
	    var stringFromCharCode = String.fromCharCode;

	    /**
	     * Creates a source function for a string.
	     * @param {string} s String to read from
	     * @returns {function():number|null} Source function returning the next char code respectively `null` if there are
	     *  no more characters left.
	     * @throws {TypeError} If the argument is invalid
	     * @inner
	     */
	    function stringSource(s) {
	        var i=0; return function() {
	            return i < s.length ? s.charCodeAt(i++) : null;
	        };
	    }

	    /**
	     * Creates a destination function for a string.
	     * @returns {function(number=):undefined|string} Destination function successively called with the next char code.
	     *  Returns the final string when called without arguments.
	     * @inner
	     */
	    function stringDestination() {
	        var cs = [], ps = []; return function() {
	            if (arguments.length === 0)
	                return ps.join('')+stringFromCharCode.apply(String, cs);
	            if (cs.length + arguments.length > 1024)
	                ps.push(stringFromCharCode.apply(String, cs)),
	                    cs.length = 0;
	            Array.prototype.push.apply(cs, arguments);
	        };
	    }

	    /**
	     * Gets the accessor type.
	     * @returns {Function} `Buffer` under node.js, `Uint8Array` respectively `DataView` in the browser (classes)
	     * @expose
	     */
	    ByteBuffer.accessor = function() {
	        return Uint8Array;
	    };
	    /**
	     * Allocates a new ByteBuffer backed by a buffer of the specified capacity.
	     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer}
	     * @expose
	     */
	    ByteBuffer.allocate = function(capacity, littleEndian, noAssert) {
	        return new ByteBuffer(capacity, littleEndian, noAssert);
	    };

	    /**
	     * Concatenates multiple ByteBuffers into one.
	     * @param {!Array.<!ByteBuffer|!ArrayBuffer|!Uint8Array|string>} buffers Buffers to concatenate
	     * @param {(string|boolean)=} encoding String encoding if `buffers` contains a string ("base64", "hex", "binary",
	     *  defaults to "utf8")
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order for the resulting ByteBuffer. Defaults
	     *  to {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values for the resulting ByteBuffer. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} Concatenated ByteBuffer
	     * @expose
	     */
	    ByteBuffer.concat = function(buffers, encoding, littleEndian, noAssert) {
	        if (typeof encoding === 'boolean' || typeof encoding !== 'string') {
	            noAssert = littleEndian;
	            littleEndian = encoding;
	            encoding = undefined;
	        }
	        var capacity = 0;
	        for (var i=0, k=buffers.length, length; i<k; ++i) {
	            if (!ByteBuffer.isByteBuffer(buffers[i]))
	                buffers[i] = ByteBuffer.wrap(buffers[i], encoding);
	            length = buffers[i].limit - buffers[i].offset;
	            if (length > 0) capacity += length;
	        }
	        if (capacity === 0)
	            return new ByteBuffer(0, littleEndian, noAssert);
	        var bb = new ByteBuffer(capacity, littleEndian, noAssert),
	            bi;
	        i=0; while (i<k) {
	            bi = buffers[i++];
	            length = bi.limit - bi.offset;
	            if (length <= 0) continue;
	            bb.view.set(bi.view.subarray(bi.offset, bi.limit), bb.offset);
	            bb.offset += length;
	        }
	        bb.limit = bb.offset;
	        bb.offset = 0;
	        return bb;
	    };

	    /**
	     * Tests if the specified type is a ByteBuffer.
	     * @param {*} bb ByteBuffer to test
	     * @returns {boolean} `true` if it is a ByteBuffer, otherwise `false`
	     * @expose
	     */
	    ByteBuffer.isByteBuffer = function(bb) {
	        return (bb && bb["__isByteBuffer__"]) === true;
	    };
	    /**
	     * Gets the backing buffer type.
	     * @returns {Function} `Buffer` under node.js, `ArrayBuffer` in the browser (classes)
	     * @expose
	     */
	    ByteBuffer.type = function() {
	        return ArrayBuffer;
	    };
	    /**
	     * Wraps a buffer or a string. Sets the allocated ByteBuffer's {@link ByteBuffer#offset} to `0` and its
	     *  {@link ByteBuffer#limit} to the length of the wrapped data.
	     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string|!Array.<number>} buffer Anything that can be wrapped
	     * @param {(string|boolean)=} encoding String encoding if `buffer` is a string ("base64", "hex", "binary", defaults to
	     *  "utf8")
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} A ByteBuffer wrapping `buffer`
	     * @expose
	     */
	    ByteBuffer.wrap = function(buffer, encoding, littleEndian, noAssert) {
	        if (typeof encoding !== 'string') {
	            noAssert = littleEndian;
	            littleEndian = encoding;
	            encoding = undefined;
	        }
	        if (typeof buffer === 'string') {
	            if (typeof encoding === 'undefined')
	                encoding = "utf8";
	            switch (encoding) {
	                case "base64":
	                    return ByteBuffer.fromBase64(buffer, littleEndian);
	                case "hex":
	                    return ByteBuffer.fromHex(buffer, littleEndian);
	                case "binary":
	                    return ByteBuffer.fromBinary(buffer, littleEndian);
	                case "utf8":
	                    return ByteBuffer.fromUTF8(buffer, littleEndian);
	                case "debug":
	                    return ByteBuffer.fromDebug(buffer, littleEndian);
	                default:
	                    throw Error("Unsupported encoding: "+encoding);
	            }
	        }
	        if (buffer === null || typeof buffer !== 'object')
	            throw TypeError("Illegal buffer");
	        var bb;
	        if (ByteBuffer.isByteBuffer(buffer)) {
	            bb = ByteBufferPrototype.clone.call(buffer);
	            bb.markedOffset = -1;
	            return bb;
	        }
	        if (buffer instanceof Uint8Array) { // Extract ArrayBuffer from Uint8Array
	            bb = new ByteBuffer(0, littleEndian, noAssert);
	            if (buffer.length > 0) { // Avoid references to more than one EMPTY_BUFFER
	                bb.buffer = buffer.buffer;
	                bb.offset = buffer.byteOffset;
	                bb.limit = buffer.byteOffset + buffer.byteLength;
	                bb.view = new Uint8Array(buffer.buffer);
	            }
	        } else if (buffer instanceof ArrayBuffer) { // Reuse ArrayBuffer
	            bb = new ByteBuffer(0, littleEndian, noAssert);
	            if (buffer.byteLength > 0) {
	                bb.buffer = buffer;
	                bb.offset = 0;
	                bb.limit = buffer.byteLength;
	                bb.view = buffer.byteLength > 0 ? new Uint8Array(buffer) : null;
	            }
	        } else if (Object.prototype.toString.call(buffer) === "[object Array]") { // Create from octets
	            bb = new ByteBuffer(buffer.length, littleEndian, noAssert);
	            bb.limit = buffer.length;
	            for (var i=0; i<buffer.length; ++i)
	                bb.view[i] = buffer[i];
	        } else
	            throw TypeError("Illegal buffer"); // Otherwise fail
	        return bb;
	    };

	    /**
	     * Writes the array as a bitset.
	     * @param {Array<boolean>} value Array of booleans to write
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
	     * @returns {!ByteBuffer}
	     * @expose
	     */
	    ByteBufferPrototype.writeBitSet = function(value, offset) {
	      var relative = typeof offset === 'undefined';
	      if (relative) offset = this.offset;
	      if (!this.noAssert) {
	        if (!(value instanceof Array))
	          throw TypeError("Illegal BitSet: Not an array");
	        if (typeof offset !== 'number' || offset % 1 !== 0)
	            throw TypeError("Illegal offset: "+offset+" (not an integer)");
	        offset >>>= 0;
	        if (offset < 0 || offset + 0 > this.buffer.byteLength)
	            throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	      }

	      var start = offset,
	          bits = value.length,
	          bytes = (bits >> 3),
	          bit = 0,
	          k;

	      offset += this.writeVarint32(bits,offset);

	      while(bytes--) {
	        k = (!!value[bit++] & 1) |
	            ((!!value[bit++] & 1) << 1) |
	            ((!!value[bit++] & 1) << 2) |
	            ((!!value[bit++] & 1) << 3) |
	            ((!!value[bit++] & 1) << 4) |
	            ((!!value[bit++] & 1) << 5) |
	            ((!!value[bit++] & 1) << 6) |
	            ((!!value[bit++] & 1) << 7);
	        this.writeByte(k,offset++);
	      }

	      if(bit < bits) {
	        var m = 0; k = 0;
	        while(bit < bits) k = k | ((!!value[bit++] & 1) << (m++));
	        this.writeByte(k,offset++);
	      }

	      if (relative) {
	        this.offset = offset;
	        return this;
	      }
	      return offset - start;
	    };

	    /**
	     * Reads a BitSet as an array of booleans.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
	     * @returns {Array<boolean>
	     * @expose
	     */
	    ByteBufferPrototype.readBitSet = function(offset) {
	      var relative = typeof offset === 'undefined';
	      if (relative) offset = this.offset;

	      var ret = this.readVarint32(offset),
	          bits = ret.value,
	          bytes = (bits >> 3),
	          bit = 0,
	          value = [],
	          k;

	      offset += ret.length;

	      while(bytes--) {
	        k = this.readByte(offset++);
	        value[bit++] = !!(k & 0x01);
	        value[bit++] = !!(k & 0x02);
	        value[bit++] = !!(k & 0x04);
	        value[bit++] = !!(k & 0x08);
	        value[bit++] = !!(k & 0x10);
	        value[bit++] = !!(k & 0x20);
	        value[bit++] = !!(k & 0x40);
	        value[bit++] = !!(k & 0x80);
	      }

	      if(bit < bits) {
	        var m = 0;
	        k = this.readByte(offset++);
	        while(bit < bits) value[bit++] = !!((k >> (m++)) & 1);
	      }

	      if (relative) {
	        this.offset = offset;
	      }
	      return value;
	    };
	    /**
	     * Reads the specified number of bytes.
	     * @param {number} length Number of bytes to read
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
	     * @returns {!ByteBuffer}
	     * @expose
	     */
	    ByteBufferPrototype.readBytes = function(length, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + length > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
	        }
	        var slice = this.slice(offset, offset + length);
	        if (relative) this.offset += length;
	        return slice;
	    };

	    /**
	     * Writes a payload of bytes. This is an alias of {@link ByteBuffer#append}.
	     * @function
	     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to write. If `source` is a ByteBuffer, its offsets
	     *  will be modified according to the performed read operation.
	     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeBytes = ByteBufferPrototype.append;

	    // types/ints/int8

	    /**
	     * Writes an 8bit signed integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeInt8 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 1;
	        var capacity0 = this.buffer.byteLength;
	        if (offset > capacity0)
	            this.resize((capacity0 *= 2) > offset ? capacity0 : offset);
	        offset -= 1;
	        this.view[offset] = value;
	        if (relative) this.offset += 1;
	        return this;
	    };

	    /**
	     * Writes an 8bit signed integer. This is an alias of {@link ByteBuffer#writeInt8}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeByte = ByteBufferPrototype.writeInt8;

	    /**
	     * Reads an 8bit signed integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readInt8 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var value = this.view[offset];
	        if ((value & 0x80) === 0x80) value = -(0xFF - value + 1); // Cast to signed
	        if (relative) this.offset += 1;
	        return value;
	    };

	    /**
	     * Reads an 8bit signed integer. This is an alias of {@link ByteBuffer#readInt8}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readByte = ByteBufferPrototype.readInt8;

	    /**
	     * Writes an 8bit unsigned integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeUint8 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value >>>= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 1;
	        var capacity1 = this.buffer.byteLength;
	        if (offset > capacity1)
	            this.resize((capacity1 *= 2) > offset ? capacity1 : offset);
	        offset -= 1;
	        this.view[offset] = value;
	        if (relative) this.offset += 1;
	        return this;
	    };

	    /**
	     * Writes an 8bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint8}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeUInt8 = ByteBufferPrototype.writeUint8;

	    /**
	     * Reads an 8bit unsigned integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUint8 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var value = this.view[offset];
	        if (relative) this.offset += 1;
	        return value;
	    };

	    /**
	     * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUInt8 = ByteBufferPrototype.readUint8;

	    // types/ints/int16

	    /**
	     * Writes a 16bit signed integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeInt16 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 2;
	        var capacity2 = this.buffer.byteLength;
	        if (offset > capacity2)
	            this.resize((capacity2 *= 2) > offset ? capacity2 : offset);
	        offset -= 2;
	        if (this.littleEndian) {
	            this.view[offset+1] = (value & 0xFF00) >>> 8;
	            this.view[offset  ] =  value & 0x00FF;
	        } else {
	            this.view[offset]   = (value & 0xFF00) >>> 8;
	            this.view[offset+1] =  value & 0x00FF;
	        }
	        if (relative) this.offset += 2;
	        return this;
	    };

	    /**
	     * Writes a 16bit signed integer. This is an alias of {@link ByteBuffer#writeInt16}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeShort = ByteBufferPrototype.writeInt16;

	    /**
	     * Reads a 16bit signed integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readInt16 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 2 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset  ];
	            value |= this.view[offset+1] << 8;
	        } else {
	            value  = this.view[offset  ] << 8;
	            value |= this.view[offset+1];
	        }
	        if ((value & 0x8000) === 0x8000) value = -(0xFFFF - value + 1); // Cast to signed
	        if (relative) this.offset += 2;
	        return value;
	    };

	    /**
	     * Reads a 16bit signed integer. This is an alias of {@link ByteBuffer#readInt16}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readShort = ByteBufferPrototype.readInt16;

	    /**
	     * Writes a 16bit unsigned integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeUint16 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value >>>= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 2;
	        var capacity3 = this.buffer.byteLength;
	        if (offset > capacity3)
	            this.resize((capacity3 *= 2) > offset ? capacity3 : offset);
	        offset -= 2;
	        if (this.littleEndian) {
	            this.view[offset+1] = (value & 0xFF00) >>> 8;
	            this.view[offset  ] =  value & 0x00FF;
	        } else {
	            this.view[offset]   = (value & 0xFF00) >>> 8;
	            this.view[offset+1] =  value & 0x00FF;
	        }
	        if (relative) this.offset += 2;
	        return this;
	    };

	    /**
	     * Writes a 16bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint16}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @throws {TypeError} If `offset` or `value` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.writeUInt16 = ByteBufferPrototype.writeUint16;

	    /**
	     * Reads a 16bit unsigned integer.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readUint16 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 2 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+2+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset  ];
	            value |= this.view[offset+1] << 8;
	        } else {
	            value  = this.view[offset  ] << 8;
	            value |= this.view[offset+1];
	        }
	        if (relative) this.offset += 2;
	        return value;
	    };

	    /**
	     * Reads a 16bit unsigned integer. This is an alias of {@link ByteBuffer#readUint16}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
	     * @returns {number} Value read
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.readUInt16 = ByteBufferPrototype.readUint16;

	    // types/ints/int32

	    /**
	     * Writes a 32bit signed integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeInt32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 4;
	        var capacity4 = this.buffer.byteLength;
	        if (offset > capacity4)
	            this.resize((capacity4 *= 2) > offset ? capacity4 : offset);
	        offset -= 4;
	        if (this.littleEndian) {
	            this.view[offset+3] = (value >>> 24) & 0xFF;
	            this.view[offset+2] = (value >>> 16) & 0xFF;
	            this.view[offset+1] = (value >>>  8) & 0xFF;
	            this.view[offset  ] =  value         & 0xFF;
	        } else {
	            this.view[offset  ] = (value >>> 24) & 0xFF;
	            this.view[offset+1] = (value >>> 16) & 0xFF;
	            this.view[offset+2] = (value >>>  8) & 0xFF;
	            this.view[offset+3] =  value         & 0xFF;
	        }
	        if (relative) this.offset += 4;
	        return this;
	    };

	    /**
	     * Writes a 32bit signed integer. This is an alias of {@link ByteBuffer#writeInt32}.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeInt = ByteBufferPrototype.writeInt32;

	    /**
	     * Reads a 32bit signed integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readInt32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset+2] << 16;
	            value |= this.view[offset+1] <<  8;
	            value |= this.view[offset  ];
	            value += this.view[offset+3] << 24 >>> 0;
	        } else {
	            value  = this.view[offset+1] << 16;
	            value |= this.view[offset+2] <<  8;
	            value |= this.view[offset+3];
	            value += this.view[offset  ] << 24 >>> 0;
	        }
	        value |= 0; // Cast to signed
	        if (relative) this.offset += 4;
	        return value;
	    };

	    /**
	     * Reads a 32bit signed integer. This is an alias of {@link ByteBuffer#readInt32}.
	     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readInt = ByteBufferPrototype.readInt32;

	    /**
	     * Writes a 32bit unsigned integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeUint32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value >>>= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 4;
	        var capacity5 = this.buffer.byteLength;
	        if (offset > capacity5)
	            this.resize((capacity5 *= 2) > offset ? capacity5 : offset);
	        offset -= 4;
	        if (this.littleEndian) {
	            this.view[offset+3] = (value >>> 24) & 0xFF;
	            this.view[offset+2] = (value >>> 16) & 0xFF;
	            this.view[offset+1] = (value >>>  8) & 0xFF;
	            this.view[offset  ] =  value         & 0xFF;
	        } else {
	            this.view[offset  ] = (value >>> 24) & 0xFF;
	            this.view[offset+1] = (value >>> 16) & 0xFF;
	            this.view[offset+2] = (value >>>  8) & 0xFF;
	            this.view[offset+3] =  value         & 0xFF;
	        }
	        if (relative) this.offset += 4;
	        return this;
	    };

	    /**
	     * Writes a 32bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint32}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @expose
	     */
	    ByteBufferPrototype.writeUInt32 = ByteBufferPrototype.writeUint32;

	    /**
	     * Reads a 32bit unsigned integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUint32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var value = 0;
	        if (this.littleEndian) {
	            value  = this.view[offset+2] << 16;
	            value |= this.view[offset+1] <<  8;
	            value |= this.view[offset  ];
	            value += this.view[offset+3] << 24 >>> 0;
	        } else {
	            value  = this.view[offset+1] << 16;
	            value |= this.view[offset+2] <<  8;
	            value |= this.view[offset+3];
	            value += this.view[offset  ] << 24 >>> 0;
	        }
	        if (relative) this.offset += 4;
	        return value;
	    };

	    /**
	     * Reads a 32bit unsigned integer. This is an alias of {@link ByteBuffer#readUint32}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number} Value read
	     * @expose
	     */
	    ByteBufferPrototype.readUInt32 = ByteBufferPrototype.readUint32;

	    // types/ints/int64

	    if (Long) {

	        /**
	         * Writes a 64bit signed integer.
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeInt64 = function(value, offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof value === 'number')
	                    value = Long.fromNumber(value);
	                else if (typeof value === 'string')
	                    value = Long.fromString(value);
	                else if (!(value && value instanceof Long))
	                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	            }
	            if (typeof value === 'number')
	                value = Long.fromNumber(value);
	            else if (typeof value === 'string')
	                value = Long.fromString(value);
	            offset += 8;
	            var capacity6 = this.buffer.byteLength;
	            if (offset > capacity6)
	                this.resize((capacity6 *= 2) > offset ? capacity6 : offset);
	            offset -= 8;
	            var lo = value.low,
	                hi = value.high;
	            if (this.littleEndian) {
	                this.view[offset+3] = (lo >>> 24) & 0xFF;
	                this.view[offset+2] = (lo >>> 16) & 0xFF;
	                this.view[offset+1] = (lo >>>  8) & 0xFF;
	                this.view[offset  ] =  lo         & 0xFF;
	                offset += 4;
	                this.view[offset+3] = (hi >>> 24) & 0xFF;
	                this.view[offset+2] = (hi >>> 16) & 0xFF;
	                this.view[offset+1] = (hi >>>  8) & 0xFF;
	                this.view[offset  ] =  hi         & 0xFF;
	            } else {
	                this.view[offset  ] = (hi >>> 24) & 0xFF;
	                this.view[offset+1] = (hi >>> 16) & 0xFF;
	                this.view[offset+2] = (hi >>>  8) & 0xFF;
	                this.view[offset+3] =  hi         & 0xFF;
	                offset += 4;
	                this.view[offset  ] = (lo >>> 24) & 0xFF;
	                this.view[offset+1] = (lo >>> 16) & 0xFF;
	                this.view[offset+2] = (lo >>>  8) & 0xFF;
	                this.view[offset+3] =  lo         & 0xFF;
	            }
	            if (relative) this.offset += 8;
	            return this;
	        };

	        /**
	         * Writes a 64bit signed integer. This is an alias of {@link ByteBuffer#writeInt64}.
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeLong = ByteBufferPrototype.writeInt64;

	        /**
	         * Reads a 64bit signed integer.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readInt64 = function(offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 8 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
	            }
	            var lo = 0,
	                hi = 0;
	            if (this.littleEndian) {
	                lo  = this.view[offset+2] << 16;
	                lo |= this.view[offset+1] <<  8;
	                lo |= this.view[offset  ];
	                lo += this.view[offset+3] << 24 >>> 0;
	                offset += 4;
	                hi  = this.view[offset+2] << 16;
	                hi |= this.view[offset+1] <<  8;
	                hi |= this.view[offset  ];
	                hi += this.view[offset+3] << 24 >>> 0;
	            } else {
	                hi  = this.view[offset+1] << 16;
	                hi |= this.view[offset+2] <<  8;
	                hi |= this.view[offset+3];
	                hi += this.view[offset  ] << 24 >>> 0;
	                offset += 4;
	                lo  = this.view[offset+1] << 16;
	                lo |= this.view[offset+2] <<  8;
	                lo |= this.view[offset+3];
	                lo += this.view[offset  ] << 24 >>> 0;
	            }
	            var value = new Long(lo, hi, false);
	            if (relative) this.offset += 8;
	            return value;
	        };

	        /**
	         * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readLong = ByteBufferPrototype.readInt64;

	        /**
	         * Writes a 64bit unsigned integer.
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeUint64 = function(value, offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof value === 'number')
	                    value = Long.fromNumber(value);
	                else if (typeof value === 'string')
	                    value = Long.fromString(value);
	                else if (!(value && value instanceof Long))
	                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	            }
	            if (typeof value === 'number')
	                value = Long.fromNumber(value);
	            else if (typeof value === 'string')
	                value = Long.fromString(value);
	            offset += 8;
	            var capacity7 = this.buffer.byteLength;
	            if (offset > capacity7)
	                this.resize((capacity7 *= 2) > offset ? capacity7 : offset);
	            offset -= 8;
	            var lo = value.low,
	                hi = value.high;
	            if (this.littleEndian) {
	                this.view[offset+3] = (lo >>> 24) & 0xFF;
	                this.view[offset+2] = (lo >>> 16) & 0xFF;
	                this.view[offset+1] = (lo >>>  8) & 0xFF;
	                this.view[offset  ] =  lo         & 0xFF;
	                offset += 4;
	                this.view[offset+3] = (hi >>> 24) & 0xFF;
	                this.view[offset+2] = (hi >>> 16) & 0xFF;
	                this.view[offset+1] = (hi >>>  8) & 0xFF;
	                this.view[offset  ] =  hi         & 0xFF;
	            } else {
	                this.view[offset  ] = (hi >>> 24) & 0xFF;
	                this.view[offset+1] = (hi >>> 16) & 0xFF;
	                this.view[offset+2] = (hi >>>  8) & 0xFF;
	                this.view[offset+3] =  hi         & 0xFF;
	                offset += 4;
	                this.view[offset  ] = (lo >>> 24) & 0xFF;
	                this.view[offset+1] = (lo >>> 16) & 0xFF;
	                this.view[offset+2] = (lo >>>  8) & 0xFF;
	                this.view[offset+3] =  lo         & 0xFF;
	            }
	            if (relative) this.offset += 8;
	            return this;
	        };

	        /**
	         * Writes a 64bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint64}.
	         * @function
	         * @param {number|!Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!ByteBuffer} this
	         * @expose
	         */
	        ByteBufferPrototype.writeUInt64 = ByteBufferPrototype.writeUint64;

	        /**
	         * Reads a 64bit unsigned integer.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readUint64 = function(offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 8 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
	            }
	            var lo = 0,
	                hi = 0;
	            if (this.littleEndian) {
	                lo  = this.view[offset+2] << 16;
	                lo |= this.view[offset+1] <<  8;
	                lo |= this.view[offset  ];
	                lo += this.view[offset+3] << 24 >>> 0;
	                offset += 4;
	                hi  = this.view[offset+2] << 16;
	                hi |= this.view[offset+1] <<  8;
	                hi |= this.view[offset  ];
	                hi += this.view[offset+3] << 24 >>> 0;
	            } else {
	                hi  = this.view[offset+1] << 16;
	                hi |= this.view[offset+2] <<  8;
	                hi |= this.view[offset+3];
	                hi += this.view[offset  ] << 24 >>> 0;
	                offset += 4;
	                lo  = this.view[offset+1] << 16;
	                lo |= this.view[offset+2] <<  8;
	                lo |= this.view[offset+3];
	                lo += this.view[offset  ] << 24 >>> 0;
	            }
	            var value = new Long(lo, hi, true);
	            if (relative) this.offset += 8;
	            return value;
	        };

	        /**
	         * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.
	         * @function
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	         * @returns {!Long}
	         * @expose
	         */
	        ByteBufferPrototype.readUInt64 = ByteBufferPrototype.readUint64;

	    } // Long


	    // types/floats/float32

	    /*
	     ieee754 - https://github.com/feross/ieee754

	     The MIT License (MIT)

	     Copyright (c) Feross Aboukhadijeh

	     Permission is hereby granted, free of charge, to any person obtaining a copy
	     of this software and associated documentation files (the "Software"), to deal
	     in the Software without restriction, including without limitation the rights
	     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	     copies of the Software, and to permit persons to whom the Software is
	     furnished to do so, subject to the following conditions:

	     The above copyright notice and this permission notice shall be included in
	     all copies or substantial portions of the Software.

	     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	     THE SOFTWARE.
	    */

	    /**
	     * Reads an IEEE754 float from a byte array.
	     * @param {!Array} buffer
	     * @param {number} offset
	     * @param {boolean} isLE
	     * @param {number} mLen
	     * @param {number} nBytes
	     * @returns {number}
	     * @inner
	     */
	    function ieee754_read(buffer, offset, isLE, mLen, nBytes) {
	        var e, m,
	            eLen = nBytes * 8 - mLen - 1,
	            eMax = (1 << eLen) - 1,
	            eBias = eMax >> 1,
	            nBits = -7,
	            i = isLE ? (nBytes - 1) : 0,
	            d = isLE ? -1 : 1,
	            s = buffer[offset + i];

	        i += d;

	        e = s & ((1 << (-nBits)) - 1);
	        s >>= (-nBits);
	        nBits += eLen;
	        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	        m = e & ((1 << (-nBits)) - 1);
	        e >>= (-nBits);
	        nBits += mLen;
	        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	        if (e === 0) {
	            e = 1 - eBias;
	        } else if (e === eMax) {
	            return m ? NaN : ((s ? -1 : 1) * Infinity);
	        } else {
	            m = m + Math.pow(2, mLen);
	            e = e - eBias;
	        }
	        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	    }

	    /**
	     * Writes an IEEE754 float to a byte array.
	     * @param {!Array} buffer
	     * @param {number} value
	     * @param {number} offset
	     * @param {boolean} isLE
	     * @param {number} mLen
	     * @param {number} nBytes
	     * @inner
	     */
	    function ieee754_write(buffer, value, offset, isLE, mLen, nBytes) {
	        var e, m, c,
	            eLen = nBytes * 8 - mLen - 1,
	            eMax = (1 << eLen) - 1,
	            eBias = eMax >> 1,
	            rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	            i = isLE ? 0 : (nBytes - 1),
	            d = isLE ? 1 : -1,
	            s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

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

	        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	        e = (e << mLen) | m;
	        eLen += mLen;
	        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	        buffer[offset + i - d] |= s * 128;
	    }

	    /**
	     * Writes a 32bit float.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeFloat32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number')
	                throw TypeError("Illegal value: "+value+" (not a number)");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 4;
	        var capacity8 = this.buffer.byteLength;
	        if (offset > capacity8)
	            this.resize((capacity8 *= 2) > offset ? capacity8 : offset);
	        offset -= 4;
	        ieee754_write(this.view, value, offset, this.littleEndian, 23, 4);
	        if (relative) this.offset += 4;
	        return this;
	    };

	    /**
	     * Writes a 32bit float. This is an alias of {@link ByteBuffer#writeFloat32}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeFloat = ByteBufferPrototype.writeFloat32;

	    /**
	     * Reads a 32bit float.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readFloat32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var value = ieee754_read(this.view, offset, this.littleEndian, 23, 4);
	        if (relative) this.offset += 4;
	        return value;
	    };

	    /**
	     * Reads a 32bit float. This is an alias of {@link ByteBuffer#readFloat32}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readFloat = ByteBufferPrototype.readFloat32;

	    // types/floats/float64

	    /**
	     * Writes a 64bit float.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeFloat64 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number')
	                throw TypeError("Illegal value: "+value+" (not a number)");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        offset += 8;
	        var capacity9 = this.buffer.byteLength;
	        if (offset > capacity9)
	            this.resize((capacity9 *= 2) > offset ? capacity9 : offset);
	        offset -= 8;
	        ieee754_write(this.view, value, offset, this.littleEndian, 52, 8);
	        if (relative) this.offset += 8;
	        return this;
	    };

	    /**
	     * Writes a 64bit float. This is an alias of {@link ByteBuffer#writeFloat64}.
	     * @function
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.writeDouble = ByteBufferPrototype.writeFloat64;

	    /**
	     * Reads a 64bit float.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readFloat64 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 8 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+8+") <= "+this.buffer.byteLength);
	        }
	        var value = ieee754_read(this.view, offset, this.littleEndian, 52, 8);
	        if (relative) this.offset += 8;
	        return value;
	    };

	    /**
	     * Reads a 64bit float. This is an alias of {@link ByteBuffer#readFloat64}.
	     * @function
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
	     * @returns {number}
	     * @expose
	     */
	    ByteBufferPrototype.readDouble = ByteBufferPrototype.readFloat64;


	    // types/varints/varint32

	    /**
	     * Maximum number of bytes required to store a 32bit base 128 variable-length integer.
	     * @type {number}
	     * @const
	     * @expose
	     */
	    ByteBuffer.MAX_VARINT32_BYTES = 5;

	    /**
	     * Calculates the actual number of bytes required to store a 32bit base 128 variable-length integer.
	     * @param {number} value Value to encode
	     * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT32_BYTES}
	     * @expose
	     */
	    ByteBuffer.calculateVarint32 = function(value) {
	        // ref: src/google/protobuf/io/coded_stream.cc
	        value = value >>> 0;
	             if (value < 1 << 7 ) return 1;
	        else if (value < 1 << 14) return 2;
	        else if (value < 1 << 21) return 3;
	        else if (value < 1 << 28) return 4;
	        else                      return 5;
	    };

	    /**
	     * Zigzag encodes a signed 32bit integer so that it can be effectively used with varint encoding.
	     * @param {number} n Signed 32bit integer
	     * @returns {number} Unsigned zigzag encoded 32bit integer
	     * @expose
	     */
	    ByteBuffer.zigZagEncode32 = function(n) {
	        return (((n |= 0) << 1) ^ (n >> 31)) >>> 0; // ref: src/google/protobuf/wire_format_lite.h
	    };

	    /**
	     * Decodes a zigzag encoded signed 32bit integer.
	     * @param {number} n Unsigned zigzag encoded 32bit integer
	     * @returns {number} Signed 32bit integer
	     * @expose
	     */
	    ByteBuffer.zigZagDecode32 = function(n) {
	        return ((n >>> 1) ^ -(n & 1)) | 0; // // ref: src/google/protobuf/wire_format_lite.h
	    };

	    /**
	     * Writes a 32bit base 128 variable-length integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     */
	    ByteBufferPrototype.writeVarint32 = function(value, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var size = ByteBuffer.calculateVarint32(value),
	            b;
	        offset += size;
	        var capacity10 = this.buffer.byteLength;
	        if (offset > capacity10)
	            this.resize((capacity10 *= 2) > offset ? capacity10 : offset);
	        offset -= size;
	        value >>>= 0;
	        while (value >= 0x80) {
	            b = (value & 0x7f) | 0x80;
	            this.view[offset++] = b;
	            value >>>= 7;
	        }
	        this.view[offset++] = value;
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return size;
	    };

	    /**
	     * Writes a zig-zag encoded (signed) 32bit base 128 variable-length integer.
	     * @param {number} value Value to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} this if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     */
	    ByteBufferPrototype.writeVarint32ZigZag = function(value, offset) {
	        return this.writeVarint32(ByteBuffer.zigZagEncode32(value), offset);
	    };

	    /**
	     * Reads a 32bit base 128 variable-length integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
	     *  and the actual number of bytes read.
	     * @throws {Error} If it's not a valid varint. Has a property `truncated = true` if there is not enough data available
	     *  to fully decode the varint.
	     * @expose
	     */
	    ByteBufferPrototype.readVarint32 = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var c = 0,
	            value = 0 >>> 0,
	            b;
	        do {
	            if (!this.noAssert && offset > this.limit) {
	                var err = Error("Truncated");
	                err['truncated'] = true;
	                throw err;
	            }
	            b = this.view[offset++];
	            if (c < 5)
	                value |= (b & 0x7f) << (7*c);
	            ++c;
	        } while ((b & 0x80) !== 0);
	        value |= 0;
	        if (relative) {
	            this.offset = offset;
	            return value;
	        }
	        return {
	            "value": value,
	            "length": c
	        };
	    };

	    /**
	     * Reads a zig-zag encoded (signed) 32bit base 128 variable-length integer.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {number|!{value: number, length: number}} The value read if offset is omitted, else the value read
	     *  and the actual number of bytes read.
	     * @throws {Error} If it's not a valid varint
	     * @expose
	     */
	    ByteBufferPrototype.readVarint32ZigZag = function(offset) {
	        var val = this.readVarint32(offset);
	        if (typeof val === 'object')
	            val["value"] = ByteBuffer.zigZagDecode32(val["value"]);
	        else
	            val = ByteBuffer.zigZagDecode32(val);
	        return val;
	    };

	    // types/varints/varint64

	    if (Long) {

	        /**
	         * Maximum number of bytes required to store a 64bit base 128 variable-length integer.
	         * @type {number}
	         * @const
	         * @expose
	         */
	        ByteBuffer.MAX_VARINT64_BYTES = 10;

	        /**
	         * Calculates the actual number of bytes required to store a 64bit base 128 variable-length integer.
	         * @param {number|!Long} value Value to encode
	         * @returns {number} Number of bytes required. Capped to {@link ByteBuffer.MAX_VARINT64_BYTES}
	         * @expose
	         */
	        ByteBuffer.calculateVarint64 = function(value) {
	            if (typeof value === 'number')
	                value = Long.fromNumber(value);
	            else if (typeof value === 'string')
	                value = Long.fromString(value);
	            // ref: src/google/protobuf/io/coded_stream.cc
	            var part0 = value.toInt() >>> 0,
	                part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
	                part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
	            if (part2 == 0) {
	                if (part1 == 0) {
	                    if (part0 < 1 << 14)
	                        return part0 < 1 << 7 ? 1 : 2;
	                    else
	                        return part0 < 1 << 21 ? 3 : 4;
	                } else {
	                    if (part1 < 1 << 14)
	                        return part1 < 1 << 7 ? 5 : 6;
	                    else
	                        return part1 < 1 << 21 ? 7 : 8;
	                }
	            } else
	                return part2 < 1 << 7 ? 9 : 10;
	        };

	        /**
	         * Zigzag encodes a signed 64bit integer so that it can be effectively used with varint encoding.
	         * @param {number|!Long} value Signed long
	         * @returns {!Long} Unsigned zigzag encoded long
	         * @expose
	         */
	        ByteBuffer.zigZagEncode64 = function(value) {
	            if (typeof value === 'number')
	                value = Long.fromNumber(value, false);
	            else if (typeof value === 'string')
	                value = Long.fromString(value, false);
	            else if (value.unsigned !== false) value = value.toSigned();
	            // ref: src/google/protobuf/wire_format_lite.h
	            return value.shiftLeft(1).xor(value.shiftRight(63)).toUnsigned();
	        };

	        /**
	         * Decodes a zigzag encoded signed 64bit integer.
	         * @param {!Long|number} value Unsigned zigzag encoded long or JavaScript number
	         * @returns {!Long} Signed long
	         * @expose
	         */
	        ByteBuffer.zigZagDecode64 = function(value) {
	            if (typeof value === 'number')
	                value = Long.fromNumber(value, false);
	            else if (typeof value === 'string')
	                value = Long.fromString(value, false);
	            else if (value.unsigned !== false) value = value.toSigned();
	            // ref: src/google/protobuf/wire_format_lite.h
	            return value.shiftRightUnsigned(1).xor(value.and(Long.ONE).toSigned().negate()).toSigned();
	        };

	        /**
	         * Writes a 64bit base 128 variable-length integer.
	         * @param {number|Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  written if omitted.
	         * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
	         * @expose
	         */
	        ByteBufferPrototype.writeVarint64 = function(value, offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof value === 'number')
	                    value = Long.fromNumber(value);
	                else if (typeof value === 'string')
	                    value = Long.fromString(value);
	                else if (!(value && value instanceof Long))
	                    throw TypeError("Illegal value: "+value+" (not an integer or Long)");
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	            }
	            if (typeof value === 'number')
	                value = Long.fromNumber(value, false);
	            else if (typeof value === 'string')
	                value = Long.fromString(value, false);
	            else if (value.unsigned !== false) value = value.toSigned();
	            var size = ByteBuffer.calculateVarint64(value),
	                part0 = value.toInt() >>> 0,
	                part1 = value.shiftRightUnsigned(28).toInt() >>> 0,
	                part2 = value.shiftRightUnsigned(56).toInt() >>> 0;
	            offset += size;
	            var capacity11 = this.buffer.byteLength;
	            if (offset > capacity11)
	                this.resize((capacity11 *= 2) > offset ? capacity11 : offset);
	            offset -= size;
	            switch (size) {
	                case 10: this.view[offset+9] = (part2 >>>  7) & 0x01;
	                case 9 : this.view[offset+8] = size !== 9 ? (part2       ) | 0x80 : (part2       ) & 0x7F;
	                case 8 : this.view[offset+7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
	                case 7 : this.view[offset+6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
	                case 6 : this.view[offset+5] = size !== 6 ? (part1 >>>  7) | 0x80 : (part1 >>>  7) & 0x7F;
	                case 5 : this.view[offset+4] = size !== 5 ? (part1       ) | 0x80 : (part1       ) & 0x7F;
	                case 4 : this.view[offset+3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
	                case 3 : this.view[offset+2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
	                case 2 : this.view[offset+1] = size !== 2 ? (part0 >>>  7) | 0x80 : (part0 >>>  7) & 0x7F;
	                case 1 : this.view[offset  ] = size !== 1 ? (part0       ) | 0x80 : (part0       ) & 0x7F;
	            }
	            if (relative) {
	                this.offset += size;
	                return this;
	            } else {
	                return size;
	            }
	        };

	        /**
	         * Writes a zig-zag encoded 64bit base 128 variable-length integer.
	         * @param {number|Long} value Value to write
	         * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  written if omitted.
	         * @returns {!ByteBuffer|number} `this` if offset is omitted, else the actual number of bytes written.
	         * @expose
	         */
	        ByteBufferPrototype.writeVarint64ZigZag = function(value, offset) {
	            return this.writeVarint64(ByteBuffer.zigZagEncode64(value), offset);
	        };

	        /**
	         * Reads a 64bit base 128 variable-length integer. Requires Long.js.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  read if omitted.
	         * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
	         *  the actual number of bytes read.
	         * @throws {Error} If it's not a valid varint
	         * @expose
	         */
	        ByteBufferPrototype.readVarint64 = function(offset) {
	            var relative = typeof offset === 'undefined';
	            if (relative) offset = this.offset;
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	            }
	            // ref: src/google/protobuf/io/coded_stream.cc
	            var start = offset,
	                part0 = 0,
	                part1 = 0,
	                part2 = 0,
	                b  = 0;
	            b = this.view[offset++]; part0  = (b & 0x7F)      ; if ( b & 0x80                                                   ) {
	            b = this.view[offset++]; part0 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part0 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part0 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1 |= (b & 0x7F) << 14; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part1 |= (b & 0x7F) << 21; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part2  = (b & 0x7F)      ; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            b = this.view[offset++]; part2 |= (b & 0x7F) <<  7; if ((b & 0x80) || (this.noAssert && typeof b === 'undefined')) {
	            throw Error("Buffer overrun"); }}}}}}}}}}
	            var value = Long.fromBits(part0 | (part1 << 28), (part1 >>> 4) | (part2) << 24, false);
	            if (relative) {
	                this.offset = offset;
	                return value;
	            } else {
	                return {
	                    'value': value,
	                    'length': offset-start
	                };
	            }
	        };

	        /**
	         * Reads a zig-zag encoded 64bit base 128 variable-length integer. Requires Long.js.
	         * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	         *  read if omitted.
	         * @returns {!Long|!{value: Long, length: number}} The value read if offset is omitted, else the value read and
	         *  the actual number of bytes read.
	         * @throws {Error} If it's not a valid varint
	         * @expose
	         */
	        ByteBufferPrototype.readVarint64ZigZag = function(offset) {
	            var val = this.readVarint64(offset);
	            if (val && val['value'] instanceof Long)
	                val["value"] = ByteBuffer.zigZagDecode64(val["value"]);
	            else
	                val = ByteBuffer.zigZagDecode64(val);
	            return val;
	        };

	    } // Long


	    // types/strings/cstring

	    /**
	     * Writes a NULL-terminated UTF8 encoded string. For this to work the specified string must not contain any NULL
	     *  characters itself.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  contained in `str` + 1 if omitted.
	     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written
	     * @expose
	     */
	    ByteBufferPrototype.writeCString = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        var i,
	            k = str.length;
	        if (!this.noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            for (i=0; i<k; ++i) {
	                if (str.charCodeAt(i) === 0)
	                    throw RangeError("Illegal str: Contains NULL-characters");
	            }
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        // UTF8 strings do not contain zero bytes in between except for the zero character, so:
	        k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
	        offset += k+1;
	        var capacity12 = this.buffer.byteLength;
	        if (offset > capacity12)
	            this.resize((capacity12 *= 2) > offset ? capacity12 : offset);
	        offset -= k+1;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        this.view[offset++] = 0;
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return k;
	    };

	    /**
	     * Reads a NULL-terminated UTF8 encoded string. For this to work the string read must not contain any NULL characters
	     *  itself.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     */
	    ByteBufferPrototype.readCString = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var start = offset;
	        // UTF8 strings do not contain zero bytes in between except for the zero character itself, so:
	        var sd, b = -1;
	        utfx.decodeUTF8toUTF16(function() {
	            if (b === 0) return null;
	            if (offset >= this.limit)
	                throw RangeError("Illegal range: Truncated data, "+offset+" < "+this.limit);
	            b = this.view[offset++];
	            return b === 0 ? null : b;
	        }.bind(this), sd = stringDestination(), true);
	        if (relative) {
	            this.offset = offset;
	            return sd();
	        } else {
	            return {
	                "string": sd(),
	                "length": offset - start
	            };
	        }
	    };

	    // types/strings/istring

	    /**
	     * Writes a length as uint32 prefixed UTF8 encoded string.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     * @see ByteBuffer#writeVarint32
	     */
	    ByteBufferPrototype.writeIString = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var start = offset,
	            k;
	        k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
	        offset += 4+k;
	        var capacity13 = this.buffer.byteLength;
	        if (offset > capacity13)
	            this.resize((capacity13 *= 2) > offset ? capacity13 : offset);
	        offset -= 4+k;
	        if (this.littleEndian) {
	            this.view[offset+3] = (k >>> 24) & 0xFF;
	            this.view[offset+2] = (k >>> 16) & 0xFF;
	            this.view[offset+1] = (k >>>  8) & 0xFF;
	            this.view[offset  ] =  k         & 0xFF;
	        } else {
	            this.view[offset  ] = (k >>> 24) & 0xFF;
	            this.view[offset+1] = (k >>> 16) & 0xFF;
	            this.view[offset+2] = (k >>>  8) & 0xFF;
	            this.view[offset+3] =  k         & 0xFF;
	        }
	        offset += 4;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        if (offset !== start + 4 + k)
	            throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+4+k));
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return offset - start;
	    };

	    /**
	     * Reads a length as uint32 prefixed UTF8 encoded string.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     * @see ByteBuffer#readVarint32
	     */
	    ByteBufferPrototype.readIString = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 4 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+4+") <= "+this.buffer.byteLength);
	        }
	        var start = offset;
	        var len = this.readUint32(offset);
	        var str = this.readUTF8String(len, ByteBuffer.METRICS_BYTES, offset += 4);
	        offset += str['length'];
	        if (relative) {
	            this.offset = offset;
	            return str['string'];
	        } else {
	            return {
	                'string': str['string'],
	                'length': offset - start
	            };
	        }
	    };

	    // types/strings/utf8string

	    /**
	     * Metrics representing number of UTF8 characters. Evaluates to `c`.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ByteBuffer.METRICS_CHARS = 'c';

	    /**
	     * Metrics representing number of bytes. Evaluates to `b`.
	     * @type {string}
	     * @const
	     * @expose
	     */
	    ByteBuffer.METRICS_BYTES = 'b';

	    /**
	     * Writes an UTF8 encoded string.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
	     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
	     * @expose
	     */
	    ByteBufferPrototype.writeUTF8String = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var k;
	        var start = offset;
	        k = utfx.calculateUTF16asUTF8(stringSource(str))[1];
	        offset += k;
	        var capacity14 = this.buffer.byteLength;
	        if (offset > capacity14)
	            this.resize((capacity14 *= 2) > offset ? capacity14 : offset);
	        offset -= k;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return offset - start;
	    };

	    /**
	     * Writes an UTF8 encoded string. This is an alias of {@link ByteBuffer#writeUTF8String}.
	     * @function
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} if omitted.
	     * @returns {!ByteBuffer|number} this if offset is omitted, else the actual number of bytes written.
	     * @expose
	     */
	    ByteBufferPrototype.writeString = ByteBufferPrototype.writeUTF8String;

	    /**
	     * Calculates the number of UTF8 characters of a string. JavaScript itself uses UTF-16, so that a string's
	     *  `length` property does not reflect its actual UTF8 size if it contains code points larger than 0xFFFF.
	     * @param {string} str String to calculate
	     * @returns {number} Number of UTF8 characters
	     * @expose
	     */
	    ByteBuffer.calculateUTF8Chars = function(str) {
	        return utfx.calculateUTF16asUTF8(stringSource(str))[0];
	    };

	    /**
	     * Calculates the number of UTF8 bytes of a string.
	     * @param {string} str String to calculate
	     * @returns {number} Number of UTF8 bytes
	     * @expose
	     */
	    ByteBuffer.calculateUTF8Bytes = function(str) {
	        return utfx.calculateUTF16asUTF8(stringSource(str))[1];
	    };

	    /**
	     * Calculates the number of UTF8 bytes of a string. This is an alias of {@link ByteBuffer.calculateUTF8Bytes}.
	     * @function
	     * @param {string} str String to calculate
	     * @returns {number} Number of UTF8 bytes
	     * @expose
	     */
	    ByteBuffer.calculateString = ByteBuffer.calculateUTF8Bytes;

	    /**
	     * Reads an UTF8 encoded string.
	     * @param {number} length Number of characters or bytes to read.
	     * @param {string=} metrics Metrics specifying what `length` is meant to count. Defaults to
	     *  {@link ByteBuffer.METRICS_CHARS}.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     */
	    ByteBufferPrototype.readUTF8String = function(length, metrics, offset) {
	        if (typeof metrics === 'number') {
	            offset = metrics;
	            metrics = undefined;
	        }
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (typeof metrics === 'undefined') metrics = ByteBuffer.METRICS_CHARS;
	        if (!this.noAssert) {
	            if (typeof length !== 'number' || length % 1 !== 0)
	                throw TypeError("Illegal length: "+length+" (not an integer)");
	            length |= 0;
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var i = 0,
	            start = offset,
	            sd;
	        if (metrics === ByteBuffer.METRICS_CHARS) { // The same for node and the browser
	            sd = stringDestination();
	            utfx.decodeUTF8(function() {
	                return i < length && offset < this.limit ? this.view[offset++] : null;
	            }.bind(this), function(cp) {
	                ++i; utfx.UTF8toUTF16(cp, sd);
	            });
	            if (i !== length)
	                throw RangeError("Illegal range: Truncated data, "+i+" == "+length);
	            if (relative) {
	                this.offset = offset;
	                return sd();
	            } else {
	                return {
	                    "string": sd(),
	                    "length": offset - start
	                };
	            }
	        } else if (metrics === ByteBuffer.METRICS_BYTES) {
	            if (!this.noAssert) {
	                if (typeof offset !== 'number' || offset % 1 !== 0)
	                    throw TypeError("Illegal offset: "+offset+" (not an integer)");
	                offset >>>= 0;
	                if (offset < 0 || offset + length > this.buffer.byteLength)
	                    throw RangeError("Illegal offset: 0 <= "+offset+" (+"+length+") <= "+this.buffer.byteLength);
	            }
	            var k = offset + length;
	            utfx.decodeUTF8toUTF16(function() {
	                return offset < k ? this.view[offset++] : null;
	            }.bind(this), sd = stringDestination(), this.noAssert);
	            if (offset !== k)
	                throw RangeError("Illegal range: Truncated data, "+offset+" == "+k);
	            if (relative) {
	                this.offset = offset;
	                return sd();
	            } else {
	                return {
	                    'string': sd(),
	                    'length': offset - start
	                };
	            }
	        } else
	            throw TypeError("Unsupported metrics: "+metrics);
	    };

	    /**
	     * Reads an UTF8 encoded string. This is an alias of {@link ByteBuffer#readUTF8String}.
	     * @function
	     * @param {number} length Number of characters or bytes to read
	     * @param {number=} metrics Metrics specifying what `n` is meant to count. Defaults to
	     *  {@link ByteBuffer.METRICS_CHARS}.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     */
	    ByteBufferPrototype.readString = ByteBufferPrototype.readUTF8String;

	    // types/strings/vstring

	    /**
	     * Writes a length as varint32 prefixed UTF8 encoded string.
	     * @param {string} str String to write
	     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer|number} `this` if `offset` is omitted, else the actual number of bytes written
	     * @expose
	     * @see ByteBuffer#writeVarint32
	     */
	    ByteBufferPrototype.writeVString = function(str, offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        var start = offset,
	            k, l;
	        k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1];
	        l = ByteBuffer.calculateVarint32(k);
	        offset += l+k;
	        var capacity15 = this.buffer.byteLength;
	        if (offset > capacity15)
	            this.resize((capacity15 *= 2) > offset ? capacity15 : offset);
	        offset -= l+k;
	        offset += this.writeVarint32(k, offset);
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            this.view[offset++] = b;
	        }.bind(this));
	        if (offset !== start+k+l)
	            throw RangeError("Illegal range: Truncated data, "+offset+" == "+(offset+k+l));
	        if (relative) {
	            this.offset = offset;
	            return this;
	        }
	        return offset - start;
	    };

	    /**
	     * Reads a length as varint32 prefixed UTF8 encoded string.
	     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {string|!{string: string, length: number}} The string read if offset is omitted, else the string
	     *  read and the actual number of bytes read.
	     * @expose
	     * @see ByteBuffer#readVarint32
	     */
	    ByteBufferPrototype.readVString = function(offset) {
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 1 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+1+") <= "+this.buffer.byteLength);
	        }
	        var start = offset;
	        var len = this.readVarint32(offset);
	        var str = this.readUTF8String(len['value'], ByteBuffer.METRICS_BYTES, offset += len['length']);
	        offset += str['length'];
	        if (relative) {
	            this.offset = offset;
	            return str['string'];
	        } else {
	            return {
	                'string': str['string'],
	                'length': offset - start
	            };
	        }
	    };


	    /**
	     * Appends some data to this ByteBuffer. This will overwrite any contents behind the specified offset up to the appended
	     *  data's length.
	     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to append. If `source` is a ByteBuffer, its offsets
	     *  will be modified according to the performed read operation.
	     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
	     * @param {number=} offset Offset to append at. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @example A relative `<01 02>03.append(<04 05>)` will result in `<01 02 04 05>, 04 05|`
	     * @example An absolute `<01 02>03.append(04 05>, 1)` will result in `<01 04>05, 04 05|`
	     */
	    ByteBufferPrototype.append = function(source, encoding, offset) {
	        if (typeof encoding === 'number' || typeof encoding !== 'string') {
	            offset = encoding;
	            encoding = undefined;
	        }
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        if (!(source instanceof ByteBuffer))
	            source = ByteBuffer.wrap(source, encoding);
	        var length = source.limit - source.offset;
	        if (length <= 0) return this; // Nothing to append
	        offset += length;
	        var capacity16 = this.buffer.byteLength;
	        if (offset > capacity16)
	            this.resize((capacity16 *= 2) > offset ? capacity16 : offset);
	        offset -= length;
	        this.view.set(source.view.subarray(source.offset, source.limit), offset);
	        source.offset += length;
	        if (relative) this.offset += length;
	        return this;
	    };

	    /**
	     * Appends this ByteBuffer's contents to another ByteBuffer. This will overwrite any contents at and after the
	        specified offset up to the length of this ByteBuffer's data.
	     * @param {!ByteBuffer} target Target ByteBuffer
	     * @param {number=} offset Offset to append to. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  read if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @see ByteBuffer#append
	     */
	    ByteBufferPrototype.appendTo = function(target, offset) {
	        target.append(this, offset);
	        return this;
	    };

	    /**
	     * Enables or disables assertions of argument types and offsets. Assertions are enabled by default but you can opt to
	     *  disable them if your code already makes sure that everything is valid.
	     * @param {boolean} assert `true` to enable assertions, otherwise `false`
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.assert = function(assert) {
	        this.noAssert = !assert;
	        return this;
	    };

	    /**
	     * Gets the capacity of this ByteBuffer's backing buffer.
	     * @returns {number} Capacity of the backing buffer
	     * @expose
	     */
	    ByteBufferPrototype.capacity = function() {
	        return this.buffer.byteLength;
	    };
	    /**
	     * Clears this ByteBuffer's offsets by setting {@link ByteBuffer#offset} to `0` and {@link ByteBuffer#limit} to the
	     *  backing buffer's capacity. Discards {@link ByteBuffer#markedOffset}.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.clear = function() {
	        this.offset = 0;
	        this.limit = this.buffer.byteLength;
	        this.markedOffset = -1;
	        return this;
	    };

	    /**
	     * Creates a cloned instance of this ByteBuffer, preset with this ByteBuffer's values for {@link ByteBuffer#offset},
	     *  {@link ByteBuffer#markedOffset} and {@link ByteBuffer#limit}.
	     * @param {boolean=} copy Whether to copy the backing buffer or to return another view on the same, defaults to `false`
	     * @returns {!ByteBuffer} Cloned instance
	     * @expose
	     */
	    ByteBufferPrototype.clone = function(copy) {
	        var bb = new ByteBuffer(0, this.littleEndian, this.noAssert);
	        if (copy) {
	            bb.buffer = new ArrayBuffer(this.buffer.byteLength);
	            bb.view = new Uint8Array(bb.buffer);
	        } else {
	            bb.buffer = this.buffer;
	            bb.view = this.view;
	        }
	        bb.offset = this.offset;
	        bb.markedOffset = this.markedOffset;
	        bb.limit = this.limit;
	        return bb;
	    };

	    /**
	     * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes
	     *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and
	     *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.
	     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.compact = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin === 0 && end === this.buffer.byteLength)
	            return this; // Already compacted
	        var len = end - begin;
	        if (len === 0) {
	            this.buffer = EMPTY_BUFFER;
	            this.view = null;
	            if (this.markedOffset >= 0) this.markedOffset -= begin;
	            this.offset = 0;
	            this.limit = 0;
	            return this;
	        }
	        var buffer = new ArrayBuffer(len);
	        var view = new Uint8Array(buffer);
	        view.set(this.view.subarray(begin, end));
	        this.buffer = buffer;
	        this.view = view;
	        if (this.markedOffset >= 0) this.markedOffset -= begin;
	        this.offset = 0;
	        this.limit = len;
	        return this;
	    };

	    /**
	     * Creates a copy of this ByteBuffer's contents. Contents are the bytes between {@link ByteBuffer#offset} and
	     *  {@link ByteBuffer#limit}.
	     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
	     * @returns {!ByteBuffer} Copy
	     * @expose
	     */
	    ByteBufferPrototype.copy = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin === end)
	            return new ByteBuffer(0, this.littleEndian, this.noAssert);
	        var capacity = end - begin,
	            bb = new ByteBuffer(capacity, this.littleEndian, this.noAssert);
	        bb.offset = 0;
	        bb.limit = capacity;
	        if (bb.markedOffset >= 0) bb.markedOffset -= begin;
	        this.copyTo(bb, 0, begin, end);
	        return bb;
	    };

	    /**
	     * Copies this ByteBuffer's contents to another ByteBuffer. Contents are the bytes between {@link ByteBuffer#offset} and
	     *  {@link ByteBuffer#limit}.
	     * @param {!ByteBuffer} target Target ByteBuffer
	     * @param {number=} targetOffset Offset to copy to. Will use and increase the target's {@link ByteBuffer#offset}
	     *  by the number of bytes copied if omitted.
	     * @param {number=} sourceOffset Offset to start copying from. Will use and increase {@link ByteBuffer#offset} by the
	     *  number of bytes copied if omitted.
	     * @param {number=} sourceLimit Offset to end copying from, defaults to {@link ByteBuffer#limit}
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.copyTo = function(target, targetOffset, sourceOffset, sourceLimit) {
	        var relative,
	            targetRelative;
	        if (!this.noAssert) {
	            if (!ByteBuffer.isByteBuffer(target))
	                throw TypeError("Illegal target: Not a ByteBuffer");
	        }
	        targetOffset = (targetRelative = typeof targetOffset === 'undefined') ? target.offset : targetOffset | 0;
	        sourceOffset = (relative = typeof sourceOffset === 'undefined') ? this.offset : sourceOffset | 0;
	        sourceLimit = typeof sourceLimit === 'undefined' ? this.limit : sourceLimit | 0;

	        if (targetOffset < 0 || targetOffset > target.buffer.byteLength)
	            throw RangeError("Illegal target range: 0 <= "+targetOffset+" <= "+target.buffer.byteLength);
	        if (sourceOffset < 0 || sourceLimit > this.buffer.byteLength)
	            throw RangeError("Illegal source range: 0 <= "+sourceOffset+" <= "+this.buffer.byteLength);

	        var len = sourceLimit - sourceOffset;
	        if (len === 0)
	            return target; // Nothing to copy

	        target.ensureCapacity(targetOffset + len);

	        target.view.set(this.view.subarray(sourceOffset, sourceLimit), targetOffset);

	        if (relative) this.offset += len;
	        if (targetRelative) target.offset += len;

	        return this;
	    };

	    /**
	     * Makes sure that this ByteBuffer is backed by a {@link ByteBuffer#buffer} of at least the specified capacity. If the
	     *  current capacity is exceeded, it will be doubled. If double the current capacity is less than the required capacity,
	     *  the required capacity will be used instead.
	     * @param {number} capacity Required capacity
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.ensureCapacity = function(capacity) {
	        var current = this.buffer.byteLength;
	        if (current < capacity)
	            return this.resize((current *= 2) > capacity ? current : capacity);
	        return this;
	    };

	    /**
	     * Overwrites this ByteBuffer's contents with the specified value. Contents are the bytes between
	     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
	     * @param {number|string} value Byte value to fill with. If given as a string, the first character is used.
	     * @param {number=} begin Begin offset. Will use and increase {@link ByteBuffer#offset} by the number of bytes
	     *  written if omitted. defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @example `someByteBuffer.clear().fill(0)` fills the entire backing buffer with zeroes
	     */
	    ByteBufferPrototype.fill = function(value, begin, end) {
	        var relative = typeof begin === 'undefined';
	        if (relative) begin = this.offset;
	        if (typeof value === 'string' && value.length > 0)
	            value = value.charCodeAt(0);
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof value !== 'number' || value % 1 !== 0)
	                throw TypeError("Illegal value: "+value+" (not an integer)");
	            value |= 0;
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin >= end)
	            return this; // Nothing to fill
	        while (begin < end) this.view[begin++] = value;
	        if (relative) this.offset = begin;
	        return this;
	    };

	    /**
	     * Makes this ByteBuffer ready for a new sequence of write or relative read operations. Sets `limit = offset` and
	     *  `offset = 0`. Make sure always to flip a ByteBuffer when all relative read or write operations are complete.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.flip = function() {
	        this.limit = this.offset;
	        this.offset = 0;
	        return this;
	    };
	    /**
	     * Marks an offset on this ByteBuffer to be used later.
	     * @param {number=} offset Offset to mark. Defaults to {@link ByteBuffer#offset}.
	     * @returns {!ByteBuffer} this
	     * @throws {TypeError} If `offset` is not a valid number
	     * @throws {RangeError} If `offset` is out of bounds
	     * @see ByteBuffer#reset
	     * @expose
	     */
	    ByteBufferPrototype.mark = function(offset) {
	        offset = typeof offset === 'undefined' ? this.offset : offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        this.markedOffset = offset;
	        return this;
	    };
	    /**
	     * Sets the byte order.
	     * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.order = function(littleEndian) {
	        if (!this.noAssert) {
	            if (typeof littleEndian !== 'boolean')
	                throw TypeError("Illegal littleEndian: Not a boolean");
	        }
	        this.littleEndian = !!littleEndian;
	        return this;
	    };

	    /**
	     * Switches (to) little endian byte order.
	     * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.LE = function(littleEndian) {
	        this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true;
	        return this;
	    };

	    /**
	     * Switches (to) big endian byte order.
	     * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.BE = function(bigEndian) {
	        this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;
	        return this;
	    };
	    /**
	     * Prepends some data to this ByteBuffer. This will overwrite any contents before the specified offset up to the
	     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
	     *  will be resized and its contents moved accordingly.
	     * @param {!ByteBuffer|string|!ArrayBuffer} source Data to prepend. If `source` is a ByteBuffer, its offset will be
	     *  modified according to the performed read operation.
	     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")
	     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
	     *  prepended if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @example A relative `00<01 02 03>.prepend(<04 05>)` results in `<04 05 01 02 03>, 04 05|`
	     * @example An absolute `00<01 02 03>.prepend(<04 05>, 2)` results in `04<05 02 03>, 04 05|`
	     */
	    ByteBufferPrototype.prepend = function(source, encoding, offset) {
	        if (typeof encoding === 'number' || typeof encoding !== 'string') {
	            offset = encoding;
	            encoding = undefined;
	        }
	        var relative = typeof offset === 'undefined';
	        if (relative) offset = this.offset;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: "+offset+" (not an integer)");
	            offset >>>= 0;
	            if (offset < 0 || offset + 0 > this.buffer.byteLength)
	                throw RangeError("Illegal offset: 0 <= "+offset+" (+"+0+") <= "+this.buffer.byteLength);
	        }
	        if (!(source instanceof ByteBuffer))
	            source = ByteBuffer.wrap(source, encoding);
	        var len = source.limit - source.offset;
	        if (len <= 0) return this; // Nothing to prepend
	        var diff = len - offset;
	        if (diff > 0) { // Not enough space before offset, so resize + move
	            var buffer = new ArrayBuffer(this.buffer.byteLength + diff);
	            var view = new Uint8Array(buffer);
	            view.set(this.view.subarray(offset, this.buffer.byteLength), len);
	            this.buffer = buffer;
	            this.view = view;
	            this.offset += diff;
	            if (this.markedOffset >= 0) this.markedOffset += diff;
	            this.limit += diff;
	            offset += diff;
	        } else {
	            var arrayView = new Uint8Array(this.buffer);
	        }
	        this.view.set(source.view.subarray(source.offset, source.limit), offset - len);

	        source.offset = source.limit;
	        if (relative)
	            this.offset -= len;
	        return this;
	    };

	    /**
	     * Prepends this ByteBuffer to another ByteBuffer. This will overwrite any contents before the specified offset up to the
	     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer
	     *  will be resized and its contents moved accordingly.
	     * @param {!ByteBuffer} target Target ByteBuffer
	     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes
	     *  prepended if omitted.
	     * @returns {!ByteBuffer} this
	     * @expose
	     * @see ByteBuffer#prepend
	     */
	    ByteBufferPrototype.prependTo = function(target, offset) {
	        target.prepend(this, offset);
	        return this;
	    };
	    /**
	     * Prints debug information about this ByteBuffer's contents.
	     * @param {function(string)=} out Output function to call, defaults to console.log
	     * @expose
	     */
	    ByteBufferPrototype.printDebug = function(out) {
	        if (typeof out !== 'function') out = console.log.bind(console);
	        out(
	            this.toString()+"\n"+
	            "-------------------------------------------------------------------\n"+
	            this.toDebug(/* columns */ true)
	        );
	    };

	    /**
	     * Gets the number of remaining readable bytes. Contents are the bytes between {@link ByteBuffer#offset} and
	     *  {@link ByteBuffer#limit}, so this returns `limit - offset`.
	     * @returns {number} Remaining readable bytes. May be negative if `offset > limit`.
	     * @expose
	     */
	    ByteBufferPrototype.remaining = function() {
	        return this.limit - this.offset;
	    };
	    /**
	     * Resets this ByteBuffer's {@link ByteBuffer#offset}. If an offset has been marked through {@link ByteBuffer#mark}
	     *  before, `offset` will be set to {@link ByteBuffer#markedOffset}, which will then be discarded. If no offset has been
	     *  marked, sets `offset = 0`.
	     * @returns {!ByteBuffer} this
	     * @see ByteBuffer#mark
	     * @expose
	     */
	    ByteBufferPrototype.reset = function() {
	        if (this.markedOffset >= 0) {
	            this.offset = this.markedOffset;
	            this.markedOffset = -1;
	        } else {
	            this.offset = 0;
	        }
	        return this;
	    };
	    /**
	     * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity. Will do nothing if already that
	     *  large or larger.
	     * @param {number} capacity Capacity required
	     * @returns {!ByteBuffer} this
	     * @throws {TypeError} If `capacity` is not a number
	     * @throws {RangeError} If `capacity < 0`
	     * @expose
	     */
	    ByteBufferPrototype.resize = function(capacity) {
	        if (!this.noAssert) {
	            if (typeof capacity !== 'number' || capacity % 1 !== 0)
	                throw TypeError("Illegal capacity: "+capacity+" (not an integer)");
	            capacity |= 0;
	            if (capacity < 0)
	                throw RangeError("Illegal capacity: 0 <= "+capacity);
	        }
	        if (this.buffer.byteLength < capacity) {
	            var buffer = new ArrayBuffer(capacity);
	            var view = new Uint8Array(buffer);
	            view.set(this.view);
	            this.buffer = buffer;
	            this.view = view;
	        }
	        return this;
	    };
	    /**
	     * Reverses this ByteBuffer's contents.
	     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.reverse = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        if (begin === end)
	            return this; // Nothing to reverse
	        Array.prototype.reverse.call(this.view.subarray(begin, end));
	        return this;
	    };
	    /**
	     * Skips the next `length` bytes. This will just advance
	     * @param {number} length Number of bytes to skip. May also be negative to move the offset back.
	     * @returns {!ByteBuffer} this
	     * @expose
	     */
	    ByteBufferPrototype.skip = function(length) {
	        if (!this.noAssert) {
	            if (typeof length !== 'number' || length % 1 !== 0)
	                throw TypeError("Illegal length: "+length+" (not an integer)");
	            length |= 0;
	        }
	        var offset = this.offset + length;
	        if (!this.noAssert) {
	            if (offset < 0 || offset > this.buffer.byteLength)
	                throw RangeError("Illegal length: 0 <= "+this.offset+" + "+length+" <= "+this.buffer.byteLength);
	        }
	        this.offset = offset;
	        return this;
	    };

	    /**
	     * Slices this ByteBuffer by creating a cloned instance with `offset = begin` and `limit = end`.
	     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
	     * @returns {!ByteBuffer} Clone of this ByteBuffer with slicing applied, backed by the same {@link ByteBuffer#buffer}
	     * @expose
	     */
	    ByteBufferPrototype.slice = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        var bb = this.clone();
	        bb.offset = begin;
	        bb.limit = end;
	        return bb;
	    };
	    /**
	     * Returns a copy of the backing buffer that contains this ByteBuffer's contents. Contents are the bytes between
	     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
	     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory if
	     *  possible. Defaults to `false`
	     * @returns {!ArrayBuffer} Contents as an ArrayBuffer
	     * @expose
	     */
	    ByteBufferPrototype.toBuffer = function(forceCopy) {
	        var offset = this.offset,
	            limit = this.limit;
	        if (!this.noAssert) {
	            if (typeof offset !== 'number' || offset % 1 !== 0)
	                throw TypeError("Illegal offset: Not an integer");
	            offset >>>= 0;
	            if (typeof limit !== 'number' || limit % 1 !== 0)
	                throw TypeError("Illegal limit: Not an integer");
	            limit >>>= 0;
	            if (offset < 0 || offset > limit || limit > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+offset+" <= "+limit+" <= "+this.buffer.byteLength);
	        }
	        // NOTE: It's not possible to have another ArrayBuffer reference the same memory as the backing buffer. This is
	        // possible with Uint8Array#subarray only, but we have to return an ArrayBuffer by contract. So:
	        if (!forceCopy && offset === 0 && limit === this.buffer.byteLength)
	            return this.buffer;
	        if (offset === limit)
	            return EMPTY_BUFFER;
	        var buffer = new ArrayBuffer(limit - offset);
	        new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(offset, limit), 0);
	        return buffer;
	    };

	    /**
	     * Returns a raw buffer compacted to contain this ByteBuffer's contents. Contents are the bytes between
	     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. This is an alias of {@link ByteBuffer#toBuffer}.
	     * @function
	     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory.
	     *  Defaults to `false`
	     * @returns {!ArrayBuffer} Contents as an ArrayBuffer
	     * @expose
	     */
	    ByteBufferPrototype.toArrayBuffer = ByteBufferPrototype.toBuffer;

	    /**
	     * Converts the ByteBuffer's contents to a string.
	     * @param {string=} encoding Output encoding. Returns an informative string representation if omitted but also allows
	     *  direct conversion to "utf8", "hex", "base64" and "binary" encoding. "debug" returns a hex representation with
	     *  highlighted offsets.
	     * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
	     * @returns {string} String representation
	     * @throws {Error} If `encoding` is invalid
	     * @expose
	     */
	    ByteBufferPrototype.toString = function(encoding, begin, end) {
	        if (typeof encoding === 'undefined')
	            return "ByteBufferAB(offset="+this.offset+",markedOffset="+this.markedOffset+",limit="+this.limit+",capacity="+this.capacity()+")";
	        if (typeof encoding === 'number')
	            encoding = "utf8",
	            begin = encoding,
	            end = begin;
	        switch (encoding) {
	            case "utf8":
	                return this.toUTF8(begin, end);
	            case "base64":
	                return this.toBase64(begin, end);
	            case "hex":
	                return this.toHex(begin, end);
	            case "binary":
	                return this.toBinary(begin, end);
	            case "debug":
	                return this.toDebug();
	            case "columns":
	                return this.toColumns();
	            default:
	                throw Error("Unsupported encoding: "+encoding);
	        }
	    };

	    // lxiv-embeddable

	    /**
	     * lxiv-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
	     * Released under the Apache License, Version 2.0
	     * see: https://github.com/dcodeIO/lxiv for details
	     */
	    var lxiv = function() {

	        /**
	         * lxiv namespace.
	         * @type {!Object.<string,*>}
	         * @exports lxiv
	         */
	        var lxiv = {};

	        /**
	         * Character codes for output.
	         * @type {!Array.<number>}
	         * @inner
	         */
	        var aout = [
	            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
	            81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
	            103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
	            119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
	        ];

	        /**
	         * Character codes for input.
	         * @type {!Array.<number>}
	         * @inner
	         */
	        var ain = [];
	        for (var i=0, k=aout.length; i<k; ++i)
	            ain[aout[i]] = i;

	        /**
	         * Encodes bytes to base64 char codes.
	         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if
	         *  there are no more bytes left.
	         * @param {!function(number)} dst Characters destination as a function successively called with each encoded char
	         *  code.
	         */
	        lxiv.encode = function(src, dst) {
	            var b, t;
	            while ((b = src()) !== null) {
	                dst(aout[(b>>2)&0x3f]);
	                t = (b&0x3)<<4;
	                if ((b = src()) !== null) {
	                    t |= (b>>4)&0xf;
	                    dst(aout[(t|((b>>4)&0xf))&0x3f]);
	                    t = (b&0xf)<<2;
	                    if ((b = src()) !== null)
	                        dst(aout[(t|((b>>6)&0x3))&0x3f]),
	                        dst(aout[b&0x3f]);
	                    else
	                        dst(aout[t&0x3f]),
	                        dst(61);
	                } else
	                    dst(aout[t&0x3f]),
	                    dst(61),
	                    dst(61);
	            }
	        };

	        /**
	         * Decodes base64 char codes to bytes.
	         * @param {!function():number|null} src Characters source as a function returning the next char code respectively
	         *  `null` if there are no more characters left.
	         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
	         * @throws {Error} If a character code is invalid
	         */
	        lxiv.decode = function(src, dst) {
	            var c, t1, t2;
	            function fail(c) {
	                throw Error("Illegal character code: "+c);
	            }
	            while ((c = src()) !== null) {
	                t1 = ain[c];
	                if (typeof t1 === 'undefined') fail(c);
	                if ((c = src()) !== null) {
	                    t2 = ain[c];
	                    if (typeof t2 === 'undefined') fail(c);
	                    dst((t1<<2)>>>0|(t2&0x30)>>4);
	                    if ((c = src()) !== null) {
	                        t1 = ain[c];
	                        if (typeof t1 === 'undefined')
	                            if (c === 61) break; else fail(c);
	                        dst(((t2&0xf)<<4)>>>0|(t1&0x3c)>>2);
	                        if ((c = src()) !== null) {
	                            t2 = ain[c];
	                            if (typeof t2 === 'undefined')
	                                if (c === 61) break; else fail(c);
	                            dst(((t1&0x3)<<6)>>>0|t2);
	                        }
	                    }
	                }
	            }
	        };

	        /**
	         * Tests if a string is valid base64.
	         * @param {string} str String to test
	         * @returns {boolean} `true` if valid, otherwise `false`
	         */
	        lxiv.test = function(str) {
	            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
	        };

	        return lxiv;
	    }();

	    // encodings/base64

	    /**
	     * Encodes this ByteBuffer's contents to a base64 encoded string.
	     * @param {number=} begin Offset to begin at, defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}.
	     * @returns {string} Base64 encoded string
	     * @throws {RangeError} If `begin` or `end` is out of bounds
	     * @expose
	     */
	    ByteBufferPrototype.toBase64 = function(begin, end) {
	        if (typeof begin === 'undefined')
	            begin = this.offset;
	        if (typeof end === 'undefined')
	            end = this.limit;
	        begin = begin | 0; end = end | 0;
	        if (begin < 0 || end > this.capacity || begin > end)
	            throw RangeError("begin, end");
	        var sd; lxiv.encode(function() {
	            return begin < end ? this.view[begin++] : null;
	        }.bind(this), sd = stringDestination());
	        return sd();
	    };

	    /**
	     * Decodes a base64 encoded string to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromBase64 = function(str, littleEndian) {
	        if (typeof str !== 'string')
	            throw TypeError("str");
	        var bb = new ByteBuffer(str.length/4*3, littleEndian),
	            i = 0;
	        lxiv.decode(stringSource(str), function(b) {
	            bb.view[i++] = b;
	        });
	        bb.limit = i;
	        return bb;
	    };

	    /**
	     * Encodes a binary string to base64 like `window.btoa` does.
	     * @param {string} str Binary string
	     * @returns {string} Base64 encoded string
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
	     * @expose
	     */
	    ByteBuffer.btoa = function(str) {
	        return ByteBuffer.fromBinary(str).toBase64();
	    };

	    /**
	     * Decodes a base64 encoded string to binary like `window.atob` does.
	     * @param {string} b64 Base64 encoded string
	     * @returns {string} Binary string
	     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window.atob
	     * @expose
	     */
	    ByteBuffer.atob = function(b64) {
	        return ByteBuffer.fromBase64(b64).toBinary();
	    };

	    // encodings/binary

	    /**
	     * Encodes this ByteBuffer to a binary encoded string, that is using only characters 0x00-0xFF as bytes.
	     * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
	     * @returns {string} Binary encoded string
	     * @throws {RangeError} If `offset > limit`
	     * @expose
	     */
	    ByteBufferPrototype.toBinary = function(begin, end) {
	        if (typeof begin === 'undefined')
	            begin = this.offset;
	        if (typeof end === 'undefined')
	            end = this.limit;
	        begin |= 0; end |= 0;
	        if (begin < 0 || end > this.capacity() || begin > end)
	            throw RangeError("begin, end");
	        if (begin === end)
	            return "";
	        var chars = [],
	            parts = [];
	        while (begin < end) {
	            chars.push(this.view[begin++]);
	            if (chars.length >= 1024)
	                parts.push(String.fromCharCode.apply(String, chars)),
	                chars = [];
	        }
	        return parts.join('') + String.fromCharCode.apply(String, chars);
	    };

	    /**
	     * Decodes a binary encoded string, that is using only characters 0x00-0xFF as bytes, to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromBinary = function(str, littleEndian) {
	        if (typeof str !== 'string')
	            throw TypeError("str");
	        var i = 0,
	            k = str.length,
	            charCode,
	            bb = new ByteBuffer(k, littleEndian);
	        while (i<k) {
	            charCode = str.charCodeAt(i);
	            if (charCode > 0xff)
	                throw RangeError("illegal char code: "+charCode);
	            bb.view[i++] = charCode;
	        }
	        bb.limit = k;
	        return bb;
	    };

	    // encodings/debug

	    /**
	     * Encodes this ByteBuffer to a hex encoded string with marked offsets. Offset symbols are:
	     * * `<` : offset,
	     * * `'` : markedOffset,
	     * * `>` : limit,
	     * * `|` : offset and limit,
	     * * `[` : offset and markedOffset,
	     * * `]` : markedOffset and limit,
	     * * `!` : offset, markedOffset and limit
	     * @param {boolean=} columns If `true` returns two columns hex + ascii, defaults to `false`
	     * @returns {string|!Array.<string>} Debug string or array of lines if `asArray = true`
	     * @expose
	     * @example `>00'01 02<03` contains four bytes with `limit=0, markedOffset=1, offset=3`
	     * @example `00[01 02 03>` contains four bytes with `offset=markedOffset=1, limit=4`
	     * @example `00|01 02 03` contains four bytes with `offset=limit=1, markedOffset=-1`
	     * @example `|` contains zero bytes with `offset=limit=0, markedOffset=-1`
	     */
	    ByteBufferPrototype.toDebug = function(columns) {
	        var i = -1,
	            k = this.buffer.byteLength,
	            b,
	            hex = "",
	            asc = "",
	            out = "";
	        while (i<k) {
	            if (i !== -1) {
	                b = this.view[i];
	                if (b < 0x10) hex += "0"+b.toString(16).toUpperCase();
	                else hex += b.toString(16).toUpperCase();
	                if (columns)
	                    asc += b > 32 && b < 127 ? String.fromCharCode(b) : '.';
	            }
	            ++i;
	            if (columns) {
	                if (i > 0 && i % 16 === 0 && i !== k) {
	                    while (hex.length < 3*16+3) hex += " ";
	                    out += hex+asc+"\n";
	                    hex = asc = "";
	                }
	            }
	            if (i === this.offset && i === this.limit)
	                hex += i === this.markedOffset ? "!" : "|";
	            else if (i === this.offset)
	                hex += i === this.markedOffset ? "[" : "<";
	            else if (i === this.limit)
	                hex += i === this.markedOffset ? "]" : ">";
	            else
	                hex += i === this.markedOffset ? "'" : (columns || (i !== 0 && i !== k) ? " " : "");
	        }
	        if (columns && hex !== " ") {
	            while (hex.length < 3*16+3)
	                hex += " ";
	            out += hex + asc + "\n";
	        }
	        return columns ? out : hex;
	    };

	    /**
	     * Decodes a hex encoded string with marked offsets to a ByteBuffer.
	     * @param {string} str Debug string to decode (not be generated with `columns = true`)
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     * @see ByteBuffer#toDebug
	     */
	    ByteBuffer.fromDebug = function(str, littleEndian, noAssert) {
	        var k = str.length,
	            bb = new ByteBuffer(((k+1)/3)|0, littleEndian, noAssert);
	        var i = 0, j = 0, ch, b,
	            rs = false, // Require symbol next
	            ho = false, hm = false, hl = false, // Already has offset (ho), markedOffset (hm), limit (hl)?
	            fail = false;
	        while (i<k) {
	            switch (ch = str.charAt(i++)) {
	                case '!':
	                    if (!noAssert) {
	                        if (ho || hm || hl) {
	                            fail = true;
	                            break;
	                        }
	                        ho = hm = hl = true;
	                    }
	                    bb.offset = bb.markedOffset = bb.limit = j;
	                    rs = false;
	                    break;
	                case '|':
	                    if (!noAssert) {
	                        if (ho || hl) {
	                            fail = true;
	                            break;
	                        }
	                        ho = hl = true;
	                    }
	                    bb.offset = bb.limit = j;
	                    rs = false;
	                    break;
	                case '[':
	                    if (!noAssert) {
	                        if (ho || hm) {
	                            fail = true;
	                            break;
	                        }
	                        ho = hm = true;
	                    }
	                    bb.offset = bb.markedOffset = j;
	                    rs = false;
	                    break;
	                case '<':
	                    if (!noAssert) {
	                        if (ho) {
	                            fail = true;
	                            break;
	                        }
	                        ho = true;
	                    }
	                    bb.offset = j;
	                    rs = false;
	                    break;
	                case ']':
	                    if (!noAssert) {
	                        if (hl || hm) {
	                            fail = true;
	                            break;
	                        }
	                        hl = hm = true;
	                    }
	                    bb.limit = bb.markedOffset = j;
	                    rs = false;
	                    break;
	                case '>':
	                    if (!noAssert) {
	                        if (hl) {
	                            fail = true;
	                            break;
	                        }
	                        hl = true;
	                    }
	                    bb.limit = j;
	                    rs = false;
	                    break;
	                case "'":
	                    if (!noAssert) {
	                        if (hm) {
	                            fail = true;
	                            break;
	                        }
	                        hm = true;
	                    }
	                    bb.markedOffset = j;
	                    rs = false;
	                    break;
	                case ' ':
	                    rs = false;
	                    break;
	                default:
	                    if (!noAssert) {
	                        if (rs) {
	                            fail = true;
	                            break;
	                        }
	                    }
	                    b = parseInt(ch+str.charAt(i++), 16);
	                    if (!noAssert) {
	                        if (isNaN(b) || b < 0 || b > 255)
	                            throw TypeError("Illegal str: Not a debug encoded string");
	                    }
	                    bb.view[j++] = b;
	                    rs = true;
	            }
	            if (fail)
	                throw TypeError("Illegal str: Invalid symbol at "+i);
	        }
	        if (!noAssert) {
	            if (!ho || !hl)
	                throw TypeError("Illegal str: Missing offset or limit");
	            if (j<bb.buffer.byteLength)
	                throw TypeError("Illegal str: Not a debug encoded string (is it hex?) "+j+" < "+k);
	        }
	        return bb;
	    };

	    // encodings/hex

	    /**
	     * Encodes this ByteBuffer's contents to a hex encoded string.
	     * @param {number=} begin Offset to begin at. Defaults to {@link ByteBuffer#offset}.
	     * @param {number=} end Offset to end at. Defaults to {@link ByteBuffer#limit}.
	     * @returns {string} Hex encoded string
	     * @expose
	     */
	    ByteBufferPrototype.toHex = function(begin, end) {
	        begin = typeof begin === 'undefined' ? this.offset : begin;
	        end = typeof end === 'undefined' ? this.limit : end;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        var out = new Array(end - begin),
	            b;
	        while (begin < end) {
	            b = this.view[begin++];
	            if (b < 0x10)
	                out.push("0", b.toString(16));
	            else out.push(b.toString(16));
	        }
	        return out.join('');
	    };

	    /**
	     * Decodes a hex encoded string to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromHex = function(str, littleEndian, noAssert) {
	        if (!noAssert) {
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	            if (str.length % 2 !== 0)
	                throw TypeError("Illegal str: Length not a multiple of 2");
	        }
	        var k = str.length,
	            bb = new ByteBuffer((k / 2) | 0, littleEndian),
	            b;
	        for (var i=0, j=0; i<k; i+=2) {
	            b = parseInt(str.substring(i, i+2), 16);
	            if (!noAssert)
	                if (!isFinite(b) || b < 0 || b > 255)
	                    throw TypeError("Illegal str: Contains non-hex characters");
	            bb.view[j++] = b;
	        }
	        bb.limit = j;
	        return bb;
	    };

	    // utfx-embeddable

	    /**
	     * utfx-embeddable (c) 2014 Daniel Wirtz <dcode@dcode.io>
	     * Released under the Apache License, Version 2.0
	     * see: https://github.com/dcodeIO/utfx for details
	     */
	    var utfx = function() {

	        /**
	         * utfx namespace.
	         * @inner
	         * @type {!Object.<string,*>}
	         */
	        var utfx = {};

	        /**
	         * Maximum valid code point.
	         * @type {number}
	         * @const
	         */
	        utfx.MAX_CODEPOINT = 0x10FFFF;

	        /**
	         * Encodes UTF8 code points to UTF8 bytes.
	         * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
	         *  respectively `null` if there are no more code points left or a single numeric code point.
	         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte
	         */
	        utfx.encodeUTF8 = function(src, dst) {
	            var cp = null;
	            if (typeof src === 'number')
	                cp = src,
	                src = function() { return null; };
	            while (cp !== null || (cp = src()) !== null) {
	                if (cp < 0x80)
	                    dst(cp&0x7F);
	                else if (cp < 0x800)
	                    dst(((cp>>6)&0x1F)|0xC0),
	                    dst((cp&0x3F)|0x80);
	                else if (cp < 0x10000)
	                    dst(((cp>>12)&0x0F)|0xE0),
	                    dst(((cp>>6)&0x3F)|0x80),
	                    dst((cp&0x3F)|0x80);
	                else
	                    dst(((cp>>18)&0x07)|0xF0),
	                    dst(((cp>>12)&0x3F)|0x80),
	                    dst(((cp>>6)&0x3F)|0x80),
	                    dst((cp&0x3F)|0x80);
	                cp = null;
	            }
	        };

	        /**
	         * Decodes UTF8 bytes to UTF8 code points.
	         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
	         *  are no more bytes left.
	         * @param {!function(number)} dst Code points destination as a function successively called with each decoded code point.
	         * @throws {RangeError} If a starting byte is invalid in UTF8
	         * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
	         *  remaining bytes.
	         */
	        utfx.decodeUTF8 = function(src, dst) {
	            var a, b, c, d, fail = function(b) {
	                b = b.slice(0, b.indexOf(null));
	                var err = Error(b.toString());
	                err.name = "TruncatedError";
	                err['bytes'] = b;
	                throw err;
	            };
	            while ((a = src()) !== null) {
	                if ((a&0x80) === 0)
	                    dst(a);
	                else if ((a&0xE0) === 0xC0)
	                    ((b = src()) === null) && fail([a, b]),
	                    dst(((a&0x1F)<<6) | (b&0x3F));
	                else if ((a&0xF0) === 0xE0)
	                    ((b=src()) === null || (c=src()) === null) && fail([a, b, c]),
	                    dst(((a&0x0F)<<12) | ((b&0x3F)<<6) | (c&0x3F));
	                else if ((a&0xF8) === 0xF0)
	                    ((b=src()) === null || (c=src()) === null || (d=src()) === null) && fail([a, b, c ,d]),
	                    dst(((a&0x07)<<18) | ((b&0x3F)<<12) | ((c&0x3F)<<6) | (d&0x3F));
	                else throw RangeError("Illegal starting byte: "+a);
	            }
	        };

	        /**
	         * Converts UTF16 characters to UTF8 code points.
	         * @param {!function():number|null} src Characters source as a function returning the next char code respectively
	         *  `null` if there are no more characters left.
	         * @param {!function(number)} dst Code points destination as a function successively called with each converted code
	         *  point.
	         */
	        utfx.UTF16toUTF8 = function(src, dst) {
	            var c1, c2 = null;
	            while (true) {
	                if ((c1 = c2 !== null ? c2 : src()) === null)
	                    break;
	                if (c1 >= 0xD800 && c1 <= 0xDFFF) {
	                    if ((c2 = src()) !== null) {
	                        if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
	                            dst((c1-0xD800)*0x400+c2-0xDC00+0x10000);
	                            c2 = null; continue;
	                        }
	                    }
	                }
	                dst(c1);
	            }
	            if (c2 !== null) dst(c2);
	        };

	        /**
	         * Converts UTF8 code points to UTF16 characters.
	         * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
	         *  respectively `null` if there are no more code points left or a single numeric code point.
	         * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
	         * @throws {RangeError} If a code point is out of range
	         */
	        utfx.UTF8toUTF16 = function(src, dst) {
	            var cp = null;
	            if (typeof src === 'number')
	                cp = src, src = function() { return null; };
	            while (cp !== null || (cp = src()) !== null) {
	                if (cp <= 0xFFFF)
	                    dst(cp);
	                else
	                    cp -= 0x10000,
	                    dst((cp>>10)+0xD800),
	                    dst((cp%0x400)+0xDC00);
	                cp = null;
	            }
	        };

	        /**
	         * Converts and encodes UTF16 characters to UTF8 bytes.
	         * @param {!function():number|null} src Characters source as a function returning the next char code respectively `null`
	         *  if there are no more characters left.
	         * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
	         */
	        utfx.encodeUTF16toUTF8 = function(src, dst) {
	            utfx.UTF16toUTF8(src, function(cp) {
	                utfx.encodeUTF8(cp, dst);
	            });
	        };

	        /**
	         * Decodes and converts UTF8 bytes to UTF16 characters.
	         * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
	         *  are no more bytes left.
	         * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
	         * @throws {RangeError} If a starting byte is invalid in UTF8
	         * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
	         */
	        utfx.decodeUTF8toUTF16 = function(src, dst) {
	            utfx.decodeUTF8(src, function(cp) {
	                utfx.UTF8toUTF16(cp, dst);
	            });
	        };

	        /**
	         * Calculates the byte length of an UTF8 code point.
	         * @param {number} cp UTF8 code point
	         * @returns {number} Byte length
	         */
	        utfx.calculateCodePoint = function(cp) {
	            return (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
	        };

	        /**
	         * Calculates the number of UTF8 bytes required to store UTF8 code points.
	         * @param {(!function():number|null)} src Code points source as a function returning the next code point respectively
	         *  `null` if there are no more code points left.
	         * @returns {number} The number of UTF8 bytes required
	         */
	        utfx.calculateUTF8 = function(src) {
	            var cp, l=0;
	            while ((cp = src()) !== null)
	                l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
	            return l;
	        };

	        /**
	         * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
	         * @param {(!function():number|null)} src Characters source as a function returning the next char code respectively
	         *  `null` if there are no more characters left.
	         * @returns {!Array.<number>} The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
	         */
	        utfx.calculateUTF16asUTF8 = function(src) {
	            var n=0, l=0;
	            utfx.UTF16toUTF8(src, function(cp) {
	                ++n; l += (cp < 0x80) ? 1 : (cp < 0x800) ? 2 : (cp < 0x10000) ? 3 : 4;
	            });
	            return [n,l];
	        };

	        return utfx;
	    }();

	    // encodings/utf8

	    /**
	     * Encodes this ByteBuffer's contents between {@link ByteBuffer#offset} and {@link ByteBuffer#limit} to an UTF8 encoded
	     *  string.
	     * @returns {string} Hex encoded string
	     * @throws {RangeError} If `offset > limit`
	     * @expose
	     */
	    ByteBufferPrototype.toUTF8 = function(begin, end) {
	        if (typeof begin === 'undefined') begin = this.offset;
	        if (typeof end === 'undefined') end = this.limit;
	        if (!this.noAssert) {
	            if (typeof begin !== 'number' || begin % 1 !== 0)
	                throw TypeError("Illegal begin: Not an integer");
	            begin >>>= 0;
	            if (typeof end !== 'number' || end % 1 !== 0)
	                throw TypeError("Illegal end: Not an integer");
	            end >>>= 0;
	            if (begin < 0 || begin > end || end > this.buffer.byteLength)
	                throw RangeError("Illegal range: 0 <= "+begin+" <= "+end+" <= "+this.buffer.byteLength);
	        }
	        var sd; try {
	            utfx.decodeUTF8toUTF16(function() {
	                return begin < end ? this.view[begin++] : null;
	            }.bind(this), sd = stringDestination());
	        } catch (e) {
	            if (begin !== end)
	                throw RangeError("Illegal range: Truncated data, "+begin+" != "+end);
	        }
	        return sd();
	    };

	    /**
	     * Decodes an UTF8 encoded string to a ByteBuffer.
	     * @param {string} str String to decode
	     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to
	     *  {@link ByteBuffer.DEFAULT_ENDIAN}.
	     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to
	     *  {@link ByteBuffer.DEFAULT_NOASSERT}.
	     * @returns {!ByteBuffer} ByteBuffer
	     * @expose
	     */
	    ByteBuffer.fromUTF8 = function(str, littleEndian, noAssert) {
	        if (!noAssert)
	            if (typeof str !== 'string')
	                throw TypeError("Illegal str: Not a string");
	        var bb = new ByteBuffer(utfx.calculateUTF16asUTF8(stringSource(str), true)[1], littleEndian, noAssert),
	            i = 0;
	        utfx.encodeUTF16toUTF8(stringSource(str), function(b) {
	            bb.view[i++] = b;
	        });
	        bb.limit = i;
	        return bb;
	    };

	    return ByteBuffer;
	});
	});

	var inherits_browser = createCommonjsModule(function (module) {
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	});

	var global$1 = (typeof global !== "undefined" ? global :
	            typeof self !== "undefined" ? self :
	            typeof window !== "undefined" ? window : {});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

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

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	var _kMaxLength = kMaxLength();

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length)
	}
	Buffer.isBuffer = isBuffer;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read$$1 (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read$$1(arr, i + j) !== read$$1(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

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

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	var require$$0 = /*#__PURE__*/Object.freeze({
		INSPECT_MAX_BYTES: INSPECT_MAX_BYTES,
		kMaxLength: _kMaxLength,
		Buffer: Buffer,
		SlowBuffer: SlowBuffer,
		isBuffer: isBuffer
	});

	var safeBuffer = createCommonjsModule(function (module, exports) {
	/* eslint-disable node/no-deprecated-api */

	var Buffer = require$$0.Buffer;

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key];
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = require$$0;
	} else {
	  // Copy properties from require('buffer')
	  copyProps(require$$0, exports);
	  exports.Buffer = SafeBuffer;
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer);

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	};

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size);
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding);
	    } else {
	      buf.fill(fill);
	    }
	  } else {
	    buf.fill(0);
	  }
	  return buf
	};

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	};

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return require$$0.SlowBuffer(size)
	};
	});
	var safeBuffer_1 = safeBuffer.Buffer;

	var Buffer$1 = safeBuffer.Buffer;

	// prototype class for hash functions
	function Hash (blockSize, finalSize) {
	  this._block = Buffer$1.alloc(blockSize);
	  this._finalSize = finalSize;
	  this._blockSize = blockSize;
	  this._len = 0;
	}

	Hash.prototype.update = function (data, enc) {
	  if (typeof data === 'string') {
	    enc = enc || 'utf8';
	    data = Buffer$1.from(data, enc);
	  }

	  var block = this._block;
	  var blockSize = this._blockSize;
	  var length = data.length;
	  var accum = this._len;

	  for (var offset = 0; offset < length;) {
	    var assigned = accum % blockSize;
	    var remainder = Math.min(length - offset, blockSize - assigned);

	    for (var i = 0; i < remainder; i++) {
	      block[assigned + i] = data[offset + i];
	    }

	    accum += remainder;
	    offset += remainder;

	    if ((accum % blockSize) === 0) {
	      this._update(block);
	    }
	  }

	  this._len += length;
	  return this
	};

	Hash.prototype.digest = function (enc) {
	  var rem = this._len % this._blockSize;

	  this._block[rem] = 0x80;

	  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
	  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
	  this._block.fill(0, rem + 1);

	  if (rem >= this._finalSize) {
	    this._update(this._block);
	    this._block.fill(0);
	  }

	  var bits = this._len * 8;

	  // uint32
	  if (bits <= 0xffffffff) {
	    this._block.writeUInt32BE(bits, this._blockSize - 4);

	  // uint64
	  } else {
	    var lowBits = (bits & 0xffffffff) >>> 0;
	    var highBits = (bits - lowBits) / 0x100000000;

	    this._block.writeUInt32BE(highBits, this._blockSize - 8);
	    this._block.writeUInt32BE(lowBits, this._blockSize - 4);
	  }

	  this._update(this._block);
	  var hash = this._hash();

	  return enc ? hash.toString(enc) : hash
	};

	Hash.prototype._update = function () {
	  throw new Error('_update must be implemented by subclass')
	};

	var hash = Hash;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
	 * in FIPS PUB 180-1
	 * This source code is derived from sha1.js of the same repository.
	 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
	 * operation was added.
	 */



	var Buffer$2 = safeBuffer.Buffer;

	var K = [
	  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W = new Array(80);

	function Sha () {
	  this.init();
	  this._w = W;

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha, hash);

	Sha.prototype.init = function () {
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;

	  return this
	};

	function rotl5 (num) {
	  return (num << 5) | (num >>> 27)
	}

	function rotl30 (num) {
	  return (num << 30) | (num >>> 2)
	}

	function ft (s, b, c, d) {
	  if (s === 0) return (b & c) | ((~b) & d)
	  if (s === 2) return (b & c) | (b & d) | (c & d)
	  return b ^ c ^ d
	}

	Sha.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];

	  for (var j = 0; j < 80; ++j) {
	    var s = ~~(j / 20);
	    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0;

	    e = d;
	    d = c;
	    c = rotl30(b);
	    b = a;
	    a = t;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	};

	Sha.prototype._hash = function () {
	  var H = Buffer$2.allocUnsafe(20);

	  H.writeInt32BE(this._a | 0, 0);
	  H.writeInt32BE(this._b | 0, 4);
	  H.writeInt32BE(this._c | 0, 8);
	  H.writeInt32BE(this._d | 0, 12);
	  H.writeInt32BE(this._e | 0, 16);

	  return H
	};

	var sha = Sha;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */



	var Buffer$3 = safeBuffer.Buffer;

	var K$1 = [
	  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W$1 = new Array(80);

	function Sha1 () {
	  this.init();
	  this._w = W$1;

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha1, hash);

	Sha1.prototype.init = function () {
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;

	  return this
	};

	function rotl1 (num) {
	  return (num << 1) | (num >>> 31)
	}

	function rotl5$1 (num) {
	  return (num << 5) | (num >>> 27)
	}

	function rotl30$1 (num) {
	  return (num << 30) | (num >>> 2)
	}

	function ft$1 (s, b, c, d) {
	  if (s === 0) return (b & c) | ((~b) & d)
	  if (s === 2) return (b & c) | (b & d) | (c & d)
	  return b ^ c ^ d
	}

	Sha1.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);

	  for (var j = 0; j < 80; ++j) {
	    var s = ~~(j / 20);
	    var t = (rotl5$1(a) + ft$1(s, b, c, d) + e + W[j] + K$1[s]) | 0;

	    e = d;
	    d = c;
	    c = rotl30$1(b);
	    b = a;
	    a = t;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	};

	Sha1.prototype._hash = function () {
	  var H = Buffer$3.allocUnsafe(20);

	  H.writeInt32BE(this._a | 0, 0);
	  H.writeInt32BE(this._b | 0, 4);
	  H.writeInt32BE(this._c | 0, 8);
	  H.writeInt32BE(this._d | 0, 12);
	  H.writeInt32BE(this._e | 0, 16);

	  return H
	};

	var sha1 = Sha1;

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */



	var Buffer$4 = safeBuffer.Buffer;

	var K$2 = [
	  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	];

	var W$2 = new Array(64);

	function Sha256 () {
	  this.init();

	  this._w = W$2; // new Array(64)

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha256, hash);

	Sha256.prototype.init = function () {
	  this._a = 0x6a09e667;
	  this._b = 0xbb67ae85;
	  this._c = 0x3c6ef372;
	  this._d = 0xa54ff53a;
	  this._e = 0x510e527f;
	  this._f = 0x9b05688c;
	  this._g = 0x1f83d9ab;
	  this._h = 0x5be0cd19;

	  return this
	};

	function ch (x, y, z) {
	  return z ^ (x & (y ^ z))
	}

	function maj (x, y, z) {
	  return (x & y) | (z & (x | y))
	}

	function sigma0 (x) {
	  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
	}

	function sigma1 (x) {
	  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
	}

	function gamma0 (x) {
	  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
	}

	function gamma1 (x) {
	  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
	}

	Sha256.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;
	  var f = this._f | 0;
	  var g = this._g | 0;
	  var h = this._h | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0;

	  for (var j = 0; j < 64; ++j) {
	    var T1 = (h + sigma1(e) + ch(e, f, g) + K$2[j] + W[j]) | 0;
	    var T2 = (sigma0(a) + maj(a, b, c)) | 0;

	    h = g;
	    g = f;
	    f = e;
	    e = (d + T1) | 0;
	    d = c;
	    c = b;
	    b = a;
	    a = (T1 + T2) | 0;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	  this._f = (f + this._f) | 0;
	  this._g = (g + this._g) | 0;
	  this._h = (h + this._h) | 0;
	};

	Sha256.prototype._hash = function () {
	  var H = Buffer$4.allocUnsafe(32);

	  H.writeInt32BE(this._a, 0);
	  H.writeInt32BE(this._b, 4);
	  H.writeInt32BE(this._c, 8);
	  H.writeInt32BE(this._d, 12);
	  H.writeInt32BE(this._e, 16);
	  H.writeInt32BE(this._f, 20);
	  H.writeInt32BE(this._g, 24);
	  H.writeInt32BE(this._h, 28);

	  return H
	};

	var sha256 = Sha256;

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */




	var Buffer$5 = safeBuffer.Buffer;

	var W$3 = new Array(64);

	function Sha224 () {
	  this.init();

	  this._w = W$3; // new Array(64)

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha224, sha256);

	Sha224.prototype.init = function () {
	  this._a = 0xc1059ed8;
	  this._b = 0x367cd507;
	  this._c = 0x3070dd17;
	  this._d = 0xf70e5939;
	  this._e = 0xffc00b31;
	  this._f = 0x68581511;
	  this._g = 0x64f98fa7;
	  this._h = 0xbefa4fa4;

	  return this
	};

	Sha224.prototype._hash = function () {
	  var H = Buffer$5.allocUnsafe(28);

	  H.writeInt32BE(this._a, 0);
	  H.writeInt32BE(this._b, 4);
	  H.writeInt32BE(this._c, 8);
	  H.writeInt32BE(this._d, 12);
	  H.writeInt32BE(this._e, 16);
	  H.writeInt32BE(this._f, 20);
	  H.writeInt32BE(this._g, 24);

	  return H
	};

	var sha224 = Sha224;

	var Buffer$6 = safeBuffer.Buffer;

	var K$3 = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	var W$4 = new Array(160);

	function Sha512 () {
	  this.init();
	  this._w = W$4;

	  hash.call(this, 128, 112);
	}

	inherits_browser(Sha512, hash);

	Sha512.prototype.init = function () {
	  this._ah = 0x6a09e667;
	  this._bh = 0xbb67ae85;
	  this._ch = 0x3c6ef372;
	  this._dh = 0xa54ff53a;
	  this._eh = 0x510e527f;
	  this._fh = 0x9b05688c;
	  this._gh = 0x1f83d9ab;
	  this._hh = 0x5be0cd19;

	  this._al = 0xf3bcc908;
	  this._bl = 0x84caa73b;
	  this._cl = 0xfe94f82b;
	  this._dl = 0x5f1d36f1;
	  this._el = 0xade682d1;
	  this._fl = 0x2b3e6c1f;
	  this._gl = 0xfb41bd6b;
	  this._hl = 0x137e2179;

	  return this
	};

	function Ch (x, y, z) {
	  return z ^ (x & (y ^ z))
	}

	function maj$1 (x, y, z) {
	  return (x & y) | (z & (x | y))
	}

	function sigma0$1 (x, xl) {
	  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
	}

	function sigma1$1 (x, xl) {
	  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
	}

	function Gamma0 (x, xl) {
	  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
	}

	function Gamma0l (x, xl) {
	  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
	}

	function Gamma1 (x, xl) {
	  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
	}

	function Gamma1l (x, xl) {
	  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
	}

	function getCarry (a, b) {
	  return (a >>> 0) < (b >>> 0) ? 1 : 0
	}

	Sha512.prototype._update = function (M) {
	  var W = this._w;

	  var ah = this._ah | 0;
	  var bh = this._bh | 0;
	  var ch = this._ch | 0;
	  var dh = this._dh | 0;
	  var eh = this._eh | 0;
	  var fh = this._fh | 0;
	  var gh = this._gh | 0;
	  var hh = this._hh | 0;

	  var al = this._al | 0;
	  var bl = this._bl | 0;
	  var cl = this._cl | 0;
	  var dl = this._dl | 0;
	  var el = this._el | 0;
	  var fl = this._fl | 0;
	  var gl = this._gl | 0;
	  var hl = this._hl | 0;

	  for (var i = 0; i < 32; i += 2) {
	    W[i] = M.readInt32BE(i * 4);
	    W[i + 1] = M.readInt32BE(i * 4 + 4);
	  }
	  for (; i < 160; i += 2) {
	    var xh = W[i - 15 * 2];
	    var xl = W[i - 15 * 2 + 1];
	    var gamma0 = Gamma0(xh, xl);
	    var gamma0l = Gamma0l(xl, xh);

	    xh = W[i - 2 * 2];
	    xl = W[i - 2 * 2 + 1];
	    var gamma1 = Gamma1(xh, xl);
	    var gamma1l = Gamma1l(xl, xh);

	    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	    var Wi7h = W[i - 7 * 2];
	    var Wi7l = W[i - 7 * 2 + 1];

	    var Wi16h = W[i - 16 * 2];
	    var Wi16l = W[i - 16 * 2 + 1];

	    var Wil = (gamma0l + Wi7l) | 0;
	    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0;
	    Wil = (Wil + gamma1l) | 0;
	    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0;
	    Wil = (Wil + Wi16l) | 0;
	    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0;

	    W[i] = Wih;
	    W[i + 1] = Wil;
	  }

	  for (var j = 0; j < 160; j += 2) {
	    Wih = W[j];
	    Wil = W[j + 1];

	    var majh = maj$1(ah, bh, ch);
	    var majl = maj$1(al, bl, cl);

	    var sigma0h = sigma0$1(ah, al);
	    var sigma0l = sigma0$1(al, ah);
	    var sigma1h = sigma1$1(eh, el);
	    var sigma1l = sigma1$1(el, eh);

	    // t1 = h + sigma1 + ch + K[j] + W[j]
	    var Kih = K$3[j];
	    var Kil = K$3[j + 1];

	    var chh = Ch(eh, fh, gh);
	    var chl = Ch(el, fl, gl);

	    var t1l = (hl + sigma1l) | 0;
	    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0;
	    t1l = (t1l + chl) | 0;
	    t1h = (t1h + chh + getCarry(t1l, chl)) | 0;
	    t1l = (t1l + Kil) | 0;
	    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0;
	    t1l = (t1l + Wil) | 0;
	    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0;

	    // t2 = sigma0 + maj
	    var t2l = (sigma0l + majl) | 0;
	    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0;

	    hh = gh;
	    hl = gl;
	    gh = fh;
	    gl = fl;
	    fh = eh;
	    fl = el;
	    el = (dl + t1l) | 0;
	    eh = (dh + t1h + getCarry(el, dl)) | 0;
	    dh = ch;
	    dl = cl;
	    ch = bh;
	    cl = bl;
	    bh = ah;
	    bl = al;
	    al = (t1l + t2l) | 0;
	    ah = (t1h + t2h + getCarry(al, t1l)) | 0;
	  }

	  this._al = (this._al + al) | 0;
	  this._bl = (this._bl + bl) | 0;
	  this._cl = (this._cl + cl) | 0;
	  this._dl = (this._dl + dl) | 0;
	  this._el = (this._el + el) | 0;
	  this._fl = (this._fl + fl) | 0;
	  this._gl = (this._gl + gl) | 0;
	  this._hl = (this._hl + hl) | 0;

	  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0;
	  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0;
	  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0;
	  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0;
	  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0;
	  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0;
	  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0;
	  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0;
	};

	Sha512.prototype._hash = function () {
	  var H = Buffer$6.allocUnsafe(64);

	  function writeInt64BE (h, l, offset) {
	    H.writeInt32BE(h, offset);
	    H.writeInt32BE(l, offset + 4);
	  }

	  writeInt64BE(this._ah, this._al, 0);
	  writeInt64BE(this._bh, this._bl, 8);
	  writeInt64BE(this._ch, this._cl, 16);
	  writeInt64BE(this._dh, this._dl, 24);
	  writeInt64BE(this._eh, this._el, 32);
	  writeInt64BE(this._fh, this._fl, 40);
	  writeInt64BE(this._gh, this._gl, 48);
	  writeInt64BE(this._hh, this._hl, 56);

	  return H
	};

	var sha512 = Sha512;

	var Buffer$7 = safeBuffer.Buffer;

	var W$5 = new Array(160);

	function Sha384 () {
	  this.init();
	  this._w = W$5;

	  hash.call(this, 128, 112);
	}

	inherits_browser(Sha384, sha512);

	Sha384.prototype.init = function () {
	  this._ah = 0xcbbb9d5d;
	  this._bh = 0x629a292a;
	  this._ch = 0x9159015a;
	  this._dh = 0x152fecd8;
	  this._eh = 0x67332667;
	  this._fh = 0x8eb44a87;
	  this._gh = 0xdb0c2e0d;
	  this._hh = 0x47b5481d;

	  this._al = 0xc1059ed8;
	  this._bl = 0x367cd507;
	  this._cl = 0x3070dd17;
	  this._dl = 0xf70e5939;
	  this._el = 0xffc00b31;
	  this._fl = 0x68581511;
	  this._gl = 0x64f98fa7;
	  this._hl = 0xbefa4fa4;

	  return this
	};

	Sha384.prototype._hash = function () {
	  var H = Buffer$7.allocUnsafe(48);

	  function writeInt64BE (h, l, offset) {
	    H.writeInt32BE(h, offset);
	    H.writeInt32BE(l, offset + 4);
	  }

	  writeInt64BE(this._ah, this._al, 0);
	  writeInt64BE(this._bh, this._bl, 8);
	  writeInt64BE(this._ch, this._cl, 16);
	  writeInt64BE(this._dh, this._dl, 24);
	  writeInt64BE(this._eh, this._el, 32);
	  writeInt64BE(this._fh, this._fl, 40);

	  return H
	};

	var sha384 = Sha384;

	var sha_js = createCommonjsModule(function (module) {
	var exports = module.exports = function SHA (algorithm) {
	  algorithm = algorithm.toLowerCase();

	  var Algorithm = exports[algorithm];
	  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

	  return new Algorithm()
	};

	exports.sha = sha;
	exports.sha1 = sha1;
	exports.sha224 = sha224;
	exports.sha256 = sha256;
	exports.sha384 = sha384;
	exports.sha512 = sha512;
	});

	// return a new zero fee object
	const getZeroFee = () => ({
	    amount: [],
	    gas: '0'
	});
	function encodeTx(msgs, rawPubKey, rawSigDER, seq) {
	    const stdSig = {
	        pub_key: convertToInternalPubKey(rawPubKey, _TYPE.PubKeySecp256k1),
	        signature: bytebuffer.fromHex(rawSigDER).toString('base64'),
	        account_number: '0',
	        sequence: String(seq)
	    };
	    const stdTx = {
	        msg: msgs,
	        signatures: [stdSig],
	        fee: getZeroFee()
	    };
	    const jsonStr = JSON.stringify(number2StringInObject(stdTx));
	    return bytebuffer.btoa(jsonStr);
	}
	function decodeObject(result) {
	    var decodedResult = Object.assign({}, result);
	    var keys = Object.keys(result);
	    if (keys.length === 1 && keys[0] === 'amount' && !isNaN(decodedResult.amount)) {
	        decodedResult.amount = String(Number(decodedResult.amount) / 100000);
	        return decodedResult;
	    }
	    if (typeof result === 'string') {
	        return String(result);
	    }
	    if (result instanceof Array) {
	        decodedResult = [];
	        result.forEach(element => {
	            decodedResult.push(decodeObject(element));
	        });
	    }
	    else {
	        for (var index in keys) {
	            var key = keys[index];
	            if (decodedResult[key] !== null &&
	                typeof decodedResult[key] !== 'string' &&
	                typeof decodedResult[key] !== 'boolean') {
	                decodedResult[key] = decodeObject(result[key]);
	            }
	        }
	    }
	    return decodedResult;
	}
	function encodeObject(result) {
	    var encodeResult = Object.assign({}, result);
	    var keys = Object.keys(result);
	    if (keys.length === 1 && keys[0] === 'amount' && !isNaN(encodeResult.amount)) {
	        encodeResult.amount = String(Number(encodeResult.amount) * 100000);
	        return encodeResult;
	    }
	    if (typeof result === 'string') {
	        return String(result);
	    }
	    if (result instanceof Array) {
	        encodeResult = [];
	        result.forEach(element => {
	            encodeResult.push(encodeObject(element));
	        });
	    }
	    else {
	        for (var index in keys) {
	            var key = keys[index];
	            if (encodeResult[key] !== null &&
	                typeof encodeResult[key] !== 'string' &&
	                typeof encodeResult[key] !== 'boolean') {
	                encodeResult[key] = encodeObject(result[key]);
	            }
	        }
	    }
	    return encodeResult;
	}
	function encodeMsg(msg) {
	    var encodedMsg = Object.assign({}, msg);
	    if ('new_reset_public_key' in msg) {
	        encodedMsg.new_reset_public_key = convertToInternalPubKey(msg.new_reset_public_key, _TYPE.PubKeySecp256k1);
	    }
	    if ('new_transaction_public_key' in msg) {
	        encodedMsg.new_transaction_public_key = convertToInternalPubKey(msg.new_transaction_public_key, _TYPE.PubKeySecp256k1);
	    }
	    if ('new_app_public_key' in msg) {
	        encodedMsg.new_app_public_key = convertToInternalPubKey(msg.new_app_public_key, _TYPE.PubKeySecp256k1);
	    }
	    if ('validator_public_key' in msg) {
	        encodedMsg.validator_public_key = convertToInternalPubKey(msg.validator_public_key, _TYPE.PubKeyEd25519);
	    }
	    if ('public_key' in msg) {
	        encodedMsg.public_key = convertToInternalPubKey(msg.public_key, _TYPE.PubKeySecp256k1);
	    }
	    return encodedMsg;
	}
	function encodeSignMsg(stdMsg, chainId, seq) {
	    const fee = getZeroFee();
	    const stdSignMsg = {
	        account_number: '0',
	        chain_id: chainId,
	        fee: fee,
	        memo: '',
	        msgs: stdMsg,
	        sequence: String(seq)
	    };
	    const jsonStr = JSON.stringify(number2StringInObject(sortObject(stdSignMsg)));
	    const signMsgHash = sha_js('sha256')
	        .update(jsonStr)
	        .digest();
	    return signMsgHash;
	}
	function convertMsg(msg) {
	    var encodedMsg = Object.assign({}, msg);
	    if ('new_reset_public_key' in msg) {
	        var buffer = bytebuffer.fromHex(msg.new_reset_public_key);
	        encodedMsg.new_reset_public_key = getByteArray(buffer);
	    }
	    if ('new_transaction_public_key' in msg) {
	        var buffer = bytebuffer.fromHex(msg.new_transaction_public_key);
	        encodedMsg.new_transaction_public_key = getByteArray(buffer);
	    }
	    if ('new_app_public_key' in msg) {
	        var buffer = bytebuffer.fromHex(msg.new_app_public_key);
	        encodedMsg.new_app_public_key = getByteArray(buffer);
	    }
	    if ('validator_public_key' in msg) {
	        var buffer = bytebuffer.fromHex(msg.validator_public_key);
	        encodedMsg.validator_public_key = getByteArray(buffer);
	    }
	    return encodedMsg;
	}
	function getByteArray(buffer) {
	    let res = [];
	    for (var i = 0; i < buffer.limit; ++i) {
	        res.push(buffer.readUint8());
	    }
	    return res;
	}
	//decode std key to raw key, only support secp256k1 for now
	function decodePrivKey(privKeyHex) {
	    privKeyHex = privKeyHex.toUpperCase();
	    if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeySecp256k1)) {
	        return privKeyHex.slice(_PREFIX.PrefixPrivKeySecp256k1.length);
	    }
	    else if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeyEd25519)) {
	        return privKeyHex.slice(_PREFIX.PrefixPrivKeyEd25519.length);
	    }
	    throw new Error(`Decode priv key failed: ${privKeyHex}\n`);
	}
	function decodePubKey(pubKeyHex) {
	    pubKeyHex = pubKeyHex.toUpperCase();
	    if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeySecp256k1)) {
	        return pubKeyHex.slice(_PREFIX.PrefixPubKeySecp256k1.length);
	    }
	    else if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeyEd25519)) {
	        return pubKeyHex.slice(_PREFIX.PrefixPubKeyEd25519.length);
	    }
	    throw new Error(`Decode pub key failed: ${pubKeyHex}\n`);
	}
	//eoncde raw key to std key, only support secp256k1 for now
	function encodePrivKey(privKeyHex) {
	    return _PREFIX.PrefixPrivKeySecp256k1.concat(privKeyHex).toUpperCase();
	}
	function encodePubKey(pubKeyHex) {
	    return _PREFIX.PrefixPubKeySecp256k1.concat(pubKeyHex).toUpperCase();
	}
	// convert raw pub key to internal pub key format
	function convertToInternalPubKey(rawPubKey, type) {
	    const res = {
	        type: type,
	        value: bytebuffer.fromHex(rawPubKey).toString('base64')
	    };
	    return res;
	}
	// convert internal pub key to raw pub key
	function convertToRawPubKey(internalPubKey) {
	    return bytebuffer.fromBase64(internalPubKey.value).toString('hex');
	}
	function sortObject(object) {
	    var sortedObj = {}, keys = Object.keys(object);
	    keys.sort(function (key1, key2) {
	        (key1 = key1.toLowerCase()), (key2 = key2.toLowerCase());
	        if (key1 < key2)
	            return -1;
	        if (key1 > key2)
	            return 1;
	        return 0;
	    });
	    for (var index in keys) {
	        var key = keys[index];
	        if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
	            sortedObj[key] = sortObject(object[key]);
	        }
	        else if (typeof object[key] == 'object' && object[key] instanceof Array) {
	            sortedObj[key] = [];
	            object[key].forEach(element => {
	                sortedObj[key].push(sortObject(element));
	            });
	        }
	        else {
	            sortedObj[key] = object[key];
	        }
	    }
	    return sortedObj;
	}
	function number2StringInObject(object) {
	    var resultObj = {}, keys = Object.keys(object);
	    for (var index in keys) {
	        var key = keys[index];
	        if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
	            resultObj[key] = number2StringInObject(object[key]);
	        }
	        else if (typeof object[key] == 'object' && object[key] instanceof Array) {
	            resultObj[key] = [];
	            object[key].forEach(element => {
	                resultObj[key].push(number2StringInObject(element));
	            });
	        }
	        else {
	            if (typeof object[key] == 'number') {
	                resultObj[key] = String(object[key]);
	            }
	            else {
	                resultObj[key] = object[key];
	            }
	        }
	    }
	    return resultObj;
	}
	const _TYPE = {
	    PubKeyEd25519: 'tendermint/PubKeyEd25519',
	    PubKeySecp256k1: 'tendermint/PubKeySecp256k1',
	    PrivKeyEd25519: 'tendermint/PrivKeyEd25519',
	    PrivKeySecp256k1: 'tendermint/PrivKeySecp256k1',
	    SignatureKeyEd25519: 'tendermint/SignatureEd25519',
	    SignatureKeySecp256k1: 'tendermint/SignatureSecp256k1'
	};
	const _PREFIX = {
	    PrefixPubKeyEd25519: '1624DE6420',
	    PrefixPubKeySecp256k1: 'EB5AE98721',
	    PrefixPrivKeyEd25519: 'A328891040',
	    PrefixPrivKeySecp256k1: 'E1B0F79B20'
	};

	class Broadcast {
	    constructor(transport) {
	        this._transport = transport;
	    }
	    //account related
	    /**
	     * Register registers a new user on blockchain.
	     * It composes RegisterMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param referrer: the user who refers the new user
	     * @param register_fee: the amount of money used for registering
	     * @param username: new username
	     * @param resetPubKey: new user's reset key
	     * @param transactionPubKeyHex: new user's transaction key
	     * @param appPubKeyHex: new user's app key
	     * @param referrerPrivKeyHex: referrer's private key
	     * @param seq: the sequence number of referrer for the next transaction
	     */
	    register(referrer, register_fee, username, resetPubKey, transactionPubKeyHex, appPubKeyHex, referrerPrivKeyHex, seq) {
	        const msg = {
	            referrer: referrer,
	            register_fee: register_fee,
	            new_username: username,
	            new_reset_public_key: decodePubKey(resetPubKey),
	            new_transaction_public_key: decodePubKey(transactionPubKeyHex),
	            new_app_public_key: decodePubKey(appPubKeyHex)
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.RegisterMsgType, referrerPrivKeyHex, seq);
	    }
	    /**
	     * Transfer sends a certain amount of LINO token from the sender to the receiver.
	     * It composes TransferMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param sender: the user who wants to send money
	     * @param receiver: the receiver whom the sender sends money to
	     * @param amount: the amount LINO token in the transfer
	     * @param memo: memos inthe transfer
	     * @param privKeyHex: the private key of sender
	     * @param seq: the sequence number of sender for the next transaction
	     */
	    transfer(sender, receiver, amount, memo, privKeyHex, seq) {
	        const msg = {
	            amount: amount,
	            memo: memo,
	            receiver: receiver,
	            sender: sender
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.TransferMsgType, privKeyHex, seq);
	    }
	    /**
	     * Follow creates a social relationship between follower and followee.
	     * It composes FollowMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param follower: follower
	     * @param followee: followee
	     * @param privKeyHex: the private key of follower
	     * @param seq: the sequence number of follower for the next transaction
	     */
	    follow(follower, followee, privKeyHex, seq) {
	        const msg = {
	            followee: followee,
	            follower: follower
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.FollowMsgType, privKeyHex, seq);
	    }
	    /**
	     * Unfollow revokes the social relationship between follower and followee.
	     * It composes UnfollowMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param follower: follower
	     * @param followee: followee
	     * @param privKeyHex: the private key of follower
	     * @param seq: the sequence number of follower for the next transaction
	     */
	    unfollow(follower, followee, privKeyHex, seq) {
	        const msg = {
	            followee: followee,
	            follower: follower
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.UnfollowMsgType, privKeyHex, seq);
	    }
	    /**
	     * Claim claims rewards of a certain user.
	     * It composes ClaimMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to claim reward
	     * @param privKeyHex: the private key of username
	     * @param seq: the sequence number of user for the next transaction
	     */
	    claim(username, privKeyHex, seq) {
	        const msg = {
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ClaimMsgType, privKeyHex, seq);
	    }
	    /**
	     * UpdateAccount updates account related info in jsonMeta which are not
	     * included in AccountInfo or AccountBank.
	     * It composes UpdateAccountMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to update account meta
	     * @param json_meta: the newly updated meta
	     * @param privKeyHex: the private key of user
	     * @param seq: the sequence number of user for the next transaction
	     */
	    updateAccount(username, json_meta, privKeyHex, seq) {
	        const msg = {
	            json_meta: json_meta,
	            username: username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.UpdateAccMsgType, privKeyHex, seq);
	    }
	    /**
	     * Recover resets all keys of a user in case of losing or compromising.
	     * It composes RecoverMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to recover account
	     * @param new_reset_public_key: new reset public key for user
	     * @param new_transaction_public_key: new transaction public key for user
	     * @param new_app_public_key: new app public key for user
	     * @param privKeyHex: the old private key of user
	     * @param seq: the sequence number of user for the next transaction
	     */
	    recover(username, new_reset_public_key, new_transaction_public_key, new_app_public_key, privKeyHex, seq) {
	        const msg = {
	            username: username,
	            new_reset_public_key: decodePubKey(new_reset_public_key),
	            new_transaction_public_key: decodePubKey(new_transaction_public_key),
	            new_app_public_key: decodePubKey(new_app_public_key)
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.RecoverMsgType, privKeyHex, seq);
	    }
	    // post related
	    /**
	     * CreatePost creates a new post on blockchain.
	     * It composes CreatePostMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param author: the user who creates the new post
	     * @param postID: the post id of the new post
	     * @param title: the title of the new post
	     * @param content: the content of the new post
	     * @param parentAuthor: if this is a comment, parentAuthor is the author of post that this comment is added to
	     * @param parentPostID: if this is a comment, parentPostID is the id of post that this comment is added to
	     * @param sourceAuthor: if this is a re-post, sourceAuthor should be the original post author
	     * @param sourcePostID: if this is a re-post, sourcePostID should be the original post id
	     * @param redistributionSplitRate: how much percentage the source post wants to split for re-post
	     * @param links: the links of the new post
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of user for the next transaction
	     */
	    createPost(author, postID, title, content, parentAuthor, parentPostID, sourceAuthor, sourcePostID, redistributionSplitRate, links, privKeyHex, seq) {
	        let mLinks = null;
	        if (links != null) {
	            mLinks = [];
	            for (let entry of links.entries()) {
	                const mapping = {
	                    identifier: entry[0],
	                    url: entry[1]
	                };
	                mLinks.push(mapping);
	            }
	        }
	        const msg = {
	            author: author,
	            content: content,
	            links: mLinks,
	            parent_author: parentAuthor,
	            parent_postID: parentPostID,
	            post_id: postID,
	            redistribution_split_rate: redistributionSplitRate,
	            source_author: sourceAuthor,
	            source_postID: sourcePostID,
	            title: title
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.CreatePostMsgType, privKeyHex, seq);
	    }
	    /**
	     * Donate adds a money donation to a post by a user.
	     * It composes DonateMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to donate to the post
	     * @param author: the author of the post
	     * @param amount: the amount LINO token that the user wants to donate
	     * @param post_id: the id of the post
	     * @param from_app: which app that the donation is from
	     * @param memo: memo of the donation
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of user for the next transaction
	     */
	    donate(username, author, amount, post_id, from_app, memo, privKeyHex, seq) {
	        const msg = {
	            amount,
	            author,
	            from_app,
	            memo,
	            post_id,
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DonateMsgType, privKeyHex, seq);
	    }
	    /**
	     * ReportOrUpvote adds a report or upvote action to a post.
	     * It composes ReportOrUpvoteMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who report or upvote the post
	     * @param author: the author of the post
	     * @param post_id: the id of the post
	     * @param is_report: indicates this is a report if set to true
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    reportOrUpvote(username, author, post_id, is_report, privKeyHex, seq) {
	        const msg = {
	            author,
	            is_report,
	            post_id,
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ReportOrUpvoteMsgType, privKeyHex, seq);
	    }
	    /**
	     * DeletePost deletes a post from the blockchain. It doesn't actually
	     * remove the post from the blockchain, instead it sets IsDeleted to true
	     * and clears all the other data.
	     * It composes DeletePostMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param author: the author of the post
	     * @param post_id: the id of the post
	     * @param privKeyHex: the private key of the author
	     * @param seq: the sequence number of the author for the next transaction
	     */
	    deletePost(author, post_id, privKeyHex, seq) {
	        const msg = {
	            author,
	            post_id
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DeletePostMsgType, privKeyHex, seq);
	    }
	    /**
	     * View increases the view count of a post by one.
	     * It composes ViewMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who view the post
	     * @param author: The author of the post
	     * @param post_id: the id of the post
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the author for the next transaction
	     */
	    view(username, author, post_id, privKeyHex, seq) {
	        const msg = {
	            author,
	            post_id,
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ViewMsgType, privKeyHex, seq);
	    }
	    /**
	     * UpdatePost updates post info with new data.
	     * It composes UpdatePostMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param author: the author of the post
	     * @param title: new titile of the post
	     * @param post_id: the id of the post
	     * @param content: new content of the post
	     * @param redistribution_split_rate: new re-spot split rate
	     * @param links: new links of the post
	     * @param privKeyHex: the private key of the author
	     * @param seq: the sequence number of the author for the next transaction
	     */
	    updatePost(author, title, post_id, content, redistribution_split_rate, links, privKeyHex, seq) {
	        let mLinks = null;
	        if (links != null) {
	            mLinks = [];
	            for (let entry of links.entries()) {
	                const mapping = {
	                    identifier: entry[0],
	                    url: entry[1]
	                };
	                mLinks.push(mapping);
	            }
	        }
	        const msg = {
	            author: author,
	            content: content,
	            links: mLinks,
	            post_id: post_id,
	            redistribution_split_rate: redistribution_split_rate,
	            title: title
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.UpdatePostMsgType, privKeyHex, seq);
	    }
	    // validator related
	    /**
	     * ValidatorDeposit deposits a certain amount of LINO token for a user
	     * in order to become a validator. Before becoming a validator, the user
	     * has to be a voter.
	     * It composes ValidatorDepositMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to deposit money for being a validator
	     * @param deposit: the amount of LINO token the user wants to deposit
	     * @param validator_public_key: the validator public key given by Tendermint
	     * @param link: the link of the user
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    validatorDeposit(username, deposit, validator_public_key, link, privKeyHex, seq) {
	        const msg = {
	            deposit: deposit,
	            link: link,
	            username: username,
	            validator_public_key: decodePubKey(validator_public_key)
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ValDepositMsgType, privKeyHex, seq);
	    }
	    /**
	     * ValidatorWithdraw withdraws part of LINO token from a validator's deposit,
	     * while still keep being a validator.
	     * It composes ValidatorDepositMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the validator username
	     * @param amount: the amount of LINO token the validator wants to withdraw
	     * @param privKeyHex: the private key of the validator
	     * @param seq: the sequence number of the validator for the next transaction
	     */
	    validatorWithdraw(username, amount, privKeyHex, seq) {
	        const msg = {
	            amount: amount,
	            username: username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ValWithdrawMsgType, privKeyHex, seq);
	    }
	    /**
	     * ValidatorRevoke revokes all deposited LINO token of a validator
	     * so that the user will not be a validator anymore.
	     * It composes ValidatorRevokeMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the validator username
	     * @param privKeyHex: the private key of the validator
	     * @param seq: the sequence number of the validator
	     */
	    ValidatorRevoke(username, privKeyHex, seq) {
	        const msg = {
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ValRevokeMsgType, privKeyHex, seq);
	    }
	    // vote related
	    /**
	     * VoterDeposit deposits a certain amount of LINO token for a user
	     * in order to become a voter.
	     * It composes VoterDepositMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user whot wants to deposit money for being a voter
	     * @param deposit: the amount of LINO token the user wants to deposit
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    voterDeposit(username, deposit, privKeyHex, seq) {
	        const msg = {
	            deposit: deposit,
	            username: username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.VoteDepositMsgType, privKeyHex, seq);
	    }
	    /**
	     * VoterWithdraw withdraws part of LINO token from a voter's deposit,
	     * while still keep being a voter.
	     * It composes VoterWithdrawMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the voter username
	     * @param amount: the amount of LINO token the voter wants to withdraw
	     * @param privKeyHex: the private key of the voter
	     * @param seq: the sequence number of the voter for the next transaction
	     */
	    voterWithdraw(username, amount, privKeyHex, seq) {
	        const msg = {
	            amount: amount,
	            username: username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.VoteWithdrawMsgType, privKeyHex, seq);
	    }
	    /**
	     * VoterRevoke reovkes all deposited LINO token of a voter
	     * so the user will not be a voter anymore.
	     * It composes VoterRevokeMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the voter username
	     * @param privKeyHex: the private key of the voter
	     * @param seq: the sequence number of the voter for the next transaction
	     */
	    voterRevoke(username, privKeyHex, seq) {
	        const msg = {
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.VoteRevokeMsgType, privKeyHex, seq);
	    }
	    /**
	     * Delegate delegates a certain amount of LINO token of delegator to a voter, so
	     * the voter will have more voting power.
	     * It composes DelegateMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param delegator: the user who wants to delegate money
	     * @param voter: the voter that the delegator wants to delegate moeny to
	     * @param amount: the amount of LINO token that the delegator wants to delegate
	     * @param privKeyHex: the private key of the delegator
	     * @param seq: the sequence number of the delegator for the next transaction
	     */
	    delegate(delegator, voter, amount, privKeyHex, seq) {
	        const msg = {
	            amount,
	            delegator,
	            voter
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DelegateMsgType, privKeyHex, seq);
	    }
	    /**
	     * DelegatorWithdraw withdraws part of delegated LINO token of a delegator
	     * to a voter, while the delegation still exists.
	     * It composes DelegatorWithdrawMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param delegator: the delegator username
	     * @param voter: the voter username
	     * @param amount: the amount of money that the delegator wants to withdraw
	     * @param privKeyHex: the private key of the delegator
	     * @param seq: the sequence number of the delegator for the next transaction
	     */
	    delegatorWithdraw(delegator, voter, amount, privKeyHex, seq) {
	        const msg = {
	            delegator,
	            voter,
	            amount
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DelegateWithdrawMsgType, privKeyHex, seq);
	    }
	    /**
	     * RevokeDelegation reovkes all delegated LINO token of a delegator to a voter
	     * so there is no delegation between the two users.
	     * It composes RevokeDelegationMsg and then broadcasts the transaction to blockchain    *
	     *
	     * @param delegator: the delegator username
	     * @param voter: the voter username
	     * @param privKeyHex: the private key of the delegator
	     * @param seq: the sequence number of the delegator for the next transaction
	     */
	    revokeDelegation(delegator, voter, privKeyHex, seq) {
	        const msg = {
	            delegator,
	            voter
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DelegateRevokeMsgType, privKeyHex, seq);
	    }
	    // developer related
	    /**
	     * DeveloperRegsiter registers a developer with a certain amount of LINO token on blockchain.
	     * It composes DeveloperRegisterMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to become a developer
	     * @param deposit: the amount of money the user wants to deposit
	     * @param website: developer's website
	     * @param description: developer's description
	     * @param app_meta_data: developer's app meta data
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    developerRegister(username, deposit, website, description, app_meta_data, privKeyHex, seq) {
	        const msg = {
	            app_meta_data,
	            deposit,
	            description,
	            username,
	            website
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DevRegisterMsgType, privKeyHex, seq);
	    }
	    /**
	     * DeveloperUpdate updates a developer info on blockchain.
	     * It composes DeveloperUpdateMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the developer's username
	     * @param website: new developer's website
	     * @param description: new developer's description
	     * @param app_meta_data: new developer's app meta data
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    developerUpdate(username, website, description, app_meta_data, privKeyHex, seq) {
	        const msg = {
	            username,
	            website,
	            description,
	            app_meta_data
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DevUpdateMsgType, privKeyHex, seq);
	    }
	    /**
	     * DeveloperRevoke reovkes all deposited LINO token of a developer
	     * so the user will not be a developer anymore.
	     * It composes DeveloperRevokeMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the developer username
	     * @param privKeyHex: the private key of the developer
	     * @param seq: the sequence number of the developer for the next transaction
	     */
	    developerRevoke(username, privKeyHex, seq) {
	        const msg = {
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DevRevokeMsgType, privKeyHex, seq);
	    }
	    /**
	     * GrantPermission grants a certain (e.g. App) permission to
	     * an authorized app with a certain period of time.
	     * It composes GrantPermissionMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who grants the permission
	     * @param authorized_app: the authenticated app of the developer
	     * @param validity_period_second: how long does this app is valid
	     * @param grant_level: the permission level granted
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    grantPermission(username, authorized_app, validity_period_second, grant_level, privKeyHex, seq) {
	        const msg = {
	            username,
	            authorized_app,
	            validity_period_second,
	            grant_level
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.GrantPermissionMsgType, privKeyHex, seq);
	    }
	    /**
	     * RevokePermission revokes the permission given previously to a app.
	     * It composes RevokePermissionMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who wants to revoke permission
	     * @param public_key: the user's public key that will be revoked
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    revokePermission(username, public_key, privKeyHex, seq) {
	        const msg = {
	            username: username,
	            public_key: decodePubKey(public_key)
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.RevokePermissionMsgType, privKeyHex, seq);
	    }
	    /**
	     * preAuthorizationPermission grants pre authorization permission to
	     * an authorized app with a certain period of time and amount.
	     * It composes GrantPermissionMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the user who grants the permission
	     * @param authorized_app: the authenticated app of the developer
	     * @param validity_period_second: how long does this app is valid
	     * @param grant_level: the permission level granted
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    preAuthorizationPermission(username, authorized_app, validity_period_second, amount, privKeyHex, seq) {
	        const msg = {
	            username,
	            authorized_app,
	            validity_period_second,
	            amount
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.PreAuthorizationMsgType, privKeyHex, seq);
	    }
	    // infra related
	    /**
	     * ProviderReport reports infra usage of a infra provider in order to get infra inflation.
	     * It composes ProviderReportMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param username: the username of the infra provider
	     * @param usage: the amount of data traffic consumed
	     * @param privKeyHex: the private key of the user
	     * @param seq: the sequence number of the user for the next transaction
	     */
	    providerReport(username, usage, privKeyHex, seq) {
	        const msg = {
	            usage,
	            username
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ProviderReportMsgType, privKeyHex, seq);
	    }
	    // proposal related
	    /**
	     * VoteProposal adds a vote to a certain proposal with agree/disagree.
	     * It composes VoteProposalMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param voter: the voter username
	     * @param proposal_id: the proposal id
	     * @param result: agree or disagree
	     * @param privKeyHex: the private key of the voter
	     * @param seq: the sequence number of the voter for the next transaction
	     */
	    voteProposal(voter, proposal_id, result, privKeyHex, seq) {
	        const msg = {
	            proposal_id,
	            result,
	            voter
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.VoteProposalMsgType, privKeyHex, seq);
	    }
	    /**
	     * ChangeGlobalAllocationParam changes GlobalAllocationParam with new value.
	     * It composes ChangeGlobalAllocationParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the GlobalAllocationParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeGlobalAllocationParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeGlobalAllocationMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeEvaluateOfContentValueParam changes EvaluateOfContentValueParam with new value.
	     * It composes ChangeEvaluateOfContentValueParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the EvaluateOfContentValueParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeEvaluateOfContentValueParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeEvaluationMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeInfraInternalAllocationParam changes InfraInternalAllocationParam with new value.
	     * It composes ChangeInfraInternalAllocationParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the InfraInternalAllocationParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeInfraInternalAllocationParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeInfraAllocationMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeVoteParam changes VoteParam with new value.
	     * It composes ChangeVoteParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the VoteParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeVoteParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeVoteParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeProposalParam changes ProposalParam with new value.
	     * It composes ChangeProposalParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the ProposalParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeProposalParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeProposalParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeDeveloperParam changes DeveloperParam with new value.
	     * It composes ChangeDeveloperParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the DeveloperParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeDeveloperParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeDeveloperParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeValidatorParam changes ValidatorParam with new value.
	     * It composes ChangeValidatorParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the ValidatorParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeValidatorParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeValidatorParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeBandwidthParam changes BandwidthParam with new value.
	     * It composes ChangeBandwidthParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the BandwidthParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeBandwidthParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeBandwidthParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * changeAccountParam changes AccountParam with new value.
	     * It composes ChangeAccountParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the AccountParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changeAccountParam(creator, parameter, reason, privKeyHex, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangeAccountParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * changePostParam changes PostParam with new value.
	     * It composes ChangePostParamMsg and then broadcasts the transaction to blockchain.
	     *
	     * @param creator: the user who creates the proposal
	     * @param parameter: the PostParam
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    changePostParam(creator, parameter, privKeyHex, reason, seq) {
	        const msg = {
	            creator,
	            parameter: encodeObject(parameter),
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.ChangePostParamMsgType, privKeyHex, seq);
	    }
	    /**
	     * DeletePostContent deletes the content of a post on blockchain, which is used
	     * for content censorship.
	     * It composes DeletePostContentMsg and then broadcasts the transaction to blockchain.
	     * @param creator: the user who creates the proposal
	     * @param postAuthor: the author of the post
	     * @param postID: the id of the post
	     * @param reason: the reason why to delete post content
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    deletePostContent(creator, postAuthor, postID, reason, privKeyHex, seq) {
	        const permlink = postAuthor.concat('#').concat(postID);
	        const msg = {
	            creator,
	            permlink,
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.DeletePostContentMsgType, privKeyHex, seq);
	    }
	    /**
	     * UpgradeProtocol upgrades the protocol.
	     * It composes UpgradeProtocolMsg and then broadcasts the transaction to blockchain.
	     * @param creator: the user who creates the proposal
	     * @param link: the link of the upgraded protocol
	     * @param reason: the reason to make such change
	     * @param privKeyHex: the private key of the creator
	     * @param seq: the sequence number of the creator for the next transaction
	     */
	    upgradeProtocol(creator, link, privKeyHex, reason, seq) {
	        const msg = {
	            creator,
	            link,
	            reason
	        };
	        return this._broadcastTransaction(msg, _MSGTYPE.UpgradeProtocolMsgType, privKeyHex, seq);
	    }
	    _broadcastTransaction(msg, msgType, privKeyHex, seq) {
	        return this._transport.signBuildBroadcast(msg, msgType, privKeyHex, seq);
	    }
	}
	const _MSGTYPE = {
	    RegisterMsgType: 'lino/register',
	    FollowMsgType: 'lino/follow',
	    UnfollowMsgType: 'lino/unfollow',
	    TransferMsgType: 'lino/transfer',
	    ClaimMsgType: 'lino/claim',
	    RecoverMsgType: 'lino/recover',
	    UpdateAccMsgType: 'lino/updateAcc',
	    DevRegisterMsgType: 'lino/devRegister',
	    DevUpdateMsgType: 'lino/devUpdate',
	    DevRevokeMsgType: 'lino/devRevoke',
	    GrantPermissionMsgType: 'lino/grantPermission',
	    RevokePermissionMsgType: 'lino/revokePermission',
	    PreAuthorizationMsgType: 'lino/preAuthorizationPermission',
	    CreatePostMsgType: 'lino/createPost',
	    UpdatePostMsgType: 'lino/updatePost',
	    DeletePostMsgType: 'lino/deletePost',
	    DonateMsgType: 'lino/donate',
	    ViewMsgType: 'lino/view',
	    ReportOrUpvoteMsgType: 'lino/reportOrUpvote',
	    VoteDepositMsgType: 'lino/voteDeposit',
	    VoteRevokeMsgType: 'lino/voteRevoke',
	    VoteWithdrawMsgType: 'lino/voteWithdraw',
	    DelegateMsgType: 'lino/delegate',
	    DelegateWithdrawMsgType: 'lino/delegateWithdraw',
	    DelegateRevokeMsgType: 'lino/delegateRevoke',
	    ValDepositMsgType: 'lino/valDeposit',
	    ValWithdrawMsgType: 'lino/valWithdraw',
	    ValRevokeMsgType: 'lino/valRevoke',
	    VoteProposalMsgType: 'lino/voteProposal',
	    DeletePostContentMsgType: 'lino/deletePostContent',
	    UpgradeProtocolMsgType: 'lino/upgradeProtocol',
	    ChangeGlobalAllocationMsgType: 'lino/changeGlobalAllocation',
	    ChangeEvaluationMsgType: 'lino/changeEvaluation',
	    ChangeInfraAllocationMsgType: 'lino/changeInfraAllocation',
	    ChangeVoteParamMsgType: 'lino/changeVoteParam',
	    ChangeProposalParamMsgType: 'lino/changeProposalParam',
	    ChangeDeveloperParamMsgType: 'lino/changeDeveloperParam',
	    ChangeValidatorParamMsgType: 'lino/changeValidatorParam',
	    ChangeBandwidthParamMsgType: 'lino/changeBandwidthParam',
	    ChangeAccountParamMsgType: 'lino/changeAccountParam',
	    ChangePostParamMsgType: 'lino/changePostParam',
	    ProviderReportMsgType: 'lino/providerReport'
	};

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */

	function __awaiter(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	var name = "elliptic";
	var version = "6.4.0";
	var description = "EC cryptography";
	var main = "lib/elliptic.js";
	var files = [
		"lib"
	];
	var scripts = {
		jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
		jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
		lint: "npm run jscs && npm run jshint",
		unit: "istanbul test _mocha --reporter=spec test/index.js",
		test: "npm run lint && npm run unit",
		version: "grunt dist && git add dist/"
	};
	var repository = {
		type: "git",
		url: "git@github.com:indutny/elliptic"
	};
	var keywords = [
		"EC",
		"Elliptic",
		"curve",
		"Cryptography"
	];
	var author = "Fedor Indutny <fedor@indutny.com>";
	var license = "MIT";
	var bugs = {
		url: "https://github.com/indutny/elliptic/issues"
	};
	var homepage = "https://github.com/indutny/elliptic";
	var devDependencies = {
		brfs: "^1.4.3",
		coveralls: "^2.11.3",
		grunt: "^0.4.5",
		"grunt-browserify": "^5.0.0",
		"grunt-cli": "^1.2.0",
		"grunt-contrib-connect": "^1.0.0",
		"grunt-contrib-copy": "^1.0.0",
		"grunt-contrib-uglify": "^1.0.1",
		"grunt-mocha-istanbul": "^3.0.1",
		"grunt-saucelabs": "^8.6.2",
		istanbul: "^0.4.2",
		jscs: "^2.9.0",
		jshint: "^2.6.0",
		mocha: "^2.1.0"
	};
	var dependencies = {
		"bn.js": "^4.4.0",
		brorand: "^1.0.1",
		"hash.js": "^1.0.0",
		"hmac-drbg": "^1.0.0",
		inherits: "^2.0.1",
		"minimalistic-assert": "^1.0.0",
		"minimalistic-crypto-utils": "^1.0.0"
	};
	var _package = {
		name: name,
		version: version,
		description: description,
		main: main,
		files: files,
		scripts: scripts,
		repository: repository,
		keywords: keywords,
		author: author,
		license: license,
		bugs: bugs,
		homepage: homepage,
		devDependencies: devDependencies,
		dependencies: dependencies
	};

	var _package$1 = /*#__PURE__*/Object.freeze({
		name: name,
		version: version,
		description: description,
		main: main,
		files: files,
		scripts: scripts,
		repository: repository,
		keywords: keywords,
		author: author,
		license: license,
		bugs: bugs,
		homepage: homepage,
		devDependencies: devDependencies,
		dependencies: dependencies,
		default: _package
	});

	var bn = createCommonjsModule(function (module) {
	(function (module, exports) {

	  // Utils
	  function assert (val, msg) {
	    if (!val) throw new Error(msg || 'Assertion failed');
	  }

	  // Could use `inherits` module, but don't want to move from single file
	  // architecture yet.
	  function inherits (ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  }

	  // BN

	  function BN (number, base, endian) {
	    if (BN.isBN(number)) {
	      return number;
	    }

	    this.negative = 0;
	    this.words = null;
	    this.length = 0;

	    // Reduction context
	    this.red = null;

	    if (number !== null) {
	      if (base === 'le' || base === 'be') {
	        endian = base;
	        base = 10;
	      }

	      this._init(number || 0, base || 10, endian || 'be');
	    }
	  }
	  if (typeof module === 'object') {
	    module.exports = BN;
	  } else {
	    exports.BN = BN;
	  }

	  BN.BN = BN;
	  BN.wordSize = 26;

	  var Buffer;
	  try {
	    Buffer = require$$0.Buffer;
	  } catch (e) {
	  }

	  BN.isBN = function isBN (num) {
	    if (num instanceof BN) {
	      return true;
	    }

	    return num !== null && typeof num === 'object' &&
	      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
	  };

	  BN.max = function max (left, right) {
	    if (left.cmp(right) > 0) return left;
	    return right;
	  };

	  BN.min = function min (left, right) {
	    if (left.cmp(right) < 0) return left;
	    return right;
	  };

	  BN.prototype._init = function init (number, base, endian) {
	    if (typeof number === 'number') {
	      return this._initNumber(number, base, endian);
	    }

	    if (typeof number === 'object') {
	      return this._initArray(number, base, endian);
	    }

	    if (base === 'hex') {
	      base = 16;
	    }
	    assert(base === (base | 0) && base >= 2 && base <= 36);

	    number = number.toString().replace(/\s+/g, '');
	    var start = 0;
	    if (number[0] === '-') {
	      start++;
	    }

	    if (base === 16) {
	      this._parseHex(number, start);
	    } else {
	      this._parseBase(number, base, start);
	    }

	    if (number[0] === '-') {
	      this.negative = 1;
	    }

	    this.strip();

	    if (endian !== 'le') return;

	    this._initArray(this.toArray(), base, endian);
	  };

	  BN.prototype._initNumber = function _initNumber (number, base, endian) {
	    if (number < 0) {
	      this.negative = 1;
	      number = -number;
	    }
	    if (number < 0x4000000) {
	      this.words = [ number & 0x3ffffff ];
	      this.length = 1;
	    } else if (number < 0x10000000000000) {
	      this.words = [
	        number & 0x3ffffff,
	        (number / 0x4000000) & 0x3ffffff
	      ];
	      this.length = 2;
	    } else {
	      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
	      this.words = [
	        number & 0x3ffffff,
	        (number / 0x4000000) & 0x3ffffff,
	        1
	      ];
	      this.length = 3;
	    }

	    if (endian !== 'le') return;

	    // Reverse the bytes
	    this._initArray(this.toArray(), base, endian);
	  };

	  BN.prototype._initArray = function _initArray (number, base, endian) {
	    // Perhaps a Uint8Array
	    assert(typeof number.length === 'number');
	    if (number.length <= 0) {
	      this.words = [ 0 ];
	      this.length = 1;
	      return this;
	    }

	    this.length = Math.ceil(number.length / 3);
	    this.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      this.words[i] = 0;
	    }

	    var j, w;
	    var off = 0;
	    if (endian === 'be') {
	      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
	        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
	        this.words[j] |= (w << off) & 0x3ffffff;
	        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	        off += 24;
	        if (off >= 26) {
	          off -= 26;
	          j++;
	        }
	      }
	    } else if (endian === 'le') {
	      for (i = 0, j = 0; i < number.length; i += 3) {
	        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
	        this.words[j] |= (w << off) & 0x3ffffff;
	        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
	        off += 24;
	        if (off >= 26) {
	          off -= 26;
	          j++;
	        }
	      }
	    }
	    return this.strip();
	  };

	  function parseHex (str, start, end) {
	    var r = 0;
	    var len = Math.min(str.length, end);
	    for (var i = start; i < len; i++) {
	      var c = str.charCodeAt(i) - 48;

	      r <<= 4;

	      // 'a' - 'f'
	      if (c >= 49 && c <= 54) {
	        r |= c - 49 + 0xa;

	      // 'A' - 'F'
	      } else if (c >= 17 && c <= 22) {
	        r |= c - 17 + 0xa;

	      // '0' - '9'
	      } else {
	        r |= c & 0xf;
	      }
	    }
	    return r;
	  }

	  BN.prototype._parseHex = function _parseHex (number, start) {
	    // Create possibly bigger array to ensure that it fits the number
	    this.length = Math.ceil((number.length - start) / 6);
	    this.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      this.words[i] = 0;
	    }

	    var j, w;
	    // Scan 24-bit chunks and add them to the number
	    var off = 0;
	    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
	      w = parseHex(number, i, i + 6);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
	      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	      off += 24;
	      if (off >= 26) {
	        off -= 26;
	        j++;
	      }
	    }
	    if (i + 6 !== start) {
	      w = parseHex(number, start, i + 6);
	      this.words[j] |= (w << off) & 0x3ffffff;
	      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
	    }
	    this.strip();
	  };

	  function parseBase (str, start, end, mul) {
	    var r = 0;
	    var len = Math.min(str.length, end);
	    for (var i = start; i < len; i++) {
	      var c = str.charCodeAt(i) - 48;

	      r *= mul;

	      // 'a'
	      if (c >= 49) {
	        r += c - 49 + 0xa;

	      // 'A'
	      } else if (c >= 17) {
	        r += c - 17 + 0xa;

	      // '0' - '9'
	      } else {
	        r += c;
	      }
	    }
	    return r;
	  }

	  BN.prototype._parseBase = function _parseBase (number, base, start) {
	    // Initialize as zero
	    this.words = [ 0 ];
	    this.length = 1;

	    // Find length of limb in base
	    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
	      limbLen++;
	    }
	    limbLen--;
	    limbPow = (limbPow / base) | 0;

	    var total = number.length - start;
	    var mod = total % limbLen;
	    var end = Math.min(total, total - mod) + start;

	    var word = 0;
	    for (var i = start; i < end; i += limbLen) {
	      word = parseBase(number, i, i + limbLen, base);

	      this.imuln(limbPow);
	      if (this.words[0] + word < 0x4000000) {
	        this.words[0] += word;
	      } else {
	        this._iaddn(word);
	      }
	    }

	    if (mod !== 0) {
	      var pow = 1;
	      word = parseBase(number, i, number.length, base);

	      for (i = 0; i < mod; i++) {
	        pow *= base;
	      }

	      this.imuln(pow);
	      if (this.words[0] + word < 0x4000000) {
	        this.words[0] += word;
	      } else {
	        this._iaddn(word);
	      }
	    }
	  };

	  BN.prototype.copy = function copy (dest) {
	    dest.words = new Array(this.length);
	    for (var i = 0; i < this.length; i++) {
	      dest.words[i] = this.words[i];
	    }
	    dest.length = this.length;
	    dest.negative = this.negative;
	    dest.red = this.red;
	  };

	  BN.prototype.clone = function clone () {
	    var r = new BN(null);
	    this.copy(r);
	    return r;
	  };

	  BN.prototype._expand = function _expand (size) {
	    while (this.length < size) {
	      this.words[this.length++] = 0;
	    }
	    return this;
	  };

	  // Remove leading `0` from `this`
	  BN.prototype.strip = function strip () {
	    while (this.length > 1 && this.words[this.length - 1] === 0) {
	      this.length--;
	    }
	    return this._normSign();
	  };

	  BN.prototype._normSign = function _normSign () {
	    // -0 = 0
	    if (this.length === 1 && this.words[0] === 0) {
	      this.negative = 0;
	    }
	    return this;
	  };

	  BN.prototype.inspect = function inspect () {
	    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
	  };

	  /*

	  var zeros = [];
	  var groupSizes = [];
	  var groupBases = [];

	  var s = '';
	  var i = -1;
	  while (++i < BN.wordSize) {
	    zeros[i] = s;
	    s += '0';
	  }
	  groupSizes[0] = 0;
	  groupSizes[1] = 0;
	  groupBases[0] = 0;
	  groupBases[1] = 0;
	  var base = 2 - 1;
	  while (++base < 36 + 1) {
	    var groupSize = 0;
	    var groupBase = 1;
	    while (groupBase < (1 << BN.wordSize) / base) {
	      groupBase *= base;
	      groupSize += 1;
	    }
	    groupSizes[base] = groupSize;
	    groupBases[base] = groupBase;
	  }

	  */

	  var zeros = [
	    '',
	    '0',
	    '00',
	    '000',
	    '0000',
	    '00000',
	    '000000',
	    '0000000',
	    '00000000',
	    '000000000',
	    '0000000000',
	    '00000000000',
	    '000000000000',
	    '0000000000000',
	    '00000000000000',
	    '000000000000000',
	    '0000000000000000',
	    '00000000000000000',
	    '000000000000000000',
	    '0000000000000000000',
	    '00000000000000000000',
	    '000000000000000000000',
	    '0000000000000000000000',
	    '00000000000000000000000',
	    '000000000000000000000000',
	    '0000000000000000000000000'
	  ];

	  var groupSizes = [
	    0, 0,
	    25, 16, 12, 11, 10, 9, 8,
	    8, 7, 7, 7, 7, 6, 6,
	    6, 6, 6, 6, 6, 5, 5,
	    5, 5, 5, 5, 5, 5, 5,
	    5, 5, 5, 5, 5, 5, 5
	  ];

	  var groupBases = [
	    0, 0,
	    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
	    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
	    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
	    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
	    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
	  ];

	  BN.prototype.toString = function toString (base, padding) {
	    base = base || 10;
	    padding = padding | 0 || 1;

	    var out;
	    if (base === 16 || base === 'hex') {
	      out = '';
	      var off = 0;
	      var carry = 0;
	      for (var i = 0; i < this.length; i++) {
	        var w = this.words[i];
	        var word = (((w << off) | carry) & 0xffffff).toString(16);
	        carry = (w >>> (24 - off)) & 0xffffff;
	        if (carry !== 0 || i !== this.length - 1) {
	          out = zeros[6 - word.length] + word + out;
	        } else {
	          out = word + out;
	        }
	        off += 2;
	        if (off >= 26) {
	          off -= 26;
	          i--;
	        }
	      }
	      if (carry !== 0) {
	        out = carry.toString(16) + out;
	      }
	      while (out.length % padding !== 0) {
	        out = '0' + out;
	      }
	      if (this.negative !== 0) {
	        out = '-' + out;
	      }
	      return out;
	    }

	    if (base === (base | 0) && base >= 2 && base <= 36) {
	      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
	      var groupSize = groupSizes[base];
	      // var groupBase = Math.pow(base, groupSize);
	      var groupBase = groupBases[base];
	      out = '';
	      var c = this.clone();
	      c.negative = 0;
	      while (!c.isZero()) {
	        var r = c.modn(groupBase).toString(base);
	        c = c.idivn(groupBase);

	        if (!c.isZero()) {
	          out = zeros[groupSize - r.length] + r + out;
	        } else {
	          out = r + out;
	        }
	      }
	      if (this.isZero()) {
	        out = '0' + out;
	      }
	      while (out.length % padding !== 0) {
	        out = '0' + out;
	      }
	      if (this.negative !== 0) {
	        out = '-' + out;
	      }
	      return out;
	    }

	    assert(false, 'Base should be between 2 and 36');
	  };

	  BN.prototype.toNumber = function toNumber () {
	    var ret = this.words[0];
	    if (this.length === 2) {
	      ret += this.words[1] * 0x4000000;
	    } else if (this.length === 3 && this.words[2] === 0x01) {
	      // NOTE: at this stage it is known that the top bit is set
	      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
	    } else if (this.length > 2) {
	      assert(false, 'Number can only safely store up to 53 bits');
	    }
	    return (this.negative !== 0) ? -ret : ret;
	  };

	  BN.prototype.toJSON = function toJSON () {
	    return this.toString(16);
	  };

	  BN.prototype.toBuffer = function toBuffer (endian, length) {
	    assert(typeof Buffer !== 'undefined');
	    return this.toArrayLike(Buffer, endian, length);
	  };

	  BN.prototype.toArray = function toArray (endian, length) {
	    return this.toArrayLike(Array, endian, length);
	  };

	  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
	    var byteLength = this.byteLength();
	    var reqLength = length || Math.max(1, byteLength);
	    assert(byteLength <= reqLength, 'byte array longer than desired length');
	    assert(reqLength > 0, 'Requested array length <= 0');

	    this.strip();
	    var littleEndian = endian === 'le';
	    var res = new ArrayType(reqLength);

	    var b, i;
	    var q = this.clone();
	    if (!littleEndian) {
	      // Assume big-endian
	      for (i = 0; i < reqLength - byteLength; i++) {
	        res[i] = 0;
	      }

	      for (i = 0; !q.isZero(); i++) {
	        b = q.andln(0xff);
	        q.iushrn(8);

	        res[reqLength - i - 1] = b;
	      }
	    } else {
	      for (i = 0; !q.isZero(); i++) {
	        b = q.andln(0xff);
	        q.iushrn(8);

	        res[i] = b;
	      }

	      for (; i < reqLength; i++) {
	        res[i] = 0;
	      }
	    }

	    return res;
	  };

	  if (Math.clz32) {
	    BN.prototype._countBits = function _countBits (w) {
	      return 32 - Math.clz32(w);
	    };
	  } else {
	    BN.prototype._countBits = function _countBits (w) {
	      var t = w;
	      var r = 0;
	      if (t >= 0x1000) {
	        r += 13;
	        t >>>= 13;
	      }
	      if (t >= 0x40) {
	        r += 7;
	        t >>>= 7;
	      }
	      if (t >= 0x8) {
	        r += 4;
	        t >>>= 4;
	      }
	      if (t >= 0x02) {
	        r += 2;
	        t >>>= 2;
	      }
	      return r + t;
	    };
	  }

	  BN.prototype._zeroBits = function _zeroBits (w) {
	    // Short-cut
	    if (w === 0) return 26;

	    var t = w;
	    var r = 0;
	    if ((t & 0x1fff) === 0) {
	      r += 13;
	      t >>>= 13;
	    }
	    if ((t & 0x7f) === 0) {
	      r += 7;
	      t >>>= 7;
	    }
	    if ((t & 0xf) === 0) {
	      r += 4;
	      t >>>= 4;
	    }
	    if ((t & 0x3) === 0) {
	      r += 2;
	      t >>>= 2;
	    }
	    if ((t & 0x1) === 0) {
	      r++;
	    }
	    return r;
	  };

	  // Return number of used bits in a BN
	  BN.prototype.bitLength = function bitLength () {
	    var w = this.words[this.length - 1];
	    var hi = this._countBits(w);
	    return (this.length - 1) * 26 + hi;
	  };

	  function toBitArray (num) {
	    var w = new Array(num.bitLength());

	    for (var bit = 0; bit < w.length; bit++) {
	      var off = (bit / 26) | 0;
	      var wbit = bit % 26;

	      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
	    }

	    return w;
	  }

	  // Number of trailing zero bits
	  BN.prototype.zeroBits = function zeroBits () {
	    if (this.isZero()) return 0;

	    var r = 0;
	    for (var i = 0; i < this.length; i++) {
	      var b = this._zeroBits(this.words[i]);
	      r += b;
	      if (b !== 26) break;
	    }
	    return r;
	  };

	  BN.prototype.byteLength = function byteLength () {
	    return Math.ceil(this.bitLength() / 8);
	  };

	  BN.prototype.toTwos = function toTwos (width) {
	    if (this.negative !== 0) {
	      return this.abs().inotn(width).iaddn(1);
	    }
	    return this.clone();
	  };

	  BN.prototype.fromTwos = function fromTwos (width) {
	    if (this.testn(width - 1)) {
	      return this.notn(width).iaddn(1).ineg();
	    }
	    return this.clone();
	  };

	  BN.prototype.isNeg = function isNeg () {
	    return this.negative !== 0;
	  };

	  // Return negative clone of `this`
	  BN.prototype.neg = function neg () {
	    return this.clone().ineg();
	  };

	  BN.prototype.ineg = function ineg () {
	    if (!this.isZero()) {
	      this.negative ^= 1;
	    }

	    return this;
	  };

	  // Or `num` with `this` in-place
	  BN.prototype.iuor = function iuor (num) {
	    while (this.length < num.length) {
	      this.words[this.length++] = 0;
	    }

	    for (var i = 0; i < num.length; i++) {
	      this.words[i] = this.words[i] | num.words[i];
	    }

	    return this.strip();
	  };

	  BN.prototype.ior = function ior (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuor(num);
	  };

	  // Or `num` with `this`
	  BN.prototype.or = function or (num) {
	    if (this.length > num.length) return this.clone().ior(num);
	    return num.clone().ior(this);
	  };

	  BN.prototype.uor = function uor (num) {
	    if (this.length > num.length) return this.clone().iuor(num);
	    return num.clone().iuor(this);
	  };

	  // And `num` with `this` in-place
	  BN.prototype.iuand = function iuand (num) {
	    // b = min-length(num, this)
	    var b;
	    if (this.length > num.length) {
	      b = num;
	    } else {
	      b = this;
	    }

	    for (var i = 0; i < b.length; i++) {
	      this.words[i] = this.words[i] & num.words[i];
	    }

	    this.length = b.length;

	    return this.strip();
	  };

	  BN.prototype.iand = function iand (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuand(num);
	  };

	  // And `num` with `this`
	  BN.prototype.and = function and (num) {
	    if (this.length > num.length) return this.clone().iand(num);
	    return num.clone().iand(this);
	  };

	  BN.prototype.uand = function uand (num) {
	    if (this.length > num.length) return this.clone().iuand(num);
	    return num.clone().iuand(this);
	  };

	  // Xor `num` with `this` in-place
	  BN.prototype.iuxor = function iuxor (num) {
	    // a.length > b.length
	    var a;
	    var b;
	    if (this.length > num.length) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    for (var i = 0; i < b.length; i++) {
	      this.words[i] = a.words[i] ^ b.words[i];
	    }

	    if (this !== a) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    this.length = a.length;

	    return this.strip();
	  };

	  BN.prototype.ixor = function ixor (num) {
	    assert((this.negative | num.negative) === 0);
	    return this.iuxor(num);
	  };

	  // Xor `num` with `this`
	  BN.prototype.xor = function xor (num) {
	    if (this.length > num.length) return this.clone().ixor(num);
	    return num.clone().ixor(this);
	  };

	  BN.prototype.uxor = function uxor (num) {
	    if (this.length > num.length) return this.clone().iuxor(num);
	    return num.clone().iuxor(this);
	  };

	  // Not ``this`` with ``width`` bitwidth
	  BN.prototype.inotn = function inotn (width) {
	    assert(typeof width === 'number' && width >= 0);

	    var bytesNeeded = Math.ceil(width / 26) | 0;
	    var bitsLeft = width % 26;

	    // Extend the buffer with leading zeroes
	    this._expand(bytesNeeded);

	    if (bitsLeft > 0) {
	      bytesNeeded--;
	    }

	    // Handle complete words
	    for (var i = 0; i < bytesNeeded; i++) {
	      this.words[i] = ~this.words[i] & 0x3ffffff;
	    }

	    // Handle the residue
	    if (bitsLeft > 0) {
	      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
	    }

	    // And remove leading zeroes
	    return this.strip();
	  };

	  BN.prototype.notn = function notn (width) {
	    return this.clone().inotn(width);
	  };

	  // Set `bit` of `this`
	  BN.prototype.setn = function setn (bit, val) {
	    assert(typeof bit === 'number' && bit >= 0);

	    var off = (bit / 26) | 0;
	    var wbit = bit % 26;

	    this._expand(off + 1);

	    if (val) {
	      this.words[off] = this.words[off] | (1 << wbit);
	    } else {
	      this.words[off] = this.words[off] & ~(1 << wbit);
	    }

	    return this.strip();
	  };

	  // Add `num` to `this` in-place
	  BN.prototype.iadd = function iadd (num) {
	    var r;

	    // negative + positive
	    if (this.negative !== 0 && num.negative === 0) {
	      this.negative = 0;
	      r = this.isub(num);
	      this.negative ^= 1;
	      return this._normSign();

	    // positive + negative
	    } else if (this.negative === 0 && num.negative !== 0) {
	      num.negative = 0;
	      r = this.isub(num);
	      num.negative = 1;
	      return r._normSign();
	    }

	    // a.length > b.length
	    var a, b;
	    if (this.length > num.length) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    var carry = 0;
	    for (var i = 0; i < b.length; i++) {
	      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
	      this.words[i] = r & 0x3ffffff;
	      carry = r >>> 26;
	    }
	    for (; carry !== 0 && i < a.length; i++) {
	      r = (a.words[i] | 0) + carry;
	      this.words[i] = r & 0x3ffffff;
	      carry = r >>> 26;
	    }

	    this.length = a.length;
	    if (carry !== 0) {
	      this.words[this.length] = carry;
	      this.length++;
	    // Copy the rest of the words
	    } else if (a !== this) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    return this;
	  };

	  // Add `num` to `this`
	  BN.prototype.add = function add (num) {
	    var res;
	    if (num.negative !== 0 && this.negative === 0) {
	      num.negative = 0;
	      res = this.sub(num);
	      num.negative ^= 1;
	      return res;
	    } else if (num.negative === 0 && this.negative !== 0) {
	      this.negative = 0;
	      res = num.sub(this);
	      this.negative = 1;
	      return res;
	    }

	    if (this.length > num.length) return this.clone().iadd(num);

	    return num.clone().iadd(this);
	  };

	  // Subtract `num` from `this` in-place
	  BN.prototype.isub = function isub (num) {
	    // this - (-num) = this + num
	    if (num.negative !== 0) {
	      num.negative = 0;
	      var r = this.iadd(num);
	      num.negative = 1;
	      return r._normSign();

	    // -this - num = -(this + num)
	    } else if (this.negative !== 0) {
	      this.negative = 0;
	      this.iadd(num);
	      this.negative = 1;
	      return this._normSign();
	    }

	    // At this point both numbers are positive
	    var cmp = this.cmp(num);

	    // Optimization - zeroify
	    if (cmp === 0) {
	      this.negative = 0;
	      this.length = 1;
	      this.words[0] = 0;
	      return this;
	    }

	    // a > b
	    var a, b;
	    if (cmp > 0) {
	      a = this;
	      b = num;
	    } else {
	      a = num;
	      b = this;
	    }

	    var carry = 0;
	    for (var i = 0; i < b.length; i++) {
	      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
	      carry = r >> 26;
	      this.words[i] = r & 0x3ffffff;
	    }
	    for (; carry !== 0 && i < a.length; i++) {
	      r = (a.words[i] | 0) + carry;
	      carry = r >> 26;
	      this.words[i] = r & 0x3ffffff;
	    }

	    // Copy rest of the words
	    if (carry === 0 && i < a.length && a !== this) {
	      for (; i < a.length; i++) {
	        this.words[i] = a.words[i];
	      }
	    }

	    this.length = Math.max(this.length, i);

	    if (a !== this) {
	      this.negative = 1;
	    }

	    return this.strip();
	  };

	  // Subtract `num` from `this`
	  BN.prototype.sub = function sub (num) {
	    return this.clone().isub(num);
	  };

	  function smallMulTo (self, num, out) {
	    out.negative = num.negative ^ self.negative;
	    var len = (self.length + num.length) | 0;
	    out.length = len;
	    len = (len - 1) | 0;

	    // Peel one iteration (compiler can't do it, because of code complexity)
	    var a = self.words[0] | 0;
	    var b = num.words[0] | 0;
	    var r = a * b;

	    var lo = r & 0x3ffffff;
	    var carry = (r / 0x4000000) | 0;
	    out.words[0] = lo;

	    for (var k = 1; k < len; k++) {
	      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	      // note that ncarry could be >= 0x3ffffff
	      var ncarry = carry >>> 26;
	      var rword = carry & 0x3ffffff;
	      var maxJ = Math.min(k, num.length - 1);
	      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
	        var i = (k - j) | 0;
	        a = self.words[i] | 0;
	        b = num.words[j] | 0;
	        r = a * b + rword;
	        ncarry += (r / 0x4000000) | 0;
	        rword = r & 0x3ffffff;
	      }
	      out.words[k] = rword | 0;
	      carry = ncarry | 0;
	    }
	    if (carry !== 0) {
	      out.words[k] = carry | 0;
	    } else {
	      out.length--;
	    }

	    return out.strip();
	  }

	  // TODO(indutny): it may be reasonable to omit it for users who don't need
	  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
	  // multiplication (like elliptic secp256k1).
	  var comb10MulTo = function comb10MulTo (self, num, out) {
	    var a = self.words;
	    var b = num.words;
	    var o = out.words;
	    var c = 0;
	    var lo;
	    var mid;
	    var hi;
	    var a0 = a[0] | 0;
	    var al0 = a0 & 0x1fff;
	    var ah0 = a0 >>> 13;
	    var a1 = a[1] | 0;
	    var al1 = a1 & 0x1fff;
	    var ah1 = a1 >>> 13;
	    var a2 = a[2] | 0;
	    var al2 = a2 & 0x1fff;
	    var ah2 = a2 >>> 13;
	    var a3 = a[3] | 0;
	    var al3 = a3 & 0x1fff;
	    var ah3 = a3 >>> 13;
	    var a4 = a[4] | 0;
	    var al4 = a4 & 0x1fff;
	    var ah4 = a4 >>> 13;
	    var a5 = a[5] | 0;
	    var al5 = a5 & 0x1fff;
	    var ah5 = a5 >>> 13;
	    var a6 = a[6] | 0;
	    var al6 = a6 & 0x1fff;
	    var ah6 = a6 >>> 13;
	    var a7 = a[7] | 0;
	    var al7 = a7 & 0x1fff;
	    var ah7 = a7 >>> 13;
	    var a8 = a[8] | 0;
	    var al8 = a8 & 0x1fff;
	    var ah8 = a8 >>> 13;
	    var a9 = a[9] | 0;
	    var al9 = a9 & 0x1fff;
	    var ah9 = a9 >>> 13;
	    var b0 = b[0] | 0;
	    var bl0 = b0 & 0x1fff;
	    var bh0 = b0 >>> 13;
	    var b1 = b[1] | 0;
	    var bl1 = b1 & 0x1fff;
	    var bh1 = b1 >>> 13;
	    var b2 = b[2] | 0;
	    var bl2 = b2 & 0x1fff;
	    var bh2 = b2 >>> 13;
	    var b3 = b[3] | 0;
	    var bl3 = b3 & 0x1fff;
	    var bh3 = b3 >>> 13;
	    var b4 = b[4] | 0;
	    var bl4 = b4 & 0x1fff;
	    var bh4 = b4 >>> 13;
	    var b5 = b[5] | 0;
	    var bl5 = b5 & 0x1fff;
	    var bh5 = b5 >>> 13;
	    var b6 = b[6] | 0;
	    var bl6 = b6 & 0x1fff;
	    var bh6 = b6 >>> 13;
	    var b7 = b[7] | 0;
	    var bl7 = b7 & 0x1fff;
	    var bh7 = b7 >>> 13;
	    var b8 = b[8] | 0;
	    var bl8 = b8 & 0x1fff;
	    var bh8 = b8 >>> 13;
	    var b9 = b[9] | 0;
	    var bl9 = b9 & 0x1fff;
	    var bh9 = b9 >>> 13;

	    out.negative = self.negative ^ num.negative;
	    out.length = 19;
	    /* k = 0 */
	    lo = Math.imul(al0, bl0);
	    mid = Math.imul(al0, bh0);
	    mid = (mid + Math.imul(ah0, bl0)) | 0;
	    hi = Math.imul(ah0, bh0);
	    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
	    w0 &= 0x3ffffff;
	    /* k = 1 */
	    lo = Math.imul(al1, bl0);
	    mid = Math.imul(al1, bh0);
	    mid = (mid + Math.imul(ah1, bl0)) | 0;
	    hi = Math.imul(ah1, bh0);
	    lo = (lo + Math.imul(al0, bl1)) | 0;
	    mid = (mid + Math.imul(al0, bh1)) | 0;
	    mid = (mid + Math.imul(ah0, bl1)) | 0;
	    hi = (hi + Math.imul(ah0, bh1)) | 0;
	    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
	    w1 &= 0x3ffffff;
	    /* k = 2 */
	    lo = Math.imul(al2, bl0);
	    mid = Math.imul(al2, bh0);
	    mid = (mid + Math.imul(ah2, bl0)) | 0;
	    hi = Math.imul(ah2, bh0);
	    lo = (lo + Math.imul(al1, bl1)) | 0;
	    mid = (mid + Math.imul(al1, bh1)) | 0;
	    mid = (mid + Math.imul(ah1, bl1)) | 0;
	    hi = (hi + Math.imul(ah1, bh1)) | 0;
	    lo = (lo + Math.imul(al0, bl2)) | 0;
	    mid = (mid + Math.imul(al0, bh2)) | 0;
	    mid = (mid + Math.imul(ah0, bl2)) | 0;
	    hi = (hi + Math.imul(ah0, bh2)) | 0;
	    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
	    w2 &= 0x3ffffff;
	    /* k = 3 */
	    lo = Math.imul(al3, bl0);
	    mid = Math.imul(al3, bh0);
	    mid = (mid + Math.imul(ah3, bl0)) | 0;
	    hi = Math.imul(ah3, bh0);
	    lo = (lo + Math.imul(al2, bl1)) | 0;
	    mid = (mid + Math.imul(al2, bh1)) | 0;
	    mid = (mid + Math.imul(ah2, bl1)) | 0;
	    hi = (hi + Math.imul(ah2, bh1)) | 0;
	    lo = (lo + Math.imul(al1, bl2)) | 0;
	    mid = (mid + Math.imul(al1, bh2)) | 0;
	    mid = (mid + Math.imul(ah1, bl2)) | 0;
	    hi = (hi + Math.imul(ah1, bh2)) | 0;
	    lo = (lo + Math.imul(al0, bl3)) | 0;
	    mid = (mid + Math.imul(al0, bh3)) | 0;
	    mid = (mid + Math.imul(ah0, bl3)) | 0;
	    hi = (hi + Math.imul(ah0, bh3)) | 0;
	    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
	    w3 &= 0x3ffffff;
	    /* k = 4 */
	    lo = Math.imul(al4, bl0);
	    mid = Math.imul(al4, bh0);
	    mid = (mid + Math.imul(ah4, bl0)) | 0;
	    hi = Math.imul(ah4, bh0);
	    lo = (lo + Math.imul(al3, bl1)) | 0;
	    mid = (mid + Math.imul(al3, bh1)) | 0;
	    mid = (mid + Math.imul(ah3, bl1)) | 0;
	    hi = (hi + Math.imul(ah3, bh1)) | 0;
	    lo = (lo + Math.imul(al2, bl2)) | 0;
	    mid = (mid + Math.imul(al2, bh2)) | 0;
	    mid = (mid + Math.imul(ah2, bl2)) | 0;
	    hi = (hi + Math.imul(ah2, bh2)) | 0;
	    lo = (lo + Math.imul(al1, bl3)) | 0;
	    mid = (mid + Math.imul(al1, bh3)) | 0;
	    mid = (mid + Math.imul(ah1, bl3)) | 0;
	    hi = (hi + Math.imul(ah1, bh3)) | 0;
	    lo = (lo + Math.imul(al0, bl4)) | 0;
	    mid = (mid + Math.imul(al0, bh4)) | 0;
	    mid = (mid + Math.imul(ah0, bl4)) | 0;
	    hi = (hi + Math.imul(ah0, bh4)) | 0;
	    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
	    w4 &= 0x3ffffff;
	    /* k = 5 */
	    lo = Math.imul(al5, bl0);
	    mid = Math.imul(al5, bh0);
	    mid = (mid + Math.imul(ah5, bl0)) | 0;
	    hi = Math.imul(ah5, bh0);
	    lo = (lo + Math.imul(al4, bl1)) | 0;
	    mid = (mid + Math.imul(al4, bh1)) | 0;
	    mid = (mid + Math.imul(ah4, bl1)) | 0;
	    hi = (hi + Math.imul(ah4, bh1)) | 0;
	    lo = (lo + Math.imul(al3, bl2)) | 0;
	    mid = (mid + Math.imul(al3, bh2)) | 0;
	    mid = (mid + Math.imul(ah3, bl2)) | 0;
	    hi = (hi + Math.imul(ah3, bh2)) | 0;
	    lo = (lo + Math.imul(al2, bl3)) | 0;
	    mid = (mid + Math.imul(al2, bh3)) | 0;
	    mid = (mid + Math.imul(ah2, bl3)) | 0;
	    hi = (hi + Math.imul(ah2, bh3)) | 0;
	    lo = (lo + Math.imul(al1, bl4)) | 0;
	    mid = (mid + Math.imul(al1, bh4)) | 0;
	    mid = (mid + Math.imul(ah1, bl4)) | 0;
	    hi = (hi + Math.imul(ah1, bh4)) | 0;
	    lo = (lo + Math.imul(al0, bl5)) | 0;
	    mid = (mid + Math.imul(al0, bh5)) | 0;
	    mid = (mid + Math.imul(ah0, bl5)) | 0;
	    hi = (hi + Math.imul(ah0, bh5)) | 0;
	    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
	    w5 &= 0x3ffffff;
	    /* k = 6 */
	    lo = Math.imul(al6, bl0);
	    mid = Math.imul(al6, bh0);
	    mid = (mid + Math.imul(ah6, bl0)) | 0;
	    hi = Math.imul(ah6, bh0);
	    lo = (lo + Math.imul(al5, bl1)) | 0;
	    mid = (mid + Math.imul(al5, bh1)) | 0;
	    mid = (mid + Math.imul(ah5, bl1)) | 0;
	    hi = (hi + Math.imul(ah5, bh1)) | 0;
	    lo = (lo + Math.imul(al4, bl2)) | 0;
	    mid = (mid + Math.imul(al4, bh2)) | 0;
	    mid = (mid + Math.imul(ah4, bl2)) | 0;
	    hi = (hi + Math.imul(ah4, bh2)) | 0;
	    lo = (lo + Math.imul(al3, bl3)) | 0;
	    mid = (mid + Math.imul(al3, bh3)) | 0;
	    mid = (mid + Math.imul(ah3, bl3)) | 0;
	    hi = (hi + Math.imul(ah3, bh3)) | 0;
	    lo = (lo + Math.imul(al2, bl4)) | 0;
	    mid = (mid + Math.imul(al2, bh4)) | 0;
	    mid = (mid + Math.imul(ah2, bl4)) | 0;
	    hi = (hi + Math.imul(ah2, bh4)) | 0;
	    lo = (lo + Math.imul(al1, bl5)) | 0;
	    mid = (mid + Math.imul(al1, bh5)) | 0;
	    mid = (mid + Math.imul(ah1, bl5)) | 0;
	    hi = (hi + Math.imul(ah1, bh5)) | 0;
	    lo = (lo + Math.imul(al0, bl6)) | 0;
	    mid = (mid + Math.imul(al0, bh6)) | 0;
	    mid = (mid + Math.imul(ah0, bl6)) | 0;
	    hi = (hi + Math.imul(ah0, bh6)) | 0;
	    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
	    w6 &= 0x3ffffff;
	    /* k = 7 */
	    lo = Math.imul(al7, bl0);
	    mid = Math.imul(al7, bh0);
	    mid = (mid + Math.imul(ah7, bl0)) | 0;
	    hi = Math.imul(ah7, bh0);
	    lo = (lo + Math.imul(al6, bl1)) | 0;
	    mid = (mid + Math.imul(al6, bh1)) | 0;
	    mid = (mid + Math.imul(ah6, bl1)) | 0;
	    hi = (hi + Math.imul(ah6, bh1)) | 0;
	    lo = (lo + Math.imul(al5, bl2)) | 0;
	    mid = (mid + Math.imul(al5, bh2)) | 0;
	    mid = (mid + Math.imul(ah5, bl2)) | 0;
	    hi = (hi + Math.imul(ah5, bh2)) | 0;
	    lo = (lo + Math.imul(al4, bl3)) | 0;
	    mid = (mid + Math.imul(al4, bh3)) | 0;
	    mid = (mid + Math.imul(ah4, bl3)) | 0;
	    hi = (hi + Math.imul(ah4, bh3)) | 0;
	    lo = (lo + Math.imul(al3, bl4)) | 0;
	    mid = (mid + Math.imul(al3, bh4)) | 0;
	    mid = (mid + Math.imul(ah3, bl4)) | 0;
	    hi = (hi + Math.imul(ah3, bh4)) | 0;
	    lo = (lo + Math.imul(al2, bl5)) | 0;
	    mid = (mid + Math.imul(al2, bh5)) | 0;
	    mid = (mid + Math.imul(ah2, bl5)) | 0;
	    hi = (hi + Math.imul(ah2, bh5)) | 0;
	    lo = (lo + Math.imul(al1, bl6)) | 0;
	    mid = (mid + Math.imul(al1, bh6)) | 0;
	    mid = (mid + Math.imul(ah1, bl6)) | 0;
	    hi = (hi + Math.imul(ah1, bh6)) | 0;
	    lo = (lo + Math.imul(al0, bl7)) | 0;
	    mid = (mid + Math.imul(al0, bh7)) | 0;
	    mid = (mid + Math.imul(ah0, bl7)) | 0;
	    hi = (hi + Math.imul(ah0, bh7)) | 0;
	    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
	    w7 &= 0x3ffffff;
	    /* k = 8 */
	    lo = Math.imul(al8, bl0);
	    mid = Math.imul(al8, bh0);
	    mid = (mid + Math.imul(ah8, bl0)) | 0;
	    hi = Math.imul(ah8, bh0);
	    lo = (lo + Math.imul(al7, bl1)) | 0;
	    mid = (mid + Math.imul(al7, bh1)) | 0;
	    mid = (mid + Math.imul(ah7, bl1)) | 0;
	    hi = (hi + Math.imul(ah7, bh1)) | 0;
	    lo = (lo + Math.imul(al6, bl2)) | 0;
	    mid = (mid + Math.imul(al6, bh2)) | 0;
	    mid = (mid + Math.imul(ah6, bl2)) | 0;
	    hi = (hi + Math.imul(ah6, bh2)) | 0;
	    lo = (lo + Math.imul(al5, bl3)) | 0;
	    mid = (mid + Math.imul(al5, bh3)) | 0;
	    mid = (mid + Math.imul(ah5, bl3)) | 0;
	    hi = (hi + Math.imul(ah5, bh3)) | 0;
	    lo = (lo + Math.imul(al4, bl4)) | 0;
	    mid = (mid + Math.imul(al4, bh4)) | 0;
	    mid = (mid + Math.imul(ah4, bl4)) | 0;
	    hi = (hi + Math.imul(ah4, bh4)) | 0;
	    lo = (lo + Math.imul(al3, bl5)) | 0;
	    mid = (mid + Math.imul(al3, bh5)) | 0;
	    mid = (mid + Math.imul(ah3, bl5)) | 0;
	    hi = (hi + Math.imul(ah3, bh5)) | 0;
	    lo = (lo + Math.imul(al2, bl6)) | 0;
	    mid = (mid + Math.imul(al2, bh6)) | 0;
	    mid = (mid + Math.imul(ah2, bl6)) | 0;
	    hi = (hi + Math.imul(ah2, bh6)) | 0;
	    lo = (lo + Math.imul(al1, bl7)) | 0;
	    mid = (mid + Math.imul(al1, bh7)) | 0;
	    mid = (mid + Math.imul(ah1, bl7)) | 0;
	    hi = (hi + Math.imul(ah1, bh7)) | 0;
	    lo = (lo + Math.imul(al0, bl8)) | 0;
	    mid = (mid + Math.imul(al0, bh8)) | 0;
	    mid = (mid + Math.imul(ah0, bl8)) | 0;
	    hi = (hi + Math.imul(ah0, bh8)) | 0;
	    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
	    w8 &= 0x3ffffff;
	    /* k = 9 */
	    lo = Math.imul(al9, bl0);
	    mid = Math.imul(al9, bh0);
	    mid = (mid + Math.imul(ah9, bl0)) | 0;
	    hi = Math.imul(ah9, bh0);
	    lo = (lo + Math.imul(al8, bl1)) | 0;
	    mid = (mid + Math.imul(al8, bh1)) | 0;
	    mid = (mid + Math.imul(ah8, bl1)) | 0;
	    hi = (hi + Math.imul(ah8, bh1)) | 0;
	    lo = (lo + Math.imul(al7, bl2)) | 0;
	    mid = (mid + Math.imul(al7, bh2)) | 0;
	    mid = (mid + Math.imul(ah7, bl2)) | 0;
	    hi = (hi + Math.imul(ah7, bh2)) | 0;
	    lo = (lo + Math.imul(al6, bl3)) | 0;
	    mid = (mid + Math.imul(al6, bh3)) | 0;
	    mid = (mid + Math.imul(ah6, bl3)) | 0;
	    hi = (hi + Math.imul(ah6, bh3)) | 0;
	    lo = (lo + Math.imul(al5, bl4)) | 0;
	    mid = (mid + Math.imul(al5, bh4)) | 0;
	    mid = (mid + Math.imul(ah5, bl4)) | 0;
	    hi = (hi + Math.imul(ah5, bh4)) | 0;
	    lo = (lo + Math.imul(al4, bl5)) | 0;
	    mid = (mid + Math.imul(al4, bh5)) | 0;
	    mid = (mid + Math.imul(ah4, bl5)) | 0;
	    hi = (hi + Math.imul(ah4, bh5)) | 0;
	    lo = (lo + Math.imul(al3, bl6)) | 0;
	    mid = (mid + Math.imul(al3, bh6)) | 0;
	    mid = (mid + Math.imul(ah3, bl6)) | 0;
	    hi = (hi + Math.imul(ah3, bh6)) | 0;
	    lo = (lo + Math.imul(al2, bl7)) | 0;
	    mid = (mid + Math.imul(al2, bh7)) | 0;
	    mid = (mid + Math.imul(ah2, bl7)) | 0;
	    hi = (hi + Math.imul(ah2, bh7)) | 0;
	    lo = (lo + Math.imul(al1, bl8)) | 0;
	    mid = (mid + Math.imul(al1, bh8)) | 0;
	    mid = (mid + Math.imul(ah1, bl8)) | 0;
	    hi = (hi + Math.imul(ah1, bh8)) | 0;
	    lo = (lo + Math.imul(al0, bl9)) | 0;
	    mid = (mid + Math.imul(al0, bh9)) | 0;
	    mid = (mid + Math.imul(ah0, bl9)) | 0;
	    hi = (hi + Math.imul(ah0, bh9)) | 0;
	    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
	    w9 &= 0x3ffffff;
	    /* k = 10 */
	    lo = Math.imul(al9, bl1);
	    mid = Math.imul(al9, bh1);
	    mid = (mid + Math.imul(ah9, bl1)) | 0;
	    hi = Math.imul(ah9, bh1);
	    lo = (lo + Math.imul(al8, bl2)) | 0;
	    mid = (mid + Math.imul(al8, bh2)) | 0;
	    mid = (mid + Math.imul(ah8, bl2)) | 0;
	    hi = (hi + Math.imul(ah8, bh2)) | 0;
	    lo = (lo + Math.imul(al7, bl3)) | 0;
	    mid = (mid + Math.imul(al7, bh3)) | 0;
	    mid = (mid + Math.imul(ah7, bl3)) | 0;
	    hi = (hi + Math.imul(ah7, bh3)) | 0;
	    lo = (lo + Math.imul(al6, bl4)) | 0;
	    mid = (mid + Math.imul(al6, bh4)) | 0;
	    mid = (mid + Math.imul(ah6, bl4)) | 0;
	    hi = (hi + Math.imul(ah6, bh4)) | 0;
	    lo = (lo + Math.imul(al5, bl5)) | 0;
	    mid = (mid + Math.imul(al5, bh5)) | 0;
	    mid = (mid + Math.imul(ah5, bl5)) | 0;
	    hi = (hi + Math.imul(ah5, bh5)) | 0;
	    lo = (lo + Math.imul(al4, bl6)) | 0;
	    mid = (mid + Math.imul(al4, bh6)) | 0;
	    mid = (mid + Math.imul(ah4, bl6)) | 0;
	    hi = (hi + Math.imul(ah4, bh6)) | 0;
	    lo = (lo + Math.imul(al3, bl7)) | 0;
	    mid = (mid + Math.imul(al3, bh7)) | 0;
	    mid = (mid + Math.imul(ah3, bl7)) | 0;
	    hi = (hi + Math.imul(ah3, bh7)) | 0;
	    lo = (lo + Math.imul(al2, bl8)) | 0;
	    mid = (mid + Math.imul(al2, bh8)) | 0;
	    mid = (mid + Math.imul(ah2, bl8)) | 0;
	    hi = (hi + Math.imul(ah2, bh8)) | 0;
	    lo = (lo + Math.imul(al1, bl9)) | 0;
	    mid = (mid + Math.imul(al1, bh9)) | 0;
	    mid = (mid + Math.imul(ah1, bl9)) | 0;
	    hi = (hi + Math.imul(ah1, bh9)) | 0;
	    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
	    w10 &= 0x3ffffff;
	    /* k = 11 */
	    lo = Math.imul(al9, bl2);
	    mid = Math.imul(al9, bh2);
	    mid = (mid + Math.imul(ah9, bl2)) | 0;
	    hi = Math.imul(ah9, bh2);
	    lo = (lo + Math.imul(al8, bl3)) | 0;
	    mid = (mid + Math.imul(al8, bh3)) | 0;
	    mid = (mid + Math.imul(ah8, bl3)) | 0;
	    hi = (hi + Math.imul(ah8, bh3)) | 0;
	    lo = (lo + Math.imul(al7, bl4)) | 0;
	    mid = (mid + Math.imul(al7, bh4)) | 0;
	    mid = (mid + Math.imul(ah7, bl4)) | 0;
	    hi = (hi + Math.imul(ah7, bh4)) | 0;
	    lo = (lo + Math.imul(al6, bl5)) | 0;
	    mid = (mid + Math.imul(al6, bh5)) | 0;
	    mid = (mid + Math.imul(ah6, bl5)) | 0;
	    hi = (hi + Math.imul(ah6, bh5)) | 0;
	    lo = (lo + Math.imul(al5, bl6)) | 0;
	    mid = (mid + Math.imul(al5, bh6)) | 0;
	    mid = (mid + Math.imul(ah5, bl6)) | 0;
	    hi = (hi + Math.imul(ah5, bh6)) | 0;
	    lo = (lo + Math.imul(al4, bl7)) | 0;
	    mid = (mid + Math.imul(al4, bh7)) | 0;
	    mid = (mid + Math.imul(ah4, bl7)) | 0;
	    hi = (hi + Math.imul(ah4, bh7)) | 0;
	    lo = (lo + Math.imul(al3, bl8)) | 0;
	    mid = (mid + Math.imul(al3, bh8)) | 0;
	    mid = (mid + Math.imul(ah3, bl8)) | 0;
	    hi = (hi + Math.imul(ah3, bh8)) | 0;
	    lo = (lo + Math.imul(al2, bl9)) | 0;
	    mid = (mid + Math.imul(al2, bh9)) | 0;
	    mid = (mid + Math.imul(ah2, bl9)) | 0;
	    hi = (hi + Math.imul(ah2, bh9)) | 0;
	    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
	    w11 &= 0x3ffffff;
	    /* k = 12 */
	    lo = Math.imul(al9, bl3);
	    mid = Math.imul(al9, bh3);
	    mid = (mid + Math.imul(ah9, bl3)) | 0;
	    hi = Math.imul(ah9, bh3);
	    lo = (lo + Math.imul(al8, bl4)) | 0;
	    mid = (mid + Math.imul(al8, bh4)) | 0;
	    mid = (mid + Math.imul(ah8, bl4)) | 0;
	    hi = (hi + Math.imul(ah8, bh4)) | 0;
	    lo = (lo + Math.imul(al7, bl5)) | 0;
	    mid = (mid + Math.imul(al7, bh5)) | 0;
	    mid = (mid + Math.imul(ah7, bl5)) | 0;
	    hi = (hi + Math.imul(ah7, bh5)) | 0;
	    lo = (lo + Math.imul(al6, bl6)) | 0;
	    mid = (mid + Math.imul(al6, bh6)) | 0;
	    mid = (mid + Math.imul(ah6, bl6)) | 0;
	    hi = (hi + Math.imul(ah6, bh6)) | 0;
	    lo = (lo + Math.imul(al5, bl7)) | 0;
	    mid = (mid + Math.imul(al5, bh7)) | 0;
	    mid = (mid + Math.imul(ah5, bl7)) | 0;
	    hi = (hi + Math.imul(ah5, bh7)) | 0;
	    lo = (lo + Math.imul(al4, bl8)) | 0;
	    mid = (mid + Math.imul(al4, bh8)) | 0;
	    mid = (mid + Math.imul(ah4, bl8)) | 0;
	    hi = (hi + Math.imul(ah4, bh8)) | 0;
	    lo = (lo + Math.imul(al3, bl9)) | 0;
	    mid = (mid + Math.imul(al3, bh9)) | 0;
	    mid = (mid + Math.imul(ah3, bl9)) | 0;
	    hi = (hi + Math.imul(ah3, bh9)) | 0;
	    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
	    w12 &= 0x3ffffff;
	    /* k = 13 */
	    lo = Math.imul(al9, bl4);
	    mid = Math.imul(al9, bh4);
	    mid = (mid + Math.imul(ah9, bl4)) | 0;
	    hi = Math.imul(ah9, bh4);
	    lo = (lo + Math.imul(al8, bl5)) | 0;
	    mid = (mid + Math.imul(al8, bh5)) | 0;
	    mid = (mid + Math.imul(ah8, bl5)) | 0;
	    hi = (hi + Math.imul(ah8, bh5)) | 0;
	    lo = (lo + Math.imul(al7, bl6)) | 0;
	    mid = (mid + Math.imul(al7, bh6)) | 0;
	    mid = (mid + Math.imul(ah7, bl6)) | 0;
	    hi = (hi + Math.imul(ah7, bh6)) | 0;
	    lo = (lo + Math.imul(al6, bl7)) | 0;
	    mid = (mid + Math.imul(al6, bh7)) | 0;
	    mid = (mid + Math.imul(ah6, bl7)) | 0;
	    hi = (hi + Math.imul(ah6, bh7)) | 0;
	    lo = (lo + Math.imul(al5, bl8)) | 0;
	    mid = (mid + Math.imul(al5, bh8)) | 0;
	    mid = (mid + Math.imul(ah5, bl8)) | 0;
	    hi = (hi + Math.imul(ah5, bh8)) | 0;
	    lo = (lo + Math.imul(al4, bl9)) | 0;
	    mid = (mid + Math.imul(al4, bh9)) | 0;
	    mid = (mid + Math.imul(ah4, bl9)) | 0;
	    hi = (hi + Math.imul(ah4, bh9)) | 0;
	    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
	    w13 &= 0x3ffffff;
	    /* k = 14 */
	    lo = Math.imul(al9, bl5);
	    mid = Math.imul(al9, bh5);
	    mid = (mid + Math.imul(ah9, bl5)) | 0;
	    hi = Math.imul(ah9, bh5);
	    lo = (lo + Math.imul(al8, bl6)) | 0;
	    mid = (mid + Math.imul(al8, bh6)) | 0;
	    mid = (mid + Math.imul(ah8, bl6)) | 0;
	    hi = (hi + Math.imul(ah8, bh6)) | 0;
	    lo = (lo + Math.imul(al7, bl7)) | 0;
	    mid = (mid + Math.imul(al7, bh7)) | 0;
	    mid = (mid + Math.imul(ah7, bl7)) | 0;
	    hi = (hi + Math.imul(ah7, bh7)) | 0;
	    lo = (lo + Math.imul(al6, bl8)) | 0;
	    mid = (mid + Math.imul(al6, bh8)) | 0;
	    mid = (mid + Math.imul(ah6, bl8)) | 0;
	    hi = (hi + Math.imul(ah6, bh8)) | 0;
	    lo = (lo + Math.imul(al5, bl9)) | 0;
	    mid = (mid + Math.imul(al5, bh9)) | 0;
	    mid = (mid + Math.imul(ah5, bl9)) | 0;
	    hi = (hi + Math.imul(ah5, bh9)) | 0;
	    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
	    w14 &= 0x3ffffff;
	    /* k = 15 */
	    lo = Math.imul(al9, bl6);
	    mid = Math.imul(al9, bh6);
	    mid = (mid + Math.imul(ah9, bl6)) | 0;
	    hi = Math.imul(ah9, bh6);
	    lo = (lo + Math.imul(al8, bl7)) | 0;
	    mid = (mid + Math.imul(al8, bh7)) | 0;
	    mid = (mid + Math.imul(ah8, bl7)) | 0;
	    hi = (hi + Math.imul(ah8, bh7)) | 0;
	    lo = (lo + Math.imul(al7, bl8)) | 0;
	    mid = (mid + Math.imul(al7, bh8)) | 0;
	    mid = (mid + Math.imul(ah7, bl8)) | 0;
	    hi = (hi + Math.imul(ah7, bh8)) | 0;
	    lo = (lo + Math.imul(al6, bl9)) | 0;
	    mid = (mid + Math.imul(al6, bh9)) | 0;
	    mid = (mid + Math.imul(ah6, bl9)) | 0;
	    hi = (hi + Math.imul(ah6, bh9)) | 0;
	    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
	    w15 &= 0x3ffffff;
	    /* k = 16 */
	    lo = Math.imul(al9, bl7);
	    mid = Math.imul(al9, bh7);
	    mid = (mid + Math.imul(ah9, bl7)) | 0;
	    hi = Math.imul(ah9, bh7);
	    lo = (lo + Math.imul(al8, bl8)) | 0;
	    mid = (mid + Math.imul(al8, bh8)) | 0;
	    mid = (mid + Math.imul(ah8, bl8)) | 0;
	    hi = (hi + Math.imul(ah8, bh8)) | 0;
	    lo = (lo + Math.imul(al7, bl9)) | 0;
	    mid = (mid + Math.imul(al7, bh9)) | 0;
	    mid = (mid + Math.imul(ah7, bl9)) | 0;
	    hi = (hi + Math.imul(ah7, bh9)) | 0;
	    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
	    w16 &= 0x3ffffff;
	    /* k = 17 */
	    lo = Math.imul(al9, bl8);
	    mid = Math.imul(al9, bh8);
	    mid = (mid + Math.imul(ah9, bl8)) | 0;
	    hi = Math.imul(ah9, bh8);
	    lo = (lo + Math.imul(al8, bl9)) | 0;
	    mid = (mid + Math.imul(al8, bh9)) | 0;
	    mid = (mid + Math.imul(ah8, bl9)) | 0;
	    hi = (hi + Math.imul(ah8, bh9)) | 0;
	    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
	    w17 &= 0x3ffffff;
	    /* k = 18 */
	    lo = Math.imul(al9, bl9);
	    mid = Math.imul(al9, bh9);
	    mid = (mid + Math.imul(ah9, bl9)) | 0;
	    hi = Math.imul(ah9, bh9);
	    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
	    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
	    w18 &= 0x3ffffff;
	    o[0] = w0;
	    o[1] = w1;
	    o[2] = w2;
	    o[3] = w3;
	    o[4] = w4;
	    o[5] = w5;
	    o[6] = w6;
	    o[7] = w7;
	    o[8] = w8;
	    o[9] = w9;
	    o[10] = w10;
	    o[11] = w11;
	    o[12] = w12;
	    o[13] = w13;
	    o[14] = w14;
	    o[15] = w15;
	    o[16] = w16;
	    o[17] = w17;
	    o[18] = w18;
	    if (c !== 0) {
	      o[19] = c;
	      out.length++;
	    }
	    return out;
	  };

	  // Polyfill comb
	  if (!Math.imul) {
	    comb10MulTo = smallMulTo;
	  }

	  function bigMulTo (self, num, out) {
	    out.negative = num.negative ^ self.negative;
	    out.length = self.length + num.length;

	    var carry = 0;
	    var hncarry = 0;
	    for (var k = 0; k < out.length - 1; k++) {
	      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
	      // note that ncarry could be >= 0x3ffffff
	      var ncarry = hncarry;
	      hncarry = 0;
	      var rword = carry & 0x3ffffff;
	      var maxJ = Math.min(k, num.length - 1);
	      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
	        var i = k - j;
	        var a = self.words[i] | 0;
	        var b = num.words[j] | 0;
	        var r = a * b;

	        var lo = r & 0x3ffffff;
	        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
	        lo = (lo + rword) | 0;
	        rword = lo & 0x3ffffff;
	        ncarry = (ncarry + (lo >>> 26)) | 0;

	        hncarry += ncarry >>> 26;
	        ncarry &= 0x3ffffff;
	      }
	      out.words[k] = rword;
	      carry = ncarry;
	      ncarry = hncarry;
	    }
	    if (carry !== 0) {
	      out.words[k] = carry;
	    } else {
	      out.length--;
	    }

	    return out.strip();
	  }

	  function jumboMulTo (self, num, out) {
	    var fftm = new FFTM();
	    return fftm.mulp(self, num, out);
	  }

	  BN.prototype.mulTo = function mulTo (num, out) {
	    var res;
	    var len = this.length + num.length;
	    if (this.length === 10 && num.length === 10) {
	      res = comb10MulTo(this, num, out);
	    } else if (len < 63) {
	      res = smallMulTo(this, num, out);
	    } else if (len < 1024) {
	      res = bigMulTo(this, num, out);
	    } else {
	      res = jumboMulTo(this, num, out);
	    }

	    return res;
	  };

	  // Cooley-Tukey algorithm for FFT
	  // slightly revisited to rely on looping instead of recursion

	  function FFTM (x, y) {
	    this.x = x;
	    this.y = y;
	  }

	  FFTM.prototype.makeRBT = function makeRBT (N) {
	    var t = new Array(N);
	    var l = BN.prototype._countBits(N) - 1;
	    for (var i = 0; i < N; i++) {
	      t[i] = this.revBin(i, l, N);
	    }

	    return t;
	  };

	  // Returns binary-reversed representation of `x`
	  FFTM.prototype.revBin = function revBin (x, l, N) {
	    if (x === 0 || x === N - 1) return x;

	    var rb = 0;
	    for (var i = 0; i < l; i++) {
	      rb |= (x & 1) << (l - i - 1);
	      x >>= 1;
	    }

	    return rb;
	  };

	  // Performs "tweedling" phase, therefore 'emulating'
	  // behaviour of the recursive algorithm
	  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
	    for (var i = 0; i < N; i++) {
	      rtws[i] = rws[rbt[i]];
	      itws[i] = iws[rbt[i]];
	    }
	  };

	  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
	    this.permute(rbt, rws, iws, rtws, itws, N);

	    for (var s = 1; s < N; s <<= 1) {
	      var l = s << 1;

	      var rtwdf = Math.cos(2 * Math.PI / l);
	      var itwdf = Math.sin(2 * Math.PI / l);

	      for (var p = 0; p < N; p += l) {
	        var rtwdf_ = rtwdf;
	        var itwdf_ = itwdf;

	        for (var j = 0; j < s; j++) {
	          var re = rtws[p + j];
	          var ie = itws[p + j];

	          var ro = rtws[p + j + s];
	          var io = itws[p + j + s];

	          var rx = rtwdf_ * ro - itwdf_ * io;

	          io = rtwdf_ * io + itwdf_ * ro;
	          ro = rx;

	          rtws[p + j] = re + ro;
	          itws[p + j] = ie + io;

	          rtws[p + j + s] = re - ro;
	          itws[p + j + s] = ie - io;

	          /* jshint maxdepth : false */
	          if (j !== l) {
	            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

	            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
	            rtwdf_ = rx;
	          }
	        }
	      }
	    }
	  };

	  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
	    var N = Math.max(m, n) | 1;
	    var odd = N & 1;
	    var i = 0;
	    for (N = N / 2 | 0; N; N = N >>> 1) {
	      i++;
	    }

	    return 1 << i + 1 + odd;
	  };

	  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
	    if (N <= 1) return;

	    for (var i = 0; i < N / 2; i++) {
	      var t = rws[i];

	      rws[i] = rws[N - i - 1];
	      rws[N - i - 1] = t;

	      t = iws[i];

	      iws[i] = -iws[N - i - 1];
	      iws[N - i - 1] = -t;
	    }
	  };

	  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
	    var carry = 0;
	    for (var i = 0; i < N / 2; i++) {
	      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
	        Math.round(ws[2 * i] / N) +
	        carry;

	      ws[i] = w & 0x3ffffff;

	      if (w < 0x4000000) {
	        carry = 0;
	      } else {
	        carry = w / 0x4000000 | 0;
	      }
	    }

	    return ws;
	  };

	  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
	    var carry = 0;
	    for (var i = 0; i < len; i++) {
	      carry = carry + (ws[i] | 0);

	      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
	      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
	    }

	    // Pad with zeroes
	    for (i = 2 * len; i < N; ++i) {
	      rws[i] = 0;
	    }

	    assert(carry === 0);
	    assert((carry & ~0x1fff) === 0);
	  };

	  FFTM.prototype.stub = function stub (N) {
	    var ph = new Array(N);
	    for (var i = 0; i < N; i++) {
	      ph[i] = 0;
	    }

	    return ph;
	  };

	  FFTM.prototype.mulp = function mulp (x, y, out) {
	    var N = 2 * this.guessLen13b(x.length, y.length);

	    var rbt = this.makeRBT(N);

	    var _ = this.stub(N);

	    var rws = new Array(N);
	    var rwst = new Array(N);
	    var iwst = new Array(N);

	    var nrws = new Array(N);
	    var nrwst = new Array(N);
	    var niwst = new Array(N);

	    var rmws = out.words;
	    rmws.length = N;

	    this.convert13b(x.words, x.length, rws, N);
	    this.convert13b(y.words, y.length, nrws, N);

	    this.transform(rws, _, rwst, iwst, N, rbt);
	    this.transform(nrws, _, nrwst, niwst, N, rbt);

	    for (var i = 0; i < N; i++) {
	      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
	      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
	      rwst[i] = rx;
	    }

	    this.conjugate(rwst, iwst, N);
	    this.transform(rwst, iwst, rmws, _, N, rbt);
	    this.conjugate(rmws, _, N);
	    this.normalize13b(rmws, N);

	    out.negative = x.negative ^ y.negative;
	    out.length = x.length + y.length;
	    return out.strip();
	  };

	  // Multiply `this` by `num`
	  BN.prototype.mul = function mul (num) {
	    var out = new BN(null);
	    out.words = new Array(this.length + num.length);
	    return this.mulTo(num, out);
	  };

	  // Multiply employing FFT
	  BN.prototype.mulf = function mulf (num) {
	    var out = new BN(null);
	    out.words = new Array(this.length + num.length);
	    return jumboMulTo(this, num, out);
	  };

	  // In-place Multiplication
	  BN.prototype.imul = function imul (num) {
	    return this.clone().mulTo(num, this);
	  };

	  BN.prototype.imuln = function imuln (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);

	    // Carry
	    var carry = 0;
	    for (var i = 0; i < this.length; i++) {
	      var w = (this.words[i] | 0) * num;
	      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
	      carry >>= 26;
	      carry += (w / 0x4000000) | 0;
	      // NOTE: lo is 27bit maximum
	      carry += lo >>> 26;
	      this.words[i] = lo & 0x3ffffff;
	    }

	    if (carry !== 0) {
	      this.words[i] = carry;
	      this.length++;
	    }

	    return this;
	  };

	  BN.prototype.muln = function muln (num) {
	    return this.clone().imuln(num);
	  };

	  // `this` * `this`
	  BN.prototype.sqr = function sqr () {
	    return this.mul(this);
	  };

	  // `this` * `this` in-place
	  BN.prototype.isqr = function isqr () {
	    return this.imul(this.clone());
	  };

	  // Math.pow(`this`, `num`)
	  BN.prototype.pow = function pow (num) {
	    var w = toBitArray(num);
	    if (w.length === 0) return new BN(1);

	    // Skip leading zeroes
	    var res = this;
	    for (var i = 0; i < w.length; i++, res = res.sqr()) {
	      if (w[i] !== 0) break;
	    }

	    if (++i < w.length) {
	      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
	        if (w[i] === 0) continue;

	        res = res.mul(q);
	      }
	    }

	    return res;
	  };

	  // Shift-left in-place
	  BN.prototype.iushln = function iushln (bits) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var r = bits % 26;
	    var s = (bits - r) / 26;
	    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
	    var i;

	    if (r !== 0) {
	      var carry = 0;

	      for (i = 0; i < this.length; i++) {
	        var newCarry = this.words[i] & carryMask;
	        var c = ((this.words[i] | 0) - newCarry) << r;
	        this.words[i] = c | carry;
	        carry = newCarry >>> (26 - r);
	      }

	      if (carry) {
	        this.words[i] = carry;
	        this.length++;
	      }
	    }

	    if (s !== 0) {
	      for (i = this.length - 1; i >= 0; i--) {
	        this.words[i + s] = this.words[i];
	      }

	      for (i = 0; i < s; i++) {
	        this.words[i] = 0;
	      }

	      this.length += s;
	    }

	    return this.strip();
	  };

	  BN.prototype.ishln = function ishln (bits) {
	    // TODO(indutny): implement me
	    assert(this.negative === 0);
	    return this.iushln(bits);
	  };

	  // Shift-right in-place
	  // NOTE: `hint` is a lowest bit before trailing zeroes
	  // NOTE: if `extended` is present - it will be filled with destroyed bits
	  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var h;
	    if (hint) {
	      h = (hint - (hint % 26)) / 26;
	    } else {
	      h = 0;
	    }

	    var r = bits % 26;
	    var s = Math.min((bits - r) / 26, this.length);
	    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	    var maskedWords = extended;

	    h -= s;
	    h = Math.max(0, h);

	    // Extended mode, copy masked part
	    if (maskedWords) {
	      for (var i = 0; i < s; i++) {
	        maskedWords.words[i] = this.words[i];
	      }
	      maskedWords.length = s;
	    }

	    if (s === 0) ; else if (this.length > s) {
	      this.length -= s;
	      for (i = 0; i < this.length; i++) {
	        this.words[i] = this.words[i + s];
	      }
	    } else {
	      this.words[0] = 0;
	      this.length = 1;
	    }

	    var carry = 0;
	    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
	      var word = this.words[i] | 0;
	      this.words[i] = (carry << (26 - r)) | (word >>> r);
	      carry = word & mask;
	    }

	    // Push carried bits as a mask
	    if (maskedWords && carry !== 0) {
	      maskedWords.words[maskedWords.length++] = carry;
	    }

	    if (this.length === 0) {
	      this.words[0] = 0;
	      this.length = 1;
	    }

	    return this.strip();
	  };

	  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
	    // TODO(indutny): implement me
	    assert(this.negative === 0);
	    return this.iushrn(bits, hint, extended);
	  };

	  // Shift-left
	  BN.prototype.shln = function shln (bits) {
	    return this.clone().ishln(bits);
	  };

	  BN.prototype.ushln = function ushln (bits) {
	    return this.clone().iushln(bits);
	  };

	  // Shift-right
	  BN.prototype.shrn = function shrn (bits) {
	    return this.clone().ishrn(bits);
	  };

	  BN.prototype.ushrn = function ushrn (bits) {
	    return this.clone().iushrn(bits);
	  };

	  // Test if n bit is set
	  BN.prototype.testn = function testn (bit) {
	    assert(typeof bit === 'number' && bit >= 0);
	    var r = bit % 26;
	    var s = (bit - r) / 26;
	    var q = 1 << r;

	    // Fast case: bit is much higher than all existing words
	    if (this.length <= s) return false;

	    // Check bit and return
	    var w = this.words[s];

	    return !!(w & q);
	  };

	  // Return only lowers bits of number (in-place)
	  BN.prototype.imaskn = function imaskn (bits) {
	    assert(typeof bits === 'number' && bits >= 0);
	    var r = bits % 26;
	    var s = (bits - r) / 26;

	    assert(this.negative === 0, 'imaskn works only with positive numbers');

	    if (this.length <= s) {
	      return this;
	    }

	    if (r !== 0) {
	      s++;
	    }
	    this.length = Math.min(s, this.length);

	    if (r !== 0) {
	      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
	      this.words[this.length - 1] &= mask;
	    }

	    return this.strip();
	  };

	  // Return only lowers bits of number
	  BN.prototype.maskn = function maskn (bits) {
	    return this.clone().imaskn(bits);
	  };

	  // Add plain number `num` to `this`
	  BN.prototype.iaddn = function iaddn (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);
	    if (num < 0) return this.isubn(-num);

	    // Possible sign change
	    if (this.negative !== 0) {
	      if (this.length === 1 && (this.words[0] | 0) < num) {
	        this.words[0] = num - (this.words[0] | 0);
	        this.negative = 0;
	        return this;
	      }

	      this.negative = 0;
	      this.isubn(num);
	      this.negative = 1;
	      return this;
	    }

	    // Add without checks
	    return this._iaddn(num);
	  };

	  BN.prototype._iaddn = function _iaddn (num) {
	    this.words[0] += num;

	    // Carry
	    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
	      this.words[i] -= 0x4000000;
	      if (i === this.length - 1) {
	        this.words[i + 1] = 1;
	      } else {
	        this.words[i + 1]++;
	      }
	    }
	    this.length = Math.max(this.length, i + 1);

	    return this;
	  };

	  // Subtract plain number `num` from `this`
	  BN.prototype.isubn = function isubn (num) {
	    assert(typeof num === 'number');
	    assert(num < 0x4000000);
	    if (num < 0) return this.iaddn(-num);

	    if (this.negative !== 0) {
	      this.negative = 0;
	      this.iaddn(num);
	      this.negative = 1;
	      return this;
	    }

	    this.words[0] -= num;

	    if (this.length === 1 && this.words[0] < 0) {
	      this.words[0] = -this.words[0];
	      this.negative = 1;
	    } else {
	      // Carry
	      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
	        this.words[i] += 0x4000000;
	        this.words[i + 1] -= 1;
	      }
	    }

	    return this.strip();
	  };

	  BN.prototype.addn = function addn (num) {
	    return this.clone().iaddn(num);
	  };

	  BN.prototype.subn = function subn (num) {
	    return this.clone().isubn(num);
	  };

	  BN.prototype.iabs = function iabs () {
	    this.negative = 0;

	    return this;
	  };

	  BN.prototype.abs = function abs () {
	    return this.clone().iabs();
	  };

	  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
	    var len = num.length + shift;
	    var i;

	    this._expand(len);

	    var w;
	    var carry = 0;
	    for (i = 0; i < num.length; i++) {
	      w = (this.words[i + shift] | 0) + carry;
	      var right = (num.words[i] | 0) * mul;
	      w -= right & 0x3ffffff;
	      carry = (w >> 26) - ((right / 0x4000000) | 0);
	      this.words[i + shift] = w & 0x3ffffff;
	    }
	    for (; i < this.length - shift; i++) {
	      w = (this.words[i + shift] | 0) + carry;
	      carry = w >> 26;
	      this.words[i + shift] = w & 0x3ffffff;
	    }

	    if (carry === 0) return this.strip();

	    // Subtraction overflow
	    assert(carry === -1);
	    carry = 0;
	    for (i = 0; i < this.length; i++) {
	      w = -(this.words[i] | 0) + carry;
	      carry = w >> 26;
	      this.words[i] = w & 0x3ffffff;
	    }
	    this.negative = 1;

	    return this.strip();
	  };

	  BN.prototype._wordDiv = function _wordDiv (num, mode) {
	    var shift = this.length - num.length;

	    var a = this.clone();
	    var b = num;

	    // Normalize
	    var bhi = b.words[b.length - 1] | 0;
	    var bhiBits = this._countBits(bhi);
	    shift = 26 - bhiBits;
	    if (shift !== 0) {
	      b = b.ushln(shift);
	      a.iushln(shift);
	      bhi = b.words[b.length - 1] | 0;
	    }

	    // Initialize quotient
	    var m = a.length - b.length;
	    var q;

	    if (mode !== 'mod') {
	      q = new BN(null);
	      q.length = m + 1;
	      q.words = new Array(q.length);
	      for (var i = 0; i < q.length; i++) {
	        q.words[i] = 0;
	      }
	    }

	    var diff = a.clone()._ishlnsubmul(b, 1, m);
	    if (diff.negative === 0) {
	      a = diff;
	      if (q) {
	        q.words[m] = 1;
	      }
	    }

	    for (var j = m - 1; j >= 0; j--) {
	      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
	        (a.words[b.length + j - 1] | 0);

	      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
	      // (0x7ffffff)
	      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

	      a._ishlnsubmul(b, qj, j);
	      while (a.negative !== 0) {
	        qj--;
	        a.negative = 0;
	        a._ishlnsubmul(b, 1, j);
	        if (!a.isZero()) {
	          a.negative ^= 1;
	        }
	      }
	      if (q) {
	        q.words[j] = qj;
	      }
	    }
	    if (q) {
	      q.strip();
	    }
	    a.strip();

	    // Denormalize
	    if (mode !== 'div' && shift !== 0) {
	      a.iushrn(shift);
	    }

	    return {
	      div: q || null,
	      mod: a
	    };
	  };

	  // NOTE: 1) `mode` can be set to `mod` to request mod only,
	  //       to `div` to request div only, or be absent to
	  //       request both div & mod
	  //       2) `positive` is true if unsigned mod is requested
	  BN.prototype.divmod = function divmod (num, mode, positive) {
	    assert(!num.isZero());

	    if (this.isZero()) {
	      return {
	        div: new BN(0),
	        mod: new BN(0)
	      };
	    }

	    var div, mod, res;
	    if (this.negative !== 0 && num.negative === 0) {
	      res = this.neg().divmod(num, mode);

	      if (mode !== 'mod') {
	        div = res.div.neg();
	      }

	      if (mode !== 'div') {
	        mod = res.mod.neg();
	        if (positive && mod.negative !== 0) {
	          mod.iadd(num);
	        }
	      }

	      return {
	        div: div,
	        mod: mod
	      };
	    }

	    if (this.negative === 0 && num.negative !== 0) {
	      res = this.divmod(num.neg(), mode);

	      if (mode !== 'mod') {
	        div = res.div.neg();
	      }

	      return {
	        div: div,
	        mod: res.mod
	      };
	    }

	    if ((this.negative & num.negative) !== 0) {
	      res = this.neg().divmod(num.neg(), mode);

	      if (mode !== 'div') {
	        mod = res.mod.neg();
	        if (positive && mod.negative !== 0) {
	          mod.isub(num);
	        }
	      }

	      return {
	        div: res.div,
	        mod: mod
	      };
	    }

	    // Both numbers are positive at this point

	    // Strip both numbers to approximate shift value
	    if (num.length > this.length || this.cmp(num) < 0) {
	      return {
	        div: new BN(0),
	        mod: this
	      };
	    }

	    // Very short reduction
	    if (num.length === 1) {
	      if (mode === 'div') {
	        return {
	          div: this.divn(num.words[0]),
	          mod: null
	        };
	      }

	      if (mode === 'mod') {
	        return {
	          div: null,
	          mod: new BN(this.modn(num.words[0]))
	        };
	      }

	      return {
	        div: this.divn(num.words[0]),
	        mod: new BN(this.modn(num.words[0]))
	      };
	    }

	    return this._wordDiv(num, mode);
	  };

	  // Find `this` / `num`
	  BN.prototype.div = function div (num) {
	    return this.divmod(num, 'div', false).div;
	  };

	  // Find `this` % `num`
	  BN.prototype.mod = function mod (num) {
	    return this.divmod(num, 'mod', false).mod;
	  };

	  BN.prototype.umod = function umod (num) {
	    return this.divmod(num, 'mod', true).mod;
	  };

	  // Find Round(`this` / `num`)
	  BN.prototype.divRound = function divRound (num) {
	    var dm = this.divmod(num);

	    // Fast case - exact division
	    if (dm.mod.isZero()) return dm.div;

	    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

	    var half = num.ushrn(1);
	    var r2 = num.andln(1);
	    var cmp = mod.cmp(half);

	    // Round down
	    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

	    // Round up
	    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
	  };

	  BN.prototype.modn = function modn (num) {
	    assert(num <= 0x3ffffff);
	    var p = (1 << 26) % num;

	    var acc = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      acc = (p * acc + (this.words[i] | 0)) % num;
	    }

	    return acc;
	  };

	  // In-place division by number
	  BN.prototype.idivn = function idivn (num) {
	    assert(num <= 0x3ffffff);

	    var carry = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      var w = (this.words[i] | 0) + carry * 0x4000000;
	      this.words[i] = (w / num) | 0;
	      carry = w % num;
	    }

	    return this.strip();
	  };

	  BN.prototype.divn = function divn (num) {
	    return this.clone().idivn(num);
	  };

	  BN.prototype.egcd = function egcd (p) {
	    assert(p.negative === 0);
	    assert(!p.isZero());

	    var x = this;
	    var y = p.clone();

	    if (x.negative !== 0) {
	      x = x.umod(p);
	    } else {
	      x = x.clone();
	    }

	    // A * x + B * y = x
	    var A = new BN(1);
	    var B = new BN(0);

	    // C * x + D * y = y
	    var C = new BN(0);
	    var D = new BN(1);

	    var g = 0;

	    while (x.isEven() && y.isEven()) {
	      x.iushrn(1);
	      y.iushrn(1);
	      ++g;
	    }

	    var yp = y.clone();
	    var xp = x.clone();

	    while (!x.isZero()) {
	      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
	      if (i > 0) {
	        x.iushrn(i);
	        while (i-- > 0) {
	          if (A.isOdd() || B.isOdd()) {
	            A.iadd(yp);
	            B.isub(xp);
	          }

	          A.iushrn(1);
	          B.iushrn(1);
	        }
	      }

	      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
	      if (j > 0) {
	        y.iushrn(j);
	        while (j-- > 0) {
	          if (C.isOdd() || D.isOdd()) {
	            C.iadd(yp);
	            D.isub(xp);
	          }

	          C.iushrn(1);
	          D.iushrn(1);
	        }
	      }

	      if (x.cmp(y) >= 0) {
	        x.isub(y);
	        A.isub(C);
	        B.isub(D);
	      } else {
	        y.isub(x);
	        C.isub(A);
	        D.isub(B);
	      }
	    }

	    return {
	      a: C,
	      b: D,
	      gcd: y.iushln(g)
	    };
	  };

	  // This is reduced incarnation of the binary EEA
	  // above, designated to invert members of the
	  // _prime_ fields F(p) at a maximal speed
	  BN.prototype._invmp = function _invmp (p) {
	    assert(p.negative === 0);
	    assert(!p.isZero());

	    var a = this;
	    var b = p.clone();

	    if (a.negative !== 0) {
	      a = a.umod(p);
	    } else {
	      a = a.clone();
	    }

	    var x1 = new BN(1);
	    var x2 = new BN(0);

	    var delta = b.clone();

	    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
	      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
	      if (i > 0) {
	        a.iushrn(i);
	        while (i-- > 0) {
	          if (x1.isOdd()) {
	            x1.iadd(delta);
	          }

	          x1.iushrn(1);
	        }
	      }

	      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
	      if (j > 0) {
	        b.iushrn(j);
	        while (j-- > 0) {
	          if (x2.isOdd()) {
	            x2.iadd(delta);
	          }

	          x2.iushrn(1);
	        }
	      }

	      if (a.cmp(b) >= 0) {
	        a.isub(b);
	        x1.isub(x2);
	      } else {
	        b.isub(a);
	        x2.isub(x1);
	      }
	    }

	    var res;
	    if (a.cmpn(1) === 0) {
	      res = x1;
	    } else {
	      res = x2;
	    }

	    if (res.cmpn(0) < 0) {
	      res.iadd(p);
	    }

	    return res;
	  };

	  BN.prototype.gcd = function gcd (num) {
	    if (this.isZero()) return num.abs();
	    if (num.isZero()) return this.abs();

	    var a = this.clone();
	    var b = num.clone();
	    a.negative = 0;
	    b.negative = 0;

	    // Remove common factor of two
	    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
	      a.iushrn(1);
	      b.iushrn(1);
	    }

	    do {
	      while (a.isEven()) {
	        a.iushrn(1);
	      }
	      while (b.isEven()) {
	        b.iushrn(1);
	      }

	      var r = a.cmp(b);
	      if (r < 0) {
	        // Swap `a` and `b` to make `a` always bigger than `b`
	        var t = a;
	        a = b;
	        b = t;
	      } else if (r === 0 || b.cmpn(1) === 0) {
	        break;
	      }

	      a.isub(b);
	    } while (true);

	    return b.iushln(shift);
	  };

	  // Invert number in the field F(num)
	  BN.prototype.invm = function invm (num) {
	    return this.egcd(num).a.umod(num);
	  };

	  BN.prototype.isEven = function isEven () {
	    return (this.words[0] & 1) === 0;
	  };

	  BN.prototype.isOdd = function isOdd () {
	    return (this.words[0] & 1) === 1;
	  };

	  // And first word and num
	  BN.prototype.andln = function andln (num) {
	    return this.words[0] & num;
	  };

	  // Increment at the bit position in-line
	  BN.prototype.bincn = function bincn (bit) {
	    assert(typeof bit === 'number');
	    var r = bit % 26;
	    var s = (bit - r) / 26;
	    var q = 1 << r;

	    // Fast case: bit is much higher than all existing words
	    if (this.length <= s) {
	      this._expand(s + 1);
	      this.words[s] |= q;
	      return this;
	    }

	    // Add bit and propagate, if needed
	    var carry = q;
	    for (var i = s; carry !== 0 && i < this.length; i++) {
	      var w = this.words[i] | 0;
	      w += carry;
	      carry = w >>> 26;
	      w &= 0x3ffffff;
	      this.words[i] = w;
	    }
	    if (carry !== 0) {
	      this.words[i] = carry;
	      this.length++;
	    }
	    return this;
	  };

	  BN.prototype.isZero = function isZero () {
	    return this.length === 1 && this.words[0] === 0;
	  };

	  BN.prototype.cmpn = function cmpn (num) {
	    var negative = num < 0;

	    if (this.negative !== 0 && !negative) return -1;
	    if (this.negative === 0 && negative) return 1;

	    this.strip();

	    var res;
	    if (this.length > 1) {
	      res = 1;
	    } else {
	      if (negative) {
	        num = -num;
	      }

	      assert(num <= 0x3ffffff, 'Number is too big');

	      var w = this.words[0] | 0;
	      res = w === num ? 0 : w < num ? -1 : 1;
	    }
	    if (this.negative !== 0) return -res | 0;
	    return res;
	  };

	  // Compare two numbers and return:
	  // 1 - if `this` > `num`
	  // 0 - if `this` == `num`
	  // -1 - if `this` < `num`
	  BN.prototype.cmp = function cmp (num) {
	    if (this.negative !== 0 && num.negative === 0) return -1;
	    if (this.negative === 0 && num.negative !== 0) return 1;

	    var res = this.ucmp(num);
	    if (this.negative !== 0) return -res | 0;
	    return res;
	  };

	  // Unsigned comparison
	  BN.prototype.ucmp = function ucmp (num) {
	    // At this point both numbers have the same sign
	    if (this.length > num.length) return 1;
	    if (this.length < num.length) return -1;

	    var res = 0;
	    for (var i = this.length - 1; i >= 0; i--) {
	      var a = this.words[i] | 0;
	      var b = num.words[i] | 0;

	      if (a === b) continue;
	      if (a < b) {
	        res = -1;
	      } else if (a > b) {
	        res = 1;
	      }
	      break;
	    }
	    return res;
	  };

	  BN.prototype.gtn = function gtn (num) {
	    return this.cmpn(num) === 1;
	  };

	  BN.prototype.gt = function gt (num) {
	    return this.cmp(num) === 1;
	  };

	  BN.prototype.gten = function gten (num) {
	    return this.cmpn(num) >= 0;
	  };

	  BN.prototype.gte = function gte (num) {
	    return this.cmp(num) >= 0;
	  };

	  BN.prototype.ltn = function ltn (num) {
	    return this.cmpn(num) === -1;
	  };

	  BN.prototype.lt = function lt (num) {
	    return this.cmp(num) === -1;
	  };

	  BN.prototype.lten = function lten (num) {
	    return this.cmpn(num) <= 0;
	  };

	  BN.prototype.lte = function lte (num) {
	    return this.cmp(num) <= 0;
	  };

	  BN.prototype.eqn = function eqn (num) {
	    return this.cmpn(num) === 0;
	  };

	  BN.prototype.eq = function eq (num) {
	    return this.cmp(num) === 0;
	  };

	  //
	  // A reduce context, could be using montgomery or something better, depending
	  // on the `m` itself.
	  //
	  BN.red = function red (num) {
	    return new Red(num);
	  };

	  BN.prototype.toRed = function toRed (ctx) {
	    assert(!this.red, 'Already a number in reduction context');
	    assert(this.negative === 0, 'red works only with positives');
	    return ctx.convertTo(this)._forceRed(ctx);
	  };

	  BN.prototype.fromRed = function fromRed () {
	    assert(this.red, 'fromRed works only with numbers in reduction context');
	    return this.red.convertFrom(this);
	  };

	  BN.prototype._forceRed = function _forceRed (ctx) {
	    this.red = ctx;
	    return this;
	  };

	  BN.prototype.forceRed = function forceRed (ctx) {
	    assert(!this.red, 'Already a number in reduction context');
	    return this._forceRed(ctx);
	  };

	  BN.prototype.redAdd = function redAdd (num) {
	    assert(this.red, 'redAdd works only with red numbers');
	    return this.red.add(this, num);
	  };

	  BN.prototype.redIAdd = function redIAdd (num) {
	    assert(this.red, 'redIAdd works only with red numbers');
	    return this.red.iadd(this, num);
	  };

	  BN.prototype.redSub = function redSub (num) {
	    assert(this.red, 'redSub works only with red numbers');
	    return this.red.sub(this, num);
	  };

	  BN.prototype.redISub = function redISub (num) {
	    assert(this.red, 'redISub works only with red numbers');
	    return this.red.isub(this, num);
	  };

	  BN.prototype.redShl = function redShl (num) {
	    assert(this.red, 'redShl works only with red numbers');
	    return this.red.shl(this, num);
	  };

	  BN.prototype.redMul = function redMul (num) {
	    assert(this.red, 'redMul works only with red numbers');
	    this.red._verify2(this, num);
	    return this.red.mul(this, num);
	  };

	  BN.prototype.redIMul = function redIMul (num) {
	    assert(this.red, 'redMul works only with red numbers');
	    this.red._verify2(this, num);
	    return this.red.imul(this, num);
	  };

	  BN.prototype.redSqr = function redSqr () {
	    assert(this.red, 'redSqr works only with red numbers');
	    this.red._verify1(this);
	    return this.red.sqr(this);
	  };

	  BN.prototype.redISqr = function redISqr () {
	    assert(this.red, 'redISqr works only with red numbers');
	    this.red._verify1(this);
	    return this.red.isqr(this);
	  };

	  // Square root over p
	  BN.prototype.redSqrt = function redSqrt () {
	    assert(this.red, 'redSqrt works only with red numbers');
	    this.red._verify1(this);
	    return this.red.sqrt(this);
	  };

	  BN.prototype.redInvm = function redInvm () {
	    assert(this.red, 'redInvm works only with red numbers');
	    this.red._verify1(this);
	    return this.red.invm(this);
	  };

	  // Return negative clone of `this` % `red modulo`
	  BN.prototype.redNeg = function redNeg () {
	    assert(this.red, 'redNeg works only with red numbers');
	    this.red._verify1(this);
	    return this.red.neg(this);
	  };

	  BN.prototype.redPow = function redPow (num) {
	    assert(this.red && !num.red, 'redPow(normalNum)');
	    this.red._verify1(this);
	    return this.red.pow(this, num);
	  };

	  // Prime numbers with efficient reduction
	  var primes = {
	    k256: null,
	    p224: null,
	    p192: null,
	    p25519: null
	  };

	  // Pseudo-Mersenne prime
	  function MPrime (name, p) {
	    // P = 2 ^ N - K
	    this.name = name;
	    this.p = new BN(p, 16);
	    this.n = this.p.bitLength();
	    this.k = new BN(1).iushln(this.n).isub(this.p);

	    this.tmp = this._tmp();
	  }

	  MPrime.prototype._tmp = function _tmp () {
	    var tmp = new BN(null);
	    tmp.words = new Array(Math.ceil(this.n / 13));
	    return tmp;
	  };

	  MPrime.prototype.ireduce = function ireduce (num) {
	    // Assumes that `num` is less than `P^2`
	    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
	    var r = num;
	    var rlen;

	    do {
	      this.split(r, this.tmp);
	      r = this.imulK(r);
	      r = r.iadd(this.tmp);
	      rlen = r.bitLength();
	    } while (rlen > this.n);

	    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
	    if (cmp === 0) {
	      r.words[0] = 0;
	      r.length = 1;
	    } else if (cmp > 0) {
	      r.isub(this.p);
	    } else {
	      r.strip();
	    }

	    return r;
	  };

	  MPrime.prototype.split = function split (input, out) {
	    input.iushrn(this.n, 0, out);
	  };

	  MPrime.prototype.imulK = function imulK (num) {
	    return num.imul(this.k);
	  };

	  function K256 () {
	    MPrime.call(
	      this,
	      'k256',
	      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
	  }
	  inherits(K256, MPrime);

	  K256.prototype.split = function split (input, output) {
	    // 256 = 9 * 26 + 22
	    var mask = 0x3fffff;

	    var outLen = Math.min(input.length, 9);
	    for (var i = 0; i < outLen; i++) {
	      output.words[i] = input.words[i];
	    }
	    output.length = outLen;

	    if (input.length <= 9) {
	      input.words[0] = 0;
	      input.length = 1;
	      return;
	    }

	    // Shift by 9 limbs
	    var prev = input.words[9];
	    output.words[output.length++] = prev & mask;

	    for (i = 10; i < input.length; i++) {
	      var next = input.words[i] | 0;
	      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
	      prev = next;
	    }
	    prev >>>= 22;
	    input.words[i - 10] = prev;
	    if (prev === 0 && input.length > 10) {
	      input.length -= 10;
	    } else {
	      input.length -= 9;
	    }
	  };

	  K256.prototype.imulK = function imulK (num) {
	    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
	    num.words[num.length] = 0;
	    num.words[num.length + 1] = 0;
	    num.length += 2;

	    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
	    var lo = 0;
	    for (var i = 0; i < num.length; i++) {
	      var w = num.words[i] | 0;
	      lo += w * 0x3d1;
	      num.words[i] = lo & 0x3ffffff;
	      lo = w * 0x40 + ((lo / 0x4000000) | 0);
	    }

	    // Fast length reduction
	    if (num.words[num.length - 1] === 0) {
	      num.length--;
	      if (num.words[num.length - 1] === 0) {
	        num.length--;
	      }
	    }
	    return num;
	  };

	  function P224 () {
	    MPrime.call(
	      this,
	      'p224',
	      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
	  }
	  inherits(P224, MPrime);

	  function P192 () {
	    MPrime.call(
	      this,
	      'p192',
	      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
	  }
	  inherits(P192, MPrime);

	  function P25519 () {
	    // 2 ^ 255 - 19
	    MPrime.call(
	      this,
	      '25519',
	      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
	  }
	  inherits(P25519, MPrime);

	  P25519.prototype.imulK = function imulK (num) {
	    // K = 0x13
	    var carry = 0;
	    for (var i = 0; i < num.length; i++) {
	      var hi = (num.words[i] | 0) * 0x13 + carry;
	      var lo = hi & 0x3ffffff;
	      hi >>>= 26;

	      num.words[i] = lo;
	      carry = hi;
	    }
	    if (carry !== 0) {
	      num.words[num.length++] = carry;
	    }
	    return num;
	  };

	  // Exported mostly for testing purposes, use plain name instead
	  BN._prime = function prime (name) {
	    // Cached version of prime
	    if (primes[name]) return primes[name];

	    var prime;
	    if (name === 'k256') {
	      prime = new K256();
	    } else if (name === 'p224') {
	      prime = new P224();
	    } else if (name === 'p192') {
	      prime = new P192();
	    } else if (name === 'p25519') {
	      prime = new P25519();
	    } else {
	      throw new Error('Unknown prime ' + name);
	    }
	    primes[name] = prime;

	    return prime;
	  };

	  //
	  // Base reduction engine
	  //
	  function Red (m) {
	    if (typeof m === 'string') {
	      var prime = BN._prime(m);
	      this.m = prime.p;
	      this.prime = prime;
	    } else {
	      assert(m.gtn(1), 'modulus must be greater than 1');
	      this.m = m;
	      this.prime = null;
	    }
	  }

	  Red.prototype._verify1 = function _verify1 (a) {
	    assert(a.negative === 0, 'red works only with positives');
	    assert(a.red, 'red works only with red numbers');
	  };

	  Red.prototype._verify2 = function _verify2 (a, b) {
	    assert((a.negative | b.negative) === 0, 'red works only with positives');
	    assert(a.red && a.red === b.red,
	      'red works only with red numbers');
	  };

	  Red.prototype.imod = function imod (a) {
	    if (this.prime) return this.prime.ireduce(a)._forceRed(this);
	    return a.umod(this.m)._forceRed(this);
	  };

	  Red.prototype.neg = function neg (a) {
	    if (a.isZero()) {
	      return a.clone();
	    }

	    return this.m.sub(a)._forceRed(this);
	  };

	  Red.prototype.add = function add (a, b) {
	    this._verify2(a, b);

	    var res = a.add(b);
	    if (res.cmp(this.m) >= 0) {
	      res.isub(this.m);
	    }
	    return res._forceRed(this);
	  };

	  Red.prototype.iadd = function iadd (a, b) {
	    this._verify2(a, b);

	    var res = a.iadd(b);
	    if (res.cmp(this.m) >= 0) {
	      res.isub(this.m);
	    }
	    return res;
	  };

	  Red.prototype.sub = function sub (a, b) {
	    this._verify2(a, b);

	    var res = a.sub(b);
	    if (res.cmpn(0) < 0) {
	      res.iadd(this.m);
	    }
	    return res._forceRed(this);
	  };

	  Red.prototype.isub = function isub (a, b) {
	    this._verify2(a, b);

	    var res = a.isub(b);
	    if (res.cmpn(0) < 0) {
	      res.iadd(this.m);
	    }
	    return res;
	  };

	  Red.prototype.shl = function shl (a, num) {
	    this._verify1(a);
	    return this.imod(a.ushln(num));
	  };

	  Red.prototype.imul = function imul (a, b) {
	    this._verify2(a, b);
	    return this.imod(a.imul(b));
	  };

	  Red.prototype.mul = function mul (a, b) {
	    this._verify2(a, b);
	    return this.imod(a.mul(b));
	  };

	  Red.prototype.isqr = function isqr (a) {
	    return this.imul(a, a.clone());
	  };

	  Red.prototype.sqr = function sqr (a) {
	    return this.mul(a, a);
	  };

	  Red.prototype.sqrt = function sqrt (a) {
	    if (a.isZero()) return a.clone();

	    var mod3 = this.m.andln(3);
	    assert(mod3 % 2 === 1);

	    // Fast case
	    if (mod3 === 3) {
	      var pow = this.m.add(new BN(1)).iushrn(2);
	      return this.pow(a, pow);
	    }

	    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
	    //
	    // Find Q and S, that Q * 2 ^ S = (P - 1)
	    var q = this.m.subn(1);
	    var s = 0;
	    while (!q.isZero() && q.andln(1) === 0) {
	      s++;
	      q.iushrn(1);
	    }
	    assert(!q.isZero());

	    var one = new BN(1).toRed(this);
	    var nOne = one.redNeg();

	    // Find quadratic non-residue
	    // NOTE: Max is such because of generalized Riemann hypothesis.
	    var lpow = this.m.subn(1).iushrn(1);
	    var z = this.m.bitLength();
	    z = new BN(2 * z * z).toRed(this);

	    while (this.pow(z, lpow).cmp(nOne) !== 0) {
	      z.redIAdd(nOne);
	    }

	    var c = this.pow(z, q);
	    var r = this.pow(a, q.addn(1).iushrn(1));
	    var t = this.pow(a, q);
	    var m = s;
	    while (t.cmp(one) !== 0) {
	      var tmp = t;
	      for (var i = 0; tmp.cmp(one) !== 0; i++) {
	        tmp = tmp.redSqr();
	      }
	      assert(i < m);
	      var b = this.pow(c, new BN(1).iushln(m - i - 1));

	      r = r.redMul(b);
	      c = b.redSqr();
	      t = t.redMul(c);
	      m = i;
	    }

	    return r;
	  };

	  Red.prototype.invm = function invm (a) {
	    var inv = a._invmp(this.m);
	    if (inv.negative !== 0) {
	      inv.negative = 0;
	      return this.imod(inv).redNeg();
	    } else {
	      return this.imod(inv);
	    }
	  };

	  Red.prototype.pow = function pow (a, num) {
	    if (num.isZero()) return new BN(1).toRed(this);
	    if (num.cmpn(1) === 0) return a.clone();

	    var windowSize = 4;
	    var wnd = new Array(1 << windowSize);
	    wnd[0] = new BN(1).toRed(this);
	    wnd[1] = a;
	    for (var i = 2; i < wnd.length; i++) {
	      wnd[i] = this.mul(wnd[i - 1], a);
	    }

	    var res = wnd[0];
	    var current = 0;
	    var currentLen = 0;
	    var start = num.bitLength() % 26;
	    if (start === 0) {
	      start = 26;
	    }

	    for (i = num.length - 1; i >= 0; i--) {
	      var word = num.words[i];
	      for (var j = start - 1; j >= 0; j--) {
	        var bit = (word >> j) & 1;
	        if (res !== wnd[0]) {
	          res = this.sqr(res);
	        }

	        if (bit === 0 && current === 0) {
	          currentLen = 0;
	          continue;
	        }

	        current <<= 1;
	        current |= bit;
	        currentLen++;
	        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

	        res = this.mul(res, wnd[current]);
	        currentLen = 0;
	        current = 0;
	      }
	      start = 26;
	    }

	    return res;
	  };

	  Red.prototype.convertTo = function convertTo (num) {
	    var r = num.umod(this.m);

	    return r === num ? r.clone() : r;
	  };

	  Red.prototype.convertFrom = function convertFrom (num) {
	    var res = num.clone();
	    res.red = null;
	    return res;
	  };

	  //
	  // Montgomery method engine
	  //

	  BN.mont = function mont (num) {
	    return new Mont(num);
	  };

	  function Mont (m) {
	    Red.call(this, m);

	    this.shift = this.m.bitLength();
	    if (this.shift % 26 !== 0) {
	      this.shift += 26 - (this.shift % 26);
	    }

	    this.r = new BN(1).iushln(this.shift);
	    this.r2 = this.imod(this.r.sqr());
	    this.rinv = this.r._invmp(this.m);

	    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
	    this.minv = this.minv.umod(this.r);
	    this.minv = this.r.sub(this.minv);
	  }
	  inherits(Mont, Red);

	  Mont.prototype.convertTo = function convertTo (num) {
	    return this.imod(num.ushln(this.shift));
	  };

	  Mont.prototype.convertFrom = function convertFrom (num) {
	    var r = this.imod(num.mul(this.rinv));
	    r.red = null;
	    return r;
	  };

	  Mont.prototype.imul = function imul (a, b) {
	    if (a.isZero() || b.isZero()) {
	      a.words[0] = 0;
	      a.length = 1;
	      return a;
	    }

	    var t = a.imul(b);
	    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	    var u = t.isub(c).iushrn(this.shift);
	    var res = u;

	    if (u.cmp(this.m) >= 0) {
	      res = u.isub(this.m);
	    } else if (u.cmpn(0) < 0) {
	      res = u.iadd(this.m);
	    }

	    return res._forceRed(this);
	  };

	  Mont.prototype.mul = function mul (a, b) {
	    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

	    var t = a.mul(b);
	    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
	    var u = t.isub(c).iushrn(this.shift);
	    var res = u;
	    if (u.cmp(this.m) >= 0) {
	      res = u.isub(this.m);
	    } else if (u.cmpn(0) < 0) {
	      res = u.iadd(this.m);
	    }

	    return res._forceRed(this);
	  };

	  Mont.prototype.invm = function invm (a) {
	    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
	    var res = this.imod(a._invmp(this.m).mul(this.r2));
	    return res._forceRed(this);
	  };
	})(module, commonjsGlobal);
	});

	var minimalisticAssert = assert;

	function assert(val, msg) {
	  if (!val)
	    throw new Error(msg || 'Assertion failed');
	}

	assert.equal = function assertEqual(l, r, msg) {
	  if (l != r)
	    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
	};

	var utils_1 = createCommonjsModule(function (module, exports) {

	var utils = exports;

	function toArray(msg, enc) {
	  if (Array.isArray(msg))
	    return msg.slice();
	  if (!msg)
	    return [];
	  var res = [];
	  if (typeof msg !== 'string') {
	    for (var i = 0; i < msg.length; i++)
	      res[i] = msg[i] | 0;
	    return res;
	  }
	  if (enc === 'hex') {
	    msg = msg.replace(/[^a-z0-9]+/ig, '');
	    if (msg.length % 2 !== 0)
	      msg = '0' + msg;
	    for (var i = 0; i < msg.length; i += 2)
	      res.push(parseInt(msg[i] + msg[i + 1], 16));
	  } else {
	    for (var i = 0; i < msg.length; i++) {
	      var c = msg.charCodeAt(i);
	      var hi = c >> 8;
	      var lo = c & 0xff;
	      if (hi)
	        res.push(hi, lo);
	      else
	        res.push(lo);
	    }
	  }
	  return res;
	}
	utils.toArray = toArray;

	function zero2(word) {
	  if (word.length === 1)
	    return '0' + word;
	  else
	    return word;
	}
	utils.zero2 = zero2;

	function toHex(msg) {
	  var res = '';
	  for (var i = 0; i < msg.length; i++)
	    res += zero2(msg[i].toString(16));
	  return res;
	}
	utils.toHex = toHex;

	utils.encode = function encode(arr, enc) {
	  if (enc === 'hex')
	    return toHex(arr);
	  else
	    return arr;
	};
	});

	var utils_1$1 = createCommonjsModule(function (module, exports) {

	var utils = exports;




	utils.assert = minimalisticAssert;
	utils.toArray = utils_1.toArray;
	utils.zero2 = utils_1.zero2;
	utils.toHex = utils_1.toHex;
	utils.encode = utils_1.encode;

	// Represent num in a w-NAF form
	function getNAF(num, w) {
	  var naf = [];
	  var ws = 1 << (w + 1);
	  var k = num.clone();
	  while (k.cmpn(1) >= 0) {
	    var z;
	    if (k.isOdd()) {
	      var mod = k.andln(ws - 1);
	      if (mod > (ws >> 1) - 1)
	        z = (ws >> 1) - mod;
	      else
	        z = mod;
	      k.isubn(z);
	    } else {
	      z = 0;
	    }
	    naf.push(z);

	    // Optimization, shift by word if possible
	    var shift = (k.cmpn(0) !== 0 && k.andln(ws - 1) === 0) ? (w + 1) : 1;
	    for (var i = 1; i < shift; i++)
	      naf.push(0);
	    k.iushrn(shift);
	  }

	  return naf;
	}
	utils.getNAF = getNAF;

	// Represent k1, k2 in a Joint Sparse Form
	function getJSF(k1, k2) {
	  var jsf = [
	    [],
	    []
	  ];

	  k1 = k1.clone();
	  k2 = k2.clone();
	  var d1 = 0;
	  var d2 = 0;
	  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {

	    // First phase
	    var m14 = (k1.andln(3) + d1) & 3;
	    var m24 = (k2.andln(3) + d2) & 3;
	    if (m14 === 3)
	      m14 = -1;
	    if (m24 === 3)
	      m24 = -1;
	    var u1;
	    if ((m14 & 1) === 0) {
	      u1 = 0;
	    } else {
	      var m8 = (k1.andln(7) + d1) & 7;
	      if ((m8 === 3 || m8 === 5) && m24 === 2)
	        u1 = -m14;
	      else
	        u1 = m14;
	    }
	    jsf[0].push(u1);

	    var u2;
	    if ((m24 & 1) === 0) {
	      u2 = 0;
	    } else {
	      var m8 = (k2.andln(7) + d2) & 7;
	      if ((m8 === 3 || m8 === 5) && m14 === 2)
	        u2 = -m24;
	      else
	        u2 = m24;
	    }
	    jsf[1].push(u2);

	    // Second phase
	    if (2 * d1 === u1 + 1)
	      d1 = 1 - d1;
	    if (2 * d2 === u2 + 1)
	      d2 = 1 - d2;
	    k1.iushrn(1);
	    k2.iushrn(1);
	  }

	  return jsf;
	}
	utils.getJSF = getJSF;

	function cachedProperty(obj, name, computer) {
	  var key = '_' + name;
	  obj.prototype[name] = function cachedProperty() {
	    return this[key] !== undefined ? this[key] :
	           this[key] = computer.call(this);
	  };
	}
	utils.cachedProperty = cachedProperty;

	function parseBytes(bytes) {
	  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
	                                     bytes;
	}
	utils.parseBytes = parseBytes;

	function intFromLE(bytes) {
	  return new bn(bytes, 'hex', 'le');
	}
	utils.intFromLE = intFromLE;
	});

	var empty = {};

	var empty$1 = /*#__PURE__*/Object.freeze({
		default: empty
	});

	var require$$0$1 = ( empty$1 && empty ) || empty$1;

	var r;

	var brorand = function rand(len) {
	  if (!r)
	    r = new Rand(null);

	  return r.generate(len);
	};

	function Rand(rand) {
	  this.rand = rand;
	}
	var Rand_1 = Rand;

	Rand.prototype.generate = function generate(len) {
	  return this._rand(len);
	};

	// Emulate crypto API using randy
	Rand.prototype._rand = function _rand(n) {
	  if (this.rand.getBytes)
	    return this.rand.getBytes(n);

	  var res = new Uint8Array(n);
	  for (var i = 0; i < res.length; i++)
	    res[i] = this.rand.getByte();
	  return res;
	};

	if (typeof self === 'object') {
	  if (self.crypto && self.crypto.getRandomValues) {
	    // Modern browsers
	    Rand.prototype._rand = function _rand(n) {
	      var arr = new Uint8Array(n);
	      self.crypto.getRandomValues(arr);
	      return arr;
	    };
	  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
	    // IE
	    Rand.prototype._rand = function _rand(n) {
	      var arr = new Uint8Array(n);
	      self.msCrypto.getRandomValues(arr);
	      return arr;
	    };

	  // Safari's WebWorkers do not have `crypto`
	  } else if (typeof window === 'object') {
	    // Old junk
	    Rand.prototype._rand = function() {
	      throw new Error('Not implemented yet');
	    };
	  }
	} else {
	  // Node.js or Web worker with no crypto support
	  try {
	    var crypto = require$$0$1;
	    if (typeof crypto.randomBytes !== 'function')
	      throw new Error('Not supported');

	    Rand.prototype._rand = function _rand(n) {
	      return crypto.randomBytes(n);
	    };
	  } catch (e) {
	  }
	}
	brorand.Rand = Rand_1;

	var getNAF = utils_1$1.getNAF;
	var getJSF = utils_1$1.getJSF;
	var assert$1 = utils_1$1.assert;

	function BaseCurve(type, conf) {
	  this.type = type;
	  this.p = new bn(conf.p, 16);

	  // Use Montgomery, when there is no fast reduction for the prime
	  this.red = conf.prime ? bn.red(conf.prime) : bn.mont(this.p);

	  // Useful for many curves
	  this.zero = new bn(0).toRed(this.red);
	  this.one = new bn(1).toRed(this.red);
	  this.two = new bn(2).toRed(this.red);

	  // Curve configuration, optional
	  this.n = conf.n && new bn(conf.n, 16);
	  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

	  // Temporary arrays
	  this._wnafT1 = new Array(4);
	  this._wnafT2 = new Array(4);
	  this._wnafT3 = new Array(4);
	  this._wnafT4 = new Array(4);

	  // Generalized Greg Maxwell's trick
	  var adjustCount = this.n && this.p.div(this.n);
	  if (!adjustCount || adjustCount.cmpn(100) > 0) {
	    this.redN = null;
	  } else {
	    this._maxwellTrick = true;
	    this.redN = this.n.toRed(this.red);
	  }
	}
	var base = BaseCurve;

	BaseCurve.prototype.point = function point() {
	  throw new Error('Not implemented');
	};

	BaseCurve.prototype.validate = function validate() {
	  throw new Error('Not implemented');
	};

	BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
	  assert$1(p.precomputed);
	  var doubles = p._getDoubles();

	  var naf = getNAF(k, 1);
	  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
	  I /= 3;

	  // Translate into more windowed form
	  var repr = [];
	  for (var j = 0; j < naf.length; j += doubles.step) {
	    var nafW = 0;
	    for (var k = j + doubles.step - 1; k >= j; k--)
	      nafW = (nafW << 1) + naf[k];
	    repr.push(nafW);
	  }

	  var a = this.jpoint(null, null, null);
	  var b = this.jpoint(null, null, null);
	  for (var i = I; i > 0; i--) {
	    for (var j = 0; j < repr.length; j++) {
	      var nafW = repr[j];
	      if (nafW === i)
	        b = b.mixedAdd(doubles.points[j]);
	      else if (nafW === -i)
	        b = b.mixedAdd(doubles.points[j].neg());
	    }
	    a = a.add(b);
	  }
	  return a.toP();
	};

	BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
	  var w = 4;

	  // Precompute window
	  var nafPoints = p._getNAFPoints(w);
	  w = nafPoints.wnd;
	  var wnd = nafPoints.points;

	  // Get NAF form
	  var naf = getNAF(k, w);

	  // Add `this`*(N+1) for every w-NAF index
	  var acc = this.jpoint(null, null, null);
	  for (var i = naf.length - 1; i >= 0; i--) {
	    // Count zeroes
	    for (var k = 0; i >= 0 && naf[i] === 0; i--)
	      k++;
	    if (i >= 0)
	      k++;
	    acc = acc.dblp(k);

	    if (i < 0)
	      break;
	    var z = naf[i];
	    assert$1(z !== 0);
	    if (p.type === 'affine') {
	      // J +- P
	      if (z > 0)
	        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
	      else
	        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
	    } else {
	      // J +- J
	      if (z > 0)
	        acc = acc.add(wnd[(z - 1) >> 1]);
	      else
	        acc = acc.add(wnd[(-z - 1) >> 1].neg());
	    }
	  }
	  return p.type === 'affine' ? acc.toP() : acc;
	};

	BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
	                                                       points,
	                                                       coeffs,
	                                                       len,
	                                                       jacobianResult) {
	  var wndWidth = this._wnafT1;
	  var wnd = this._wnafT2;
	  var naf = this._wnafT3;

	  // Fill all arrays
	  var max = 0;
	  for (var i = 0; i < len; i++) {
	    var p = points[i];
	    var nafPoints = p._getNAFPoints(defW);
	    wndWidth[i] = nafPoints.wnd;
	    wnd[i] = nafPoints.points;
	  }

	  // Comb small window NAFs
	  for (var i = len - 1; i >= 1; i -= 2) {
	    var a = i - 1;
	    var b = i;
	    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
	      naf[a] = getNAF(coeffs[a], wndWidth[a]);
	      naf[b] = getNAF(coeffs[b], wndWidth[b]);
	      max = Math.max(naf[a].length, max);
	      max = Math.max(naf[b].length, max);
	      continue;
	    }

	    var comb = [
	      points[a], /* 1 */
	      null, /* 3 */
	      null, /* 5 */
	      points[b] /* 7 */
	    ];

	    // Try to avoid Projective points, if possible
	    if (points[a].y.cmp(points[b].y) === 0) {
	      comb[1] = points[a].add(points[b]);
	      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
	    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
	      comb[1] = points[a].toJ().mixedAdd(points[b]);
	      comb[2] = points[a].add(points[b].neg());
	    } else {
	      comb[1] = points[a].toJ().mixedAdd(points[b]);
	      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
	    }

	    var index = [
	      -3, /* -1 -1 */
	      -1, /* -1 0 */
	      -5, /* -1 1 */
	      -7, /* 0 -1 */
	      0, /* 0 0 */
	      7, /* 0 1 */
	      5, /* 1 -1 */
	      1, /* 1 0 */
	      3  /* 1 1 */
	    ];

	    var jsf = getJSF(coeffs[a], coeffs[b]);
	    max = Math.max(jsf[0].length, max);
	    naf[a] = new Array(max);
	    naf[b] = new Array(max);
	    for (var j = 0; j < max; j++) {
	      var ja = jsf[0][j] | 0;
	      var jb = jsf[1][j] | 0;

	      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
	      naf[b][j] = 0;
	      wnd[a] = comb;
	    }
	  }

	  var acc = this.jpoint(null, null, null);
	  var tmp = this._wnafT4;
	  for (var i = max; i >= 0; i--) {
	    var k = 0;

	    while (i >= 0) {
	      var zero = true;
	      for (var j = 0; j < len; j++) {
	        tmp[j] = naf[j][i] | 0;
	        if (tmp[j] !== 0)
	          zero = false;
	      }
	      if (!zero)
	        break;
	      k++;
	      i--;
	    }
	    if (i >= 0)
	      k++;
	    acc = acc.dblp(k);
	    if (i < 0)
	      break;

	    for (var j = 0; j < len; j++) {
	      var z = tmp[j];
	      var p;
	      if (z === 0)
	        continue;
	      else if (z > 0)
	        p = wnd[j][(z - 1) >> 1];
	      else if (z < 0)
	        p = wnd[j][(-z - 1) >> 1].neg();

	      if (p.type === 'affine')
	        acc = acc.mixedAdd(p);
	      else
	        acc = acc.add(p);
	    }
	  }
	  // Zeroify references
	  for (var i = 0; i < len; i++)
	    wnd[i] = null;

	  if (jacobianResult)
	    return acc;
	  else
	    return acc.toP();
	};

	function BasePoint(curve, type) {
	  this.curve = curve;
	  this.type = type;
	  this.precomputed = null;
	}
	BaseCurve.BasePoint = BasePoint;

	BasePoint.prototype.eq = function eq(/*other*/) {
	  throw new Error('Not implemented');
	};

	BasePoint.prototype.validate = function validate() {
	  return this.curve.validate(this);
	};

	BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
	  bytes = utils_1$1.toArray(bytes, enc);

	  var len = this.p.byteLength();

	  // uncompressed, hybrid-odd, hybrid-even
	  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
	      bytes.length - 1 === 2 * len) {
	    if (bytes[0] === 0x06)
	      assert$1(bytes[bytes.length - 1] % 2 === 0);
	    else if (bytes[0] === 0x07)
	      assert$1(bytes[bytes.length - 1] % 2 === 1);

	    var res =  this.point(bytes.slice(1, 1 + len),
	                          bytes.slice(1 + len, 1 + 2 * len));

	    return res;
	  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
	              bytes.length - 1 === len) {
	    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
	  }
	  throw new Error('Unknown point format');
	};

	BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
	  return this.encode(enc, true);
	};

	BasePoint.prototype._encode = function _encode(compact) {
	  var len = this.curve.p.byteLength();
	  var x = this.getX().toArray('be', len);

	  if (compact)
	    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

	  return [ 0x04 ].concat(x, this.getY().toArray('be', len)) ;
	};

	BasePoint.prototype.encode = function encode(enc, compact) {
	  return utils_1$1.encode(this._encode(compact), enc);
	};

	BasePoint.prototype.precompute = function precompute(power) {
	  if (this.precomputed)
	    return this;

	  var precomputed = {
	    doubles: null,
	    naf: null,
	    beta: null
	  };
	  precomputed.naf = this._getNAFPoints(8);
	  precomputed.doubles = this._getDoubles(4, power);
	  precomputed.beta = this._getBeta();
	  this.precomputed = precomputed;

	  return this;
	};

	BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
	  if (!this.precomputed)
	    return false;

	  var doubles = this.precomputed.doubles;
	  if (!doubles)
	    return false;

	  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
	};

	BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
	  if (this.precomputed && this.precomputed.doubles)
	    return this.precomputed.doubles;

	  var doubles = [ this ];
	  var acc = this;
	  for (var i = 0; i < power; i += step) {
	    for (var j = 0; j < step; j++)
	      acc = acc.dbl();
	    doubles.push(acc);
	  }
	  return {
	    step: step,
	    points: doubles
	  };
	};

	BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
	  if (this.precomputed && this.precomputed.naf)
	    return this.precomputed.naf;

	  var res = [ this ];
	  var max = (1 << wnd) - 1;
	  var dbl = max === 1 ? null : this.dbl();
	  for (var i = 1; i < max; i++)
	    res[i] = res[i - 1].add(dbl);
	  return {
	    wnd: wnd,
	    points: res
	  };
	};

	BasePoint.prototype._getBeta = function _getBeta() {
	  return null;
	};

	BasePoint.prototype.dblp = function dblp(k) {
	  var r = this;
	  for (var i = 0; i < k; i++)
	    r = r.dbl();
	  return r;
	};

	var assert$2 = utils_1$1.assert;

	function ShortCurve(conf) {
	  base.call(this, 'short', conf);

	  this.a = new bn(conf.a, 16).toRed(this.red);
	  this.b = new bn(conf.b, 16).toRed(this.red);
	  this.tinv = this.two.redInvm();

	  this.zeroA = this.a.fromRed().cmpn(0) === 0;
	  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

	  // If the curve is endomorphic, precalculate beta and lambda
	  this.endo = this._getEndomorphism(conf);
	  this._endoWnafT1 = new Array(4);
	  this._endoWnafT2 = new Array(4);
	}
	inherits_browser(ShortCurve, base);
	var short_1 = ShortCurve;

	ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
	  // No efficient endomorphism
	  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
	    return;

	  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
	  var beta;
	  var lambda;
	  if (conf.beta) {
	    beta = new bn(conf.beta, 16).toRed(this.red);
	  } else {
	    var betas = this._getEndoRoots(this.p);
	    // Choose the smallest beta
	    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
	    beta = beta.toRed(this.red);
	  }
	  if (conf.lambda) {
	    lambda = new bn(conf.lambda, 16);
	  } else {
	    // Choose the lambda that is matching selected beta
	    var lambdas = this._getEndoRoots(this.n);
	    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
	      lambda = lambdas[0];
	    } else {
	      lambda = lambdas[1];
	      assert$2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
	    }
	  }

	  // Get basis vectors, used for balanced length-two representation
	  var basis;
	  if (conf.basis) {
	    basis = conf.basis.map(function(vec) {
	      return {
	        a: new bn(vec.a, 16),
	        b: new bn(vec.b, 16)
	      };
	    });
	  } else {
	    basis = this._getEndoBasis(lambda);
	  }

	  return {
	    beta: beta,
	    lambda: lambda,
	    basis: basis
	  };
	};

	ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
	  // Find roots of for x^2 + x + 1 in F
	  // Root = (-1 +- Sqrt(-3)) / 2
	  //
	  var red = num === this.p ? this.red : bn.mont(num);
	  var tinv = new bn(2).toRed(red).redInvm();
	  var ntinv = tinv.redNeg();

	  var s = new bn(3).toRed(red).redNeg().redSqrt().redMul(tinv);

	  var l1 = ntinv.redAdd(s).fromRed();
	  var l2 = ntinv.redSub(s).fromRed();
	  return [ l1, l2 ];
	};

	ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
	  // aprxSqrt >= sqrt(this.n)
	  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

	  // 3.74
	  // Run EGCD, until r(L + 1) < aprxSqrt
	  var u = lambda;
	  var v = this.n.clone();
	  var x1 = new bn(1);
	  var y1 = new bn(0);
	  var x2 = new bn(0);
	  var y2 = new bn(1);

	  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
	  var a0;
	  var b0;
	  // First vector
	  var a1;
	  var b1;
	  // Second vector
	  var a2;
	  var b2;

	  var prevR;
	  var i = 0;
	  var r;
	  var x;
	  while (u.cmpn(0) !== 0) {
	    var q = v.div(u);
	    r = v.sub(q.mul(u));
	    x = x2.sub(q.mul(x1));
	    var y = y2.sub(q.mul(y1));

	    if (!a1 && r.cmp(aprxSqrt) < 0) {
	      a0 = prevR.neg();
	      b0 = x1;
	      a1 = r.neg();
	      b1 = x;
	    } else if (a1 && ++i === 2) {
	      break;
	    }
	    prevR = r;

	    v = u;
	    u = r;
	    x2 = x1;
	    x1 = x;
	    y2 = y1;
	    y1 = y;
	  }
	  a2 = r.neg();
	  b2 = x;

	  var len1 = a1.sqr().add(b1.sqr());
	  var len2 = a2.sqr().add(b2.sqr());
	  if (len2.cmp(len1) >= 0) {
	    a2 = a0;
	    b2 = b0;
	  }

	  // Normalize signs
	  if (a1.negative) {
	    a1 = a1.neg();
	    b1 = b1.neg();
	  }
	  if (a2.negative) {
	    a2 = a2.neg();
	    b2 = b2.neg();
	  }

	  return [
	    { a: a1, b: b1 },
	    { a: a2, b: b2 }
	  ];
	};

	ShortCurve.prototype._endoSplit = function _endoSplit(k) {
	  var basis = this.endo.basis;
	  var v1 = basis[0];
	  var v2 = basis[1];

	  var c1 = v2.b.mul(k).divRound(this.n);
	  var c2 = v1.b.neg().mul(k).divRound(this.n);

	  var p1 = c1.mul(v1.a);
	  var p2 = c2.mul(v2.a);
	  var q1 = c1.mul(v1.b);
	  var q2 = c2.mul(v2.b);

	  // Calculate answer
	  var k1 = k.sub(p1).sub(p2);
	  var k2 = q1.add(q2).neg();
	  return { k1: k1, k2: k2 };
	};

	ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
	  x = new bn(x, 16);
	  if (!x.red)
	    x = x.toRed(this.red);

	  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
	  var y = y2.redSqrt();
	  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
	    throw new Error('invalid point');

	  // XXX Is there any way to tell if the number is odd without converting it
	  // to non-red form?
	  var isOdd = y.fromRed().isOdd();
	  if (odd && !isOdd || !odd && isOdd)
	    y = y.redNeg();

	  return this.point(x, y);
	};

	ShortCurve.prototype.validate = function validate(point) {
	  if (point.inf)
	    return true;

	  var x = point.x;
	  var y = point.y;

	  var ax = this.a.redMul(x);
	  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
	  return y.redSqr().redISub(rhs).cmpn(0) === 0;
	};

	ShortCurve.prototype._endoWnafMulAdd =
	    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
	  var npoints = this._endoWnafT1;
	  var ncoeffs = this._endoWnafT2;
	  for (var i = 0; i < points.length; i++) {
	    var split = this._endoSplit(coeffs[i]);
	    var p = points[i];
	    var beta = p._getBeta();

	    if (split.k1.negative) {
	      split.k1.ineg();
	      p = p.neg(true);
	    }
	    if (split.k2.negative) {
	      split.k2.ineg();
	      beta = beta.neg(true);
	    }

	    npoints[i * 2] = p;
	    npoints[i * 2 + 1] = beta;
	    ncoeffs[i * 2] = split.k1;
	    ncoeffs[i * 2 + 1] = split.k2;
	  }
	  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

	  // Clean-up references to points and coefficients
	  for (var j = 0; j < i * 2; j++) {
	    npoints[j] = null;
	    ncoeffs[j] = null;
	  }
	  return res;
	};

	function Point(curve, x, y, isRed) {
	  base.BasePoint.call(this, curve, 'affine');
	  if (x === null && y === null) {
	    this.x = null;
	    this.y = null;
	    this.inf = true;
	  } else {
	    this.x = new bn(x, 16);
	    this.y = new bn(y, 16);
	    // Force redgomery representation when loading from JSON
	    if (isRed) {
	      this.x.forceRed(this.curve.red);
	      this.y.forceRed(this.curve.red);
	    }
	    if (!this.x.red)
	      this.x = this.x.toRed(this.curve.red);
	    if (!this.y.red)
	      this.y = this.y.toRed(this.curve.red);
	    this.inf = false;
	  }
	}
	inherits_browser(Point, base.BasePoint);

	ShortCurve.prototype.point = function point(x, y, isRed) {
	  return new Point(this, x, y, isRed);
	};

	ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
	  return Point.fromJSON(this, obj, red);
	};

	Point.prototype._getBeta = function _getBeta() {
	  if (!this.curve.endo)
	    return;

	  var pre = this.precomputed;
	  if (pre && pre.beta)
	    return pre.beta;

	  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
	  if (pre) {
	    var curve = this.curve;
	    var endoMul = function(p) {
	      return curve.point(p.x.redMul(curve.endo.beta), p.y);
	    };
	    pre.beta = beta;
	    beta.precomputed = {
	      beta: null,
	      naf: pre.naf && {
	        wnd: pre.naf.wnd,
	        points: pre.naf.points.map(endoMul)
	      },
	      doubles: pre.doubles && {
	        step: pre.doubles.step,
	        points: pre.doubles.points.map(endoMul)
	      }
	    };
	  }
	  return beta;
	};

	Point.prototype.toJSON = function toJSON() {
	  if (!this.precomputed)
	    return [ this.x, this.y ];

	  return [ this.x, this.y, this.precomputed && {
	    doubles: this.precomputed.doubles && {
	      step: this.precomputed.doubles.step,
	      points: this.precomputed.doubles.points.slice(1)
	    },
	    naf: this.precomputed.naf && {
	      wnd: this.precomputed.naf.wnd,
	      points: this.precomputed.naf.points.slice(1)
	    }
	  } ];
	};

	Point.fromJSON = function fromJSON(curve, obj, red) {
	  if (typeof obj === 'string')
	    obj = JSON.parse(obj);
	  var res = curve.point(obj[0], obj[1], red);
	  if (!obj[2])
	    return res;

	  function obj2point(obj) {
	    return curve.point(obj[0], obj[1], red);
	  }

	  var pre = obj[2];
	  res.precomputed = {
	    beta: null,
	    doubles: pre.doubles && {
	      step: pre.doubles.step,
	      points: [ res ].concat(pre.doubles.points.map(obj2point))
	    },
	    naf: pre.naf && {
	      wnd: pre.naf.wnd,
	      points: [ res ].concat(pre.naf.points.map(obj2point))
	    }
	  };
	  return res;
	};

	Point.prototype.inspect = function inspect() {
	  if (this.isInfinity())
	    return '<EC Point Infinity>';
	  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
	      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
	};

	Point.prototype.isInfinity = function isInfinity() {
	  return this.inf;
	};

	Point.prototype.add = function add(p) {
	  // O + P = P
	  if (this.inf)
	    return p;

	  // P + O = P
	  if (p.inf)
	    return this;

	  // P + P = 2P
	  if (this.eq(p))
	    return this.dbl();

	  // P + (-P) = O
	  if (this.neg().eq(p))
	    return this.curve.point(null, null);

	  // P + Q = O
	  if (this.x.cmp(p.x) === 0)
	    return this.curve.point(null, null);

	  var c = this.y.redSub(p.y);
	  if (c.cmpn(0) !== 0)
	    c = c.redMul(this.x.redSub(p.x).redInvm());
	  var nx = c.redSqr().redISub(this.x).redISub(p.x);
	  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
	  return this.curve.point(nx, ny);
	};

	Point.prototype.dbl = function dbl() {
	  if (this.inf)
	    return this;

	  // 2P = O
	  var ys1 = this.y.redAdd(this.y);
	  if (ys1.cmpn(0) === 0)
	    return this.curve.point(null, null);

	  var a = this.curve.a;

	  var x2 = this.x.redSqr();
	  var dyinv = ys1.redInvm();
	  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

	  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
	  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
	  return this.curve.point(nx, ny);
	};

	Point.prototype.getX = function getX() {
	  return this.x.fromRed();
	};

	Point.prototype.getY = function getY() {
	  return this.y.fromRed();
	};

	Point.prototype.mul = function mul(k) {
	  k = new bn(k, 16);

	  if (this._hasDoubles(k))
	    return this.curve._fixedNafMul(this, k);
	  else if (this.curve.endo)
	    return this.curve._endoWnafMulAdd([ this ], [ k ]);
	  else
	    return this.curve._wnafMul(this, k);
	};

	Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
	  var points = [ this, p2 ];
	  var coeffs = [ k1, k2 ];
	  if (this.curve.endo)
	    return this.curve._endoWnafMulAdd(points, coeffs);
	  else
	    return this.curve._wnafMulAdd(1, points, coeffs, 2);
	};

	Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
	  var points = [ this, p2 ];
	  var coeffs = [ k1, k2 ];
	  if (this.curve.endo)
	    return this.curve._endoWnafMulAdd(points, coeffs, true);
	  else
	    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
	};

	Point.prototype.eq = function eq(p) {
	  return this === p ||
	         this.inf === p.inf &&
	             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
	};

	Point.prototype.neg = function neg(_precompute) {
	  if (this.inf)
	    return this;

	  var res = this.curve.point(this.x, this.y.redNeg());
	  if (_precompute && this.precomputed) {
	    var pre = this.precomputed;
	    var negate = function(p) {
	      return p.neg();
	    };
	    res.precomputed = {
	      naf: pre.naf && {
	        wnd: pre.naf.wnd,
	        points: pre.naf.points.map(negate)
	      },
	      doubles: pre.doubles && {
	        step: pre.doubles.step,
	        points: pre.doubles.points.map(negate)
	      }
	    };
	  }
	  return res;
	};

	Point.prototype.toJ = function toJ() {
	  if (this.inf)
	    return this.curve.jpoint(null, null, null);

	  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
	  return res;
	};

	function JPoint(curve, x, y, z) {
	  base.BasePoint.call(this, curve, 'jacobian');
	  if (x === null && y === null && z === null) {
	    this.x = this.curve.one;
	    this.y = this.curve.one;
	    this.z = new bn(0);
	  } else {
	    this.x = new bn(x, 16);
	    this.y = new bn(y, 16);
	    this.z = new bn(z, 16);
	  }
	  if (!this.x.red)
	    this.x = this.x.toRed(this.curve.red);
	  if (!this.y.red)
	    this.y = this.y.toRed(this.curve.red);
	  if (!this.z.red)
	    this.z = this.z.toRed(this.curve.red);

	  this.zOne = this.z === this.curve.one;
	}
	inherits_browser(JPoint, base.BasePoint);

	ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
	  return new JPoint(this, x, y, z);
	};

	JPoint.prototype.toP = function toP() {
	  if (this.isInfinity())
	    return this.curve.point(null, null);

	  var zinv = this.z.redInvm();
	  var zinv2 = zinv.redSqr();
	  var ax = this.x.redMul(zinv2);
	  var ay = this.y.redMul(zinv2).redMul(zinv);

	  return this.curve.point(ax, ay);
	};

	JPoint.prototype.neg = function neg() {
	  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
	};

	JPoint.prototype.add = function add(p) {
	  // O + P = P
	  if (this.isInfinity())
	    return p;

	  // P + O = P
	  if (p.isInfinity())
	    return this;

	  // 12M + 4S + 7A
	  var pz2 = p.z.redSqr();
	  var z2 = this.z.redSqr();
	  var u1 = this.x.redMul(pz2);
	  var u2 = p.x.redMul(z2);
	  var s1 = this.y.redMul(pz2.redMul(p.z));
	  var s2 = p.y.redMul(z2.redMul(this.z));

	  var h = u1.redSub(u2);
	  var r = s1.redSub(s2);
	  if (h.cmpn(0) === 0) {
	    if (r.cmpn(0) !== 0)
	      return this.curve.jpoint(null, null, null);
	    else
	      return this.dbl();
	  }

	  var h2 = h.redSqr();
	  var h3 = h2.redMul(h);
	  var v = u1.redMul(h2);

	  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
	  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
	  var nz = this.z.redMul(p.z).redMul(h);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.mixedAdd = function mixedAdd(p) {
	  // O + P = P
	  if (this.isInfinity())
	    return p.toJ();

	  // P + O = P
	  if (p.isInfinity())
	    return this;

	  // 8M + 3S + 7A
	  var z2 = this.z.redSqr();
	  var u1 = this.x;
	  var u2 = p.x.redMul(z2);
	  var s1 = this.y;
	  var s2 = p.y.redMul(z2).redMul(this.z);

	  var h = u1.redSub(u2);
	  var r = s1.redSub(s2);
	  if (h.cmpn(0) === 0) {
	    if (r.cmpn(0) !== 0)
	      return this.curve.jpoint(null, null, null);
	    else
	      return this.dbl();
	  }

	  var h2 = h.redSqr();
	  var h3 = h2.redMul(h);
	  var v = u1.redMul(h2);

	  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
	  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
	  var nz = this.z.redMul(h);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.dblp = function dblp(pow) {
	  if (pow === 0)
	    return this;
	  if (this.isInfinity())
	    return this;
	  if (!pow)
	    return this.dbl();

	  if (this.curve.zeroA || this.curve.threeA) {
	    var r = this;
	    for (var i = 0; i < pow; i++)
	      r = r.dbl();
	    return r;
	  }

	  // 1M + 2S + 1A + N * (4S + 5M + 8A)
	  // N = 1 => 6M + 6S + 9A
	  var a = this.curve.a;
	  var tinv = this.curve.tinv;

	  var jx = this.x;
	  var jy = this.y;
	  var jz = this.z;
	  var jz4 = jz.redSqr().redSqr();

	  // Reuse results
	  var jyd = jy.redAdd(jy);
	  for (var i = 0; i < pow; i++) {
	    var jx2 = jx.redSqr();
	    var jyd2 = jyd.redSqr();
	    var jyd4 = jyd2.redSqr();
	    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

	    var t1 = jx.redMul(jyd2);
	    var nx = c.redSqr().redISub(t1.redAdd(t1));
	    var t2 = t1.redISub(nx);
	    var dny = c.redMul(t2);
	    dny = dny.redIAdd(dny).redISub(jyd4);
	    var nz = jyd.redMul(jz);
	    if (i + 1 < pow)
	      jz4 = jz4.redMul(jyd4);

	    jx = nx;
	    jz = nz;
	    jyd = dny;
	  }

	  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
	};

	JPoint.prototype.dbl = function dbl() {
	  if (this.isInfinity())
	    return this;

	  if (this.curve.zeroA)
	    return this._zeroDbl();
	  else if (this.curve.threeA)
	    return this._threeDbl();
	  else
	    return this._dbl();
	};

	JPoint.prototype._zeroDbl = function _zeroDbl() {
	  var nx;
	  var ny;
	  var nz;
	  // Z = 1
	  if (this.zOne) {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
	    //     #doubling-mdbl-2007-bl
	    // 1M + 5S + 14A

	    // XX = X1^2
	    var xx = this.x.redSqr();
	    // YY = Y1^2
	    var yy = this.y.redSqr();
	    // YYYY = YY^2
	    var yyyy = yy.redSqr();
	    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
	    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
	    s = s.redIAdd(s);
	    // M = 3 * XX + a; a = 0
	    var m = xx.redAdd(xx).redIAdd(xx);
	    // T = M ^ 2 - 2*S
	    var t = m.redSqr().redISub(s).redISub(s);

	    // 8 * YYYY
	    var yyyy8 = yyyy.redIAdd(yyyy);
	    yyyy8 = yyyy8.redIAdd(yyyy8);
	    yyyy8 = yyyy8.redIAdd(yyyy8);

	    // X3 = T
	    nx = t;
	    // Y3 = M * (S - T) - 8 * YYYY
	    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
	    // Z3 = 2*Y1
	    nz = this.y.redAdd(this.y);
	  } else {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
	    //     #doubling-dbl-2009-l
	    // 2M + 5S + 13A

	    // A = X1^2
	    var a = this.x.redSqr();
	    // B = Y1^2
	    var b = this.y.redSqr();
	    // C = B^2
	    var c = b.redSqr();
	    // D = 2 * ((X1 + B)^2 - A - C)
	    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
	    d = d.redIAdd(d);
	    // E = 3 * A
	    var e = a.redAdd(a).redIAdd(a);
	    // F = E^2
	    var f = e.redSqr();

	    // 8 * C
	    var c8 = c.redIAdd(c);
	    c8 = c8.redIAdd(c8);
	    c8 = c8.redIAdd(c8);

	    // X3 = F - 2 * D
	    nx = f.redISub(d).redISub(d);
	    // Y3 = E * (D - X3) - 8 * C
	    ny = e.redMul(d.redISub(nx)).redISub(c8);
	    // Z3 = 2 * Y1 * Z1
	    nz = this.y.redMul(this.z);
	    nz = nz.redIAdd(nz);
	  }

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype._threeDbl = function _threeDbl() {
	  var nx;
	  var ny;
	  var nz;
	  // Z = 1
	  if (this.zOne) {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
	    //     #doubling-mdbl-2007-bl
	    // 1M + 5S + 15A

	    // XX = X1^2
	    var xx = this.x.redSqr();
	    // YY = Y1^2
	    var yy = this.y.redSqr();
	    // YYYY = YY^2
	    var yyyy = yy.redSqr();
	    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
	    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
	    s = s.redIAdd(s);
	    // M = 3 * XX + a
	    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
	    // T = M^2 - 2 * S
	    var t = m.redSqr().redISub(s).redISub(s);
	    // X3 = T
	    nx = t;
	    // Y3 = M * (S - T) - 8 * YYYY
	    var yyyy8 = yyyy.redIAdd(yyyy);
	    yyyy8 = yyyy8.redIAdd(yyyy8);
	    yyyy8 = yyyy8.redIAdd(yyyy8);
	    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
	    // Z3 = 2 * Y1
	    nz = this.y.redAdd(this.y);
	  } else {
	    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
	    // 3M + 5S

	    // delta = Z1^2
	    var delta = this.z.redSqr();
	    // gamma = Y1^2
	    var gamma = this.y.redSqr();
	    // beta = X1 * gamma
	    var beta = this.x.redMul(gamma);
	    // alpha = 3 * (X1 - delta) * (X1 + delta)
	    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
	    alpha = alpha.redAdd(alpha).redIAdd(alpha);
	    // X3 = alpha^2 - 8 * beta
	    var beta4 = beta.redIAdd(beta);
	    beta4 = beta4.redIAdd(beta4);
	    var beta8 = beta4.redAdd(beta4);
	    nx = alpha.redSqr().redISub(beta8);
	    // Z3 = (Y1 + Z1)^2 - gamma - delta
	    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
	    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
	    var ggamma8 = gamma.redSqr();
	    ggamma8 = ggamma8.redIAdd(ggamma8);
	    ggamma8 = ggamma8.redIAdd(ggamma8);
	    ggamma8 = ggamma8.redIAdd(ggamma8);
	    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
	  }

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype._dbl = function _dbl() {
	  var a = this.curve.a;

	  // 4M + 6S + 10A
	  var jx = this.x;
	  var jy = this.y;
	  var jz = this.z;
	  var jz4 = jz.redSqr().redSqr();

	  var jx2 = jx.redSqr();
	  var jy2 = jy.redSqr();

	  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

	  var jxd4 = jx.redAdd(jx);
	  jxd4 = jxd4.redIAdd(jxd4);
	  var t1 = jxd4.redMul(jy2);
	  var nx = c.redSqr().redISub(t1.redAdd(t1));
	  var t2 = t1.redISub(nx);

	  var jyd8 = jy2.redSqr();
	  jyd8 = jyd8.redIAdd(jyd8);
	  jyd8 = jyd8.redIAdd(jyd8);
	  jyd8 = jyd8.redIAdd(jyd8);
	  var ny = c.redMul(t2).redISub(jyd8);
	  var nz = jy.redAdd(jy).redMul(jz);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.trpl = function trpl() {
	  if (!this.curve.zeroA)
	    return this.dbl().add(this);

	  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
	  // 5M + 10S + ...

	  // XX = X1^2
	  var xx = this.x.redSqr();
	  // YY = Y1^2
	  var yy = this.y.redSqr();
	  // ZZ = Z1^2
	  var zz = this.z.redSqr();
	  // YYYY = YY^2
	  var yyyy = yy.redSqr();
	  // M = 3 * XX + a * ZZ2; a = 0
	  var m = xx.redAdd(xx).redIAdd(xx);
	  // MM = M^2
	  var mm = m.redSqr();
	  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
	  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
	  e = e.redIAdd(e);
	  e = e.redAdd(e).redIAdd(e);
	  e = e.redISub(mm);
	  // EE = E^2
	  var ee = e.redSqr();
	  // T = 16*YYYY
	  var t = yyyy.redIAdd(yyyy);
	  t = t.redIAdd(t);
	  t = t.redIAdd(t);
	  t = t.redIAdd(t);
	  // U = (M + E)^2 - MM - EE - T
	  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
	  // X3 = 4 * (X1 * EE - 4 * YY * U)
	  var yyu4 = yy.redMul(u);
	  yyu4 = yyu4.redIAdd(yyu4);
	  yyu4 = yyu4.redIAdd(yyu4);
	  var nx = this.x.redMul(ee).redISub(yyu4);
	  nx = nx.redIAdd(nx);
	  nx = nx.redIAdd(nx);
	  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
	  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
	  ny = ny.redIAdd(ny);
	  ny = ny.redIAdd(ny);
	  ny = ny.redIAdd(ny);
	  // Z3 = (Z1 + E)^2 - ZZ - EE
	  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

	  return this.curve.jpoint(nx, ny, nz);
	};

	JPoint.prototype.mul = function mul(k, kbase) {
	  k = new bn(k, kbase);

	  return this.curve._wnafMul(this, k);
	};

	JPoint.prototype.eq = function eq(p) {
	  if (p.type === 'affine')
	    return this.eq(p.toJ());

	  if (this === p)
	    return true;

	  // x1 * z2^2 == x2 * z1^2
	  var z2 = this.z.redSqr();
	  var pz2 = p.z.redSqr();
	  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
	    return false;

	  // y1 * z2^3 == y2 * z1^3
	  var z3 = z2.redMul(this.z);
	  var pz3 = pz2.redMul(p.z);
	  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
	};

	JPoint.prototype.eqXToP = function eqXToP(x) {
	  var zs = this.z.redSqr();
	  var rx = x.toRed(this.curve.red).redMul(zs);
	  if (this.x.cmp(rx) === 0)
	    return true;

	  var xc = x.clone();
	  var t = this.curve.redN.redMul(zs);
	  for (;;) {
	    xc.iadd(this.curve.n);
	    if (xc.cmp(this.curve.p) >= 0)
	      return false;

	    rx.redIAdd(t);
	    if (this.x.cmp(rx) === 0)
	      return true;
	  }
	};

	JPoint.prototype.inspect = function inspect() {
	  if (this.isInfinity())
	    return '<EC JPoint Infinity>';
	  return '<EC JPoint x: ' + this.x.toString(16, 2) +
	      ' y: ' + this.y.toString(16, 2) +
	      ' z: ' + this.z.toString(16, 2) + '>';
	};

	JPoint.prototype.isInfinity = function isInfinity() {
	  // XXX This code assumes that zero is always zero in red
	  return this.z.cmpn(0) === 0;
	};

	function MontCurve(conf) {
	  base.call(this, 'mont', conf);

	  this.a = new bn(conf.a, 16).toRed(this.red);
	  this.b = new bn(conf.b, 16).toRed(this.red);
	  this.i4 = new bn(4).toRed(this.red).redInvm();
	  this.two = new bn(2).toRed(this.red);
	  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
	}
	inherits_browser(MontCurve, base);
	var mont = MontCurve;

	MontCurve.prototype.validate = function validate(point) {
	  var x = point.normalize().x;
	  var x2 = x.redSqr();
	  var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
	  var y = rhs.redSqrt();

	  return y.redSqr().cmp(rhs) === 0;
	};

	function Point$1(curve, x, z) {
	  base.BasePoint.call(this, curve, 'projective');
	  if (x === null && z === null) {
	    this.x = this.curve.one;
	    this.z = this.curve.zero;
	  } else {
	    this.x = new bn(x, 16);
	    this.z = new bn(z, 16);
	    if (!this.x.red)
	      this.x = this.x.toRed(this.curve.red);
	    if (!this.z.red)
	      this.z = this.z.toRed(this.curve.red);
	  }
	}
	inherits_browser(Point$1, base.BasePoint);

	MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
	  return this.point(utils_1$1.toArray(bytes, enc), 1);
	};

	MontCurve.prototype.point = function point(x, z) {
	  return new Point$1(this, x, z);
	};

	MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
	  return Point$1.fromJSON(this, obj);
	};

	Point$1.prototype.precompute = function precompute() {
	  // No-op
	};

	Point$1.prototype._encode = function _encode() {
	  return this.getX().toArray('be', this.curve.p.byteLength());
	};

	Point$1.fromJSON = function fromJSON(curve, obj) {
	  return new Point$1(curve, obj[0], obj[1] || curve.one);
	};

	Point$1.prototype.inspect = function inspect() {
	  if (this.isInfinity())
	    return '<EC Point Infinity>';
	  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
	      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
	};

	Point$1.prototype.isInfinity = function isInfinity() {
	  // XXX This code assumes that zero is always zero in red
	  return this.z.cmpn(0) === 0;
	};

	Point$1.prototype.dbl = function dbl() {
	  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
	  // 2M + 2S + 4A

	  // A = X1 + Z1
	  var a = this.x.redAdd(this.z);
	  // AA = A^2
	  var aa = a.redSqr();
	  // B = X1 - Z1
	  var b = this.x.redSub(this.z);
	  // BB = B^2
	  var bb = b.redSqr();
	  // C = AA - BB
	  var c = aa.redSub(bb);
	  // X3 = AA * BB
	  var nx = aa.redMul(bb);
	  // Z3 = C * (BB + A24 * C)
	  var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
	  return this.curve.point(nx, nz);
	};

	Point$1.prototype.add = function add() {
	  throw new Error('Not supported on Montgomery curve');
	};

	Point$1.prototype.diffAdd = function diffAdd(p, diff) {
	  // http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
	  // 4M + 2S + 6A

	  // A = X2 + Z2
	  var a = this.x.redAdd(this.z);
	  // B = X2 - Z2
	  var b = this.x.redSub(this.z);
	  // C = X3 + Z3
	  var c = p.x.redAdd(p.z);
	  // D = X3 - Z3
	  var d = p.x.redSub(p.z);
	  // DA = D * A
	  var da = d.redMul(a);
	  // CB = C * B
	  var cb = c.redMul(b);
	  // X5 = Z1 * (DA + CB)^2
	  var nx = diff.z.redMul(da.redAdd(cb).redSqr());
	  // Z5 = X1 * (DA - CB)^2
	  var nz = diff.x.redMul(da.redISub(cb).redSqr());
	  return this.curve.point(nx, nz);
	};

	Point$1.prototype.mul = function mul(k) {
	  var t = k.clone();
	  var a = this; // (N / 2) * Q + Q
	  var b = this.curve.point(null, null); // (N / 2) * Q
	  var c = this; // Q

	  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
	    bits.push(t.andln(1));

	  for (var i = bits.length - 1; i >= 0; i--) {
	    if (bits[i] === 0) {
	      // N * Q + Q = ((N / 2) * Q + Q)) + (N / 2) * Q
	      a = a.diffAdd(b, c);
	      // N * Q = 2 * ((N / 2) * Q + Q))
	      b = b.dbl();
	    } else {
	      // N * Q = ((N / 2) * Q + Q) + ((N / 2) * Q)
	      b = a.diffAdd(b, c);
	      // N * Q + Q = 2 * ((N / 2) * Q + Q)
	      a = a.dbl();
	    }
	  }
	  return b;
	};

	Point$1.prototype.mulAdd = function mulAdd() {
	  throw new Error('Not supported on Montgomery curve');
	};

	Point$1.prototype.jumlAdd = function jumlAdd() {
	  throw new Error('Not supported on Montgomery curve');
	};

	Point$1.prototype.eq = function eq(other) {
	  return this.getX().cmp(other.getX()) === 0;
	};

	Point$1.prototype.normalize = function normalize() {
	  this.x = this.x.redMul(this.z.redInvm());
	  this.z = this.curve.one;
	  return this;
	};

	Point$1.prototype.getX = function getX() {
	  // Normalize coordinates
	  this.normalize();

	  return this.x.fromRed();
	};

	var assert$3 = utils_1$1.assert;

	function EdwardsCurve(conf) {
	  // NOTE: Important as we are creating point in Base.call()
	  this.twisted = (conf.a | 0) !== 1;
	  this.mOneA = this.twisted && (conf.a | 0) === -1;
	  this.extended = this.mOneA;

	  base.call(this, 'edwards', conf);

	  this.a = new bn(conf.a, 16).umod(this.red.m);
	  this.a = this.a.toRed(this.red);
	  this.c = new bn(conf.c, 16).toRed(this.red);
	  this.c2 = this.c.redSqr();
	  this.d = new bn(conf.d, 16).toRed(this.red);
	  this.dd = this.d.redAdd(this.d);

	  assert$3(!this.twisted || this.c.fromRed().cmpn(1) === 0);
	  this.oneC = (conf.c | 0) === 1;
	}
	inherits_browser(EdwardsCurve, base);
	var edwards = EdwardsCurve;

	EdwardsCurve.prototype._mulA = function _mulA(num) {
	  if (this.mOneA)
	    return num.redNeg();
	  else
	    return this.a.redMul(num);
	};

	EdwardsCurve.prototype._mulC = function _mulC(num) {
	  if (this.oneC)
	    return num;
	  else
	    return this.c.redMul(num);
	};

	// Just for compatibility with Short curve
	EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
	  return this.point(x, y, z, t);
	};

	EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
	  x = new bn(x, 16);
	  if (!x.red)
	    x = x.toRed(this.red);

	  var x2 = x.redSqr();
	  var rhs = this.c2.redSub(this.a.redMul(x2));
	  var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));

	  var y2 = rhs.redMul(lhs.redInvm());
	  var y = y2.redSqrt();
	  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
	    throw new Error('invalid point');

	  var isOdd = y.fromRed().isOdd();
	  if (odd && !isOdd || !odd && isOdd)
	    y = y.redNeg();

	  return this.point(x, y);
	};

	EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
	  y = new bn(y, 16);
	  if (!y.red)
	    y = y.toRed(this.red);

	  // x^2 = (y^2 - c^2) / (c^2 d y^2 - a)
	  var y2 = y.redSqr();
	  var lhs = y2.redSub(this.c2);
	  var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
	  var x2 = lhs.redMul(rhs.redInvm());

	  if (x2.cmp(this.zero) === 0) {
	    if (odd)
	      throw new Error('invalid point');
	    else
	      return this.point(this.zero, y);
	  }

	  var x = x2.redSqrt();
	  if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
	    throw new Error('invalid point');

	  if (x.fromRed().isOdd() !== odd)
	    x = x.redNeg();

	  return this.point(x, y);
	};

	EdwardsCurve.prototype.validate = function validate(point) {
	  if (point.isInfinity())
	    return true;

	  // Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
	  point.normalize();

	  var x2 = point.x.redSqr();
	  var y2 = point.y.redSqr();
	  var lhs = x2.redMul(this.a).redAdd(y2);
	  var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

	  return lhs.cmp(rhs) === 0;
	};

	function Point$2(curve, x, y, z, t) {
	  base.BasePoint.call(this, curve, 'projective');
	  if (x === null && y === null && z === null) {
	    this.x = this.curve.zero;
	    this.y = this.curve.one;
	    this.z = this.curve.one;
	    this.t = this.curve.zero;
	    this.zOne = true;
	  } else {
	    this.x = new bn(x, 16);
	    this.y = new bn(y, 16);
	    this.z = z ? new bn(z, 16) : this.curve.one;
	    this.t = t && new bn(t, 16);
	    if (!this.x.red)
	      this.x = this.x.toRed(this.curve.red);
	    if (!this.y.red)
	      this.y = this.y.toRed(this.curve.red);
	    if (!this.z.red)
	      this.z = this.z.toRed(this.curve.red);
	    if (this.t && !this.t.red)
	      this.t = this.t.toRed(this.curve.red);
	    this.zOne = this.z === this.curve.one;

	    // Use extended coordinates
	    if (this.curve.extended && !this.t) {
	      this.t = this.x.redMul(this.y);
	      if (!this.zOne)
	        this.t = this.t.redMul(this.z.redInvm());
	    }
	  }
	}
	inherits_browser(Point$2, base.BasePoint);

	EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
	  return Point$2.fromJSON(this, obj);
	};

	EdwardsCurve.prototype.point = function point(x, y, z, t) {
	  return new Point$2(this, x, y, z, t);
	};

	Point$2.fromJSON = function fromJSON(curve, obj) {
	  return new Point$2(curve, obj[0], obj[1], obj[2]);
	};

	Point$2.prototype.inspect = function inspect() {
	  if (this.isInfinity())
	    return '<EC Point Infinity>';
	  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
	      ' y: ' + this.y.fromRed().toString(16, 2) +
	      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
	};

	Point$2.prototype.isInfinity = function isInfinity() {
	  // XXX This code assumes that zero is always zero in red
	  return this.x.cmpn(0) === 0 &&
	    (this.y.cmp(this.z) === 0 ||
	    (this.zOne && this.y.cmp(this.curve.c) === 0));
	};

	Point$2.prototype._extDbl = function _extDbl() {
	  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
	  //     #doubling-dbl-2008-hwcd
	  // 4M + 4S

	  // A = X1^2
	  var a = this.x.redSqr();
	  // B = Y1^2
	  var b = this.y.redSqr();
	  // C = 2 * Z1^2
	  var c = this.z.redSqr();
	  c = c.redIAdd(c);
	  // D = a * A
	  var d = this.curve._mulA(a);
	  // E = (X1 + Y1)^2 - A - B
	  var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
	  // G = D + B
	  var g = d.redAdd(b);
	  // F = G - C
	  var f = g.redSub(c);
	  // H = D - B
	  var h = d.redSub(b);
	  // X3 = E * F
	  var nx = e.redMul(f);
	  // Y3 = G * H
	  var ny = g.redMul(h);
	  // T3 = E * H
	  var nt = e.redMul(h);
	  // Z3 = F * G
	  var nz = f.redMul(g);
	  return this.curve.point(nx, ny, nz, nt);
	};

	Point$2.prototype._projDbl = function _projDbl() {
	  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
	  //     #doubling-dbl-2008-bbjlp
	  //     #doubling-dbl-2007-bl
	  // and others
	  // Generally 3M + 4S or 2M + 4S

	  // B = (X1 + Y1)^2
	  var b = this.x.redAdd(this.y).redSqr();
	  // C = X1^2
	  var c = this.x.redSqr();
	  // D = Y1^2
	  var d = this.y.redSqr();

	  var nx;
	  var ny;
	  var nz;
	  if (this.curve.twisted) {
	    // E = a * C
	    var e = this.curve._mulA(c);
	    // F = E + D
	    var f = e.redAdd(d);
	    if (this.zOne) {
	      // X3 = (B - C - D) * (F - 2)
	      nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
	      // Y3 = F * (E - D)
	      ny = f.redMul(e.redSub(d));
	      // Z3 = F^2 - 2 * F
	      nz = f.redSqr().redSub(f).redSub(f);
	    } else {
	      // H = Z1^2
	      var h = this.z.redSqr();
	      // J = F - 2 * H
	      var j = f.redSub(h).redISub(h);
	      // X3 = (B-C-D)*J
	      nx = b.redSub(c).redISub(d).redMul(j);
	      // Y3 = F * (E - D)
	      ny = f.redMul(e.redSub(d));
	      // Z3 = F * J
	      nz = f.redMul(j);
	    }
	  } else {
	    // E = C + D
	    var e = c.redAdd(d);
	    // H = (c * Z1)^2
	    var h = this.curve._mulC(this.z).redSqr();
	    // J = E - 2 * H
	    var j = e.redSub(h).redSub(h);
	    // X3 = c * (B - E) * J
	    nx = this.curve._mulC(b.redISub(e)).redMul(j);
	    // Y3 = c * E * (C - D)
	    ny = this.curve._mulC(e).redMul(c.redISub(d));
	    // Z3 = E * J
	    nz = e.redMul(j);
	  }
	  return this.curve.point(nx, ny, nz);
	};

	Point$2.prototype.dbl = function dbl() {
	  if (this.isInfinity())
	    return this;

	  // Double in extended coordinates
	  if (this.curve.extended)
	    return this._extDbl();
	  else
	    return this._projDbl();
	};

	Point$2.prototype._extAdd = function _extAdd(p) {
	  // hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
	  //     #addition-add-2008-hwcd-3
	  // 8M

	  // A = (Y1 - X1) * (Y2 - X2)
	  var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
	  // B = (Y1 + X1) * (Y2 + X2)
	  var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
	  // C = T1 * k * T2
	  var c = this.t.redMul(this.curve.dd).redMul(p.t);
	  // D = Z1 * 2 * Z2
	  var d = this.z.redMul(p.z.redAdd(p.z));
	  // E = B - A
	  var e = b.redSub(a);
	  // F = D - C
	  var f = d.redSub(c);
	  // G = D + C
	  var g = d.redAdd(c);
	  // H = B + A
	  var h = b.redAdd(a);
	  // X3 = E * F
	  var nx = e.redMul(f);
	  // Y3 = G * H
	  var ny = g.redMul(h);
	  // T3 = E * H
	  var nt = e.redMul(h);
	  // Z3 = F * G
	  var nz = f.redMul(g);
	  return this.curve.point(nx, ny, nz, nt);
	};

	Point$2.prototype._projAdd = function _projAdd(p) {
	  // hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
	  //     #addition-add-2008-bbjlp
	  //     #addition-add-2007-bl
	  // 10M + 1S

	  // A = Z1 * Z2
	  var a = this.z.redMul(p.z);
	  // B = A^2
	  var b = a.redSqr();
	  // C = X1 * X2
	  var c = this.x.redMul(p.x);
	  // D = Y1 * Y2
	  var d = this.y.redMul(p.y);
	  // E = d * C * D
	  var e = this.curve.d.redMul(c).redMul(d);
	  // F = B - E
	  var f = b.redSub(e);
	  // G = B + E
	  var g = b.redAdd(e);
	  // X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
	  var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
	  var nx = a.redMul(f).redMul(tmp);
	  var ny;
	  var nz;
	  if (this.curve.twisted) {
	    // Y3 = A * G * (D - a * C)
	    ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
	    // Z3 = F * G
	    nz = f.redMul(g);
	  } else {
	    // Y3 = A * G * (D - C)
	    ny = a.redMul(g).redMul(d.redSub(c));
	    // Z3 = c * F * G
	    nz = this.curve._mulC(f).redMul(g);
	  }
	  return this.curve.point(nx, ny, nz);
	};

	Point$2.prototype.add = function add(p) {
	  if (this.isInfinity())
	    return p;
	  if (p.isInfinity())
	    return this;

	  if (this.curve.extended)
	    return this._extAdd(p);
	  else
	    return this._projAdd(p);
	};

	Point$2.prototype.mul = function mul(k) {
	  if (this._hasDoubles(k))
	    return this.curve._fixedNafMul(this, k);
	  else
	    return this.curve._wnafMul(this, k);
	};

	Point$2.prototype.mulAdd = function mulAdd(k1, p, k2) {
	  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
	};

	Point$2.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
	  return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
	};

	Point$2.prototype.normalize = function normalize() {
	  if (this.zOne)
	    return this;

	  // Normalize coordinates
	  var zi = this.z.redInvm();
	  this.x = this.x.redMul(zi);
	  this.y = this.y.redMul(zi);
	  if (this.t)
	    this.t = this.t.redMul(zi);
	  this.z = this.curve.one;
	  this.zOne = true;
	  return this;
	};

	Point$2.prototype.neg = function neg() {
	  return this.curve.point(this.x.redNeg(),
	                          this.y,
	                          this.z,
	                          this.t && this.t.redNeg());
	};

	Point$2.prototype.getX = function getX() {
	  this.normalize();
	  return this.x.fromRed();
	};

	Point$2.prototype.getY = function getY() {
	  this.normalize();
	  return this.y.fromRed();
	};

	Point$2.prototype.eq = function eq(other) {
	  return this === other ||
	         this.getX().cmp(other.getX()) === 0 &&
	         this.getY().cmp(other.getY()) === 0;
	};

	Point$2.prototype.eqXToP = function eqXToP(x) {
	  var rx = x.toRed(this.curve.red).redMul(this.z);
	  if (this.x.cmp(rx) === 0)
	    return true;

	  var xc = x.clone();
	  var t = this.curve.redN.redMul(this.z);
	  for (;;) {
	    xc.iadd(this.curve.n);
	    if (xc.cmp(this.curve.p) >= 0)
	      return false;

	    rx.redIAdd(t);
	    if (this.x.cmp(rx) === 0)
	      return true;
	  }
	};

	// Compatibility with BaseCurve
	Point$2.prototype.toP = Point$2.prototype.normalize;
	Point$2.prototype.mixedAdd = Point$2.prototype.add;

	var curve_1 = createCommonjsModule(function (module, exports) {

	var curve = exports;

	curve.base = base;
	curve.short = short_1;
	curve.mont = mont;
	curve.edwards = edwards;
	});

	var inherits_1 = inherits_browser;

	function toArray(msg, enc) {
	  if (Array.isArray(msg))
	    return msg.slice();
	  if (!msg)
	    return [];
	  var res = [];
	  if (typeof msg === 'string') {
	    if (!enc) {
	      for (var i = 0; i < msg.length; i++) {
	        var c = msg.charCodeAt(i);
	        var hi = c >> 8;
	        var lo = c & 0xff;
	        if (hi)
	          res.push(hi, lo);
	        else
	          res.push(lo);
	      }
	    } else if (enc === 'hex') {
	      msg = msg.replace(/[^a-z0-9]+/ig, '');
	      if (msg.length % 2 !== 0)
	        msg = '0' + msg;
	      for (i = 0; i < msg.length; i += 2)
	        res.push(parseInt(msg[i] + msg[i + 1], 16));
	    }
	  } else {
	    for (i = 0; i < msg.length; i++)
	      res[i] = msg[i] | 0;
	  }
	  return res;
	}
	var toArray_1 = toArray;

	function toHex$1(msg) {
	  var res = '';
	  for (var i = 0; i < msg.length; i++)
	    res += zero2(msg[i].toString(16));
	  return res;
	}
	var toHex_1 = toHex$1;

	function htonl(w) {
	  var res = (w >>> 24) |
	            ((w >>> 8) & 0xff00) |
	            ((w << 8) & 0xff0000) |
	            ((w & 0xff) << 24);
	  return res >>> 0;
	}
	var htonl_1 = htonl;

	function toHex32(msg, endian) {
	  var res = '';
	  for (var i = 0; i < msg.length; i++) {
	    var w = msg[i];
	    if (endian === 'little')
	      w = htonl(w);
	    res += zero8(w.toString(16));
	  }
	  return res;
	}
	var toHex32_1 = toHex32;

	function zero2(word) {
	  if (word.length === 1)
	    return '0' + word;
	  else
	    return word;
	}
	var zero2_1 = zero2;

	function zero8(word) {
	  if (word.length === 7)
	    return '0' + word;
	  else if (word.length === 6)
	    return '00' + word;
	  else if (word.length === 5)
	    return '000' + word;
	  else if (word.length === 4)
	    return '0000' + word;
	  else if (word.length === 3)
	    return '00000' + word;
	  else if (word.length === 2)
	    return '000000' + word;
	  else if (word.length === 1)
	    return '0000000' + word;
	  else
	    return word;
	}
	var zero8_1 = zero8;

	function join32(msg, start, end, endian) {
	  var len = end - start;
	  minimalisticAssert(len % 4 === 0);
	  var res = new Array(len / 4);
	  for (var i = 0, k = start; i < res.length; i++, k += 4) {
	    var w;
	    if (endian === 'big')
	      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
	    else
	      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
	    res[i] = w >>> 0;
	  }
	  return res;
	}
	var join32_1 = join32;

	function split32(msg, endian) {
	  var res = new Array(msg.length * 4);
	  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
	    var m = msg[i];
	    if (endian === 'big') {
	      res[k] = m >>> 24;
	      res[k + 1] = (m >>> 16) & 0xff;
	      res[k + 2] = (m >>> 8) & 0xff;
	      res[k + 3] = m & 0xff;
	    } else {
	      res[k + 3] = m >>> 24;
	      res[k + 2] = (m >>> 16) & 0xff;
	      res[k + 1] = (m >>> 8) & 0xff;
	      res[k] = m & 0xff;
	    }
	  }
	  return res;
	}
	var split32_1 = split32;

	function rotr32(w, b) {
	  return (w >>> b) | (w << (32 - b));
	}
	var rotr32_1 = rotr32;

	function rotl32(w, b) {
	  return (w << b) | (w >>> (32 - b));
	}
	var rotl32_1 = rotl32;

	function sum32(a, b) {
	  return (a + b) >>> 0;
	}
	var sum32_1 = sum32;

	function sum32_3(a, b, c) {
	  return (a + b + c) >>> 0;
	}
	var sum32_3_1 = sum32_3;

	function sum32_4(a, b, c, d) {
	  return (a + b + c + d) >>> 0;
	}
	var sum32_4_1 = sum32_4;

	function sum32_5(a, b, c, d, e) {
	  return (a + b + c + d + e) >>> 0;
	}
	var sum32_5_1 = sum32_5;

	function sum64(buf, pos, ah, al) {
	  var bh = buf[pos];
	  var bl = buf[pos + 1];

	  var lo = (al + bl) >>> 0;
	  var hi = (lo < al ? 1 : 0) + ah + bh;
	  buf[pos] = hi >>> 0;
	  buf[pos + 1] = lo;
	}
	var sum64_1 = sum64;

	function sum64_hi(ah, al, bh, bl) {
	  var lo = (al + bl) >>> 0;
	  var hi = (lo < al ? 1 : 0) + ah + bh;
	  return hi >>> 0;
	}
	var sum64_hi_1 = sum64_hi;

	function sum64_lo(ah, al, bh, bl) {
	  var lo = al + bl;
	  return lo >>> 0;
	}
	var sum64_lo_1 = sum64_lo;

	function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
	  var carry = 0;
	  var lo = al;
	  lo = (lo + bl) >>> 0;
	  carry += lo < al ? 1 : 0;
	  lo = (lo + cl) >>> 0;
	  carry += lo < cl ? 1 : 0;
	  lo = (lo + dl) >>> 0;
	  carry += lo < dl ? 1 : 0;

	  var hi = ah + bh + ch + dh + carry;
	  return hi >>> 0;
	}
	var sum64_4_hi_1 = sum64_4_hi;

	function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
	  var lo = al + bl + cl + dl;
	  return lo >>> 0;
	}
	var sum64_4_lo_1 = sum64_4_lo;

	function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
	  var carry = 0;
	  var lo = al;
	  lo = (lo + bl) >>> 0;
	  carry += lo < al ? 1 : 0;
	  lo = (lo + cl) >>> 0;
	  carry += lo < cl ? 1 : 0;
	  lo = (lo + dl) >>> 0;
	  carry += lo < dl ? 1 : 0;
	  lo = (lo + el) >>> 0;
	  carry += lo < el ? 1 : 0;

	  var hi = ah + bh + ch + dh + eh + carry;
	  return hi >>> 0;
	}
	var sum64_5_hi_1 = sum64_5_hi;

	function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
	  var lo = al + bl + cl + dl + el;

	  return lo >>> 0;
	}
	var sum64_5_lo_1 = sum64_5_lo;

	function rotr64_hi(ah, al, num) {
	  var r = (al << (32 - num)) | (ah >>> num);
	  return r >>> 0;
	}
	var rotr64_hi_1 = rotr64_hi;

	function rotr64_lo(ah, al, num) {
	  var r = (ah << (32 - num)) | (al >>> num);
	  return r >>> 0;
	}
	var rotr64_lo_1 = rotr64_lo;

	function shr64_hi(ah, al, num) {
	  return ah >>> num;
	}
	var shr64_hi_1 = shr64_hi;

	function shr64_lo(ah, al, num) {
	  var r = (ah << (32 - num)) | (al >>> num);
	  return r >>> 0;
	}
	var shr64_lo_1 = shr64_lo;

	var utils = {
		inherits: inherits_1,
		toArray: toArray_1,
		toHex: toHex_1,
		htonl: htonl_1,
		toHex32: toHex32_1,
		zero2: zero2_1,
		zero8: zero8_1,
		join32: join32_1,
		split32: split32_1,
		rotr32: rotr32_1,
		rotl32: rotl32_1,
		sum32: sum32_1,
		sum32_3: sum32_3_1,
		sum32_4: sum32_4_1,
		sum32_5: sum32_5_1,
		sum64: sum64_1,
		sum64_hi: sum64_hi_1,
		sum64_lo: sum64_lo_1,
		sum64_4_hi: sum64_4_hi_1,
		sum64_4_lo: sum64_4_lo_1,
		sum64_5_hi: sum64_5_hi_1,
		sum64_5_lo: sum64_5_lo_1,
		rotr64_hi: rotr64_hi_1,
		rotr64_lo: rotr64_lo_1,
		shr64_hi: shr64_hi_1,
		shr64_lo: shr64_lo_1
	};

	function BlockHash() {
	  this.pending = null;
	  this.pendingTotal = 0;
	  this.blockSize = this.constructor.blockSize;
	  this.outSize = this.constructor.outSize;
	  this.hmacStrength = this.constructor.hmacStrength;
	  this.padLength = this.constructor.padLength / 8;
	  this.endian = 'big';

	  this._delta8 = this.blockSize / 8;
	  this._delta32 = this.blockSize / 32;
	}
	var BlockHash_1 = BlockHash;

	BlockHash.prototype.update = function update(msg, enc) {
	  // Convert message to array, pad it, and join into 32bit blocks
	  msg = utils.toArray(msg, enc);
	  if (!this.pending)
	    this.pending = msg;
	  else
	    this.pending = this.pending.concat(msg);
	  this.pendingTotal += msg.length;

	  // Enough data, try updating
	  if (this.pending.length >= this._delta8) {
	    msg = this.pending;

	    // Process pending data in blocks
	    var r = msg.length % this._delta8;
	    this.pending = msg.slice(msg.length - r, msg.length);
	    if (this.pending.length === 0)
	      this.pending = null;

	    msg = utils.join32(msg, 0, msg.length - r, this.endian);
	    for (var i = 0; i < msg.length; i += this._delta32)
	      this._update(msg, i, i + this._delta32);
	  }

	  return this;
	};

	BlockHash.prototype.digest = function digest(enc) {
	  this.update(this._pad());
	  minimalisticAssert(this.pending === null);

	  return this._digest(enc);
	};

	BlockHash.prototype._pad = function pad() {
	  var len = this.pendingTotal;
	  var bytes = this._delta8;
	  var k = bytes - ((len + this.padLength) % bytes);
	  var res = new Array(k + this.padLength);
	  res[0] = 0x80;
	  for (var i = 1; i < k; i++)
	    res[i] = 0;

	  // Append length
	  len <<= 3;
	  if (this.endian === 'big') {
	    for (var t = 8; t < this.padLength; t++)
	      res[i++] = 0;

	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = (len >>> 24) & 0xff;
	    res[i++] = (len >>> 16) & 0xff;
	    res[i++] = (len >>> 8) & 0xff;
	    res[i++] = len & 0xff;
	  } else {
	    res[i++] = len & 0xff;
	    res[i++] = (len >>> 8) & 0xff;
	    res[i++] = (len >>> 16) & 0xff;
	    res[i++] = (len >>> 24) & 0xff;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;
	    res[i++] = 0;

	    for (t = 8; t < this.padLength; t++)
	      res[i++] = 0;
	  }

	  return res;
	};

	var common = {
		BlockHash: BlockHash_1
	};

	var rotr32$1 = utils.rotr32;

	function ft_1(s, x, y, z) {
	  if (s === 0)
	    return ch32(x, y, z);
	  if (s === 1 || s === 3)
	    return p32(x, y, z);
	  if (s === 2)
	    return maj32(x, y, z);
	}
	var ft_1_1 = ft_1;

	function ch32(x, y, z) {
	  return (x & y) ^ ((~x) & z);
	}
	var ch32_1 = ch32;

	function maj32(x, y, z) {
	  return (x & y) ^ (x & z) ^ (y & z);
	}
	var maj32_1 = maj32;

	function p32(x, y, z) {
	  return x ^ y ^ z;
	}
	var p32_1 = p32;

	function s0_256(x) {
	  return rotr32$1(x, 2) ^ rotr32$1(x, 13) ^ rotr32$1(x, 22);
	}
	var s0_256_1 = s0_256;

	function s1_256(x) {
	  return rotr32$1(x, 6) ^ rotr32$1(x, 11) ^ rotr32$1(x, 25);
	}
	var s1_256_1 = s1_256;

	function g0_256(x) {
	  return rotr32$1(x, 7) ^ rotr32$1(x, 18) ^ (x >>> 3);
	}
	var g0_256_1 = g0_256;

	function g1_256(x) {
	  return rotr32$1(x, 17) ^ rotr32$1(x, 19) ^ (x >>> 10);
	}
	var g1_256_1 = g1_256;

	var common$1 = {
		ft_1: ft_1_1,
		ch32: ch32_1,
		maj32: maj32_1,
		p32: p32_1,
		s0_256: s0_256_1,
		s1_256: s1_256_1,
		g0_256: g0_256_1,
		g1_256: g1_256_1
	};

	var rotl32$1 = utils.rotl32;
	var sum32$1 = utils.sum32;
	var sum32_5$1 = utils.sum32_5;
	var ft_1$1 = common$1.ft_1;
	var BlockHash$1 = common.BlockHash;

	var sha1_K = [
	  0x5A827999, 0x6ED9EBA1,
	  0x8F1BBCDC, 0xCA62C1D6
	];

	function SHA1() {
	  if (!(this instanceof SHA1))
	    return new SHA1();

	  BlockHash$1.call(this);
	  this.h = [
	    0x67452301, 0xefcdab89, 0x98badcfe,
	    0x10325476, 0xc3d2e1f0 ];
	  this.W = new Array(80);
	}

	utils.inherits(SHA1, BlockHash$1);
	var _1 = SHA1;

	SHA1.blockSize = 512;
	SHA1.outSize = 160;
	SHA1.hmacStrength = 80;
	SHA1.padLength = 64;

	SHA1.prototype._update = function _update(msg, start) {
	  var W = this.W;

	  for (var i = 0; i < 16; i++)
	    W[i] = msg[start + i];

	  for(; i < W.length; i++)
	    W[i] = rotl32$1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

	  var a = this.h[0];
	  var b = this.h[1];
	  var c = this.h[2];
	  var d = this.h[3];
	  var e = this.h[4];

	  for (i = 0; i < W.length; i++) {
	    var s = ~~(i / 20);
	    var t = sum32_5$1(rotl32$1(a, 5), ft_1$1(s, b, c, d), e, W[i], sha1_K[s]);
	    e = d;
	    d = c;
	    c = rotl32$1(b, 30);
	    b = a;
	    a = t;
	  }

	  this.h[0] = sum32$1(this.h[0], a);
	  this.h[1] = sum32$1(this.h[1], b);
	  this.h[2] = sum32$1(this.h[2], c);
	  this.h[3] = sum32$1(this.h[3], d);
	  this.h[4] = sum32$1(this.h[4], e);
	};

	SHA1.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'big');
	  else
	    return utils.split32(this.h, 'big');
	};

	var sum32$2 = utils.sum32;
	var sum32_4$1 = utils.sum32_4;
	var sum32_5$2 = utils.sum32_5;
	var ch32$1 = common$1.ch32;
	var maj32$1 = common$1.maj32;
	var s0_256$1 = common$1.s0_256;
	var s1_256$1 = common$1.s1_256;
	var g0_256$1 = common$1.g0_256;
	var g1_256$1 = common$1.g1_256;

	var BlockHash$2 = common.BlockHash;

	var sha256_K = [
	  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
	  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
	  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
	  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
	  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
	  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
	  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	];

	function SHA256() {
	  if (!(this instanceof SHA256))
	    return new SHA256();

	  BlockHash$2.call(this);
	  this.h = [
	    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
	    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	  ];
	  this.k = sha256_K;
	  this.W = new Array(64);
	}
	utils.inherits(SHA256, BlockHash$2);
	var _256 = SHA256;

	SHA256.blockSize = 512;
	SHA256.outSize = 256;
	SHA256.hmacStrength = 192;
	SHA256.padLength = 64;

	SHA256.prototype._update = function _update(msg, start) {
	  var W = this.W;

	  for (var i = 0; i < 16; i++)
	    W[i] = msg[start + i];
	  for (; i < W.length; i++)
	    W[i] = sum32_4$1(g1_256$1(W[i - 2]), W[i - 7], g0_256$1(W[i - 15]), W[i - 16]);

	  var a = this.h[0];
	  var b = this.h[1];
	  var c = this.h[2];
	  var d = this.h[3];
	  var e = this.h[4];
	  var f = this.h[5];
	  var g = this.h[6];
	  var h = this.h[7];

	  minimalisticAssert(this.k.length === W.length);
	  for (i = 0; i < W.length; i++) {
	    var T1 = sum32_5$2(h, s1_256$1(e), ch32$1(e, f, g), this.k[i], W[i]);
	    var T2 = sum32$2(s0_256$1(a), maj32$1(a, b, c));
	    h = g;
	    g = f;
	    f = e;
	    e = sum32$2(d, T1);
	    d = c;
	    c = b;
	    b = a;
	    a = sum32$2(T1, T2);
	  }

	  this.h[0] = sum32$2(this.h[0], a);
	  this.h[1] = sum32$2(this.h[1], b);
	  this.h[2] = sum32$2(this.h[2], c);
	  this.h[3] = sum32$2(this.h[3], d);
	  this.h[4] = sum32$2(this.h[4], e);
	  this.h[5] = sum32$2(this.h[5], f);
	  this.h[6] = sum32$2(this.h[6], g);
	  this.h[7] = sum32$2(this.h[7], h);
	};

	SHA256.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'big');
	  else
	    return utils.split32(this.h, 'big');
	};

	function SHA224() {
	  if (!(this instanceof SHA224))
	    return new SHA224();

	  _256.call(this);
	  this.h = [
	    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
	    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
	}
	utils.inherits(SHA224, _256);
	var _224 = SHA224;

	SHA224.blockSize = 512;
	SHA224.outSize = 224;
	SHA224.hmacStrength = 192;
	SHA224.padLength = 64;

	SHA224.prototype._digest = function digest(enc) {
	  // Just truncate output
	  if (enc === 'hex')
	    return utils.toHex32(this.h.slice(0, 7), 'big');
	  else
	    return utils.split32(this.h.slice(0, 7), 'big');
	};

	var rotr64_hi$1 = utils.rotr64_hi;
	var rotr64_lo$1 = utils.rotr64_lo;
	var shr64_hi$1 = utils.shr64_hi;
	var shr64_lo$1 = utils.shr64_lo;
	var sum64$1 = utils.sum64;
	var sum64_hi$1 = utils.sum64_hi;
	var sum64_lo$1 = utils.sum64_lo;
	var sum64_4_hi$1 = utils.sum64_4_hi;
	var sum64_4_lo$1 = utils.sum64_4_lo;
	var sum64_5_hi$1 = utils.sum64_5_hi;
	var sum64_5_lo$1 = utils.sum64_5_lo;

	var BlockHash$3 = common.BlockHash;

	var sha512_K = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	function SHA512() {
	  if (!(this instanceof SHA512))
	    return new SHA512();

	  BlockHash$3.call(this);
	  this.h = [
	    0x6a09e667, 0xf3bcc908,
	    0xbb67ae85, 0x84caa73b,
	    0x3c6ef372, 0xfe94f82b,
	    0xa54ff53a, 0x5f1d36f1,
	    0x510e527f, 0xade682d1,
	    0x9b05688c, 0x2b3e6c1f,
	    0x1f83d9ab, 0xfb41bd6b,
	    0x5be0cd19, 0x137e2179 ];
	  this.k = sha512_K;
	  this.W = new Array(160);
	}
	utils.inherits(SHA512, BlockHash$3);
	var _512 = SHA512;

	SHA512.blockSize = 1024;
	SHA512.outSize = 512;
	SHA512.hmacStrength = 192;
	SHA512.padLength = 128;

	SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
	  var W = this.W;

	  // 32 x 32bit words
	  for (var i = 0; i < 32; i++)
	    W[i] = msg[start + i];
	  for (; i < W.length; i += 2) {
	    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
	    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
	    var c1_hi = W[i - 14];  // i - 7
	    var c1_lo = W[i - 13];
	    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
	    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
	    var c3_hi = W[i - 32];  // i - 16
	    var c3_lo = W[i - 31];

	    W[i] = sum64_4_hi$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo);
	    W[i + 1] = sum64_4_lo$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo);
	  }
	};

	SHA512.prototype._update = function _update(msg, start) {
	  this._prepareBlock(msg, start);

	  var W = this.W;

	  var ah = this.h[0];
	  var al = this.h[1];
	  var bh = this.h[2];
	  var bl = this.h[3];
	  var ch = this.h[4];
	  var cl = this.h[5];
	  var dh = this.h[6];
	  var dl = this.h[7];
	  var eh = this.h[8];
	  var el = this.h[9];
	  var fh = this.h[10];
	  var fl = this.h[11];
	  var gh = this.h[12];
	  var gl = this.h[13];
	  var hh = this.h[14];
	  var hl = this.h[15];

	  minimalisticAssert(this.k.length === W.length);
	  for (var i = 0; i < W.length; i += 2) {
	    var c0_hi = hh;
	    var c0_lo = hl;
	    var c1_hi = s1_512_hi(eh, el);
	    var c1_lo = s1_512_lo(eh, el);
	    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
	    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
	    var c3_hi = this.k[i];
	    var c3_lo = this.k[i + 1];
	    var c4_hi = W[i];
	    var c4_lo = W[i + 1];

	    var T1_hi = sum64_5_hi$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo,
	      c4_hi, c4_lo);
	    var T1_lo = sum64_5_lo$1(
	      c0_hi, c0_lo,
	      c1_hi, c1_lo,
	      c2_hi, c2_lo,
	      c3_hi, c3_lo,
	      c4_hi, c4_lo);

	    c0_hi = s0_512_hi(ah, al);
	    c0_lo = s0_512_lo(ah, al);
	    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
	    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

	    var T2_hi = sum64_hi$1(c0_hi, c0_lo, c1_hi, c1_lo);
	    var T2_lo = sum64_lo$1(c0_hi, c0_lo, c1_hi, c1_lo);

	    hh = gh;
	    hl = gl;

	    gh = fh;
	    gl = fl;

	    fh = eh;
	    fl = el;

	    eh = sum64_hi$1(dh, dl, T1_hi, T1_lo);
	    el = sum64_lo$1(dl, dl, T1_hi, T1_lo);

	    dh = ch;
	    dl = cl;

	    ch = bh;
	    cl = bl;

	    bh = ah;
	    bl = al;

	    ah = sum64_hi$1(T1_hi, T1_lo, T2_hi, T2_lo);
	    al = sum64_lo$1(T1_hi, T1_lo, T2_hi, T2_lo);
	  }

	  sum64$1(this.h, 0, ah, al);
	  sum64$1(this.h, 2, bh, bl);
	  sum64$1(this.h, 4, ch, cl);
	  sum64$1(this.h, 6, dh, dl);
	  sum64$1(this.h, 8, eh, el);
	  sum64$1(this.h, 10, fh, fl);
	  sum64$1(this.h, 12, gh, gl);
	  sum64$1(this.h, 14, hh, hl);
	};

	SHA512.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'big');
	  else
	    return utils.split32(this.h, 'big');
	};

	function ch64_hi(xh, xl, yh, yl, zh) {
	  var r = (xh & yh) ^ ((~xh) & zh);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function ch64_lo(xh, xl, yh, yl, zh, zl) {
	  var r = (xl & yl) ^ ((~xl) & zl);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function maj64_hi(xh, xl, yh, yl, zh) {
	  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function maj64_lo(xh, xl, yh, yl, zh, zl) {
	  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s0_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 28);
	  var c1_hi = rotr64_hi$1(xl, xh, 2);  // 34
	  var c2_hi = rotr64_hi$1(xl, xh, 7);  // 39

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s0_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 28);
	  var c1_lo = rotr64_lo$1(xl, xh, 2);  // 34
	  var c2_lo = rotr64_lo$1(xl, xh, 7);  // 39

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s1_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 14);
	  var c1_hi = rotr64_hi$1(xh, xl, 18);
	  var c2_hi = rotr64_hi$1(xl, xh, 9);  // 41

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function s1_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 14);
	  var c1_lo = rotr64_lo$1(xh, xl, 18);
	  var c2_lo = rotr64_lo$1(xl, xh, 9);  // 41

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g0_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 1);
	  var c1_hi = rotr64_hi$1(xh, xl, 8);
	  var c2_hi = shr64_hi$1(xh, xl, 7);

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g0_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 1);
	  var c1_lo = rotr64_lo$1(xh, xl, 8);
	  var c2_lo = shr64_lo$1(xh, xl, 7);

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g1_512_hi(xh, xl) {
	  var c0_hi = rotr64_hi$1(xh, xl, 19);
	  var c1_hi = rotr64_hi$1(xl, xh, 29);  // 61
	  var c2_hi = shr64_hi$1(xh, xl, 6);

	  var r = c0_hi ^ c1_hi ^ c2_hi;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function g1_512_lo(xh, xl) {
	  var c0_lo = rotr64_lo$1(xh, xl, 19);
	  var c1_lo = rotr64_lo$1(xl, xh, 29);  // 61
	  var c2_lo = shr64_lo$1(xh, xl, 6);

	  var r = c0_lo ^ c1_lo ^ c2_lo;
	  if (r < 0)
	    r += 0x100000000;
	  return r;
	}

	function SHA384() {
	  if (!(this instanceof SHA384))
	    return new SHA384();

	  _512.call(this);
	  this.h = [
	    0xcbbb9d5d, 0xc1059ed8,
	    0x629a292a, 0x367cd507,
	    0x9159015a, 0x3070dd17,
	    0x152fecd8, 0xf70e5939,
	    0x67332667, 0xffc00b31,
	    0x8eb44a87, 0x68581511,
	    0xdb0c2e0d, 0x64f98fa7,
	    0x47b5481d, 0xbefa4fa4 ];
	}
	utils.inherits(SHA384, _512);
	var _384 = SHA384;

	SHA384.blockSize = 1024;
	SHA384.outSize = 384;
	SHA384.hmacStrength = 192;
	SHA384.padLength = 128;

	SHA384.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h.slice(0, 12), 'big');
	  else
	    return utils.split32(this.h.slice(0, 12), 'big');
	};

	var sha1$1 = _1;
	var sha224$1 = _224;
	var sha256$1 = _256;
	var sha384$1 = _384;
	var sha512$1 = _512;

	var sha$1 = {
		sha1: sha1$1,
		sha224: sha224$1,
		sha256: sha256$1,
		sha384: sha384$1,
		sha512: sha512$1
	};

	var rotl32$2 = utils.rotl32;
	var sum32$3 = utils.sum32;
	var sum32_3$1 = utils.sum32_3;
	var sum32_4$2 = utils.sum32_4;
	var BlockHash$4 = common.BlockHash;

	function RIPEMD160() {
	  if (!(this instanceof RIPEMD160))
	    return new RIPEMD160();

	  BlockHash$4.call(this);

	  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
	  this.endian = 'little';
	}
	utils.inherits(RIPEMD160, BlockHash$4);
	var ripemd160 = RIPEMD160;

	RIPEMD160.blockSize = 512;
	RIPEMD160.outSize = 160;
	RIPEMD160.hmacStrength = 192;
	RIPEMD160.padLength = 64;

	RIPEMD160.prototype._update = function update(msg, start) {
	  var A = this.h[0];
	  var B = this.h[1];
	  var C = this.h[2];
	  var D = this.h[3];
	  var E = this.h[4];
	  var Ah = A;
	  var Bh = B;
	  var Ch = C;
	  var Dh = D;
	  var Eh = E;
	  for (var j = 0; j < 80; j++) {
	    var T = sum32$3(
	      rotl32$2(
	        sum32_4$2(A, f(j, B, C, D), msg[r$1[j] + start], K$4(j)),
	        s[j]),
	      E);
	    A = E;
	    E = D;
	    D = rotl32$2(C, 10);
	    C = B;
	    B = T;
	    T = sum32$3(
	      rotl32$2(
	        sum32_4$2(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
	        sh[j]),
	      Eh);
	    Ah = Eh;
	    Eh = Dh;
	    Dh = rotl32$2(Ch, 10);
	    Ch = Bh;
	    Bh = T;
	  }
	  T = sum32_3$1(this.h[1], C, Dh);
	  this.h[1] = sum32_3$1(this.h[2], D, Eh);
	  this.h[2] = sum32_3$1(this.h[3], E, Ah);
	  this.h[3] = sum32_3$1(this.h[4], A, Bh);
	  this.h[4] = sum32_3$1(this.h[0], B, Ch);
	  this.h[0] = T;
	};

	RIPEMD160.prototype._digest = function digest(enc) {
	  if (enc === 'hex')
	    return utils.toHex32(this.h, 'little');
	  else
	    return utils.split32(this.h, 'little');
	};

	function f(j, x, y, z) {
	  if (j <= 15)
	    return x ^ y ^ z;
	  else if (j <= 31)
	    return (x & y) | ((~x) & z);
	  else if (j <= 47)
	    return (x | (~y)) ^ z;
	  else if (j <= 63)
	    return (x & z) | (y & (~z));
	  else
	    return x ^ (y | (~z));
	}

	function K$4(j) {
	  if (j <= 15)
	    return 0x00000000;
	  else if (j <= 31)
	    return 0x5a827999;
	  else if (j <= 47)
	    return 0x6ed9eba1;
	  else if (j <= 63)
	    return 0x8f1bbcdc;
	  else
	    return 0xa953fd4e;
	}

	function Kh(j) {
	  if (j <= 15)
	    return 0x50a28be6;
	  else if (j <= 31)
	    return 0x5c4dd124;
	  else if (j <= 47)
	    return 0x6d703ef3;
	  else if (j <= 63)
	    return 0x7a6d76e9;
	  else
	    return 0x00000000;
	}

	var r$1 = [
	  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
	  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
	  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
	  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
	  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
	];

	var rh = [
	  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
	  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
	  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
	  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
	  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
	];

	var s = [
	  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
	  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
	  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
	  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
	  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
	];

	var sh = [
	  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
	  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
	  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
	  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
	  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
	];

	var ripemd = {
		ripemd160: ripemd160
	};

	function Hmac(hash, key, enc) {
	  if (!(this instanceof Hmac))
	    return new Hmac(hash, key, enc);
	  this.Hash = hash;
	  this.blockSize = hash.blockSize / 8;
	  this.outSize = hash.outSize / 8;
	  this.inner = null;
	  this.outer = null;

	  this._init(utils.toArray(key, enc));
	}
	var hmac = Hmac;

	Hmac.prototype._init = function init(key) {
	  // Shorten key, if needed
	  if (key.length > this.blockSize)
	    key = new this.Hash().update(key).digest();
	  minimalisticAssert(key.length <= this.blockSize);

	  // Add padding to key
	  for (var i = key.length; i < this.blockSize; i++)
	    key.push(0);

	  for (i = 0; i < key.length; i++)
	    key[i] ^= 0x36;
	  this.inner = new this.Hash().update(key);

	  // 0x36 ^ 0x5c = 0x6a
	  for (i = 0; i < key.length; i++)
	    key[i] ^= 0x6a;
	  this.outer = new this.Hash().update(key);
	};

	Hmac.prototype.update = function update(msg, enc) {
	  this.inner.update(msg, enc);
	  return this;
	};

	Hmac.prototype.digest = function digest(enc) {
	  this.outer.update(this.inner.digest());
	  return this.outer.digest(enc);
	};

	var hash_1 = createCommonjsModule(function (module, exports) {
	var hash = exports;

	hash.utils = utils;
	hash.common = common;
	hash.sha = sha$1;
	hash.ripemd = ripemd;
	hash.hmac = hmac;

	// Proxy hash functions to the main object
	hash.sha1 = hash.sha.sha1;
	hash.sha256 = hash.sha.sha256;
	hash.sha224 = hash.sha.sha224;
	hash.sha384 = hash.sha.sha384;
	hash.sha512 = hash.sha.sha512;
	hash.ripemd160 = hash.ripemd.ripemd160;
	});

	var secp256k1 = {
	  doubles: {
	    step: 4,
	    points: [
	      [
	        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
	        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
	      ],
	      [
	        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
	        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
	      ],
	      [
	        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
	        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
	      ],
	      [
	        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
	        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
	      ],
	      [
	        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
	        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
	      ],
	      [
	        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
	        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
	      ],
	      [
	        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
	        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
	      ],
	      [
	        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
	        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
	      ],
	      [
	        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
	        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
	      ],
	      [
	        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
	        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
	      ],
	      [
	        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
	        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
	      ],
	      [
	        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
	        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
	      ],
	      [
	        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
	        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
	      ],
	      [
	        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
	        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
	      ],
	      [
	        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
	        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
	      ],
	      [
	        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
	        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
	      ],
	      [
	        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
	        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
	      ],
	      [
	        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
	        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
	      ],
	      [
	        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
	        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
	      ],
	      [
	        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
	        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
	      ],
	      [
	        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
	        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
	      ],
	      [
	        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
	        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
	      ],
	      [
	        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
	        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
	      ],
	      [
	        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
	        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
	      ],
	      [
	        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
	        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
	      ],
	      [
	        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
	        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
	      ],
	      [
	        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
	        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
	      ],
	      [
	        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
	        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
	      ],
	      [
	        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
	        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
	      ],
	      [
	        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
	        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
	      ],
	      [
	        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
	        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
	      ],
	      [
	        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
	        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
	      ],
	      [
	        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
	        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
	      ],
	      [
	        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
	        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
	      ],
	      [
	        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
	        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
	      ],
	      [
	        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
	        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
	      ],
	      [
	        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
	        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
	      ],
	      [
	        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
	        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
	      ],
	      [
	        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
	        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
	      ],
	      [
	        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
	        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
	      ],
	      [
	        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
	        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
	      ],
	      [
	        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
	        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
	      ],
	      [
	        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
	        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
	      ],
	      [
	        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
	        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
	      ],
	      [
	        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
	        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
	      ],
	      [
	        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
	        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
	      ],
	      [
	        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
	        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
	      ],
	      [
	        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
	        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
	      ],
	      [
	        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
	        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
	      ],
	      [
	        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
	        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
	      ],
	      [
	        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
	        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
	      ],
	      [
	        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
	        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
	      ],
	      [
	        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
	        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
	      ],
	      [
	        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
	        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
	      ],
	      [
	        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
	        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
	      ],
	      [
	        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
	        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
	      ],
	      [
	        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
	        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
	      ],
	      [
	        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
	        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
	      ],
	      [
	        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
	        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
	      ],
	      [
	        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
	        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
	      ],
	      [
	        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
	        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
	      ],
	      [
	        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
	        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
	      ],
	      [
	        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
	        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
	      ],
	      [
	        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
	        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
	      ],
	      [
	        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
	        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
	      ]
	    ]
	  },
	  naf: {
	    wnd: 7,
	    points: [
	      [
	        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
	        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
	      ],
	      [
	        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
	        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
	      ],
	      [
	        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
	        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
	      ],
	      [
	        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
	        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
	      ],
	      [
	        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
	        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
	      ],
	      [
	        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
	        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
	      ],
	      [
	        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
	        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
	      ],
	      [
	        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
	        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
	      ],
	      [
	        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
	        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
	      ],
	      [
	        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
	        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
	      ],
	      [
	        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
	        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
	      ],
	      [
	        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
	        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
	      ],
	      [
	        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
	        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
	      ],
	      [
	        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
	        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
	      ],
	      [
	        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
	        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
	      ],
	      [
	        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
	        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
	      ],
	      [
	        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
	        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
	      ],
	      [
	        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
	        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
	      ],
	      [
	        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
	        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
	      ],
	      [
	        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
	        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
	      ],
	      [
	        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
	        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
	      ],
	      [
	        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
	        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
	      ],
	      [
	        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
	        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
	      ],
	      [
	        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
	        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
	      ],
	      [
	        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
	        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
	      ],
	      [
	        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
	        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
	      ],
	      [
	        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
	        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
	      ],
	      [
	        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
	        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
	      ],
	      [
	        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
	        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
	      ],
	      [
	        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
	        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
	      ],
	      [
	        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
	        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
	      ],
	      [
	        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
	        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
	      ],
	      [
	        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
	        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
	      ],
	      [
	        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
	        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
	      ],
	      [
	        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
	        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
	      ],
	      [
	        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
	        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
	      ],
	      [
	        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
	        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
	      ],
	      [
	        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
	        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
	      ],
	      [
	        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
	        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
	      ],
	      [
	        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
	        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
	      ],
	      [
	        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
	        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
	      ],
	      [
	        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
	        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
	      ],
	      [
	        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
	        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
	      ],
	      [
	        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
	        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
	      ],
	      [
	        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
	        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
	      ],
	      [
	        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
	        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
	      ],
	      [
	        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
	        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
	      ],
	      [
	        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
	        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
	      ],
	      [
	        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
	        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
	      ],
	      [
	        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
	        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
	      ],
	      [
	        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
	        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
	      ],
	      [
	        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
	        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
	      ],
	      [
	        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
	        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
	      ],
	      [
	        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
	        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
	      ],
	      [
	        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
	        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
	      ],
	      [
	        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
	        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
	      ],
	      [
	        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
	        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
	      ],
	      [
	        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
	        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
	      ],
	      [
	        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
	        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
	      ],
	      [
	        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
	        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
	      ],
	      [
	        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
	        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
	      ],
	      [
	        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
	        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
	      ],
	      [
	        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
	        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
	      ],
	      [
	        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
	        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
	      ],
	      [
	        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
	        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
	      ],
	      [
	        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
	        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
	      ],
	      [
	        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
	        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
	      ],
	      [
	        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
	        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
	      ],
	      [
	        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
	        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
	      ],
	      [
	        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
	        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
	      ],
	      [
	        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
	        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
	      ],
	      [
	        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
	        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
	      ],
	      [
	        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
	        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
	      ],
	      [
	        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
	        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
	      ],
	      [
	        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
	        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
	      ],
	      [
	        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
	        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
	      ],
	      [
	        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
	        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
	      ],
	      [
	        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
	        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
	      ],
	      [
	        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
	        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
	      ],
	      [
	        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
	        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
	      ],
	      [
	        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
	        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
	      ],
	      [
	        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
	        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
	      ],
	      [
	        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
	        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
	      ],
	      [
	        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
	        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
	      ],
	      [
	        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
	        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
	      ],
	      [
	        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
	        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
	      ],
	      [
	        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
	        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
	      ],
	      [
	        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
	        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
	      ],
	      [
	        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
	        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
	      ],
	      [
	        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
	        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
	      ],
	      [
	        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
	        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
	      ],
	      [
	        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
	        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
	      ],
	      [
	        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
	        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
	      ],
	      [
	        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
	        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
	      ],
	      [
	        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
	        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
	      ],
	      [
	        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
	        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
	      ],
	      [
	        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
	        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
	      ],
	      [
	        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
	        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
	      ],
	      [
	        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
	        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
	      ],
	      [
	        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
	        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
	      ],
	      [
	        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
	        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
	      ],
	      [
	        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
	        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
	      ],
	      [
	        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
	        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
	      ],
	      [
	        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
	        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
	      ],
	      [
	        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
	        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
	      ],
	      [
	        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
	        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
	      ],
	      [
	        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
	        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
	      ],
	      [
	        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
	        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
	      ],
	      [
	        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
	        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
	      ],
	      [
	        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
	        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
	      ],
	      [
	        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
	        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
	      ],
	      [
	        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
	        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
	      ],
	      [
	        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
	        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
	      ],
	      [
	        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
	        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
	      ],
	      [
	        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
	        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
	      ],
	      [
	        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
	        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
	      ],
	      [
	        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
	        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
	      ],
	      [
	        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
	        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
	      ],
	      [
	        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
	        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
	      ],
	      [
	        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
	        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
	      ],
	      [
	        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
	        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
	      ],
	      [
	        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
	        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
	      ],
	      [
	        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
	        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
	      ],
	      [
	        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
	        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
	      ],
	      [
	        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
	        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
	      ],
	      [
	        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
	        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
	      ],
	      [
	        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
	        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
	      ]
	    ]
	  }
	};

	var curves_1 = createCommonjsModule(function (module, exports) {

	var curves = exports;





	var assert = utils_1$1.assert;

	function PresetCurve(options) {
	  if (options.type === 'short')
	    this.curve = new curve_1.short(options);
	  else if (options.type === 'edwards')
	    this.curve = new curve_1.edwards(options);
	  else
	    this.curve = new curve_1.mont(options);
	  this.g = this.curve.g;
	  this.n = this.curve.n;
	  this.hash = options.hash;

	  assert(this.g.validate(), 'Invalid curve');
	  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
	}
	curves.PresetCurve = PresetCurve;

	function defineCurve(name, options) {
	  Object.defineProperty(curves, name, {
	    configurable: true,
	    enumerable: true,
	    get: function() {
	      var curve = new PresetCurve(options);
	      Object.defineProperty(curves, name, {
	        configurable: true,
	        enumerable: true,
	        value: curve
	      });
	      return curve;
	    }
	  });
	}

	defineCurve('p192', {
	  type: 'short',
	  prime: 'p192',
	  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
	  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
	  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
	  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
	    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
	  ]
	});

	defineCurve('p224', {
	  type: 'short',
	  prime: 'p224',
	  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
	  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
	  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
	  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
	    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
	  ]
	});

	defineCurve('p256', {
	  type: 'short',
	  prime: null,
	  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
	  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
	  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
	  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
	    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
	  ]
	});

	defineCurve('p384', {
	  type: 'short',
	  prime: null,
	  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'fffffffe ffffffff 00000000 00000000 ffffffff',
	  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'fffffffe ffffffff 00000000 00000000 fffffffc',
	  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
	     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
	  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
	     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
	  hash: hash_1.sha384,
	  gRed: false,
	  g: [
	    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
	    '5502f25d bf55296c 3a545e38 72760ab7',
	    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
	    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
	  ]
	});

	defineCurve('p521', {
	  type: 'short',
	  prime: null,
	  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff ffffffff',
	  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff ffffffff ffffffff fffffffc',
	  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
	     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
	     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
	  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
	     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
	     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
	  hash: hash_1.sha512,
	  gRed: false,
	  g: [
	    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
	    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
	    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
	    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
	    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
	    '3fad0761 353c7086 a272c240 88be9476 9fd16650'
	  ]
	});

	defineCurve('curve25519', {
	  type: 'mont',
	  prime: 'p25519',
	  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
	  a: '76d06',
	  b: '1',
	  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '9'
	  ]
	});

	defineCurve('ed25519', {
	  type: 'edwards',
	  prime: 'p25519',
	  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
	  a: '-1',
	  c: '1',
	  // -121665 * (121666^(-1)) (mod P)
	  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
	  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
	  hash: hash_1.sha256,
	  gRed: false,
	  g: [
	    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

	    // 4/5
	    '6666666666666666666666666666666666666666666666666666666666666658'
	  ]
	});

	var pre;
	try {
	  pre = secp256k1;
	} catch (e) {
	  pre = undefined;
	}

	defineCurve('secp256k1', {
	  type: 'short',
	  prime: 'k256',
	  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
	  a: '0',
	  b: '7',
	  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
	  h: '1',
	  hash: hash_1.sha256,

	  // Precomputed endomorphism
	  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
	  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
	  basis: [
	    {
	      a: '3086d221a7d46bcde86c90e49284eb15',
	      b: '-e4437ed6010e88286f547fa90abfe4c3'
	    },
	    {
	      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
	      b: '3086d221a7d46bcde86c90e49284eb15'
	    }
	  ],

	  gRed: false,
	  g: [
	    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
	    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
	    pre
	  ]
	});
	});

	function HmacDRBG(options) {
	  if (!(this instanceof HmacDRBG))
	    return new HmacDRBG(options);
	  this.hash = options.hash;
	  this.predResist = !!options.predResist;

	  this.outLen = this.hash.outSize;
	  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

	  this._reseed = null;
	  this.reseedInterval = null;
	  this.K = null;
	  this.V = null;

	  var entropy = utils_1.toArray(options.entropy, options.entropyEnc || 'hex');
	  var nonce = utils_1.toArray(options.nonce, options.nonceEnc || 'hex');
	  var pers = utils_1.toArray(options.pers, options.persEnc || 'hex');
	  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
	         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
	  this._init(entropy, nonce, pers);
	}
	var hmacDrbg = HmacDRBG;

	HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
	  var seed = entropy.concat(nonce).concat(pers);

	  this.K = new Array(this.outLen / 8);
	  this.V = new Array(this.outLen / 8);
	  for (var i = 0; i < this.V.length; i++) {
	    this.K[i] = 0x00;
	    this.V[i] = 0x01;
	  }

	  this._update(seed);
	  this._reseed = 1;
	  this.reseedInterval = 0x1000000000000;  // 2^48
	};

	HmacDRBG.prototype._hmac = function hmac() {
	  return new hash_1.hmac(this.hash, this.K);
	};

	HmacDRBG.prototype._update = function update(seed) {
	  var kmac = this._hmac()
	                 .update(this.V)
	                 .update([ 0x00 ]);
	  if (seed)
	    kmac = kmac.update(seed);
	  this.K = kmac.digest();
	  this.V = this._hmac().update(this.V).digest();
	  if (!seed)
	    return;

	  this.K = this._hmac()
	               .update(this.V)
	               .update([ 0x01 ])
	               .update(seed)
	               .digest();
	  this.V = this._hmac().update(this.V).digest();
	};

	HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
	  // Optional entropy enc
	  if (typeof entropyEnc !== 'string') {
	    addEnc = add;
	    add = entropyEnc;
	    entropyEnc = null;
	  }

	  entropy = utils_1.toArray(entropy, entropyEnc);
	  add = utils_1.toArray(add, addEnc);

	  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
	         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

	  this._update(entropy.concat(add || []));
	  this._reseed = 1;
	};

	HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
	  if (this._reseed > this.reseedInterval)
	    throw new Error('Reseed is required');

	  // Optional encoding
	  if (typeof enc !== 'string') {
	    addEnc = add;
	    add = enc;
	    enc = null;
	  }

	  // Optional additional data
	  if (add) {
	    add = utils_1.toArray(add, addEnc || 'hex');
	    this._update(add);
	  }

	  var temp = [];
	  while (temp.length < len) {
	    this.V = this._hmac().update(this.V).digest();
	    temp = temp.concat(this.V);
	  }

	  var res = temp.slice(0, len);
	  this._update(add);
	  this._reseed++;
	  return utils_1.encode(res, enc);
	};

	var assert$4 = utils_1$1.assert;

	function KeyPair(ec, options) {
	  this.ec = ec;
	  this.priv = null;
	  this.pub = null;

	  // KeyPair(ec, { priv: ..., pub: ... })
	  if (options.priv)
	    this._importPrivate(options.priv, options.privEnc);
	  if (options.pub)
	    this._importPublic(options.pub, options.pubEnc);
	}
	var key = KeyPair;

	KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
	  if (pub instanceof KeyPair)
	    return pub;

	  return new KeyPair(ec, {
	    pub: pub,
	    pubEnc: enc
	  });
	};

	KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
	  if (priv instanceof KeyPair)
	    return priv;

	  return new KeyPair(ec, {
	    priv: priv,
	    privEnc: enc
	  });
	};

	KeyPair.prototype.validate = function validate() {
	  var pub = this.getPublic();

	  if (pub.isInfinity())
	    return { result: false, reason: 'Invalid public key' };
	  if (!pub.validate())
	    return { result: false, reason: 'Public key is not a point' };
	  if (!pub.mul(this.ec.curve.n).isInfinity())
	    return { result: false, reason: 'Public key * N != O' };

	  return { result: true, reason: null };
	};

	KeyPair.prototype.getPublic = function getPublic(compact, enc) {
	  // compact is optional argument
	  if (typeof compact === 'string') {
	    enc = compact;
	    compact = null;
	  }

	  if (!this.pub)
	    this.pub = this.ec.g.mul(this.priv);

	  if (!enc)
	    return this.pub;

	  return this.pub.encode(enc, compact);
	};

	KeyPair.prototype.getPrivate = function getPrivate(enc) {
	  if (enc === 'hex')
	    return this.priv.toString(16, 2);
	  else
	    return this.priv;
	};

	KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
	  this.priv = new bn(key, enc || 16);

	  // Ensure that the priv won't be bigger than n, otherwise we may fail
	  // in fixed multiplication method
	  this.priv = this.priv.umod(this.ec.curve.n);
	};

	KeyPair.prototype._importPublic = function _importPublic(key, enc) {
	  if (key.x || key.y) {
	    // Montgomery points only have an `x` coordinate.
	    // Weierstrass/Edwards points on the other hand have both `x` and
	    // `y` coordinates.
	    if (this.ec.curve.type === 'mont') {
	      assert$4(key.x, 'Need x coordinate');
	    } else if (this.ec.curve.type === 'short' ||
	               this.ec.curve.type === 'edwards') {
	      assert$4(key.x && key.y, 'Need both x and y coordinate');
	    }
	    this.pub = this.ec.curve.point(key.x, key.y);
	    return;
	  }
	  this.pub = this.ec.curve.decodePoint(key, enc);
	};

	// ECDH
	KeyPair.prototype.derive = function derive(pub) {
	  return pub.mul(this.priv).getX();
	};

	// ECDSA
	KeyPair.prototype.sign = function sign(msg, enc, options) {
	  return this.ec.sign(msg, this, enc, options);
	};

	KeyPair.prototype.verify = function verify(msg, signature) {
	  return this.ec.verify(msg, signature, this);
	};

	KeyPair.prototype.inspect = function inspect() {
	  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
	         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
	};

	var assert$5 = utils_1$1.assert;

	function Signature(options, enc) {
	  if (options instanceof Signature)
	    return options;

	  if (this._importDER(options, enc))
	    return;

	  assert$5(options.r && options.s, 'Signature without r or s');
	  this.r = new bn(options.r, 16);
	  this.s = new bn(options.s, 16);
	  if (options.recoveryParam === undefined)
	    this.recoveryParam = null;
	  else
	    this.recoveryParam = options.recoveryParam;
	}
	var signature = Signature;

	function Position() {
	  this.place = 0;
	}

	function getLength(buf, p) {
	  var initial = buf[p.place++];
	  if (!(initial & 0x80)) {
	    return initial;
	  }
	  var octetLen = initial & 0xf;
	  var val = 0;
	  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
	    val <<= 8;
	    val |= buf[off];
	  }
	  p.place = off;
	  return val;
	}

	function rmPadding(buf) {
	  var i = 0;
	  var len = buf.length - 1;
	  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
	    i++;
	  }
	  if (i === 0) {
	    return buf;
	  }
	  return buf.slice(i);
	}

	Signature.prototype._importDER = function _importDER(data, enc) {
	  data = utils_1$1.toArray(data, enc);
	  var p = new Position();
	  if (data[p.place++] !== 0x30) {
	    return false;
	  }
	  var len = getLength(data, p);
	  if ((len + p.place) !== data.length) {
	    return false;
	  }
	  if (data[p.place++] !== 0x02) {
	    return false;
	  }
	  var rlen = getLength(data, p);
	  var r = data.slice(p.place, rlen + p.place);
	  p.place += rlen;
	  if (data[p.place++] !== 0x02) {
	    return false;
	  }
	  var slen = getLength(data, p);
	  if (data.length !== slen + p.place) {
	    return false;
	  }
	  var s = data.slice(p.place, slen + p.place);
	  if (r[0] === 0 && (r[1] & 0x80)) {
	    r = r.slice(1);
	  }
	  if (s[0] === 0 && (s[1] & 0x80)) {
	    s = s.slice(1);
	  }

	  this.r = new bn(r);
	  this.s = new bn(s);
	  this.recoveryParam = null;

	  return true;
	};

	function constructLength(arr, len) {
	  if (len < 0x80) {
	    arr.push(len);
	    return;
	  }
	  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
	  arr.push(octets | 0x80);
	  while (--octets) {
	    arr.push((len >>> (octets << 3)) & 0xff);
	  }
	  arr.push(len);
	}

	Signature.prototype.toDER = function toDER(enc) {
	  var r = this.r.toArray();
	  var s = this.s.toArray();

	  // Pad values
	  if (r[0] & 0x80)
	    r = [ 0 ].concat(r);
	  // Pad values
	  if (s[0] & 0x80)
	    s = [ 0 ].concat(s);

	  r = rmPadding(r);
	  s = rmPadding(s);

	  while (!s[0] && !(s[1] & 0x80)) {
	    s = s.slice(1);
	  }
	  var arr = [ 0x02 ];
	  constructLength(arr, r.length);
	  arr = arr.concat(r);
	  arr.push(0x02);
	  constructLength(arr, s.length);
	  var backHalf = arr.concat(s);
	  var res = [ 0x30 ];
	  constructLength(res, backHalf.length);
	  res = res.concat(backHalf);
	  return utils_1$1.encode(res, enc);
	};

	var assert$6 = utils_1$1.assert;




	function EC(options) {
	  if (!(this instanceof EC))
	    return new EC(options);

	  // Shortcut `elliptic.ec(curve-name)`
	  if (typeof options === 'string') {
	    assert$6(curves_1.hasOwnProperty(options), 'Unknown curve ' + options);

	    options = curves_1[options];
	  }

	  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
	  if (options instanceof curves_1.PresetCurve)
	    options = { curve: options };

	  this.curve = options.curve.curve;
	  this.n = this.curve.n;
	  this.nh = this.n.ushrn(1);
	  this.g = this.curve.g;

	  // Point on curve
	  this.g = options.curve.g;
	  this.g.precompute(options.curve.n.bitLength() + 1);

	  // Hash for function for DRBG
	  this.hash = options.hash || options.curve.hash;
	}
	var ec = EC;

	EC.prototype.keyPair = function keyPair(options) {
	  return new key(this, options);
	};

	EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
	  return key.fromPrivate(this, priv, enc);
	};

	EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
	  return key.fromPublic(this, pub, enc);
	};

	EC.prototype.genKeyPair = function genKeyPair(options) {
	  if (!options)
	    options = {};

	  // Instantiate Hmac_DRBG
	  var drbg = new hmacDrbg({
	    hash: this.hash,
	    pers: options.pers,
	    persEnc: options.persEnc || 'utf8',
	    entropy: options.entropy || brorand(this.hash.hmacStrength),
	    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
	    nonce: this.n.toArray()
	  });

	  var bytes = this.n.byteLength();
	  var ns2 = this.n.sub(new bn(2));
	  do {
	    var priv = new bn(drbg.generate(bytes));
	    if (priv.cmp(ns2) > 0)
	      continue;

	    priv.iaddn(1);
	    return this.keyFromPrivate(priv);
	  } while (true);
	};

	EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
	  var delta = msg.byteLength() * 8 - this.n.bitLength();
	  if (delta > 0)
	    msg = msg.ushrn(delta);
	  if (!truncOnly && msg.cmp(this.n) >= 0)
	    return msg.sub(this.n);
	  else
	    return msg;
	};

	EC.prototype.sign = function sign(msg, key$$1, enc, options) {
	  if (typeof enc === 'object') {
	    options = enc;
	    enc = null;
	  }
	  if (!options)
	    options = {};

	  key$$1 = this.keyFromPrivate(key$$1, enc);
	  msg = this._truncateToN(new bn(msg, 16));

	  // Zero-extend key to provide enough entropy
	  var bytes = this.n.byteLength();
	  var bkey = key$$1.getPrivate().toArray('be', bytes);

	  // Zero-extend nonce to have the same byte size as N
	  var nonce = msg.toArray('be', bytes);

	  // Instantiate Hmac_DRBG
	  var drbg = new hmacDrbg({
	    hash: this.hash,
	    entropy: bkey,
	    nonce: nonce,
	    pers: options.pers,
	    persEnc: options.persEnc || 'utf8'
	  });

	  // Number of bytes to generate
	  var ns1 = this.n.sub(new bn(1));

	  for (var iter = 0; true; iter++) {
	    var k = options.k ?
	        options.k(iter) :
	        new bn(drbg.generate(this.n.byteLength()));
	    k = this._truncateToN(k, true);
	    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
	      continue;

	    var kp = this.g.mul(k);
	    if (kp.isInfinity())
	      continue;

	    var kpX = kp.getX();
	    var r = kpX.umod(this.n);
	    if (r.cmpn(0) === 0)
	      continue;

	    var s = k.invm(this.n).mul(r.mul(key$$1.getPrivate()).iadd(msg));
	    s = s.umod(this.n);
	    if (s.cmpn(0) === 0)
	      continue;

	    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
	                        (kpX.cmp(r) !== 0 ? 2 : 0);

	    // Use complement of `s`, if it is > `n / 2`
	    if (options.canonical && s.cmp(this.nh) > 0) {
	      s = this.n.sub(s);
	      recoveryParam ^= 1;
	    }

	    return new signature({ r: r, s: s, recoveryParam: recoveryParam });
	  }
	};

	EC.prototype.verify = function verify(msg, signature$$1, key$$1, enc) {
	  msg = this._truncateToN(new bn(msg, 16));
	  key$$1 = this.keyFromPublic(key$$1, enc);
	  signature$$1 = new signature(signature$$1, 'hex');

	  // Perform primitive values validation
	  var r = signature$$1.r;
	  var s = signature$$1.s;
	  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
	    return false;
	  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
	    return false;

	  // Validate signature
	  var sinv = s.invm(this.n);
	  var u1 = sinv.mul(msg).umod(this.n);
	  var u2 = sinv.mul(r).umod(this.n);

	  if (!this.curve._maxwellTrick) {
	    var p = this.g.mulAdd(u1, key$$1.getPublic(), u2);
	    if (p.isInfinity())
	      return false;

	    return p.getX().umod(this.n).cmp(r) === 0;
	  }

	  // NOTE: Greg Maxwell's trick, inspired by:
	  // https://git.io/vad3K

	  var p = this.g.jmulAdd(u1, key$$1.getPublic(), u2);
	  if (p.isInfinity())
	    return false;

	  // Compare `p.x` of Jacobian point with `r`,
	  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
	  // inverse of `p.z^2`
	  return p.eqXToP(r);
	};

	EC.prototype.recoverPubKey = function(msg, signature$$1, j, enc) {
	  assert$6((3 & j) === j, 'The recovery param is more than two bits');
	  signature$$1 = new signature(signature$$1, enc);

	  var n = this.n;
	  var e = new bn(msg);
	  var r = signature$$1.r;
	  var s = signature$$1.s;

	  // A set LSB signifies that the y-coordinate is odd
	  var isYOdd = j & 1;
	  var isSecondKey = j >> 1;
	  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
	    throw new Error('Unable to find sencond key candinate');

	  // 1.1. Let x = r + jn.
	  if (isSecondKey)
	    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
	  else
	    r = this.curve.pointFromX(r, isYOdd);

	  var rInv = signature$$1.r.invm(n);
	  var s1 = n.sub(e).mul(rInv).umod(n);
	  var s2 = s.mul(rInv).umod(n);

	  // 1.6.1 Compute Q = r^-1 (sR -  eG)
	  //               Q = r^-1 (sR + -eG)
	  return this.g.mulAdd(s1, r, s2);
	};

	EC.prototype.getKeyRecoveryParam = function(e, signature$$1, Q, enc) {
	  signature$$1 = new signature(signature$$1, enc);
	  if (signature$$1.recoveryParam !== null)
	    return signature$$1.recoveryParam;

	  for (var i = 0; i < 4; i++) {
	    var Qprime;
	    try {
	      Qprime = this.recoverPubKey(e, signature$$1, i);
	    } catch (e) {
	      continue;
	    }

	    if (Qprime.eq(Q))
	      return i;
	  }
	  throw new Error('Unable to find valid recovery factor');
	};

	var assert$7 = utils_1$1.assert;
	var parseBytes = utils_1$1.parseBytes;
	var cachedProperty = utils_1$1.cachedProperty;

	/**
	* @param {EDDSA} eddsa - instance
	* @param {Object} params - public/private key parameters
	*
	* @param {Array<Byte>} [params.secret] - secret seed bytes
	* @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
	* @param {Array<Byte>} [params.pub] - public key point encoded as bytes
	*
	*/
	function KeyPair$1(eddsa, params) {
	  this.eddsa = eddsa;
	  this._secret = parseBytes(params.secret);
	  if (eddsa.isPoint(params.pub))
	    this._pub = params.pub;
	  else
	    this._pubBytes = parseBytes(params.pub);
	}

	KeyPair$1.fromPublic = function fromPublic(eddsa, pub) {
	  if (pub instanceof KeyPair$1)
	    return pub;
	  return new KeyPair$1(eddsa, { pub: pub });
	};

	KeyPair$1.fromSecret = function fromSecret(eddsa, secret) {
	  if (secret instanceof KeyPair$1)
	    return secret;
	  return new KeyPair$1(eddsa, { secret: secret });
	};

	KeyPair$1.prototype.secret = function secret() {
	  return this._secret;
	};

	cachedProperty(KeyPair$1, 'pubBytes', function pubBytes() {
	  return this.eddsa.encodePoint(this.pub());
	});

	cachedProperty(KeyPair$1, 'pub', function pub() {
	  if (this._pubBytes)
	    return this.eddsa.decodePoint(this._pubBytes);
	  return this.eddsa.g.mul(this.priv());
	});

	cachedProperty(KeyPair$1, 'privBytes', function privBytes() {
	  var eddsa = this.eddsa;
	  var hash = this.hash();
	  var lastIx = eddsa.encodingLength - 1;

	  var a = hash.slice(0, eddsa.encodingLength);
	  a[0] &= 248;
	  a[lastIx] &= 127;
	  a[lastIx] |= 64;

	  return a;
	});

	cachedProperty(KeyPair$1, 'priv', function priv() {
	  return this.eddsa.decodeInt(this.privBytes());
	});

	cachedProperty(KeyPair$1, 'hash', function hash() {
	  return this.eddsa.hash().update(this.secret()).digest();
	});

	cachedProperty(KeyPair$1, 'messagePrefix', function messagePrefix() {
	  return this.hash().slice(this.eddsa.encodingLength);
	});

	KeyPair$1.prototype.sign = function sign(message) {
	  assert$7(this._secret, 'KeyPair can only verify');
	  return this.eddsa.sign(message, this);
	};

	KeyPair$1.prototype.verify = function verify(message, sig) {
	  return this.eddsa.verify(message, sig, this);
	};

	KeyPair$1.prototype.getSecret = function getSecret(enc) {
	  assert$7(this._secret, 'KeyPair is public only');
	  return utils_1$1.encode(this.secret(), enc);
	};

	KeyPair$1.prototype.getPublic = function getPublic(enc) {
	  return utils_1$1.encode(this.pubBytes(), enc);
	};

	var key$1 = KeyPair$1;

	var assert$8 = utils_1$1.assert;
	var cachedProperty$1 = utils_1$1.cachedProperty;
	var parseBytes$1 = utils_1$1.parseBytes;

	/**
	* @param {EDDSA} eddsa - eddsa instance
	* @param {Array<Bytes>|Object} sig -
	* @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
	* @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
	* @param {Array<Bytes>} [sig.Rencoded] - R point encoded
	* @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
	*/
	function Signature$1(eddsa, sig) {
	  this.eddsa = eddsa;

	  if (typeof sig !== 'object')
	    sig = parseBytes$1(sig);

	  if (Array.isArray(sig)) {
	    sig = {
	      R: sig.slice(0, eddsa.encodingLength),
	      S: sig.slice(eddsa.encodingLength)
	    };
	  }

	  assert$8(sig.R && sig.S, 'Signature without R or S');

	  if (eddsa.isPoint(sig.R))
	    this._R = sig.R;
	  if (sig.S instanceof bn)
	    this._S = sig.S;

	  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
	  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
	}

	cachedProperty$1(Signature$1, 'S', function S() {
	  return this.eddsa.decodeInt(this.Sencoded());
	});

	cachedProperty$1(Signature$1, 'R', function R() {
	  return this.eddsa.decodePoint(this.Rencoded());
	});

	cachedProperty$1(Signature$1, 'Rencoded', function Rencoded() {
	  return this.eddsa.encodePoint(this.R());
	});

	cachedProperty$1(Signature$1, 'Sencoded', function Sencoded() {
	  return this.eddsa.encodeInt(this.S());
	});

	Signature$1.prototype.toBytes = function toBytes() {
	  return this.Rencoded().concat(this.Sencoded());
	};

	Signature$1.prototype.toHex = function toHex() {
	  return utils_1$1.encode(this.toBytes(), 'hex').toUpperCase();
	};

	var signature$1 = Signature$1;

	var assert$9 = utils_1$1.assert;
	var parseBytes$2 = utils_1$1.parseBytes;



	function EDDSA(curve) {
	  assert$9(curve === 'ed25519', 'only tested with ed25519 so far');

	  if (!(this instanceof EDDSA))
	    return new EDDSA(curve);

	  var curve = curves_1[curve].curve;
	  this.curve = curve;
	  this.g = curve.g;
	  this.g.precompute(curve.n.bitLength() + 1);

	  this.pointClass = curve.point().constructor;
	  this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
	  this.hash = hash_1.sha512;
	}

	var eddsa = EDDSA;

	/**
	* @param {Array|String} message - message bytes
	* @param {Array|String|KeyPair} secret - secret bytes or a keypair
	* @returns {Signature} - signature
	*/
	EDDSA.prototype.sign = function sign(message, secret) {
	  message = parseBytes$2(message);
	  var key = this.keyFromSecret(secret);
	  var r = this.hashInt(key.messagePrefix(), message);
	  var R = this.g.mul(r);
	  var Rencoded = this.encodePoint(R);
	  var s_ = this.hashInt(Rencoded, key.pubBytes(), message)
	               .mul(key.priv());
	  var S = r.add(s_).umod(this.curve.n);
	  return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
	};

	/**
	* @param {Array} message - message bytes
	* @param {Array|String|Signature} sig - sig bytes
	* @param {Array|String|Point|KeyPair} pub - public key
	* @returns {Boolean} - true if public key matches sig of message
	*/
	EDDSA.prototype.verify = function verify(message, sig, pub) {
	  message = parseBytes$2(message);
	  sig = this.makeSignature(sig);
	  var key = this.keyFromPublic(pub);
	  var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
	  var SG = this.g.mul(sig.S());
	  var RplusAh = sig.R().add(key.pub().mul(h));
	  return RplusAh.eq(SG);
	};

	EDDSA.prototype.hashInt = function hashInt() {
	  var hash = this.hash();
	  for (var i = 0; i < arguments.length; i++)
	    hash.update(arguments[i]);
	  return utils_1$1.intFromLE(hash.digest()).umod(this.curve.n);
	};

	EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
	  return key$1.fromPublic(this, pub);
	};

	EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
	  return key$1.fromSecret(this, secret);
	};

	EDDSA.prototype.makeSignature = function makeSignature(sig) {
	  if (sig instanceof signature$1)
	    return sig;
	  return new signature$1(this, sig);
	};

	/**
	* * https://tools.ietf.org/html/draft-josefsson-eddsa-ed25519-03#section-5.2
	*
	* EDDSA defines methods for encoding and decoding points and integers. These are
	* helper convenience methods, that pass along to utility functions implied
	* parameters.
	*
	*/
	EDDSA.prototype.encodePoint = function encodePoint(point) {
	  var enc = point.getY().toArray('le', this.encodingLength);
	  enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
	  return enc;
	};

	EDDSA.prototype.decodePoint = function decodePoint(bytes) {
	  bytes = utils_1$1.parseBytes(bytes);

	  var lastIx = bytes.length - 1;
	  var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80);
	  var xIsOdd = (bytes[lastIx] & 0x80) !== 0;

	  var y = utils_1$1.intFromLE(normed);
	  return this.curve.pointFromY(y, xIsOdd);
	};

	EDDSA.prototype.encodeInt = function encodeInt(num) {
	  return num.toArray('le', this.encodingLength);
	};

	EDDSA.prototype.decodeInt = function decodeInt(bytes) {
	  return utils_1$1.intFromLE(bytes);
	};

	EDDSA.prototype.isPoint = function isPoint(val) {
	  return val instanceof this.pointClass;
	};

	var require$$0$2 = ( _package$1 && _package ) || _package$1;

	var elliptic_1 = createCommonjsModule(function (module, exports) {

	var elliptic = exports;

	elliptic.version = require$$0$2.version;
	elliptic.utils = utils_1$1;
	elliptic.rand = brorand;
	elliptic.curve = curve_1;
	elliptic.curves = curves_1;

	// Protocols
	elliptic.ec = ec;
	elliptic.eddsa = eddsa;
	});
	var elliptic_2 = elliptic_1.ec;

	var browserPonyfill = createCommonjsModule(function (module) {
	var __root__ = (function (root) {
	function F() { this.fetch = false; }
	F.prototype = root;
	return new F();
	})(typeof self !== 'undefined' ? self : commonjsGlobal);
	(function(self) {

	(function(self) {

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  };

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ];

	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    };

	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    };
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift();
	        return {done: value === undefined, value: value}
	      }
	    };

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      };
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {};

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1]);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var oldValue = this.map[name];
	    this.map[name] = oldValue ? oldValue+','+value : value;
	  };

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)];
	  };

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name);
	    return this.has(name) ? this.map[name] : null
	  };

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  };

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value);
	  };

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this);
	      }
	    }
	  };

	  Headers.prototype.keys = function() {
	    var items = [];
	    this.forEach(function(value, name) { items.push(name); });
	    return iteratorFor(items)
	  };

	  Headers.prototype.values = function() {
	    var items = [];
	    this.forEach(function(value) { items.push(value); });
	    return iteratorFor(items)
	  };

	  Headers.prototype.entries = function() {
	    var items = [];
	    this.forEach(function(value, name) { items.push([name, value]); });
	    return iteratorFor(items)
	  };

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true;
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result);
	      };
	      reader.onerror = function() {
	        reject(reader.error);
	      };
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsArrayBuffer(blob);
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsText(blob);
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf);
	    var chars = new Array(view.length);

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i]);
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength);
	      view.set(new Uint8Array(buf));
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false;

	    this._initBody = function(body) {
	      this._bodyInit = body;
	      if (!body) {
	        this._bodyText = '';
	      } else if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer);
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer]);
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body);
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      };

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      };
	    }

	    this.text = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    };

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      };
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    };

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = String(input);
	    }

	    this.credentials = options.credentials || this.credentials || 'omit';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.referrer = null;

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body);
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  };

	  function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers();
	    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	    // https://tools.ietf.org/html/rfc7230#section-3.2
	    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':');
	      var key = parts.shift().trim();
	      if (key) {
	        var value = parts.join(':').trim();
	        headers.append(key, value);
	      }
	    });
	    return headers
	  }

	  Body.call(Request.prototype);

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }

	    this.type = 'default';
	    this.status = options.status === undefined ? 200 : options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = 'statusText' in options ? options.statusText : 'OK';
	    this.headers = new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }

	  Body.call(Response.prototype);

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  };

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''});
	    response.type = 'error';
	    return response
	  };

	  var redirectStatuses = [301, 302, 303, 307, 308];

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  };

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init);
	      var xhr = new XMLHttpRequest();

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        };
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options));
	      };

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'));
	      };

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'));
	      };

	      xhr.open(request.method, request.url, true);

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      } else if (request.credentials === 'omit') {
	        xhr.withCredentials = false;
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob';
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value);
	      });

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    })
	  };
	  self.fetch.polyfill = true;
	})(typeof self !== 'undefined' ? self : this);
	}).call(__root__, void(0));
	var fetch = __root__.fetch;
	var Response = fetch.Response = __root__.Response;
	var Request = fetch.Request = __root__.Request;
	var Headers = fetch.Headers = __root__.Headers;
	if (module.exports) {
	module.exports = fetch;
	}
	});

	function isJsonRpcSuccess(response) {
	    return 'result' in response;
	}

	const DefaultABCIQueryOptions = {
	    height: '0',
	    trusted: false
	};
	class Rpc {
	    constructor(nodeUrl) {
	        this._nodeUrl = nodeUrl;
	    }
	    abciQuery(path, key, opts = DefaultABCIQueryOptions) {
	        return browserPonyfill(this._nodeUrl, {
	            headers: { 'Content-Type': 'text/json' },
	            body: JSON.stringify({
	                jsonrpc: '2.0',
	                id: 'jsonrpc-client',
	                method: 'abci_query',
	                params: Object.assign({}, opts, { path, data: key })
	            }),
	            method: 'POST',
	            mode: 'cors'
	        })
	            .then(response => response.json())
	            .then((data) => {
	            if ('result' in data) {
	                return data.result;
	            }
	            else {
	                throw data.error;
	            }
	        });
	    }
	    broadcastTxCommit(tx) {
	        return browserPonyfill(this._nodeUrl, {
	            headers: { 'Content-Type': 'text/json' },
	            body: JSON.stringify({
	                jsonrpc: '2.0',
	                id: 'jsonrpc-client',
	                method: 'broadcast_tx_commit',
	                params: {
	                    tx: tx
	                }
	            }),
	            method: 'POST',
	            mode: 'cors'
	        })
	            .then(response => response.json())
	            .then((data) => {
	            if (isJsonRpcSuccess(data)) {
	                return data.result;
	            }
	            else {
	                throw data.error;
	            }
	        });
	    }
	    block(height) {
	        return browserPonyfill(this._nodeUrl, {
	            headers: { 'Content-Type': 'text/json' },
	            body: JSON.stringify({
	                jsonrpc: '2.0',
	                id: 'jsonrpc-client',
	                method: 'block',
	                params: {
	                    height: height
	                }
	            }),
	            method: 'POST',
	            mode: 'cors'
	        })
	            .then(response => response.json())
	            .then((data) => {
	            if (isJsonRpcSuccess(data)) {
	                return data.result;
	            }
	            else {
	                throw data.error;
	            }
	        });
	    }
	}

	//@ts-ignore
	var Keys;
	(function (Keys) {
	    Keys.KVSTOREKEYS = {
	        MainKVStoreKey: 'main',
	        AccountKVStoreKey: 'account',
	        PostKVStoreKey: 'post',
	        ValidatorKVStoreKey: 'validator',
	        GlobalKVStoreKey: 'global',
	        VoteKVStoreKey: 'vote',
	        InfraKVStoreKey: 'infra',
	        DeveloperKVStoreKey: 'developer',
	        ParamKVStoreKey: 'param',
	        ProposalKVStoreKey: 'proposal'
	    };
	    const _KEYS = {
	        validatorSubstore: '00',
	        validatorListSubstore: '01',
	        delegationSubstore: '00',
	        voterSubstore: '01',
	        voteSubstore: '02',
	        referenceListSubStore: '03',
	        delegateeSubStore: '04',
	        proposalSubstore: '00',
	        proposalListSubStore: '01',
	        nextProposalIDSubstore: '02',
	        developerSubstore: '00',
	        developerListSubstore: '01',
	        infraProviderSubstore: '00',
	        infraProviderListSubstore: '01',
	        accountInfoSubstore: '00',
	        accountBankSubstore: '01',
	        accountMetaSubstore: '02',
	        accountFollowerSubstore: '03',
	        accountFollowingSubstore: '04',
	        accountRewardSubstore: '05',
	        accountPendingStakeQueueSubstore: '06',
	        accountRelationshipSubstore: '07',
	        accountBalanceHistorySubstore: '08',
	        accountGrantPubKeySubstore: '09',
	        accountRewardHistorySubstore: '0a',
	        postInfoSubStore: '00',
	        postMetaSubStore: '01',
	        postReportOrUpvoteSubStore: '02',
	        postCommentSubStore: '03',
	        postViewsSubStore: '04',
	        postDonationsSubStore: '05',
	        allocationParamSubStore: '00',
	        infraInternalAllocationParamSubStore: '01',
	        evaluateOfContentValueParamSubStore: '02',
	        developerParamSubStore: '03',
	        voteParamSubStore: '04',
	        proposalParamSubStore: '05',
	        validatorParamSubStore: '06',
	        coinDayParamSubStore: '07',
	        bandwidthParamSubStore: '08',
	        accountParamSubstore: '09',
	        postParamSubStore: '0a',
	        timeEventListSubStore: '00',
	        globalMetaSubStore: '01',
	        inflationPoolSubStore: '02',
	        consumptionMetaSubStore: '03',
	        tpsSubStore: '04',
	        sep: bytebuffer.fromUTF8('/').toHex(),
	        separator: '/'
	    };
	    function getHexSubstringAfterKeySeparator(key) {
	        return key.substr(key.indexOf(_KEYS.separator) + 1, key.length);
	    }
	    Keys.getHexSubstringAfterKeySeparator = getHexSubstringAfterKeySeparator;
	    function getSubstringAfterKeySeparator(key) {
	        return key.substr(key.indexOf(_KEYS.separator) + 1, key.length);
	    }
	    Keys.getSubstringAfterKeySeparator = getSubstringAfterKeySeparator;
	    function getSubstringAfterSubstore(key) {
	        return key.substr(2, key.length);
	    }
	    Keys.getSubstringAfterSubstore = getSubstringAfterSubstore;
	    // validator related
	    function getValidatorKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.validatorSubstore.concat(accKeyHex);
	    }
	    Keys.getValidatorKey = getValidatorKey;
	    function getValidatorListKey() {
	        return _KEYS.validatorListSubstore;
	    }
	    Keys.getValidatorListKey = getValidatorListKey;
	    // vote related
	    function getVotePrefix(id) {
	        const idHex = bytebuffer.fromUTF8(id).toHex();
	        return _KEYS.voteSubstore.concat(idHex).concat(_KEYS.sep);
	    }
	    Keys.getVotePrefix = getVotePrefix;
	    function getVoteKey(proposalID, voter) {
	        const voterHex = bytebuffer.fromUTF8(voter).toHex();
	        return getVotePrefix(proposalID).concat(voterHex);
	    }
	    Keys.getVoteKey = getVoteKey;
	    function getDelegationPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.delegationSubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getDelegationPrefix = getDelegationPrefix;
	    function getDelegationKey(me, myDelegator) {
	        const myDelegatorHex = bytebuffer.fromUTF8(myDelegator).toHex();
	        return getDelegationPrefix(me).concat(myDelegatorHex);
	    }
	    Keys.getDelegationKey = getDelegationKey;
	    function getVoterKey(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.voterSubstore.concat(meHex);
	    }
	    Keys.getVoterKey = getVoterKey;
	    function getDelegateePrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.delegateeSubStore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getDelegateePrefix = getDelegateePrefix;
	    function getDelegateeKey(me, myDelegatee) {
	        const myDelegateeHex = bytebuffer.fromUTF8(myDelegatee).toHex();
	        return getDelegateePrefix(me).concat(myDelegateeHex);
	    }
	    Keys.getDelegateeKey = getDelegateeKey;
	    // developer related
	    function getDeveloperKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.developerSubstore.concat(accKeyHex);
	    }
	    Keys.getDeveloperKey = getDeveloperKey;
	    function getDeveloperPrefix() {
	        return _KEYS.developerSubstore;
	    }
	    Keys.getDeveloperPrefix = getDeveloperPrefix;
	    function getDeveloperListKey() {
	        return _KEYS.developerListSubstore;
	    }
	    Keys.getDeveloperListKey = getDeveloperListKey;
	    // infra related
	    function getInfraProviderKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.infraProviderSubstore.concat(accKeyHex);
	    }
	    Keys.getInfraProviderKey = getInfraProviderKey;
	    function getInfraProviderListKey() {
	        return _KEYS.infraProviderListSubstore;
	    }
	    Keys.getInfraProviderListKey = getInfraProviderListKey;
	    // account related
	    function getAccountInfoKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.accountInfoSubstore.concat(accKeyHex);
	    }
	    Keys.getAccountInfoKey = getAccountInfoKey;
	    function getAccountBankKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.accountBankSubstore.concat(accKeyHex);
	    }
	    Keys.getAccountBankKey = getAccountBankKey;
	    function getAccountMetaKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.accountMetaSubstore.concat(accKeyHex);
	    }
	    Keys.getAccountMetaKey = getAccountMetaKey;
	    function getFollowerPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.accountFollowerSubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getFollowerPrefix = getFollowerPrefix;
	    function getFollowingPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.accountFollowingSubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getFollowingPrefix = getFollowingPrefix;
	    function getFollowerKey(me, myFollower) {
	        const myFollowerHex = bytebuffer.fromUTF8(myFollower).toHex();
	        return getFollowerPrefix(me).concat(myFollowerHex);
	    }
	    Keys.getFollowerKey = getFollowerKey;
	    function getFollowingKey(me, myFollowing) {
	        const myFollowingHex = bytebuffer.fromUTF8(myFollowing).toHex();
	        return getFollowingPrefix(me).concat(myFollowingHex);
	    }
	    Keys.getFollowingKey = getFollowingKey;
	    function getRewardKey(accKey) {
	        const accKeyHex = bytebuffer.fromUTF8(accKey).toHex();
	        return _KEYS.accountRewardSubstore.concat(accKeyHex);
	    }
	    Keys.getRewardKey = getRewardKey;
	    function getRewardHistoryPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.accountRewardHistorySubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getRewardHistoryPrefix = getRewardHistoryPrefix;
	    function getRewardHistoryKey(me, bucketSlot) {
	        const bucketSlotHex = bytebuffer.fromUTF8(bucketSlot).toHex();
	        return getRewardHistoryPrefix(me).concat(bucketSlotHex);
	    }
	    Keys.getRewardHistoryKey = getRewardHistoryKey;
	    function getRelationshipPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.accountRelationshipSubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getRelationshipPrefix = getRelationshipPrefix;
	    function getRelationshipKey(me, other) {
	        const otherHex = bytebuffer.fromUTF8(other).toHex();
	        return getRelationshipPrefix(me).concat(otherHex);
	    }
	    Keys.getRelationshipKey = getRelationshipKey;
	    function getBalanceHistoryPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.accountBalanceHistorySubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getBalanceHistoryPrefix = getBalanceHistoryPrefix;
	    function getBalanceHistoryKey(me, bucketSlot) {
	        const bucketSlotHex = bytebuffer.fromUTF8(bucketSlot).toHex();
	        return getBalanceHistoryPrefix(me).concat(bucketSlotHex);
	    }
	    Keys.getBalanceHistoryKey = getBalanceHistoryKey;
	    function getGrantPubKeyPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.accountGrantPubKeySubstore.concat(meHex).concat(_KEYS.sep);
	    }
	    Keys.getGrantPubKeyPrefix = getGrantPubKeyPrefix;
	    // TODO: should the pubKey be string or crypto.PubKey?
	    function getgrantPubKeyKey(me, pubKey) {
	        const pubKeyHex = bytebuffer.fromUTF8(pubKey).toHex();
	        return getGrantPubKeyPrefix(me).concat(pubKeyHex);
	    }
	    Keys.getgrantPubKeyKey = getgrantPubKeyKey;
	    // post related
	    function getPermlink(author, postID) {
	        return author.concat('#').concat(postID);
	    }
	    Keys.getPermlink = getPermlink;
	    function getPostInfoPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.postInfoSubStore.concat(meHex);
	    }
	    Keys.getPostInfoPrefix = getPostInfoPrefix;
	    function getPostInfoKey(permlink) {
	        const permlinkHex = bytebuffer.fromUTF8(permlink).toHex();
	        return _KEYS.postInfoSubStore.concat(permlinkHex);
	    }
	    Keys.getPostInfoKey = getPostInfoKey;
	    function getPostMetaPrefix(me) {
	        const meHex = bytebuffer.fromUTF8(me).toHex();
	        return _KEYS.postMetaSubStore.concat(meHex);
	    }
	    Keys.getPostMetaPrefix = getPostMetaPrefix;
	    function getPostMetaKey(permlink) {
	        const permlinkHex = bytebuffer.fromUTF8(permlink).toHex();
	        return _KEYS.postMetaSubStore.concat(permlinkHex);
	    }
	    Keys.getPostMetaKey = getPostMetaKey;
	    function getPostReportOrUpvotePrefix(permlink) {
	        const permlinkHex = bytebuffer.fromUTF8(permlink).toHex();
	        return _KEYS.postReportOrUpvoteSubStore.concat(permlinkHex).concat(_KEYS.sep);
	    }
	    Keys.getPostReportOrUpvotePrefix = getPostReportOrUpvotePrefix;
	    function getPostReportOrUpvoteKey(permlink, user) {
	        const userHex = bytebuffer.fromUTF8(user).toHex();
	        return getPostReportOrUpvotePrefix(permlink).concat(userHex);
	    }
	    Keys.getPostReportOrUpvoteKey = getPostReportOrUpvoteKey;
	    function getPostViewPrefix(permlink) {
	        const permlinkHex = bytebuffer.fromUTF8(permlink).toHex();
	        return _KEYS.postViewsSubStore.concat(permlinkHex).concat(_KEYS.sep);
	    }
	    Keys.getPostViewPrefix = getPostViewPrefix;
	    function getPostViewKey(permlink, viewUser) {
	        const viewUserHex = bytebuffer.fromUTF8(viewUser).toHex();
	        return getPostViewPrefix(permlink).concat(viewUserHex);
	    }
	    Keys.getPostViewKey = getPostViewKey;
	    function getPostCommentPrefix(permlink) {
	        const permlinkHex = bytebuffer.fromUTF8(permlink).toHex();
	        return _KEYS.postCommentSubStore.concat(permlinkHex).concat(_KEYS.sep);
	    }
	    Keys.getPostCommentPrefix = getPostCommentPrefix;
	    function getPostCommentKey(permlink, commentPermlink) {
	        const commentPermlinkHex = bytebuffer.fromUTF8(commentPermlink).toHex();
	        return getPostCommentPrefix(permlink).concat(commentPermlinkHex);
	    }
	    Keys.getPostCommentKey = getPostCommentKey;
	    function getPostDonationsPrefix(permlink) {
	        const permlinkHex = bytebuffer.fromUTF8(permlink).toHex();
	        return _KEYS.postDonationsSubStore.concat(permlinkHex).concat(_KEYS.sep);
	    }
	    Keys.getPostDonationsPrefix = getPostDonationsPrefix;
	    function getPostDonationsKey(permlink, donateUser) {
	        const donateUserHex = bytebuffer.fromUTF8(donateUser).toHex();
	        return getPostDonationsPrefix(permlink).concat(donateUserHex);
	    }
	    Keys.getPostDonationsKey = getPostDonationsKey;
	    // proposal related
	    function getProposalKey(proposalID) {
	        const proposalIDHex = bytebuffer.fromUTF8(proposalID).toHex();
	        return _KEYS.proposalSubstore.concat(proposalIDHex);
	    }
	    Keys.getProposalKey = getProposalKey;
	    function getProposalListKey() {
	        return _KEYS.proposalListSubStore;
	    }
	    Keys.getProposalListKey = getProposalListKey;
	    function getNextProposalIDKey() {
	        return _KEYS.nextProposalIDSubstore;
	    }
	    Keys.getNextProposalIDKey = getNextProposalIDKey;
	    // param related
	    function getEvaluateOfContentValueParamKey() {
	        return _KEYS.evaluateOfContentValueParamSubStore;
	    }
	    Keys.getEvaluateOfContentValueParamKey = getEvaluateOfContentValueParamKey;
	    function getGlobalAllocationParamKey() {
	        return _KEYS.allocationParamSubStore;
	    }
	    Keys.getGlobalAllocationParamKey = getGlobalAllocationParamKey;
	    function getInfraInternalAllocationParamKey() {
	        return _KEYS.infraInternalAllocationParamSubStore;
	    }
	    Keys.getInfraInternalAllocationParamKey = getInfraInternalAllocationParamKey;
	    function getDeveloperParamKey() {
	        return _KEYS.developerParamSubStore;
	    }
	    Keys.getDeveloperParamKey = getDeveloperParamKey;
	    function getVoteParamKey() {
	        return _KEYS.voteParamSubStore;
	    }
	    Keys.getVoteParamKey = getVoteParamKey;
	    function getValidatorParamKey() {
	        return _KEYS.validatorParamSubStore;
	    }
	    Keys.getValidatorParamKey = getValidatorParamKey;
	    function getProposalParamKey() {
	        return _KEYS.proposalParamSubStore;
	    }
	    Keys.getProposalParamKey = getProposalParamKey;
	    function getCoinDayParamKey() {
	        return _KEYS.coinDayParamSubStore;
	    }
	    Keys.getCoinDayParamKey = getCoinDayParamKey;
	    function getBandwidthParamKey() {
	        return _KEYS.bandwidthParamSubStore;
	    }
	    Keys.getBandwidthParamKey = getBandwidthParamKey;
	    function getAccountParamKey() {
	        return _KEYS.accountParamSubstore;
	    }
	    Keys.getAccountParamKey = getAccountParamKey;
	    function getPostParamKey() {
	        return _KEYS.postParamSubStore;
	    }
	    Keys.getPostParamKey = getPostParamKey;
	    function getGlobalMetaKey() {
	        return _KEYS.globalMetaSubStore;
	    }
	    Keys.getGlobalMetaKey = getGlobalMetaKey;
	    function getInflationPoolKey() {
	        return _KEYS.inflationPoolSubStore;
	    }
	    Keys.getInflationPoolKey = getInflationPoolKey;
	    function getConsumptionMetaKey() {
	        return _KEYS.consumptionMetaSubStore;
	    }
	    Keys.getConsumptionMetaKey = getConsumptionMetaKey;
	    function getTimeEventKey(time) {
	        return _KEYS.timeEventListSubStore.concat(time);
	    }
	    Keys.getTimeEventKey = getTimeEventKey;
	    function getTimeEventPrefix() {
	        return _KEYS.timeEventListSubStore;
	    }
	    Keys.getTimeEventPrefix = getTimeEventPrefix;
	    function getTPSKey() {
	        return _KEYS.tpsSubStore;
	    }
	    Keys.getTPSKey = getTPSKey;
	})(Keys || (Keys = {}));
	var Keys$1 = Keys;

	class Transport {
	    constructor(opt) {
	        this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
	        this._chainId = opt.chainId || 'test-chain-z0QKeL';
	    }
	    query(key, storeName) {
	        // transport: get path and key for ABCIQuery and return result
	        // get transport's node and do ABCIQuery
	        // rpc client do rpc call
	        // check resp
	        const path = `/store/${storeName}/key`;
	        return this._rpc.abciQuery(path, key).then(result => {
	            if (!result.response || !result.response.value) {
	                throw new Error('Query failed: Empty result');
	            }
	            const jsonStr = bytebuffer.atob(result.response.value);
	            return decodeObject(JSON.parse(jsonStr));
	        });
	    }
	    querySubspace(subspace, storeName, getKeyBy) {
	        // transport: get path and key for ABCIQuery and return result
	        // get transport's node and do ABCIQuery
	        // rpc client do rpc call
	        // check resp
	        const path = `/store/${storeName}/subspace-js`;
	        return this._rpc.abciQuery(path, subspace).then(result => {
	            if (!result.response || !result.response.value) {
	                throw new Error('QuerySubspace failed: Empty result');
	            }
	            const resValStr = bytebuffer.atob(result.response.value);
	            let resKVs = JSON.parse(resValStr);
	            let rst = [];
	            if (resKVs === null) {
	                return rst;
	            }
	            for (let i = 0; i < resKVs.length; i++) {
	                const rawKey = bytebuffer.atob(resKVs[i].key);
	                let keyStr = '';
	                switch (getKeyBy) {
	                    case exports.GetKeyBy.GetHexSubstringAfterKeySeparator: {
	                        keyStr = Keys$1.getHexSubstringAfterKeySeparator(rawKey);
	                        break;
	                    }
	                    case exports.GetKeyBy.GetSubstringAfterKeySeparator: {
	                        keyStr = Keys$1.getSubstringAfterKeySeparator(rawKey);
	                        break;
	                    }
	                    default: {
	                        keyStr = rawKey;
	                    }
	                }
	                const jsonValueStr = bytebuffer.atob(resKVs[i].value);
	                let value = JSON.parse(jsonValueStr);
	                let item = { key: keyStr, value: decodeObject(value) };
	                rst.push(item);
	            }
	            return rst;
	        });
	    }
	    block(height) {
	        return this._rpc.block(height).then(result => {
	            return result;
	        });
	    }
	    // Does the private key decoding from hex, sign message,
	    // build transaction to broadcast
	    signBuildBroadcast(msg, msgType, privKeyHex, seq) {
	        // private key from hex
	        var ec$$1 = new elliptic_2('secp256k1');
	        var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
	        // XXX: side effect on msg
	        convertMsg(msg);
	        const stdMsg = {
	            type: msgType,
	            value: encodeMsg(msg)
	        };
	        // signmsg
	        var msgs = new Array(stdMsg);
	        const signMsgHash = encodeSignMsg(msgs, this._chainId, seq);
	        // sign to get signature
	        const sig = key.sign(signMsgHash, { canonical: true });
	        const sigDERHex = sig.toDER('hex');
	        // build tx
	        const tx = encodeTx(msgs, key.getPublic(true, 'hex'), sigDERHex, seq);
	        // return broadcast
	        return this._rpc.broadcastTxCommit(tx).then(result => {
	            if (result.check_tx.code !== undefined) {
	                throw new BroadcastError(exports.BroadCastErrorEnum.CheckTx, result.check_tx.log, result.check_tx.code);
	            }
	            else if (result.deliver_tx.code !== undefined) {
	                throw new BroadcastError(exports.BroadCastErrorEnum.DeliverTx, result.deliver_tx.log, result.deliver_tx.code);
	            }
	            return result;
	        });
	    }
	}
	(function (BroadCastErrorEnum) {
	    BroadCastErrorEnum[BroadCastErrorEnum["CheckTx"] = 0] = "CheckTx";
	    BroadCastErrorEnum[BroadCastErrorEnum["DeliverTx"] = 1] = "DeliverTx";
	})(exports.BroadCastErrorEnum || (exports.BroadCastErrorEnum = {}));
	(function (GetKeyBy) {
	    GetKeyBy[GetKeyBy["GetSubstringAfterKeySeparator"] = 0] = "GetSubstringAfterKeySeparator";
	    GetKeyBy[GetKeyBy["GetHexSubstringAfterKeySeparator"] = 1] = "GetHexSubstringAfterKeySeparator";
	    GetKeyBy[GetKeyBy["GetSubstringAfterSubstore"] = 2] = "GetSubstringAfterSubstore";
	})(exports.GetKeyBy || (exports.GetKeyBy = {}));
	// How to extend Error in TS2.1+:
	// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
	class BroadcastError extends Error {
	    constructor(type, log, code) {
	        super(log);
	        Object.setPrototypeOf(this, BroadcastError.prototype);
	        this.type = type;
	        this.code = code;
	    }
	}

	function genPrivKeyHex() {
	    const ec$$1 = new elliptic_2('secp256k1');
	    const rawKey = ec$$1.genKeyPair().getPrivate('hex');
	    return encodePrivKey(rawKey);
	}
	function pubKeyFromPrivate(privKeyHex) {
	    var ec$$1 = new elliptic_2('secp256k1');
	    var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
	    const rawKey = key.getPublic(true, 'hex');
	    return encodePubKey(rawKey);
	}
	function isValidUsername(username) {
	    const reg = /^[a-z0-9]([a-z0-9_]){2,20}$/;
	    const match = reg.exec(username);
	    return match != null;
	}
	function isKeyMatch(privKeyHex, pubKeyHex) {
	    const ec$$1 = new elliptic_2('secp256k1');
	    var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
	    return key.getPublic(true, 'hex').toUpperCase() == decodePubKey(pubKeyHex);
	}
	// deterministically generates new priv-key bytes from provided key.
	function derivePrivKey(privKeyHex) {
	    const ec$$1 = new elliptic_2('secp256k1');
	    const keyHash = sha_js('sha256')
	        .update(privKeyHex)
	        .digest();
	    var key = ec$$1.genKeyPair({ entropy: keyHash });
	    return encodePrivKey(key.getPrivate('hex'));
	}
	// Sign msg
	function signWithSha256(msg, privKeyHex) {
	    // private key from hex
	    var ec$$1 = new elliptic_2('secp256k1');
	    var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
	    const signByte = sha_js('sha256')
	        .update(msg)
	        .digest();
	    // sign to get signature
	    const sig = key.sign(signByte, { canonical: true });
	    return sig.toDER('hex');
	}
	// Sign msg
	function verifyWithSha256(msg, pubKeyHex, signature) {
	    // private key from hex
	    var ec$$1 = new elliptic_2('secp256k1');
	    var key = ec$$1.keyFromPublic(decodePubKey(pubKeyHex), 'hex');
	    // signmsg
	    const signByte = sha_js('sha256')
	        .update(msg)
	        .digest();
	    // sign to get signaturegit stat
	    const res = key.verify(signByte, signature);
	    return res;
	}

	var index = /*#__PURE__*/Object.freeze({
		genPrivKeyHex: genPrivKeyHex,
		pubKeyFromPrivate: pubKeyFromPrivate,
		isValidUsername: isValidUsername,
		isKeyMatch: isKeyMatch,
		derivePrivKey: derivePrivKey,
		signWithSha256: signWithSha256,
		verifyWithSha256: verifyWithSha256
	});

	class Query {
	    constructor(transport) {
	        this._transport = transport;
	    }
	    /**
	     * doesUsernameMatchResetPrivKey returns true if a user has the reset private key.
	     *
	     * @param username
	     * @param resetPrivKeyHex
	     */
	    doesUsernameMatchResetPrivKey(username, resetPrivKeyHex) {
	        return this.getAccountInfo(username).then(info => {
	            if (info == null) {
	                return false;
	            }
	            return isKeyMatch(resetPrivKeyHex, info.reset_key);
	        });
	    }
	    /**
	     * doesUsernameMatchTxPrivKey returns true if a user has the transaction private key.
	     *
	     * @param username
	     * @param txPrivKeyHex
	     */
	    doesUsernameMatchTxPrivKey(username, txPrivKeyHex) {
	        return this.getAccountInfo(username).then(info => {
	            if (info == null) {
	                return false;
	            }
	            return isKeyMatch(txPrivKeyHex, info.transaction_key);
	        });
	    }
	    /**
	     * doesUsernameMatchAppPrivKey returns true if a user has the app private key.
	     *
	     * @param username
	     * @param appPrivKeyHex
	     */
	    doesUsernameMatchAppPrivKey(username, appPrivKeyHex) {
	        return this.getAccountInfo(username).then(info => {
	            if (info == null) {
	                return false;
	            }
	            return isKeyMatch(appPrivKeyHex, info.app_key);
	        });
	    }
	    // validator related query
	    /**
	     * getAllValidators returns all oncall validators from blockchain.
	     */
	    getAllValidators() {
	        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
	        return this._transport.query(Keys$1.getValidatorListKey(), ValidatorKVStoreKey);
	    }
	    /**
	     * getValidator returns validator info given a validator name from blockchain.
	     *
	     * @param username: the validator username
	     */
	    getValidator(username) {
	        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
	        return this._transport.query(Keys$1.getValidatorKey(username), ValidatorKVStoreKey);
	    }
	    // account related query
	    /**
	     * getSeqNumber returns the next sequence number of a user which should
	     * be used for broadcast.
	     *
	     * @param username
	     */
	    getSeqNumber(username) {
	        return this.getAccountMeta(username).then(meta => {
	            return +meta.sequence;
	        });
	    }
	    /**
	     * getAllBalanceHistory returns all transaction history related to
	     * a user's account balance, in reverse-chronological order.
	     *
	     * @param username
	     */
	    getAllBalanceHistory(username) {
	        return this.getAccountBank(username).then(bank => {
	            let res = { details: [] };
	            if (Number(bank.number_of_transaction) == 0) {
	                return res;
	            }
	            let numberOfbundle = (Number(bank.number_of_transaction) - 1) / 100;
	            let promises = [];
	            for (var i = 0; i <= numberOfbundle; ++i) {
	                promises.push(this.getBalanceHistoryBundle(username, i));
	            }
	            return Promise.all(promises).then(bundles => {
	                bundles.reduce((prev, curr) => {
	                    prev.details.push(...curr.details);
	                    return prev;
	                }, res);
	                res.details.reverse();
	                return res;
	            });
	        });
	    }
	    /**
	     * getBalanceHistoryBundle returns all balance history in a certain bucket.
	     *
	     * @param username
	     * @param index
	     */
	    getBalanceHistoryBundle(username, index) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getBalanceHistoryKey(username, index.toString()), AccountKVStoreKey);
	    }
	    /**
	     * getAccountMeta returns account meta info for a specific user.
	     *
	     * @param username
	     */
	    getAccountMeta(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getAccountMetaKey(username), AccountKVStoreKey);
	    }
	    /**
	     * getAccountBank returns account bank info for a specific user.
	     *
	     * @param username
	     */
	    getAccountBank(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getAccountBankKey(username), AccountKVStoreKey);
	    }
	    /**
	     * getAccountInfo returns account info for a specific user.
	     *
	     * @param username
	     */
	    getAccountInfo(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport
	            .query(Keys$1.getAccountInfoKey(username), AccountKVStoreKey)
	            .then(info => {
	            const res = {
	                username: info.username,
	                created_at: info.created_at,
	                reset_key: encodePubKey(convertToRawPubKey(info.reset_key)),
	                transaction_key: encodePubKey(convertToRawPubKey(info.transaction_key)),
	                app_key: encodePubKey(convertToRawPubKey(info.app_key))
	            };
	            return res;
	        });
	    }
	    /**
	     * getGrantPubKey returns the specific granted pubkey info of a user
	     * that has given to the pubKey.
	     *
	     * @param username
	     * @param pubKeyHex
	     */
	    getGrantPubKey(username, pubKeyHex) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        const publicKey = decodePubKey(pubKeyHex);
	        return this._transport.query(Keys$1.getgrantPubKeyKey(username, publicKey), AccountKVStoreKey);
	    }
	    /**
	     * getAllGrantPubKeys returns a list of all granted public keys of a user.
	     *
	     * @param username
	     */
	    getAllGrantPubKeys(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getGrantPubKeyPrefix(username), AccountKVStoreKey, exports.GetKeyBy.GetHexSubstringAfterKeySeparator);
	    }
	    /**
	     * getReward returns rewards of a user.
	     *
	     * @param username
	     */
	    getReward(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getRewardKey(username), AccountKVStoreKey);
	    }
	    /**
	     * getAllRewardHistory returns all reward history related to
	     * a user's posts reward, in reverse-chronological order.
	     *
	     * @param username
	     */
	    getAllRewardHistory(username) {
	        return this.getAccountBank(username).then(bank => {
	            let res = { details: [] };
	            if (Number(bank.number_of_reward) == 0) {
	                return res;
	            }
	            let numberOfbundle = (Number(bank.number_of_reward) - 1) / 100;
	            let promises = [];
	            for (var i = 0; i <= numberOfbundle; ++i) {
	                promises.push(this.getRewardHistoryBundle(username, i));
	            }
	            return Promise.all(promises).then(bundles => {
	                bundles.reduce((prev, curr) => {
	                    prev.details.push(...curr.details);
	                    return prev;
	                }, res);
	                res.details.reverse();
	                return res;
	            });
	        });
	    }
	    /**
	     * getRewardHistoryBundle returns all reward history in a certain bucket.
	     *
	     * @param username
	     * @param index
	     */
	    getRewardHistoryBundle(username, index) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getRewardHistoryKey(username, index.toString()), AccountKVStoreKey);
	    }
	    /**
	     * getRelationship returns the donation times of two users.
	     *
	     * @param me
	     * @param other
	     */
	    getRelationship(me, other) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getRelationshipKey(me, other), AccountKVStoreKey);
	    }
	    /**
	     * getAllRelationships returns all donation relationship of a user.
	     *
	     * @param username
	     */
	    getAllRelationships(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getRelationshipPrefix(username), AccountKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getFollowerMeta returns the follower meta of two users.
	     *
	     * @param me
	     * @param myFollower
	     */
	    getFollowerMeta(me, myFollower) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getFollowerKey(me, myFollower), AccountKVStoreKey);
	    }
	    /**
	     * getAllFollowerMeta returns all follower meta of a user.
	     *
	     * @param username
	     */
	    getAllFollowerMeta(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getFollowerPrefix(username), AccountKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getFollowingMeta returns the following meta of two users.
	     *
	     * @param me
	     * @param myFollowing
	     */
	    getFollowingMeta(me, myFollowing) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.query(Keys$1.getFollowingKey(me, myFollowing), AccountKVStoreKey);
	    }
	    /**
	     * getAllFollowingMeta returns all following meta of a user.
	     *
	     * @param username
	     */
	    getAllFollowingMeta(username) {
	        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getFollowingPrefix(username), AccountKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    // post related query
	    /**
	     * getAllPosts returns all posts the author created.
	     *
	     * @param author
	     */
	    getAllPosts(author) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getPostInfoPrefix(author), PostKVStoreKey, exports.GetKeyBy.GetSubstringAfterSubstore);
	    }
	    /**
	     * getPostComment returns a specific comment of a post given the post permlink
	     * and comment permlink.
	     *
	     * @param author
	     * @param postID
	     * @param commentPermlink
	     */
	    getPostComment(author, postID, commentPermlink) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.query(Keys$1.getPostCommentKey(Permlink, commentPermlink), PostKVStoreKey);
	    }
	    /**
	     * getPostAllComments returns all comments that a post has.
	     *
	     * @param author
	     * @param postID
	     */
	    getPostAllComments(author, postID) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.querySubspace(Keys$1.getPostCommentPrefix(Permlink), PostKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getPostView returns a view of a post performed by a user.
	     *
	     * @param author
	     * @param postID
	     * @param viewUser
	     */
	    getPostView(author, postID, viewUser) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.query(Keys$1.getPostViewKey(Permlink, viewUser), PostKVStoreKey);
	    }
	    /**
	     * getPostAllViews returns all views that a post has.
	     *
	     * @param author
	     * @param postID
	     */
	    getPostAllViews(author, postID) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.querySubspace(Keys$1.getPostViewPrefix(Permlink), PostKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getPostDonations returns all donations that a user has given to a post.
	     *
	     * @param author
	     * @param postID
	     * @param donateUser
	     */
	    getPostDonations(author, postID, donateUser) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.query(Keys$1.getPostDonationsKey(Permlink, donateUser), PostKVStoreKey);
	    }
	    /**
	     * getPostAllDonations returns all donations that a post has received.
	     *
	     * @param author
	     * @param postID
	     */
	    getPostAllDonations(author, postID) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.querySubspace(Keys$1.getPostDonationsPrefix(Permlink), PostKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getPostReportOrUpvote returns report or upvote that a user has given to a post.
	     *
	     * @param author
	     * @param postID
	     * @param user
	     */
	    getPostReportOrUpvote(author, postID, user) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.query(Keys$1.getPostReportOrUpvoteKey(Permlink, user), PostKVStoreKey);
	    }
	    /**
	     * getPostAllReportOrUpvotes returns all reports or upvotes that a post has received.
	     *
	     * @param author
	     * @param postID
	     */
	    getPostAllReportOrUpvotes(author, postID) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.querySubspace(Keys$1.getPostReportOrUpvotePrefix(Permlink), PostKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getPostInfo returns post info given a permlink(author#postID).
	     *
	     * @param author
	     * @param postID
	     */
	    getPostInfo(author, postID) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.query(Keys$1.getPostInfoKey(Permlink), PostKVStoreKey);
	    }
	    /**
	     * getPostMeta returns post meta given a permlink.
	     *
	     * @param author
	     * @param postID
	     */
	    getPostMeta(author, postID) {
	        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
	        const Permlink = Keys$1.getPermlink(author, postID);
	        return this._transport.query(Keys$1.getPostMetaKey(Permlink), PostKVStoreKey);
	    }
	    // vote related query
	    /**
	     * GetDelegation returns the delegation relationship between
	     * a voter and a delegator from blockchain.
	     *
	     * @param voter
	     * @param delegator
	     */
	    getDelegation(voter, delegator) {
	        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
	        return this._transport
	            .query(Keys$1.getDelegationKey(voter, delegator), VoteKVStoreKey)
	            .then(result => {
	            return result;
	        });
	    }
	    /**
	     * getVoterAllDelegation returns all delegations that are delegated to a voter.
	     *
	     * @param voter
	     */
	    getVoterAllDelegation(voter) {
	        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getDelegationPrefix(voter), VoteKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
	     *
	     * @param delegatorName
	     */
	    getDelegatorAllDelegation(delegatorName) {
	        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getDelegateePrefix(delegatorName), VoteKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    /**
	     * getVoter returns voter info given a voter name from blockchain.
	     *
	     * @param voterName
	     */
	    getVoter(voterName) {
	        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
	        return this._transport.query(Keys$1.getVoterKey(voterName), VoteKVStoreKey);
	    }
	    /**
	     * getVote returns a vote performed by a voter for a given proposal.
	     *
	     * @param proposalID
	     * @param voter
	     */
	    getVote(proposalID, voter) {
	        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
	        return this._transport.query(Keys$1.getVoteKey(proposalID, voter), VoteKVStoreKey);
	    }
	    /**
	     * getProposalAllVotes returns all votes of a given proposal.
	     *
	     * @param proposalID
	     */
	    getProposalAllVotes(proposalID) {
	        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getVotePrefix(proposalID), VoteKVStoreKey, exports.GetKeyBy.GetSubstringAfterKeySeparator);
	    }
	    // developer related query
	    /**
	     * getDeveloper returns a specific developer info from blockchain
	     *
	     * @param developerName
	     */
	    getDeveloper(developerName) {
	        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
	        return this._transport.query(Keys$1.getDeveloperKey(developerName), DeveloperKVStoreKey);
	    }
	    /**
	     * getDevelopers returns a list of develop.
	     */
	    getDevelopers() {
	        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getDeveloperPrefix(), DeveloperKVStoreKey, exports.GetKeyBy.GetSubstringAfterSubstore);
	    }
	    /**
	     * getDeveloperList returns a list of developer name.
	     */
	    getDeveloperList() {
	        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
	        return this._transport.query(Keys$1.getDeveloperListKey(), DeveloperKVStoreKey);
	    }
	    // infra related query
	    /**
	     * getInfraProvider returns the infra provider info such as usage.
	     *
	     * @param providerName
	     */
	    getInfraProvider(providerName) {
	        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
	        return this._transport.query(Keys$1.getInfraProviderKey(providerName), InfraKVStoreKey);
	    }
	    /**
	     * getInfraProviders returns a list of all infra providers.
	     */
	    getInfraProviders() {
	        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
	        return this._transport.query(Keys$1.getInfraProviderListKey(), InfraKVStoreKey);
	    }
	    // proposal related query
	    /**
	     * GetProposalList returns a list of all proposals, including onging
	     * proposals and past ones.
	     */
	    getProposalList() {
	        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
	        return this._transport.query(Keys$1.getProposalListKey(), ProposalKVStoreKey);
	    }
	    /**
	     * getProposal returns proposal info of a specific proposalID.
	     *
	     * @param proposalID
	     */
	    getProposal(proposalID) {
	        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
	        return this._transport.query(Keys$1.getProposalKey(proposalID), ProposalKVStoreKey);
	    }
	    /**
	     * getOngoingProposal returns all ongoing proposals.
	     */
	    getOngoingProposal() {
	        return this.getProposalList().then(list => {
	            return Promise.all((list.ongoing_proposal || []).map(p => this.getProposal(p)));
	        });
	    }
	    /**
	     * getExpiredProposal returns all past proposals.
	     */
	    getExpiredProposal() {
	        return this.getProposalList().then(list => Promise.all((list.past_proposal || []).map(p => this.getProposal(p))));
	    }
	    /**
	     * getNextProposalID returns the next proposal id
	     */
	    getNextProposalID() {
	        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
	        return this._transport.query(Keys$1.getNextProposalIDKey(), ProposalKVStoreKey);
	    }
	    // param related query
	    /**
	     * getEvaluateOfContentValueParam returns the EvaluateOfContentValueParam.
	     */
	    getEvaluateOfContentValueParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getEvaluateOfContentValueParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getGlobalAllocationParam returns the GlobalAllocationParam.
	     */
	    getGlobalAllocationParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getGlobalAllocationParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getInfraInternalAllocationParam returns the InfraInternalAllocationParam.
	     */
	    getInfraInternalAllocationParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getInfraInternalAllocationParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getDeveloperParam returns the DeveloperParam.
	     */
	    getDeveloperParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getDeveloperParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getVoteParam returns the VoteParam.
	     */
	    getVoteParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getVoteParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getProposalParam returns the ProposalParam.
	     */
	    getProposalParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getProposalParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getValidatorParam returns the ValidatorParam.
	     */
	    getValidatorParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getValidatorParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getCoinDayParam returns the CoinDayParam.
	     */
	    getCoinDayParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getCoinDayParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getBandwidthParam returns the BandwidthParam.
	     */
	    getBandwidthParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getBandwidthParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getAccountParam returns the AccountParam.
	     */
	    getAccountParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getAccountParamKey(), ParamKVStoreKey);
	    }
	    /**
	     * getGlobalMeta returns the GlobalMeta.
	     */
	    getGlobalMeta() {
	        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
	        return this._transport.query(Keys$1.getGlobalMetaKey(), GlobalKVStoreKey);
	    }
	    /**
	     * getAccountParam returns the AccountParam.
	     */
	    getConsumptionMeta() {
	        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
	        return this._transport.query(Keys$1.getConsumptionMetaKey(), GlobalKVStoreKey);
	    }
	    /**
	     * getAccountParam returns the AccountParam.
	     */
	    getEventAtTime(time) {
	        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
	        return this._transport.query(Keys$1.getTimeEventKey(time), GlobalKVStoreKey);
	    }
	    /**
	     * getAccountParam returns the AccountParam.
	     */
	    getAllEventAtAllTime() {
	        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getTimeEventPrefix(), GlobalKVStoreKey, exports.GetKeyBy.GetSubstringAfterSubstore);
	    }
	    /**
	     * getAccountParam returns the AccountParam.
	     */
	    getAllEventAtAllTimeAtCertainHeight(height) {
	        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
	        return this._transport.querySubspace(Keys$1.getTimeEventPrefix(), GlobalKVStoreKey, exports.GetKeyBy.GetSubstringAfterSubstore);
	    }
	    /**
	     * getPostParam returns the PostParam.
	     */
	    getPostParam() {
	        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
	        return this._transport.query(Keys$1.getPostParamKey(), ParamKVStoreKey);
	    }
	    // block related
	    /**
	     * getBlock returns a block at a certain height from blockchain.
	     *
	     * @param height
	     */
	    getBlock(height) {
	        return this._transport.block(height);
	    }
	    /**
	     * getTxsInBlock returns all transactions in a block at a certain height from blockchain.
	     * @param height
	     */
	    getTxsInBlock(height) {
	        return this._transport
	            .block(height)
	            .then(v => v && v.block && v.block.data && v.block.data.txs
	            ? v.block.data.txs.map(tx => JSON.parse(bytebuffer.atob(tx)))
	            : []);
	    }
	    /**
	     * getBalanceHistoryFromTo returns a list of transaction history in the range of [from, to],
	     * that if to is larger than the number of tx, tx will be replaced by the larget tx number,
	     * related to a user's account balance, in reverse-chronological order.
	     *
	     * @param username: user name
	     * @param from: the start index of the balance history, inclusively
	     * @param to: the end index of the balance history, inclusively
	     */
	    getBalanceHistoryFromTo(username, from, to) {
	        return __awaiter(this, void 0, void 0, function* () {
	            if (!this.isValidNat(from) || !this.isValidNat(to) || from > to) {
	                throw new Error(`GetBalanceHistoryFromTo: from [${from}] or to [${to}] is invalid`);
	            }
	            let accountBank = yield this.getAccountBank(username);
	            let rst = { details: [] };
	            if (Number(accountBank.number_of_transaction) == 0) {
	                return rst;
	            }
	            let maxTxIndex = Number(accountBank.number_of_transaction) - 1;
	            if (from > maxTxIndex) {
	                throw new Error(`GetBalanceHistoryFromTo: [${from}] is larger than total num of tx`);
	            }
	            if (to > maxTxIndex) {
	                to = maxTxIndex;
	            }
	            // number of banlance history is wanted
	            let numHistory = to - from + 1;
	            let targetBucketOfTo = Math.floor(to / 100);
	            let bucketSlot = targetBucketOfTo;
	            // The index of 'to' in the target bucket
	            let indexOfTo = to % 100;
	            while (bucketSlot >= 0 && numHistory > 0) {
	                let history = yield this.getBalanceHistoryBundle(username, bucketSlot);
	                let startIndex = bucketSlot == targetBucketOfTo ? indexOfTo : history.details.length - 1;
	                for (let i = startIndex; i >= 0 && numHistory > 0; i--) {
	                    rst.details.push(history.details[i]);
	                    numHistory--;
	                }
	                bucketSlot--;
	            }
	            return rst;
	        });
	    }
	    /**
	     * getRecentBalanceHistory returns a certain number of recent transaction history
	     * related to a user's account balance, in reverse-chronological order.
	     *
	     * @param username: user name
	     * @param numHistory: the number of balance history are wanted
	     */
	    getRecentBalanceHistory(username, numHistory) {
	        return __awaiter(this, void 0, void 0, function* () {
	            if (!this.isValidNat(numHistory)) {
	                throw new Error(`GetRecentBalanceHistory: numHistory is invalid: ${numHistory}`);
	            }
	            let accountBank = yield this.getAccountBank(username);
	            let maxTxNo = Number(accountBank.number_of_transaction) - 1;
	            let from = Math.max(0, maxTxNo - numHistory + 1);
	            if (numHistory > Number(accountBank.number_of_transaction)) {
	                from = 0;
	            }
	            return this.getBalanceHistoryFromTo(username, from, maxTxNo);
	        });
	    }
	    /**
	     * getRewardHistoryFromTo returns a list of reward history in the range of [from, to],
	     * that if to is larger than the number of tx, tx will be replaced by the largest tx number,
	     * related to a user's posts rewards, in reverse-chronological order.
	     *
	     * @param username: user name
	     * @param from: the start index of the reward history, inclusively
	     * @param to: the end index of the reward history, inclusively
	     */
	    getRewardHistoryFromTo(username, from, to) {
	        return __awaiter(this, void 0, void 0, function* () {
	            if (!this.isValidNat(from) || !this.isValidNat(to) || from > to) {
	                throw new Error(`getRewardHistoryFromTo: from [${from}] or to [${to}] is invalid`);
	            }
	            let accountBank = yield this.getAccountBank(username);
	            let rst = { details: [] };
	            if (Number(accountBank.number_of_reward) == 0) {
	                return rst;
	            }
	            let maxRewardIndex = Number(accountBank.number_of_reward) - 1;
	            if (from > maxRewardIndex) {
	                throw new Error(`getRewardHistoryFromTo: [${from}] is larger than total num of reward`);
	            }
	            if (to > maxRewardIndex) {
	                to = maxRewardIndex;
	            }
	            // number of reward history is wanted
	            let numReward = to - from + 1;
	            let targetBucketOfTo = Math.floor(to / 100);
	            let bucketSlot = targetBucketOfTo;
	            // The index of 'to' in the target bucket
	            let indexOfTo = to % 100;
	            while (bucketSlot >= 0 && numReward > 0) {
	                let history = yield this.getRewardHistoryBundle(username, bucketSlot);
	                let startIndex = bucketSlot == targetBucketOfTo ? indexOfTo : history.details.length - 1;
	                for (let i = startIndex; i >= 0 && numReward > 0; i--) {
	                    rst.details.push(history.details[i]);
	                    numReward--;
	                }
	                bucketSlot--;
	            }
	            return rst;
	        });
	    }
	    /**
	     * getRecentRewardHistory returns a certain number of recent reward history
	     * related to a user's posts reward, in reverse-chronological order.
	     *
	     * @param username: user name
	     * @param numReward: the number of reward history are wanted
	     */
	    getRecentRewardHistory(username, numReward) {
	        return __awaiter(this, void 0, void 0, function* () {
	            if (!this.isValidNat(numReward)) {
	                throw new Error(`getRecentRewardHistory: numReward is invalid: ${numReward}`);
	            }
	            let accountBank = yield this.getAccountBank(username);
	            let maxTxNo = Number(accountBank.number_of_reward) - 1;
	            let from = Math.max(0, maxTxNo - numReward + 1);
	            if (numReward > Number(accountBank.number_of_reward)) {
	                from = 0;
	            }
	            return this.getRewardHistoryFromTo(username, from, maxTxNo);
	        });
	    }
	    // @return false negative or larger than safe int.
	    isValidNat(num) {
	        // XXX(yumin): js's MAX_SAFE_INTEGER is less than 2^64.
	        // TODO(yumin): use bigint to support large seq number.
	        if (num < 0 || num > Number.MAX_SAFE_INTEGER) {
	            return false;
	        }
	        return true;
	    }
	}
	function isChangeParamProposalValue(value) {
	    return 'param' in value && 'reason' in value;
	}
	function isContentCensorshipProposalValue(value) {
	    return 'permLink' in value && 'reason' in value;
	}
	function isProtocolUpgradeProposalValue(value) {
	    return 'link' in value && 'reason' in value;
	}

	class LINO {
	    constructor(opt) {
	        this._options = opt;
	        this._transport = new Transport(opt);
	        this._query = new Query(this._transport);
	        this._broadcast = new Broadcast(this._transport);
	    }
	    get query() {
	        return this._query;
	    }
	    get broadcast() {
	        return this._broadcast;
	    }
	}

	function isEvaluateOfContentValueParam(param) {
	    return ('consumption_time_adjust_base' in param &&
	        'consumption_time_adjust_offset' in param &&
	        'num_of_consumption_on_author_offset' in param &&
	        'total_amount_of_consumption_base' in param &&
	        'total_amount_of_consumption_offset' in param &&
	        'amount_of_consumption_exponent' in param);
	}
	function isGlobalAllocationParam(param) {
	    return ('infra_allocation' in param &&
	        'content_creator_allocation' in param &&
	        'developer_allocation' in param &&
	        'validator_allocation' in param);
	}
	function isInfraInternalAllocationParam(param) {
	    return 'storage_allocation' in param && 'CDN_allocation' in param;
	}
	function isVoteParam(param) {
	    return ('voter_min_deposit' in param &&
	        'voter_min_withdraw' in param &&
	        'delegator_min_withdraw' in param &&
	        'voter_coin_return_interval' in param &&
	        'voter_coin_return_times' in param &&
	        'delegator_coin_return_interval' in param &&
	        'delegator_coin_return_times' in param);
	}
	function isProposalParam(param) {
	    return ('content_censorship_decide_hr' in param &&
	        'content_censorship_min_deposit' in param &&
	        'content_censorship_pass_ratio' in param &&
	        'content_censorship_pass_votes' in param &&
	        'change_param_decide_hr' in param &&
	        'change_param_min_deposit' in param &&
	        'change_param_pass_ratio' in param &&
	        'change_param_pass_votes' in param &&
	        'protocol_upgrade_decide_hr' in param &&
	        'protocol_upgrade_min_deposit' in param &&
	        'protocol_upgrade_pass_ratio' in param &&
	        'protocol_upgrade_pass_votes' in param);
	}
	function isDeveloperParam(param) {
	    return ('developer_min_deposit' in param &&
	        'developer_coin_return_interval' in param &&
	        'developer_coin_return_times' in param);
	}
	function isValidatorParam(param) {
	    return ('validator_min_withdraw' in param &&
	        'validator_min_voting_deposit' in param &&
	        'validator_min_commiting_deposit' in param &&
	        'validator_coin_return_interval' in param &&
	        'validator_coin_return_times' in param &&
	        'penalty_miss_vote' in param &&
	        'penalty_miss_commit' in param &&
	        'penalty_byzantine' in param &&
	        'validator_list_size' in param &&
	        'absent_commit_limitation' in param);
	}
	function isCoinDayParam(param) {
	    return 'days_to_recover_coin_day_stake' in param && 'seconds_to_recover_coin_day_stake' in param;
	}
	function isBandwidthParam(param) {
	    return 'seconds_to_recover_bandwidth' in param && 'capacity_usage_per_transaction' in param;
	}
	function isAccountParam(param) {
	    return ('minimum_balance' in param &&
	        'register_fee' in param &&
	        'first_deposit_full_stake_limit' in param);
	}
	function isPostParam(param) {
	    return 'report_or_upvote_interval' in param;
	}
	(function (DETAILTYPE) {
	    // Different possible incomes
	    DETAILTYPE["TransferIn"] = "0";
	    DETAILTYPE["DonationIn"] = "1";
	    DETAILTYPE["ClaimReward"] = "2";
	    DETAILTYPE["ValidatorInflation"] = "3";
	    DETAILTYPE["DeveloperInflation"] = "4";
	    DETAILTYPE["InfraInflation"] = "5";
	    DETAILTYPE["VoteReturnCoin"] = "6";
	    DETAILTYPE["DelegationReturnCoin"] = "7";
	    DETAILTYPE["ValidatorReturnCoin"] = "8";
	    DETAILTYPE["DeveloperReturnCoin"] = "9";
	    DETAILTYPE["InfraReturnCoin"] = "10";
	    DETAILTYPE["ProposalReturnCoin"] = "11";
	    DETAILTYPE["GenesisCoin"] = "12";
	    // Different possible outcomes
	    DETAILTYPE["TransferOut"] = "13";
	    DETAILTYPE["DonationOut"] = "14";
	    DETAILTYPE["Delegate"] = "15";
	    DETAILTYPE["VoterDeposit"] = "16";
	    DETAILTYPE["ValidatorDeposit"] = "17";
	    DETAILTYPE["DeveloperDeposit"] = "18";
	    DETAILTYPE["InfraDeposit"] = "19";
	    DETAILTYPE["ProposalDeposit"] = "20";
	})(exports.DETAILTYPE || (exports.DETAILTYPE = {}));
	(function (PERMISSION_TYPE) {
	    // Different possible incomes
	    // Different permission level for msg
	    PERMISSION_TYPE["UnknownPermission"] = "0";
	    PERMISSION_TYPE["AppPermission"] = "1";
	    PERMISSION_TYPE["TransactionPermission"] = "2";
	    PERMISSION_TYPE["ResetPermission"] = "3";
	    PERMISSION_TYPE["GrantAppPermissio"] = "4";
	    PERMISSION_TYPE["PreAuthorizationPermission"] = "5";
	})(exports.PERMISSION_TYPE || (exports.PERMISSION_TYPE = {}));

	exports.LINO = LINO;
	exports.UTILS = index;
	exports.isEvaluateOfContentValueParam = isEvaluateOfContentValueParam;
	exports.isGlobalAllocationParam = isGlobalAllocationParam;
	exports.isInfraInternalAllocationParam = isInfraInternalAllocationParam;
	exports.isVoteParam = isVoteParam;
	exports.isProposalParam = isProposalParam;
	exports.isDeveloperParam = isDeveloperParam;
	exports.isValidatorParam = isValidatorParam;
	exports.isCoinDayParam = isCoinDayParam;
	exports.isBandwidthParam = isBandwidthParam;
	exports.isAccountParam = isAccountParam;
	exports.isPostParam = isPostParam;
	exports.isChangeParamProposalValue = isChangeParamProposalValue;
	exports.isContentCensorshipProposalValue = isContentCensorshipProposalValue;
	exports.isProtocolUpgradeProposalValue = isProtocolUpgradeProposalValue;
	exports.Transport = Transport;
	exports.BroadcastError = BroadcastError;
	exports.genPrivKeyHex = genPrivKeyHex;
	exports.pubKeyFromPrivate = pubKeyFromPrivate;
	exports.isValidUsername = isValidUsername;
	exports.isKeyMatch = isKeyMatch;
	exports.derivePrivKey = derivePrivKey;
	exports.signWithSha256 = signWithSha256;
	exports.verifyWithSha256 = verifyWithSha256;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lino-js.umd.js.map

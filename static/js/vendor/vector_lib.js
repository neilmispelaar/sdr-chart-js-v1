var vector_lib = (function () {
    'use strict';
  
    var _fails = function (exec) {
      try {
        return !!exec();
      } catch (e) {
        return true;
      }
    };
  
    // Thank's IE8 for his funny defineProperty
    var _descriptors = !_fails(function () {
      return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
    });
  
    var _isObject = function (it) {
      return typeof it === 'object' ? it !== null : typeof it === 'function';
    };
  
    var _anObject = function (it) {
      if (!_isObject(it)) throw TypeError(it + ' is not an object!');
      return it;
    };
  
    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }
  
    var _global = createCommonjsModule(function (module) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = module.exports = typeof window != 'undefined' && window.Math == Math
      ? window : typeof self != 'undefined' && self.Math == Math ? self
      // eslint-disable-next-line no-new-func
      : Function('return this')();
    if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
    });
  
    var document = _global.document;
    // typeof document.createElement is 'object' in old IE
    var is = _isObject(document) && _isObject(document.createElement);
    var _domCreate = function (it) {
      return is ? document.createElement(it) : {};
    };
  
    var _ie8DomDefine = !_descriptors && !_fails(function () {
      return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
    });
  
    // 7.1.1 ToPrimitive(input [, PreferredType])
  
    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string
    var _toPrimitive = function (it, S) {
      if (!_isObject(it)) return it;
      var fn, val;
      if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
      if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
      if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
      throw TypeError("Can't convert object to primitive value");
    };
  
    var dP = Object.defineProperty;
  
    var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
      _anObject(O);
      P = _toPrimitive(P, true);
      _anObject(Attributes);
      if (_ie8DomDefine) try {
        return dP(O, P, Attributes);
      } catch (e) { /* empty */ }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };
  
    var _objectDp = {
        f: f
    };
  
    // 21.2.5.3 get RegExp.prototype.flags
  
    var _flags = function () {
      var that = _anObject(this);
      var result = '';
      if (that.global) result += 'g';
      if (that.ignoreCase) result += 'i';
      if (that.multiline) result += 'm';
      if (that.unicode) result += 'u';
      if (that.sticky) result += 'y';
      return result;
    };
  
    // 21.2.5.3 get RegExp.prototype.flags()
    if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
      configurable: true,
      get: _flags
    });
  
    var _propertyDesc = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };
  
    var _hide = _descriptors ? function (object, key, value) {
      return _objectDp.f(object, key, _propertyDesc(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };
  
    var hasOwnProperty = {}.hasOwnProperty;
    var _has = function (it, key) {
      return hasOwnProperty.call(it, key);
    };
  
    var id = 0;
    var px = Math.random();
    var _uid = function (key) {
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };
  
    var _core = createCommonjsModule(function (module) {
    var core = module.exports = { version: '2.6.4' };
    if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
    });
    var _core_1 = _core.version;
  
    var _library = false;
  
    var _shared = createCommonjsModule(function (module) {
    var SHARED = '__core-js_shared__';
    var store = _global[SHARED] || (_global[SHARED] = {});
  
    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: _core.version,
      mode: _library ? 'pure' : 'global',
      copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
    });
    });
  
    var _functionToString = _shared('native-function-to-string', Function.toString);
  
    var _redefine = createCommonjsModule(function (module) {
    var SRC = _uid('src');
  
    var TO_STRING = 'toString';
    var TPL = ('' + _functionToString).split(TO_STRING);
  
    _core.inspectSource = function (it) {
      return _functionToString.call(it);
    };
  
    (module.exports = function (O, key, val, safe) {
      var isFunction = typeof val == 'function';
      if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
      if (O[key] === val) return;
      if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
      if (O === _global) {
        O[key] = val;
      } else if (!safe) {
        delete O[key];
        _hide(O, key, val);
      } else if (O[key]) {
        O[key] = val;
      } else {
        _hide(O, key, val);
      }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, TO_STRING, function toString() {
      return typeof this == 'function' && this[SRC] || _functionToString.call(this);
    });
    });
  
    var TO_STRING = 'toString';
    var $toString = /./[TO_STRING];
  
    var define = function (fn) {
      _redefine(RegExp.prototype, TO_STRING, fn, true);
    };
  
    // 21.2.5.14 RegExp.prototype.toString()
    if (_fails(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
      define(function toString() {
        var R = _anObject(this);
        return '/'.concat(R.source, '/',
          'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
      });
    // FF44- RegExp#toString has a wrong name
    } else if ($toString.name != TO_STRING) {
      define(function toString() {
        return $toString.call(this);
      });
    }
  
    var DateProto = Date.prototype;
    var INVALID_DATE = 'Invalid Date';
    var TO_STRING$1 = 'toString';
    var $toString$1 = DateProto[TO_STRING$1];
    var getTime = DateProto.getTime;
    if (new Date(NaN) + '' != INVALID_DATE) {
      _redefine(DateProto, TO_STRING$1, function toString() {
        var value = getTime.call(this);
        // eslint-disable-next-line no-self-compare
        return value === value ? $toString$1.call(this) : INVALID_DATE;
      });
    }
  
    var _aFunction = function (it) {
      if (typeof it != 'function') throw TypeError(it + ' is not a function!');
      return it;
    };
  
    // optional / simple context binding
  
    var _ctx = function (fn, that, length) {
      _aFunction(fn);
      if (that === undefined) return fn;
      switch (length) {
        case 1: return function (a) {
          return fn.call(that, a);
        };
        case 2: return function (a, b) {
          return fn.call(that, a, b);
        };
        case 3: return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
      }
      return function (/* ...args */) {
        return fn.apply(that, arguments);
      };
    };
  
    var PROTOTYPE = 'prototype';
  
    var $export = function (type, name, source) {
      var IS_FORCED = type & $export.F;
      var IS_GLOBAL = type & $export.G;
      var IS_STATIC = type & $export.S;
      var IS_PROTO = type & $export.P;
      var IS_BIND = type & $export.B;
      var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
      var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
      var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
      var key, own, out, exp;
      if (IS_GLOBAL) source = name;
      for (key in source) {
        // contains in native
        own = !IS_FORCED && target && target[key] !== undefined;
        // export native or passed
        out = (own ? target : source)[key];
        // bind timers to global for call from export context
        exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
        // extend global
        if (target) _redefine(target, key, out, type & $export.U);
        // export
        if (exports[key] != out) _hide(exports, key, exp);
        if (IS_PROTO && expProto[key] != out) expProto[key] = out;
      }
    };
    _global.core = _core;
    // type bitmap
    $export.F = 1;   // forced
    $export.G = 2;   // global
    $export.S = 4;   // static
    $export.P = 8;   // proto
    $export.B = 16;  // bind
    $export.W = 32;  // wrap
    $export.U = 64;  // safe
    $export.R = 128; // real proto method for `library`
    var _export = $export;
  
    // 7.1.4 ToInteger
    var ceil = Math.ceil;
    var floor = Math.floor;
    var _toInteger = function (it) {
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };
  
    // 7.1.15 ToLength
  
    var min = Math.min;
    var _toLength = function (it) {
      return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
    };
  
    // 7.2.1 RequireObjectCoercible(argument)
    var _defined = function (it) {
      if (it == undefined) throw TypeError("Can't call method on  " + it);
      return it;
    };
  
    var _stringRepeat = function repeat(count) {
      var str = String(_defined(this));
      var res = '';
      var n = _toInteger(count);
      if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
      for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
      return res;
    };
  
    // https://github.com/tc39/proposal-string-pad-start-end
  
  
  
  
    var _stringPad = function (that, maxLength, fillString, left) {
      var S = String(_defined(that));
      var stringLength = S.length;
      var fillStr = fillString === undefined ? ' ' : String(fillString);
      var intMaxLength = _toLength(maxLength);
      if (intMaxLength <= stringLength || fillStr == '') return S;
      var fillLen = intMaxLength - stringLength;
      var stringFiller = _stringRepeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
      if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
      return left ? stringFiller + S : S + stringFiller;
    };
  
    var navigator = _global.navigator;
  
    var _userAgent = navigator && navigator.userAgent || '';
  
    // https://github.com/tc39/proposal-string-pad-start-end
  
  
  
  
    // https://github.com/zloirock/core-js/issues/280
    _export(_export.P + _export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(_userAgent), 'String', {
      padStart: function padStart(maxLength /* , fillString = ' ' */) {
        return _stringPad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
      }
    });
  
    var toString = {}.toString;
  
    var _cof = function (it) {
      return toString.call(it).slice(8, -1);
    };
  
    var _wks = createCommonjsModule(function (module) {
    var store = _shared('wks');
  
    var Symbol = _global.Symbol;
    var USE_SYMBOL = typeof Symbol == 'function';
  
    var $exports = module.exports = function (name) {
      return store[name] || (store[name] =
        USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
    };
  
    $exports.store = store;
    });
  
    // 7.2.8 IsRegExp(argument)
  
  
    var MATCH = _wks('match');
    var _isRegexp = function (it) {
      var isRegExp;
      return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
    };
  
    // 7.3.20 SpeciesConstructor(O, defaultConstructor)
  
  
    var SPECIES = _wks('species');
    var _speciesConstructor = function (O, D) {
      var C = _anObject(O).constructor;
      var S;
      return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
    };
  
    // true  -> String#at
    // false -> String#codePointAt
    var _stringAt = function (TO_STRING) {
      return function (that, pos) {
        var s = String(_defined(that));
        var i = _toInteger(pos);
        var l = s.length;
        var a, b;
        if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
        a = s.charCodeAt(i);
        return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
          ? TO_STRING ? s.charAt(i) : a
          : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
      };
    };
  
    var at = _stringAt(true);
  
     // `AdvanceStringIndex` abstract operation
    // https://tc39.github.io/ecma262/#sec-advancestringindex
    var _advanceStringIndex = function (S, index, unicode) {
      return index + (unicode ? at(S, index).length : 1);
    };
  
    // getting tag from 19.1.3.6 Object.prototype.toString()
  
    var TAG = _wks('toStringTag');
    // ES3 wrong here
    var ARG = _cof(function () { return arguments; }()) == 'Arguments';
  
    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key];
      } catch (e) { /* empty */ }
    };
  
    var _classof = function (it) {
      var O, T, B;
      return it === undefined ? 'Undefined' : it === null ? 'Null'
        // @@toStringTag case
        : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
        // builtinTag case
        : ARG ? _cof(O)
        // ES3 arguments fallback
        : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };
  
    var builtinExec = RegExp.prototype.exec;
  
     // `RegExpExec` abstract operation
    // https://tc39.github.io/ecma262/#sec-regexpexec
    var _regexpExecAbstract = function (R, S) {
      var exec = R.exec;
      if (typeof exec === 'function') {
        var result = exec.call(R, S);
        if (typeof result !== 'object') {
          throw new TypeError('RegExp exec method returned something other than an Object or null');
        }
        return result;
      }
      if (_classof(R) !== 'RegExp') {
        throw new TypeError('RegExp#exec called on incompatible receiver');
      }
      return builtinExec.call(R, S);
    };
  
    var nativeExec = RegExp.prototype.exec;
    // This always refers to the native implementation, because the
    // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
    // which loads this file before patching the method.
    var nativeReplace = String.prototype.replace;
  
    var patchedExec = nativeExec;
  
    var LAST_INDEX = 'lastIndex';
  
    var UPDATES_LAST_INDEX_WRONG = (function () {
      var re1 = /a/,
          re2 = /b*/g;
      nativeExec.call(re1, 'a');
      nativeExec.call(re2, 'a');
      return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
    })();
  
    // nonparticipating capturing group, copied from es5-shim's String#split patch.
    var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
  
    var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;
  
    if (PATCH) {
      patchedExec = function exec(str) {
        var re = this;
        var lastIndex, reCopy, match, i;
  
        if (NPCG_INCLUDED) {
          reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
  
        match = nativeExec.call(re, str);
  
        if (UPDATES_LAST_INDEX_WRONG && match) {
          re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
          // Fix browsers whose `exec` methods don't consistently return `undefined`
          // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
          // eslint-disable-next-line no-loop-func
          nativeReplace.call(match[0], reCopy, function () {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
        }
  
        return match;
      };
    }
  
    var _regexpExec = patchedExec;
  
    _export({
      target: 'RegExp',
      proto: true,
      forced: _regexpExec !== /./.exec
    }, {
      exec: _regexpExec
    });
  
    var SPECIES$1 = _wks('species');
  
    var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
      // #replace needs built-in support for named groups.
      // #match works fine because it just return the exec results, even if it has
      // a "grops" property.
      var re = /./;
      re.exec = function () {
        var result = [];
        result.groups = { a: '7' };
        return result;
      };
      return ''.replace(re, '$<a>') !== '7';
    });
  
    var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
      // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
      var re = /(?:)/;
      var originalExec = re.exec;
      re.exec = function () { return originalExec.apply(this, arguments); };
      var result = 'ab'.split(re);
      return result.length === 2 && result[0] === 'a' && result[1] === 'b';
    })();
  
    var _fixReWks = function (KEY, length, exec) {
      var SYMBOL = _wks(KEY);
  
      var DELEGATES_TO_SYMBOL = !_fails(function () {
        // String methods call symbol-named RegEp methods
        var O = {};
        O[SYMBOL] = function () { return 7; };
        return ''[KEY](O) != 7;
      });
  
      var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;
        re.exec = function () { execCalled = true; return null; };
        if (KEY === 'split') {
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$1] = function () { return re; };
        }
        re[SYMBOL]('');
        return !execCalled;
      }) : undefined;
  
      if (
        !DELEGATES_TO_SYMBOL ||
        !DELEGATES_TO_EXEC ||
        (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
        (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
      ) {
        var nativeRegExpMethod = /./[SYMBOL];
        var fns = exec(
          _defined,
          SYMBOL,
          ''[KEY],
          function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
            if (regexp.exec === _regexpExec) {
              if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                // The native String method already delegates to @@method (this
                // polyfilled function), leasing to infinite recursion.
                // We avoid it by directly calling the native @@method method.
                return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
              }
              return { done: true, value: nativeMethod.call(str, regexp, arg2) };
            }
            return { done: false };
          }
        );
        var strfn = fns[0];
        var rxfn = fns[1];
  
        _redefine(String.prototype, KEY, strfn);
        _hide(RegExp.prototype, SYMBOL, length == 2
          // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
          // 21.2.5.11 RegExp.prototype[@@split](string, limit)
          ? function (string, arg) { return rxfn.call(string, this, arg); }
          // 21.2.5.6 RegExp.prototype[@@match](string)
          // 21.2.5.9 RegExp.prototype[@@search](string)
          : function (string) { return rxfn.call(string, this); }
        );
      }
    };
  
    var $min = Math.min;
    var $push = [].push;
    var $SPLIT = 'split';
    var LENGTH = 'length';
    var LAST_INDEX$1 = 'lastIndex';
    var MAX_UINT32 = 0xffffffff;
  
    // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
    var SUPPORTS_Y = !_fails(function () { });
  
    // @@split logic
    _fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
      var internalSplit;
      if (
        'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
        'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
        'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
        '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
        '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
        ''[$SPLIT](/.?/)[LENGTH]
      ) {
        // based on es5-shim implementation, need to rework it
        internalSplit = function (separator, limit) {
          var string = String(this);
          if (separator === undefined && limit === 0) return [];
          // If `separator` is not a regex, use native split
          if (!_isRegexp(separator)) return $split.call(string, separator, limit);
          var output = [];
          var flags = (separator.ignoreCase ? 'i' : '') +
                      (separator.multiline ? 'm' : '') +
                      (separator.unicode ? 'u' : '') +
                      (separator.sticky ? 'y' : '');
          var lastLastIndex = 0;
          var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
          // Make `global` and avoid `lastIndex` issues by working with a copy
          var separatorCopy = new RegExp(separator.source, flags + 'g');
          var match, lastIndex, lastLength;
          while (match = _regexpExec.call(separatorCopy, string)) {
            lastIndex = separatorCopy[LAST_INDEX$1];
            if (lastIndex > lastLastIndex) {
              output.push(string.slice(lastLastIndex, match.index));
              if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
              lastLength = match[0][LENGTH];
              lastLastIndex = lastIndex;
              if (output[LENGTH] >= splitLimit) break;
            }
            if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
          }
          if (lastLastIndex === string[LENGTH]) {
            if (lastLength || !separatorCopy.test('')) output.push('');
          } else output.push(string.slice(lastLastIndex));
          return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
        };
      // Chakra, V8
      } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
        internalSplit = function (separator, limit) {
          return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
        };
      } else {
        internalSplit = $split;
      }
  
      return [
        // `String.prototype.split` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.split
        function split(separator, limit) {
          var O = defined(this);
          var splitter = separator == undefined ? undefined : separator[SPLIT];
          return splitter !== undefined
            ? splitter.call(separator, O, limit)
            : internalSplit.call(String(O), separator, limit);
        },
        // `RegExp.prototype[@@split]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
        //
        // NOTE: This cannot be properly polyfilled in engines that don't support
        // the 'y' flag.
        function (regexp, limit) {
          var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
          if (res.done) return res.value;
  
          var rx = _anObject(regexp);
          var S = String(this);
          var C = _speciesConstructor(rx, RegExp);
  
          var unicodeMatching = rx.unicode;
          var flags = (rx.ignoreCase ? 'i' : '') +
                      (rx.multiline ? 'm' : '') +
                      (rx.unicode ? 'u' : '') +
                      (SUPPORTS_Y ? 'y' : 'g');
  
          // ^(? + rx + ) is needed, in combination with some S slicing, to
          // simulate the 'y' flag.
          var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
          var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
          var p = 0;
          var q = 0;
          var A = [];
          while (q < S.length) {
            splitter.lastIndex = SUPPORTS_Y ? q : 0;
            var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
            var e;
            if (
              z === null ||
              (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
            ) {
              q = _advanceStringIndex(S, q, unicodeMatching);
            } else {
              A.push(S.slice(p, q));
              if (A.length === lim) return A;
              for (var i = 1; i <= z.length - 1; i++) {
                A.push(z[i]);
                if (A.length === lim) return A;
              }
              q = p = e;
            }
          }
          A.push(S.slice(p));
          return A;
        }
      ];
    });
  
    // 7.1.13 ToObject(argument)
  
    var _toObject = function (it) {
      return Object(_defined(it));
    };
  
    var max = Math.max;
    var min$1 = Math.min;
    var floor$1 = Math.floor;
    var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
    var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;
  
    var maybeToString = function (it) {
      return it === undefined ? it : String(it);
    };
  
    // @@replace logic
    _fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
      return [
        // `String.prototype.replace` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.replace
        function replace(searchValue, replaceValue) {
          var O = defined(this);
          var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
          return fn !== undefined
            ? fn.call(searchValue, O, replaceValue)
            : $replace.call(String(O), searchValue, replaceValue);
        },
        // `RegExp.prototype[@@replace]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
        function (regexp, replaceValue) {
          var res = maybeCallNative($replace, regexp, this, replaceValue);
          if (res.done) return res.value;
  
          var rx = _anObject(regexp);
          var S = String(this);
          var functionalReplace = typeof replaceValue === 'function';
          if (!functionalReplace) replaceValue = String(replaceValue);
          var global = rx.global;
          if (global) {
            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
          }
          var results = [];
          while (true) {
            var result = _regexpExecAbstract(rx, S);
            if (result === null) break;
            results.push(result);
            if (!global) break;
            var matchStr = String(result[0]);
            if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
          }
          var accumulatedResult = '';
          var nextSourcePosition = 0;
          for (var i = 0; i < results.length; i++) {
            result = results[i];
            var matched = String(result[0]);
            var position = max(min$1(_toInteger(result.index), S.length), 0);
            var captures = [];
            // NOTE: This is equivalent to
            //   captures = result.slice(1).map(maybeToString)
            // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
            // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
            // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
            for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
            var namedCaptures = result.groups;
            if (functionalReplace) {
              var replacerArgs = [matched].concat(captures, position, S);
              if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
              var replacement = String(replaceValue.apply(undefined, replacerArgs));
            } else {
              replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
            }
            if (position >= nextSourcePosition) {
              accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
              nextSourcePosition = position + matched.length;
            }
          }
          return accumulatedResult + S.slice(nextSourcePosition);
        }
      ];
  
        // https://tc39.github.io/ecma262/#sec-getsubstitution
      function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
        var tailPos = position + matched.length;
        var m = captures.length;
        var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
        if (namedCaptures !== undefined) {
          namedCaptures = _toObject(namedCaptures);
          symbols = SUBSTITUTION_SYMBOLS;
        }
        return $replace.call(replacement, symbols, function (match, ch) {
          var capture;
          switch (ch.charAt(0)) {
            case '$': return '$';
            case '&': return matched;
            case '`': return str.slice(0, position);
            case "'": return str.slice(tailPos);
            case '<':
              capture = namedCaptures[ch.slice(1, -1)];
              break;
            default: // \d\d?
              var n = +ch;
              if (n === 0) return match;
              if (n > m) {
                var f = floor$1(n / 10);
                if (f === 0) return match;
                if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                return match;
              }
              capture = captures[n - 1];
          }
          return capture === undefined ? '' : capture;
        });
      }
    });
  
    // 7.2.2 IsArray(argument)
  
    var _isArray = Array.isArray || function isArray(arg) {
      return _cof(arg) == 'Array';
    };
  
    // 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
  
  
    _export(_export.S, 'Array', { isArray: _isArray });
  
    var f$1 = {}.propertyIsEnumerable;
  
    var _objectPie = {
        f: f$1
    };
  
    // fallback for non-array-like ES3 and non-enumerable old V8 strings
  
    // eslint-disable-next-line no-prototype-builtins
    var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
      return _cof(it) == 'String' ? it.split('') : Object(it);
    };
  
    // to indexed object, toObject with fallback for non-array-like ES3 strings
  
  
    var _toIobject = function (it) {
      return _iobject(_defined(it));
    };
  
    var gOPD = Object.getOwnPropertyDescriptor;
  
    var f$2 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
      O = _toIobject(O);
      P = _toPrimitive(P, true);
      if (_ie8DomDefine) try {
        return gOPD(O, P);
      } catch (e) { /* empty */ }
      if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
    };
  
    var _objectGopd = {
        f: f$2
    };
  
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    /* eslint-disable no-proto */
  
  
    var check = function (O, proto) {
      _anObject(O);
      if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
    };
    var _setProto = {
      set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
        function (test, buggy, set) {
          try {
            set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
            set(test, []);
            buggy = !(test instanceof Array);
          } catch (e) { buggy = true; }
          return function setPrototypeOf(O, proto) {
            check(O, proto);
            if (buggy) O.__proto__ = proto;
            else set(O, proto);
            return O;
          };
        }({}, false) : undefined),
      check: check
    };
  
    var setPrototypeOf = _setProto.set;
    var _inheritIfRequired = function (that, target, C) {
      var S = target.constructor;
      var P;
      if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
        setPrototypeOf(that, P);
      } return that;
    };
  
    var max$1 = Math.max;
    var min$2 = Math.min;
    var _toAbsoluteIndex = function (index, length) {
      index = _toInteger(index);
      return index < 0 ? max$1(index + length, 0) : min$2(index, length);
    };
  
    // false -> Array#indexOf
    // true  -> Array#includes
  
  
  
    var _arrayIncludes = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = _toIobject($this);
        var length = _toLength(O.length);
        var index = _toAbsoluteIndex(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare
        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare
          if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
        } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        } return !IS_INCLUDES && -1;
      };
    };
  
    var shared = _shared('keys');
  
    var _sharedKey = function (key) {
      return shared[key] || (shared[key] = _uid(key));
    };
  
    var arrayIndexOf = _arrayIncludes(false);
    var IE_PROTO = _sharedKey('IE_PROTO');
  
    var _objectKeysInternal = function (object, names) {
      var O = _toIobject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
      // Don't enum bug & hidden keys
      while (names.length > i) if (_has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
      return result;
    };
  
    // IE 8- don't enum bug keys
    var _enumBugKeys = (
      'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
    ).split(',');
  
    // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  
    var hiddenKeys = _enumBugKeys.concat('length', 'prototype');
  
    var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return _objectKeysInternal(O, hiddenKeys);
    };
  
    var _objectGopn = {
        f: f$3
    };
  
    var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
  
    var space = '[' + _stringWs + ']';
    var non = '\u200b\u0085';
    var ltrim = RegExp('^' + space + space + '*');
    var rtrim = RegExp(space + space + '*$');
  
    var exporter = function (KEY, exec, ALIAS) {
      var exp = {};
      var FORCE = _fails(function () {
        return !!_stringWs[KEY]() || non[KEY]() != non;
      });
      var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
      if (ALIAS) exp[ALIAS] = fn;
      _export(_export.P + _export.F * FORCE, 'String', exp);
    };
  
    // 1 -> String#trimLeft
    // 2 -> String#trimRight
    // 3 -> String#trim
    var trim = exporter.trim = function (string, TYPE) {
      string = String(_defined(string));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  
    var _stringTrim = exporter;
  
    // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  
  
  
    var _objectKeys = Object.keys || function keys(O) {
      return _objectKeysInternal(O, _enumBugKeys);
    };
  
    var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
      _anObject(O);
      var keys = _objectKeys(Properties);
      var length = keys.length;
      var i = 0;
      var P;
      while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
      return O;
    };
  
    var document$1 = _global.document;
    var _html = document$1 && document$1.documentElement;
  
    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  
  
  
    var IE_PROTO$1 = _sharedKey('IE_PROTO');
    var Empty = function () { /* empty */ };
    var PROTOTYPE$1 = 'prototype';
  
    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var createDict = function () {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = _domCreate('iframe');
      var i = _enumBugKeys.length;
      var lt = '<';
      var gt = '>';
      var iframeDocument;
      iframe.style.display = 'none';
      _html.appendChild(iframe);
      iframe.src = 'javascript:'; // eslint-disable-line no-script-url
      // createDict = iframe.contentWindow.Object;
      // html.removeChild(iframe);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
      iframeDocument.close();
      createDict = iframeDocument.F;
      while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
      return createDict();
    };
  
    var _objectCreate = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        Empty[PROTOTYPE$1] = _anObject(O);
        result = new Empty();
        Empty[PROTOTYPE$1] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO$1] = O;
      } else result = createDict();
      return Properties === undefined ? result : _objectDps(result, Properties);
    };
  
    var gOPN = _objectGopn.f;
    var gOPD$1 = _objectGopd.f;
    var dP$1 = _objectDp.f;
    var $trim = _stringTrim.trim;
    var NUMBER = 'Number';
    var $Number = _global[NUMBER];
    var Base = $Number;
    var proto = $Number.prototype;
    // Opera ~12 has broken Object#toString
    var BROKEN_COF = _cof(_objectCreate(proto)) == NUMBER;
    var TRIM = 'trim' in String.prototype;
  
    // 7.1.3 ToNumber(argument)
    var toNumber = function (argument) {
      var it = _toPrimitive(argument, false);
      if (typeof it == 'string' && it.length > 2) {
        it = TRIM ? it.trim() : $trim(it, 3);
        var first = it.charCodeAt(0);
        var third, radix, maxCode;
        if (first === 43 || first === 45) {
          third = it.charCodeAt(2);
          if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
        } else if (first === 48) {
          switch (it.charCodeAt(1)) {
            case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
            case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
            default: return +it;
          }
          for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
            code = digits.charCodeAt(i);
            // parseInt parses a string to a first unavailable symbol
            // but ToNumber should return NaN if a string contains unavailable symbols
            if (code < 48 || code > maxCode) return NaN;
          } return parseInt(digits, radix);
        }
      } return +it;
    };
  
    if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
      $Number = function Number(value) {
        var it = arguments.length < 1 ? 0 : value;
        var that = this;
        return that instanceof $Number
          // check on 1..constructor(foo) case
          && (BROKEN_COF ? _fails(function () { proto.valueOf.call(that); }) : _cof(that) != NUMBER)
            ? _inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
      };
      for (var keys = _descriptors ? gOPN(Base) : (
        // ES3:
        'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
        // ES6 (in case, if modules with ES6 Number statics required before):
        'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
        'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
      ).split(','), j = 0, key; keys.length > j; j++) {
        if (_has(Base, key = keys[j]) && !_has($Number, key)) {
          dP$1($Number, key, gOPD$1(Base, key));
        }
      }
      $Number.prototype = proto;
      proto.constructor = $Number;
      _redefine(_global, NUMBER, $Number);
    }
  
    var _arrayReduce = function (that, callbackfn, aLen, memo, isRight) {
      _aFunction(callbackfn);
      var O = _toObject(that);
      var self = _iobject(O);
      var length = _toLength(O.length);
      var index = isRight ? length - 1 : 0;
      var i = isRight ? -1 : 1;
      if (aLen < 2) for (;;) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }
        index += i;
        if (isRight ? index < 0 : length <= index) {
          throw TypeError('Reduce of empty array with no initial value');
        }
      }
      for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
        memo = callbackfn(memo, self[index], index, O);
      }
      return memo;
    };
  
    var _strictMethod = function (method, arg) {
      return !!method && _fails(function () {
        // eslint-disable-next-line no-useless-call
        arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
      });
    };
  
    _export(_export.P + _export.F * !_strictMethod([].reduce, true), 'Array', {
      // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
      reduce: function reduce(callbackfn /* , initialValue */) {
        return _arrayReduce(this, callbackfn, arguments.length, arguments[1], false);
      }
    });
  
    var SPECIES$2 = _wks('species');
  
    var _arraySpeciesConstructor = function (original) {
      var C;
      if (_isArray(original)) {
        C = original.constructor;
        // cross-realm fallback
        if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
        if (_isObject(C)) {
          C = C[SPECIES$2];
          if (C === null) C = undefined;
        }
      } return C === undefined ? Array : C;
    };
  
    // 9.4.2.3 ArraySpeciesCreate(originalArray, length)
  
  
    var _arraySpeciesCreate = function (original, length) {
      return new (_arraySpeciesConstructor(original))(length);
    };
  
    // 0 -> Array#forEach
    // 1 -> Array#map
    // 2 -> Array#filter
    // 3 -> Array#some
    // 4 -> Array#every
    // 5 -> Array#find
    // 6 -> Array#findIndex
  
  
  
  
  
    var _arrayMethods = function (TYPE, $create) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      var create = $create || _arraySpeciesCreate;
      return function ($this, callbackfn, that) {
        var O = _toObject($this);
        var self = _iobject(O);
        var f = _ctx(callbackfn, that, 3);
        var length = _toLength(self.length);
        var index = 0;
        var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
        var val, res;
        for (;length > index; index++) if (NO_HOLES || index in self) {
          val = self[index];
          res = f(val, index, O);
          if (TYPE) {
            if (IS_MAP) result[index] = res;   // map
            else if (res) switch (TYPE) {
              case 3: return true;             // some
              case 5: return val;              // find
              case 6: return index;            // findIndex
              case 2: result.push(val);        // filter
            } else if (IS_EVERY) return false; // every
          }
        }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
      };
    };
  
    var $filter = _arrayMethods(2);
  
    _export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
      // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
      filter: function filter(callbackfn /* , thisArg */) {
        return $filter(this, callbackfn, arguments[1]);
      }
    });
  
    var Vector = function Vector(data) {
      this.vectorType = true;
      this.data = data === undefined ? [] : formatData(data);
      this.length = data === undefined ? 0 : data.length;
  
      this.get = function (index) {
        return this.data[index];
      };
  
      this.refper = function (index) {
        return this.data[index].refper;
      };
  
      this.refperStr = function (index) {
        return datestring(this.refper(index));
      };
  
      this.value = function (index) {
        return this.data[index].value;
      };
  
      this.push = function (datapoint) {
        this.data.push(formatPoint(datapoint));
        this.length++;
      };
  
      this.equals = function (other, index) {
        var pointEquals = function pointEquals(a, b) {
          return a.refper.getTime() == b.refper.getTime() && a.value == b.value;
        };
  
        if (index !== undefined) {
          return pointEquals(this.get(index), other.get(index));
        }
  
        if (this.length != other.length) {
          return false;
        }
  
        for (var p = 0; p < this.length; p++) {
          if (!pointEquals(this.get(p), other.get(p))) return false;
        }
  
        return true;
      };
  
      this.copy = function () {
        var copy = new Vector();
  
        for (var p = 0; p < this.length; p++) {
          var copyPoint = {
            'refper': this.refper(p),
            'value': this.value(p)
          };
          safeMerge(copyPoint, this.get(p));
          copy.push(copyPoint);
        }
  
        return copy;
      };
  
      this.filter = function (predicate) {
        var result = new Vector();
  
        for (var p = 0; p < this.length; p++) {
          if (predicate(this.get(p))) result.push(this.get(p));
        }
  
        return result;
      };
  
      this.range = function (startDate, endDate) {
        startDate = formatDateObject(startDate);
        endDate = formatDateObject(endDate);
  
        var rangeFilter = function rangeFilter(point) {
          return point.refper >= startDate && point.refper <= endDate;
        };
  
        return this.filter(rangeFilter);
      };
  
      this.latestN = function (n) {
        if (n > this.length) throw new Error("N > length of vector.");
        var result = new Vector();
  
        for (var p = this.length - n; p < this.length; p++) {
          result.push(this.get(p));
        }
  
        return result;
      };
  
      this.interoperable = function (other) {
        if (this.length != other.length) return false;
  
        for (var p = 0; p < this.length; p++) {
          if (this.refper(p).getTime() != other.refper(p).getTime()) {
            return false;
          }
        }
  
        return true;
      };
  
      this.intersection = function (other) {
        var result = new Vector();
        var pThis = 0;
        var pOther = 0;
  
        while (pThis < this.length) {
          while (pOther < other.length) {
            var thisRefper = this.refper(pThis);
            var otherRefper = other.refper(pOther);
  
            if (thisRefper.getTime() == otherRefper.getTime()) {
              result.push(this.get(pThis));
              pOther++;
            } else if (thisRefper > otherRefper) {
              pOther++;
            } else {
              break;
            }
          }
  
          pThis++;
        }
  
        return result;
      };
  
      this.sum = function () {
        return this.reduce(function (accumulator, curr) {
          return accumulator + curr;
        });
      };
  
      this.average = function () {
        if (this.length == 0) return null;
        return this.sum() / this.length;
      };
  
      this.reduce = function (reducer) {
        if (this.length == 0) return null;
        var accumulator = this.value(0);
  
        for (var p = 1; p < this.length; p++) {
          accumulator = reducer(accumulator, this.value(p));
        }
  
        return accumulator;
      };
  
      this.operate = function (other, operation) {
        var a = this.intersection(other);
        var b = other.intersection(this);
        var result = new Vector();
  
        for (var p = 0; p < a.length; p++) {
          var refperA = a.refper(p);
          var refperB = b.refper(p);
          var newPoint = {
            'refper': a.refper(p),
            'value': operation(a.value(p), b.value(p))
          }; // Merge keys added by the user.
  
          safeMerge(newPoint, a.get(p));
          result.push(newPoint);
        }
  
        return result;
      };
  
      this.periodDeltaTransformation = function (operation) {
        var result = new Vector();
  
        for (var p = 0; p < this.length; p++) {
          var value = null;
  
          if (this.get(p - 1) != undefined) {
            var lastVal = this.value(p - 1);
            var currVal = this.value(p);
            value = operation(currVal, lastVal);
          }
  
          var point = {
            'refper': this.refper(p),
            'value': value
          };
          safeMerge(point, this.get(p));
          result.push(point);
        }
  
        return result;
      };
  
      this.periodTransformation = function (operation) {
        var result = new Vector();
  
        for (var p = 0; p < this.length; p++) {
          var point = this.get(p);
          var newPoint = {
            'refper': point.refper,
            'value': operation(point.value)
          };
          safeMerge(newPoint, point);
          result.push(newPoint);
        }
  
        return result;
      };
  
      this.periodToPeriodPercentageChange = function () {
        return this.periodDeltaTransformation(function (curr, last) {
          return (curr - last) / Math.abs(last) * 100;
        });
      };
  
      this.periodToPeriodDifference = function () {
        return this.periodDeltaTransformation(function (curr, last) {
          return curr - last;
        });
      };
  
      this.samePeriodPreviousYearPercentageChange = function () {
        return this.annualize().periodToPeriodPercentageChange();
      };
  
      this.samePeriodPreviousYearDifference = function () {
        return this.annualize().periodToPeriodDifference();
      };
  
      this.modes = {
        'last': function last(vector) {
          return vector.get(vector.length - 1);
        },
        'sum': function sum(vector) {
          var point = {
            'refper': vector.refper(vector.length - 1),
            'value': vector.sum()
          };
          return safeMerge(point, vector.get(vector.length - 1));
        },
        'average': function average(vector) {
          var point = {
            'refper': vector.refper(vector.length - 1),
            'value': vector.average()
          };
          return safeMerge(point, vector.get(vector.length - 1));
        }
      };
  
      this.annual = function (mode) {
        if (mode == undefined || typeof mode === 'string') {
          mode = this.modes[mode] || this.modes["last"];
        }
  
        var split = frequencySplit(this, function (last, curr) {
          return last.getYear() != curr.getYear();
        });
        var join = frequencyJoin(split, mode);
        return join.filter(function (point) {
          return point.refper.getMonth() == join.refper(0).getMonth();
        });
      };
  
      this.annualize = this.annual;
  
      this._quarterly = function (mode) {
        if (mode == undefined || typeof mode === 'string') {
          mode = this.modes[mode] || this.modes["last"];
        }
  
        var split = frequencySplit(this, function (last, curr) {
          // TODO: Is this correct.
          var lastQuarter = Math.floor(last.getMonth() / 4);
          var currQuarter = Math.floor(curr.getMonth() / 4);
          return lastQuarter != currQuarter;
        });
        return frequencyJoin(split, mode);
      };
  
      this.monthly = function (mode) {
        if (mode == undefined || typeof mode === 'string') {
          mode = this.modes[mode] || this.modes["last"];
        }
  
        var split = frequencySplit(this, function (last, curr) {
          return last.getMonth() != curr.getMonth() || last.getYear() != curr.getYear();
        });
        return frequencyJoin(split, mode);
      };
  
      function frequencyJoin(split, mode) {
        var result = new Vector();
  
        for (var i = 0; i < split.length; i++) {
          result.push(mode(split[i]));
        }
  
        return result;
      }
  
      function frequencySplit(vector, fn) {
        var result = [];
        var next = new Vector();
  
        for (var p = 0; p < vector.length; p++) {
          if (p > 0 && fn(vector.refper(p - 1), vector.refper(p))) {
            result.push(next);
            next = new Vector([vector.get(p)]);
          } else {
            next.push(vector.get(p));
          }
        }
  
        if (next.length != 0) result.push(next);
        return result;
      }
  
      this.round = function (decimals) {
        var result = new Vector();
  
        for (var p = 0; p < this.length; p++) {
          var point = this.get(p);
          var newPoint = {
            'refper': point.refper,
            'value': scalarRound(point.value, decimals)
          };
          safeMerge(newPoint, point);
          result.push(newPoint);
        }
  
        return result;
      };
  
      this.roundBankers = function (decimals) {
        var result = new Vector();
  
        for (var p = 0; p < this.length; p++) {
          var point = this.get(p);
          var newPoint = {
            'refper': point.refper,
            'value': scalarRoundBankers(point.value, decimals)
          };
          safeMerge(newPoint, point);
          result.push(newPoint);
        }
  
        return result;
      };
  
      function scalarRound(value, decimals) {
        decimals = decimals || 0;
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
      }
  
      function scalarRoundBankers(value, decimals) {
        decimals = decimals || 0;
        var x = value * Math.pow(10, decimals);
        var r = Math.round(x);
        var br = Math.abs(x) % 1 === 0.5 ? r % 2 === 0 ? r : r - 1 : r;
        return br / Math.pow(10, decimals);
      }
  
      function formatData(data) {
        for (var p = 0; p < data.length; p++) {
          formatPoint(data[p]);
        }
  
        return data;
      }
  
      function formatPoint(datapoint) {
        datapoint.refper = formatDateObject(datapoint.refper);
        return datapoint;
      }
    };
  
    var VectorLib = function VectorLib() {
      var operators = {
        '+': function _(a, b) {
          return a + b;
        },
        '-': function _(a, b) {
          return a - b;
        },
        '*': function _(a, b) {
          return a * b;
        },
        '/': function _(a, b) {
          return a / b;
        }
      };
      var operatorPriorities = {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1
      };
  
      this.formatDateObject = function (vector) {
        for (var p = 0; p < vector.length; p++) {
          vector[p].refper = formatDateObject(vector[p].refper);
        }
  
        return vector;
      };
  
      this.formatDateString = function (vector) {
        for (var p = 0; p < vector.length; p++) {
          vector[p].refper = formatDateString(vector[p].refper);
        }
  
        return vector;
      };
  
      this.intersection = function (vectors) {
        if (Array.isArray(vectors)) {
          return arrayIntersection(vectors);
        } else {
          // Handle dictionary of ID -> Vector.
          var ids = [];
          var vectorArray = [];
  
          for (var vectorId in vectors) {
            ids.push(vectorId);
            vectorArray.push(vectors[vectorId]);
          }
  
          var intersect = arrayIntersection(vectorArray);
          var result = {};
  
          for (var v = 0; v < intersect.length; v++) {
            result[ids[v]] = intersect[v];
          }
  
          return result;
        }
      };
  
      this.getVectorIds = function (expression) {
        expression = expression.replace(/ /g, '');
        var ids = [];
        var nextId = "";
  
        for (var c = 0; c < expression.length; c++) {
          if (expression[c] == 'v' && !isNaN(expression[c + 1])) {
            nextId = "v";
          } else if (nextId != "" && !isNaN(expression[c])) {
            nextId += expression[c];
          } else {
            if (nextId != "") ids.push(nextId.substring(1));
            nextId = "";
          }
        }
  
        if (nextId != "") ids.push(nextId.substring(1));
        return ids;
      };
  
      this.evaluate = function (expression, vectors) {
        // {'v1': {'refper': "2018-01-01", 'value': 1}, ...}
        expression = expression.replace(/ /g, '');
        var infix = splitSymbols(expression);
        var post = postfix(infix);
        var stack = [];
  
        for (var s = 0; s < post.length; s++) {
          var symbol = post[s];
  
          if (typeof symbol === 'string' && symbol[0] == 'v') {
            stack.push(new ExpressionNode(vectors[symbol]));
          } else if (!isNaN(symbol)) {
            stack.push(new ExpressionNode(symbol));
          } else {
            var s1 = stack.pop();
            var s2 = stack.pop();
            var node = new ExpressionNode(operators[symbol]);
            node.left = s1;
            node.right = s2;
            stack.push(node);
          }
        }
  
        return stack.pop().result();
      };
  
      var ExpressionNode = function ExpressionNode(value) {
        this.operation = null;
        this.value = null;
        this.left = null;
        this.right = null;
  
        if (value.vectorType || !isNaN(value)) {
          this.value = value;
        } else {
          this.operation = value;
        }
        /**
         * Returns a value based on the operation of this node.
        **/
  
  
        this.result = function () {
          if (this.isVector() || this.isScalar()) {
            return this.value;
          } else {
            if (this.left == null || this.right == null) {
              throw new Error('Could not evaluate operator node.');
            }
  
            return operate(this.right.result(), this.left.result(), this.operation);
          }
        };
  
        this.hasChildren = function () {
          return !(this.left == null && this.right == null);
        };
  
        this.isOperator = function () {
          return this.operation != null;
        };
  
        this.isVector = function () {
          return this.operation == null && this.value.vectorType;
        };
  
        this.isScalar = function () {
          return this.operation == null && !isNaN(this.value);
        };
      };
      /**
       * Returns a vector based on an operation 
       *
       * operation: Function to apply to vector values. 
      **/
  
  
      var operate = function operate(valueA, valueB, operation) {
        if (valueA.vectorType && valueB.vectorType) {
          return valueA.operate(valueB, operation);
        }
  
        if (valueA.vectorType && !isNaN(valueB)) {
          return vectorScalarOperate(valueA, valueB, operation);
        }
  
        if (!isNaN(valueA) && valueB.vectorType) {
          return vectorScalarOperate(valueB, valueA, operation);
        }
  
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return operation(valueA, valueB);
        }
  
        throw new Error("Unsupported types for operation.");
      };
  
      var vectorScalarOperate = function vectorScalarOperate(vector, scalar, operation) {
        var result = new Vector();
  
        for (var p = 0; p < vector.length; p++) {
          var newPoint = {
            'refper': vector.refper(p),
            'value': operation(vector.value(p), scalar)
          }; // Merge keys added by the user.
  
          safeMerge(newPoint, vector.get(p));
          result.push(newPoint);
        }
  
        return result;
      };
  
      var postfix = function postfix(symbols) {
        var stack = ['('];
        var post = [];
        symbols.push(')');
  
        for (var s = 0; s < symbols.length; s++) {
          var symbol = symbols[s];
  
          if (!isNaN(symbol)) {
            post.push(symbol);
          } else if (symbol[0] == 'v') {
            post.push(symbol);
          } else if (symbol == '(') {
            stack.push('(');
          } else if (symbol == ')') {
            while (stack[stack.length - 1] != '(') {
              post.push(stack.pop());
            }
  
            stack.pop();
          } else {
            while (priority(symbol) <= priority(stack[stack.length - 1])) {
              post.push(stack.pop());
            }
  
            stack.push(symbol);
          }
        }
  
        return post;
      };
  
      var priority = function priority(symbol) {
        if (symbol in operatorPriorities) {
          return operatorPriorities[symbol];
        }
  
        return 0;
      };
  
      var splitSymbols = function splitSymbols(vexp) {
        var split = [];
  
        for (var pos = 0; pos < vexp.length; pos++) {
          var next = null;
  
          if (vexp[pos] == 'v' || vexp[pos] == 'V') {
            next = readVector(vexp, pos);
          } else if (!isNaN(vexp[pos]) || vexp[pos] == '-' && isNaN(vexp[pos - 1]) && !isNaN(vexp[pos + 1])) {
            next = readScalar(vexp, pos);
          } else if (vexp[pos] in operators) {
            next = readOperator(vexp, pos);
          } else if (vexp[pos] == '(' || vexp[pos] == ')') {
            next = readBracket(vexp, pos);
          } else {
            throw new Error("Unrecognized symbol at position " + pos + ".");
          }
  
          split.push(next.symbol);
          pos = next.pos;
        }
  
        return split;
      };
  
      var readVector = function readVector(vexp, pos) {
        var symbol = "v";
        pos++;
  
        while (!isNaN(vexp[pos]) && pos < vexp.length) {
          symbol += vexp[pos];
          pos++;
        }
  
        return {
          'symbol': symbol,
          'pos': pos - 1
        };
      };
  
      var readOperator = function readOperator(vexp, pos) {
        return {
          'symbol': vexp[pos],
          'pos': pos
        };
      };
  
      var readScalar = function readScalar(vexp, pos) {
        var symbol = "";
        var start = pos;
  
        while ((!isNaN(vexp[pos]) || vexp[pos] == '.' || vexp[pos] == '-' && pos == start) && pos < vexp.length) {
          symbol += vexp[pos];
          pos++;
        }
  
        return {
          'symbol': Number(symbol),
          'pos': pos - 1
        };
      };
  
      var readBracket = function readBracket(vexp, pos) {
        return {
          'symbol': vexp[pos],
          'pos': pos
        };
      };
  
      this.realDate = realDate;
    }; // Merge but don't overwrite existing keys.
  
  
    function safeMerge(target, source) {
      for (var key in source) {
        if (!(key in target)) {
          target[key] = source[key];
        }
      }
  
      return target;
    }
  
    function realDate(year, month, day) {
      return new Date(year, month - 1, day);
    }
  
    function formatDateObject(date) {
      if (typeof date === 'string') return stringToDate(date);
      return date;
    }
  
    function formatDateString(date) {
      if (typeof date === 'string') return date;
      return datestring(date);
    }
  
    function stringToDate(datestring) {
      var split = datestring.split('-');
      return realDate(split[0], unpad(split[1], "0"), Number(unpad(split[2], "0")));
    }
  
    function datestring(date) {
      return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
    }
  
    function unpad(str, chr) {
      var start = 0;
  
      for (var c = 0; c < str.length; c++) {
        if (str[c] != chr) break;
        start++;
      }
  
      return str.substring(start);
    }
  
    var vector_lib = {
      'Vector': Vector,
      'VectorLib': VectorLib
    };
  
    return vector_lib;
  
  }());
  
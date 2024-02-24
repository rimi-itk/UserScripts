// ==UserScript==
// @name        Leantime keyboard shortcuts
// @namespace   https://github.com/rimi-itk/UserScripts
// @description Leantime keyboard shortcuts
// @match       https://*leantime.*/*
// @match       http://leantime.local.itkdev.dk/*
// @exclude     https://leantime.io/
// @version     0.1.1
// @author      Mikkel Ricky
// @license     MIT
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// ==/UserScript==

(async () => {
(function (web, ui) {
'use strict';

var css_248z = "";

var styles = {"keyboardShortcuts":"style-module_keyboardShortcuts__ZcRL0","table":"style-module_table__OPM9X"};
var stylesheet=".style-module_keyboardShortcuts__ZcRL0 h1,.style-module_keyboardShortcuts__ZcRL0 h2{margin:0}.style-module_table__OPM9X td:first-child{text-align:right}.style-module_table__OPM9X td:first-child kbd{color:orange}.style-module_table__OPM9X td:first-child:after{content:\" : \"}";

var w = Object.defineProperty;
var A = (a, e, t) => e in a ? w(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var r = (a, e, t) => (A(a, typeof e != "symbol" ? e + "" : e, t), t);
const R = {
  /*
  eslint-disable
    @typescript-eslint/no-empty-function,
    @typescript-eslint/no-unused-vars
  */
  addEventListener: (...a) => {
  },
  removeEventListener: (...a) => {
  },
  dispatchEvent: (...a) => {
  }
  /*
  eslint-enable
    @typescript-eslint/no-empty-function,
    @typescript-eslint/no-unused-vars
  */
}, E = {
  userAgent: ""
}, K = () => typeof document < "u" ? document : R, x = () => typeof navigator < "u" ? navigator : E, q = () => x().userAgent.toLowerCase().includes("mac");
let C = !1;
const I = (a) => {
  !q() || a.key !== "Meta" || (C = !0);
}, M = (a) => {
  !C || a.key !== "Meta" || (C = !1, k());
}, b = /* @__PURE__ */ new Map(), B = (a) => {
  b.set(a.key, a);
}, W = (a) => {
  b.delete(a.key);
}, k = () => {
  for (const a of b.values()) {
    const e = new KeyboardEvent("keyup", {
      key: a.key,
      code: a.code,
      bubbles: !0,
      cancelable: !0
    });
    K().dispatchEvent(e);
  }
  b.clear();
}, L = (a) => {
  try {
    const e = () => a();
    return addEventListener("focus", e), () => {
      removeEventListener("focus", e);
    };
  } catch {
  }
}, O = (a) => {
  try {
    const e = () => {
      k(), a();
    };
    return addEventListener("blur", e), () => removeEventListener("blur", e);
  } catch {
  }
}, z = (a) => {
  try {
    const e = (t) => {
      B(t), I(t), a({
        key: t.key,
        aliases: [`@${t.code}`],
        originalEvent: t,
        composedPath: () => t.composedPath(),
        preventDefault: () => t.preventDefault()
      });
    };
    return K().addEventListener("keydown", e), () => K().removeEventListener("keydown", e);
  } catch {
  }
}, T = (a) => {
  try {
    const e = (t) => {
      W(t), M(t), a({
        key: t.key,
        aliases: [`@${t.code}`],
        originalEvent: t,
        composedPath: () => t.composedPath(),
        preventDefault: () => t.preventDefault()
      });
    };
    return K().addEventListener("keyup", e), () => K().removeEventListener("keyup", e);
  } catch {
  }
};
class S {
  constructor(e) {
    r(this, "_onPressed");
    r(this, "_onPressedWithRepeat");
    r(this, "_onReleased");
    r(this, "_isPressed");
    r(this, "_identity");
    this._isPressed = !1, this._identity = e, typeof e == "function" ? this._onPressedWithRepeat = e : (this._onPressed = e.onPressed, this._onPressedWithRepeat = e.onPressedWithRepeat, this._onReleased = e.onReleased);
  }
  get isEmpty() {
    return !this._onPressed && !this._onPressedWithRepeat && !this._onReleased;
  }
  isOwnHandler(e) {
    return this._identity === e;
  }
  executePressed(e) {
    var t, s;
    this._isPressed || (t = this._onPressed) == null || t.call(this, e), this._isPressed = !0, (s = this._onPressedWithRepeat) == null || s.call(this, e);
  }
  executeReleased(e) {
    var t;
    this._isPressed && ((t = this._onReleased) == null || t.call(this, e)), this._isPressed = !1;
  }
}
const h = class h {
  constructor(e, t, s = {}) {
    r(this, "_normalizedKeyCombo");
    r(this, "_parsedKeyCombo");
    r(this, "_handlerState");
    r(this, "_keyComboEventMapper");
    r(this, "_movingToNextSequenceAt");
    r(this, "_sequenceIndex");
    r(this, "_unitIndex");
    r(this, "_lastActiveKeyPresses");
    r(this, "_lastActiveKeyCount");
    r(this, "_isPressedWithFinalUnit");
    this._normalizedKeyCombo = h.normalizeKeyCombo(e), this._parsedKeyCombo = h.parseKeyCombo(e), this._handlerState = new S(s), this._keyComboEventMapper = t, this._movingToNextSequenceAt = 0, this._sequenceIndex = 0, this._unitIndex = 0, this._lastActiveKeyPresses = [], this._lastActiveKeyCount = 0, this._isPressedWithFinalUnit = null;
  }
  static parseKeyCombo(e) {
    if (h._parseCache[e])
      return h._parseCache[e];
    const t = e.toLowerCase();
    let s = "", i = [], n = [i], o = [n];
    const _ = [o];
    let u = !1;
    for (let c = 0; c < e.length; c += 1)
      if (t[c] === "\\")
        u = !0;
      else if ((t[c] === "+" || t[c] === ">" || t[c] === ",") && !u) {
        if (s)
          throw new Error("cannot have two operators in a row");
        s = t[c];
      } else
        t[c].match(/[^\s]/) && (s && (s === "," ? (i = [], n = [i], o = [n], _.push(o)) : s === ">" ? (i = [], n = [i], o.push(n)) : s === "+" && (i = [], n.push(i)), s = ""), u = !1, i.push(t[c]));
    const d = _.map((c) => c.map((m) => m.map((f) => f.join(""))));
    return h._parseCache[e] = d, d;
  }
  static stringifyKeyCombo(e) {
    return e.map((t) => t.map((s) => s.map((i) => i === "+" ? "\\+" : i === ">" ? "\\>" : i === "," ? "\\," : i).join("+")).join(">")).join(",");
  }
  static normalizeKeyCombo(e) {
    if (h._normalizationCache[e])
      return h._normalizationCache[e];
    const t = this.stringifyKeyCombo(this.parseKeyCombo(e));
    return h._normalizationCache[e] = t, t;
  }
  get isPressed() {
    return !!this._isPressedWithFinalUnit;
  }
  get sequenceIndex() {
    return this.isPressed ? this._parsedKeyCombo.length : this._sequenceIndex;
  }
  isOwnHandler(e) {
    return this._handlerState.isOwnHandler(e);
  }
  executePressed(e) {
    var t, s;
    !((t = this._isPressedWithFinalUnit) != null && t.has(e.key)) && !((s = e.aliases) != null && s.some((i) => {
      var n;
      return (n = this._isPressedWithFinalUnit) == null ? void 0 : n.has(i);
    })) || this._handlerState.executePressed(this._wrapEvent(this._lastActiveKeyPresses, {
      key: e.key,
      aliases: new Set(e.aliases),
      event: e
    }));
  }
  executeReleased(e) {
    var t, s;
    !((t = this._isPressedWithFinalUnit) != null && t.has(e.key)) && !((s = e.aliases) != null && s.some((i) => {
      var n;
      return (n = this._isPressedWithFinalUnit) == null ? void 0 : n.has(i);
    })) || (this._handlerState.executeReleased(this._wrapEvent(this._lastActiveKeyPresses, {
      key: e.key,
      aliases: new Set(e.aliases),
      event: e
    })), this._isPressedWithFinalUnit = null);
  }
  updateState(e, t) {
    const s = e.length, i = s < this._lastActiveKeyCount;
    this._lastActiveKeyCount = s;
    const n = this._parsedKeyCombo[this._sequenceIndex], o = n.slice(0, this._unitIndex), _ = n.slice(this._unitIndex), u = () => {
      this._movingToNextSequenceAt = 0, this._sequenceIndex = 0, this._unitIndex = 0, this._lastActiveKeyPresses.length = 0, this._handlerState.isEmpty && (this._isPressedWithFinalUnit = null);
    };
    let d = 0;
    if (i) {
      if (this._movingToNextSequenceAt === 0)
        return u();
      if (this._movingToNextSequenceAt + t < Date.now() || s !== 0)
        return;
      this._movingToNextSequenceAt = 0, this._sequenceIndex += 1, this._unitIndex = 0;
      return;
    }
    for (const c of o) {
      for (const m of c) {
        let f = !1;
        for (let l = d; l < e.length && l < d + c.length; l += 1)
          if (e[l].key === m || e[l].aliases.has(m)) {
            f = !0;
            break;
          }
        if (!f)
          return u();
      }
      d += c.length;
    }
    if (this._movingToNextSequenceAt === 0) {
      for (const c of _) {
        for (const m of c) {
          let f = !1;
          for (let l = d; l < e.length && l < d + c.length; l += 1)
            if (e[l].key === m || e[l].aliases.has(m)) {
              f = !0;
              break;
            }
          if (!f)
            return;
        }
        this._unitIndex += 1, d += c.length;
      }
      if (d < s - 1)
        return u();
      if (this._lastActiveKeyPresses[this._sequenceIndex] = e.slice(0), this._sequenceIndex < this._parsedKeyCombo.length - 1) {
        this._movingToNextSequenceAt = Date.now();
        return;
      }
      this._isPressedWithFinalUnit = new Set(n[n.length - 1]);
    }
  }
  _wrapEvent(e, t) {
    return {
      ...this._keyComboEventMapper(e, t),
      keyCombo: this._normalizedKeyCombo,
      keyEvents: e.flat().map((i) => i.event),
      finalKeyEvent: t.event
    };
  }
};
r(h, "_parseCache", {}), r(h, "_normalizationCache", {});
let y = h;
const U = 1e3;
class P {
  constructor(e = {}) {
    r(this, "sequenceTimeout");
    r(this, "_isActive");
    r(this, "_unbinder");
    r(this, "_onActiveBinder");
    r(this, "_onInactiveBinder");
    r(this, "_onKeyPressedBinder");
    r(this, "_onKeyReleasedBinder");
    r(this, "_keyComboEventMapper");
    r(this, "_selfReleasingKeys");
    r(this, "_keyRemap");
    r(this, "_handlerStates");
    r(this, "_keyComboStates");
    r(this, "_keyComboStatesArray");
    r(this, "_activeKeyPresses");
    r(this, "_activeKeyMap");
    r(this, "_watchedKeyComboStates");
    this.sequenceTimeout = U, this._isActive = !0, this._onActiveBinder = () => {
    }, this._onInactiveBinder = () => {
    }, this._onKeyPressedBinder = () => {
    }, this._onKeyReleasedBinder = () => {
    }, this._keyComboEventMapper = () => ({}), this._selfReleasingKeys = [], this._keyRemap = {}, this._handlerStates = {}, this._keyComboStates = {}, this._keyComboStatesArray = [], this._activeKeyPresses = [], this._activeKeyMap = /* @__PURE__ */ new Map(), this._watchedKeyComboStates = {}, this.bindEnvironment(e);
  }
  get pressedKeys() {
    return this._activeKeyPresses.map((e) => e.key);
  }
  bindKey(e, t) {
    var i;
    if (typeof e == "object") {
      for (const n of e)
        this.bindKey(n, t);
      return;
    }
    e = e.toLowerCase();
    const s = new S(t);
    (i = this._handlerStates)[e] ?? (i[e] = []), this._handlerStates[e].push(s);
  }
  unbindKey(e, t) {
    if (typeof e == "object") {
      for (const i of e)
        this.unbindKey(i, t);
      return;
    }
    e = e.toLowerCase();
    const s = this._handlerStates[e];
    if (s)
      if (t)
        for (let i = 0; i < s.length; i += 1)
          s[i].isOwnHandler(t) && (s.splice(i, 1), i -= 1);
      else
        s.length = 0;
  }
  bindKeyCombo(e, t) {
    var i;
    if (typeof e == "object") {
      for (const n of e)
        this.bindKeyCombo(n, t);
      return;
    }
    e = y.normalizeKeyCombo(e);
    const s = new y(e, this._keyComboEventMapper, t);
    (i = this._keyComboStates)[e] ?? (i[e] = []), this._keyComboStates[e].push(s), this._keyComboStatesArray.push(s);
  }
  unbindKeyCombo(e, t) {
    if (typeof e == "object") {
      for (const i of e)
        this.unbindKeyCombo(i, t);
      return;
    }
    e = y.normalizeKeyCombo(e);
    const s = this._keyComboStates[e];
    if (s)
      if (t) {
        for (let i = 0; i < s.length; i += 1)
          if (s[i].isOwnHandler(t)) {
            for (let n = 0; n < this._keyComboStatesArray.length; n += 1)
              this._keyComboStatesArray[n] === s[i] && (this._keyComboStatesArray.splice(n, 1), n -= 1);
            s.splice(i, 1), i -= 1;
          }
      } else
        s.length = 0;
  }
  checkKey(e) {
    return this._activeKeyMap.has(e.toLowerCase());
  }
  checkKeyCombo(e) {
    return this._ensureCachedKeyComboState(e).isPressed;
  }
  checkKeyComboSequenceIndex(e) {
    return this._ensureCachedKeyComboState(e).sequenceIndex;
  }
  bindEnvironment(e = {}) {
    this.unbindEnvironment(), this._onActiveBinder = e.onActive ?? L, this._onInactiveBinder = e.onInactive ?? O, this._onKeyPressedBinder = e.onKeyPressed ?? z, this._onKeyReleasedBinder = e.onKeyReleased ?? T, this._keyComboEventMapper = e.mapKeyComboEvent ?? (() => ({})), this._selfReleasingKeys = e.selfReleasingKeys ?? [], this._keyRemap = e.keyRemap ?? {};
    const t = this._onActiveBinder(() => {
      this._isActive = !0;
    }), s = this._onInactiveBinder(() => {
      this._isActive = !1;
    }), i = this._onKeyPressedBinder((o) => {
      this._handleKeyPress(o);
    }), n = this._onKeyReleasedBinder((o) => {
      this._handleKeyRelease(o);
    });
    this._unbinder = () => {
      t == null || t(), s == null || s(), i == null || i(), n == null || n();
    };
  }
  unbindEnvironment() {
    var e;
    (e = this._unbinder) == null || e.call(this);
  }
  _ensureCachedKeyComboState(e) {
    e = y.normalizeKeyCombo(e), this._watchedKeyComboStates[e] || (this._watchedKeyComboStates[e] = new y(e, this._keyComboEventMapper));
    const t = this._watchedKeyComboStates[e];
    return t.updateState(this._activeKeyPresses, this.sequenceTimeout), t;
  }
  _handleKeyPress(e) {
    var n;
    if (!this._isActive)
      return;
    e = {
      ...e,
      key: e.key.toLowerCase(),
      aliases: ((n = e.aliases) == null ? void 0 : n.map((o) => o.toLowerCase())) ?? []
    };
    const t = this._keyRemap[e.key];
    if (t && (e.key = t), e.aliases)
      for (let o = 0; o < e.aliases.length; o += 1) {
        const _ = this._keyRemap[e.aliases[o]];
        _ && (e.aliases[o] = _);
      }
    const s = this._handlerStates[e.key];
    if (s)
      for (const o of s)
        o.executePressed(e);
    const i = this._activeKeyMap.get(e.key);
    if (i)
      i.event = e;
    else {
      const o = {
        key: e.key,
        aliases: new Set(e.aliases),
        event: e
      };
      this._activeKeyMap.set(e.key, o), this._activeKeyPresses.push(o);
    }
    this._updateKeyComboStates();
    for (const o of this._keyComboStatesArray)
      o.executePressed(e);
  }
  _handleKeyRelease(e) {
    var i;
    e = {
      ...e,
      key: e.key.toLowerCase(),
      aliases: ((i = e.aliases) == null ? void 0 : i.map((n) => n.toLowerCase())) ?? []
    };
    const t = this._keyRemap[e.key];
    if (t && (e.key = t), e.aliases)
      for (let n = 0; n < e.aliases.length; n += 1) {
        const o = this._keyRemap[e.aliases[n]];
        o && (e.aliases[n] = o);
      }
    const s = this._handlerStates[e.key];
    if (s)
      for (const n of s)
        n.executeReleased(e);
    if (this._activeKeyMap.has(e.key)) {
      this._activeKeyMap.delete(e.key);
      for (let n = 0; n < this._activeKeyPresses.length; n += 1)
        if (this._activeKeyPresses[n].key === e.key) {
          this._activeKeyPresses.splice(n, 1), n -= 1;
          break;
        }
    }
    this._tryReleaseSelfReleasingKeys(), this._updateKeyComboStates();
    for (const n of this._keyComboStatesArray)
      n.executeReleased(e);
  }
  _updateKeyComboStates() {
    for (const e of this._keyComboStatesArray)
      e.updateState(this._activeKeyPresses, this.sequenceTimeout);
  }
  _tryReleaseSelfReleasingKeys() {
    for (const e of this._activeKeyPresses)
      for (const t of this._selfReleasingKeys)
        e.key === t && this._handleKeyRelease(e.event);
  }
}
let g, v;
const F = (a) => {
  v = a ?? new P(g);
}, p = () => (v || F(), v), N = (...a) => p().bindKey(...a), G = (...a) => p().bindKeyCombo(...a); y.normalizeKeyCombo; y.stringifyKeyCombo; y.parseKeyCombo;

const getProject = () => {
  var _document$getElementB, _document$querySelect;
  const url = ((_document$getElementB = document.getElementById('projectUrl')) == null ? void 0 : _document$getElementB.value) || ((_document$querySelect = document.querySelector('.projectLineItem.active a')) == null ? void 0 : _document$querySelect.href);
  if (url) {
    return {
      url,
      id: url.replace(/^.+\/([^/]+)$/, '$1')
    };
  }
  return false;
};
const getToDo = () => {
  var _document$querySelect2;
  const url = (_document$querySelect2 = document.querySelector('#ticketdetails form')) == null ? void 0 : _document$querySelect2.action;
  if (url) {
    return {
      url: location.href,
      id: url.replace(/^.+\/([^/]+)$/, '$1')
    };
  }
  return false;
};

const translations = {
  'da-dk': {}
};

// @todo Use https://www.i18next.com/ for this.
const translate = text => {
  var _document$documentEle, _translations$lang$te, _translations$lang;
  const lang = (_document$documentEle = document.documentElement.lang) != null ? _document$documentEle : 'en-US';
  return (_translations$lang$te = (_translations$lang = translations[lang]) == null ? void 0 : _translations$lang[text]) != null ? _translations$lang$te : text;
};

var _tmpl$ = /*#__PURE__*/web.template(`<span>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<span class=then>`),
  _tmpl$3 = /*#__PURE__*/web.template(`<kbd>`),
  _tmpl$4 = /*#__PURE__*/web.template(`<div><h1>`),
  _tmpl$5 = /*#__PURE__*/web.template(`<section><h2></h2><table>`),
  _tmpl$6 = /*#__PURE__*/web.template(`<tr><td></td><td>`);
let panelShown = false;
const shortcuts = [{
  title: translate('Global'),
  shortcuts: [{
    keys: '?',
    description: translate('Toggle keyboard navigation help overlay.'),
    callable: () => {
      if (panelShown) {
        panel.hide();
      } else {
        panel.show();
      }
      panelShown = !panelShown;
    }
  },
  // This conflicts with Leantime keyboard shortcut.
  // {
  //   keys: 'Escape',
  //   description: t('Close this overlay'),
  //   callable: () => {
  //     panel.hide();
  //   },
  // },

  {
    keys: 'g, h',
    path: '/',
    description: translate('Go home'),
    toast: translate('Going home …')
  }, {
    keys: 'g, p',
    path: '/projects/showMy',
    description: translate('Show projects'),
    toast: translate('Going to projects …')
  }, {
    keys: 'g, c',
    path: '/calendar/showMyCalendar',
    description: translate('Show calendar'),
    toast: translate('Going to calendar …')
  }, {
    keys: 'g, m',
    path: '/users/editOwn/',
    description: translate('Show profile'),
    toast: translate('Going to profile …')
  }, {
    keys: 'g, t, w',
    path: '/timesheets/showMy',
    description: translate('Show week timesheets'),
    toast: translate('Going to week timesheets …')
  }, {
    keys: 'g, t, l',
    path: '/timesheets/showMyList',
    description: translate('Show list timesheets'),
    toast: translate('Going to list timesheets …')
  }]
}, {
  title: translate('Project'),
  shortcuts: [{
    keys: 'c',
    context: getProject,
    callable: project => {
      if (project) {
        const url = new URL(location.href);
        url.hash = '#/tickets/newTicket';
        navigate(url.toString());
      }
    },
    description: translate('Create new To-Do in current project')
  }]
}, {
  title: translate('To-do'),
  shortcuts: [{
    keys: 't',
    context: getToDo,
    callable: todo => {
      if (todo.url) {
        const url = new URL(todo.url);
        url.searchParams.set('tab', 'timesheet');
        navigate(url.toString());
      }
    },
    description: translate('Track time on current To-Do')
  }]
}];
function Help() {
  const renderKeys = keys => {
    const items = keys.split(/\s*(,)\s*/g);
    return (() => {
      var _el$ = _tmpl$();
      web.insert(_el$, () => items.map(key => ',' === key ? [' ', (() => {
        var _el$2 = _tmpl$2();
        web.insert(_el$2, () => translate('then'));
        return _el$2;
      })(), ' '] : (() => {
        var _el$3 = _tmpl$3();
        web.insert(_el$3, key);
        return _el$3;
      })()));
      return _el$;
    })();
  };
  return (() => {
    var _el$4 = _tmpl$4(),
      _el$5 = _el$4.firstChild;
    web.insert(_el$5, () => translate('Keyboard shortcuts'));
    web.insert(_el$4, () => shortcuts.map(section => (() => {
      var _el$6 = _tmpl$5(),
        _el$7 = _el$6.firstChild,
        _el$8 = _el$7.nextSibling;
      web.insert(_el$7, () => section.title);
      web.insert(_el$8, () => section.shortcuts.map(shortcut => (() => {
        var _el$9 = _tmpl$6(),
          _el$10 = _el$9.firstChild,
          _el$11 = _el$10.nextSibling;
        web.insert(_el$10, () => renderKeys(shortcut.keys));
        web.insert(_el$11, () => shortcut.description);
        return _el$9;
      })()));
      web.effect(() => web.className(_el$8, styles.table));
      return _el$6;
    })()), null);
    web.effect(() => web.className(_el$4, styles.keyboardShortcuts));
    return _el$4;
  })();
}

// @see https://violentmonkey.github.io/vm-ui/functions/getPanel.html
const panel = ui.getPanel({
  theme: 'dark',
  style: [css_248z, stylesheet].join('\n')
});
Object.assign(panel.wrapper.style, {
  top: '10vh',
  left: '10vw'
});
web.render(Help, panel.body);
const inContext = (event, context) => {
  var _event$finalKeyEvent$, _event$finalKeyEvent, _browserEvent$target;
  // @see https://github.com/RobertWHurst/Keystrokes/issues/29#issuecomment-1802877351
  const browserEvent = (_event$finalKeyEvent$ = (_event$finalKeyEvent = event.finalKeyEvent) == null ? void 0 : _event$finalKeyEvent.originalEvent) != null ? _event$finalKeyEvent$ : event.originalEvent;
  const target = (_browserEvent$target = browserEvent.target) != null ? _browserEvent$target : browserEvent.srcElement;

  // Never run if context is an editable control.
  if (target && (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))) {
    return false;
  }
  if ('function' === typeof context) {
    return context(event);
  }

  // @todo (How) should we handle this case (where context is not a function)?
  return true;
};
const allShortcuts = [].concat(...shortcuts.map(section => section.shortcuts));
const navigate = destination => {
  const url = new URL(destination, location.href).toString();
  if (location.href !== url) {
    location.href = url;
  }
};
for (const shortcut of allShortcuts) {
  (1 === shortcut.keys.length ? N : G)(shortcut.keys, event => {
    const context = inContext(event, shortcut.context);
    if (context) {
      if (shortcut.path) {
        if (shortcut.toast) {
          ui.showToast(shortcut.toast, {
            theme: 'dark'
          });
        }
        navigate(shortcut.path);
      } else if (shortcut.callable && 'function' === typeof shortcut.callable) {
        shortcut.callable(context, event);
      }
    }
  });
}

})(await import("https://esm.sh/solid-js/web"), VM);
})();

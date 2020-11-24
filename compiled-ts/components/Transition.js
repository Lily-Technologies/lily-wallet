"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_transition_group_1 = require("react-transition-group");
var TransitionContext = react_1.default.createContext({
    parent: {},
});
function useIsInitialRender() {
    var isInitialRender = react_1.useRef(true);
    react_1.useEffect(function () {
        isInitialRender.current = false;
    }, []);
    return isInitialRender.current;
}
function CSSTransition(_a) {
    var show = _a.show, _b = _a.enter, enter = _b === void 0 ? '' : _b, _c = _a.enterFrom, enterFrom = _c === void 0 ? '' : _c, _d = _a.enterTo, enterTo = _d === void 0 ? '' : _d, _e = _a.leave, leave = _e === void 0 ? '' : _e, _f = _a.leaveFrom, leaveFrom = _f === void 0 ? '' : _f, _g = _a.leaveTo, leaveTo = _g === void 0 ? '' : _g, appear = _a.appear, children = _a.children;
    var enterClasses = enter.split(' ').filter(function (s) { return s.length; });
    var enterFromClasses = enterFrom.split(' ').filter(function (s) { return s.length; });
    var enterToClasses = enterTo.split(' ').filter(function (s) { return s.length; });
    var leaveClasses = leave.split(' ').filter(function (s) { return s.length; });
    var leaveFromClasses = leaveFrom.split(' ').filter(function (s) { return s.length; });
    var leaveToClasses = leaveTo.split(' ').filter(function (s) { return s.length; });
    function addClasses(node, classes) {
        var _a;
        classes.length && (_a = node.classList).add.apply(_a, classes);
    }
    function removeClasses(node, classes) {
        var _a;
        classes.length && (_a = node.classList).remove.apply(_a, classes);
    }
    return (react_1.default.createElement(react_transition_group_1.CSSTransition, { appear: appear, unmountOnExit: true, in: show, addEndListener: function (node, done) {
            node.addEventListener('transitionend', done, false);
        }, onEnter: function (node) {
            addClasses(node, __spreadArrays(enterClasses, enterFromClasses));
        }, onEntering: function (node) {
            removeClasses(node, enterFromClasses);
            addClasses(node, enterToClasses);
        }, onEntered: function (node) {
            removeClasses(node, __spreadArrays(enterToClasses, enterClasses));
        }, onExit: function (node) {
            addClasses(node, __spreadArrays(leaveClasses, leaveFromClasses));
        }, onExiting: function (node) {
            removeClasses(node, leaveFromClasses);
            addClasses(node, leaveToClasses);
        }, onExited: function (node) {
            removeClasses(node, __spreadArrays(leaveToClasses, leaveClasses));
        } }, children));
}
exports.Transition = function (_a) {
    var show = _a.show, appear = _a.appear, rest = __rest(_a, ["show", "appear"]);
    var parent = react_1.useContext(TransitionContext).parent;
    var isInitialRender = useIsInitialRender();
    var isChild = show === undefined;
    if (isChild) {
        return (react_1.default.createElement(CSSTransition, __assign({ appear: parent.appear || !parent.isInitialRender, show: parent.show }, rest)));
    }
    return (react_1.default.createElement(TransitionContext.Provider, { value: {
            parent: {
                show: show,
                isInitialRender: isInitialRender,
                appear: appear,
            },
        } },
        react_1.default.createElement(CSSTransition, __assign({ appear: appear, show: show }, rest))));
};
exports.default = exports.Transition;
//# sourceMappingURL=Transition.js.map
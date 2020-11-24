"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ScrollToTop.ts
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
/*
 * Registers a history listener on mount which
 * scrolls to the top of the page on route change
 */
exports.ScrollToTop = function () {
    var history = react_router_dom_1.useHistory();
    react_1.useEffect(function () {
        var unlisten = history.listen(function () {
            window.scrollTo(0, 0);
        });
        return unlisten;
    }, [history]);
    return null;
};
//# sourceMappingURL=ScrollToTop.js.map
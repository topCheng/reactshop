let config = require("./config");
//console.log(config);
(function (window) {
    window.base = {
        config: config.default,
        pages: {
            index: {
                scrollTop: 0
            }
        }
    }
    module.export = window.base;
})(window)
//
// (c) 2012 imc AG. All rights reserved.
//

"use strict";

(function() {
    try {
        var HTML5Player = use("com.imc.core.HTML5Player");

        Object.defineProperty(window, "$_P", {
            "value"      : new HTML5Player(),
            "enumerable" : true
        });
        
        if (Modernizr.history) {
            history.replaceState(null, null);
        }
    } catch(e) {}
})();

// Create global player object -------------------------------------------------
$(window).on("imc:playerReady", function() {
    // Execute player main when ready
    if (!window.IMCNativeClient) {
        $_P.run();
    }
});

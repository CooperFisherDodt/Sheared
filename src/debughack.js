/*
 * various patches and patching utilites to make debugging simpler
 */
import event.Emitter as Emitter;
import ui.View as View;

import src.constants as c;

var Hax = function () {
    /*
     * make button outlines visible
     */
    this.post_initButton = function (button, opts) {
        var v, vopts, subs;
        // pop all subviews so we can add them back on top
        subs = button.getSubviews();
        button.removeAllSubviews();

        vopts = {
            backgroundColor: '#c6c',
            opacity: 0.2,
            superview: button,
            width: button.style.width,
            height: button.style.height
        };
        v = new View(vopts);
        for (var i = 0; i < subs.length; i++) {
            button.addSubview(subs[i]);
        }
    };

    this.pre_purchase = function () {
        if (GC.app.localConfig.debug) {
            GC.app.player._buy = function () {};
        }
    };

    /*
     * add some wool to test crafting
     */
    this.pre_startCrafting = function (view) {
        if (!GC.app.woolhack) {
            GC.app.woolhack = true;
            GC.app.player.wool.add([
                {color: 'none', count: 0},
                {color: 'white', count: 100},
                {color: 'red', count: 100},
                {color: 'yellow', count: 100},
                {color: 'blue', count: 100},
                {color: 'black', count: 100}
            ]);
            view.woolCounts.update();
        }
    };

    /*
     * make the GC splash screen much faster during debugging
     */
    this.pre_launchUI = function () {
        c.SPLASH_TIME = 300;
    };

    /*
     * Make the timer shorter
     */
    this.post_initTimer = function (timer) {
        timer.time = 10;
        timer.updateOpts({text: timer.time});
    };

    /*
     * suppress ads
     */
    this.pre_ads = function (adtimer) {
        adtimer.isSuppressed = true;
    };

    var _args, debugWrap = function (fn) {
        return bind(this, function () {
            _args = arguments;
            if (GC.app.localConfig.debug) {
                return fn.apply(this, _args);
            }
        });
    };

    this.post_initButton = debugWrap(this.post_initButton);
    this.post_initTimer = debugWrap(this.post_initTimer);
    this.pre_startCrafting = debugWrap(this.pre_startCrafting);
    this.pre_launchUI = debugWrap(this.pre_launchUI);
    this.pre_ads = debugWrap(this.pre_ads);
};

exports = new Hax();

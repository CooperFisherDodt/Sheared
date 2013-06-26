"use strict";

import src.constants as c;
import src.Inventory as Inventory;
import event.Emitter as Emitter;

exports = Class(Emitter, function Player(supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.inventory = new Inventory();
        loadStats(this.inventory.wool, 'wool.');

        this.ewesSheared = {};
        loadStats(this.ewesSheared, 'ewes.');

        this.ramsSheared = {};
        loadStats(this.ramsSheared, 'rams.');

        this.deduct = bind(this, function (color) {
        });

        this.addWool = bind(this, function (color, amt) {
            this.inventory.addWool(color, amt);
            localStorage['wool.' + color] = parseInt(localStorage['wool.' + color]) + (amt || 1);
        });

        this.addCraft = bind(this, function (garment, base, trim) {
            this.inventory.addCraft(garment, base, trim);
            // TODO local storage
        });

        // add all the wool from another inventory to this one
        this.addInventory = function (other) {
            var i = c.colors.length;
            while (i--) {
                this.addWool(c.colors[i].label, other.wool[c.colors[i].label]);
            }
        };

        this.shearedSheep = function (sheep) {
            if (sheep.isRam) {
                this.ramsSheared[sheep.color.label] += 1;
                localStorage['rams.' + sheep.color.label] = this.ramsSheared[sheep.color.label];
            } else {
                this.ewesSheared[sheep.color.label] += 1;
                localStorage['ewes.' + sheep.color.label] = this.ewesSheared[sheep.color.label];
            }
        };
    };
});

function loadStats (obj, id) {
    var i = c.colors.length;
    // if there are no saved values, initialize them
    if (!localStorage[id + c.COLOR_WHITE.label]) {
        while (i--) {
            localStorage[id + c.colors[i].label] = 0;
        }
    }

    // pull the stats from local storage
    i = c.colors.length;
    while (i--) {
        obj[c.colors[i].label] = parseInt(localStorage[id + c.colors[i].label]);
    }
}

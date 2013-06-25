"use strict";

import src.constants as c;
import event.Emitter as Emitter;

exports = Class(Emitter, function Inventory(supr) {
    this.init = function () {
        supr(this, 'init', arguments);
        this.wool = {};
        this.wool[c.COLOR_WHITE.label] = 100;
        this.wool[c.COLOR_RED.label] = 100;
        this.wool[c.COLOR_BLUE.label] = 100;
        this.wool[c.COLOR_YELLOW.label] = 100;
        this.wool[c.COLOR_BLACK.label] = 100;
 
        this._crafts = [];

        this.deduct = bind(this, function (color) {
        });

        this.addWool = bind(this, function (color, amt) {
            if (! typeof color === 'string') {
                color = color.label;
            }
            this.wool[color] = this.wool[color] + (amt || 1);
            this.emit('inventory:woolAdded', color, amt);
        });

        this.addCraft = bind(this, function (garment, base, trim) {
            if (typeof garment === 'string') {
                garment = c.garmentsByLabel[garment];
            }
            if (typeof base === 'string') {
                base = c.colorsByLabel[base];
            }
            if (typeof trim === 'string') {
                trim = c.colorsByLabel[trim];
            }
            this._crafts.push(new Craft(garment, base, trim));
            this.emit('inventory:craftAdded', garment, base, trim);
        });

        // add all the wool from another inventory to this one
        this.addInventory = function (other) {
            var i = c.colors.length;
            while (i--) {
                this.wool[c.colors[i].label] += other.wool[c.colors[i].label];
            }
        };
    };
});


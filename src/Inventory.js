import event.Emitter as Emitter;
import GCDataSource;

import src.constants as c;
import src.Craft as Craft;
import src.util as util;


var wools = [
    {color: c.COLOR_WHITE.label, count: 0},
    {color: c.COLOR_RED.label, count: 0},
    {color: c.COLOR_BLUE.label, count: 0},
    {color: c.COLOR_YELLOW.label, count: 0},
    {color: c.COLOR_BLACK.label, count: 0}
];

var crafts = [
    {motif: 'naked|none|none', count: 0}
];

exports = Class(Emitter, function Inventory_(supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.wool = new GCDataSource({key: 'color'});
        this.wool.add(wools);
        this.wool.on('Update', bind(this, function (clabel, item) {
            this.emit('inventory:woolUpdate', clabel, item);
        }));
 
        this.crafts = new GCDataSource({key: 'motif'});
        this.crafts.add(crafts);
        this.crafts.on('Update', bind(this, function (motif, item) {
            this.emit('inventory:craftUpdate', motif, item);
        }));

        util.reissue(this.wool, 'Update', this, 'inventory:woolUpdate');
        util.reissue(this.crafts, 'Update', this, 'inventory:craftUpdate');

        this.addWool = bind(this, function (color, amt) {
            if (typeof color === 'string') {
                clabel = color;
            } else {
                clabel = color.label;
            }
            var old = this.woolCountOf(clabel);
            this.wool.add({color: clabel, count: old + (amt || 1)});
        });

        this.addCraft = bind(this, function (craft, amt) {
            var motif, oldCraft, oldCount;
            if (typeof craft === 'string') {
                motif = craft;
            } else {
                motif = craft.toMotif();
            }
            oldCraft = this.crafts.get(motif);
            oldCount = oldCraft ? oldCraft.count : 0;
            this.crafts.add({motif: motif, count: oldCount + (amt || 1)});
        });

        this.craftCountOf = bind(this, function (craft) {
            var lookup;

            if (typeof craft === 'string') {
                lookup = this.crafts.get(craft);
            } else {
                lookup = this.crafts.get(craft.toMotif());
            }

            if (lookup) {
                return lookup.count;
            } else {
                return 0;
            }
        });

        this.woolCountOf = bind(this, function (color) {
            if (typeof color === 'string') {
                clabel = color;
            } else {
                clabel = color.label;
            }
            return this.wool.get(clabel).count;
        });

        /*
         * make a copy of the inventory so i can make temp modifications to it
         */
        this.copy = bind(this, function () {
            import src.Inventory as Inventory;
            var ret = new Inventory();

            ret.wool.fromJSON(this.wool.toJSON());
            ret.crafts.fromJSON(this.crafts.toJSON());

            return ret;
        });

        /*
         * add to the data of this inventory from another inventory
         */
        this.mergeCounts = bind(this, function (other) {
            other.wool.forEach(function (otherWool, index) {
                this.addWool(otherWool.color, otherWool.count);
            }, this);

            other.crafts.forEach(function (otherCraft, index) {
                this.addCraft(otherCraft.motif, otherCraft.count);
            }, this);

            return this;
        });

        /*
         * given obj with a key for each color, load it into this.wool
         * GCDataSource
         */
        this.loadWoolHack = bind(this, function (obj) {
            var _tmpArr = [];
            for (var k in obj) {
                _tmpArr.push({'color': k, 'count': obj[k]});
            }
            this.wool.add(_tmpArr);
        });
    };
});

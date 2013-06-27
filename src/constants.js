"use strict";

var imagePath = 'resources/images/';


// Given rarity R, value V of the corresponding wool is:
//
//    V = 0.20 / R
//

exports = {
    COLOR_NONE: null,

    COLOR_WHITE: {
        label: 'white',
        eweImage: imagePath + 'ewe-white.png',
        ramImage: imagePath + 'ram-white.png',
        rarity: 1.00
    },
    COLOR_RED: {
        label: 'red',
        eweImage: imagePath + 'ewe-red.png',
        ramImage: imagePath + 'ram-red.png',
        rarity: 0.57
    },
    COLOR_BLUE: {
        label: 'blue',
        eweImage: imagePath + 'ewe-blue.png',
        ramImage: imagePath + 'ram-blue.png',
        rarity: 0.57
    },
    COLOR_YELLOW: {
        label: 'yellow',
        eweImage: imagePath + 'ewe-yellow.png',
        ramImage: imagePath + 'ram-yellow.png',
        rarity: 0.57
    },
    COLOR_BLACK: {
        label: 'black',
        eweImage: imagePath + 'ewe-black.png',
        ramImage: imagePath + 'ram-black.png',
        rarity: 0.40
    },

    GARMENT_NAKED: null,

    GARMENT_HAT: {
        label: 'hat', 
        cost: {contrast: 2, main: 10},
        price: 6.00
    },
    GARMENT_SOCK: {
        label: 'sock', 
        cost: {contrast: 10, main: 26},
        price: 18.00
    },
    GARMENT_SCARF: {
        label: 'scarf', 
        cost: {contrast: 14, main: 34},
        price: 24.00
    },
    GARMENT_MITTEN: {
        label: 'mitten', 
        cost: {contrast: 6, main: 18},
        price: 12.00
    },
    GARMENT_SWEATER: {
        label: 'sweater', 
        cost: {contrast: 18, main: 42},
        price: 30.00
    }
};

// build a mapping for looking up each kind of object
function indexByLabel(objs) {
    var r = {};
    for (var i = 0; i < objs.length; i++) {
        var o = objs[i];
        r[o.label] = o;
    }
    return r;
}

exports.colors = [exports.COLOR_WHITE, exports.COLOR_RED,
    exports.COLOR_BLUE, exports.COLOR_YELLOW, exports.COLOR_BLACK];
exports.colorsByLabel = indexByLabel(exports.colors);

exports.garments = [exports.GARMENT_HAT, exports.GARMENT_SOCK,
    exports.GARMENT_SCARF, exports.GARMENT_MITTEN, exports.GARMENT_SWEATER];
exports.garmentsByLabel = indexByLabel(exports.garments);

exports.fenceSize = 80;
exports.laneSize = 52;

exports.days = [];
for (var i = 0; i < 7; i++) {
    exports.days.push({
      // delay between sheep spawns
        sheepFrequency: (1.5 - (i * 1/6))*500,

      // TODO make it vary
        ramRarity: 0.3
    });
}

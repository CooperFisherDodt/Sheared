import device;
import ui.View as View;
import ui.ImageView as ImageView;
import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Clipper as Clipper;
import src.Blade as Blade;
import src.Diamond as Diamond;
import src.Inventory as Inventory;
import src.constants as constants;
import src.Timer as Timer;
import ui.TextView as TextView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play-dev.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
        this.day = 0;
        this.build();
    };

    this.build = function () {
        this.sheep = [];
        this.dailyInventory = new Inventory();
        this.clipper = new Clipper({
            x: 0,
            y: laneCoord(4) + 5 // start in middle lane
        });
        this.addSubview(this.clipper);

        this.on('play:start', bind(this, playGame));
        this.on('InputSelect', bind(this, launchBlade));

        // for playtesting purposes..
        if (device.name === 'browser') {
            var onKey = function (e) {
                launchBlade();
            };
            document.addEventListener('keydown', bind(this, launchBlade), false);
        }

    };

    this.removeSheep = function (sheep) {
        this.sheep.splice(this.sheep.indexOf(sheep), 1);
        sheep.removeFromSuperview();
    };

    this.endDay = function () {
        var i = this.sheep.length;

        while (i--) {
            clearInterval(this.sheep[i].interval);
        }
        if (this.blade) {
            clearInterval(this.blade.interval);
        }
        if (this.diamond) {
            clearInterval(this.diamond.interval);
        }
        clearInterval(this.interval);
        clearInterval(this.diamondInterval);

        this.removeAllSubviews();
        this.removeAllListeners();

        this.inventory.addInventory(this.dailyInventory);
    };

    this.gameOver = function () {
        this.endDay();

        var gameOverScreen = new TextView({
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            text: 'You lost',
            size: 42,
            color: '#FFFFFF',
            backgroundColor: '#000000'
        });
        this.addSubview(gameOverScreen);
        gameOverScreen.on('InputSelect', bind(this, function () {
            this.getSuperview().emit('titleScreen:craft');
        }));
    };

    this.timeOver = function () {
        this.endDay();

        var i, resultsScreen = new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/results.png'
        }),
        continueButton = new View({
            x: 392,
            y: 418,
            width: 240,
            height: 54
        });
        for (i = 0; i < constants.colors.length; i++) {
            resultsScreen.addSubview(new TextView({
                x: 72 + 196*i,
                y: 337,
                width: 96,
                height: 48,
                horizontalAlign: 'center',
                verticalAlign: 'middle',
                text: '' + this.dailyInventory.wool[constants.colors[i].label],
                size: 128,
                autoFontSize: true,
                color: '#FFFFFF',
                strokeWidth: 4,
                strokeColor: '#000000'
            }));
        }
        resultsScreen.addSubview(continueButton);
        this.addSubview(resultsScreen);
        continueButton.on('InputSelect', bind(this, function (evt) {
            evt.cancel(); // stop the event from propagating (so we don't shoot a blade)
            resultsScreen.removeFromSuperview();
            this.day += 1;
            if (this.day > 6) {
                this.getSuperview().emit('titleScreen:craft');
            } else {
                this.build();
                this.emit('play:start');
            }
        }));
    };
});

function playGame () {
    this.inventory = GC.app.inventory;
    this.interval = setInterval(spawnSheep.bind(this), constants.days[this.day].sheepFrequency);
    this.diamondInterval = setInterval(spawnDiamond.bind(this), 10000);

    this.timer = new Timer({
        x: 0,
        y: 0,
        width: 1024,
        height: constants.fenceSize
    });
    this.addSubview(this.timer);
    this.timer.run();
}

function spawnSheep () {
    var sheep, r = Math.random();
    if (r > constants.days[this.day].ramRarity) {
        sheep = new Sheep({
            x: 1024,
            y: randomLaneCoord(8)
        });
    } else {
        sheep = new Ram({
            x: 1024,
            y: randomLaneCoord(7)
        });
    }

    this.addSubview(sheep);
    this.sheep.push(sheep);
    sheep.run();
}

function spawnDiamond () {
    this.diamond = new Diamond({
        x: 1024,
        y: randomLaneCoord(8)
    });

    this.addSubview(this.diamond);
    this.diamond.run();
}

function launchBlade () {
    if (this.bladeOut) {
        return;
    }
    var blade = new Blade({
        x: this.clipper.style.x + this.clipper.style.width,
        y: this.clipper.style.y + 3
    });
    this.addSubview(blade);
    this.bladeOut = true;
    blade.run();
};

// return a random y-coordinate for the lane
function randomLaneCoord (numLanes) {
    return laneCoord(Math.floor(Math.random()*numLanes));
}

function laneCoord (index) {
    return (index * constants.laneSize) + constants.fenceSize;
}

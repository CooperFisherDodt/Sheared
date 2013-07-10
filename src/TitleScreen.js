/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.ImageView;

import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.CreditsScreen as CreditsScreen;
import src.TutorialSelectScreen as TutorialSelectScreen;
import src.Button as Button;
import src.MuteButton as MuteButton;


/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */
exports = Class(ui.ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/title.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var pbOpts, playButton, cbOpts, craftButton, craftScreen,
            playScreen, modeScreen, stackView, creditsScreen, credOpts, tutorialScreen;

        craftScreen = new CraftScreen();
        creditsScreen = new CreditsScreen();
        tutorialScreen = new TutorialSelectScreen();
        playScreen = new PlayScreen();

        stackView = this.getSuperview();

        GC.app.engine.on('Tick', bind(this, function (dt) {
            if (playScreen.clipper) {
                playScreen.clipper.emitDiamonds();
            }
            if (playScreen.particleEngine) {
                playScreen.particleEngine.runTick(dt);
            }
        }));

        statOpts = {
            superview: this,
            x: 630,
            y: 296,
            width: 150,
            height: 74
        };
        statButton = new Button(statOpts);

        pbOpts = {
            superview: this,
            x: 234,
            y: 296,
            width: 150,
            height: 74
        };
        playButton = new Button(pbOpts);

        cbOpts = {
            superview: this,
            x: 428,
            y: 296,
            width: 150,
            height: 74
        };
        craftButton = new Button(cbOpts);

        howOpts = {
            superview: this,
            x: 388,
            y: 392,
            width: 248,
            height: 74
        };
        howButton = new Button(howOpts);
        howButton.on('InputSelect', function () {
            tutorialScreen.build();
            stackView.push(tutorialScreen);
        });

        credOpts = {
            superview: this,
            x: 462,
            y: 484,
            width: 100,
            height: 50
        }
        var creditsButton = new Button (credOpts);
        creditsButton.on('InputSelect', function () {
            stackView.push(creditsScreen);
        });
        creditsScreen.on('credits:back', function () {
            stackView.pop();
        });

        muteOpts = {
            superview: this,
            x: 932,
            y: 486,
            width: 80,
            height: 80
        };
        this.muteButton = new MuteButton(muteOpts);

        tutorialScreen.on('tutorial:back', bind(this, function () {
            stackView.pop();
        }));

        playButton.on('InputSelect', bind(this, function () {
            stackView.push(playScreen);
        }));

        craftButton.on('InputSelect', bind(this, function () {
            stackView.push(craftScreen);
            craftScreen.emit('craft:start');
        }));

        /* When the game screen has signalled that the game is over,
         * reset the play screen so we can play again
         */
        this.on('playscreen:end', bind(this, function () {
            delete this.playScreen;
            this.playScreen = new PlayScreen();
            stackView.push(craftScreen);
            craftScreen.emit('craft:start');
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted();
        }));
    };
});

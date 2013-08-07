import animate;
import ui.resource.Image as Image;
import ui.ImageView as ImageView;


exports = Class(ImageView, function (supr) {
    this.init = function _a_init(opts) {
        opts.image = new Image({url: 'resources/images/spinner.png'});
        opts.zIndex = 99999999999;
        opts.anchorX = opts.image.getWidth() / 2;
        opts.anchorY = opts.image.getHeight() / 2;
        supr(this, 'init', arguments);
        this.spin();
    };

    this.spin = function _a_spin() {
        animate(this).now({dr: 2.4}, 200, animate.linear).then(bind(this, this.spin));
    };
});

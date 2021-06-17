let game = {
    ctx: null,
    platform: null,
    ball: null,
    blocks: [],
    rows: 4,
    cols: 8,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null
    },
    init: function () {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.setEvents();
    },
    setEvents() {
        window.addEventListener("keydown", e => {
            if (e.code === 'Space') {
                this.platform.fire();
            } else if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                this.platform.start(e.code);
            }


        });
        window.addEventListener("keyup", e => {
            this.platform.stop();
        });
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;
        let onImageLoad = () => {
            ++loaded;
            if (loaded >= required) {
                callback();
            }
        }
        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/${ key }.png`;
            this.sprites[key].addEventListener("load", onImageLoad);
        }
    },
    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x: 64 * col + 65,
                    y: 24 * row + 35
                })
            }
        }
    },
    update() {
        this.platform.move();
        this.ball.move();
    },
    run() {
        // run
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        });
    },
    render() {
        // render
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height,);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
    },
    renderBlocks() {
        for (let block of this.blocks) {
            this.ctx.drawImage(this.sprites.block, block.x, block.y);
        }
    },
    start: function() {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
    }
};

game.ball = {
    x: 320,
    y: 280,
    dy: 0,
    velocity: 3,
    width: 20,
    height: 20,
    start() {
        this.dy = -this.velocity;
    },
    move() {
        if (this.dy) {
            this.y += this.dy;
        }
    }
};

game.platform = {
    velocity: 6,
    dx: 0,
    x: 280,
    y: 300,
    ball: game.ball,
    stop() {
        this.dx = 0;
    },
    start(direction) {
        if (direction === 'ArrowRight' ) {
            this.dx = this.velocity;
        } else if (direction === 'ArrowLeft') {
            this.dx = -this.velocity;
        }
    },
    move() {
        if (this.dx) {
            this.x += this.dx;
            // game.ball.x += this.dx;
            if (this.ball) {
                this.ball.x += this.dx;
            }
        }
    },
    fire() {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
        }
    }
};

window.addEventListener("load", () => {
    game.start();
});

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var tetromino = require('Tetromino');

cc.Class({
    extends: cc.Component,

    properties: {
        I_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        J_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        L_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        O_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        S_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        T_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        Z_Tetromino: {
            default: null,
            type: cc.Prefab
        },
        Gameover_board: {
            default: null,
            type: cc.Sprite
        },
        start_x: {
            default: -17.5
        },
        start_y: {
            default: 402.5
        },
        play_groud: {
            default: null,
            type: cc.Sprite
        },
        prev_groud: {
            default: null,
            type: cc.Sprite
        },
        update_dt: {
            default: 100
        },
        down_duration: 1,
        rotate_duration: 0.2
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.block_mapping = [this.I_Tetromino, this.J_Tetromino, this.L_Tetromino, this.O_Tetromino, this.S_Tetromino, this.T_Tetromino, this.Z_Tetromino]
        this.matrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
        this.down_count = 0;
        this.tetromino_lock = false;
        this.current_t = null;
        this.next_tetromino = this.get_next_tetromino();
        this.tetromino_lock = true;
        this.down_action = cc.moveBy(this.down_duration, 0, 35);
        this.rotate_action = cc.rotateBy(this.rotate_duration, 90);
        this.is_gameover = false
        this.has_rotate = false

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
                this.move_left();
                break;
            case cc.KEY.d:
                this.move_right();
                break;
            case cc.KEY.left:
                if (!this.has_rotate){
                    this.rotate_left(false, false);
                }
                break;
            case cc.KEY.right:
                if (!this.has_rotate) {
                    this.rotate_right(false, false);
                }
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
                break;
            case cc.KEY.left:
                this.has_rotate = false
                break;
            case cc.KEY.right:
                this.has_rotate = false
                break;
        }
    },

    start() {

    },

    calculate_position: function (x, y) {
        var x_pos = 17.5 + 35 * (x - 6);
        var y_pos = 17.5 + 35 * (10 - y);
        return x_pos, y_pos
    },

    get_block_position: function (x, y) {
        var x_pos = (x - 17.5) / 35 + 6;
        var y_pos = 10 - (y - 17.5) / 35;
        return [x_pos, y_pos]
    },

    get_next_tetromino: function (last_t) {
        // var next_t = tetromino.get_tetromino(last_t);

        var tetromino = cc.instantiate(this.J_Tetromino);
        tetromino.parent = this.prev_groud.node;
        tetromino.setPosition(0, 17.5);
        return tetromino
    },

    transform_tetromino: function () {
        if (this.current_t != null){
            this.update_matrix();
        }
        this.current_t = this.next_tetromino;
        this.current_t.parent = this.play_groud.node;
        this.current_t.setPosition(this.start_x, this.start_y);
        this.next_tetromino = this.get_next_tetromino();
        this.tetromino_lock = false;
        
    },

    move_left: function () {
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2) - 1;
                    var t_y = t_pos[1] + (i - 2);
                    if (t_x < 0){
                        return false
                    }
                    if (this.matrix[t_y][t_x] != 0) {
                        return false
                    } 
                }
            }
        }
        this.current_t.x -= 35;
        return true
    },

    move_right: function () {
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2) + 1;
                    var t_y = t_pos[1] + (i - 2);
                    if (t_x > 9){
                        return false
                    }
                    if (this.matrix[t_y][t_x] != 0) {
                        return false
                    }
                }
            }
        }
        this.current_t.x += 35;
        return true
    },
    
    rotate_left: function(vertical, horizantal) {
        this.has_rotate = true;
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation + 270);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2);
                    var t_y = t_pos[1] + (i - 2);
                    if (t_x > 9) {
                        if (this.move_left() && !horizantal) {
                            this.rotate_left(vertical, true);
                        }
                        return
                    }
                    if (t_x < 0) {
                        if (this.move_right() && !horizantal) {
                            this.rotate_left(vertical, true);
                        }
                        return
                    }
                    if ((t_y > 19 || this.matrix[t_y][t_x] != 0) && !vertical) {
                        if (this.move_up()){
                            this.rotate_left(true, horizantal);
                        }
                        return
                    }
                }
            }
        }
        this.current_t.rotation += 270;
    },

    rotate_right: function(vertical, horizantal){
        this.has_rotate = true;
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation + 90);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2);
                    var t_y = t_pos[1] + (i - 2);
                    if (t_x > 9) {
                        if (this.move_left() && !horizantal) {
                            this.rotate_right(vertical, true);
                        }
                        return
                    }
                    if (t_x < 0) {
                        if (this.move_right() && !horizantal) {
                            this.rotate_right(vertical, true);
                        }
                        return
                    }
                    if ((t_y > 20 || this.matrix[t_y][t_x] != 0) && !vertical) {
                        if (this.move_up()){
                            this.rotate_right(true, horizantal);
                        }
                        return
                    }
                }
            }
        }
        this.current_t.rotation += 90;
    },

    update_matrix: function () {
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2);
                    var t_y = t_pos[1] + (i - 2);
                    if (t_y <= 0) {
                        this.is_gameover = true
                        console.log("Game Over");
                        this.Gameover_board.getComponent(cc.Animation).play();
                        return
                    }
                    this.matrix[t_y][t_x] = row[j];
                }
            }
        }
    },

    draw_matrix: function () {
        
    },

    move_up: function() {
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2);
                    var t_y = t_pos[1] + (i - 2) - 1;
                    if (t_y > 19){ 
                        return false
                    }
                    if (t_x >= 0 && t_y >= 0 && this.matrix[t_y][t_x] != 0) {
                        return false
                    }
                }
            }
        }
        this.current_t.y += 35;
        return true
    },

    move_down: function () {
        var t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (var i = 0; i < t.length; i++) {
            var row = t[i];
            for (var j = 0; j < row.length; j++) {
                if (row[j] != 0) {
                    var t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    var t_x = t_pos[0] + (j - 2);
                    var t_y = t_pos[1] + (i - 2) + 1;
                    if (t_y > 19){
                        this.tetromino_lock = true
                        return false
                    }
                    if (t_x >= 0 && t_y >= 0 && this.matrix[t_y][t_x] != 0) {
                        this.tetromino_lock = true
                        return false
                    }
                }
            }
        }
        this.current_t.y -= 35;
        return true
    },


    update(dt) {
        if (!this.is_gameover) {
            if (this.down_count == this.update_dt && !this.tetromino_lock) {
                this.move_down()
                this.down_count = 0;
            }
            if (this.tetromino_lock) {
                this.transform_tetromino();
            }
            this.down_count++;
        }
    },

});

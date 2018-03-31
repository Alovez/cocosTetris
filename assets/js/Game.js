// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let tetromino = require('Tetromino');

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
        I_block: {
            default: null,
            type: cc.Prefab
        },
        J_block: {
            default: null,
            type: cc.Prefab
        },
        L_block: {
            default: null,
            type: cc.Prefab
        },
        O_block: {
            default: null,
            type: cc.Prefab
        },
        S_block: {
            default: null,
            type: cc.Prefab
        },
        T_block: {
            default: null,
            type: cc.Prefab
        },
        Z_block: {
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
            default: 332.5
        },
        play_groud: {
            default: null,
            type: cc.Sprite
        },
        prev_groud: {
            default: null,
            type: cc.Sprite
        },
        update_dt: 100,
        down_duration: 1,
        rotate_duration: 0.2,
        freeze_time_count_down: 1,
        freeze_opreation_count_down: 15,
        block_pool_size: 25
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tetromino_mapping = [this.I_Tetromino, this.J_Tetromino, this.L_Tetromino, this.O_Tetromino, this.S_Tetromino, this.T_Tetromino, this.Z_Tetromino];
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
        ];
        this.static_lines = [
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
            Array(),
        ];
        this.down_count = 0;
        this.tetromino_lock = false;
        this.current_t = null;
        this.next_tetromino = this.get_next_tetromino();
        this.tetromino_lock = true;
        this.down_action = cc.moveBy(this.down_duration, 0, 35);
        this.rotate_action = cc.rotateBy(this.rotate_duration, 90);
        this.is_gameover = false;
        this.has_rotate = false;
        this.has_hard = false;
        this.enable_down = true;

        this.I_block_pool = new cc.NodePool();
        this.J_block_pool = new cc.NodePool();
        this.L_block_pool = new cc.NodePool();
        this.O_block_pool = new cc.NodePool();
        this.S_block_pool = new cc.NodePool();
        this.T_block_pool = new cc.NodePool();
        this.Z_block_pool = new cc.NodePool();
        for (let i = 0; i < this.block_pool_size; ++i) {
            let ib = cc.instantiate(this.I_block);
            this.I_block_pool.put(ib);
            let jb = cc.instantiate(this.J_block);
            this.J_block_pool.put(jb);
            let lb = cc.instantiate(this.L_block);
            this.L_block_pool.put(lb);
            let ob = cc.instantiate(this.O_block);
            this.O_block_pool.put(ob);
            let sb = cc.instantiate(this.S_block);
            this.S_block_pool.put(sb);
            let tb = cc.instantiate(this.T_block);
            this.T_block_pool.put(tb);
            let zb = cc.instantiate(this.Z_block);
            this.Z_block_pool.put(zb);
        }
        this.block_mapping = {
            "I": this.I_block,
            "J": this.J_block,
            "L": this.L_block,
            "O": this.O_block,
            "S": this.S_block,
            "T": this.T_block,
            "Z": this.Z_block
        };
        this.block_pool_mapping = {
            "I": this.I_block_pool,
            "J": this.J_block_pool,
            "L": this.L_block_pool,
            "O": this.O_block_pool,
            "S": this.S_block_pool,
            "T": this.T_block_pool,
            "Z": this.Z_block_pool
        };

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.a:
                this.move_left();
                break;
            case cc.KEY.d:
                this.move_right();
                break;
            case cc.KEY.s:
                if (this.enable_down) {
                    this.move_down();
                }
                break;
            case cc.KEY.w:
                if (!this.has_hard) {
                    this.hard_drop();
                }
                break;
            case cc.KEY.left:
                if (!this.has_rotate) {
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
        switch (event.keyCode) {
            case cc.KEY.a:
                break;
            case cc.KEY.s:
                this.enable_down = true;
                break;
            case cc.KEY.w:
                this.has_hard = false;
                break;
            case cc.KEY.left:
                this.has_rotate = false;
                break;
            case cc.KEY.right:
                this.has_rotate = false;
                break;
        }
    },

    start() {

    },

    calculate_position: function (x, y) {
        let x_pos = 17.5 + 35 * (x - 5);
        let y_pos = 17.5 + 35 * (9 - y);
        return [x_pos, y_pos]
    },

    get_block_position: function (x, y) {
        if (this.current_t.name === 'O') {
            let x_pos = x / 35 + 6;
            let y_pos = 11 - y / 35;
            return [x_pos, y_pos]
        } else if (this.current_t.name === 'I') {
            let x_pos = (x - 35) / 35 + 6;
            let y_pos = 11 - y / 35;
            return [x_pos, y_pos]
        } else {
            let x_pos = (x - 17.5) / 35 + 6;
            let y_pos = 11 - (y - 17.5) / 35;
            return [x_pos, y_pos]
        }
    },

    get_next_tetromino: function () {
        let random_block = Math.floor(Math.random() * this.tetromino_mapping.length);
        let tetromino = cc.instantiate(this.tetromino_mapping[random_block]);
        tetromino.parent = this.prev_groud.node;
        tetromino.setPosition(0, -17.5);
        this.enable_down = false;
        return tetromino
    },

    transform_tetromino: function () {
        if (this.current_t != null) {
            this.update_matrix();
            this.current_t.removeFromParent();
        }
        this.current_t = this.next_tetromino;
        this.current_t.parent = this.play_groud.node;
        if (this.current_t.name === 'O' || this.current_t.name === 'I') {
            this.current_t.setPosition(this.start_x - 17.5, this.start_y - 17.5);
        } else {
            this.current_t.setPosition(this.start_x, this.start_y);
        }
        let next_t = this.get_next_tetromino();
        if (this.current_t.name === next_t.name) {
            next_t.removeFromParent();
            next_t = this.get_next_tetromino();
        }
        this.next_tetromino = next_t;
        this.tetromino_lock = false;

    },

    move_left: function () {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2) - 1;
                    let t_y = t_pos[1] + (i - 2);
                    if (t_x < 0) {
                        return false
                    }
                    if (t_y < 0 || this.matrix[t_y][t_x] !== 0) {
                        return false
                    }
                }
            }
        }
        this.current_t.x -= 35;
        return true
    },

    move_right: function () {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2) + 1;
                    let t_y = t_pos[1] + (i - 2);
                    if (t_x > 9) {
                        return false
                    }
                    if (t_y < 0 || this.matrix[t_y][t_x] !== 0) {
                        return false
                    }
                }
            }
        }
        this.current_t.x += 35;
        return true
    },

    rotate_left: function (vertical, horizantal) {
        this.has_rotate = true;
        if (this.current_t.name === "O") {
            return
        }
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation + 270);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2);
                    let t_y = t_pos[1] + (i - 2);
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
                    if ((t_y > 19 || this.matrix[t_y][t_x] !== 0) && !vertical) {
                        if (this.move_up()) {
                            this.rotate_left(true, horizantal);
                        }
                        return
                    }
                }
            }
        }
        this.current_t.rotation += 270;
    },

    rotate_right: function (vertical, horizantal) {
        this.has_rotate = true;
        if (this.current_t.name === "O") {
            return
        }
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation + 90);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2);
                    let t_y = t_pos[1] + (i - 2);
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
                    if ((t_y > 19 || this.matrix[t_y][t_x] !== 0) && !vertical) {
                        if (this.move_up()) {
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
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2);
                    let t_y = t_pos[1] + (i - 2);
                    if (t_y <= 0) {
                        this.is_gameover = true;
                        console.log("Game Over");
                        this.Gameover_board.getComponent(cc.Animation).play();
                        return
                    }
                    let static_block = this.get_block_by_name(this.current_t.name);
                    let pos = this.calculate_position(t_x, t_y);
                    static_block.parent = this.play_groud.node;
                    static_block.setPosition(pos[0], pos[1]);
                    this.static_lines[t_y].push(static_block);
                    this.matrix[t_y][t_x] = row[j];
                }
            }
        }
        this.clean_line();
    },

    clean_line: function () {
        let full_line_list = this.get_full_line().sort();

        for (let fullLineListKey in full_line_list) {
            let line = full_line_list[fullLineListKey];

            //down matrix
            for (let j = line; j > 0; j--) {
                this.matrix[j] = this.matrix[j - 1];
            }

            //remove block
            for (let staticLineKey in this.static_lines[line]) {
                let block = this.static_lines[line][staticLineKey];
                block.removeFromParent();
            }

            this.static_lines.splice(line, 1);
            this.static_lines.splice(0, 0, Array());

            // down block
            for (let i = line; i >= 0; i--) {
                for (let staticLineKeyi in this.static_lines[i]) {
                    this.static_lines[i][staticLineKeyi].y -= 35;
                }

            }

        }
    },

    get_full_line: function() {
        let full_line = [];
        for (let i = 0; i < this.matrix.length; i++) {
            let block_count = 0;
            for (let j = 0; j < this.matrix[0].length; j++) {
                if (this.matrix[i][j] !== 0) {
                    block_count++;
                }
            }
            if (block_count === 10) {
                full_line.push(i);
            }
        }
        return full_line
    },

    get_block_by_name: function (name) {
        let pool = this.block_pool_mapping[name];
        if (pool.size() > 0) {
            return pool.get()
        } else {
            return cc.instantiate(this.block_mapping[name]);
        }
    },

    draw_matrix: function () {

    },

    move_up: function () {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2);
                    let t_y = t_pos[1] + (i - 2) - 1;
                    if (t_y > 19) {
                        return false
                    }
                    if (t_x >= 0 && t_y >= 0 && this.matrix[t_y][t_x] !== 0) {
                        return false
                    }
                }
            }
        }
        this.current_t.y += 35;
        return true
    },

    move_down: function () {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y);
                    let t_x = t_pos[0] + (j - 2);
                    let t_y = t_pos[1] + (i - 2) + 1;
                    if (t_y > 19) {
                        this.tetromino_lock = true;
                        return false
                    }
                    if (t_x >= 0 && t_y >= 0 && this.matrix[t_y][t_x] !== 0) {
                        this.tetromino_lock = true;
                        return false
                    }
                }
            }
        }
        this.current_t.y -= 35;
        return true
    },

    hard_drop: function () {
        this.has_hard = true;
        for (; this.move_down();) {
        }
    },


    simulate_down: function (t_name, pos, rotate) {
        let t = tetromino.rotate_times(tetromino[t_name], rotate);
        let t_x = 0;
        let t_y = 0;
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = pos;
                    t_x = t_pos[0] + (j - 2);
                    t_y = t_pos[1] + (i - 2) + 1;
                    if (t_y > 19) {
                        return [pos[0], pos[1], false]
                    }
                    if (t_x >= 0 && t_y >= 0 && this.matrix[t_y][t_x] !== 0) {
                        return [t_pos[0], pos[1], false]
                    }
                }
            }
        }
        return [pos[0], pos[1] + 1, true]
    },


    update(dt) {
        if (!this.is_gameover) {
            if (this.down_count > this.update_dt && !this.tetromino_lock) {
                this.move_down();
                this.down_count = 0;
            }
            if (this.tetromino_lock) {
                console.log(this.matrix);
                this.transform_tetromino();

            }
            this.down_count++;
        }
    },

});

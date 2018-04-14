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
        bug_block: {
            default: null,
            type: cc.Prefab
        },

        Gameover_board: {
            default: null,
            type: cc.Sprite
        },
        Pause_board: {
            default: null,
            type: cc.Sprite
        },
        Score_board: {
            default: null,
            type: cc.Label
        },
        High_score_board: {
            default: null,
            type: cc.Label
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
        block_pool_size: 25,
        touch_size: 30,
        double_touch_delay: 10
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
            Array(),
            Array(),
        ];
        this.score = 0;
        this.high_score = cc.sys.localStorage.getItem('high_score');
        if (!this.high_score){
            this.high_score = 0;
        }
        this.down_count = 0;
        this.touch_count = -1;
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
        this.pause_drop = false;
        this.enable_touch = true;
        this.Pause_board.node.zIndex = -1;

        this.shadow_tetromino = null;
        this.shadow_pool = {
            "I": cc.instantiate(this.I_Tetromino),
            "J": cc.instantiate(this.J_Tetromino),
            "L": cc.instantiate(this.L_Tetromino),
            "O": cc.instantiate(this.O_Tetromino),
            "S": cc.instantiate(this.S_Tetromino),
            "T": cc.instantiate(this.T_Tetromino),
            "Z": cc.instantiate(this.Z_Tetromino),
        };

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
        this.block_droped_num = 0;
        this.line_clean_num = 0;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_handler, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.double_touch_handler, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.enable_touch = true;
        }, this);

        // this.bug_matrix = Array();
        //
        // for (let i = 0; i < this.matrix.length; i++) {
        //     let matrix_row = Array();
        //     for (let j = 0; j < this.matrix[i].length; j++) {
        //         let bug = cc.instantiate(this.bug_block);
        //         bug.setParent(this.play_groud.node);
        //         let pos = this.calculate_position(j, i);
        //         bug.setPosition(pos[0], pos[1]);
        //         bug.opacity = 0;
        //         matrix_row.push(bug);
        //     }
        //     this.bug_matrix.push(matrix_row)
        // }

    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    pause_handler: function (event, customEventData) {
        if (cc.game.isPaused()) {
            this.Pause_board.node.zIndex = -1;
            cc.game.resume();
        } else {
            this.Pause_board.node.zIndex = 10;
            cc.game.pause();
        }

    },

    restart_handler: function(event, customEventData) {
        cc.director.loadScene("game");
    },

    touch_handler: function (event) {
        if (this.enable_touch) {
            this.touch_count = -1;
            let delta = event.getDelta();
            console.log(delta);
            if (delta.x > this.touch_size && delta.x < this.touch_size * 2 && Math.abs(delta.y) < this.touch_size) {
                this.enable_touch = false;
                this.move_right();
            } else if (delta.x < -this.touch_size && delta.x > -this.touch_size * 2 && Math.abs(delta.y) < this.touch_size) {
                this.enable_touch = false;
                this.move_left();
            } else if (delta.x > this.touch_size * 2 && Math.abs(delta.y) < this.touch_size) {
                this.move_right();
            } else if (delta.x < -this.touch_size * 2 && Math.abs(delta.y) < this.touch_size) {
                this.move_left();
            } else if (delta.y > this.touch_size && Math.abs(delta.x) < this.touch_size) {
                this.enable_touch = false;
                this.hard_drop();
            } else if (delta.y < -this.touch_size && Math.abs(delta.x) < this.touch_size) {
                this.enable_touch = false;
                this.move_down();
            }
        }
    },


    double_touch_handler: function (event) {
        console.log("enter touch start with ", this.touch_count);
        if (this.touch_count < 0) {
            this.touch_count = 1;
        } else if (this.touch_count > this.double_touch_delay) {
            this.touch_count = -1;
        } else if (this.touch_count > 0 && this.touch_count < this.double_touch_delay) {
            console.log("double touch");
            this.touch_count = -1;
            let mid_line = cc.view.getFrameSize().width / 2;
            let delta = event.getLocationX();
            if (delta < mid_line) {
                this.rotate_left()
            } else if (delta > mid_line) {
                this.rotate_right()
            }
        }
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
        let y_pos = 17.5 + 35 * (11 - y);
        return [x_pos, y_pos]
    },

    get_block_position: function (x, y, i, j) {
        if (this.current_t.name === 'O') {
            let x_pos = x / 35 + 6;
            let y_pos = 12 - y / 35;
            return [x_pos + j - 2, y_pos + (i - 1)]
        } else if (this.current_t.name === 'I') {
            let x_pos = (x - 35) / 35 + 6;
            let y_pos = 11 - y / 35;
            return [x_pos + (j - 2), y_pos + (i - 1)]
        } else {
            let x_pos = (x - 17.5) / 35 + 5;
            let y_pos = 11 - (y - 17.5) / 35;
            return [x_pos + (j - 1), y_pos + (i - 1)];
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
        this.block_droped_num++;
        if (this.current_t != null) {
            this.update_matrix();
            this.current_t.removeFromParent();
            this.remove_shadow();
        }
        this.current_t = this.next_tetromino;
        this.current_t.parent = this.play_groud.node;

        if (this.current_t.name === 'O' || this.current_t.name === 'I') {
            this.current_t.setPosition(this.start_x - 17.5, this.start_y + 17.5);
        } else {
            this.current_t.setPosition(this.start_x, this.start_y);
        }
        this.shadow_tetromino = this.shadow_pool[this.current_t.name];
        this.shadow_tetromino.parent = this.play_groud.node;
        this.update_shadow();
        if (!this.can_move('add')) {
            this.game_over_handler();
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
        if (this.can_move('left')) {
            this.current_t.x -= 35;
            return true
        }
        return false
    },

    move_right: function () {
        if (this.can_move('right')) {
            this.current_t.x += 35;
            return true
        }
        return false
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
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y, i, j);
                    let t_x = t_pos[0];
                    let t_y = t_pos[1];
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
                    if ((t_y > 21 || (t_y > 0 && this.matrix[t_y][t_x] !== 0)) && !vertical) {
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
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y, i, j);
                    let t_x = t_pos[0];
                    let t_y = t_pos[1];
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
                    if ((t_y > 21 || (t_y > 0 && this.matrix[t_y][t_x] !== 0)) && !vertical) {
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

    game_over_handler: function () {
        this.is_gameover = true;
        console.log(this.block_droped_num);
        console.log(this.line_clean_num);
        console.log("Game Over");
        this.Gameover_board.getComponent(cc.Animation).play();
    },

    update_matrix: function () {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);

        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y, i, j);
                    let t_x = t_pos[0];
                    let t_y = t_pos[1];
                    if (t_y <= 0) {
                        this.game_over_handler();
                        return
                    }
                    this.set_static_block(t_x, t_y);
                    this.matrix[t_y][t_x] = row[j];
                }
            }
        }
        this.clean_line();
    },

    set_static_block: function (x, y) {
        let static_block = this.get_block_by_name(this.current_t.name);
        let pos = this.calculate_position(x, y);
        static_block.parent = this.play_groud.node;
        static_block.setPosition(pos[0], pos[1]);
        this.static_lines[y].push(static_block);
    },

    deepCopy: function (obj) {
        if (typeof obj !== 'object') {
            return obj;
        }
        let newobj = {};
        for (let attr in obj) {
            newobj[attr] = this.deepCopy(obj[attr]);
        }
        return newobj;
    },

    clean_line: function () {
        this.pause_drop = true;
        let full_line_list = this.get_full_line().sort();
        switch (full_line_list.length) {
            case 1:
                this.score += 100;
                break;
            case 2:
                this.score += 300;
                break;
            case 3:
                this.score += 500;
                break;
            case 4:
                this.score += 800;
        }

        if (full_line_list.length) {
            this.line_clean_num++;
            console.log(this.line_clean_num)
            for (let fullLineListKey in full_line_list) {
                let line = full_line_list[fullLineListKey];

                //down matrix
                for (let j = line; j > 0; j--) {
                    this.matrix[j] = this.deepCopy(this.matrix[j - 1]);
                    // console.log('Debug Count: ' + j);
                    // console.log(this.matrix);
                }

                //remove block
                for (let staticLineKey in this.static_lines[line]) {
                    let block = this.static_lines[line][staticLineKey];
                    block.removeFromParent();
                    this.block_pool_mapping[block.name.substr(-1)].put(block);
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
        }
        this.pause_drop = false;
    },

    get_full_line: function () {
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
        // console.log(pool);
        if (pool.size() > 0) {
            return pool.get()
        } else {
            return cc.instantiate(this.block_mapping[name]);
        }
    },

    render_matrix: function () {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j] === 0) {
                    this.bug_matrix[i][j].opacity = 255;
                } else {
                    this.bug_matrix[i][j].opacity = 0;
                }
            }

        }
    },

    move_up: function () {
        if (this.can_move('up')) {
            this.current_t.y += 35;
            return true
        }
        return false
    },

    move_down: function () {
        this.score += 1;
        if (this.can_move('down')) {
            this.current_t.y -= 35;
            return true
        }
        this.tetromino_lock = true;
        return false
    },


    can_move: function (movement) {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], this.current_t.rotation);
        let delta_x = 0;
        let delta_y = 0;
        if (movement === 'left') {
            delta_x = -1;
        } else if (movement === 'right') {
            delta_x = 1;
        } else if (movement === 'down') {
            delta_y = 1;
        } else if (movement === 'up') {
            delta_y = -1;
        } else if (movement === 'add') {
        } else {
            return false
        }

        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(this.current_t.x, this.current_t.y, i, j);
                    let t_x = t_pos[0] + delta_x;
                    let t_y = t_pos[1] + delta_y;
                    if (t_x < 0 || t_x > 9) {
                        return false;
                    }
                    if (t_y < 0 || t_y > 21) {
                        return false
                    }
                    if (this.matrix[t_y][t_x] !== 0) {
                        return false
                    }
                }
            }
        }

        return true
    },

    hard_drop: function () {
        this.has_hard = true;
        for (; this.move_down();) {
        }
    },

    update_shadow: function () {
        let t_pos = this.simulate_down([this.current_t.x, this.current_t.y], this.current_t.rotation);
        this.shadow_tetromino.rotation = this.current_t.rotation;
        this.shadow_tetromino.opacity = 125;
        this.shadow_tetromino.setPosition(t_pos[0], t_pos[1]);
    },

    simulate_down: function (pos, rotate) {
        let t = tetromino.rotate_times(tetromino[this.current_t.name], rotate);
        for (let i = 0; i < t.length; i++) {
            let row = t[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== 0) {
                    let t_pos = this.get_block_position(pos[0], pos[1], i, j);
                    let t_x = t_pos[0];
                    let t_y = t_pos[1] + 1;
                    if (t_y > 21) {
                        return [pos[0], pos[1]]
                    }
                    if (t_y >= 0 && this.matrix[t_y][t_x] !== 0) {
                        return [pos[0], pos[1]]
                    }
                }
            }
        }
        return this.simulate_down([pos[0], pos[1] - 35], rotate);
    },

    remove_shadow: function () {
        this.shadow_tetromino.removeFromParent();
    },

    update_score: function () {
        this.Score_board.string = this.score;
        if (this.high_score !== null && this.high_score < this.score){
            this.high_score = this.score;
        }
        this.High_score_board.string = this.high_score
    },

    update(dt) {
        // if (this.block_droped_num === 60){
        //     this.block_droped_num = 0;
        //     this.current_t = this.get_block_by_name('J');
        //     let I = this.get_block_by_name('I');
        //
        //     I.setParent(this.play_groud.node);
        //     let pos = this.calculate_position(this.down_count % 10, Math.floor(this.down_count/10));
        //     I.setPosition(pos[0], pos[1]);
        //     for (let i = 0; i < 3; i++) {
        //         for (let j = 0; j < 3; j++) {
        //             let J = this.get_block_by_name('J');
        //             J.setParent(this.play_groud.node);
        //             let c_pos = this.calculate_position(this.down_count % 10, Math.floor(this.down_count/10));
        //             let t_pos = this.get_block_position(c_pos[0],c_pos[1], i, j);
        //             let n_pos = this.calculate_position(t_pos[0], t_pos[1]);
        //             J.setPosition(n_pos[0], n_pos[1]);
        //         }
        //     }
        //     this.down_count++;
        // }
        // this.block_droped_num++;
        if (this.pause_drop) {
            return
        }
        if (this.touch_count > 0) {
            this.touch_count += 1;
        }
        if (!this.is_gameover) {
            if (this.down_count > this.update_dt && !this.tetromino_lock) {
                this.score -= 1;
                this.move_down();
                cc.sys.localStorage.setItem('high_score', this.high_score);
                this.down_count = 0;
            }
            if (this.tetromino_lock) {
                this.transform_tetromino();
                this.down_count = 0;
            }
            this.down_count++;
            this.update_shadow();
            this.update_score();
        }
    },

});

// config.js - v2

let tetromino = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    O: [
        [4, 4],
        [4, 4]
    ],
    S: [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    Z: [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ],
    rotate_right: function (shape) {
        let new_shape = Array(shape.length);
        for (let i = 0; i < shape.length; i++) {
            let new_row = Array(shape.length);
            for (let j = 0; j < shape.length; j++) {
                new_row[shape.length - j - 1] = shape[j][i];
            }
            new_shape[i] = new_row;
        }
        return new_shape
    },

    rotate_left: function (shape) {
        let new_shape = Array(shape.length);
        for (let i = 0; i < shape.length; i++) {
            let new_row = Array(shape.length);
            for (let j = 0; j < shape.length; j++) {
                new_row[j] = shape[j][shape.length - 1 - i]
            }
            new_shape[i] = new_row;
        }
        return new_shape
    },

    rotate_times: function (shape, rotation) {
        let new_shape = shape;
        let simple_rotate = rotation % 360;
        if (simple_rotate === 90) {
            return this.rotate_right(shape);
        } else if (simple_rotate === 270) {
            return this.rotate_left(shape);
        } else if (simple_rotate === 180) {
            let mid_shape = this.rotate_left(shape);
            return this.rotate_left(mid_shape);
        } else {
            return shape
        }
    },

    get_tetromino: function (last_t) {
        let t_list = ['I', 'J', 'L', 'S', 'T', 'Z'];
        let t = t_list[Math.floor(Math.random() * t_list.length)];
        if (last_t && t === last_t) {
            t = t_list[Math.floor(Math.random() * t_list.length)];
        }
        return t
    }
};

module.exports = tetromino;
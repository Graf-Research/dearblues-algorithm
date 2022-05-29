var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Point } from "../point";
import { FloydWarshall } from "./floyd-warshall";
var ForceDirectedKamadaKawai = /** @class */ (function () {
    function ForceDirectedKamadaKawai(_) {
        var _a, _b, _c, _d, _e;
        this.points = [];
        this.adjacency_matrix = [];
        this.spring_mat = [];
        this.current_max_vertex_energy = { energy: -1, index: -1 };
        this.iteration = 1;
        this.list_vertex = [];
        this.list_edge = [];
        this.list_vertex = _.list_vertex;
        this.list_edge = _.list_edge;
        this.K = (_a = _.K) !== null && _a !== void 0 ? _a : 5;
        this.L0 = (_b = _.L0) !== null && _b !== void 0 ? _b : 100;
        this.max_vertex_iteration = (_c = _.max_vertex_iteration) !== null && _c !== void 0 ? _c : 500;
        this.max_iteration = (_d = _.max_iteration) !== null && _d !== void 0 ? _d : 4000;
        this.energy_threshold = (_e = _.energy_threshold) !== null && _e !== void 0 ? _e : 0.01;
        this.initialize();
    }
    ForceDirectedKamadaKawai.prototype.printAdjacencyMatrix = function () {
        var output = "\n\t";
        for (var i = 0; i < this.list_vertex.length; i++) {
            output += this.list_vertex[i].label.slice(0, 2) + "\t";
        }
        output += "\n";
        for (var i = 0; i < this.list_vertex.length; i++) {
            output += this.list_vertex[i].label.slice(0, 2) + "\t";
            for (var j = 0; j < this.list_vertex.length; j++) {
                output += (this.adjacency_matrix[i][j] ? "1" : "0") + "\t";
            }
            output += "\n";
        }
    };
    ForceDirectedKamadaKawai.prototype.printPositions = function () {
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            console.log("".concat(this.list_vertex[i].label, "(").concat(point.x.toFixed(2), ", ").concat(point.y.toFixed(2), ")"));
        }
    };
    ForceDirectedKamadaKawai.prototype.reset = function () {
        this.initialize();
    };
    ForceDirectedKamadaKawai.prototype.calculateVerticesPosition = function () {
        var _this = this;
        return this.iterate().map(function (p, i) {
            var cv = __assign(__assign({}, _this.list_vertex[i]), { x: p.x, y: p.y });
            return cv;
        });
    };
    ForceDirectedKamadaKawai.prototype.initialize = function () {
        var _this = this;
        this.points = this.list_vertex.map(function () { return new Point({ x: Math.random() * _this.L0, y: Math.random() * _this.L0 }); });
        this.defineAdjacencyMatrix();
        this.initializeSpringMatrix();
    };
    ForceDirectedKamadaKawai.prototype.defineAdjacencyMatrix = function () {
        var _this = this;
        this.adjacency_matrix = this.list_vertex.map(function (u) { return _this.list_vertex.map(function (v) { return false; }); });
        var _loop_1 = function (edge) {
            var index_pos_v1 = this_1.list_vertex.findIndex(function (v) { return v.label === edge.v1.label; });
            var index_pos_v2 = this_1.list_vertex.findIndex(function (v) { return v.label === edge.v2.label; });
            this_1.adjacency_matrix[index_pos_v1][index_pos_v2] = true;
            this_1.adjacency_matrix[index_pos_v2][index_pos_v1] = true;
        };
        var this_1 = this;
        for (var _i = 0, _a = this.list_edge; _i < _a.length; _i++) {
            var edge = _a[_i];
            _loop_1(edge);
        }
    };
    ForceDirectedKamadaKawai.prototype.initializeSpringMatrix = function () {
        // define vertex distance
        var fm = new FloydWarshall(this.list_vertex, this.points, this.adjacency_matrix);
        var distance_mat = fm.getDistanceMatrix();
        // define biggest length
        var biggest_distance = 0;
        for (var i = 0; i < this.list_vertex.length; i++) {
            for (var j = 0; j < this.list_vertex.length; j++) {
                if (distance_mat[i][j] > biggest_distance) {
                    biggest_distance = distance_mat[i][j];
                }
            }
        }
        // define spring strength and length
        var Length = this.L0 / biggest_distance;
        for (var i = 0; i < this.list_vertex.length; i++) {
            this.spring_mat[i] = [];
            for (var j = 0; j < this.list_vertex.length; j++) {
                if (i === j) {
                    this.spring_mat[i][j] = {
                        length: 0,
                        strength: 0
                    };
                    continue;
                }
                this.spring_mat[i][j] = {
                    length: Length * distance_mat[i][j],
                    strength: this.K / Math.pow(distance_mat[i][j], 2)
                };
            }
        }
    };
    ForceDirectedKamadaKawai.prototype.vertexEnergy = function (m) {
        var x_energy = 0;
        var y_energy = 0;
        for (var i = 0; i < this.list_vertex.length; i++) {
            if (i === m) {
                continue;
            }
            var delta_x = this.points[m].x - this.points[i].x;
            var delta_y = this.points[m].y - this.points[i].y;
            var denominator1_2 = 1 / Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
            var spring = this.spring_mat[m][i];
            x_energy += spring.strength * delta_x * (1 - spring.length * denominator1_2);
            y_energy += spring.strength * delta_y * (1 - spring.length * denominator1_2);
        }
        return {
            x: x_energy,
            y: y_energy
        };
    };
    ForceDirectedKamadaKawai.prototype.maxVertexEnergy = function () {
        var max_energy = {
            energy: -1,
            index: -1
        };
        for (var i = 0; i < this.list_vertex.length; i++) {
            var ve = this.vertexEnergy(i);
            var vertext_energy_i = Math.sqrt(Math.pow(ve.x, 2) + Math.pow(ve.y, 2));
            if (vertext_energy_i > max_energy.energy) {
                max_energy.energy = vertext_energy_i;
                max_energy.index = i;
            }
        }
        if (max_energy.index === -1) {
            throw new Error("Vertex energy index error: current max energy = ".concat(this.current_max_vertex_energy.energy));
        }
        return max_energy;
    };
    ForceDirectedKamadaKawai.prototype.solveDxDyMovement = function (m, energy_x, energy_y) {
        var x_e = energy_x, y_e = energy_y, xx_e = 0, xy_e = 0, yx_e = 0, yy_e = 0;
        for (var i = 0; i < this.list_vertex.length; i++) {
            if (i === m) {
                continue;
            }
            var delta_x = this.points[m].x - this.points[i].x;
            var delta_y = this.points[m].y - this.points[i].y;
            var spring = this.spring_mat[m][i];
            var denominator3_2 = 1 / Math.pow((Math.pow(delta_x, 2) + Math.pow(delta_y, 2)), 1.5);
            xy_e += spring.strength * spring.length * delta_x * delta_y * denominator3_2;
            xx_e += spring.strength * (1 - spring.length * Math.pow(delta_y, 2) * denominator3_2);
            yy_e += spring.strength * (1 - spring.length * Math.pow(delta_x, 2) * denominator3_2);
        }
        yx_e = xy_e;
        var denominator = 1 / (xy_e * yx_e - xx_e * yy_e);
        return new Point({
            x: (yy_e * x_e - xy_e * y_e) * denominator,
            y: (xx_e * y_e - yx_e * x_e) * denominator
        });
    };
    ForceDirectedKamadaKawai.prototype.iterate = function () {
        this.current_max_vertex_energy = this.maxVertexEnergy();
        while (this.current_max_vertex_energy.energy > this.energy_threshold && this.iteration < this.max_iteration) {
            var vertex_count = 0;
            var ve = this.vertexEnergy(this.current_max_vertex_energy.index);
            var vertext_energy_i = Math.sqrt(Math.pow(ve.x, 2) + Math.pow(ve.y, 2));
            while (vertext_energy_i > this.energy_threshold && vertex_count < this.max_vertex_iteration) {
                var movement = this.solveDxDyMovement(this.current_max_vertex_energy.index, ve.x, ve.y);
                this.points[this.current_max_vertex_energy.index] = this.points[this.current_max_vertex_energy.index].add(movement);
                ve = this.vertexEnergy(this.current_max_vertex_energy.index);
                vertext_energy_i = Math.sqrt(Math.pow(ve.x, 2) + Math.pow(ve.y, 2));
                vertex_count++;
            }
            this.current_max_vertex_energy = this.maxVertexEnergy();
            this.iteration++;
        }
        return this.points;
    };
    return ForceDirectedKamadaKawai;
}());
export { ForceDirectedKamadaKawai };

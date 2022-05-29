"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceDirectedFruchtermanReingold = void 0;
var point_1 = require("../point");
var ForceDirectedFruchtermanReingold = /** @class */ (function () {
    function ForceDirectedFruchtermanReingold(_) {
        var _a, _b, _c, _d;
        this.points = [];
        this.adjacency_matrix = [];
        this.list_vertex = [];
        this.list_edge = [];
        this.cooling_factor = 0;
        this.ideal_length = 0;
        this.iteration = 1;
        this.latest_max_force = point_1.Point.maxSafeInt();
        this.cooling_factor = (_a = _.cooling_factor) !== null && _a !== void 0 ? _a : 0.05;
        this.ideal_length = (_b = _.ideal_length) !== null && _b !== void 0 ? _b : 100;
        this.max_iteration = (_c = _.max_iteration) !== null && _c !== void 0 ? _c : 1500;
        this.euclidean_threeshold = (_d = _.euclidean_threeshold) !== null && _d !== void 0 ? _d : 0.001;
        this.list_vertex = _.list_vertex;
        this.list_edge = _.list_edge;
        this.initializePointsPosition();
    }
    ForceDirectedFruchtermanReingold.prototype.printAdjacencyMatrix = function () {
        var output = "\t";
        for (var i = 0; i < this.list_vertex.length; i++) {
            output += this.list_vertex[i].label + "\t";
        }
        output += "\n";
        for (var i = 0; i < this.list_vertex.length; i++) {
            output += this.list_vertex[i].label + "\t";
            for (var j = 0; j < this.list_vertex.length; j++) {
                output += (this.adjacency_matrix[i][j] ? "1" : "0") + "\t";
            }
            output += "\n";
        }
        console.log(output);
    };
    ForceDirectedFruchtermanReingold.prototype.printPositions = function () {
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            console.log("".concat(this.list_vertex[i].label, "(").concat(point.x.toFixed(2), ", ").concat(point.y.toFixed(2), ")"));
        }
    };
    ForceDirectedFruchtermanReingold.prototype.runIteration = function (n) {
        if (n === void 0) { n = 1; }
        for (var i = 0; i < n; i++) {
            this.iterate();
        }
    };
    ForceDirectedFruchtermanReingold.prototype.reset = function () {
        this.initializePointsPosition();
        this.iteration = 1;
        this.latest_max_force = point_1.Point.maxSafeInt();
    };
    ForceDirectedFruchtermanReingold.prototype.addVertex = function (v) {
        this.list_vertex.push(v);
        this.points.push(new point_1.Point({ x: Math.random() * this.ideal_length, y: Math.random() * this.ideal_length }));
        this.defineAdjacencyMatrix();
    };
    ForceDirectedFruchtermanReingold.prototype.addEdge = function (e) {
        this.list_edge.push({
            v1: this.list_vertex.find(function (v) { return v.label === e.v1.label; }),
            v2: this.list_vertex.find(function (v) { return v.label === e.v2.label; })
        });
        this.defineAdjacencyMatrix();
    };
    ForceDirectedFruchtermanReingold.prototype.initializePointsPosition = function () {
        var _this = this;
        this.points = this.list_vertex.map(function () { return new point_1.Point({ x: Math.random() * _this.ideal_length, y: Math.random() * _this.ideal_length }); });
        // const angle = 2 * Math.PI / this.list_vertex.length;
        // this.points = this.list_vertex.map((v: Vertex, i) => new Point({
        //   x: this.ideal_length * Math.cos(angle * i) + 0,
        //   y: this.ideal_length * Math.sin(angle * i) + 0,
        // }));
        this.defineAdjacencyMatrix();
    };
    ForceDirectedFruchtermanReingold.prototype.defineAdjacencyMatrix = function () {
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
    ForceDirectedFruchtermanReingold.prototype.repulsiveForce = function (index_u, index_v) {
        var p_u = this.points[index_u];
        var p_v = this.points[index_v];
        return point_1.Point.unitVector(p_u, p_v).multiply(Math.pow(this.ideal_length, 2) / point_1.Point.euclideanDistance(p_v, p_u));
    };
    ForceDirectedFruchtermanReingold.prototype.attractiveForce = function (index_u, index_v) {
        var p_u = this.points[index_u];
        var p_v = this.points[index_v];
        return point_1.Point.unitVector(p_v, p_u).multiply(Math.pow(point_1.Point.euclideanDistance(p_u, p_v), 2) / this.ideal_length);
    };
    ForceDirectedFruchtermanReingold.prototype.calculateVerticesPosition = function () {
        var _this = this;
        return this.iterate().map(function (p, i) {
            var cv = __assign(__assign({}, _this.list_vertex[i]), { x: p.x, y: p.y });
            return cv;
        });
    };
    ForceDirectedFruchtermanReingold.prototype.iterate = function () {
        while (point_1.Point.euclideanDistance(point_1.Point.zero(), this.latest_max_force) > this.euclidean_threeshold && this.iteration < this.max_iteration) {
            var force_list = [];
            for (var i = 0; i < this.points.length; i++) {
                force_list[i] = point_1.Point.zero();
            }
            for (var u = 0; u < this.points.length; u++) {
                var temp_max = point_1.Point.zero();
                for (var v = 0; v < this.points.length; v++) {
                    if (u === v) {
                        continue;
                    }
                    if (this.adjacency_matrix[u][v]) {
                        force_list[v] = force_list[v].add(this.attractiveForce(u, v));
                    }
                    else {
                        force_list[v] = force_list[v].add(this.repulsiveForce(u, v));
                    }
                    temp_max = point_1.Point.max(temp_max, force_list[v]);
                }
                this.latest_max_force = temp_max;
            }
            for (var i = 0; i < this.points.length; i++) {
                this.points[i] = this.points[i].add(force_list[i].multiply(this.cooling_factor));
            }
            this.iteration++;
        }
        return this.points;
    };
    return ForceDirectedFruchtermanReingold;
}());
exports.ForceDirectedFruchtermanReingold = ForceDirectedFruchtermanReingold;

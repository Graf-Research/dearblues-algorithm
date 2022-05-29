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
var ForceDirectedEades = /** @class */ (function () {
    function ForceDirectedEades(_) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.points = [];
        this.adjacency_matrix = [];
        this.list_vertex = [];
        this.list_edge = [];
        this.repulsion_constant = 0;
        this.spring_constant = 0;
        this.gravity_constant = 0;
        this.cooling_factor = 0;
        this.ideal_length = 0;
        this.iteration = 1;
        this.latest_max_force = Point.maxSafeInt();
        this.repulsion_constant = (_a = _.repulsion_constant) !== null && _a !== void 0 ? _a : 1050;
        this.spring_constant = (_b = _.spring_constant) !== null && _b !== void 0 ? _b : 50;
        this.gravity_constant = (_c = _.gravity_constant) !== null && _c !== void 0 ? _c : 0;
        this.cooling_factor = (_d = _.cooling_factor) !== null && _d !== void 0 ? _d : 0.95;
        this.ideal_length = (_e = _.ideal_length) !== null && _e !== void 0 ? _e : 250;
        this.list_vertex = _.list_vertex;
        this.list_edge = _.list_edge;
        this.max_iteration = (_f = _.max_iteration) !== null && _f !== void 0 ? _f : 500;
        this.euclidean_threeshold = (_g = _.euclidean_threeshold) !== null && _g !== void 0 ? _g : 0.001;
        this.initializePointsPosition();
    }
    ForceDirectedEades.prototype.printAdjacencyMatrix = function () {
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
    ForceDirectedEades.prototype.printPositions = function () {
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            console.log("".concat(this.list_vertex[i].label, "(").concat(point.x.toFixed(2), ", ").concat(point.y.toFixed(2), ")"));
        }
    };
    ForceDirectedEades.prototype.runIteration = function (n) {
        if (n === void 0) { n = 1; }
        if (n === 1) {
            this.iterate();
            return;
        }
        for (var i = 0; i < n; i++) {
            this.iterate();
        }
    };
    ForceDirectedEades.prototype.reset = function () {
        this.initializePointsPosition();
        this.iteration = 0;
        this.latest_max_force = Point.maxSafeInt();
    };
    ForceDirectedEades.prototype.addVertex = function (v) {
        this.list_vertex.push(v);
        this.points.push(new Point({ x: Math.random() * this.ideal_length, y: Math.random() * this.ideal_length }));
        this.defineAdjacencyMatrix();
    };
    ForceDirectedEades.prototype.addEdge = function (e) {
        this.list_edge.push({
            v1: this.list_vertex.find(function (v) { return v.label === e.v1.label; }),
            v2: this.list_vertex.find(function (v) { return v.label === e.v2.label; })
        });
        this.defineAdjacencyMatrix();
    };
    ForceDirectedEades.prototype.initializePointsPosition = function () {
        var _this = this;
        this.points = this.list_vertex.map(function (v, i) { return new Point({ x: Math.random() * _this.ideal_length / 10, y: Math.random() * _this.ideal_length / 10 }); });
        this.defineAdjacencyMatrix();
    };
    ForceDirectedEades.prototype.defineAdjacencyMatrix = function () {
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
    ForceDirectedEades.prototype.baryCenter = function () {
        if (this.list_vertex.length === 0) {
            return Point.zero();
        }
        return this.points.reduce(function (acc, curr) { return acc.add(curr); }, Point.zero()).divide(this.list_vertex.length);
    };
    ForceDirectedEades.prototype.repulsiveForce = function (index_u, index_v) {
        if (this.adjacency_matrix[index_u][index_v]) {
            return Point.zero();
        }
        var p_u = this.points[index_u];
        var p_v = this.points[index_v];
        return Point.unitVector(p_u, p_v).multiply(this.repulsion_constant / Math.pow(Point.euclideanDistance(p_v, p_u), 2));
    };
    ForceDirectedEades.prototype.attractiveForce = function (index_u, index_v) {
        if (!this.adjacency_matrix[index_u][index_v]) {
            return Point.zero();
        }
        var p_u = this.points[index_u];
        var p_v = this.points[index_v];
        return Point.unitVector(p_v, p_u).multiply(this.spring_constant * Math.log(Point.euclideanDistance(p_v, p_u) / this.ideal_length));
    };
    ForceDirectedEades.prototype.gravityForce = function (p_v, p_bary) {
        var index_pos = this.points.findIndex(function (p) { return p === p_v; });
        var mass = 1 + this.adjacency_matrix[index_pos].reduce(function (acc, curr) { return acc + (curr ? 1 : 0); }, 0) / 4;
        return Point.unitVector(p_v, p_bary).multiply(this.gravity_constant).multiply(mass);
    };
    ForceDirectedEades.prototype.calculateVerticesPosition = function () {
        var _this = this;
        return this.iterate().map(function (p, i) {
            var cv = __assign(__assign({}, _this.list_vertex[i]), { x: p.x, y: p.y });
            return cv;
        });
    };
    ForceDirectedEades.prototype.iterate = function () {
        while (Point.euclideanDistance(Point.zero(), this.latest_max_force) > this.euclidean_threeshold && this.iteration < this.max_iteration) {
            var force_list = [];
            for (var u = 0; u < this.points.length; u++) {
                force_list[u] = Point.zero();
            }
            var p_bary = this.baryCenter();
            for (var u = 0; u < this.points.length; u++) {
                var temp_max = Point.zero();
                for (var v = 0; v < this.points.length; v++) {
                    if (u === v) {
                        continue;
                    }
                    force_list[v] = force_list[v]
                        .add(this.repulsiveForce(u, v))
                        .add(this.attractiveForce(u, v))
                        .add(this.gravityForce(this.points[v], p_bary));
                    temp_max = Point.max(temp_max, force_list[v]);
                }
                this.latest_max_force = temp_max;
            }
            for (var u = 0; u < this.points.length; u++) {
                this.points[u] = this.points[u].add(force_list[u].multiply(this.cooling_factor));
            }
            this.iteration++;
        }
        return this.points;
    };
    return ForceDirectedEades;
}());
export { ForceDirectedEades };

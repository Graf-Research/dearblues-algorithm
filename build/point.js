var Point = /** @class */ (function () {
    function Point(_) {
        if (!_) {
            return;
        }
        this.x = _.x;
        this.y = _.y;
    }
    Point.prototype.isNotSet = function () {
        return this.x === undefined || this.y === undefined;
    };
    Point.zero = function () {
        return new Point({ x: 0, y: 0 });
    };
    Point.maxSafeInt = function () {
        return new Point({ x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER });
    };
    Point.euclideanDistance = function (p1, p2) {
        if (p1.isNotSet()) {
            throw new Error("p1 components (x, y) is not defined yet-1");
        }
        if (p2.isNotSet()) {
            throw new Error("p2 components (x, y) is not defined yet 0");
        }
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };
    Point.prototype.add = function (p) {
        if (this.isNotSet()) {
            throw new Error("this components (x, y) is not defined yet 1");
        }
        if (p.isNotSet()) {
            throw new Error("p components (x, y) is not defined yet 2");
        }
        return new Point({ x: this.x + p.x, y: this.y + p.y });
    };
    Point.prototype.subtract = function (p) {
        if (this.isNotSet()) {
            throw new Error("this components (x, y) is not defined yet 3");
        }
        if (p.isNotSet()) {
            throw new Error("p components (x, y) is not defined yet 4");
        }
        return new Point({ x: this.x - p.x, y: this.y - p.y });
    };
    Point.prototype.divide = function (c) {
        if (this.isNotSet()) {
            throw new Error("this components (x, y) is not defined yet 5");
        }
        if (c === 0) {
            throw new Error("Divider constance cannot be zero");
        }
        return new Point({ x: this.x / c, y: this.y / c });
    };
    Point.prototype.multiply = function (c) {
        if (this.isNotSet()) {
            throw new Error("this components (x, y) is not defined yet 6");
        }
        return new Point({ x: this.x * c, y: this.y * c });
    };
    Point.unitVector = function (p1, p2) {
        if (p1.isNotSet()) {
            throw new Error("p1 components (x, y) is not defined yet 7");
        }
        if (p2.isNotSet()) {
            throw new Error("p2 components (x, y) is not defined yet 8");
        }
        var euc_distance = this.euclideanDistance(p1, p2);
        if (euc_distance === 0) {
            // throw new Error(`Euclidean distance equals to zero`);
            return p2.subtract(p1);
        }
        return p2.subtract(p1).divide(euc_distance);
    };
    Point.max = function (p1, p2) {
        var zero = Point.zero();
        return Point.euclideanDistance(zero, p1) > Point.euclideanDistance(zero, p2) ? p1 : p2;
    };
    Point.min = function (p1, p2) {
        var zero = Point.zero();
        return Point.euclideanDistance(zero, p1) < Point.euclideanDistance(zero, p2) ? p1 : p2;
    };
    return Point;
}());
export { Point };

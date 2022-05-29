var FloydWarshall = /** @class */ (function () {
    function FloydWarshall(list_vertex, list_point, adjacency_matrix) {
        this.list_vertex = [];
        this.list_point = [];
        this.adjacency_matrix = [];
        this.distance_matrix = [];
        this.list_vertex = list_vertex;
        this.list_point = list_point;
        this.adjacency_matrix = adjacency_matrix;
    }
    FloydWarshall.prototype.printDistanceMatrix = function () {
        var output = "\n\t";
        for (var i = 0; i < this.list_vertex.length; i++) {
            output += this.list_vertex[i].label.slice(0, 2) + "\t";
        }
        output += "\n";
        for (var i = 0; i < this.list_vertex.length; i++) {
            output += this.list_vertex[i].label.slice(0, 2) + "\t";
            for (var j = 0; j < this.list_vertex.length; j++) {
                output += this.distance_matrix[i][j] + "\t";
            }
            output += "\n";
        }
    };
    FloydWarshall.prototype.getDistanceMatrix = function () {
        var distance_mat = [];
        for (var i = 0; i < this.list_point.length; i++) {
            distance_mat[i] = [];
            for (var j = 0; j < this.list_point.length; j++) {
                if (i === j) {
                    distance_mat[i][j] = 0;
                    continue;
                }
                if (this.adjacency_matrix[i][j]) {
                    distance_mat[i][j] = this.list_vertex[i].weight + this.list_vertex[j].weight;
                    continue;
                }
                distance_mat[i][j] = Infinity;
            }
        }
        for (var k = 0; k < this.list_point.length; k++) {
            for (var i = 0; i < this.list_point.length; i++) {
                for (var j = 0; j < this.list_point.length; j++) {
                    distance_mat[i][j] = Math.min(distance_mat[i][j], distance_mat[i][k] + distance_mat[k][j]);
                }
            }
        }
        this.distance_matrix = distance_mat;
        return distance_mat;
    };
    return FloydWarshall;
}());
export { FloydWarshall };

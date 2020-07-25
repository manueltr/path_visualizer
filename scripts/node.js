// Create node class
function Node(row, column) {
    this.row = row;
    this.column = column;
    this.neighbors = [];
    this.parent = null;
    this.isWall = false;
    this.isVisited = false;
}
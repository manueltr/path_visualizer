// Create node class
function Node(row, column) {
    this.row = row;
    this.column = column;
    this.neighbors = [];
    this.parent = null;
    this.isWall = false;
    this.isVisited = false;
    this.manhattan = 0;

    // this.shuffleNeighbors = function() {
    //     var ctr = this.neighbors.length, temp, index;
    //     while(ctr > 0) {
    //         index = Math.floor(Math.random() * ctr);
    //         ctr--;
    //         temp = this.neighbors[ctr];
    //         this.neighbors[ctr] = this.neighbors[index];
    //         this.neighbors[index] = temp;
    //     }
    // }
}
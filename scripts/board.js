
function Board(){
    this.grid = [];
    this.mouse_down = false;
    this.start_node = null;
    this.goal = null;
    this.path = [];
    this.visited = [];
    this.mazeGeneration = [];
    this.currentAlgo = '';
    this.runningAlgo = false;

    this.reset = function (type) {
        this.visited = [];
        this.path = [];
        for( let i = 0; i < this.grid.length; i++) {
            for( let j = 0; j < this.grid[0].length; j++) {

                let node = this.grid[i][j];
                node.isVisited = false;
                node.parent = null;
                let classAttr = $(`#${node.row}-${node.column}`).attr('class');

                // Doesnt not remove walls.
                if(type === 'reRun') {
                    if(!classAttr.includes('wall') 
                        && !classAttr.includes('mazeStart')){

                        $(`#${node.row}-${node.column}`).attr('class', 'n');
                    }
                }   // resets all nodes back to initial state.
                else {
                    this.mazeGeneration = [];
                    node.isWall = false;
                    $(`#${node.row}-${node.column}`).attr('class', 'n');
                }
                if(node === this.start_node) {
                    $(`#${node.row}-${node.column}`).addClass('class', 'start');
                }
                else if(node === this.goal) {
                    $(`#${node.row}-${node.column}`).addClass('class', 'end');
                }
            }
        }
    }

    this.setPath = function () {
        let node = this.goal;
        while(node) {
            this.path.push(node);
            node = node.parent;
        }
        this.path.reverse();
    }

    this.createMaze = function () {
        
        var mazeFrontier = [];
        var order = [1, 2, 3, 4];

        function containsNode(v, mazeFrontier) {
            for(var i = 0; i < mazeFrontier.length; i++) {
                if(mazeFrontier[i] == v) {
                    return true;
                }
            }
            return false;
        }

        function addValidNeighbor(v,grid) {
            
            if(v.row + 2 < grid.length 
                && grid[v.row+2][v.column].isWall
                && !containsNode(grid[v.row+2][v.column], mazeFrontier)) {
                
                mazeFrontier.push(grid[v.row+2][v.column]);
            }
            if(v.row - 2 >= 0 
                && grid[v.row-2][v.column].isWall
                && !containsNode(grid[v.row-2][v.column], mazeFrontier)) {

                mazeFrontier.push(grid[v.row-2][v.column]);
            }
            if(v.column + 2 < grid[0].length
                && grid[v.row][v.column+2].isWall
                && !containsNode(grid[v.row][v.column+2], mazeFrontier)) {

                mazeFrontier.push(grid[v.row][v.column+2]);
            }
            if(v.column - 2 >= 0
                && grid[v.row][v.column-2].isWall
                && !containsNode(grid[v.row][v.column-2], mazeFrontier)) {
                
                mazeFrontier.push(grid[v.row][v.column-2]);
            }
        }

        function shuffle(array) {
            var ctr = array.length, temp, index;

            while(ctr > 0) {
                index = Math.floor(Math.random() * ctr);
                ctr--;
                temp = array[ctr];
                array[ctr] = array[index];
                array[index] = temp;
            }
        }

        // make all nodes a wall
        for( let i = 0; i < this.grid.length; i++) {
            for( let j = 0; j < this.grid[0].length; j++) {
                if(this.grid[i][j] !== this.start_node
                    && this.grid[i][j] !== this.goal) {
                        this.grid[i][j].isWall = true;
                        $(`#${i}-${j}`).addClass('mazeStart');
                    }
            }
        }

        let y = Math.floor(Math.random() * this.grid.length);
        let x = Math.floor(Math.random() * this.grid[0].length);
        console.log(`r = ${y} c = ${x}`);

        let start = this.grid[y][x];
        start.isWall = false;
        this.mazeGeneration.push(start);

        addValidNeighbor(start,this.grid);

        while(mazeFrontier.length > 0) {

            // randomize array
            shuffle(mazeFrontier);
            shuffle(order);
            var cNode = mazeFrontier.pop();


            cNode.isWall = false;
            let r = cNode.row;
            let c = cNode.column;

            
            for(let i = 0; i < order.length; i++) {
                if(order[i] == 1) {
                    if(r - 2 >= 0 && !this.grid[r-2][c].isWall) {
                        this.grid[r-1][c].isWall = false;
                        this.mazeGeneration.push(this.grid[r-1][c]);
                        break;
                    }
                }
                if(order[i] == 2) {
                    if(r + 2 < this.grid.length && !this.grid[r+2][c].isWall){
                        this.grid[r+1][c].isWall = false;
                        this.mazeGeneration.push(this.grid[r+1][c]);
                        break;
                    }
                }
                if(order[i] == 3) {
                    if(c + 2 < this.grid[0].length
                         && !this.grid[r][c+2].isWall){
                        this.grid[r][c+1].isWall = false;
                        this.mazeGeneration.push(this.grid[r][c+1]);
                        break;
                    }
                }
                if(order[i] == 4) {
                    if(c - 2 >= 0 && !this.grid[r][c-2].isWall) {
                        this.grid[r][c-1].isWall = false;
                        this.mazeGeneration.push(this.grid[r][c-1]);
                        break;
                    }
                }
            }
            
            this.mazeGeneration.push(cNode);
            addValidNeighbor(cNode,this.grid);
        }
    }
}
$(document).ready( function() {

    // animate searcg algorithm visited nodes
    function displayVisited(index) {
        if(index == board.visited.length) {
            displayPath(0);
            return;
        }
        setTimeout(function() {
            let v = board.visited[index];
            $(`#${v.row}-${v.column}`).addClass('visited');
            displayVisited(index+1);
        }, Math.ceil(20*board.speed));
    }

    //instantly display visited
    function displayVisitedQuick() {
        
        for(let i = 0; i < board.visited.length; i++) {
            let v = board.visited[i];
            $(`#${v.row}-${v.column}`).addClass('visitedQuick');
        }
        displayPathQuick();
    }

    //animate path creation
    function displayPath(index) {
        if(index == board.path.length) {
            board.running = false;
            return;
        }

        setTimeout(function () {
            let node = board.path[index];
            $(`#${node.row}-${node.column}`).addClass('path');
            displayPath(index + 1);
        }, Math.ceil(60*board.speed));
    }

    //instantly displays path
    function displayPathQuick() {
        for(let i = 0; i < board.path.length; i++) {
            let v = board.path[i];
            $(`#${v.row}-${v.column}`).addClass('pathQuick');
        }
        board.running = false;
    }

    // animate maze creation
    function breakWall(index) {
        if(index == board.mazeGeneration.length) {
            board.running = false;
            return;
        }

        setTimeout(function () {
            let node = board.mazeGeneration[index];
            if(node !== board.start_node && node !== board.goal) {
                $(`#${node.row}-${node.column}`).attr('class', 'breakWall');
            }
            breakWall(index + 1);
        }, Math.ceil(10*board.speed));
    }


    // create board object
    var board = new Board();
    let remainingHeight = window.innerHeight - $('nav').height() - 50;
    let numRows = Math.floor(remainingHeight / 32)-2;
    let numColumns = Math.floor((window.innerWidth-20) / 32) - 2;

    // create all node objects
    for(var i = 0; i < numRows; i++) {
        $('table').append(`<tr id="${i}"></tr>`);
        var board_row = [];

        for(var j = 0; j < numColumns; j++) {
            $(`#${i}`).append(`<td id="${i}-${j}" class="n"></td>`);
            board_row.push(new Node(i, j));

        }
        board.grid.push(board_row);
    }

    //make start_node and end node
    let startRow = Math.ceil(numRows/2);
    let startCol = Math.ceil(numColumns/5);
    let endCol = Math.ceil(numColumns/2);
    board.start_node = board.grid[startRow][startCol];
    board.goal = board.grid[startRow][endCol];
    $(`#${startRow}-${startCol}`).addClass('start');
    $(`#${startRow}-${endCol}`).addClass('end');

    //set for all nodes in grid their neighboring nodes
    function add_neighbors(board) {
        for( var i = 0; i < board.length; i++) {
            for( var j = 0; j < board[i].length; j++) {
                let current_node = board[i][j];

                // Add top neighbor if it exist
                if( i - 1 >= 0 ) {
                    current_node.neighbors.push(board[i-1][j]);
                }
                // Add bottom neighbor if it exist
                if(i + 1 < board.length) {
                    current_node.neighbors.push(board[i+1][j]);
                }
                // Add right neighbor if it exist
                if(j + 1 < board[i].length) {
                    current_node.neighbors.push(board[i][j+1]);
                }
                if(j - 1 >= 0) {
                    current_node.neighbors.push(board[i][j-1]);
                }
            }
        }
    }
    add_neighbors(board.grid);


    // return the node with the minimum manhattan distance
    function min(array) {
        let minVal = Number.POSITIVE_INFINITY;
        let index = null;
        for( let i = 0; i < array.length; i++){
            if(array[i].manhattan < minVal) {
                index = i;
                minVal = array[i].manhattan;
            }
        }
        return array.splice(index,1)[0];
    }



// Search algorithms

    // Greedy Best-first search
    function bestFirstS(start) {

        board.findDistances();
        let pq = [];
        pq.unshift(start);
        start.isVisited = true;
        board.visited.push(start);

        while(pq.length) {
            let v = min(pq);
            board.visited.push(v);
            
            if(v === board.goal) {
                board.setPath();
                return v;
            }
            for(let i = 0; i < v.neighbors.length; i++) {
                let neighbor = v.neighbors[i];
                if(neighbor.isVisited === false) {
                    neighbor.isVisited = true;

                    if(!neighbor.isWall) {
                        neighbor.parent = v;
                        pq.unshift(neighbor);
                    }
                }
            }
        }
        return false;
    }

    // Breadth-first search algorithm function
    function bfs(start, goal) {
        let queue = [];
        start.isVisited = true;
        queue.push(start);
    
        while (queue.length > 0) {
            let v = queue.shift();
            board.visited.push(v);
            
            if( v === goal) {
                board.setPath();
                return v;
            }

            for( var i = 0; i < v.neighbors.length; i++) {
                let neighbor = v.neighbors[i];
                if(neighbor.isVisited == false)  {
                    neighbor.isVisited = true;

                    if(!neighbor.isWall) {
                        neighbor.parent = v;
                        queue.push(neighbor);
                    }
                }
            }
        }
        return false;
    }

    // Depth-first search algorithm function
    function dfs(start) {
        let stack = [];
        stack.push(start);

        while(stack.length) {
            let v = stack.pop();

            if(!v.isWall && !v.isVisited) {
                board.visited.push(v);
            }
            else {
                continue;
            }
            v.isVisited = true;

            if(v === board.goal) {
                board.setPath();
                break;
            }
            for( var i = 0; i < v.neighbors.length; i++) {
                if(!v.neighbors[i].isVisited) {
                    v.neighbors[i].parent = v;
                    stack.push(v.neighbors[i]);
                }
            }
        }
    }

    // main run function
    function runAlgo(type) {

        if(!board.running) {
            board.reset('reRun');
            switch(board.currentAlgo){
                case '':
                    $('#run').html("Select<br>Algorithm");
                    break;
                case 'bfs':
                    board.hasRan = true;
                    board.running = true;
                    let node = bfs(board.start_node, board.goal);
                    if(type === 'hasRan') {
                        displayVisitedQuick();
                    }
                    else {
                        displayVisited(0);
                    }
                    if(node === false) {
                        console.log('No solution!');
                    }
                    break;
                case 'dfs':
                    board.hasRan = true;
                    board.running = true;
                    dfs(board.start_node);
                    if(type === 'hasRan') {
                        displayVisitedQuick();
                    }
                    else {
                        displayVisited(0);
                    }
                    
                    if(board.goal.parent == null) {
                        console.log("No Solution");
                    }
                    break;
                case 'gbfs':
                    board.hasRan = true;
                    board.running = true;
                    bestFirstS(board.start_node);
                    if(type === 'hasRan') {
                        displayVisitedQuick();
                    }
                    else {
                        displayVisited(0);
                    }

                    if(board.goal.parent == null) {
                        console.log("No Solution");
                    }
            };
        }
    }

    $('td').on('mousedown', function (e) {
        e.preventDefault();
        let isMaze = $(this).attr('class').includes('mazeStart');
        let isWall = $(this).attr('class').includes('wall');

        if(!board.running) {

            if($(e.target).attr('class').includes('start')) {
                board.moving_start = true;
            }
            else if($(e.target).attr('class').includes('end')) {
                board.moving_end = true;
            }
            else {
                if(board.toggle && (isMaze || isWall)) {
                    $(e.target).attr('class', '');

                    //make node a wall
                    let id = $(e.target).attr('id');
                    let coords = id.split('-');
                    board.grid[coords[0]][coords[1]].isWall = false;
                }
                else if(!isMaze && !board.toggle) {
                    $(e.target).attr('class', 'wall');

                    //remove wall
                    let id = $(e.target).attr('id');
                    let coords = id.split('-');
                    board.grid[coords[0]][coords[1]].isWall = true;
                }
            }
            board.mouse_down = true;
        }
    })

    $('td').on('mouseup', function () {

        if(!board.running) {
            let isWall = $(this).attr('class').includes('wall');
            let isMaze = $(this).attr('class').includes('mazeStart');
            if(board.moving_start) {

                if(isWall || isMaze) {
                    let row = board.start_node.row;
                    let col = board.start_node.column;
                    let id = `#${row}-${col}`;
                    $(id).addClass('start');
                    if(board.hasRan) {
                        $(id).addClass('start pathQuick');
                    }
                    if(isMaze) {
                        $(this).attr('class','mazeStart');
                    }
                    else{
                        $(this).attr('class','wall');
                    }
                }
                else {
                    $(this).addClass('start');
                    let coords = $(this).attr('id').split('-');
                    board.start_node = board.grid[coords[0]][coords[1]];
                }
            }
            if(board.moving_end) {
                if(isWall || isMaze) {

                    let id = `#${board.goal.row}-${board.goal.column}`;
                    $(id).addClass('end');
                    if(board.hasRan) {
                        $(id).addClass('end pathQuick');
                    }
                    $(this).attr('class', 'wall');
                    if(isMaze) {
                        $(this).attr('class','mazeStart');
                    }
                    else{
                        $(this).attr('class','wall');
                    }
                }
                else {
                    $(this).addClass('end');
                    let coords = $(this).attr('id').split('-');
                    board.goal = board.grid[coords[0]][coords[1]];
                    
                }
            }
            board.moving_start = false;
            board.moving_end = false;
            board.mouse_down = false;
        }
    })


    $('td').on('mouseenter', function (e) {
        e.preventDefault();

        if(board.mouse_down) {
            let coords = $(this).attr('id').split('-');
            let isWall = $(this).attr('class').includes('wall');
            let isMaze = $(this).attr('class').includes('mazeStart');

            if(board.moving_start && !isWall && !isMaze) {
               $(this).addClass('start');
               board.start_node = board.grid[coords[0]][coords[1]];

                // Rerun algo if it has already ran and moving starting node
                if(board.hasRan) {
                    runAlgo('hasRan');
                }
            }
            else if(board.moving_end && !isWall && !isMaze) {
                $(this).addClass('end');
                board.goal = board.grid[coords[0]][coords[1]];

                if(board.hasRan) {
                    runAlgo('hasRan');
                }
            }
            else {
                let isStart = $(this).attr('class').includes('start');
                let isGoal = $(this).attr('class').includes('end');

                if(!isStart && !isGoal && !isMaze && !board.toggle) {
                    $(e.target).attr('class', 'wall');
                    //make node a wall
                    let id = $(e.target).attr('id');
                    let coords = id.split('-');
                    board.grid[coords[0]][coords[1]].isWall = true;
                }
                else if(!isStart && !isGoal && board.toggle
                     && (isMaze || isWall)) {
                    $(e.target).attr('class', '');

                    // remove wall
                    let id = $(e.target).attr('id');
                    let coords = id.split('-');
                    board.grid[coords[0]][coords[1]].isWall = false;
                }
            }
        }
    })

    $('td').on('mouseout', function() {
        if(board.mouse_down) {
            let isWall = $(this).attr('class').includes('wall');
            let isMaze = $(this).attr('class').includes('mazeStart');
            if(board.moving_start && !isWall && !isMaze) {
                $(this).attr('class','');
            }
            if(board.moving_end && !isWall && !isMaze) {
                $(this).attr('class','');
            }
        }
    })

    $('#bfs').on('click', function () {    
        board.currentAlgo = 'bfs';
        $('#run').html("Run<br>BFS");
    })

    $('#dfs').on('click', function () {
        board.currentAlgo = 'dfs';
        $('#run').html("Run<br>DFS");
    })

    $('#gbfs').on('click', () => {
        board.currentAlgo = 'gbfs';
        $('#run').html("Run<br>Best-First Search");
    })

    $('#slow').on('click', () => {
        board.speed = 1.8;
        $('.speed').html(`Speed: Slow<i id="speed"></i>`);
    })
    $('#med').on('click', () => {
        board.speed = 1;
        $('.speed').html(`Speed: Normal<i id="speed"></i>`);
    })
    $('#fast').on('click', () => {
        board.speed = .5
        $('.speed').html(`Speed: Fast<i id="speed"></i>`);
    })

    $('html').on('click', function (e) {
        if (e.target === document.getElementsByClassName('dropbtn')[0]
            || e.target === document.getElementById('algos')) {
            $('.dropdown-content').attr('id', 'showDrop');
        }
        else if (e.target === document.getElementsByClassName('dropbtn')[3]
            || e.target === document.getElementById('speed')) {

            $('.dropdown-content-2').attr('id', 'showDrop');
        }
        else {
            $('.dropdown-content').attr('id', 'hideDrop');
            $('.dropdown-content-2').attr('id', 'hideDrop'); 
        }
    })

    $('#maze').on('click', function() {
        if(!board.running) {
            board.running = true;
            board.reset('ClearAllBoard');
            board.createMaze(board.grid);

            breakWall(0);
        }
    })

    $('#clear').on('click', () => {
        if(!board.running) {
            board.reset('ClearAllBoard');
        } 
    })

    $('#toggle').on('click', () => {
        if(board.toggle) {
            board.toggle = false;
            $('#toggle').html('Toggle: Adding Walls');
        }
        else {
            board.toggle = true;
            $('#toggle').html('Toggle: Removing Walls');
        }
    })

    // main run button
    $('#run').on('click', () => runAlgo('a;sldkfj'))

});


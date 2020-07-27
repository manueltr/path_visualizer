$(document).ready( function() {

    // animate search algorithm
    function displayVisited(index) {
        if(index == board.visited.length) {
            displayPath(0);
            return;
        }
        setTimeout(function() {
            let v = board.visited[index];
            $(`#${v.row}-${v.column}`).addClass('visited');
            displayVisited(index+1);
        }, 25);
    }

    //animate path creation
    function displayPath(index) {
        if(index == board.path.length) {
            return;
        }

        setTimeout(function () {
            let node = board.path[index];
            $(`#${node.row}-${node.column}`).addClass('path');
            displayPath(index + 1);
        }, 60);
    }

    function breakWall(index) {
        if(index == board.mazeGeneration.length) {
            return;
        }

        setTimeout(function () {
            let node = board.mazeGeneration[index];
            $(`#${node.row}-${node.column}`).attr('class','breakWall');
            breakWall(index + 1);
        }, 25);
    }


    // create board object
    var board = new Board();
    // create all node objects
    for(var i = 0; i < 20; i++) {
        $('table').append(`<tr id="${i}"></tr>`);
        var board_row = [];

        for(var j = 0; j < 40; j++) {
            $(`#${i}`).append(`<td id="${i}-${j}" class="n"></td>`);
            board_row.push(new Node(i, j));

        }
        board.grid.push(board_row);
    }

    //make start_node and end node
    board.start_node = board.grid[10][10];
    board.goal = board.grid[10][30];
    $('#10-10').append(`<i id="start" class="fa fa-chevron-right"></i>`);
    $('#10-30').append(`<i id="end" class="fa fa-dot-circle-o"></i>`);
    $('#10-10').addClass('start');
    $('#10-30').addClass('end');

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



// Search algorithms

    // breadth first search algo function
    function bfs(start, goal) {
        let queue = [];
        start.isVisited = true;
        board.visited.push(start);
        queue.push(start);
    
        while (queue.length > 0) {
            let v = queue.shift();
            
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
                        board.visited.push(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
        }
        return false;
    }

    // Depth first search algorithm function
    function dfs(start) {
        let stack = [];
        stack.push(start);

        while(stack.length) {
            let v = stack.pop();
            v.isVisited = true;

            if(!v.isWall) {
                board.visited.push(v);
            }
            else {
                continue;
            }

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



    $('table').on('mousedown', function (e) {
        e.preventDefault();
        board.mouse_down = true;
    })
    $('table').on('mouseup', function () {
        board.mouse_down = false;
    })


    $('td').on('mouseenter', function (e) {
        if(board.mouse_down) {
            e.preventDefault();
            if( !$(this).attr('class').includes('start')
                && !$(this).attr('class').includes('end')) {

                $(this).attr('class', 'wall');

                //make node a wall
                let id = $(this).attr('id');
                let coords = id.split('-');
                board.grid[coords[0]][coords[1]].isWall = true;

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

    $('html').on('click', function (e) {
        if (e.target === document.getElementsByClassName('dropbtn')[0]
            || e.target === document.getElementById('algos')) {
            $('.dropdown-content').attr('id', 'showDrop');
        }
        else {
            $('.dropdown-content').attr('id', 'hideDrop'); 
        }
    })

    $('#maze').on('click', function() {
        board.reset('ClearAllBoard');
        board.createMaze(board.grid);

        breakWall(0);
    })

    $('#clear').on('click', () => { board.reset('ClearAllBoard'); })

    // main run button
    $('#run').on('click', function() {
        board.reset('reRun');
        switch(board.currentAlgo){
            case '':
                $('#run').html("Pick<br>Algorithm!");
                break;
            case 'bfs':
                let node = bfs(board.start_node, board.goal);
                displayVisited(0);
                if(node === false) {
                    console.log('No solution!');
                }
                break;
            case 'dfs':
                dfs(board.start_node);
                displayVisited(0);
                if(board.goal.parent == null) {
                    console.log("No Solution");
                }
                break;
        };
    })

});

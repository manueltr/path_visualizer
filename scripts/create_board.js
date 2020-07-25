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
        }, 12);
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
        }, 75);
    }


    // create board object
    var board = new Board();
    // create all node objects
    for(var i = 0; i < 20; i++) {
        $('table').append(`<tr id="${i}"></tr>`);
        var board_row = [];

        for(var j = 0; j < 40; j++) {
            $(`#${i}`).append(`<td id="${i}-${j}"></td>`);
            board_row.push(new Node(i, j));

        }
        board.grid.push(board_row);
    }

    //make start_node and end node
    board.start_node = board.grid[10][10];
    board.goal = board.grid[10][30];
    $('#10-10').addClass('start');
    $('#10-10').append(`<i id="start" class="fa fa-chevron-right"></i>`);
    $('#10-30').addClass('end');
    $('#10-30').append(`<i id="end" class="fa fa-dot-circle-o"></i>`);

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
        queue = [];
        start.isVisited = true;
        board.visited.push(start);
        queue.push(start);
    
        while (queue.length > 0) {
            let v = queue.shift();
            
            if( v === goal) {
                board.setPath();
                displayVisited(0);
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
            if( $(this).attr('class') != 'start'
                && $(this).attr('class') != 'end' ) {

                $(this).attr('class', 'wall');

                //make node a wall
                let id = $(this).attr('id');
                let coords = id.split('-');
                board.grid[coords[0]][coords[1]].isWall = true;

            }
        }
    })

    $('#bfs').on('click', function () {
        
        let node = bfs(board.start_node, board.goal);
        if(node === false) {
            console.log('No solution!')
        }
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
    
    
});
$(document).ready( function() {

    // trying to animate search progress
    function markNode(v) {
        $(`#${v.row}-${v.column}`).addClass('visited');
    }

    function displayVisited(index) {
        if(index == visited.length) {
            displayPath(0);
            return;
        }
        setTimeout(function() {
            markNode(visited[index]);
            displayVisited(index+1);
        }, 12);
    }
    var visited = [];

    function displayPath(index) {
        if(index == board.path.length) {
            return;
        }

        setTimeout(function () {
            let node = board.path[index];
            $(`#${node.row}-${node.column}`).addClass('path');
            displayPath(index + 1);
        }, 30);
    }

    ///

    var board = {
        grid: [],
        mouse_down: false,
        start_node: null,
        goal: null,
        path: []
    };

    // display path
    board.setPath = function () {
        let node = board.goal;
        while(node) {
            board.path.push(node);
            node = node.parent;
        }
        board.path.reverse();
    }

    for(var i = 0; i < 20; i++) {
        $('table').append(`<tr id="${i}"></tr>`);
        var board_row = [];
        var row = '';

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

    // Bread First Search
    $('#bfs').on('click', function () {
        
        //breadth first search algo function
        function bfs(start, goal) {
            queue = [];
            start.isVisited = true;
            visited.push(start);
            queue.push(start);
        
            while (queue.length > 0) {
                v = queue.shift();
                
                if( v === goal) {
                    board.setPath();
                    displayVisited(0);
                    return v;
                }

                for( var i = 0; i < v.neighbors.length; i++) {
                    neighbor = v.neighbors[i];
                    if(neighbor.isVisited == false)  {
                        neighbor.isVisited = true;

                        if(!neighbor.isWall) {
                            neighbor.parent = v;
                            visited.push(neighbor);
                            queue.push(neighbor);
                        }
                    }
                }
            }
            return false;
        }

        let node = bfs(board.start_node, board.goal);
        if(node === false) {
            console.log('No solution!')
        }
    })


    
});
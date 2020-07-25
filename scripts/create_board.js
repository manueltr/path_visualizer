$(document).ready( function() {


    var board = {
        grid: [],
        mouse_down: false,
        start_node: null,
        goal: null
    };

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
    $('#10-30').addClass('end');

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
            queue.push(start);
        
            while (queue.length > 0) {
                v = queue.shift();
                
                if( v === goal) {
                    return goal;
                }
                for( var i = 0; i < v.neighbors.length; i++) {
                    neighbor = v.neighbors[i];
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

        let node = bfs(board.start_node, board.goal);
        if(node === false) {
            console.log('No solution!')
        }
        else {
            while(node.parent) {
                $(`#${node.row}-${node.column}`).addClass('path');
                node = node.parent;
            }
        }

    })


    
});
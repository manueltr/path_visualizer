
function Board(){
    this.grid = [];
    this.mouse_down = false;
    this.start_node = null;
    this.goal = null;
    this.path = [];
    this.visited = [];

    this.setPath = function () {
        let node = this.goal;
        while(node) {
            this.path.push(node);
            node = node.parent;
        }
        this.path.reverse();
    }

}
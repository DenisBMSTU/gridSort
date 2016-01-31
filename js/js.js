$(document).ready(function() {
    var $grid = $('#grid');
    $.getJSON('index.json', function(data) {
        for (var i = 0; i < data.users.length; i++) {
            $grid.append('<tr><td>' + data.users[i].date + '</td><td>' + data.users[i].name + '</td></tr>');
        }
        $grid.append('</tbody>');
    });
});


function GridSort(grid) {
    this.grid = grid;
}

GridSort.prototype.gridClick = function() {
    var self = this;
    this.grid.onclick = function(e) {
        if (e.target.tagName != 'TH') return;
        self.tableSort(e.target.cellIndex, e.target.getAttribute('data-type'));
    };
};

GridSort.prototype.tableSort = function(colNum, typeOfSort) {
    var tbody = this.grid.getElementsByTagName('tbody')[0],
        rowsArray = [].slice.call(tbody.rows),
        compare;
    switch (typeOfSort) {
        case 'number':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML;
            };
            break;
        case 'string':
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
            };
            break;
    }

    rowsArray.sort(compare);

    this.grid.removeChild(tbody);

    for (var i = 0; i < rowsArray.length; i++) {
        tbody.appendChild(rowsArray[i]);
    }

    this.grid.appendChild(tbody);
};

var table = new GridSort(document.getElementById('grid'));
table.gridClick();
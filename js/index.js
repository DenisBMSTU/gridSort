/**
 * Created by ubuntu on 22.02.16.
 */
var Table = require('./Table'),
    highlightTableRows = require('./highlightTableRows'),
    GridSortTr = require('./GridSortTr');

    var table = new Table(document.getElementById('grid'));

    table.initialize();

    var tableSort = new GridSortTr();

    tableSort.init();

    highlightTableRows("grid","hoverRow","clickedRow");


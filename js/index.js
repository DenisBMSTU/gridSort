/**
 * Created by ubuntu on 22.02.16.
 */
var Table = require('./Table'),
    highlightTableRows = require('./highlightTableRows'),
    GridSortTr = require('./GridSortTr'),
    checkAll = require('./checkAll');


var grid = "grid", //id таблицы
    table = new Table(grid),//загрузка, обработка, сохранение данных таблицы
    tableSort = new GridSortTr(); //сортировка таблицы

table.init();
tableSort.init();
highlightTableRows(grid,"hoverRow","clickedRow");
checkAll();


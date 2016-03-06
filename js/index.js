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
/*
function findDate() {
    var dateTd = document.querySelectorAll('tbody tr td:nth-child(1)');
    var date = dateTd.map(function(item){
        return item.innerHTML;
    });
    return date;
}
console.log(findDate());*/

/*var names = document.querySelectorAll('tbody tr td:nth-child(1)');*/


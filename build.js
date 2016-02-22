(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Возвращает для каждого столбца разный способ сортировки, в зависимости от вложенных данных
 * @param a
 * @param b
 * @returns {number}
 * @private
 */

function GridSortTr() {}
GridSortTr.prototype.returnSortFunc = function(a, b) {
    var sort_case_sensitive = false, // чуствительновть к регистру при сотрировке
        patternDate = /\d\d\d\d([/])\d\d([/])\d\d/, //регулярное выражения для даты
        patternTime = /\d\d([:])\d\d([:])\d\d/, //регулярное выражения для времени
        a = a[0],
        b = b[0],
        _a = (a + '').replace(/,/, '.'),
        _b = (b + '').replace(/,/, '.');
    if(patternDate.test(a) && patternTime.test(a)) {
        return sort_sensitive(a,b);
    } else if (parseInt(_a) && parseInt(_b)) {
        return sort_numbers(parseInt(_a), parseInt(_b));
    } else if (!sort_case_sensitive) {
        return sort_insensitive(a, b);
    } else {
        return sort_sensitive(a, b);
    }
};


/**
 * Сортировка чисел
 * @param a
 * @param b
 * @returns {number}
 */
function sort_numbers(a, b) {
    return a - b;
}

/**
 * Сортировка строк, минуя регистр
 * @param a
 * @param b
 * @returns {number}
 */
function sort_insensitive(a, b) {
    var anew = a.toLowerCase(),
        bnew = b.toLowerCase();
    if (anew < bnew) {
        return -1;
    } else if(anew > bnew) {
        return 1;
    }
    return 0;
}

/**
 * Сортировка даты и строк, не зависящих от регистра
 * @param a
 * @param b
 * @returns {number}
 */
function sort_sensitive(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function getConcatenedTextContent(node) {
    var _result = "";
    if (node == null) {
        return _result;
    }
    var childrens = node.childNodes;
    var i = 0;
    while (i < childrens.length) {
        var child = childrens.item(i);
        switch (child.nodeType) {
            case 1: // ELEMENT_NODE
            case 5: // ENTITY_REFERENCE_NODE
                _result += getConcatenedTextContent(child);
                break;
            case 3: // TEXT_NODE
            case 2: // ATTRIBUTE_NODE
            case 4: // CDATA_SECTION_NODE
                _result += child.nodeValue;
                break;
            case 6: // ENTITY_NODE
            case 7: // PROCESSING_INSTRUCTION_NODE
            case 8: // COMMENT_NODE
            case 9: // DOCUMENT_NODE
            case 10: // DOCUMENT_TYPE_NODE
            case 11: // DOCUMENT_FRAGMENT_NODE
            case 12: // NOTATION_NODE
                // skip
                break;
        }
        i++;
    }
    return _result;
}

GridSortTr.prototype.sortTableTr = function(e) {
    var el = window.event ? window.event.srcElement : e.currentTarget;

    while (el.tagName.toLowerCase() != "td") el = el.parentNode;

    var a = [],
        i,
        name = el.lastChild.nodeValue,
        dad = el.parentNode,
        table = dad.parentNode.parentNode,
        up = table.up; // no set/getAttribute!

    var node, arrow, curcol;
    for (i = 0; (node = dad.getElementsByTagName("td").item(i)); i++) {
        if (node.lastChild.nodeValue == name){
            curcol = i;
            if (node.className == "curcol"){
                arrow = node.firstChild;
                table.up = Number(!up);
            }else{
                node.className = "curcol";
                arrow = node.insertBefore(document.createElement("span"),node.firstChild);
                arrow.appendChild(document.createTextNode(""));
                table.up = 0;
            }
            arrow.innerHTML=((table.up==0)?"&#8595;":"&#8593;")+"&nbsp;";
        }else{
            if (node.className == "curcol"){
                node.className = "";
                if (node.firstChild) node.removeChild(node.firstChild);
            }
        }
    }

    var tbody = table.getElementsByTagName("tbody").item(0);
    for (i = 0; (node = tbody.getElementsByTagName("tr").item(i)); i++) {
        a[i] = [];
        a[i][0] = getConcatenedTextContent(node.getElementsByTagName("td").item(curcol));
        a[i][1] = getConcatenedTextContent(node.getElementsByTagName("td").item(1));
        a[i][2] = getConcatenedTextContent(node.getElementsByTagName("td").item(0));
        a[i][3] = node;
    }

    a.sort(this.returnSortFunc);

    if (table.up) a.reverse();

    for (i = 0; i < a.length; i++) {
        tbody.appendChild(a[i][3]);
    }
};

GridSortTr.prototype.init = function(e) {
    if (!document.getElementsByTagName) return;

    if (document.createEvent) function click_elem(elem){
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", false, false, window, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, elem);
        elem.dispatchEvent(evt);
    }

    for (var j = 0; (this.thead = document.getElementsByTagName("thead").item(j)); j++) {
        var node;
        for (var i = 0; (node = this.thead.getElementsByTagName("td").item(i)); i++) {
            if (node.addEventListener) node.addEventListener("click", this.sortTableTr, false);
            else if (node.attachEvent) node.attachEvent("onclick", this.sortTableTr);
            node.title = "Нажмите на заголовок, чтобы отсортировать колонку";
        }
        this.thead.parentNode.up = 0;
        this.initial_sort_id = 0; // номер начального отсортированного столбца, начиная с нуля
        this.initial_sort_up = 1; // 0 - сортировка вниз, 1 - вверх
        if (typeof(this.initial_sort_id) != "undefined"){
            this.td_for_event = this.thead.getElementsByTagName("td").item(this.initial_sort_id);
            if (this.td_for_event.dispatchEvent) click_elem(this.td_for_event);
            else if (this.td_for_event.fireEvent) this.td_for_event.fireEvent("onclick");
            if (typeof(this.initial_sort_up) != "undefined" && this.initial_sort_up){
                if (this.td_for_event.dispatchEvent) click_elem(this.td_for_event);
                else if (this.td_for_event.fireEvent) this.td_for_event.fireEvent("onclick");
            }
        }
    }
};

module.exports = GridSortTr;
},{}],2:[function(require,module,exports){

    function Table(grid) {
        this.grid = grid;
    }

    /**
     * Инициализаия объекта
     */
    Table.prototype.initialize = function() {
        this.buttonSend();
        this.loadTable();
        this.checkBox();
        this.saveTableData();
    };

    /**
     * Загрузка JSON-файла
     */
    Table.prototype.loadTable = function() {
        var $grid = $(this.grid),
            $tbody = $grid.find('tbody');
        this.jsonArray = [];
        this.jsonLoadSave = [];
        this.jsonTypeMail = [];
        this.jsonTypeOther = [];

        $.getJSON('./index.json', function (data) {
            var jsonArrayLength,
                i,
                dataLength = data.length;
            $tbody.html('');
            for (i = 0; i < dataLength; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (data[i].name === data[j].name) {
                        data[i].count++;
                    } else if (this.jsonArray[i] != data[i]) {
                        this.jsonArray.push(data[i]);
                    }
                }
            }
            this.jsonArray.sort(function(A, B) {
                return new Date('1970/01/01 ' + A.date) - new Date('1970/01/01 ' + B.date);
            });
            for (i = 0, jsonArrayLength = this.jsonArray.length; i < jsonArrayLength; i++) {
                if (this.jsonArray[i].typeUrl === 'other') {
                    this.jsonTypeOther.push(this.jsonArray[i]);
                } else if (this.jsonArray[i].typeUrl === 'mail') {
                    this.jsonTypeMail.push(this.jsonArray[i]);
                }
            }
        }.bind(this));
    };

    /**
     * Обработичк события - клик по кнопке 'Загрузить'
     */
    Table.prototype.buttonSend = function() {
        var i,
            self = this;
            $grid = $(this.grid),
            $tbody = $grid.find('tbody'),
            buttonSend = document.getElementById('buttonSend');

        this.iMailStart = 0;
        this.iMailFin = 0;
        this.iOtherStart = 0;
        this.iOtherFin = 0;
        buttonSend.onclick = function() {
            if ($('#checkboxOther').prop('checked') === false && $('#checkboxMail').prop('checked') === true) {
                this.iMailFin += 4;
                if (this.iMailFin > this.jsonTypeMail.length) {
                    while (this.iMailFin > this.jsonTypeMail.length) {
                        this.iMailFin -= 1;
                    }
                }
                if (this.iMailStart > this.jsonTypeMail.length) {
                    while (this.iMailStart > this.jsonTypeMail.length) {
                        this.iMailStart -= 1;
                    }
                }
                for (i = this.iMailStart; i < this.iMailFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeMail[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeMail[i].date + '</td><td>' + this.jsonTypeMail[i].name + '</td><td>'
                        + this.jsonTypeMail[i].count + '</td>' + '<td>' + this.jsonTypeMail[i].typeUrl + '</td></tr>');
                }
                this.iMailStart += 4;
            } else if ($('#checkboxMail').prop('checked') === false && $('#checkboxOther').prop('checked') === true) {
                this.iOtherFin += 4;
                if (this.iOtherFin > this.jsonTypeOther.length) {
                    while (this.iOtherFin > this.jsonTypeOther.length) {
                        this.iOtherFin -= 1;
                    }
                }
                if (this.iOtherStart > this.jsonTypeOther.length) {
                    while (this.iOtherStart > this.jsonTypeOther.length) {
                        this.iOtherStart -= 1;
                    }
                }
                for (i = this.iOtherStart; i < this.iOtherFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeOther[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeOther[i].date + '</td><td>' + this.jsonTypeOther[i].name + '</td><td>'
                        + this.jsonTypeOther[i].count + '</td>' + '<td>' + this.jsonTypeOther[i].typeUrl + '</td></tr>');
                }
                this.iOtherStart += 4;
            } else if ($('#checkboxOther').prop('checked') === true && $('#checkboxMail').prop('checked') === true) {
                this.iOtherFin += 2;
                this.iMailFin +=2;
                if (this.iOtherFin > this.jsonTypeOther.length) {
                    while (this.iOtherFin > this.jsonTypeOther.length) {
                        this.iOtherFin -= 1;
                    }
                }
                if (this.iOtherStart > this.jsonTypeOther.length) {
                    while (this.iOtherStart > this.jsonTypeOther.length) {
                        this.iOtherStart -= 1;
                    }
                }
                if (this.iMailFin > this.jsonTypeMail.length) {
                    while (this.iMailFin > this.jsonTypeMail.length) {
                        this.iMailFin -= 1;
                    }
                }
                if (this.iMailStart > this.jsonTypeMail.length) {
                    while (this.iMailStart > this.jsonTypeMail.length) {
                        this.iMailStart -= 1;
                    }
                }
                for (i = this.iMailStart; i < this.iMailFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeMail[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeMail[i].date + '</td><td>' + this.jsonTypeMail[i].name + '</td><td>'
                        + this.jsonTypeMail[i].count + '</td>' + '<td>' + this.jsonTypeMail[i].typeUrl + '</td></tr>');
                }
                for (i = this.iOtherStart; i < this.iOtherFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeOther[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeOther[i].date + '</td><td>' + this.jsonTypeOther[i].name + '</td><td>'
                        + this.jsonTypeOther[i].count + '</td>' + '<td>' + this.jsonTypeOther[i].typeUrl + '</td></tr>');
                }
                this.iOtherStart += 2;
                this.iMailStart +=2;
            } else {
                alert('Выберите, что хотите загрузить!');
            }
        }.bind(this);
    };

    Table.prototype.saveTableData = function() {
        var self = this,
            i;
        $('#buttonSave').on('click', function(){
            self.arraySaveData = [];
            var tbody = self.grid.getElementsByTagName('tbody')[0],
                rowsArray = [].slice.call(tbody.rows);
            for  (i = 0; i < rowsArray.length; i++) {
                /*for (var j = 0; j < rowsArray[i].cells.length; j++){*/
                var obj = {};
                obj["date"] = rowsArray[i].cells[0].innerHTML;
                obj["name"] = rowsArray[i].cells[1].innerHTML;
                obj["count"] = rowsArray[i].cells[2].innerHTML;
                obj["typeUrl"] = rowsArray[i].cells[3].innerHTML;
                    /*arr.push(rowsArray[i].cells[j].innerHTML);*/
                if (obj) {
                    self.arraySaveData.push(obj);
                }
            }
            /**
             * arraySaveData - json сохраненных элементов таблицы
             */
            console.log(self.arraySaveData);
            /*ВРЕМЕННЫЙ БЛОК*/
            var arr = [];
            if (self.arraySaveData) {
                for (i = 0; i < self.arraySaveData.length; i++) {
                    arr.push(JSON.stringify(self.arraySaveData[i]));
                }
            }
            if (arr.length === 0) {
                alert('Данных для сохранения нет');
            } else {
                alert(arr.join());
            }
            /*ВРЕМЕННЫЙ БЛОК*/
        });

    };

    Table.prototype.checkBox = function() {
        var self = this;
        $('#checkboxOther').on('click', function(){
            var tbody = self.grid.getElementsByTagName('tbody')[0],
                rowsArray = [].slice.call(tbody.rows);
            if ($('#checkboxOther').prop('checked') === false) {
                for (var i = 0; i < rowsArray.length; i++) {
                    if (rowsArray[i].cells[3].innerHTML === 'other') {
                        if (self.arraySaveData != undefined) {
                            for (var j = 0; j < self.arraySaveData.length; j++) {
                                if (self.arraySaveData[j].typeUrl === 'other') {
                                    self.arraySaveData.splice(j,1);
                                }
                            }
                        }
                        tbody.removeChild(rowsArray[i]);
                        self.iOtherStart = 0;
                        self.iOtherFin = 0;
                        for (var j = 0; j < self.jsonLoadSave.length; j++) {
                            if (self.jsonLoadSave[j].typeUrl === 'other') {
                                self.jsonLoadSave.splice(j,1);
                            }
                        }
                    }
                }
            }
        });
        $('#checkboxMail').on('click', function(){
            var tbody = self.grid.getElementsByTagName('tbody')[0],
                rowsArray = [].slice.call(tbody.rows);
            if ($('#checkboxMail').prop('checked') === false) {
                for (var i = 0; i < rowsArray.length; i++) {
                    if (rowsArray[i].cells[3].innerHTML === 'mail') {
                        if (self.arraySaveData != undefined) {
                            for (var j = 0; j < self.arraySaveData.length; j++) {
                                if (self.arraySaveData[j].typeUrl === 'mail') {
                                    self.arraySaveData.splice(j,1);
                                }
                            }
                        }
                        tbody.removeChild(rowsArray[i]);
                        self.iMailStart = 0;
                        self.iMailFin = 0;
                        for (var j = 0; j < self.jsonLoadSave.length; j++) {
                            if (self.jsonLoadSave[j].typeUrl === 'mail') {
                                self.jsonLoadSave.splice(j,1);
                            }
                        }
                    }
                }
            }
        });

    };

module.exports = Table;


},{}],3:[function(require,module,exports){
/**
 * Created by ubuntu on 22.02.16.
 */


/**
 * Подсвечивает строку таблицы, на которую был наведен курсор, а так же строку, которая была выделена
 * @param tableId
 * @param hoverClass
 * @param clickClass
 * @param multiple
 */
function highlightTableRows(tableId, hoverClass, clickClass, multiple)
{
    var table = document.getElementById(tableId);
    if (typeof multiple == 'undefined') multiple = true;
    if (hoverClass)
    {
        var hoverClassReg = new RegExp("\\b"+hoverClass+"\\b");
        table.onmouseover = table.onmouseout = function(e)
        {
            if (!e) e = window.event;
            var elem = e.target || e.srcElement;
            while (!elem.tagName || !elem.tagName.match(/td|th|table/i)) elem = elem.parentNode;
            if (elem.parentNode.tagName == 'TR' && elem.parentNode.parentNode.tagName == 'TBODY')
            {
                var row = elem.parentNode;
                if (!row.getAttribute('clickedRow')) row.className = e.type=="mouseover"?row.className+" "+hoverClass:row.className.replace(hoverClassReg," ");
            }
        };
    }
    if (clickClass) table.addEventListener('click',function(e){
        if (!e) e = window.event;
        var elem = e.target || e.srcElement;
        while (!elem.tagName || !elem.tagName.match(/td|th|table/i)) elem = elem.parentNode;
        if (elem.parentNode.tagName == 'TR' && elem.parentNode.parentNode.tagName == 'TBODY')
        {
            var clickClassReg = new RegExp("\\b"+clickClass+"\\b"),
                row = elem.parentNode;
            if (row.getAttribute('clickedRow'))
            {
                row.removeAttribute('clickedRow');
                row.className = row.className.replace(clickClassReg, "");
                row.className += " "+hoverClass;
            }
            else
            {
                if (hoverClass) row.className = row.className.replace(hoverClassReg, "");
                row.className += " "+clickClass;
                row.setAttribute('clickedRow', true);
                if (!multiple)
                {
                    var lastRowI = table.getAttribute("lastClickedRowI");
                    if (lastRowI!==null && lastRowI!=='' && row.sectionRowIndex!=lastRowI)
                    {
                        var lastRow = table.tBodies[0].rows[lastRowI];
                        lastRow.className = lastRow.className.replace(clickClassReg, "");
                        lastRow.removeAttribute('clickedRow');
                    }
                }

                table.setAttribute("lastClickedRowI", row.sectionRowIndex);
            }
        }
    },false);

}

module.exports = highlightTableRows;
},{}],4:[function(require,module,exports){
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


},{"./GridSortTr":1,"./Table":2,"./highlightTableRows":3}]},{},[4]);

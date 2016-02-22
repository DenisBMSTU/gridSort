/**
 * Конструктор сортировки таблицы
 * @param grid
 * @constructor
 */
function GridSortTr(grid) {
    this.grid = grid;
}
/**
 * Возвращаются данные для стандартного метода sort() в зависимости от столбца, по данным которого идет сортировка
 * @param a
 * @param b
 * @returns {number}
 */
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
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

function getConcatenedTextContent(node) {
    var _result = "",
        childrens = node.childNodes,
        i = 0;
    if (node == null) {
        return _result;
    }
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

/**
 * Сама сортировка
 * @param e
 */
GridSortTr.prototype.sortTableTr = function(e) {
    var el = window.event ? window.event.srcElement : e.currentTarget;

    while (el.tagName.toLowerCase() != "td") el = el.parentNode;

    var a = [],
        i,
        name = el.lastChild.nodeValue,
        dad = el.parentNode,
        table = dad.parentNode.parentNode,
        up = table.up, // no set/getAttribute!
        node,
        arrow,
        curcol;
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
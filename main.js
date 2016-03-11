/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].e;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			e: {},
/******/ 			i: moduleId,
/******/ 			l: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.e, module, module.e, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	function returnSortFunc(a, b) {
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
	}


	/**
	 * Сортировка чисел
	 * @param a
	 * @param b
	 * @returns {number}
	 */
	function sort_numbers(a, b) {
	    if (a > b) return 1;
	    if (a < b) return -1;
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

	    /*console.log('this.returnSortFunc',this.returnSortFunc(a,b));*/
	    a.sort(returnSortFunc);

	    if (table.up) a.reverse();

	    for (i = 0; i < a.length; i++) {
	        tbody.appendChild(a[i][3]);
	    }
	};

	GridSortTr.prototype.init = function(e) {
	    if (!document.getElementsByTagName) {
	        return;
	    }

	    if (document.createEvent) {
	        function click_elem(elem){
	            var evt = document.createEvent("MouseEvents");
	            evt.initMouseEvent("click", false, false, window, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, elem);
	            elem.dispatchEvent(evt);
	        }
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

	module.e = GridSortTr;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var findAbnormalUrl = __webpack_require__(4);
	'use strict';

	function Table(grid) {
	    this.grid = document.getElementById(grid);
	    this.$grid = $(this.grid);
	    this.$tbody = this.$grid.find('tbody');
	    this.$theadTr = this.$grid.find('thead tr');
	}

	/**
	 * Инициализаия объекта
	 */
	Table.prototype.init = function() {
	    this.buttonSend();
	    this.loadTable();
	    this.checkBox();
	    this.saveTableData();
	};

	/**
	 * Загрузка JSON-файла
	 */
	Table.prototype.loadTable = function() {
	    this.jsonArray = [];
	    this.jsonLoadSave = [];
	    this.jsonTypeMail = [];
	    this.jsonTypeOther = [];
	    this.jsonTypeSocial = [];

	    $.getJSON('./index.json', function (data) {
	        var jsonArrayLength,
	            i,
	            dataLength = data.length;
	        /*this.$tbody.html('');*/
	        for (i = 0; i < dataLength; i++) {
	            for (var j = 0; j < data.length; j++) {
	                if (data[i].name === data[j].name) {
	                    data[i].count++;
	                } else if (this.jsonArray[i] != data[i]) {
	                    this.jsonArray.push(data[i]);
	                }
	            }
	        }
	        for (i = 0, jsonArrayLength = this.jsonArray.length; i < jsonArrayLength; i++) {
	            if (this.jsonArray[i].typeUrl === 'other') {
	                this.jsonTypeOther.push(this.jsonArray[i]);
	            } else if (this.jsonArray[i].typeUrl === 'mail') {
	                this.jsonTypeMail.push(this.jsonArray[i]);
	            } else if (this.jsonArray[i].typeUrl === 'social') {
	                this.jsonTypeSocial.push(this.jsonArray[i]);
	            }
	        }
	        this.jsonTypeMail.sort(sortDateUp);
	        this.jsonTypeOther.sort(sortDateUp);
	        this.jsonTypeSocial.sort(sortDateUp);
	    }.bind(this));
	};

	/**
	 * Обработичк события - клик по кнопке 'Загрузить'
	 */
	Table.prototype.buttonSend = function() {
	    var i,
	        countIncrement,
	        buttonSend = document.getElementById('buttonSend'),
	        countInc = 6; //кол-во строк, выгружаемых в таблицу
	    this.allStart = 0;
	    this.allFin = 0;
	    this.iMailStart = 0;
	    this.iMailFin = 0;
	    this.iSocialStart = 0;
	    this.iSocialFin = 0;
	    this.iOtherStart = 0;
	    this.iOtherFin = 0;
	    this.otherAllStart = 0;
	    this.otherAllFin = 0;
	    this.mailAllStart = 0;
	    this.mailAllFin = 0;
	    this.socialAllStart = 0;
	    this.socialAllFin = 0;
	    var input = $('.container__category').find('input'),
	        inputLength = $('.container__category').find('input').length;
	    buttonSend.onclick = function() {

	        var countInput = 0;
	        for (i = 1; i < inputLength; i++) {
	            if (input[i].checked) {
	                countInput +=1;
	            }
	        }
	        if (countInput === 1) {
	            countIncrement = countInc;
	        } else if (countInput === 2) {
	            countIncrement = countInc/2
	        } else if (countInput === 3) {
	            countIncrement = countInc/3;
	        }

	        if ($('#checkboxSocial').prop('checked') === true) {
	            this.iSocialFin += countIncrement;
	            if (this.iSocialFin > this.jsonTypeSocial.length) {
	                while (this.iSocialFin > this.jsonTypeSocial.length) {
	                    this.iSocialFin -= 1;
	                }
	            }
	            if (this.iSocialStart > this.jsonTypeSocial.length) {
	                while (this.iSocialStart > this.jsonTypeSocial.length) {
	                    this.iSocialStart -= 1;
	                }
	            }
	            for (i = this.iSocialStart; i < this.iSocialFin; i++) {
	                this.jsonLoadSave.push(this.jsonTypeSocial[i]);
	            }
	            this.socialAllStart = this.iSocialStart;
	            this.socialAllFin = this.iSocialFin;
	            this.iSocialStart += countIncrement;
	        }
	        if ($('#checkboxMail').prop('checked') === true) {
	            this.iMailFin += countIncrement;
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
	            }
	            this.mailAllStart = this.iMailStart;
	            this.mailAllFin = this.iMailFin;
	            this.iMailStart += countIncrement;
	        }
	        if ($('#checkboxOther').prop('checked') === true) {
	            this.iOtherFin += countIncrement;
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
	            }
	            this.otherAllStart = this.iOtherStart;
	            this.otherAllFin = this.iOtherFin;
	            this.iOtherStart += countIncrement;
	        }
	        if ($('#checkboxMail').prop('checked') === false && $('#checkboxOther').prop('checked') === false && $('#checkboxSocial').prop('checked') === false) {
	            alert('Выберите данные для загрузки');
	            return;
	        }
	        this.allStart = this.otherAllStart + this.mailAllStart + this.socialAllStart;
	        this.allFin = this.otherAllFin + this.mailAllFin + this.socialAllFin;

	        if (this.allStart === this.allFin) {
	            alert('Данных для загрузки больше нет!');
	            return;
	        };

	        for (var j = this.allStart; j < this.allFin; j++) {
	            this.$tbody.append('<tr><td>' + this.jsonLoadSave[j].date + '</td><td>' + this.jsonLoadSave[j].name + '</td><td>'
	                + this.jsonLoadSave[j].count + '</td>' + '<td>' + this.jsonLoadSave[j].typeUrl + '</td></tr>');
	        }
	        this.sortWhenLoad();

	        findAbnormalUrl();

	        window.scrollTo(document.getElementById('buttonSend').offsetLeft,document.getElementById('buttonSend').offsetTop);
	    }.bind(this);
	};

	Table.prototype.saveTableData = function() {
	    var i;
	    $('#buttonSave').on('click', () =>{
	        this.arraySaveData = [];
	        var tbody = this.grid.getElementsByTagName('tbody')[0],
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
	                this.arraySaveData.push(obj);
	            }
	        }
	        /**
	         * arraySaveData - json сохраненных элементов таблицы
	         */
	        /*ВРЕМЕННЫЙ БЛОК*/
	        var arr = [];
	        if (this.arraySaveData) {
	            for (i = 0; i < this.arraySaveData.length; i++) {
	                arr.push(JSON.stringify(this.arraySaveData[i]));
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

	Table.prototype.sortWhenLoad = function() {
	    if (this.$theadTr.children('[data-type="date"]').find('span').html() === "↑&nbsp;" ||
	        this.$theadTr.children('[data-type="date"]').find('span').html() === "↓&nbsp;") {
	        this.$theadTr.children('[data-type="date"]').click().click();
	    } else if (this.$theadTr.children('[data-type="name"]').find('span').html() === "↑&nbsp;" ||
	        this.$theadTr.children('[data-type="name"]').find('span').html() === "↓&nbsp;") {
	        this.$theadTr.children('[data-type="name"]').click().click();
	    } else if (this.$theadTr.children('[data-type="count"]').find('span').html() === "↑&nbsp;" ||
	        this.$theadTr.children('[data-type="count"]').find('span').html() ===  "↓&nbsp;") {
	        this.$theadTr.children('[data-type="count"]').click().click();
	    } else if (this.$theadTr.children('[data-type="typeUrl"]').find('span').html() === "↑&nbsp;" ||
	        this.$theadTr.children('[data-type="typeUrl"]').find('span').html() === "↓&nbsp;") {
	        this.$theadTr.children('[data-type="typeUrl"]').click().click();
	    }
	};

	Table.prototype.checkBox = function() {
	    $('#checkboxOther').on('click', () => {
	        var tbody = this.grid.getElementsByTagName('tbody')[0],
	            rowsArray = [].slice.call(tbody.rows);
	        if ($('#checkboxOther').prop('checked') === false) {
	            for (var i = 0; i < rowsArray.length; i++) {
	                if (rowsArray[i].cells[3].innerHTML === 'other') {
	                    if (this.arraySaveData != undefined) {
	                        for (var j = 0; j < this.arraySaveData.length; j++) {
	                            if (this.arraySaveData[j].typeUrl === 'other') {
	                                this.arraySaveData.splice(j,1);
	                            }
	                        }
	                    }
	                    tbody.removeChild(rowsArray[i]);
	                    this.iOtherStart = 0;
	                    this.iOtherFin = 0;
	                    this.otherAllStart = 0;
	                    this.otherAllFin = 0;
	                    for (var j = 0; j < this.jsonLoadSave.length; j++) {
	                        if (this.jsonLoadSave[j].typeUrl === 'other') {
	                            this.jsonLoadSave.splice(j,1);
	                        }
	                    }
	                }
	            }
	        }
	    });
	    $('#checkboxSocial').on('click', () => {
	        var tbody = this.grid.getElementsByTagName('tbody')[0],
	            rowsArray = [].slice.call(tbody.rows);
	        if ($('#checkboxSocial').prop('checked') === false) {
	            for (var i = 0; i < rowsArray.length; i++) {
	                if (rowsArray[i].cells[3].innerHTML === 'social') {
	                    if (this.arraySaveData != undefined) {
	                        for (var j = 0; j < this.arraySaveData.length; j++) {
	                            if (this.arraySaveData[j].typeUrl === 'social') {
	                                this.arraySaveData.splice(j,1);
	                            }
	                        }
	                    }
	                    tbody.removeChild(rowsArray[i]);
	                    this.iSocialStart = 0;
	                    this.iSocialFin = 0;
	                    this.socialAllStart = 0;
	                    this.socialAllFin = 0;
	                    for (var j = 0; j < this.jsonLoadSave.length; j++) {
	                        if (this.jsonLoadSave[j].typeUrl === 'social') {
	                            this.jsonLoadSave.splice(j,1);
	                        }
	                    }
	                }
	            }
	        }
	    });
	    $('#checkboxMail').on('click', () => {
	        var tbody = this.grid.getElementsByTagName('tbody')[0],
	            rowsArray = [].slice.call(tbody.rows);
	        if ($('#checkboxMail').prop('checked') === false) {
	            for (var i = 0; i < rowsArray.length; i++) {
	                if (rowsArray[i].cells[3].innerHTML === 'mail') {
	                    if (this.arraySaveData != undefined) {
	                        for (var j = 0; j < this.arraySaveData.length; j++) {
	                            if (this.arraySaveData[j].typeUrl === 'mail') {
	                                this.arraySaveData.splice(j,1);
	                            }
	                        }
	                    }
	                    tbody.removeChild(rowsArray[i]);
	                    this.iMailStart = 0;
	                    this.iMailFin = 0;
	                    this.mailAllStart = 0;
	                    this.mailAllFin = 0;
	                    for (var j = 0; j < this.jsonLoadSave.length; j++) {
	                        if (this.jsonLoadSave[j].typeUrl === 'mail') {
	                            this.jsonLoadSave.splice(j,1);
	                        }
	                    }
	                }
	            }
	        }
	    });
	};
	/**
	 * Сортировка даты по убыванию
	 */
	function sortDateUp(a,b) {
	    if (a.date < b.date) {
	        return 1;
	    } else if(a.date > b.date) {
	        return -1;
	    } else {
	        return 0;
	    }
	}

	/**
	 * Сортировка даты по возрастанию
	 */
	function sortDateDown(a,b) {
	    if (a.date < b.date) {
	        return -1;
	    } else if(a.date > b.date) {
	        return 1;
	    } else {
	        return 0;
	    }
	}

	module.e = Table;



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var checkAll = function() {
	    var checkbox = $('.container__grid .container__category .row-checkbox input');
	    var checkboxMain = $('.container__grid .container__category .row_all input');
	    checkboxMain.on('click',function(){
	        for (var i = 0; i < checkbox.length; i++) {
	            if (checkboxMain[0].checked) {
	                checkbox[i].checked = true;
	            } else {
	                if (checkbox[i].checked) {
	                    checkbox[i].click();
	                }
	            }
	        }
	    });
	};

	module.e = checkAll;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
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

	module.e = highlightTableRows;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	/!**
	 * Находит все tr в определенном диапазоне времени
	 * @param dateStart
	 * @param dateFin
	 * @returns {Array}
	 *!/
	var findDate = function(dateStart, dateFin) {
	    var dateTr = document.querySelectorAll('tbody tr'),
	        dateTdArray = [];
	    for (var i = 0; i < dateTr.length; i++) {
	        var hours = (new Date(dateTr[i].querySelector('td').innerHTML)).getHours(),
	            minutes = (new Date(dateTr[i].querySelector('td').innerHTML)).getMinutes();
	        if (hours >= dateStart && hours <= dateFin) {
	            if (hours === dateFin && minutes >0) {
	                console.log('false');
	            } else {
	                dateTdArray.push(dateTr[i]);
	            }
	        }
	    }
	    return dateTdArray;
	};

	/!**
	 * Сортировка массива tr
	 * @param a
	 * @param b
	 * @returns {number}
	 *!/
	var sortArrayTr = function(a,b) {
	    a = a.querySelector('td').innerHTML;
	    b = b.querySelector('td').innerHTML;
	    if (a < b) {
	        return -1;
	    } else if (a > b) {
	        return 1;
	    } else {
	        return 0;
	    }
	};

	/!*var checkDate = function() {
	    var time = checkTime(findDate()),
	        timeArray = [];
	    for (var i = 0; i < time.length; i++) {
	        var yearI = (new Date(time[i])).getFullYear(),
	            monthI = (new Date(time[i])).getMonth(),
	            dayI = (new Date(time[i])).getDate();
	        for (var j = 0; j < time.length; j++) {
	            var yearJ = (new Date(time[j])).getFullYear(),
	                monthJ = (new Date(time[j])).getMonth(),
	                dayJ = (new Date(time[j])).getDate();
	            if (yearI === yearJ && monthI === monthJ && dayI === dayJ && timeArray[i] != time[i]) {
	                timeArray.push(time[i]);
	            }
	        }
	    }
	    console.log('timeArray',timeArray);
	    return timeArray;
	};*!/

	/!**
	 *  Поиск элементов в массиве (в данном случае строк), разница во времени которых <=10
	 * @param array
	 * @returns {Array}
	 *!/
	var templAbnUrl = function(array) {
	    var result = [];
	    for (var i = 0; i < array.length; i++) {
	        var firstDate = array[i].querySelector('td').innerHTML,
	            firstUrl = array[i].querySelectorAll('td')[1].innerHTML,
	            firstHours = new Date(firstDate).getHours(),
	            firstMinutes = new Date(firstDate).getMinutes(),
	            firstSeconds = new Date(firstDate).getSeconds(),
	            count = 0;
	        for (var j = 0; j < array.length; j++) {
	            var secondDate = array[j].querySelector('td').innerHTML,
	                secondUrl = array[j].querySelectorAll('td')[1].innerHTML,
	                secondHours = new Date(secondDate).getHours(),
	                secondMinutes = new Date(secondDate).getMinutes(),
	                secondSeconds = new Date(secondDate).getSeconds();
	            if (firstHours === secondHours && firstMinutes === secondMinutes && (secondSeconds - firstSeconds) <= 10 && (secondSeconds - firstSeconds >= 0)) {
	                count += 1;
	            }
	            if (count >= 2) {
	                result.push(array[i]);
	                result.push(array[j]);
	                count = 0;
	            }
	        }
	    }
	    return result;
	};

	/!**
	 * Вызывает findDate, сортирует каждйы массив по дате/времени, вызывает templAbnUrl, возвращает массив
	 * @returns {Array}
	 *!/
	var findAbnUrl = function() {
	    var first = findDate(9,10),
	        second = findDate(12,13),
	        third = findDate(18,19);

	    first.sort(sortArrayTr);
	    second.sort(sortArrayTr);
	    third.sort(sortArrayTr);


	    var firstCoint = templAbnUrl(first),
	        secondCoint = templAbnUrl(second),
	        thirdCoint = templAbnUrl(third),
	        result = [];
	    result.push(firstCoint,secondCoint,thirdCoint);
	    console.log('res',result);
	    return result;
	};


	/!**
	 *  Проверяет, содержится ли строка в каждой сессии пользователя
	 * @param array
	 * @returns {Array}
	 *!/
	var controlDate = function(array) {
	    console.log('array',array);
	    var first = array[0],
	        second = array[1],
	        third = array[2],
	        resultFirst = {},
	        result = {};
	    for (var i = 0; i < first.length; i++) {
	        var firstDate = (new Date(first[i].querySelector('td').innerHTML)).getDate(),
	            firstUrl = first[i].querySelectorAll('td')[1].innerHTML;
	        for (var j = 0; j < second.length; j++) {
	            var secondDate = (new Date(second[j].querySelector('td').innerHTML)).getDate(),
	                secondUrl = second[j].querySelectorAll('td')[1].innerHTML;
	            if (firstDate === secondDate && firstUrl === secondUrl) {
	                resultFirst[i] = first[i];
	                resultFirst[j+'a'] = second[j];
	            }
	        }
	    }
	    var resultKeys = Object.keys(resultFirst),
	        resultVal = [];
	    for (var i = 0; i < resultKeys.length; i++) {
	        resultVal.push(resultFirst[resultKeys[i]]);
	    }

	    for (var i = 0; i < resultVal.length; i++) {
	        var firstDate = (new Date(resultVal[i].querySelector('td').innerHTML)).getDate(),
	            firstUrl = resultVal[i].querySelectorAll('td')[1].innerHTML;
	        for (var j = 0; j < third.length; j++) {
	            var secondDate = (new Date(third[j].querySelector('td').innerHTML)).getDate(),
	                secondUrl = third[j].querySelectorAll('td')[1].innerHTML;
	            if (firstDate === secondDate && firstUrl === secondUrl) {
	                result[i] = resultVal[i];
	                result[j+'a'] = third[j];
	            }
	        }
	    }

	    resultKeys = Object.keys(result);
	    resultVal = [];
	    for (var i = 0; i < resultKeys.length; i++) {
	        resultVal.push(result[resultKeys[i]]);
	    }
	    return resultVal;
	};


	/!**
	 *  Подсветка найденных строк
	 *!/
	 var highLightDate = function() {
	    var high = controlDate(findAbnUrl());
	     /!*var h = findAbnUrl(),
	         high = [];
	     for (var j = 0; j < h.length; j++) {
	         for (var k = 0; k < h[j].length; k++) {
	             high.push(h[j][k]);
	         }
	     }*!/
	     console.log('high',high);
	     for (var i = 0; i < high.length; i++) {
	         high[i].style.color = 'red';
	     }
	 };


	var findAbnormalUrl = function() {
	    highLightDate();
	};

	module.exports = findAbnormalUrl;*/

	/**
	 * Принимает строку в формате YYYY/MM/DD
	 * @param dateStr
	 */
	var findDate = function(dateStr) {
	    var dateTr = document.querySelectorAll('tbody tr'),
	        dateTrArray = [];
	    [].forEach.call(dateTr,function(item) {
	        var year = (new Date(item.querySelector('td').innerHTML)).getFullYear(),
	            month = (new Date(item.querySelector('td').innerHTML)).getMonth(),
	            day = (new Date(item.querySelector('td').innerHTML)).getDate(),
	            fullDay;
	        day = (day < 10) ? "0" + day : day;
	        month = (month < 9) ? "0" + (month + 1) : month + 1;
	        fullDay = year + '/' + month + '/' + day;
	        if (fullDay === dateStr ) {
	            dateTrArray.push(item);
	        }
	    });
	    return dateTrArray;
	};

	/**
	 * Принимает на вход массив из tr и временной интервал в часах - startHours и endHours
	 * @param dateArray
	 * @param startHours
	 * @param endHours
	 */
	var findSession = function(dateArray, startHours, endHours) {
	    var arr = [];
	    for (var i = 0; i < dateArray.length; i++) {
	        var hours = (new Date(dateArray[i].querySelector('td').innerHTML)).getHours(),
	            minutes = (new Date(dateArray[i].querySelector('td').innerHTML)).getMinutes();
	        if (hours >= startHours && hours <= endHours) {
	            if (hours === endHours && minutes > 0) {
	                console.log('Время вышло за рамки');
	            } else {
	                arr.push(dateArray[i]);
	            }
	        }
	    }
	    return arr;
	};

	/*var checkElement = function(array, element) {
	    if (array.indexOf(element) != -1) {
	        return true;
	    } else {
	        return false;
	    }
	};*/

	var sortArrayTr = function(a,b) {
	    a = a.querySelector('td').innerHTML;
	    b = b.querySelector('td').innerHTML;
	    if (a < b) {
	        return -1;
	    } else if (a > b) {
	        return 1;
	    } else {
	        return 0;
	    }
	};



	var YYYYMMDDHHMMSS = function(year, month, day, hours, minutes, seconds) {
	    hours = (hours < 10) ? "0" + hours : hours;
	    minutes = (minutes < 10) ? "0" + minutes : minutes;
	    seconds = (seconds < 10) ? "0" + seconds : seconds;
	    month = (month < 9) ? "0" + (month + 1) : month + 1;
	    day = (day < 10) ? "0" + day : day;
	    return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
	};

	/**
	 * Ищет в сессии элементы, разница между которыми 10 секунд
	 * @param first
	 * @returns {{}}
	 */
	var findTenSeconds = function(session) {
	    var arr = [];
	    for (var i = 0; i < session.length; i++) {
	        var firstUrl = session[i].querySelectorAll('td')[1].innerHTML,
	            firstDate = new Date(session[i].querySelectorAll('td')[0].innerHTML),
	            firstYear = firstDate.getFullYear(),
	            firstMonth = firstDate.getMonth(),
	            firstDay = firstDate.getDate(),
	            firstHours = firstDate.getHours(),
	            firstMinutes = firstDate.getMinutes(),
	            firstSeconds = firstDate.getSeconds(),
	            fullDate = YYYYMMDDHHMMSS(firstYear,firstMonth,firstDay,firstHours,firstMinutes,firstSeconds),
	            count = 0;
	        for (var k = 0; k < session.length; k++) {
	            var firstUrlk = session[k].querySelectorAll('td')[1].innerHTML,
	                firstDatek = new Date(session[k].querySelectorAll('td')[0].innerHTML),
	                firstYeark = firstDatek.getFullYear(),
	                firstMonthk = firstDatek.getMonth(),
	                firstDayk = firstDatek.getDate(),
	                firstHoursk = firstDatek.getHours(),
	                firstMinutesk = firstDatek.getMinutes(),
	                firstSecondsk = firstDatek.getSeconds(),
	                fullDatek = YYYYMMDDHHMMSS(firstYeark,firstMonthk,firstDayk,firstHoursk,firstMinutesk,firstSecondsk);
	            /* console.log('fulldate',fullDate,'fk',fullDatek);*/
	            if (firstHours === firstHoursk && firstMinutes === firstMinutesk && (firstSecondsk - firstSeconds) <= 10 && (firstSecondsk - firstSeconds >= 0)) {
	                count += 1;
	                /* console.log('count: ',count);*/
	            }
	            if (count === 2) {
	               /* sessionTen[fullDate] = firstUrl;
	                sessionTen[fullDatek] = firstUrlk;*/
	                var obj = {};
	                obj[fullDate + ' ' + firstUrl] = fullDatek + ' ' + firstUrlk;
	                arr.push(obj);
	                count = 0;
	            }
	        }

	        /*for (var j = 0; j < second.length; j++) {
	         var secondUrl = first[i].querySelectorAll('td')[1].innerHTML,
	         secondDate = new Date(first[i].querySelectorAll('td')[0].innerHTML),
	         secondHours = secondDate.getHours(),
	         secondMinutes = secondDate.getMinutes(),
	         secondSeconds = secondDate.getSeconds();
	         if (firstUrl === secondUrl) {

	         }
	         }*/
	    }
	    return arr;
	    /*return sessionTen;*/
	};

	var saveObjectKey = function(arr) {
	    var arrayKey = [];
	    for (var i = 0; i < arr.length; i++) {
	        arrayKey.push(Object.keys(arr[i])[0]);
	    }
	    return arrayKey;
	};

	var checkSession = function(firstObj, firstArr, secondObj, secondArr, thirdObj, thirdArr) {
	    for(var i = 0; i < firstArr.length; i++) {
	        var firstArrDate = firstArr[i].slice(0,19),
	            firstArrUrl = firstArr[i].slice(20),
	            firstObjDate = firstObj[i][firstArrDate + ' ' + firstArrUrl].slice(0,19),
	            firstObjUrl = firstObj[i][firstArrDate + ' ' + firstArrUrl].slice(20);
	        console.log('firstArrDate', firstArrDate, 'firstArrUrl',firstArrUrl);
	        console.log('firstObjDate',firstObjDate,'firstObjUrl',firstObjUrl );
	    }
	};


	/**
	 * Собираем в кучу все классненькие функции и ищем наконец аномальные переходы
	 */
	var findCoin = function() {
	    /**
	     * Создается массив из tr по каждой сессии
	     */
	    var first = findSession(findDate("2016/03/05"), 9, 10),
	        second = findSession(findDate("2016/03/05"), 12, 13),
	        third = findSession(findDate("2016/03/05"), 18, 19);
	    /**
	     * Сортировка по дате
	     */
	    first.sort(sortArrayTr);
	    second.sort(sortArrayTr);
	    third.sort(sortArrayTr);

	    /**
	     * Массив объектов, где ключ -> значение - переход в течение 10 секунд
	     * @type {{}}
	     */
	    var firstArrayObj = findTenSeconds(first),
	        secondArrayObj = findTenSeconds(second),
	        thirdArrayObj = findTenSeconds(third);
	    /**
	     * Собирается массив ключей каждого объекта
	     */
	    var firstArray = saveObjectKey(firstArrayObj),
	        secondArray = saveObjectKey(secondArrayObj),
	        thirdArray = saveObjectKey(thirdArrayObj);

	  /*  console.log(firstArrayObj);
	    console.log(secondArrayObj);
	    console.log(thirdArrayObj);*/
	    console.log(checkSession(firstArrayObj, firstArray, secondArrayObj, secondArray, thirdArrayObj, thirdArray));
	};

	var findAbnormalUrl = function() {
	    findCoin();
	};

	module.e = findAbnormalUrl;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by ubuntu on 22.02.16.
	 */
	var Table = __webpack_require__(1),
	    highlightTableRows = __webpack_require__(3),
	    GridSortTr = __webpack_require__(0),
	    checkAll = __webpack_require__(2);


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



/***/ }
/******/ ]);
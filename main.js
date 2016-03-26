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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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

	
	var findUrl = __webpack_require__(5);
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
	    this.loadTable();
	    this.buttonSend();
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
	        var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
	        /**
	         * Подсчет полного Url
	         */
	        for (i = 0; i < dataLength; i++) {
	            for (var j = 0; j < data.length; j++) {
	                if (data[i].name === data[j].name) {
	                    data[i].count++;
	                } else if (this.jsonArray[i] != data[i]) {
	                    this.jsonArray.push(data[i]);
	                }
	            }
	        }
	        /**
	         * Подсчет базового Url
	         */
	        for (i = 0; i < this.jsonArray.length; i++) {
	            this.jsonArray[i].baseUrl = re.exec(this.jsonArray[i].name)[0];
	            for (var j = 0; j < this.jsonArray.length; j++) {
	                if (re.exec(this.jsonArray[i].name)[0] === re.exec(this.jsonArray[j].name)[0]) {
	                    this.jsonArray[i].countBase++;
	                }
	            }
	        }
	        /**
	         * Подсчет кол-ва посещений в день полного Url
	         */
	        for (i = 0; i < this.jsonArray.length; i++) {
	            for (var j = 0; j < this.jsonArray.length; j++) {
	                if (this.jsonArray[i].name === this.jsonArray[j].name && this.jsonArray[i].date === this.jsonArray[j].date) {
	                    this.jsonArray[i].countInDay++;
	                }
	            }
	        }

	        /**
	         * Подсчет кол-ва посещений в день базового Url
	         */
	        for (i = 0; i < this.jsonArray.length; i++) {
	            this.jsonArray[i].baseUrl = re.exec(this.jsonArray[i].name)[0];
	            for (var j = 0; j < this.jsonArray.length; j++) {
	                if (re.exec(this.jsonArray[i].name)[0] === re.exec(this.jsonArray[j].name)[0] && this.jsonArray[i].date === this.jsonArray[j].date) {
	                    this.jsonArray[i].countBaseInDay++;
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
	        var re = /\d\d\d\d\/\d\d\/\d\d/;
	        if($('.date-pick').val() === '') {
	            alert('Выберите дату!');
	            return;
	        } else if(!re.test($('.date-pick').val())) {
	            alert('Дата должна соответствовать маске: ММ/ДД/ГГГГ');
	            return;
	        }

	        var pickerDate = $('.date-pick').val();

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
	            alert('Выберите данные для загрузки!');
	            return;
	        }
	        this.allStart = this.otherAllStart + this.mailAllStart + this.socialAllStart;
	        this.allFin = this.otherAllFin + this.mailAllFin + this.socialAllFin;

	        if (this.allStart === this.allFin) {
	            alert('Данных для загрузки больше нет!');
	            return;
	        };

	        for (var j = this.allStart; j < this.allFin; j++) {
	            this.$tbody.append('<tr><td>' + this.jsonLoadSave[j].date + " " + this.jsonLoadSave[j].time + '</td><td>' + this.jsonLoadSave[j].name + '</td><td>'
	                + this.jsonLoadSave[j].count + '</td>' + '<td>' + this.jsonLoadSave[j].typeUrl + '</td></tr>');
	        }
	        this.sortWhenLoad();


	        var arrAll = this.jsonTypeMail.concat(this.jsonTypeOther).concat(this.jsonTypeSocial);
	     /*   findUrl(pickerDate,arrAll);*/
	        /*findAbnormalUrl(pickerDate);*/
	        findUrl(pickerDate,arrAll);

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

	/*function checkPicker() {
	    var re = /\d\d\/\d\d\/\d\d\d\d/;
	    if (!re.test($('.date-pick').val())) {
	        alert('Выберите дату!');
	        return;
	    }
	}*/

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
	 * Created by ubuntu on 14.03.16.
	 */


	var datePick = function() {
	    $(function() {
	        $( "#datepicker" ).datepicker({ dateFormat: 'yy/mm/dd' });
	    });
	};

	module.e = datePick;

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Поиск данных с нужной датой
	 * Принимает на вход массив, содержащий строку в формате YYYY/MM/DD и массив всех данных
	 * @param arr
	 */
	var findDate = function(pickerDate,arrAll) {
	    var dateArray = [];
	    arrAll.forEach(function(item) {
	        if (item.date === pickerDate ) {
	            dateArray.push(item);
	        }
	    });
	    return dateArray;
	};
	/**
	 * Поиск сессий
	 * @param dateArray
	 * @param startHours
	 * @param endHours
	 * @returns {Array}
	 */
	var findSession = function(dateArray, startHours, endHours) {
	    var arr = [];
	    for (var i = 0; i < dateArray.length; i++) {
	        var hours = (new Date(dateArray[i].date + " " + dateArray[i].time)).getHours(),
	            minutes = (new Date(dateArray[i].date + " " + dateArray[i].time)).getMinutes();
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
	/**
	 * Сортировка по времени
	 * @param a
	 * @param b
	 * @returns {number}
	 */
	var sortArray = function(a,b) {
	    a = a.time;
	    b = b.time;
	    if (a < b) {
	        return -1;
	    } else if (a > b) {
	        return 1;
	    } else {
	        return 0;
	    }
	};

	/**
	 * Убираем из массива повторяющиеся объект по имени
	 * @param arr
	 * @returns {Array}
	 */
	var unique = function(arr) {
	    var result = [];
	    nextInput:
	        for (var i = 0; i < arr.length; i++) {
	            var str = arr[i].name; // для каждого элемента

	            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
	                if (result[j]) {
	                    if (result[j] === str) continue nextInput; // если да, то следующий
	                }

	            }
	            result.push(str);
	        }

	    return result;
	};

	/**
	 * Убираем из массива повторяющиеся элементы по имени
	 * @param arr
	 * @returns {Array}
	 */
	var uniqueArr = function(arr) {
	    var result = [];
	    nextInput:
	        for (var i = 0; i < arr.length; i++) {
	            var str = arr[i]; // для каждого элемента

	            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
	                if (result[j]) {
	                    if (result[j] === str) continue nextInput; // если да, то следующий
	                }

	            }
	            result.push(str);
	        }

	    return result;
	};

	/**
	 * Проверка элемента на вхождение в данном массиве
	 * @param array
	 * @param element
	 * @returns {boolean}
	 */
	var checkElement = function(array, element) {
	    if (array.indexOf(element) != -1) {
	        return true;
	    } else {
	        return false;
	    }
	};

	/**
	 * Базовый Url, который встречается во всех трех сессиях
	 * @param first
	 * @param second
	 * @param third
	 */
	var checkThreeSession = function(first, second, third) {
	    var arr = [];
	    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
	    for (var i = 0; i < first.length; i++) {
	        if (checkElement(second, re.exec(first[i])[0]) && checkElement(third,  re.exec(first[i])[0])) {
	            arr.push(re.exec(first[i])[0]);
	        }
	    }
	    return arr;
	};



	/**
	 * Ищет в сессии элементы, разница между которыми 10 секунд для аномальных url
	 * @param session, common
	 */
	var findTenSecondsYes = function(session, common) {
	    var arrYes = [];
	    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
	    for (var i = 0; i < session.length; i++) {
	        var firstUrl = session[i].baseUrl,
	            firstDateFull = new Date(session[i].date + " " + session[i].time),
	            firstDate = session[i].date,
	            firstTime = session[i].time;
	        for (var j = 0; j < session.length; j++) {
	            var secondUrl = session[j].baseUrl,
	                secondDateFull = new Date(session[j].date + " " + session[j].time),
	                secondDate = session[j].date,
	                secondTime = session[j].time;
	            if (secondDateFull.getTime() - firstDateFull.getTime() <= 10000 && secondDateFull.getTime() - firstDateFull.getTime() >= 0 && firstDateFull !== secondDateFull && checkElement(common,re.exec(firstUrl)[0]) && checkElement(common,re.exec(secondUrl)[0]) && firstTime!==secondTime) {
	                var obj = {
	                    from: "",
	                    to: ""
	                };
	                obj.from = session[i];
	                obj.to = session[j];
	                arrYes.push(obj);
	            }
	        }
	    }
	    return arrYes;
	};


	var findElementsBetweenAbn = function(arrYes, session) {
	    var arrNo = [];
	    arrYes.forEach(function(itemYes) {
	        var itemYesFromFullDate = new Date(itemYes.from.date + " " + itemYes.from.time).getTime(),
	            itemYesToFullDate = new Date(itemYes.to.date + " " + itemYes.to.time).getTime();
	        session.forEach(function(itemSession) {
	            var itemSessionFullDate = new Date(itemSession.date + " " + itemSession.time).getTime();
	            if (itemSessionFullDate >= itemYesFromFullDate && itemSessionFullDate <= itemYesToFullDate) {
	                arrNo.push(itemSession);
	            }
	        });
	    });
	    return arrNo;
	};


	/**
	 * Убираем из массива повторяющиеся объекты по имени. Возвращает массив объектов!
	 * @param arr
	 * @returns {Array}
	 */
	var uniqueNo = function(arr) {
	    var result = [];
	    nextInput:
	        for (var i = 0; i < arr.length; i++) {
	            var obj = arr[i];
	            var name = arr[i].name; // для каждого элемента
	            var date = new Date(arr[i].date + " " + arr[i].time).getTime();
	            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
	                if (result[j].name) {
	                    if (result[j].name === name && (new Date(result[j].date + ' ' + result[j].time).getTime()) === date) continue nextInput; // если да, то следующий
	                }

	            }
	            result.push(obj);
	        }

	    return result;
	};

	var findUrl = function(pickerDate,arrAll) {
	    /**
	     * Поиск всех объектов по нужной дате
	     */
	    var arrAllDate = findDate(pickerDate,arrAll);
	    /**
	     * Поиск сессий
	     */
	    var firstSession = findSession(arrAllDate, 9, 10),
	        secondSession = findSession(arrAllDate, 12, 13),
	        thirdSession = findSession(arrAllDate, 18, 19);
	    /**
	     * Сортировка каждой сессии по времени для удобства
	     */
	    var firstSessionSort = firstSession.sort(sortArray),
	        secondSessionSort = secondSession.sort(sortArray),
	        thirdSessionSort = thirdSession.sort(sortArray);
	    /**
	     * Собираем уникальные элементы (по url), чтобы дальше искать общий повторяющийся элемент
	     */
	    var firstSessionSortUnique = unique(firstSessionSort),
	        secondSessionSortUnique = unique(secondSessionSort),
	        thirdSessionSortUnique = unique(thirdSessionSort);
	    /**
	     * Поиск url, которые присутствуют во всех трех сессиях
	     */
	    var common = uniqueArr(checkThreeSession(firstSessionSortUnique,secondSessionSortUnique,thirdSessionSortUnique));
	    /**
	     * Массив объектов с переходами по аномальным url
	     */
	    var firstTenYes = findTenSecondsYes(firstSession, common),
	        secondTenYes = findTenSecondsYes(secondSession, common),
	        thirdTenYes = findTenSecondsYes(thirdSession, common);
	    /**
	     * Поиск элементов между аномальными
	     */
	    var firstTenNo = findElementsBetweenAbn(firstTenYes, firstSession),
	        secondTenNo = findElementsBetweenAbn(secondTenYes, secondSession),
	        thirdTenNo = findElementsBetweenAbn(thirdTenYes, thirdSession);

	    console.log(uniqueNo(firstTenNo));
	};

	module.e = findUrl;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by ubuntu on 22.02.16.
	 */
	var Table = __webpack_require__(1),
	    highlightTableRows = __webpack_require__(4),
	    GridSortTr = __webpack_require__(0),
	    checkAll = __webpack_require__(2),
	    datePicker = __webpack_require__(3);


	var grid = "grid", //id таблицы
	    table = new Table(grid),//загрузка, обработка, сохранение данных таблицы
	    tableSort = new GridSortTr(); //сортировка таблицы

	table.init();
	tableSort.init();
	highlightTableRows(grid,"hoverRow","clickedRow");
	checkAll();
	datePicker();



/***/ }
/******/ ]);
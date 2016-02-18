$(document).ready(function() {

    function GridSort(grid) {
        this.grid = grid;
    }

    /**
     * Инициализаия объекта
     */
    GridSort.prototype.initialize = function() {
        this.gridClick();
        this.buttonSend();
        this.loadTable();
        this.checkBox();
        this.saveTableData();
        highlightTableRows("grid","hoverRow","clickedRow");
    };

    /**
     * Загрузка JSON-файла
     */
    GridSort.prototype.loadTable = function() {
        var $grid = $(this.grid),
            $tbody = $grid.find('tbody');
        this.jsonArray = [];
        this.jsonLoadSave = [];
        this.jsonTypeMail = [];
        this.jsonTypeOther = [];

        $.getJSON('index.json', function (data) {
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
            console.log(this.jsonArray);
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
     * Обработчик события (клик по заголовку таблицы)
     */
    GridSort.prototype.gridClick = function() {
        var self = this;
        this.grid.onclick = function(e) {
            if (e.target.tagName != 'TH') return;
            self.tableSort(e.target.cellIndex, e.target.getAttribute('data-type'));
        };
    };

    /**
     * Сортировка tbody
     * @param colNum - положение th, на который был клик
     * @param typeOfSort - тип объекта
     */
    GridSort.prototype.tableSort = function(colNum, typeOfSort) {
        if (!this.grid.querySelector('tbody').innerHTML) {
            console.log('tbody пока нет');
            return;
        }
        var tbody = this.grid.getElementsByTagName('tbody')[0],
            rowsArray = [].slice.call(tbody.rows),
            compare;
            this.jsonArraySave = this.jsonLoadSave.map(function(object) {
	            return $.extend({}, object);
            });
        switch (typeOfSort) {
        /**
         * Сортировка по дате
         */
            case 'data':
                compare = function(rowA, rowB) {
                    return new Date('1970/01/01 ' + rowA.cells[colNum].innerHTML) - new Date('1970/01/01 ' + rowB.cells[colNum].innerHTML);
                };
                rowsArray.sort(compare);
                this.grid.removeChild(tbody);
                for (var i = 0; i < rowsArray.length; i++) {
                    tbody.appendChild(rowsArray[i]);
                }
                this.grid.appendChild(tbody);
                break;
        /**
         * Сортировка по количеству url (name)
         */
            case 'count':
                console.log('save',this.jsonArraySave);
                this.jsonArraySave.sort(function(a, b){
                    if (a.count > b.count)
                        return -1;
                    if (a.count < b.count)
                        return 1;
                    return 0;
                });
                $(this.grid).find('tbody').html('');
                console.log($(this.grid).find('tbody').html());
                for (var i = 0; i < this.jsonArraySave.length; i++) {
                    $(this.grid).append('<tr><td>' + this.jsonArraySave[i].date + '</td><td>' + this.jsonArraySave[i].name + '</td><td>'
                        + this.jsonArraySave[i].count + '</td>' +
                        '<td>' + this.jsonArraySave[i].typeUrl + '</td></tr>');
                }
                break;
        }
    };

    /**
     * Обработичк события - клик по кнопке 'Загрузить'
     */
    GridSort.prototype.buttonSend = function() {
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
            console.log('this.jsonLoadSave->',this.jsonLoadSave);
        }.bind(this);
    };

    GridSort.prototype.saveTableData = function() {
        var self = this,
            obj = {},
            arraySaveData = [];
        $('#buttonSave').on('click', function(){
            var tbody = self.grid.getElementsByTagName('tbody')[0],
                rowsArray = [].slice.call(tbody.rows);
            for (var i = 0; i < rowsArray.length; i++) {
                /*for (var j = 0; j < rowsArray[i].cells.length; j++){*/
                obj["date"] = rowsArray[i].cells[0].innerHTML;
                obj["name"] = rowsArray[i].cells[1].innerHTML;
                obj["count"] = rowsArray[i].cells[2].innerHTML;
                obj["typeUrl"] = rowsArray[i].cells[3].innerHTML;
                    /*arr.push(rowsArray[i].cells[j].innerHTML);*/
                arraySaveData.push(obj);
            }
            /**
             * arraySaveData - json сохраненных элементов таблицы
             */
            console.log(arraySaveData);
        });

    };

    GridSort.prototype.checkBox = function() {
        var self = this;
        $('#checkboxOther').on('click', function(){
            var tbody = self.grid.getElementsByTagName('tbody')[0],
                rowsArray = [].slice.call(tbody.rows);
            if ($('#checkboxOther').prop('checked') === false) {
                for (var i = 0; i < rowsArray.length; i++) {
                    if (rowsArray[i].cells[3].innerHTML === 'other') {
                        tbody.removeChild(rowsArray[i]);
                        self.iOtherStart = 0;
                        self.iOtherFin = 0;
                        for (var j = 0; j < self.jsonLoadSave.length; j++) {
                            if (self.jsonLoadSave[j].typeUrl === 'other') {
                                var arr = self.jsonLoadSave.splice(j,1);
                                console.log('splice mail', arr);
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
                console.log(' self.jsonLoadSave.length', self.jsonLoadSave);
                for (var i = 0; i < rowsArray.length; i++) {
                    if (rowsArray[i].cells[3].innerHTML === 'mail') {
                        tbody.removeChild(rowsArray[i]);
                        self.iMailStart = 0;
                        self.iMailFin = 0;
                        for (var j = 0; j < self.jsonLoadSave.length; j++) {
                            if (self.jsonLoadSave[j].typeUrl === 'mail') {
                                var arr = self.jsonLoadSave.splice(j,1);
                                console.log('splice mail', arr);
                            }
                        }
                    }
                }
                console.log('long', self.jsonLoadSave);
            }
        });

    };

    var table = new GridSort(document.getElementById('grid'));

    table.initialize();


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
});


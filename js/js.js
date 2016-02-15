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

	   /* console.log('>', this.jsonArray);
	    var map = {};
	    this.jsonArray.forEach(function(object) {
		    console.log('object',object);
		    var key = JSON.stringify({name: object.name, date: object.date, type: object.typeUrl});
		    if (map[key]) {
/!*			    object.forEach(function(item){
				    if (object.name === item.name) {

				    }
			    });*!/
			    map[key] += object.count;
		    } else {
			    map[key] = object.count;
		    }
	    });
	    console.log('Object.keys(map)', Object.keys(map));
	    var result = Object.keys(map).map(function(key) {
		    /!*return $.extend({count: map[key]}, JSON.parse(key));*!/
		    var obj = JSON.parse(key);
		    console.log('obj',obj);
		    obj.count = map[key];
		    return obj;
	    });
	    console.log('result', result);*/
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
                this.jsonArraySave.sort(function(a, b){
                    if (a.count > b.count)
                        return -1;
                    if (a.count < b.count)
                        return 1;
                    return 0
                });
                this.grid.removeChild(tbody);
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
        var self = this,
            i,
            iMailStart = 0,
            iMailFin = 0,
            iOtherStart = 0,
            iOtherFin = 0,
            $grid = $(this.grid),
            $tbody = $grid.find('tbody'),
            buttonSend = document.getElementById('buttonSend');
        buttonSend.onclick = function() {
            if ($('#checkboxOther').prop('checked') === false && $('#checkboxMail').prop('checked') === true) {
                iMailFin += 4;
                if (iMailFin > this.jsonTypeMail.length) {
                    while (iMailFin > this.jsonTypeMail.length) {
                        iMailFin -= 1;
                    }
                }
                if (iMailStart > this.jsonTypeMail.length) {
                    while (iMailStart > this.jsonTypeMail.length) {
                        iMailStart -= 1;
                    }
                }
                for (i = iMailStart; i < iMailFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeMail[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeMail[i].date + '</td><td>' + this.jsonTypeMail[i].name + '</td><td>'
                        + this.jsonTypeMail[i].count + '</td>' + '<td>' + this.jsonTypeMail[i].typeUrl + '</td></tr>');
                }
                iMailStart += 4;
            } else if ($('#checkboxMail').prop('checked') === false && $('#checkboxOther').prop('checked') === true) {
                iOtherFin += 4;
                if (iOtherFin > this.jsonTypeOther.length) {
                    while (iOtherFin > this.jsonTypeOther.length) {
                        iOtherFin -= 1;
                    }
                }
                if (iOtherStart > this.jsonTypeOther.length) {
                    while (iOtherStart > this.jsonTypeOther.length) {
                        iOtherStart -= 1;
                    }
                }
                for (i = iOtherStart; i < iOtherFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeOther[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeOther[i].date + '</td><td>' + this.jsonTypeOther[i].name + '</td><td>'
                        + this.jsonTypeOther[i].count + '</td>' + '<td>' + this.jsonTypeOther[i].typeUrl + '</td></tr>');
                }
                iOtherStart += 4;
            } else if ($('#checkboxOther').prop('checked') === true && $('#checkboxMail').prop('checked') === true) {
                iOtherFin += 2;
                iMailFin +=2;
                if (iOtherFin > this.jsonTypeOther.length) {
                    while (iOtherFin > this.jsonTypeOther.length) {
                        iOtherFin -= 1;
                    }
                }
                if (iOtherStart > this.jsonTypeOther.length) {
                    while (iOtherStart > this.jsonTypeOther.length) {
                        iOtherStart -= 1;
                    }
                }
                if (iMailFin > this.jsonTypeMail.length) {
                    while (iMailFin > this.jsonTypeMail.length) {
                        iMailFin -= 1;
                    }
                }
                if (iMailStart > this.jsonTypeMail.length) {
                    while (iMailStart > this.jsonTypeMail.length) {
                        iMailStart -= 1;
                    }
                }
                for (i = iMailStart; i < iMailFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeMail[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeMail[i].date + '</td><td>' + this.jsonTypeMail[i].name + '</td><td>'
                        + this.jsonTypeMail[i].count + '</td>' + '<td>' + this.jsonTypeMail[i].typeUrl + '</td></tr>');
                }
                for (i = iOtherStart; i < iOtherFin; i++) {
                    this.jsonLoadSave.push(this.jsonTypeOther[i]);
                    $tbody.append('<tr><td>' + this.jsonTypeOther[i].date + '</td><td>' + this.jsonTypeOther[i].name + '</td><td>'
                        + this.jsonTypeOther[i].count + '</td>' + '<td>' + this.jsonTypeOther[i].typeUrl + '</td></tr>');
                }
                iOtherStart += 2;
                iMailStart +=2;
            } else {
                alert('Выберите, что хотите загрузить!');
            }
        }.bind(this);
    };

    var table = new GridSort(document.getElementById('grid'));

    table.initialize();
});


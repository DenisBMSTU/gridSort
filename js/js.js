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
    };

    /**
     * Загрузка JSON-файла
     */
    GridSort.prototype.loadTable = function() {
        var $grid = $(this.grid);
        $.getJSON('index.json', function (data) {
            $grid.find('tbody').html('');
            this.jsonArray = [];
            this.jsonLoadSave = [];
            for (var i = 0, dataLength = data.length; i < dataLength; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (data[i].name === data[j].name) {
                        data[i].count++;
                    } else if (this.jsonArray[i] != data[i]) {
                        this.jsonArray.push(data[i]);
                    }
                }
            }
            $grid.append('<tbody>');
            for (var i = 0, jsonArrayLength = this.jsonArray.length; i < jsonArrayLength; i++) {
                if ($('#checkboxMail').prop('checked') === true) {
                    if (data[i].typeUrl === '2') {
                        this.jsonLoadSave.push(this.jsonArray[i]);
                        $grid.append('<tr><td>' + this.jsonArray[i].date + '</td><td>' + this.jsonArray[i].name + '</td><td>'
                            + this.jsonArray[i].count + '</td>' + '<td>' + this.jsonArray[i].typeUrl + '</td></tr>');
                    }
                }
                if ($('#checkboxOther').prop('checked') === true) {
                    if (data[i].typeUrl === '1') {
                        this.jsonLoadSave.push(this.jsonArray[i]);
                        $grid.append('<tr><td>' + this.jsonArray[i].date + '</td><td>' + this.jsonArray[i].name + '</td><td>'
                            + this.jsonArray[i].count + '</td>' + '<td>' + this.jsonArray[i].typeUrl + '</td></tr>');
                    }
                }
/*                $grid.append('<tr><td>' + this.jsonArray[i].date + '</td><td>' + this.jsonArray[i].name + '</td><td>' + this.jsonArray[i].count + '</td>' +
                    '<td>' + this.jsonArray[i].typeUrl + '</td></tr>');*/
            }
            console.log('->',this.jsonLoadSave);
            $grid.append('</tbody>');
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
        if (this.grid.querySelector('tbody') === null) {
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
            buttonSend = document.getElementById('buttonSend');
            buttonSend.onclick = function() {
	            /*
                var tableTbody = document.getElementById('grid').querySelector('tbody');
                if (tableTbody!=null) {
                    return;
                }*/
                self.loadTable();
        }
    };

    var table = new GridSort(document.getElementById('grid'));

    table.initialize();



});


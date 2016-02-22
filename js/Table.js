
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


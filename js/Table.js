'use strict';
function Table(grid) {
    this.grid = document.getElementById(grid);
    this.$grid = $(this.grid);
    this.$tbody = this.$grid.find('tbody');
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
            }
        }
        this.jsonTypeMail.sort(sortDateDown);
        this.jsonTypeOther.sort(sortDateDown);
    }.bind(this));
};

/**
 * Обработичк события - клик по кнопке 'Загрузить'
 */
Table.prototype.buttonSend = function() {
    var i,
        buttonSend = document.getElementById('buttonSend'),
        countIncrement = 4; //кол-во строк, выгружаемых в таблицу

    this.iMailStart = 0;
    this.iMailFin = 0;
    this.iOtherStart = 0;
    this.iOtherFin = 0;
    buttonSend.onclick = function() {
        if ($('#checkboxOther').prop('checked') === false && $('#checkboxMail').prop('checked') === true) {
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
                this.$tbody.append('<tr><td>' + this.jsonTypeMail[i].date + '</td><td>' + this.jsonTypeMail[i].name + '</td><td>'
                    + this.jsonTypeMail[i].count + '</td>' + '<td>' + this.jsonTypeMail[i].typeUrl + '</td></tr>');
            }
            this.iMailStart += countIncrement;
        } else if ($('#checkboxMail').prop('checked') === false && $('#checkboxOther').prop('checked') === true) {
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
                this.$tbody.append('<tr><td>' + this.jsonTypeOther[i].date + '</td><td>' + this.jsonTypeOther[i].name + '</td><td>'
                    + this.jsonTypeOther[i].count + '</td>' + '<td>' + this.jsonTypeOther[i].typeUrl + '</td></tr>');
            }
            this.iOtherStart += countIncrement;
        } else if ($('#checkboxOther').prop('checked') === true && $('#checkboxMail').prop('checked') === true) {
            this.iOtherFin += countIncrement/2;
            this.iMailFin += countIncrement/2;
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
                this.$tbody.append('<tr><td>' + this.jsonTypeMail[i].date + '</td><td>' + this.jsonTypeMail[i].name + '</td><td>'
                    + this.jsonTypeMail[i].count + '</td>' + '<td>' + this.jsonTypeMail[i].typeUrl + '</td></tr>');
            }
            for (i = this.iOtherStart; i < this.iOtherFin; i++) {
                this.jsonLoadSave.push(this.jsonTypeOther[i]);
                this.$tbody.append('<tr><td>' + this.jsonTypeOther[i].date + '</td><td>' + this.jsonTypeOther[i].name + '</td><td>'
                    + this.jsonTypeOther[i].count + '</td>' + '<td>' + this.jsonTypeOther[i].typeUrl + '</td></tr>');
            }
            this.iOtherStart += countIncrement/2;
            this.iMailStart += countIncrement/2;
        } else {
            alert('Выберите, что хотите загрузить!');
        }
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
        console.log(this.arraySaveData);
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
                    for (var j = 0; j < this.jsonLoadSave.length; j++) {
                        if (this.jsonLoadSave[j].typeUrl === 'other') {
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
function sortDateDown(a,b) {
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
function sortDateUp(a,b) {
    if (a.date < b.date) {
        return -1;
    } else if(a.date > b.date) {
        return 1;
    } else {
        return 0;
    }
}

module.exports = Table;


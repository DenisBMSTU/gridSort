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
        this.jsonTypeMail.sort(sortDateDown);
        this.jsonTypeOther.sort(sortDateDown);
        this.jsonTypeSocial.sort(sortDateDown);
        console.log(this.jsonTypeOther);
    }.bind(this));
};

/**
 * Обработичк события - клик по кнопке 'Загрузить'
 */
Table.prototype.buttonSend = function() {
    var i,
        buttonSend = document.getElementById('buttonSend'),
        countIncrement = 4; //кол-во строк, выгружаемых в таблицу
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
    buttonSend.onclick = function() {
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
            console.log('this.allStart',this.allStart, 'this.allFin', this.allFin,'this.iOtherStart', this.iOtherStart, 'this.iOtherFin', this.iOtherFin );
        }
        if ($('#checkboxMail').prop('checked') === false && $('#checkboxOther').prop('checked') === false && $('#checkboxSocial').prop('checked') === false) {
            alert('Выберите данные для загрузки');
            return;
        }
        this.allStart = this.otherAllStart + this.mailAllStart + this.socialAllStart;
        this.allFin = this.otherAllFin + this.mailAllFin + this.socialAllFin;
        console.log('this.allStart',this.allStart, 'this.allFin', this.allFin, 'this.jsonLoadSave',this.jsonLoadSave);
        for (var j = this.allStart; j < this.allFin; j++) {
            this.$tbody.append('<tr><td>' + this.jsonLoadSave[j].date + '</td><td>' + this.jsonLoadSave[j].name + '</td><td>'
                + this.jsonLoadSave[j].count + '</td>' + '<td>' + this.jsonLoadSave[j].typeUrl + '</td></tr>');
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


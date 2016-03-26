var moment = require('moment');
require('moment-range');

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

var checkObject = function(array, element) {
    array.forEach(function(item) {
        if (item.baseUrl === element) {
            return false;
        }
    });
    return true;
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
            if (secondDateFull.getTime() - firstDateFull.getTime() <= 10000 && secondDateFull.getTime() - firstDateFull.getTime() >= 0 && firstDateFull !== secondDateFull && checkElement(common,firstUrl) && checkElement(common,secondUrl) && firstTime!==secondTime) {
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


var uniqueObj = function(arr) {
    var result = [];
    nextInput:
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var baseUrl = arr[i].baseUrl; // для каждого элемента
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                if (result[j].baseUrl) {
                    if (result[j].baseUrl === baseUrl) continue nextInput; // если да, то следующий
                }

            }
            result.push(obj);
        }

    return result;
};

var loadInComm = function(arrYes, arrNo) {
    $('#info').html('');
    $('#info').append('<div>Переходы <span style="color:#EB1526">по</span> важным ссылкам:</div>');
    for(var i = 0; i < arrYes.length; i++) {
        $('#info').append('<div>' + arrYes[i].from.name + ' -> ' + arrYes[i].to.name + '</div>');
    }
    $('#info').append('<div>Переходы <span style="color:#EB1526">между</span> важными ссылками:</div>');
    for(var i = 0; i < arrNo.length; i++) {
        $('#info').append('<div>' + arrNo[i].name + '</div>');
    }
};

var YYYYMMDD = function(date) {
    var year = new Date(date).getFullYear(),
        month = (new Date(date).getMonth() < 9) ? "0" + (new Date(date).getMonth() + 1) : new Date(date).getMonth() + 1,
        day = (new Date(date).getDate() < 10) ? "0" + new Date(date).getDate() : new Date(date).getDate();
    return year + '' + month + '' + day
};

var dateRange = function(start,end) {

    var startDate = new Date(start),
        endDate = new Date(end);

    var dateStrings = [],
        str;
    while (startDate <= endDate){
        var year = startDate.getFullYear(),
            month = (startDate.getMonth() < 9) ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1,
            day = (startDate.getDate() < 10) ? "0" + startDate.getDate() : startDate.getDate();
        str = year + "/" + month + "/" + day;
        dateStrings.push(str);
        startDate.setDate(startDate.getDate()+1);
    }

    return dateStrings;
};

var findUrl = function(pickerDateFrom, pickerDateTo,arrAll) {

    /**
     * Массив всех дат
     */
    var dateArray = dateRange(pickerDateFrom,pickerDateTo);

    var findUrlObj = [];
    /**
     * Проходимся по всем датам
     */
    dateArray.forEach(function(date) {
        var obj = {
                yes: {
                    first: "",
                    second: "",
                    third: ""
                },
                no: {
                    first: "",
                    second: "",
                    third: ""
                },
                common: ""
        };
        /**
         * Поиск всех объектов по нужной дате
         */
        var arrAllDate = findDate(date,arrAll);
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

        var arrCommon = [];
        firstTenYes.forEach(function(item) {
            if (checkObject(arrCommon, item.from.baseUrl) != false) {
                var obj = {
                    baseUrl: "",
                    countBaseInDay: 0,
                    countBase: 0
                };
                obj.baseUrl = item.from.baseUrl;
                obj.countBaseInDay = item.from.countBaseInDay;
                obj.countBase = item.from.countBase;
                arrCommon.push(obj);
            }
            if (checkObject(arrCommon, item.to.baseUrl) != false) {
                var obj = {
                    baseUrl: "",
                    countBaseInDay: 0,
                    countBase: 0
                };
                obj.baseUrl = item.to.baseUrl;
                obj.countBaseInDay = item.to.countBaseInDay;
                obj.countBase = item.to.countBase;
                arrCommon.push(obj);
            }
        });
        arrCommon = uniqueObj(arrCommon);


        obj.yes.first = firstTenYes;
        obj.yes.second = secondTenYes;
        obj.yes.third = thirdTenYes;
        obj.no.first = firstTenNo;
        obj.no.second = secondTenNo;
        obj.no.third = thirdTenNo;
        obj.common = arrCommon;


        findUrlObj.push(obj);
    });

    console.log(findUrlObj);
    /*loadInComm(firstTenYes,secondTenNo);*/

    /**
     * Для занесения в базу: form | to |
     */
};

module.exports = findUrl;

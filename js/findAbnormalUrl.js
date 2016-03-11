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
/*        console.log('firstArrDate', firstArrDate, 'firstArrUrl',firstArrUrl);
        console.log('firstObjDate',firstObjDate,'firstObjUrl',firstObjUrl );*/
        for(var j = 0; j < secondArr.length; j++) {
            var secondArrDate = secondArr[i].slice(0,19),
                secondArrUrl = secondArr[i].slice(20),
                secondObjDate = secondObj[i][secondArrDate + ' ' + secondArrUrl].slice(0,19),
                secondObjUrl = secondObj[i][secondArrDate + ' ' + secondArrUrl].slice(20);
        }
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

module.exports = findAbnormalUrl;
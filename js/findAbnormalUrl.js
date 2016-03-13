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

function uniqueArr(arr) {
    var result = [];

    nextInput:
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i][0]; // для каждого элемента
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                if (result[j][0] == str) continue nextInput; // если да, то следующий
            }
            result.push(arr[i]);
        }

    return result;
}


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
            var arrIn = [];
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
            if (new Date(fullDatek).getTime() - new Date(fullDate).getTime() <= 10000 && new Date(fullDatek).getTime() - new Date(fullDate).getTime() >= 0 && fullDate != fullDatek) {
                /*var obj = {};
                obj[fullDate + ' ' + firstUrl] = fullDate + ' ' + firstUrl + ' ' + fullDatek + ' ' + firstUrlk;
                arrIn.push(obj);*/
                arr.push(fullDate + ' ' + firstUrl + ' ' + fullDatek + ' ' + firstUrlk);
                /* console.log('count: ',count);*/
            }
            if (count === 2) {
               /* sessionTen[fullDate] = firstUrl;
                sessionTen[fullDatek] = firstUrlk;*/
               /* var obj = {};
                obj[fullDate + ' ' + firstUrl] = fullDatek + ' ' + firstUrlk;
                arrIn.push(obj);
                arr.push(arrIn);*/
                /*if (fullDate + ' ' + firstUrl != fullDatek + ' ' + firstUrlk) {
                    var obj = {};
                    obj[fullDate + ' ' + firstUrl] = fullDatek + ' ' + firstUrlk;
                    arr.push(obj);
                    var end = {};
                    end[fullDatek + ' ' + firstUrlk] = "end";
                    arr.push(end);
                }*/
                /*if (k === (session.length - 1)) {
                    var end = {};
                    end[fullDatek + ' ' + firstUrlk] = "end " + firstUrlk;
                    arr.push(end);
                }*/
                count = 0;
            }
        }
    }
   /* var arrUn = uniqueArr(arr);
    return arrUn;*/
    return arr;
};

var saveObjectKey = function(arr) {
    var arrayKey = [];
    for (var i = 0; i < arr.length; i++) {
        arrayKey.push(Object.keys(arr[i])[0]);
    }
    return arrayKey;
};

var checkElement = function(array, element) {
     if (array.indexOf(element) != -1) {
         return true;
     } else {
         return false;
     }
};


/**
 * Убираем из массива повторяющиеся элементы
 * @param arr
 * @returns {Array}
 */
var unique = function(arr) {
    var result = [];

    nextInput:
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i]; // для каждого элемента
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                if (result[j] == str) continue nextInput; // если да, то следующий
            }
            result.push(str);
        }

    return result;
};

var trToUrl = function(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
        var date = array[i].querySelectorAll('td')[1].innerHTML;
        arr.push(date);
    }
    arr = unique(arr);
    return arr;
};

/**
 * Url, который встречается во всех трех сессиях
 * @param first
 * @param second
 * @param third
 */
var checkThreeSession = function(first, second, third) {
    var arr = [];
    for (var i = 0; i < first.length; i++) {
        if (checkElement(second, first[i]) && checkElement(third, first[i])) {
            arr.push(first[i]);
        }
    }
    return arr;
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

/*
var coincidence = function(common, firstArray, firstObj, secondArray, secondObj, thirdArray, thirdObj) {
    var arr = [],
         re = /\//;
    for(var i = 0; i < common.length; i++) {
        for(var f = 0; f < firstArray.length; f++) {
            var firstArrDate = firstArray[f].slice(0,19),
                firstArrUrl = firstArray[f].slice(20),
                firstObjDate = firstObj[f][firstArrDate + ' ' + firstArrUrl].slice(0,19),
                firstObjUrl = firstObj[f][firstArrDate + ' ' + firstArrUrl].slice(20);

            if(common[i] === firstArrUrl && checkElement(common,(firstArray[f]).slice(20))) {
                arr.push(firstArray[f].slice(0,19));
            }
        }
    }
    for(var i = 0; i < common.length; i++) {
        for(var f = 0; f < secondArray.length; f++) {
            var firstArrDate = secondArray[f].slice(0,19),
                firstArrUrl = secondArray[f].slice(20),
                firstObjDate = secondObj[f][firstArrDate + ' ' + firstArrUrl].slice(0,19),
                firstObjUrl = secondObj[f][firstArrDate + ' ' + firstArrUrl].slice(20);

            if(common[i] === firstArrUrl && checkElement(common,(secondArray[f]).slice(20))) {
                arr.push(secondArray[f].slice(0,19));
            }
        }
    }
    for(var i = 0; i < common.length; i++) {
        for(var f = 0; f < thirdArray.length; f++) {
            var firstArrDate = thirdArray[f].slice(0,19),
                firstArrUrl = thirdArray[f].slice(20),
                firstObjDate = thirdObj[f][firstArrDate + ' ' + firstArrUrl].slice(0,19),
                firstObjUrl = thirdObj[f][firstArrDate + ' ' + firstArrUrl].slice(20);

            if(common[i] === firstArrUrl && checkElement(common,(thirdArray[f]).slice(20))) {
                arr.push(thirdArray[f].slice(0,19));
            }
        }
    }
    return arr;
};*/
/*
var checkCommon = function(coin, firstArray, firstObj, secondArray, secondObj, thirdArray, thirdObj) {
    var arrOne = coin.slice(),
        arrTwo = coin.slice(),
        arrThree = coin.slice();
    for(var i = 0; i < arrOne.length; i++) {
        for(var j = 0; j < firstArray.length; j++) {
            if (firstObj[j][firstArray[j]] === 'end') {
                arrOne.splice(j, 1);
            }
        }
    }
    for(var i = 0; i < arrTwo.length; i++) {
        for(var j = 0; j < secondArray.length; j++) {
            if (secondObj[j][secondArray[j]] === 'end') {
                arrTwo.splice(j, 1);
            }
        }
    }
    for(var i = 0; i < arrThree.length; i++) {
        for(var j = 0; j < thirdArray.length; j++) {
            if (thirdObj[j][thirdArray[j]] === 'end') {
                arrThree.splice(j, 1);
            }
        }
    }

    var all = arrOne.concat(arrTwo).concat(arrThree);
    return all;
};*/

var remUrl = function(array) {
    var arr = [];
    for(var i = 0; i < array.length; i++) {
      arr.push(array[i].slice(0,19));
    }
    return arr;
};
/*

var colorTr = function(coin, first, second, third ) {
    var arr = [];
    for(var i = 0; i < first.length; i++) {
        if(!checkElement(coin,first[i])) {
            arr.push(first[i]);
        }
    }
    for(var i = 0; i < second.length; i++) {
        if(!checkElement(coin,second[i])) {
            arr.push(second[i]);
        }
    }
    for(var i = 0; i < third.length; i++) {
        if(!checkElement(coin,third[i])) {
            arr.push(third[i]);
        }
    }
    for(var i = 0; i < arr.length; i++) {
        for(var j = 0; j < $('#grid tbody tr td:first-child').length; j++) {
            if (arr[i] === $('#grid tbody tr td:first-child')[j].innerHTML.slice(0,19)) {
                $('#grid tbody tr td:first-child')[j].style.color = 'green';
            }
        }
    }
    for(var i = 0; i < coin.length; i++) {
        for(var j = 0; j < $('#grid tbody tr td:first-child').length; j++) {
            if (coin[i] === $('#grid tbody tr td:first-child')[j].innerHTML.slice(0,19)) {
                $('#grid tbody tr td:first-child')[j].style.color = 'red';
            }
        }
    }
};


var loadTd = function(arr, obj, arr2, obj2, arr3, obj3) {
    arr.sort(function(a,b) {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    $('#info').html('');
    for(var i = 0; i < arr.length; i++) {
        if ( obj[i][arr[i]] != undefined) {
            $('#info').append('<div>' + arr[i] + ' -> ' + obj[i][arr[i]] + '</div>');
        }
    }
    for(var i = 0; i < arr2.length; i++) {
        if ( obj2[i][arr2[i]] != undefined){
            $('#info').append('<div>' + arr2[i] +' -> '+ obj2[i][arr2[i]] + '</div>');
        }
    }
    for(var i = 0; i < arr3.length; i++) {
        if ( obj3[i][arr3[i]] != undefined){
            $('#info').append('<div>' + arr3[i] +' -> '+ obj3[i][arr3[i]] + '</div>');
        }
    }
};
*/


var checkElementIndex = function(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (element === array[i].slice(0,19)) {
            return true;
        }
    }
};


var loadRelation = function(firstYes, secondYes, thirdYes, firstNo, secondNo, thirdNo) {
    $('#info').html('');
    $('#info').append('<div>Переходы <span color="red">по</span> важным ссылкам:</div>');
    for(var i = 0; i < firstYes.length; i++) {
        $('#info').append('<div>' + firstYes[i] + '</div>');
    }
    for(var i = 0; i < secondYes.length; i++) {
        $('#info').append('<div>' + secondYes[i] + '</div>');
    }
    for(var i = 0; i < thirdYes.length; i++) {
        $('#info').append('<div>' + thirdYes[i] + '</div>');
    }
    $('#info').append('<div>Переходы <span color="red">между</span> важными ссылками:</div>');
    for(var i = 0; i < firstNo.length; i++) {
        $('#info').append('<div>' + firstNo[i] + '</div>');
    }
    for(var i = 0; i < secondNo.length; i++) {
        $('#info').append('<div>' + secondNo[i] + '</div>');
    }
    for(var i = 0; i < thirdNo.length; i++) {
        $('#info').append('<div>' + thirdNo[i] + '</div>');
    }
};

/**
 * Поиск аномальных Url с переходами
 * @param common
 * @param array
 * @returns {Array}
 */
var abnUrl = function(common, array) {
    var arrAll = [],
        arrNo = [],
        arr = [];
    for(var i = 0; i < array.length; i++) {
        /*for (var j = 0; j < common.length; j++) {
            if(array[i].indexOf(common[j]) != -1) {
                arrYes.push(array[i]);
            }
        }*/
        var obj = {};
        obj[array[i]] = array[i];
        obj['count'] = 0;
        arrAll.push(obj);
    }
    for(var i = 0; i < array.length; i++) {
        for (var j = 0; j < common.length; j++) {
            if (array[i].indexOf(common[j]) != -1) {
                arrAll[i]['count'] += 1;
            }
        }
    }

    for(var i = 0; i < array.length; i++) {
        if(arrAll[i]['count'] === 2) {
            arr.push(arrAll[i][array[i]]);
        } else {
            if (!checkElementIndex(arrNo,arrAll[i][array[i]].slice(0,19))){
                arrNo.push(arrAll[i][array[i]]);
            }
        }
    }
    var arrEnd = [arr, arrNo];
    return arrEnd;
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


    var firstArray = trToUrl(first),
        secondArray = trToUrl(second),
        thirdArray = trToUrl(third);

    /**
     *  Общее для всех сессий
     */
     var common = checkThreeSession(firstArray, secondArray, thirdArray);

    var firstArrayObj = findTenSeconds(first),
        secondArrayObj = findTenSeconds(second),
        thirdArrayObj = findTenSeconds(third);

    var abnUrlFirstYes = abnUrl(common,firstArrayObj)[0],
        abnUrlSecondYes = abnUrl(common,secondArrayObj)[0],
        abnUrlThirdYes = abnUrl(common,thirdArrayObj)[0],
        abnUrlFirstNo = abnUrl(common,firstArrayObj)[1],
        abnUrlSecondNo = abnUrl(common,secondArrayObj)[1],
        abnUrlThirdNo = abnUrl(common,thirdArrayObj)[1];

    if (abnUrlFirstYes.length && abnUrlSecondYes.length && abnUrlThirdYes.length) {
        loadRelation(abnUrlFirstYes,abnUrlSecondYes,abnUrlThirdYes,abnUrlThirdYes,abnUrlFirstNo,abnUrlSecondNo,abnUrlThirdNo);
    }
};

var findAbnormalUrl = function() {
    findCoin();
};

module.exports = findAbnormalUrl;
/**
 * Находит все tr в определенном диапазоне времени
 * @param dateStart
 * @param dateFin
 * @returns {Array}
 */
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

/**
 * Сортировка массива tr
 * @param a
 * @param b
 * @returns {number}
 */
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

/*var checkDate = function() {
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
};*/

/**
 *  Поиск элементов в массиве (в данном случае строк), разница во времени которых <=10
 * @param array
 * @returns {Array}
 */
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

/**
 * Вызывает findDate, сортирует каждйы массив по дате/времени, вызывает templAbnUrl, возвращает массив
 * @returns {Array}
 */
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


/**
 *  Проверяет, содержится ли строка в каждой сессии пользователя
 * @param array
 * @returns {Array}
 */
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
        var firstDate = resultVal[i].querySelector('td').innerHTML.match(/\d\d\d\d\/\d\d\/\d\d/)[0],
            firstUrl = resultVal[i].querySelectorAll('td')[1].innerHTML;
        for (var j = 0; j < third.length; j++) {
            var secondDate = third[j].querySelector('td').innerHTML.match(/\d\d\d\d\/\d\d\/\d\d/)[0],
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


/**
 *  Подсветка найденных строк
 */
 var highLightDate = function() {
    var high = controlDate(findAbnUrl());
     /*var h = findAbnUrl(),
         high = [];
     for (var j = 0; j < h.length; j++) {
         for (var k = 0; k < h[j].length; k++) {
             high.push(h[j][k]);
         }
     }*/
     console.log('high',high);
     for (var i = 0; i < high.length; i++) {
         high[i].style.color = 'red';
     }
 };


var findAbnormalUrl = function() {
    highLightDate();
};

module.exports = findAbnormalUrl;
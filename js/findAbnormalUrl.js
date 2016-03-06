
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

var saveDate = function(dateStartFin) {
 /*   var dateNineTen = findDate(9,10),
        dateTwelveThirteen = findDate(12,13),
        dateEighteenNineteen = findDate(18,19),*/
    var obj = {};
    for (var i = 0; i < dateStartFin.length; i++) {
        var year = (new Date(dateStartFin[i].querySelector('td').innerHTML)).getFullYear(),
            month = (new Date(dateStartFin[i].querySelector('td').innerHTML)).getMonth(),
            day = (new Date(dateStartFin[i].querySelector('td').innerHTML)).getDate(),
            hours = (new Date(dateStartFin[i].querySelector('td').innerHTML)).getHours(),
            minutes = (new Date(dateStartFin[i].querySelector('td').innerHTML)).getMinutes(),
            seconds = (new Date(dateStartFin[i].querySelector('td').innerHTML)).getSeconds();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        if (day < 10) day = "0" + day;
        if (month < 9) month = "0" + (month + 1);
        var fullDate = year + '/' + month + '/' + day,
            fullTime = hours + ':' + minutes + ':' + seconds;
        obj[fullDate + ' ' + fullTime] = dateStartFin[i];
    }
    var objArray = Object.keys(obj);


   /* var objVal = [];
    for (var key in obj) {
        objVal.push(obj[key]);
    }
    var objFin = {};
    for (var i = 0; i < objArray.length; i++) {
        var count = 0;
        for (var j = 0; j < objVal.length; j++) {
            if (objArray[i].match(/\d\d\d\d\/\d\d\/\d\d/)[0] === objVal[j]) {
                count += 1;
            }
            if (count >= 2) {
                objFin[objArray[i]] = objArray[i];
            }
        }
    }
    var objReturn = Object.keys(objFin);
    return objReturn;*/
   /* return objArray;*/
    return obj;
};

/*
function duplicate_values() {
    var arr = checkTime(findDate(), 9, 10);
    var arr_res = []; // результирующий массив
    /!* проход по массиву слева-направо *!/
    for (var i=1; i < arr.length; i++) {
        /!* проходим массив в обратном порядке, начиная с элемента arr[i-1] *!/
        var yearI = (new Date(arr[i])).getFullYear(),
            monthI = (new Date(arr[i])).getMonth(),
            dayI = (new Date(arr[i])).getDate();
        for (var j=i-1; j >= 0; j--) {
            var yearJ = (new Date(arr[j])).getFullYear(),
                monthJ = (new Date(arr[j])).getMonth(),
                dayJ = (new Date(arr[j])).getDate();
            /!* если ранее в массиве уже встречался элемент
             с таким же значением как и у текущего,
             то помещаем это значение в результирующий массив
             (предварительно проверив, нет ли там уже такого значения),
             завершаем внутренний цикл и переходим
             на следующую итерацию внешнего цикла*!/
            if (yearI === yearJ && monthI === monthJ && dayI === dayJ) {
                var is_unique = true; // флаг уникальности элемента
                for (var k=0; k < arr_res.length; k++) {
                    if (arr_res[k] == arr[i]) {
                        is_unique = false;
                        break;
                    }
                }
                if (is_unique) {
                    arr_res.push(arr[i]);
                }
                break;
            }
        }
    }
    return arr_res;
}
*/
/*
var findElement = function(array, value) {
    if (array.indexOf) { // если метод существует
        return array.indexOf(value);
    }

    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) return i;
    }

    return -1;
};*/


var controlDate = function() {
    var first = findDate(9,10),
        second = findDate(12,13),
        third = findDate(18,19),
        resultFirst = {},
        result = {};
    for (var i = 0; i < first.length; i++) {
        var firstDate = first[i].querySelector('td').innerHTML.match(/\d\d\d\d\/\d\d\/\d\d/)[0],
            firstUrl = first[i].querySelectorAll('td')[1].innerHTML;
/*        console.log('secondDate',secondDate);
        console.log('secondUrl',secondUrl);*/
        for (var j = 0; j < second.length; j++) {
            var secondDate = second[j].querySelector('td').innerHTML.match(/\d\d\d\d\/\d\d\/\d\d/)[0],
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
                console.log('+1');
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



 var highLightDate = function() {
     var high = controlDate();
     console.log('high',high);
     for (var i = 0; i < high.length; i++) {
         high[i].style.color = 'red';
     }
 };


var findAbnormalUrl = function() {
    highLightDate();
};

module.exports = findAbnormalUrl;
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

var findUrl = function(pickerDate,arrAll) {
    /**
     * Поиск всех объектов по нужной дате
     */
    var arrAllDate = findDate(pickerDate,arrAll);
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
    console.log(common);
};

module.exports = findUrl;

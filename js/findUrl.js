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

var sortCommonCount = function(a,b) {
    a = a.countBase;
    b = b.countBase;
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * Сортировка по времени в массиве объектов
 * @param a
 * @param b
 * @returns {number}
 */
var sortTime = function(a,b) {
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

var checkElementBase = function(array, element) {
    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
    for (var i = 0; i < array.length; i++) {
        var el = re.exec(array[i])[0];
        if (element === el) {
            return true;
        }
    }
    return false;
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
/*var checkThreeSession = function(first, second, third) {
    var arr = [];
    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
    for (var i = 0; i < first.length; i++) {
        if (checkElement(second, re.exec(first[i])[0]) && checkElement(third,  re.exec(first[i])[0])) {
            arr.push(re.exec(first[i])[0]);
        }
    }
    return arr;
};*/

var checkThreeSession = function(first, second, third) {
    var arr = [];
    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
    for (var i = 0; i < first.length; i++) {
        var el = re.exec(first[i])[0];
        if (checkElementBase(second, el) && checkElementBase(third,  el)) {
            arr.push(re.exec(first[i])[0]);
        }
    }
    return arr;
};



/**
 * Ищет в сессии элементы, разница между которыми 10 секунд для аномальных url
 * @param session, common
 */
var findTenSecondsYes = function(session, common, sumBaseUrls) {
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

    var score = 0;
    for (var i = 0; i < arrYes.length; i++) {
        var percent = arrYes[i].from.countBase * 100 / sumBaseUrls;
        if ((score + percent) < 30) {
            score += percent;
            arrYes[i].from.rareBaseUrl = 'yes';
        }
    }

    var score = 0;
    for (var i = 0; i < arrYes.length; i++) {
        var percent = arrYes[i].from.count * 100 / sumBaseUrls;
        if ((score + percent) < 30) {
            score += percent;
            arrYes[i].from.rareUrl = 'yes';
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
    arrNo = uniqueDate(arrNo);
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


/**
 * Убираем из массива повторяющиеся объекты по дате. Возвращает массив объектов!
 * @param arr
 * @returns {Array}
 */
var uniqueDate = function(arr) {
    var result = [];
    nextInput:
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var date = new Date(arr[i].date + " " + arr[i].time).getTime();
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                if (result[j].date) {
                    if ((new Date(result[j].date + ' ' + result[j].time).getTime()) === date) continue nextInput; // если да, то следующий
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

/**
 * Возвращает массив из дат
 * @param start
 * @param end
 * @returns {Array}
 */
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

/**
 * Поиск переходов
 * @param arr
 * @returns {Array}
 */
var findTransition = function(arr) {
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i+1] === undefined) {
            break;
        } else {
            var obj = {
                from: '',
                to: '',
                countTransitionInDay: 1
            };
            obj.from = arr[i];
            obj.to = arr[i+1];
            array.push(obj);
        }
    }
    return array;
};
/**
 * Поиск кол-ва переходов в сессию
 * @param arr
 * @returns {*}
 */
var findCountTransitionInSession = function(arr) {
  for (var i = 0; i < arr.length; i++) {
      if (arr[i+1] === undefined) {
          break;
      } else if(arr[i].from.name === arr[i+1].from.name && arr[i].to.name === arr[i+1].to.name) {
          arr[i].countTransitionInDay += 1;
          arr[i+1].countTransitionInDay += 1;
      }
  }
    return arr;
};
/**
 * Поиск кол-ва переходов в день
 */
var findCountTransitionInDay = function(first, second, third) {
  first.forEach(function(f) {
      second.forEach(function(s) {
         if (f.from.name === s.from.name && f.to.name === s.to.name) {
             f.countTransitionInDay += 1;
             s.countTransitionInDay += 1;
         }
      });
  });
    first.forEach(function(f) {
        third.forEach(function(t) {
            if (f.from.name === t.from.name && f.to.name === t.to.name) {
                f.countTransitionInDay += 1;
                t.countTransitionInDay += 1;
            }
        });
    });
    third.forEach(function(t) {
        second.forEach(function(s) {
            if (t.from.name === s.from.name && t.to.name === s.to.name) {
                t.countTransitionInDay += 1;
                s.countTransitionInDay += 1;
            }
        });
    });
    return [first, second, third];
};
/**
 * Сумма всех baseUrl
 * @param arrAll
 * @returns {number}
 */
var sumBaseOfUrls = function(arrAll) {
    var objCount = {};
    for (var i = 0; i < arrAll.length; i++) {
        objCount[arrAll[i].baseUrl] = arrAll[i].countBase;
    }
    var arrCount = Object.keys(objCount),
        sum = 0;
    arrCount.forEach(function(item) {
        sum += objCount[item];
    });
    return sum;
};

var setSumBaseOfUrls = function(arrAll, sum) {
  arrAll.forEach(function(item) {
      item.sumCountBaseUrl = sum;
  });
};

/**
 * Сумма всех url (не base)
 * @param arrAll
 * @returns {number}
 */
var sumOfUrls = function(arrAll) {
    arrAll.forEach(function(item) {
        var sum = 0;
        arrAll.forEach(function(el) {
            if (item.name === el.name) {
                sum += el.count;
            }
        });
        item.sumCountUrl = sum;
    });
    return arrAll;
};

/*var setSumOfUrls = function(arrAll, sum) {
    arrAll.forEach(function(item) {
        item.sumCountUrl = sum;
    });
};*/

var uniqueObjAndSum = function(arr) {
    var result = [];
    nextInput:
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var from = arr[i].from,
                to = arr[i].to;// для каждого элемента
            var dateTime = arr[i].dateTime;
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                if (result[j].from && result[j].to) {
                    if (result[j].from === from && result[j].to === to) {
                        result[j].countTransitionAll +=1;
                        result[j].dateTime += (', ' + dateTime);
                        continue nextInput;
                    } // если да, то следующий
                }

            }
            result.push(obj);
        }
    return result;
};

var uniqueObjAndSumAll = function(arr) {
    var result = [];
    nextInput:
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var from = arr[i].from,
                to = arr[i].to;// для каждого элемента
            var dateTime = arr[i].dateTime;
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                if (result[j].from && result[j].to) {
                    if (result[j].from === from && result[j].to === to) {
                        result[j].countTransitionAll +=1;
                        result[j].dateTime += (', ' + dateTime);
                        continue nextInput;
                    } // если да, то следующий
                }

            }
            result.push(obj);
        }
    return result;
};

var checkTrans = function(array) {
    var arr = [];
    array.forEach(function(item) {
        if ((item.to.rareUrl === 'yes' && item.to.rareBaseUrl === 'yes') && (item.from.rareUrl === 'no' || item.from.rareBaseUrl === 'no')) {
            arr.push(item);
        }
    });
    return arr;
};

/**
 * Основная функция
 * @param pickerDateFrom
 * @param pickerDateTo
 * @param arrAll
 */
var findUrl = function(pickerDateFrom, pickerDateTo,arrAll) {

    var sumBaseUrls = sumBaseOfUrls(arrAll);
    setSumBaseOfUrls(arrAll, sumBaseUrls);


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
/*        var commonCheckAbn = [];
        arrAll.forEach(function(item) {
            if (checkElement(common, item.baseUrl)) {
                var obj = {
                    baseUrl: item.baseUrl,
                    countBase: item.countBase
                };
                commonCheckAbn.push(obj);
            }
        });
        commonCheckAbn = uniqueObj(commonCheckAbn);
            //////////////////////////////////////
        commonCheckAbn.sort(sortCommonCount);
         var score = 0,
            arrComSort = [];
        commonCheckAbn.forEach(function(item) {
            var percent = item.countBase * 100 / sumBaseUrls;
            if ((score + percent) < 20) {
                score += percent;
                arrComSort.push(item);
            } else {
                return arrComSort;
            }
            return arrComSort;
         });

        common = [];
        arrComSort.forEach(function(item) {
            common.push(item.baseUrl);
        });*/

            ////////////////////////////////////////
        var firstTenYes = findTenSecondsYes(firstSession, common,sumBaseUrls),
            secondTenYes = findTenSecondsYes(secondSession, common,sumBaseUrls),
            thirdTenYes = findTenSecondsYes(thirdSession, common,sumBaseUrls);

        firstTenYes = checkTrans(firstTenYes);
        secondTenYes = checkTrans(secondTenYes);
        thirdTenYes = checkTrans(thirdTenYes);
        console.log(firstTenYes)
        /**
         * Поиск элементов между аномальными
         */
        var firstTenNo = findElementsBetweenAbn(firstTenYes, firstSession),
            secondTenNo = findElementsBetweenAbn(secondTenYes, secondSession),
            thirdTenNo = findElementsBetweenAbn(thirdTenYes, thirdSession);

        /**
         * Составление переходов между подозрительными url
         */
        var firstNo = findTransition(firstTenNo),
            secondNo = findTransition(secondTenNo),
            thirdNo = findTransition(thirdTenNo);
        /**
         * Подсчет повторений переходов по каждой сессии
         */
        var firstCountNo = findCountTransitionInSession(firstNo),
            secondCountNo = findCountTransitionInSession(secondNo),
            thirdCountNo = findCountTransitionInSession(thirdNo);
        /**
         * Подсчет кол-ва повторений в сутки
         */
        var countInDayAll = findCountTransitionInDay(firstCountNo,secondCountNo,thirdCountNo),
            firstCountInDayNo = countInDayAll[0],
            secondCountInDayNo = countInDayAll[1],
            thirdCountInDayNo = countInDayAll[2];


        var arrCommon = [];
        firstTenYes.forEach(function(item) {
            if (checkObject(arrCommon, item.from.baseUrl) != false) {
                var obj = {
                    baseUrl: "",
                    countBaseInDay: 0,
                    countBase: 0,
                    dateTime: []
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
                    countBase: 0,
                    dateTime: []
                };
                obj.baseUrl = item.to.baseUrl;
                obj.countBaseInDay = item.to.countBaseInDay;
                obj.countBase = item.to.countBase;
                arrCommon.push(obj);
            }
        });
        arrCommon = uniqueObj(arrCommon);
        /*arrCommon.forEach(function(common) {
            arrAllDate.forEach(function(date) {
                if (common.baseUrl === date.baseUrl) {
                    var obj = {
                        date: "",
                        time: ""
                    };
                    obj.date = date.date;
                    obj.time = date.time;
                    common.dateTime.push(obj);
                }
            })
        });*/

        obj.yes.first = firstTenYes;
        obj.yes.second = secondTenYes;
        obj.yes.third = thirdTenYes;
        obj.no.first = firstCountInDayNo;
        obj.no.second = secondCountInDayNo;
        obj.no.third = thirdCountInDayNo;
        obj.common = arrCommon;


        findUrlObj.push(obj);
    });

    findUrlObj.forEach(function(objAll) {
        objAll.common.forEach(function(com) {
            arrAll.forEach(function(arAl) {
                if (com.baseUrl === arAl.baseUrl) {
                    com.dateTime.push(arAl.date + ' ' + arAl.time);
                }
            })
        });
    });

    findUrlObj.forEach(function(objAll) {
        objAll.common.forEach(function(com) {
            com.dateTime = com.dateTime.join(', ');
        });
    });
    console.log(findUrlObj);
    var arrCom = [];
    findUrlObj.forEach(function(item) {
        item.common.forEach(function(com) {
            arrCom.push(com);
        });
    });
    arrCom = uniqueObj(arrCom);

    var arrNo = [];
    findUrlObj.forEach(function(item) {
        item.no.first.forEach(function(el) {
            var obj = {
                from: el.from.name,
                to: el.to.name,
                dateTime: el.to.date + ' ' + el.to.time,
                countTransitionAll: 1
            };
            arrNo.push(obj);
        });
        item.no.second.forEach(function(el) {
            var obj = {
                from: el.from.name,
                to: el.to.name,
                dateTime: el.to.date + ' ' + el.to.time,
                countTransitionAll: 1
            };
            arrNo.push(obj);
        });
        item.no.third.forEach(function(el) {
            var obj = {
                from: el.from.name,
                to: el.to.name,
                dateTime: el.to.date + ' ' + el.to.time,
                countTransitionAll: 1
            };
            arrNo.push(obj);
        });
    });
    arrNo = uniqueObjAndSum(arrNo);

    var newCom = [];
    findUrlObj.forEach(function(item) {
        item.common.forEach(function(el) {
            newCom.push(el.baseUrl);
        });
    });

    newCom = uniqueArr(newCom);
    var arrYes = [];
    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}[/]/;
    arrNo.forEach(function(item) {
        if (checkElement(newCom, re.exec(item.from)[0])) {
            arrYes.push(item);
        }
    });
    arrYes.forEach(function(item) {
        item.from = re.exec(item.from)[0];
    });
    arrYes = uniqueObjAndSumAll(arrYes);
/*    console.log('Первая таблица: ',arrCom);
    console.log('Вторая таблица: ',arrNo);
    console.log('Третья таблица: ',arrYes);*/
    /*var arrYes = uniqueObjAndSumAll(arrNo, common);*/
 /*   console.log('arrYes', arrYes);
    console.log('arrNo',arrNo);*/

    /**
     * Сортировка common по countBase
     */



    var objSend = {
        firstTable: arrCom,
        secondTable: arrNo,
        thirdTable: arrYes
    };
    console.log(objSend);
    $.ajax({
        url: "http://localhost:3000/saveInTable",
        type: "POST",
        dataType: 'json',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(objSend),
        success: function(data) {
            console.log('data save', data);
        },
        error: function() {
            console.log('ups');
        }
    });

/*    findUrlObj.forEach(function(item) {
        console.log(item)
        $.ajax({
            url: "http://localhost:3000/saveInTable",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(item),
            success: function(data) {
                console.log('data save', data);
            }
        });
    });*/

/*    $.ajax({
        url: "http://localhost:3000/saveFirst",
        type: "POST",
        dataType: 'json',
        data: {'lol':'hello'},
        success: function(data) {
            console.log('data save', data);
        }
    });*/
    /**
     * Для занесения в базу: form | to |
     */

};

module.exports = findUrl;

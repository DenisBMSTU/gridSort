var checkAll = function() {
    var checkbox = $('.container__grid .container__category .row-checkbox input')
    var checkboxMain = $('.container__grid .container__category .row_all input');
    checkboxMain.on('click',function(){
        for (var i = 0; i < checkbox.length; i++) {
            if (checkboxMain[0].checked) {
                checkbox[i].checked = true;
            } else {
                if (checkbox[i].checked) {
                    checkbox[i].click();
                }
            }
        }
    });
};

module.exports = checkAll;
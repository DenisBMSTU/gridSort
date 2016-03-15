/**
 * Created by ubuntu on 14.03.16.
 */


var datePick = function() {
    $(function() {
        $( "#datepicker" ).datepicker({ dateFormat: 'yy/mm/dd' });
    });
};

module.exports = datePick;
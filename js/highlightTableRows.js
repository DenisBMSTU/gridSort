
/**
 * Подсвечивает строку таблицы, на которую был наведен курсор, а так же строку, которая была выделена
 * @param tableId
 * @param hoverClass
 * @param clickClass
 * @param multiple
 */
function highlightTableRows(tableId, hoverClass, clickClass, multiple)
{
    var table = document.getElementById(tableId);
    if (typeof multiple == 'undefined') multiple = true;
    if (hoverClass)
    {
        var hoverClassReg = new RegExp("\\b"+hoverClass+"\\b");
        table.onmouseover = table.onmouseout = function(e)
        {
            if (!e) e = window.event;
            var elem = e.target || e.srcElement;
            while (!elem.tagName || !elem.tagName.match(/td|th|table/i)) elem = elem.parentNode;
            if (elem.parentNode.tagName == 'TR' && elem.parentNode.parentNode.tagName == 'TBODY')
            {
                var row = elem.parentNode;
                if (!row.getAttribute('clickedRow')) row.className = e.type=="mouseover"?row.className+" "+hoverClass:row.className.replace(hoverClassReg," ");
            }
        };
    }
    if (clickClass) table.addEventListener('click',function(e){
        if (!e) e = window.event;
        var elem = e.target || e.srcElement;
        while (!elem.tagName || !elem.tagName.match(/td|th|table/i)) elem = elem.parentNode;
        if (elem.parentNode.tagName == 'TR' && elem.parentNode.parentNode.tagName == 'TBODY')
        {
            var clickClassReg = new RegExp("\\b"+clickClass+"\\b"),
                row = elem.parentNode;
            if (row.getAttribute('clickedRow'))
            {
                row.removeAttribute('clickedRow');
                row.className = row.className.replace(clickClassReg, "");
                row.className += " "+hoverClass;
            }
            else
            {
                if (hoverClass) row.className = row.className.replace(hoverClassReg, "");
                row.className += " "+clickClass;
                row.setAttribute('clickedRow', true);
                if (!multiple)
                {
                    var lastRowI = table.getAttribute("lastClickedRowI");
                    if (lastRowI!==null && lastRowI!=='' && row.sectionRowIndex!=lastRowI)
                    {
                        var lastRow = table.tBodies[0].rows[lastRowI];
                        lastRow.className = lastRow.className.replace(clickClassReg, "");
                        lastRow.removeAttribute('clickedRow');
                    }
                }

                table.setAttribute("lastClickedRowI", row.sectionRowIndex);
            }
        }
    },false);

}

module.exports = highlightTableRows;
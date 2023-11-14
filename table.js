$(document).ready(function() {
    $.ajax({
        url: 'mod_table.csv',
        dataType: 'text',
    }).done(successFunction);
});

function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        var rowCells = allRows[singleRow].split(',');
        var tableRow = $('<tr>');
        var category = rowCells[0];
        if (rowCells[0] === 'Multiple_groups') {
            category += ', ' + rowCells[1] + ', ' + rowCells[2] + ', ' + rowCells[3];
        }
        tableRow.append('<td>' + category + '</td>');
        for (var rowCell = 4; rowCell < rowCells.length; rowCell++) {
            if (rowCell === rowCells.length - 1) {
                tableRow.append('<td><a href="' + rowCells[rowCell] + '"><img src="link_icon.png" alt="Link"></a></td>');
            } else {
                tableRow.append('<td>' + rowCells[rowCell] + '</td>');
            }
        }
        $('tbody').append(tableRow);
    }

    $('#myTable').DataTable({
        "pageLength": 10,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "stripeClasses": [],
        "order": [[ 0, "asc" ]],
        "columnDefs": [
            { "orderable": false, "targets": 10 },
            { "type": "num", "targets": 3 },
            { "type": "num", "targets": 4 }
        ]
    });
}
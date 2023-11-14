var data = [];
Papa.parse('mod_table2.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    chunk: function(results) {
        data = data.concat(results.data);
        if (data.length >= 1000) { // Change this to the number of rows you want to display at a time
            displayData();
            data = [];
        }
    },
    complete: function() {
        displayData();
    }
});

function displayData() {
    var table = $('#myTable').DataTable();
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var category = row['Factor_category'];
        if (row['Factor_category'] === 'Multiple_groups') {
            category += ', ' + row['Multiple_cat1'] + ', ' + row['Multiple_cat2'] + ', ' + row['Multiple_cat3'];
        }
        table.row.add([
            category,
            row['Factor_more_refined'],
            row['Factor_refined'],
            row['Clock_C'],
            row['N total'],
            row['Tissue_category'],
            row['Race_Ethnicity'],
            row['Sex'],
            row['Twin_study'],
            row['Cohort_C'],
            '<a href="' + row['Link'] + '"><img src="link_icon.png" alt="Link"></a>',
            row['Extra Column']
        ]);
    }
    table.draw();
}
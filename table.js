var table = $('#myTable').DataTable(
// {
    
    // ... other options ...
//     // ... other options ...
//     "initComplete": function () {
//         // Initialize the select filters and the min/max inputs for the 'N total' column
//         initFilters(this.api());
//     }
// }
);

function initFilters(api) {
    api.columns([0, 1, 2, 3, 5]).every(function () {
        var column = this;
        var columnIndex = column.index();
        var dropdown = $('<div class="dropdown"></div>').appendTo($(column.header()));
        var button = $('<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>')
            .appendTo(dropdown);
        var menu = $('<ul class="dropdown-menu"></ul>').appendTo(dropdown);

        if (columnIndex === 0) {
            var allCategories = [];
            column.data().each(function (d, j) {
                var categories = d.split(', ');
                for (var i = 0; i < categories.length; i++) {
                    var category = categories[i].trim();
                    if (allCategories.indexOf(category) === -1) {
                        allCategories.push(category);
                    }
                }
            });

            allCategories.sort().forEach(function (d, j) {
                var item = $('<li class="dropdown-item"></li>').appendTo(menu);
                var checkbox = $('<input class="form-check-input me-2" type="checkbox" value="' + d + '">').appendTo(item);
                var label = $('<label></label>').text(d).appendTo(item);
                checkbox.on('change', function () {
                    var checkedValues = menu.find('input:checked').map(function () {
                        return this.value;
                    }).get();
                    var search = checkedValues.length > 0 ? checkedValues.join(' ') : '';
                    column.search(search, true, false).draw();
                });
            });
        } else {
            column.data().unique().sort().each(function (d, j) {
                var item = $('<li class="dropdown-item"></li>').appendTo(menu);
                var checkbox = $('<input class="form-check-input me-2" type="checkbox" value="' + d + '">').appendTo(item);
                var label = $('<label></label>').text(d).appendTo(item);

                checkbox.on('change', function () {
                    var checkedValues = menu.find('input:checked').map(function () {
                        return this.value;
                    }).get();
                    var search = checkedValues.length > 0 ? '^' + checkedValues.join('$|^') + '$' : '';
                    column.search(search, true, false).draw();
                });
            });    
        }


        

        dropdown.on('click', function (event) {
            event.stopPropagation();
        });

        var resetButton = $('<button class="btn btn-secondary btn-sm">Reset</button>')
        .appendTo($(column.header()))
        .on('click', function () {
            $(column.header()).find('input[type="checkbox"]').prop('checked', false).trigger('change');
            $(column.header()).find('input[type="number"]').val('');
            // filterNtotal(api);
        });
    });

    // Add min/max inputs for the 'N total' column
    var nTotalColumn = api.column(4);
    var minInput = $('<input type="number" placeholder="Min" style="width: 60px;">')
        .appendTo(nTotalColumn.header());
        
    var maxInput = $('<input type="number" placeholder="Max" style="width: 60px;">')
        .appendTo(nTotalColumn.header());
        

    minInput.on('input', function (event) {
            event.stopPropagation();
            table.draw();    
        })
        .on('click', function (event) {
            event.stopPropagation();
        });

    maxInput.on('input', function (event) {
            event.stopPropagation();
            table.draw();

        })
        .on('click', function (event) {
            event.stopPropagation();
        });

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            let min = parseInt(minInput.val(), 10);
            let max = parseInt(maxInput.val(), 10);
            let nTotal = parseFloat(data[4]) || 0; // use data for the age column
         
            if (
                (isNaN(min) && isNaN(max)) ||
                (isNaN(min) && nTotal <= max) ||
                (min <= nTotal && isNaN(max)) ||
                (min <= nTotal && nTotal <= max)
            ) {
                return true;
            }
         
            return false;
        }
    );

    var resetButton = $('<button class="btn btn-primary">Reset All Filters</button>')
        .prependTo('#myTable_wrapper')
        .on('click', function () {
            api.columns().every(function () {
                var column = this;
                $(column.header()).find('input[type="checkbox"]').prop('checked', false).trigger('change');
                $(column.header()).find('input[type="number"]').val('');
            });
            // filterNtotal(api);
        });
}

// function filterNtotal(api) {
//         var minVal = parseFloat($('#myTable thead th:nth-child(5) input:nth-child(1)').val()) || 0;
//         var maxVal = parseFloat($('#myTable thead th:nth-child(5) input:nth-child(2)').val()) || Infinity;
//         api.column(4).search(minVal + '-' + maxVal, true, false).draw();
// }

var data = [];
Papa.parse('mod_table2.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    chunkSise: 10000,
    chunk: function(results) {
        data = data.concat(results.data);
        if (data.length >= 1000) { // Change this to the number of rows you want to display at a time
            displayData();
            data = [];
        }
    },
    complete: function() {
        table.draw();    
        initFilters(table);
    }
});

function displayData() {
    
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var category = row['Factor_category'];
        if (row['Factor_category'] === 'Multiple_groups') {
            category = [row['Multiple_cat1'], row['Multiple_cat2'], row['Multiple_cat3']]
                .filter(Boolean)
                .join(', ');
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

$(document).ready(function() {
    var table = $('#myTable').DataTable();

    // Handle mouseover and mouseout events
    // $('#myTable tbody').on('mouseover', 'tr', function() {
    //     $(this).css('background-color', '#ff0000'); // Change to your preferred color
    // });

    // $('#myTable tbody').on('mouseout', 'tr', function() {
    //     $(this).css('background-color', '');
    // });

    // Handle click event
    $('#myTable tbody').on('click', 'tr', function() {
        if ($(this).hasClass('table-active')) {
            $(this).removeClass('table-active');
        } else {
            // table.$('tr.table-active').removeClass('table-active');
            $(this).addClass('table-active');
        }
    });
});

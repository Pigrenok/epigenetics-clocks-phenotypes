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

function filterColumn0(menu,column) {
    var checkedValues = menu.find('input[type=checkbox].form-check-input:checked').map(function () {
        return this.value;
    }).get();
    
    var isAny = $('#allAnySwitch').prop('checked')

    if (isAny) {
        var search = checkedValues.length > 0 ? checkedValues.join('|') : '';
    } else {
        var search = checkedValues.length > 0 ? checkedValues.map(term => '(?=.*' + term + ')').join('') + '.*' : '';    
    }
    
    column.search(search, true, false).draw();
}

function initFilters(api) {
    api.columns([0, 1, 2, 3, 5]).every(function () {
        var column = this;
        var columnIndex = column.index();
        var dropdown = $('<div class="dropdown"></div>').appendTo($(column.header()));
        var button = $('<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="true"></button>')
            .appendTo(dropdown);
        var menu = $('<ul class="dropdown-menu"></ul>').appendTo(dropdown);
        

        if (columnIndex === 0) {
            var item = $('<li class="mx-auto p-2"></li>').appendTo(menu)
            var slidingSwitch = $('<input type="checkbox" id="allAnySwitch" data-toggle="toggle" data-onlabel="ANY" data-offlabel="ALL">')
                                .appendTo(item);
            slidingSwitch.on('change',function() {
                filterColumn0(menu,column)
            });
            // // slidingSwitch.on('change', function (event) {
            // //     event.stopPropagation();
            // // });
            // // slidingSwitch.on('click', function (event) {
            // //   event.stopPropagation();
            // // });
            slidingSwitch.bootstrapToggle();

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
            
            $('<div class="dropdown-divider"></div>').appendTo(menu);
            
            allCategories.sort().forEach(function (d, j) {
                var itemli = $('<li class="mx-auto px-2"></li>').appendTo(menu);
                var item = $('<div class="form-group"></div>').appendTo(itemli);
                var checkbox = $('<input class="form-check-input me-2" type="checkbox" value="' + d + '">').appendTo(item);
                var label = $('<label class="form-check-label"></label>').text(d).appendTo(item);
                checkbox.on('change', function () {
                    filterColumn0(menu,column);
                });
            });
        } else {
            column.data().unique().sort().each(function (d, j) {
                var item = $('<div class="form-group"></div>').appendTo(menu);
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


        // menu.appendTo(menudiv);
        
        // menudiv.on('click', function (event) {
        //     event.stopPropagation();
        // });
        dropdown.on('click', function (event) {
            event.stopPropagation();
        });
        // dropdown.on('change', '#allAnySwitch', function (event) {
        //     event.stopPropagation();
        // });

        // if (columnIndex === 0) {
        //     var slidingSwitch = $('<input type="checkbox" id="allAnySwitch" class="dropdown-item" data-toggle="toggle" data-onlabel="ANY" data-offlabel="ALL">').appendTo(menudiv);
        //     slidingSwitch.on('change', function (event) {
        //         event.stopPropagation();
        //     });
        //     slidingSwitch.bootstrapToggle();
        // }
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
Papa.parse('data_for_web_table.csv', {
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
            row['Tissue_C'],
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

    // Handle click event on rows to de/highlight them
    $('#myTable tbody').on('click', 'tr', function() {
        if ($(this).hasClass('table-active')) {
            $(this).removeClass('table-active');
        } else {
            // table.$('tr.table-active').removeClass('table-active');
            $(this).addClass('table-active');
        }
    });
});

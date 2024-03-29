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

function filterColumn1(menu,column) {
    if (menu==undefined) {
        column.search('', true, false).draw()
        return;
    }

    var checkedValues = menu.find('input[type=checkbox].form-check-input:checked').map(function () {
        return this.value;
    }).get();
    
    var isAny = $('#allAnySwitch').prop('checked')

    if (isAny) {
        var search = checkedValues.length > 0 ? '\\b' + checkedValues.join('\\b|\\b') + '\\b': '';
    } else {
        var search = checkedValues.length > 0 ? checkedValues.map(term => '(?=.*\\b' + term + '\\b)').join('') + '.*' : '';    
    }
    
    column.search(search, true, false).draw();
}

function disableCheckboxes(api, columnIndex) {
    var filteredData = api.rows({ search: 'applied' }).data();
    var columnData;
    if (columnIndex === 1) {
        columnData = getCategories(filteredData.pluck(columnIndex));
    } else {
        columnData = filteredData.pluck(columnIndex).unique();    
    }
    var columnFilter = $(api.column(columnIndex).header()).find('input[type="checkbox"]');
    columnFilter.each(function () {
        if (this.id !== "allAnySwitch") {
            if (columnData.indexOf(this.value) === -1) {
                $(this).prop('disabled', true);
            } else {
                $(this).prop('disabled', false);
            }
        }
    });
}

function getCategories(array) {
    var allCategories = [];
    array.each(function (d, j) {
        var categories = d.split(', ');
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i].trim();
            if (allCategories.indexOf(category) === -1) {
                allCategories.push(category);
            }
        }
    });

    return allCategories;
}

function initFilters(api) {
    api.columns([0, 1, 2, 3, 4, 6]).every(function () {
        var column = this;
        var columnIndex = column.index();
        var dropdown = $('<span class="dropdown"></span>').appendTo($(column.header()));
        dropdown.css({
            'margin-left': '5px'
        })
        var button = $('<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="true"></button>')
            .appendTo(dropdown);
        var menu = $('<ul class="dropdown-menu"></ul>').appendTo(dropdown);
        menu.css({
            'max-height': 'calc(80vh - ' + $(column.header()).offset().top + 'px)',
            'overflow-y': 'auto'
        });

        var resetButton = $('<button class="btn btn-secondary btn-sm">Reset</button>')
        .appendTo($('<li class="mx-auto p-2"></li>').appendTo(menu))
        .on('click', function () {
            event.stopPropagation();
            $(column.header()).find('input[type="checkbox"]').prop('checked', false);//.trigger('change');
            $(column.header()).find('input[type="number"]').val('');
            // filterNtotal(api);
            filterColumn1(undefined,column);
            if (columnIndex<3) {
                for (var i=columnIndex+1; i<=3; i++) {
                    disableCheckboxes(api,i)
                }
            }
        });

        // Add a divider after the Reset button
        $('<div class="dropdown-divider"></div>').appendTo(menu);

        if (columnIndex === 1) {
            var item = $('<li class="mx-auto p-2"></li>').appendTo(menu)
            var slidingSwitch = $('<input type="checkbox" id="allAnySwitch" data-toggle="toggle" data-onlabel="ANY" data-offlabel="ALL">')
                                .appendTo(item);
            slidingSwitch.on('change',function() {
                filterColumn1(menu,column)
                disableCheckboxes(api, 2);
                disableCheckboxes(api, 3);
            });
            // // slidingSwitch.on('change', function (event) {
            // //     event.stopPropagation();
            // // });
            // // slidingSwitch.on('click', function (event) {
            // //   event.stopPropagation();
            // // });
            slidingSwitch.bootstrapToggle();

            let allCategories = getCategories(column.data());
            
            $('<div class="dropdown-divider"></div>').appendTo(menu);
            
            allCategories.sort().forEach(function (d, j) {
                var itemli = $('<li class="mx-auto px-2"></li>').appendTo(menu);
                var item = $('<div class="form-group"></div>').appendTo(itemli);
                var checkbox = $('<input class="form-check-input me-2" type="checkbox" value="' + d + '">').appendTo(item);
                var label = $('<label class="form-check-label"></label>').text(d).appendTo(item);
                checkbox.on('change', function () {
                    filterColumn1(menu,column);
                    disableCheckboxes(api, 2);
                    disableCheckboxes(api, 3);
                });
            });
        } else {
            column.data().unique().sort().each(function (d, j) {
                var item = $('<div class="form-group"></div>').appendTo(menu);
                var checkbox = $('<input class="form-check-input me-2" type="checkbox" value="' + d + '">').appendTo(item);
                var label = $('<label class="form-check-label"></label>').text(d).appendTo(item);

                checkbox.on('change', function () {
                    var checkedValues = menu.find('input:checked').map(function () {
                        return this.value;
                    }).get();
                    var search = checkedValues.length > 0 ? '^' + checkedValues.join('$|^') + '$' : '';
                    column.search(search, true, false).draw();
                    if (columnIndex === 0) {
                        disableCheckboxes(api, 1);
                        disableCheckboxes(api, 2);
                        disableCheckboxes(api, 3);
                    }

                    if (columnIndex === 2) {
                        disableCheckboxes(api, 3);
                    }
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
        // var headerText = $(column.header()).text();
        // $(column.header()).html('').append(dropdown).append($('<span>').text(headerText));
    });

    // Add min/max inputs for the 'N total' column
    var nTotalColumn = api.column(5);
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
            let nTotal = parseFloat(data[5]) || 0; // use data for the age column
         
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
            // api.columns().every(function () {
            //     var column = this;
            //     $(column.header()).find('input[type="checkbox"]').prop('checked', false).trigger('change');
            //     $(column.header()).find('input[type="number"]').val('');
            // });
            // Suppress the redraw
            // var draw = false;

            api.columns().every(function () {
                var column = this;
                $(column.header()).find('input[type="checkbox"]').prop('checked', false);
                $(column.header()).find('input[type="number"]').val('');
                filterColumn1(undefined,column)
            });
            disableCheckboxes(api,1);
            disableCheckboxes(api,2);
            disableCheckboxes(api,3);
            // Manually trigger a single redraw after all filters have been cleared
            // api.draw(draw);
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
        var category = row['Factor category'];
        if (row['Factor category'] === 'Multiple_groups') {
            category = [row['Multiple_cat1'], row['Multiple_cat2'], row['Multiple_cat3']]
                .filter(Boolean)
                .join(', ');
        }
        table.row.add([
            row['Topic'],
            category,
            row['Factor group'],
            row['Factor'],
            row['Clock'],
            row['N total'],
            row['Tissue'],
            row['Race_Ethnicity'],
            row['Sex'],
            row['Twin_study'],
            row['Cohort'],
            '<a href="' + row['Link'] + '" target="_blank"><i class="bi bi-box-arrow-up-right">Paper</i></a>',
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

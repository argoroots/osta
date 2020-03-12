$(function() {
    var updateAuctions = function (set) {
        var ids = [
          109941371,
          110349421,
          110349554,
          110434219,
          110434337,
          110446386,
          110475533,
          110827740,
          111352439,
          111421381,
          111425337,
          111499637,
          111580748,
          111620988,
          111724138,
          111802265,
          111864314,
          111864318,
          111864332,
          111870481,
          111905233,
          111975542,
          112032709,
          112063659,
          112434235,
          112501497,
          112521686,
          112526917,
          112553978,
          112633330,
          112862787,
          112886469,
          113109881,
          113202182,
          113297392,
          113298169,
          113555346,
          113721592,
          113742806,
          113742979,
          113743097,
          113815974,
          113816093,
          113820305,
          113837339,
          113839621,
          113936509,
          113938544,
          113999966,
          114006155,
          114132177,
          114503463,
          114652906,
          114652931,
          114652939,
          114652964,
          114739352,
          114888407,
          114923332,
          114946809,
          114984899,
          115050999,
          115125752,
          115148193,
          115219794,
          115410393,
          115526532,
          115526674,
          115695606,
          115749213,
          115780251,
          115810071,
          115848370,
          115853167,
          115975126,
          116086730,
          116190492,
          116342147,
          116502702,
          116503935,
          116536635,
          116539444,
          116541539,
          116585891,
          116603066,
          116619518,
          116623865,
          116679816,
          116741105,
          116741113,
          116910393,
          116925759,
          117057773,
          117156143,
          117193652,
          117241762,
          117378223,
          117473648,
          117577019,
          117604176,
          117636452,
          117641370,
          117679089,
          117807255,
        ]
        var images = []

        for (var s = 0; s < ids.length; s++) {
            var url = 'https://osta-ee.postimees.ee/index.php?fuseaction=item.info&id=' + ids[s]

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                success: function (data) {
                    var html = $.parseHTML(data)
                    var images = $(html).find('.offers-details__gallery-nav-list .gallery-thumb img')
                    var description = $(html).find('.offer-details__description').text().trim()

                    for (var i = 0; i < images.length; i++) {
                        var img = $(images[i]).data('original').replace('1_3_', '1_9_')
                        $('pre').append('curl ' + img + ' > ' + ids[s] + '-' + img.replace('https://cache.osta.ee/iv2/auctions/1_9_', '') + ' && \\\n')
                    }
                }
            })
        }

        images.sort()

        console.log(images)
    }
    updateAuctions()

    function functionName() {

    }
})

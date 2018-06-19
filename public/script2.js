$(function() {
    var updateAuctions = function (set) {
        var ids = [
            107253743,
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

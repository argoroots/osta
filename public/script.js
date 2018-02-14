$(function() {
    firebase.initializeApp({
        apiKey: 'AIzaSyDKa_9Dca5kKOP-5Dczx1zbvvNymzeb8AA',
        authDomain: 'osta-ee.firebaseapp.com',
        databaseURL: 'https://osta-ee.firebaseio.com',
        projectId: 'osta-ee',
        storageBucket: '',
        messagingSenderId: '367995677054'
    })

    firebase.database().ref('auctions/').once('value').then(function (snapshot) {
        var limit = 999
        var values = Object.values(snapshot.val())

        $('title').text(values.length)

        values.sort(function (a, b) {
            if (a && a.url && a.url.toLowerCase().trim() > b.url.toLowerCase().trim()) { return 1 }
            if (a && a.url && a.url.toLowerCase().trim() < b.url.toLowerCase().trim()) { return -1 }
            return 0
        })

        for (var i = 0; i < values.length; i++) {
            if (limit < 0) { break }
            if (
                values[i].url.toLowerCase().includes('-armeekaart-') ||
                values[i].url.toLowerCase().includes('-entsuklopeedia-') ||
                values[i].url.toLowerCase().includes('-eritempel-') ||
                values[i].url.toLowerCase().includes('-kangas-') ||
                values[i].url.toLowerCase().includes('-kop-') ||
                values[i].url.toLowerCase().includes('-kopeek-') ||
                values[i].url.toLowerCase().includes('-kopejka-') ||
                values[i].url.toLowerCase().includes('-kopejki-') ||
                values[i].url.toLowerCase().includes('-kopikas-') ||
                values[i].url.toLowerCase().includes('-kopikat-') ||
                values[i].url.toLowerCase().includes('-kunstsiid-') ||
                values[i].url.toLowerCase().includes('-pagunid-') ||
                values[i].url.toLowerCase().includes('-postkaart-') ||
                values[i].url.toLowerCase().includes('-margialbum-') ||
                values[i].url.toLowerCase().includes('-margid-') ||
                values[i].url.toLowerCase().includes('-mark-') ||
                values[i].url.toLowerCase().includes('-marki-') ||
                values[i].url.toLowerCase().includes('-munt-') ||
                values[i].url.toLowerCase().includes('-rubl-') ||
                values[i].url.toLowerCase().includes('-taskukalender-') ||
                values[i].url.toLowerCase().includes('-rubla-') ||
                values[i].url.toLowerCase().includes('-umbrik-') ||
                values[i].url.toLowerCase().includes('-umbrikud-') ||
                values[i].url.toLowerCase().includes('-vimpel-') ||
                values[i].url.toLowerCase().includes('/mark-') ||
                values[i].url.toLowerCase().includes('/tempel-') ||
                values[i].url.toLowerCase().includes('/umbrik-') ||
                values[i].url.toLowerCase().includes('/vimpel-') ||
                values[i].deleted
            ) { continue }

            limit--

            var priceDisplay = (values[i].priceBuy || values[i].price || 0).toLocaleString('et', { style: 'currency', currency: 'EUR', currencyDisplay: 'symbol' })

            $('#auctions').append('<div class="auction" data-id="' + values[i].id + '"><a href="' + values[i].url + '" target="_blank" style="background-image: url(' + values[i].picture + ')"></a><strong class="' + (values[i].priceBuy ? 'buy' : '') + '">' + priceDisplay + '</strong>' + values[i].title + '<div>')
        }
    })

    $('#updateAuctions').click(function () {
        // firebase.database().ref('auctions/').remove()

        var url = 'https://osta-ee.postimees.ee/index.php?'
        var query = [
            'fuseaction=search.search',
            'id=1000',
            'limit=running',
            'time=left',
            'preset=',
            'orderby=',
            'gallery=',
            // 'q[cat]=1000',
            // 'q[q]=n%c3%b5uk',
            'q[show_items]=1',
            'q[type]=all',
            'q[fuseaction]=search.search',
            'q[searchform]=search.advanced',
            'pagesize=180',
            // 'start=0'
        ]
        var searches = [
            {cat: 1000, q: 'cccp' },
            {cat: 1000, q: 'cccr' },
            {cat: 1000, q: 'electronika' },
            {cat: 1000, q: 'elektronika' },
            {cat: 1000, q: 'juku' },
            {cat: 1000, q: 'kalkulaator' },
            {cat: 1000, q: 'norma' },
            {cat: 1000, q: 'nõuk' },
            {cat: 1000, q: 'nsv' },
            {cat: 1000, q: 'salvo' },
            {cat: 1000, q: 'ussr' },
            {cat: 1000, q: 'vahvli' },
            {cat: 1000, q: 'venea' },
            {cat: 1000, q: 'zx' },
            {cat: 1000, q: 'ссср' },
            {cat: 1199, q: '' }, // Mudelautod
            {cat: 2141, q: '' }, // Nõukogudeaegsed kaubad
        ]
        var auctions = {}
        var auctionTotalCount = {}

        for (var s = 0; s < searches.length; s++) {
            var start = 0
            var itemsCount = 1

            while (itemsCount !== 0) {
                $.ajax({
                    type: 'GET',
                    type: 'GET',
                    url: url + query.join('&') + '&q[cat]=' + searches[s].cat + '&q[q]=' + searches[s].q + '&start=' + start,
                    async: false,
                    success: function (data) {
                        var html = $.parseHTML(data)
                        var items = $(html).find('.main-content__section figure.offer-thumb')

                        itemsCount = items.length
                        start = start + itemsCount

                        console.log(searches[s].cat, searches[s].q, start)

                        for (var i = 0; i < items.length; i++) {
                            var item = $(items[i])
                            var itemUrl = 'https://osta-ee.postimees.ee/' + item.find('p.offer-thumb__title a').attr('href').replace('?_src=search', '')
                            var id = parseInt(itemUrl.split('-').slice(-1)[0].split('.')[0])
                            var title = item.find('p.offer-thumb__title a').text().replace(/!/g , '').replace(/  /g , '').replace(/  /g , '').trim()
                            var picture = item.find('img').data('original')
                            var expires = item.find('li.offer-expires').text() || null
                            var offers = parseInt(item.find('li.offers-made').text()) || null
                            var price = parseFloat(item.find('span.price-cp').text().replace('€', '')) || null
                            var priceBuy = parseFloat(item.find('span.price-bn').text().replace('€', '')) || null

                            firebase.database().ref('auctions/' + id).update({
                                id: id,
                                updated: (new Date()).toISOString(),
                                title: title,
                                url: itemUrl,
                                picture: picture,
                                expires: expires,
                                offers: offers,
                                price: price,
                                priceBuy: priceBuy
                            })

                            auctionTotalCount++
                            $('h1').html('Updated: ' + auctionTotalCount)
                        }
                    }
                })
            }
        }
    })

    $('body').on('click', '.auction a', function (e) {
        if(!e.altKey) { return }

        $(this).parent().hide()
        firebase.database().ref('auctions/' + $(this).parent().data('id')).update({ deleted: (new Date()).toISOString() })
        e.preventDefault()
    })
})

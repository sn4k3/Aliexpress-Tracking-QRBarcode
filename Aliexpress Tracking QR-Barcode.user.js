// ==UserScript==
// @name         Aliexpress Tracking QR/Barcode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a QR/barcode to tracking number inside order details page and create link's to 17track.net
// @author       Tiago Conceição
// @copyright    2016, Tiago Conceição
// @license      https://raw.githubusercontent.com/sn4k3/Aliexpress-Tracking-QRBarcode/master/LICENSE
// @icon         https://raw.githubusercontent.com/sn4k3/Aliexpress-Tracking-QRBarcode/master/app-icon.png
// @homepage     https://github.com/sn4k3/Aliexpress-Tracking-QRBarcode
// @supportURL   https://github.com/sn4k3/Aliexpress-Tracking-QRBarcode/issues
// @include        http*://*trade.aliexpress.com/order_detail.htm*
// @include        http*://*track.aliexpress.com/logisticsdetail.htm*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lrsjng.jquery-qrcode/0.14.0/jquery-qrcode.min.js
// @require      https://cdn.jsdelivr.net/jsbarcode/3.3.5/barcodes/JsBarcode.code128.min.js
// ==/UserScript==

(function() {
    'use strict';
    $.fn.ignore = function(sel){
        return this.clone().find(sel||">*").remove().end();
    };
    
    $(document).ready(function() {
        var defaultUrlTracking = 'http://www.17track.net/en/track?nums=';
        var urlTracking = defaultUrlTracking;
        var i = 0;
        var trackingNumbers = [];
        
        function trackingNumberToURL(trackingNumber)
        {
            if(trackingNumber.startsWith('LP')) // Aliexpress Logistics
                return 'http://global.cainiao.com/detail.htm?mailNoList=';
            return defaultUrlTracking;
        }
        
        // trade.aliexpress.com/order_detail.htm
        $('.shipping-bd .no').each(function() {
            var trackingNumber = $(this).text().trim();
            if(trackingNumber)
            {
                i++;
                trackingNumbers.push(trackingNumber);
                //$(this).html('<svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="1"></svg>');
                urlTracking = trackingNumberToURL(trackingNumber);
                $(this).html(trackingNumber+'<a href="'+urlTracking+trackingNumber+'" target="_blank"><div id="trackingQRCode'+i+'" class="trackingQRCode"></div></a>');
                $("#trackingQRCode"+i).qrcode({
                    "size": 100/*parseInt($(this).css('width'))*/,
                    "color": "#3a3",
                    //'label': trackingNumber,
                    "text": trackingNumber
                });
                
                if(i == 1)
                {
                    var tableID = $(this).parent().attr('id');
                    $('<div align="center"><a href="'+urlTracking+trackingNumber+'" target="_blank"><svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="2"></svg></a></div>').insertAfter( "#"+tableID+" .list-box");
                }
            }
            //console.log(trackingNumber);
        });
        // track.aliexpress.com/logisticsdetail.htm
        var trackingNumber = $('.consignment-detail-content .detail-row:first .item.msg:first').text();
        if(trackingNumber)
        {
            i++;
            trackingNumbers.push(trackingNumber);
            urlTracking = trackingNumberToURL(trackingNumber);
            $('<div align="center"><a href="'+urlTracking+trackingNumber+'" target="_blank"><svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="2"></svg></a></div>').insertAfter( ".consignment-detail-content:first");
        }

        // Track All Link
        if(trackingNumbers.length > 0)
        {
            urlTracking = trackingNumberToURL(trackingNumbers[0]);
            var element = $('#shipping-section .ui-box-title');
            element.html(element.text().trim()+'<a href="'+urlTracking+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">(Track All)</a>');
        }
        JsBarcode('.trackingBarcode').init();
        // Your code here...
    });
})();
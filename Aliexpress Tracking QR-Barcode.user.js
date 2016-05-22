// ==UserScript==
// @name         Aliexpress Tracking QR/Barcode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a QR/barcode to tracking number inside order details page and create link's to 17track.net
// @author       Tiago Conceição
// @copyright    2016, Tiago Conceição
// @license      https://raw.githubusercontent.com/sn4k3/Aliexpress-Tracking-QRBarcode/master/LICENSE
// @icon         https://raw.githubusercontent.com/sn4k3/Aliexpress-Tracking-QRBarcode/master/app-icon.png
// @homepage     https://github.com/sn4k3/Aliexpress-Tracking-QRBarcode
// @supportURL   https://github.com/sn4k3/Aliexpress-Tracking-QRBarcode/issues
// @match        http*://*trade.aliexpress.com/order_detail.htm*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/jsbarcode/3.3.5/barcodes/JsBarcode.code128.min.js

// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var i = 0;
        var trackingNumbers = [];
        $('.shipping-bd .no').each(function() {
            i++;
            var trackingNumber = $(this).text().trim();
            if(trackingNumber)
            {
                trackingNumbers.push(trackingNumber);
                //$(this).html('<svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="1"></svg>');
                $(this).html(trackingNumber+'<a href="http://www.17track.net/en/track?nums='+trackingNumber+'" target="_blank"><div id="trackingQRCode'+i+'" class="trackingQRCode"></div></a>');
                $("#trackingQRCode"+i).qrcode({
                    "size": 100/*parseInt($(this).css('width'))*/,
                    "color": "#3a3",
                    //'label': trackingNumber,
                    "text": trackingNumber
                });
            }
            //console.log(trackingNumber);
        });

        if(trackingNumbers.length > 0)
        {
            var element = $('#shipping-section .ui-box-title');
            element.html(element.text().trim()+'<a href="http://www.17track.net/en/track?nums='+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">(Track All)</a>');
        }
        //JsBarcode(".trackingBarcode").init();
        // Your code here...
    });
})();

// https://cdnjs.cloudflare.com/ajax/libs/lrsjng.jquery-qrcode/0.12.0/jquery.qrcode.js BACKUP
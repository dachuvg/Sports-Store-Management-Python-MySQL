var productPrices = {};

// $(function () {
//     //Json data by api call for order table
//     $.get(productListApiUrl, function (response) {
//         productPrices = {}
//         if(response) {
//             var options = '<option value="">--Select--</option>';
//             $.each(response, function(index, product) {
//                 options += '<option value="'+ product.product_id +'">'+ product.name +'</option>';
//                 productPrices[product.product_id] = product.price_per_unit;
//             });
//             $(".product-box").find("select").empty().html(options);
//         }
//     });
// });

$(function () {
    // Fetch product list
    $.get(productListApiUrl, function (response) {
        productPrices = {};
        if (response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function (index, product) {
                console.log(product.products_id);
                options += '<option value="' + product.products_id + '">' + product.name + '</option>';
                productPrices[product.products_id] = product.price_per_unit;
            });
            // Ensure you're appending to the correct select element
            $(".product-box select").empty().html(options);
        } else {
            console.error("No response from productListApiUrl");
        }
    }).fail(function () {
        console.error("Failed to fetch product data");
    });
});

$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.0');
});

$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});

$(document).on("change", ".cart-product", function (){
    var product_id = $(this).val();
    var price = productPrices[product_id];
    console.log("Hi");
    console.log(product_id);
    console.log(price)

    $(this).closest('.product-item').find('.product_price').val(price);
    calculateValue();
});

$(document).on("change", ".product-qty", function (e){
    calculateValue();
});

// $("#saveOrder").on("click", function(){
//     var formData = $("form").serializeArray();
//     var requestPayload = {
//         customer_name: null,
//         total: null,
//         order_details: []
//     };
//     var orderDetails = [];
//     for(var i=0;i<formData.length;++i) {
//         var element = formData[i];
//         var lastElement = null;

//         switch(element.name) {
//             case 'customerName':
//                 requestPayload.customer_name = element.value;
//                 break;
//             case 'product_grand_total':
//                 requestPayload.grand_total = element.value;
//                 break;
//             case 'product':
//                 requestPayload.order_details.push({
//                     product_id: element.value,
//                     quantity: null,
//                     total_price: null
//                 });                
//                 break;
//             case 'qty':
//                 lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
//                 lastElement.quantity = element.value
//                 break;
//             case 'item_total':
//                 lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
//                 lastElement.total_price = element.value
//                 break;
//         }

//     }
//     callApi("POST", orderSaveApiUrl, {
//         'data': JSON.stringify(requestPayload)
//     });
// });

$("#saveOrder").on("click", function() {
    var formData = $("form").serializeArray();
    var requestPayload = {
        customer_name: null,
        total: null,
        order_details: []
    };
    
    // Check if customer name is provided
    for (var i = 0; i < formData.length; ++i) {
        var element = formData[i];

        if (element.name === 'customerName' && element.value.trim() === '') {
            alert("Please enter the customer name."); // Alert if customer name is empty
            return; // Exit the function to prevent submission
        }
    }

    for (var i = 0; i < formData.length; ++i) {
        var element = formData[i];
        var lastElement = null;

        switch (element.name) {
            case 'customerName':
                requestPayload.customer_name = element.value;
                break;
            case 'product_grand_total':
                requestPayload.grand_total = element.value;
                break;
            case 'product':
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length - 1];
                lastElement.quantity = element.value;
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length - 1];
                lastElement.total_price = element.value;
                break;
        }
    }

    // Ensure total is calculated and assigned before sending
    requestPayload.total = requestPayload.order_details.reduce(function (sum, item) {
        return sum + (item.total_price ? parseFloat(item.total_price) : 0);
    }, 0);

    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

/**
 * Created by ynyusifov on 07/05/19.
 */

 $(document).ready(function () {

    'use strict';

    // ------------------------------------------------------- //
    // Material Inputs
    // ------------------------------------------------------ //
    var materialInputs = $('input.input-material');

    // activate labels for prefilled values
    materialInputs.filter(function () {
        return $(this).val() !== "";
    }).siblings('.label-material').addClass('active');

    // move label on focus
    materialInputs.on('focus', function () {
        $(this).siblings('.label-material').addClass('active');
    });

    // remove/keep label on blur
    materialInputs.on('blur', function () {
        $(this).siblings('.label-material').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-material').addClass('active');
        } else {
            $(this).siblings('.label-material').removeClass('active');
        }
    });

// ------------------------------------------------------- //
// Sidebar Functionality
// ------------------------------------------------------ //
    $('#toggle-btn').on('click', function (e) {
        e.preventDefault();

        var isShrinked = getCookie("menu-shrinked") == "true";
        let byHuman = getCookie("byHuman") == "true";
        if (byHuman) {
            isShrinked = !isShrinked;
            setCookie("menu-shrinked", isShrinked, 365);
        }

        if (isShrinked) {
            $(this).removeClass('active');
            $('.side-navbar').addClass('shrinked');
            $('.content-inner').addClass('active');
        } else {
            $(this).addClass('active');
            $('.side-navbar').removeClass('shrinked');
            $('.content-inner').removeClass('active');
        }

        if ($(window).outerWidth() > 1183) {
            if ($('#toggle-btn').hasClass('active')) {
                $('.navbar-header .brand-small').hide();
                $('.navbar-header .brand-big').show();
            } else {
                $('.navbar-header .brand-big').hide();
                $('.navbar-header .brand-small').show();
            }
        }

        if ($(window).outerWidth() < 1183) {
            $('.navbar-header .brand-small').show();
        }

        setCookie("byHuman", true, 365);
    });

    /**
     * Override the default yii confirm dialog. This function is
     * called by yii when a confirmation is requested.
     *
     * @param message the message to display
     * @param okCallback triggered when confirmation is true
     * @param cancelCallback callback triggered when cancelled
     */

    yii.confirm = function (message, okCallback, cancelCallback) {
        callSWAL(message, 'warning', okCallback, cancelCallback);
    };

    if (typeof krajeeDialog !== 'undefined') {
        krajeeDialog.confirm = function (message, okCallback, cancelCallback) {
            const expArr = ['PDF', 'EXCEL', 'CSV'];
            var alertType =
                $.isEmptyObject(expArr.filter((item) => message.toLowerCase().includes(item.toLowerCase())))
                    ? 'info'
                    : 'warning';
            callSWAL(message, alertType, okCallback, cancelCallback);
        };
    }

    $('#nspGrid-togdata-all').click(function () {
        location.reload();
    });

    function callSWAL(message, alertType, okCallback, cancelCallback) {
        Swal.fire({
            title: message,
            type: alertType,
            showCancelButton: true,
            allowOutsideClick: true
        }).then((selection) => {
            if (selection.value) okCallback(selection);
            else cancelCallback;
        });
    }

    $('.image-manager-input i.glyphicon-remove')
        .removeClass('glyphicon glyphicon-remove')
        .addClass('icon-cancel');

    $('.image-manager-input i.glyphicon-folder-open')
        .removeClass('glyphicon glyphicon-folder-open')
        .addClass('icon-folder');

    //expanded raw js
    //Changing href of each expanded row
    // var $rows = $('#nspGrid-container table.kv-grid-table tbody a');
    // $rows.each(function(){
    //     var anchor= $(this);
    //     var actionId = anchor.attr("href");
    //     var subscriberHref = actionId.replace(actionId.split('/')[2], 'purchase-request-detail');
    //     // console.log(actionId.replace(actionId.split('/')[2], 'subscriber'));
    //     $(this).attr('href', subscriberHref);
    // });

    if (typeof hostUrl !== 'undefined') {
        var widget = $('.cropper-widget');

        if (widget.length) {
            $(widget).each(function () {
                var image = $(this).find('input').first();

                var image_thumbnail = $(this).find('img.thumbnail');
                var image_name = image_thumbnail.attr("src");
                var image_path = hostUrl + image_name;

                if (image_name.indexOf('nophoto') == -1) {
                    image.val(image_path);
                    image_thumbnail.attr('src', image_path);
                }
            });
        }
    }

    $('.collapseForm .collapse').on('shown.bs.collapse', function () {
        $(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    });

    // dual list box arraw issue
    if ($('#authitemchild-child').length) {
        $(function () {
            var dualListContainer = $('#authitemchild-child').bootstrapDualListbox('getContainer');
            dualListContainer.find('.moveall i').removeClass().addClass('fa fa-arrow-right');
            dualListContainer.find('.removeall i').removeClass().addClass('fa fa-arrow-left');
            dualListContainer.find('.move i').removeClass().addClass('fa fa-arrow-right');
            dualListContainer.find('.remove i').removeClass().addClass('fa fa-arrow-left');
        });
    }

    $(document).on("pjax:timeout", function (event) {
        // Prevent default timeout redirection behavior
        event.preventDefault()
    });

    var spinner = $('<div class="spinner"><img src="/img/nsplogo.gif" width="50px" alt=""></div>');
    var tbody = $('#nspGrid').find('tbody').eq(0);
    var paginationSize = $('#nspGrid').data('size');
    var total = $('#nspGrid').data('total');
    var count = paginationSize;

    $(window).scroll(function () {
        if ($(this).scrollTop() >= $(document).height() - $(this).height()) {
            if (infiniteScroll === false) return;

            if (total > count) {
                count += paginationSize;
                $('#pjax-grid-view').on('pjax:beforeSend', function (event, xhr, options) {
                    spinner.css('visibility', 'visible');
                    tbody.css('opacity', '.5');
                    spinner.insertAfter(tbody);
                });

                $.pjax.reload({
                    url: "",
                    type: "GET",
                    container: '#pjax-grid-view',
                    data: {
                        size: count
                    },
                    beforeSend: function () {
                        console.log('loading')
                    },
                    replace: false,
                    timeout: false,
                    scrollTo: false,
                });

                $('#pjax-grid-view').on('pjax:success', function (data, status, xhr, options) {
                    tbody = $(data.target).find('#nspGrid tbody').eq(0);
                })
            }
        }
    });
});

$(document).on('click', '.add-new-item', function () {
    const url = window.location.pathname.split("/").slice(2).join("/") + location.search;
    document.cookie = `refererOfReferer = /${url}; path=/`;
});

$(document).on('select2:open', "select[data-add-item]", addNewItem);

/**
 * Cookie Functions
*/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function updateChildListBox() {
    const loader = '<div class="loading"><img src="/img/nsplogo.gif" width="50px" alt=""></div>';
    let availableWidget = $('.bootstrap-duallistbox-container');
    const hiddenDualListBoxAvailable = $("#authitemchild-child");

    $.ajax({
        url: controllerName + '/children',
        type: 'GET',
        dataType: 'JSON',
        data: {
            "parent": $("#authitemchild-parent").val(),
        },
        beforeSend: function () {
            // hiddenDualListBoxAvailable.bootstrapDualListbox('refresh');

            availableWidget.css('opacity', '.8');
            availableWidget.append(loader);
        },
        success: function (response) {
            if (response) {
                availableWidget.css('opacity', '1');
                $('.loading').remove();

                hiddenDualListBoxAvailable.find('option').remove();
                $.each(response.children, function (value, key) {
                    let option = `<option value="${value}">${key}</option>`;
                    hiddenDualListBoxAvailable.append(option);
                });
                hiddenDualListBoxAvailable.bootstrapDualListbox('refresh', true);
            }
        },
        error: function (response) {
        }
    });
}

function addNewItem() {
    // console.log(this);
    let label = $(this).closest('.form-group').find('label').text();
    label = $(this).data('add-item2') ? label.split(' ') : [label];

    $("span.select2-results:not(:has(a))")
        .append(`<a href=${$(this).data('add-item')} class="add-new-item">${$(this).data('title')}</a>`);
    if ($(this).data('add-item2')) {
        $("span.select2-results:not(:has(a.item-two))")
            .append(`<a href=${$(this).attr('data-add-item2')} class="add-new-item item-two">${$(this).data('title2')}</a>`);
    }
}
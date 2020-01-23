function hideLoadingSpinner() {
    var loadingSpinner = $('.loading-spinner');
    var body = $('body');

    loadingSpinner.fadeOut();
    body.removeClass('no-scroll');
}

function createContact(contact) {
    var container = $('<div></div>');
    container.addClass('user');

    // Add id of the user
    container.data('id', contact.id);

    var userPicContainer = $('<div></div>');
    userPicContainer.addClass('user-pic-container');

    userPicContainer.append(
        $('<img>').addClass('img img--rounded user-pic')
            .attr('src', contact.img)
    );

    userPicContainer.prepend(createContactStatus(contact.status));

    var texts = $('<div></div>');
    texts.addClass('texts d-none d-md-block');

    // Username
    texts.append(
        $('<p></p>').addClass('username')
            .html(contact.name)
    );
    // Last message
    texts.append(
        $('<p></p>').addClass('last-message')
            .html(contact.lastMessage)
    );

    container.append(userPicContainer);
    container.append(texts);
    $('.users').append(container);

}

function createContactStatus(status) {
    var statusContainer = $('<div></div>');
    statusContainer.addClass('status status--small status--rounded');

    switch (status) {
        case 'available':
            statusContainer.addClass('status--available');
            break;

        case 'not-available':
            statusContainer.addClass('status--not-available');
            break;

        case 'offline':
            statusContainer.addClass('status--offline');
            break;

        case 'busy':
            statusContainer.addClass('status--busy');
            break;

        default:
            statusContainer.addClass('status--not-available');
    }

    return statusContainer;
}

function createMessage(message) {
    var messageContainer = $(
        `<div class="message ${message.received ? 'message--received' : ''}">
            <img class="img img--rounded message-pic" src="${message.img}">
            <p class="text">${message.message}</p>
        </div>`
    );

    $('.messages').append(messageContainer);
}

function resetMessages() {
    $('.messages').empty();
    //$('.messages').html('');
}

////
$(document).on('click', '.user', function () {
//$('.user').on('click', function () {
    var id = $(this).data('id');
    //console.log(id);

    loadMessages(id);

});

function loadMessages(id, callback) {
    resetMessages();

    $.get('json/messages' + id + '.json', function (messages) {
        // console.log(messages);
        $.each(messages, function (index, message) {
            createMessage(message);
        });
        
        if (typeof callback == 'function') {
            callback();
        }
    });
}

function loadContacts(callback) {
    $.get('json/contacts.json', function (contacts) {
        // console.log(contacts);
        $.each(contacts, function (index, contact) {
            createContact(contact);
        });

        // Execute callback function
        callback(contacts);
    });
}

$(document).ready(function () {

    loadContacts(function (contacts) {

        loadMessages(contacts[0].id, function () {

            setTimeout(function () {
                hideLoadingSpinner();
            }, 2000);
            
        });
    });
});


$('.btn-send').click(function() {
    // alert('cliccato');

    var content = $('.send-input').val();
    if(content!=''){

        
        var message = {
            message: content,
            img: "img/profile.png",
            received: false
        };
        createMessage(message);
        $('.send-input').val("");
        $('.send-input').focus();
        $('.messages').scrollTop($('.messages')[0].scrollHeight);
    }
});

$(document).keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        $('.btn-send').click();

    }
});
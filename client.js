$('#connect_btn').click(() => {
    let username = $('#username').val();

    socket = io('http://localhost:3000', {
        query: {
            'username': username
        }
    });

    setTimeout(() => {
        if (socket.connected) {
            $('#connection_infos').hide();
            socket.emit('new_user');
        } else {
            alert('Connexion au serveur impossible');
        }
    }, 1000);

    socket.on('new_user', users => {
        let list = users.users;
        refreshList(list);
    });

    socket.on('user_leave', users => {
        let list = users.users;
        refreshList(list);
    })

    socket.on('chat message', data => {
        $('#messages').append('<li>' + data.username + ' : ' + data.message + '</li>');
        $('#message_text').val('');
    })

    $('#send_message').click(() => {
        socket.emit('chat message', $('#message_text').val());
    })
});


function refreshList(list) {
    $('#user_list').empty();
    list.forEach(user => {
        $('#user_list').append('<li>' + user + '</li>');
    })
}
$(document).ready(function() {
    $('#switch').click(function() {
        console.log('clicked')
        $.ajax({
            type: 'POST',
            url: '/change_player',
            success: function(response) {
                // Handle success response
                console.log('Player changed successfully.');
                console.log(response)
                window.location.href = response.redirect;
            },
            error: function(xhr, status, error) {
                // Handle error response
                console.error('Error:', error);
            }
        });
    });
});

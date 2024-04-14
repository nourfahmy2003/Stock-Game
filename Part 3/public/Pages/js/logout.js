$(document).ready(function(){
    $('#logout').click(function() {
            $.ajax({
              url: '/logout',
              method: 'GET',
              success: function(response) {
                if (response.redirect) {
                    // Redirect to the specified URL
                    window.location.href = response.redirect;
                } else {
                    // Handle other responses or display a message
                    alert(JSON.stringify(response));
                }
              },
              error: function(xhr, status, error) {
                  console.error( error);
              }
          });
        });
  });
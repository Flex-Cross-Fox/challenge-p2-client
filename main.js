function showLoginPage(){
    $('#email-Login').val('');
    $('#password-Login').val('');
    $('#login-page').show();
    $('#sidebar').hide();
    $('.mb-3').hide();
    $('.page-heading').hide();
    $('#addMovieForm').hide();
};

function showHome(){
    $('#login-page').hide();
    $('#sidebar').show();
    $('.mb-3').show();
    $('.page-heading').show();
    $('#addMovieForm').hide();
}

function showAddMovie(){
    $('#login-page').hide();
    $('#sidebar').show();
    $('.mb-3').show();
    $('.page-heading').hide();
    $('#addMovieForm').show();
}

$(document).ready(function(){
    // if(localStorage.token){
    //     showHome()
    // }else{
    //     showLoginPage()
    // }

    $('#login-form').submit(function(event){
        event.preventDefault()
        let email = $('#email-Login').val
        let password = $('#password-Login').val
        console.log(email, password);
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/users/login',
            data: { email, password }
        })
    })
    .done((data) => {
        console.log(data);
    })
    .fail((err) => {
        console.log(err);
    })
})
function showLoginPage(){
    $('#email-Login').val('');
    $('#password-Login').val('');
    $('#editMovieForm').hide();
    $('#login-form-page').show();
    $('#login-page').show();

    // $('#sidebar').hide();
    $('.mb-3').hide();
    $('.page-heading').hide();
    $('#addMovieForm').hide();
    $('#navHome').hide();
    $('#navAddMovie').hide();
    $('#register-form').hide();
    $('#navLogout').hide();
    $('#navRegister').show();
    $('#navLogin').hide();
    $('#navSignOut').hide();
};

function showRegister(){
    $('#navLogin').show();
    $('#editMovieForm').hide();
    $('#login-form-page').hide();
    // $('#login-page').hide();
    $('#navSignOut').hide();
    $('#sidebar').show();
    $('.mb-3').hide();
    $('.page-heading').hide();
    $('#addMovieForm').hide();
    $('#register-form').show();
    $('#sidebar').show();
    $('#navRegister').hide();
    $('#navLogin').show();
}

function showHome(){
    $('#navLogin').hide();
    $('#login-form-page').hide();
    // $('#login-page').hide();

    $('#page-heading').show();
    $('#sidebar').show();
    $('.mb-3').show();
    $('#editMovieForm').hide();
    $('.page-heading').show();
    $('#addMovieForm').hide();
    $('#navLogout').show();
    $('#navHome').show();
    $('#navSignOut').show();
    $('#navAddMovie').show();
    $('#navRegister').hide();
    $('#register-form').hide();
    fentchMovies()    
}

function showAddMovie(){
    $('#navLogin').hide();
    $('#editMovieForm').hide();
    $('#login-page').hide();
    $('#sidebar').show();
    $('.mb-3').show();
    $('.page-heading').hide();
    $('#addMovieForm').show();
    $('#navLogout').show();
    $('#navSignOut').show();
    $('#navRegister').hide();
    $('#register-form').hide();
}

function fentchMovies(){
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/movies',
        headers: {token: localStorage.getItem('token') }  
    })
    .done((data) => {
        $('#isi-movie-list').empty()
        for(let a = 0; a < data.length; a++){
        $('#isi-movie-list').append(
            `
<tr>
    <td>${data[a].title}</td>
    <td>${data[a].synopsis}</td>
    <td>${data[a].trailerUrl}</td>
    <td><img src="${data[a].imgUrl}" alt="${data[a].title}" border=3 height=50 width=50></img></td>
    <td>${data[a].rating}</td>
    <td><a href="#" onclick="deleteMovie(${data[a].id})">Delete</a> <a href="#" onclick="editMovie(${data[a].id})">Edit</a></td>
</tr>`
            )
        }
    })
    .fail((err) => {
        console.log(err);
    })
}

function deleteMovie(id){
    $.ajax({
        method: 'DELETE',
        url: 'http://localhost:3000/movies/' + id,  
        headers: {token: localStorage.getItem('token') }
    })
    .done(() => {
        showHome()
    })
    .catch((err) => {
        console.log(err);
    })
}

function editMovie(id){
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/movies/' + id,  
        headers: {token: localStorage.getItem('token') }
    })
    .done((data) => {
        $('#editMovieForm').show()
        $('#login-page').hide();
        $('#sidebar').show();
        $('.mb-3').show();
        $('.page-heading').hide();
        $('#addMovieForm').hide();
        $('#register-form').hide();
        $('#navLogout').show();
        $('#navSignOut').show();
        $('#navRegister').hide();
        $('#editMovieTitle').val(data.title)
        $('#editMovieSynopsis').val(data.synopsis)
        $('#editMovieTrailerUrl').val(data.trailerUrl)
        $('#editMovieImageUrl').val(data.imgUrl)
        $('#editMovieRating').val(data.rating)
        $('#editgenreId').val(data.genreId)
        $('#editMovieForm').submit(function(event){
            event.preventDefault()
            let title = $('#editMovieTitle').val()
            let synopsis = $('#editMovieSynopsis').val()
            let trailerUrl = $('#editMovieTrailerUrl').val()
            let imgUrl = $('#editMovieImageUrl').val()
            let rating = $('#editMovieRating').val()
            let genreId = $('#editgenreId').val()
            $.ajax({
                method: 'PUT',
                url: 'http://localhost:3000/movies/' + id,
                data: {title, synopsis, trailerUrl, imgUrl, rating, genreId},
                headers: {token: localStorage.getItem('token') }   
            })
            .done((data) => {
                console.log(data);
                showHome()
            })
            .fail((err) => {
                console.log(err);
            })
        })
    })
    .fail((err) => {
        console.log(err);
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/google-login',
        data: {
            idtoken: id_token
        }
    })
    .done((data) => {
        console.log(data);
        showHome()
        localStorage.setItem('token', data.access_token);
        fentchMovies()
    })
    .fail((err) => {
        console.log(err);
    })
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

$(document).ready(function(){
    if(localStorage.token){
        showHome()
        fentchMovies()
    }else{
        showLoginPage()
    }

    $('#login-form').submit(function(event){
        event.preventDefault()
        let email = $('#email-Login').val()
        let password = $('#password-Login').val()
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/login',
            data: { email, password }
        })
        .done((data) => {
            showHome()
            localStorage.setItem('token', data.token);
            fentchMovies()
            console.log(data);
        })
        .fail((err) => {
            console.log(err);
        })
    })

    $('#navHome').click(function(event){
        event.preventDefault()
        showHome()
        fentchMovies()
    })

    $('#navAddMovie').click(function(event){
        event.preventDefault()
        showAddMovie()

    })

    $('#navLogout').click(function(event){
        event.preventDefault()
        localStorage.removeItem('token')
        showLoginPage()
        $('#login-form-page').show();
    })

    $('#navRegister').click(function(event){
        event.preventDefault()
        showRegister()
    })

    $('#addMovieForm').submit(function(event){
        event.preventDefault()
        let title = $('#MovieTitle').val();
        let synopsis = $('#MovieSynopsis').val();
        let trailerUrl = $('#MovieTrailerUrl').val();
        let imgUrl = $('#MovieImageUrl').val();
        let rating = $('#MovieRating').val();
        let genreId = $('#genreId').val();
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/movies',
            data: { title, synopsis, trailerUrl, imgUrl, rating, genreId },
            headers: {token: localStorage.getItem('token') }   
        })
        .done((data) => {
            console.log(data);
            showHome()
        })
        .fail((err) => {
            console.log(err);
        })
    })
    
    $('#navLogin').click(function(event){
        event.preventDefault()
        showLoginPage()
    })

    $('#register-form').submit(function(event){
        event.preventDefault()
        let password = $('#password-register').val();
        let email = $('#email-register').val();
        console.log(email, password);
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/register',
            data: {password, email}
        })
        .done((data) => {
            showLoginPage()
            console.log(data);
        })
        .fail((err) => {
            console.log(err);
        })
    })
})
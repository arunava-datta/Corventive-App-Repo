jQuery(document).ready(function($){
	var formModal = $('.cd-user-modal'),
		formLogin = formModal.find('#cd-login'),
		formSignup = formModal.find('#cd-signup'),
		formForgotPassword = formModal.find('#cd-reset-password'),
		formModalTab = $('.cd-switcher'),
		tabLogin = formModalTab.children('li').eq(0).children('a'),
		tabSignup = formModalTab.children('li').eq(1).children('a'),
		forgotPasswordLink = formLogin.find('.cd-form-bottom-message a'),
		backToLoginLink = formForgotPassword.find('.cd-form-bottom-message a'),
		mainNav = $('.navbar-collapse');
	var user = null;
	var profileDropdown = $('.dropdown-menu');

	//open modal
	mainNav.on('click', function(event){
		$(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
		//alert('hi...huku');
	});

	//open sign-up form
	mainNav.on('click', '.cd-signup', signup_selected);
	//open login-form form
	mainNav.on('click', '.cd-signin', login_selected);
	
	//open profile dropdown
	mainNav.on('click', '.cd-profile', show_profile);

	//close modal
	formModal.on('click', function(event){
		if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
			formModal.removeClass('is-visible');
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		formModal.removeClass('is-visible');
	    }
    });

	//switch from a tab to another
	formModalTab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( tabLogin ) ) ? login_selected() : signup_selected();
	});

	//hide or show password
	$('.hide-password').on('click', function(){
		var togglePass= $(this),
			passwordField = togglePass.prev('input');
		
		( 'password' == passwordField.attr('type') ) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
		( 'Hide' == togglePass.text() ) ? togglePass.text('Show') : togglePass.text('Hide');
		//focus and move cursor to the end of input field
		passwordField.putCursorAtEnd();
	});

	//show forgot-password form 
	forgotPasswordLink.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	backToLoginLink.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.addClass('is-selected');
		formSignup.removeClass('is-selected');
		formForgotPassword.removeClass('is-selected');
		tabLogin.addClass('selected');
		tabSignup.removeClass('selected');
	}

	function signup_selected(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.removeClass('is-selected');
		formSignup.addClass('is-selected');
		formForgotPassword.removeClass('is-selected');
		tabLogin.removeClass('selected');
		tabSignup.addClass('selected');
	}

	function forgot_password_selected(){
		formLogin.removeClass('is-selected');
		formSignup.removeClass('is-selected');
		formForgotPassword.addClass('is-selected');
	}
	
	function show_profile(){
//		mainNav.children('ul').removeClass('is-visible');
//		formModal.addClass('is-visible');
//		formLogin.addClass('is-selected');
//		formSignup.removeClass('is-selected');
//		formForgotPassword.removeClass('is-selected');
//		tabLogin.addClass('selected');
//		tabSignup.removeClass('selected');
		
		//alert('Show profile menu...');
		profileDropdown.addClass('is-visible');
		profileDropdown.addClass('is-selected');
	}

	
	formLogin.find('input[type="submit"]').on('click', function(event){
		//alert('Got it.....');
		event.preventDefault();
		$.ajax({
			url: "login",
			type: "POST",
			data: $("#loginForm").serialize(),
			success: function(data){
				//alert(data);
				if(data == "failed") {
					alert("Invalid username / password.");
				} else if(data == "in-approval") {
					alert("Your registration approval is pending. Please try after sometime.");
				} else {
					user = JSON.parse(data);
					//alert("Successfully Logged In as " + User.username);
					formModal.removeClass('is-visible');
					$("#welcome-user").html("Welcome " + user.username)
					$(".cd-signin").hide();
					$(".dropdown").show();
					
				}
				
				
				

			},
			error: function(httpObj, textStatus){
				alert("Unable to process the request: : " + textStatus);
			}
			
	    });
	});
	
	
	
	
	formSignup.find('input[type="submit"]').on('click', function(event){
		//alert('Got it.....Signup Form');
		event.preventDefault();
		$.ajax({
			url: "signup",
			type: "POST",
			data: $("#signUpForm").serialize(),
			success: function(data){
				//alert(data);
				if(data == 'success') {
					alert('Thank you for registering. We have sent it for approval.');
				}
				//User = JSON.parse(data);
				//alert("Successfully Logged In as " + User.username);
				formModal.removeClass('is-visible');
				//$(".cd-signin").hide();
				//$(".dropdown").show();

			},
			error: function(httpObj, textStatus){
				alert("Unable to process the request: : " + textStatus);
			}
			
	    });
	});
	
		
//		formLogin.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	//});
//	formSignup.find('input[type="submit"]').on('click', function(event){
//		event.preventDefault();
//		formSignup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
//	});


	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

});


jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.focus();
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};

$('.dropdown').on('show.bs.dropdown', function () {
	  //alert('droped it...');
	  $('.dropdown-menu').show();
})

$('.dropdown').on('hide.bs.dropdown', function () {
	  //alert('droped it...');
	  $('.dropdown-menu').hide();
})



//logout
$('.cd-logout').on('click', function(event){
	$.ajax({
		url: "logout",
		type: "POST",
		success: function(data){
			//alert(data);
			//alert("Successfully Logged In as " + User.username);
			$(".cd-signin").show();
			$(".dropdown").hide();

		},
		error: function(httpObj, textStatus){
			alert("Unable to process the request: : " + textStatus);
		}
		
    });
});
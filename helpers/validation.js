'use strict';

  module.exports = function(formidable, path) {
    return {
      getSignInValidation: (req, res, next) => {
        
        req.checkBody('email', 'Email is Invalid').isEmail();
        req.checkBody('email', 'Email must not be empty').notEmpty();
        req.checkBody('password', 'Password must not be empty').notEmpty();
        req.checkBody('password', 'Password must be 8 or more characters longer').isLength({min : 8});           

        req.getValidationResult().then((result) => {
          
          var errors = result.array();
          var messages = [];
          errors.forEach((error) => {
            messages.push(error.msg);
          });
		
          if(messages.length > 0) {
            req.flash('errors', messages);
            res.redirect('/signin');
          }
          else {
            return next();
          }
        }).catch((err) => {
          throw err;
        })
      },

      getSignupValidation : function(req, res, next) {
      
        req.checkBody('first_name', 'First name is required').notEmpty();
	      req.checkBody('last_name', 'Last name is required').notEmpty();
        req.checkBody('email', 'Email is Invalid').isEmail();
        req.checkBody('email', 'Email must not be empty').notEmpty();
        req.checkBody('password', 'Password must not be empty').notEmpty();
        req.checkBody('password', 'Password must be 8 or more characters longer').isLength({min : 8});
            
	      
	      req.getValidationResult().then( (result) => {
	        var errors = result.array();
          var messages = [];
          errors.forEach(function(error){
            messages.push(error.msg);
          });

          if(messages.length > 0) {
             req.flash('errors', messages);
             res.redirect('/signup');
          }
          else {
            next();
          }
        }).catch( (err) => {
          if(err) 
            throw err;
        });
      },



      addCaseValidation : function(req, res, next) {
      
        req.checkBody('case_number', 'Case number is required').notEmpty();
	      req.checkBody('case_type', 'Case Type is required').notEmpty();
        req.checkBody('client_city', 'CLient City is Invalid').notEmpty();
        req.checkBody('client_name', 'Name must not be empty').notEmpty();
        req.checkBody('cnic', 'CNIC must not be empty').notEmpty();
        
            
	      
	      req.getValidationResult().then( (result) => {
	        var errors = result.array();
          var messages = [];
          errors.forEach(function(error){
            messages.push(error.msg);
          });

          if(messages.length > 0) {
            
             req.flash('errors', messages);
             res.redirect('/cases');
          }
          else {
            next();
          }
        }).catch( (err) => {
          if(err) 
            throw err;
        });
      },



//lawyer profile validation

      getProfileUpdateValidation: function(req, res, next) {
        
        req.checkBody('first_name', 'First name is required').notEmpty();
	      req.checkBody('last_name', 'Last name is required').notEmpty();
        req.checkBody('email', 'Email is Invalid').isEmail();
        req.checkBody('email', 'Email must not be empty').notEmpty();
        req.checkBody('cnic', 'CNIC must not be empty').notEmpty();
        req.checkBody('address', 'Address must not be empty').notEmpty();
            
	      
	      req.getValidationResult().then( (result) => {
	        var errors = result.array();
          var messages = [];
          errors.forEach(function(error){
            messages.push(error.msg);
          });

          if(req.body.city == '-1') {
            messages.push("Please select city");
          }
          if(messages.length > 0) {
             req.flash('errors', messages);
             res.redirect('/profile');
          }
          else {
            next();
          }
        }).catch( (err) => {
          if(err) 
            throw err;
        });
      },

    //user dashboard validation
    
    dashboardValidation: function(req, res, next) {
        
      req.checkBody('full_name', 'Full name is required').notEmpty();
      req.checkBody('father_name', 'Father name is required').notEmpty();
      
      req.checkBody('email', 'Email must not be empty').notEmpty();
      req.checkBody('contact_number', 'Contact Number must not be empty').notEmpty();
     
      req.checkBody('case_type', 'Case Type is required').notEmpty(); 
      
      req.getValidationResult().then( (result) => {
        var errors = result.array();
        var messages = [];
        errors.forEach(function(error){
          messages.push(error.msg);
        });

        if(req.body.city == '-1') {
          messages.push("Please select city");
        }
        if(messages.length > 0) {
           req.flash('errors', messages);
           res.redirect('/dashboard');
        }
        else {
          next();
        }
      }).catch( (err) => {
        if(err) 
          throw err;
      });
    },


      resetPassword : function(req, res, next) {
        req.checkBody('password', 'Password must not be empty').notEmpty();
        req.checkBody('confirm_password', 'Password must not be empty').notEmpty();
        req.checkBody('password', 'Password must be 6 or more characters longer').isLength({min: 8});
        req.checkBody('confirm_password', 'Confirm Password must be 6 or more characters longer').notEmpty({min: 8});
            
        req.getValidationResult().then((result) => {
          var errors = result.array();
          var messages = [];
          errors.forEach((error) => {
            messages.push(error.msg);
          });
	
	    if(req.body.password != req.body.confirm_password) {
	    messages.push("Password does not match");
	  }
					
          if(messages.length > 0) {
	    messages = messages.map((str, index) => ({ name: str}));
            res.render("reset_password", {hasErrors : true, messages : messages, user: req.body.user});
          }
          else {
            next();
          }
        }).catch((err) => {
          throw err;
        })
      }
    }
  }

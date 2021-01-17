'use strict';

var {authenticate} = require('../middleware/authenticate');

module.exports = function(passport, validation, email, User, Lawyer, CaseRequest,Blog,NewsPost) {
  return {
                            setRouting : function(router) {                              
                              router.get('/', this.homePage);
       //about
                              router.get('/about', this.about);

                              router.get('/user/post', this.userAddPostView);
                              router.post('/user/post', this.userAddPost);

                              router.post("/lawyer/comment", this.addComment);

        //services
                             router.get('/services', this.services);

 
         
           //blog
                             router.get('/blog', this.blog);

              //blog-details

                                          router.get('/blog_details', this.blog_details);

            //elements

                                       

            //case-details

                                          router.get('/cases_details', authenticate, this.cases_details);

         
        //contact

                            router.get('/contact', this.contact);

        //facebook

                              router.get('/auth/facebook', this.authFacebook);
          
                               router.get('/auth/facebook/callback', this.facebookLoginCallback);
      //blog Router
                //blog get route
                              router.get('/blog/view', this.blogView);
                //blog post route
                              router.get('/blog/Add',this.blogAdd);
                //Blog delete route
                              // router.delete('/blog/delete',this.blogDelete);
                //Blog Update Route
                              // router.patch('/blog/update',this.blogUpdate);             
     //profile get router

                            router.get('/profile', authenticate, this.profileView);


      //profile post router
               router.post('/profile', validation.getProfileUpdateValidation, this.profile);
      //profileUpdated post router
              // router.post('/profile/update',this.updateProfile);
      //delete case get router
                   router.get('/deletecase/:id', authenticate, this.deletecase);

                      

        //case studies

                        router.get('/cases',authenticate, this.cases);

        //Route client cases to lawyer
                              router.get('/client/case', authenticate, this.client_cases);

        // //userform get route

        //   router.get('/userform', this.userformView);

        // //userform post route

        //                   router.post('/userform', validation.userformValidation, this.userform);

        //route lawyer add cases
        router.get('/lawyer/cases/:lawyer_id', authenticate, this.lawyer_cases);
      //submit route
                                  router.post('/addcase',validation.addCaseValidation, this.addcase);

                          router.get('/auth/google', this.googleLoginRedirect);
                          router.get('/auth/google/callback', this.googleLoginCallback);
                          router.get('/login', this.loginView);
                          
                          router.get('/user/update-profile', authenticate, this.userProfileUpdate);  
                          router.get('/user/hire-a-lawyer', authenticate, this.hireALawyerView);
                          
                          router.post('/user/hire-a-lawyer', this.hireALawyer);

      //router.post('/login', validation.getLoginValidation, this.login);


      
      //lawyersignup get & post    route
      
      
                                router.get('/signup', this.lawyerSignupView);
                                router.post('/signup', validation.getSignupValidation, this.lawyerSignup);			
      
      //lawyersignin get& post router


                          router.get('/signin', this.lawyerSigninView);
                          router.post('/signin', validation.getSignInValidation, this.lawyerSignin);			
     

                                  router.get('/forgot_password', this.forgotPasswordView);
                                  router.post('/forgot_password', this.forgotPassword);
                                  router.get('/auth/reset/:token', this.verifyToken);
                                  
                              router.post('/reset_password', validation.resetPassword, this.resetPassword);

             //dashboard get route
                            router.get('/dashboard', authenticate, this.dashboardView);
                            router.get('/logout', this.logOut);

              // dashboard post route
                            router.post('/dashboard', validation.dashboardValidation, this.userdashboard);			
                          },

              
                   
                   
                 
                   
                   
                          homePage : function(req, res) {
                                          res.render("index.ejs");
                                        },
    //route of about


                              about : function(req, res){
                                res.render('about.ejs');
                              },

     //route of services


                                              services : function(req, res){
                                                res.render('services.ejs');
                                            },

                          //get route of cases define 


    cases : function(req, res){
      let lawyer = req.session.lawyer || {};
      let cases = [];
      Lawyer.findOne({_id: lawyer._id}, function(err, lawyer){
        if(err) throw err;
        else {
          cases = lawyer.cases;
          let errors = req.flash("errors");
          let success = req.flash("success");
          res.render("cases.ejs", {hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success, cases: cases, lawyer: lawyer});
        }
        
      })
    },

    userAddPostView: function(req, res) {
      let errors = req.flash('errors');
      let success = req.flash('success');
      
      return res.render('user-post.ejs', {user: req.user, hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success, user: req.user});
    },


    addComment: async function(req, res) {
      let post = await NewsPost.findOne({_id: req.body.post_id});

      if(post != null) {
        let comment = {comment: req.body.comment, lawyer: req.session.lawyer.first_name};
        post.comments.push(comment);

        await post.save();
      }

      return res.redirect('/profile');

    },

    userAddPost: async function(req, res) {
      let post = new NewsPost();

      post.post_title = req.body.post_title;
      post.post_description = req.body.post_description;
      post.createdBy = req.user;

      let response = await post.save();   

      if(response) {
        req.flash('success', ['Post has been created']);
        res.redirect('/user/post');
      }

    },

    userProfileUpdate: function(req, res) {
      let errors = req.flash('errors');
      let success = req.flash('success');


      return res.render("user-profile-update.ejs", {user: req.user, hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success, user: req.user});
    },

    hireALawyer: async function(req, res) {
      let lawyer = await Lawyer.find({ _id: req.body.lawyer_id });
      
      if(lawyer) {
        let case_request = new CaseRequest();

        case_request.lawyer_id = req.body.lawyer_id;
        case_request.user = req.user;
        case_request.case_type = req.body.case_type;
        case_request.case_city = req.body.case_city;

        case_request.save().then( (case_request) => {
          if(case_request) {
            req.flash("success", ['Case Request has been sent!']);
            return res.redirect('/user/hire-a-lawyer');
          }
        }).catch( (e) => {
          if(e) {
            req.flash("errors", ['Could not sent case request!']);
            return res.redirect('/user/hire-a-lawyer');
          }
        });
      }

      
    },

    hireALawyerView: async function(req, res) {
      let errors = req.flash('errors');
                let success = req.flash('success');

                console.log(success);

                // get all lawyers
                let lawyers  = await Lawyer.find({}).lean();

                res.render("hire-a-lawyer", {lawyers: lawyers, hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success, user: req.user});
    },
    //get route of lawyer add cases define
                lawyer_cases: async function(req,res){
                  let lawyer = await Lawyer.findOne({_id: req.params.lawyer_id});

                  if(lawyer) {
                    let cases = lawyer.cases;
                    return res.render("lawyer-cases", {cases: cases, hasErrors: false, hasSuccess: false});
                  }
                  
                },
    //get route of userform
    //route define of client case to lawyer
                client_cases: async function (req,res){
                  let errors = req.flash('errors');
                  let success = req.flash('success');

      
                  
                  let case_requests = await CaseRequest.find({lawyer_id: req.session.lawyer._id}).populate('user').exec();
                  return res.render("case_request", {case_requests: case_requests, hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success});
                  
                },

    // userformView : function(req, res){
                                
    //   Lawyer.find({}, function(err, lawyers){
    //     if(lawyers) {

    //       let user = req.session.user;
    //       let errors = req.flash('errors');
    //       let success = req.flash('success');
    //       form.ejs", {hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success, user: user, lawyers: lawyers});
     
    //     }
    //   });

      

    //                     },

    // //post route of userform

    //                       userform : function(req, res){


                                 
    //                         User.findOneAndUpdate(
    //                           {_id: req.user._id},
    //                           {$push : {userform: {
    //                              lawyer: req.body.lawyer_id,
    //                             client_name:req.body.client_name,
    //                             cnic:req.body.cnic,
    //                             case_type:req.body.case_type,
    //                             client_city:req.body.client_city,
    //                           }}}
    //                           , function (savedUser) {
    //                             console.log(savedUser);
    //                             if(!savedUser) {
    //                               req.flash('success', ['Your case has been added']);
    //                               res.redirect('/userform');
    //                             }
                             
    //                         });

    //                       },

    //post route of cases define 

                                       addcase : function(req, res){


                                       
                                          Lawyer.findOneAndUpdate(
                                            {_id: req.session.lawyer._id},
                                            {$push : {cases: {
                                              client_name:req.body.client_name, 
                                              case_number:req.body.case_number,
                                              cnic:req.body.cnic,
                                              case_type:req.body.case_type,
                                              client_city:req.body.client_city,
                                            }}}
                                            , function (savedLawyer) {
                                              console.log(savedLawyer);
                                              //req.session.lawyer = savedLawyer;
                                            req.flash('success', ['Your case has been added']);
                                            res.redirect('/cases');
                                          });

                                        },

                                        


             //route of deletecase


                              deletecase : function(req, res){
                                Lawyer.findOne({
                                  _id: req.session.lawyer._id
                                }, function(error, lawyer) {
                                  if(error) throw error;

                                  console.log(req.params.id);
                                  lawyer.cases.splice(req.param.id + 1, 1);

                                  lawyer.save( (savedLawyer) => {
                                    req.flash('success', ["Case deleted successfully!"]);
                                    res.redirect('/cases');
                                  });
                                })
                              },



                    
    //get route of admin 


                          
    //Get route of signup 

                              lawyerSignupView : function(req, res){
                                  let errors = req.flash('errors');
                                  console.log(errors);
                                  res.render("signup", {hasErrors: errors.length > 0, errors: errors});
                                },

//Post route of signup define
                                lawyerSignup: function(req, res) {
                                  let lawyer = new Lawyer();
                                  
                                  lawyer.first_name = req.body.first_name;
                                  lawyer.last_name = req.body.last_name;
                                  lawyer.email = req.body.email;
                                  
                                  lawyer.password = lawyer.encryptPassword(req.body.password);
                                  
                                  lawyer.cnic = req.body.cnic;
                                  lawyer.contact_number = req.body.contact_number;

                                  lawyer.save().then( savedLawyer => {
                                    if(savedLawyer) {
                                      res.redirect('/signin');
                                    }
                                  }).catch( e => {
                                    console.log(e);
                                  });
                                },

                  //Get profile route define

                                   profileView : async function(req, res){
                                      let lawyer = req.session.lawyer;
                                      let posts = await NewsPost.find({}).populate('createdBy'); 

                                      let errors = req.flash('errors');
                                      let success = req.flash('success');
                                      res.render("profile.ejs", {posts: posts, hasErrors: errors.length > 0, errors: errors, hasSuccess: success.length > 0, messages: success, lawyer: lawyer});
                                    },
  
          
         //post profile update route define 

                                    profile: function(req, res) {
                                      Lawyer.findOneAndUpdate(
                                        {_id: req.session.lawyer._id},
                                        {
                                          first_name:req.body.first_name, 
                                          last_name:req.body.last_name,
                                          cnic:req.body.cnic,
                                          contact_number:req.body.contact_number,
                                          email:req.body.email,
                                          address:req.body.address,
                                          specialization:req.body.specialization,
                                          city:req.body.city,
                                        }, function (savedLawyer) {
                                        req.flash('success', ['Your profile has been updated']);
                                        res.redirect('/profile');
                                      })
                                    }, 
    // //post updateProfile route define
                                    updateProfile: function(req,res){
                                      console.log(req.body);
                                      // req.flash('success', ['Your profile has been updated']);
                                      // res.redirect('/');
                                    },
    
                                    //lawyersignin route define


                                  lawyerSigninView : function(req, res){
                                    let errors = req.flash('errors');
                                    res.render("signin", {hasErrors: errors.length > 0, errors: errors});
                                  },
                                  lawyerSignin: function(req, res) {
                                    Lawyer.findOne({
                                      email: req.body.email
                                    }, function(err, lawyer) {
                                      if(!lawyer || !lawyer.comparePassword(req.body.password)) {
                                        req.flash('errors', ['Invalid credentials']);
                                        return res.redirect('/signin');
                                    }
                                      req.session.lawyer = lawyer;
                                      //console.log(req.session.lawyer);
                                      res.redirect('/profile');
                                    })
                                  },


              //route dashboard


              dashboardView : async function(req, res){
                console.log(req.user);
                return res.render("userform.ejs", {user: req.user});
              },

              //post route dashboard


              userdashboard: function(req, res) {
                
                req.user.fullname = req.body.full_name;
                req.user.father_name = req.body.father_name;
                req.user.email = req.body.email;
                req.user.contact_number = req.body.contact_number;
                console.log(req.body.case_type);
                req.user.cases.push(req.body.case_type);

                req.user.save().then( savedUser => {
                  if(savedUser) {
                    req.flash('success', ['Info. added successfully!']);
                    res.redirect('/user/update-profile');
                  }
                }).catch( e => {
                  console.log(e);
                });
              },


         //route of blog


                                          blog : function(req, res){
                                            res.render('blog.ejs');
                                      },
          //Blog get route define
                      blogView :  async function(req,res) {
                        const blogs = Blog.find({});
                        const message = req.flash('success'['blog pages renders']);
                        res.render('blog_add.ejs',{blogs:blogs,hasmessage:message.length>0,message:message[0]});
                      },
          // //Blog post(ADD) route define
                      blogAdd : function(req,res) {

                        const blog = new Blog({
                          _id : new mongoose.Types.ObjectId(),
                        blogimage : req.body.blogimage,
                        title : req.body.title,
                        description : req.body.description,
                        tag : req.body.tag
                      });
                        blog.save().then(blogSaved =>{
                          if(blogSaved){
                            req.flash("sucess"["Info! Blog Added Successfully"])
                            res.redirect('blog_add.ejs',);
                          }
                        }).catch(err=>{
                          console.log(err)
                        });
                      },
          // //Blog Delete route define
          //             BlogDelete : async function(req,res) {
          //                 let blogId = req.params.blog_id;   
          //               Blog.Remove( {_id: blog_id},function(err) {
          //                 if(!err){
          //                   req.flash(message,["User has been removed"]);
          //                 }if(err){
          //                   req.flash(message,['Blg has not been deleted of id: ',]);
          //                 }
          //               return res.redirect('/.ejs')
          //               })         
          //             },
          // //Blog Update route define
          //             blogUpdate : function(req,res) {
                                    
          //             },
          //route of blog_details


                                                        blog_details : function(req, res){
                                                          res.render('blog_details.ejs');
                                                        },


    //route of elements

                              elements : function(req, res){
                                res.render('elements.ejs');
                              },


    //route of case-details


                                              cases_details : function(req, res){
                                                res.render('cases_details.ejs');
                                              },


        
    
     //route of contact

                                                            contact : function(req, res){
                                                              res.render('contact.ejs');
                                                        },
   

      //route of facebook


                                authFacebook : passport.authenticate('facebook', {
                                  scope : 'email'  
                              }),

    
     

                            facebookLoginCallback : passport.authenticate('facebook', {
                            successRedirect: '/dashboard',
                            failureRedirect : '/'
                        }),

  
                    loginView : function(req, res) {
                      let messages = req.flash('error');
                      messages = messages.map((str, index) => ({ name: str}));
                      res.render("login", {hasErrors : (messages.length > 0) ? true : false, messages : messages});
                    },


                        login : passport.authenticate('local.login', {
                          successRedirect : '/dashboard',
                          failureRedirect : '/login',
                          failureFlash : true
                        }),

                          signUpView : function(req, res) {
                            let messages = req.flash('error');
                            messages = messages.map((str, index) => ({ name: str}));
                            res.render('signup', { hasErrors: (messages.length > 0) ? true : false, messages: messages});
                          },
    
                          signUp : passport.authenticate('local.signup', {
                            successRedirect : '/login',
                            failureRedirect : '/signup',
                            failureFlash : true
                          }),
		
                        googleLoginRedirect : passport.authenticate('google', {
                          scope: ['email', 'profile']
                        }),
                      
                        googleLoginCallback : passport.authenticate('google', {
                          successRedirect: '/dashboard',
                          failureRedirect : '/login'
                        }),
                        
                        forgotPasswordView: function(req, res) {
                          let messages = req.flash('error');
                          messages = messages.map((str, index) => ({ name: str}));
                          res.render("forgot_password", {hasErrors : (messages.length > 0) ? true : false,hasSuccess: false, messages : messages});
                        },
                        
                        forgotPassword: function(req, res) {
                          User.findOne({email: req.body.email}).then(function(user){
                            if(!user) {
                        req.flash('error', ['User with this email does not exist']);
                        res.redirect('/forgot_password');
                      }
                      else if(user) {
                        user.generatePasswordReset();
                        user.save().then(function(savedUser) {
                          let link = "http://" + req.headers.host + "/auth/reset/" + savedUser.resetPasswordToken;
                                
                                let mailSender = new email.MailSender();
                                const mailOptions = {
                            from: 'rajivkumar.mel@gmail.com',
                            to: savedUser.email,
                            subject: "ICrowd Web Application",
                            text: `Hi ${user.fullname} \n Please click on the following link ${link} to reset your password. \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
                          };
                                
                                mailSender.sendMail(mailOptions, function(error, info){
                            if(info) {
                                    res.render("forgot_password", {hasErrors: false, hasSuccess: true, messages: [{name:'Reset link sent successfully. Check your email'}]});
                            }
                            if(error) {
                              console.log(error);
                            }
                      });
                    });
                  }
                              else {}
                                  })
                         },
		
                            verifyToken: function(req, res) {
                              User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}).then(function(user) {
                                if(!user) {
                            res.render('error404');
                          }
                          else if(user) {
                            res.render("reset_password", {user: user._id, hasErrors: false});
                          }
                          else {
                          }
                              });
                            },
                            
                            resetPassword: function(req, res){
                              User.findOne({_id: req.body.user}).then(function(user) {
                          user.password = user.encryptPassword(req.body.password);
                          user.resetPasswordToken = '';
                          user.resetPasswordExpires = '';
                                
                          user.save().then( (savedUser) => {
                            res.redirect('/login');
                                });
                              }).catch(function(err) {
                                res.render("error404");
                              });
                            },
                            
                            dashboard: function(req, res) {
                              res.render("dashboard.ejs", {user: req.user});
                            },	    
                            
                            logOut: function (req, res) {
                              req.logout();
                              req.session.destroy((err) => {
                              res.clearCookie('connect.sid', { path: '/' });
                                res.redirect('/');
                              });
                            },
                          }
                        }

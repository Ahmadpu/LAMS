module.exports = function (Lawyer, User) {
    return {
        setRouting: function(router) {
            router.get('/admin', this.adminView);

            router.get('/admin/lawyer-list', this.getRegisteredLawyersList);
            router.get('/admin/delete-lawyer/:lawyer_id', this.deleteLawyerById);
            //User Admin_Role
            router.get('/admin/user-list', this.getRegisteredUsersList);
            router.get('/admin/delete-user/:user_id', this.deleteUserById);
        },

        adminView: function (req, res) {
            return res.render("admin/admin.ejs");
        },

        getRegisteredLawyersList: async function (req, res) {
            const lawyers = await Lawyer.find({});
            const message = req.flash('message');

            console.log(message);

            res.render("admin/lawyer-list.ejs", {lawyers: lawyers, hasMessage: message.length > 0, message: message[0]}); 
        },
        deleteLawyerById: async function (req, res) {
            let lawyer_id = req.params.lawyer_id;
            
            Lawyer.remove({ _id: lawyer_id }, function(err) {
                if (!err) {
                    req.flash('message', ['Lawyer has been removed']);
                }
                else if(err) {
                    req.flash('message', ['Lawyer can not be deleted']);
                }
                else {
                    
                }

                return res.redirect('/admin/lawyer-list');
            });
            
        },

       

        getRegisteredUsersList: async function (req, res) {
            const users = await User.find({});
            const message = req.flash('message');

            console.log(message);

            res.render("admin/user-list.ejs", {users: users, hasMessage: message.length > 0, message: message[0]}); 
        },
        deleteUserById: async function (req, res) {
            let user_id = req.params.user_id;
            
            User.remove({ _id: user_id }, function(err) {
                if (!err) {
                    req.flash('message', ['User has been removed']);
                }
                else if(err) {
                    req.flash('message', ['User can not be deleted']);
                }
                else {
                    
                }

                return res.redirect('/admin/user-list');
            });
            
        }
        
    }
}
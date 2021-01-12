var authenticate = (req, res, next) => {
    if(req.user || req.session.lawyer) {
        next();
    }
    else {
        res.redirect('/');  
    }
  };
  
  module.exports = {authenticate};
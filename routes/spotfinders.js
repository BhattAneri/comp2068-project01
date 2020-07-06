const { index, show, new: _new, edit, create, update, delete: _delete } = require('../controllers/SpotfindersController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  // put your routes here
    router.get('/spotfinders', index); // public
    router.get('/spotfinders/new', auth, _new); // authenticated
    router.post('/spotfinders', auth, create);  // authenticated
    router.post('/spotfinders/update', auth, update);  // authenticated
    router.post('/spotfinders/delete', auth, _delete);  // authenticated
    router.get('/spotfinders/:id/edit', auth, edit);  // authenticated
    router.get('/spotfinders/:id', show); // public
  };
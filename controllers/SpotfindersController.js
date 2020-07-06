// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/
// You need to complete this controller with the required 7 actions
const viewPath = 'spotfinders';
const Spotfinder = require('../models/spotfinder');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const spotfinders = await Spotfinder
      .find({user: user._id})
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Find Your Saved Vacation Spot here!',
      spotfinders: spotfinders
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying vacation spots: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const spotfinder = await Spotfinder.findById(req.params.id)
      .populate('user');
    console.log(spotfinder);
    res.render(`${viewPath}/show`, {
      pageTitle: spotfinder.title,
     spotfinder: spotfinder
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying your saved vacation spots: ${error}`);
    res.redirect('/');
  }
};

const destinations = [
    'Cuba',
    'Bahamas',
    'Miami',
    'Costa Rica',
    'Bora Bora Islands',
    'Santorini',
    'Banff',
    'Caribbean',
    'Phuket',
    'Las Vegas',
    'Bali',
    'Machu Picchu'
  ];
exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Vacation Spot',
    destinations : destinations
  });
};

exports.create = async (req, res) => {
  try {
    console.log(req.session.passport);
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const spotfinder = await Spotfinder.create({user: user._id, ...req.body});

    req.flash('success', 'Your vacation destination is successfully saved');
    res.redirect(`/spotfinders/${spotfinder.id}`);
  } catch (error) {
    req.flash('danger', `There was an error saving your destination: ${error}`);
    req.session.formData = req.body;
    res.redirect('/spotfinders/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const spotfinder = await Spotfinder.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: spotfinder.title,
      formData: spotfinder,
     destinations: destinations
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing your saved destinations: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let spotfinder = await Spotfinder.findById(req.body.id);
    if (!spotfinder) throw new Error('Your saved destination could not be found');

    const attributes = {user: user._id, ...req.body};
    await Spotfinder.validate(attributes);
    await Spotfinder.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'Your destination was updated successfully, Have a Happy Vacation :)');
    res.redirect(`/spotfinders/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating your vacation spot: ${error}`);
    res.redirect(`/spotfinders/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await Spotfinder.deleteOne({_id: req.body.id});
    req.flash('success', 'The vacation spot was deleted successfully');
    res.redirect(`/spotfinders`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this vacation destination spot: ${error}`);
    res.redirect(`/spotfinders`);
  }
};
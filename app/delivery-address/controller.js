const DeliveryAddress = require("./model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");
const errorHandler = require("errorhandler");

//Create POST
async function store(req, res, next) {
  let policy = policyFor(req.user);
  if (!policy.can("create", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }
  try {
    let payload = req.body;
    let user = req.user;

    let address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

//Update PUT
async function update(req, res, next) {
  let policy = policyFor(req.user);
  try {
    let { id } = req.params;
    let { _id, ...payload } = req.body;
    let address = await DeliveryAddress.findOne({ _id: id });
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to modify this resource`,
      });
    }
    address = await DeliveryAddress.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    return res.json(address);
  } catch (error) {
    return res.json({
      error: 1,
      message: error.message,
      fields: error.errors,
    });
    next(error);
  }
}

//Delete
async function destroy(req, res, next) {
  let policy = policyFor(req.user);
  try {
    let { id } = req.params;
    let address = await DeliveryAddress.findOne({ _id: id });
    let subjectAddress = subject({ ...address, user: address.user });
    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: `you're not allowed to delete this resource`,
      });
    }
    await DeliveryAddress.findOneAndDelete({ _id: id });
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidasiError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

//Get
async function index(req, res, next) {
  const policy = policyFor(req.user);
  if (!policy.can("view", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `you're not allowed to perform this action`,
    });
  }
  try {
    let { limit = 10, skip = 0 } = req.query;
    const count = await DeliveryAddress.find({
      user: req.user._id,
    }).countDocuments();
    const DeliveryAddresses = await DeliveryAddress.find({ user: req.user._id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort("-createdAt");
    return res.json({ data: DeliveryAddresses, count: count });
  } catch (error) {
    if (error && error.name === "ValidasiError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}
module.exports = { store, update, destroy, index };

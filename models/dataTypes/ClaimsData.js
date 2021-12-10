module.exports = {
  essential: {
    type: Boolean,
  },
  iss: [{
    did: {
      type: String,
    },
    url: {
      type: String,
    },
  }],
  reason: {
    type: String,
    required: true,
  },
};

const toDTO = user => ({
	_id: user._id,
	name: user.name,
	createdOn: user.createdOn,
	types: user.types
});

module.exports = {
	toDTO
};

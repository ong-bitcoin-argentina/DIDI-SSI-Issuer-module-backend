const toDTO = user => ({
	_id: user._id,
	name: user.name,
	type: user.type,
	createdOn: user.createdOn
});

module.exports = {
	toDTO
};

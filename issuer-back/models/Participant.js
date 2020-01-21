const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const dataElement = {
	name: {
		type: String,
		required: true
	},
	value: {
		type: String,
		required: true
	}
};

const ParticipantSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	data: [dataElement],
	templateId: String,
	new: {
		type: Boolean,
		default: true
	},
	deleted: {
		type: Boolean,
		default: false
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

ParticipantSchema.index({ name: 1, templateId: 1, deleted: 1 });

ParticipantSchema.methods.mergeData = function(other) {
	const acum = {};
	this.data.forEach(elem => {
		acum[elem.name] = elem.value;
	});
	other.data.forEach(elem => {
		acum[elem.name] = elem.value;
	});

	const result = [];
	for (let key of Object.keys(acum)) {
		result.push({ name: key, value: acum[key] });
	}

	this.data = result;
};

ParticipantSchema.methods.edit = async function(name, data) {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: {
			name: name,
			data: data
		}
	};
	try {
		const participant = await Participant.findOneAndUpdate(updateQuery, updateAction);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

ParticipantSchema.methods.delete = async function() {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await Participant.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

const Participant = mongoose.model("Participant", ParticipantSchema);
module.exports = Participant;

Participant.generate = async function(name, data, templateId, newPart) {
	let participant;
	try {
		const query = { name: name, templateId: templateId, deleted: false };
		participant = await Participant.findOne(query);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}

	if (!participant) {
		participant = new Participant();
		participant.new = newPart;
		participant.name = name;
		participant.templateId = templateId;
		participant.data = data;
		participant.createdOn = new Date();
		participant.deleted = false;
	} else {
		participant.mergeData(data);
		participant.new = newPart;
	}

	try {
		participant = await participant.save();
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Participant.getNewByTemplateId = async function(templateId) {
	try {
		const query = { templateId: ObjectId(templateId), new: true, deleted: false };
		const participant = await Participant.find(query);
		if (participant.length) {
			const updateQuery = { _id: participant[0]._id };
			const updateAction = {
				$set: { new: false }
			};
			await Participant.findOneAndUpdate(updateQuery, updateAction);
			return Promise.resolve(participant[0]);
		} else {
			return Promise.resolve(undefined);
		}
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Participant.getAllByTemplateId = async function(templateId) {
	try {
		const query = { templateId: ObjectId(templateId), deleted: false };
		const participants = await Participant.find(query);
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Participant.getByDid = async function(did) {
	try {
		const query = { "data.0.value": did, deleted: false };
		const participants = await Participant.find(query);
		if (participants.length == 0) return Promise.resolve([]);

		if (participants.length == 1) return Promise.resolve(participants[0]);

		let result = participants[0];
		for (let i = 1; i < participants.length; i++) result.mergeData(participants[i]);

		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Participant.getById = async function(id) {
	try {
		const query = { _id: ObjectId(id), deleted: false };
		const participant = await Participant.findOne(query);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Participant.getGlobalParticipants = async function() {
	try {
		const query = { templateId: { $exists: false }, deleted: false };
		const participants = await Participant.find(query);
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

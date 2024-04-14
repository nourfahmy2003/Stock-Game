import validator from 'validator';
// import { isAlphanumeric, isEmail, isMobilePhone } from 'validator';

let _validate_name = (name) => {
	return new Promise((resolve, reject) => {
		name = name.split(' ').join(''); //Removing blanks
		let is_valid = validator.isAlphanumeric(name);
		if (is_valid){
			resolve('The name is valid.');
		} else {
			reject('The name is invalid.');
		}
	});
};

let _validate_email = (email) => {
	return new Promise((resolve, reject) => {
		let is_valid = validator.isEmail(email);
		if (is_valid){
			resolve('The email is valid.');
		} else {
			reject('The email is invalid.');
		}
	});
};

export function validate_fields(name) {
	return Promise.all([_validate_name(name)])
		.then((values) => {
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
}

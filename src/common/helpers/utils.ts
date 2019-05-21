import { EnvironmentService } from '../../environment.variables';


/**
 * Defines if the provided parameter is an empty object {} or not
 */
function isEmptyObject(value) {
    for(var key in value) {
        if(value.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function getMethodColor(method) {
	let color;
	switch(method) {
		case 'POST':
			color = 'yellow';
		break;
		case 'GET':
			color = 'green';
		break;
		case 'PUT':
			color = 'blue';
		break;
		case 'PATCH':
			color = 'gray';
		break;
		case 'DEL':
			color = 'red';
		break;
	}
	return color;
}

function getAllowedDatabases() {
	const environment = new EnvironmentService('.env');
	const allowedDbs = environment.get('DBS').split(',');
	return allowedDbs;
}

function getOrigin(url) {
	const newURL = new URL(url);
	return newURL.host;
}

function getDatabaseFromOrigin(origin) {
	if (origin) {
		const uppercasedSubdomain = origin.split('.')[0].toUpperCase();
		const subdomainDB = uppercasedSubdomain.substring(0, 3);
		const allowedDbs = getAllowedDatabases();
		const isValidSubdomain = allowedDbs.includes(subdomainDB);
		console.log(allowedDbs);
		console.log(isValidSubdomain);
		if (isValidSubdomain) return subdomainDB;
		else return 'AMS';
		return subdomainDB;		
	} else {
		return 'AMS';
	}
};


export {
	isEmptyObject,
	getMethodColor,
	getOrigin,
	getDatabaseFromOrigin
}


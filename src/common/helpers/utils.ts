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

export {
	isEmptyObject
}


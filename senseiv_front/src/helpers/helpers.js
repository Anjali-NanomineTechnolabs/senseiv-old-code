export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const arrayPluck = (array, key) => {
    return array.map(item => item[key])
}

export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleString(undefined, options);
}

export const authUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {};
}
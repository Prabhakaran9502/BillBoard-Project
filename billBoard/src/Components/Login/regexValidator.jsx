
export const emailValidator = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(email);
}

export const passwordValidator = password => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
    return passwordRegex.test(password);
}

export const emailRegValidator = regEmail => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(regEmail);
}

export const passwordRegValidator = regPassword => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
    return passwordRegex.test(regPassword);
}

export const nameRegValidator = regNname => {
    const nameRegx = /^[a-zA-Z\\s]*.{4,16}$/;
    return nameRegx.test(regNname);
}

export const nameValidator = Name => {
    const nameRegx = /^[a-zA-Z\\s]*.{4,16}$/;
    return nameRegx.test(Name);
}

export const passwordUpdateValidator = Password => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
    return passwordRegex.test(Password);
}
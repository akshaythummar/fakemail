import { generate } from 'random-words';

export const getRandomMail = (isNew: boolean = false) => {
    const domain = '@teraboxplay.info';
    if (!isNew) {
        const receivingEmail = window?.localStorage.getItem('receivingEmail');
        if (receivingEmail && receivingEmail.includes(domain)) {
            return receivingEmail;
        }
    }
    const words = generate({ exactly: 2, maxLength: 5 });
    const alt =
        words[0] + '.' + words[1] + Math.floor(Math.random() * 1000) + domain;
    window?.localStorage.setItem('receivingEmail', alt);
    return alt;
};

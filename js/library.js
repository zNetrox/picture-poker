/**
 * wait avec les promesses
 * @param {number} duration durée d'attente en ms
 */
export function wait(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve(duration)
    }, duration)
 })
}

/**
 * genere un nombre aleatoire
 * @param {number} max 
 * @returns number
 */
export function randomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * verifie si 2 tableau sont les meme
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns boolean
 */
export const isEqual = function(array1, array2) {
    // early return
    if(array1.length !== array2.length) {
        return false
    }
    // verifie si toutes les valeurs sont les meme
    return array1.every((value, index) => value === array2[index])
}

/**
 * transforme une chaine de caractere en element HTML. l'element est placer dans une div
 * @param {string} string 
 * @returns {HTMLElement}
 */
export const stringToHTML = function(string) {
    let dom = document.createElement('div')
    dom.innerHTML = string
    return dom
}
import { wait } from './library.js'

const nav = document.querySelector('nav')
const bgNav = document.querySelector('.bg-nav')

const btnSettings = document.querySelector('#settings')
const openSettings = document.querySelector('#open-settings')
const closeSettings = document.querySelector('#close-settings')


/**
 * animation apparition boutton
 * @param {element} btnRemove 
 * @param {element} btnAdd 
 */
const animButtonSettings = function(btnRemove, btnAdd) {
    removeListenerSettings()
    btnRemove.style.opacity = '0'
    btnSettings.style.cursor = 'default'
    wait(1100)
    .then(() => {
        btnAdd.style.opacity = '1'
        btnSettings.style.cursor = 'pointer'
        addListenerSettings()
    })
}

// animation elements settings
const animationSettings = function() {
    document.querySelectorAll("[class*='slide-']").forEach((element) => {
        element.classList.toggle('anim')
    })
}

// animation global avec les timings
const clickNavHandler = function() {
    nav.classList.toggle('active')
    if(nav.classList[0] === 'active') {
        bgNav.classList.add('active')
        animButtonSettings(openSettings, closeSettings)
        wait(600)
            .then(() => {
                document.querySelector('.nav-menu').classList.add('active')
                animationSettings()
            })
    } else {
        animationSettings()
        animButtonSettings(closeSettings, openSettings)
        wait(1100)
            .then(() => {
                document.querySelector('.nav-menu').classList.remove('active')
                bgNav.classList.remove('active')
            })
    }
}

// enleve le listener du boutton settings
const removeListenerSettings = function() {
    btnSettings.removeEventListener('click', (clickNavHandler))
}

// ajoute le listener du boutton settings
export const addListenerSettings = function() {
    btnSettings.addEventListener('click', (clickNavHandler))
}
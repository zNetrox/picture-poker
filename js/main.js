// - coins multiplicateur
// - cartes limite
// musique // plusieurs musique
// changer de carte theme
// warning max bet
// regles du jeu
// - on peut appuier sur les cartes qu'a certain moment fonction
// un son des qu'on perd ou gagne
// - animation d'entrer pour les cartes
// changer de theme de couleur
// settings storage // possible bug avec le reset de page
// coins storage
// - restart
// animation quand on changes les settings
// trier les carte a la fin

// - recuperer la meilleur combinaison des 2 deck
// - les comparé
// - pop up win lose

// bug clique instant bouton

// fin de partie a la class Bet quand on a 0 piece ou 9999


// recupere une valeur css
//console.log(window.getComputedStyle(document.querySelector('.bg-nav')).getPropertyValue('transition').split(' ')[1])

/* 
    a faire en priorité
    optimiser le code
    ia
    utiliser des waitAndFail
    erreurs
*/





//----- boutton menu + animation
import { addListenerSettings } from './menu.js'
addListenerSettings()

//----- settings
import { finalSettings } from './infos_settings.js'

//------------------- test 













import { randomInt } from './library.js'
import { wait } from './library.js'
import { isEqual } from './library.js'
import { stringToHTML } from './library.js'

const template = document.querySelector('#template-card')
const playButton = document.querySelector('#play-btn')
const betButton = document.querySelector('#bet-btn')
const curtain = document.querySelector('.curtain')
const curtainText = document.querySelector('.curtain p')
const curtainRestart = document.querySelector('.curtain button')
const settingsButton = document.querySelector('#settings')

// variable de temps en ms pour les animations
const timingTurnCard = 500
const timingGoCard = 800
const timingBetweenCard = 250
const timingEnd = 3500

const arraySymbole = ['⭐️','🔥','❤️','🌹','🍄','☁️'] // tableau avec tous les symbole trier du plus fort au plus faible

const combinationOfCards = [
    // 0 = cartes different, 1 & 2 = meme cartes | trier de la combinaison la plus forte à la plus faible
    {
        combination: [2, 2, 2, 2, 2],
        multiplier: 16
    },
    {
        combination: [2, 2, 2, 2, 0],
        multiplier: 8
    },
    {
        combination: [2, 2, 2, 1, 1],
        multiplier: 6
    },
    {
        combination: [2, 2, 1, 1, 1],
        multiplier: 6
    },
    {
        combination: [2, 2, 2, 0, 0],
        multiplier: 4
    },
    {
        combination: [2, 2, 1, 1, 0],
        multiplier: 3
    },
    {
        combination: [2, 2, 0, 0, 0],
        multiplier: 2
    },
    {
        combination: [0, 0, 0, 0, 0],
        multiplier: 0
    }
]

// il enleve les premieres cartes il ne regarde pas en fonction de la carte la plus haute
const playIa = function() {
    const CardsIa = document.querySelectorAll('.ia-hand .card')
    const infoIa = info('.ia-hand .card .back').info
    const combination = infoIa.combination
    const hightSymboleCombination = infoIa.highSymboleCombination
    const lowSymboleCombination = infoIa.lowSymboleCombination

    if (isEqual(combination, combinationOfCards[1].combination)) { // quatre meme
        CardsIa.forEach((card) => {
            let symbole = card.querySelector(".back").innerText
            if(symbole !== hightSymboleCombination) {
                card.classList.add('change')
            }
        })
    } else if (isEqual(combination, combinationOfCards[4].combination)) { // brelan
        let i = 0
        CardsIa.forEach((card) => {
            let symbole = card.querySelector(".back").innerText
            if(symbole !== hightSymboleCombination && i < 2) {
                i++
                card.classList.add('change')
            }
        })
    } else if (isEqual(combination, combinationOfCards[5].combination)) { // double paire
        CardsIa.forEach((card) => {
            let symbole = card.querySelector(".back").innerText
            if(symbole !== hightSymboleCombination && symbole !== lowSymboleCombination) {
                card.classList.add('change')
            }
        })
    } else if (isEqual(combination, combinationOfCards[6].combination)) { // paire
        let i = 0
        CardsIa.forEach((card) => {
            let symbole = card.querySelector(".back").innerText
            if(symbole !== hightSymboleCombination && i < 2) {
                i++
                card.classList.add('change')
            }
        })
    } else if (isEqual(combination, combinationOfCards[7].combination)) { // rien
        let i = 0
        CardsIa.forEach((card) => {
            let symbole = card.querySelector(".back").innerText
            if(symbole !== hightSymboleCombination && i < 3) {
                i++
                card.classList.add('change')
            }
        })
    }
}


class Info {
    constructor() {
        this.deck = []

        // trier du plus fort au plus faible
        this.nbSymbole = {
            star: 0,
            flame: 0,
            heart: 0,
            rose: 0,
            mushroom: 0,
            cloud: 0,
        }

        this.info = {
            combination: [],
            multiplier: null,
            highSymboleCombination: null,
            lowSymboleCombination: null,
            highSymbole: null, //                                                            /!\ rajouter des high symbole au cas ou qu'il y est d'autre egalité (5 highSybole)
        }
    }

    checkSymbole(backCards) {
        // ajoute au deck les symboles
        backCards.forEach((backCard) => {
            this.deck.push(backCard.innerText)
        })

        // incremente les nb..
        for (const symbole of this.deck) {
            switch (symbole) {
                case '⭐️':
                    this.nbSymbole.star++
                    break
                case '🔥':
                    this.nbSymbole.flame++
                    break
                case '❤️':
                    this.nbSymbole.heart++
                    break
                case '🌹':
                    this.nbSymbole.rose++
                    break
                case '🍄':
                    this.nbSymbole.mushroom++
                    break
                case '☁️':
                    this.nbSymbole.cloud++
                    break
            }
        }
    }

    combinaisonOfDeck() {
        let codeCombination = 2
        // fait la combinaison du deck avec 2 et 1
        for (const nbSymbole of Object.values(this.nbSymbole)) {
            if (nbSymbole > 1) {
                for (let i = 0; i < nbSymbole; i++) {
                    this.info.combination.push(codeCombination)
                }
                codeCombination--
            }
        }
        // si la combinaison n'est pas complete, elle se remplie avec des 0
        if(this.info.combination.length !== 5) {
            while(this.info.combination.length < 5) {
                this.info.combination.push(0)
            }
        }
    }

    /**
     * convertie une chaine de caractère en emoji
     * @param {string} nameSymbole 
     * @returns {string} emoji
     */
    symboleWithName(nameSymbole) {
        switch (nameSymbole) {
            case 'star':
                return '⭐️'
            case 'flame':
                return '🔥'
            case 'heart':
                return '❤️'
            case 'rose':
                return '🌹'
            case 'mushroom':
                return '🍄'
            case 'cloud':
                return '☁️'
            default:
                console.error()
                break
        }
    }

    /** récupére les symboles les plus forts de la combinaison, récupére le symbole le plus fort hors combinaison et les mets dans les infos */
    highSymbole() {
        let reduceArraySymbole = [...arraySymbole]
        let symboleCombination = []
        
        // remplie dans info les symbole qui sont dans la combinaison. comme l'objet est trier le premier symbole > 1 sera forcément le symbole le plus fort
        for (const entrie of Object.entries(this.nbSymbole)) {
            if (entrie[1] > 1 && this.info.highSymboleCombination === null) {
                let symbole = this.symboleWithName(entrie[0])
                this.info.highSymboleCombination = symbole
                symboleCombination.push(symbole)
            } else if (entrie[1] > 1 && this.info.lowSymboleCombination === null) {
                let symbole = this.symboleWithName(entrie[0])
                this.info.lowSymboleCombination = symbole
                symboleCombination.push(symbole)
            }
        }

        // supprime dans [...arraySymbole] les symboles qui sont dans la combinaison de carte
        for (const symbole1 of symboleCombination) {
            reduceArraySymbole = reduceArraySymbole.filter((symbole2) => symbole1 !== symbole2)
        }
        // recupere la carte la plus haute, en prend juste 1
        for (const symbole1 of this.deck) {
            for (const symbole2 of reduceArraySymbole) {
                if(symbole1 === symbole2) {
                    if (this.info.highSymbole === null) {
                        this.info.highSymbole = symbole1
                    } else if (arraySymbole.indexOf(symbole1) < arraySymbole.indexOf(this.info.highSymbole)) {
                        this.info.highSymbole = symbole1
                    }
                }
            }
        }
    }

    /** récupére le mutiplicateur de la combinaison et la met dans les infos */
    multiplier() {
        for (let i = 0; i < combinationOfCards.length; i++) {
            if(isEqual(this.info.combination, combinationOfCards[i].combination)) {
                this.info.multiplier = combinationOfCards[i].multiplier
            }
        }
    }
}

/**
 * utilise la class Info pour récupérer toutes les informations d'un deck
 * @param {NodeList} backCards 
 * @returns {Object}
 */
const info = function(backCards) {
    const info = new Info()
    info.checkSymbole(document.querySelectorAll(backCards))
    info.combinaisonOfDeck()
    info.highSymbole()
    info.multiplier()
    return info
}

class Bet {
    constructor() {
        this.totalCoin = 10 // 10 piece de base
        this.betCoin = 0
    }

    /**
     * met la fin de la partie
     * @param {boolean} win 
     */
    endGame(win) {
        settingsButton.style.pointerEvents = 'none'
        if(win) {
            curtainText.innerText = 'You Win'
        } else {
            curtainText.innerText = 'You Lost'
        }
        curtain.classList.add('active')
        curtainRestart.addEventListener('click', () => {
            settingsButton.style.pointerEvents = 'auto'
            this.totalCoin = 10
            this.interface()
            curtain.classList.remove('active')
            distrib.start()
        })
    }

    /** met à jour l'interface utilisateur */
    interface() {
        document.querySelector('#total-coin').innerText = this.totalCoin
        if (this.betCoin !== 0) {
            let coin = stringToHTML(`<img id='coin-${this.betCoin}' src="img/coin.png" alt="coin">`)
            document.querySelector('.final-bet').appendChild(coin)
        }
    }

    /** mise de base */
    betStart() {
        if (this.totalCoin === 0) {
            this.endGame(false)
            return
        } else if (this.totalCoin >= 10000) {
            this.endGame(true)
            return
        }

        this.betCoin ++
        this.totalCoin --
        this.interface()
    }

    /** augmenter la mise */
    userBeting() {
        betButton.addEventListener('click', () => {
            if (this.totalCoin > 0 && this.totalCoin < 9999 && this.betCoin < 4) {
                this.betCoin ++
                this.totalCoin --
                this.interface()
            }
        })
    }

    /** recommence les paries */
    restart() {
        this.betCoin = 0
        document.querySelectorAll('.final-bet div').forEach((coin) => coin.remove())
    }

    /**
     * permet de savoir qui gagne et modifie les pieces totale en fonction
     * @param {string} whoWin 'user' ou 'ia' ou 'no one'
     * @param {number} multiplier 
     */
    finish(whoWin, multiplier) {
        if (whoWin === 'user') {
            this.totalCoin = this.totalCoin + (this.betCoin * multiplier)
            this.restart()
            this.interface()
        } else if (whoWin === 'ia') {
            this.restart()
            this.interface()
        } else if (whoWin === 'no one') {
            this.totalCoin = this.totalCoin + this.betCoin
            this.restart()
            this.interface()
        }
    }
}

const bet = new Bet()
bet.userBeting()

const win = function() {
    // recuppere les infos des 2 deck
    const infoUser = info('.user-hand .card .back').info
    const infoIa = info('.ia-hand .card .back').info

    // verifie qui gagne grace au multiplicateur
    if (infoUser.multiplier > infoIa.multiplier) {
        popup('user')
        bet.finish('user', infoUser.multiplier)
        return
    } else if (infoIa.multiplier > infoUser.multiplier) {
        popup('ia')
        bet.finish('ia', infoIa.multiplier)
        return
    }

    // égalité sur le combo

    // départagé avec les cartes haut du combo
    if (arraySymbole.indexOf(infoUser.highSymboleCombination) < arraySymbole.indexOf(infoIa.highSymboleCombination) 
    || arraySymbole.indexOf(infoUser.lowSymboleCombination) < arraySymbole.indexOf(infoIa.lowSymboleCombination)) {
        popup('user')
        bet.finish('user', infoUser.multiplier)
        return
    } else if (arraySymbole.indexOf(infoUser.highSymboleCombination) > arraySymbole.indexOf(infoIa.highSymboleCombination) 
    || arraySymbole.indexOf(infoUser.lowSymboleCombination) > arraySymbole.indexOf(infoIa.lowSymboleCombination)) {
        popup('ia')
        bet.finish('ia', infoIa.multiplier)
        return
    }

    // si il y a 2 full de meme carte comparte les 2 pour voire le quelle est le plus fort
    const strongerFull = combinationOfCards[2].combination

    if (isEqual(infoUser.combination, strongerFull)) {
        popup('user')
        bet.finish('user', infoUser.multiplier)
        return
    } else if (isEqual(infoIa.combination, strongerFull)) {
        popup('ia')
        bet.finish('ia', infoIa.multiplier)
        return
    }

    // se joue sur la carte haute
    if (arraySymbole.indexOf(infoUser.highSymbole) < arraySymbole.indexOf(infoIa.highSymbole)) {
        popup('user')
        bet.finish('user', infoUser.multiplier)
        return
    } else if (arraySymbole.indexOf(infoUser.highSymbole) > arraySymbole.indexOf(infoIa.highSymbole)) {
        popup('ia')
        bet.finish('ia', infoIa.multiplier)
        return
    }

    popup('no one')
    bet.finish('no one')
}

/**
 * popup pour dire qui gagne
 * @param {string} whoWin 
 */
const popup = function(whoWin) {
    const popup = document.querySelector('#popup-win')
    if(whoWin === "user") {
        popup.innerText = "You Win !"
    } else if (whoWin === "ia") {
        popup.innerText = "You Lose"
    } else if (whoWin === "no one"){
        popup.innerText = "Equality"
    }
    popup.style.display = "flex"
    setTimeout(() => {
        popup.style.display = "none"
    }, timingEnd)
}

/**
 * créer un deck de 30 cartes . il y a 5 cartes de chaque symbole
 * @returns une liste avec tous les symboles des cartes
 */
const createDeck = function() {
    const deck = [...arraySymbole, ...arraySymbole, ...arraySymbole, ...arraySymbole, ...arraySymbole]
    return deck
}

/**
 * créer une carte aleatoire dans le deck le place grace a position et le retire du deck
 * @param {Array} deck 
 * @param {HTMLelement} position 
 */
const cloneCard = function(deck, position) {
    const randomOfDeck = randomInt(deck.length) // choisis un nombre aleatoire parmi le deck pour pouvoir recuperer le symbole et l'enlever du tableau
    const randomSymbole = deck[randomOfDeck] // recupere le symbole dans le tableau
    // clonage de la carte
    const clone = template.content.cloneNode(true) // clonage du contenu du template
    const backClone = clone.querySelector('.back') // selection le dos de la carte du clone
    backClone.textContent = randomSymbole // ajoute un symbole au dos de la carte cloné
    position.appendChild(clone) // ajoute le clone dans la page
    // supprime la carte du deck
    deck.splice(randomOfDeck, 1)
}

/** change le texte du bouton si les cartes changer de carte ou pas */
const changeButton = function() {
    let counter = 0
    // si une carte possede la class change on incremente le compteur
    document.querySelectorAll('.user-hand .card').forEach((card) => {
        card.classList.forEach((className) => {
            if(className === 'change') {
                counter ++
            }
        })
    })
    // si une carte possede la class change le texte du bouton change
    if(counter !== 0) {
        playButton.innerText = 'draw'
    } else {
        playButton.innerText = 'hold'
    }
}

/** permet de ne plus pouvoir cliquer sur les cartes */
const removeClickCard = function() {
    document.querySelectorAll('.user-hand .card').forEach((card) => {
        card.style.pointerEvents = 'none'
    })
}

/** permet de pouvoir cliquer sur les cartes */
const addClickCard = function() {
    document.querySelectorAll('.user-hand .card').forEach((card) => {
        card.style.pointerEvents = 'all'
        card.addEventListener('click', () => {
            card.classList.toggle('change') // ajoute la class change sur la carte cliqué
            changeButton()
        })
    })
}

/** retourne toutes les cartes */
const turnAllCards = function() {
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.add('turn')
    })
}

class DistribtionAnimation {
    constructor() {
        this.deck = null

        this.nbChangeCardUser = 0
        this.nbChangeCardIa = 0

        this.timingTurnAllCard = 0
    }

    firstDistrib() {
        // ajoute toute les cartes dans le HTML
        for (let i = 1; i <= 5; i++) {
            cloneCard(this.deck, document.querySelector(`.user-hand .position-${i}`))
            cloneCard(this.deck, document.querySelector(`.ia-hand .position-${i}`))
        }
        // animation distribution des cartes 1 par 1
        let i = 1
        const intervalAnimation = setInterval(() => {
            document.querySelector(`.user-hand .position-${i} .card`).classList.remove('go-in')
            document.querySelector(`.ia-hand .position-${i} .card`).classList.remove('go-in')
            if(i === 5) {
                clearInterval(intervalAnimation)
                wait(timingTurnCard)
                .then(() => {
                    document.querySelectorAll('.user-hand .card').forEach((card) => {
                        card.classList.add('turn')
                    })
                    addClickCard()
                    playButton.style.display = 'block' // ajouter le bouton
                    betButton.style.pointerEvents= 'auto'
                })
            }
            i++
        }, timingBetweenCard)
    }

    removeCards() {
        document.querySelectorAll('.user-hand .change').forEach((card) => {
            this.nbChangeCardUser ++
            card.classList.remove('turn')
        })
        document.querySelectorAll('.ia-hand .change').forEach(() => {
            this.nbChangeCardIa ++
        })

        wait(timingTurnCard)
        .then(() => {
            document.querySelectorAll('.change').forEach((card) => {
                card.classList.remove('change')
                card.classList.add('go-out') //                                                                                      /!\ possible bug
            })
            return wait(timingGoCard)
        })
        .then(() => {
            document.querySelectorAll('.go-out').forEach((card) => {
                card.remove()
            })
        })
    }

    start() {
        document.querySelectorAll('.card').forEach((card) => card.remove())
        this.deck = createDeck()
        this.nbChangeCardUser = 0
        this.nbChangeCardIa = 0
        this.timingTurnAllCard = 0
        this.firstDistrib()
        // playButton.style.display = 'block' // ajouter le bouton
        bet.betStart()
    }

    reStart() {
        document.querySelectorAll('.card').forEach((card) => card.classList.remove('turn'))
        wait(timingTurnCard)
        .then(() => {
            document.querySelectorAll('.card').forEach((card) => card.classList.add('go-out'))
            return wait(timingGoCard)
        })
        .then(() => {
            this.start()
        })
    }

    lastDistrib() {
        wait(timingGoCard + timingTurnCard + 100)
        .then(() => {
            // ajoute les cartes qui ont etaient supprimé dans le HTML
            document.querySelectorAll('[class*="position-"]').forEach((position) => {
                if(position.childElementCount === 0) { // si position n'a pas d'enfant le script s'execute
                    cloneCard(this.deck, position) // créer la cartes et les ajoutes sur la position où il n'y a pas de carte
                    position.querySelector(`.card`).style.pointerEvents = 'none' // permet de ne pas pouvoir cliquer sur la nouvelle cartes
                }
            })

            // animation distribution des cartes 1 par 1
            const a = setInterval(() => {
                if (document.querySelectorAll('.ia-hand .go-in').length === 0) { //                                              /!\ on a 2 interval pas optie changer nom variable
                    clearInterval(a)
                } else {
                    document.querySelectorAll('.ia-hand .go-in')[0].classList.remove('go-in')
                }
            }, timingBetweenCard)
            const b = setInterval(() => {
                if (document.querySelectorAll('.user-hand .go-in').length === 0) {
                    clearInterval(b)
                } else {
                    document.querySelectorAll('.user-hand .go-in')[0].classList.remove('go-in')
                }
            }, timingBetweenCard)

            // temps d'attente pour retourner les cartes, en fonction du temps de distribution des cartes
            if (this.nbChangeCardUser > this.nbChangeCardIa) {
                this.timingTurnAllCard = this.nbChangeCardUser * timingBetweenCard + timingTurnCard
            } else {
                this.timingTurnAllCard = this.nbChangeCardIa * timingBetweenCard + timingTurnCard
            }

            wait(this.timingTurnAllCard)
            .then(() => {
                turnAllCards()
                win()
                return wait(timingEnd)
            })
            .then(() => {
                this.reStart()
            })
        })
    }
}

const distrib = new DistribtionAnimation()
distrib.start() // distribution initial

// bouton appuyer
playButton.addEventListener('click', () => {

    let nbChangeCard = 0

    betButton.style.pointerEvents= 'none'
    playButton.style.display = 'none' // retire le bouton
    playButton.innerText = 'hold'
    removeClickCard()
    playIa()

    document.querySelectorAll('.card').forEach((card) => {
        for (const className of card.classList) {
            if(className === 'change') {
                nbChangeCard ++
            }
        }
    })

    // si aucune cartes ne change (changer direct)
    if (nbChangeCard === 0) {
        turnAllCards()
        win()
        wait(timingEnd)
        .then(() => {
            distrib.reStart()
        })
    } else { // si des cartes change
        distrib.removeCards()
        distrib.lastDistrib()
    }
})
const infoSettings = []
export let finalSettings = []

// carousel

/**
 * créer un carouselle qui regarde dans quelle carouselle on est
 * @param {className} nameWrapper 
 */
export const createWrapper = function(nameWrapper) {
  const btnSwipeLeft = document.querySelector(`.${nameWrapper} #swipe-left`)
  const btnSwipeRight = document.querySelector(`.${nameWrapper} #swipe-right`)
  const carousel = document.querySelector(`.${nameWrapper} .carousel`)

  const nbCarousel = document.querySelectorAll(`.${nameWrapper} .carousel div`).length

  // regarde dans quelle carouselle on est puis ajoute ou enleve le listener du boutton pour changer de position
  const displayBtnCarousel = function() {
    if(currentCarousel === 1) {
      btnSwipeLeft.classList.add('active')
      removeListenerSwipeLeft()
      addListenerSwipeRight()
      btnSwipeRight.classList.remove('active')
    } else if(currentCarousel === nbCarousel) {
      btnSwipeRight.classList.add('active')
      removeListenerSwipeRight()
      addListenerSwipeLeft()
      btnSwipeLeft.classList.remove('active')
  } else {
      btnSwipeRight.classList.remove('active')
      btnSwipeLeft.classList.remove('active')
      addListenerSwipeLeft()
      addListenerSwipeRight()
    }
  }

  let currentCarousel = 1

  // modifie la valeur dans infoSettings du carouselle qu'on change de position
  const valueSetting = function() {
    for (let i = 0; i < infoSettings.length; i++) {
      if(infoSettings[i].setting === nameWrapper) {
        infoSettings[i].value = currentCarousel
      }
    }
  }

  const swipeRightHandler = function() {
    currentCarousel++
    displayBtnCarousel()
    carousel.scrollLeft += 350
    valueSetting()
  }

  const addListenerSwipeRight = function() {
    btnSwipeRight.addEventListener('click', (swipeRightHandler))
  }
  const removeListenerSwipeRight = function() {
    btnSwipeRight.removeEventListener('click', (swipeRightHandler))
  }

  const swipeLeftHandler = function() {
    currentCarousel--
    displayBtnCarousel()
    carousel.scrollLeft -= 350
    valueSetting()
  }

  const addListenerSwipeLeft = function() {
    btnSwipeLeft.addEventListener('click', (swipeLeftHandler))
  }
  const removeListenerSwipeLeft = function() {
    btnSwipeLeft.removeEventListener('click', (swipeLeftHandler))
  }

  displayBtnCarousel()
  addListenerSwipeRight()
}

// créer un objet dans infoSettings pour chaque carouselle

document.querySelectorAll('[class*="wrapper-"]').forEach((wrapper) => {
  let nameWrapper = wrapper.classList[0]
  createWrapper(nameWrapper)
  infoSettings.push(
    {setting:`${nameWrapper}`, value: 1}
  )
})

// switch

document.querySelectorAll("[id*='switch-']").forEach((switchBtn) => {
  // créer un objet dans infoSettings pour chaque switch
  infoSettings.push(
      {setting:`${switchBtn.id}`, value: 1}
  )
  // change la valeur du switch dans infoSettings
  switchBtn.addEventListener('change', () => {
    for(let i = 0; i < infoSettings.length; i++) {
      if(infoSettings[i].setting === switchBtn.id) {
        if(switchBtn.checked) {
          infoSettings[i].value = 1
        } else {
          infoSettings[i].value = 0
        }
      }
    }
  })
})

// add settings

document.querySelector('#apply-settings').addEventListener('click', () => {
    finalSettings = [...infoSettings] // permet de ne pas modifier la page quand on clique sur les autres boutton
})
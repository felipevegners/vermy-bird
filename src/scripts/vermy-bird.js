function newElement(tagName, className) {
  const elem = document.createElement(tagName)
  elem.className = className
  return elem
}

function Tube(reverse = false) {
  this.element = newElement('div', 'tube')

  const border = newElement('div', 'tube__border')
  const body = newElement('div', 'tube__body')
  this.element.appendChild(reverse ? body : border)
  this.element.appendChild(reverse ? border : body)

  this.setHeight = tubeHeight => body.style.height = `${ tubeHeight }px`
}

function Tubes(height, gap, x) {
  this.element = newElement('div', 'tubes')

  this.topTube = new Tube(true)
  this.bottomTube = new Tube(false)

  this.element.appendChild(this.topTube.element)
  this.element.appendChild(this.bottomTube.element)

  this.gapSort = () => {
    const topHeight = Math.random() * (height - gap)
    const bottomHeight = height - gap - topHeight
    this.topTube.setHeight(topHeight)
    this.bottomTube.setHeight(bottomHeight)
  }

  this.getX = () => parseInt(this.element.style.left.split('px')[0])
  this.setX = x => this.element.style.left = `${ x }px`
  this.getWidth = () => this.element.clientWidth
  
  this.gapSort()
  this.setX(x)
}

function TubesFactory(height, width, gap, space, checkPoint) {
  this.coupleTubes = [
    new Tubes(height, gap, width),
    new Tubes(height, gap, width + space),
    new Tubes(height, gap, width + space * 2),
    new Tubes(height, gap, width + space * 3)
  ]

  const steps = 3
  
  this.animate = () => {
    this.coupleTubes.forEach(couple => {
      couple.setX(couple.getX() - steps)

      if (couple.getX() < -couple.getWidth()) {
        couple.setX(couple.getX() + space * this.coupleTubes.length)
        couple.gapSort()
      }

      const middle = width / 2
      const hitMiddle = couple.getX() + steps >= middle
        && couple.getX() < middle
      if (hitMiddle) checkPoint()
    })
  }
}

let birdImg = 'bird.png'
console.log(birdImg)

function Bird(stageHeight) {
  let isFlying = false
  let w = window

  this.element = newElement('img', 'bird')
  this.element.src = `./resources/images/${ birdImg }`
  
  this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
  this.setY = y => this.element.style.bottom = `${ y }px`
  
  w.onkeydown = e => isFlying = true
  w.onkeyup = e => isFlying = false

    let germanoBird = []
    w.addEventListener('keypress', (event) => {
      const keyName = event.key
      germanoBird.push(keyName)
      const paulito = germanoBird.join('')
      if (paulito === 'paulito') {
        birdImg = 'pg_bird.png'
        this.element.src = `./resources/images/${ birdImg }`
        console.log(birdImg)
      }
    })

  this.animate = () => {
    const newY = this.getY() +  (isFlying ? 8 : -5)
    const maxHeight = stageHeight - this.element.clientHeight

    if (newY <= 0) {
      this.setY(0)
    } else if (newY >= maxHeight) {
        this.setY(maxHeight)
    } else {
        this.setY(newY)
    }
  }

  this.setY(stageHeight / 2)
}

function Progress() {
  const scoreWrapper = newElement('div', 'progress')
  const progressTitle = newElement('p', 'progress__title')
  const progressScore = newElement('span', 'progress__score')
  
  this.element = scoreWrapper
  scoreWrapper.appendChild(progressTitle)
  progressTitle.innerHTML = 'SCORE'
  scoreWrapper.appendChild(progressScore)

  this.updateScore = points => {
    progressScore.innerHTML = points
  }

  this.updateScore(0)
}

function hasCollision(elementA, elementB) {
  const a = elementA.getBoundingClientRect()
  const b = elementB.getBoundingClientRect()

  const horizontal = a.left + a.width >= b.left
    && b.left + b.width >= a.left

  const vertical = a.top + a.height >= b.top
    && b.top + b.height >= a.top

  return horizontal && vertical
}

function hasCrashed(gameBird, gameTubes) {
  let crash = false
  gameTubes.coupleTubes.forEach(couple => {
    if (!crash) {
      const topTube = couple.topTube.element
      const bottomTube = couple.bottomTube.element
      crash = hasCollision(gameBird.element, topTube) || hasCollision(gameBird.element, bottomTube)
      }
  })
  return crash
}

function StartGame() {
  const gameStage = document.querySelector('[vgn-bird]')
  const height = gameStage.clientHeight
  const gameBird = new Bird(height, 'bird.png')

  const clearStage = newElement('div', 'start__modal')
  const startButton = newElement('button', 'start__button')

  this.element = gameStage
  gameStage.appendChild(clearStage)
  clearStage.appendChild(startButton)
  gameStage.appendChild(gameBird.element)
  startButton.innerHTML = 'START'

  startButton.addEventListener('click', function() {
    while (gameStage.firstChild) {
      gameStage.removeChild(gameStage.firstChild)
    }

    new VermyBird().start()
  })
}

function RestartGame() {
  const clearStage = newElement('div', 'restart__modal')
  const gameOverText = newElement('h4', 'restart__text')
  const restartButton = newElement('button', 'restart__button')

  this.element = clearStage

  clearStage.appendChild(gameOverText)
  gameOverText.innerHTML = 'GAME OVER'

  clearStage.appendChild(restartButton)
  restartButton.innerHTML = 'RESTART GAME'

  restartButton.addEventListener('click', function() {
    new VermyBird().restart()
  })
}

function VermyBird () {
  let points = 0

  const gameStage = document.querySelector('[vgn-bird]')
  const height = gameStage.clientHeight
  const width = gameStage.clientWidth

  const progress = new Progress()
  const gameTubes = new TubesFactory(height, width, 200, 400,
    () => progress.updateScore(++points))

  const gameBird = new Bird(height)
  console.log(birdImg)
  const restartGame = new RestartGame()
  
  gameStage.appendChild(progress.element)
  gameStage.appendChild(gameBird.element)

  gameTubes.coupleTubes.forEach(couple => gameStage.appendChild(couple.element))
  
  this.start = () => {
    const timeCount = setInterval(() => {
      gameBird.animate()
      gameTubes.animate()
      
      if (hasCrashed(gameBird, gameTubes)) {
        clearInterval(timeCount)
        setTimeout(() => {
          gameStage.appendChild(restartGame.element)
        }, 2000)
      }
    }, 20)
  }
  
  this.restart = () => {
    while(gameStage.firstChild) {
      gameStage.removeChild(gameStage.firstChild)
    }
    new StartGame()
  }
}

new StartGame()
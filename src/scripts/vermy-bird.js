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

// const t = new Tube(false)
// t.setHeight(300)
// document.querySelector('[vgn-bird]').appendChild(t.element)

function Tubes(height, gap, x) {
  this.element = newElement('div', 'tubes')

  this.top = new Tube(true)
  this.bottom = new Tube(false)

  this.element.appendChild(this.top.element)
  this.element.appendChild(this.bottom.element)

  this.gapSort = () => {
    const topHeight = Math.random() * (height - gap)
    const bottomHeight = height - gap - topHeight
    this.top.setHeight(topHeight)
    this.bottom.setHeight(bottomHeight)
  }
  this.getX = () => parseInt(this.element.style.left.split('px')[0])
  this.setX = () => this.element.style.left = `${ x }px`
  this.getWidth = () => this.element.clientWidth

  this.gapSort()
  this.setX(x)
}

// const b = new Tubes(700, 250, 200)
// document.querySelector('[vgn-bird]').appendChild(b.element)

function TubesFactory(height, width, gap, space, checkPoint) {
  this.pares = [
    new Tubes(height, gap, width),
    new Tubes(height, gap, width + space),
    new Tubes(height, gap, width + space * 2),
    new Tubes(height, gap, width + space * 3)
  ]
  const steps = 3
  this.animate = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - steps)

      if (par.getX() < -par.getWidth()) {
        par.setX(par.getX() + gap * this.pares.length)
        par.gapSort()
      }

      const middle = width / 2
      const hitMiddle = par.getX() + steps >= middle
        && par.getX() < middle
      if (hitMiddle) checkPoint()
    })
  }
}

const gameTubes = new TubesFactory(700, 1200, 250, 400)
const gameStage = document.querySelector('[vgn-bird]')
gameTubes.pares.forEach(par => gameStage.appendChild(par.element))
setInterval(() => { gameTubes.animate() }, 200)
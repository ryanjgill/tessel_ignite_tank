'use strict'

// node express
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)
const os = require('os')

const tessel = require('tessel')

// leds to display if user is connected
const usersLed = tessel.led[2]
const noUsersLed = tessel.led[3]

// start with noUsersLed turned on
noUsersLed.on()

// motor pins
const pin0 = tessel.port.B.pin[0]
const pin1 = tessel.port.B.pin[1]
const pin2 = tessel.port.B.pin[2]
const pin3 = tessel.port.B.pin[3]

pin0.output(0)
pin1.output(0)
pin2.output(0)
pin3.output(0)

function leftMotor(v1, v2) {
  pin0.output(v1)
  pin1.output(v2)
}

function rightMotor(v1, v2) {
  pin2.output(v1)
  pin3.output(v2)
}



function forward() {
  console.log('forward!')
  leftMotor(1, 0)
  rightMotor(1, 0)
}

function reverse() {
  console.log('reverse!')
  leftMotor(0, 1)
  rightMotor(0, 1)
}

function rotateLeft() {
  console.log('left!')
  leftMotor(0, 1)
  rightMotor(1, 0)
}

function rotateRight() {
  console.log('right!')
  leftMotor(1, 0)
  rightMotor(0, 1)
}

function brake() {
  console.log('brake!')
  leftMotor(0, 0)
  rightMotor(0, 0)
}

const address = os.networkInterfaces()['wlan0'][0].address
const port = 3000

httpServer.listen(port)

io.on('connection', function (socket) {
  console.log(`New connection to socketId: ${socket.id}`)

  // emit usersCount on new connection
  emitUsersCount(io)

  // emit usersCount when connection is closed
  socket.on('disconnect', function () {
    emitUsersCount(io)
    checkForZeroUsers(io)
  })

  // Power Commands
  socket.on('command:forward:on', function (data) {
    forward()
    console.log('command received! --> FORWARD ON')
  })

  socket.on('command:forward:off', function (data) {
    brake()
    console.log('command received! --> FORWARD OFF')
  })

  socket.on('command:reverse:on', function (data) {
    reverse()
    console.log('command received! --> REVERSE ON')
  })

  socket.on('command:reverse:off', function (data) {
    brake()
    console.log('command received! --> REVERSE OFF')
  })

  // Steering Commands
  socket.on('command:left:on', function (data) {
    rotateLeft()
    console.log('command received! --> LEFT ON')
  })

  socket.on('command:left:off', function (data) {
    brake()
    console.log('command received! --> LEFT OFF')
  })

  socket.on('command:right:on', function (data) {
    rotateRight()
    console.log('command received! --> RIGHT ON')
  })

  socket.on('command:right:off', function (data) {
    brake()
    console.log('command received! --> RIGHT OFF')
  })
})

// stop both motors
function stopVehicle() {
  brake()
}

// indicate if any users are connected
function updateUserLeds(usersCount) {
  if (usersCount > 0) {
    usersLed.on()
    noUsersLed.off()
  } else {
    usersLed.off()
    noUsersLed.on()
    console.log('Awaiting users to join...')
  }
}

// emit usersCount to all sockets
function emitUsersCount(io) {
  io.sockets.emit('usersCount', {
    totalUsers: io.engine.clientsCount
  })

  updateUserLeds(io.engine.clientsCount)
}

function checkForZeroUsers(io) {
  if (io.engine.clientsCount === 0) {
    stopVehicle()
    updateUserLeds(io.engine.clientsCount)
  }
}

// emit signal received to all sockets
function emitSignalReceived(io, message) {
  io.sockets.emit('signal:received', {
    date: new Date().getTime(),
    value: message || 'Signal received.'
  })
}

// setting app stuff
app.locals.title = 'Tessel 2 Ignite Tank RC Hack'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
// current issues with jade/pug
// will look into this later but for now just serve html
//app.set('view engine', 'jade')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', function(req, res, next) {
  res.send('/public/index.html')
})

// get Tessel 2 IP address via cli with `t2 wifi`
console.log(`Server running at http://${address}:${port}`)
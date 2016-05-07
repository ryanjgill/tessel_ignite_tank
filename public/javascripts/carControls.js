$(function () {
    var socket = io()

    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
        // use touchstart and touchend events
        $('#forward').on('touchstart', function () {
            socket.emit('command:forward:on')
        })

        $('#forward').on('touchend', function () {
            socket.emit('command:forward:off')
        })

        $('#reverse').on('touchstart', function () {
            socket.emit('command:reverse:on')
        })

        $('#reverse').on('touchend', function () {
            socket.emit('command:reverse:off')
        })

        $('#left').on('touchstart', function () {
            socket.emit('command:left:on')
        })

        $('#left').on('touchend', function () {
            socket.emit('command:left:off')
        })

        $('#right').on('touchstart', function () {
            socket.emit('command:right:on')
        })

        $('#right').on('touchend', function () {
            socket.emit('command:right:off')
        })
    } else {
        // use mousedown and mouseup events
        $('#forward').mousedown(function () {
            socket.emit('command:forward:on')
        })

        $('#forward').mouseup(function () {
            socket.emit('command:forward:off')
        })

        $('#reverse').mousedown(function () {
            socket.emit('command:reverse:on')
        })

        $('#reverse').mouseup(function () {
            socket.emit('command:reverse:off')
        })

        $('#left').mousedown(function () {
            socket.emit('command:left:on')
        })

        $('#left').mouseup(function () {
            socket.emit('command:left:off')
        })

        $('#right').mousedown(function () {
            socket.emit('command:right:on')
        })

        $('#right').mouseup(function () {
            socket.emit('command:right:off')
        })
    }
})
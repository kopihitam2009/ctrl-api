const ATEM = require('applest-atem')

let atem = new ATEM()

const connect = ip => {
    atem.connect(ip)
    atem.on('connect', () => {
        console.log('Connect to ATEM')
    })
}

atem.on('disconnect', () => {
    console.log('Disconnected from ATEM')
})

const source = (type, source) => {
	if (type == 'preview') {
		atem.changePreviewInput(source)
		console.log('ATEM Preview ' + source)
	} else if (type == 'program') {
		atem.changeProgramInput(source)
		console.log('ATEM Program ' + source)
	} else if (type == 'aux') {
		atem.changeAuxInput(0, source)
		console.log('ATEM AUX 1 ' + source)
	}
}

const transition = tranisitionType => {
	if (tranisitionType == 'cut') {
		atem.cutTransition()
		console.log('ATEM Cut')
	}
	if (tranisitionType == 'auto') {
		atem.autoTransition()
		console.log('ATEM Auto')
	}
}

/*const tbar = position => {
	atem.changeTransitionPosition(position)
}*/

/*const masterAudio = gain => {
	atem.changeAudioMasterGain(gain)
}

const audioChanel = (channel, gain) => {
    atem.changeAudioChannelGain(channel, gain)
}*/

module.exports = {
    atem,
	connect,
	source,
    transition
	//tbar
    //masterAudio,
    //audioChanel
}
const easymidi = require('easymidi');
const atem = require('./lib/atem');

atem.connect('192.168.10.240')

const device = easymidi.getInputs();
var input = new easymidi.Input(device);
var output = new easymidi.Output(device);

var lastnotePrv = 88;
var lastnotePgm = 89;
const arrayPrv = [87,88,91,92,86,93,94,95];
const arrayPgm = [89,90,40,41,42,43,44,45];
const arrayAtm = [1,2,3,4,5,6,7,8];

// Turn off all led button
const arrayled = arrayPgm.concat(arrayPrv)
for (var i = 0; i < arrayled.length; i++) {
    output.send('noteon', {
        note: arrayled[i],
        velocity: 0,
        channel: 0
    });
};

// Turn on/off led button preview base on user click
function ledprv (note, velocity, channel) {
    output.send('noteon', {
        note: note,
        velocity: velocity,
        channel: channel
    });
    lastnotePrv = note;
};
ledprv(88,127,0);

// Turn on/off led button program base on user click
function ledpgm (note, velocity, channel) {
    output.send('noteon', {
        note: note,
        velocity: velocity,
        channel: channel
    });
    lastnotePgm = note;
};
ledpgm(89,127,0);

// just logging for debugging purpose
function log(note1, note2, note3, note4, note5) {
    console.log('---------------------------------------------');
    console.log('lastnotePrv : ' + note1 + ' | lastnotePgm : ' + note2 + ' | ' + 'noteon', note3, note4, note5);
    //log(lastnotePrv, lastnotePgm, msg.note, msg.velocity, msg.channel);
}


input.on('noteon', function (msg) {
    log(lastnotePrv, lastnotePgm, msg.note, msg.velocity, msg.channel);

    const isInArrayPrv = arrayPrv.includes(msg.note);
    if (isInArrayPrv == true && msg.velocity == 0) {
        ledprv(lastnotePrv, 0, msg.channel);
        ledprv(msg.note, 127, msg.channel);

        var indexPrv = arrayPrv.indexOf(lastnotePrv);
        atem.source('preview', arrayAtm[indexPrv]);
    }
    const isInArrayPgm = arrayPgm.includes(msg.note);
    if (isInArrayPgm == true && msg.velocity == 0) {        
        ledpgm(lastnotePgm, 0, msg.channel);
        ledpgm(msg.note, 127, msg.channel);

        var indexPgm = arrayPgm.indexOf(lastnotePgm);
        atem.source('program', arrayAtm[indexPgm]);
    }

    if (msg.note == 85 && msg.velocity == 127) {
        output.send('noteon', {
            note: msg.note,
            velocity: 127,
            channel: msg.channel
        });
        ledprv(lastnotePrv, 0, msg.channel);
        ledpgm(lastnotePgm, 0, msg.channel);        
    } else if (msg.note == 85 && msg.velocity == 0) {
        var indexPrv = arrayPrv.indexOf(lastnotePrv);
        var indexPgm = arrayPgm.indexOf(lastnotePgm);
        var nextPgm = arrayPgm[indexPrv];
        var nextPrv = arrayPrv[indexPgm];

        atem.transition('cut');

        ledpgm(nextPgm, 127, msg.channel);
        ledprv(nextPrv, 127, msg.channel);
        
        output.send('noteon', {
            note: msg.note,
            velocity: 0,
            channel: msg.channel
        })
    }

    if (msg.note == 84 && msg.velocity == 127) {
        output.send('noteon', {
            note: msg.note,
            velocity: 127,
            channel: msg.channel
        });
        ledprv(lastnotePrv, 0, msg.channel);
        ledpgm(lastnotePgm, 0, msg.channel);
    } else if (msg.note == 84 && msg.velocity == 0) {
        var indexPrv = arrayPrv.indexOf(lastnotePrv);
        var indexPgm = arrayPgm.indexOf(lastnotePgm);
        var nextPgm = arrayPgm[indexPrv];
        var nextPrv = arrayPrv[indexPgm];

        atem.transition('auto');

        ledpgm(nextPgm, 127, msg.channel);
        ledprv(nextPrv, 127, msg.channel);
        
        output.send('noteon', {
            note: msg.note,
            velocity: 0,
            channel: msg.channel
        })
    }
});

input.on('cc', function (msg) {
    console.log('cc', msg.controller, msg.value, msg.channel);
});

input.on('pitch', function (msg) {
    console.log('pitch', msg.value, msg.channel);
});

// link castourindo https://we.tl/t-1mglMkAffZ
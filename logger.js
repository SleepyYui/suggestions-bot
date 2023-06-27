const beautify = require('beautify.log').default;

function formatText(text) {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}:${second}`;

    return text.replace('TIMESTAMP', formattedDate);
}

function createLogFile() {
    const fs = require('fs');
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}.${month}.${day}.${hour}.${minute}.${second}`;

    let firstLine = "";
    if (fs.existsSync('./logs/latest.log')) {
        const data = fs.readFileSync('./logs/latest.log', 'utf8');
        const lines = data.split('\n');
        firstLine = lines[0].split(": ")[1];
    } else {
        firstLine = "unknown";
    }

    if (fs.existsSync('./logs/latest.log')) {
        fs.renameSync('./logs/latest.log', `./logs/${firstLine}.log`);
    }
    fs.writeFileSync('./logs/latest.log', '');
    //fs.writeFileSync('./logs/debug.log', '');
    dumpLog("Creation Date: " + formattedDate)

}

function dumpLog(message) {
    const fs = require('fs');
    const data = fs.readFileSync('./logs/latest.log', 'utf8');
    const lines = data.split('\n');
    lines[lines.length - 1] += message + "\n";
    const text = lines.join('\n');
    fs.writeFileSync('./logs/latest.log', text);
}

function dumpDebugLog(message) {
    const fs = require('fs');
    const data = fs.readFileSync('./logs/debug.log', 'utf8');
    const lines = data.split('\n');
    lines[lines.length - 1] += message + "\n";
    const text = lines.join('\n');
    fs.writeFileSync('./logs/debug.log', text);
}

createLogFile();

module.exports = {
     startup(text) {
        const prefix = '[TIMESTAMP] {fgCyan}[STARTUP] {reset}';
        const formattedText = formatText( prefix + text);
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    info(text) {
        const cprefix = '[TIMESTAMP] {fgGreen}[INFO] {reset}';
        const formattedText = formatText(cprefix + text)
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    chunkmessage(text) {
        const cprefix = '[TIMESTAMP] {fgBlue}[INFO] {reset}{fgMagenta}';
        const formattedText = formatText(cprefix + text)
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    warn(text, warn) {
        const cprefix = '[TIMESTAMP] {fgYellow}[WARN] {reset}';
        if (warn == null) {
            warn = text
            text = ""
        }
        const formattedText = formatText(`${cprefix + text}\n{fgYellow}[WARN MESSAGE]: {reset}${warn}`)
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    error(text, err) {
        const cprefix = '[TIMESTAMP] {fgRed}[ERROR] {reset}';
        if (err === "") {
            err = "No error-message provided"
        }
        if (err == null) {
            err = text
            text = ""
        }
        const formattedText = formatText(`${cprefix + text}\n{fgRed}[ERROR MESSAGE]: {bright}${err}`)
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    super_error(text, err) {
        const cprefix = '[TIMESTAMP] {fgRed}{bright}[FATAL ERROR] {bright}';
        const formattedText = formatText(`${cprefix + text}\n${err}`)
        beautify.log(formattedText);
        dumpLog(formattedText);
    },

    command(ctx) {
        if (commands) {
            const cprefix = '[TIMESTAMP] {fgMagenta}[COMMAND] {reset}';
            // eslint-disable-next-line max-len
            const formattedText = formatText(`${cprefix + `${ctx.author.tag} (${ctx.author.id}) used the command ${ctx.command.name} in ${ctx.guild.name} (${ctx.guild.id}) in channel ${ctx.channel.name} (${ctx.channel.id})`}`)
            beautify.log(formattedText);
        }
    },

    db(text) {
        const prefix = '[TIMESTAMP] {fgGreen}{bright}[DATABASE] {reset}';
        const formattedText = formatText(prefix + text);
        beautify.log(formattedText);
        dumpLog(formattedText);
    },
};

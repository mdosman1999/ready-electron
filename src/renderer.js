import { ipcRenderer, shell } from 'electron';
// import './style.css';
import './pwss.css';

(async () => {
    
    // database
    // -----------------------------------------------
    // get user data path from main process
    const userDataPath = await ipcRenderer.invoke('my-method');
    ipcRenderer.on('message', (e, x) => {

        console.log(e, x)
        
    });
    
    
    
})();



// document.getElementById("btn").addEventListener('click' , function(){
//     var value = parseInt(document.getElementById('number').value, 10);
//     value = isNaN(value) ? 0 : value;
//     value++;
//     document.getElementById('number').value = value;
// })




var Generator = document.getElementById("generator");
var btn = document.getElementById("copay");



function copayFunction() {
    var inputText = document.getElementById("text");
    inputText.select();
    inputText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputText.value);
}
btn.addEventListener('click', copayFunction)


function passwordGenerator() {

    var allCerectar1 = "1234567890";
    var allCerectar2 = "qwertyuiopasdfghjklzxcvbnm";
    var allCerectar3 = "!@#$%^&*";
    var allCerectar4 = "QWERTYUIOPASDFGHJKLZXCVBNM";
    var numberOfpaswored = 12;
    var paswored = "";

    for (var i = 0; i < 3; i++) {
        var rendomPaswored = Math.floor(Math.random() * allCerectar1.length);
        paswored += allCerectar1.substring(rendomPaswored, rendomPaswored + 1);
    }
    for (var i = 0; i < 3; i++) {
        var rendomPaswored = Math.floor(Math.random() * allCerectar2.length);
        paswored += allCerectar2.substring(rendomPaswored, rendomPaswored + 1);
    }
    for (var i = 0; i < 3; i++) {
        var rendomPaswored = Math.floor(Math.random() * allCerectar3.length);
        paswored += allCerectar3.substring(rendomPaswored, rendomPaswored + 1);
    }
    for (var i = 0; i < 3; i++) {
        var rendomPaswored = Math.floor(Math.random() * allCerectar4.length);
        paswored += allCerectar4.substring(rendomPaswored, rendomPaswored + 1);
    }

    document.getElementById("text").value = shuffleString (paswored);
}


function shuffleString(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

Generator.addEventListener('click', passwordGenerator)
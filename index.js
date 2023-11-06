import { initializeApp } from "firebase/app";
import {getDatabase, ref, push, onValue, remove} from "firebase/database"

const inputEl = document.getElementById("input-el-title")
const inputElLink = document.getElementById("input-el-link")
const inputBtn = document.getElementById("input-btn")
const ulElList = document.getElementById("ul-list")

const firebaseConfig = {
    apiKey: "AIzaSyAicKmC6rtdKuaxmLDXLhUuL6Wa1XHrCRE",
    authDomain: "playground-c8efa.firebaseapp.com",
    databaseURL: "https://playground-c8efa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "playground-c8efa",
    storageBucket: "playground-c8efa.appspot.com",
    messagingSenderId: "351477543619",
    appId: "1:351477543619:web:5f1aee7f5e07c7fb926876"
};

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const animesInDB = ref(database, "animes")

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    inputEl.value = tabs[0].title;
    inputElLink.value = tabs[0].url;
})


function appendEntryToList (currentEntryInfo) {
    let currentEntryID = currentEntryInfo[0];
    let currentEntryLink = currentEntryInfo[1].link;
    let currentEntryTitle = currentEntryInfo[1].title;
    let newEntryContainer = document.createElement("li");
    let newEntryParagraph = document.createElement("p");
    let newEntryLink = document.createElement("a");
    let newDltBtn = document.createElement("button");
    newDltBtn.innerHTML = "+";
    newDltBtn.classList.add("delete-btn");
    newDltBtn.addEventListener("click", function() {
        let exactLocationInDB = ref(database, `animes/${currentEntryID}`)
        remove(exactLocationInDB)
    });
    newEntryLink.innerHTML = `<a target='_blank' href='${currentEntryLink}'>${currentEntryTitle}</a>`
    newEntryParagraph.append(newEntryLink);
    newEntryParagraph.append(newDltBtn);
    newEntryContainer.append(newEntryParagraph);
    ulElList.append(newEntryContainer)
}

function clearAnimeList() {
    ulElList.innerHTML = ""
}

onValue(animesInDB, function(snapshot) {
    clearAnimeList()
    let idArray = Object.entries(snapshot.val())
    for (let i = 0; i < idArray.length; i++) {
        let currentEntry = idArray[i];
        appendEntryToList(currentEntry);
    }
})

//обработка нажатия на "сохранить название"
inputBtn.addEventListener("click", function() {
    let savedObject = {
        link: inputElLink.value,
        title: inputEl.value,        
    }
    push(animesInDB, savedObject).then(()=> {
        alert("Anime saved!")
    }).catch((error)=>{
        alert("Saving failed! Try again!")
        console.log(error)
    })

    inputEl.value = ""
    inputElLink.value = ""
})

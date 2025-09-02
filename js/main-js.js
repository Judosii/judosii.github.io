function SwitchTheme(button){
    let darkMode = localStorage.getItem('darkTheme')
    darkMode !== "active" ? EnableDarkMode(): DisableDarkMode()
}

function EnableDarkMode(){
    document.body.classList.add('darkTheme')
    localStorage.setItem('darkTheme','active')
}

function DisableDarkMode(){
    document.body.classList.remove('darkTheme')
    localStorage.setItem('darkTheme', null)
}


// -- ASYNC FUNCTIONS --
async function FetchHtmlFile(wantedFileString, targetEl){
    fetch(wantedFileString)
        .then(res => {
            if(res.ok){
                return res.text()
            }
        })
        .then(htmlSnippet => {
            targetEl.innerHTML = htmlSnippet
        })
}

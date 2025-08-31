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
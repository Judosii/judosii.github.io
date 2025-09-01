function ShowMenuStartListening(menu){
    
    document.addEventListener("click", function(event){
        if(event.target.closest(menu)) {return}
        menu.hidden = true;
    })
}

document.addEventListener('DOMContentLoaded',function(){
    
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for(let i=0;i<allButtons.length;i++)
    {   
        //Adding a click event when a searchButton is clicked
        allButtons[i].addEventListener('click',function(){
            searchBar.style.visibility='visible';
            searchBar.classList.add('open');
            //Setting aria-expanded property true for screenreaders (refer headers.ejs)
            //aria-expanded just tells that the searchbar has been expanded
            this.setAttribute('aria-expanded','true');
            searchInput.focus();
        });
    }

    //Configuring the event listener when close button is clicked
    searchClose.addEventListener('click',function(){
        searchBar.style.visibility='hidden';
        searchBar.classList.remove('open');
        //Setting aria-expanded property true for screenreaders (refer headers.ejs)
        //aria-expanded just tells that the searchbar has been expanded
        this.setAttribute('aria-expanded','false');
    });
});
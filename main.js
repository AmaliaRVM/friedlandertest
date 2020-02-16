//Elements

//Root & main Containers
const app = document.getElementById('root')
const mainContainer = document.getElementById('mainContainer')
const mainSearch = document.getElementById('mainSearch')

//art container
const artContainer = document.createElement('div')
artContainer.setAttribute('class', 'artContainer')

//Append
app.appendChild(mainContainer)
mainContainer.appendChild(mainSearch)
mainContainer.appendChild(artContainer)

// for the checkboxlist
var inputArray = [];
var expanded = false;


//Top Button Function
const topButton = document.getElementById("topButton")
window.onscroll = function () {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block"
    } else {
        topButton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Function to clean content of page 
function cleanUp(){
    var elem = document.getElementsByClassName('cardContainer');
    var myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        elem[0].parentNode.removeChild(elem[0])}
    var elem = document.getElementsByClassName('form-check');
    myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        elem[0].parentNode.removeChild(elem[0])}
}


//AaddsubOne Function
function addsubOne(what) {
    var num = button.getAttribute('firstpage')
    if ( what == 'plus') {
        num = button.getAttribute('nextpage')
        // console.log(button.getAttribute('nextpage'))
    } else if (what == 'minus') {
        num = button.getAttribute('prevpage')
        // console.log(button.getAttribute('prevpage'))
    }
    // console.log(' WE WANT THIS', num, !num)
    if (num == 'null') {
        // console.log('it found null')
        if  ( what == 'plus') {
            num = button.getAttribute('firstpage')
        } else if (what == 'minus'){
            num = button.getAttribute('lastpage')
        }
    }

    wholepath = button.getAttribute('nextpage')
    
    // Clean content of page 
    cleanUp()
    // get the new api url    
    request.open('GET',num, true)
    request.send() 
}


//For the API function
function infoData(myinfo){
    myinfo.data.forEach(works => {
        
        const cardContainer = document.createElement('div')
        cardContainer.setAttribute('class', 'cardContainer')
        const infoContainer = document.createElement('div')
        infoContainer.setAttribute('class', 'infoContainer')
        const paintingContainer = document.createElement('div')
        paintingContainer.setAttribute ('class', 'paintingContainer')
        const title = document.createElement('h2')
        title.setAttribute('id', 'title')
        title.textContent = works.title
        const artist = document.createElement('h3')
        artist.textContent = works.artist
        const material = document.createElement('p')
        material.textContent = works.material
        const enp = document.createElement('p')
        enp.setAttribute('id', 'enp')
        enp.textContent = 'ENP '+(works.reference)
        const painting = document.createElement('img')
        painting.src = works.image_url

        artContainer.appendChild(cardContainer)
        cardContainer.appendChild(paintingContainer)
        cardContainer.appendChild(infoContainer)
        infoContainer.appendChild(title)
        infoContainer.appendChild(artist)
        infoContainer.appendChild(material) 
        infoContainer.appendChild(enp)
        paintingContainer.appendChild(painting)
    })
}

// To generate artist checkbox list
function artistInput(myArtist){
    var myDiv = document.getElementById("checkboxes");
    inputArray = [];
    for(number in myArtist)  {
        var formcheck = document.createElement("div");
        formcheck.setAttribute('class', 'form-check');
        input = document.createElement('input');
        input.setAttribute('class', "form-check-input");
        label = document.createElement('label');
        label.setAttribute('class', "form-check-label");
        input.type = "checkbox";
        txt = document.createTextNode(myArtist[number].name + '  ('+myArtist[number].count+')');
        input.value = myArtist[number].id;
        myDiv.appendChild(formcheck);
        formcheck.appendChild(input);
        formcheck.appendChild(label);
        label.appendChild(txt);
        inputArray.push(input);
        // console.log(input.checked);
    }
}

// to extract which artists are checked
function showMeAll() {
    var newpage = button.getAttribute('mycurrentpage')
    var startidx = newpage.indexOf('filter%5Bartist_id%5D=')
    var substring = newpage.slice(startidx, -1)
    var lastidx = substring.indexOf('&')
    substring = substring.slice(0, lastidx)
    console.log('original ', newpage)
    console.log('idx where filter[artist_id] starts', startidx)
    console.log('to delete: ', substring)
    newpage = newpage.replace(substring,'')
    console.log('new', newpage)

    if (newpage.includes('?')) {
        newpage = newpage +'&filter[artist_id]='
    } else {
        newpage = newpage +'?filter[artist_id]='
    }
    
    var artistList = '';
    for (x of inputArray) {
        if (x.checked) {
            artistList = artistList + x.value+ ","
            // console.log('The value is ', x.value)
        }
    }
    newpage = newpage + artistList
    console.log('this is the page we look up ', newpage)
    cleanUp();
    request.open('GET', newpage, true)
    // Send request
    request.send()
}

// update of all button information from api-links
function updateAll(info, button){
    button.setAttribute('mycurrentpage', info.meta.full_path);
    // if (button.getAttribute('mycurrentpage').search('page=') < 0) {
        // button.setAttribute('mycurrentpage', info.meta.path+'?page=1');
    // }
    button.setAttribute('firstpage', info.links.first);
    button.setAttribute('nextpage', info.links.next);
    button.setAttribute('prevpage', info.links.prev);
    button.setAttribute('lastpage', info.links.last);
    button.setAttribute('lastpainting', info.meta.to);
    button.setAttribute('totalnumber', info.meta.total);
    // console.log(button.getAttribute('mycurrentpage'))
};


function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}



//First Request
var request = new XMLHttpRequest()

request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works', true)

request.onload = function() {  
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
   
    updateAll(info, button)
    var myArtist = info.filterdata.artists
    // console.log('in request '+ button.getAttribute('firstpage'))
    if (request.status >= 200 && request.status < 400) {
        infoData(info);
        // console.log('in request', info.filterdata.artists);
        artistInput(myArtist);
    } else {
        // console.log('error')
    }
}  

// Send request
request.send() 

//Search Form
const searchBar = document.querySelector("input");
const button = document.querySelector("button");
button.setAttribute('mycurrentpage', 'https://friedlander.kikirpa.be/api/v1/works?page=1' )

searchBar.addEventListener('keyup', function(event){
    event.preventDefault();
    // clean content of page
    cleanUp()
    request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar.value, true)
    // Send request
    request.send()   
})





    






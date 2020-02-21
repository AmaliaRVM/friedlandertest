//Root & main Containers
const app = document.getElementById('app')
const mainContainer = document.getElementById('mainContainer')
const mainSearch = document.getElementById('mainSearch')
const artContainer = document.getElementById('artContainer')
const formcheck = document.getElementById('artists')

//FUNCTIONS to create the elements contained in the artistContainer

//Function to create the cardContainer and elements inside the cardContainer
function addContentToArtContainer(cardContainer, works) {
    const paintingContainer = document.createElement('div')
    paintingContainer.setAttribute ('class', 'paintingContainer')
    cardContainer.appendChild(paintingContainer)
    const infoContainer = document.createElement('div')
    infoContainer.setAttribute('class', 'infoContainer')
    cardContainer.appendChild(infoContainer)
    const artist = document.createElement('span')
    artist.setAttribute('class', 'artist')
    artist.textContent = works.artist
    infoContainer.appendChild(artist)
    const material = document.createElement('span')
    material.setAttribute('class', 'material')
    material.textContent = works.material
    infoContainer.appendChild(material)
    const enp = document.createElement('span')
    enp.setAttribute('class', 'reference')
    enp.textContent = 'ENP '+(works.reference)
    infoContainer.appendChild(enp)
    const title = document.createElement('span')
    title.setAttribute('class', 'title')
    title.textContent = works.title
    infoContainer.appendChild(title)
    const painting = document.createElement('img')
    painting.src = works.image_url
    paintingContainer.appendChild(painting)
}

//Function to display elements from the API
function infoData(myinfo){
    myinfo.data.forEach(works => {        
        cardContainer = document.createElement('div')
        cardContainer.setAttribute('class', 'card p-2 mx-1 cardContainer')
        artContainer.appendChild(cardContainer)
        addContentToArtContainer(cardContainer, works)
    })
}

//FUNCTIONS to create and display the elements contained in the checkbox list

//Var for the checkboxlist
var inputArrayArtist = [];
var inputArrayMaterial = [];
var expandedArtist = false;
var expandedMaterial = false;

//Function to generate artist and material checkbox list
function checkboxInput(myObject, what){
    if (what == 'artist') {
        var checkboxDiv = document.getElementById("checkboxesArtist");
    } else if (what == 'material') {
        var checkboxDiv = document.getElementById("checkboxesMaterial");
    }
    if (what == 'artist') {
        inputArrayArtist = [];
    } else if (what == 'material') {
        inputArrayMaterial = [];
    }
    for(number in myObject)  {
        var formcheck = document.createElement("div");
        formcheck.setAttribute('class', 'form-check');
        label = document.createElement('label');
        label.setAttribute('class', "form-check-label");
        label.setAttribute('for', ' ')
        input = document.createElement('input');
        input.setAttribute('class', "form-check-input artist_option");
        input.setAttribute('id', ' ');
        input.type = "checkbox";
        input.name = "artists";
        input.value = myObject[number].id;
        labelText = document.createTextNode(myObject[number].name);
        small = document.createElement("small");
        small.setAttribute('class', 'text-secundary');
        smallText = document.createTextNode('  ('+myObject[number].count+')');
        checkboxDiv.appendChild(formcheck);
        formcheck.appendChild(label);
        label.appendChild(input);
        label.appendChild(labelText);
        label.appendChild(small);
        small.appendChild(smallText);
        
        if  (what == 'artist') {
            inputArrayArtist.push(input);
        } else if (what == 'material') {
            inputArrayMaterial.push(input);
        }
    }    
}

//Function to display the checkboxlist
function showCheckboxes(what) {
    if (what == 'artist') {
        var checkboxesArtist = document.getElementById("checkboxesArtist");
        if (!expandedArtist) {
            checkboxesArtist.style.display = "block";
            expandedArtist = true;
        } else {
            checkboxesArtist.style.display = "none";
            expandedArtist = false;
        }
    } else if (what == 'material') {
        var checkboxesMaterial = document.getElementById("checkboxesMaterial");
        if (!expandedMaterial) {
            checkboxesMaterial.style.display = "block";
            expandedMaterial = true;
        } else {
            checkboxesMaterial.style.display = "none";
            expandedMaterial = false;
        }
    }
}

//Function to extract which artists/materials are checked
function showMeAll() {
    var newpage = button.getAttribute('mycurrentpage')

    if (newpage.includes('?')) {
        newpage = newpage +'&filter[artist_id]='
    } else {
        newpage = newpage +'?filter[artist_id]='
    }
    var artistList = '';
    var artistcount = 0
    for (x of inputArrayArtist) {
        if (x.checked) {
            artistList = artistList + x.value+ ","
            artistcount = artistcount + 1
        }
    }
    newpage = newpage + artistList

    if (newpage.includes('?')) {
        newpage = newpage +'&filter[material_id]='
    } else {
        newpage = newpage +'?filter[material_id]='
    }
    
    var materialList = '';
    var materialcount = 0
    for (x of inputArrayMaterial) {
        if (x.checked) {
            materialList = materialList + x.value+ ","
            materialcount = materialcount + 1
        }
    }
    newpage = newpage + materialList

    cleanUp();
    request.open('GET', newpage, true)
    // Send request
    request.send()
    if (materialcount < 11) { 
        checkboxesMaterial.style.display = "block";
        expandedMaterial = true;
    }
    if (artistcount < 11) {
        checkboxesArtist.style.display = "block";
        expandedArtist = true;
    } 
}

//FUNCTIONS, REQUEST and SEARCH FORM to handle all the api endpoints


//Function to update
function cleanUp(){
    var elem = document.getElementsByClassName('card p-2 mx-1 cardContainer');
    var myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        elem[0].parentNode.removeChild(elem[0])}
    var elem = document.getElementsByClassName('form-check');
    myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        elem[0].parentNode.removeChild(elem[0])}
}

//Function update of all button information from api-links
function updateAll(info, button){
    button.setAttribute('mycurrentpage', info.meta.full_path);
    button.setAttribute('firstpage', info.links.first);
    button.setAttribute('nextpage', info.links.next);
    button.setAttribute('prevpage', info.links.prev);
    button.setAttribute('lastpage', info.links.last);
    button.setAttribute('lastpainting', info.meta.to);
    button.setAttribute('totalnumber', info.meta.total);
};

//First Request
var request = new XMLHttpRequest()

request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works', true)

request.onload = function() {  
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
    updateAll(info,button)
    var myArtist = info.filterdata.artists
    var myMaterial = info.filterdata.materials
    
    if (request.status >= 200 && request.status < 400) {
        infoData(info);
        checkboxInput(myArtist, 'artist');
        checkboxInput(myMaterial, 'material');
        
    } else {
        console.log('error')
    }
}  
// Send request
request.send()

//Search Form
const searchBar = document.querySelector("input");
const button = document.getElementById("btn");
button.setAttribute('mycurrentpage', 'https://friedlander.kikirpa.be/api/v1/works?page=1' )

button.addEventListener('click', function(event){
    event.preventDefault();
    // clean content of page
    cleanUp()
    request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar.value, true)
    console.log(request)
    // Send request
    request.send()   
})

//BUTTONS functions

//AaddsubOne Function
function addsubOne(what) {
    var num = button.getAttribute('firstpage')
    if ( what == 'plus') {
        num = button.getAttribute('nextpage')
    } else if (what == 'minus') {
        num = button.getAttribute('prevpage')
    }
    if (num == 'null') {
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





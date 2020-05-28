//Root & main Containers
const app = document.getElementById('app')
const mainContainer = document.getElementById('mainContainer')
const mainSearch = document.getElementById('mainSearch')
const artContainer = document.getElementById('artContainer')
const formcheck = document.getElementById('artists')

//URL variable
const baseUrl = 'https://friedlander.kikirpa.be';

//Var for the checkboxlist
var inputArrayArtist = [];
var inputArrayMaterial = [];

//First Request
var request = new XMLHttpRequest()

request.open('GET', baseUrl+'/api/v1/works', true)

request.onload = function() {  
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
    updateAll(info, button)
    var myArtist = info.filterdata.artists
    var myMaterial = info.filterdata.materials

    if (request.status >= 200 && request.status < 400) {
        totalNumberResults(info);
        artContainerTemplate(info);
        checkboxInput(myArtist, 'artist');
        checkboxInput(myMaterial, 'material');
    } else {
        console.log('error')
    }
}

//updateAll function of all button information from api-links
function updateAll(info, button){
    button.setAttribute('mycurrentpage', info.meta.full_path);
    button.setAttribute('firstpage', info.links.first);
    button.setAttribute('nextpage', info.links.next);
    button.setAttribute('prevpage', info.links.prev);
    button.setAttribute('lastpage', info.links.last);
    button.setAttribute('lastpainting', info.meta.to);
    button.setAttribute('totalnumber', info.meta.total);
};

//Total number results
function totalNumberResults(info) {
    try {
        var elem = document.getElementById('total-results')[0]
        elem.parentNode.removeChild(elem)
    } catch(err) {
        console.log(err)
    }
    
    totalResults = document.getElementById('total-results')
    totalResults.textContent = info.meta.total
    console.log("total is: "+info.meta.total)
}

// HTML artContainer Template 
function artContainerTemplate(myInfo){
    artContainer.innerHTML =`
    ${myInfo.data.map(function(works){
        return `
        <a href='#' data-toggle="modal" data-target='#mymodal${works.id}'>
            <div class='card p-2 mx-1 cardContainer'>
                <div class='paintingContainer'>
                    <img src='${works.image_url}'>
                </div>
                <div class='infoContainer'>
                    <span class='artist'>${works.artist}</span>
                    <span class='material'>${works.material}</span>
                    <span class='reference'>${works.reference}</span>
                    <span class='title'>${works.title}</span>
                </div>
            </div>
        </a>
        <div class='modal' id='mymodal${works.id}'>
            <div class='modal-dialog'>
                <div class='modal-content'>
                    <div class='modal-header'>
                        <h2 class='modal-title'>${works.title}</h2>
                        <button class='close' type='button' data-dismiss='modal'>x</button>
                    </div>
                    <div class='modal-body'>${works.artist}</div>
                </div>
            </div>
        </div>
        `
    }).join('')}
    `
    //end of Template
}

//CheckboxInput function to generate artist and material checkbox list
function checkboxInput(myObject, what){
    if (what == 'artist') {
        var checkboxDiv = document.getElementById("checkboxesArtist");
    } else if (what == 'material') {
        var checkboxDiv = document.getElementById("checkboxesMaterial");
    }
    //checkbox list HTML Template
    checkboxDiv.innerHTML=`
        ${myObject.map(function(art){
            return `
            <div class='form-check'>
                <label class='form-check-label' for='${what+'_'+art.id}'>
                    <input class='form-check-input artist_opinion' id='${what+'_'+art.id}' 
                    type='checkbox' name='${art.name}' value='${art.id}'/>
                    ${art.name}
                    <small class='text-secundary'>${art.count}</small>
                </label>
            </div>   
        `
        }).join('')} 
    `
    //end of Template
    for(art in myObject){
        var input = document.getElementById(what+'_'+myObject[art].id)
        input.addEventListener('click', function() {getArtists()})
        if  (what == 'artist') {
            inputArrayArtist.push(input);
        } else if (what == 'material') {
            inputArrayMaterial.push(input);
        } 
    } 

    //Onclick function to add tag from selected item
    function getArtists() {
        const yourFilters = document.getElementById('your-filters')
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

        var elem = document.getElementsByClassName('badge badge-warning');
        var myoriglen = elem.length
        for (myi = 0;  myi < myoriglen; myi++) {
                elem[0].parentNode.removeChild(elem[0])
        }   

        for (var i =0; i<checkboxes.length; i++) {
            var artist = checkboxes[i].name
            var span = document.createElement('span')
            span.setAttribute('class', 'badge badge-warning')
            if (checkboxes[i].id.includes("artist")) {
                var tag = document.createTextNode('painter: '+artist);
            } else if (checkboxes[i].id.includes("material")){
                var tag = document.createTextNode('material: '+artist);
            }
            yourFilters.appendChild(span);
            span.appendChild(tag);
        }
        
        showMeAll()
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

    cleanUp(0);
    request2.open('GET', newpage, true)
    // Send request
    request2.send()
}

//cleanUp function to clean up and update
function cleanUp(deleteAll){
    var elem = document.getElementsByClassName('card p-2 mx-1 cardContainer');
    var myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        elem[0].parentNode.removeChild(elem[0])}
    var elem = document.getElementsByClassName('form-check');
    myoriglen = elem.length
    if (deleteAll > 0) {
        for (myi = 0;  myi < myoriglen; myi++) {
            elem[0].parentNode.removeChild(elem[0])}
        var elem = document.getElementsByClassName('badge badge-warning');
        var myoriglen = elem.length
        for (myi = 0;  myi < myoriglen; myi++) {
            elem[0].parentNode.removeChild(elem[0])
        }   
    }
}

//Second Request for the items list
var request2 = new XMLHttpRequest()

request2.open('GET', baseUrl+'/api/v1/works', true)

request2.onload = function() {  
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
    updateAll(info, button)

    if (request.status >= 200 && request.status < 400) {
        totalNumberResults(info);
        artContainerTemplate(info); 
    } else {
        console.log('error')
    }
}  
// Send request
request.send()

//Search Form
const searchBox = document.querySelector("input");
const button = document.getElementById("btn");
const title = document.getElementsByTagName('');
button.setAttribute('mycurrentpage', baseUrl+'/api/v1/works?page=1' )

var searchItemList = []; 
button.addEventListener('click', searchBoxFunction)

// Search box function to be called when search button is clicked
function searchBoxFunction(event){
    event.preventDefault();
    // clean content of page
    cleanUp(1)
    searchItemList.push(searchBox.value)
    buildSearchItemDisplay()
}

function buildSearchItemDisplay(){
    var searchString = searchItemList.join(',')
    cleanUp(1)
    request.open('GET', baseUrl+'/api/v1/works?filter[title]='+searchString, true)
    //Get the searchBox value for title tag in Your Filter
    const yourFilters = document.getElementById('your-filters')
    var elem = document.getElementsByClassName('badge badge-info');
        var myoriglen = elem.length
        for (myi = 0;  myi < myoriglen; myi++) {
                elem[0].parentNode.removeChild(elem[0])
        }   

    //HTML Template
    yourFilters.innerHTML = `
        ${searchItemList.map(function(){
            item = searchItemList
            return `
            <span class='badge badge-info'>
                ${'title: '+item+' '}
                <i class='fas fa-times' id='icon' name='${item}'></i>
            </span>
            `
        }).join('')}
    `
    //end of Template

    for(index in searchItemList){
        var icon = document.getElementById('icon');
        icon.addEventListener('click', function(){
            searchItemList = searchItemList.filter(letter => letter != this.getAttribute('name'))
            buildSearchItemDisplay();
        } )
    }
    // Send request
    request.send()
}

//BUTTONS FUNCTIONS

//AddsubOne Function
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
    cleanUp(0)
    // get the new api url    
    request.open('GET',num, true)
    request.send() 
}

//Top and Bottom Button Function
const topButton = document.getElementById("topButton")
const bottomButton = document.getElementById("bottomButton")
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";
    } else if (document.body.scrollTop < 20 || document.documentElement.scrollTop < 20) {
        bottomButton.style.display = "block";
        topButton.style.display = "none";
    } 
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function bottomFunction() {
    window.scrollTo(0, document.body.scrollHeight);
}





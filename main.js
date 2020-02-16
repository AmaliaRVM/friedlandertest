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


//AaddsubOne Function
function addsubOne(what) {
    var num = button.getAttribute('firstpage')
    if ( what == 'plus') {
        num = button.getAttribute('nextpage')
        console.log(button.getAttribute('nextpage'))
    } else if (what == 'minus') {
        num = button.getAttribute('prevpage')
        console.log(button.getAttribute('prevpage'))
    }
    console.log(' WE WANT THIS', num, !num)
    if (num == 'null') {
        console.log('it found null')
        if  ( what == 'plus') {
            num = button.getAttribute('firstpage')
        } else if (what == 'minus'){
            num = button.getAttribute('lastpage')
        }
    }

    wholepath = button.getAttribute('nextpage')/* .split("page=")[0]+'page='+ num.toString(); */
    console.log(wholepath)
    
    // delete content of page 
    var elem = document.getElementsByClassName('cardContainer');
    console.log(elem.length)
    const myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        console.log(myi)
        elem[0].parentNode.removeChild(elem[0])}
    // get the new api url    
    request.open('GET',num, true)
    request.send() 
    //button.setAttribute('mycurrentpage', wholepath)
    
    // do all the info.data stuff as already done twice before
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

//First Request
var request = new XMLHttpRequest()

request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works', true)

request.onload = function() {  
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
    updateAll(info, button)
    console.log('in request '+ button.getAttribute('firstpage'))
    if (request.status >= 200 && request.status < 400) {
        infoData(info);
    } else {
        console.log('error')
    }
}  

// Send request
request.send() 

//Search Form
const searchBar = document.querySelector("input");
const button = document.querySelector("button");

button.setAttribute('mycurrentpage', 'https://friedlander.kikirpa.be/api/v1/works?page=1' )
console.log(button.getAttribute('mycurrentpage'))
updateAll = function(info, button){
    button.setAttribute('mycurrentpage', info.meta.path);
    if (button.getAttribute('mycurrentpage').search('page=') < 0) {
        button.setAttribute('mycurrentpage', info.meta.path+'?page=1');
    }
    button.setAttribute('firstpage', info.links.first);
    button.setAttribute('nextpage', info.links.next);
    button.setAttribute('prevpage', info.links.prev);
    button.setAttribute('lastpage', info.links.last);
    button.setAttribute('lastpainting', info.meta.to);
    button.setAttribute('totalnumber', info.meta.total);
    console.log(button.getAttribute('mycurrentpage'))
};

searchBar.addEventListener('keyup', function(event){
    event.preventDefault();
    var elem = document.getElementsByClassName('cardContainer');
    console.log(elem.length)
    const myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        console.log(myi)
        elem[0].parentNode.removeChild(elem[0])}
    console.log(request);
    var request2 = new XMLHttpRequest();
    
    //this.setAttribute('mycurrentpage', 'https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar.value+'&page=1' )
    request2.open('GET', 'https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar.value, true)
    console.log(request2);
    request2.onload = function() { 
        console.log('Hellooooooooooooooooooooooooooooooooo');
    // Begin accessing JSON data here
    var info = JSON.parse(this.response);
    updateAll(info, button);
    console.log(request2.status);
    if (request2.status >= 200 && request2.status < 400) {
        infoData(info);
        console.log(info.meta.current_page)
        console.log('in search', button.getAttribute('mycurrentpage'))
    } else {
        console.log('error')
    }
}  
// Send request
request2.send()    
console.log('at the end')   
})


//Artist Request
var request3 = new XMLHttpRequest()

request3.open('GET', 'https://friedlander.kikirpa.be/api/v1/works', true)

request3.onload = function () {  
    console.log(request);
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
        console.log(info);
    if (request3.status >= 200 && request3.status < 400) {
        console.log(info.filterdata.artists);
    } else {
        console.log('error')
    }

    var select = document.getElementById("artist-select");
    myObject = info.filterdata.artists
    console.log(myObject[1].name)

    for(number in myObject)  {
        option = document.createElement('OPTION'),
        txt = document.createTextNode(myObject[number].name);
        option.appendChild(txt);
        option.setAttribute('value', myObject[number].id);
        select.insertBefore(option, select.lastChild);    
    }
}  
request3.send() 

function artistFunction(a) {

    select = document.getElementById("artist-select")= true;
    select = a.value;
    console.log(select)

    request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works?filter[artist_id]='+a.value, true)

    request.onload = function() {  
        console.log(request);
        // Begin accessing JSON data here 
        var info = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            info.data.forEach(works => {
                console.log(works)
            })
        } else {
            console.log('error')
        }   
    }
    request.send() 
}

//Material Request
var request4 = new XMLHttpRequest()

request4.open('GET', 'https://friedlander.kikirpa.be/api/v1/works', true)

request4.onload = function() {  
    console.log(request4);
    // Begin accessing JSON data here 
    var info = JSON.parse(this.response)
    if (request4.status >= 200 && request4.status < 400) {
        console.log(info.filterdata.materials);
    } else {
        console.log('error')
    }

    var selectMaterial = document.getElementById("material-select");
    myMaterials = info.filterdata.materials
    console.log(myMaterials[1].name)

    for(number in myMaterials)  {
        option = document.createElement('OPTION'),
        txt = document.createTextNode(myMaterials[number].name);
        option.appendChild(txt);
        option.setAttribute('value', myMaterials[number].id);
        selectMaterial.insertBefore(option, selectMaterial.lastChild);   
    }
}  
request4.send() 

function materialFunction(a) {

    selectMaterial = document.getElementById("material-select")= true;
    selectMaterial = a.value;
    console.log(selectMaterial)

    request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works?filter[material_id]='+a.value, true)

    request.onload = function() {  
        console.log(request);
        // Begin accessing JSON data here 
        var info = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            info.data.forEach(works => {
                console.log(works)
            })
        } else {
            console.log('error')
        }    
    }
    request.send() 
}




    






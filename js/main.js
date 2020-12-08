/*https://ajaxclass-1ca34.firebaseio.com/israel*/

let newPostEntry = {
    featured:true
}

let featuredPosts = []

$("input, textarea, select").change( event => {
    console.log(event.target)
    let property = event.target.name
    let value = event.target.type === "checkbox" 
                ? !newPostEntry.featured 
                : event.target.value
    newPostEntry[property] = value
    console.log(newPostEntry)
})

const saveEntry = entryData => {
    $.ajax({
        url: "https://ajaxclass-1ca34.firebaseio.com/israel/posts/.json",
        method: "POST",
        data: JSON.stringify(entryData),
        success: response => {
            console.log( response )
            getPosts()
            $("#uploadPost").modal("hide")
        },
        error: error => {
            console.log( error )
        }
    });
}

$("#save-post").click(()=> {
    saveEntry(newPostEntry)
})

const filterData = ( dataToFilter, criteria, value ) => {
    let result = []
    for( key in dataToFilter ){
        console.log( dataToFilter[key][criteria])
        dataToFilter[key][criteria] === value 
            ? result.push(dataToFilter[key])
            : null
    }
    return result
}

const printPosts = dataToPrint => {
    $(".general-posts-wrapper").empty()
    for( key in dataToPrint){
        console.log("key", key)
        console.log("object ", dataToPrint[key])
        let { title, text, author, picUrl } = dataToPrint[key]

        let entryHTML = `
            <div class="card mb-3">
                <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${picUrl}" class="card-img" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${text}</p>
                    <p class="card-text">
                        <small class="text-muted author">${author}</small><small class="text-muted date">07 dic 2020</small>
                        <div class="btn btn-warning btn-sm" data-entry-key = ${key}>Leer más tarde</div>
                    </p>
                    </div>
                </div>
                </div>
            </div>
        `

        $(".general-posts-wrapper").append( entryHTML )
    }
}

const printFeaturedPosts = dataToPrint => {
    $(".featured-posts-wrapper").empty()
    dataToPrint.forEach( entry => {
        let { title, text, author } = entry
        let featuredHTML = `
            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <h5 class="card-title">${ title }</h5>
                    <p class="card-text">${ text }</p>
                    <div class="card-footer">
                        <span class="author">${ author }</span>
                        <span class="date">7 dic 2020</span>
                    </div>
                </div>
            </div>
        `
        $(".featured-posts-wrapper").append(featuredHTML)
    })
    
}

const getPosts = () => {
    $.ajax({
        url: "https://ajaxclass-1ca34.firebaseio.com/israel/posts/.json",
        method: "GET",
        success: response => {
            console.log( response )
            printPosts(response)
            featuredPosts = filterData( response, "featured", true)
            printFeaturedPosts(featuredPosts)
        },
        error: error => {
            console.log( error )
        }
    });
}



getPosts()

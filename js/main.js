/*https://ajaxclass-1ca34.firebaseio.com/israel*/

let newPostEntry = {
    featured:true
}

let postsCollection = {}

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
    let d = new Date()
    let date = `${d.getDate()}/${d.getMonth()  + 1}/${d.getFullYear()}`
    entryData = {...entryData, date}
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

const printFilteredResults = dataToPrint => {
    $(".general-posts-wrapper").empty()
    dataToPrint.forEach( result => {
        let { title, text, author, picUrl, date } = result
    
        let entryHTML = `
            <div class="card mb-3" >
                <div class="row no-gutters">
                <div class="col-md-4">
                    <div class="post-img" style="background-image: url(${picUrl})"></div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${text}</p>
                    <p class="card-text">
                        <small class="text-muted author">${author}</small><small class="text-muted date">${date}</small>
                        <div class="btn btn-warning btn-sm" data-entry-key = ${key}>Leer más tarde</div>
                    </p>
                    </div>
                </div>
                </div>
            </div>
        `

        $(".general-posts-wrapper").append( entryHTML )
    })
}

$(".filter-list li").click( event => {
    let criteria = $(event.target).data("filter-criteria")
    console.log(criteria)
    let value = $(event.target).data("filter-value")
    console.log(value)
    let filterResult = filterData( postsCollection, criteria, value )

    filterResult.length !== 0 ? printFilteredResults( filterResult ) : $(".general-posts-wrapper").empty().html("<p class='p-3 bg-warning'>El filtro no entregó resultados</p>")
    
    console.log( filterResult)
    
})


const printPosts = dataToPrint => {
    $(".general-posts-wrapper").empty()
    for( key in dataToPrint){
        console.log("key", key)
        console.log("object ", dataToPrint[key])
        let { title, text, author, picUrl, date } = dataToPrint[key]

        let entryHTML = `
            <div class="card mb-3" data-entry-key=${key}>
                <div class="row no-gutters">
                <div class="col-md-4">
                    <div class="post-img" style="background-image: url(${picUrl})"></div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${text}</p>
                    <p class="card-text">
                        <small class="text-muted author">${author}</small><small class="text-muted date ml-3">${date}</small>
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
        let { title, text, author,date } = entry
        let featuredHTML = `
            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <h5 class="card-title">${ title }</h5>
                    <p class="card-text">${ text }</p>
                    <div class="card-footer">
                        <span class="author">${ author }</span>
                        <span class="date">${date}</span>
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
            postsCollection = response
            printPosts(response)
            featuredPosts = filterData( response, "featured", true)
            printFeaturedPosts(featuredPosts)
            addCardListener()
        },
        error: error => {
            console.log( error )
        }
    });
}

const addCardListener = () => {
    $(".general-posts-wrapper .card").click( event => {
        let entryKey = $(event.target).closest(".card").data("entry-key")
        console.log( event.target )
        console.log( entryKey )
        let selectedPost = postsCollection[entryKey]
        console.log( selectedPost )

        let { title, text, author, date, picUrl } = selectedPost;
        $("#detailModal .detail-cover").css({"background-image":`url(${picUrl})`})
        $("#detailModal .post-title").text(title)
        $("#detailModal .post-text").text(text)
        $("#detailModal .author").text(author)
        $("#detailModal .date").text(date)

        $("#detailModal").modal("show")
    })
}



getPosts()

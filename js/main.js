/*https://ajaxclass-1ca34.firebaseio.com/israel*/

let newPostEntry = {}

$("input, textarea, select").change( event => {
    console.log(event.target)
    let property = event.target.name
    let value = event.target.value
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
        },
        error: error => {
            console.log( error )
        }
    });
}

$("#save-post").click(()=> {
    saveEntry(newPostEntry)
})
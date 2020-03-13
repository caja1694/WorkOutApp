console.log("inside js.file")
document.addEventListener("DOMContentLoaded", function(){
    console.log("inside js.file")

    const btn = document.getElementById("showArticleBtn");

    btn.addEventListener("click", function(event){
        console.log("clicked btn");
        
    })
 
})

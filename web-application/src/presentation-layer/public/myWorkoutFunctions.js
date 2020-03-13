console.log("inside js.file")
document.addEventListener("DOMContentLoaded", function(){
    console.log("inside js.file")

    const addWorkoutBtn = document.getElementById("addWorkoutBtn");

    addWorkoutBtn.addEventListener("click", function(event){
        console.log("clicked btn");
    })
 
})
console.log("inside js.file")
document.addEventListener("DOMContentLoaded", function(){
    console.log("DOMContentLoaded")

    const addbtn = document.getElementById("addExerciseBtn")
    const workoutContainer = document.getElementById("workoutContainer")

    //parent element
    const exerciseList = document.getElementById("exerciseList")

    var items = [
        createListItem("dom"),
        createListItem("dom"),
        createListItem("dom")
    ];

    appendChildren(exerciseList, items)

    addbtn.addEventListener("click", createListItem())


})


console.log('******** inside js.file');
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded');

  const addbtn = document.getElementById('addExerciseBtn');
  const workoutForm = document.getElementById('workoutForm');
  const exerciseInput = document.getElementById('exerciseInput');

  addbtn.addEventListener('click', function (event) {
    console.log('inside func');
    event.preventDefault();

    var newDiv1 = document.createElement('div');
    newDiv1.setAttribute('class', 'column is-one-quarter');

    var newDiv2 = document.createElement('div');
    newDiv2.setAttribute('class', 'column is-one-quarter');

    var newDiv3 = document.createElement('div');
    newDiv3.setAttribute('class', 'column is-one-quarter');

    var newDiv4 = document.createElement('div');
    newDiv4.setAttribute('class', 'column is-one-quarter');

    var inputExercise = document.createElement('input');
    inputExercise.setAttribute('name', 'exercise');
    inputExercise.setAttribute('class', 'input');

    var inputTimeOrWeight = document.createElement('input');
    inputTimeOrWeight.setAttribute('name', 'timeOrWeight');
    inputTimeOrWeight.setAttribute('class', 'input');

    var inputSets = document.createElement('input');
    inputSets.setAttribute('name', 'sets');
    inputSets.setAttribute('class', 'input');

    var inputReps = document.createElement('input');
    inputReps.setAttribute('name', 'reps');
    inputReps.setAttribute('class', 'input');

    newDiv1.appendChild(inputExercise);
    newDiv2.appendChild(inputTimeOrWeight);
    newDiv3.appendChild(inputSets);
    newDiv4.appendChild(inputReps);

    workoutForm.appendChild(newDiv1);
    workoutForm.appendChild(newDiv2);
    workoutForm.appendChild(newDiv3);
    workoutForm.appendChild(newDiv4);
  });
});

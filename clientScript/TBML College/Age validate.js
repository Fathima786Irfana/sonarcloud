 frappe.ui.form.on('TBML College', {
  refresh(frm) {
    frm.fields_dict['age'].wrapper.innerHTML += `
      <label for="age">Enter your age: </label>
      <input type="number" id="age" />
      <button onclick="validateAge()">Submit</button>
      <p id="result"></p>
    `;

    function validateAge() {
      var ageInput = document.getElementById("age");
      var resultElement = document.getElementById("result");
      var age = parseInt(ageInput.value);

      if (age >= 18) { // Use >= to include age 18
        resultElement.textContent = "You are 18 or older. Validation applied.";
      } else {
        resultElement.textContent = "You must be 18 or older to proceed.";
      }
    }
  }
});

 
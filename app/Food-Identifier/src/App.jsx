import axios from "axios";

import "./App.css";

function App() {

  const handleSubmit = (e) => {
    const file = e.target.files[0]
    var reader = new FileReader

    reader.onloadend = () => {
        var image = reader.result
        document.body.style.backgroundImage = "url("+image+")"
        // Parameters
        const params = {image}
        axios
        .post('http://localhost:8080/prediction', params)
        .then((res) => {
        const data = res.data.data
        const parameters = JSON.stringify(params)
        setNutritionLabel(data.prediction)
        })
        .catch((error) => alert(`Error: ${error.message}`)) 
    }  

    reader.readAsDataURL(file)
  }

  function getNutritionData(pred) {
    const apiKey = "bYC8ueMGhttsf7ZuTSNtAaE0es5YmkFIrp4BiRTD"
    const api_url = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=' + apiKey + '&query=' + pred + '&dataType=Survey (FNDDS)'
    return fetch(api_url).then(data => data.json())
  }

  function setNutritionLabel(pred) {
    if (pred !== 'Not Recognized') {
      getNutritionData(pred).then(data => {
        console.log(data.foods)
        const cal = data.foods[0].foodNutrients[3].value;
        const fat = data.foods[0].foodNutrients[1].value;
        const sat_fat = data.foods[0].foodNutrients[43].value;
        const chol = data.foods[0].foodNutrients[42].value;
        const carb = data.foods[0].foodNutrients[2].value;
        const na = data.foods[0].foodNutrients[15].value;
        const fiber = data.foods[0].foodNutrients[9].value;
        const sugar = data.foods[0].foodNutrients[8].value;
        const protein = data.foods[0].foodNutrients[0].value;
        
        document.getElementById("nut_title").innerHTML = ("Nutrition Label (" + data.foods[0].description + ")");
        document.getElementById("cal").innerHTML = cal;
        document.getElementById("fat").innerHTML = fat + 'g';
        document.getElementById("sat_fat").innerHTML = sat_fat + 'g';
        document.getElementById("chol").innerHTML = chol + 'mg';
        document.getElementById("carb").innerHTML = carb + 'g';
        document.getElementById("na").innerHTML = na + 'mg';
        document.getElementById("fiber").innerHTML = fiber + 'g';
        document.getElementById("sugar").innerHTML = sugar + 'g';
        document.getElementById("protein").innerHTML = protein + 'g';
      })
    } else {
      alert("Food not recognized")
    }
  }


  return (
    <div className="App">
      <div className="header">
        <h1>Input a Picture</h1>
        <div className="upload">
          <input type="file" accept=".jpeg, .jpg" onChange={handleSubmit} />
        </div>
      </div>
    
      <div className="nutrition-label">
        <h1 id="nut_title">Nutrition Facts</h1>
        <table>
          <tbody>
            <tr>
              <td>Calories</td>
              <td id='cal'>95</td>
            </tr>
            <tr>
              <td>Total Fat</td>
              <td id='fat'>0.3g</td>
            </tr>
            <tr>
              <td>Saturated Fat</td>
              <td id='sat_fat'>0.1g</td>
            </tr>
            <tr>
              <td>Cholesterol</td>
              <td id='chol'>0mg</td>
            </tr>
            <tr>
              <td>Sodium</td>
              <td id='na'>1mg</td>
            </tr>
            <tr>
              <td>Total Carbohydrate</td>
              <td id='carb'>25g</td>
            </tr>
            <tr>
              <td>Dietary Fiber</td>
              <td id='fiber'>4g</td>
            </tr>
            <tr>
              <td>Sugars</td>
              <td id='sugar'>19g</td>
            </tr>
            <tr className="bottom-row">
              <td>Protein</td>
              <td id='protein'>0.5g</td>
            </tr>
          </tbody>
        </table>
        <div className="footer">
          * Percent Daily Values are based on a 2,000 calorie diet.
        </div>
      </div>
    </div>
  );
}
   
export default App;

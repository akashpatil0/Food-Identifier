import React, { useEffect, useState } from "react";
import axios from "axios";

const NutritionFacts = ({ foodName }) => {
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        {
          query: "tomato",
        },
        {
          headers: {
            "x-app-id": "181d71d9",
            "x-app-key": "80c28984cab26c118e5636377ff5913b",
            "x-remote-user-id": "0",
          },
        }
      );
      console.log(data);
    };

    fetch();
  }, []);

  return <div>NutritionFacts</div>;
};

export default NutritionFacts;

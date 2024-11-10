// function categorizePropertyTypes() {
//   const categories = {
//     apartment: [
//       "Apartment",
//       "Ground Floor Apartment",
//       "Middle Floor Apartment",
//       "Top Floor Apartment",
//       "Ground Floor Studio",
//       "Penthouse",
//       "Penthouse Duplex",
//     ],
//     house: [
//       "Villa",
//       "Bungalow",
//       "Semi-Detached House",
//       "Townhouse",
//       "Finca - Cortijo",
//     ],
//     commercialProperty: ["Apartment Complex", "Restaurant", "Hotel", "Hostel"],
//     land: ["Residential Plot"],
//   };

//   return categories;
// }

// function populatePropertyTypeDropdown(categorizedTypes) {
//   const dropdown = document.getElementById("propertyType");

//   // Clear existing options
//   dropdown.innerHTML = '<option value="">Any</option>';

//   // Helper function to add options under an optgroup
//   function addOptionsToGroup(groupName, types) {
//     const optgroup = document.createElement("optgroup");
//     optgroup.label = groupName;

//     types.forEach((type) => {
//       const option = document.createElement("option");
//       option.value = type;
//       option.textContent = type;
//       optgroup.appendChild(option);
//     });

//     dropdown.appendChild(optgroup);
//   }

//   // Populate dropdown with categorized types
//   addOptionsToGroup("Apartment", categorizedTypes.apartment);
//   addOptionsToGroup("House", categorizedTypes.house);
//   addOptionsToGroup("Commercial Property", categorizedTypes.commercialProperty);
//   addOptionsToGroup("Land", categorizedTypes.land);
// }

// // Directly use hardcoded types without XML loading
// const categorizedTypes = categorizePropertyTypes();
// populatePropertyTypeDropdown(categorizedTypes);

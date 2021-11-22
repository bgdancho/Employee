"use strict";

window.addEventListener("DOMContentLoaded", (event) => {
  const searchField = document.querySelector(".search-field");
  const table = document.querySelector(".table");
  const tbody = document.querySelector(".tbody");
  let prev = document.querySelector(".btn_prev");
  let next = document.querySelector(".btn_next");
  let tableNav = document.querySelector(".table_nav");
  let pageIndicator = document.querySelector(".page_indicator");
  let btnUpdate = document.querySelector(".btn_update");
  let btnAdd = document.querySelector(".btn_add");
  let employeeUpdate = document.querySelector(".update_employee");
  let employeeId = document.querySelector(".update_id");
  let employeeName = document.querySelector(".update_name");
  let employeeAddress = document.querySelector(".update_address");
  let employeeTechnology = document.querySelector(".update_tech");
  let employeeAge = document.querySelector(".update_age");
  let updateDeleteId = document.querySelector(".update_delete_id");

  let currentPage = 1;
  let totalPages = 0;

  const generateTable = function (array) {
    for (let i = 0; i < array.length; i++) {
      let row = document.createElement("tr");
      let { id, name, technology, address, age } = array[i];
      let personInfo = [id, name, technology, address, age];

      for (let k = 0; k < personInfo.length; k++) {
        let cell = document.createElement("td");
        let cellText = document.createTextNode(`${personInfo[k]}`);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      let cellUpdate = document.createElement("td");

      let buttonUpdate = generateUpdateIcon(cellUpdate);

      buttonUpdate.classList.add("updateButton");
      buttonUpdate.classList.add("update-cell");
      buttonUpdate.id = id;
      cellUpdate.appendChild(buttonUpdate);
      row.appendChild(cellUpdate);

      let cellDelete = document.createElement("td");
      let buttonDelete = generateDeleteIcon(cellDelete);

      buttonDelete.classList.add("deleteButton");
      buttonDelete.id = id;
      cellDelete.appendChild(buttonDelete);
      row.appendChild(cellDelete);

      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableNav.classList.remove("hidden");
    table.classList.remove("hidden");
  };

  const search = function () {
    tableNav.classList.add("hidden");
    let filter = searchField.value;
    let array = [];

    fetch(
      `http://localhost:8080/employees/?filter=${filter}&page=${currentPage}&pageSize=${10}`
    ).then(function (response) {
      tbody.innerHTML = "";
      if (response.ok) {
        response.json().then(function (data) {
          if (currentPage === 0) {
          }
          [...array] = data.employeeList;
          totalPages = data.totalPages - 1;

          if (currentPage === 0) {
            prev.disabled = true;
          }

          if (currentPage === totalPages) {
            next.disabled = true;
          }
          pageIndicator.textContent = currentPage + 1;
          if (array.length != 0) {
            generateTable(array);
            generateDeleteListeners();
            generateUpdateListeners();
          }
        });
      }
    });
  };

  const generateDeleteListeners = function () {
    let deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        deleteEmployee(parseInt(button.id));
      });
    });
  };

  const deleteEmployee = function (id) {
    fetch(`http://localhost:8080/employees/${id}`, {
      method: "DELETE",
    }).then(search);
  };

  const nextPage = function () {
    if (currentPage < totalPages) {
      currentPage++;
      pageIndicator.innerHTML = currentPage;
      search(currentPage);
      prev.disabled = false;
    }
  };

  const prevPage = function () {
    if (currentPage > 0) {
      currentPage--;
      pageIndicator.innerHTML = currentPage;
      search(currentPage);
      next.disabled = false;
    }
  };
  const fieldSearch = function () {
    currentPage = 0;
    totalPages = 0;
    prev.disabled = false;
    next.disabled = false;
    deleteDataNewEmployee();
    search();
  };

  next.addEventListener("click", nextPage);
  prev.addEventListener("click", prevPage);

  searchField.addEventListener("input", fieldSearch);

  const generateUpdateListeners = function () {
    let updateButtons = document.querySelectorAll(".updateButton");
    updateButtons.forEach((button) => {
      button.addEventListener("click", function () {
        getEmployeeInfo(parseInt(button.id));
      });
    });
  };

  const getEmployeeInfo = function (id) {
    fetch(`http://localhost:8080/employees/${id}`).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          employeeUpdate.classList.remove("hidden");
          let { id, name, technology, address, age } = data;
          employeeId.value = id;
          employeeName.value = name;
          employeeTechnology.value = technology;
          employeeAddress.value = address;
          employeeAge.value = age;
        });
      }
    });
  };

  const showAddNewEmployee = function () {
    employeeUpdate.classList.remove("hidden");
    btnUpdate.textContent = "Add Employee";
    updateDeleteId.classList.add("hidden");
    updateDeleteId.value = "";
  };

  const deleteDataNewEmployee = function () {
    employeeId.value = 0;
    employeeName.value = "";
    employeeTechnology.value = "";
    employeeAddress.value = "";
    employeeAge.value = "";
    employeeUpdate.classList.add("hidden");
    btnUpdate.textContent = "Update Employee";
  };

  btnAdd.addEventListener("click", showAddNewEmployee);

  btnUpdate.addEventListener("click", function () {
    let newEmployee = new Object();
    newEmployee.id = "";
    newEmployee.name = employeeName.value;
    newEmployee.technology = employeeTechnology.value;
    newEmployee.address = employeeAddress.value;
    newEmployee.age = employeeAge.value;

    if (btnUpdate.textContent === "Add Employee") {
      fetch(`http://localhost:8080/employees/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      }).then(function () {
        deleteDataNewEmployee();
        fieldSearch();
      });
    } else {
      updateDeleteId.classList.remove("hidden");
      newEmployee.id = employeeId.value;
      fetch(`http://localhost:8080/employees/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      }).then(function () {
        employeeUpdate.classList.add("hidden");
        deleteDataNewEmployee();
        fieldSearch();
      });
    }
  });
});

function generateUpdateIcon(cell) {
  const iconUpdate = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconUpdate.setAttribute("fill", "none");
  iconUpdate.setAttribute("viewBox", "0 0 24 24");
  iconUpdate.setAttribute("stroke", "currentColor");
  iconUpdate.classList.add("update-icon");

  iconPath.setAttribute(
    "d",
    "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
  );
  iconPath.setAttribute("stroke-linecap", "round");
  iconPath.setAttribute("stroke-linejoin", "round");
  iconPath.setAttribute("stroke-width", "2");
  iconUpdate.appendChild(iconPath);
  return cell.appendChild(iconUpdate);
}

function generateDeleteIcon(cell) {
  const iconDelete = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconDelete.setAttribute("fill", "none");
  iconDelete.setAttribute("viewBox", "0 0 24 24");
  iconDelete.setAttribute("stroke", "currentColor");
  iconDelete.classList.add("update-icon");

  iconPath.setAttribute(
    "d",
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  );
  iconPath.setAttribute("stroke-linecap", "round");
  iconPath.setAttribute("stroke-linejoin", "round");
  iconPath.setAttribute("stroke-width", "2");
  iconDelete.appendChild(iconPath);
  return cell.appendChild(iconDelete);
}

"use strict";

window.addEventListener("DOMContentLoaded", (event) => {
  const searchField = document.querySelector(".search-field");
  const table = document.querySelector(".table");
  const tbody = document.querySelector(".tbody");
  let updateButtons = document.querySelectorAll(".updateButton");
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
      let buttonUpdate = document.createElement("button");
      buttonUpdate.innerHTML = "Update";
      buttonUpdate.classList.add("updateButton");
      buttonUpdate.id = id;
      cellUpdate.appendChild(buttonUpdate);
      row.appendChild(cellUpdate);

      let cellDelete = document.createElement("td");
      let buttonDelete = document.createElement("Button");
      buttonDelete.innerHTML = "Delete";
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
      fetch(`http://localhost:8080/employees`, {
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

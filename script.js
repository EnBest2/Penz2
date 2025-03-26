let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let savings = parseFloat(localStorage.getItem("savings") || "0");

function update() {
  let balance = 0;
  let list = document.getElementById("list");
  list.innerHTML = "";
  transactions.forEach((tx) => {
    let li = document.createElement("li");
    li.innerText = `${tx.date} - ${tx.title} - ${tx.amount.toLocaleString()} Ft [${tx.category}]`;
    list.appendChild(li);
    if (["Fizetés", "Gift"].includes(tx.category)) {
      balance += tx.amount;
    } else if (["Berakás"].includes(tx.category)) {
      balance -= tx.amount;
      savings += tx.amount;
    } else if (["Kivétel"].includes(tx.category)) {
      balance += tx.amount;
      savings -= tx.amount;
    } else if (["Kp be"].includes(tx.category)) {
      savings += tx.amount;
    } else if (["Kp ki"].includes(tx.category)) {
      savings -= tx.amount;
    } else {
      balance -= tx.amount;
    }
  });
  document.getElementById("balance").innerText = balance.toLocaleString();
  document.getElementById("savings").innerText = savings.toLocaleString();
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("savings", savings.toString());
}

function add() {
  let title = document.getElementById("title").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;

  if (!title || isNaN(amount) || !date) {
    alert("Tölts ki minden mezőt: név, összeg, dátum!");
    return;
  }

  transactions.push({ title, amount, date, category });
  update();
}

update();
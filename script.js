let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let savings = parseFloat(localStorage.getItem("savings") || "0");

function formatFt(n) {
    return n.toLocaleString("hu-HU");
}

function save() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("savings", savings.toString());
}

function update() {
    let balance = 0;
    document.getElementById("list").innerHTML = "";
    transactions.forEach((t, i) => {
        if (t.category === "Fizetés" || t.category === "Gift") balance += t.amount;
        else if (["Berakás"].includes(t.category)) { balance -= t.amount; savings += t.amount; }
        else if (["Kivétel"].includes(t.category)) { balance += t.amount; savings -= t.amount; }
        else if (["Kp be"].includes(t.category)) savings += t.amount;
        else if (["Kp ki"].includes(t.category)) savings -= t.amount;
        else balance -= t.amount;

        let li = document.createElement("li");
        li.innerHTML = `<strong>${t.category}</strong> - ${formatFt(t.amount)} Ft<br>${t.date} | ${t.title}
            <button onclick="remove(${i})">Törlés</button>`;
        document.getElementById("list").prepend(li);
    });
    document.getElementById("balance").innerText = formatFt(balance);
    document.getElementById("savings").innerText = formatFt(savings);
    save();
}

function add() {
    let t = {
        title: document.getElementById("title").value,
        amount: parseInt(document.getElementById("amount").value),
        date: document.getElementById("date").value,
        category: document.getElementById("category").value
    };
    if (t.title && t.amount && t.date && t.category) {
        transactions.push(t);
        update();
    }
}

function remove(index) {
    let t = transactions[index];
    if (t.category === "Fizetés" || t.category === "Gift") {}
    else if (["Berakás"].includes(t.category)) { savings -= t.amount; }
    else if (["Kivétel"].includes(t.category)) { savings += t.amount; }
    else if (["Kp be"].includes(t.category)) savings -= t.amount;
    else if (["Kp ki"].includes(t.category)) savings += t.amount;
    transactions.splice(index, 1);
    update();
}

function showSummary() {
    let summary = {};
    let month = new Date().toISOString().slice(0,7);
    transactions.forEach(t => {
        if (t.date.startsWith(month)) {
            summary[t.category] = (summary[t.category] || 0) + t.amount;
        }
    });
    alert(Object.entries(summary).map(([k,v]) => `${k}: ${formatFt(v)} Ft`).join("\n"));
}

function showMonthlyBreakdown() {
    let breakdown = {};
    transactions.forEach(t => {
        let m = t.date.slice(0,7);
        if (!breakdown[m]) breakdown[m] = {};
        breakdown[m][t.category] = (breakdown[m][t.category] || 0) + t.amount;
    });
    let msg = "";
    for (let month in breakdown) {
        msg += month + "\n";
        for (let cat in breakdown[month]) {
            msg += `  ${cat}: ${formatFt(breakdown[month][cat])} Ft\n`;
        }
    }
    alert(msg);
}

update();

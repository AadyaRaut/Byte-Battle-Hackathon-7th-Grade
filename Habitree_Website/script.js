let totalPoints = 0;

function addEntry() {
  let name = document.getElementById("name").value;
  let bottles = Number(document.getElementById("bottles").value);

  if (name === "" || bottles <= 0) {
    alert("Enter valid details!");
    return;
  }

  // Each bottle = 2 point
  totalPoints += bottles;
  document.getElementById("total").innerText = totalPoints;

  // Convert points to rewards
  let points = totalPoints;

  let trees = Math.floor(points / 6);
  points = points % 6;

  let shrubs = Math.floor(points / 4);
  points = points % 4;

  let herbs = Math.floor(points / 2);

  document.getElementById("herbs").innerText = herbs;
  document.getElementById("shrubs").innerText = shrubs;
  document.getElementById("trees").innerText = trees;

  // Show entry
  let list = document.getElementById("list");
  list.innerHTML += `
    <div class="entry">
      🌱 <b>${name}</b> refilled <b>${bottles}</b> bottles  
      → earned <b>${bottles} Green Points</b>
    </div>
  `;

  // Reset fields
  document.getElementById("name").value = "";
  document.getElementById("bottles").value = "";
}

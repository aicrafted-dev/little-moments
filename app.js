
const fields = ["weather", "person", "color", "note"];

const today = new Date();
const dateKey = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

const storageKey = "little-moments-" + dateKey;

const dateElement = document.getElementById("today");
const statusElement = document.getElementById("status");

dateElement.textContent = today.toLocaleDateString("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

let data = {};
let saveTimer;

async function loadData() {
  try {
    const result = await chrome.storage.local.get(storageKey);
    data = result[storageKey] || {};

    fields.forEach(id => {
      document.getElementById(id).value = data[id] || "";
    });
  } catch (error) {
    statusElement.textContent = "读取失败";
  }
}

async function saveData() {
  fields.forEach(id => {
    data[id] = document.getElementById(id).value;
  });

  statusElement.textContent = "保存中…";

  try {
    await chrome.storage.local.set({
      [storageKey]: data
    });
    statusElement.textContent = "♡ 已保存";
  } catch (error) {
    statusElement.textContent = "保存失败";
  }
}

fields.forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    statusElement.textContent = "编辑中…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveData, 250);
  });
});

loadData();

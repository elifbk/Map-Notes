import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, detecType, setStorage } from "./helpers.js";

//! HTML'den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! Olay İzleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//! Ortak Kullanım Alanı
var map;
var layerGroup = [];
var notes = JSON.parse(localStorage.getItem("notes")) || [];
var coords = [];

/*
 * Kullanıcının konumunu öğrenmek için getCurrentPosition methodunu kullandık ve bizden iki parametre istedi:
 * 1.Kullanıcı konum iznini verdiğinde çalışacak fonksiyondur.
 * 2.Kullanıcı konum iznini vermediğinde çalışacak fonksiyondur.
 */

navigator.geolocation.getCurrentPosition(loadMap, errorFunction);
function errorFunction() {
  console.log("hata");
}
//* Haritaya tıklanınca çalışır.
function onMapClick(e) {
  //* Haritaya tıklandığında form bileşeninin display özelliğini flex yaptık.
  form.style.display = "flex";

  //* Haritada tıkladığımız yerin koordinatlarını coords dizisi içerisine aktardık.
  coords = [e.latlng.lat, e.latlng.lng];
}
//* Kullanıcının konumuna göre haritayı ekrana aktarır.
function loadMap(e) {
  //* 1.Haritanın kurulumu
  map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
  L.control;
  //* 2.Haritanın nasıl gözükeceğini belirler
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  //* Haritada ekrana basılacak imleçleri tutacağımız katman
  layerGroup = L.layerGroup().addTo(map);

  //* Local'den gelen notes'ları listeleme
  renderNoteList(notes);

  //* Haritada bir tıklama olduğunda çalışacak fonksiyon
  map.on("click", onMapClick);
}

function renderMarker(item) {
  // L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
  // Marker'ı oluşturur
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup) // imleçlerin olduğu katmana ekler
    .bindPopup(`${item.desc}`); // üzerine tıklanınca popup ekleme
}

function handleSubmit(e) {
  e.preventDefault(); //* Sayfanın yenilenmesini engeller
  console.log(e);
  const desc = e.target[0].value; // Formun içerisindeki text inputunun değerini alma
  const date = e.target[1].value; // Formun içerisindeki date inputunun değerini alma
  const status = e.target[2].value; // Formun içerisindeki select yapısının değerini alma

  notes.push({
    id: uuidv4(),
    desc,
    date,
    status,
    coords,
  });

  //* Local storage güncelle
  setStorage(notes);

  //* renderNoteList fonksiyonuna parametre olarak notes dizisini gönderdik.
  renderNoteList(notes);

  //* Form gönderildiğinde form alanını kapat
  form.style.display = "none";
}

//* Ekrana notları aktaracak fonksiyon
function renderNoteList(item) {
  //* Notlar (list) alanını temizle
  list.innerHTML = "";
  //* Marker'ları temizler
  layerGroup.clearLayers();
  //* Herbir not için li etiketi oluşturur ve içerisini günceller.
  item.forEach((item) => {
    const listElement = document.createElement("li"); //* bir li etiketi oluşturur.
    listElement.dataset.id = item.id; //* li etiketine data-id özelliği ekleme
    listElement.innerHTML = `
        <div>
          <p>${item.desc}</p>
          <p><span>Tarih:</span> ${item.date}</p>
          <p><span>Durum:</span> ${detecType(item.status)}</p>
        </div>
        <i class="bi bi-x" id="delete"></i>
        <i class="bi bi-airplane-fill" id="fly"></i>`;

    list.insertAdjacentElement("afterbegin", listElement);

    renderMarker(item);
  });
}
//* Notes alanında tıklanma olayını izler
function handleClick(e) {
  //* Güncellenecek elemanın id'sini öğrenmek için parentElement yöntemini kullandık
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    //* id'sini bildiğimiz elemanı diziden filter yöntemi kullanarak kaldırdık
    notes = notes.filter((note) => note.id != id);
    console.log(notes);
    setStorage(notes); //* localStorage güncelle
    renderNoteList(notes); //* ekranı güncelle
  }

  if (e.target.id === "fly") {
    //* Tıkladığımız elemanın id'si ile dizi içerisindeki elemanlardan herhangi birinin id'si eşleşirse bul.
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords); //* Haritayı bulduğumuz elemana yönlendirmesi için flyTo methodunu kullandık.
  }
}

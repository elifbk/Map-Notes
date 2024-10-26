//* Tipi analiz edip ona göre fonksiyonun çağrıldığı yere, tipe denk gelen açıklamayı gönderir.

export const detecType = (type) => {
  switch (type) {
    case "park":
      return "Park Yeri";
    case "home":
      return "Ev";
    case "job":
      return "İş";
    case "goto":
      return "Ziyaret";
  }
};
//* Local storage'ı güncelleyecek fonksiyon
export const setStorage = (data) => {
  //* Veriyi locale göndermek için stringe çevirme
  const strData = JSON.stringify(data);

  //* localStorage veriyi gönderdik.
  localStorage.setItem("notes", strData);
};

var carIcon = L.icon({
  iconUrl: "images/car.png",
  iconSize: [50, 60],
});
var homeIcon = L.icon({
  iconUrl: "images/home-marker.png",
  iconSize: [50, 60],
});
var jobIcon = L.icon({
  iconUrl: "images/job.png",
  iconSize: [50, 60],
});
var visitIcon = L.icon({
  iconUrl: "images/visit.png",
  iconSize: [50, 60],
});

export const detecIcon = (type) => {
  switch (type) {
    case "park":
      return carIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "goto":
      return visitIcon;
  }
};

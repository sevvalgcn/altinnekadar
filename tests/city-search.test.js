const test = require("node:test");
const assert = require("node:assert/strict");
const { filterCities, initCityTypeahead } = require("../public/city-search.js");

const cities = {
  sakarya: "Sakarya",
  samsun: "Samsun",
  sanliurfa: "Şanlıurfa",
  istanbul: "İstanbul"
};

test("şehir adı yazıldığında yalnızca eşleşen tahminleri döndürür", () => {
  assert.deepEqual(filterCities(cities, "sak"), [["sakarya", "Sakarya"]]);
  assert.deepEqual(filterCities(cities, "SAN"), [["sanliurfa", "Şanlıurfa"]]);
});

test("arama kutusuna yazınca önerileri gösterir ve seçim şehir sayfasını açar", () => {
  const listeners = {};
  const input = {
    value: "",
    addEventListener(type, handler) { listeners[type] = handler; },
    setAttribute() {},
    focus() {}
  };
  const suggestions = {
    hidden: true,
    innerHTML: "",
    addEventListener(type, handler) { listeners[`suggestions:${type}`] = handler; }
  };
  let opened = "";

  initCityTypeahead({
    input,
    suggestions,
    cities,
    navigate: url => { opened = url; }
  });

  input.value = "sak";
  listeners.input();
  assert.equal(suggestions.hidden, false);
  assert.match(suggestions.innerHTML, /Sakarya/);
  assert.doesNotMatch(suggestions.innerHTML, /Samsun/);

  listeners["suggestions:click"]({
    target: { closest: () => ({ dataset: { citySlug: "sakarya" } }) }
  });
  assert.equal(opened, "/sakarya-altin-fiyatlari");
});

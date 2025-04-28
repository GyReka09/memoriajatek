import { kartyak } from "./kartyaLista.js";
import Kartya from "./Kartya.js";
export default class Jatekter {
  #kivalasztottKartyaLista;
  #kartyaLista;
  #db;
  #vegleges;
  constructor() {
    this.#db = 0;
    this.#kartyaLista = [];
    this.#kivalasztottKartyaLista = [];
    this.#vegleges = [];
    this.kever();
    this.fordit();
    this.init();
  }
  init() {
    const jatekterElem = document.querySelector(".jatekter");
    jatekterElem.innerHTML = "";
    this.#kartyaLista = [];
    kartyak.forEach((kartya) => {
      this.#kartyaLista.push(
        new Kartya(kartya.id, false, document.querySelector(".jatekter"))
      );
    });
    this.#vegleges = [];
  }
  kever() {
    let currentIndex = kartyak.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [kartyak[currentIndex], kartyak[randomIndex]] = [
        kartyak[randomIndex],
        kartyak[currentIndex],
      ];
    }
  }
  ellenorzes() {
    // Ellenőrizzük, hogy minden kártya felfordult-e

    if (this.#vegleges.length === 40) {
      setTimeout(() => {
        alert("Gratulálok, kész vagy! Újrakezdés!");
        this.kever(); // új keverés
        this.init(); // új játékot indítunk
      }, 500);
    }
  }

  fordit() {
    window.addEventListener("fordit", (event) => {
      const kartya = event.detail.kartya;

      if (kartya.getBlokkolt()) return;

      this.#db++;
      this.#kivalasztottKartyaLista.push(kartya);
      kartya.setAllapot();
      kartya.setBlokkolt(true);

      if (this.#db === 2) {
        this.#kartyaLista.forEach((k) => k.setBlokkolt(true));

        const [kartya1, kartya2] = this.#kivalasztottKartyaLista;

        if (kartya1.getId() === kartya2.getId()) {
          this.#vegleges.push(kartya1, kartya2);
          setTimeout(() => {
            this.#kartyaLista.forEach((k) => {
              if (
                k.getId() !== kartya1.getId() ||
                (k !== kartya1 && k !== kartya2)
              ) {
                k.setBlokkolt(false);
              }
            });

            this.#db = 0;
            this.#kivalasztottKartyaLista = [];
            this.ellenorzes();
          }, 1000);

          return;
        }

        setTimeout(() => {
          this.#kivalasztottKartyaLista.forEach((k) => {
            k.setAllapot();
            k.setBlokkolt(false);
          });

          this.#kartyaLista.forEach((k) => {
            if (!this.#kivalasztottKartyaLista.includes(k)) {
              k.setBlokkolt(false);
            }
          });

          this.#db = 0;
          this.#kivalasztottKartyaLista = [];
        }, 1000);
      }
    });
  }
}

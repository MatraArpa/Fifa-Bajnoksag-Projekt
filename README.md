# FIFA Elo Pontszámok Nyomon Követése

Ez a projekt a FIFA bajnokság játékosainak Elo pontszámait számolja és jeleníti meg. A CSV fájlból származó meccsadatokat dolgozza fel, kiszámítja a játékosok Elo pontszámait, és ezeket az idő folyamán vizualizálja diagramok segítségével.

## Funkciók

- **Elo Pontszám Számítás**: Az Elo pontszámokat a meccsek eredményei alapján számítja ki.
- **Adatvizualizáció**: Az Elo pontszámokat interaktív vonaldiagramon jeleníti meg.
- **Játékos Statisztikák**: Részletes statisztikákat mutat minden játékosról, beleértve a teljes meccsszámot, győzelmeket, vereségeket, döntetleneket, gólkülönbséget és az Elo pontszám történetét.

## Kezdő lépések

### Előfeltételek

A projekt futtatásához szükséged lesz:

- Egy webszerverre az HTML és JavaScript fájlok hosztolásához.
- Egy CSV fájlra (`stats.csv`), amely tartalmazza a meccsadatokat a következő oszlopokkal:
  - `Hazai játékos`
  - `Vendég játékos`
  - `Hazai gól`
  - `Vendég gól`
  - `Bajnoki / Playoff`
  - További oszlopok a játékosok Elo pontszámaihoz.

### Használat

1. Az oldal betöltésekor a script betölti és feldolgozza a `stats.csv` fájlt.
2. Válassz egy játékost a legördülő menüből, hogy megtekintsd a statisztikáit és az Elo pontszám történetét.
3. A diagram automatikusan frissül, hogy megjelenítse a kiválasztott játékos Elo pontszámát az idő folyamán.

## Fájlstruktúra

- `index.html`: A weboldal szerkezetét tartalmazó fő HTML fájl.
- `script.js`: A CSV adatok feldolgozását és a felhasználói felület frissítését végző JavaScript fájl.
- `style.css`: A weboldal stílusát tartalmazó CSS fájl.
- `stats.csv`: A meccsadatokat tartalmazó CSV fájl (a felhasználónak kell biztosítania).

## Működése

### JavaScript (script.js)

1. **CSV Adatfeldolgozás**:
   - A `processCsvData` függvény olvassa be a CSV fájlt, inicializálja az Elo tömböket minden játékos számára, és frissíti ezeket a tömböket a meccsek eredményei alapján.
   - A játékos statisztikák kiszámítása, beleértve a teljes meccsszámot, győzelmeket, vereségeket, döntetleneket, gólkülönbséget és Elo pontszámokat.

2. **Diagram Készítés**:
   - A `createChart` függvény a Chart.js könyvtár segítségével vonaldiagramot generál, amely a kiválasztott játékos Elo pontszám történetét mutatja.

3. **Eseménykezelés**:
   - Eseménykezelők állítják be a játékos statisztikák és a diagram frissítését, amikor egy új játékost választanak ki a legördülő menüből.

### CSS (style.css)

- Alapvető stílusok a weboldal elrendezéséhez, legördülő menü és táblázat.

## Függőségek

- **Papa Parse**: A CSV fájlok feldolgozásához.
- **Chart.js**: Interaktív diagramok készítéséhez.

## Közreműködés

A hozzájárulások szívesen fogadottak! Kérlek, forkolj meg a repót és hozz létre egy pull request-et a változtatásaiddal.

## Licenc

Ez a projekt MIT licenc alatt áll.

---

A fenti utasításokat követve beállíthatod és futtathatod a FIFA Elo Pontszám Nyomon Követő alkalmazást a helyi gépeden. Jó szórakozást a FIFA bajnokság Elo pontszámainak követéséhez!

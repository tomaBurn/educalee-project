# Educalee

Šioje repozitorijoje patalpintas edukacinių žaidimų kūrimo įrankis, įgyvendintas kaip dalis Vilniaus Universiteto Projektinio darbo dalyko dalis.

### Norint paleisti prototipą kompiuteryje turi būti įdiegta:

- Node 14.16.1 npm 6.14 arba jų vėlesnės versijos;
- Žiniatinklio naršyklė kaip Mozilla Firefox ar Google Chrome.
- PostgreSQL 14.3

### Diegimo procesas:
- parsisiųsti arba klonuoti išeities kodą;
- Importuoti duomenų bazės duomenis į lokalų serverį:
    - `createdb -T template0 -U naudotojo_vardas edugame`
    - `psql -U naudotojo_vardas edugame < database.sql`
- paleisti node.js serverį: `node index.js`
- paleisti React klientą: 
    - `npm install`
    - `npm start`

### Naudojimasis:
- Paleidus aplikaciją galima registruoti naują paskyrą arba prisijungti su pavyzdiniais duomenimis:
- Norint prisijungti kaip mokytojui reikia įvesti šiuos duomenis:
    - Prisijungimo vardas: mokytojas
    - Slaptažodis: mokytojas
- Norint prisijungti kaip žaidėjui reikia įvesti šiuos duomenis:
    - Prisijungimo vardas: mokinys
    - Slaptažodis: mokinys  

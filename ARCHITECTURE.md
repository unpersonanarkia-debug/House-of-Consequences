# ARCHITECTURE  
## Structural Architecture of the House of Consequences

## 1. Tarkoitus

Tämä dokumentti kuvaa House of Consequences -mallin *rakenteellisen arkkitehtuurin*.

Arkkitehtuuri ei ole:
- ohjelmistokehys
- tekninen toteutus
- API-määrittely

Vaan:
- *käsitteellinen rakenne*
- *abstrakti järjestelmä*, joka voidaan toteuttaa useilla teknologioilla
- yhteinen perusta institutionaalisille ja kaupallisille sovelluksille


## 2. Arkkitehtuurin periaatteet

### 2.1 Teknologianeutraalius
Malli ei oleta:
- tietokantaa
- frontend- tai backend-ratkaisua
- pilvi- tai paikallistoteutusta

Kaikki tekniset ratkaisut ovat *instansseja*, eivät mallin osia.


### 2.2 Erottelu: rakenne vs käyttö

| Taso | Kuvaus |
|---|---|
| Rakenne | Päätöksen elinkaaren looginen malli |
| Käyttö | Lomakkeet, kaaviot, visualisoinnit |
| Toteutus | Koodi, UI, dataformaatit |

ARCHITECTURE.md koskee *vain rakennetta*.


## 3. Ydinobjektit

### 3.1 Case (Tapaus)

*Case* on järjestelmän perusyksikkö.

Se edustaa:
- yhtä päätöstä
- yhtä ajallista elinkaarta
- yhtä analysoitavaa kokonaisuutta

Case ei ole:
- projekti
- raportti
- dokumentti

Vaan:
päätöksen seurausten säiliö ajassa.



### 3.2 Stage (Vaihe)

Case koostuu kuudesta vaiheesta:

1. Decision
2. Impact
3. Consequences
4. Adaptation
5. Repetition
6. Normalization

Vaiheet ovat:
- loogisesti erillisiä
- ajallisesti limittäisiä
- tulkinnallisesti riippuvaisia toisistaan


### 3.3 Record (Merkintä)

Jokainen vaihe sisältää yhden tai useamman *Recordin*.

Record voi olla:
- teksti
- havainto
- mittari
- tulkinta
- viite

Record ei ole:
- totuus
- lopullinen arvio

Vaan:
havainto tietyssä ajassa ja kontekstissa.



## 4. Aikarakenteen malli

House of Consequences käyttää *kehämäistä aikarakennetta*.

# Starta webbsidan
För att köra webbsidan måste man installera MongoDB.

Om din dator kör Ubuntu kan du skriva följande kommando i din terminal:

```# apt install mongodb```

Efter detta måste du starta MongoDB genom att skriva:

```# systemctl start mongod```

Skapa med antingen mongosh eller mongocompass en databas som heter "uwu" med en collection som heter "posts" en som heter "users", och en som heter "id".

Lägg till data i "id" collection genom att skriva in följande efter mongodb:s egna id:

>, "current" : 1

Installera npm paketen av webbsidan genom att skriva:

```$ npm install```

För att starta frontenden behöver man skriva in följande i terminalen:

```$ npm run dev```

För att starta backenden behöver man skriva in följande i terminalen:

```$ npm run backend```

# Köra tester
För att köra testfilen skriv in följande i terminalen:

```$ npm run test```

# Stoppa mongoDB 
För att stoppa mongoDB skriver man följande i terminalen:

```# systemctl stop mongod```
# För att köra webbsidan måste man installera MongoDB.

Om din dator kör Ubuntu kan du skriva följande kommando i din terminal:

```# apt install mongodb```

Efter detta måste du starta MongoDB genom att skriva:

```# systemctl start mongod```

Skapa med antingen mongosh eller mongocompass en databas som heter "uwu" med en collection som heter "post". 

Installera npm paketen av webbsidan genom att skriva:

```$ npm install```

För att starta servern behöver man skriva in följande i terminalen:

```$ npm start```


# Köra tester
För att köra testfilen skriv in följande i terminalen:

```$ npm test```

# Stoppa mongoDB 
För att stoppa mongoDB skriver man följande i terminalen:

```# systemctl stop mongod```
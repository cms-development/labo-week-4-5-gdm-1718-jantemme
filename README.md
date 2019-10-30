# Headless Wordpress with React front-end

## Screencast op Vimeo
[![IMAGE ALT TEXT](https://i.vimeocdn.com/video/826979638.webp?mw=1800&mh=1125&q=70)](https://vimeo.com/369904594 "Headless Wordpress with a React front-end")
https://vimeo.com/369904594

## Running the project

Clone het project
```
git clone https://github.com/cms-development/labo-week-4-5-gdm-1718-jantemme
```

Maak een sql database aan en maak de ".env" file in orde voor het wordpress project.

Navigeer in de terminal vanuit de root van het project naar de 'wordpress'-map en voer 'composer install' uit. Start daarne de wordpress server met 'wp server'.
```
cd wordpress
composer install
wp server
```

Ga naar de url (bv. http://localhost:8080) die in de terminal verschijnt en ga naar '/wp'. Hier zal je het wordpress project moeten completen.

Wanneer dit klaar is kom je in het wordpress dashboard terecht, activeer hier alle plugins, permalinks, etc..

Open daarna een nieuw terminal venster en navigeer naar de root het project.
Ga van hieruit naar de 'app'-map en voer 'yarn add' uit. Hierna kan je de server starten met 'yarn start'.
```
cd app
yarn add
yarn start
```

Maak in de 'app'-map een file '.env' aan met de url van je wordpress en react applicatie. 
bv:
```
REACT_APP_WP_URL='http://localhost:8080'
REACT_APP_REACT_URL='http://localhost:3000'
```

Ga in de react applicatie naar '/admin' in de url en log in.
In het dashboard kan je posts aanmaken, om extra velden aan te vullen moet je naar je post navigeren in het wordpress dashboard nadat je de post hebt aangemaakt.

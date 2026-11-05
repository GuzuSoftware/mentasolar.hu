# Netlify Forms e-mail-értesítés

A `netlify/functions/kapcsolat-form-email.mts` funkció a Netlify hitelesített `formSubmitted` platformeseményére figyel. Ez az esemény csak ellenőrzött Forms-beküldés után fut, ezért a spamként vagy honeypot miatt elutasított beküldésekhez nem küld e-mailt.

## Környezeti változók

A Netlify dashboardban, a production scope-ban állítsa be:

- `RESEND_API_KEY`: a Resend API-kulcs.
- `RESEND_FROM_EMAIL`: a Resendben ellenőrzött domainhez tartozó feladó, például `MentaSolar <no-reply@pelda.hu>`.

Az API-kulcs és a feladócím nem kerülhet a repositoryba.

## Resend beállítás

1. Hozzon létre Resend-fiókot.
2. Vegye fel és ellenőrizze a küldődomaint a Resendben.
3. A Resend által megadott DNS-rekordokat (jellemzően SPF/DKIM) a DNS-kezelőben állítsa be. A meglévő MX, SPF, DKIM és DMARC rekordokat előbb ellenőrizni kell; ez a projekt nem módosítja őket automatikusan.
4. Állítsa be a fenti két Netlify környezeti változót, majd indítson új production deployt.

## Működés és hibakezelés

Csak a `form-name=kapcsolat` esemény küld levelet az `info@mentasolar.hu` címre. A választható `ajanlat-azonosito` mező hiánya nem hiba. Érvényes látogatói e-mail-cím esetén az lesz a `Reply-To`; érvénytelen e-mail-cím nem kerül levélfejlécbe.

A Resend hibája nem módosítja és nem törli a Netlify Formsban már tárolt beküldést. A funkció nem naplóz mezőértékeket, csak a hiba típusát és HTTP-státuszát. Nincs alkalmazásszintű automatikus újrapróbálás: ezzel csökken a duplikált levelek kockázata. Sikertelen küldésnél a Netlify Functions logot és a Forms beküldést kell ellenőrizni, majd szükség esetén manuálisan kell újraküldeni vagy feldolgozni az érdeklődést.

## Éles teszt

1. Production deploy után küldjön egyetlen, `TESZT` jelölésű beküldést a `kapcsolat` űrlapon.
2. Ellenőrizze a Netlify Formsban, hogy a beküldés ellenőrzöttként szerepel.
3. Ellenőrizze az `info@mentasolar.hu` postafiókot és a Resend Activity naplót.
4. Az e-mailben ellenőrizze a mezők, a `Reply-To` és az opcionális ajánlatazonosító megjelenését.

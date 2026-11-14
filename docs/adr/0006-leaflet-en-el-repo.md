# ADR 0006: Leaflet se sirve desde el propio sitio

Estado: aceptada, 15-11-2026

## Contexto
El mapa de la ruta cargaba Leaflet 1.9.4 desde unpkg en el momento de usarlo:
una dependencia externa sin hash de integridad, un punto unico de fallo y una
peticion a un tercero con la IP de quien cocina. Auditoria de dependencias de
15-11-2026: Leaflet 1.9.4 sigue siendo la ultima estable (la 2.x esta en
beta), asi que no habia version que actualizar, solo la forma de servirla.

## Decision
Leaflet 1.9.4 (js, css e imagenes) vive versionado en `js/vendor/leaflet/` y
se sirve desde el propio sitio estatico. No se anade fallback al CDN: si
faltan los archivos, el mapa muestra su mensaje de error habitual.

## Consecuencias
La app queda autocontenida (solo quedan las llamadas de datos: OSM, Nominatim
y OSRM, documentadas en ADR 0004). Actualizar Leaflet pasa por cambiar los
archivos del repo, no una URL. El sitio publicado crece ~160 KB.

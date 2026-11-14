# ADR 0003 — Ruta de la compra con OpenStreetMap y Google Maps

## Estado
Aceptada

## Contexto
La compra se hace en varias tiendas. Las listas verificadas a mano solo cubren una zona y la app es compartida.

## Decisión
- Cada ingrediente se asigna a una parada por tipo (tabla `DONDE`), con una opción fácil (súper) y una buena (tienda especializada), elegible por tipo.
- La tienda concreta se resuelve en el momento: Overpass (OpenStreetMap, sin clave) devuelve la más cercana con nombre en 3 km a la ubicación actual.
- La ruta se abre en Google Maps a pie: origen la ubicación, paradas en orden de tour, destino la casa si está guardada. Si Overpass falla, esa parada va como búsqueda de texto.
- La casa se guarda redondeada y solo en `localStorage`.

## Consecuencias
- Funciona en cualquier ciudad sin mantener listas.
- Los datos de OSM pueden estar desactualizados y no dicen si la tienda está abierta.
- Dependemos de la disponibilidad de Overpass; hay segundo servidor y plan de texto.
- No se calcula la ruta dentro de la app.

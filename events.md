#Events list
##1.Emit events
###game **Instance** Events
```js
game-join(gameId: string, userId: string)
```
Использовать в useEffect для подключения к игре

###game **Setup** Events
```js
game-setup-clans(axial: axialCoordinates)
```
Во время фазы "установки кланов", **когда игрок активен**, yстанавливает 1 клан

```js
game-setup-capital(axial: axialCoordinates)
```
Во время фазы "установки столицы", **когда игрок активен и является бреном**, yстанавливает столицу

###player **Game** Events
```js
player-card-season({ cardId, params }: IPlayerCardInput)
```
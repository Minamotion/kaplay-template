## DATA
Place data here
These can be:
- JSON files
- XML files
- TXT files
- CSV files
- Anything, really! _(needs to be implemented in [`main.js`](../main.js))_

To access a asset that isn't a json file through code, do the following in your code
```javascript
k.getSpecialAsset("customXML") // Asset<XMLDocument>
k.getSpecialAsset("customCSV") // Asset<string[][]>
k.getSpecialAsset("customTXT") // Asset<string>
```

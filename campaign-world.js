// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN MANAGER — WORLD TAB (lazy-loaded module)
// ═══════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════
// ATLAS MAP DATA — pre-generated maps as embedded WebP data URIs (2800x1800)
// ═══════════════════════════════════════════════════════════════════════════
const ATLAS_MAP_DATA = {}; // Images load from atlas-maps/atlas-{seed}.webp files

// Atlas metadata for all 100 seeds (regions, cities, mountains, lakes)
const ATLAS_METADATA = {};
ATLAS_METADATA[1] = {"seed":1,"mapName":"CARDONIA","regions":[{"name":"Kharadan","subtitle":"Principality of Kharadan","color":"#ccc088","labelX":4005.0,"labelY":2835.0,"cities":[{"name":"Thebury","x":0.4661,"y":0.5417,"capital":true},{"name":"Freehold","x":0.4018,"y":0.6139,"capital":false},{"name":"Longmere","x":0.4875,"y":0.6361,"capital":false},{"name":"Copperside","x":0.3982,"y":0.7028,"capital":false},{"name":"Foxbury","x":0.5518,"y":0.6583,"capital":false}]},{"name":"Pinecrest","subtitle":"Realm of Pinecrest","color":"#a8b8a0","labelX":2505.0,"labelY":3195.0,"cities":[{"name":"Kettlebrook","x":0.2982,"y":0.5806,"capital":true},{"name":"Alderhaven","x":0.2446,"y":0.4194,"capital":false},{"name":"Ashbourne","x":0.3161,"y":0.7306,"capital":false}]},{"name":"Blackmoor","subtitle":"The Dominion of Blackmoor","color":"#c8b490","labelX":6735.0,"labelY":3255.0,"cities":[{"name":"Lawklif","x":0.7839,"y":0.5917,"capital":true},{"name":"Oakmere","x":0.9411,"y":0.5194,"capital":false},{"name":"Brinewood","x":0.7411,"y":0.4861,"capital":false},{"name":"Blackrock","x":0.6875,"y":0.5417,"capital":false}]},{"name":"Evershade","subtitle":"Kingdom of Evershade","color":"#a0b0b8","labelX":1185.0,"labelY":1905.0,"cities":[{"name":"Goldenleaf","x":0.1375,"y":0.3417,"capital":true},{"name":"Redthorn","x":0.0661,"y":0.3972,"capital":false},{"name":"Rynwood","x":0.1446,"y":0.2472,"capital":false}]},{"name":"Ashmark","subtitle":"Principality of Ashmark","color":"#b8c098","labelX":1275.0,"labelY":3555.0,"cities":[{"name":"Ivyreach","x":0.1482,"y":0.6694,"capital":true},{"name":"Anora","x":0.0696,"y":0.5806,"capital":false},{"name":"Harrowfield","x":0.1339,"y":0.5472,"capital":false},{"name":"Hollowburg","x":0.0554,"y":0.6861,"capital":false},{"name":"Brightmoor","x":0.0589,"y":0.525,"capital":false},{"name":"Ilaes","x":0.2518,"y":0.6694,"capital":false}]},{"name":"Mistvale","subtitle":"Realm of Mistvale","color":"#c4b0a8","labelX":2655.0,"labelY":1035.0,"cities":[{"name":"Vineyard","x":0.3089,"y":0.1972,"capital":true},{"name":"Ironholt","x":0.2661,"y":0.275,"capital":false},{"name":"Jadeston","x":0.4018,"y":0.225,"capital":false},{"name":"Highwall","x":0.2089,"y":0.225,"capital":false},{"name":"Thornwall","x":0.3661,"y":0.2917,"capital":false}]},{"name":"Tethys","subtitle":"Realm of Tethys","color":"#a8c0b0","labelX":5835.0,"labelY":2055.0,"cities":[{"name":"Elmsworth","x":0.7054,"y":0.3639,"capital":true},{"name":"Zarakyr","x":0.5268,"y":0.3694,"capital":false},{"name":"Nighthollow","x":0.8732,"y":0.4139,"capital":false},{"name":"Duskhold","x":0.6125,"y":0.4194,"capital":false},{"name":"Dunmore","x":0.5554,"y":0.2472,"capital":false},{"name":"Ravenmere","x":0.7911,"y":0.3694,"capital":false}]}],"mountains":[{"name":"Dragon's Spine","labelX":3645.0,"labelY":2685.0},{"name":"Silvervein Ridge","labelX":3045.0,"labelY":2955.0},{"name":"Ironspine Range","labelX":4215.0,"labelY":2895.0},{"name":"Greymist Heights","labelX":3975.0,"labelY":2475.0}],"lakes":[{"name":"Crystal Lake","labelX":4875.0,"labelY":2643.0},{"name":"Lake Varos","labelX":2325.0,"labelY":2763.0},{"name":"Lunmere","labelX":6135.0,"labelY":2733.0}],"seaNames":["Sea of Dreams","Jade Sea","Sea of Winds","Crimson Gulf","Sea of Ash"],"pois":[{"name":"Tower of Ashenveil","type":"Ruins","x":0.3089,"y":0.3417},{"name":"The Lost Windscour","type":"Obelisk","x":0.6375,"y":0.2972},{"name":"Tower of Ironwatch","type":"Wayshrine","x":0.4375,"y":0.3917},{"name":"Temple of Moonfire","type":"Standing Stones","x":0.7125,"y":0.7694},{"name":"Shrine of Frostpeak","type":"Well","x":0.3732,"y":0.4528},{"name":"Keep of Silentwood","type":"Tower","x":0.6232,"y":0.7139},{"name":"Crypt of Oakenshield","type":"Portal","x":0.8589,"y":0.7028},{"name":"Keep of Ebonreach","type":"Well","x":0.5446,"y":0.7639},{"name":"Tomb of Mistpeak","type":"Standing Stones","x":0.7732,"y":0.6861},{"name":"Barrow of Oakenshield","type":"Cavern","x":0.5018,"y":0.2194},{"name":"Fortress of Moonfire","type":"Fortress","x":0.2018,"y":0.5417},{"name":"Keep of Brightveil","type":"Hermit Cave","x":0.8696,"y":0.5028},{"name":"Tower of Dreadhollow","type":"Well","x":0.7554,"y":0.2806},{"name":"The Sunken Ironwatch","type":"Mine","x":0.1875,"y":0.4194}]};
ATLAS_METADATA[2] = {"seed":2,"mapName":"VAELTHYR","regions":[{"name":"Ashenveil","subtitle":"The Free Marches of Ashenveil","color":"#ccc088","labelX":755.0,"labelY":1015.0,"cities":[{"name":"Regnwald","x":0.2839,"y":0.5694,"capital":true},{"name":"Feradell","x":0.3625,"y":0.5806,"capital":false},{"name":"Dremoor","x":0.1982,"y":0.5639,"capital":false}]},{"name":"Shadowfen","subtitle":"Principality of Shadowfen","color":"#a8b8a0","labelX":1785.0,"labelY":425.0,"cities":[{"name":"Windcrest","x":0.6339,"y":0.2417,"capital":true},{"name":"Ashbourne","x":0.6661,"y":0.2861,"capital":false},{"name":"Goldenleaf","x":0.6804,"y":0.2583,"capital":false},{"name":"Gerenwalde","x":0.6018,"y":0.3583,"capital":false},{"name":"Kronham","x":0.6125,"y":0.3306,"capital":false},{"name":"Oldbridge","x":0.6982,"y":0.3083,"capital":false}]},{"name":"Duskveil","subtitle":"Realm of Duskveil","color":"#c8b490","labelX":2045.0,"labelY":975.0,"cities":[{"name":"Valewick","x":0.7125,"y":0.525,"capital":true},{"name":"Deepwatch","x":0.7804,"y":0.6306,"capital":false},{"name":"Cinderfell","x":0.6768,"y":0.5917,"capital":false},{"name":"Ravenmere","x":0.6339,"y":0.425,"capital":false},{"name":"Gerenwalde","x":0.7696,"y":0.4917,"capital":false}]},{"name":"Valdheim","subtitle":"The Wilds of Valdheim","color":"#a0b0b8","labelX":1245.0,"labelY":815.0,"cities":[{"name":"Duskwater","x":0.4554,"y":0.4583,"capital":true},{"name":"Thistledown","x":0.5339,"y":0.3528,"capital":false},{"name":"Redthorn","x":0.4982,"y":0.5028,"capital":false}]},{"name":"Drakkos","subtitle":"The Dominion of Drakkos","color":"#b8c098","labelX":2585.0,"labelY":1095.0,"cities":[{"name":"Greywater","x":0.9196,"y":0.625,"capital":true},{"name":"Junipervale","x":0.8982,"y":0.5139,"capital":false},{"name":"Duskwater","x":0.9482,"y":0.6361,"capital":false}]},{"name":"Thornwick","subtitle":"Duchy of Thornwick","color":"#c4b0a8","labelX":2455.0,"labelY":655.0,"cities":[{"name":"Anora","x":0.8839,"y":0.3583,"capital":true},{"name":"Rynwood","x":0.9554,"y":0.425,"capital":false},{"name":"Freehold","x":0.9268,"y":0.3861,"capital":false},{"name":"Borist","x":0.9232,"y":0.3306,"capital":false},{"name":"Inkwell","x":0.8661,"y":0.2861,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Sea of Twilight","Sea of Winds","Pale Sea","Sea of Dreams"]};
ATLAS_METADATA[3] = {"seed":3,"mapName":"ALDENMOOR","regions":[{"name":"Elonia","subtitle":"Borderlands of Elonia","color":"#ccc088","labelX":2255.0,"labelY":1305.0,"cities":[{"name":"Maplecross","x":0.7839,"y":0.7194,"capital":true},{"name":"Whitevale","x":0.7696,"y":0.7361,"capital":false},{"name":"Jadeston","x":0.8446,"y":0.6972,"capital":false}]},{"name":"Sunmere","subtitle":"The Wilds of Sunmere","color":"#a8b8a0","labelX":1085.0,"labelY":615.0,"cities":[{"name":"Elmsworth","x":0.3946,"y":0.3306,"capital":true},{"name":"Pinewood","x":0.3268,"y":0.3972,"capital":false},{"name":"Valewick","x":0.5054,"y":0.3639,"capital":false},{"name":"Lakecrest","x":0.4839,"y":0.3917,"capital":false},{"name":"Copperside","x":0.4554,"y":0.3917,"capital":false}]},{"name":"Dremora","subtitle":"Duchy of Dremora","color":"#c8b490","labelX":2545.0,"labelY":865.0,"cities":[{"name":"Ashbourne","x":0.9268,"y":0.4639,"capital":true},{"name":"Vineyard","x":0.8518,"y":0.4528,"capital":false},{"name":"Zenithburg","x":0.9446,"y":0.5417,"capital":false},{"name":"Kingsbridge","x":0.9482,"y":0.4306,"capital":false}]},{"name":"Lakeshore","subtitle":"The Free Marches of Lakeshore","color":"#a0b0b8","labelX":795.0,"labelY":925.0,"cities":[{"name":"Inkwell","x":0.2839,"y":0.5083,"capital":true},{"name":"Yellowfen","x":0.2125,"y":0.5028,"capital":false},{"name":"Kronham","x":0.2768,"y":0.6306,"capital":false},{"name":"Greywater","x":0.2161,"y":0.575,"capital":false},{"name":"Greenhollow","x":0.4125,"y":0.5083,"capital":false},{"name":"Deepwatch","x":0.3554,"y":0.5583,"capital":false}]},{"name":"Dawnhollow","subtitle":"Realm of Dawnhollow","color":"#b8c098","labelX":1545.0,"labelY":1145.0,"cities":[{"name":"Thebury","x":0.5696,"y":0.6528,"capital":true},{"name":"Urswick","x":0.5732,"y":0.725,"capital":false},{"name":"Moonshadow","x":0.6304,"y":0.6806,"capital":false},{"name":"Alderhaven","x":0.6161,"y":0.7194,"capital":false},{"name":"Stormgate","x":0.6732,"y":0.6972,"capital":false}]},{"name":"Ravenmarch","subtitle":"The Free Marches of Ravenmarch","color":"#c4b0a8","labelX":1765.0,"labelY":675.0,"cities":[{"name":"Longmere","x":0.6339,"y":0.375,"capital":true},{"name":"Gerenwalde","x":0.5375,"y":0.3417,"capital":false},{"name":"Pinewood","x":0.7196,"y":0.375,"capital":false},{"name":"Odrin","x":0.7482,"y":0.4417,"capital":false},{"name":"Copperside","x":0.7089,"y":0.4583,"capital":false}]},{"name":"Nightward","subtitle":"Kingdom of Nightward","color":"#a8c0b0","labelX":415.0,"labelY":815.0,"cities":[{"name":"Oldbridge","x":0.1304,"y":0.4639,"capital":true},{"name":"Feradell","x":0.1804,"y":0.4472,"capital":false},{"name":"Tidefall","x":0.1339,"y":0.3861,"capital":false},{"name":"Lakecrest","x":0.0661,"y":0.3583,"capital":false}]},{"name":"Evershade","subtitle":"The Wilds of Evershade","color":"#c8c0a0","labelX":1125.0,"labelY":1145.0,"cities":[{"name":"Westmarch","x":0.4125,"y":0.6306,"capital":true},{"name":"Knolltown","x":0.4661,"y":0.7361,"capital":false},{"name":"Oakmere","x":0.4375,"y":0.6917,"capital":false},{"name":"Lawklif","x":0.3804,"y":0.5694,"capital":false},{"name":"Cinderfell","x":0.3161,"y":0.6194,"capital":false},{"name":"Whitevale","x":0.4768,"y":0.5639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Iron Sea","Sea of Dreams","Sea of Twilight","Sea of Silver"]};
ATLAS_METADATA[4] = {"seed":4,"mapName":"DRAKHEIM","regions":[{"name":"Solwynd","subtitle":"Borderlands of Solwynd","color":"#ccc088","labelX":1165.0,"labelY":845.0,"cities":[{"name":"Beowick","x":0.4125,"y":0.4806,"capital":true},{"name":"Fogmere","x":0.5054,"y":0.5639,"capital":false},{"name":"Goldug","x":0.4411,"y":0.4194,"capital":false},{"name":"Pebblecreek","x":0.4589,"y":0.5194,"capital":false},{"name":"Borist","x":0.4946,"y":0.4083,"capital":false},{"name":"Oakmere","x":0.3125,"y":0.475,"capital":false}]},{"name":"Tarnis","subtitle":"Duchy of Tarnis","color":"#a8b8a0","labelX":1005.0,"labelY":345.0,"cities":[{"name":"Valewick","x":0.3661,"y":0.2083,"capital":true},{"name":"Oldbridge","x":0.3482,"y":0.1472,"capital":false},{"name":"Quartzridge","x":0.4732,"y":0.1806,"capital":false},{"name":"Loyarn","x":0.4089,"y":0.3028,"capital":false}]},{"name":"Rosedale","subtitle":"Borderlands of Rosedale","color":"#c8b490","labelX":1745.0,"labelY":865.0,"cities":[{"name":"Whitevale","x":0.5054,"y":0.3861,"capital":false},{"name":"Goldug","x":0.6839,"y":0.4972,"capital":false},{"name":"Inkwell","x":0.5268,"y":0.4306,"capital":false},{"name":"Mirrordeep","x":0.6054,"y":0.4583,"capital":true},{"name":"Stillmere","x":0.7232,"y":0.4639,"capital":false}]},{"name":"Moonridge","subtitle":"The Free Marches of Moonridge","color":"#a0b0b8","labelX":675.0,"labelY":625.0,"cities":[{"name":"Gildafell","x":0.2339,"y":0.3361,"capital":true},{"name":"Stormgate","x":0.2089,"y":0.3972,"capital":false},{"name":"Eagleford","x":0.1661,"y":0.2861,"capital":false}]},{"name":"Wyndell","subtitle":"The Wilds of Wyndell","color":"#b8c098","labelX":2485.0,"labelY":685.0,"cities":[{"name":"Vineyard","x":0.8768,"y":0.3639,"capital":true},{"name":"Foxbury","x":0.8768,"y":0.4361,"capital":false},{"name":"Cliffhaven","x":0.9089,"y":0.4694,"capital":false},{"name":"Millcross","x":0.8732,"y":0.2861,"capital":false},{"name":"Anora","x":0.9411,"y":0.275,"capital":false},{"name":"Oldbridge","x":0.8696,"y":0.275,"capital":false}]},{"name":"Kelvor","subtitle":"Borderlands of Kelvor","color":"#c4b0a8","labelX":495.0,"labelY":1055.0,"cities":[{"name":"Rynwood","x":0.1732,"y":0.5917,"capital":true},{"name":"Goldug","x":0.2589,"y":0.5306,"capital":false},{"name":"Zenithburg","x":0.1054,"y":0.5028,"capital":false},{"name":"Fernhollow","x":0.1768,"y":0.7083,"capital":false},{"name":"Jadeston","x":0.1411,"y":0.6639,"capital":false},{"name":"Copperside","x":0.0589,"y":0.6139,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":1155.0,"labelY":585.0},{"name":"Greymist Heights","labelX":1105.0,"labelY":965.0},{"name":"Ashen Divide","labelX":425.0,"labelY":775.0}],"lakes":[{"name":"Mirrordeep","labelX":1645.0,"labelY":903.0},{"name":"Stillmere","labelX":2145.0,"labelY":873.0}],"seaNames":["Sea of Embers","Pale Sea","Sea of Ash","Sea of Twilight","Crimson Gulf"]};
ATLAS_METADATA[5] = {"seed":5,"mapName":"ESTEROS","regions":[{"name":"Moonridge","subtitle":"The Free Marches of Moonridge","color":"#ccc088","labelX":985.0,"labelY":435.0,"cities":[{"name":"Loyarn","x":0.3375,"y":0.2528,"capital":true},{"name":"Copperside","x":0.4054,"y":0.2972,"capital":false},{"name":"Dremoor","x":0.2875,"y":0.375,"capital":false}]},{"name":"Aelindor","subtitle":"Duchy of Aelindor","color":"#a8b8a0","labelX":965.0,"labelY":885.0,"cities":[{"name":"Moonshadow","x":0.3554,"y":0.5083,"capital":true},{"name":"Cliffhaven","x":0.3375,"y":0.625,"capital":false},{"name":"Stormgate","x":0.4518,"y":0.5139,"capital":false},{"name":"Thebury","x":0.4518,"y":0.425,"capital":false},{"name":"Longmere","x":0.3625,"y":0.4528,"capital":false},{"name":"Kingsbridge","x":0.2375,"y":0.4639,"capital":false}]},{"name":"Felmoor","subtitle":"Duchy of Felmoor","color":"#c8b490","labelX":1535.0,"labelY":1245.0,"cities":[{"name":"Palanor","x":0.5661,"y":0.7083,"capital":true},{"name":"Maplecross","x":0.5054,"y":0.7528,"capital":false},{"name":"Dawnwatch","x":0.5018,"y":0.7861,"capital":false}]},{"name":"Korrath","subtitle":"The Dominion of Korrath","color":"#a0b0b8","labelX":1595.0,"labelY":555.0,"cities":[{"name":"Ilaes","x":0.5804,"y":0.3028,"capital":true},{"name":"Lakecrest","x":0.5839,"y":0.2472,"capital":false},{"name":"Loyarn","x":0.6196,"y":0.3417,"capital":false},{"name":"Copperside","x":0.4589,"y":0.3528,"capital":false},{"name":"Foxbury","x":0.4732,"y":0.2194,"capital":false}]},{"name":"Tethys","subtitle":"Duchy of Tethys","color":"#b8c098","labelX":725.0,"labelY":1345.0,"cities":[{"name":"Borist","x":0.2589,"y":0.7528,"capital":true},{"name":"Thebury","x":0.3089,"y":0.6583,"capital":false},{"name":"Vineyard","x":0.2125,"y":0.7028,"capital":false}]},{"name":"Greyhollow","subtitle":"Kingdom of Greyhollow","color":"#c4b0a8","labelX":2435.0,"labelY":475.0,"cities":[{"name":"Rynwood","x":0.8589,"y":0.2639,"capital":true},{"name":"Foxbury","x":0.7804,"y":0.2917,"capital":false},{"name":"Underbridge","x":0.7696,"y":0.3028,"capital":false},{"name":"Odrin","x":0.8304,"y":0.2194,"capital":false},{"name":"Runeford","x":0.9589,"y":0.2417,"capital":false},{"name":"Redthorn","x":0.8946,"y":0.2972,"capital":false}]}],"mountains":[{"name":"Dragon's Spine","labelX":735.0,"labelY":1375.0},{"name":"Greymist Heights","labelX":1115.0,"labelY":1405.0}],"lakes":[],"seaNames":["Sea of Dreams","Sea of Winds","Iron Sea","Pale Sea","Sea of Twilight"]};
ATLAS_METADATA[6] = {"seed":6,"mapName":"THALINDRA","regions":[{"name":"Ironglenn","subtitle":"Principality of Ironglenn","color":"#ccc088","labelX":1185.0,"labelY":765.0,"cities":[{"name":"Yewborough","x":0.4232,"y":0.4361,"capital":true},{"name":"Deepwatch","x":0.4982,"y":0.3694,"capital":false},{"name":"Yellowfen","x":0.4054,"y":0.325,"capital":false},{"name":"Stormgate","x":0.4625,"y":0.3861,"capital":false},{"name":"Cinderfell","x":0.3482,"y":0.4583,"capital":false},{"name":"Ashwick","x":0.3982,"y":0.2917,"capital":false}]},{"name":"Highkeep","subtitle":"The Wilds of Highkeep","color":"#a8b8a0","labelX":2485.0,"labelY":1215.0,"cities":[{"name":"Windcrest","x":0.8768,"y":0.675,"capital":true},{"name":"Greenhollow","x":0.9125,"y":0.625,"capital":false},{"name":"Urswick","x":0.7946,"y":0.7194,"capital":false},{"name":"Duskwater","x":0.7589,"y":0.6417,"capital":false}]},{"name":"Dravina","subtitle":"Borderlands of Dravina","color":"#c8b490","labelX":685.0,"labelY":765.0,"cities":[{"name":"Yellowfen","x":0.2411,"y":0.4139,"capital":true},{"name":"Feradell","x":0.3375,"y":0.4028,"capital":false},{"name":"Silverton","x":0.3339,"y":0.325,"capital":false},{"name":"Stormgate","x":0.2696,"y":0.4639,"capital":false}]},{"name":"Selvane","subtitle":"The Wilds of Selvane","color":"#a0b0b8","labelX":1615.0,"labelY":1015.0,"cities":[{"name":"Valewick","x":0.5839,"y":0.5694,"capital":true},{"name":"Dunmore","x":0.6911,"y":0.5639,"capital":false},{"name":"Tidefall","x":0.6554,"y":0.5917,"capital":false},{"name":"Loyarn","x":0.6911,"y":0.5139,"capital":false}]},{"name":"Drakkos","subtitle":"Duchy of Drakkos","color":"#b8c098","labelX":1485.0,"labelY":435.0,"cities":[{"name":"Kronham","x":0.5304,"y":0.2417,"capital":true},{"name":"Northgate","x":0.5982,"y":0.325,"capital":false},{"name":"Lindel","x":0.5089,"y":0.1861,"capital":false}]},{"name":"Grimvale","subtitle":"Kingdom of Grimvale","color":"#c4b0a8","labelX":1915.0,"labelY":1375.0,"cities":[{"name":"Yewborough","x":0.6768,"y":0.7639,"capital":true},{"name":"Palanor","x":0.6339,"y":0.7917,"capital":false},{"name":"Tidefall","x":0.7661,"y":0.7694,"capital":false},{"name":"Dawnwatch","x":0.5982,"y":0.7639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Sea of Dreams","Pale Sea","Jade Sea","Sea of Storms"]};
ATLAS_METADATA[7] = {"seed":7,"mapName":"KORATHIS","regions":[{"name":"Ondara","subtitle":"Realm of Ondara","color":"#ccc088","labelX":2085.0,"labelY":715.0,"cities":[{"name":"Cliffhaven","x":0.7304,"y":0.3917,"capital":true},{"name":"Gerenwalde","x":0.6125,"y":0.375,"capital":false},{"name":"Underbridge","x":0.7946,"y":0.3694,"capital":false},{"name":"Quartzridge","x":0.7161,"y":0.3028,"capital":false}]},{"name":"Thornemark","subtitle":"Principality of Thornemark","color":"#a8b8a0","labelX":1775.0,"labelY":255.0,"cities":[{"name":"Eagleford","x":0.6411,"y":0.1306,"capital":true},{"name":"Rynwood","x":0.6554,"y":0.1028,"capital":false},{"name":"Regnwald","x":0.6518,"y":0.2028,"capital":false}]},{"name":"Tarnis","subtitle":"Duchy of Tarnis","color":"#c8b490","labelX":1615.0,"labelY":1065.0,"cities":[{"name":"Jadeston","x":0.5804,"y":0.5972,"capital":true},{"name":"Palanor","x":0.5839,"y":0.4528,"capital":false},{"name":"Kingsbridge","x":0.6554,"y":0.6194,"capital":false}]},{"name":"Brynmar","subtitle":"The Dominion of Brynmar","color":"#a0b0b8","labelX":2225.0,"labelY":1125.0,"cities":[{"name":"Ravenmere","x":0.7768,"y":0.625,"capital":true},{"name":"Silverton","x":0.8054,"y":0.5028,"capital":false},{"name":"Vineyard","x":0.8304,"y":0.4972,"capital":false},{"name":"Knolltown","x":0.8411,"y":0.5639,"capital":false},{"name":"Palanor","x":0.7554,"y":0.5194,"capital":false}]},{"name":"Pyremarch","subtitle":"Borderlands of Pyremarch","color":"#b8c098","labelX":1265.0,"labelY":665.0,"cities":[{"name":"Brinewood","x":0.4482,"y":0.3861,"capital":true},{"name":"Dremoor","x":0.4982,"y":0.3639,"capital":false},{"name":"Kingsbridge","x":0.4411,"y":0.3861,"capital":false},{"name":"Zenithburg","x":0.4411,"y":0.3083,"capital":false},{"name":"Blackrock","x":0.4304,"y":0.3028,"capital":false}]}],"mountains":[{"name":"Dragon's Spine","labelX":1855.0,"labelY":1045.0},{"name":"Frostpeak Mountains","labelX":1255.0,"labelY":595.0},{"name":"Ironspine Range","labelX":1795.0,"labelY":1055.0},{"name":"Ashen Divide","labelX":1825.0,"labelY":355.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Frost","Sea of Twilight","Sea of Embers","Jade Sea"]};
ATLAS_METADATA[8] = {"seed":8,"mapName":"MYRANDEL","regions":[{"name":"Mistvale","subtitle":"Kingdom of Mistvale","color":"#ccc088","labelX":1965.0,"labelY":1215.0,"cities":[{"name":"Yewborough","x":0.6839,"y":0.6861,"capital":true},{"name":"Inkwell","x":0.7375,"y":0.6139,"capital":false},{"name":"Goldenleaf","x":0.6554,"y":0.5806,"capital":false}]},{"name":"Caeloth","subtitle":"Duchy of Caeloth","color":"#a8b8a0","labelX":1085.0,"labelY":1265.0,"cities":[{"name":"Valewick","x":0.3946,"y":0.6972,"capital":true},{"name":"Pinewood","x":0.4161,"y":0.6139,"capital":false},{"name":"Ilaes","x":0.4125,"y":0.7917,"capital":false},{"name":"Alderhaven","x":0.4018,"y":0.7806,"capital":false},{"name":"Feradell","x":0.4232,"y":0.6472,"capital":false}]},{"name":"Northmere","subtitle":"Realm of Northmere","color":"#c8b490","labelX":2035.0,"labelY":735.0,"cities":[{"name":"Silverton","x":0.7446,"y":0.425,"capital":true},{"name":"Foxbury","x":0.7196,"y":0.5028,"capital":false},{"name":"Fogmere","x":0.6911,"y":0.4972,"capital":false},{"name":"Inkwell","x":0.7732,"y":0.4694,"capital":false},{"name":"Feradell","x":0.6482,"y":0.4528,"capital":false},{"name":"Zenithburg","x":0.6625,"y":0.4694,"capital":false}]},{"name":"Felmoor","subtitle":"Kingdom of Felmoor","color":"#a0b0b8","labelX":1535.0,"labelY":1015.0,"cities":[{"name":"Beowick","x":0.5589,"y":0.5528,"capital":true},{"name":"Stonemere","x":0.5411,"y":0.5139,"capital":false},{"name":"Odrin","x":0.6089,"y":0.5472,"capital":false},{"name":"Ashwick","x":0.5054,"y":0.575,"capital":false},{"name":"Cliffhaven","x":0.5054,"y":0.5306,"capital":false},{"name":"Nighthollow","x":0.5446,"y":0.6139,"capital":false}]},{"name":"Duskveil","subtitle":"The Free Marches of Duskveil","color":"#b8c098","labelX":695.0,"labelY":625.0,"cities":[{"name":"Thornwall","x":0.2411,"y":0.3528,"capital":true},{"name":"Tidefall","x":0.3161,"y":0.3694,"capital":false},{"name":"Junipervale","x":0.1911,"y":0.4528,"capital":false},{"name":"Cliffhaven","x":0.3375,"y":0.3028,"capital":false},{"name":"Vineyard","x":0.2161,"y":0.3139,"capital":false}]},{"name":"Belros","subtitle":"The Wilds of Belros","color":"#c4b0a8","labelX":2575.0,"labelY":845.0,"cities":[{"name":"Jadeston","x":0.9196,"y":0.4583,"capital":true},{"name":"Fernhollow","x":0.9518,"y":0.4528,"capital":false},{"name":"Pebblecreek","x":0.9589,"y":0.4917,"capital":false},{"name":"Elmsworth","x":0.8446,"y":0.4083,"capital":false}]},{"name":"Morvaine","subtitle":"The Free Marches of Morvaine","color":"#a8c0b0","labelX":365.0,"labelY":1015.0,"cities":[{"name":"Cliffhaven","x":0.1339,"y":0.5472,"capital":true},{"name":"Dremoor","x":0.1339,"y":0.5083,"capital":false},{"name":"Lawklif","x":0.1304,"y":0.5917,"capital":false},{"name":"Yellowfen","x":0.1304,"y":0.5583,"capital":false},{"name":"Dunmore","x":0.2339,"y":0.575,"capital":false},{"name":"Copperside","x":0.1304,"y":0.5694,"capital":false}]},{"name":"Ashenveil","subtitle":"Borderlands of Ashenveil","color":"#c8c0a0","labelX":1105.0,"labelY":755.0,"cities":[{"name":"Goldug","x":0.4018,"y":0.4083,"capital":true},{"name":"Wydale","x":0.3446,"y":0.4361,"capital":false},{"name":"Copperside","x":0.4411,"y":0.3472,"capital":false},{"name":"Pebblecreek","x":0.5125,"y":0.4417,"capital":false}]}],"mountains":[{"name":"Greymist Heights","labelX":1785.0,"labelY":965.0},{"name":"Frostpeak Mountains","labelX":1715.0,"labelY":1365.0}],"lakes":[],"seaNames":["Sea of Frost","Iron Sea","Sea of Silver","Sea of Storms","Jade Sea"]};
ATLAS_METADATA[9] = {"seed":9,"mapName":"SOLMERE","regions":[{"name":"Highkeep","subtitle":"Principality of Highkeep","color":"#ccc088","labelX":1085.0,"labelY":715.0,"cities":[{"name":"Borist","x":0.3768,"y":0.4139,"capital":true},{"name":"Freehold","x":0.2911,"y":0.4139,"capital":false},{"name":"Quartzridge","x":0.2911,"y":0.425,"capital":false},{"name":"Nighthollow","x":0.4589,"y":0.3972,"capital":false},{"name":"Underbridge","x":0.3482,"y":0.3194,"capital":false},{"name":"Moonshadow","x":0.4696,"y":0.4417,"capital":false}]},{"name":"Crystalis","subtitle":"The Free Marches of Crystalis","color":"#a8b8a0","labelX":1945.0,"labelY":1245.0,"cities":[{"name":"Elmsworth","x":0.6911,"y":0.7028,"capital":true},{"name":"Kettlebrook","x":0.7196,"y":0.7028,"capital":false},{"name":"Dawnwatch","x":0.7268,"y":0.775,"capital":false},{"name":"Ashbourne","x":0.6411,"y":0.8139,"capital":false},{"name":"Kingsbridge","x":0.6946,"y":0.6583,"capital":false}]},{"name":"Obsidara","subtitle":"Borderlands of Obsidara","color":"#c8b490","labelX":1495.0,"labelY":705.0,"cities":[{"name":"Yellowfen","x":0.5446,"y":0.3806,"capital":true},{"name":"Underbridge","x":0.4946,"y":0.4083,"capital":false},{"name":"Fogmere","x":0.4875,"y":0.4361,"capital":false},{"name":"Rynwood","x":0.5554,"y":0.425,"capital":false},{"name":"Kingsbridge","x":0.6375,"y":0.3861,"capital":false},{"name":"Palanor","x":0.5839,"y":0.3472,"capital":false}]},{"name":"Ashenveil","subtitle":"Principality of Ashenveil","color":"#a0b0b8","labelX":985.0,"labelY":345.0,"cities":[{"name":"Thebury","x":0.3661,"y":0.1806,"capital":true},{"name":"Odrin","x":0.4054,"y":0.1472,"capital":false},{"name":"Deepwatch","x":0.3125,"y":0.2361,"capital":false},{"name":"Ironholt","x":0.3304,"y":0.1361,"capital":false},{"name":"Quartzridge","x":0.2696,"y":0.1583,"capital":false}]},{"name":"Duskveil","subtitle":"Realm of Duskveil","color":"#b8c098","labelX":595.0,"labelY":715.0,"cities":[{"name":"Copperside","x":0.2232,"y":0.3917,"capital":true},{"name":"Ashwick","x":0.2268,"y":0.2528,"capital":false},{"name":"Maplecross","x":0.1768,"y":0.3806,"capital":false},{"name":"Runeford","x":0.1732,"y":0.4083,"capital":false},{"name":"Oakmere","x":0.1875,"y":0.3639,"capital":false}]},{"name":"Korrath","subtitle":"Kingdom of Korrath","color":"#c4b0a8","labelX":2425.0,"labelY":1335.0,"cities":[{"name":"Ivyreach","x":0.8768,"y":0.7306,"capital":true},{"name":"Zarakyr","x":0.8018,"y":0.6583,"capital":false},{"name":"Yellowfen","x":0.8375,"y":0.775,"capital":false},{"name":"Valewick","x":0.7875,"y":0.6139,"capital":false}]},{"name":"Goleli","subtitle":"The Dominion of Goleli","color":"#a8c0b0","labelX":165.0,"labelY":375.0,"cities":[{"name":"Borist","x":0.0625,"y":0.2028,"capital":true},{"name":"Greenhollow","x":0.0411,"y":0.2861,"capital":false},{"name":"Rynwood","x":0.1018,"y":0.2694,"capital":false},{"name":"Beowick","x":0.0446,"y":0.2139,"capital":false},{"name":"Kronham","x":0.1125,"y":0.3083,"capital":false}]},{"name":"Tethys","subtitle":"Principality of Tethys","color":"#c8c0a0","labelX":1295.0,"labelY":1295.0,"cities":[{"name":"Oldbridge","x":0.4661,"y":0.7083,"capital":true},{"name":"Freehold","x":0.5696,"y":0.7583,"capital":false},{"name":"Freehold","x":0.4411,"y":0.6806,"capital":false},{"name":"Goldug","x":0.4339,"y":0.6861,"capital":false},{"name":"Lakecrest","x":0.5339,"y":0.6528,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Sea of Embers","Sea of Ash","Sea of Winds","Crimson Gulf"]};
ATLAS_METADATA[10] = {"seed":10,"mapName":"ASHENDAL","regions":[{"name":"Morvaine","subtitle":"Kingdom of Morvaine","color":"#ccc088","labelX":595.0,"labelY":605.0,"cities":[{"name":"Jadeston","x":0.2054,"y":0.3361,"capital":true},{"name":"Highwall","x":0.2839,"y":0.3528,"capital":false},{"name":"Pebblecreek","x":0.1375,"y":0.3861,"capital":false},{"name":"Brightmoor","x":0.2554,"y":0.2417,"capital":false}]},{"name":"Verdantia","subtitle":"Duchy of Verdantia","color":"#a8b8a0","labelX":1215.0,"labelY":655.0,"cities":[{"name":"Gerenwalde","x":0.4482,"y":0.3583,"capital":true},{"name":"Cinderfell","x":0.4768,"y":0.4361,"capital":false},{"name":"Stonemere","x":0.5196,"y":0.3361,"capital":false},{"name":"Copperside","x":0.4839,"y":0.4472,"capital":false},{"name":"Loyarn","x":0.3982,"y":0.425,"capital":false},{"name":"Beowick","x":0.4054,"y":0.4361,"capital":false}]},{"name":"Ondara","subtitle":"Principality of Ondara","color":"#c8b490","labelX":825.0,"labelY":1095.0,"cities":[{"name":"Lindel","x":0.2875,"y":0.5917,"capital":true},{"name":"Lawklif","x":0.2161,"y":0.5417,"capital":false},{"name":"Thistledown","x":0.3446,"y":0.6583,"capital":false},{"name":"Brightmoor","x":0.3589,"y":0.575,"capital":false},{"name":"Beowick","x":0.3911,"y":0.5417,"capital":false}]},{"name":"Mistvale","subtitle":"The Free Marches of Mistvale","color":"#a0b0b8","labelX":1955.0,"labelY":735.0,"cities":[{"name":"Alderhaven","x":0.6911,"y":0.4083,"capital":true},{"name":"Knolltown","x":0.7911,"y":0.4472,"capital":false},{"name":"Lakecrest","x":0.6554,"y":0.3639,"capital":false},{"name":"Northgate","x":0.7589,"y":0.4139,"capital":false}]},{"name":"Elonia","subtitle":"Realm of Elonia","color":"#b8c098","labelX":2555.0,"labelY":1195.0,"cities":[{"name":"Ivyreach","x":0.9125,"y":0.6639,"capital":true},{"name":"Ilaes","x":0.9411,"y":0.6083,"capital":false},{"name":"Highwall","x":0.8518,"y":0.6528,"capital":false},{"name":"Thornwall","x":0.8268,"y":0.7194,"capital":false}]},{"name":"Dravina","subtitle":"Kingdom of Dravina","color":"#c4b0a8","labelX":1875.0,"labelY":1375.0,"cities":[{"name":"Duskwater","x":0.6625,"y":0.7806,"capital":true},{"name":"Nighthollow","x":0.6946,"y":0.8528,"capital":false},{"name":"Kingsbridge","x":0.5339,"y":0.7083,"capital":false},{"name":"Urswick","x":0.6446,"y":0.8194,"capital":false}]},{"name":"Nightward","subtitle":"Duchy of Nightward","color":"#a8c0b0","labelX":1275.0,"labelY":1205.0,"cities":[{"name":"Odrin","x":0.4589,"y":0.6694,"capital":true},{"name":"Cliffhaven","x":0.3946,"y":0.6472,"capital":false},{"name":"Ravenmere","x":0.4375,"y":0.6028,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":1405.0,"labelY":525.0},{"name":"Stormcrown Range","labelX":2235.0,"labelY":1315.0},{"name":"Ironspine Range","labelX":1515.0,"labelY":1395.0},{"name":"Frostpeak Mountains","labelX":1125.0,"labelY":1165.0}],"lakes":[],"seaNames":["Sea of Silver","Sea of Frost","Sea of Embers","Sea of Winds","Iron Sea"]};
ATLAS_METADATA[11] = {"seed":11,"mapName":"VERANTHOS","regions":[{"name":"Aethermoor","subtitle":"Realm of Aethermoor","color":"#ccc088","labelX":555.0,"labelY":1205.0,"cities":[{"name":"Wydale","x":0.2161,"y":0.6583,"capital":true},{"name":"Zarakyr","x":0.1875,"y":0.6139,"capital":false},{"name":"Harrowfield","x":0.1482,"y":0.5694,"capital":false},{"name":"Goldenleaf","x":0.1339,"y":0.6806,"capital":false},{"name":"Ivyreach","x":0.1232,"y":0.6694,"capital":false}]},{"name":"Grimvale","subtitle":"The Free Marches of Grimvale","color":"#a8b8a0","labelX":1075.0,"labelY":1095.0,"cities":[{"name":"Brinewood","x":0.3661,"y":0.6028,"capital":true},{"name":"Highwall","x":0.2839,"y":0.6194,"capital":false},{"name":"Lindel","x":0.4125,"y":0.475,"capital":false},{"name":"Windcrest","x":0.4375,"y":0.6028,"capital":false},{"name":"Regnwald","x":0.3304,"y":0.6417,"capital":false},{"name":"Lake Ashveil","x":0.3482,"y":0.5028,"capital":false}]},{"name":"Kharadan","subtitle":"Borderlands of Kharadan","color":"#c8b490","labelX":1665.0,"labelY":655.0,"cities":[{"name":"Borist","x":0.5768,"y":0.3472,"capital":true},{"name":"Thornwall","x":0.4696,"y":0.425,"capital":false},{"name":"Hollowburg","x":0.5125,"y":0.3972,"capital":false},{"name":"Duskhold","x":0.6446,"y":0.325,"capital":false}]},{"name":"Mistvale","subtitle":"The Wilds of Mistvale","color":"#a0b0b8","labelX":1175.0,"labelY":565.0,"cities":[{"name":"Thornwall","x":0.4089,"y":0.3194,"capital":true},{"name":"Beowick","x":0.4125,"y":0.1806,"capital":false},{"name":"Ilaes","x":0.4411,"y":0.2917,"capital":false},{"name":"Jadeston","x":0.4161,"y":0.3806,"capital":false}]},{"name":"Ironreach","subtitle":"Principality of Ironreach","color":"#b8c098","labelX":635.0,"labelY":415.0,"cities":[{"name":"Tidefall","x":0.2375,"y":0.2194,"capital":true},{"name":"Thornwall","x":0.2268,"y":0.2806,"capital":false},{"name":"Vineyard","x":0.3518,"y":0.1639,"capital":false},{"name":"Brinewood","x":0.2804,"y":0.125,"capital":false}]},{"name":"Caltheon","subtitle":"Kingdom of Caltheon","color":"#c4b0a8","labelX":1505.0,"labelY":1065.0,"cities":[{"name":"Zenithburg","x":0.5232,"y":0.575,"capital":true},{"name":"Ashbourne","x":0.6232,"y":0.5194,"capital":false},{"name":"Greenhollow","x":0.4411,"y":0.6528,"capital":false},{"name":"Maplecross","x":0.5696,"y":0.4361,"capital":false},{"name":"Brightmoor","x":0.5625,"y":0.4306,"capital":false}]},{"name":"Ashenveil","subtitle":"Duchy of Ashenveil","color":"#a8c0b0","labelX":1495.0,"labelY":235.0,"cities":[{"name":"Kettlebrook","x":0.5161,"y":0.1139,"capital":true},{"name":"Redthorn","x":0.5196,"y":0.2083,"capital":false},{"name":"Borist","x":0.5696,"y":0.1972,"capital":false},{"name":"Goldenleaf","x":0.5875,"y":0.1861,"capital":false},{"name":"Urswick","x":0.5125,"y":0.0861,"capital":false},{"name":"Freehold","x":0.4411,"y":0.1139,"capital":false}]}],"mountains":[{"name":"Dragon's Spine","labelX":1225.0,"labelY":205.0},{"name":"Frostpeak Mountains","labelX":685.0,"labelY":545.0},{"name":"Stormcrown Range","labelX":1815.0,"labelY":565.0},{"name":"Thundercrest Range","labelX":1435.0,"labelY":1465.0}],"lakes":[{"name":"Lake Ashveil","labelX":975.0,"labelY":953.0}],"seaNames":["Jade Sea","Iron Sea","Sea of Twilight","Pale Sea","Sea of Winds"]};
ATLAS_METADATA[12] = {"seed":12,"mapName":"GRIMHOLDE","regions":[{"name":"Iskarion","subtitle":"Realm of Iskarion","color":"#ccc088","labelX":1205.0,"labelY":365.0,"cities":[{"name":"Ravenmere","x":0.4304,"y":0.2083,"capital":true},{"name":"Hollowburg","x":0.4375,"y":0.275,"capital":false},{"name":"Hollowburg","x":0.5161,"y":0.1806,"capital":false}]},{"name":"Frosthold","subtitle":"Kingdom of Frosthold","color":"#a8b8a0","labelX":2355.0,"labelY":1395.0,"cities":[{"name":"Foxbury","x":0.8518,"y":0.7583,"capital":true},{"name":"Underbridge","x":0.7768,"y":0.7417,"capital":false},{"name":"Ashwick","x":0.8054,"y":0.7194,"capital":false}]},{"name":"Morvaine","subtitle":"Realm of Morvaine","color":"#c8b490","labelX":1695.0,"labelY":615.0,"cities":[{"name":"Ivyreach","x":0.6125,"y":0.2972,"capital":false},{"name":"Lakecrest","x":0.4732,"y":0.2972,"capital":false}]},{"name":"Highkeep","subtitle":"The Free Marches of Highkeep","color":"#a0b0b8","labelX":1625.0,"labelY":1255.0,"cities":[{"name":"Cinderfell","x":0.5946,"y":0.6972,"capital":true},{"name":"Fogmere","x":0.5768,"y":0.6694,"capital":false},{"name":"Feradell","x":0.4982,"y":0.5861,"capital":false},{"name":"Kettlebrook","x":0.5161,"y":0.5861,"capital":false},{"name":"Zenithburg","x":0.5804,"y":0.6972,"capital":false}]},{"name":"Lakeshore","subtitle":"Kingdom of Lakeshore","color":"#b8c098","labelX":855.0,"labelY":795.0,"cities":[{"name":"Anora","x":0.3232,"y":0.425,"capital":true},{"name":"Elmsworth","x":0.3946,"y":0.5028,"capital":false},{"name":"Jadeston","x":0.3696,"y":0.5194,"capital":false},{"name":"Pinewood","x":0.3518,"y":0.5639,"capital":false}]},{"name":"Sunmere","subtitle":"Kingdom of Sunmere","color":"#c4b0a8","labelX":2095.0,"labelY":965.0,"cities":[{"name":"Eagleford","x":0.7625,"y":0.5361,"capital":true},{"name":"Regnwald","x":0.7661,"y":0.5083,"capital":false},{"name":"Tidefall","x":0.7554,"y":0.4583,"capital":false},{"name":"Urswick","x":0.8232,"y":0.5361,"capital":false},{"name":"Thistledown","x":0.7411,"y":0.6194,"capital":false},{"name":"Fernhollow","x":0.6768,"y":0.5861,"capital":false}]}],"mountains":[{"name":"Ashen Divide","labelX":1115.0,"labelY":1065.0},{"name":"Silvervein Ridge","labelX":1525.0,"labelY":305.0},{"name":"Dragon's Spine","labelX":885.0,"labelY":995.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Storms","Sea of Frost","Sea of Dreams","Sea of Silver"]};
ATLAS_METADATA[13] = {"seed":13,"mapName":"CELESTARA","regions":[{"name":"Duskveil","subtitle":"Principality of Duskveil","color":"#ccc088","labelX":2305.0,"labelY":1125.0,"cities":[{"name":"Zarakyr","x":0.8125,"y":0.6083,"capital":true},{"name":"Wydale","x":0.7161,"y":0.6528,"capital":false},{"name":"Pinewood","x":0.7589,"y":0.575,"capital":false},{"name":"Blackrock","x":0.8554,"y":0.6083,"capital":false},{"name":"Dawnwatch","x":0.7732,"y":0.5694,"capital":false}]},{"name":"Wyndell","subtitle":"Principality of Wyndell","color":"#a8b8a0","labelX":1895.0,"labelY":1505.0,"cities":[{"name":"Westmarch","x":0.6446,"y":0.8861,"capital":false},{"name":"Windcrest","x":0.6589,"y":0.8361,"capital":true},{"name":"Stormgate","x":0.5875,"y":0.875,"capital":false}]},{"name":"Moonridge","subtitle":"Realm of Moonridge","color":"#c8b490","labelX":1645.0,"labelY":735.0,"cities":[{"name":"Copperside","x":0.5875,"y":0.3917,"capital":true},{"name":"Vineyard","x":0.5482,"y":0.4694,"capital":false},{"name":"Ironholt","x":0.6804,"y":0.4417,"capital":false},{"name":"Inkwell","x":0.6411,"y":0.2694,"capital":false},{"name":"Blackrock","x":0.5946,"y":0.2583,"capital":false}]},{"name":"Morvaine","subtitle":"Principality of Morvaine","color":"#a0b0b8","labelX":2285.0,"labelY":1545.0,"cities":[{"name":"Ashbourne","x":0.8125,"y":0.8694,"capital":true},{"name":"Moonshadow","x":0.8339,"y":0.7472,"capital":false},{"name":"Fernhollow","x":0.8161,"y":0.7361,"capital":false}]},{"name":"Oakhaven","subtitle":"Duchy of Oakhaven","color":"#b8c098","labelX":1625.0,"labelY":1165.0,"cities":[{"name":"Wydale","x":0.5625,"y":0.6528,"capital":true},{"name":"Dunmore","x":0.5268,"y":0.7472,"capital":false},{"name":"Kronham","x":0.5125,"y":0.5472,"capital":false},{"name":"Yellowfen","x":0.6661,"y":0.6639,"capital":false},{"name":"Regnwald","x":0.5875,"y":0.7472,"capital":false},{"name":"Lake Ponter","x":0.6125,"y":0.6194,"capital":false}]}],"mountains":[{"name":"Thundercrest Range","labelX":2045.0,"labelY":1445.0},{"name":"Ebonwall Mountains","labelX":2295.0,"labelY":895.0}],"lakes":[{"name":"Lake Ponter","labelX":1625.0,"labelY":983.0}],"seaNames":["Sea of Ash","Sea of Silver","Jade Sea","Sea of Dreams","Sea of Twilight"]};
ATLAS_METADATA[14] = {"seed":14,"mapName":"NORDENVAAL","regions":[{"name":"Lakeshore","subtitle":"Duchy of Lakeshore","color":"#ccc088","labelX":2345.0,"labelY":1195.0,"cities":[{"name":"Underbridge","x":0.8518,"y":0.6472,"capital":true},{"name":"Freehold","x":0.7054,"y":0.6361,"capital":false},{"name":"Kronham","x":0.7661,"y":0.675,"capital":false},{"name":"Vineyard","x":0.9446,"y":0.6972,"capital":false},{"name":"Tidefall","x":0.7804,"y":0.6806,"capital":false}]},{"name":"Oakhaven","subtitle":"The Dominion of Oakhaven","color":"#a8b8a0","labelX":1745.0,"labelY":1165.0,"cities":[{"name":"Beowick","x":0.6411,"y":0.6306,"capital":true},{"name":"Yewborough","x":0.6411,"y":0.525,"capital":false}]},{"name":"Verdantia","subtitle":"Realm of Verdantia","color":"#c8b490","labelX":1505.0,"labelY":715.0,"cities":[{"name":"Deepwatch","x":0.5339,"y":0.4028,"capital":true},{"name":"Millcross","x":0.5054,"y":0.525,"capital":false},{"name":"Loyarn","x":0.6232,"y":0.3917,"capital":false},{"name":"Fernhollow","x":0.4411,"y":0.4583,"capital":false},{"name":"Duskhold","x":0.4411,"y":0.375,"capital":false},{"name":"Longmere","x":0.5696,"y":0.3639,"capital":false}]},{"name":"Ironglenn","subtitle":"The Free Marches of Ironglenn","color":"#a0b0b8","labelX":985.0,"labelY":715.0,"cities":[{"name":"Gerenwalde","x":0.3375,"y":0.4083,"capital":true},{"name":"Dunmore","x":0.4161,"y":0.425,"capital":false},{"name":"Yewborough","x":0.2839,"y":0.4528,"capital":false},{"name":"Redthorn","x":0.2875,"y":0.375,"capital":false},{"name":"Gildafell","x":0.3911,"y":0.3861,"capital":false}]},{"name":"Wyndell","subtitle":"The Wilds of Wyndell","color":"#b8c098","labelX":1215.0,"labelY":1255.0,"cities":[{"name":"Thebury","x":0.4268,"y":0.6861,"capital":true},{"name":"Feradell","x":0.3982,"y":0.5917,"capital":false},{"name":"Thistledown","x":0.2804,"y":0.6583,"capital":false},{"name":"Gerenwalde","x":0.4911,"y":0.6306,"capital":false},{"name":"Zenithburg","x":0.3375,"y":0.725,"capital":false}]},{"name":"Evershade","subtitle":"The Dominion of Evershade","color":"#c4b0a8","labelX":425.0,"labelY":915.0,"cities":[{"name":"Anora","x":0.1518,"y":0.4972,"capital":true},{"name":"Harrowfield","x":0.1625,"y":0.3972,"capital":false},{"name":"Fogmere","x":0.0768,"y":0.4361,"capital":false}]},{"name":"Iskarion","subtitle":"Principality of Iskarion","color":"#a8c0b0","labelX":1975.0,"labelY":765.0,"cities":[{"name":"Ironholt","x":0.7125,"y":0.4083,"capital":true},{"name":"Urswick","x":0.7268,"y":0.3861,"capital":false},{"name":"Rynwood","x":0.6804,"y":0.4528,"capital":false},{"name":"Jadeston","x":0.6482,"y":0.475,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Sea of Storms","Sea of Silver","Sea of Frost","Sea of Dreams"]};
ATLAS_METADATA[15] = {"seed":15,"mapName":"EMBERLUND","regions":[{"name":"Aelindor","subtitle":"Kingdom of Aelindor","color":"#ccc088","labelX":2015.0,"labelY":655.0,"cities":[{"name":"Feradell","x":0.7089,"y":0.3528,"capital":true},{"name":"Beowick","x":0.7875,"y":0.325,"capital":false},{"name":"Deepwatch","x":0.6768,"y":0.4417,"capital":false},{"name":"Highwall","x":0.8089,"y":0.3806,"capital":false},{"name":"Maplecross","x":0.7589,"y":0.4028,"capital":false},{"name":"Copperside","x":0.7696,"y":0.3194,"capital":false}]},{"name":"Aethermoor","subtitle":"The Dominion of Aethermoor","color":"#a8b8a0","labelX":1225.0,"labelY":455.0,"cities":[{"name":"Goldug","x":0.4554,"y":0.2639,"capital":true},{"name":"Wydale","x":0.3518,"y":0.3528,"capital":false},{"name":"Beowick","x":0.5054,"y":0.2972,"capital":false},{"name":"Brightmoor","x":0.4589,"y":0.3472,"capital":false},{"name":"Dremoor","x":0.4518,"y":0.325,"capital":false}]},{"name":"Pinecrest","subtitle":"The Dominion of Pinecrest","color":"#c8b490","labelX":555.0,"labelY":685.0,"cities":[{"name":"Borist","x":0.1911,"y":0.3861,"capital":true},{"name":"Ashbourne","x":0.3304,"y":0.425,"capital":false},{"name":"Jadeston","x":0.1518,"y":0.3139,"capital":false}]},{"name":"Ondara","subtitle":"The Wilds of Ondara","color":"#a0b0b8","labelX":365.0,"labelY":1295.0,"cities":[{"name":"Oldbridge","x":0.1125,"y":0.7139,"capital":true},{"name":"Thebury","x":0.1018,"y":0.6139,"capital":false},{"name":"Elmsworth","x":0.0589,"y":0.7083,"capital":false},{"name":"Borist","x":0.1661,"y":0.6306,"capital":false},{"name":"Ilaes","x":0.1268,"y":0.6194,"capital":false},{"name":"Stonemere","x":0.1446,"y":0.5972,"capital":false}]},{"name":"Tarnis","subtitle":"The Wilds of Tarnis","color":"#b8c098","labelX":865.0,"labelY":1325.0,"cities":[{"name":"Stonemere","x":0.3089,"y":0.7417,"capital":true},{"name":"Ashbourne","x":0.2982,"y":0.7806,"capital":false},{"name":"Junipervale","x":0.2482,"y":0.7028,"capital":false},{"name":"Knolltown","x":0.3339,"y":0.6528,"capital":false},{"name":"Yewborough","x":0.3125,"y":0.7861,"capital":false}]},{"name":"Mistvale","subtitle":"The Free Marches of Mistvale","color":"#c4b0a8","labelX":1425.0,"labelY":895.0,"cities":[{"name":"Alderhaven","x":0.5089,"y":0.5083,"capital":false},{"name":"Inkwell","x":0.4839,"y":0.4361,"capital":false},{"name":"Lakecrest","x":0.5196,"y":0.4861,"capital":true},{"name":"Eagleford","x":0.4446,"y":0.475,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Sea of Frost","Sea of Twilight","Sea of Storms","Jade Sea"]};
ATLAS_METADATA[16] = {"seed":16,"mapName":"KHARTOUM","regions":[{"name":"Grimvale","subtitle":"Principality of Grimvale","color":"#ccc088","labelX":1195.0,"labelY":1395.0,"cities":[{"name":"Redthorn","x":0.4339,"y":0.775,"capital":true},{"name":"Eagleford","x":0.4982,"y":0.7194,"capital":false},{"name":"Alderhaven","x":0.3554,"y":0.8083,"capital":false},{"name":"Whitevale","x":0.3982,"y":0.6639,"capital":false},{"name":"Ravenmere","x":0.5339,"y":0.7694,"capital":false},{"name":"Jadeston","x":0.5125,"y":0.7583,"capital":false}]},{"name":"Duskveil","subtitle":"Principality of Duskveil","color":"#a8b8a0","labelX":2375.0,"labelY":865.0,"cities":[{"name":"Maplecross","x":0.8161,"y":0.5417,"capital":false},{"name":"Thistledown","x":0.8375,"y":0.475,"capital":true},{"name":"Brinewood","x":0.7411,"y":0.4694,"capital":false}]},{"name":"Vornhelm","subtitle":"Borderlands of Vornhelm","color":"#c8b490","labelX":245.0,"labelY":1215.0,"cities":[{"name":"Duskwater","x":0.0732,"y":0.675,"capital":true},{"name":"Oldbridge","x":0.0411,"y":0.6972,"capital":false},{"name":"Ashwick","x":0.0482,"y":0.5972,"capital":false}]},{"name":"Valdheim","subtitle":"Duchy of Valdheim","color":"#a0b0b8","labelX":1395.0,"labelY":1025.0,"cities":[{"name":"Dunmore","x":0.5161,"y":0.575,"capital":true},{"name":"Gerenwalde","x":0.5696,"y":0.5361,"capital":false},{"name":"Ashwick","x":0.5804,"y":0.5083,"capital":false},{"name":"Silverton","x":0.5661,"y":0.5417,"capital":false},{"name":"Kronham","x":0.5518,"y":0.5972,"capital":false},{"name":"Longmere","x":0.5625,"y":0.5306,"capital":false}]},{"name":"Sunmere","subtitle":"The Dominion of Sunmere","color":"#b8c098","labelX":2085.0,"labelY":1205.0,"cities":[{"name":"Yewborough","x":0.7304,"y":0.725,"capital":false},{"name":"Kingsbridge","x":0.7018,"y":0.5972,"capital":false},{"name":"Longmere","x":0.7982,"y":0.6861,"capital":false},{"name":"Quartzridge","x":0.7411,"y":0.6861,"capital":true}]},{"name":"Obsidara","subtitle":"The Free Marches of Obsidara","color":"#c4b0a8","labelX":935.0,"labelY":1065.0,"cities":[{"name":"Oakmere","x":0.3232,"y":0.6083,"capital":true},{"name":"Ashbourne","x":0.3375,"y":0.5417,"capital":false},{"name":"Yellowfen","x":0.2839,"y":0.6417,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Sea of Storms","Sea of Embers","Pale Sea","Sea of Dreams"]};
ATLAS_METADATA[17] = {"seed":17,"mapName":"SILVANDOR","regions":[{"name":"Northmere","subtitle":"Principality of Northmere","color":"#ccc088","labelX":1115.0,"labelY":735.0,"cities":[{"name":"Oldbridge","x":0.3804,"y":0.3861,"capital":true},{"name":"Whitevale","x":0.4446,"y":0.5139,"capital":false},{"name":"Blackrock","x":0.4732,"y":0.3583,"capital":false},{"name":"Nighthollow","x":0.3268,"y":0.3917,"capital":false},{"name":"Lakecrest","x":0.4839,"y":0.3861,"capital":false},{"name":"Anora","x":0.2875,"y":0.3972,"capital":false}]},{"name":"Brynmar","subtitle":"Kingdom of Brynmar","color":"#a8b8a0","labelX":1335.0,"labelY":325.0,"cities":[{"name":"Goldenleaf","x":0.4768,"y":0.1917,"capital":true},{"name":"Oldbridge","x":0.4518,"y":0.1694,"capital":false}]},{"name":"Mistvale","subtitle":"Principality of Mistvale","color":"#c8b490","labelX":485.0,"labelY":825.0,"cities":[{"name":"Gerenwalde","x":0.1839,"y":0.475,"capital":true},{"name":"Brinewood","x":0.1518,"y":0.4528,"capital":false},{"name":"Northgate","x":0.2911,"y":0.4861,"capital":false},{"name":"Odrin","x":0.2839,"y":0.4639,"capital":false}]},{"name":"Drakkos","subtitle":"The Dominion of Drakkos","color":"#a0b0b8","labelX":1575.0,"labelY":775.0,"cities":[{"name":"Anora","x":0.5518,"y":0.4472,"capital":true},{"name":"Valewick","x":0.6054,"y":0.475,"capital":false},{"name":"Maplecross","x":0.4946,"y":0.4806,"capital":false},{"name":"Feradell","x":0.6339,"y":0.4528,"capital":false}]},{"name":"Shadowfen","subtitle":"The Dominion of Shadowfen","color":"#b8c098","labelX":2025.0,"labelY":865.0,"cities":[{"name":"Junipervale","x":0.7196,"y":0.475,"capital":true},{"name":"Cinderfell","x":0.7446,"y":0.3694,"capital":false},{"name":"Yellowfen","x":0.7589,"y":0.5361,"capital":false},{"name":"Yellowfen","x":0.6196,"y":0.6861,"capital":false}]},{"name":"Pinecrest","subtitle":"Kingdom of Pinecrest","color":"#c4b0a8","labelX":175.0,"labelY":625.0,"cities":[{"name":"Northgate","x":0.0411,"y":0.3917,"capital":false},{"name":"Loyarn","x":0.0768,"y":0.3194,"capital":false},{"name":"Thebury","x":0.0589,"y":0.425,"capital":false}]},{"name":"Blackmoor","subtitle":"The Wilds of Blackmoor","color":"#a8c0b0","labelX":1615.0,"labelY":1285.0,"cities":[{"name":"Kronham","x":0.5589,"y":0.7139,"capital":true},{"name":"Yellowfen","x":0.5339,"y":0.7694,"capital":false},{"name":"Rynwood","x":0.5839,"y":0.7528,"capital":false},{"name":"Moonshadow","x":0.5875,"y":0.6083,"capital":false},{"name":"Lawklif","x":0.5411,"y":0.7694,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Dreams","Pale Sea","Crimson Gulf","Sea of Silver"]};
ATLAS_METADATA[18] = {"seed":18,"mapName":"WYRMREST","regions":[{"name":"Morvaine","subtitle":"Kingdom of Morvaine","color":"#ccc088","labelX":2135.0,"labelY":965.0,"cities":[{"name":"Borist","x":0.7696,"y":0.5194,"capital":true},{"name":"Dunmore","x":0.8161,"y":0.5806,"capital":false},{"name":"Silverton","x":0.7804,"y":0.5972,"capital":false}]},{"name":"Caeloth","subtitle":"Borderlands of Caeloth","color":"#a8b8a0","labelX":1495.0,"labelY":485.0,"cities":[{"name":"Duskhold","x":0.5339,"y":0.2639,"capital":true},{"name":"Windcrest","x":0.4125,"y":0.2806,"capital":false}]},{"name":"Vornhelm","subtitle":"The Dominion of Vornhelm","color":"#c8b490","labelX":725.0,"labelY":995.0,"cities":[{"name":"Ironholt","x":0.2375,"y":0.5583,"capital":true},{"name":"Regnwald","x":0.3089,"y":0.5861,"capital":false},{"name":"Pebblecreek","x":0.2839,"y":0.4583,"capital":false},{"name":"Gildafell","x":0.1446,"y":0.5583,"capital":false}]},{"name":"Pinecrest","subtitle":"Borderlands of Pinecrest","color":"#a0b0b8","labelX":1745.0,"labelY":1015.0,"cities":[{"name":"Windcrest","x":0.6125,"y":0.575,"capital":true},{"name":"Cliffhaven","x":0.6411,"y":0.6639,"capital":false},{"name":"Northgate","x":0.5375,"y":0.475,"capital":false},{"name":"Kingsbridge","x":0.6482,"y":0.6139,"capital":false},{"name":"Urswick","x":0.6054,"y":0.6472,"capital":false},{"name":"Stormgate","x":0.6982,"y":0.575,"capital":false}]},{"name":"Solwynd","subtitle":"Borderlands of Solwynd","color":"#b8c098","labelX":665.0,"labelY":585.0,"cities":[{"name":"Ashbourne","x":0.2446,"y":0.325,"capital":true},{"name":"Runeford","x":0.1839,"y":0.3472,"capital":false},{"name":"Feradell","x":0.2946,"y":0.3083,"capital":false},{"name":"Harrowfield","x":0.2554,"y":0.2861,"capital":false},{"name":"Lakecrest","x":0.3768,"y":0.3528,"capital":false},{"name":"Whitevale","x":0.2732,"y":0.4083,"capital":false}]},{"name":"Tarnis","subtitle":"The Free Marches of Tarnis","color":"#c4b0a8","labelX":155.0,"labelY":935.0,"cities":[{"name":"Palanor","x":0.0589,"y":0.525,"capital":true},{"name":"Lawklif","x":0.0661,"y":0.625,"capital":false},{"name":"Inkwell","x":0.0696,"y":0.6194,"capital":false},{"name":"Elmsworth","x":0.0589,"y":0.6417,"capital":false}]},{"name":"Iskarion","subtitle":"Kingdom of Iskarion","color":"#a8c0b0","labelX":1125.0,"labelY":1065.0,"cities":[{"name":"Greywater","x":0.3911,"y":0.6028,"capital":true},{"name":"Inkwell","x":0.5089,"y":0.625,"capital":false},{"name":"Anora","x":0.4982,"y":0.6639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Jade Sea","Sea of Dreams","Sea of Twilight","Sea of Winds"]};
ATLAS_METADATA[19] = {"seed":19,"mapName":"THORNWALL","regions":[{"name":"Mistvale","subtitle":"Principality of Mistvale","color":"#ccc088","labelX":1015.0,"labelY":955.0,"cities":[{"name":"Vineyard","x":0.3518,"y":0.5306,"capital":true},{"name":"Elmsworth","x":0.3732,"y":0.6639,"capital":false},{"name":"Urswick","x":0.2982,"y":0.4694,"capital":false},{"name":"Redthorn","x":0.2696,"y":0.5694,"capital":false},{"name":"Moonshadow","x":0.4125,"y":0.5417,"capital":false},{"name":"Moonshadow","x":0.5161,"y":0.4306,"capital":false}]},{"name":"Lakeshore","subtitle":"Duchy of Lakeshore","color":"#a8b8a0","labelX":1785.0,"labelY":985.0,"cities":[{"name":"Lakecrest","x":0.6304,"y":0.5639,"capital":true},{"name":"Vineyard","x":0.6339,"y":0.5083,"capital":false}]},{"name":"Frosthold","subtitle":"The Wilds of Frosthold","color":"#c8b490","labelX":2325.0,"labelY":805.0,"cities":[{"name":"Junipervale","x":0.8268,"y":0.4417,"capital":true},{"name":"Goldenleaf","x":0.7339,"y":0.4028,"capital":false},{"name":"Knolltown","x":0.9411,"y":0.3917,"capital":false},{"name":"Millcross","x":0.7518,"y":0.375,"capital":false},{"name":"Brightmoor","x":0.9232,"y":0.4583,"capital":false},{"name":"Greenhollow","x":0.7161,"y":0.4417,"capital":false}]},{"name":"Kharadan","subtitle":"Realm of Kharadan","color":"#a0b0b8","labelX":1365.0,"labelY":705.0,"cities":[{"name":"Dremoor","x":0.4768,"y":0.3917,"capital":true},{"name":"Duskwater","x":0.4446,"y":0.5361,"capital":false},{"name":"Vineyard","x":0.3768,"y":0.4028,"capital":false},{"name":"Silverton","x":0.5589,"y":0.3694,"capital":false},{"name":"Lindel","x":0.3911,"y":0.3528,"capital":false}]},{"name":"Duskveil","subtitle":"The Wilds of Duskveil","color":"#b8c098","labelX":625.0,"labelY":1265.0,"cities":[{"name":"Beowick","x":0.2125,"y":0.7028,"capital":true},{"name":"Silverton","x":0.2911,"y":0.7528,"capital":false},{"name":"Stormgate","x":0.1196,"y":0.6694,"capital":false},{"name":"Brinewood","x":0.3375,"y":0.7472,"capital":false},{"name":"Blackrock","x":0.3268,"y":0.7139,"capital":false}]},{"name":"Aethermoor","subtitle":"Kingdom of Aethermoor","color":"#c4b0a8","labelX":1875.0,"labelY":505.0,"cities":[{"name":"Whitevale","x":0.6839,"y":0.2917,"capital":true},{"name":"Ilaes","x":0.6768,"y":0.3972,"capital":false},{"name":"Cinderfell","x":0.6625,"y":0.2417,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Dreams","Jade Sea","Crimson Gulf","Sea of Winds","Sea of Twilight"]};
ATLAS_METADATA[20] = {"seed":20,"mapName":"GOLELI","regions":[{"name":"Tethys","subtitle":"Principality of Tethys","color":"#ccc088","labelX":555.0,"labelY":715.0,"cities":[{"name":"Urswick","x":0.1839,"y":0.3806,"capital":true},{"name":"Gerenwalde","x":0.0911,"y":0.3972,"capital":false},{"name":"Northgate","x":0.1661,"y":0.4361,"capital":false},{"name":"Fogmere","x":0.1732,"y":0.3417,"capital":false}]},{"name":"Caeloth","subtitle":"Realm of Caeloth","color":"#a8b8a0","labelX":875.0,"labelY":1255.0,"cities":[{"name":"Thebury","x":0.2982,"y":0.7028,"capital":true},{"name":"Ivyreach","x":0.2661,"y":0.6306,"capital":false},{"name":"Redthorn","x":0.2911,"y":0.7806,"capital":false},{"name":"Kettlebrook","x":0.3554,"y":0.6028,"capital":false},{"name":"Greywater","x":0.3839,"y":0.6417,"capital":false},{"name":"Thistledown","x":0.2446,"y":0.7028,"capital":false}]},{"name":"Dremora","subtitle":"Duchy of Dremora","color":"#c8b490","labelX":1575.0,"labelY":1065.0,"cities":[{"name":"Redthorn","x":0.5589,"y":0.5806,"capital":true},{"name":"Yellowfen","x":0.5018,"y":0.5861,"capital":false},{"name":"Duskhold","x":0.4839,"y":0.5139,"capital":false},{"name":"Duskhold","x":0.4875,"y":0.575,"capital":false},{"name":"Duskhold","x":0.5304,"y":0.6139,"capital":false}]},{"name":"Northmere","subtitle":"Borderlands of Northmere","color":"#a0b0b8","labelX":1205.0,"labelY":585.0,"cities":[{"name":"Gildafell","x":0.4232,"y":0.325,"capital":true},{"name":"Dremoor","x":0.4625,"y":0.3583,"capital":false},{"name":"Nighthollow","x":0.3482,"y":0.3306,"capital":false},{"name":"Copperside","x":0.4696,"y":0.2917,"capital":false}]},{"name":"Mistvale","subtitle":"Realm of Mistvale","color":"#b8c098","labelX":1255.0,"labelY":1415.0,"cities":[{"name":"Westmarch","x":0.4411,"y":0.8083,"capital":true},{"name":"Kettlebrook","x":0.3554,"y":0.8361,"capital":false},{"name":"Jadeston","x":0.4446,"y":0.8306,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Sea of Ash","Sea of Twilight","Sea of Winds","Iron Sea"]};
ATLAS_METADATA[21] = {"seed":21,"mapName":"IRONGATE","regions":[{"name":"Greyhollow","subtitle":"Borderlands of Greyhollow","color":"#ccc088","labelX":415.0,"labelY":885.0,"cities":[{"name":"Stormgate","x":0.1589,"y":0.5028,"capital":true},{"name":"Fernhollow","x":0.1304,"y":0.4417,"capital":false},{"name":"Stonemere","x":0.1911,"y":0.475,"capital":false},{"name":"Tidefall","x":0.0982,"y":0.4639,"capital":false}]},{"name":"Goleli","subtitle":"The Wilds of Goleli","color":"#a8b8a0","labelX":2055.0,"labelY":1335.0,"cities":[{"name":"Lindel","x":0.7482,"y":0.7361,"capital":true},{"name":"Westmarch","x":0.7982,"y":0.7472,"capital":false},{"name":"Gerenwalde","x":0.8304,"y":0.7139,"capital":false},{"name":"Millcross","x":0.7875,"y":0.7528,"capital":false}]},{"name":"Aelindor","subtitle":"Borderlands of Aelindor","color":"#c8b490","labelX":855.0,"labelY":1195.0,"cities":[{"name":"Ashwick","x":0.2946,"y":0.6472,"capital":true},{"name":"Brightmoor","x":0.2982,"y":0.5972,"capital":false},{"name":"Northgate","x":0.2232,"y":0.6639,"capital":false}]},{"name":"Ravenmarch","subtitle":"Kingdom of Ravenmarch","color":"#a0b0b8","labelX":2175.0,"labelY":635.0,"cities":[{"name":"Thebury","x":0.7875,"y":0.3417,"capital":true},{"name":"Ashbourne","x":0.7518,"y":0.3806,"capital":false},{"name":"Knolltown","x":0.7946,"y":0.3361,"capital":false}]},{"name":"Felmoor","subtitle":"Principality of Felmoor","color":"#b8c098","labelX":1335.0,"labelY":1195.0,"cities":[{"name":"Dremoor","x":0.4732,"y":0.6639,"capital":true},{"name":"Palanor","x":0.6089,"y":0.6639,"capital":false},{"name":"Vineyard","x":0.5339,"y":0.6861,"capital":false},{"name":"Borist","x":0.6232,"y":0.6694,"capital":false},{"name":"Goldenleaf","x":0.5554,"y":0.7139,"capital":false}]},{"name":"Northmere","subtitle":"The Wilds of Northmere","color":"#c4b0a8","labelX":1635.0,"labelY":765.0,"cities":[{"name":"Dawnwatch","x":0.5661,"y":0.4361,"capital":true},{"name":"Copperside","x":0.6661,"y":0.4806,"capital":false},{"name":"Borist","x":0.5982,"y":0.4861,"capital":false},{"name":"Lawklif","x":0.6518,"y":0.375,"capital":false},{"name":"Jadeston","x":0.5125,"y":0.5583,"capital":false}]},{"name":"Tarnis","subtitle":"Borderlands of Tarnis","color":"#a8c0b0","labelX":1085.0,"labelY":715.0,"cities":[{"name":"Zarakyr","x":0.3982,"y":0.4194,"capital":true},{"name":"Maplecross","x":0.3625,"y":0.4806,"capital":false},{"name":"Kettlebrook","x":0.4554,"y":0.325,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[{"name":"Lake Varos","labelX":1965.0,"labelY":973.0}],"seaNames":["Sea of Winds","Sea of Frost","Sea of Embers","Sea of Dreams","Sea of Silver"]};
ATLAS_METADATA[22] = {"seed":22,"mapName":"MOONHAVEN","regions":[{"name":"Goleli","subtitle":"The Dominion of Goleli","color":"#ccc088","labelX":845.0,"labelY":1005.0,"cities":[{"name":"Junipervale","x":0.3196,"y":0.5528,"capital":true},{"name":"Whitevale","x":0.3482,"y":0.4472,"capital":false},{"name":"Eagleford","x":0.3446,"y":0.5861,"capital":false},{"name":"Vineyard","x":0.3911,"y":0.5083,"capital":false},{"name":"Ironholt","x":0.3696,"y":0.575,"capital":false},{"name":"Lakecrest","x":0.4125,"y":0.5694,"capital":false}]},{"name":"Rosedale","subtitle":"Realm of Rosedale","color":"#a8b8a0","labelX":1955.0,"labelY":1235.0,"cities":[{"name":"Thistledown","x":0.7125,"y":0.6806,"capital":true},{"name":"Ravenmere","x":0.6946,"y":0.575,"capital":false},{"name":"Deepwatch","x":0.6768,"y":0.6361,"capital":false},{"name":"Lindel","x":0.6589,"y":0.5806,"capital":false}]},{"name":"Brynmar","subtitle":"The Dominion of Brynmar","color":"#c8b490","labelX":1695.0,"labelY":295.0,"cities":[{"name":"Kingsbridge","x":0.5946,"y":0.1694,"capital":true},{"name":"Yellowfen","x":0.6625,"y":0.2083,"capital":false},{"name":"Deepwatch","x":0.5125,"y":0.2139,"capital":false}]},{"name":"Northmere","subtitle":"Borderlands of Northmere","color":"#a0b0b8","labelX":1285.0,"labelY":275.0,"cities":[{"name":"Silverton","x":0.4446,"y":0.1361,"capital":true},{"name":"Knolltown","x":0.5089,"y":0.225,"capital":false},{"name":"Thebury","x":0.4875,"y":0.2583,"capital":false},{"name":"Longmere","x":0.5018,"y":0.0861,"capital":false},{"name":"Millcross","x":0.4875,"y":0.2472,"capital":false}]},{"name":"Pinecrest","subtitle":"Duchy of Pinecrest","color":"#b8c098","labelX":2465.0,"labelY":975.0,"cities":[{"name":"Gildafell","x":0.8661,"y":0.5417,"capital":true},{"name":"Jadeston","x":0.9232,"y":0.5917,"capital":false},{"name":"Kingsbridge","x":0.8268,"y":0.5083,"capital":false},{"name":"Kingsbridge","x":0.8339,"y":0.6028,"capital":false}]},{"name":"Mistvale","subtitle":"The Dominion of Mistvale","color":"#c4b0a8","labelX":1345.0,"labelY":695.0,"cities":[{"name":"Zenithburg","x":0.4982,"y":0.4028,"capital":true},{"name":"Goldug","x":0.4804,"y":0.4528,"capital":false},{"name":"Moonshadow","x":0.5089,"y":0.5306,"capital":false}]},{"name":"Grimvale","subtitle":"Kingdom of Grimvale","color":"#a8c0b0","labelX":1025.0,"labelY":1505.0,"cities":[{"name":"Beowick","x":0.3554,"y":0.8194,"capital":true},{"name":"Underbridge","x":0.3696,"y":0.8417,"capital":false},{"name":"Feradell","x":0.3125,"y":0.8472,"capital":false},{"name":"Duskwater","x":0.2196,"y":0.8028,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Crimson Gulf","Sea of Silver","Sea of Twilight","Sea of Storms"]};
ATLAS_METADATA[23] = {"seed":23,"mapName":"STORMREACH","regions":[{"name":"Korrath","subtitle":"Principality of Korrath","color":"#ccc088","labelX":745.0,"labelY":695.0,"cities":[{"name":"Alderhaven","x":0.2661,"y":0.3917,"capital":true},{"name":"Anora","x":0.1589,"y":0.4528,"capital":false},{"name":"Zenithburg","x":0.2161,"y":0.3417,"capital":false},{"name":"Maplecross","x":0.2304,"y":0.4361,"capital":false},{"name":"Gildafell","x":0.2911,"y":0.4917,"capital":false},{"name":"Blackrock","x":0.2125,"y":0.4306,"capital":false}]},{"name":"Ondara","subtitle":"The Wilds of Ondara","color":"#a8b8a0","labelX":1445.0,"labelY":785.0,"cities":[{"name":"Thebury","x":0.5161,"y":0.425,"capital":true},{"name":"Cliffhaven","x":0.4661,"y":0.4417,"capital":false},{"name":"Stonemere","x":0.4304,"y":0.4917,"capital":false}]},{"name":"Ironglenn","subtitle":"Borderlands of Ironglenn","color":"#c8b490","labelX":1455.0,"labelY":365.0,"cities":[{"name":"Junipervale","x":0.5268,"y":0.1861,"capital":true},{"name":"Kronham","x":0.5661,"y":0.1806,"capital":false},{"name":"Silverton","x":0.5732,"y":0.1917,"capital":false},{"name":"Hollowburg","x":0.5411,"y":0.1472,"capital":false}]},{"name":"Vornhelm","subtitle":"Kingdom of Vornhelm","color":"#a0b0b8","labelX":785.0,"labelY":1385.0,"cities":[{"name":"Blackrock","x":0.2946,"y":0.7583,"capital":true}]},{"name":"Drakkos","subtitle":"Kingdom of Drakkos","color":"#b8c098","labelX":2225.0,"labelY":645.0,"cities":[{"name":"Kronham","x":0.7911,"y":0.3417,"capital":true},{"name":"Foxbury","x":0.8411,"y":0.3194,"capital":false},{"name":"Oldbridge","x":0.7518,"y":0.2806,"capital":false},{"name":"Copperside","x":0.7375,"y":0.2472,"capital":false},{"name":"Westmarch","x":0.7625,"y":0.2583,"capital":false}]},{"name":"Fara","subtitle":"Realm of Fara","color":"#c4b0a8","labelX":255.0,"labelY":1185.0,"cities":[{"name":"Fernhollow","x":0.1018,"y":0.6472,"capital":true},{"name":"Oakmere","x":0.1232,"y":0.5972,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Silver","Sea of Dreams","Iron Sea","Sea of Ash","Sea of Winds"]};
ATLAS_METADATA[24] = {"seed":24,"mapName":"DUSKWALD","regions":[{"name":"Obsidara","subtitle":"Borderlands of Obsidara","color":"#ccc088","labelX":1215.0,"labelY":375.0,"cities":[{"name":"Fogmere","x":0.4411,"y":0.2194,"capital":true},{"name":"Yellowfen","x":0.3804,"y":0.225,"capital":false},{"name":"Highwall","x":0.5054,"y":0.2083,"capital":false}]},{"name":"Korrath","subtitle":"The Free Marches of Korrath","color":"#a8b8a0","labelX":425.0,"labelY":925.0,"cities":[{"name":"Copperside","x":0.1589,"y":0.5083,"capital":true},{"name":"Elmsworth","x":0.1375,"y":0.4639,"capital":false},{"name":"Redthorn","x":0.1625,"y":0.575,"capital":false},{"name":"Dremoor","x":0.2304,"y":0.4806,"capital":false},{"name":"Pinewood","x":0.1375,"y":0.5472,"capital":false}]},{"name":"Kelvor","subtitle":"Principality of Kelvor","color":"#c8b490","labelX":1345.0,"labelY":795.0,"cities":[{"name":"Elmsworth","x":0.4982,"y":0.4528,"capital":true},{"name":"Loyarn","x":0.6161,"y":0.4417,"capital":false},{"name":"Underbridge","x":0.5554,"y":0.3806,"capital":false},{"name":"Dremoor","x":0.4482,"y":0.4861,"capital":false}]},{"name":"Thornwick","subtitle":"The Wilds of Thornwick","color":"#a0b0b8","labelX":1845.0,"labelY":1105.0,"cities":[{"name":"Freehold","x":0.6446,"y":0.5972,"capital":true},{"name":"Vineyard","x":0.7054,"y":0.525,"capital":false},{"name":"Greywater","x":0.7589,"y":0.5917,"capital":false},{"name":"Underbridge","x":0.7375,"y":0.6083,"capital":false}]},{"name":"Moonridge","subtitle":"The Dominion of Moonridge","color":"#b8c098","labelX":1685.0,"labelY":325.0,"cities":[{"name":"Lindel","x":0.5946,"y":0.1806,"capital":true},{"name":"Underbridge","x":0.5161,"y":0.1917,"capital":false},{"name":"Ivyreach","x":0.6661,"y":0.3139,"capital":false}]},{"name":"Wyndell","subtitle":"Realm of Wyndell","color":"#c4b0a8","labelX":825.0,"labelY":605.0,"cities":[{"name":"Redthorn","x":0.3018,"y":0.3194,"capital":true},{"name":"Brightmoor","x":0.3089,"y":0.2583,"capital":false},{"name":"Rynwood","x":0.3911,"y":0.3528,"capital":false},{"name":"Hollowburg","x":0.2054,"y":0.3139,"capital":false}]},{"name":"Frosthold","subtitle":"Kingdom of Frosthold","color":"#a8c0b0","labelX":2405.0,"labelY":665.0,"cities":[{"name":"Brinewood","x":0.8625,"y":0.375,"capital":true},{"name":"Whitevale","x":0.7661,"y":0.4694,"capital":false},{"name":"Duskhold","x":0.8946,"y":0.3306,"capital":false},{"name":"Longmere","x":0.8304,"y":0.425,"capital":false},{"name":"Pebblecreek","x":0.8125,"y":0.4028,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Crimson Gulf","Jade Sea","Sea of Silver","Sea of Dreams"]};
ATLAS_METADATA[25] = {"seed":25,"mapName":"BRIGHTLAND","regions":[{"name":"Nightward","subtitle":"The Free Marches of Nightward","color":"#ccc088","labelX":485.0,"labelY":1105.0,"cities":[{"name":"Duskhold","x":0.1518,"y":0.6028,"capital":true},{"name":"Fernhollow","x":0.0696,"y":0.6583,"capital":false},{"name":"Kronham","x":0.1839,"y":0.5361,"capital":false},{"name":"Longmere","x":0.1875,"y":0.475,"capital":false},{"name":"Oakmere","x":0.2125,"y":0.7028,"capital":false},{"name":"Goldenleaf","x":0.0554,"y":0.6861,"capital":false}]},{"name":"Sunmere","subtitle":"The Free Marches of Sunmere","color":"#a8b8a0","labelX":1295.0,"labelY":815.0,"cities":[{"name":"Longmere","x":0.4661,"y":0.4472,"capital":true},{"name":"Lawklif","x":0.4232,"y":0.525,"capital":false},{"name":"Anora","x":0.4589,"y":0.5583,"capital":false}]},{"name":"Crystalis","subtitle":"Duchy of Crystalis","color":"#c8b490","labelX":885.0,"labelY":1085.0,"cities":[{"name":"Dunmore","x":0.3304,"y":0.5917,"capital":true},{"name":"Zenithburg","x":0.3911,"y":0.6806,"capital":false},{"name":"Zarakyr","x":0.2339,"y":0.6028,"capital":false},{"name":"Zenithburg","x":0.3411,"y":0.5361,"capital":false}]},{"name":"Kharadan","subtitle":"Kingdom of Kharadan","color":"#a0b0b8","labelX":1635.0,"labelY":1035.0,"cities":[{"name":"Ironholt","x":0.5946,"y":0.5806,"capital":true},{"name":"Lindel","x":0.5768,"y":0.5917,"capital":false},{"name":"Kettlebrook","x":0.5482,"y":0.6139,"capital":false},{"name":"Redthorn","x":0.5161,"y":0.575,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Sea of Embers","Sea of Dreams","Sea of Ash","Sea of Winds"]};
ATLAS_METADATA[26] = {"seed":26,"mapName":"AETHERMERE","regions":[{"name":"Korrath","subtitle":"Kingdom of Korrath","color":"#ccc088","labelX":2225.0,"labelY":985.0,"cities":[{"name":"Pinewood","x":0.7946,"y":0.5472,"capital":true},{"name":"Urswick","x":0.8089,"y":0.4639,"capital":false},{"name":"Thistledown","x":0.6875,"y":0.5472,"capital":false},{"name":"Palanor","x":0.7232,"y":0.5417,"capital":false},{"name":"Stormgate","x":0.8446,"y":0.6361,"capital":false},{"name":"Nighthollow","x":0.7482,"y":0.4528,"capital":false}]},{"name":"Felmoor","subtitle":"Borderlands of Felmoor","color":"#a8b8a0","labelX":1795.0,"labelY":735.0,"cities":[{"name":"Anora","x":0.6554,"y":0.425,"capital":true},{"name":"Fernhollow","x":0.7196,"y":0.3583,"capital":false},{"name":"Westmarch","x":0.6268,"y":0.3472,"capital":false}]},{"name":"Brynmar","subtitle":"Kingdom of Brynmar","color":"#c8b490","labelX":885.0,"labelY":1125.0,"cities":[{"name":"Highwall","x":0.3054,"y":0.6361,"capital":false},{"name":"Inkwell","x":0.2268,"y":0.575,"capital":false},{"name":"Millcross","x":0.2982,"y":0.6306,"capital":true},{"name":"Alderhaven","x":0.2125,"y":0.625,"capital":false},{"name":"Dawnwatch","x":0.3482,"y":0.6306,"capital":false}]},{"name":"Dawnhollow","subtitle":"Realm of Dawnhollow","color":"#a0b0b8","labelX":1085.0,"labelY":745.0,"cities":[{"name":"Westmarch","x":0.3875,"y":0.4306,"capital":true},{"name":"Copperside","x":0.4518,"y":0.3861,"capital":false},{"name":"Silverton","x":0.3304,"y":0.3583,"capital":false}]},{"name":"Elonia","subtitle":"Borderlands of Elonia","color":"#b8c098","labelX":595.0,"labelY":725.0,"cities":[{"name":"Ivyreach","x":0.2232,"y":0.4083,"capital":true},{"name":"Palanor","x":0.1089,"y":0.3917,"capital":false},{"name":"Goldug","x":0.2625,"y":0.4583,"capital":false},{"name":"Pebblecreek","x":0.3089,"y":0.3639,"capital":false}]},{"name":"Lakeshore","subtitle":"Realm of Lakeshore","color":"#c4b0a8","labelX":2665.0,"labelY":735.0,"cities":[{"name":"Thistledown","x":0.9589,"y":0.425,"capital":true},{"name":"Valewick","x":0.9589,"y":0.4194,"capital":false},{"name":"Zenithburg","x":0.8839,"y":0.4083,"capital":false},{"name":"Thebury","x":0.9554,"y":0.3694,"capital":false},{"name":"Oakmere","x":0.8375,"y":0.3639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Twilight","Sea of Frost","Jade Sea","Crimson Gulf","Sea of Ash"]};
ATLAS_METADATA[27] = {"seed":27,"mapName":"OBSIDIAN","regions":[{"name":"Mistvale","subtitle":"Principality of Mistvale","color":"#ccc088","labelX":1805.0,"labelY":1175.0,"cities":[{"name":"Wydale","x":0.6518,"y":0.6583,"capital":true},{"name":"Ivyreach","x":0.6089,"y":0.7528,"capital":false},{"name":"Gildafell","x":0.6911,"y":0.6806,"capital":false}]},{"name":"Essear","subtitle":"Principality of Essear","color":"#a8b8a0","labelX":215.0,"labelY":885.0,"cities":[{"name":"Yellowfen","x":0.0732,"y":0.4806,"capital":true},{"name":"Pinewood","x":0.1018,"y":0.5306,"capital":false},{"name":"Valewick","x":0.0411,"y":0.4583,"capital":false},{"name":"Whitevale","x":0.1375,"y":0.5083,"capital":false},{"name":"Feradell","x":0.1304,"y":0.3528,"capital":false}]},{"name":"Belros","subtitle":"The Wilds of Belros","color":"#c8b490","labelX":1415.0,"labelY":855.0,"cities":[{"name":"Redthorn","x":0.5161,"y":0.475,"capital":true},{"name":"Nighthollow","x":0.4804,"y":0.3639,"capital":false},{"name":"Underbridge","x":0.5196,"y":0.4806,"capital":false}]},{"name":"Caltheon","subtitle":"Kingdom of Caltheon","color":"#a0b0b8","labelX":695.0,"labelY":985.0,"cities":[{"name":"Highwall","x":0.2625,"y":0.5583,"capital":true},{"name":"Inkwell","x":0.1411,"y":0.5528,"capital":false},{"name":"Fernhollow","x":0.1804,"y":0.4694,"capital":false}]},{"name":"Silverfen","subtitle":"Duchy of Silverfen","color":"#b8c098","labelX":545.0,"labelY":605.0,"cities":[{"name":"Runeford","x":0.2054,"y":0.325,"capital":true},{"name":"Odrin","x":0.2554,"y":0.3528,"capital":false},{"name":"Greenhollow","x":0.1804,"y":0.3306,"capital":false}]},{"name":"Galanthia","subtitle":"The Free Marches of Galanthia","color":"#c4b0a8","labelX":2285.0,"labelY":1155.0,"cities":[{"name":"Blackrock","x":0.8339,"y":0.625,"capital":true},{"name":"Odrin","x":0.7446,"y":0.5806,"capital":false},{"name":"Lawklif","x":0.8446,"y":0.5361,"capital":false},{"name":"Nighthollow","x":0.7875,"y":0.6639,"capital":false},{"name":"Deepwatch","x":0.7232,"y":0.5806,"capital":false}]},{"name":"Thornemark","subtitle":"The Free Marches of Thornemark","color":"#a8c0b0","labelX":1105.0,"labelY":625.0,"cities":[{"name":"Dunmore","x":0.1232,"y":0.4694,"capital":false},{"name":"Gildafell","x":0.3804,"y":0.3472,"capital":true},{"name":"Stonemere","x":0.3982,"y":0.2972,"capital":false},{"name":"Zenithburg","x":0.4768,"y":0.3639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Sea of Embers","Sea of Storms","Sea of Dreams","Iron Sea"]};
ATLAS_METADATA[28] = {"seed":28,"mapName":"RAVENMARK","regions":[{"name":"Wyndell","subtitle":"The Dominion of Wyndell","color":"#ccc088","labelX":825.0,"labelY":695.0,"cities":[{"name":"Northgate","x":0.2946,"y":0.3694,"capital":true},{"name":"Anora","x":0.1946,"y":0.425,"capital":false},{"name":"Palanor","x":0.2089,"y":0.4194,"capital":false},{"name":"Zarakyr","x":0.2768,"y":0.425,"capital":false},{"name":"Pinewood","x":0.2018,"y":0.3528,"capital":false}]},{"name":"Goleli","subtitle":"Borderlands of Goleli","color":"#a8b8a0","labelX":955.0,"labelY":1395.0,"cities":[{"name":"Cliffhaven","x":0.3482,"y":0.7583,"capital":true},{"name":"Moonshadow","x":0.4696,"y":0.7083,"capital":false},{"name":"Harrowfield","x":0.4411,"y":0.7194,"capital":false},{"name":"Redthorn","x":0.4411,"y":0.7972,"capital":false}]},{"name":"Belros","subtitle":"The Free Marches of Belros","color":"#c8b490","labelX":1335.0,"labelY":1115.0,"cities":[{"name":"Deepwatch","x":0.4839,"y":0.625,"capital":true},{"name":"Ivyreach","x":0.4554,"y":0.6694,"capital":false},{"name":"Foxbury","x":0.4982,"y":0.6806,"capital":false},{"name":"Ivyreach","x":0.5625,"y":0.775,"capital":false},{"name":"Lake Silvane","x":0.4304,"y":0.6194,"capital":false}]},{"name":"Galanthia","subtitle":"Realm of Galanthia","color":"#a0b0b8","labelX":1645.0,"labelY":825.0,"cities":[{"name":"Pinewood","x":0.5946,"y":0.4639,"capital":true},{"name":"Highwall","x":0.6339,"y":0.3694,"capital":false},{"name":"Westmarch","x":0.6089,"y":0.3639,"capital":false},{"name":"Eagleford","x":0.6804,"y":0.4361,"capital":false}]},{"name":"Aethermoor","subtitle":"Duchy of Aethermoor","color":"#b8c098","labelX":1535.0,"labelY":345.0,"cities":[{"name":"Nighthollow","x":0.5411,"y":0.1806,"capital":true},{"name":"Thornwall","x":0.4196,"y":0.2194,"capital":false},{"name":"Maplecross","x":0.5768,"y":0.2861,"capital":false},{"name":"Brinewood","x":0.5125,"y":0.2694,"capital":false},{"name":"Valewick","x":0.6089,"y":0.2806,"capital":false}]},{"name":"Greyhollow","subtitle":"The Wilds of Greyhollow","color":"#c4b0a8","labelX":1945.0,"labelY":1285.0,"cities":[{"name":"Whitevale","x":0.6804,"y":0.7139,"capital":true},{"name":"Ilaes","x":0.7054,"y":0.7417,"capital":false},{"name":"Longmere","x":0.6518,"y":0.6139,"capital":false},{"name":"Wydale","x":0.6089,"y":0.7361,"capital":false},{"name":"Silverton","x":0.7125,"y":0.7417,"capital":false}]}],"mountains":[{"name":"Stormcrown Range","labelX":905.0,"labelY":935.0},{"name":"Ashen Divide","labelX":1435.0,"labelY":1485.0}],"lakes":[{"name":"Lake Silvane","labelX":1065.0,"labelY":1143.0},{"name":"Lake Orvane","labelX":1165.0,"labelY":613.0}],"seaNames":["Sea of Frost","Sea of Winds","Jade Sea","Pale Sea","Sea of Embers"]};
ATLAS_METADATA[29] = {"seed":29,"mapName":"CRYSTHAVEN","regions":[{"name":"Jadecross","subtitle":"Duchy of Jadecross","color":"#ccc088","labelX":1015.0,"labelY":795.0,"cities":[{"name":"Cinderfell","x":0.3804,"y":0.4306,"capital":true},{"name":"Kettlebrook","x":0.3589,"y":0.5306,"capital":false},{"name":"Ivyreach","x":0.4161,"y":0.4861,"capital":false}]},{"name":"Ashmark","subtitle":"The Wilds of Ashmark","color":"#a8b8a0","labelX":525.0,"labelY":1455.0,"cities":[{"name":"Westmarch","x":0.1946,"y":0.825,"capital":true},{"name":"Odrin","x":0.1482,"y":0.7694,"capital":false},{"name":"Pebblecreek","x":0.2268,"y":0.7528,"capital":false},{"name":"Junipervale","x":0.1232,"y":0.7361,"capital":false},{"name":"Jadeston","x":0.2054,"y":0.9028,"capital":false}]},{"name":"Caltheon","subtitle":"Kingdom of Caltheon","color":"#c8b490","labelX":1975.0,"labelY":1025.0,"cities":[{"name":"Urswick","x":0.7232,"y":0.575,"capital":true},{"name":"Gildafell","x":0.7411,"y":0.6472,"capital":false},{"name":"Knolltown","x":0.6446,"y":0.5139,"capital":false},{"name":"Kingsbridge","x":0.6732,"y":0.625,"capital":false}]},{"name":"Thornemark","subtitle":"The Dominion of Thornemark","color":"#a0b0b8","labelX":1565.0,"labelY":1045.0,"cities":[{"name":"Cliffhaven","x":0.5625,"y":0.5694,"capital":true},{"name":"Brinewood","x":0.6268,"y":0.5472,"capital":false},{"name":"Valewick","x":0.5625,"y":0.5139,"capital":false}]},{"name":"Lakeshore","subtitle":"Duchy of Lakeshore","color":"#b8c098","labelX":405.0,"labelY":975.0,"cities":[{"name":"Vineyard","x":0.1554,"y":0.5472,"capital":true},{"name":"Pinewood","x":0.1982,"y":0.525,"capital":false},{"name":"Ivyreach","x":0.0982,"y":0.5694,"capital":false},{"name":"Oakmere","x":0.1054,"y":0.5639,"capital":false},{"name":"Windcrest","x":0.2232,"y":0.525,"capital":false}]},{"name":"Mistvale","subtitle":"The Free Marches of Mistvale","color":"#c4b0a8","labelX":1135.0,"labelY":1385.0,"cities":[{"name":"Thornwall","x":0.3875,"y":0.775,"capital":true},{"name":"Moonshadow","x":0.4232,"y":0.8417,"capital":false},{"name":"Brightmoor","x":0.3018,"y":0.7361,"capital":false},{"name":"Ashbourne","x":0.3054,"y":0.7806,"capital":false},{"name":"Borist","x":0.3018,"y":0.775,"capital":false},{"name":"Regnwald","x":0.3268,"y":0.7528,"capital":false}]},{"name":"Grimvale","subtitle":"Principality of Grimvale","color":"#a8c0b0","labelX":1655.0,"labelY":1505.0,"cities":[{"name":"Goldug","x":0.5732,"y":0.8361,"capital":true},{"name":"Thebury","x":0.5018,"y":0.875,"capital":false},{"name":"Ravenmere","x":0.5089,"y":0.775,"capital":false},{"name":"Borist","x":0.6768,"y":0.8417,"capital":false}]}],"mountains":[{"name":"Stormcrown Range","labelX":1135.0,"labelY":1615.0},{"name":"Ebonwall Mountains","labelX":915.0,"labelY":755.0},{"name":"Thundercrest Range","labelX":635.0,"labelY":995.0},{"name":"Dragon's Spine","labelX":1245.0,"labelY":1365.0}],"lakes":[],"seaNames":["Sea of Embers","Iron Sea","Sea of Dreams","Sea of Storms","Sea of Twilight"]};
ATLAS_METADATA[30] = {"seed":30,"mapName":"FROSTPEAK","regions":[{"name":"Grimvale","subtitle":"Borderlands of Grimvale","color":"#ccc088","labelX":1075.0,"labelY":695.0,"cities":[{"name":"Wydale","x":0.4018,"y":0.3806,"capital":true},{"name":"Palanor","x":0.4196,"y":0.3917,"capital":false},{"name":"Brightmoor","x":0.3911,"y":0.3917,"capital":false}]},{"name":"Windmere","subtitle":"Duchy of Windmere","color":"#a8b8a0","labelX":2285.0,"labelY":615.0,"cities":[{"name":"Junipervale","x":0.8018,"y":0.3361,"capital":true},{"name":"Inkwell","x":0.8304,"y":0.3694,"capital":false},{"name":"Pinewood","x":0.8161,"y":0.3917,"capital":false}]},{"name":"Thornemark","subtitle":"Duchy of Thornemark","color":"#c8b490","labelX":1615.0,"labelY":625.0,"cities":[{"name":"Borist","x":0.5732,"y":0.3361,"capital":true},{"name":"Jadeston","x":0.6232,"y":0.325,"capital":false},{"name":"Vineyard","x":0.5911,"y":0.2417,"capital":false}]},{"name":"Cyrin","subtitle":"Duchy of Cyrin","color":"#a0b0b8","labelX":1255.0,"labelY":1185.0,"cities":[{"name":"Pebblecreek","x":0.4268,"y":0.6417,"capital":true},{"name":"Windcrest","x":0.5304,"y":0.5528,"capital":false},{"name":"Lake Aegir","x":0.3732,"y":0.5972,"capital":false}]},{"name":"Ironglenn","subtitle":"The Free Marches of Ironglenn","color":"#b8c098","labelX":745.0,"labelY":885.0,"cities":[{"name":"Zarakyr","x":0.2554,"y":0.5083,"capital":true},{"name":"Zenithburg","x":0.2089,"y":0.5417,"capital":false},{"name":"Brinewood","x":0.2018,"y":0.5861,"capital":false},{"name":"Zenithburg","x":0.2375,"y":0.5972,"capital":false},{"name":"Ivyreach","x":0.2232,"y":0.525,"capital":false},{"name":"Ironholt","x":0.3196,"y":0.3861,"capital":false}]},{"name":"Caeloth","subtitle":"Kingdom of Caeloth","color":"#c4b0a8","labelX":575.0,"labelY":1295.0,"cities":[{"name":"Deepwatch","x":0.2161,"y":0.7361,"capital":true},{"name":"Gerenwalde","x":0.2982,"y":0.7194,"capital":false},{"name":"Oakmere","x":0.1482,"y":0.725,"capital":false},{"name":"Copperside","x":0.1661,"y":0.7139,"capital":false},{"name":"Brinewood","x":0.2696,"y":0.7861,"capital":false},{"name":"Fogmere","x":0.2768,"y":0.6583,"capital":false}]},{"name":"Aethermoor","subtitle":"Borderlands of Aethermoor","color":"#a8c0b0","labelX":985.0,"labelY":1635.0,"cities":[{"name":"Foxbury","x":0.3339,"y":0.8972,"capital":true},{"name":"Borist","x":0.3661,"y":0.8694,"capital":false},{"name":"Regnwald","x":0.3768,"y":0.775,"capital":false},{"name":"Northgate","x":0.3696,"y":0.825,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":695.0,"labelY":1465.0},{"name":"Stormcrown Range","labelX":885.0,"labelY":1695.0}],"lakes":[{"name":"Lake Aegir","labelX":935.0,"labelY":1133.0}],"seaNames":["Iron Sea","Sea of Storms","Crimson Gulf","Pale Sea","Sea of Silver"]};
ATLAS_METADATA[31] = {"seed":31,"mapName":"VERDANTIS","regions":[{"name":"Dawnhollow","subtitle":"The Wilds of Dawnhollow","color":"#ccc088","labelX":2165.0,"labelY":675.0,"cities":[{"name":"Jadeston","x":0.7732,"y":0.3806,"capital":true},{"name":"Quartzridge","x":0.8482,"y":0.4139,"capital":false},{"name":"Brinewood","x":0.8268,"y":0.375,"capital":false},{"name":"Foxbury","x":0.7732,"y":0.5194,"capital":false},{"name":"Nighthollow","x":0.7339,"y":0.2917,"capital":false}]},{"name":"Ravenmarch","subtitle":"The Dominion of Ravenmarch","color":"#a8b8a0","labelX":1405.0,"labelY":1235.0,"cities":[{"name":"Brinewood","x":0.5089,"y":0.675,"capital":true},{"name":"Deepwatch","x":0.5196,"y":0.7472,"capital":false},{"name":"Millcross","x":0.5232,"y":0.625,"capital":false},{"name":"Stonemere","x":0.4018,"y":0.7361,"capital":false}]},{"name":"Iskarion","subtitle":"The Wilds of Iskarion","color":"#c8b490","labelX":435.0,"labelY":1245.0,"cities":[{"name":"Hollowburg","x":0.1446,"y":0.6972,"capital":true},{"name":"Freehold","x":0.2089,"y":0.7972,"capital":false},{"name":"Ashbourne","x":0.1589,"y":0.8083,"capital":false},{"name":"Nighthollow","x":0.1625,"y":0.625,"capital":false}]},{"name":"Obsidara","subtitle":"Realm of Obsidara","color":"#a0b0b8","labelX":1815.0,"labelY":1035.0,"cities":[{"name":"Pebblecreek","x":0.6446,"y":0.5639,"capital":true},{"name":"Kronham","x":0.5804,"y":0.5917,"capital":false},{"name":"Knolltown","x":0.6661,"y":0.5194,"capital":false},{"name":"Highwall","x":0.6839,"y":0.5306,"capital":false}]},{"name":"Ironreach","subtitle":"The Free Marches of Ironreach","color":"#b8c098","labelX":1125.0,"labelY":575.0,"cities":[{"name":"Thornwall","x":0.4125,"y":0.3028,"capital":true},{"name":"Elmsworth","x":0.2804,"y":0.2861,"capital":false},{"name":"Dunmore","x":0.3518,"y":0.4028,"capital":false},{"name":"Nighthollow","x":0.4589,"y":0.275,"capital":false},{"name":"Westmarch","x":0.5196,"y":0.2806,"capital":false},{"name":"Oakmere","x":0.3018,"y":0.2861,"capital":false}]},{"name":"Theanas","subtitle":"Kingdom of Theanas","color":"#c4b0a8","labelX":2295.0,"labelY":1285.0,"cities":[{"name":"Eagleford","x":0.8018,"y":0.725,"capital":true},{"name":"Longmere","x":0.7268,"y":0.6028,"capital":false},{"name":"Urswick","x":0.8375,"y":0.6861,"capital":false}]},{"name":"Greyhollow","subtitle":"Borderlands of Greyhollow","color":"#a8c0b0","labelX":985.0,"labelY":1095.0,"cities":[{"name":"Lindel","x":0.3411,"y":0.6028,"capital":true},{"name":"Lakecrest","x":0.3732,"y":0.475,"capital":false},{"name":"Kingsbridge","x":0.4196,"y":0.6417,"capital":false},{"name":"Underbridge","x":0.3911,"y":0.7361,"capital":false},{"name":"Lake Varos","x":0.4304,"y":0.625,"capital":false}]},{"name":"Elonia","subtitle":"Kingdom of Elonia","color":"#c8c0a0","labelX":2645.0,"labelY":765.0,"cities":[{"name":"Deepwatch","x":0.9339,"y":0.4417,"capital":true},{"name":"Kronham","x":0.8625,"y":0.3972,"capital":false},{"name":"Runeford","x":0.9411,"y":0.4028,"capital":false},{"name":"Stormgate","x":0.9482,"y":0.4306,"capital":false},{"name":"Goldenleaf","x":0.8482,"y":0.4806,"capital":false}]}],"mountains":[{"name":"Ebonwall Mountains","labelX":1365.0,"labelY":645.0},{"name":"Dragon's Spine","labelX":1995.0,"labelY":945.0},{"name":"Silvervein Ridge","labelX":1695.0,"labelY":535.0},{"name":"Ashen Divide","labelX":1412.2,"labelY":337.0}],"lakes":[{"name":"Lunmere","labelX":735.0,"labelY":1013.0},{"name":"Lake Varos","labelX":1245.0,"labelY":1073.0}],"seaNames":["Sea of Frost","Sea of Dreams","Iron Sea","Sea of Silver","Sea of Twilight"]};
ATLAS_METADATA[32] = {"seed":32,"mapName":"PYRECLIFF","regions":[{"name":"Belros","subtitle":"Principality of Belros","color":"#ccc088","labelX":1345.0,"labelY":355.0,"cities":[{"name":"Inkwell","x":0.4589,"y":0.175,"capital":true},{"name":"Jadeston","x":0.5518,"y":0.1361,"capital":false},{"name":"Vineyard","x":0.5304,"y":0.2472,"capital":false},{"name":"Vineyard","x":0.4268,"y":0.1194,"capital":false},{"name":"Foxbury","x":0.3946,"y":0.1917,"capital":false},{"name":"Longmere","x":0.3446,"y":0.1694,"capital":false}]},{"name":"Aelindor","subtitle":"Principality of Aelindor","color":"#a8b8a0","labelX":1315.0,"labelY":825.0,"cities":[{"name":"Valewick","x":0.4589,"y":0.4694,"capital":true},{"name":"Alderhaven","x":0.4554,"y":0.4139,"capital":false},{"name":"Cliffhaven","x":0.3804,"y":0.3972,"capital":false},{"name":"Lake Thornwell","x":0.4054,"y":0.3917,"capital":false}]},{"name":"Duskveil","subtitle":"The Dominion of Duskveil","color":"#c8b490","labelX":1745.0,"labelY":545.0,"cities":[{"name":"Whitevale","x":0.6375,"y":0.3306,"capital":false},{"name":"Anora","x":0.5482,"y":0.225,"capital":false},{"name":"Gerenwalde","x":0.5554,"y":0.2417,"capital":false},{"name":"Underbridge","x":0.6196,"y":0.3028,"capital":true},{"name":"Dunmore","x":0.6054,"y":0.3917,"capital":false},{"name":"Zenithburg","x":0.5054,"y":0.2917,"capital":false}]},{"name":"Cyrin","subtitle":"Realm of Cyrin","color":"#a0b0b8","labelX":755.0,"labelY":465.0,"cities":[{"name":"Beowick","x":0.2804,"y":0.2583,"capital":true},{"name":"Lawklif","x":0.3196,"y":0.3306,"capital":false},{"name":"Ravenmere","x":0.2661,"y":0.1861,"capital":false}]},{"name":"Kelvor","subtitle":"The Wilds of Kelvor","color":"#b8c098","labelX":1745.0,"labelY":1235.0,"cities":[{"name":"Alderhaven","x":0.6339,"y":0.6972,"capital":true},{"name":"Feradell","x":0.4875,"y":0.6806,"capital":false}]},{"name":"Ironreach","subtitle":"Borderlands of Ironreach","color":"#c4b0a8","labelX":875.0,"labelY":935.0,"cities":[{"name":"Valewick","x":0.3125,"y":0.525,"capital":true},{"name":"Cliffhaven","x":0.2482,"y":0.5806,"capital":false},{"name":"Lawklif","x":0.3911,"y":0.4972,"capital":false},{"name":"Runeford","x":0.2518,"y":0.4472,"capital":false}]},{"name":"Ravenmarch","subtitle":"Borderlands of Ravenmarch","color":"#a8c0b0","labelX":1145.0,"labelY":1285.0,"cities":[{"name":"Moonshadow","x":0.4161,"y":0.6972,"capital":true},{"name":"Zarakyr","x":0.4625,"y":0.6806,"capital":false},{"name":"Goldug","x":0.3804,"y":0.6917,"capital":false}]}],"mountains":[{"name":"Frostpeak Mountains","labelX":1145.0,"labelY":1135.0},{"name":"Ashen Divide","labelX":1325.0,"labelY":1545.0}],"lakes":[{"name":"Lake Thornwell","labelX":1105.0,"labelY":683.0}],"seaNames":["Crimson Gulf","Iron Sea","Pale Sea","Sea of Frost","Jade Sea"]};
ATLAS_METADATA[33] = {"seed":33,"mapName":"SHADOWDEEP","regions":[{"name":"Tarnis","subtitle":"Borderlands of Tarnis","color":"#ccc088","labelX":2235.0,"labelY":575.0,"cities":[{"name":"Gerenwalde","x":0.8161,"y":0.3083,"capital":true},{"name":"Wydale","x":0.7375,"y":0.375,"capital":false},{"name":"Harrowfield","x":0.8589,"y":0.3972,"capital":false},{"name":"Urswick","x":0.8375,"y":0.3528,"capital":false},{"name":"Kronham","x":0.7589,"y":0.3306,"capital":false},{"name":"Goldenleaf","x":0.8589,"y":0.4139,"capital":false}]},{"name":"Korrath","subtitle":"Principality of Korrath","color":"#a8b8a0","labelX":995.0,"labelY":775.0,"cities":[{"name":"Jadeston","x":0.3554,"y":0.4472,"capital":true},{"name":"Zarakyr","x":0.4054,"y":0.3528,"capital":false},{"name":"Pebblecreek","x":0.4054,"y":0.5806,"capital":false}]},{"name":"Ironreach","subtitle":"Kingdom of Ironreach","color":"#c8b490","labelX":1775.0,"labelY":715.0,"cities":[{"name":"Freehold","x":0.6268,"y":0.4028,"capital":true},{"name":"Yellowfen","x":0.6089,"y":0.3417,"capital":false},{"name":"Kronham","x":0.6982,"y":0.4694,"capital":false}]},{"name":"Caeloth","subtitle":"The Free Marches of Caeloth","color":"#a0b0b8","labelX":325.0,"labelY":1105.0,"cities":[{"name":"Kettlebrook","x":0.1232,"y":0.625,"capital":true},{"name":"Duskwater","x":0.1732,"y":0.5861,"capital":false}]},{"name":"Mistvale","subtitle":"Kingdom of Mistvale","color":"#b8c098","labelX":2565.0,"labelY":1065.0,"cities":[{"name":"Foxbury","x":0.9161,"y":0.5917,"capital":true},{"name":"Yewborough","x":0.9268,"y":0.5917,"capital":false},{"name":"Harrowfield","x":0.8732,"y":0.6139,"capital":false}]},{"name":"Verdantia","subtitle":"Realm of Verdantia","color":"#c4b0a8","labelX":2025.0,"labelY":1085.0,"cities":[{"name":"Runeford","x":0.7304,"y":0.6028,"capital":true},{"name":"Knolltown","x":0.7018,"y":0.5583,"capital":false},{"name":"Silverton","x":0.6946,"y":0.4806,"capital":false},{"name":"Zenithburg","x":0.6232,"y":0.6028,"capital":false},{"name":"Lindel","x":0.8196,"y":0.6139,"capital":false},{"name":"Vineyard","x":0.8125,"y":0.6417,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Dreams","Jade Sea","Pale Sea","Crimson Gulf","Sea of Silver"]};
ATLAS_METADATA[34] = {"seed":34,"mapName":"STARFORGE","regions":[{"name":"Silverfen","subtitle":"Kingdom of Silverfen","color":"#ccc088","labelX":1155.0,"labelY":245.0,"cities":[{"name":"Ivyreach","x":0.4304,"y":0.1528,"capital":true},{"name":"Foxbury","x":0.3375,"y":0.2083,"capital":false},{"name":"Elmsworth","x":0.5196,"y":0.1306,"capital":false},{"name":"Lindel","x":0.4804,"y":0.1528,"capital":false}]},{"name":"Northmere","subtitle":"Realm of Northmere","color":"#a8b8a0","labelX":1935.0,"labelY":515.0,"cities":[{"name":"Lawklif","x":0.6911,"y":0.2861,"capital":true},{"name":"Dunmore","x":0.5804,"y":0.3028,"capital":false},{"name":"Knolltown","x":0.7268,"y":0.2861,"capital":false}]},{"name":"Kharadan","subtitle":"Realm of Kharadan","color":"#c8b490","labelX":645.0,"labelY":385.0,"cities":[{"name":"Dremoor","x":0.2161,"y":0.225,"capital":true},{"name":"Cinderfell","x":0.2911,"y":0.1694,"capital":false},{"name":"Pinewood","x":0.2982,"y":0.1972,"capital":false},{"name":"Dimwater","x":0.2054,"y":0.3639,"capital":false}]},{"name":"Lakeshore","subtitle":"Borderlands of Lakeshore","color":"#a0b0b8","labelX":1455.0,"labelY":705.0,"cities":[{"name":"Freehold","x":0.5161,"y":0.3806,"capital":true},{"name":"Inkwell","x":0.5554,"y":0.3972,"capital":false},{"name":"Silverton","x":0.4589,"y":0.4194,"capital":false},{"name":"Dawnwatch","x":0.4589,"y":0.4472,"capital":false}]},{"name":"Pinecrest","subtitle":"Duchy of Pinecrest","color":"#b8c098","labelX":1145.0,"labelY":985.0,"cities":[{"name":"Eagleford","x":0.3911,"y":0.5639,"capital":true},{"name":"Valewick","x":0.3018,"y":0.5472,"capital":false},{"name":"Tidefall","x":0.4589,"y":0.6583,"capital":false},{"name":"Duskhold","x":0.4875,"y":0.5028,"capital":false}]},{"name":"Thornemark","subtitle":"Borderlands of Thornemark","color":"#c4b0a8","labelX":1785.0,"labelY":1055.0,"cities":[{"name":"Silverton","x":0.6268,"y":0.5806,"capital":true},{"name":"Ilaes","x":0.5125,"y":0.5861,"capital":false},{"name":"Eagleford","x":0.7161,"y":0.5306,"capital":false},{"name":"Eagleford","x":0.6268,"y":0.5083,"capital":false}]}],"mountains":[{"name":"Thundercrest Range","labelX":1534.2,"labelY":64.5},{"name":"Ashen Divide","labelX":835.0,"labelY":1135.0},{"name":"Ironspine Range","labelX":1525.0,"labelY":335.0}],"lakes":[{"name":"Dimwater","labelX":525.0,"labelY":773.0},{"name":"Lunmere","labelX":1095.0,"labelY":743.0}],"seaNames":["Jade Sea","Sea of Twilight","Sea of Storms","Sea of Embers","Sea of Winds"]};
ATLAS_METADATA[35] = {"seed":35,"mapName":"THUNDERHOLM","regions":[{"name":"Wyndell","subtitle":"The Wilds of Wyndell","color":"#ccc088","labelX":635.0,"labelY":1005.0,"cities":[{"name":"Moonshadow","x":0.2161,"y":0.5639,"capital":true},{"name":"Redthorn","x":0.3411,"y":0.5194,"capital":false},{"name":"Kingsbridge","x":0.1339,"y":0.575,"capital":false}]},{"name":"Selvane","subtitle":"The Wilds of Selvane","color":"#a8b8a0","labelX":895.0,"labelY":545.0,"cities":[{"name":"Dawnwatch","x":0.3054,"y":0.3083,"capital":true},{"name":"Greywater","x":0.2446,"y":0.2861,"capital":false},{"name":"Moonshadow","x":0.3161,"y":0.3806,"capital":false},{"name":"Thornwall","x":0.1982,"y":0.3028,"capital":false}]},{"name":"Tarnis","subtitle":"Kingdom of Tarnis","color":"#c8b490","labelX":1525.0,"labelY":805.0,"cities":[{"name":"Longmere","x":0.5446,"y":0.4583,"capital":true},{"name":"Gildafell","x":0.6339,"y":0.4583,"capital":false},{"name":"Gerenwalde","x":0.4161,"y":0.525,"capital":false}]},{"name":"Vornhelm","subtitle":"Borderlands of Vornhelm","color":"#a0b0b8","labelX":2605.0,"labelY":835.0,"cities":[{"name":"Greywater","x":0.9482,"y":0.4694,"capital":true},{"name":"Valewick","x":0.9589,"y":0.5472,"capital":false},{"name":"Ilaes","x":0.9589,"y":0.4639,"capital":false},{"name":"Freehold","x":0.8804,"y":0.4806,"capital":false},{"name":"Anora","x":0.9518,"y":0.4194,"capital":false},{"name":"Gildafell","x":0.9554,"y":0.4139,"capital":false}]},{"name":"Dawnhollow","subtitle":"Duchy of Dawnhollow","color":"#b8c098","labelX":1805.0,"labelY":445.0,"cities":[{"name":"Quartzridge","x":0.6554,"y":0.2361,"capital":true},{"name":"Brinewood","x":0.5482,"y":0.2083,"capital":false},{"name":"Freehold","x":0.6768,"y":0.2528,"capital":false},{"name":"Harrowfield","x":0.6589,"y":0.2361,"capital":false},{"name":"Fogmere","x":0.7125,"y":0.275,"capital":false},{"name":"Kronham","x":0.6804,"y":0.3139,"capital":false}]},{"name":"Caltheon","subtitle":"The Free Marches of Caltheon","color":"#c4b0a8","labelX":2165.0,"labelY":865.0,"cities":[{"name":"Rynwood","x":0.7839,"y":0.4917,"capital":true},{"name":"Oldbridge","x":0.8304,"y":0.5306,"capital":false},{"name":"Yellowfen","x":0.7125,"y":0.3917,"capital":false},{"name":"Gerenwalde","x":0.8732,"y":0.4917,"capital":false},{"name":"Borist","x":0.6732,"y":0.4639,"capital":false},{"name":"Brightmoor","x":0.8482,"y":0.4139,"capital":false}]},{"name":"Shadowfen","subtitle":"Principality of Shadowfen","color":"#a8c0b0","labelX":145.0,"labelY":985.0,"cities":[{"name":"Inkwell","x":0.0482,"y":0.5306,"capital":true},{"name":"Millcross","x":0.0411,"y":0.5639,"capital":false},{"name":"Yellowfen","x":0.1268,"y":0.4194,"capital":false},{"name":"Loyarn","x":0.1125,"y":0.4028,"capital":false},{"name":"Ashbourne","x":0.0482,"y":0.4472,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Jade Sea","Sea of Winds","Iron Sea","Pale Sea"]};
ATLAS_METADATA[36] = {"seed":36,"mapName":"BLOODMIRE","regions":[{"name":"Crystalis","subtitle":"Realm of Crystalis","color":"#ccc088","labelX":715.0,"labelY":1415.0,"cities":[{"name":"Stonemere","x":0.2375,"y":0.8028,"capital":true},{"name":"Yellowfen","x":0.2304,"y":0.7139,"capital":false},{"name":"Eagleford","x":0.1196,"y":0.775,"capital":false}]},{"name":"Valdheim","subtitle":"Duchy of Valdheim","color":"#a8b8a0","labelX":1835.0,"labelY":1175.0,"cities":[{"name":"Kronham","x":0.6732,"y":0.6694,"capital":true},{"name":"Thebury","x":0.6161,"y":0.625,"capital":false},{"name":"Knolltown","x":0.7589,"y":0.7139,"capital":false},{"name":"Fogmere","x":0.7339,"y":0.6861,"capital":false}]},{"name":"Nightward","subtitle":"Kingdom of Nightward","color":"#c8b490","labelX":1485.0,"labelY":1335.0,"cities":[{"name":"Harrowfield","x":0.5268,"y":0.7417,"capital":true},{"name":"Valewick","x":0.4804,"y":0.6694,"capital":false},{"name":"Dunmore","x":0.4946,"y":0.7972,"capital":false},{"name":"Brightmoor","x":0.6089,"y":0.6694,"capital":false}]},{"name":"Kelvor","subtitle":"Realm of Kelvor","color":"#a0b0b8","labelX":1725.0,"labelY":685.0,"cities":[{"name":"Thistledown","x":0.6161,"y":0.4472,"capital":false},{"name":"Eagleford","x":0.6304,"y":0.3917,"capital":false},{"name":"Beowick","x":0.6696,"y":0.4194,"capital":false},{"name":"Ironholt","x":0.6089,"y":0.3806,"capital":true},{"name":"Brightmoor","x":0.5482,"y":0.375,"capital":false},{"name":"Greenhollow","x":0.5375,"y":0.3639,"capital":false}]},{"name":"Pinecrest","subtitle":"Borderlands of Pinecrest","color":"#b8c098","labelX":995.0,"labelY":735.0,"cities":[{"name":"Kingsbridge","x":0.3661,"y":0.4194,"capital":true},{"name":"Brinewood","x":0.4839,"y":0.4083,"capital":false},{"name":"Dawnwatch","x":0.4768,"y":0.4139,"capital":false}]},{"name":"Aelindor","subtitle":"The Wilds of Aelindor","color":"#c4b0a8","labelX":595.0,"labelY":945.0,"cities":[{"name":"Blackrock","x":0.2089,"y":0.5361,"capital":true},{"name":"Palanor","x":0.2589,"y":0.5694,"capital":false},{"name":"Goldenleaf","x":0.2018,"y":0.6028,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Sea of Embers","Sea of Silver","Sea of Storms","Iron Sea"]};
ATLAS_METADATA[37] = {"seed":37,"mapName":"ASHENMOOR","regions":[{"name":"Verdantia","subtitle":"Duchy of Verdantia","color":"#ccc088","labelX":875.0,"labelY":595.0,"cities":[{"name":"Freehold","x":0.3125,"y":0.325,"capital":true},{"name":"Hollowburg","x":0.2375,"y":0.325,"capital":false},{"name":"Cliffhaven","x":0.4446,"y":0.3472,"capital":false},{"name":"Kettlebrook","x":0.3589,"y":0.2583,"capital":false}]},{"name":"Windmere","subtitle":"Borderlands of Windmere","color":"#a8b8a0","labelX":2015.0,"labelY":1255.0,"cities":[{"name":"Westmarch","x":0.7161,"y":0.7083,"capital":true},{"name":"Longmere","x":0.6554,"y":0.7028,"capital":false}]},{"name":"Ondara","subtitle":"Principality of Ondara","color":"#c8b490","labelX":645.0,"labelY":1085.0,"cities":[{"name":"Windcrest","x":0.2161,"y":0.5972,"capital":true},{"name":"Lawklif","x":0.2161,"y":0.6139,"capital":false},{"name":"Urswick","x":0.1518,"y":0.4806,"capital":false},{"name":"Goldug","x":0.1375,"y":0.4639,"capital":false}]},{"name":"Moonridge","subtitle":"The Dominion of Moonridge","color":"#a0b0b8","labelX":2585.0,"labelY":855.0,"cities":[{"name":"Harrowfield","x":0.9339,"y":0.4583,"capital":true},{"name":"Jadeston","x":0.8054,"y":0.4361,"capital":false},{"name":"Kronham","x":0.9268,"y":0.5639,"capital":false}]},{"name":"Korrath","subtitle":"Principality of Korrath","color":"#b8c098","labelX":1545.0,"labelY":1105.0,"cities":[{"name":"Greywater","x":0.5446,"y":0.6139,"capital":true},{"name":"Pebblecreek","x":0.6196,"y":0.6472,"capital":false},{"name":"Valewick","x":0.4696,"y":0.6417,"capital":false},{"name":"Ashbourne","x":0.5018,"y":0.675,"capital":false},{"name":"Cinderfell","x":0.6375,"y":0.6694,"capital":false},{"name":"Ashwick","x":0.5625,"y":0.5806,"capital":false}]},{"name":"Ashmark","subtitle":"The Dominion of Ashmark","color":"#c4b0a8","labelX":1905.0,"labelY":635.0,"cities":[{"name":"Elmsworth","x":0.6732,"y":0.3694,"capital":true},{"name":"Lakecrest","x":0.8018,"y":0.3694,"capital":false},{"name":"Duskhold","x":0.7982,"y":0.3806,"capital":false},{"name":"Dremoor","x":0.7304,"y":0.4139,"capital":false},{"name":"Ironholt","x":0.5982,"y":0.325,"capital":false},{"name":"Millcross","x":0.5482,"y":0.3361,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Dreams","Jade Sea","Sea of Winds","Iron Sea","Sea of Frost"]};
ATLAS_METADATA[38] = {"seed":38,"mapName":"WINDHOLLOW","regions":[{"name":"Ravenmarch","subtitle":"Duchy of Ravenmarch","color":"#ccc088","labelX":495.0,"labelY":1365.0,"cities":[{"name":"Valewick","x":0.1768,"y":0.7528,"capital":true},{"name":"Wydale","x":0.1804,"y":0.775,"capital":false},{"name":"Wydale","x":0.1411,"y":0.775,"capital":false}]},{"name":"Morvaine","subtitle":"Realm of Morvaine","color":"#a8b8a0","labelX":225.0,"labelY":615.0,"cities":[{"name":"Runeford","x":0.0875,"y":0.3528,"capital":true},{"name":"Valewick","x":0.0589,"y":0.3917,"capital":false},{"name":"Nighthollow","x":0.1589,"y":0.4194,"capital":false},{"name":"Ravenmere","x":0.1196,"y":0.2528,"capital":false},{"name":"Longmere","x":0.1339,"y":0.4417,"capital":false}]},{"name":"Dremora","subtitle":"Borderlands of Dremora","color":"#c8b490","labelX":815.0,"labelY":845.0,"cities":[{"name":"Westmarch","x":0.2911,"y":0.4694,"capital":true},{"name":"Yewborough","x":0.2982,"y":0.3972,"capital":false},{"name":"Loyarn","x":0.2732,"y":0.575,"capital":false},{"name":"Kingsbridge","x":0.3911,"y":0.3972,"capital":false}]},{"name":"Ondara","subtitle":"Borderlands of Ondara","color":"#a0b0b8","labelX":1315.0,"labelY":355.0,"cities":[{"name":"Loyarn","x":0.4768,"y":0.1861,"capital":true},{"name":"Lawklif","x":0.5696,"y":0.1861,"capital":false},{"name":"Valewick","x":0.5375,"y":0.275,"capital":false}]},{"name":"Nightward","subtitle":"Duchy of Nightward","color":"#b8c098","labelX":1295.0,"labelY":895.0,"cities":[{"name":"Thebury","x":0.4768,"y":0.5028,"capital":true},{"name":"Dawnwatch","x":0.5125,"y":0.3972,"capital":false},{"name":"Ashbourne","x":0.4411,"y":0.4083,"capital":false},{"name":"Highwall","x":0.5411,"y":0.4917,"capital":false}]},{"name":"Kelvor","subtitle":"Realm of Kelvor","color":"#c4b0a8","labelX":1095.0,"labelY":1315.0,"cities":[{"name":"Thistledown","x":0.3839,"y":0.7361,"capital":true},{"name":"Westmarch","x":0.2875,"y":0.7861,"capital":false},{"name":"Oldbridge","x":0.4482,"y":0.7306,"capital":false}]},{"name":"Vornhelm","subtitle":"The Wilds of Vornhelm","color":"#a8c0b0","labelX":1715.0,"labelY":665.0,"cities":[{"name":"Foxbury","x":0.6054,"y":0.375,"capital":true},{"name":"Vineyard","x":0.5339,"y":0.425,"capital":false},{"name":"Brightmoor","x":0.6268,"y":0.425,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Sea of Embers","Jade Sea","Crimson Gulf","Sea of Frost"]};
ATLAS_METADATA[39] = {"seed":39,"mapName":"DAWNSPIRE","regions":[{"name":"Jadecross","subtitle":"Realm of Jadecross","color":"#ccc088","labelX":1835.0,"labelY":775.0,"cities":[{"name":"Stonemere","x":0.6661,"y":0.4194,"capital":true},{"name":"Moonshadow","x":0.7411,"y":0.4194,"capital":false},{"name":"Oldbridge","x":0.5768,"y":0.5139,"capital":false},{"name":"Thebury","x":0.7482,"y":0.4583,"capital":false},{"name":"Windcrest","x":0.5625,"y":0.4861,"capital":false}]},{"name":"Brynmar","subtitle":"Principality of Brynmar","color":"#a8b8a0","labelX":1205.0,"labelY":475.0,"cities":[{"name":"Kronham","x":0.4446,"y":0.2694,"capital":true},{"name":"Gildafell","x":0.5339,"y":0.375,"capital":false},{"name":"Thornwall","x":0.5589,"y":0.2139,"capital":false}]},{"name":"Silverfen","subtitle":"The Wilds of Silverfen","color":"#c8b490","labelX":2135.0,"labelY":1175.0,"cities":[{"name":"Blackrock","x":0.7625,"y":0.6694,"capital":true},{"name":"Fernhollow","x":0.6554,"y":0.6528,"capital":false},{"name":"Zenithburg","x":0.7411,"y":0.6083,"capital":false}]},{"name":"Caltheon","subtitle":"Principality of Caltheon","color":"#a0b0b8","labelX":1515.0,"labelY":1045.0,"cities":[{"name":"Millcross","x":0.5232,"y":0.5861,"capital":true},{"name":"Brightmoor","x":0.5089,"y":0.6417,"capital":false}]},{"name":"Ondara","subtitle":"Duchy of Ondara","color":"#b8c098","labelX":535.0,"labelY":545.0,"cities":[{"name":"Pebblecreek","x":0.1732,"y":0.3028,"capital":true},{"name":"Fernhollow","x":0.2304,"y":0.2861,"capital":false},{"name":"Brightmoor","x":0.2268,"y":0.275,"capital":false},{"name":"Ravenmere","x":0.0518,"y":0.3083,"capital":false}]},{"name":"Valdheim","subtitle":"Kingdom of Valdheim","color":"#c4b0a8","labelX":705.0,"labelY":995.0,"cities":[{"name":"Zenithburg","x":0.2446,"y":0.5361,"capital":true},{"name":"Cliffhaven","x":0.2304,"y":0.4417,"capital":false},{"name":"Ashbourne","x":0.2696,"y":0.4861,"capital":false},{"name":"Kingsbridge","x":0.3304,"y":0.5361,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Crimson Gulf","Sea of Storms","Sea of Silver","Jade Sea"]};
ATLAS_METADATA[40] = {"seed":40,"mapName":"CINDERFALL","regions":[{"name":"Oakhaven","subtitle":"Kingdom of Oakhaven","color":"#ccc088","labelX":885.0,"labelY":965.0,"cities":[{"name":"Gerenwalde","x":0.3339,"y":0.5361,"capital":true},{"name":"Oakmere","x":0.3268,"y":0.6139,"capital":false},{"name":"Ashbourne","x":0.2982,"y":0.4917,"capital":false},{"name":"Palanor","x":0.2696,"y":0.5139,"capital":false},{"name":"Northgate","x":0.3018,"y":0.475,"capital":false}]},{"name":"Vornhelm","subtitle":"The Wilds of Vornhelm","color":"#a8b8a0","labelX":2315.0,"labelY":775.0,"cities":[{"name":"Dawnwatch","x":0.8411,"y":0.425,"capital":true},{"name":"Odrin","x":0.8768,"y":0.2861,"capital":false},{"name":"Cliffhaven","x":0.7911,"y":0.4861,"capital":false},{"name":"Oldbridge","x":0.9339,"y":0.4028,"capital":false},{"name":"Gildafell","x":0.8125,"y":0.3528,"capital":false}]},{"name":"Thornwick","subtitle":"Duchy of Thornwick","color":"#c8b490","labelX":1535.0,"labelY":875.0,"cities":[{"name":"Fogmere","x":0.5446,"y":0.4694,"capital":true},{"name":"Urswick","x":0.6268,"y":0.4306,"capital":false},{"name":"Vineyard","x":0.4625,"y":0.525,"capital":false},{"name":"Northgate","x":0.5161,"y":0.5972,"capital":false},{"name":"Highwall","x":0.4875,"y":0.4806,"capital":false}]},{"name":"Felmoor","subtitle":"The Free Marches of Felmoor","color":"#a0b0b8","labelX":1775.0,"labelY":445.0,"cities":[{"name":"Foxbury","x":0.6482,"y":0.2417,"capital":true},{"name":"Dremoor","x":0.7375,"y":0.3194,"capital":false},{"name":"Valewick","x":0.6054,"y":0.2639,"capital":false},{"name":"Runeford","x":0.5518,"y":0.1917,"capital":false},{"name":"Knolltown","x":0.6089,"y":0.1861,"capital":false}]},{"name":"Grimvale","subtitle":"The Dominion of Grimvale","color":"#b8c098","labelX":265.0,"labelY":1215.0,"cities":[{"name":"Oldbridge","x":0.0982,"y":0.6861,"capital":true},{"name":"Cinderfell","x":0.0696,"y":0.7528,"capital":false},{"name":"Westmarch","x":0.1018,"y":0.5639,"capital":false},{"name":"Gerenwalde","x":0.0732,"y":0.5806,"capital":false}]},{"name":"Obsidara","subtitle":"The Dominion of Obsidara","color":"#c4b0a8","labelX":1265.0,"labelY":1315.0,"cities":[{"name":"Greenhollow","x":0.4589,"y":0.7139,"capital":true},{"name":"Yewborough","x":0.3696,"y":0.7361,"capital":false},{"name":"Maplecross","x":0.4304,"y":0.6639,"capital":false},{"name":"Lawklif","x":0.3446,"y":0.7083,"capital":false},{"name":"Highwall","x":0.3482,"y":0.7194,"capital":false}]},{"name":"Wyndell","subtitle":"Kingdom of Wyndell","color":"#a8c0b0","labelX":1945.0,"labelY":1075.0,"cities":[{"name":"Harrowfield","x":0.6875,"y":0.6306,"capital":false},{"name":"Fernhollow","x":0.7446,"y":0.5917,"capital":false},{"name":"Lindel","x":0.7482,"y":0.5861,"capital":false},{"name":"Longmere","x":0.7446,"y":0.5806,"capital":false},{"name":"Eagleford","x":0.7232,"y":0.5972,"capital":false},{"name":"Gildafell","x":0.6911,"y":0.6028,"capital":true}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Crimson Gulf","Sea of Silver","Sea of Twilight","Sea of Winds"]};
ATLAS_METADATA[41] = {"seed":41,"mapName":"NETHERVEIL","regions":[{"name":"Grimvale","subtitle":"The Free Marches of Grimvale","color":"#ccc088","labelX":2165.0,"labelY":1365.0,"cities":[{"name":"Rynwood","x":0.7625,"y":0.7417,"capital":true},{"name":"Quartzridge","x":0.8696,"y":0.7472,"capital":false},{"name":"Alderhaven","x":0.7125,"y":0.8139,"capital":false}]},{"name":"Selvane","subtitle":"Principality of Selvane","color":"#a8b8a0","labelX":975.0,"labelY":975.0,"cities":[{"name":"Oldbridge","x":0.3589,"y":0.5361,"capital":true},{"name":"Odrin","x":0.3339,"y":0.4806,"capital":false},{"name":"Eagleford","x":0.4589,"y":0.5306,"capital":false}]},{"name":"Pinecrest","subtitle":"Principality of Pinecrest","color":"#c8b490","labelX":2665.0,"labelY":1265.0,"cities":[{"name":"Ashbourne","x":0.9589,"y":0.7083,"capital":true},{"name":"Jadeston","x":0.9018,"y":0.775,"capital":false},{"name":"Ironholt","x":0.9589,"y":0.675,"capital":false},{"name":"Stonemere","x":0.9589,"y":0.5917,"capital":false},{"name":"Moonshadow","x":0.8804,"y":0.7417,"capital":false}]},{"name":"Cyrin","subtitle":"Kingdom of Cyrin","color":"#a0b0b8","labelX":2425.0,"labelY":845.0,"cities":[{"name":"Harrowfield","x":0.8696,"y":0.4583,"capital":true},{"name":"Palanor","x":0.8375,"y":0.4083,"capital":false},{"name":"Dremoor","x":0.9589,"y":0.4972,"capital":false}]},{"name":"Ondara","subtitle":"Realm of Ondara","color":"#b8c098","labelX":1405.0,"labelY":1265.0,"cities":[{"name":"Tidefall","x":0.5018,"y":0.6861,"capital":true},{"name":"Vineyard","x":0.5946,"y":0.775,"capital":false},{"name":"Ironholt","x":0.3982,"y":0.7472,"capital":false},{"name":"Lawklif","x":0.5482,"y":0.6417,"capital":false},{"name":"Cinderfell","x":0.4232,"y":0.8083,"capital":false}]},{"name":"Pyremarch","subtitle":"The Free Marches of Pyremarch","color":"#c4b0a8","labelX":1865.0,"labelY":685.0,"cities":[{"name":"Alderhaven","x":0.6732,"y":0.3972,"capital":true},{"name":"Duskhold","x":0.5839,"y":0.4083,"capital":false},{"name":"Longmere","x":0.7768,"y":0.4194,"capital":false},{"name":"Kettlebrook","x":0.6732,"y":0.3306,"capital":false}]},{"name":"Valdheim","subtitle":"The Dominion of Valdheim","color":"#a8c0b0","labelX":1385.0,"labelY":755.0,"cities":[{"name":"Ilaes","x":0.4982,"y":0.425,"capital":true},{"name":"Underbridge","x":0.5661,"y":0.3528,"capital":false},{"name":"Ravenmere","x":0.4446,"y":0.3806,"capital":false},{"name":"Zarakyr","x":0.5804,"y":0.4472,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":1625.0,"labelY":1485.0},{"name":"Thundercrest Range","labelX":2095.0,"labelY":1055.0},{"name":"Stormcrown Range","labelX":1895.0,"labelY":1485.0}],"lakes":[],"seaNames":["Sea of Storms","Sea of Silver","Iron Sea","Sea of Twilight","Sea of Ash"]};
ATLAS_METADATA[42] = {"seed":42,"mapName":"GALENDRIS","regions":[{"name":"Obsidara","subtitle":"The Dominion of Obsidara","color":"#ccc088","labelX":2195.0,"labelY":955.0,"cities":[{"name":"Lakecrest","x":0.7804,"y":0.5472,"capital":true},{"name":"Dunmore","x":0.8268,"y":0.5306,"capital":false},{"name":"Stonemere","x":0.7875,"y":0.4861,"capital":false},{"name":"Fogmere","x":0.6982,"y":0.475,"capital":false}]},{"name":"Morvaine","subtitle":"Principality of Morvaine","color":"#a8b8a0","labelX":1185.0,"labelY":825.0,"cities":[{"name":"Cinderfell","x":0.4054,"y":0.4639,"capital":true},{"name":"Thebury","x":0.4661,"y":0.4472,"capital":false},{"name":"Greenhollow","x":0.4482,"y":0.6139,"capital":false},{"name":"Foxbury","x":0.4589,"y":0.5028,"capital":false},{"name":"Goldug","x":0.4589,"y":0.4972,"capital":false},{"name":"Ashbourne","x":0.3732,"y":0.3806,"capital":false}]},{"name":"Theanas","subtitle":"Principality of Theanas","color":"#c8b490","labelX":1765.0,"labelY":1155.0,"cities":[{"name":"Kronham","x":0.6411,"y":0.6361,"capital":true},{"name":"Vineyard","x":0.6911,"y":0.625,"capital":false},{"name":"Ironholt","x":0.6625,"y":0.5806,"capital":false},{"name":"Yewborough","x":0.5911,"y":0.6194,"capital":false},{"name":"Freehold","x":0.6589,"y":0.6583,"capital":false},{"name":"Dawnwatch","x":0.6696,"y":0.6694,"capital":false}]},{"name":"Aelindor","subtitle":"Kingdom of Aelindor","color":"#a0b0b8","labelX":325.0,"labelY":875.0,"cities":[{"name":"Copperside","x":0.1304,"y":0.4806,"capital":true},{"name":"Wydale","x":0.0946,"y":0.4861,"capital":false},{"name":"Fernhollow","x":0.1946,"y":0.4028,"capital":false},{"name":"Nighthollow","x":0.1982,"y":0.3528,"capital":false}]},{"name":"Grimvale","subtitle":"Kingdom of Grimvale","color":"#b8c098","labelX":1025.0,"labelY":385.0,"cities":[{"name":"Brightmoor","x":0.3554,"y":0.2139,"capital":true},{"name":"Windcrest","x":0.2911,"y":0.1861,"capital":false},{"name":"Ashbourne","x":0.4375,"y":0.2639,"capital":false},{"name":"Zarakyr","x":0.3125,"y":0.2861,"capital":false},{"name":"Duskwater","x":0.2911,"y":0.3306,"capital":false},{"name":"Knolltown","x":0.3946,"y":0.225,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Sea of Silver","Crimson Gulf","Sea of Dreams","Sea of Frost"]};
ATLAS_METADATA[43] = {"seed":43,"mapName":"STORMVALE","regions":[{"name":"Brynmar","subtitle":"The Free Marches of Brynmar","color":"#ccc088","labelX":1165.0,"labelY":535.0,"cities":[{"name":"Ilaes","x":0.4339,"y":0.2972,"capital":true},{"name":"Duskhold","x":0.4732,"y":0.2417,"capital":false},{"name":"Rynwood","x":0.4125,"y":0.4028,"capital":false},{"name":"Duskhold","x":0.5161,"y":0.2306,"capital":false},{"name":"Ivyreach","x":0.5018,"y":0.1639,"capital":false}]},{"name":"Essear","subtitle":"Kingdom of Essear","color":"#a8b8a0","labelX":1485.0,"labelY":1115.0,"cities":[{"name":"Goldug","x":0.5268,"y":0.625,"capital":true},{"name":"Whitevale","x":0.4661,"y":0.5861,"capital":false},{"name":"Urswick","x":0.4768,"y":0.6361,"capital":false},{"name":"Urswick","x":0.5161,"y":0.7139,"capital":false},{"name":"Lunmere","x":0.5982,"y":0.7028,"capital":false}]},{"name":"Solwynd","subtitle":"Kingdom of Solwynd","color":"#c8b490","labelX":1695.0,"labelY":545.0,"cities":[{"name":"Tidefall","x":0.5911,"y":0.2972,"capital":true},{"name":"Redthorn","x":0.5554,"y":0.2861,"capital":false},{"name":"Duskhold","x":0.5375,"y":0.125,"capital":false}]},{"name":"Ondara","subtitle":"Duchy of Ondara","color":"#a0b0b8","labelX":2205.0,"labelY":1055.0,"cities":[{"name":"Duskwater","x":0.7982,"y":0.6028,"capital":true},{"name":"Thistledown","x":0.6589,"y":0.5639,"capital":false},{"name":"Rynwood","x":0.8411,"y":0.6306,"capital":false},{"name":"Yewborough","x":0.7625,"y":0.6917,"capital":false}]},{"name":"Caltheon","subtitle":"The Free Marches of Caltheon","color":"#b8c098","labelX":1405.0,"labelY":1545.0,"cities":[{"name":"Maplecross","x":0.4946,"y":0.8583,"capital":true},{"name":"Brightmoor","x":0.3732,"y":0.7417,"capital":false},{"name":"Cinderfell","x":0.4946,"y":0.7417,"capital":false},{"name":"Copperside","x":0.5268,"y":0.8139,"capital":false}]},{"name":"Vornhelm","subtitle":"Realm of Vornhelm","color":"#c4b0a8","labelX":865.0,"labelY":945.0,"cities":[{"name":"Fernhollow","x":0.3161,"y":0.5306,"capital":true},{"name":"Beowick","x":0.2875,"y":0.4639,"capital":false},{"name":"Eagleford","x":0.3732,"y":0.5028,"capital":false}]}],"mountains":[{"name":"Ashen Divide","labelX":1525.0,"labelY":335.0},{"name":"Thundercrest Range","labelX":1165.0,"labelY":1165.0},{"name":"Ebonwall Mountains","labelX":2445.0,"labelY":785.0}],"lakes":[{"name":"Lunmere","labelX":1615.0,"labelY":1133.0},{"name":"Dimwater","labelX":1375.0,"labelY":683.0}],"seaNames":["Sea of Twilight","Sea of Silver","Sea of Ash","Sea of Frost","Iron Sea"]};
ATLAS_METADATA[44] = {"seed":44,"mapName":"RUNEHEIM","regions":[{"name":"Evershade","subtitle":"The Wilds of Evershade","color":"#ccc088","labelX":1295.0,"labelY":535.0,"cities":[{"name":"Millcross","x":0.4589,"y":0.3083,"capital":true},{"name":"Runeford","x":0.3696,"y":0.3028,"capital":false},{"name":"Thebury","x":0.4875,"y":0.4528,"capital":false},{"name":"Valewick","x":0.3375,"y":0.2806,"capital":false},{"name":"Windcrest","x":0.3482,"y":0.3194,"capital":false},{"name":"Runeford","x":0.5554,"y":0.325,"capital":false}]},{"name":"Grimvale","subtitle":"The Dominion of Grimvale","color":"#a8b8a0","labelX":1675.0,"labelY":735.0,"cities":[{"name":"Goldenleaf","x":0.6125,"y":0.4028,"capital":true},{"name":"Alderhaven","x":0.5089,"y":0.475,"capital":false},{"name":"Feradell","x":0.6661,"y":0.3861,"capital":false},{"name":"Thornwall","x":0.7054,"y":0.4472,"capital":false},{"name":"Alderhaven","x":0.7089,"y":0.4528,"capital":false}]},{"name":"Aelindor","subtitle":"Duchy of Aelindor","color":"#c8b490","labelX":895.0,"labelY":995.0,"cities":[{"name":"Urswick","x":0.3232,"y":0.5417,"capital":true},{"name":"Ivyreach","x":0.2089,"y":0.475,"capital":false},{"name":"Ashwick","x":0.4268,"y":0.525,"capital":false},{"name":"Westmarch","x":0.3018,"y":0.6417,"capital":false}]},{"name":"Caeloth","subtitle":"Realm of Caeloth","color":"#a0b0b8","labelX":175.0,"labelY":515.0,"cities":[{"name":"Feradell","x":0.0732,"y":0.2639,"capital":true},{"name":"Kettlebrook","x":0.0446,"y":0.2194,"capital":false},{"name":"Lawklif","x":0.0446,"y":0.3361,"capital":false},{"name":"Thebury","x":0.1411,"y":0.3528,"capital":false}]},{"name":"Essear","subtitle":"The Free Marches of Essear","color":"#b8c098","labelX":2215.0,"labelY":725.0,"cities":[{"name":"Greywater","x":0.8089,"y":0.4028,"capital":true},{"name":"Longmere","x":0.7161,"y":0.4806,"capital":false},{"name":"Millcross","x":0.8518,"y":0.375,"capital":false},{"name":"Oakmere","x":0.8304,"y":0.5472,"capital":false},{"name":"Jadeston","x":0.8411,"y":0.375,"capital":false}]},{"name":"Wyndell","subtitle":"Principality of Wyndell","color":"#c4b0a8","labelX":765.0,"labelY":425.0,"cities":[{"name":"Ilaes","x":0.2589,"y":0.2194,"capital":true},{"name":"Eagleford","x":0.2554,"y":0.2694,"capital":false},{"name":"Greenhollow","x":0.3661,"y":0.2194,"capital":false},{"name":"Zarakyr","x":0.2232,"y":0.2528,"capital":false},{"name":"Gerenwalde","x":0.3089,"y":0.2861,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Iron Sea","Sea of Ash","Jade Sea","Sea of Embers","Sea of Twilight"]};
ATLAS_METADATA[45] = {"seed":45,"mapName":"THORNGROVE","regions":[{"name":"Elonia","subtitle":"The Wilds of Elonia","color":"#ccc088","labelX":1715.0,"labelY":1515.0,"cities":[{"name":"Feradell","x":0.6304,"y":0.8306,"capital":true},{"name":"Moonshadow","x":0.7018,"y":0.8694,"capital":false},{"name":"Whitevale","x":0.6982,"y":0.8472,"capital":false},{"name":"Dunmore","x":0.5375,"y":0.8306,"capital":false}]},{"name":"Solwynd","subtitle":"Realm of Solwynd","color":"#a8b8a0","labelX":925.0,"labelY":1335.0,"cities":[{"name":"Odrin","x":0.3232,"y":0.7361,"capital":true},{"name":"Lindel","x":0.4054,"y":0.6972,"capital":false},{"name":"Pebblecreek","x":0.2696,"y":0.7083,"capital":false},{"name":"Quartzridge","x":0.3554,"y":0.6083,"capital":false},{"name":"Thistledown","x":0.3018,"y":0.7861,"capital":false},{"name":"Nighthollow","x":0.3054,"y":0.6306,"capital":false}]},{"name":"Dremora","subtitle":"The Dominion of Dremora","color":"#c8b490","labelX":1875.0,"labelY":865.0,"cities":[{"name":"Anora","x":0.6804,"y":0.4917,"capital":true},{"name":"Millcross","x":0.7446,"y":0.5861,"capital":false},{"name":"Thornwall","x":0.7482,"y":0.5972,"capital":false},{"name":"Regnwald","x":0.7411,"y":0.5806,"capital":false}]},{"name":"Fara","subtitle":"Realm of Fara","color":"#a0b0b8","labelX":795.0,"labelY":885.0,"cities":[{"name":"Foxbury","x":0.2946,"y":0.5028,"capital":true},{"name":"Northgate","x":0.3554,"y":0.4361,"capital":false},{"name":"Feradell","x":0.3411,"y":0.5472,"capital":false},{"name":"Cinderfell","x":0.3304,"y":0.3806,"capital":false}]},{"name":"Aelindor","subtitle":"The Dominion of Aelindor","color":"#b8c098","labelX":1365.0,"labelY":1025.0,"cities":[{"name":"Fogmere","x":0.4875,"y":0.5639,"capital":true},{"name":"Stormgate","x":0.4554,"y":0.6194,"capital":false},{"name":"Goldenleaf","x":0.4268,"y":0.5639,"capital":false}]},{"name":"Vornhelm","subtitle":"Realm of Vornhelm","color":"#c4b0a8","labelX":1255.0,"labelY":1575.0,"cities":[{"name":"Kettlebrook","x":0.4554,"y":0.8639,"capital":true},{"name":"Redthorn","x":0.4589,"y":0.7806,"capital":false},{"name":"Dremoor","x":0.5018,"y":0.825,"capital":false},{"name":"Redthorn","x":0.4018,"y":0.8806,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":1635.0,"labelY":1615.0},{"name":"Stormcrown Range","labelX":1225.0,"labelY":1455.0},{"name":"Ashen Divide","labelX":1555.0,"labelY":1585.0},{"name":"Silvervein Ridge","labelX":1315.0,"labelY":785.0}],"lakes":[],"seaNames":["Sea of Twilight","Sea of Ash","Sea of Embers","Iron Sea","Sea of Frost"]};
ATLAS_METADATA[46] = {"seed":46,"mapName":"DRAGONTIDE","regions":[{"name":"Aelindor","subtitle":"Realm of Aelindor","color":"#ccc088","labelX":2035.0,"labelY":655.0,"cities":[{"name":"Gerenwalde","x":0.7339,"y":0.3806,"capital":true},{"name":"Yellowfen","x":0.7518,"y":0.4139,"capital":false},{"name":"Wydale","x":0.6839,"y":0.3194,"capital":false},{"name":"Urswick","x":0.6911,"y":0.4417,"capital":false}]},{"name":"Theanas","subtitle":"Borderlands of Theanas","color":"#a8b8a0","labelX":1125.0,"labelY":1255.0,"cities":[{"name":"Zenithburg","x":0.3946,"y":0.7083,"capital":true},{"name":"Stonemere","x":0.3696,"y":0.775,"capital":false},{"name":"Yellowfen","x":0.3196,"y":0.7639,"capital":false}]},{"name":"Moonridge","subtitle":"Principality of Moonridge","color":"#c8b490","labelX":1305.0,"labelY":635.0,"cities":[{"name":"Beowick","x":0.4804,"y":0.3639,"capital":true},{"name":"Windcrest","x":0.4268,"y":0.375,"capital":false},{"name":"Quartzridge","x":0.4018,"y":0.4194,"capital":false},{"name":"Stonemere","x":0.3446,"y":0.3528,"capital":false},{"name":"Silverton","x":0.4018,"y":0.4083,"capital":false},{"name":"Cinderfell","x":0.4089,"y":0.275,"capital":false}]},{"name":"Vornhelm","subtitle":"Duchy of Vornhelm","color":"#a0b0b8","labelX":2045.0,"labelY":1175.0,"cities":[{"name":"Valewick","x":0.7339,"y":0.6361,"capital":true},{"name":"Redthorn","x":0.6732,"y":0.5583,"capital":false},{"name":"Oakmere","x":0.7839,"y":0.675,"capital":false},{"name":"Freehold","x":0.7518,"y":0.5472,"capital":false},{"name":"Pinewood","x":0.7946,"y":0.7417,"capital":false}]},{"name":"Kelvor","subtitle":"Borderlands of Kelvor","color":"#b8c098","labelX":1515.0,"labelY":1565.0,"cities":[{"name":"Millcross","x":0.5589,"y":0.8806,"capital":true},{"name":"Ashbourne","x":0.6339,"y":0.8472,"capital":false},{"name":"Runeford","x":0.5946,"y":0.7917,"capital":false}]},{"name":"Ashenveil","subtitle":"The Free Marches of Ashenveil","color":"#c4b0a8","labelX":1525.0,"labelY":1085.0,"cities":[{"name":"Deepwatch","x":0.5482,"y":0.5917,"capital":true},{"name":"Borist","x":0.5946,"y":0.6417,"capital":false},{"name":"Borist","x":0.5768,"y":0.5361,"capital":false}]},{"name":"Tethys","subtitle":"Realm of Tethys","color":"#a8c0b0","labelX":545.0,"labelY":1385.0,"cities":[{"name":"Gildafell","x":0.2089,"y":0.775,"capital":true},{"name":"Fernhollow","x":0.1446,"y":0.7306,"capital":false},{"name":"Dunmore","x":0.1554,"y":0.7306,"capital":false},{"name":"Elmsworth","x":0.1589,"y":0.7139,"capital":false},{"name":"Goldug","x":0.3232,"y":0.7806,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Sea of Frost","Sea of Dreams","Sea of Embers","Pale Sea"]};
ATLAS_METADATA[47] = {"seed":47,"mapName":"HALLOWED","regions":[{"name":"Duskveil","subtitle":"The Dominion of Duskveil","color":"#ccc088","labelX":445.0,"labelY":1215.0,"cities":[{"name":"Cinderfell","x":0.1661,"y":0.6694,"capital":true},{"name":"Anora","x":0.0911,"y":0.5583,"capital":false},{"name":"Elmsworth","x":0.0768,"y":0.7361,"capital":false}]},{"name":"Tethys","subtitle":"The Dominion of Tethys","color":"#a8b8a0","labelX":1405.0,"labelY":985.0,"cities":[{"name":"Goldenleaf","x":0.5054,"y":0.5417,"capital":true},{"name":"Junipervale","x":0.4589,"y":0.4806,"capital":false},{"name":"Oakmere","x":0.5589,"y":0.6083,"capital":false},{"name":"Rynwood","x":0.4911,"y":0.5694,"capital":false}]},{"name":"Morvaine","subtitle":"The Free Marches of Morvaine","color":"#c8b490","labelX":1525.0,"labelY":1455.0,"cities":[{"name":"Foxbury","x":0.5589,"y":0.7972,"capital":true},{"name":"Gerenwalde","x":0.5089,"y":0.7861,"capital":false},{"name":"Inkwell","x":0.4661,"y":0.8194,"capital":false},{"name":"Millcross","x":0.5411,"y":0.7194,"capital":false}]},{"name":"Thornwick","subtitle":"Duchy of Thornwick","color":"#a0b0b8","labelX":925.0,"labelY":955.0,"cities":[{"name":"Highwall","x":0.3482,"y":0.5417,"capital":true},{"name":"Brightmoor","x":0.2911,"y":0.5417,"capital":false},{"name":"Palanor","x":0.2696,"y":0.6194,"capital":false},{"name":"Deepwatch","x":0.3375,"y":0.6861,"capital":false},{"name":"Cinderfell","x":0.2339,"y":0.5194,"capital":false}]},{"name":"Solwynd","subtitle":"The Wilds of Solwynd","color":"#b8c098","labelX":1885.0,"labelY":855.0,"cities":[{"name":"Goldenleaf","x":0.6804,"y":0.4694,"capital":true},{"name":"Dawnwatch","x":0.7232,"y":0.5361,"capital":false},{"name":"Kingsbridge","x":0.6161,"y":0.475,"capital":false},{"name":"Whitevale","x":0.7482,"y":0.5639,"capital":false}]},{"name":"Lakeshore","subtitle":"Kingdom of Lakeshore","color":"#c4b0a8","labelX":2595.0,"labelY":1105.0,"cities":[{"name":"Fogmere","x":0.9161,"y":0.625,"capital":true},{"name":"Alderhaven","x":0.9411,"y":0.5694,"capital":false},{"name":"Lakecrest","x":0.9518,"y":0.6417,"capital":false},{"name":"Stormgate","x":0.9268,"y":0.6806,"capital":false},{"name":"Harrowfield","x":0.8625,"y":0.6861,"capital":false}]},{"name":"Pinecrest","subtitle":"The Wilds of Pinecrest","color":"#a8c0b0","labelX":1015.0,"labelY":1475.0,"cities":[{"name":"Lindel","x":0.3696,"y":0.8028,"capital":true},{"name":"Inkwell","x":0.4589,"y":0.7361,"capital":false},{"name":"Gildafell","x":0.2625,"y":0.7472,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Iron Sea","Crimson Gulf","Sea of Winds","Sea of Ash"]};
ATLAS_METADATA[48] = {"seed":48,"mapName":"GREYWATCH","regions":[{"name":"Northmere","subtitle":"The Dominion of Northmere","color":"#ccc088","labelX":1535.0,"labelY":795.0,"cities":[{"name":"Palanor","x":0.5446,"y":0.4306,"capital":true},{"name":"Wydale","x":0.6018,"y":0.4694,"capital":false},{"name":"Junipervale","x":0.4732,"y":0.4028,"capital":false},{"name":"Moonshadow","x":0.5696,"y":0.3806,"capital":false},{"name":"Tidefall","x":0.4911,"y":0.4806,"capital":false}]},{"name":"Korrath","subtitle":"The Wilds of Korrath","color":"#a8b8a0","labelX":1015.0,"labelY":1045.0,"cities":[{"name":"Oldbridge","x":0.3589,"y":0.575,"capital":true},{"name":"Maplecross","x":0.4125,"y":0.5194,"capital":false},{"name":"Feradell","x":0.4554,"y":0.625,"capital":false},{"name":"Knolltown","x":0.4268,"y":0.5083,"capital":false},{"name":"Millcross","x":0.2732,"y":0.5917,"capital":false}]},{"name":"Silverfen","subtitle":"The Free Marches of Silverfen","color":"#c8b490","labelX":1515.0,"labelY":1265.0,"cities":[{"name":"Palanor","x":0.4875,"y":0.5861,"capital":false},{"name":"Pinewood","x":0.5804,"y":0.6694,"capital":false},{"name":"Pinewood","x":0.4768,"y":0.6694,"capital":false}]},{"name":"Galanthia","subtitle":"Principality of Galanthia","color":"#a0b0b8","labelX":955.0,"labelY":595.0,"cities":[{"name":"Borist","x":0.3411,"y":0.3417,"capital":true},{"name":"Gildafell","x":0.2554,"y":0.375,"capital":false},{"name":"Moonshadow","x":0.3554,"y":0.2917,"capital":false}]},{"name":"Thornemark","subtitle":"Borderlands of Thornemark","color":"#b8c098","labelX":585.0,"labelY":1155.0,"cities":[{"name":"Highwall","x":0.2125,"y":0.6472,"capital":true},{"name":"Knolltown","x":0.2196,"y":0.5806,"capital":false},{"name":"Greywater","x":0.1268,"y":0.575,"capital":false}]},{"name":"Theanas","subtitle":"Principality of Theanas","color":"#c4b0a8","labelX":2385.0,"labelY":905.0,"cities":[{"name":"Kettlebrook","x":0.8696,"y":0.4861,"capital":true},{"name":"Dawnwatch","x":0.8196,"y":0.5194,"capital":false},{"name":"Gildafell","x":0.8982,"y":0.4417,"capital":false},{"name":"Ashwick","x":0.8304,"y":0.4361,"capital":false},{"name":"Lindel","x":0.9232,"y":0.4806,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Sea of Storms","Sea of Dreams","Jade Sea","Sea of Embers"]};
ATLAS_METADATA[49] = {"seed":49,"mapName":"EVERPEAK","regions":[{"name":"Drakkos","subtitle":"The Free Marches of Drakkos","color":"#ccc088","labelX":1955.0,"labelY":955.0,"cities":[{"name":"Silverton","x":0.7054,"y":0.525,"capital":true},{"name":"Deepwatch","x":0.6268,"y":0.4972,"capital":false},{"name":"Urswick","x":0.7232,"y":0.4417,"capital":false},{"name":"Gerenwalde","x":0.8161,"y":0.4694,"capital":false}]},{"name":"Tethys","subtitle":"Kingdom of Tethys","color":"#a8b8a0","labelX":1025.0,"labelY":735.0,"cities":[{"name":"Windcrest","x":0.3518,"y":0.4028,"capital":true},{"name":"Foxbury","x":0.3125,"y":0.4806,"capital":false},{"name":"Rynwood","x":0.2446,"y":0.3472,"capital":false}]},{"name":"Lakeshore","subtitle":"Borderlands of Lakeshore","color":"#c8b490","labelX":1605.0,"labelY":1345.0,"cities":[{"name":"Palanor","x":0.5839,"y":0.7528,"capital":true},{"name":"Tidefall","x":0.5339,"y":0.7306,"capital":false},{"name":"Pinewood","x":0.5875,"y":0.6583,"capital":false},{"name":"Eagleford","x":0.7018,"y":0.7528,"capital":false},{"name":"Ironholt","x":0.4982,"y":0.6472,"capital":false}]},{"name":"Theanas","subtitle":"Duchy of Theanas","color":"#a0b0b8","labelX":435.0,"labelY":1085.0,"cities":[{"name":"Zarakyr","x":0.1518,"y":0.6194,"capital":true},{"name":"Kronham","x":0.1589,"y":0.7194,"capital":false},{"name":"Cliffhaven","x":0.1661,"y":0.5361,"capital":false},{"name":"Hollowburg","x":0.1411,"y":0.7194,"capital":false},{"name":"Thornwall","x":0.1054,"y":0.6917,"capital":false}]},{"name":"Kharadan","subtitle":"The Free Marches of Kharadan","color":"#b8c098","labelX":2645.0,"labelY":975.0,"cities":[{"name":"Duskwater","x":0.9446,"y":0.525,"capital":true},{"name":"Quartzridge","x":0.9304,"y":0.5694,"capital":false},{"name":"Stonemere","x":0.9125,"y":0.6028,"capital":false}]},{"name":"Crystalis","subtitle":"Principality of Crystalis","color":"#c4b0a8","labelX":2255.0,"labelY":1275.0,"cities":[{"name":"Westmarch","x":0.8089,"y":0.7028,"capital":true},{"name":"Cliffhaven","x":0.9196,"y":0.7083,"capital":false},{"name":"Duskhold","x":0.8554,"y":0.6583,"capital":false},{"name":"Thistledown","x":0.7446,"y":0.7639,"capital":false},{"name":"Anora","x":0.8589,"y":0.7194,"capital":false}]},{"name":"Nightward","subtitle":"Realm of Nightward","color":"#a8c0b0","labelX":1105.0,"labelY":1135.0,"cities":[{"name":"Ashbourne","x":0.4018,"y":0.625,"capital":true},{"name":"Cinderfell","x":0.4768,"y":0.5361,"capital":false},{"name":"Greenhollow","x":0.4268,"y":0.7583,"capital":false},{"name":"Ravenmere","x":0.4875,"y":0.5417,"capital":false},{"name":"Rynwood","x":0.3732,"y":0.5917,"capital":false},{"name":"Ilaes","x":0.4089,"y":0.5417,"capital":false}]}],"mountains":[{"name":"Stormcrown Range","labelX":685.0,"labelY":835.0},{"name":"Ebonwall Mountains","labelX":1725.0,"labelY":725.0},{"name":"Thundercrest Range","labelX":685.0,"labelY":1315.0},{"name":"Ashen Divide","labelX":1035.0,"labelY":705.0}],"lakes":[],"seaNames":["Sea of Storms","Crimson Gulf","Sea of Silver","Sea of Twilight","Sea of Frost"]};
ATLAS_METADATA[50] = {"seed":50,"mapName":"MISTRALUNE","regions":[{"name":"Ironreach","subtitle":"Duchy of Ironreach","color":"#ccc088","labelX":1395.0,"labelY":535.0,"cities":[{"name":"Vineyard","x":0.4982,"y":0.2861,"capital":true},{"name":"Pebblecreek","x":0.4804,"y":0.1806,"capital":false},{"name":"Dawnwatch","x":0.4982,"y":0.2361,"capital":false},{"name":"Greenhollow","x":0.4696,"y":0.375,"capital":false}]},{"name":"Ashmark","subtitle":"The Free Marches of Ashmark","color":"#a8b8a0","labelX":755.0,"labelY":1405.0,"cities":[{"name":"Foxbury","x":0.2839,"y":0.7972,"capital":false},{"name":"Ironholt","x":0.3768,"y":0.7417,"capital":false},{"name":"Fernhollow","x":0.3589,"y":0.7583,"capital":false},{"name":"Nighthollow","x":0.2804,"y":0.7806,"capital":true},{"name":"Alderhaven","x":0.1768,"y":0.7694,"capital":false},{"name":"Vineyard","x":0.3982,"y":0.8083,"capital":false}]},{"name":"Mistvale","subtitle":"Kingdom of Mistvale","color":"#c8b490","labelX":2225.0,"labelY":385.0,"cities":[{"name":"Thistledown","x":0.8054,"y":0.2194,"capital":true},{"name":"Junipervale","x":0.7554,"y":0.1806,"capital":false},{"name":"Inkwell","x":0.7125,"y":0.1417,"capital":false}]},{"name":"Shadowfen","subtitle":"The Free Marches of Shadowfen","color":"#a0b0b8","labelX":665.0,"labelY":975.0,"cities":[{"name":"Rynwood","x":0.2232,"y":0.5472,"capital":true},{"name":"Runeford","x":0.2982,"y":0.5028,"capital":false},{"name":"Ravenmere","x":0.2839,"y":0.425,"capital":false},{"name":"Windcrest","x":0.2196,"y":0.475,"capital":false},{"name":"Greywater","x":0.1946,"y":0.4972,"capital":false}]},{"name":"Blackmoor","subtitle":"Realm of Blackmoor","color":"#b8c098","labelX":2125.0,"labelY":1005.0,"cities":[{"name":"Junipervale","x":0.7518,"y":0.5639,"capital":true},{"name":"Oldbridge","x":0.7589,"y":0.6806,"capital":false},{"name":"Duskwater","x":0.6839,"y":0.6861,"capital":false},{"name":"Whitevale","x":0.8161,"y":0.4639,"capital":false},{"name":"Alderhaven","x":0.6625,"y":0.4861,"capital":false}]},{"name":"Morvaine","subtitle":"The Free Marches of Morvaine","color":"#c4b0a8","labelX":1605.0,"labelY":1125.0,"cities":[{"name":"Brinewood","x":0.5732,"y":0.6361,"capital":true},{"name":"Duskwater","x":0.5161,"y":0.6417,"capital":false},{"name":"Loyarn","x":0.5732,"y":0.5917,"capital":false},{"name":"Lakecrest","x":0.5054,"y":0.5861,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Crimson Gulf","Iron Sea","Sea of Embers","Sea of Frost"]};
ATLAS_METADATA[51] = {"seed":51,"mapName":"IRONHOLD","regions":[{"name":"Ravenmarch","subtitle":"Borderlands of Ravenmarch","color":"#ccc088","labelX":1155.0,"labelY":1065.0,"cities":[{"name":"Goldenleaf","x":0.4268,"y":0.575,"capital":true},{"name":"Odrin","x":0.3482,"y":0.575,"capital":false},{"name":"Duskhold","x":0.4339,"y":0.4472,"capital":false},{"name":"Harrowfield","x":0.3696,"y":0.5361,"capital":false}]},{"name":"Frosthold","subtitle":"Principality of Frosthold","color":"#a8b8a0","labelX":2285.0,"labelY":1045.0,"cities":[{"name":"Yewborough","x":0.8339,"y":0.5917,"capital":true},{"name":"Brightmoor","x":0.9304,"y":0.5417,"capital":false},{"name":"Ashwick","x":0.8054,"y":0.4861,"capital":false}]},{"name":"Aethermoor","subtitle":"Borderlands of Aethermoor","color":"#c8b490","labelX":625.0,"labelY":1285.0,"cities":[{"name":"Moonshadow","x":0.2304,"y":0.7139,"capital":true},{"name":"Hollowburg","x":0.3518,"y":0.6917,"capital":false},{"name":"Longmere","x":0.3125,"y":0.7806,"capital":false},{"name":"Lakecrest","x":0.2268,"y":0.6139,"capital":false},{"name":"Valewick","x":0.1875,"y":0.6083,"capital":false}]},{"name":"Fara","subtitle":"Realm of Fara","color":"#a0b0b8","labelX":1215.0,"labelY":1515.0,"cities":[{"name":"Zarakyr","x":0.4232,"y":0.8361,"capital":true},{"name":"Stormgate","x":0.4161,"y":0.8417,"capital":false},{"name":"Oakmere","x":0.3518,"y":0.8417,"capital":false},{"name":"Gildafell","x":0.5089,"y":0.7806,"capital":false}]},{"name":"Ironglenn","subtitle":"Duchy of Ironglenn","color":"#b8c098","labelX":1705.0,"labelY":905.0,"cities":[{"name":"Blackrock","x":0.6196,"y":0.4972,"capital":true},{"name":"Millcross","x":0.6232,"y":0.5972,"capital":false},{"name":"Thebury","x":0.6089,"y":0.4361,"capital":false},{"name":"Palanor","x":0.5268,"y":0.3917,"capital":false},{"name":"Nighthollow","x":0.6804,"y":0.5806,"capital":false},{"name":"Ironholt","x":0.5768,"y":0.525,"capital":false}]},{"name":"Ashmark","subtitle":"The Free Marches of Ashmark","color":"#c4b0a8","labelX":265.0,"labelY":985.0,"cities":[{"name":"Greywater","x":0.0768,"y":0.5528,"capital":true},{"name":"Beowick","x":0.0554,"y":0.6694,"capital":false},{"name":"Zenithburg","x":0.1446,"y":0.5639,"capital":false},{"name":"Lawklif","x":0.0554,"y":0.575,"capital":false},{"name":"Inkwell","x":0.0911,"y":0.6194,"capital":false},{"name":"Dremoor","x":0.0982,"y":0.525,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Iron Sea","Sea of Dreams","Sea of Embers","Crimson Gulf"]};
ATLAS_METADATA[52] = {"seed":52,"mapName":"VALKENMOOR","regions":[{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#ccc088","labelX":235.0,"labelY":565.0,"cities":[{"name":"Oldbridge","x":0.0768,"y":0.325,"capital":true},{"name":"Zarakyr","x":0.0982,"y":0.2083,"capital":false},{"name":"Beowick","x":0.2089,"y":0.2639,"capital":false},{"name":"Zenithburg","x":0.1232,"y":0.3028,"capital":false}]},{"name":"Ashenveil","subtitle":"Principality of Ashenveil","color":"#a8b8a0","labelX":1295.0,"labelY":955.0,"cities":[{"name":"Hollowburg","x":0.4411,"y":0.5806,"capital":false},{"name":"Dremoor","x":0.4268,"y":0.5417,"capital":false},{"name":"Thistledown","x":0.5446,"y":0.4639,"capital":false},{"name":"Pinewood","x":0.5589,"y":0.5417,"capital":false},{"name":"Copperside","x":0.4554,"y":0.425,"capital":false},{"name":"Rynwood","x":0.4589,"y":0.5306,"capital":true}]},{"name":"Grimvale","subtitle":"The Wilds of Grimvale","color":"#c8b490","labelX":935.0,"labelY":625.0,"cities":[{"name":"Oldbridge","x":0.3339,"y":0.3639,"capital":true},{"name":"Pebblecreek","x":0.2768,"y":0.4417,"capital":false},{"name":"Harrowfield","x":0.3375,"y":0.325,"capital":false}]},{"name":"Evershade","subtitle":"The Free Marches of Evershade","color":"#a0b0b8","labelX":1805.0,"labelY":1315.0,"cities":[{"name":"Zenithburg","x":0.6625,"y":0.725,"capital":true},{"name":"Beowick","x":0.6696,"y":0.8028,"capital":false},{"name":"Kingsbridge","x":0.6411,"y":0.7806,"capital":false},{"name":"Greenhollow","x":0.7232,"y":0.7194,"capital":false},{"name":"Underbridge","x":0.5875,"y":0.8028,"capital":false}]},{"name":"Kharadan","subtitle":"Kingdom of Kharadan","color":"#b8c098","labelX":2035.0,"labelY":715.0,"cities":[{"name":"Alderhaven","x":0.7161,"y":0.3806,"capital":true},{"name":"Duskwater","x":0.6804,"y":0.3694,"capital":false},{"name":"Blackrock","x":0.7375,"y":0.4306,"capital":false}]},{"name":"Solwynd","subtitle":"The Dominion of Solwynd","color":"#c4b0a8","labelX":2375.0,"labelY":1465.0,"cities":[{"name":"Odrin","x":0.8375,"y":0.8028,"capital":true},{"name":"Ravenmere","x":0.8554,"y":0.9028,"capital":false},{"name":"Feradell","x":0.7839,"y":0.7528,"capital":false},{"name":"Goldug","x":0.8839,"y":0.7583,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Jade Sea","Sea of Winds","Sea of Storms","Sea of Embers"]};
ATLAS_METADATA[53] = {"seed":53,"mapName":"SERPENTIS","regions":[{"name":"Aelindor","subtitle":"Principality of Aelindor","color":"#ccc088","labelX":1085.0,"labelY":775.0,"cities":[{"name":"Dremoor","x":0.3732,"y":0.425,"capital":true},{"name":"Kronham","x":0.3696,"y":0.3694,"capital":false},{"name":"Zenithburg","x":0.2768,"y":0.425,"capital":false}]},{"name":"Ravenmarch","subtitle":"Borderlands of Ravenmarch","color":"#a8b8a0","labelX":1945.0,"labelY":605.0,"cities":[{"name":"Northgate","x":0.6768,"y":0.3194,"capital":true},{"name":"Kingsbridge","x":0.6482,"y":0.4417,"capital":false},{"name":"Lawklif","x":0.6804,"y":0.3972,"capital":false},{"name":"Duskwater","x":0.6196,"y":0.3306,"capital":false},{"name":"Kronham","x":0.7518,"y":0.2639,"capital":false},{"name":"Runeford","x":0.6982,"y":0.375,"capital":false}]},{"name":"Goleli","subtitle":"The Dominion of Goleli","color":"#c8b490","labelX":565.0,"labelY":875.0,"cities":[{"name":"Yellowfen","x":0.2196,"y":0.4917,"capital":true},{"name":"Anora","x":0.2732,"y":0.5194,"capital":false},{"name":"Lakecrest","x":0.2696,"y":0.5806,"capital":false},{"name":"Ashwick","x":0.3161,"y":0.5194,"capital":false},{"name":"Deepwatch","x":0.2482,"y":0.5583,"capital":false},{"name":"Pebblecreek","x":0.1696,"y":0.4639,"capital":false}]},{"name":"Sunmere","subtitle":"The Free Marches of Sunmere","color":"#a0b0b8","labelX":2205.0,"labelY":905.0,"cities":[{"name":"Oldbridge","x":0.7804,"y":0.5028,"capital":true},{"name":"Goldenleaf","x":0.8018,"y":0.3972,"capital":false},{"name":"Kronham","x":0.6982,"y":0.5694,"capital":false}]},{"name":"Galanthia","subtitle":"The Dominion of Galanthia","color":"#b8c098","labelX":945.0,"labelY":1225.0,"cities":[{"name":"Cliffhaven","x":0.3304,"y":0.6806,"capital":true},{"name":"Zenithburg","x":0.2446,"y":0.7306,"capital":false},{"name":"Highwall","x":0.3875,"y":0.6639,"capital":false},{"name":"Redthorn","x":0.4196,"y":0.6194,"capital":false}]},{"name":"Essear","subtitle":"Realm of Essear","color":"#c4b0a8","labelX":2315.0,"labelY":475.0,"cities":[{"name":"Goldug","x":0.8446,"y":0.2528,"capital":true},{"name":"Elmsworth","x":0.8232,"y":0.3639,"capital":false},{"name":"Odrin","x":0.7589,"y":0.2639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Silver","Jade Sea","Sea of Winds","Sea of Ash","Crimson Gulf"]};
ATLAS_METADATA[54] = {"seed":54,"mapName":"DUSKREACH","regions":[{"name":"Theanas","subtitle":"Borderlands of Theanas","color":"#ccc088","labelX":1375.0,"labelY":465.0,"cities":[{"name":"Highwall","x":0.4911,"y":0.2639,"capital":true},{"name":"Westmarch","x":0.4482,"y":0.2139,"capital":false},{"name":"Zenithburg","x":0.5982,"y":0.3139,"capital":false},{"name":"Kingsbridge","x":0.3982,"y":0.2639,"capital":false}]},{"name":"Dawnhollow","subtitle":"Realm of Dawnhollow","color":"#a8b8a0","labelX":1145.0,"labelY":995.0,"cities":[{"name":"Longmere","x":0.4089,"y":0.5639,"capital":true},{"name":"Anora","x":0.4804,"y":0.5528,"capital":false},{"name":"Greenhollow","x":0.3661,"y":0.5306,"capital":false},{"name":"Inkwell","x":0.3339,"y":0.575,"capital":false},{"name":"Alderhaven","x":0.3732,"y":0.5972,"capital":false}]},{"name":"Selvane","subtitle":"Kingdom of Selvane","color":"#c8b490","labelX":2135.0,"labelY":205.0,"cities":[{"name":"Redthorn","x":0.7554,"y":0.125,"capital":true},{"name":"Brinewood","x":0.6554,"y":0.1083,"capital":false},{"name":"Ivyreach","x":0.7089,"y":0.1472,"capital":false}]},{"name":"Nightward","subtitle":"Borderlands of Nightward","color":"#a0b0b8","labelX":485.0,"labelY":605.0,"cities":[{"name":"Moonshadow","x":0.1839,"y":0.3306,"capital":true},{"name":"Runeford","x":0.1839,"y":0.3861,"capital":false},{"name":"Yellowfen","x":0.1661,"y":0.2972,"capital":false}]},{"name":"Drakkos","subtitle":"Borderlands of Drakkos","color":"#b8c098","labelX":1695.0,"labelY":1055.0,"cities":[{"name":"Runeford","x":0.5875,"y":0.6083,"capital":true},{"name":"Yewborough","x":0.5268,"y":0.6694,"capital":false},{"name":"Thebury","x":0.6196,"y":0.5694,"capital":false},{"name":"Nighthollow","x":0.5125,"y":0.5306,"capital":false},{"name":"Goldenleaf","x":0.5054,"y":0.5639,"capital":false}]},{"name":"Kharadan","subtitle":"The Wilds of Kharadan","color":"#c4b0a8","labelX":975.0,"labelY":545.0,"cities":[{"name":"Palanor","x":0.3375,"y":0.3139,"capital":true},{"name":"Junipervale","x":0.3018,"y":0.4361,"capital":false},{"name":"Zarakyr","x":0.2661,"y":0.3639,"capital":false},{"name":"Westmarch","x":0.2482,"y":0.275,"capital":false},{"name":"Quartzridge","x":0.4304,"y":0.4139,"capital":false},{"name":"Anora","x":0.2554,"y":0.3139,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Crimson Gulf","Jade Sea","Sea of Twilight","Iron Sea"]};
ATLAS_METADATA[55] = {"seed":55,"mapName":"WOLFSBANE","regions":[{"name":"Caltheon","subtitle":"Duchy of Caltheon","color":"#ccc088","labelX":1265.0,"labelY":775.0,"cities":[{"name":"Maplecross","x":0.4339,"y":0.4417,"capital":true},{"name":"Thebury","x":0.5268,"y":0.4472,"capital":false},{"name":"Cliffhaven","x":0.3696,"y":0.5694,"capital":false},{"name":"Palanor","x":0.5089,"y":0.4083,"capital":false}]},{"name":"Fara","subtitle":"Realm of Fara","color":"#a8b8a0","labelX":1685.0,"labelY":235.0,"cities":[{"name":"Rynwood","x":0.6054,"y":0.1194,"capital":true},{"name":"Duskhold","x":0.5089,"y":0.2306,"capital":false},{"name":"Gerenwalde","x":0.5446,"y":0.1528,"capital":false},{"name":"Wydale","x":0.6625,"y":0.1139,"capital":false},{"name":"Goldug","x":0.5411,"y":0.1528,"capital":false},{"name":"Windcrest","x":0.5768,"y":0.1972,"capital":false}]},{"name":"Valdheim","subtitle":"The Free Marches of Valdheim","color":"#c8b490","labelX":1665.0,"labelY":1295.0,"cities":[{"name":"Tidefall","x":0.5911,"y":0.7028,"capital":true},{"name":"Goldenleaf","x":0.4554,"y":0.7139,"capital":false},{"name":"Ilaes","x":0.5589,"y":0.7528,"capital":false},{"name":"Oldbridge","x":0.7018,"y":0.775,"capital":false},{"name":"Lake Varos","x":0.6089,"y":0.6306,"capital":false}]},{"name":"Dravina","subtitle":"The Dominion of Dravina","color":"#a0b0b8","labelX":1885.0,"labelY":575.0,"cities":[{"name":"Fernhollow","x":0.6661,"y":0.3417,"capital":true},{"name":"Cinderfell","x":0.5589,"y":0.425,"capital":false},{"name":"Deepwatch","x":0.7661,"y":0.3306,"capital":false}]},{"name":"Highkeep","subtitle":"Kingdom of Highkeep","color":"#b8c098","labelX":2355.0,"labelY":805.0,"cities":[{"name":"Nighthollow","x":0.8554,"y":0.4417,"capital":true},{"name":"Brinewood","x":0.8554,"y":0.525,"capital":false},{"name":"Tidefall","x":0.7804,"y":0.5583,"capital":false},{"name":"Wydale","x":0.8268,"y":0.3972,"capital":false}]},{"name":"Blackmoor","subtitle":"Kingdom of Blackmoor","color":"#c4b0a8","labelX":2055.0,"labelY":1015.0,"cities":[{"name":"Gerenwalde","x":0.7196,"y":0.6139,"capital":false},{"name":"Longmere","x":0.8125,"y":0.5583,"capital":false},{"name":"Kettlebrook","x":0.7304,"y":0.5806,"capital":true},{"name":"Cliffhaven","x":0.8161,"y":0.5139,"capital":false},{"name":"Vineyard","x":0.7446,"y":0.5028,"capital":false},{"name":"Beowick","x":0.7804,"y":0.4861,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":2475.0,"labelY":855.0},{"name":"Greymist Heights","labelX":1405.0,"labelY":885.0},{"name":"Dragon's Spine","labelX":1125.0,"labelY":525.0},{"name":"Ironspine Range","labelX":1965.0,"labelY":1005.0}],"lakes":[{"name":"Lake Varos","labelX":1805.0,"labelY":1103.0},{"name":"Shadowmere","labelX":1705.0,"labelY":673.0}],"seaNames":["Sea of Winds","Pale Sea","Sea of Frost","Jade Sea","Sea of Twilight"]};
ATLAS_METADATA[56] = {"seed":56,"mapName":"ARCANIUM","regions":[{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#ccc088","labelX":265.0,"labelY":945.0,"cities":[{"name":"Yewborough","x":0.0875,"y":0.5361,"capital":true},{"name":"Yellowfen","x":0.0768,"y":0.625,"capital":false},{"name":"Goldug","x":0.1518,"y":0.4861,"capital":false},{"name":"Gildafell","x":0.0411,"y":0.5806,"capital":false}]},{"name":"Verdantia","subtitle":"Realm of Verdantia","color":"#a8b8a0","labelX":1095.0,"labelY":925.0,"cities":[{"name":"Brightmoor","x":0.3982,"y":0.5306,"capital":true},{"name":"Palanor","x":0.3339,"y":0.6139,"capital":false},{"name":"Freehold","x":0.3696,"y":0.5806,"capital":false},{"name":"Alderhaven","x":0.3839,"y":0.575,"capital":false},{"name":"Elmsworth","x":0.2982,"y":0.5917,"capital":false}]},{"name":"Highkeep","subtitle":"Principality of Highkeep","color":"#c8b490","labelX":2165.0,"labelY":555.0,"cities":[{"name":"Highwall","x":0.7839,"y":0.325,"capital":true},{"name":"Cliffhaven","x":0.8911,"y":0.325,"capital":false},{"name":"Lindel","x":0.7411,"y":0.2028,"capital":false},{"name":"Lakecrest","x":0.7625,"y":0.2194,"capital":false},{"name":"Regnwald","x":0.8054,"y":0.3917,"capital":false}]},{"name":"Stormvale","subtitle":"Duchy of Stormvale","color":"#a0b0b8","labelX":635.0,"labelY":705.0,"cities":[{"name":"Stonemere","x":0.2196,"y":0.3972,"capital":true},{"name":"Greywater","x":0.2054,"y":0.3917,"capital":false},{"name":"Cinderfell","x":0.2911,"y":0.4972,"capital":false}]},{"name":"Vornhelm","subtitle":"Principality of Vornhelm","color":"#b8c098","labelX":2635.0,"labelY":705.0,"cities":[{"name":"Thornwall","x":0.9589,"y":0.3861,"capital":true},{"name":"Rynwood","x":0.9589,"y":0.3417,"capital":false},{"name":"Millcross","x":0.8875,"y":0.3972,"capital":false},{"name":"Valewick","x":0.9554,"y":0.3917,"capital":false}]},{"name":"Brynmar","subtitle":"Borderlands of Brynmar","color":"#c4b0a8","labelX":1745.0,"labelY":505.0,"cities":[{"name":"Palanor","x":0.6232,"y":0.2583,"capital":true},{"name":"Northgate","x":0.5375,"y":0.375,"capital":false},{"name":"Stormgate","x":0.7125,"y":0.275,"capital":false},{"name":"Vineyard","x":0.6411,"y":0.3694,"capital":false}]},{"name":"Dawnhollow","subtitle":"Realm of Dawnhollow","color":"#a8c0b0","labelX":1795.0,"labelY":865.0,"cities":[{"name":"Freehold","x":0.6482,"y":0.4972,"capital":true},{"name":"Stonemere","x":0.6839,"y":0.3917,"capital":false},{"name":"Underbridge","x":0.7089,"y":0.4472,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Crimson Gulf","Sea of Ash","Sea of Twilight","Sea of Dreams"]};
ATLAS_METADATA[57] = {"seed":57,"mapName":"FLAMECREST","regions":[{"name":"Crystalis","subtitle":"Principality of Crystalis","color":"#ccc088","labelX":2405.0,"labelY":1185.0,"cities":[{"name":"Lakecrest","x":0.8482,"y":0.6528,"capital":true},{"name":"Yewborough","x":0.8696,"y":0.6861,"capital":false},{"name":"Dawnwatch","x":0.7804,"y":0.5917,"capital":false},{"name":"Feradell","x":0.7268,"y":0.6972,"capital":false},{"name":"Inkwell","x":0.7518,"y":0.7472,"capital":false}]},{"name":"Kharadan","subtitle":"Principality of Kharadan","color":"#a8b8a0","labelX":1665.0,"labelY":955.0,"cities":[{"name":"Wydale","x":0.5875,"y":0.5361,"capital":true},{"name":"Duskhold","x":0.5339,"y":0.6139,"capital":false},{"name":"Ashwick","x":0.4946,"y":0.575,"capital":false},{"name":"Lindel","x":0.5589,"y":0.4806,"capital":false}]},{"name":"Ironreach","subtitle":"Principality of Ironreach","color":"#c8b490","labelX":2015.0,"labelY":1395.0,"cities":[{"name":"Oakmere","x":0.7196,"y":0.7917,"capital":false},{"name":"Brinewood","x":0.7161,"y":0.7861,"capital":true},{"name":"Wydale","x":0.7518,"y":0.7583,"capital":false}]},{"name":"Valdheim","subtitle":"The Wilds of Valdheim","color":"#a0b0b8","labelX":935.0,"labelY":475.0,"cities":[{"name":"Ashwick","x":0.3304,"y":0.2472,"capital":true},{"name":"Kronham","x":0.2696,"y":0.3639,"capital":false},{"name":"Pebblecreek","x":0.2982,"y":0.2361,"capital":false},{"name":"Dunmore","x":0.2946,"y":0.3028,"capital":false}]},{"name":"Caeloth","subtitle":"The Wilds of Caeloth","color":"#b8c098","labelX":605.0,"labelY":965.0,"cities":[{"name":"Odrin","x":0.2054,"y":0.525,"capital":true},{"name":"Moonshadow","x":0.2661,"y":0.5972,"capital":false},{"name":"Yellowfen","x":0.0946,"y":0.4417,"capital":false}]},{"name":"Cyrin","subtitle":"Kingdom of Cyrin","color":"#c4b0a8","labelX":955.0,"labelY":985.0,"cities":[{"name":"Dremoor","x":0.3625,"y":0.5694,"capital":true},{"name":"Whitevale","x":0.3018,"y":0.575,"capital":false},{"name":"Zenithburg","x":0.2911,"y":0.5361,"capital":false}]},{"name":"Lakeshore","subtitle":"The Free Marches of Lakeshore","color":"#a8c0b0","labelX":2025.0,"labelY":855.0,"cities":[{"name":"Regnwald","x":0.7411,"y":0.4806,"capital":true},{"name":"Redthorn","x":0.7339,"y":0.4472,"capital":false},{"name":"Westmarch","x":0.7875,"y":0.5194,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Sea of Silver","Sea of Ash","Sea of Twilight","Iron Sea"]};
ATLAS_METADATA[58] = {"seed":58,"mapName":"SHATTERED","regions":[{"name":"Iskarion","subtitle":"The Free Marches of Iskarion","color":"#ccc088","labelX":215.0,"labelY":1205.0,"cities":[{"name":"Whitevale","x":0.0875,"y":0.6917,"capital":true},{"name":"Deepwatch","x":0.0661,"y":0.6861,"capital":false},{"name":"Duskhold","x":0.1232,"y":0.6861,"capital":false},{"name":"Yewborough","x":0.1161,"y":0.6417,"capital":false},{"name":"Stonemere","x":0.1304,"y":0.6639,"capital":false},{"name":"Lakecrest","x":0.1054,"y":0.7361,"capital":false}]},{"name":"Ironreach","subtitle":"The Free Marches of Ironreach","color":"#a8b8a0","labelX":1855.0,"labelY":1225.0,"cities":[{"name":"Greenhollow","x":0.6554,"y":0.6639,"capital":true},{"name":"Oakmere","x":0.6375,"y":0.6639,"capital":false},{"name":"Ashwick","x":0.6161,"y":0.5028,"capital":false},{"name":"Duskwater","x":0.6768,"y":0.675,"capital":false},{"name":"Ilaes","x":0.7125,"y":0.6528,"capital":false},{"name":"Duskhold","x":0.7268,"y":0.5694,"capital":false}]},{"name":"Aethermoor","subtitle":"Kingdom of Aethermoor","color":"#c8b490","labelX":1015.0,"labelY":835.0,"cities":[{"name":"Windcrest","x":0.3696,"y":0.4806,"capital":true},{"name":"Westmarch","x":0.4232,"y":0.4361,"capital":false},{"name":"Kronham","x":0.3125,"y":0.3972,"capital":false}]},{"name":"Morvaine","subtitle":"Realm of Morvaine","color":"#a0b0b8","labelX":825.0,"labelY":1245.0,"cities":[{"name":"Thornwall","x":0.3089,"y":0.7139,"capital":true},{"name":"Dunmore","x":0.2732,"y":0.7639,"capital":false},{"name":"Longmere","x":0.2125,"y":0.7028,"capital":false},{"name":"Nighthollow","x":0.3839,"y":0.725,"capital":false},{"name":"Palanor","x":0.3554,"y":0.7472,"capital":false}]},{"name":"Crystalis","subtitle":"The Free Marches of Crystalis","color":"#b8c098","labelX":1865.0,"labelY":515.0,"cities":[{"name":"Silverton","x":0.6732,"y":0.2917,"capital":true},{"name":"Windcrest","x":0.7089,"y":0.1861,"capital":false},{"name":"Cliffhaven","x":0.7625,"y":0.2861,"capital":false},{"name":"Ravenmere","x":0.6518,"y":0.2417,"capital":false},{"name":"Duskhold","x":0.7054,"y":0.375,"capital":false},{"name":"Greywater","x":0.7946,"y":0.3028,"capital":false}]},{"name":"Goleli","subtitle":"The Dominion of Goleli","color":"#c4b0a8","labelX":615.0,"labelY":785.0,"cities":[{"name":"Foxbury","x":0.2161,"y":0.4194,"capital":true},{"name":"Ilaes","x":0.1268,"y":0.5306,"capital":false},{"name":"Thornwall","x":0.1375,"y":0.5139,"capital":false},{"name":"Quartzridge","x":0.1482,"y":0.4861,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Crimson Gulf","Sea of Silver","Sea of Dreams","Sea of Ash"]};
ATLAS_METADATA[59] = {"seed":59,"mapName":"CROWNSGATE","regions":[{"name":"Caltheon","subtitle":"Kingdom of Caltheon","color":"#ccc088","labelX":745.0,"labelY":1225.0,"cities":[{"name":"Dremoor","x":0.2732,"y":0.6972,"capital":true},{"name":"Ironholt","x":0.3554,"y":0.6194,"capital":false},{"name":"Northgate","x":0.2589,"y":0.7417,"capital":false},{"name":"Oakmere","x":0.2518,"y":0.7361,"capital":false},{"name":"Dawnwatch","x":0.3839,"y":0.7194,"capital":false},{"name":"Ashwick","x":0.3161,"y":0.6139,"capital":false}]},{"name":"Pinecrest","subtitle":"Duchy of Pinecrest","color":"#a8b8a0","labelX":2215.0,"labelY":725.0,"cities":[{"name":"Ilaes","x":0.8089,"y":0.3806,"capital":true},{"name":"Thebury","x":0.8089,"y":0.4306,"capital":false},{"name":"Dremoor","x":0.8946,"y":0.4306,"capital":false},{"name":"Greenhollow","x":0.8946,"y":0.3639,"capital":false},{"name":"Zenithburg","x":0.7625,"y":0.3583,"capital":false},{"name":"Goldenleaf","x":0.8732,"y":0.3417,"capital":false}]},{"name":"Galanthia","subtitle":"Realm of Galanthia","color":"#c8b490","labelX":545.0,"labelY":845.0,"cities":[{"name":"Brinewood","x":0.1911,"y":0.4861,"capital":true},{"name":"Ivyreach","x":0.2661,"y":0.3861,"capital":false},{"name":"Goldug","x":0.1839,"y":0.5472,"capital":false},{"name":"Lake Ashveil","x":0.2446,"y":0.4917,"capital":false}]},{"name":"Vornhelm","subtitle":"The Free Marches of Vornhelm","color":"#a0b0b8","labelX":1375.0,"labelY":1295.0,"cities":[{"name":"Borist","x":0.4804,"y":0.7028,"capital":true},{"name":"Cinderfell","x":0.5089,"y":0.7472,"capital":false},{"name":"Tidefall","x":0.5804,"y":0.7361,"capital":false},{"name":"Zarakyr","x":0.5054,"y":0.7472,"capital":false}]},{"name":"Stormvale","subtitle":"The Free Marches of Stormvale","color":"#b8c098","labelX":1475.0,"labelY":625.0,"cities":[{"name":"Knolltown","x":0.5339,"y":0.3361,"capital":true},{"name":"Stonemere","x":0.6446,"y":0.3861,"capital":false},{"name":"Runeford","x":0.6339,"y":0.3917,"capital":false},{"name":"Greywater","x":0.4696,"y":0.3528,"capital":false},{"name":"Cinderfell","x":0.6339,"y":0.3806,"capital":false}]},{"name":"Fara","subtitle":"Kingdom of Fara","color":"#c4b0a8","labelX":2375.0,"labelY":1105.0,"cities":[{"name":"Odrin","x":0.8589,"y":0.6139,"capital":true},{"name":"Zarakyr","x":0.7696,"y":0.6861,"capital":false},{"name":"Moonshadow","x":0.7304,"y":0.5972,"capital":false},{"name":"Kettlebrook","x":0.7911,"y":0.7139,"capital":false},{"name":"Thistledown","x":0.9054,"y":0.6417,"capital":false}]},{"name":"Ashmark","subtitle":"Principality of Ashmark","color":"#a8c0b0","labelX":355.0,"labelY":1215.0,"cities":[{"name":"Dremoor","x":0.1161,"y":0.6917,"capital":true},{"name":"Odrin","x":0.1946,"y":0.6917,"capital":false},{"name":"Zarakyr","x":0.0982,"y":0.625,"capital":false}]}],"mountains":[{"name":"Greymist Heights","labelX":2085.0,"labelY":685.0},{"name":"Ashen Divide","labelX":1095.0,"labelY":1165.0}],"lakes":[{"name":"Lake Thornwell","labelX":1615.0,"labelY":893.0},{"name":"Lunmere","labelX":1195.0,"labelY":893.0},{"name":"Lake Ashveil","labelX":735.0,"labelY":943.0}],"seaNames":["Sea of Storms","Iron Sea","Sea of Silver","Sea of Twilight","Sea of Winds"]};
ATLAS_METADATA[60] = {"seed":60,"mapName":"ELDENMARK","regions":[{"name":"Ashenveil","subtitle":"The Free Marches of Ashenveil","color":"#ccc088","labelX":1525.0,"labelY":765.0,"cities":[{"name":"Northgate","x":0.5232,"y":0.4417,"capital":true},{"name":"Ashbourne","x":0.4339,"y":0.4639,"capital":false},{"name":"Duskwater","x":0.4839,"y":0.3528,"capital":false},{"name":"Stonemere","x":0.4982,"y":0.4861,"capital":false},{"name":"Ashwick","x":0.6125,"y":0.5194,"capital":false},{"name":"Brightmoor","x":0.5018,"y":0.3694,"capital":false}]},{"name":"Vornhelm","subtitle":"Borderlands of Vornhelm","color":"#a8b8a0","labelX":2025.0,"labelY":1055.0,"cities":[{"name":"Duskwater","x":0.7232,"y":0.575,"capital":true},{"name":"Moonshadow","x":0.5911,"y":0.5583,"capital":false},{"name":"Inkwell","x":0.7625,"y":0.6694,"capital":false},{"name":"Eagleford","x":0.7589,"y":0.5361,"capital":false},{"name":"Lindel","x":0.5911,"y":0.625,"capital":false}]},{"name":"Shadowfen","subtitle":"Principality of Shadowfen","color":"#c8b490","labelX":2425.0,"labelY":825.0,"cities":[{"name":"Feradell","x":0.8554,"y":0.4417,"capital":true},{"name":"Fogmere","x":0.8518,"y":0.4917,"capital":false},{"name":"Harrowfield","x":0.7518,"y":0.4472,"capital":false},{"name":"Junipervale","x":0.9518,"y":0.5028,"capital":false},{"name":"Odrin","x":0.7518,"y":0.3694,"capital":false}]},{"name":"Solwynd","subtitle":"Principality of Solwynd","color":"#a0b0b8","labelX":855.0,"labelY":1155.0,"cities":[{"name":"Tidefall","x":0.2946,"y":0.6306,"capital":true},{"name":"Dawnwatch","x":0.1839,"y":0.675,"capital":false},{"name":"Ashbourne","x":0.3589,"y":0.6528,"capital":false}]},{"name":"Drakkos","subtitle":"Duchy of Drakkos","color":"#b8c098","labelX":2425.0,"labelY":1335.0,"cities":[{"name":"Foxbury","x":0.8696,"y":0.7417,"capital":true},{"name":"Millcross","x":0.9339,"y":0.6139,"capital":false},{"name":"Pinewood","x":0.9518,"y":0.775,"capital":false},{"name":"Pebblecreek","x":0.7946,"y":0.6639,"capital":false}]},{"name":"Theanas","subtitle":"The Free Marches of Theanas","color":"#c4b0a8","labelX":1325.0,"labelY":1305.0,"cities":[{"name":"Yewborough","x":0.4589,"y":0.725,"capital":true},{"name":"Ravenmere","x":0.4446,"y":0.5806,"capital":false},{"name":"Freehold","x":0.3804,"y":0.7194,"capital":false},{"name":"Highwall","x":0.5232,"y":0.7583,"capital":false},{"name":"Thebury","x":0.5518,"y":0.6639,"capital":false},{"name":"Elmsworth","x":0.3911,"y":0.6583,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Sea of Winds","Iron Sea","Jade Sea","Sea of Twilight"]};
ATLAS_METADATA[61] = {"seed":61,"mapName":"BLACKTHORN","regions":[{"name":"Valdheim","subtitle":"Principality of Valdheim","color":"#ccc088","labelX":2335.0,"labelY":675.0,"cities":[{"name":"Oldbridge","x":0.8375,"y":0.3639,"capital":true},{"name":"Vineyard","x":0.9268,"y":0.4417,"capital":false},{"name":"Yellowfen","x":0.9161,"y":0.4528,"capital":false}]},{"name":"Evershade","subtitle":"The Free Marches of Evershade","color":"#a8b8a0","labelX":685.0,"labelY":1145.0,"cities":[{"name":"Wydale","x":0.2339,"y":0.6528,"capital":true},{"name":"Pinewood","x":0.1411,"y":0.5639,"capital":false},{"name":"Goldug","x":0.2125,"y":0.5806,"capital":false},{"name":"Nighthollow","x":0.3696,"y":0.6528,"capital":false},{"name":"Inkwell","x":0.2018,"y":0.6028,"capital":false},{"name":"Whitevale","x":0.2982,"y":0.6917,"capital":false}]},{"name":"Goleli","subtitle":"Borderlands of Goleli","color":"#c8b490","labelX":365.0,"labelY":865.0,"cities":[{"name":"Freehold","x":0.1411,"y":0.4639,"capital":true},{"name":"Windcrest","x":0.1375,"y":0.5694,"capital":false},{"name":"Jadeston","x":0.0411,"y":0.5028,"capital":false},{"name":"Dawnwatch","x":0.0554,"y":0.4694,"capital":false}]},{"name":"Verdantia","subtitle":"The Dominion of Verdantia","color":"#a0b0b8","labelX":1615.0,"labelY":1055.0,"cities":[{"name":"Zenithburg","x":0.5732,"y":0.5972,"capital":true},{"name":"Palanor","x":0.5089,"y":0.5694,"capital":false},{"name":"Moonshadow","x":0.6625,"y":0.575,"capital":false},{"name":"Wydale","x":0.5482,"y":0.6417,"capital":false}]},{"name":"Nightward","subtitle":"The Dominion of Nightward","color":"#b8c098","labelX":1575.0,"labelY":685.0,"cities":[{"name":"Lindel","x":0.5661,"y":0.3639,"capital":true},{"name":"Dunmore","x":0.6518,"y":0.3528,"capital":false},{"name":"Greywater","x":0.4875,"y":0.4306,"capital":false},{"name":"Lawklif","x":0.6089,"y":0.4306,"capital":false},{"name":"Cliffhaven","x":0.4518,"y":0.375,"capital":false}]},{"name":"Silverfen","subtitle":"Kingdom of Silverfen","color":"#c4b0a8","labelX":1075.0,"labelY":815.0,"cities":[{"name":"Ravenmere","x":0.3732,"y":0.4417,"capital":true},{"name":"Junipervale","x":0.4018,"y":0.5639,"capital":false},{"name":"Duskwater","x":0.2982,"y":0.4694,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Twilight","Crimson Gulf","Sea of Frost","Iron Sea","Sea of Silver"]};
ATLAS_METADATA[62] = {"seed":62,"mapName":"RAVENSHOLLOW","regions":[{"name":"Obsidara","subtitle":"The Free Marches of Obsidara","color":"#ccc088","labelX":1205.0,"labelY":375.0,"cities":[{"name":"Zenithburg","x":0.4375,"y":0.1972,"capital":true},{"name":"Copperside","x":0.4661,"y":0.125,"capital":false},{"name":"Urswick","x":0.5054,"y":0.2472,"capital":false},{"name":"Runeford","x":0.3161,"y":0.1972,"capital":false},{"name":"Thistledown","x":0.4554,"y":0.1472,"capital":false},{"name":"Nighthollow","x":0.3982,"y":0.3028,"capital":false}]},{"name":"Kharadan","subtitle":"Realm of Kharadan","color":"#a8b8a0","labelX":2105.0,"labelY":595.0,"cities":[{"name":"Redthorn","x":0.7625,"y":0.3306,"capital":true},{"name":"Urswick","x":0.8125,"y":0.2528,"capital":false}]},{"name":"Northmere","subtitle":"Realm of Northmere","color":"#c8b490","labelX":1145.0,"labelY":905.0,"cities":[{"name":"Junipervale","x":0.4196,"y":0.4972,"capital":true},{"name":"Kingsbridge","x":0.4375,"y":0.3861,"capital":false},{"name":"Kingsbridge","x":0.3518,"y":0.5139,"capital":false},{"name":"Pinewood","x":0.4482,"y":0.575,"capital":false},{"name":"Borist","x":0.4446,"y":0.625,"capital":false},{"name":"Kingsbridge","x":0.5339,"y":0.1972,"capital":false}]},{"name":"Tethys","subtitle":"The Dominion of Tethys","color":"#a0b0b8","labelX":525.0,"labelY":775.0,"cities":[{"name":"Cliffhaven","x":0.2054,"y":0.4472,"capital":true},{"name":"Fernhollow","x":0.2768,"y":0.475,"capital":false},{"name":"Whitevale","x":0.2482,"y":0.3972,"capital":false},{"name":"Tidefall","x":0.1304,"y":0.5083,"capital":false},{"name":"Longmere","x":0.3018,"y":0.425,"capital":false},{"name":"Dunmore","x":0.2232,"y":0.3806,"capital":false}]},{"name":"Korrath","subtitle":"The Wilds of Korrath","color":"#b8c098","labelX":1625.0,"labelY":365.0,"cities":[{"name":"Alderhaven","x":0.5946,"y":0.2194,"capital":true},{"name":"Lawklif","x":0.6696,"y":0.2194,"capital":false},{"name":"Hollowburg","x":0.5982,"y":0.2694,"capital":false},{"name":"Valewick","x":0.6554,"y":0.1806,"capital":false},{"name":"Regnwald","x":0.6268,"y":0.2306,"capital":false}]},{"name":"Moonridge","subtitle":"Borderlands of Moonridge","color":"#c4b0a8","labelX":1685.0,"labelY":885.0,"cities":[{"name":"Thistledown","x":0.5982,"y":0.4972,"capital":true},{"name":"Palanor","x":0.5554,"y":0.425,"capital":false},{"name":"Blackrock","x":0.5518,"y":0.4194,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Sea of Ash","Jade Sea","Sea of Silver","Sea of Dreams"]};
ATLAS_METADATA[63] = {"seed":63,"mapName":"SUNFORGE","regions":[{"name":"Evershade","subtitle":"The Wilds of Evershade","color":"#ccc088","labelX":1495.0,"labelY":1255.0,"cities":[{"name":"Lindel","x":0.5161,"y":0.6861,"capital":true},{"name":"Cinderfell","x":0.4518,"y":0.7472,"capital":false},{"name":"Feradell","x":0.4768,"y":0.7306,"capital":false}]},{"name":"Dawnhollow","subtitle":"Realm of Dawnhollow","color":"#a8b8a0","labelX":325.0,"labelY":815.0,"cities":[{"name":"Windcrest","x":0.1304,"y":0.4472,"capital":true},{"name":"Deepwatch","x":0.0696,"y":0.4472,"capital":false},{"name":"Ashbourne","x":0.1804,"y":0.3472,"capital":false},{"name":"Loyarn","x":0.1768,"y":0.4639,"capital":false},{"name":"Knolltown","x":0.1589,"y":0.5139,"capital":false}]},{"name":"Northmere","subtitle":"The Dominion of Northmere","color":"#c8b490","labelX":945.0,"labelY":975.0,"cities":[{"name":"Yewborough","x":0.3554,"y":0.525,"capital":true},{"name":"Westmarch","x":0.3839,"y":0.4639,"capital":false},{"name":"Brinewood","x":0.4268,"y":0.4694,"capital":false}]},{"name":"Goleli","subtitle":"The Wilds of Goleli","color":"#a0b0b8","labelX":1015.0,"labelY":505.0,"cities":[{"name":"Fernhollow","x":0.3589,"y":0.2694,"capital":true},{"name":"Alderhaven","x":0.4089,"y":0.2583,"capital":false},{"name":"Runeford","x":0.3554,"y":0.375,"capital":false},{"name":"Goldug","x":0.2982,"y":0.2583,"capital":false},{"name":"Longmere","x":0.4482,"y":0.3028,"capital":false},{"name":"Dremoor","x":0.4411,"y":0.2639,"capital":false}]},{"name":"Belros","subtitle":"The Wilds of Belros","color":"#b8c098","labelX":1915.0,"labelY":1015.0,"cities":[{"name":"Kronham","x":0.6946,"y":0.5806,"capital":true},{"name":"Dawnwatch","x":0.5982,"y":0.5806,"capital":false},{"name":"Blackrock","x":0.7268,"y":0.4806,"capital":false},{"name":"Rynwood","x":0.7339,"y":0.5306,"capital":false},{"name":"Gerenwalde","x":0.7446,"y":0.6417,"capital":false},{"name":"Ilaes","x":0.6875,"y":0.675,"capital":false}]},{"name":"Kelvor","subtitle":"Kingdom of Kelvor","color":"#c4b0a8","labelX":1395.0,"labelY":695.0,"cities":[{"name":"Goldug","x":0.4982,"y":0.4028,"capital":true},{"name":"Greenhollow","x":0.5661,"y":0.4361,"capital":false},{"name":"Yewborough","x":0.4304,"y":0.3361,"capital":false},{"name":"Anora","x":0.4696,"y":0.4639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Sea of Twilight","Sea of Ash","Pale Sea","Crimson Gulf"]};
ATLAS_METADATA[64] = {"seed":64,"mapName":"DEEPHOLM","regions":[{"name":"Sunmere","subtitle":"Principality of Sunmere","color":"#ccc088","labelX":1445.0,"labelY":295.0,"cities":[{"name":"Freehold","x":0.5089,"y":0.1639,"capital":true},{"name":"Knolltown","x":0.4804,"y":0.1139,"capital":false},{"name":"Cliffhaven","x":0.4339,"y":0.075,"capital":false},{"name":"Duskhold","x":0.5625,"y":0.1583,"capital":false}]},{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#a8b8a0","labelX":895.0,"labelY":495.0,"cities":[{"name":"Moonshadow","x":0.3089,"y":0.2083,"capital":false},{"name":"Runeford","x":0.3661,"y":0.2972,"capital":false},{"name":"Kingsbridge","x":0.2911,"y":0.1694,"capital":false},{"name":"Maplecross","x":0.2875,"y":0.2028,"capital":false},{"name":"Quartzridge","x":0.3839,"y":0.2806,"capital":false},{"name":"Lunmere","x":0.3018,"y":0.2583,"capital":true}]},{"name":"Silverfen","subtitle":"Borderlands of Silverfen","color":"#c8b490","labelX":1195.0,"labelY":1375.0,"cities":[{"name":"Runeford","x":0.4232,"y":0.7583,"capital":true},{"name":"Ilaes","x":0.3732,"y":0.6194,"capital":false},{"name":"Inkwell","x":0.3982,"y":0.6194,"capital":false},{"name":"Alderhaven","x":0.4554,"y":0.6917,"capital":false}]},{"name":"Mistvale","subtitle":"Realm of Mistvale","color":"#a0b0b8","labelX":1505.0,"labelY":785.0,"cities":[{"name":"Ashwick","x":0.5268,"y":0.425,"capital":true},{"name":"Fernhollow","x":0.6196,"y":0.4083,"capital":false},{"name":"Ironholt","x":0.4304,"y":0.4472,"capital":false},{"name":"Redthorn","x":0.6089,"y":0.4194,"capital":false},{"name":"Odrin","x":0.4161,"y":0.4028,"capital":false},{"name":"Kingsbridge","x":0.4696,"y":0.425,"capital":false}]},{"name":"Caeloth","subtitle":"Principality of Caeloth","color":"#b8c098","labelX":2015.0,"labelY":685.0,"cities":[{"name":"Goldenleaf","x":0.7161,"y":0.3917,"capital":true},{"name":"Alderhaven","x":0.7054,"y":0.4472,"capital":false},{"name":"Vineyard","x":0.7268,"y":0.3917,"capital":false},{"name":"Lakecrest","x":0.6946,"y":0.4528,"capital":false}]},{"name":"Thornemark","subtitle":"Duchy of Thornemark","color":"#c4b0a8","labelX":695.0,"labelY":895.0,"cities":[{"name":"Regnwald","x":0.2161,"y":0.4306,"capital":false},{"name":"Inkwell","x":0.1911,"y":0.4861,"capital":false}]},{"name":"Ironreach","subtitle":"Principality of Ironreach","color":"#a8c0b0","labelX":445.0,"labelY":445.0,"cities":[{"name":"Lakecrest","x":0.1446,"y":0.2417,"capital":true},{"name":"Ashbourne","x":0.2268,"y":0.2417,"capital":false},{"name":"Goldenleaf","x":0.1089,"y":0.2028,"capital":false},{"name":"Dawnwatch","x":0.2089,"y":0.1806,"capital":false}]}],"mountains":[{"name":"Stormcrown Range","labelX":875.0,"labelY":155.0},{"name":"Ebonwall Mountains","labelX":945.0,"labelY":735.0},{"name":"Thundercrest Range","labelX":1215.0,"labelY":1005.0}],"lakes":[{"name":"Lunmere","labelX":825.0,"labelY":503.0}],"seaNames":["Sea of Twilight","Sea of Silver","Pale Sea","Sea of Dreams","Crimson Gulf"]};
ATLAS_METADATA[65] = {"seed":65,"mapName":"WYVERMERE","regions":[{"name":"Tarnis","subtitle":"Borderlands of Tarnis","color":"#ccc088","labelX":1265.0,"labelY":1175.0,"cities":[{"name":"Oldbridge","x":0.4446,"y":0.6417,"capital":true},{"name":"Freehold","x":0.4804,"y":0.5639,"capital":false},{"name":"Cliffhaven","x":0.3839,"y":0.6528,"capital":false},{"name":"Deepwatch","x":0.5161,"y":0.6528,"capital":false}]},{"name":"Moonridge","subtitle":"Realm of Moonridge","color":"#a8b8a0","labelX":555.0,"labelY":695.0,"cities":[{"name":"Jadeston","x":0.1875,"y":0.3806,"capital":true},{"name":"Goldug","x":0.2411,"y":0.3583,"capital":false},{"name":"Fernhollow","x":0.1946,"y":0.3083,"capital":false},{"name":"Fernhollow","x":0.2196,"y":0.2972,"capital":false},{"name":"Loyarn","x":0.0768,"y":0.3806,"capital":false}]},{"name":"Shadowfen","subtitle":"Duchy of Shadowfen","color":"#c8b490","labelX":2235.0,"labelY":1345.0,"cities":[{"name":"Duskwater","x":0.8018,"y":0.7639,"capital":true},{"name":"Pebblecreek","x":0.7446,"y":0.7972,"capital":false},{"name":"Junipervale","x":0.7696,"y":0.7972,"capital":false}]},{"name":"Caeloth","subtitle":"Realm of Caeloth","color":"#a0b0b8","labelX":1205.0,"labelY":325.0,"cities":[{"name":"Kronham","x":0.4375,"y":0.1972,"capital":true},{"name":"Alderhaven","x":0.4125,"y":0.1361,"capital":false},{"name":"Yewborough","x":0.4411,"y":0.325,"capital":false},{"name":"Ironholt","x":0.3911,"y":0.2194,"capital":false}]},{"name":"Valdheim","subtitle":"Duchy of Valdheim","color":"#b8c098","labelX":1655.0,"labelY":555.0,"cities":[{"name":"Alderhaven","x":0.5875,"y":0.3028,"capital":true},{"name":"Lakecrest","x":0.5125,"y":0.2528,"capital":false},{"name":"Quartzridge","x":0.5054,"y":0.2972,"capital":false},{"name":"Brinewood","x":0.6304,"y":0.2472,"capital":false},{"name":"Kettlebrook","x":0.6304,"y":0.2639,"capital":false},{"name":"Anora","x":0.6518,"y":0.2361,"capital":false}]},{"name":"Essear","subtitle":"The Dominion of Essear","color":"#c4b0a8","labelX":1885.0,"labelY":985.0,"cities":[{"name":"Copperside","x":0.6661,"y":0.5472,"capital":true},{"name":"Ashbourne","x":0.5268,"y":0.5806,"capital":false},{"name":"Feradell","x":0.7446,"y":0.6639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Twilight","Iron Sea","Sea of Frost","Sea of Ash","Crimson Gulf"]};
ATLAS_METADATA[66] = {"seed":66,"mapName":"GLOOMHAVEN","regions":[{"name":"Ravenmarch","subtitle":"Borderlands of Ravenmarch","color":"#ccc088","labelX":1355.0,"labelY":895.0,"cities":[{"name":"Jadeston","x":0.4661,"y":0.4917,"capital":true},{"name":"Lawklif","x":0.5125,"y":0.3917,"capital":false},{"name":"Kettlebrook","x":0.5018,"y":0.525,"capital":false},{"name":"Ivyreach","x":0.5518,"y":0.4861,"capital":false},{"name":"Fernhollow","x":0.3946,"y":0.3639,"capital":false},{"name":"Millcross","x":0.4089,"y":0.4417,"capital":false}]},{"name":"Iskarion","subtitle":"Principality of Iskarion","color":"#a8b8a0","labelX":465.0,"labelY":1305.0,"cities":[{"name":"Inkwell","x":0.1696,"y":0.7361,"capital":true},{"name":"Nighthollow","x":0.0875,"y":0.7028,"capital":false},{"name":"Greywater","x":0.2661,"y":0.7306,"capital":false},{"name":"Kingsbridge","x":0.1089,"y":0.7528,"capital":false},{"name":"Feradell","x":0.0875,"y":0.7583,"capital":false}]},{"name":"Galanthia","subtitle":"The Free Marches of Galanthia","color":"#c8b490","labelX":1745.0,"labelY":1035.0,"cities":[{"name":"Fernhollow","x":0.6161,"y":0.575,"capital":true},{"name":"Elmsworth","x":0.6839,"y":0.7028,"capital":false},{"name":"Millcross","x":0.5232,"y":0.5083,"capital":false},{"name":"Oldbridge","x":0.7125,"y":0.6472,"capital":false}]},{"name":"Elonia","subtitle":"The Free Marches of Elonia","color":"#a0b0b8","labelX":515.0,"labelY":635.0,"cities":[{"name":"Gildafell","x":0.2018,"y":0.3361,"capital":true},{"name":"Millcross","x":0.2339,"y":0.4139,"capital":false},{"name":"Duskwater","x":0.1054,"y":0.325,"capital":false},{"name":"Fogmere","x":0.0946,"y":0.3472,"capital":false},{"name":"Kettlebrook","x":0.1661,"y":0.3194,"capital":false},{"name":"Silverton","x":0.2482,"y":0.4361,"capital":false}]},{"name":"Korrath","subtitle":"Principality of Korrath","color":"#b8c098","labelX":2065.0,"labelY":825.0,"cities":[{"name":"Maplecross","x":0.7518,"y":0.4528,"capital":true},{"name":"Duskwater","x":0.8625,"y":0.4861,"capital":false},{"name":"Borist","x":0.6554,"y":0.5083,"capital":false},{"name":"Ashbourne","x":0.6482,"y":0.4306,"capital":false},{"name":"Urswick","x":0.7375,"y":0.5639,"capital":false}]},{"name":"Dremora","subtitle":"The Dominion of Dremora","color":"#c4b0a8","labelX":2515.0,"labelY":645.0,"cities":[{"name":"Stonemere","x":0.9161,"y":0.3583,"capital":true},{"name":"Yellowfen","x":0.8732,"y":0.4972,"capital":false},{"name":"Maplecross","x":0.8268,"y":0.2806,"capital":false}]},{"name":"Ashmark","subtitle":"Kingdom of Ashmark","color":"#a8c0b0","labelX":1015.0,"labelY":1225.0,"cities":[{"name":"Oakmere","x":0.3696,"y":0.6972,"capital":true},{"name":"Alderhaven","x":0.3554,"y":0.625,"capital":false},{"name":"Odrin","x":0.2982,"y":0.6694,"capital":false},{"name":"Underbridge","x":0.2804,"y":0.725,"capital":false},{"name":"Yellowfen","x":0.4696,"y":0.6694,"capital":false},{"name":"Underbridge","x":0.2768,"y":0.7194,"capital":false}]}],"mountains":[{"name":"Greymist Heights","labelX":285.0,"labelY":1155.0},{"name":"Dragon's Spine","labelX":935.0,"labelY":695.0},{"name":"Silvervein Ridge","labelX":1345.0,"labelY":965.0}],"lakes":[],"seaNames":["Crimson Gulf","Sea of Winds","Sea of Ash","Sea of Twilight","Jade Sea"]};
ATLAS_METADATA[67] = {"seed":67,"mapName":"SILVERPINE","regions":[{"name":"Kelvor","subtitle":"The Dominion of Kelvor","color":"#ccc088","labelX":1735.0,"labelY":825.0,"cities":[{"name":"Lindel","x":0.6018,"y":0.4528,"capital":true},{"name":"Anora","x":0.6268,"y":0.5083,"capital":false},{"name":"Blackrock","x":0.6268,"y":0.3361,"capital":false},{"name":"Thornwall","x":0.6446,"y":0.4917,"capital":false}]},{"name":"Iskarion","subtitle":"Borderlands of Iskarion","color":"#a8b8a0","labelX":2295.0,"labelY":195.0,"cities":[{"name":"Odrin","x":0.8089,"y":0.1139,"capital":true},{"name":"Underbridge","x":0.7161,"y":0.125,"capital":false},{"name":"Kingsbridge","x":0.7018,"y":0.1472,"capital":false},{"name":"Thistledown","x":0.8982,"y":0.1083,"capital":false}]},{"name":"Selvane","subtitle":"Borderlands of Selvane","color":"#c8b490","labelX":505.0,"labelY":1015.0,"cities":[{"name":"Kronham","x":0.1875,"y":0.5806,"capital":true},{"name":"Ilaes","x":0.2482,"y":0.4639,"capital":false},{"name":"Blackrock","x":0.2554,"y":0.4972,"capital":false},{"name":"Maplecross","x":0.1161,"y":0.5083,"capital":false},{"name":"Inkwell","x":0.0946,"y":0.5083,"capital":false},{"name":"Regnwald","x":0.2339,"y":0.6639,"capital":false}]},{"name":"Goleli","subtitle":"Borderlands of Goleli","color":"#a0b0b8","labelX":2095.0,"labelY":625.0,"cities":[{"name":"Greywater","x":0.7411,"y":0.3361,"capital":true},{"name":"Valewick","x":0.7625,"y":0.425,"capital":false},{"name":"Runeford","x":0.6375,"y":0.3472,"capital":false},{"name":"Hollowburg","x":0.8482,"y":0.3639,"capital":false},{"name":"Stonemere","x":0.7339,"y":0.2583,"capital":false},{"name":"Mirrordeep","x":0.7589,"y":0.4083,"capital":false}]},{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#b8c098","labelX":1295.0,"labelY":1275.0,"cities":[{"name":"Ilaes","x":0.4482,"y":0.6972,"capital":true},{"name":"Gerenwalde","x":0.3446,"y":0.6694,"capital":false},{"name":"Runeford","x":0.4625,"y":0.6417,"capital":false},{"name":"Fernhollow","x":0.3696,"y":0.7472,"capital":false},{"name":"Kingsbridge","x":0.4018,"y":0.7806,"capital":false}]},{"name":"Nightward","subtitle":"The Free Marches of Nightward","color":"#c4b0a8","labelX":1325.0,"labelY":545.0,"cities":[{"name":"Copperside","x":0.4625,"y":0.2861,"capital":true},{"name":"Thebury","x":0.4196,"y":0.2417,"capital":false},{"name":"Highwall","x":0.5589,"y":0.3417,"capital":false},{"name":"Tidefall","x":0.3768,"y":0.3028,"capital":false},{"name":"Whitevale","x":0.5696,"y":0.3639,"capital":false},{"name":"Freehold","x":0.4518,"y":0.3417,"capital":false}]},{"name":"Drakkos","subtitle":"Duchy of Drakkos","color":"#a8c0b0","labelX":1885.0,"labelY":1225.0,"cities":[{"name":"Hollowburg","x":0.6696,"y":0.6694,"capital":true},{"name":"Duskwater","x":0.6661,"y":0.6917,"capital":false},{"name":"Brightmoor","x":0.6018,"y":0.675,"capital":false},{"name":"Brightmoor","x":0.6589,"y":0.6361,"capital":false}]},{"name":"Obsidara","subtitle":"Kingdom of Obsidara","color":"#c8c0a0","labelX":1755.0,"labelY":335.0,"cities":[{"name":"Dawnwatch","x":0.6232,"y":0.175,"capital":true},{"name":"Foxbury","x":0.5696,"y":0.1917,"capital":false},{"name":"Yellowfen","x":0.5911,"y":0.2194,"capital":false},{"name":"Runeford","x":0.6839,"y":0.2194,"capital":false},{"name":"Loyarn","x":0.6804,"y":0.225,"capital":false}]}],"mountains":[{"name":"Thundercrest Range","labelX":1575.0,"labelY":335.0},{"name":"Ironspine Range","labelX":1245.0,"labelY":1145.0},{"name":"Ebonwall Mountains","labelX":1865.0,"labelY":1245.0},{"name":"Ashen Divide","labelX":1495.0,"labelY":1075.0}],"lakes":[{"name":"Crystal Lake","labelX":1345.0,"labelY":843.0},{"name":"Mirrordeep","labelX":2055.0,"labelY":693.0}],"seaNames":["Sea of Embers","Pale Sea","Crimson Gulf","Sea of Dreams","Sea of Storms"]};
ATLAS_METADATA[68] = {"seed":68,"mapName":"STONEWALL","regions":[{"name":"Thornemark","subtitle":"Principality of Thornemark","color":"#ccc088","labelX":2165.0,"labelY":1055.0,"cities":[{"name":"Millcross","x":0.7589,"y":0.5917,"capital":true},{"name":"Goldug","x":0.6661,"y":0.6861,"capital":false},{"name":"Odrin","x":0.6661,"y":0.5861,"capital":false},{"name":"Greenhollow","x":0.8161,"y":0.6528,"capital":false},{"name":"Nighthollow","x":0.8125,"y":0.6861,"capital":false},{"name":"Whitevale","x":0.6625,"y":0.6139,"capital":false}]},{"name":"Ironreach","subtitle":"Realm of Ironreach","color":"#a8b8a0","labelX":865.0,"labelY":735.0,"cities":[{"name":"Urswick","x":0.3054,"y":0.4028,"capital":true},{"name":"Kettlebrook","x":0.3482,"y":0.4472,"capital":false},{"name":"Kingsbridge","x":0.3554,"y":0.3806,"capital":false},{"name":"Zenithburg","x":0.2518,"y":0.3639,"capital":false},{"name":"Dunmore","x":0.3946,"y":0.3306,"capital":false},{"name":"Lakecrest","x":0.2554,"y":0.4472,"capital":false}]},{"name":"Essear","subtitle":"The Free Marches of Essear","color":"#c8b490","labelX":1495.0,"labelY":775.0,"cities":[{"name":"Yewborough","x":0.5196,"y":0.425,"capital":true},{"name":"Feradell","x":0.6482,"y":0.3639,"capital":false},{"name":"Cliffhaven","x":0.4661,"y":0.3583,"capital":false},{"name":"Zenithburg","x":0.5661,"y":0.3972,"capital":false},{"name":"Anora","x":0.5196,"y":0.5083,"capital":false},{"name":"Regnwald","x":0.4268,"y":0.3194,"capital":false}]},{"name":"Crystalis","subtitle":"Realm of Crystalis","color":"#a0b0b8","labelX":455.0,"labelY":585.0,"cities":[{"name":"Hollowburg","x":0.1518,"y":0.3083,"capital":true},{"name":"Gildafell","x":0.2089,"y":0.2528,"capital":false},{"name":"Copperside","x":0.1304,"y":0.3639,"capital":false},{"name":"Dunmore","x":0.1982,"y":0.2806,"capital":false},{"name":"Goldug","x":0.2268,"y":0.2528,"capital":false},{"name":"Palanor","x":0.0982,"y":0.2972,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Frost","Sea of Storms","Sea of Dreams","Sea of Silver","Jade Sea"]};
ATLAS_METADATA[69] = {"seed":69,"mapName":"NIGHTFALL","regions":[{"name":"Obsidara","subtitle":"The Free Marches of Obsidara","color":"#ccc088","labelX":1355.0,"labelY":785.0,"cities":[{"name":"Thebury","x":0.4911,"y":0.425,"capital":true},{"name":"Silverton","x":0.4018,"y":0.4528,"capital":false},{"name":"Brightmoor","x":0.5268,"y":0.3139,"capital":false},{"name":"Runeford","x":0.4482,"y":0.5028,"capital":false},{"name":"Maplecross","x":0.4268,"y":0.525,"capital":false}]},{"name":"Solwynd","subtitle":"The Dominion of Solwynd","color":"#a8b8a0","labelX":555.0,"labelY":725.0,"cities":[{"name":"Kronham","x":0.1911,"y":0.3972,"capital":true},{"name":"Duskwater","x":0.1375,"y":0.2861,"capital":false},{"name":"Oldbridge","x":0.2125,"y":0.3306,"capital":false}]},{"name":"Dravina","subtitle":"The Wilds of Dravina","color":"#c8b490","labelX":2515.0,"labelY":925.0,"cities":[{"name":"Highwall","x":0.8982,"y":0.5194,"capital":true},{"name":"Hollowburg","x":0.8875,"y":0.425,"capital":false},{"name":"Lakecrest","x":0.8839,"y":0.5917,"capital":false},{"name":"Redthorn","x":0.9589,"y":0.4861,"capital":false},{"name":"Underbridge","x":0.8661,"y":0.4306,"capital":false},{"name":"Stormgate","x":0.8554,"y":0.4528,"capital":false}]},{"name":"Ashenveil","subtitle":"The Free Marches of Ashenveil","color":"#a0b0b8","labelX":385.0,"labelY":1115.0,"cities":[{"name":"Anora","x":0.1375,"y":0.6306,"capital":true},{"name":"Goldug","x":0.1661,"y":0.6472,"capital":false},{"name":"Junipervale","x":0.2339,"y":0.6083,"capital":false},{"name":"Pebblecreek","x":0.0411,"y":0.625,"capital":false}]},{"name":"Goleli","subtitle":"Principality of Goleli","color":"#b8c098","labelX":1885.0,"labelY":1075.0,"cities":[{"name":"Borist","x":0.6768,"y":0.6028,"capital":true},{"name":"Duskwater","x":0.6875,"y":0.6583,"capital":false},{"name":"Foxbury","x":0.6982,"y":0.4972,"capital":false},{"name":"Duskwater","x":0.6768,"y":0.6583,"capital":false},{"name":"Regnwald","x":0.6339,"y":0.5528,"capital":false},{"name":"Greywater","x":0.5625,"y":0.6306,"capital":false}]},{"name":"Selvane","subtitle":"The Dominion of Selvane","color":"#c4b0a8","labelX":985.0,"labelY":995.0,"cities":[{"name":"Rynwood","x":0.3625,"y":0.5917,"capital":false},{"name":"Greywater","x":0.3554,"y":0.5528,"capital":true},{"name":"Harrowfield","x":0.3982,"y":0.4694,"capital":false},{"name":"Gildafell","x":0.3018,"y":0.6028,"capital":false},{"name":"Copperside","x":0.3982,"y":0.4528,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Dreams","Sea of Embers","Sea of Twilight","Crimson Gulf","Sea of Ash"]};
ATLAS_METADATA[70] = {"seed":70,"mapName":"AURELIAN","regions":[{"name":"Jadecross","subtitle":"Kingdom of Jadecross","color":"#ccc088","labelX":2155.0,"labelY":1085.0,"cities":[{"name":"Silverton","x":0.7696,"y":0.5917,"capital":true},{"name":"Westmarch","x":0.7304,"y":0.5417,"capital":false},{"name":"Wydale","x":0.8196,"y":0.6417,"capital":false},{"name":"Fogmere","x":0.7089,"y":0.5472,"capital":false},{"name":"Jadeston","x":0.8018,"y":0.6694,"capital":false},{"name":"Greenhollow","x":0.6732,"y":0.525,"capital":false}]},{"name":"Dawnhollow","subtitle":"The Free Marches of Dawnhollow","color":"#a8b8a0","labelX":2455.0,"labelY":615.0,"cities":[{"name":"Beowick","x":0.8661,"y":0.3361,"capital":true},{"name":"Vineyard","x":0.9268,"y":0.3694,"capital":false},{"name":"Alderhaven","x":0.9589,"y":0.3583,"capital":false}]},{"name":"Duskveil","subtitle":"The Dominion of Duskveil","color":"#c8b490","labelX":785.0,"labelY":655.0,"cities":[{"name":"Knolltown","x":0.2911,"y":0.3472,"capital":true},{"name":"Fernhollow","x":0.2161,"y":0.3917,"capital":false},{"name":"Blackrock","x":0.3375,"y":0.2861,"capital":false},{"name":"Kettlebrook","x":0.3268,"y":0.3028,"capital":false},{"name":"Fogmere","x":0.3804,"y":0.3139,"capital":false}]},{"name":"Aelindor","subtitle":"Kingdom of Aelindor","color":"#a0b0b8","labelX":1695.0,"labelY":825.0,"cities":[{"name":"Knolltown","x":0.6196,"y":0.4361,"capital":true},{"name":"Junipervale","x":0.5946,"y":0.5306,"capital":false},{"name":"Silverton","x":0.7125,"y":0.4861,"capital":false},{"name":"Borist","x":0.7161,"y":0.475,"capital":false},{"name":"Gildafell","x":0.5696,"y":0.5583,"capital":false},{"name":"Redthorn","x":0.6696,"y":0.5361,"capital":false}]},{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#b8c098","labelX":525.0,"labelY":975.0,"cities":[{"name":"Urswick","x":0.1911,"y":0.525,"capital":true},{"name":"Kingsbridge","x":0.1268,"y":0.5306,"capital":false},{"name":"Greywater","x":0.1375,"y":0.5194,"capital":false},{"name":"Pebblecreek","x":0.2125,"y":0.4306,"capital":false},{"name":"Ironholt","x":0.2411,"y":0.4806,"capital":false},{"name":"Zarakyr","x":0.1375,"y":0.5472,"capital":false}]},{"name":"Dremora","subtitle":"The Dominion of Dremora","color":"#c4b0a8","labelX":1305.0,"labelY":915.0,"cities":[{"name":"Tidefall","x":0.4482,"y":0.5083,"capital":true},{"name":"Freehold","x":0.4339,"y":0.4528,"capital":false},{"name":"Ashbourne","x":0.4089,"y":0.5639,"capital":false},{"name":"Inkwell","x":0.3696,"y":0.4528,"capital":false},{"name":"Brightmoor","x":0.3946,"y":0.5306,"capital":false},{"name":"Dremoor","x":0.3625,"y":0.4639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Silver","Iron Sea","Pale Sea","Sea of Embers"]};
ATLAS_METADATA[71] = {"seed":71,"mapName":"GRIMSPIRE","regions":[{"name":"Solwynd","subtitle":"Realm of Solwynd","color":"#ccc088","labelX":1115.0,"labelY":265.0,"cities":[{"name":"Tidefall","x":0.3982,"y":0.1639,"capital":true},{"name":"Maplecross","x":0.4161,"y":0.1583,"capital":false},{"name":"Cinderfell","x":0.2768,"y":0.225,"capital":false},{"name":"Yewborough","x":0.4268,"y":0.2472,"capital":false}]},{"name":"Ravenmarch","subtitle":"Duchy of Ravenmarch","color":"#a8b8a0","labelX":1305.0,"labelY":725.0,"cities":[{"name":"Longmere","x":0.4625,"y":0.4139,"capital":true},{"name":"Gildafell","x":0.4732,"y":0.3528,"capital":false},{"name":"Junipervale","x":0.5125,"y":0.3806,"capital":false},{"name":"Lindel","x":0.4268,"y":0.2917,"capital":false},{"name":"Hollowburg","x":0.3946,"y":0.3972,"capital":false},{"name":"Brightmoor","x":0.4661,"y":0.325,"capital":false}]},{"name":"Iskarion","subtitle":"Realm of Iskarion","color":"#c8b490","labelX":505.0,"labelY":585.0,"cities":[{"name":"Stormgate","x":0.1982,"y":0.3417,"capital":true},{"name":"Ashwick","x":0.1411,"y":0.2917,"capital":false},{"name":"Deepwatch","x":0.1268,"y":0.375,"capital":false},{"name":"Freehold","x":0.1589,"y":0.2972,"capital":false},{"name":"Tidefall","x":0.1161,"y":0.325,"capital":false},{"name":"Kronham","x":0.2446,"y":0.3417,"capital":false}]},{"name":"Caltheon","subtitle":"Borderlands of Caltheon","color":"#a0b0b8","labelX":715.0,"labelY":1205.0,"cities":[{"name":"Thornwall","x":0.2518,"y":0.6528,"capital":true},{"name":"Runeford","x":0.2054,"y":0.5194,"capital":false},{"name":"Ravenmere","x":0.2161,"y":0.5806,"capital":false},{"name":"Urswick","x":0.2446,"y":0.5083,"capital":false}]}],"mountains":[{"name":"Ebonwall Mountains","labelX":565.0,"labelY":595.0},{"name":"Ashen Divide","labelX":1255.0,"labelY":1125.0},{"name":"Greymist Heights","labelX":1225.0,"labelY":385.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Winds","Sea of Embers","Sea of Frost","Crimson Gulf"]};
ATLAS_METADATA[72] = {"seed":72,"mapName":"HAVENREACH","regions":[{"name":"Shadowfen","subtitle":"The Free Marches of Shadowfen","color":"#ccc088","labelX":475.0,"labelY":875.0,"cities":[{"name":"Northgate","x":0.1661,"y":0.4972,"capital":true},{"name":"Lindel","x":0.1232,"y":0.5528,"capital":false},{"name":"Elmsworth","x":0.0732,"y":0.5583,"capital":false},{"name":"Brightmoor","x":0.1089,"y":0.475,"capital":false},{"name":"Millcross","x":0.1911,"y":0.4361,"capital":false},{"name":"Runeford","x":0.2411,"y":0.4639,"capital":false}]},{"name":"Ironglenn","subtitle":"Borderlands of Ironglenn","color":"#a8b8a0","labelX":1485.0,"labelY":1125.0,"cities":[{"name":"Alderhaven","x":0.5411,"y":0.6139,"capital":true},{"name":"Dremoor","x":0.5411,"y":0.5694,"capital":false},{"name":"Pebblecreek","x":0.4768,"y":0.5806,"capital":false},{"name":"Quartzridge","x":0.4661,"y":0.5806,"capital":false}]},{"name":"Tethys","subtitle":"The Wilds of Tethys","color":"#c8b490","labelX":2545.0,"labelY":675.0,"cities":[{"name":"Redthorn","x":0.9089,"y":0.3694,"capital":true},{"name":"Inkwell","x":0.8054,"y":0.3694,"capital":false},{"name":"Highwall","x":0.8625,"y":0.3417,"capital":false},{"name":"Dunmore","x":0.9446,"y":0.4139,"capital":false},{"name":"Pebblecreek","x":0.8661,"y":0.5028,"capital":false}]},{"name":"Ravenmarch","subtitle":"Borderlands of Ravenmarch","color":"#a0b0b8","labelX":1315.0,"labelY":685.0,"cities":[{"name":"Foxbury","x":0.4518,"y":0.3806,"capital":true},{"name":"Millcross","x":0.3875,"y":0.4028,"capital":false},{"name":"Kingsbridge","x":0.5375,"y":0.3917,"capital":false},{"name":"Anora","x":0.4946,"y":0.3528,"capital":false}]},{"name":"Ashenveil","subtitle":"Realm of Ashenveil","color":"#b8c098","labelX":805.0,"labelY":1325.0,"cities":[{"name":"Stormgate","x":0.2696,"y":0.7306,"capital":true},{"name":"Greenhollow","x":0.2661,"y":0.7583,"capital":false},{"name":"Pinewood","x":0.1768,"y":0.6972,"capital":false},{"name":"Foxbury","x":0.2304,"y":0.7361,"capital":false}]},{"name":"Greyhollow","subtitle":"Realm of Greyhollow","color":"#c4b0a8","labelX":2005.0,"labelY":1065.0,"cities":[{"name":"Whitevale","x":0.7161,"y":0.6028,"capital":true},{"name":"Stormgate","x":0.7661,"y":0.5472,"capital":false},{"name":"Yewborough","x":0.7625,"y":0.6528,"capital":false},{"name":"Freehold","x":0.7804,"y":0.625,"capital":false},{"name":"Alderhaven","x":0.6625,"y":0.5972,"capital":false}]},{"name":"Rosedale","subtitle":"Realm of Rosedale","color":"#a8c0b0","labelX":1795.0,"labelY":715.0,"cities":[{"name":"Silverton","x":0.6304,"y":0.3972,"capital":true},{"name":"Lindel","x":0.6911,"y":0.3806,"capital":false},{"name":"Dunmore","x":0.5482,"y":0.4472,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Winds","Sea of Embers","Jade Sea","Pale Sea","Sea of Frost"]};
ATLAS_METADATA[73] = {"seed":73,"mapName":"EMBERGLOW","regions":[{"name":"Ashmark","subtitle":"Principality of Ashmark","color":"#ccc088","labelX":995.0,"labelY":1645.0,"cities":[{"name":"Pinewood","x":0.3625,"y":0.9194,"capital":true},{"name":"Oakmere","x":0.4554,"y":0.8972,"capital":false},{"name":"Yewborough","x":0.3518,"y":0.825,"capital":false},{"name":"Urswick","x":0.3339,"y":0.8361,"capital":false},{"name":"Blackrock","x":0.3411,"y":0.8806,"capital":false}]},{"name":"Duskveil","subtitle":"Duchy of Duskveil","color":"#a8b8a0","labelX":1645.0,"labelY":775.0,"cities":[{"name":"Fogmere","x":0.5875,"y":0.425,"capital":true},{"name":"Lindel","x":0.6125,"y":0.4361,"capital":false},{"name":"Vineyard","x":0.6089,"y":0.5139,"capital":false}]},{"name":"Pinecrest","subtitle":"The Dominion of Pinecrest","color":"#c8b490","labelX":2475.0,"labelY":1045.0,"cities":[{"name":"Brinewood","x":0.8804,"y":0.5861,"capital":true},{"name":"Ironholt","x":0.7661,"y":0.5861,"capital":false},{"name":"Lindel","x":0.9125,"y":0.6806,"capital":false},{"name":"Zenithburg","x":0.9411,"y":0.7139,"capital":false}]},{"name":"Cyrin","subtitle":"The Free Marches of Cyrin","color":"#a0b0b8","labelX":1315.0,"labelY":1405.0,"cities":[{"name":"Duskhold","x":0.4875,"y":0.775,"capital":true},{"name":"Odrin","x":0.3804,"y":0.7194,"capital":false},{"name":"Stormgate","x":0.4018,"y":0.8083,"capital":false}]},{"name":"Dawnhollow","subtitle":"Duchy of Dawnhollow","color":"#b8c098","labelX":685.0,"labelY":865.0,"cities":[{"name":"Runeford","x":0.2589,"y":0.4694,"capital":true},{"name":"Redthorn","x":0.3196,"y":0.3639,"capital":false},{"name":"Dremoor","x":0.3054,"y":0.4972,"capital":false},{"name":"Zarakyr","x":0.3161,"y":0.5361,"capital":false}]},{"name":"Sunmere","subtitle":"Kingdom of Sunmere","color":"#c4b0a8","labelX":1975.0,"labelY":1235.0,"cities":[{"name":"Odrin","x":0.7161,"y":0.6917,"capital":true},{"name":"Ravenmere","x":0.6268,"y":0.7083,"capital":false},{"name":"Stormgate","x":0.7589,"y":0.775,"capital":false},{"name":"Gildafell","x":0.6625,"y":0.7639,"capital":false},{"name":"Stonemere","x":0.7839,"y":0.7139,"capital":false}]},{"name":"Goleli","subtitle":"Kingdom of Goleli","color":"#a8c0b0","labelX":685.0,"labelY":1275.0,"cities":[{"name":"Highwall","x":0.2375,"y":0.7028,"capital":true},{"name":"Oldbridge","x":0.3125,"y":0.7528,"capital":false},{"name":"Runeford","x":0.3125,"y":0.775,"capital":false},{"name":"Jadeston","x":0.3411,"y":0.7361,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":435.0,"labelY":735.0},{"name":"Ashen Divide","labelX":1565.0,"labelY":665.0},{"name":"Ebonwall Mountains","labelX":1705.0,"labelY":775.0},{"name":"Stormcrown Range","labelX":355.0,"labelY":935.0}],"lakes":[{"name":"Dimwater","labelX":1255.0,"labelY":1043.0}],"seaNames":["Sea of Embers","Sea of Dreams","Sea of Frost","Jade Sea","Sea of Storms"]};
ATLAS_METADATA[74] = {"seed":74,"mapName":"FROSTHOLM","regions":[{"name":"Ashmark","subtitle":"The Wilds of Ashmark","color":"#ccc088","labelX":2095.0,"labelY":1365.0,"cities":[{"name":"Urswick","x":0.7518,"y":0.775,"capital":true},{"name":"Goldug","x":0.7589,"y":0.7306,"capital":false},{"name":"Nighthollow","x":0.7161,"y":0.7917,"capital":false},{"name":"Alderhaven","x":0.7982,"y":0.7694,"capital":false},{"name":"Duskwater","x":0.6804,"y":0.7028,"capital":false},{"name":"Ashwick","x":0.7732,"y":0.7417,"capital":false}]},{"name":"Greyhollow","subtitle":"The Wilds of Greyhollow","color":"#a8b8a0","labelX":1355.0,"labelY":505.0,"cities":[{"name":"Lindel","x":0.4946,"y":0.2639,"capital":true},{"name":"Foxbury","x":0.4482,"y":0.4028,"capital":false},{"name":"Pinewood","x":0.5554,"y":0.3139,"capital":false},{"name":"Duskhold","x":0.3732,"y":0.2472,"capital":false},{"name":"Loyarn","x":0.5875,"y":0.1861,"capital":false}]},{"name":"Duskveil","subtitle":"Borderlands of Duskveil","color":"#c8b490","labelX":1255.0,"labelY":1095.0,"cities":[{"name":"Oakmere","x":0.4625,"y":0.6083,"capital":true},{"name":"Yellowfen","x":0.5768,"y":0.6972,"capital":false},{"name":"Elmsworth","x":0.3804,"y":0.6083,"capital":false},{"name":"Lakecrest","x":0.4268,"y":0.7306,"capital":false}]},{"name":"Lakeshore","subtitle":"Borderlands of Lakeshore","color":"#a0b0b8","labelX":265.0,"labelY":715.0,"cities":[{"name":"Loyarn","x":0.1054,"y":0.3917,"capital":true},{"name":"Rynwood","x":0.1804,"y":0.3028,"capital":false},{"name":"Millcross","x":0.0625,"y":0.3417,"capital":false},{"name":"Stormgate","x":0.1911,"y":0.3917,"capital":false}]},{"name":"Frosthold","subtitle":"The Dominion of Frosthold","color":"#b8c098","labelX":2515.0,"labelY":1175.0,"cities":[{"name":"Rynwood","x":0.9054,"y":0.6583,"capital":true},{"name":"Fogmere","x":0.9446,"y":0.5972,"capital":false},{"name":"Odrin","x":0.8946,"y":0.7083,"capital":false},{"name":"Zarakyr","x":0.8518,"y":0.5028,"capital":false}]},{"name":"Thornwick","subtitle":"Principality of Thornwick","color":"#c4b0a8","labelX":855.0,"labelY":1165.0,"cities":[{"name":"Freehold","x":0.3089,"y":0.6417,"capital":true},{"name":"Runeford","x":0.2661,"y":0.7194,"capital":false},{"name":"Duskwater","x":0.3518,"y":0.7417,"capital":false},{"name":"Millcross","x":0.3018,"y":0.7306,"capital":false}]},{"name":"Pyremarch","subtitle":"Realm of Pyremarch","color":"#a8c0b0","labelX":1945.0,"labelY":385.0,"cities":[{"name":"Silverton","x":0.7089,"y":0.2194,"capital":true},{"name":"Longmere","x":0.7411,"y":0.2083,"capital":false},{"name":"Gerenwalde","x":0.7589,"y":0.2861,"capital":false},{"name":"Gerenwalde","x":0.7339,"y":0.2028,"capital":false},{"name":"Ilaes","x":0.6982,"y":0.3194,"capital":false}]},{"name":"Cyrin","subtitle":"Duchy of Cyrin","color":"#c8c0a0","labelX":1115.0,"labelY":1515.0,"cities":[{"name":"Ashbourne","x":0.3839,"y":0.8528,"capital":true},{"name":"Palanor","x":0.4161,"y":0.8806,"capital":false},{"name":"Dremoor","x":0.4054,"y":0.7139,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Frost","Crimson Gulf","Sea of Winds","Jade Sea"]};
ATLAS_METADATA[75] = {"seed":75,"mapName":"DARKWATER","regions":[{"name":"Tarnis","subtitle":"Borderlands of Tarnis","color":"#ccc088","labelX":1215.0,"labelY":575.0,"cities":[{"name":"Ivyreach","x":0.4268,"y":0.3139,"capital":true},{"name":"Highwall","x":0.4161,"y":0.225,"capital":false},{"name":"Regnwald","x":0.4196,"y":0.2194,"capital":false}]},{"name":"Shadowfen","subtitle":"Borderlands of Shadowfen","color":"#a8b8a0","labelX":635.0,"labelY":1095.0,"cities":[{"name":"Runeford","x":0.2232,"y":0.6083,"capital":true},{"name":"Palanor","x":0.1946,"y":0.4694,"capital":false},{"name":"Gerenwalde","x":0.1661,"y":0.5694,"capital":false}]},{"name":"Korrath","subtitle":"Borderlands of Korrath","color":"#c8b490","labelX":205.0,"labelY":705.0,"cities":[{"name":"Tidefall","x":0.0589,"y":0.3806,"capital":true},{"name":"Harrowfield","x":0.0625,"y":0.4639,"capital":false},{"name":"Whitevale","x":0.0411,"y":0.4028,"capital":false},{"name":"Underbridge","x":0.0411,"y":0.2972,"capital":false}]},{"name":"Oakhaven","subtitle":"The Dominion of Oakhaven","color":"#a0b0b8","labelX":1625.0,"labelY":435.0,"cities":[{"name":"Copperside","x":0.5946,"y":0.225,"capital":true},{"name":"Elmsworth","x":0.6161,"y":0.3472,"capital":false},{"name":"Lakecrest","x":0.6875,"y":0.2472,"capital":false},{"name":"Hollowburg","x":0.5339,"y":0.2861,"capital":false}]},{"name":"Pyremarch","subtitle":"Principality of Pyremarch","color":"#b8c098","labelX":615.0,"labelY":425.0,"cities":[{"name":"Stonemere","x":0.2232,"y":0.2528,"capital":true},{"name":"Brightmoor","x":0.2625,"y":0.2417,"capital":false},{"name":"Vineyard","x":0.2268,"y":0.1861,"capital":false},{"name":"Goldug","x":0.2661,"y":0.2194,"capital":false},{"name":"Eagleford","x":0.2696,"y":0.2028,"capital":false}]},{"name":"Caeloth","subtitle":"The Wilds of Caeloth","color":"#c4b0a8","labelX":1035.0,"labelY":1395.0,"cities":[{"name":"Pinewood","x":0.3732,"y":0.7917,"capital":true},{"name":"Duskhold","x":0.3339,"y":0.7639,"capital":false},{"name":"Tidefall","x":0.4161,"y":0.775,"capital":false},{"name":"Highwall","x":0.3161,"y":0.7139,"capital":false},{"name":"Stonemere","x":0.4125,"y":0.7806,"capital":false},{"name":"Fogmere","x":0.3196,"y":0.725,"capital":false}]},{"name":"Highkeep","subtitle":"The Dominion of Highkeep","color":"#a8c0b0","labelX":1295.0,"labelY":1085.0,"cities":[{"name":"Dawnwatch","x":0.4661,"y":0.6028,"capital":true},{"name":"Thistledown","x":0.3625,"y":0.6194,"capital":false},{"name":"Yellowfen","x":0.3625,"y":0.525,"capital":false},{"name":"Dremoor","x":0.4982,"y":0.6472,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":1125.0,"labelY":1395.0},{"name":"Ashen Divide","labelX":735.0,"labelY":355.0},{"name":"Thundercrest Range","labelX":1625.0,"labelY":585.0}],"lakes":[{"name":"Lake Ponter","labelX":965.0,"labelY":703.0}],"seaNames":["Jade Sea","Sea of Dreams","Sea of Ash","Sea of Silver","Sea of Frost"]};
ATLAS_METADATA[76] = {"seed":76,"mapName":"HIGHCREST","regions":[{"name":"Ashenveil","subtitle":"Realm of Ashenveil","color":"#ccc088","labelX":995.0,"labelY":855.0,"cities":[{"name":"Borist","x":0.3696,"y":0.4806,"capital":true},{"name":"Brightmoor","x":0.4768,"y":0.4639,"capital":false},{"name":"Ashbourne","x":0.2696,"y":0.4361,"capital":false},{"name":"Ashbourne","x":0.4375,"y":0.4917,"capital":false}]},{"name":"Kharadan","subtitle":"Duchy of Kharadan","color":"#a8b8a0","labelX":1715.0,"labelY":835.0,"cities":[{"name":"Northgate","x":0.5946,"y":0.4583,"capital":true},{"name":"Ashbourne","x":0.5839,"y":0.3972,"capital":false},{"name":"Duskwater","x":0.5125,"y":0.5417,"capital":false},{"name":"Jadeston","x":0.6804,"y":0.5083,"capital":false},{"name":"Inkwell","x":0.7125,"y":0.4583,"capital":false}]},{"name":"Cyrin","subtitle":"The Free Marches of Cyrin","color":"#c8b490","labelX":2135.0,"labelY":1045.0,"cities":[{"name":"Fogmere","x":0.7554,"y":0.5806,"capital":true},{"name":"Silverton","x":0.7196,"y":0.4528,"capital":false},{"name":"Foxbury","x":0.8161,"y":0.5861,"capital":false},{"name":"Regnwald","x":0.8054,"y":0.5194,"capital":false},{"name":"Goldug","x":0.7054,"y":0.5583,"capital":false},{"name":"Brinewood","x":0.6518,"y":0.5583,"capital":false}]},{"name":"Duskveil","subtitle":"Duchy of Duskveil","color":"#a0b0b8","labelX":565.0,"labelY":1145.0,"cities":[{"name":"Dunmore","x":0.1982,"y":0.6472,"capital":true},{"name":"Feradell","x":0.2696,"y":0.5694,"capital":false},{"name":"Pebblecreek","x":0.1839,"y":0.7139,"capital":false},{"name":"Feradell","x":0.2946,"y":0.6583,"capital":false}]},{"name":"Stormvale","subtitle":"Kingdom of Stormvale","color":"#b8c098","labelX":1535.0,"labelY":1315.0,"cities":[{"name":"Oakmere","x":0.5625,"y":0.725,"capital":true},{"name":"Moonshadow","x":0.5554,"y":0.6139,"capital":false},{"name":"Alderhaven","x":0.6125,"y":0.7361,"capital":false},{"name":"Goldug","x":0.5696,"y":0.7806,"capital":false},{"name":"Blackrock","x":0.5054,"y":0.6028,"capital":false},{"name":"Zenithburg","x":0.5054,"y":0.7083,"capital":false}]},{"name":"Dravina","subtitle":"Duchy of Dravina","color":"#c4b0a8","labelX":955.0,"labelY":1325.0,"cities":[{"name":"Kronham","x":0.3589,"y":0.725,"capital":true},{"name":"Kettlebrook","x":0.3018,"y":0.6528,"capital":false},{"name":"Brinewood","x":0.4589,"y":0.7417,"capital":false},{"name":"Cliffhaven","x":0.3411,"y":0.7694,"capital":false},{"name":"Redthorn","x":0.3304,"y":0.7806,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Dreams","Sea of Frost","Sea of Twilight","Jade Sea","Sea of Storms"]};
ATLAS_METADATA[77] = {"seed":77,"mapName":"WILLOWMERE","regions":[{"name":"Theanas","subtitle":"Duchy of Theanas","color":"#ccc088","labelX":2045.0,"labelY":1085.0,"cities":[{"name":"Beowick","x":0.7268,"y":0.6139,"capital":true},{"name":"Ashwick","x":0.7232,"y":0.5583,"capital":false},{"name":"Kettlebrook","x":0.8232,"y":0.5917,"capital":false},{"name":"Maplecross","x":0.7946,"y":0.6083,"capital":false},{"name":"Foxbury","x":0.5875,"y":0.5861,"capital":false}]},{"name":"Cyrin","subtitle":"Borderlands of Cyrin","color":"#a8b8a0","labelX":2035.0,"labelY":645.0,"cities":[{"name":"Harrowfield","x":0.7411,"y":0.3639,"capital":true},{"name":"Eagleford","x":0.8125,"y":0.3361,"capital":false},{"name":"Westmarch","x":0.8018,"y":0.4194,"capital":false}]},{"name":"Goleli","subtitle":"Kingdom of Goleli","color":"#c8b490","labelX":725.0,"labelY":1145.0,"cities":[{"name":"Zarakyr","x":0.2732,"y":0.625,"capital":true},{"name":"Quartzridge","x":0.2518,"y":0.6694,"capital":false},{"name":"Nighthollow","x":0.2161,"y":0.6417,"capital":false}]},{"name":"Evershade","subtitle":"Principality of Evershade","color":"#a0b0b8","labelX":145.0,"labelY":1075.0,"cities":[{"name":"Junipervale","x":0.0411,"y":0.6083,"capital":true},{"name":"Moonshadow","x":0.0411,"y":0.5194,"capital":false},{"name":"Highwall","x":0.0732,"y":0.6528,"capital":false},{"name":"Stonemere","x":0.0411,"y":0.625,"capital":false}]},{"name":"Elonia","subtitle":"The Free Marches of Elonia","color":"#b8c098","labelX":2545.0,"labelY":985.0,"cities":[{"name":"Thornwall","x":0.9125,"y":0.5528,"capital":true},{"name":"Pebblecreek","x":0.9589,"y":0.525,"capital":false},{"name":"Vineyard","x":0.8661,"y":0.5694,"capital":false},{"name":"Tidefall","x":0.8911,"y":0.5028,"capital":false},{"name":"Greywater","x":0.9589,"y":0.4361,"capital":false}]},{"name":"Solwynd","subtitle":"Borderlands of Solwynd","color":"#c4b0a8","labelX":1325.0,"labelY":745.0,"cities":[{"name":"Thistledown","x":0.4804,"y":0.4083,"capital":true},{"name":"Thornwall","x":0.6054,"y":0.4083,"capital":false},{"name":"Palanor","x":0.4161,"y":0.4917,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Silver","Sea of Frost","Sea of Embers","Sea of Storms"]};
ATLAS_METADATA[78] = {"seed":78,"mapName":"THUNDERCRAG","regions":[{"name":"Windmere","subtitle":"Kingdom of Windmere","color":"#ccc088","labelX":1625.0,"labelY":755.0,"cities":[{"name":"Blackrock","x":0.5768,"y":0.4083,"capital":true},{"name":"Freehold","x":0.6304,"y":0.5306,"capital":false},{"name":"Valewick","x":0.6804,"y":0.3806,"capital":false}]},{"name":"Goleli","subtitle":"The Free Marches of Goleli","color":"#a8b8a0","labelX":1165.0,"labelY":1225.0,"cities":[{"name":"Dremoor","x":0.4339,"y":0.675,"capital":true},{"name":"Urswick","x":0.3982,"y":0.6528,"capital":false},{"name":"Northgate","x":0.4054,"y":0.7194,"capital":false}]},{"name":"Shadowfen","subtitle":"Duchy of Shadowfen","color":"#c8b490","labelX":2035.0,"labelY":475.0,"cities":[{"name":"Stormgate","x":0.7268,"y":0.2639,"capital":true},{"name":"Brightmoor","x":0.7339,"y":0.2194,"capital":false},{"name":"Lindel","x":0.6518,"y":0.2806,"capital":false},{"name":"Duskhold","x":0.6804,"y":0.3361,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Sea of Frost","Sea of Twilight","Sea of Ash","Pale Sea"]};
ATLAS_METADATA[79] = {"seed":79,"mapName":"ASHENSPIRE","regions":[{"name":"Korrath","subtitle":"Principality of Korrath","color":"#ccc088","labelX":2385.0,"labelY":895.0,"cities":[{"name":"Dawnwatch","x":0.8518,"y":0.5194,"capital":false},{"name":"Vineyard","x":0.8054,"y":0.4694,"capital":false},{"name":"Regnwald","x":0.8339,"y":0.525,"capital":false},{"name":"Odrin","x":0.8875,"y":0.4972,"capital":false},{"name":"Inkwell","x":0.8518,"y":0.5139,"capital":true},{"name":"Cliffhaven","x":0.7982,"y":0.625,"capital":false}]},{"name":"Pinecrest","subtitle":"Principality of Pinecrest","color":"#a8b8a0","labelX":1265.0,"labelY":995.0,"cities":[{"name":"Redthorn","x":0.4554,"y":0.5417,"capital":true},{"name":"Cinderfell","x":0.4161,"y":0.5194,"capital":false}]},{"name":"Ironglenn","subtitle":"Realm of Ironglenn","color":"#c8b490","labelX":1645.0,"labelY":1435.0,"cities":[{"name":"Goldenleaf","x":0.5768,"y":0.7917,"capital":true},{"name":"Greywater","x":0.6196,"y":0.675,"capital":false},{"name":"Rynwood","x":0.4625,"y":0.7528,"capital":false}]},{"name":"Thornemark","subtitle":"The Wilds of Thornemark","color":"#a0b0b8","labelX":495.0,"labelY":975.0,"cities":[{"name":"Inkwell","x":0.1696,"y":0.525,"capital":true},{"name":"Fogmere","x":0.0625,"y":0.5861,"capital":false},{"name":"Loyarn","x":0.2089,"y":0.4361,"capital":false}]},{"name":"Sunmere","subtitle":"The Dominion of Sunmere","color":"#b8c098","labelX":1755.0,"labelY":425.0,"cities":[{"name":"Loyarn","x":0.6411,"y":0.2139,"capital":true},{"name":"Alderhaven","x":0.5875,"y":0.1861,"capital":false},{"name":"Gildafell","x":0.7089,"y":0.2861,"capital":false},{"name":"Longmere","x":0.6054,"y":0.2806,"capital":false},{"name":"Gildafell","x":0.5446,"y":0.225,"capital":false}]},{"name":"Thornwick","subtitle":"The Wilds of Thornwick","color":"#c4b0a8","labelX":625.0,"labelY":1375.0,"cities":[{"name":"Fernhollow","x":0.2339,"y":0.7694,"capital":true},{"name":"Highwall","x":0.2804,"y":0.6861,"capital":false},{"name":"Pebblecreek","x":0.2804,"y":0.8361,"capital":false}]},{"name":"Ashenveil","subtitle":"The Free Marches of Ashenveil","color":"#a8c0b0","labelX":1755.0,"labelY":915.0,"cities":[{"name":"Loyarn","x":0.6268,"y":0.5639,"capital":false},{"name":"Thebury","x":0.5661,"y":0.5139,"capital":false},{"name":"Inkwell","x":0.6661,"y":0.5139,"capital":false},{"name":"Ivyreach","x":0.6304,"y":0.5194,"capital":true},{"name":"Runeford","x":0.6768,"y":0.475,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":1235.0,"labelY":1295.0},{"name":"Ebonwall Mountains","labelX":2565.0,"labelY":555.0},{"name":"Thundercrest Range","labelX":1545.0,"labelY":955.0},{"name":"Dragon's Spine","labelX":1245.0,"labelY":1035.0}],"lakes":[{"name":"Lunmere","labelX":625.0,"labelY":1103.0}],"seaNames":["Sea of Winds","Sea of Silver","Sea of Embers","Sea of Dreams","Sea of Storms"]};
ATLAS_METADATA[80] = {"seed":80,"mapName":"CRIMSONVALE","regions":[{"name":"Dawnhollow","subtitle":"The Dominion of Dawnhollow","color":"#ccc088","labelX":1035.0,"labelY":775.0,"cities":[{"name":"Eagleford","x":0.3732,"y":0.4361,"capital":true},{"name":"Rynwood","x":0.4232,"y":0.5083,"capital":false},{"name":"Westmarch","x":0.3268,"y":0.425,"capital":false},{"name":"Copperside","x":0.4661,"y":0.4139,"capital":false},{"name":"Copperside","x":0.4125,"y":0.5417,"capital":false}]},{"name":"Valdheim","subtitle":"Duchy of Valdheim","color":"#a8b8a0","labelX":1305.0,"labelY":1245.0,"cities":[{"name":"Feradell","x":0.4554,"y":0.7028,"capital":true},{"name":"Alderhaven","x":0.4054,"y":0.7528,"capital":false},{"name":"Gerenwalde","x":0.5732,"y":0.675,"capital":false},{"name":"Moonshadow","x":0.5732,"y":0.7194,"capital":false},{"name":"Cinderfell","x":0.3732,"y":0.7139,"capital":false},{"name":"Ashbourne","x":0.4911,"y":0.5972,"capital":false}]},{"name":"Goleli","subtitle":"Realm of Goleli","color":"#c8b490","labelX":2075.0,"labelY":1015.0,"cities":[{"name":"Moonshadow","x":0.7232,"y":0.5472,"capital":true},{"name":"Runeford","x":0.7946,"y":0.6528,"capital":false},{"name":"Brinewood","x":0.7446,"y":0.5583,"capital":false}]},{"name":"Pinecrest","subtitle":"Realm of Pinecrest","color":"#a0b0b8","labelX":815.0,"labelY":1375.0,"cities":[{"name":"Oakmere","x":0.2946,"y":0.7694,"capital":true},{"name":"Kingsbridge","x":0.3196,"y":0.8028,"capital":false},{"name":"Harrowfield","x":0.2625,"y":0.7528,"capital":false}]},{"name":"Ondara","subtitle":"Duchy of Ondara","color":"#b8c098","labelX":605.0,"labelY":935.0,"cities":[{"name":"Greywater","x":0.2054,"y":0.525,"capital":true},{"name":"Regnwald","x":0.1946,"y":0.6528,"capital":false},{"name":"Brinewood","x":0.2196,"y":0.6028,"capital":false},{"name":"Junipervale","x":0.2839,"y":0.4917,"capital":false},{"name":"Gerenwalde","x":0.3446,"y":0.525,"capital":false}]},{"name":"Thornemark","subtitle":"Duchy of Thornemark","color":"#c4b0a8","labelX":1815.0,"labelY":1415.0,"cities":[{"name":"Rynwood","x":0.6554,"y":0.7972,"capital":true},{"name":"Gildafell","x":0.7518,"y":0.8028,"capital":false},{"name":"Odrin","x":0.5518,"y":0.7861,"capital":false},{"name":"Beowick","x":0.7089,"y":0.8028,"capital":false},{"name":"Northgate","x":0.6446,"y":0.7417,"capital":false}]},{"name":"Caeloth","subtitle":"The Dominion of Caeloth","color":"#a8c0b0","labelX":1495.0,"labelY":825.0,"cities":[{"name":"Lawklif","x":0.5232,"y":0.475,"capital":true}]}],"mountains":[{"name":"Dragon's Spine","labelX":1771.5,"labelY":507.1},{"name":"Ebonwall Mountains","labelX":1095.0,"labelY":775.0},{"name":"Stormcrown Range","labelX":545.0,"labelY":1175.0},{"name":"Ironspine Range","labelX":1595.0,"labelY":1165.0}],"lakes":[],"seaNames":["Pale Sea","Sea of Embers","Sea of Frost","Sea of Silver","Crimson Gulf"]};
ATLAS_METADATA[81] = {"seed":81,"mapName":"IRONMARCH","regions":[{"name":"Pinecrest","subtitle":"The Dominion of Pinecrest","color":"#ccc088","labelX":865.0,"labelY":1035.0,"cities":[{"name":"Thistledown","x":0.3232,"y":0.5917,"capital":true},{"name":"Odrin","x":0.3196,"y":0.6472,"capital":false},{"name":"Oldbridge","x":0.3018,"y":0.7194,"capital":false},{"name":"Quartzridge","x":0.4018,"y":0.6083,"capital":false},{"name":"Millcross","x":0.3518,"y":0.525,"capital":false},{"name":"Alderhaven","x":0.4196,"y":0.625,"capital":false}]},{"name":"Tethys","subtitle":"Realm of Tethys","color":"#a8b8a0","labelX":2165.0,"labelY":745.0,"cities":[{"name":"Redthorn","x":0.7768,"y":0.4028,"capital":true},{"name":"Ravenmere","x":0.7589,"y":0.3417,"capital":false},{"name":"Lindel","x":0.7982,"y":0.3306,"capital":false},{"name":"Longmere","x":0.8589,"y":0.3639,"capital":false}]},{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#c8b490","labelX":1025.0,"labelY":235.0,"cities":[{"name":"Foxbury","x":0.3625,"y":0.1306,"capital":true},{"name":"Hollowburg","x":0.2696,"y":0.1083,"capital":false},{"name":"Pinewood","x":0.4446,"y":0.0806,"capital":false},{"name":"Stormgate","x":0.2804,"y":0.2361,"capital":false},{"name":"Stonemere","x":0.3732,"y":0.0639,"capital":false},{"name":"Westmarch","x":0.2732,"y":0.1528,"capital":false}]},{"name":"Aethermoor","subtitle":"Duchy of Aethermoor","color":"#a0b0b8","labelX":375.0,"labelY":665.0,"cities":[{"name":"Fogmere","x":0.1339,"y":0.3583,"capital":true},{"name":"Lakecrest","x":0.0661,"y":0.3417,"capital":false},{"name":"Tidefall","x":0.0446,"y":0.3139,"capital":false},{"name":"Yellowfen","x":0.0804,"y":0.3528,"capital":false}]},{"name":"Elonia","subtitle":"The Free Marches of Elonia","color":"#b8c098","labelX":535.0,"labelY":1255.0,"cities":[{"name":"Windcrest","x":0.1768,"y":0.7139,"capital":true},{"name":"Borist","x":0.2161,"y":0.6028,"capital":false},{"name":"Fogmere","x":0.1411,"y":0.6639,"capital":false}]},{"name":"Dawnhollow","subtitle":"The Wilds of Dawnhollow","color":"#c4b0a8","labelX":2035.0,"labelY":1135.0,"cities":[{"name":"Windcrest","x":0.7232,"y":0.6361,"capital":true},{"name":"Knolltown","x":0.6875,"y":0.6972,"capital":false},{"name":"Inkwell","x":0.6304,"y":0.625,"capital":false},{"name":"Ashwick","x":0.6482,"y":0.6639,"capital":false}]},{"name":"Stormvale","subtitle":"Borderlands of Stormvale","color":"#a8c0b0","labelX":1545.0,"labelY":335.0,"cities":[{"name":"Whitevale","x":0.5696,"y":0.1694,"capital":true},{"name":"Thistledown","x":0.4696,"y":0.1083,"capital":false},{"name":"Regnwald","x":0.6839,"y":0.1528,"capital":false},{"name":"Nighthollow","x":0.6411,"y":0.2083,"capital":false},{"name":"Knolltown","x":0.5589,"y":0.1194,"capital":false}]},{"name":"Frosthold","subtitle":"Kingdom of Frosthold","color":"#c8c0a0","labelX":1565.0,"labelY":1225.0,"cities":[{"name":"Deepwatch","x":0.5661,"y":0.6861,"capital":true},{"name":"Greywater","x":0.4589,"y":0.6194,"capital":false},{"name":"Redthorn","x":0.4446,"y":0.7139,"capital":false},{"name":"Tidefall","x":0.5196,"y":0.6194,"capital":false},{"name":"Whitevale","x":0.4268,"y":0.6694,"capital":false},{"name":"Whitevale","x":0.5875,"y":0.5472,"capital":false}]}],"mountains":[{"name":"Stormcrown Range","labelX":1255.0,"labelY":285.0},{"name":"Thundercrest Range","labelX":1735.0,"labelY":525.0},{"name":"Silvervein Ridge","labelX":2155.0,"labelY":715.0},{"name":"Ebonwall Mountains","labelX":1945.0,"labelY":275.0}],"lakes":[{"name":"Shadowmere","labelX":755.0,"labelY":643.0},{"name":"Lake Aegir","labelX":1145.0,"labelY":883.0}],"seaNames":["Sea of Embers","Pale Sea","Sea of Storms","Sea of Winds","Sea of Silver"]};
ATLAS_METADATA[82] = {"seed":82,"mapName":"ELDERGROVE","regions":[{"name":"Lakeshore","subtitle":"Principality of Lakeshore","color":"#ccc088","labelX":185.0,"labelY":825.0,"cities":[{"name":"Yellowfen","x":0.0768,"y":0.475,"capital":true},{"name":"Millcross","x":0.1589,"y":0.4583,"capital":false},{"name":"Stormgate","x":0.0732,"y":0.5917,"capital":false}]},{"name":"Duskveil","subtitle":"The Dominion of Duskveil","color":"#a8b8a0","labelX":1975.0,"labelY":755.0,"cities":[{"name":"Dunmore","x":0.7161,"y":0.4139,"capital":true},{"name":"Kronham","x":0.6661,"y":0.4083,"capital":false},{"name":"Loyarn","x":0.7411,"y":0.3194,"capital":false},{"name":"Redthorn","x":0.7375,"y":0.5083,"capital":false},{"name":"Whitevale","x":0.7696,"y":0.2917,"capital":false}]},{"name":"Verdantia","subtitle":"Realm of Verdantia","color":"#c8b490","labelX":1345.0,"labelY":515.0,"cities":[{"name":"Greywater","x":0.4804,"y":0.2861,"capital":true},{"name":"Stonemere","x":0.5446,"y":0.3528,"capital":false},{"name":"Blackrock","x":0.5411,"y":0.3361,"capital":false},{"name":"Quartzridge","x":0.5054,"y":0.2528,"capital":false},{"name":"Brightmoor","x":0.5411,"y":0.3472,"capital":false},{"name":"Feradell","x":0.3982,"y":0.2806,"capital":false}]},{"name":"Stormvale","subtitle":"The Dominion of Stormvale","color":"#a0b0b8","labelX":1535.0,"labelY":1105.0,"cities":[{"name":"Thistledown","x":0.5268,"y":0.6083,"capital":true},{"name":"Quartzridge","x":0.5911,"y":0.7083,"capital":false},{"name":"Stormgate","x":0.5446,"y":0.6861,"capital":false},{"name":"Anora","x":0.4804,"y":0.625,"capital":false},{"name":"Goldug","x":0.5661,"y":0.6139,"capital":false},{"name":"Thornwall","x":0.5661,"y":0.6083,"capital":false}]},{"name":"Silverfen","subtitle":"Realm of Silverfen","color":"#b8c098","labelX":2425.0,"labelY":615.0,"cities":[{"name":"Ravenmere","x":0.8804,"y":0.3306,"capital":true},{"name":"Highwall","x":0.8482,"y":0.3694,"capital":false}]},{"name":"Kharadan","subtitle":"Realm of Kharadan","color":"#c4b0a8","labelX":755.0,"labelY":985.0,"cities":[{"name":"Kettlebrook","x":0.2875,"y":0.5361,"capital":true},{"name":"Ashwick","x":0.2446,"y":0.5028,"capital":false},{"name":"Oakmere","x":0.3446,"y":0.6306,"capital":false},{"name":"Jadeston","x":0.3268,"y":0.475,"capital":false}]}],"mountains":[{"name":"Ebonwall Mountains","labelX":1705.0,"labelY":1315.0},{"name":"Greymist Heights","labelX":1355.0,"labelY":435.0},{"name":"Ashen Divide","labelX":2215.0,"labelY":965.0},{"name":"Thundercrest Range","labelX":1145.0,"labelY":505.0}],"lakes":[],"seaNames":["Sea of Embers","Sea of Storms","Pale Sea","Sea of Winds","Sea of Twilight"]};
ATLAS_METADATA[83] = {"seed":83,"mapName":"STORMBORN","regions":[{"name":"Iskarion","subtitle":"Kingdom of Iskarion","color":"#ccc088","labelX":1255.0,"labelY":1005.0,"cities":[{"name":"Stonemere","x":0.4304,"y":0.5472,"capital":true},{"name":"Greenhollow","x":0.3625,"y":0.5472,"capital":false},{"name":"Tidefall","x":0.3625,"y":0.5361,"capital":false},{"name":"Kingsbridge","x":0.3911,"y":0.5028,"capital":false}]},{"name":"Ashenveil","subtitle":"Realm of Ashenveil","color":"#a8b8a0","labelX":1685.0,"labelY":1275.0,"cities":[{"name":"Yellowfen","x":0.5911,"y":0.7194,"capital":true},{"name":"Greenhollow","x":0.5768,"y":0.6417,"capital":false},{"name":"Ivyreach","x":0.5339,"y":0.6972,"capital":false},{"name":"Deepwatch","x":0.4982,"y":0.7139,"capital":false},{"name":"Lakecrest","x":0.5375,"y":0.725,"capital":false}]},{"name":"Ashmark","subtitle":"The Dominion of Ashmark","color":"#c8b490","labelX":1225.0,"labelY":315.0,"cities":[{"name":"Wydale","x":0.4268,"y":0.1861,"capital":true},{"name":"Oldbridge","x":0.4911,"y":0.2583,"capital":false},{"name":"Dawnwatch","x":0.4089,"y":0.1194,"capital":false}]},{"name":"Belros","subtitle":"The Dominion of Belros","color":"#a0b0b8","labelX":745.0,"labelY":675.0,"cities":[{"name":"Lindel","x":0.2625,"y":0.3583,"capital":true},{"name":"Foxbury","x":0.3196,"y":0.4417,"capital":false},{"name":"Oldbridge","x":0.3339,"y":0.4861,"capital":false},{"name":"Hollowburg","x":0.3161,"y":0.2472,"capital":false}]},{"name":"Dremora","subtitle":"The Free Marches of Dremora","color":"#b8c098","labelX":2135.0,"labelY":1045.0,"cities":[{"name":"Borist","x":0.7696,"y":0.5861,"capital":true},{"name":"Inkwell","x":0.8232,"y":0.5861,"capital":false},{"name":"Millcross","x":0.7804,"y":0.6472,"capital":false}]},{"name":"Thornwick","subtitle":"Kingdom of Thornwick","color":"#c4b0a8","labelX":745.0,"labelY":1175.0,"cities":[{"name":"Ashbourne","x":0.2804,"y":0.6583,"capital":true},{"name":"Moonshadow","x":0.2304,"y":0.625,"capital":false},{"name":"Gildafell","x":0.3125,"y":0.6083,"capital":false},{"name":"Moonshadow","x":0.2089,"y":0.6639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Twilight","Pale Sea","Jade Sea","Sea of Frost","Sea of Embers"]};
ATLAS_METADATA[84] = {"seed":84,"mapName":"DUSTHAVEN","regions":[{"name":"Korrath","subtitle":"The Wilds of Korrath","color":"#ccc088","labelX":305.0,"labelY":1155.0,"cities":[{"name":"Westmarch","x":0.1125,"y":0.6417,"capital":true},{"name":"Thistledown","x":0.0839,"y":0.7028,"capital":false},{"name":"Thistledown","x":0.0661,"y":0.5972,"capital":false}]},{"name":"Kelvor","subtitle":"Realm of Kelvor","color":"#a8b8a0","labelX":1925.0,"labelY":715.0,"cities":[{"name":"Runeford","x":0.6804,"y":0.3917,"capital":true},{"name":"Junipervale","x":0.5946,"y":0.3472,"capital":false},{"name":"Yewborough","x":0.8054,"y":0.4639,"capital":false},{"name":"Kettlebrook","x":0.6018,"y":0.3028,"capital":false},{"name":"Brinewood","x":0.6911,"y":0.4472,"capital":false},{"name":"Kettlebrook","x":0.6375,"y":0.3583,"capital":false}]},{"name":"Caeloth","subtitle":"Principality of Caeloth","color":"#c8b490","labelX":1565.0,"labelY":1005.0,"cities":[{"name":"Lakecrest","x":0.5554,"y":0.5417,"capital":true},{"name":"Fogmere","x":0.5982,"y":0.4917,"capital":false},{"name":"Inkwell","x":0.5196,"y":0.6083,"capital":false},{"name":"Odrin","x":0.6304,"y":0.4917,"capital":false},{"name":"Cinderfell","x":0.5196,"y":0.6028,"capital":false}]},{"name":"Brynmar","subtitle":"Kingdom of Brynmar","color":"#a0b0b8","labelX":1045.0,"labelY":1015.0,"cities":[{"name":"Tidefall","x":0.3554,"y":0.5528,"capital":true},{"name":"Dremoor","x":0.3196,"y":0.4694,"capital":false},{"name":"Blackrock","x":0.3018,"y":0.5306,"capital":false},{"name":"Ashbourne","x":0.3732,"y":0.4917,"capital":false},{"name":"Ravenmere","x":0.3018,"y":0.6417,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Twilight","Sea of Storms","Sea of Embers","Sea of Ash","Pale Sea"]};
ATLAS_METADATA[85] = {"seed":85,"mapName":"MOONFALL","regions":[{"name":"Ondara","subtitle":"Realm of Ondara","color":"#ccc088","labelX":2165.0,"labelY":985.0,"cities":[{"name":"Goldenleaf","x":0.7589,"y":0.5583,"capital":true},{"name":"Nighthollow","x":0.7125,"y":0.4917,"capital":false},{"name":"Loyarn","x":0.7625,"y":0.4139,"capital":false}]},{"name":"Thornwick","subtitle":"Duchy of Thornwick","color":"#a8b8a0","labelX":1255.0,"labelY":565.0,"cities":[{"name":"Redthorn","x":0.4625,"y":0.3139,"capital":true},{"name":"Moonshadow","x":0.3839,"y":0.275,"capital":false},{"name":"Silverton","x":0.5268,"y":0.4194,"capital":false},{"name":"Ashbourne","x":0.4482,"y":0.275,"capital":false}]},{"name":"Aelindor","subtitle":"Kingdom of Aelindor","color":"#c8b490","labelX":1445.0,"labelY":1145.0,"cities":[{"name":"Knolltown","x":0.5054,"y":0.625,"capital":true},{"name":"Feradell","x":0.5196,"y":0.5583,"capital":false},{"name":"Inkwell","x":0.3839,"y":0.6139,"capital":false},{"name":"Oakmere","x":0.4768,"y":0.575,"capital":false}]},{"name":"Wyndell","subtitle":"Borderlands of Wyndell","color":"#a0b0b8","labelX":505.0,"labelY":565.0,"cities":[{"name":"Fogmere","x":0.1661,"y":0.3139,"capital":true},{"name":"Duskhold","x":0.1411,"y":0.375,"capital":false},{"name":"Hollowburg","x":0.1054,"y":0.3528,"capital":false},{"name":"Northgate","x":0.1518,"y":0.2306,"capital":false}]},{"name":"Solwynd","subtitle":"The Dominion of Solwynd","color":"#b8c098","labelX":2645.0,"labelY":605.0,"cities":[{"name":"Zarakyr","x":0.9339,"y":0.3361,"capital":true},{"name":"Borist","x":0.8375,"y":0.3361,"capital":false},{"name":"Gerenwalde","x":0.8589,"y":0.3361,"capital":false},{"name":"Blackrock","x":0.8446,"y":0.3361,"capital":false}]},{"name":"Shadowfen","subtitle":"Duchy of Shadowfen","color":"#c4b0a8","labelX":805.0,"labelY":1025.0,"cities":[{"name":"Dremoor","x":0.2804,"y":0.5583,"capital":true},{"name":"Nighthollow","x":0.3411,"y":0.5806,"capital":false},{"name":"Zarakyr","x":0.2946,"y":0.5028,"capital":false},{"name":"Ivyreach","x":0.3411,"y":0.475,"capital":false},{"name":"Underbridge","x":0.3661,"y":0.575,"capital":false},{"name":"Gildafell","x":0.1911,"y":0.4639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Sea of Frost","Sea of Dreams","Iron Sea","Sea of Embers"]};
ATLAS_METADATA[86] = {"seed":86,"mapName":"DREADMIRE","regions":[{"name":"Shadowfen","subtitle":"Principality of Shadowfen","color":"#ccc088","labelX":1515.0,"labelY":795.0,"cities":[{"name":"Copperside","x":0.5518,"y":0.4472,"capital":true},{"name":"Greenhollow","x":0.5696,"y":0.5083,"capital":false},{"name":"Valewick","x":0.5446,"y":0.3861,"capital":false},{"name":"Ashwick","x":0.5161,"y":0.5139,"capital":false}]},{"name":"Valdheim","subtitle":"Kingdom of Valdheim","color":"#a8b8a0","labelX":2555.0,"labelY":575.0,"cities":[{"name":"Millcross","x":0.8982,"y":0.3139,"capital":true},{"name":"Brinewood","x":0.8911,"y":0.3806,"capital":false},{"name":"Quartzridge","x":0.9554,"y":0.2917,"capital":false},{"name":"Thebury","x":0.7946,"y":0.3528,"capital":false},{"name":"Whitevale","x":0.8089,"y":0.3583,"capital":false}]},{"name":"Iskarion","subtitle":"The Wilds of Iskarion","color":"#c8b490","labelX":885.0,"labelY":805.0,"cities":[{"name":"Ashwick","x":0.3161,"y":0.4417,"capital":true},{"name":"Knolltown","x":0.3232,"y":0.4361,"capital":false},{"name":"Feradell","x":0.4018,"y":0.4639,"capital":false}]},{"name":"Belros","subtitle":"The Wilds of Belros","color":"#a0b0b8","labelX":495.0,"labelY":1065.0,"cities":[{"name":"Ashwick","x":0.1625,"y":0.575,"capital":true},{"name":"Northgate","x":0.2375,"y":0.5694,"capital":false},{"name":"Rynwood","x":0.2018,"y":0.6194,"capital":false}]},{"name":"Galanthia","subtitle":"The Wilds of Galanthia","color":"#b8c098","labelX":2045.0,"labelY":1005.0,"cities":[{"name":"Feradell","x":0.7268,"y":0.5472,"capital":true},{"name":"Wydale","x":0.7304,"y":0.5583,"capital":false},{"name":"Inkwell","x":0.8339,"y":0.5028,"capital":false},{"name":"Alderhaven","x":0.7589,"y":0.5694,"capital":false},{"name":"Foxbury","x":0.6911,"y":0.5528,"capital":false}]},{"name":"Wyndell","subtitle":"Borderlands of Wyndell","color":"#c4b0a8","labelX":2025.0,"labelY":435.0,"cities":[{"name":"Ravenmere","x":0.7339,"y":0.2472,"capital":true},{"name":"Jadeston","x":0.7339,"y":0.3528,"capital":false},{"name":"Gildafell","x":0.7339,"y":0.3972,"capital":false}]},{"name":"Aethermoor","subtitle":"The Dominion of Aethermoor","color":"#a8c0b0","labelX":925.0,"labelY":1305.0,"cities":[{"name":"Cliffhaven","x":0.3304,"y":0.725,"capital":true},{"name":"Jadeston","x":0.3911,"y":0.6528,"capital":false},{"name":"Ashbourne","x":0.2625,"y":0.6861,"capital":false},{"name":"Ravenmere","x":0.2875,"y":0.6806,"capital":false}]},{"name":"Dremora","subtitle":"The Free Marches of Dremora","color":"#c8c0a0","labelX":1555.0,"labelY":405.0,"cities":[{"name":"Highwall","x":0.5732,"y":0.2139,"capital":true},{"name":"Silverton","x":0.6625,"y":0.2139,"capital":false},{"name":"Zarakyr","x":0.5554,"y":0.1806,"capital":false},{"name":"Odrin","x":0.6054,"y":0.2639,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Jade Sea","Crimson Gulf","Iron Sea","Pale Sea","Sea of Storms"]};
ATLAS_METADATA[87] = {"seed":87,"mapName":"GOLDENCREST","regions":[{"name":"Evershade","subtitle":"Kingdom of Evershade","color":"#ccc088","labelX":1415.0,"labelY":1295.0,"cities":[{"name":"Foxbury","x":0.5125,"y":0.7028,"capital":true},{"name":"Freehold","x":0.5232,"y":0.6472,"capital":false},{"name":"Deepwatch","x":0.5018,"y":0.6528,"capital":false},{"name":"Cinderfell","x":0.5625,"y":0.7694,"capital":false}]},{"name":"Ondara","subtitle":"Kingdom of Ondara","color":"#a8b8a0","labelX":2285.0,"labelY":1405.0,"cities":[{"name":"Zarakyr","x":0.8125,"y":0.775,"capital":true},{"name":"Underbridge","x":0.9054,"y":0.775,"capital":false},{"name":"Vineyard","x":0.7518,"y":0.825,"capital":false},{"name":"Northgate","x":0.7625,"y":0.7194,"capital":false},{"name":"Lakecrest","x":0.8589,"y":0.8083,"capital":false},{"name":"Wydale","x":0.7304,"y":0.8194,"capital":false}]},{"name":"Vornhelm","subtitle":"Principality of Vornhelm","color":"#c8b490","labelX":1105.0,"labelY":905.0,"cities":[{"name":"Harrowfield","x":0.4089,"y":0.5139,"capital":true},{"name":"Pinewood","x":0.3625,"y":0.5472,"capital":false},{"name":"Alderhaven","x":0.4018,"y":0.3972,"capital":false},{"name":"Anora","x":0.3804,"y":0.5694,"capital":false},{"name":"Brinewood","x":0.3768,"y":0.6028,"capital":false}]},{"name":"Theanas","subtitle":"Kingdom of Theanas","color":"#a0b0b8","labelX":1885.0,"labelY":1385.0,"cities":[{"name":"Freehold","x":0.6589,"y":0.7583,"capital":true},{"name":"Stormgate","x":0.7232,"y":0.7528,"capital":false},{"name":"Cinderfell","x":0.6696,"y":0.8194,"capital":false},{"name":"Thistledown","x":0.7339,"y":0.8194,"capital":false},{"name":"Ilaes","x":0.7125,"y":0.6528,"capital":false}]},{"name":"Brynmar","subtitle":"Borderlands of Brynmar","color":"#b8c098","labelX":1795.0,"labelY":885.0,"cities":[{"name":"Vineyard","x":0.6304,"y":0.4972,"capital":true},{"name":"Quartzridge","x":0.6482,"y":0.5806,"capital":false},{"name":"Silverton","x":0.6196,"y":0.4083,"capital":false},{"name":"Lake Varos","x":0.5339,"y":0.4528,"capital":false}]},{"name":"Windmere","subtitle":"Principality of Windmere","color":"#c4b0a8","labelX":2655.0,"labelY":1115.0,"cities":[{"name":"Deepwatch","x":0.9339,"y":0.6083,"capital":true},{"name":"Dremoor","x":0.9589,"y":0.675,"capital":false},{"name":"Westmarch","x":0.8911,"y":0.675,"capital":false}]}],"mountains":[{"name":"Silvervein Ridge","labelX":1765.0,"labelY":655.0},{"name":"Stormcrown Range","labelX":1525.0,"labelY":1005.0},{"name":"Ironspine Range","labelX":1885.0,"labelY":1125.0}],"lakes":[{"name":"Lake Varos","labelX":1655.0,"labelY":863.0}],"seaNames":["Iron Sea","Jade Sea","Sea of Dreams","Sea of Ash","Sea of Embers"]};
ATLAS_METADATA[88] = {"seed":88,"mapName":"WYVERNHOLDE","regions":[{"name":"Korrath","subtitle":"The Wilds of Korrath","color":"#ccc088","labelX":2635.0,"labelY":535.0,"cities":[{"name":"Knolltown","x":0.9232,"y":0.3139,"capital":true},{"name":"Yewborough","x":0.8554,"y":0.325,"capital":false},{"name":"Nighthollow","x":0.9554,"y":0.2806,"capital":false},{"name":"Blackrock","x":0.9554,"y":0.2917,"capital":false},{"name":"Dawnwatch","x":0.8768,"y":0.225,"capital":false}]},{"name":"Pinecrest","subtitle":"Kingdom of Pinecrest","color":"#a8b8a0","labelX":1115.0,"labelY":1195.0,"cities":[{"name":"Maplecross","x":0.4161,"y":0.6694,"capital":true},{"name":"Eagleford","x":0.3946,"y":0.7139,"capital":false},{"name":"Dremoor","x":0.3375,"y":0.625,"capital":false},{"name":"Urswick","x":0.5339,"y":0.6583,"capital":false}]},{"name":"Ironglenn","subtitle":"Realm of Ironglenn","color":"#c8b490","labelX":1495.0,"labelY":855.0,"cities":[{"name":"Gerenwalde","x":0.5482,"y":0.4861,"capital":true},{"name":"Eagleford","x":0.5839,"y":0.5639,"capital":false},{"name":"Moonshadow","x":0.5839,"y":0.6028,"capital":false},{"name":"Kronham","x":0.5054,"y":0.525,"capital":false},{"name":"Underbridge","x":0.6411,"y":0.4194,"capital":false},{"name":"Fogmere","x":0.4161,"y":0.4528,"capital":false},{"name":"Crystal Lake","x":0.4411,"y":0.5139,"capital":false}]},{"name":"Essear","subtitle":"Kingdom of Essear","color":"#a0b0b8","labelX":1215.0,"labelY":635.0,"cities":[{"name":"Gildafell","x":0.4196,"y":0.3417,"capital":true},{"name":"Dunmore","x":0.3696,"y":0.2361,"capital":false},{"name":"Thebury","x":0.4911,"y":0.3861,"capital":false},{"name":"Yellowfen","x":0.4911,"y":0.3472,"capital":false}]},{"name":"Ashenveil","subtitle":"Realm of Ashenveil","color":"#b8c098","labelX":2115.0,"labelY":795.0,"cities":[{"name":"Borist","x":0.7375,"y":0.4306,"capital":true},{"name":"Dremoor","x":0.7196,"y":0.3639,"capital":false},{"name":"Northgate","x":0.6482,"y":0.4361,"capital":false},{"name":"Ashbourne","x":0.6446,"y":0.4306,"capital":false},{"name":"Tidefall","x":0.6768,"y":0.4139,"capital":false},{"name":"Lake Ironfrost","x":0.8268,"y":0.4694,"capital":false}]},{"name":"Frosthold","subtitle":"Principality of Frosthold","color":"#c4b0a8","labelX":2025.0,"labelY":325.0,"cities":[{"name":"Beowick","x":0.7339,"y":0.1861,"capital":true},{"name":"Vineyard","x":0.6482,"y":0.2194,"capital":false},{"name":"Inkwell","x":0.6518,"y":0.1917,"capital":false}]},{"name":"Valdheim","subtitle":"Principality of Valdheim","color":"#a8c0b0","labelX":2215.0,"labelY":1275.0,"cities":[{"name":"Highwall","x":0.8089,"y":0.7028,"capital":true},{"name":"Oakmere","x":0.7768,"y":0.6139,"capital":false},{"name":"Brightmoor","x":0.8054,"y":0.725,"capital":false},{"name":"Eagleford","x":0.8375,"y":0.7194,"capital":false}]}],"mountains":[{"name":"Ebonwall Mountains","labelX":2365.0,"labelY":1275.0},{"name":"Thundercrest Range","labelX":2295.0,"labelY":1065.0}],"lakes":[{"name":"Lake Ironfrost","labelX":2275.0,"labelY":783.0},{"name":"Crystal Lake","labelX":1305.0,"labelY":853.0}],"seaNames":["Sea of Twilight","Sea of Frost","Sea of Storms","Sea of Dreams","Crimson Gulf"]};
ATLAS_METADATA[89] = {"seed":89,"mapName":"STARFALL","regions":[{"name":"Silverfen","subtitle":"Kingdom of Silverfen","color":"#ccc088","labelX":2115.0,"labelY":875.0,"cities":[{"name":"Ashbourne","x":0.7625,"y":0.5028,"capital":true},{"name":"Vineyard","x":0.8089,"y":0.4639,"capital":false},{"name":"Kettlebrook","x":0.8125,"y":0.4694,"capital":false},{"name":"Valewick","x":0.7232,"y":0.4417,"capital":false},{"name":"Goldenleaf","x":0.7054,"y":0.5639,"capital":false}]},{"name":"Ironreach","subtitle":"Principality of Ironreach","color":"#a8b8a0","labelX":225.0,"labelY":785.0,"cities":[{"name":"Ravenmere","x":0.0946,"y":0.4417,"capital":true},{"name":"Alderhaven","x":0.1839,"y":0.4472,"capital":false},{"name":"Northgate","x":0.1018,"y":0.3861,"capital":false}]},{"name":"Crystalis","subtitle":"Kingdom of Crystalis","color":"#c8b490","labelX":1345.0,"labelY":845.0,"cities":[{"name":"Pinewood","x":0.4982,"y":0.4528,"capital":true},{"name":"Deepwatch","x":0.3875,"y":0.4028,"capital":false},{"name":"Whitevale","x":0.3768,"y":0.4861,"capital":false}]},{"name":"Shadowfen","subtitle":"Duchy of Shadowfen","color":"#a0b0b8","labelX":765.0,"labelY":655.0,"cities":[{"name":"Wydale","x":0.2732,"y":0.3639,"capital":true},{"name":"Pebblecreek","x":0.3482,"y":0.3806,"capital":false},{"name":"Ironholt","x":0.3875,"y":0.3806,"capital":false},{"name":"Urswick","x":0.2339,"y":0.2528,"capital":false},{"name":"Beowick","x":0.2125,"y":0.2972,"capital":false}]},{"name":"Verdantia","subtitle":"Duchy of Verdantia","color":"#b8c098","labelX":2535.0,"labelY":1345.0,"cities":[{"name":"Highwall","x":0.8911,"y":0.7472,"capital":true},{"name":"Tidefall","x":0.7982,"y":0.7306,"capital":false},{"name":"Stonemere","x":0.9232,"y":0.7417,"capital":false},{"name":"Pinewood","x":0.9089,"y":0.7306,"capital":false},{"name":"Moonshadow","x":0.8054,"y":0.675,"capital":false}]},{"name":"Nightward","subtitle":"Principality of Nightward","color":"#c4b0a8","labelX":405.0,"labelY":385.0,"cities":[{"name":"Millcross","x":0.1518,"y":0.2139,"capital":true},{"name":"Regnwald","x":0.2018,"y":0.3083,"capital":false},{"name":"Cliffhaven","x":0.1732,"y":0.275,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Jade Sea","Crimson Gulf","Sea of Embers","Sea of Ash"]};
ATLAS_METADATA[90] = {"seed":90,"mapName":"THORNHELM","regions":[{"name":"Korrath","subtitle":"The Wilds of Korrath","color":"#ccc088","labelX":1665.0,"labelY":975.0,"cities":[{"name":"Rynwood","x":0.5946,"y":0.5361,"capital":true},{"name":"Inkwell","x":0.6125,"y":0.5861,"capital":false},{"name":"Highwall","x":0.6804,"y":0.5417,"capital":false},{"name":"Vineyard","x":0.5196,"y":0.4917,"capital":false}]},{"name":"Nightward","subtitle":"Principality of Nightward","color":"#a8b8a0","labelX":1795.0,"labelY":1435.0,"cities":[{"name":"Gerenwalde","x":0.6446,"y":0.7806,"capital":true},{"name":"Zenithburg","x":0.7268,"y":0.6694,"capital":false},{"name":"Brinewood","x":0.5768,"y":0.7528,"capital":false},{"name":"Valewick","x":0.5804,"y":0.8306,"capital":false}]},{"name":"Jadecross","subtitle":"Kingdom of Jadecross","color":"#c8b490","labelX":2465.0,"labelY":975.0,"cities":[{"name":"Quartzridge","x":0.8625,"y":0.525,"capital":true},{"name":"Junipervale","x":0.7732,"y":0.5972,"capital":false},{"name":"Millcross","x":0.7982,"y":0.4806,"capital":false},{"name":"Ashwick","x":0.8089,"y":0.6194,"capital":false},{"name":"Inkwell","x":0.8018,"y":0.5139,"capital":false},{"name":"Cliffhaven","x":0.8589,"y":0.5806,"capital":false}]},{"name":"Galanthia","subtitle":"The Wilds of Galanthia","color":"#a0b0b8","labelX":1265.0,"labelY":435.0,"cities":[{"name":"Moonshadow","x":0.4661,"y":0.2472,"capital":true},{"name":"Ilaes","x":0.4625,"y":0.2194,"capital":false},{"name":"Thistledown","x":0.3696,"y":0.2806,"capital":false},{"name":"Eagleford","x":0.3482,"y":0.2694,"capital":false},{"name":"Ironholt","x":0.4089,"y":0.2694,"capital":false},{"name":"Ravenmere","x":0.3625,"y":0.3083,"capital":false}]},{"name":"Selvane","subtitle":"Kingdom of Selvane","color":"#b8c098","labelX":835.0,"labelY":1255.0,"cities":[{"name":"Fernhollow","x":0.2804,"y":0.6917,"capital":true},{"name":"Zarakyr","x":0.3446,"y":0.6306,"capital":false},{"name":"Underbridge","x":0.3768,"y":0.6583,"capital":false}]},{"name":"Ashenveil","subtitle":"Kingdom of Ashenveil","color":"#c4b0a8","labelX":1235.0,"labelY":1355.0,"cities":[{"name":"Rynwood","x":0.4268,"y":0.7583,"capital":true},{"name":"Loyarn","x":0.3732,"y":0.6528,"capital":false},{"name":"Redthorn","x":0.5232,"y":0.8194,"capital":false}]},{"name":"Windmere","subtitle":"Principality of Windmere","color":"#a8c0b0","labelX":2015.0,"labelY":565.0,"cities":[{"name":"Thebury","x":0.7304,"y":0.3306,"capital":true},{"name":"Eagleford","x":0.8446,"y":0.3417,"capital":false},{"name":"Lawklif","x":0.7268,"y":0.2806,"capital":false}]}],"mountains":[{"name":"Ashen Divide","labelX":1075.0,"labelY":565.0},{"name":"Dragon's Spine","labelX":1755.0,"labelY":1105.0},{"name":"Silvervein Ridge","labelX":1255.0,"labelY":1125.0}],"lakes":[{"name":"Lake Silvane","labelX":715.0,"labelY":1003.0},{"name":"Lake Orvane","labelX":2075.0,"labelY":923.0},{"name":"Mirrordeep","labelX":1515.0,"labelY":1163.0}],"seaNames":["Sea of Ash","Sea of Embers","Pale Sea","Sea of Dreams","Jade Sea"]};
ATLAS_METADATA[91] = {"seed":91,"mapName":"AEGISHOLM","regions":[{"name":"Aethermoor","subtitle":"Realm of Aethermoor","color":"#ccc088","labelX":1335.0,"labelY":525.0,"cities":[{"name":"Junipervale","x":0.4768,"y":0.2694,"capital":true},{"name":"Cinderfell","x":0.5482,"y":0.2917,"capital":false},{"name":"Knolltown","x":0.3982,"y":0.2583,"capital":false}]},{"name":"Sunmere","subtitle":"Principality of Sunmere","color":"#a8b8a0","labelX":945.0,"labelY":485.0,"cities":[{"name":"Lawklif","x":0.3232,"y":0.2528,"capital":true},{"name":"Quartzridge","x":0.2625,"y":0.2083,"capital":false},{"name":"Pebblecreek","x":0.2732,"y":0.2083,"capital":false}]},{"name":"Stormvale","subtitle":"Borderlands of Stormvale","color":"#c8b490","labelX":405.0,"labelY":665.0,"cities":[{"name":"Zenithburg","x":0.1518,"y":0.3528,"capital":true},{"name":"Underbridge","x":0.0804,"y":0.3806,"capital":false},{"name":"Fernhollow","x":0.1196,"y":0.4361,"capital":false},{"name":"Kronham","x":0.1732,"y":0.275,"capital":false},{"name":"Freehold","x":0.1339,"y":0.4417,"capital":false},{"name":"Whitevale","x":0.0804,"y":0.4194,"capital":false}]},{"name":"Dravina","subtitle":"Duchy of Dravina","color":"#a0b0b8","labelX":2115.0,"labelY":745.0,"cities":[{"name":"Westmarch","x":0.7339,"y":0.425,"capital":true},{"name":"Urswick","x":0.6768,"y":0.3806,"capital":false},{"name":"Greywater","x":0.7982,"y":0.5083,"capital":false},{"name":"Inkwell","x":0.6518,"y":0.4861,"capital":false}]},{"name":"Cyrin","subtitle":"Duchy of Cyrin","color":"#b8c098","labelX":1405.0,"labelY":985.0,"cities":[{"name":"Cinderfell","x":0.5196,"y":0.5639,"capital":true},{"name":"Northgate","x":0.4839,"y":0.5639,"capital":false},{"name":"Valewick","x":0.5196,"y":0.6306,"capital":false},{"name":"Pinewood","x":0.5911,"y":0.6028,"capital":false}]},{"name":"Ashmark","subtitle":"Kingdom of Ashmark","color":"#c4b0a8","labelX":1015.0,"labelY":955.0,"cities":[{"name":"Goldenleaf","x":0.3482,"y":0.5417,"capital":true},{"name":"Nighthollow","x":0.4518,"y":0.5583,"capital":false},{"name":"Windcrest","x":0.2482,"y":0.4306,"capital":false},{"name":"Duskhold","x":0.4375,"y":0.4528,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Embers","Sea of Silver","Sea of Dreams","Sea of Ash","Sea of Twilight"]};
ATLAS_METADATA[92] = {"seed":92,"mapName":"SHADOWMERE","regions":[{"name":"Drakkos","subtitle":"Realm of Drakkos","color":"#ccc088","labelX":385.0,"labelY":1215.0,"cities":[{"name":"Gildafell","x":0.1196,"y":0.6806,"capital":true},{"name":"Gerenwalde","x":0.0411,"y":0.725,"capital":false},{"name":"Wydale","x":0.0696,"y":0.7306,"capital":false},{"name":"Anora","x":0.1339,"y":0.625,"capital":false},{"name":"Brinewood","x":0.1589,"y":0.6472,"capital":false},{"name":"Highwall","x":0.2161,"y":0.6472,"capital":false}]},{"name":"Pyremarch","subtitle":"Realm of Pyremarch","color":"#a8b8a0","labelX":1795.0,"labelY":845.0,"cities":[{"name":"Brinewood","x":0.6304,"y":0.475,"capital":true},{"name":"Oldbridge","x":0.7339,"y":0.5361,"capital":false},{"name":"Harrowfield","x":0.6554,"y":0.3528,"capital":false},{"name":"Vineyard","x":0.6696,"y":0.4139,"capital":false}]},{"name":"Silverfen","subtitle":"Duchy of Silverfen","color":"#c8b490","labelX":2155.0,"labelY":655.0,"cities":[{"name":"Lawklif","x":0.7875,"y":0.3806,"capital":true},{"name":"Ivyreach","x":0.9018,"y":0.3972,"capital":false},{"name":"Greywater","x":0.8804,"y":0.3083,"capital":false},{"name":"Fernhollow","x":0.9054,"y":0.425,"capital":false},{"name":"Pebblecreek","x":0.6804,"y":0.3806,"capital":false},{"name":"Oakmere","x":0.8089,"y":0.2694,"capital":false}]},{"name":"Rosedale","subtitle":"The Free Marches of Rosedale","color":"#a0b0b8","labelX":1135.0,"labelY":1595.0,"cities":[{"name":"Beowick","x":0.4232,"y":0.9028,"capital":false},{"name":"Ashwick","x":0.4589,"y":0.9139,"capital":false},{"name":"Runeford","x":0.4696,"y":0.925,"capital":false},{"name":"Junipervale","x":0.4696,"y":0.8583,"capital":false},{"name":"Junipervale","x":0.3554,"y":0.8694,"capital":false}]},{"name":"Korrath","subtitle":"Kingdom of Korrath","color":"#b8c098","labelX":1495.0,"labelY":565.0,"cities":[{"name":"Stonemere","x":0.5268,"y":0.2972,"capital":true},{"name":"Millcross","x":0.5946,"y":0.2917,"capital":false},{"name":"Vineyard","x":0.4732,"y":0.375,"capital":false}]},{"name":"Solwynd","subtitle":"Duchy of Solwynd","color":"#c4b0a8","labelX":1495.0,"labelY":1195.0,"cities":[{"name":"Regnwald","x":0.5411,"y":0.6639,"capital":true},{"name":"Foxbury","x":0.5518,"y":0.7861,"capital":false},{"name":"Ashbourne","x":0.6018,"y":0.5694,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Sea of Frost","Sea of Storms","Jade Sea","Crimson Gulf"]};
ATLAS_METADATA[93] = {"seed":93,"mapName":"BRIMSTONE","regions":[{"name":"Fara","subtitle":"The Free Marches of Fara","color":"#ccc088","labelX":1605.0,"labelY":1275.0,"cities":[{"name":"Goldug","x":0.5875,"y":0.6972,"capital":true},{"name":"Longmere","x":0.6518,"y":0.6806,"capital":false},{"name":"Zarakyr","x":0.5446,"y":0.825,"capital":false},{"name":"Thornwall","x":0.5982,"y":0.6417,"capital":false},{"name":"Ashwick","x":0.6446,"y":0.7694,"capital":false},{"name":"Cliffhaven","x":0.5304,"y":0.7528,"capital":false}]},{"name":"Dravina","subtitle":"The Free Marches of Dravina","color":"#a8b8a0","labelX":985.0,"labelY":1015.0,"cities":[{"name":"Jadeston","x":0.3554,"y":0.5583,"capital":true},{"name":"Ashwick","x":0.2875,"y":0.6361,"capital":false},{"name":"Regnwald","x":0.4161,"y":0.4972,"capital":false},{"name":"Zarakyr","x":0.3089,"y":0.6306,"capital":false},{"name":"Loyarn","x":0.4125,"y":0.5417,"capital":false}]},{"name":"Aelindor","subtitle":"Kingdom of Aelindor","color":"#c8b490","labelX":2265.0,"labelY":635.0,"cities":[{"name":"Windcrest","x":0.8089,"y":0.3694,"capital":true},{"name":"Kingsbridge","x":0.8982,"y":0.4528,"capital":false},{"name":"Stonemere","x":0.8875,"y":0.4472,"capital":false}]},{"name":"Thornemark","subtitle":"The Dominion of Thornemark","color":"#a0b0b8","labelX":535.0,"labelY":755.0,"cities":[{"name":"Thornwall","x":0.2054,"y":0.4028,"capital":true},{"name":"Ironholt","x":0.1018,"y":0.3639,"capital":false},{"name":"Valewick","x":0.3054,"y":0.4361,"capital":false},{"name":"Westmarch","x":0.1732,"y":0.4861,"capital":false},{"name":"Maplecross","x":0.1518,"y":0.3083,"capital":false}]},{"name":"Mistvale","subtitle":"Principality of Mistvale","color":"#b8c098","labelX":1435.0,"labelY":785.0,"cities":[{"name":"Redthorn","x":0.5161,"y":0.4472,"capital":true},{"name":"Kingsbridge","x":0.5232,"y":0.5083,"capital":false},{"name":"Cinderfell","x":0.4268,"y":0.475,"capital":false},{"name":"Lawklif","x":0.5875,"y":0.4694,"capital":false}]},{"name":"Verdantia","subtitle":"Kingdom of Verdantia","color":"#c4b0a8","labelX":2165.0,"labelY":1225.0,"cities":[{"name":"Ashbourne","x":0.7554,"y":0.6917,"capital":true},{"name":"Greenhollow","x":0.7839,"y":0.6639,"capital":false},{"name":"Yellowfen","x":0.7161,"y":0.7306,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Iron Sea","Pale Sea","Sea of Embers","Sea of Storms","Sea of Twilight"]};
ATLAS_METADATA[94] = {"seed":94,"mapName":"GLACIERFORD","regions":[{"name":"Ironglenn","subtitle":"The Dominion of Ironglenn","color":"#ccc088","labelX":1875.0,"labelY":875.0,"cities":[{"name":"Loyarn","x":0.6518,"y":0.475,"capital":true},{"name":"Fogmere","x":0.7232,"y":0.3917,"capital":false},{"name":"Fernhollow","x":0.7268,"y":0.4972,"capital":false},{"name":"Rynwood","x":0.6518,"y":0.5472,"capital":false},{"name":"Eagleford","x":0.6375,"y":0.3361,"capital":false},{"name":"Fogmere","x":0.7554,"y":0.5139,"capital":false}]},{"name":"Drakkos","subtitle":"Borderlands of Drakkos","color":"#a8b8a0","labelX":765.0,"labelY":1295.0,"cities":[{"name":"Brightmoor","x":0.2696,"y":0.7028,"capital":true},{"name":"Dawnwatch","x":0.1839,"y":0.6806,"capital":false},{"name":"Loyarn","x":0.3232,"y":0.6139,"capital":false}]},{"name":"Lakeshore","subtitle":"Kingdom of Lakeshore","color":"#c8b490","labelX":2375.0,"labelY":845.0,"cities":[{"name":"Oakmere","x":0.8661,"y":0.4861,"capital":true},{"name":"Alderhaven","x":0.8839,"y":0.4028,"capital":false},{"name":"Lawklif","x":0.9339,"y":0.5083,"capital":false},{"name":"Dunmore","x":0.9482,"y":0.5417,"capital":false},{"name":"Dremoor","x":0.9518,"y":0.5417,"capital":false}]},{"name":"Tethys","subtitle":"Duchy of Tethys","color":"#a0b0b8","labelX":715.0,"labelY":805.0,"cities":[{"name":"Zenithburg","x":0.2661,"y":0.4583,"capital":true},{"name":"Vineyard","x":0.3625,"y":0.5139,"capital":false},{"name":"Tidefall","x":0.2518,"y":0.375,"capital":false},{"name":"Borist","x":0.3625,"y":0.3861,"capital":false},{"name":"Brinewood","x":0.1446,"y":0.5083,"capital":false}]},{"name":"Elonia","subtitle":"The Free Marches of Elonia","color":"#b8c098","labelX":1355.0,"labelY":805.0,"cities":[{"name":"Silverton","x":0.5018,"y":0.4417,"capital":true},{"name":"Thornwall","x":0.4661,"y":0.3639,"capital":false},{"name":"Duskhold","x":0.5875,"y":0.4417,"capital":false}]},{"name":"Aethermoor","subtitle":"Principality of Aethermoor","color":"#c4b0a8","labelX":1625.0,"labelY":1235.0,"cities":[{"name":"Maplecross","x":0.5696,"y":0.675,"capital":true},{"name":"Ilaes","x":0.6125,"y":0.6583,"capital":false},{"name":"Stonemere","x":0.4946,"y":0.6917,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Ash","Jade Sea","Iron Sea","Sea of Dreams","Crimson Gulf"]};
ATLAS_METADATA[95] = {"seed":95,"mapName":"OAKHAVEN","regions":[{"name":"Silverfen","subtitle":"Borderlands of Silverfen","color":"#ccc088","labelX":1095.0,"labelY":1045.0,"cities":[{"name":"Thornwall","x":0.3911,"y":0.5917,"capital":true},{"name":"Rynwood","x":0.2661,"y":0.6139,"capital":false},{"name":"Thistledown","x":0.3054,"y":0.575,"capital":false},{"name":"Zenithburg","x":0.3268,"y":0.6417,"capital":false},{"name":"Duskhold","x":0.4161,"y":0.5417,"capital":false}]},{"name":"Ondara","subtitle":"The Wilds of Ondara","color":"#a8b8a0","labelX":2355.0,"labelY":1345.0,"cities":[{"name":"Pinewood","x":0.8018,"y":0.7528,"capital":false},{"name":"Junipervale","x":0.7482,"y":0.7028,"capital":false},{"name":"Kingsbridge","x":0.7589,"y":0.675,"capital":false},{"name":"Kronham","x":0.8732,"y":0.6972,"capital":false}]},{"name":"Stormvale","subtitle":"The Dominion of Stormvale","color":"#c8b490","labelX":1675.0,"labelY":1065.0,"cities":[{"name":"Pebblecreek","x":0.5804,"y":0.575,"capital":true},{"name":"Eagleford","x":0.5732,"y":0.4694,"capital":false},{"name":"Oldbridge","x":0.4482,"y":0.5361,"capital":false},{"name":"Regnwald","x":0.4518,"y":0.5472,"capital":false},{"name":"Maplecross","x":0.6161,"y":0.6139,"capital":false}]},{"name":"Mistvale","subtitle":"Principality of Mistvale","color":"#a0b0b8","labelX":655.0,"labelY":815.0,"cities":[{"name":"Whitevale","x":0.2161,"y":0.4361,"capital":true},{"name":"Highwall","x":0.1518,"y":0.4472,"capital":false},{"name":"Loyarn","x":0.1554,"y":0.4528,"capital":false},{"name":"Harrowfield","x":0.3161,"y":0.4361,"capital":false}]},{"name":"Belros","subtitle":"Duchy of Belros","color":"#b8c098","labelX":225.0,"labelY":955.0,"cities":[{"name":"Thebury","x":0.0625,"y":0.5417,"capital":true},{"name":"Moonshadow","x":0.1589,"y":0.4806,"capital":false},{"name":"Brightmoor","x":0.0411,"y":0.6139,"capital":false},{"name":"Junipervale","x":0.0411,"y":0.5083,"capital":false}]},{"name":"Thornwick","subtitle":"The Free Marches of Thornwick","color":"#c4b0a8","labelX":2635.0,"labelY":1045.0,"cities":[{"name":"Anora","x":0.9554,"y":0.6361,"capital":false},{"name":"Thistledown","x":0.8446,"y":0.575,"capital":false},{"name":"Ilaes","x":0.9411,"y":0.575,"capital":true},{"name":"Lakecrest","x":0.8732,"y":0.6083,"capital":false},{"name":"Duskwater","x":0.8446,"y":0.5917,"capital":false}]},{"name":"Highkeep","subtitle":"Kingdom of Highkeep","color":"#a8c0b0","labelX":2005.0,"labelY":935.0,"cities":[{"name":"Dunmore","x":0.7304,"y":0.5361,"capital":true},{"name":"Thornwall","x":0.7196,"y":0.6028,"capital":false},{"name":"Foxbury","x":0.7661,"y":0.5806,"capital":false},{"name":"Stonemere","x":0.7946,"y":0.6139,"capital":false}]},{"name":"Brynmar","subtitle":"Principality of Brynmar","color":"#c8c0a0","labelX":525.0,"labelY":1265.0,"cities":[{"name":"Pebblecreek","x":0.1696,"y":0.7139,"capital":true},{"name":"Westmarch","x":0.2554,"y":0.7194,"capital":false},{"name":"Quartzridge","x":0.2054,"y":0.6583,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Pale Sea","Jade Sea","Crimson Gulf","Sea of Ash","Sea of Embers"]};
ATLAS_METADATA[96] = {"seed":96,"mapName":"DRAGONSPIRE","regions":[{"name":"Essear","subtitle":"The Dominion of Essear","color":"#ccc088","labelX":1935.0,"labelY":865.0,"cities":[{"name":"Kettlebrook","x":0.7089,"y":0.475,"capital":true},{"name":"Gildafell","x":0.6018,"y":0.4306,"capital":false},{"name":"Zarakyr","x":0.7446,"y":0.5528,"capital":false},{"name":"Cliffhaven","x":0.6839,"y":0.5639,"capital":false},{"name":"Brightmoor","x":0.6339,"y":0.3861,"capital":false}]},{"name":"Valdheim","subtitle":"Duchy of Valdheim","color":"#a8b8a0","labelX":2495.0,"labelY":875.0,"cities":[{"name":"Pebblecreek","x":0.9054,"y":0.4806,"capital":true},{"name":"Knolltown","x":0.8089,"y":0.425,"capital":false},{"name":"Ilaes","x":0.8268,"y":0.4806,"capital":false},{"name":"Ironholt","x":0.8411,"y":0.4194,"capital":false},{"name":"Borist","x":0.9411,"y":0.5472,"capital":false},{"name":"Knolltown","x":0.8875,"y":0.5306,"capital":false},{"name":"Lake Varos","x":0.8054,"y":0.575,"capital":false}]},{"name":"Pinecrest","subtitle":"Realm of Pinecrest","color":"#c8b490","labelX":625.0,"labelY":975.0,"cities":[{"name":"Thistledown","x":0.2339,"y":0.525,"capital":true},{"name":"Yewborough","x":0.1625,"y":0.625,"capital":false},{"name":"Wydale","x":0.2375,"y":0.4417,"capital":false},{"name":"Freehold","x":0.3339,"y":0.5583,"capital":false}]},{"name":"Windmere","subtitle":"The Free Marches of Windmere","color":"#a0b0b8","labelX":1455.0,"labelY":1155.0,"cities":[{"name":"Inkwell","x":0.5232,"y":0.6306,"capital":true},{"name":"Deepwatch","x":0.5768,"y":0.6306,"capital":false},{"name":"Fogmere","x":0.4661,"y":0.6139,"capital":false},{"name":"Thornwall","x":0.5018,"y":0.7083,"capital":false},{"name":"Copperside","x":0.5625,"y":0.5472,"capital":false},{"name":"Blackrock","x":0.4518,"y":0.575,"capital":false}]},{"name":"Kharadan","subtitle":"The Wilds of Kharadan","color":"#b8c098","labelX":1875.0,"labelY":1395.0,"cities":[{"name":"Underbridge","x":0.6625,"y":0.7861,"capital":true},{"name":"Foxbury","x":0.5911,"y":0.7417,"capital":false},{"name":"Lakecrest","x":0.6375,"y":0.6472,"capital":false},{"name":"Quartzridge","x":0.7768,"y":0.8194,"capital":false},{"name":"Deepwatch","x":0.7554,"y":0.8028,"capital":false},{"name":"Zarakyr","x":0.7196,"y":0.7528,"capital":false}]},{"name":"Ondara","subtitle":"The Wilds of Ondara","color":"#c4b0a8","labelX":1135.0,"labelY":905.0,"cities":[{"name":"Fernhollow","x":0.3982,"y":0.4972,"capital":true},{"name":"Harrowfield","x":0.3625,"y":0.5694,"capital":false},{"name":"Greywater","x":0.3446,"y":0.4083,"capital":false},{"name":"Yewborough","x":0.4696,"y":0.4972,"capital":false},{"name":"Odrin","x":0.3446,"y":0.4917,"capital":false}]},{"name":"Nightward","subtitle":"Kingdom of Nightward","color":"#a8c0b0","labelX":2615.0,"labelY":1355.0,"cities":[{"name":"Cliffhaven","x":0.9268,"y":0.7472,"capital":true},{"name":"Lindel","x":0.8911,"y":0.8194,"capital":false},{"name":"Underbridge","x":0.9589,"y":0.6917,"capital":false}]}],"mountains":[{"name":"Thundercrest Range","labelX":1145.0,"labelY":805.0},{"name":"Frostpeak Mountains","labelX":1405.0,"labelY":1235.0}],"lakes":[{"name":"Lake Varos","labelX":2275.0,"labelY":1043.0}],"seaNames":["Sea of Twilight","Crimson Gulf","Sea of Winds","Jade Sea","Sea of Dreams"]};
ATLAS_METADATA[97] = {"seed":97,"mapName":"BLEAKWIND","regions":[{"name":"Aethermoor","subtitle":"The Free Marches of Aethermoor","color":"#ccc088","labelX":1745.0,"labelY":1165.0,"cities":[{"name":"Feradell","x":0.6054,"y":0.6639,"capital":true},{"name":"Oldbridge","x":0.6304,"y":0.6361,"capital":false},{"name":"Zenithburg","x":0.6804,"y":0.5694,"capital":false},{"name":"Freehold","x":0.4982,"y":0.5972,"capital":false},{"name":"Dawnwatch","x":0.6268,"y":0.6083,"capital":false}]},{"name":"Thornemark","subtitle":"Duchy of Thornemark","color":"#a8b8a0","labelX":1645.0,"labelY":555.0,"cities":[{"name":"Gildafell","x":0.5768,"y":0.325,"capital":true},{"name":"Longmere","x":0.7054,"y":0.3083,"capital":false},{"name":"Kingsbridge","x":0.5911,"y":0.4417,"capital":false},{"name":"Greenhollow","x":0.5304,"y":0.2472,"capital":false}]},{"name":"Selvane","subtitle":"The Free Marches of Selvane","color":"#c8b490","labelX":325.0,"labelY":505.0,"cities":[{"name":"Jadeston","x":0.1089,"y":0.2806,"capital":true},{"name":"Harrowfield","x":0.1946,"y":0.2861,"capital":false},{"name":"Oldbridge","x":0.1625,"y":0.375,"capital":false},{"name":"Wydale","x":0.1732,"y":0.3306,"capital":false}]},{"name":"Solwynd","subtitle":"The Wilds of Solwynd","color":"#a0b0b8","labelX":2205.0,"labelY":885.0,"cities":[{"name":"Longmere","x":0.8018,"y":0.4861,"capital":true},{"name":"Windcrest","x":0.7696,"y":0.3972,"capital":false},{"name":"Rynwood","x":0.7589,"y":0.3806,"capital":false},{"name":"Moonshadow","x":0.7268,"y":0.5639,"capital":false},{"name":"Thornwall","x":0.6589,"y":0.4528,"capital":false},{"name":"Lakecrest","x":0.8232,"y":0.4361,"capital":false}]},{"name":"Shadowfen","subtitle":"Kingdom of Shadowfen","color":"#b8c098","labelX":1165.0,"labelY":1245.0,"cities":[{"name":"Jadeston","x":0.4089,"y":0.7028,"capital":true},{"name":"Underbridge","x":0.4804,"y":0.6639,"capital":false},{"name":"Ironholt","x":0.3696,"y":0.775,"capital":false},{"name":"Underbridge","x":0.4839,"y":0.7028,"capital":false},{"name":"Urswick","x":0.4446,"y":0.8028,"capital":false},{"name":"Ravenmere","x":0.2911,"y":0.7028,"capital":false}]},{"name":"Duskveil","subtitle":"The Dominion of Duskveil","color":"#c4b0a8","labelX":695.0,"labelY":705.0,"cities":[{"name":"Thebury","x":0.2625,"y":0.4028,"capital":true},{"name":"Borist","x":0.3054,"y":0.3528,"capital":false},{"name":"Ilaes","x":0.1804,"y":0.4528,"capital":false},{"name":"Longmere","x":0.2375,"y":0.2861,"capital":false},{"name":"Wydale","x":0.1804,"y":0.4417,"capital":false},{"name":"Lake Thornwell","x":0.2018,"y":0.4528,"capital":false}]},{"name":"Pyremarch","subtitle":"The Free Marches of Pyremarch","color":"#a8c0b0","labelX":585.0,"labelY":1165.0,"cities":[{"name":"Alderhaven","x":0.2161,"y":0.6306,"capital":true},{"name":"Eagleford","x":0.1911,"y":0.6861,"capital":false},{"name":"Loyarn","x":0.3018,"y":0.6306,"capital":false},{"name":"Brightmoor","x":0.2982,"y":0.6361,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":1645.0,"labelY":815.0},{"name":"Ashen Divide","labelX":985.0,"labelY":665.0},{"name":"Greymist Heights","labelX":455.0,"labelY":925.0},{"name":"Frostpeak Mountains","labelX":2195.0,"labelY":1035.0}],"lakes":[{"name":"Mirrordeep","labelX":995.0,"labelY":1153.0},{"name":"Lake Orvane","labelX":1285.0,"labelY":603.0},{"name":"Lake Thornwell","labelX":645.0,"labelY":813.0},{"name":"Lake Aegir","labelX":1775.0,"labelY":573.0}],"seaNames":["Jade Sea","Sea of Dreams","Sea of Winds","Crimson Gulf","Sea of Embers"]};
ATLAS_METADATA[98] = {"seed":98,"mapName":"SABLEWOOD","regions":[{"name":"Felmoor","subtitle":"The Free Marches of Felmoor","color":"#ccc088","labelX":2195.0,"labelY":715.0,"cities":[{"name":"Whitevale","x":0.7732,"y":0.3972,"capital":true},{"name":"Millcross","x":0.6875,"y":0.3583,"capital":false},{"name":"Ivyreach","x":0.8446,"y":0.2861,"capital":false},{"name":"Stonemere","x":0.7339,"y":0.4639,"capital":false}]},{"name":"Lakeshore","subtitle":"The Dominion of Lakeshore","color":"#a8b8a0","labelX":485.0,"labelY":1235.0,"cities":[{"name":"Gildafell","x":0.1589,"y":0.6806,"capital":true},{"name":"Freehold","x":0.1411,"y":0.7083,"capital":false},{"name":"Vineyard","x":0.1161,"y":0.6528,"capital":false},{"name":"Kettlebrook","x":0.0982,"y":0.6306,"capital":false},{"name":"Ashwick","x":0.1018,"y":0.6361,"capital":false}]},{"name":"Morvaine","subtitle":"The Dominion of Morvaine","color":"#c8b490","labelX":1615.0,"labelY":565.0,"cities":[{"name":"Yellowfen","x":0.5768,"y":0.325,"capital":true},{"name":"Lawklif","x":0.6089,"y":0.2472,"capital":false},{"name":"Goldenleaf","x":0.6018,"y":0.4528,"capital":false}]},{"name":"Duskveil","subtitle":"Borderlands of Duskveil","color":"#a0b0b8","labelX":905.0,"labelY":805.0,"cities":[{"name":"Oldbridge","x":0.3268,"y":0.4528,"capital":true},{"name":"Valewick","x":0.3839,"y":0.4028,"capital":false},{"name":"Copperside","x":0.3661,"y":0.5361,"capital":false}]},{"name":"Ironglenn","subtitle":"Realm of Ironglenn","color":"#b8c098","labelX":165.0,"labelY":715.0,"cities":[{"name":"Underbridge","x":0.0625,"y":0.375,"capital":true},{"name":"Blackrock","x":0.1661,"y":0.4528,"capital":false},{"name":"Stonemere","x":0.1089,"y":0.3694,"capital":false},{"name":"Greenhollow","x":0.0518,"y":0.3694,"capital":false},{"name":"Lawklif","x":0.0411,"y":0.4806,"capital":false},{"name":"Windcrest","x":0.0411,"y":0.4639,"capital":false}]},{"name":"Goleli","subtitle":"Duchy of Goleli","color":"#c4b0a8","labelX":1425.0,"labelY":1275.0,"cities":[{"name":"Goldenleaf","x":0.4946,"y":0.7028,"capital":true},{"name":"Zarakyr","x":0.4339,"y":0.575,"capital":false},{"name":"Dunmore","x":0.4696,"y":0.625,"capital":false},{"name":"Dremoor","x":0.3661,"y":0.6861,"capital":false}]}],"mountains":[{"name":"Ebonwall Mountains","labelX":1935.0,"labelY":975.0},{"name":"Frostpeak Mountains","labelX":1995.0,"labelY":935.0},{"name":"Thundercrest Range","labelX":1145.0,"labelY":645.0},{"name":"Stormcrown Range","labelX":1015.0,"labelY":545.0}],"lakes":[],"seaNames":["Pale Sea","Sea of Winds","Sea of Frost","Sea of Dreams","Sea of Embers"]};
ATLAS_METADATA[99] = {"seed":99,"mapName":"DAWNHAMMER","regions":[{"name":"Rosedale","subtitle":"The Dominion of Rosedale","color":"#ccc088","labelX":1955.0,"labelY":1135.0,"cities":[{"name":"Rynwood","x":0.6804,"y":0.625,"capital":true},{"name":"Tidefall","x":0.7589,"y":0.6306,"capital":false},{"name":"Duskhold","x":0.6518,"y":0.7083,"capital":false},{"name":"Dremoor","x":0.7411,"y":0.675,"capital":false}]},{"name":"Pinecrest","subtitle":"Kingdom of Pinecrest","color":"#a8b8a0","labelX":915.0,"labelY":695.0,"cities":[{"name":"Lawklif","x":0.3268,"y":0.375,"capital":true},{"name":"Gildafell","x":0.3232,"y":0.3139,"capital":false},{"name":"Millcross","x":0.3446,"y":0.2306,"capital":false}]},{"name":"Vornhelm","subtitle":"Duchy of Vornhelm","color":"#c8b490","labelX":1765.0,"labelY":705.0,"cities":[{"name":"Stormgate","x":0.6232,"y":0.4083,"capital":true},{"name":"Stonemere","x":0.6339,"y":0.4639,"capital":false},{"name":"Goldug","x":0.6411,"y":0.5306,"capital":false}]},{"name":"Aelindor","subtitle":"Realm of Aelindor","color":"#a0b0b8","labelX":505.0,"labelY":865.0,"cities":[{"name":"Highwall","x":0.1911,"y":0.4861,"capital":true},{"name":"Alderhaven","x":0.1411,"y":0.5694,"capital":false},{"name":"Odrin","x":0.1482,"y":0.5028,"capital":false},{"name":"Greenhollow","x":0.2911,"y":0.5139,"capital":false},{"name":"Kingsbridge","x":0.1375,"y":0.5583,"capital":false}]},{"name":"Aethermoor","subtitle":"Realm of Aethermoor","color":"#b8c098","labelX":215.0,"labelY":525.0,"cities":[{"name":"Yewborough","x":0.0768,"y":0.2917,"capital":false},{"name":"Windcrest","x":0.0875,"y":0.2861,"capital":true},{"name":"Harrowfield","x":0.0482,"y":0.3083,"capital":false},{"name":"Zarakyr","x":0.1732,"y":0.3417,"capital":false},{"name":"Redthorn","x":0.2125,"y":0.2806,"capital":false}]},{"name":"Ashenveil","subtitle":"Principality of Ashenveil","color":"#c4b0a8","labelX":1385.0,"labelY":425.0,"cities":[{"name":"Kettlebrook","x":0.4768,"y":0.2306,"capital":true},{"name":"Millcross","x":0.5446,"y":0.2306,"capital":false}]}],"mountains":[{"name":"Ironspine Range","labelX":504.0,"labelY":828.0},{"name":"Stormcrown Range","labelX":2016.0,"labelY":252.0},{"name":"Ashen Divide","labelX":1680.0,"labelY":1188.0}],"lakes":[],"seaNames":["Sea of Silver","Sea of Storms","Pale Sea","Jade Sea","Sea of Dreams"]};
ATLAS_METADATA[100] = {"seed":100,"mapName":"CRYSTALVEIL","regions":[{"name":"Nightward","subtitle":"The Free Marches of Nightward","color":"#ccc088","labelX":1915.0,"labelY":1035.0,"cities":[{"name":"Fernhollow","x":0.6696,"y":0.5694,"capital":true},{"name":"Pebblecreek","x":0.6018,"y":0.5583,"capital":false},{"name":"Thistledown","x":0.5982,"y":0.6194,"capital":false},{"name":"Loyarn","x":0.6946,"y":0.6306,"capital":false},{"name":"Maplecross","x":0.6411,"y":0.675,"capital":false}]},{"name":"Thornemark","subtitle":"The Dominion of Thornemark","color":"#a8b8a0","labelX":1215.0,"labelY":1365.0,"cities":[{"name":"Westmarch","x":0.4196,"y":0.7417,"capital":true},{"name":"Rynwood","x":0.4446,"y":0.6917,"capital":false},{"name":"Gerenwalde","x":0.4839,"y":0.7806,"capital":false},{"name":"Ironholt","x":0.3196,"y":0.6361,"capital":false},{"name":"Odrin","x":0.3696,"y":0.7583,"capital":false}]},{"name":"Ironglenn","subtitle":"Duchy of Ironglenn","color":"#c8b490","labelX":1175.0,"labelY":475.0,"cities":[{"name":"Copperside","x":0.4125,"y":0.2583,"capital":true},{"name":"Ilaes","x":0.2911,"y":0.275,"capital":false},{"name":"Thistledown","x":0.3518,"y":0.2528,"capital":false},{"name":"Gildafell","x":0.4839,"y":0.325,"capital":false},{"name":"Duskhold","x":0.3196,"y":0.3194,"capital":false},{"name":"Palanor","x":0.3411,"y":0.3528,"capital":false}]},{"name":"Windmere","subtitle":"Duchy of Windmere","color":"#a0b0b8","labelX":2275.0,"labelY":895.0,"cities":[{"name":"Northgate","x":0.8268,"y":0.4861,"capital":true},{"name":"Millcross","x":0.8446,"y":0.6083,"capital":false},{"name":"Brightmoor","x":0.7768,"y":0.4306,"capital":false},{"name":"Palanor","x":0.9054,"y":0.4417,"capital":false},{"name":"Eagleford","x":0.8839,"y":0.4972,"capital":false}]},{"name":"Brynmar","subtitle":"The Dominion of Brynmar","color":"#b8c098","labelX":675.0,"labelY":785.0,"cities":[{"name":"Duskhold","x":0.2554,"y":0.4306,"capital":true},{"name":"Eagleford","x":0.1839,"y":0.3861,"capital":false},{"name":"Elmsworth","x":0.1446,"y":0.4694,"capital":false},{"name":"Gildafell","x":0.3375,"y":0.3806,"capital":false}]},{"name":"Northmere","subtitle":"The Dominion of Northmere","color":"#c4b0a8","labelX":585.0,"labelY":1215.0,"cities":[{"name":"Alderhaven","x":0.1911,"y":0.6583,"capital":true},{"name":"Ashbourne","x":0.2304,"y":0.7417,"capital":false},{"name":"Jadeston","x":0.2732,"y":0.7306,"capital":false},{"name":"Silverton","x":0.2732,"y":0.6417,"capital":false},{"name":"Ilaes","x":0.0732,"y":0.6417,"capital":false},{"name":"Yewborough","x":0.1054,"y":0.5972,"capital":false}]},{"name":"Caltheon","subtitle":"Realm of Caltheon","color":"#a8c0b0","labelX":1645.0,"labelY":525.0,"cities":[{"name":"Stonemere","x":0.5875,"y":0.3083,"capital":true},{"name":"Loyarn","x":0.5125,"y":0.3917,"capital":false},{"name":"Urswick","x":0.5696,"y":0.2806,"capital":false},{"name":"Junipervale","x":0.5304,"y":0.2917,"capital":false},{"name":"Cliffhaven","x":0.4768,"y":0.3917,"capital":false}]},{"name":"Shadowfen","subtitle":"Kingdom of Shadowfen","color":"#c8c0a0","labelX":165.0,"labelY":665.0,"cities":[{"name":"Maplecross","x":0.0661,"y":0.375,"capital":true},{"name":"Dunmore","x":0.1518,"y":0.4139,"capital":false},{"name":"Windcrest","x":0.1554,"y":0.3917,"capital":false},{"name":"Ivyreach","x":0.0518,"y":0.3806,"capital":false},{"name":"Underbridge","x":0.0804,"y":0.4694,"capital":false}]}],"mountains":[{"name":"Greymist Heights","labelX":535.0,"labelY":1075.0},{"name":"Ashen Divide","labelX":1155.0,"labelY":775.0},{"name":"Ebonwall Mountains","labelX":1925.0,"labelY":1265.0}],"lakes":[{"name":"Dimwater","labelX":615.0,"labelY":913.0}],"seaNames":["Sea of Dreams","Sea of Twilight","Jade Sea","Sea of Silver","Sea of Embers"]};
/* Shared core references from main bundle */
const { useState, useEffect, useCallback, useRef, useMemo } = React;
const {
  T, getHpColor, DND_CONDITIONS, CONDITION_HELP,
  Tag, HpBar, PowerBar, LinkBtn, CrimsonBtn, Section, Input, Select, Textarea, Modal, ToggleSwitch,
  eid, uid, cmClone, cmSafeInt, cmAbilityMod, cmHumanizeKey,
  getFantasyIcon, normalizeWorldMapState,
  ATLAS_LAND_PATH, ATLAS_ISLANDS, ATLAS_WATER_BODIES, ATLAS_RIVERS, ATLAS_SEA_LABELS,
  ATLAS_RANGE_LABELS, ATLAS_MOUNTAIN_RANGES, ATLAS_PROVINCES, ATLAS_FACTION_SEATS,
  ATLAS_FREE_SEATS, ATLAS_REGION_LAYOUTS,
  MapIconMountain, MapIconMountainSmall, MapIconCity, MapIconDungeon,
  MapIconForest, MapIconTree, MapIconRuins,
  MapIconCastle, MapIconTown, MapIconHamlet, MapIconKingdom, MapIconRoute,
} = window.__CM;
const { ChevronDown, ChevronRight, ChevronLeft, Swords, Users, MapPin, Crown, Scroll, Clock, Star, BookOpen, Dice6, Target, Heart, CheckCircle, Circle, ArrowRight, ArrowLeft, Plus, Compass, Mountain, Castle, Skull, Flag, TrendingUp, TrendingDown, Minus, SkipForward, Search, Bell, Settings, X, Edit3, Trash2, Eye, EyeOff, Globe, Layers, Activity, Upload, Download, FileText, Save, Copy, Calendar, Lock, Unlock, ToggleLeft, ToggleRight, AlertTriangle, Package, Shield, Wand2, Map: MapIcon, LayoutDashboard, Link, RefreshCw, ChevronUp, MoreVertical, Check, Image, Bold, Italic, List, Type, Heading, Filter } = window.LucideReact || {};
const FilterIcon = Filter || Layers;
const PlayNavIcon = MapIcon || MapPin;

function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLEX NOISE GENERATOR (2D, for terrain)
// ═══════════════════════════════════════════════════════════════════════════
class SimplexNoise2D {
  constructor(seed = 0) {
    this.seed = seed;
    this.p = this.buildPermutationTable(seed);
  }

  buildPermutationTable(seed) {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Fisher-Yates shuffle with seed
    const rng = mulberry32(seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    // Duplicate for wraparound
    return [...p, ...p];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x, y) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const p = this.p;
    const aa = p[p[xi] + yi];
    const ab = p[p[xi] + yi + 1];
    const ba = p[p[xi + 1] + yi];
    const bb = p[p[xi + 1] + yi + 1];

    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);
    return this.lerp(x1, x2, v);
  }

  octave(x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += this.noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / maxValue;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED MAP GENERATION WITH TERRAIN VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════
function generateTerrainMap(width, height, seed, mapSize = "medium", climateType = "temperate") {
  const noise = new SimplexNoise2D(seed);
  const terrain = Array(height).fill().map(() => Array(width).fill(0));
  const moisture = Array(height).fill().map(() => Array(width).fill(0));

  // Base terrain with scale based on map size
  const scales = { small: 0.008, medium: 0.006, large: 0.004 };
  const scale = scales[mapSize] || scales.medium;
  const octaves = mapSize === "large" ? 6 : mapSize === "small" ? 3 : 4;

  // Generate base terrain
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = noise.octave(x * scale, y * scale, octaves, 0.55, 2.0);
      value = (value + 1) * 0.5; // Normalize to 0-1
      terrain[y][x] = value;
    }
  }

  // Generate moisture map
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = noise.octave(x * scale * 0.7 + 5000, y * scale * 0.7 + 5000, 3, 0.6, 2.0);
      value = (value + 1) * 0.5;
      moisture[y][x] = value;
    }
  }

  // Climate adjustments
  const climateAdjustments = {
    tropical: { waterLevel: 0.35, mountainLevel: 0.6, moistureBoost: 0.2 },
    temperate: { waterLevel: 0.42, mountainLevel: 0.65, moistureBoost: 0.0 },
    arctic: { waterLevel: 0.48, mountainLevel: 0.72, moistureBoost: -0.15 },
    desert: { waterLevel: 0.45, mountainLevel: 0.68, moistureBoost: -0.3 },
    mixed: { waterLevel: 0.40, mountainLevel: 0.63, moistureBoost: 0.05 }
  };
  const climate = climateAdjustments[climateType] || climateAdjustments.temperate;

  return { terrain, moisture, waterLevel: climate.waterLevel, mountainLevel: climate.mountainLevel, climateBoost: climate.moistureBoost };
}

function getTerrainType(elevation, moisture, waterLevel, mountainLevel) {
  if (elevation < waterLevel) return "water";
  if (elevation < waterLevel + 0.05) return "beach";
  if (elevation > mountainLevel) return "mountain";
  if (elevation > mountainLevel - 0.08) return "hill";
  if (moisture > 0.6) return "forest";
  if (moisture > 0.4) return "plains";
  return "desert";
}

function getTerrainColor(terrainType) {
  const colors = {
    water: { r: 64, g: 128, b: 160 },
    beach: { r: 220, g: 200, b: 130 },
    plains: { r: 150, g: 180, b: 100 },
    forest: { r: 80, g: 130, b: 70 },
    hill: { r: 160, g: 150, b: 100 },
    mountain: { r: 130, g: 120, b: 110 },
    desert: { r: 200, g: 170, b: 90 },
    snow: { r: 240, g: 245, b: 250 }
  };
  return colors[terrainType] || colors.plains;
}

/* Generate a blob path for a continent — parameterized noise-like displacement */
function generateContinent(rng, centerX = 3000, centerY = 2250, baseRadius = 1200) {
  // Multi-octave noise for natural coastline
  const segments = 128;
  const noise = new SimplexNoise2D(Math.floor(rng() * 99999));
  const path = [];
  // Generate raw points
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Harmonic base shape — not a perfect circle
    const baseR = baseRadius
      + Math.sin(angle * 2.3 + rng() * 6) * 280
      + Math.cos(angle * 1.7 + rng() * 6) * 220
      + Math.sin(angle * 3.8) * 120;
    // Noise-based coastline detail at multiple scales
    const n1 = noise.noise(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5) * 300;
    const n2 = noise.noise(Math.cos(angle) * 5, Math.sin(angle) * 5) * 120;
    const n3 = noise.noise(Math.cos(angle) * 10, Math.sin(angle) * 10) * 50;
    const r = Math.max(500, baseR + n1 + n2 + n3);
    pts.push({ x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r });
  }
  // Smooth pass
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < pts.length; i++) {
      const prev = pts[(i - 1 + pts.length) % pts.length];
      const next = pts[(i + 1) % pts.length];
      pts[i] = { x: pts[i].x * 0.6 + (prev.x + next.x) * 0.2, y: pts[i].y * 0.6 + (prev.y + next.y) * 0.2 };
    }
  }
  pts.forEach((p, i) => path.push((i === 0 ? "M" : "L") + Math.round(p.x) + "," + Math.round(p.y)));
  path.push("Z");
  return path.join(" ");
}

/* Generate 5-7 provinces using Voronoi-style subdivision */
function generateProvinces(rng) {
  const provinceCount = 5 + Math.floor(rng() * 3);
  const provinces = [];
  const provinceNames = [
    "Valdheim", "Korfath", "Cyrin", "Selvane", "Tethys",
    "Dremora", "Kelvor", "Caeloth", "Wyndell", "Essear",
    "Fara", "Mistvale", "Oyrin", "Endara", "Korath"
  ];
  const provinceColors = [
    "#ccc088", "#a8b8a0", "#c8b490", "#a0b0b8", "#b8c098",
    "#c4b0a8", "#a8c0b0", "#c8c0a0", "#b0a8b0", "#b8c4a0"
  ];
  // Shuffle names
  const shuffled = [...provinceNames].sort(() => rng() - 0.5);

  // Place seed points for each province, well-spaced
  const seeds = [];
  for (let i = 0; i < provinceCount; i++) {
    let bestX, bestY, bestDist = 0;
    for (let attempt = 0; attempt < 30; attempt++) {
      const angle = (i / provinceCount) * Math.PI * 2 + (rng() - 0.5) * 0.8;
      const dist = 600 + rng() * 700;
      const cx = 3000 + Math.cos(angle) * dist;
      const cy = 2250 + Math.sin(angle) * dist;
      // Check distance from existing seeds
      let minD = Infinity;
      for (const s of seeds) minD = Math.min(minD, Math.hypot(cx - s.x, cy - s.y));
      if (minD > bestDist || seeds.length === 0) { bestDist = minD; bestX = cx; bestY = cy; }
    }
    seeds.push({ x: bestX, y: bestY });
  }

  // Build province shapes as Voronoi cells clipped to a circle
  const noise = new SimplexNoise2D(Math.floor(rng() * 99999));
  for (let i = 0; i < provinceCount; i++) {
    const cx = seeds[i].x, cy = seeds[i].y;
    const segCount = 32;
    const pathPts = [];
    for (let s = 0; s < segCount; s++) {
      const a = (s / segCount) * Math.PI * 2;
      // Expand outward from seed until hitting another province's territory
      let maxR = 1800;
      for (let j = 0; j < provinceCount; j++) {
        if (j === i) continue;
        const dx = seeds[j].x - cx, dy = seeds[j].y - cy;
        const d = Math.hypot(dx, dy);
        const toJ = Math.atan2(dy, dx);
        const angleDiff = Math.abs(((a - toJ + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (angleDiff < Math.PI * 0.55) maxR = Math.min(maxR, d * 0.52);
      }
      const n = noise.noise(Math.cos(a) * 3 + i, Math.sin(a) * 3 + i) * 80;
      const r = maxR + n;
      pathPts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    // Smooth
    for (let pass = 0; pass < 3; pass++) {
      for (let s = 0; s < pathPts.length; s++) {
        const prev = pathPts[(s - 1 + pathPts.length) % pathPts.length];
        const next = pathPts[(s + 1) % pathPts.length];
        pathPts[s] = { x: pathPts[s].x * 0.5 + (prev.x + next.x) * 0.25, y: pathPts[s].y * 0.5 + (prev.y + next.y) * 0.25 };
      }
    }
    const path = pathPts.map((p, s) => (s === 0 ? "M" : "L") + Math.round(p.x) + "," + Math.round(p.y)).join(" ") + " Z";
    provinces.push({
      id: "prov-" + i,
      name: shuffled[i % shuffled.length],
      path,
      labelX: Math.round(cx),
      labelY: Math.round(cy),
      cityX: Math.round(cx - 80 + rng() * 160),
      cityY: Math.round(cy - 80 + rng() * 160),
      spreadX: 350 + Math.floor(rng() * 100),
      spreadY: 250 + Math.floor(rng() * 100),
      fill: provinceColors[i % provinceColors.length]
    });
  }
  return provinces;
}

/* Generate 2-4 mountain ranges with smooth curves */
function generateMountainRanges(rng) {
  const rangeCount = 2 + Math.floor(rng() * 3);
  const ranges = [];

  for (let i = 0; i < rangeCount; i++) {
    const startAngle = rng() * Math.PI * 2;
    const startDist = 500 + rng() * 700;
    const startX = 3000 + Math.cos(startAngle) * startDist;
    const startY = 2250 + Math.sin(startAngle) * startDist;

    const endAngle = startAngle + (rng() - 0.5) * 1.2;
    const endDist = 400 + rng() * 800;
    const endX = 3000 + Math.cos(endAngle) * endDist;
    const endY = 2250 + Math.sin(endAngle) * endDist;

    // Generate multiple control points for a more natural ridge
    const cp1x = startX + (endX - startX) * 0.33 + (rng() - 0.5) * 500;
    const cp1y = startY + (endY - startY) * 0.33 + (rng() - 0.5) * 500;
    const cp2x = startX + (endX - startX) * 0.66 + (rng() - 0.5) * 500;
    const cp2y = startY + (endY - startY) * 0.66 + (rng() - 0.5) * 500;

    const ridge = `M${Math.round(startX)},${Math.round(startY)} C${Math.round(cp1x)},${Math.round(cp1y)} ${Math.round(cp2x)},${Math.round(cp2y)} ${Math.round(endX)},${Math.round(endY)}`;

    ranges.push({ id: "range-" + i, ridge, peaks: [] });
  }
  return ranges;
}

/* Generate 3-5 rivers flowing from highlands toward coast */
function generateRivers(rng, mountainRanges) {
  const rivers = [];
  const riverCount = 3 + Math.floor(rng() * 3);

  for (let i = 0; i < riverCount; i++) {
    // Start near center, flow outward
    const sourceAngle = rng() * Math.PI * 2;
    const sourceDist = 300 + rng() * 600;
    const sourceX = 3000 + Math.cos(sourceAngle) * sourceDist;
    const sourceY = 2250 + Math.sin(sourceAngle) * sourceDist;
    const endDist = 1200 + rng() * 600;
    const endAngle = sourceAngle + (rng() - 0.5) * 0.8;
    const endX = 3000 + Math.cos(endAngle) * endDist;
    const endY = 2250 + Math.sin(endAngle) * endDist;

    const segCount = 5 + Math.floor(rng() * 4);
    let riverPath = `M${Math.round(sourceX)},${Math.round(sourceY)}`;

    for (let s = 1; s <= segCount; s++) {
      const t = s / segCount;
      const x = sourceX + (endX - sourceX) * t + (rng() - 0.5) * 250 * (1 - t * 0.5);
      const y = sourceY + (endY - sourceY) * t + (rng() - 0.5) * 250 * (1 - t * 0.5);
      riverPath += ` L${Math.round(x)},${Math.round(y)}`;
    }

    rivers.push(riverPath);
  }
  return rivers;
}

/* Main generator function */
function generateAtlasData(seed) {
  const rng = mulberry32(typeof seed === "string" ? seed.charCodeAt(0) : seed || Date.now());

  const landPath = generateContinent(rng);

  // Generate islands with noise-based coastlines
  const islands = [];
  const islandCount = 4 + Math.floor(rng() * 4);
  const isleNoise = new SimplexNoise2D(Math.floor(rng() * 99999));
  const islandCenters = [];
  for (let i = 0; i < islandCount; i++) {
    // Place islands in sea areas, avoid overlapping each other
    let isleX, isleY, ok = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      isleX = 500 + rng() * 5000;
      isleY = 400 + rng() * 3600;
      // Check distance from continent center and other islands
      const distFromCenter = Math.hypot(isleX - 3000, isleY - 2250);
      if (distFromCenter < 1600) continue; // too close to mainland
      let tooClose = false;
      for (const ic of islandCenters) { if (Math.hypot(isleX - ic.x, isleY - ic.y) < 350) { tooClose = true; break; } }
      if (!tooClose) { ok = true; break; }
    }
    if (!ok) continue;
    islandCenters.push({ x: isleX, y: isleY });
    const isleSize = 60 + rng() * 130;
    const segs = 24;
    const isleP = [];
    for (let s = 0; s < segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const n = isleNoise.noise(Math.cos(a) * 3 + i * 7, Math.sin(a) * 3 + i * 7) * isleSize * 0.35;
      const r = isleSize * (0.7 + rng() * 0.3) + n;
      isleP.push((s === 0 ? "M" : "L") + Math.round(isleX + Math.cos(a) * r) + "," + Math.round(isleY + Math.sin(a) * r));
    }
    isleP.push("Z");
    islands.push({ path: isleP.join(" "), fill: "#c8bc8e", opacity: 0.92 + rng() * 0.05 });
  }

  // Water bodies (lakes)
  const waterBodies = [];
  const waterCount = 3 + Math.floor(rng() * 2);
  const waterLabels = ["Lake Aster", "Lake Vesper", "Ember Gulf", "Mossfen", "Crystal Mere"];
  for (let i = 0; i < waterCount; i++) {
    const wx = 1600 + rng() * 2800;
    const wy = 1800 + rng() * 1800;
    const wrx = 80 + rng() * 180;
    const wry = 50 + rng() * 120;
    waterBodies.push({
      shape: "ellipse",
      cx: Math.round(wx),
      cy: Math.round(wy),
      rx: Math.round(wrx),
      ry: Math.round(wry),
      label: waterLabels[i % waterLabels.length],
      lx: Math.round(wx),
      ly: Math.round(wy)
    });
  }

  // Provinces
  const provinces = generateProvinces(rng);

  // Mountain ranges
  const mountainRanges = generateMountainRanges(rng);

  // Rivers
  const rivers = generateRivers(rng, mountainRanges);

  // Sea labels — randomized names and positions
  const seaNamePool = ["Sea of Frost", "Sea of Storms", "Sea of Silence", "Pale Sea", "Ashen Sea", "Sea of Winds", "Ember Sea", "Sea of Thorns", "Moonlit Sea"];
  const seaShuffled = [...seaNamePool].sort(() => rng() - 0.5);
  const seaLabels = [
    { x: 400 + Math.round(rng() * 400), y: 1600 + Math.round(rng() * 800), label: seaShuffled[0], rotate: -12 + Math.round((rng() - 0.5) * 20), size: 34, spacing: 8, opacity: 0.34 },
    { x: 5000 + Math.round(rng() * 600), y: 1200 + Math.round(rng() * 800), label: seaShuffled[1], rotate: Math.round((rng() - 0.5) * 20), size: 34, spacing: 8, opacity: 0.34 },
    { x: 2200 + Math.round(rng() * 1600), y: 200 + Math.round(rng() * 400), label: seaShuffled[2] || "Crownwater Expanse", rotate: Math.round((rng() - 0.5) * 10), size: 30, spacing: 10, opacity: 0.22 },
  ];

  // Range labels
  const rangeNamePool = ["Ironspine", "Stormcrown", "Sundered", "Dragonspire", "Frostfang", "Ashenveil", "Thunderpeak", "Wyrmridge"];
  const rangeShuffled = [...rangeNamePool].sort(() => rng() - 0.5);
  const rangeLabels = mountainRanges.map((r, i) => ({
    x: Math.round(parseInt(r.ridge.match(/M(\d+)/)?.[1] || "3000")),
    y: Math.round(parseInt(r.ridge.match(/M\d+,(\d+)/)?.[1] || "2250")),
    label: (rangeShuffled[i % rangeShuffled.length] || "Unknown") + " Range",
    rotate: (rng() - 0.5) * 30
  }));

  // Faction seats (anchors for faction-controlled regions)
  const factionSeats = provinces.map((p, i) => ({
    provinceId: p.id,
    x: p.cityX,
    y: p.cityY,
    spreadX: p.spreadX,
    spreadY: p.spreadY,
    angle: rng() * Math.PI * 2
  }));

  // Free seats (neutral spawning points)
  const freeSeats = [];
  for (let i = 0; i < provinces.length; i++) {
    for (let j = 0; j < 1; j++) {
      freeSeats.push({
        provinceId: provinces[i].id,
        x: provinces[i].labelX + (rng() - 0.5) * 400,
        y: provinces[i].labelY + (rng() - 0.5) * 400,
        spreadX: 250 + rng() * 100,
        spreadY: 180 + rng() * 100,
        angle: rng() * Math.PI * 2
      });
    }
  }

  return {
    landPath,
    islands,
    waterBodies,
    rivers,
    seaLabels,
    rangeLabels,
    mountainRanges,
    provinces,
    factionSeats,
    freeSeats
  };
}

/* Generate campaign regions and factions from atlas province data */
function generateRegionsAndFactions(atlas) {
  const rng = mulberry32(Date.now() + 7777);
  const provinces = atlas.provinces || [];

  // Faction templates — generate 3-5 factions and assign to provinces
  const factionTemplates = [
    { suffix: "Dominion",  attitudes: ["neutral","hostile"],  descs: ["An expansionist empire seeking control","A militant regime enforcing order through strength"], colors: ["#c94040","#a83232"] },
    { suffix: "Accord",    attitudes: ["allied","friendly"],  descs: ["A coalition of free cities united for mutual defense","An alliance of merchants and diplomats"], colors: ["#4a90d9","#a4b5cc"] },
    { suffix: "Circle",    attitudes: ["neutral","friendly"], descs: ["A secretive order of mages and scholars","An ancient cabal studying forbidden lore"], colors: ["#8b50f0","#6b3fa0"] },
    { suffix: "Wardens",   attitudes: ["friendly","neutral"], descs: ["Guardians of the natural world and sacred groves","Druidic protectors of the old ways"], colors: ["#2e8b57","#45a876"] },
    { suffix: "Syndicate", attitudes: ["neutral","hostile"],  descs: ["A powerful trade consortium with shadowy connections","A ruthless guild controlling commerce and information"], colors: ["#d4a017","#e8940a"] },
    { suffix: "Covenant",  attitudes: ["hostile","neutral"],  descs: ["A fanatical cult pursuing dark power","A shadowy brotherhood with sinister aims"], colors: ["#5c2d82","#7b3fa0"] },
    { suffix: "Crown",     attitudes: ["neutral","friendly"], descs: ["The remnants of an ancient monarchy","A noble house clinging to fading glory"], colors: ["T.gold","#b8963f"] },
  ];

  const factionCount = Math.min(Math.max(3, provinces.length - 1), 5);
  const factions = [];
  const usedTemplates = [];

  for (let i = 0; i < factionCount; i++) {
    let tIdx;
    do { tIdx = Math.floor(rng() * factionTemplates.length); } while (usedTemplates.includes(tIdx) && usedTemplates.length < factionTemplates.length);
    usedTemplates.push(tIdx);
    const t = factionTemplates[tIdx];

    // Use a province name as faction name prefix
    const provName = provinces[i % provinces.length]?.name || "Unknown";
    const shortName = provName.length > 6 ? provName.slice(0, Math.ceil(provName.length * 0.6)) : provName;

    factions.push({
      id: i + 1,
      name: shortName + " " + t.suffix,
      attitude: t.attitudes[Math.floor(rng() * t.attitudes.length)],
      power: 30 + Math.floor(rng() * 60),
      trend: ["rising","stable","declining"][Math.floor(rng() * 3)],
      desc: t.descs[Math.floor(rng() * t.descs.length)],
      color: t.colors[Math.floor(rng() * t.colors.length)],
    });
  }

  // Region types to assign based on province features
  const regionTypes = ["kingdom","city","wilderness","town","dungeon","route"];
  const threatLevels = ["low","medium","high","extreme"];
  const stateDescriptions = ["stable","tense","rebuilding","corrupted","prosperous","dangerous","contested"];

  const regions = provinces.map((prov, i) => {
    // Assign controlling faction — first N provinces get factions, rest are contested/neutral
    const controllingFaction = i < factions.length ? factions[i].name : (factions.length > 0 ? factions[Math.floor(rng() * factions.length)].name : "Unaligned");
    const type = i === 0 ? "capital" : regionTypes[Math.floor(rng() * regionTypes.length)];
    const threat = threatLevels[Math.floor(rng() * threatLevels.length)];
    const state = stateDescriptions[Math.floor(rng() * stateDescriptions.length)];

    return {
      id: i + 1,
      name: prov.name,
      type: type,
      ctrl: controllingFaction,
      threat: threat,
      state: state,
      visited: i === 0,
    };
  });

  return { regions, factions };
}

/* ── Name generation pools for NPCs ── */
const FIRST_NAMES_M = [
  "Aldric","Bran","Cedric","Darius","Edmund","Fendrel","Gareth","Haldor","Isen","Jareth","Kael","Lucian","Mordecai","Noran","Orin","Percival","Roderic","Soren","Theron","Ulric","Vance","Willem","Xander","Yorin","Zarek","Alaric","Brynn","Caius","Draven","Elric","Finn","Gideon","Harlan","Ivo","Jasper",
  "Thaddeus","Ragnar","Osric","Leander","Corwin","Dorian","Emeric","Balthazar","Ambrose","Caspian","Desmond","Evander","Florian","Griffith","Hadrian","Ignatius","Julius","Kellan","Lothar","Magnus","Nikolai","Oberon","Peregrine","Quentin","Reinhardt","Silas","Tobias","Ulysses","Viktor","Wolfgang",
  "Aeron","Bastian","Callum","Dante","Erasmus","Fabian","Gunnar","Henrik","Idris","Joachim","Kaspar","Lysander","Matthias","Nigel","Orion","Phelan","Raimund","Stellan","Tristan","Ulfric","Valerian","Wulfric","Yves","Zenon","Alistair","Benedict","Cassius","Dmitri","Ezekiel","Felix",
  "Godric","Hamish","Ingmar","Jorah","Koenraad","Lorcan","Merrick","Navarre","Oswin","Priam","Roland","Severin","Tybalt","Vaughan","Werner","Adhemar","Benoit","Cormac","Duncan","Eamon","Faramond","Gwydion","Hugo","Ivan","Jerrik","Kiran","Luther","Marcellus","Nils","Osbert",
  "Piers","Raghnall","Sigmund","Tormund","Viggo","Aldhelm","Byrne","Colm","Drystan","Edric","Finnbar","Gawain","Hector","Ilmar","Justinian","Konstantin","Lachlan","Malakai","Niall","Osmund",
  "Arwel","Blayke","Craven","Dillon","Evin","Falk","Garrett","Hayward","Ivor","Jeremiah","Keegan","Lysias","Marlowe","Nathaniel","Orson","Piran","Quade","Rainer","Severus","Thaddeus","Uther","Varmion","Wade","Ximenes","Yoren","Zachariah","Arvid","Brennus","Caelix","Dashir","Euric","Feliks","Gideon","Hadrien","Irwin","Jurgen","Kaveh","Leofric","Marvin","Nathaniel","Oswin","Paxon"
];
const FIRST_NAMES_F = [
  "Alara","Brielle","Celia","Daphne","Elara","Freya","Gwendolyn","Helena","Isolde","Jaina","Kaida","Lyra","Miriel","Nessa","Ophira","Petra","Rhiannon","Sera","Thalia","Ursa","Vespera","Wren","Xylia","Yara","Zara","Astrid","Brigid","Cassara","Dahlia","Elowen","Faye","Giselle","Hestia","Iris","Juno",
  "Aveline","Branwen","Calista","Delphine","Eira","Fiora","Galatea","Honoria","Ianthe","Jessamine","Kerensa","Liora","Morrigan","Nerissa","Octavia","Primrose","Rowena","Saoirse","Tamsin","Undine","Vivianne","Wynne","Xanthe","Ysabel","Zelda",
  "Amaranth","Beatrix","Cordelia","Dorothea","Evangeline","Fenella","Guinevere","Hildegard","Imogen","Juliana","Katarina","Lorelei","Marguerite","Nimue","Oleander","Penelope","Rosalind","Seraphina","Thessaly","Ulyana","Valentina","Winifred","Xiomara","Yvaine","Zinnia",
  "Adeline","Briar","Cressida","Desdemona","Elspeth","Felicity","Gretchen","Hermione","Ingrid","Johanna","Kestrel","Lenore","Marigold","Niamh","Oriana","Persephone","Ravenna","Sylvana","Tatiana","Una","Viveka","Willow","Ygritte","Adelaide","Bronwyn",
  "Camellia","Diantha","Eowyn","Ffion","Ginevra","Helewise","Idalia","Jovana","Kenna","Lavinia","Melusine","Nadira","Olwen","Philippa","Ragnhild","Sigrid","Theodora","Urielle","Venetia","Wisteria",
  "Amalia","Beatrice","Celeste","Danielle","Emilia","Fiona","Giselle","Hazel","Iris","Josephine","Kiara","Lydia","Magnolia","Nadia","Opal","Piper","Quinley","Rosalie","Sabina","Tatanya","Ulvida","Valeria","Winifred","Xiola","Yvonne","Zelinda","Anastasia","Bella","Celestine","Darla","Esme","Felicity","Gaia","Henrietta","Ivette","Josephina","Kassandra"
];
const LAST_NAMES = [
  "Blackwood","Ironforge","Stormwind","Ashworth","Greymane","Thornwall","Darkholme","Brightblade","Ravencrest","Nightshade","Goldmantle","Silverthorn","Wyrmwood","Frostborn","Emberheart","Oakenshield","Duskwalker","Stoneheart","Hawkridge","Moonvale","Dawnbringer","Whitecrest","Shadowmere","Firebrand","Steelhand","Wolfsbane","Coldstream","Starfall","Highcastle","Deepwater",
  "Ashford","Blackthorn","Cravenholm","Dunsworth","Eldergrove","Foxglove","Greymark","Halloway","Irontree","Kettleburn","Lockwood","Mossgrove","Northwind","Oakhart","Pinehurst","Queensbury","Redmane","Silverlock","Thistledown","Underhill","Vornheim","Winterbourne","Yarrow","Ashenmoor","Bloodworth",
  "Crowshield","Driftwood","Everstone","Farrow","Grimshaw","Hollowbone","Inkwell","Jarnskald","Keelhaul","Longspear","Mirewood","Nighthollow","Oxbridge","Proudfoot","Quicksilver","Rowntree","Sandstone","Thornberry","Urswick","Vexmoor","Wychwood","Yellandor","Zephyrstone","Ashencroft","Barrowmere",
  "Cindervale","Deepholm","Eaglecrest","Flintshire","Goldwater","Heathcliff","Icemantle","Jadecrest","Kingsley","Lionsgate","Marshwood","Nethervane","Oathkeeper","Pendrake","Rosethorne","Sunforge","Tidewater","Umberstone","Valecross","Windhollow","Yewthorn","Aldervale","Brokenshire","Copperhelm",
  "Darkmoor","Edgewood","Fennwick","Greenbough","Hartwell","Ivywood","Jadewind","Kestrelmark","Lakewood","Moorehead","Northcott","Oldcastle","Pyreforge","Ravenshaw","Sablewood","Trueblood","Ulverstone","Voidhart","Woodhaven",
  "Aythmoor","Balefrost","Cavernspire","Drakethorne","Everthorn","Foreveil","Graveston","Hearthfire","Icehold","Jewelstone","Kindleworth","Longwick","Mourngate","Nethercross","Oathstone","Peaksworth","Questor","Ravenstein","Stormforge","Timewick","Valisworth","Westmarch","Yawnhollow","Zenithrest","Ashenbrand"
];
const NPC_ROLES = {
  ruler: ["King","Queen","High King","High Queen","Sovereign","Archduke","Archduchess","Warlord","Grand Sultan","Sultana","Pharaoh","Shogun","Chieftain","Grand Matriarch","Grand Patriarch"],
  heir: ["Crown Prince","Crown Princess","Prince","Princess","Heir Apparent","Royal Scion","First-Born","Blood Heir","Chosen Successor","Ward of the Throne"],
  general: ["General","War Marshal","Commander","Warlord","Battle-Master","Shield-Captain","Grand Tactician","Siege Marshal","Knight Imperator","Iron Commander","Blade Warden","Lord Protector","Centurion-General"],
  advisor: ["Royal Advisor","Court Wizard","High Counselor","Spymaster","Lord Chancellor","Grand Vizier","Master of Whispers","Keeper of Secrets","Royal Seneschal","Court Seer","Minister of Coin","Chamberlain"],
  religious: ["High Priest","High Priestess","Oracle","Temple Guardian","Archbishop","Hierophant","Prelate","Inquisitor","Abbess","Abbot","Cardinal","Prophet","Seer","Shrine Keeper","Exarch"],
  merchant: ["Guild Master","Trade Baron","Merchant Prince","Harbor Master","Coin Lord","Auction Marshal","Grand Broker","Fleet Admiral","Caravan Master","Exchange Lord","Silk Baron","Spice Trader","Master Appraiser"],
  criminal: ["Thieves' Guild Master","Smuggler Lord","Shadow Broker","Crime Boss","Poison Master","Fence King","Rat Catcher","Night Baron","Underground Lord","Master Forger","Shadow Hand","Corsair Captain"],
  scholar: ["Archmage","Lorekeeper","Head Librarian","Court Astronomer","Sage","Grand Archivist","Cartographer Royal","Alchemist Supreme","Magister","Dean of Arcana","Chronicler","Runesmith","Herbmaster"],
  military: ["Captain of the Guard","Knight Commander","Ranger Captain","Siege Master","Watch Commander","Wall Warden","Cavalry Marshal","Scout Master","Garrison Commander","Shield-Bearer","Fort Keeper","Patrol Sergeant"],
  noble: ["Duke","Duchess","Baron","Baroness","Count","Countess","Lord","Lady","Marquis","Marquise","Viscount","Viscountess","Earl","Palatine","Landgrave"],
  commoner: ["Innkeeper","Blacksmith","Healer","Farmer","Merchant","Hunter","Bard","Herbalist","Baker","Brewer","Tanner","Cobbler","Chandler","Stable Master","Fisherman","Woodcutter","Miner","Miller","Weaver","Potter","Mason","Carpenter","Cook","Ferryman","Gravedigger","Lamplighter","Rat Catcher","Town Crier","Midwife","Shepherd"],
};
const NPC_TRAITS = [
  "cunning","loyal","ambitious","paranoid","charismatic","ruthless","wise","honorable","secretive","merciful","vengeful","scholarly","pious","decadent","stoic","reckless","diplomatic","superstitious",
  "brooding","jovial","calculating","hot-tempered","patient","greedy","generous","cowardly","brave","melancholic","eccentric","pragmatic","idealistic","cynical","trusting","suspicious","devout","hedonistic",
  "soft-spoken","boisterous","methodical","impulsive","humble","proud","compassionate","cold","witty","grim","cheerful","sardonic","fearful","bold","manipulative","genuine","obsessive","forgetful",
  "stubborn","adaptable","mysterious","forthright","jealous","content","restless","serene","anxious","confident","insecure","creative","traditional","rebellious","dutiful","independent","romantic","practical",
];
const NPC_SECRETS = [
  "Secretly plots to overthrow the current ruler",
  "Has a forbidden pact with a dark entity",
  "Is actually a shapeshifter in disguise",
  "Possesses a powerful artifact they keep hidden",
  "Has a spy network across multiple regions",
  "Owes a life debt to an enemy faction",
  "Is the last heir of a destroyed royal line",
  "Carries a curse that slowly spreads to those nearby",
  "Has been blackmailed by a rival for years",
  "Discovered the location of an ancient dungeon",
  "Is secretly funding a rebel movement",
  "Has a twin sibling no one knows about",
  "Made a deal with a dragon for protection",
  "Keeps a journal detailing every faction's weaknesses",
  "Was once an adventurer who retired after a traumatic quest",
  "Secretly worships a forbidden god",
  "Has been replaced by a doppelganger — the real one is imprisoned",
  "Stole their identity from someone they murdered years ago",
  "Is slowly being possessed by a sentient weapon",
  "Knows the true name of a demon and uses it for leverage",
  "Witnessed the king commit a crime and has stayed silent for a price",
  "Has a map to a dragon's hoard tattooed on their back",
  "Smuggles refugees across borders using hidden tunnels",
  "Is an agent of a foreign power sent to destabilize the region",
  "Made an oath to a dying knight to protect something they don't understand",
  "Has visions of the future but tells no one because they always end in disaster",
  "Accidentally killed their mentor and covered it up as an accident",
  "Is addicted to a rare and illegal alchemical substance",
  "Discovered evidence that the church's holy text was forged",
  "Secretly maintains correspondence with an exiled tyrant",
  "Has been dead for years — sustained by necromantic magic they don't know about",
  "Owes a massive gambling debt to a dangerous crime lord",
  "Keeps a prisoner locked in their cellar that nobody knows about",
  "Can hear the whispers of the dead and it's slowly driving them mad",
  "Has a child they've never met, raised in a distant land",
  "Was cursed by a witch to never be able to tell a lie",
  "Possesses the only key to an ancient sealed vault beneath the city",
  "Is slowly going blind but hides it from everyone",
  "Made a blood pact with another NPC — if one dies, the other follows",
  "Discovered a rift to another plane hidden in a local cave",
  "Runs an underground crime operation from the city basement",
  "Is actually underage but magically aged to appear older",
  "Stole the identity of their spouse and the real one is plotting revenge",
  "Is secretly in love with someone from a rival faction",
  "Was involved in an assassination that changed the course of history",
  "Possesses a grimoire containing forbidden summonings",
  "Is a werewolf whose transformation is becoming harder to control",
  "Has a secret illegitimate child with a noble from a warring house",
  "Receives orders from a mysterious masked figure who appears in dreams",
  "Accidentally unleashed a plague that killed thousands",
  "Is being blackmailed by their own child",
  "Witnessed the true death of a supposedly immortal being",
  "Has been slowly poisoning their rival for three years",
  "Possesses a contract signed in blood that will activate upon their death",
  "Is slowly being replaced piece by piece with clockwork",
  "Discovered their entire childhood was an elaborate fabrication",
  "Maintains a hidden sanctuary for persecuted refugees",
  "Has a standing kill order from a mercenary guild they once wronged",
  "Is the illegitimate half-sibling of the current ruler",
  "Stole a sacred relic and buried it to prevent its misuse",
  "Can perfectly mimic anyone's handwriting and uses it to forge documents",
  "Is an escaped experiment from a mad wizard's tower",
  "Secretly funds the very rebellion they are sworn to crush",
  "Has a parasitic entity living inside them that grants power but feeds on their life force",
  "Witnessed the true nature of a god and it broke their faith",
  "Is being hunted by a dragon they once wronged",
  "Discovered a lost language written in the stars that only they can read",
  "Has a hidden wardrobe of costumes and assumes different identities at night",
  "Is slowly becoming more fey and less human",
  "Owes their life to a demonic patron they meet with in secret",
  "Has been cursed to only speak in riddles after sunset",
  "Discovered their reflection has been replaced by something else",
  "Is secretly pregnant and hiding it from everyone",
  "Has a collection of cursed objects they compulsively steal",
  "Was once a famous adventurer thought to be dead",
  "Is being impersonated by a doppelganger who is a better person",
  "Receives visions from a god who should be dead",
  "Is slowly consuming the memories of everyone they touch",
  "Has a hidden vault containing artifacts from a fallen civilization",
  "Was involved in a coup that no one suspects them of",
  "Is being hunted by a religious order for forbidden knowledge they possess",
  "Discovered they are a thrall to an ancient vampire",
  "Has a secret identity as a legendary monster that only surfaces at night",
  "Is slowly turning to stone from a curse that began years ago",
  "Was their parents' second choice and their sibling knows the truth",
  "Has been feeding information to an organization bent on destabilizing the realm",
  "Possesses the ability to kill with a single touch and hides it",
  "Is slowly losing their mind to an enchantment placed on them in childhood",
  "Has a secret lover in each of the major cities they frequently visit",
  "Is actually centuries old despite appearing youthful",
  "Discovered evidence of their spouse's infidelity and is seeking vengeance",
  "Has a hidden cult of personality worshipping them in the lower city",
  "Is slowly fading from existence due to a magic accident",
  "Was offered a deal by death itself and accepted",
  "Has a prophecy tattooed on their body that is starting to come true",
  "Is being controlled by magical puppet strings they cannot detect",
  "Discovered they are the child of a god and a mortal",
  "Has been slowly collecting the pieces of a ritual that will change everything",
  "Is haunted by a ghost that only they can see and is becoming unstable",
  "Was once part of an elite assassination order and still receives their missions",
  "Has successfully hidden a major city from the maps",
  "Is slowly becoming a lich through an accidental ritual",
  "Discovered that their trusted advisor is actually an ancient extraplanar being",
  "Has a secret treaty with a kingdom that would cause war if revealed",
];

/* ── City generation pools ── */
const SHOP_TYPES = [
  "General Store","Blacksmith","Apothecary","Alchemist","Weaponsmith","Armorsmith","Jeweler","Tailor","Enchanter",
  "Herbalist","Bookshop","Pawnbroker","Fletcher","Leatherworker","Chandler","Cartographer","Tinkerer","Brewer",
  "Exotic Imports","Rune Carver","Scroll Merchant","Curiosities & Oddities","Stable & Mounts","Trapper & Pelts",
  "Sacred Relics","Poisoner's Den","Toymaker","Glassblower","Stonemason","Shipwright","Rope & Sail","Locksmith",
];
const SHOP_NAME_PRE = [
  "The Golden","The Silver","The Iron","The Rusty","The Gilded","The Crimson","The Old","The Crooked","The Lucky",
  "The Wandering","The Dusty","The Shining","The Hidden","The Cracked","The Midnight","The Howling","The Quiet",
  "The Ember","The Thorned","The Brass","The Copper","The Frosted","The Moonlit","The Drunken","The Blind",
];
const SHOP_NAME_SUF = [
  "Anvil","Cauldron","Lantern","Shield","Coin","Flask","Hammer","Needle","Scroll","Barrel","Compass","Feather",
  "Bell","Crown","Dagger","Goblet","Key","Mirror","Pestle","Ring","Saddle","Tome","Wand","Wheel","Cask",
];
const ITEM_POOLS = {
  weapon: [
    { name:"Iron Longsword", price:"15 gp", rarity:"common" },{ name:"Steel Shortsword", price:"10 gp", rarity:"common" },
    { name:"Oaken Longbow", price:"50 gp", rarity:"common" },{ name:"Dwarven Warhammer", price:"25 gp", rarity:"common" },
    { name:"Elven Rapier", price:"30 gp", rarity:"uncommon" },{ name:"Silver Dagger", price:"40 gp", rarity:"uncommon" },
    { name:"Crossbow, Heavy", price:"50 gp", rarity:"common" },{ name:"Battleaxe", price:"10 gp", rarity:"common" },
    { name:"Flaming Blade", price:"350 gp", rarity:"rare" },{ name:"Frost Brand Spear", price:"400 gp", rarity:"rare" },
    { name:"Poisoned Stiletto", price:"75 gp", rarity:"uncommon" },{ name:"Mithril Scimitar", price:"500 gp", rarity:"rare" },
    { name:"Quarterstaff of the Owl", price:"120 gp", rarity:"uncommon" },{ name:"Javelin of Lightning", price:"250 gp", rarity:"rare" },
    { name:"Halberd", price:"20 gp", rarity:"common" },{ name:"Pike", price:"5 gp", rarity:"common" },
    { name:"Elf Blade", price:"35 gp", rarity:"uncommon" },{ name:"Greatsword", price:"50 gp", rarity:"common" },
    { name:"Sabre", price:"25 gp", rarity:"common" },{ name:"Whip", price:"2 gp", rarity:"common" },
    { name:"Sword of Undead Slaying", price:"300 gp", rarity:"uncommon" },{ name:"Adamantine Greataxe", price:"650 gp", rarity:"rare" },
    { name:"Bow of the Wind", price:"275 gp", rarity:"uncommon" },{ name:"Wand of Scorching", price:"180 gp", rarity:"uncommon" },
  ],
  armor: [
    { name:"Leather Armor", price:"10 gp", rarity:"common" },{ name:"Chain Shirt", price:"50 gp", rarity:"common" },
    { name:"Studded Leather", price:"45 gp", rarity:"common" },{ name:"Scale Mail", price:"50 gp", rarity:"common" },
    { name:"Half Plate", price:"750 gp", rarity:"uncommon" },{ name:"Shield, Wooden", price:"7 gp", rarity:"common" },
    { name:"Cloak of Protection", price:"300 gp", rarity:"uncommon" },{ name:"Mithril Breastplate", price:"800 gp", rarity:"rare" },
    { name:"Shield of Arrow Catching", price:"600 gp", rarity:"rare" },{ name:"Boots of Elvenkind", price:"250 gp", rarity:"uncommon" },
    { name:"Full Plate", price:"1500 gp", rarity:"uncommon" },{ name:"Plate Armor", price:"1500 gp", rarity:"uncommon" },
    { name:"Ring of Protection", price:"200 gp", rarity:"uncommon" },{ name:"Elven Chain", price:"550 gp", rarity:"rare" },
    { name:"Adamantine Plate", price:"2000 gp", rarity:"rare" },{ name:"Leather of Animal Friendship", price:"175 gp", rarity:"uncommon" },
    { name:"Helm of Comprehending Languages", price:"500 gp", rarity:"uncommon" },{ name:"Cloak of Arachnida", price:"600 gp", rarity:"rare" },
  ],
  potion: [
    { name:"Healing Potion", price:"50 gp", rarity:"common" },{ name:"Greater Healing Potion", price:"150 gp", rarity:"uncommon" },
    { name:"Potion of Fire Resistance", price:"200 gp", rarity:"uncommon" },{ name:"Antitoxin", price:"50 gp", rarity:"common" },
    { name:"Potion of Invisibility", price:"300 gp", rarity:"rare" },{ name:"Elixir of Health", price:"120 gp", rarity:"uncommon" },
    { name:"Potion of Speed", price:"350 gp", rarity:"rare" },{ name:"Potion of Giant Strength", price:"450 gp", rarity:"rare" },
    { name:"Oil of Slipperiness", price:"100 gp", rarity:"uncommon" },{ name:"Philter of Love", price:"90 gp", rarity:"uncommon" },
    { name:"Potion of Cold Resistance", price:"200 gp", rarity:"uncommon" },{ name:"Potion of Courage", price:"120 gp", rarity:"uncommon" },
    { name:"Potion of Growth", price:"180 gp", rarity:"uncommon" },{ name:"Potion of Shrinking", price:"170 gp", rarity:"uncommon" },
    { name:"Potion of Water Breathing", price:"200 gp", rarity:"uncommon" },{ name:"Superior Healing Potion", price:"300 gp", rarity:"uncommon" },
  ],
  scroll: [
    { name:"Scroll of Identify", price:"25 gp", rarity:"common" },{ name:"Scroll of Detect Magic", price:"25 gp", rarity:"common" },
    { name:"Scroll of Fireball", price:"200 gp", rarity:"uncommon" },{ name:"Scroll of Cure Wounds", price:"25 gp", rarity:"common" },
    { name:"Scroll of Shield", price:"50 gp", rarity:"common" },{ name:"Scroll of Dispel Magic", price:"150 gp", rarity:"uncommon" },
    { name:"Scroll of Raise Dead", price:"500 gp", rarity:"rare" },{ name:"Scroll of Teleport", price:"600 gp", rarity:"rare" },
    { name:"Scroll of Magic Missile", price:"35 gp", rarity:"common" },{ name:"Scroll of Mage Armor", price:"40 gp", rarity:"common" },
    { name:"Scroll of Invisibility", price:"250 gp", rarity:"uncommon" },{ name:"Scroll of Charm Person", price:"60 gp", rarity:"common" },
    { name:"Scroll of Polymorph", price:"350 gp", rarity:"rare" },{ name:"Scroll of Meteor Swarm", price:"750 gp", rarity:"very rare" },
  ],
  general: [
    { name:"Rope, 50 ft", price:"1 gp", rarity:"common" },{ name:"Torch (10)", price:"1 gp", rarity:"common" },
    { name:"Rations (7 days)", price:"3.5 gp", rarity:"common" },{ name:"Bedroll", price:"1 gp", rarity:"common" },
    { name:"Tinderbox", price:"5 sp", rarity:"common" },{ name:"Waterskin", price:"2 sp", rarity:"common" },
    { name:"Backpack", price:"2 gp", rarity:"common" },{ name:"Lantern, Hooded", price:"5 gp", rarity:"common" },
    { name:"Grappling Hook", price:"2 gp", rarity:"common" },{ name:"Healer's Kit", price:"5 gp", rarity:"common" },
    { name:"Spyglass", price:"1000 gp", rarity:"uncommon" },{ name:"Component Pouch", price:"25 gp", rarity:"common" },
    { name:"Lockpicks", price:"25 gp", rarity:"common" },{ name:"Crowbar", price:"2 gp", rarity:"common" },
    { name:"Caltrops", price:"1 gp", rarity:"common" },{ name:"Manacles", price:"5 gp", rarity:"common" },
  ],
  exotic: [
    { name:"Bag of Holding", price:"500 gp", rarity:"rare" },{ name:"Immovable Rod", price:"300 gp", rarity:"uncommon" },
    { name:"Sending Stones (pair)", price:"350 gp", rarity:"uncommon" },{ name:"Decanter of Endless Water", price:"400 gp", rarity:"uncommon" },
    { name:"Goggles of Night", price:"200 gp", rarity:"uncommon" },{ name:"Rope of Climbing", price:"250 gp", rarity:"uncommon" },
    { name:"Drift Globe", price:"180 gp", rarity:"uncommon" },{ name:"Amulet of Proof against Detection", price:"500 gp", rarity:"rare" },
    { name:"Portable Hole", price:"600 gp", rarity:"rare" },{ name:"Wand of Fireballs", price:"700 gp", rarity:"rare" },
    { name:"Cloak of Invisibility", price:"1500 gp", rarity:"very rare" },{ name:"Eyes of Minute Seeing", price:"250 gp", rarity:"uncommon" },
    { name:"Eversmoking Bottle", price:"150 gp", rarity:"uncommon" },{ name:"Feather Token", price:"350 gp", rarity:"uncommon" },
  ],
};
const TAVERN_NAMES_PRE = [
  "The Prancing","The Drunken","The Golden","The Rusty","The Jolly","The Weary","The Laughing","The Sleeping",
  "The Dancing","The Howling","The Stumbling","The Tipsy","The Broken","The Roaring","The Crooked","The Silent",
];
const TAVERN_NAMES_SUF = [
  "Pony","Dragon","Stag","Boar","Griffin","Fox","Hound","Bear","Serpent","Raven","Cock","Cat","Wolf","Goat","Mare","Owl",
];
const INN_SERVICES = [
  { name:"Common Room Bed", price:"5 cp/night" },{ name:"Private Room", price:"5 sp/night" },
  { name:"Suite", price:"2 gp/night" },{ name:"Hot Meal", price:"3 cp" },
  { name:"Ale (pint)", price:"4 cp" },{ name:"Wine (glass)", price:"2 sp" },
  { name:"Fine Wine (bottle)", price:"10 gp" },{ name:"Stabling (per mount)", price:"5 sp/night" },
  { name:"Bath", price:"1 sp" },{ name:"Laundry", price:"2 cp" },
];
const QUEST_HOOKS = [
  "A mysterious stranger offers a map to a lost ruin",
  "Missing merchants have been vanishing on the trade road",
  "Strange lights appear in the forest every full moon",
  "A local mine has broken through into something ancient",
  "The town well has been poisoned — someone must find the source",
  "A bounty has been posted for a notorious bandit leader",
  "Children claim a ghost haunts the old watchtower",
  "A caravan needs guards for a dangerous mountain crossing",
  "An heirloom was stolen from a noble family — they want it back discreetly",
  "Livestock are being mutilated at night near the eastern farms",
  "A sealed tomb beneath the temple has been broken open",
  "Refugees from a neighboring region bring tales of a growing darkness",
  "The local lord's heir has gone missing during a hunting trip",
  "A rival guild is sabotaging shipments — proof is needed",
  "An ancient dragon has been spotted circling the peaks",
  "Pirates have blockaded the harbor and demand tribute",
  "A cursed artifact was found in the market — strange events follow",
  "The bridge to the next town collapsed — something did it deliberately",
  "A plague of rats is overwhelming the granaries before winter",
  "A prophet warns of doom unless a relic is recovered from the wastes",
  "Two factions are on the brink of war — someone must mediate or choose a side",
  "A wealthy patron seeks rare ingredients from a dangerous location",
  "Undead have been rising from the old battlefield on the outskirts",
  "The local thieves' guild wants help with a heist — for a noble cause",
  "A powerful wizard has gone mad and barricaded themselves in their tower",
  "An earthquake revealed hidden catacombs beneath the city streets",
  "A traveling circus has arrived — but performers keep disappearing",
  "Fishermen report a sea creature destroying boats in the bay",
  "The annual tournament needs champions — the prize is a noble title",
  "A forbidden book has surfaced in the black market with dangerous knowledge",
  "A cult is recruiting in the lower city and must be stopped before an event occurs",
  "A noble has been kidnapped and a ransom is being demanded in stolen goods",
  "Monsters are migrating through the region — travelers must be warned",
  "A famous artifact has been authenticated in a private collection — the owner will trade for favors",
  "Strange monsters are being sighted in the city sewers",
  "The local lord's favorite hound has vanished and they offer a substantial reward",
  "A political scandal is brewing that could topple the current government",
  "Slave traders are operating in secret — someone must gather evidence",
  "A shipment of valuable cargo went missing — tracking it down could be profitable",
  "The mayor's embezzlement scheme is about to be discovered by enemies",
  "A secret passage under the city is being used by smugglers",
  "Someone is impersonating a noble and committing crimes in their name",
  "A prophecy about the town's destruction is creating mass hysteria",
  "Mercenaries from out of region have arrived for unknown purposes",
  "A library contains forbidden knowledge that several factions want",
  "Monsters are being herded deliberately toward populated areas",
  "A locksmith's secret stash of master keys has been stolen",
  "The city guard captain is secretly working for a criminal syndicate",
  "A merchant princess's fleet is being attacked by coordinated pirates",
  "Alchemical explosions are destroying warehouses in the docks",
  "A haunted mansion holds the key to an unsolved murder from decades ago",
  "Rival merchants are poisoning each other's goods in a trade war",
  "A former adventurer is building an army in the wilderness",
  "The city's water supply is being contaminated deliberately",
  "A powerful mage's tower is sinking into the ground for unexplained reasons",
  "Exotic animals are escaping from a merchant's menagerie",
  "A noble family's dirty secrets could reshape the political landscape",
  "Monster parts are appearing on the black market from an unknown source",
  "A missing expedition needs to be found before it's too late",
  "Someone is systematically eliminating a noble's heirs",
  "A thief's guild is planning a massive coordinated robbery",
  "A dragon's egg has been discovered in the mountains",
  "Cultists are performing rituals that are weakening a protective ward",
  "A merchant caravan is assembling for a desperate journey to reclaim a debt",
  "Someone is creating undead servants in the city crypts",
  "A war is brewing over territorial boundaries between factions",
  "A circus is cover for a spy operation gathering intelligence",
  "Bandits are attacking only merchant caravans carrying specific goods",
  "A paladin has gone rogue and is hunting former allies",
  "Strange plague is turning people into mindless thralls",
  "A clockwork construct is malfunctioning and causing destruction",
  "Demon summoners are performing rituals beneath the cathedral",
  "A noble is secretly funding an expedition to find mythical ruins",
  "Someone is using blood magic to control influential people",
  "Werewolves are terrorizing the outlying villages",
  "A rival mage academy is sabotaging the city's academic institutions",
  "Treasure hunters are converging on a location indicated by ancient maps",
  "A political assassination is being planned and must be prevented",
  "An exiled noble seeks to reclaim their throne through force",
  "Someone is systematically poisoning the city's crops",
  "A group of escaped prisoners is taking hostages and making demands",
  "A bounty has been placed on a mysterious figure affecting city politics",
  "Strange disappearances are linked to a forgotten underground temple",
  "A wealthy collector seeks components for a forbidden artifact",
  "Someone is blackmailing influential people with compromising information",
];
const CITY_FEATURES = [
  "Grand Cathedral","Bustling Market Square","Ancient Library","Mage's College","Gladiatorial Arena",
  "Thieves' Quarter","Noble District","Dwarven Quarter","Elven Embassy","Harbor District",
  "Underground Tunnels","Walled Inner City","Plague Ward","Garden of Remembrance","Royal Palace",
  "Merchant's Exchange","Artisan Row","Foreign Quarter","Military Barracks","Astronomical Observatory",
  "Underground Fighting Pit","Hanging Gardens","Sewer Network","Dragon Skull Monument","Sacred Grove",
  "Clockwork District","Refugee Camp","Haunted Ruins","Festival Grounds","Bridge Market",
  "Grand Theatre","University District","Copper Mines","Shipyard Quarter","Temples of Seven Gods",
  "Black Market Alley","Wizard's Tower","Knight's Academy","Tavern Row","Fishermen's Wharf",
  "Grand Fountain Square","Slave Block","Beast Pens","Alchemy District","Archive Vault",
  "Prison Tower","Sacred Catacombs","Brothel District","Weaponsmith's Guild","Healer's Circle",
  "Grand Bazaar","Executioner's Square","Coliseum","Crown Jewels Museum","Plague Pits",
  "Grand Canal","Witch's Wood","Necropolis Gate","Coin Mint","Cartographer's Hall",
  "Alchemist's Guild","Brewers' Cooperative","Stone Quarries","Gem District","Silk Street",
  "War Memorial","Courthouse","Asylum Tower","Beast Market","Rune Circles",
  "Old Town Wall","Thieves' Landing","Dungeon Depths","Crown Gardens","Temple of War",
  "River Port","Shadow District","Archives Hall","Magistrate's Palace","Craftsmen Square",
];


// ── POI Lore & Quest Data ──
const POI_LORE = {
  Ruins: [
    "Once a thriving settlement, now reduced to crumbling walls and overgrown courtyards. The stone bears scorch marks from an ancient siege that razed the city in a single night. Charred timber beams still jut from collapsed doorways like broken ribs.",
    "Explorers report strange carvings on the walls that glow faintly at dusk. The architecture predates any known civilization by thousands of years. Some symbols match no language ever cataloged.",
    "Scattered bones and rusted armor suggest a final desperate battle was fought here centuries ago. The dead were never buried — they fell where they stood, swords still clutched in skeletal hands.",
    "Vines and moss have claimed most of the stonework, but one chamber remains impossibly clean. No dust settles on its polished floor, and footsteps echo as if in a much larger space.",
    "The ruins shift subtly when no one is watching. Passages that led north yesterday now face east. Mapmakers have gone mad trying to chart the interior.",
  ],
  Fortress: [
    "An imposing stronghold built into the cliff face, its gates sealed by mechanisms long forgotten. Arrow slits still watch the approach, and some swear they've seen movement behind them.",
    "This abandoned fortress was once the seat of a warlord whose name has been deliberately erased from all records. Every portrait was burned, every inscription chiseled away. Someone wanted the world to forget.",
    "The walls still hold despite centuries of neglect. Locals whisper that something within keeps the stones from crumbling — a binding spell woven into the mortar itself.",
    "A military engineering marvel with interlocking kill zones and hidden sally ports. The garrison vanished overnight but left the armory fully stocked, as if expecting to return.",
    "The fortress straddles a strategic mountain pass, its twin towers connected by a bridge of iron and stone. The wind howls through its corridors like the screams of its former inhabitants.",
  ],
  Temple: [
    "A solemn place of worship to a forgotten deity. The altar still radiates a faint warmth despite no flame having burned here in ages. Offerings left at dawn vanish by dusk.",
    "Pilgrims once traveled great distances to receive blessings here. The stained glass windows depict prophecies yet to be fulfilled — scenes of fire, flood, and a crowned figure rising from the sea.",
    "The temple's inner sanctum is sealed behind a door of solid adamantine. No force or magic has been able to open it. Scratching sounds from within grow louder each year.",
    "Every surface is carved with prayers in a dozen languages, layered over centuries. The oldest inscriptions are in a tongue no living scholar reads, though the words seem to whisper themselves aloud at midnight.",
    "The temple was built around a natural spring whose waters heal minor wounds. The clergy who once tended it left warnings carved above every doorway: 'Do not drink after dark.'",
  ],
  Tower: [
    "A solitary spire rising above the landscape, built by a mage whose experiments could still be heard echoing from within on windless nights. Colored lights flicker in the upper windows.",
    "The tower's upper floors have collapsed, but the underground levels extend far deeper than expected — at least seven sub-basements, each sealed with increasingly powerful wards.",
    "Star charts and arcane instruments fill the abandoned observatory. Some claim the lenses still show impossible constellations that match no known sky, past or present.",
    "The tower is taller on the inside than the outside. Climbing its spiral staircase takes three days, though the structure appears to be only five stories from the ground.",
    "Lightning strikes the tower's peak with unnatural frequency, yet the structure is undamaged. The strikes follow a pattern that some mathematicians claim encodes a message.",
  ],
  Mine: [
    "Deep tunnels once rich with precious ore. The miners abandoned it after breaking into an older, unknown tunnel system below — one carved with tools that shouldn't exist.",
    "The mine entrance is partially collapsed but passable. Strange mineral growths within glow with an otherworldly luminescence, illuminating passages in shifting shades of violet and teal.",
    "Tools and carts remain exactly where they were dropped, as if the miners fled in an instant. No bodies were ever found. Meals sit half-eaten on stone benches, perfectly preserved.",
    "The deepest shaft descends beyond any reasonable depth for the local geology. At the bottom, the walls are warm to the touch and veined with an unknown metal that sings when struck.",
    "A collapsed section recently reopened after a tremor, revealing a vast underground lake. Something large moves beneath its still, black surface.",
  ],
  Shrine: [
    "A humble roadside shrine where travelers leave offerings. The carved figure has been worn smooth by countless reverent hands, yet its expression seems to change with the seasons.",
    "This sacred grove shrine marks a convergence of ley lines. Magic is subtly amplified in its vicinity — cantrips cast here burn brighter, divinations ring clearer.",
    "Built at the site of a legendary hero's last stand, this shrine is said to grant courage to those who kneel before it. Soldiers visit before every campaign.",
    "The shrine is tended by no one, yet fresh flowers always adorn its base. The petals are from no plant that grows within a hundred miles.",
    "Carved from a single block of white marble that has never weathered or stained, the shrine predates the road it sits beside by several centuries.",
  ],
  Tomb: [
    "A sealed burial vault of an ancient king. The wards carved into the entrance suggest what lies within should remain undisturbed — not to protect the treasure, but to contain what guards it.",
    "A vast necropolis stretches beneath the surface. The dead here were buried with their weapons, ready for a war in the afterlife. Some chambers show signs of that war already begun.",
    "The tomb was opened once before. Only one expedition member returned, and they never spoke of what they found. They died three days later, hair turned white, clutching a golden coin no one could identify.",
    "The entrance is flanked by statues of weeping angels whose stone tears leave actual wet trails. The air inside is cold regardless of season — breath frosts even in midsummer.",
    "Every surface inside is covered in warnings written in blood-red pigment. The languages span every known civilization, all saying the same thing: 'The sleeper must not wake.'",
  ],
  Cavern: [
    "A vast natural cave system with chambers large enough to hold a cathedral. Underground rivers echo in the darkness, their waters ice-cold and tasting faintly of silver.",
    "The cavern walls are covered in ancient paintings depicting creatures never seen on the surface — winged serpents, six-legged beasts, and humanoid figures with too many eyes.",
    "Deep within, a warm draft carries the scent of sulfur. Scratching sounds echo from passages too narrow for humans, growing louder the deeper one ventures.",
    "Bioluminescent fungi carpet the cavern floor in patches of ghostly blue and green. The patterns shift overnight, forming shapes that some claim are maps or messages.",
    "A massive stalactite formation resembles a frozen waterfall of stone. Behind it, explorers found a perfectly carved doorway leading into worked stone corridors of unknown origin.",
  ],
  Obelisk: [
    "A towering black stone monolith inscribed with a spiral script that no scholar has deciphered. It hums faintly during storms, and compasses spin wildly within fifty paces.",
    "The obelisk casts no shadow regardless of the sun's position. Animals refuse to approach within fifty paces, and birds alter their flight paths to avoid passing overhead.",
    "Erected by an unknown civilization, the stone's surface is impossibly smooth and resists all attempts at sampling. Chisels shatter, acids bead off, and diamond blades dull on contact.",
    "The obelisk appears on no map older than fifty years, yet geological analysis suggests it has stood for millennia. It is as if it simply appeared — or was revealed.",
    "On moonless nights, the inscriptions emit a faint phosphorescence that casts shadows in impossible directions. Those who study the light too long report vivid dreams of alien landscapes.",
  ],
  "Standing Stones": [
    "A circle of weathered menhirs arranged in precise astronomical alignment. During equinoxes, the stones sing in the wind — a deep, resonant chord that can be heard for miles.",
    "The stones mark the boundary of an ancient pact. Stepping within the circle at midnight reveals glimpses of another era — ghostly figures performing rituals around a great fire.",
    "Local druids still perform rituals here, though even they admit the stones predate their oldest traditions by uncounted centuries.",
    "Each stone is a different type of rock, quarried from locations hundreds of miles apart. How they were transported and erected remains one of the realm's great mysteries.",
    "The grass within the circle grows in a perfect spiral pattern. Animals that graze here produce milk that heals minor ailments, and crops planted nearby yield triple harvests.",
  ],
  "Dragon Lair": [
    "Massive claw marks score the cave entrance. The air inside is unnaturally warm and carries a faint metallic tang. Melted stone drips like candle wax along the walls.",
    "Whether a dragon still dwells here is debated — but the surrounding landscape bears unmistakable signs of dragonfire, with glassed sand and scorched earth stretching for acres.",
    "Adventurers occasionally emerge with scales and teeth from this lair, but none have claimed to slay the beast within. The scales grow back, they say, as if the dragon sheds them willingly.",
    "The lair's entrance is large enough to sail a warship through. Inside, the cavern opens into a volcanic hollow where rivers of magma illuminate a hoard of staggering proportion.",
    "Bones of previous challengers line the approach — picked clean and arranged in deliberate patterns. The dragon, it seems, has a sense of humor about its visitors.",
  ],
  Portal: [
    "A shimmering archway that occasionally flickers with otherworldly light. Objects thrown through sometimes return... changed. Wood becomes petrified, metal corrodes, and food turns to ash.",
    "Ancient runework frames a doorway to somewhere else. The destination seems to shift with the phases of the moon — sometimes showing forests, sometimes deserts, sometimes void.",
    "The portal has been dormant for decades, but recently began pulsing with energy. Scholars race to determine its destination before whatever is on the other side pushes through.",
    "Two identical archways stand facing each other across a clearing. Stepping through one deposits you at the other, but the journey takes exactly seven hours regardless of the distance between them.",
    "The air around the portal is several degrees colder than the surroundings. Frost forms on nearby vegetation year-round, and strange insects not native to this world occasionally crawl through.",
  ],
  Battlefield: [
    "The earth here has never recovered from the bloodshed. Grass grows thin and red-tinged, and rusted weapons still surface after every rain. Locals say the ground itself remembers.",
    "Two great armies clashed here in a battle that decided the fate of a kingdom. The victors left monuments, but time has eroded them to stumps while the battlefield remains eerily preserved.",
    "On foggy mornings, the sounds of clashing steel and war cries echo across the field. Whether this is a trick of the wind or something more, the locals refuse to say.",
    "A mass grave at the field's center has been consecrated seven times, yet restless spirits still rise on the anniversary of the battle. The local clergy have given up trying.",
    "The commanding general's war tent still stands, somehow preserved by magic or sheer stubbornness. Inside, battle plans and personal letters paint a tragic portrait of the conflict.",
  ],
  "Fairy Ring": [
    "A perfect circle of luminous mushrooms that appears and disappears with the seasons. Those who sleep within report dreams so vivid they carry real objects back upon waking.",
    "The boundary between the Feywild and the material plane wears thin here. Colors are more vivid within the ring, sounds are sweeter, and time passes at an unpredictable rate.",
    "A ring of ancient oaks whose branches intertwine overhead to form a natural cathedral. Pixie lights dance among the leaves at dusk, and laughter echoes from sources unseen.",
    "Those who enter the ring at midnight may bargain with the fey. The deals are always fair — but 'fair' by fey reckoning is a dangerous standard.",
    "The mushrooms glow brighter during full moons, and anyone standing in their light casts two shadows — one normal, one that moves independently.",
  ],
  Shipwreck: [
    "The remains of a great vessel lie half-buried in sand or wedged between rocks, its hull split open like a cracked egg. Barnacles and salt crystals encrust the timbers.",
    "This merchant galleon ran aground decades ago. Its cargo hold is rumored to still contain sealed crates of exotic goods from a distant continent no modern map records.",
    "The ship's figurehead — a carved sea goddess — remains intact and eerily lifelike. Sailors insist her expression changes and that she weeps real saltwater tears before storms.",
    "A warship of unknown origin, bearing flags and insignia that match no known navy. The crew's remains suggest they died fighting something that boarded from below.",
    "The wreck is only accessible at low tide. Those who explore it find the captain's log still legible — describing a voyage to a place that shouldn't exist.",
  ],
  "Ancient Library": [
    "Shelves carved directly into the living rock hold thousands of stone tablets, metal scrolls, and crystal memory shards. The cataloguing system defies all attempts at comprehension.",
    "A hidden repository of forbidden knowledge, sealed away by a conclave of mages who feared what the texts contained. The wards are failing, and pages have begun to blow free on the wind.",
    "Every book in this library is a copy of a text that was destroyed elsewhere. Somehow, the library knew — and preserved what the world tried to forget.",
    "The library's guardian — a construct of bronze and crystal — still patrols the aisles. It will answer exactly three questions per visitor, then escort them firmly to the exit.",
    "The deepest stacks contain books that write themselves, recording events as they happen across the realm. One shelf is devoted to prophecies, and several have recently been crossed out.",
  ],
  Graveyard: [
    "An ancient burial ground where moss-covered headstones lean at odd angles. Some graves have been dug up from the inside, the earth pushed outward and the coffins empty.",
    "The cemetery sits on consecrated ground, yet undead are drawn to its borders. They circle the fence at night, never entering, as if waiting for the protections to fail.",
    "A beautifully maintained memorial garden with elaborate mausoleums and weeping statues. The groundskeeper has tended it alone for decades and never seems to age.",
    "The headstones bear no names — only dates and single words: 'Betrayed.' 'Forgotten.' 'Silenced.' Someone carved them all in the same hand, though the graves span centuries.",
    "Fresh flowers appear on one particular grave every morning, though no one has ever been seen placing them. The grave belongs to a child who died three hundred years ago.",
  ],
  "Witch's Hut": [
    "A crooked cottage perched on the edge of a swamp, leaning at an angle that defies structural logic. Smoke rises from the chimney in spirals that form recognizable shapes.",
    "The hut is surrounded by a garden of plants that shouldn't grow in this climate — tropical flowers beside arctic mosses, all thriving. The soil hums with enchantment.",
    "Jars of preserved oddities line every surface — eyes, teeth, hair, and things less identifiable. A cauldron bubbles perpetually over a fire that produces no heat beyond its rim.",
    "The witch who lived here vanished years ago, but the hut remains active. Potions brew themselves, the broom sweeps on its own, and the cat still demands to be fed.",
    "Visitors who come with honest need find the door open and a remedy already prepared. Those who come with ill intent find the path back impossibly tangled.",
  ],
  Monolith: [
    "A single massive stone stands upright in an otherwise flat plain, its surface covered in carved faces that shift expression when viewed from different angles.",
    "The monolith predates every civilization in recorded history. It is composed of a mineral found nowhere else on the continent and responds to magical probing with a resonant vibration.",
    "At its base, offerings from dozens of different cultures accumulate — coins, bones, flowers, and stranger things. Something about the stone compels visitors to leave a piece of themselves behind.",
    "The monolith is warm to the touch even in winter and cold in summer. Its shadow moves opposite to the sun, pointing always toward something in the north.",
    "Legend holds that the monolith marks the spot where a god fell to earth. The crater around it has long since filled in, but the stone remains — a tombstone for a deity.",
  ],
  "Enchanted Grove": [
    "The trees in this grove grow in impossible shapes — spirals, archways, and perfect geometric forms. Their leaves shimmer with an iridescent quality not found in nature.",
    "Animals in this grove are unnaturally intelligent. Foxes solve puzzles, ravens speak in riddles, and the deer seem to hold council at dawn. Something in the water, perhaps.",
    "The grove exists in a state of perpetual autumn, leaves frozen mid-fall in a golden cascade that never reaches the ground. Time moves strangely here.",
    "Every tree in the grove bears fruit year-round. The fruit heals, nourishes, and occasionally grants visions — though the visions are not always welcome.",
    "A warm golden light suffuses the grove from no visible source. Wounds heal faster here, tempers cool, and even bitter enemies find themselves speaking civilly beneath its boughs.",
  ],
  "Sunken City": [
    "The tops of towers and spires break the surface of a lake or marsh, hinting at a vast city submerged below. On still days, streets and plazas are visible through the clear water.",
    "An earthquake centuries ago dropped an entire district below the waterline. The buildings remain intact, preserved by the cold, mineral-rich water in an eerie underwater tableau.",
    "Fishermen report seeing lights in the submerged windows at night. Whether these are bioluminescent creatures or something more intentional remains a matter of heated tavern debate.",
    "The city sank slowly enough that its inhabitants had time to seal their most precious possessions in waterproof vaults. Most remain unopened, protected by traps both mechanical and magical.",
    "At certain tides, a bridge emerges connecting the shore to the tallest surviving tower. The bridge is only passable for a few hours before the water reclaims it.",
  ],
  "Cursed Ground": [
    "Nothing grows here. The soil is ashen gray and dry regardless of rainfall. Animals cross the boundary reluctantly, and birds refuse to fly over it entirely.",
    "A dark ritual was performed here long ago, and the land still bears the scar. Shadows move independently of their sources, and whispers fill the air at twilight.",
    "Compasses spin wildly within the boundary. Maps drawn of the area rearrange themselves overnight. The curse seems to reject any attempt to understand or document it.",
    "Those who camp here suffer nightmares of a great calamity — always the same vision, always ending with a scream that wakes them. The vision feels less like a dream and more like a memory.",
    "The ground is warm year-round, and a faint red glow is visible through cracks in the earth after dark. Something is burning below, and it has been burning for a very long time.",
  ],
  default: [
    "A mysterious location of unknown origin. Locals avoid it after dark and speak of it only in whispers. Those brave enough to investigate rarely return unchanged.",
    "Something about this place feels ancient and significant, though its true purpose has been lost to time. The air itself feels heavy with unspoken history.",
    "Adventurers have explored this site and returned with more questions than answers. The few artifacts recovered defy identification by even the most learned scholars.",
    "Local legends offer a dozen contradictory explanations for this place. The only point of agreement is that it should be treated with respect — and caution.",
    "The site appears unremarkable at first glance, but prolonged observation reveals subtle wrongness — sounds that don't echo correctly, shadows that fall at the wrong angle, a persistent feeling of being watched.",
  ],
};
const POI_QUESTS = [
  { title: "The Lost Expedition", desc: "A party of scholars vanished here weeks ago. Their patron offers a generous reward for their rescue — or at least their research notes." },
  { title: "Echoes of the Past", desc: "Strange visions plague anyone who sleeps nearby. A mage believes an artifact within is the source and will pay handsomely for its retrieval." },
  { title: "The Guardian's Challenge", desc: "An ancient protector bars entry and will only allow passage to those who prove their worth through a series of trials." },
  { title: "Treasure of the Forgotten King", desc: "A cryptic map points to a cache of royal treasure hidden here. But the map's previous owner died under suspicious circumstances." },
  { title: "The Corruption Spreads", desc: "Dark energy seeps from this place, blighting nearby farmland. The source must be found and destroyed before the corruption reaches the nearest settlement." },
  { title: "Seal the Breach", desc: "Something has broken through from another plane. The rift must be closed before more creatures pour through." },
  { title: "The Collector's Request", desc: "A wealthy patron seeks a specific relic known to reside here. They will pay well and ask no questions about methods." },
  { title: "Reclaim the Stronghold", desc: "A local lord wishes to restore this site as a strategic outpost, but it must first be cleared of its current... residents." },
  { title: "The Whispering Curse", desc: "Anyone who takes anything from this place falls under a wasting curse. A healer needs components from within to develop a cure." },
  { title: "Cartographer's Commission", desc: "The interior of this place has never been properly mapped. A cartographer's guild offers standing payment for detailed surveys." },
  { title: "The Ritual Components", desc: "A druid circle requires rare herbs that grow only in this location, but something dangerous now lairs within." },
  { title: "Bounty: Clear the Threat", desc: "A bounty has been posted for eliminating the dangerous creatures that have claimed this area as territory." },
  { title: "Sanctuary Sought", desc: "Refugees need a safe haven from persecution. This place could be fortified and defended against those hunting them." },
  { title: "The Archaeologist's Dream", desc: "An elderly scholar believes this location holds proof of a lost civilization. They offer their life savings for verification." },
  { title: "Stolen Legacy", desc: "A family's ancestral artifact was hidden here during war. They will pay dearly to recover it before enemies find it." },
  { title: "The Curse Breaker", desc: "A powerful curse emanates from within, affecting the surrounding lands. A sage offers a fortune to whoever breaks it." },
  { title: "Creature Capture", desc: "A wealthy collector wants a living specimen from this location. The challenge is capturing it alive." },
  { title: "Hidden Knowledge", desc: "Ancient texts hidden here hold secrets coveted by multiple factions. Retrieving them intact could shift political power." },
  { title: "The Slayer's Return", desc: "A legendary monster is said to return to its lair periodically. Hunters offer substantial payment for proof of its death." },
  { title: "Portal Investigation", desc: "Scholars want to understand the nature of portals found here. Your observations could fund expeditions for years." },
  { title: "Monster Breeding Ground", desc: "Creatures here are unnaturally coordinated. Someone is controlling them — find out who and why." },
  { title: "The Sealed Secret", desc: "Something precious was locked away deliberately and sealed with magic. A nobleman will pay to retrieve it." },
  { title: "Rescue the Captives", desc: "Prisoners are being held here by a warlord. A powerful faction offers rewards for freeing them." },
  { title: "The Forgotten War", desc: "This location was a key battleground in an ancient conflict. Detailed documentation could rewrite history and rebalance power." },
  { title: "Divine Intervention", desc: "A priest claims the gods demand a relic retrieved from this place. Failure brings divine wrath, so the payment is substantial." },
  { title: "The Alchemist's Cache", desc: "An alchemist hid their life's work here before disappearing. The collection is worth a fortune to the right buyer." },
  { title: "Dungeon Delving", desc: "Standard dungeon crawl for treasure and glory. Many have gone in, few return, and those who do are wealthier." },
  { title: "Territorial Dispute", desc: "Two factions claim this location. Whoever clears it can claim it for their patron." },
  { title: "The Spell's Source", desc: "Strange magical effects originate here. A mage council needs the source identified or neutralized." },
  { title: "Artifact Appraisal", desc: "Someone found something valuable here but needs experts to extract and evaluate it safely." },
  { title: "The Bloodline Test", desc: "A noble heir must complete a task here to prove worthiness to inherit. Protection and guidance offered to helpers." },
  { title: "The Vanishing Scouts", desc: "Three separate scouting parties have disappeared within. The local militia captain suspects an ambush and needs someone expendable — or capable — to investigate." },
  { title: "Harvest of Shadows", desc: "A rare shadow-bloom grows only in this lightless place. An herbalist will pay triple the usual rate, but the flowers are guarded by things that thrive in darkness." },
  { title: "The Architect's Obsession", desc: "A half-mad architect insists this place holds the key to a building technique lost for millennia. She needs bodyguards while she studies the stonework." },
  { title: "Grave Robber's Remorse", desc: "A thief stole something from this place and now cannot sleep, eat, or stop screaming at dusk. They'll pay anything to have the item returned." },
  { title: "The Warden's Bargain", desc: "An ancient spirit bound to protect this place offers a deal: clear the vermin that infest its domain, and it will reveal the location of a hidden vault." },
  { title: "Diplomatic Escort", desc: "An ambassador must pass through or near this dangerous site to reach a summit. Ensure their safe passage without provoking whatever dwells within." },
  { title: "The Singing Stone", desc: "A bard has heard of a resonant crystal within that produces music no instrument can replicate. They'll share the proceeds from its performance — if it can be safely extracted." },
  { title: "Plague Origin", desc: "A mysterious illness in a nearby village has been traced to water flowing from this location. Find the contamination source and purify or destroy it." },
  { title: "The Map Thief", desc: "Someone has been selling maps to this place to naive adventurers who never return. Find the map-maker and determine if they're predator or pawn." },
  { title: "The Awakening", desc: "Tremors and strange lights suggest something long dormant is stirring. A council of elders needs to know what's waking up before it fully rises." },
  { title: "Fey Bargain", desc: "A fey lord claims ownership of this site and demands tribute from any who enter. Negotiate, pay, or find another way — but do not anger the fey." },
  { title: "Ghost Story", desc: "A spectral figure has been seen near the entrance each night, beckoning travelers inside. A medium believes it's trying to communicate something important." },
  { title: "The False Prophet", desc: "A cult leader claims this is a holy site and is recruiting followers. The local temple wants the truth established before the cult grows too powerful." },
  { title: "Supply Line Threat", desc: "This location sits along a critical trade route and has become a staging ground for bandits. The merchant guild offers a bounty for clearing and securing it." },
  { title: "The Time-Lost Soldier", desc: "A warrior in ancient armor emerged from this place, confused and speaking an archaic dialect. They claim the battle inside still rages. Investigate their claim." },
  { title: "Mushroom Harvest", desc: "Rare fungi with potent alchemical properties grow deep within. An apothecary needs a fresh supply and will pay above market rate for a dangerous gathering expedition." },
  { title: "The Duel Ground", desc: "Two rival nobles have chosen this place for a duel to the death. Both sides are hiring seconds and seeking any advantage the location might provide." },
  { title: "Ancestral Communion", desc: "An elderly shaman believes they can commune with their ancestors at this site during the next solstice. They need protection during the three-day ritual." },
  { title: "The Escaped Experiment", desc: "Something created by a wizard's failed experiment has taken refuge here. The wizard wants it captured alive; the local village wants it dead. Both are paying." },
  { title: "Ley Line Disruption", desc: "Magical communication across the region has gone haywire. Diviners have traced the disruption to this location. Restoring the ley line flow would earn the gratitude of every mage in the land." },
];

const POI_THREAT_LEVELS = ["safe","low","medium","high","extreme"];
const POI_REWARDS = [
  "Ancient relic","Enchanted weapon","Spell scroll","Potion cache","Gold hoard","Rare crafting materials","Magical artifact","Lost knowledge",
  "Legendary sword","Dragon scales","Philosopher's stone","Crown of lost kings","Sacred texts","Artifact of power","Treasure map","Rare gems",
  "Enchanted armor","Healing elixir","Magical tome","Cursed amulet","Ancestral blade","Divine blessing","Ancient coins","Precious metals",
  "Forbidden grimoire","Staff of arcane power","Holy relics","Undead slayer weapon","Cloak of invisibility","Ring of wishes","Artifact of resurrection",
  "Boots of elvenkind","Bag of holding","Decanter of endless water","Amulet of proof against detection","Periapt of wound closure",
  "Flame tongue longsword","Frost brand greatsword","Wand of fireballs","Rod of the pact keeper","Helm of telepathy",
  "Gauntlets of ogre power","Belt of dwarvenkind","Circlet of blasting","Eyes of the eagle","Lantern of revealing",
  "Cape of the mountebank","Stone of good luck","Tome of understanding","Manual of bodily health","Ioun stone of protection",
  "Driftglobe","Sending stones","Alchemy jug","Eversmoking bottle","Portable hole",
];

/* Generate campaign regions and factions from ATLAS_METADATA (Python-generated data) */
function regionsAndFactionsFromMetadata(seedNum) {
  const meta = (typeof ATLAS_METADATA !== 'undefined') && ATLAS_METADATA[seedNum];
  if (!meta || !meta.regions || meta.regions.length === 0) {
    const atlas = generateAtlasData(seedNum);
    return generateRegionsAndFactions(atlas);
  }

  const rng = mulberry32(seedNum * 31337);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const pickN = (arr, n) => { const s = [...arr].sort(() => rng() - 0.5); return s.slice(0, Math.min(n, s.length)); };

  // ── Generate a name ──
  let usedFullNames = new Set();
  const genName = (gender) => {
    const pool = gender === "f" ? FIRST_NAMES_F : FIRST_NAMES_M;
    for (let attempt = 0; attempt < 20; attempt++) {
      const full = pick(pool) + " " + pick(LAST_NAMES);
      if (!usedFullNames.has(full)) { usedFullNames.add(full); return full; }
    }
    return pick(pool) + " " + pick(LAST_NAMES);
  };

  // ── Factions (large pool so seeds always feel different) ──
  const factionTemplates = [
    { suffix: "Dominion",    attitudes: ["neutral","hostile"],  descs: ["An expansionist empire seeking control through military might and political dominion","A militant regime enforcing order through strength, its legions spread across the land"], colors: ["#c94040","#a83232"], govType: "empire" },
    { suffix: "Accord",      attitudes: ["allied","friendly"],  descs: ["A coalition of free cities united for mutual defense and shared prosperity","An alliance of merchants and diplomats who believe trade is mightier than the sword"], colors: ["#4a90d9","#a4b5cc"], govType: "republic" },
    { suffix: "Circle",      attitudes: ["neutral","friendly"], descs: ["A secretive order of mages and scholars pursuing arcane knowledge","An ancient cabal studying forbidden lore in hidden sanctums beneath the earth"], colors: ["#8b50f0","#6b3fa0"], govType: "council" },
    { suffix: "Wardens",     attitudes: ["friendly","neutral"], descs: ["Guardians of the natural world and sacred groves, sworn to protect the wilds","Druidic protectors of the old ways whose roots run deeper than any kingdom"], colors: ["#2e8b57","#45a876"], govType: "druidic" },
    { suffix: "Syndicate",   attitudes: ["neutral","hostile"],  descs: ["A powerful trade consortium with shadowy connections in every port and palace","A ruthless guild controlling commerce and information, answering only to coin"], colors: ["#d4a017","#e8940a"], govType: "guild" },
    { suffix: "Covenant",    attitudes: ["hostile","neutral"],  descs: ["A fanatical cult pursuing dark power, their rituals whispered of in hushed tones","A shadowy brotherhood with sinister aims, bound by blood oaths and ancient rites"], colors: ["#5c2d82","#7b3fa0"], govType: "cult" },
    { suffix: "Crown",       attitudes: ["neutral","friendly"], descs: ["The remnants of an ancient monarchy clinging to fading glory and old traditions","A noble house whose bloodline stretches back to the founding of the realm"], colors: ["T.gold","#b8963f"], govType: "monarchy" },
    { suffix: "Imperium",    attitudes: ["hostile","neutral"],  descs: ["A vast military machine that swallows nations whole, leaving only obedience in its wake","An ancient empire reborn, demanding tribute and fealty from all neighboring lands"], colors: ["#8b0000","#b22222"], govType: "empire" },
    { suffix: "League",      attitudes: ["friendly","neutral"], descs: ["A loose confederation of city-states bound by trade agreements and mutual interest","An economic alliance whose wealth rivals that of any kingdom"], colors: ["#2874a6","#5dade2"], govType: "republic" },
    { suffix: "Brotherhood", attitudes: ["neutral","hostile"],  descs: ["A secretive fraternity with agents embedded in every court and guild hall","A sworn order of warriors and spies dedicated to a hidden cause"], colors: ["#34495e","#5d6d7e"], govType: "military junta" },
    { suffix: "Conclave",    attitudes: ["neutral","friendly"], descs: ["A gathering of the realm's greatest minds and mystics, seeking truth through knowledge","An assembly of seers and sages who guide policy through prophecy and research"], colors: ["#7d3c98","#a569bd"], govType: "council" },
    { suffix: "Order",       attitudes: ["friendly","neutral"], descs: ["A holy order of knights sworn to protect the innocent and uphold justice","A militant religious order whose templars enforce divine law with steel and prayer"], colors: ["#f0e68c","#daa520"], govType: "theocracy" },
    { suffix: "Horde",       attitudes: ["hostile","neutral"],  descs: ["A confederation of nomadic tribes united under a single fearsome war-chief","Mounted warriors from the steppes whose raids terrorize settled lands"], colors: ["#8b4513","#a0522d"], govType: "tribal" },
    { suffix: "Tribunal",    attitudes: ["neutral","cautious"], descs: ["A council of judges and magistrates who enforce law with cold impartiality","A governing body of elected officials who rule through codified decree"], colors: ["#708090","#778899"], govType: "oligarchy" },
    { suffix: "Pact",        attitudes: ["hostile","cautious"], descs: ["A blood-bound alliance of warlocks and demon-touched outcasts seeking power at any cost","A cabal of those who have made deals with entities beyond mortal understanding"], colors: ["#4a0028","#800040"], govType: "cult" },
    { suffix: "Assembly",    attitudes: ["friendly","allied"],  descs: ["A democratic council where every citizen has a voice and a vote","A parliament of elected representatives from across the allied territories"], colors: ["#27ae60","#2ecc71"], govType: "republic" },
    { suffix: "Dynasty",     attitudes: ["neutral","friendly"], descs: ["A ruling family whose wealth and influence spans generations and continents","A hereditary monarchy renowned for its cunning diplomacy and vast treasury"], colors: ["T.gold","#c19a6b"], govType: "monarchy" },
    { suffix: "Enclave",     attitudes: ["neutral","cautious"], descs: ["An isolationist community of scholars and artisans who guard their secrets jealously","A hidden sanctuary where forbidden knowledge is preserved far from prying eyes"], colors: ["#4682b4","#5f9ea0"], govType: "council" },
    { suffix: "Compact",     attitudes: ["friendly","neutral"], descs: ["An alliance forged in desperation against a common threat, now struggling to hold together","A treaty organization of smaller nations banding together for survival"], colors: ["#556b2f","#6b8e23"], govType: "republic" },
    { suffix: "Cabal",       attitudes: ["hostile","neutral"],  descs: ["A shadow network of assassins and information brokers who sell loyalty to the highest bidder","A hidden organization that manipulates events from behind the scenes through fear and coin"], colors: ["#2c2c2c","#484848"], govType: "guild" },
  ];

  // Major (governing) factions: at least 3, up to meta.regions.length
  const majorFactionCount = Math.min(Math.max(3, meta.regions.length - 1), meta.regions.length);
  const factions = [];
  const usedTemplates = [];
  let npcId = 1;
  const allNpcs = [];

  // Sub-faction templates — organizations that exist WITHIN regions and exert influence
  const subFactionTemplates = [
    { suffix: "Thieves Guild", govType: "criminal syndicate", attitudes: ["hostile","neutral"], descs: ["A network of cutpurses, burglars, and fences operating from the shadows, their fingers in every pocket of the city","An underground syndicate of rogues controlling the black market, smuggling routes, and information trade"], colors: ["#3d3d3d","#555555"], influence: ["crime","trade","information"], powerRange: [15,45] },
    { suffix: "Shadow Council", govType: "shadow government", attitudes: ["neutral","hostile"], descs: ["A secret cabal of nobles, merchants, and spies who pull the true strings of power from behind the throne","An invisible court whose whispered edicts shape policy while the puppet rulers smile for the public"], colors: ["#1a1a2e","#16213e"], influence: ["politics","espionage","assassination"], powerRange: [20,50] },
    { suffix: "Arcane Collegium", govType: "arcane academy", attitudes: ["neutral","friendly"], descs: ["An elite order of wizards and sorcerers whose tower libraries hold knowledge forbidden to common folk","A prestigious academy of the arcane arts whose graduates advise kings and shape the weave of magic itself"], colors: ["#6a0dad","#9b59b6"], influence: ["magic","knowledge","defense"], powerRange: [25,55] },
    { suffix: "Mercenary Company", govType: "mercenary band", attitudes: ["neutral","neutral"], descs: ["A disciplined company of sellswords whose loyalty can be bought but never truly held — they fight for gold, not glory","Battle-hardened veterans who have turned war into commerce, their steel available to any faction that can meet their price"], colors: ["#8b6914","#b8860b"], influence: ["military","protection","enforcement"], powerRange: [20,45] },
    { suffix: "Merchant Consortium", govType: "trade guild", attitudes: ["friendly","neutral"], descs: ["A powerful trading house that controls tariffs, trade routes, and the flow of luxury goods across the region","A league of wealthy merchants whose caravans connect distant cities and whose gold can topple kings"], colors: ["#d4a017","#e8940a"], influence: ["trade","economy","logistics"], powerRange: [25,50] },
    { suffix: "Holy Inquisition", govType: "religious order", attitudes: ["neutral","hostile"], descs: ["Fanatical templars who root out heresy, undead, and dark magic with fire and righteous fury","An order of divine soldiers who answer to no temporal king, only the will of their god as interpreted by their Grand Inquisitor"], colors: ["#daa520","#ffd700"], influence: ["religion","law","purification"], powerRange: [20,45] },
    { suffix: "Assassins' Hand", govType: "assassin guild", attitudes: ["hostile","neutral"], descs: ["Silent killers for hire, trained in the arts of poison, blade, and disappearance — their mark means death","An ancient order of assassins whose contracts are sacred and whose blades have ended dynasties"], colors: ["#2c0a0a","#4a1111"], influence: ["assassination","fear","intelligence"], powerRange: [10,35] },
    { suffix: "Rangers' Lodge", govType: "ranger order", attitudes: ["friendly","neutral"], descs: ["Woodsmen and scouts who patrol the wilds, protecting travelers and hunting the monsters that lurk beyond civilization","A loose brotherhood of survivalists, trackers, and beast-hunters who know every path and hidden cave in the region"], colors: ["#2d572c","#4a7c59"], influence: ["scouting","wilderness","protection"], powerRange: [15,35] },
    { suffix: "Artificers' Forge", govType: "craft guild", attitudes: ["friendly","neutral"], descs: ["Master craftsmen and enchantresses who forge magical arms, armor, and wondrous items for those who can afford their prices","An exclusive guild of magical artisans whose work is prized above all others — their waiting lists span years"], colors: ["#b87333","#cd7f32"], influence: ["crafting","enchantment","supply"], powerRange: [15,40] },
    { suffix: "Underbelly", govType: "criminal network", attitudes: ["hostile","neutral"], descs: ["The festering criminal underground — smugglers, gambling dens, fighting pits, and worse, all owing tribute to a single kingpin","A web of vice and corruption that exists beneath the polished surface, providing everything the law forbids"], colors: ["#3a1f1f","#5c3333"], influence: ["crime","vice","corruption"], powerRange: [10,35] },
  ];

  // Shuffle templates so different seeds pick different ones
  const shuffledTemplates = [...factionTemplates].sort(() => rng() - 0.5);

  for (let i = 0; i < majorFactionCount; i++) {
    const t = shuffledTemplates[i % shuffledTemplates.length];
    const regName = meta.regions[i % meta.regions.length]?.name || "Unknown";
    // Vary the naming style: full name, shortened, or creative prefix
    const nameStyle = Math.floor(rng() * 4);
    const shortName = regName.length > 6 ? regName.slice(0, Math.ceil(regName.length * 0.6)) : regName;
    const factionPrefixes = ["The","Iron","Silver","Golden","Crimson","Ashen","Storm","Shadow","Dawn","Night","Blood","Frost"];
    const factionName = nameStyle === 0 ? shortName + " " + t.suffix :
                        nameStyle === 1 ? "The " + regName + " " + t.suffix :
                        nameStyle === 2 ? pick(factionPrefixes) + " " + t.suffix :
                        regName + "'s " + t.suffix;

    // Generate faction leadership hierarchy
    const leaderGender = rng() > 0.5 ? "f" : "m";
    const leaderTitle = t.govType === "monarchy" ? (leaderGender === "f" ? "Queen" : "King") :
                        t.govType === "empire" ? (leaderGender === "f" ? "Empress" : "Emperor") :
                        t.govType === "republic" ? "High Chancellor" :
                        t.govType === "council" ? "Archmage" :
                        t.govType === "druidic" ? "Archdruid" :
                        t.govType === "guild" ? "Grand Master" :
                        t.govType === "cult" ? "High Prophet" :
                        t.govType === "theocracy" ? "Grand Pontiff" :
                        t.govType === "tribal" ? "Great Chieftain" :
                        t.govType === "military junta" ? "Supreme Commander" :
                        t.govType === "oligarchy" ? "First Speaker" : "Leader";
    const leaderName = genName(leaderGender);

    // Generate faction hierarchy members
    const hierarchy = [];
    hierarchy.push({ title: leaderTitle, name: leaderName, role: "ruler" });

    // Heir / second in command
    const heirGender = rng() > 0.5 ? "f" : "m";
    const heirTitle = t.govType === "monarchy" ? (heirGender === "f" ? "Crown Princess" : "Crown Prince") :
                      t.govType === "empire" ? "Grand Marshal" :
                      t.govType === "republic" ? "Vice Chancellor" :
                      t.govType === "council" ? "Senior Magus" :
                      t.govType === "druidic" ? "Elder Druid" :
                      t.govType === "guild" ? "Shadow Hand" :
                      t.govType === "cult" ? "Voice of the Prophet" :
                      t.govType === "theocracy" ? "Cardinal Elect" :
                      t.govType === "tribal" ? "Blood Heir" :
                      t.govType === "military junta" ? "Field Marshal" :
                      t.govType === "oligarchy" ? "Second Speaker" : "Successor";
    hierarchy.push({ title: heirTitle, name: genName(heirGender), role: "heir" });

    // General / military leader
    const genGender = rng() > 0.5 ? "f" : "m";
    hierarchy.push({ title: pick(NPC_ROLES.general), name: genName(genGender), role: "general" });

    // Advisor
    const advGender = rng() > 0.5 ? "f" : "m";
    hierarchy.push({ title: pick(NPC_ROLES.advisor), name: genName(advGender), role: "advisor" });

    // Create NPC entries for faction leaders
    for (const h of hierarchy) {
      allNpcs.push({
        id: npcId++,
        name: h.name,
        role: h.title,
        loc: meta.regions[i % meta.regions.length]?.name || "Unknown",
        faction: factionName,
        attitude: pick(["allied","friendly","neutral","cautious"]),
        alive: true,
        traits: pickN(NPC_TRAITS, 2),
        secret: rng() > 0.6 ? pick(NPC_SECRETS) : "",
        level: h.role === "ruler" ? 12 + Math.floor(rng() * 6) :
               h.role === "heir" ? 8 + Math.floor(rng() * 6) :
               h.role === "general" ? 10 + Math.floor(rng() * 5) :
               6 + Math.floor(rng() * 8),
        isLeader: true,
      });
    }

    factions.push({
      id: i + 1,
      name: factionName,
      attitude: pick(t.attitudes),
      power: 30 + Math.floor(rng() * 60),
      trend: pick(["rising","stable","declining"]),
      desc: pick(t.descs),
      color: pick(t.colors),
      govType: t.govType,
      hierarchy: hierarchy,
      resources: pickN(["gold","iron","timber","grain","gems","magic","soldiers","ships","knowledge","trade routes"], 2 + Math.floor(rng() * 3)),
      allies: [],
      rivals: [],
    });
  }

  // Set up inter-faction relationships
  for (let i = 0; i < factions.length; i++) {
    for (let j = i + 1; j < factions.length; j++) {
      const roll = rng();
      if (roll < 0.25) { factions[i].rivals.push(factions[j].name); factions[j].rivals.push(factions[i].name); }
      else if (roll < 0.45) { factions[i].allies.push(factions[j].name); factions[j].allies.push(factions[i].name); }
    }
  }

  // ── Generate sub-factions (2-3 per region, smaller organizations) ──
  const shuffledSubTemplates = [...subFactionTemplates].sort(() => rng() - 0.5);
  let subFactionIdx = 0;
  meta.regions.forEach((reg, ri) => {
    const parentFaction = factions[ri % factions.length];
    const numSubs = 2 + Math.floor(rng() * 2); // 2-3 sub-factions per region
    for (let si = 0; si < numSubs; si++) {
      const st = shuffledSubTemplates[(subFactionIdx++) % shuffledSubTemplates.length];
      const subPrefixes = ["The","Hidden","Crimson","Black","Silver","Iron","Midnight","Scarlet","Emerald","Gilded","Silent"];
      const subName = pick(subPrefixes) + " " + st.suffix;

      // Leader for sub-faction
      const slGender = rng() > 0.5 ? "f" : "m";
      const slTitle = st.govType === "criminal syndicate" ? "Guildmaster" :
                      st.govType === "shadow government" ? "Shadow Regent" :
                      st.govType === "arcane academy" ? "Archmage" :
                      st.govType === "mercenary band" ? "Captain-General" :
                      st.govType === "trade guild" ? "Trade Prince" :
                      st.govType === "religious order" ? "Grand Inquisitor" :
                      st.govType === "assassin guild" ? "Grandmaster" :
                      st.govType === "ranger order" ? "Head Ranger" :
                      st.govType === "craft guild" ? "Master Artificer" :
                      st.govType === "criminal network" ? "Kingpin" : "Leader";
      const slName = genName(slGender);

      const subHierarchy = [
        { title: slTitle, name: slName, role: "ruler" },
        { title: "Lieutenant", name: genName(rng() > 0.5 ? "f" : "m"), role: "heir" },
      ];

      // Create NPC for sub-faction leader
      allNpcs.push({
        id: npcId++, name: slName, role: slTitle + " of " + subName,
        loc: reg.name, faction: subName, attitude: pick(["neutral","cautious","hostile"]),
        alive: true, traits: pickN(NPC_TRAITS, 2), secret: pick(NPC_SECRETS),
        level: 6 + Math.floor(rng() * 8), isLeader: true,
      });

      const subPower = st.powerRange[0] + Math.floor(rng() * (st.powerRange[1] - st.powerRange[0]));
      factions.push({
        id: factions.length + 1,
        name: subName,
        attitude: pick(st.attitudes),
        power: subPower,
        trend: pick(["rising","stable","declining","rising"]),
        desc: pick(st.descs),
        color: pick(st.colors),
        govType: st.govType,
        hierarchy: subHierarchy,
        resources: pickN(st.influence, Math.min(st.influence.length, 2)),
        allies: rng() > 0.6 ? [parentFaction.name] : [],
        rivals: rng() > 0.7 ? [factions[Math.floor(rng() * Math.min(factions.length, majorFactionCount))].name] : [],
        // Sub-faction metadata
        isSubFaction: true,
        parentRegion: reg.name,
        parentFaction: parentFaction.name,
        influence: pickN(st.influence, Math.min(st.influence.length, 2 + Math.floor(rng() * 2))),
        influenceLevel: subPower > 35 ? "major" : subPower > 20 ? "moderate" : "minor",
      });
    }
  });

  // ── Regions with ruling hierarchy ──
  const regionTypes = ["kingdom","city","wilderness","town","dungeon","route"];
  const threatLevels = ["low","medium","high","extreme"];
  const stateDescriptions = ["stable","tense","rebuilding","corrupted","prosperous","dangerous","contested"];
  const terrainTypes = ["plains","forest","mountains","swamp","desert","coast","tundra","hills"];

  // Town metadata (from town-images.js) — used for terrain sync across regions & cities
  const townMeta = (typeof window !== 'undefined' && window.TOWN_METADATA) || null;

  const regions = meta.regions.map((r, i) => {
    const controllingFaction = i < factions.length ? factions[i].name : (factions.length > 0 ? factions[Math.floor(rng() * factions.length)].name : "Unaligned");
    const type = i === 0 ? "capital" : pick(regionTypes);
    const threat = pick(threatLevels);
    const state = pick(stateDescriptions);

    // Use terrain from the first city in this region (from town metadata) if available
    const firstCity = (r.cities || [])[0];
    const metaTerrain = firstCity && townMeta && townMeta[firstCity.name] ?
      (townMeta[firstCity.name].terrain || null) : null;
    // Map town terrains to region terrains
    const terrainMap = { "plains": "plains", "forest": "forest", "hills": "hills", "marsh": "swamp", "coast": "coast" };
    const terrain = metaTerrain ? (terrainMap[metaTerrain] || metaTerrain) : pick(terrainTypes);

    // Region-specific NPCs: governor, notable citizens
    const govGender = rng() > 0.5 ? "f" : "m";
    const govTitle = type === "capital" || type === "kingdom" ? pick(NPC_ROLES.noble) :
                     type === "city" ? "Mayor" :
                     type === "town" ? "Town Elder" :
                     type === "wilderness" ? "Ranger Warden" :
                     type === "dungeon" ? "Dungeon Keeper" : "Road Warden";
    const govName = genName(govGender);

    allNpcs.push({
      id: npcId++,
      name: govName,
      role: govTitle + " of " + r.name,
      loc: r.name,
      faction: controllingFaction,
      attitude: pick(["friendly","neutral","cautious"]),
      alive: true,
      traits: pickN(NPC_TRAITS, 2),
      secret: rng() > 0.5 ? pick(NPC_SECRETS) : "",
      level: 4 + Math.floor(rng() * 8),
      isLeader: false,
    });

    // Add 1-3 commoner/merchant NPCs per region
    const numCommoners = 1 + Math.floor(rng() * 3);
    for (let c = 0; c < numCommoners; c++) {
      const cGender = rng() > 0.5 ? "f" : "m";
      allNpcs.push({
        id: npcId++,
        name: genName(cGender),
        role: pick(NPC_ROLES.commoner),
        loc: r.name,
        faction: rng() > 0.7 ? controllingFaction : "",
        attitude: pick(["friendly","neutral","cautious","hostile"]),
        alive: rng() > 0.08,
        traits: pickN(NPC_TRAITS, 1 + Math.floor(rng() * 2)),
        secret: rng() > 0.75 ? pick(NPC_SECRETS) : "",
        level: 1 + Math.floor(rng() * 5),
        isLeader: false,
      });
    }

    // Build cities list for the region from metadata (just names for backward compat)
    const cityNames = (r.cities || []).map(c => c.name);

    // Climate descriptions by terrain
    const climateMap = { plains:"Temperate grasslands with warm summers and mild winters", forest:"Dense canopy moderating temperatures, humid and shadowed year-round", mountains:"Alpine climate with harsh winters, thin air, and sudden storms", swamp:"Perpetually damp with thick fog and oppressive humidity", desert:"Scorching days and freezing nights under relentless sun", coast:"Salty sea breezes with frequent squalls and mild temperatures", tundra:"Frozen wastes with perpetual permafrost and brutal winds", hills:"Rolling terrain with variable weather and strong gusts" };
    // Natural resources by terrain
    const resourceMap = { plains:["grain","livestock","herbs","clay"], forest:["timber","game","mushrooms","rare wood"], mountains:["iron","gems","stone","silver"], swamp:["peat","rare moss","swamp gas","leeches"], desert:["glass","spices","ancient relics","fire opals"], coast:["fish","pearls","salt","coral"], tundra:["furs","mammoth ivory","frost crystals","tundra herbs"], hills:["copper","sheep","quarry stone","wildflowers"] };
    // Dangers by threat/terrain
    const dangerOptions = { low:["bandits on the roads","wild animal packs","petty thieves"], medium:["roving warbands","territorial monsters","cultist activity","smuggler networks"], high:["dragon sightings","undead incursions","demon-touched corruption","faction warfare"], extreme:["elder dragon lair","abyssal rift","necromancer citadel","planar instability"] };
    // Lore snippets
    const loreSnippets = [
      "Ancient ruins dot the landscape, remnants of a civilization that vanished centuries ago.",
      "Local legends speak of a sleeping god beneath the earth, whose dreams shape the land.",
      "The old blood of elvenkind runs strong here — many locals have fey ancestry.",
      "Travelers report strange lights in the sky at night, accompanied by eerie music.",
      "The soil here is said to be blessed, yielding bountiful harvests even in lean years.",
      "A great battle was fought here in ages past; bones and rusted weapons still surface after heavy rains.",
      "The region was once underwater — fossil shells can be found high in the hills.",
      "An ancient ley line runs through this territory, amplifying magical effects.",
      "The locals follow customs that predate written history, including offerings to unnamed spirits.",
      "Trade caravans have used this route for a thousand years, and the old stones still mark the way.",
      "A famous hero fell here, and their tomb has become a pilgrimage site.",
      "The forests are said to be haunted by the spirits of an elven host that died defending this land.",
    ];

    // Sub-factions operating in this region
    const regionSubFactions = factions.filter(f => f.isSubFaction && f.parentRegion === r.name);

    return {
      id: i + 1,
      name: r.name,
      subtitle: r.subtitle || "",
      type: type,
      ctrl: controllingFaction,
      threat: threat,
      state: state,
      visited: i === 0,
      terrain: terrain,
      cities: cityNames,
      population: type === "capital" ? (80000 + Math.floor(rng() * 120000)).toLocaleString() :
                  type === "kingdom" ? (40000 + Math.floor(rng() * 80000)).toLocaleString() :
                  type === "city" ? (10000 + Math.floor(rng() * 40000)).toLocaleString() :
                  type === "town" ? (500 + Math.floor(rng() * 5000)).toLocaleString() :
                  type === "wilderness" ? (50 + Math.floor(rng() * 500)).toLocaleString() :
                  (100 + Math.floor(rng() * 2000)).toLocaleString(),
      governor: govName,
      governorTitle: govTitle,
      // Expanded region details
      climate: climateMap[terrain] || "Varied climate with seasonal changes",
      resources: pickN(resourceMap[terrain] || ["trade goods","raw materials"], 2 + Math.floor(rng() * 2)),
      dangers: pickN(dangerOptions[threat] || dangerOptions.low, 1 + Math.floor(rng() * 2)),
      lore: pick(loreSnippets),
      subFactions: regionSubFactions.map(sf => sf.name),
    };
  });

  // ── Generate detailed city data ──
  let cityId = 1;
  const allCities = [];
  meta.regions.forEach((r, ri) => {
    const regionObj = regions[ri];
    const controllingFaction = regionObj.ctrl;
    (r.cities || []).forEach((c, ci) => {
      const cRng = mulberry32(seedNum * 7919 + ri * 997 + ci * 31);
      const cPick = (arr) => arr[Math.floor(cRng() * arr.length)];
      const cPickN = (arr, n) => { const s = [...arr].sort(() => cRng() - 0.5); return s.slice(0, n); };
      const isCapital = !!c.capital;
      const pop = isCapital ? (12000 + Math.floor(cRng() * 38000)) :
                  (800 + Math.floor(cRng() * 9000));

      // Generate 2-4 shops per city
      const numShops = isCapital ? (3 + Math.floor(cRng() * 3)) : (2 + Math.floor(cRng() * 2));
      const shopTypesUsed = cPickN(SHOP_TYPES, numShops);
      const shops = shopTypesUsed.map((sType, si) => {
        const shopName = cPick(SHOP_NAME_PRE) + " " + cPick(SHOP_NAME_SUF);
        // Determine item pool based on shop type
        const lc = sType.toLowerCase();
        let pool = ITEM_POOLS.general;
        if (lc.includes("weapon") || lc.includes("blacksmith") || lc.includes("fletcher")) pool = ITEM_POOLS.weapon;
        else if (lc.includes("armor") || lc.includes("leather") || lc.includes("tailor")) pool = ITEM_POOLS.armor;
        else if (lc.includes("apothecary") || lc.includes("alchemist") || lc.includes("herbalist")) pool = ITEM_POOLS.potion;
        else if (lc.includes("enchant") || lc.includes("scroll") || lc.includes("rune") || lc.includes("book")) pool = ITEM_POOLS.scroll;
        else if (lc.includes("exotic") || lc.includes("curiosit") || lc.includes("relic")) pool = ITEM_POOLS.exotic;
        else if (lc.includes("jewel")) pool = [...ITEM_POOLS.exotic, ...ITEM_POOLS.armor];
        const numItems = isCapital ? (5 + Math.floor(cRng() * 4)) : (pop > 4000 ? (4 + Math.floor(cRng() * 3)) : (3 + Math.floor(cRng() * 3)));
        const items = cPickN(pool, Math.min(numItems, pool.length)).map(item => ({
          ...item,
          price: (() => {
            // Vary prices by local supply/demand (0.7x to 1.5x)
            const mult = 0.7 + cRng() * 0.8;
            const base = parseInt(item.price) || 0;
            const unit = item.price.replace(/[0-9.,\s]/g, '').trim();
            return Math.round(base * mult) + ' ' + unit;
          })(),
          inStock: cRng() > 0.15,
          qty: item.rarity === "rare" ? 1 : item.rarity === "very rare" ? 1 : (1 + Math.floor(cRng() * 5)),
        }));
        const ownerGender = cRng() > 0.5 ? "f" : "m";
        return {
          id: `shop-${cityId}-${si}`,
          name: shopName,
          type: sType,
          owner: genName(ownerGender),
          ownerPersonality: cPick(NPC_TRAITS),
          items: items,
        };
      });

      // Generate tavern/inn
      const tavernName = cPick(TAVERN_NAMES_PRE) + " " + cPick(TAVERN_NAMES_SUF);
      const innkeepGender = cRng() > 0.5 ? "f" : "m";
      const numServices = 4 + Math.floor(cRng() * 4);
      const tavern = {
        name: tavernName,
        innkeeper: genName(innkeepGender),
        innkeeperPersonality: cPick(NPC_TRAITS),
        services: cPickN(INN_SERVICES, numServices),
        rumor: cPick(QUEST_HOOKS),
      };

      // City-specific NPCs (2-4)
      const numCityNpcs = 2 + Math.floor(cRng() * 3);
      const cityNpcs = [];
      for (let n = 0; n < numCityNpcs; n++) {
        const nGender = cRng() > 0.5 ? "f" : "m";
        const isNotable = n === 0 && isCapital;
        cityNpcs.push({
          id: npcId++,
          name: genName(nGender),
          role: isNotable ? cPick(NPC_ROLES.noble) : cPick(NPC_ROLES.commoner),
          loc: c.name,
          faction: cRng() > 0.5 ? controllingFaction : "",
          attitude: cPick(["friendly","neutral","cautious","hostile"]),
          alive: true,
          traits: cPickN(NPC_TRAITS, 2),
          secret: cRng() > 0.6 ? cPick(NPC_SECRETS) : "",
          level: isNotable ? (4 + Math.floor(cRng() * 6)) : (1 + Math.floor(cRng() * 4)),
          isLeader: false,
        });
      }
      // Add city NPCs to the global list
      cityNpcs.forEach(n => allNpcs.push(n));

      // Quest hooks (1-3 per city)
      const numQuests = 1 + Math.floor(cRng() * (isCapital ? 3 : 2));
      const questHooks = cPickN(QUEST_HOOKS, numQuests);

      // Features (1-3)
      const numFeatures = 1 + Math.floor(cRng() * (isCapital ? 3 : 2));
      const features = cPickN(CITY_FEATURES, numFeatures);

      allCities.push({
        id: cityId++,
        name: c.name,
        region: r.name,
        faction: controllingFaction,
        isCapital: isCapital,
        population: pop.toLocaleString(),
        popNum: pop,
        mapX: c.x, // normalized 0-1 (may be adjusted by post-processing)
        mapY: c.y,
        origX: c.x, // original atlas metadata coords (matches .webp image dots)
        origY: c.y,
        labelX: r.labelX || 0,
        labelY: r.labelY || 0,
        terrain: (townMeta && townMeta[c.name] && townMeta[c.name].terrain) || regionObj.terrain,
        threat: regionObj.threat,
        features: features,
        shops: shops,
        tavern: tavern,
        npcs: cityNpcs.map(n => n.id),
        questHooks: questHooks,
        description: (() => {
          const sizeDesc = isCapital ? "The grand capital" : pop > 8000 ? "A bustling metropolis" : pop > 4000 ? "A thriving city" : pop > 1500 ? "A modest town" : "A small village";
          const terrainDesc = {
            "plains": "surrounded by golden farmlands",
            "forest": "nestled among ancient woodlands",
            "hills": "perched in the rolling highlands",
            "marsh": "built upon the murky wetlands",
            "coast": "overlooking the restless sea",
            "mountains": "carved into the mountain slopes",
            "swamp": "rising from the misty bogs",
            "desert": "standing amid the endless sands",
            "tundra": "braving the frozen wastes",
          }[(townMeta && townMeta[c.name] && townMeta[c.name].terrain) || regionObj.terrain] || "in the heart of the realm";
          const factionDesc = cPick([
            `governed under the banner of the ${controllingFaction}`,
            `loyal to the ${controllingFaction}`,
            `a stronghold of the ${controllingFaction}`,
            `under the watchful eye of the ${controllingFaction}`,
            `pledged to the ${controllingFaction}`,
          ]);
          const flavorDesc = features.length > 0 ? `, known for its ${features[0]}` : "";
          return `${sizeDesc} ${terrainDesc}, ${factionDesc}${flavorDesc}.`;
        })(),
      });
    });
  });

  // ── Post-process city coordinates: spread overlaps, clamp edges ──
  (function fixCityCoords() {
    // 1. Pull cities inside the continent ellipse
    //    Continent center at (0.5, 0.5) in normalized coords
    //    Ellipse semi-axes: ~0.37 on X (2200/6000), ~0.36 on Y (1600/4500)
    const EDGE_MIN = 0.06, EDGE_MAX = 0.94;
    const CX = 0.5, CY = 0.5, RX = 0.35, RY = 0.33;
    allCities.forEach(c => {
      // First clamp extreme edges
      if (c.mapX < EDGE_MIN) c.mapX = EDGE_MIN + (mulberry32(seedNum * 997 + c.id * 31)()) * 0.04;
      if (c.mapX > EDGE_MAX) c.mapX = EDGE_MAX - (mulberry32(seedNum * 1013 + c.id * 37)()) * 0.04;
      if (c.mapY < EDGE_MIN) c.mapY = EDGE_MIN + (mulberry32(seedNum * 1019 + c.id * 41)()) * 0.04;
      if (c.mapY > EDGE_MAX) c.mapY = EDGE_MAX - (mulberry32(seedNum * 1021 + c.id * 43)()) * 0.04;
      // Then check ellipse boundary — if outside, pull toward center
      const dx = (c.mapX - CX) / RX, dy = (c.mapY - CY) / RY;
      const eDist = Math.sqrt(dx * dx + dy * dy);
      if (eDist > 1.0) {
        // Pull to 0.92 of ellipse boundary (slight inset for safety)
        const scale = 0.92 / eDist;
        c.mapX = CX + (c.mapX - CX) * scale;
        c.mapY = CY + (c.mapY - CY) * scale;
      }
    });

    // 2. Deterministic jitter for overlapping cities
    //    Group by rounded coord key; any group with >1 city gets spread apart
    const coordGroups = {};
    allCities.forEach(c => {
      // Key at 2-decimal precision to catch 0.3/0.3 overlaps
      const key = (Math.round(c.mapX * 100) / 100) + ',' + (Math.round(c.mapY * 100) / 100);
      if (!coordGroups[key]) coordGroups[key] = [];
      coordGroups[key].push(c);
    });
    Object.values(coordGroups).forEach(group => {
      if (group.length < 2) return;
      const n = group.length;
      group.forEach((c, i) => {
        // Spread cities in a circle around the original point
        // Use deterministic RNG seeded from city name + seed
        const jRng = mulberry32(seedNum * 7919 + c.name.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) * 131);
        const angle = (i / n) * Math.PI * 2 + jRng() * 0.5;
        // Spread radius: ~0.03 in normalized coords = ~180px at 6000px map width
        const radius = 0.02 + jRng() * 0.02;
        c.mapX = c.mapX + Math.cos(angle) * radius;
        c.mapY = c.mapY + Math.sin(angle) * radius;
        // Re-clamp after jitter (ellipse + rect)
        c.mapX = Math.max(EDGE_MIN, Math.min(EDGE_MAX, c.mapX));
        c.mapY = Math.max(EDGE_MIN, Math.min(EDGE_MAX, c.mapY));
        const jdx = (c.mapX - CX) / RX, jdy = (c.mapY - CY) / RY;
        const jeDist = Math.sqrt(jdx * jdx + jdy * jdy);
        if (jeDist > 1.0) { const s = 0.92 / jeDist; c.mapX = CX + (c.mapX - CX) * s; c.mapY = CY + (c.mapY - CY) * s; }
      });
    });

    // 3. Secondary pass: resolve any remaining collisions using city id
    const finalGroups = {};
    allCities.forEach(c => {
      const key = Math.round(c.mapX * 100) + ',' + Math.round(c.mapY * 100);
      if (!finalGroups[key]) finalGroups[key] = [];
      finalGroups[key].push(c);
    });
    Object.values(finalGroups).forEach(group => {
      if (group.length < 2) return;
      group.forEach((c, i) => {
        if (i === 0) return; // leave first city in place
        const nudge = 0.015 + 0.005 * i;
        const nudgeAngle = (c.id * 2.399) % (Math.PI * 2); // golden angle spread
        c.mapX = c.mapX + Math.cos(nudgeAngle) * nudge;
        c.mapY = c.mapY + Math.sin(nudgeAngle) * nudge;
        c.mapX = Math.max(EDGE_MIN, Math.min(EDGE_MAX, c.mapX));
        c.mapY = Math.max(EDGE_MIN, Math.min(EDGE_MAX, c.mapY));
        const ndx = (c.mapX - CX) / RX, ndy = (c.mapY - CY) / RY;
        const neDist = Math.sqrt(ndx * ndx + ndy * ndy);
        if (neDist > 1.0) { const ns = 0.92 / neDist; c.mapX = CX + (c.mapX - CX) * ns; c.mapY = CY + (c.mapY - CY) * ns; }
      });
    });
  })();

  // ── Generate POI data (from atlas metadata OR procedurally for seeds without POIs) ──
  const POI_TYPES_GEN = ["Ruins","Fortress","Temple","Tower","Mine","Shrine","Tomb","Cavern","Obelisk","Standing Stones","Dragon Lair","Portal","Battlefield","Fairy Ring","Shipwreck","Ancient Library","Graveyard","Witch's Hut","Monolith","Enchanted Grove","Sunken City","Cursed Ground"];
  const POI_NAME_PRE = ["Tower of","Crypt of","Temple of","Shrine of","Keep of","Barrow of","Fortress of","The Lost","The Sunken","Tomb of","Halls of","The Shattered","Ruins of","Cave of","The Ancient","Sanctum of","Den of","The Burning","The Frozen","Pit of","Spire of","Grove of","The Cursed","Vault of","The Whispering","Circle of","The Fallen","Throne of","The Hidden","Altar of"];
  const POI_NAME_SUF = ["Ashenveil","Ironwatch","Moonfire","Frostpeak","Silentwood","Dreadhollow","Oakenshield","Brightveil","Mistpeak","Ebonreach","Starfall","Thornkeep","Shadowmere","Duskfall","Stormbreak","Wraithwood","Crystalvein","Windscour","Blackwater","Blightmoor","Serpentcrown","Emberheart","Nightbloom","Wyrmrest","Cinderfall","Ghosthollow","Ravenmoor","Silverspire","Bloodthorn","Deepstone","Greymantle","Wolfsong","Crowspeak","Dawnreach","Voidtide"];
  const rawPois = meta.pois || [];
  const generatedPois = rawPois.length > 0 ? rawPois : (() => {
    // Generate 14-22 POIs, filling blank spaces on the map intelligently
    const gRng = mulberry32(seedNum * 8191);
    const gPick = (arr) => arr[Math.floor(gRng() * arr.length)];
    const numPois = 14 + Math.floor(gRng() * 9);
    const pois = [];
    const cityAnchors = allCities.map(c => ({ x: c.mapX, y: c.mapY, region: c.region }));
    const usedNames = new Set();
    // Existing occupied positions (cities + already-placed POIs)
    const occupied = cityAnchors.map(c => ({ x: c.x, y: c.y }));

    // Phase 1: Place POIs near cities (wilderness just outside settlements)
    const nearCityCount = Math.min(Math.floor(numPois * 0.4), cityAnchors.length);
    for (let i = 0; i < nearCityCount; i++) {
      const anchor = cityAnchors[i % cityAnchors.length];
      for (let attempt = 0; attempt < 20; attempt++) {
        const angle = gRng() * Math.PI * 2;
        const dist = 0.04 + gRng() * 0.06;
        let px = anchor.x + Math.cos(angle) * dist;
        let py = anchor.y + Math.sin(angle) * dist * 0.75;
        px = Math.max(0.06, Math.min(0.94, px));
        py = Math.max(0.06, Math.min(0.94, py));
        const pdx = (px - 0.5) / 0.35, pdy = (py - 0.5) / 0.33;
        const peDist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (peDist > 1.0) { const ps = 0.90 / peDist; px = 0.5 + (px - 0.5) * ps; py = 0.5 + (py - 0.5) * ps; }
        // Check minimum distance from existing points
        const tooClose = occupied.some(o => Math.sqrt((o.x-px)**2 + (o.y-py)**2) < 0.03);
        if (!tooClose) {
          let name;
          for (let na = 0; na < 15; na++) { name = gPick(POI_NAME_PRE) + " " + gPick(POI_NAME_SUF); if (!usedNames.has(name)) { usedNames.add(name); break; } }
          pois.push({ name, type: gPick(POI_TYPES_GEN), x: px, y: py });
          occupied.push({ x: px, y: py });
          break;
        }
      }
    }

    // Phase 2: Fill blank spaces — find areas far from any occupied point
    const remaining = numPois - pois.length;
    for (let i = 0; i < remaining; i++) {
      let bestX = 0.5, bestY = 0.5, bestMinDist = 0;
      // Sample random candidates and pick the one farthest from everything
      for (let sample = 0; sample < 40; sample++) {
        const cx = 0.08 + gRng() * 0.84;
        const cy = 0.08 + gRng() * 0.84;
        // Must be within land ellipse
        const edx = (cx - 0.5) / 0.35, edy = (cy - 0.5) / 0.33;
        if (Math.sqrt(edx * edx + edy * edy) > 0.95) continue;
        // Find minimum distance to any occupied point
        let minD = Infinity;
        for (const o of occupied) { const d = Math.sqrt((o.x-cx)**2 + (o.y-cy)**2); if (d < minD) minD = d; }
        if (minD > bestMinDist) { bestMinDist = minD; bestX = cx; bestY = cy; }
      }
      if (bestMinDist > 0.02) {
        let name;
        for (let na = 0; na < 15; na++) { name = gPick(POI_NAME_PRE) + " " + gPick(POI_NAME_SUF); if (!usedNames.has(name)) { usedNames.add(name); break; } }
        pois.push({ name, type: gPick(POI_TYPES_GEN), x: bestX, y: bestY });
        occupied.push({ x: bestX, y: bestY });
      }
    }
    return pois;
  })();
  const allPois = [];
  let poiId = 1;
  const poiRng = mulberry32(seedNum * 4217);
  const poiPick = (arr) => arr[Math.floor(poiRng() * arr.length)];
  const poiPickN = (arr, n) => { const s = [...arr].sort(() => poiRng() - 0.5); return s.slice(0, Math.min(n, s.length)); };
  generatedPois.forEach((p, pi) => {
    const pRng = mulberry32(seedNum * 1031 + pi * 73);
    const pPick = (arr) => arr[Math.floor(pRng() * arr.length)];
    const pPickN = (arr, n) => { const s = [...arr].sort(() => pRng() - 0.5); return s.slice(0, Math.min(n, s.length)); };
    const lorePool = POI_LORE[p.type] || POI_LORE.default;
    const threat = pPick(POI_THREAT_LEVELS);
    const numQuests = 1 + Math.floor(pRng() * 2);
    const quests = pPickN(POI_QUESTS, numQuests).map(q => ({
      ...q,
      reward: pPick(POI_REWARDS),
      difficulty: threat === "extreme" ? "Deadly" : threat === "high" ? "Hard" : threat === "medium" ? "Moderate" : "Easy",
    }));
    // Find nearest region
    let nearestRegion = regions[0]?.name || "Unknown";
    let minDist = Infinity;
    meta.regions.forEach((r) => {
      (r.cities || []).forEach(c => {
        const dx = p.x - c.x, dy = p.y - c.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) { minDist = d; nearestRegion = r.name; }
      });
    });
    // Generate a rich, unique description based on type, threat, and region
    const POI_DESC_TEMPLATES = {
      Ruins: [`Crumbling remnants of a once-great structure, now claimed by nature and shadow in the wilds of ${nearestRegion}.`,`Weathered stone walls and shattered archways mark this forgotten place in ${nearestRegion}. The silence here feels deliberate.`,`An ancient ruin whose original purpose has been lost to time. Local shepherds in ${nearestRegion} give it a wide berth.`],
      Fortress: [`A formidable stronghold commanding the approaches to ${nearestRegion}, its battlements scarred by siege and time.`,`Stone ramparts and iron-bound gates guard whatever secrets this abandoned fortress still holds in ${nearestRegion}.`,`A military fortification of impressive scale, built to control the strategic passes near ${nearestRegion}.`],
      Temple: [`A sacred place of worship standing in quiet reverence amid the landscapes of ${nearestRegion}. Incense still seems to linger in the air.`,`This hallowed site in ${nearestRegion} once drew pilgrims from across the realm. The divine presence here feels diminished but not gone.`,`A temple of forgotten rites, its altars cold but not entirely abandoned. Something still watches from within.`],
      Tower: [`A lone spire piercing the sky above ${nearestRegion}, its purpose debated by scholars and feared by locals.`,`This wizard's tower stands as a monument to arcane ambition in ${nearestRegion}. Strange lights still flicker in its windows.`,`A solitary tower whose upper chambers hold secrets the lower floors were designed to protect.`],
      Mine: [`Deep shafts bore into the earth near ${nearestRegion}, once yielding precious minerals. The miners left, but something else moved in.`,`An abandoned excavation in the hills of ${nearestRegion}. The tunnels go deeper than any legitimate mining operation would warrant.`,`A network of tunnels and shafts carved into the rock, silent now except for the dripping of subterranean water.`],
      Shrine: [`A small but potent holy site in ${nearestRegion} where the boundary between mortal and divine wears thin.`,`Offerings and prayer beads adorn this humble roadside shrine, tended by no one yet never neglected.`,`A place of quiet devotion in ${nearestRegion} where travelers pause to ask for blessings and leave tokens of gratitude.`],
      Tomb: [`A sealed burial site in ${nearestRegion} whose occupant was important enough to be entombed with traps, guards, and wards.`,`The dead rest uneasily here. This burial vault in ${nearestRegion} is surrounded by warnings both ancient and recent.`,`A mausoleum of considerable grandeur, suggesting its occupant was royalty — or something that demanded royal treatment.`],
      Cavern: [`A vast natural cave system beneath the terrain of ${nearestRegion}, echoing with the sounds of underground rivers and unseen movement.`,`Dark passages wind deep beneath ${nearestRegion}, opening into chambers of breathtaking — and terrifying — scale.`,`A cave mouth yawns in the hillside, exhaling cold air that carries unfamiliar scents from deep below.`],
      Obelisk: [`A mysterious stone monolith standing in eerie isolation amid the terrain of ${nearestRegion}. Its inscriptions defy translation.`,`This towering pillar of dark stone hums with barely-contained energy. No one knows who raised it or why.`,`An ancient marker of unknown origin in ${nearestRegion}, seemingly placed with astronomical precision.`],
      "Standing Stones": [`A circle of ancient menhirs arranged with mathematical precision in ${nearestRegion}. The air within the circle tastes of copper and ozone.`,`Weathered megaliths forming a ritual circle that predates every known civilization in the region.`,`These standing stones mark a place of power in ${nearestRegion} where the veil between worlds wears gossamer-thin.`],
      "Dragon Lair": [`A scorched and scarred cavern reeking of sulfur and old fire. The lands around it in ${nearestRegion} bear the unmistakable marks of dragonfire.`,`The lair of a great wyrm — whether occupied or vacant, only the brave or foolish would enter to find out.`,`Bones of cattle and less identifiable creatures litter the approach to this lair in ${nearestRegion}. The ground itself feels warm.`],
      Portal: [`A shimmering gateway to somewhere else, flickering with energies that make nearby compasses spin and hair stand on end.`,`An arcane doorway in ${nearestRegion} that opens to destinations unknown. The destination seems to shift with cosmic cycles.`,`A tear in the fabric of reality, framed by ancient stonework that suggests it was created deliberately — and recently reactivated.`],
      Battlefield: [`Blood-soaked earth where armies clashed and fell in ${nearestRegion}. The land itself seems wounded, and nothing grows right here.`,`A scarred plain littered with the remnants of a great battle. Rusted weapons and bleached bones surface after every rain.`,`The site of a decisive conflict that shaped the history of ${nearestRegion}. Monuments to the fallen stand alongside unmarked mass graves.`],
      "Fairy Ring": [`A circle of luminous mushrooms marking a thin spot between the material world and the Feywild in ${nearestRegion}.`,`Where the fey hold court in ${nearestRegion}, time runs sideways and bargains are never quite what they seem.`,`A natural circle of ancient trees where the boundary between worlds dissolves on certain nights. The rules here are not mortal rules.`],
      Shipwreck: [`The shattered hull of a great vessel, beached or grounded far from any navigable water — raising disturbing questions about how it arrived.`,`A derelict ship whose cargo and crew tell a story of a voyage gone terribly wrong. The captain's log may hold answers.`,`Timbers and rigging from a wrecked vessel, its origin and final destination both mysteries worth unraveling.`],
      "Ancient Library": [`A hidden repository of knowledge in ${nearestRegion}, its shelves holding texts that powerful factions would kill to possess — or destroy.`,`A vast collection of scrolls, tomes, and tablets accumulated over centuries. The organizational system is as inscrutable as the contents.`,`Knowledge forbidden, forgotten, and fiercely guarded — all stored in this silent library beneath the wilds of ${nearestRegion}.`],
      Graveyard: [`An ancient burial ground in ${nearestRegion} where the dead don't always stay put. The caretaker has long since fled.`,`Row upon row of weathered headstones mark the resting places of the forgotten. Some graves have been disturbed — from the inside.`,`A cemetery of considerable age and dubious peace, where mist clings to the ground even at midday.`],
      "Witch's Hut": [`A crooked dwelling on the edge of the wilds, home to hedge magic and questionable potions. The locals in ${nearestRegion} know to approach with respect.`,`A cottage wreathed in herb smoke and surrounded by impossible gardens. The occupant — if present — knows things no one should.`,`A ramshackle hut that is far more spacious inside than out. Bottles of strange liquids line every surface, each one labeled in a different hand.`],
      Monolith: [`A single massive stone standing sentinel over the landscape of ${nearestRegion}, its purpose debated and its origin unknown.`,`A megalithic pillar that resonates with deep vibrations during thunderstorms. Something sleeps beneath it — or within it.`,`An ancient stone of impossible weight and unknown origin, covered in carvings that seem to shift when not directly observed.`],
      "Enchanted Grove": [`A stand of trees suffused with primal magic in ${nearestRegion}. The forest here is ancient, aware, and not entirely friendly.`,`Golden light filters through impossible canopies in this enchanted woodland. Time flows differently beneath these boughs.`,`A grove where nature's magic runs wild and unchecked. The plants grow in patterns that suggest intelligence — or direction.`],
      "Sunken City": [`The spires and rooftops of a drowned civilization break the surface of still waters in ${nearestRegion}. The city below is remarkably intact.`,`An entire settlement swallowed by water or earth, preserved in an eerie underwater stillness. Lights are sometimes seen in the depths.`,`A submerged metropolis whose streets can be walked at low tide — if you're quick, brave, and don't mind what might be watching.`],
      "Cursed Ground": [`A blighted stretch of land in ${nearestRegion} where nothing thrives and even shadows seem reluctant to linger.`,`The earth here is wrong — ashen, warm, and hostile to life. Something terrible happened here, and the land remembers.`,`A place of palpable malice in ${nearestRegion}. Animals flee, plants wither, and travelers report a crushing sense of dread.`],
    };
    const descPool = POI_DESC_TEMPLATES[p.type] || [`A mysterious ${p.type.toLowerCase()} in the wilds of ${nearestRegion}, surrounded by legends and warnings in equal measure.`];
    allPois.push({
      id: `poi-${poiId++}`,
      name: p.name,
      type: p.type,
      mapX: p.x,
      mapY: p.y,
      region: nearestRegion,
      threat: threat,
      lore: pPick(lorePool),
      quests: quests,
      explored: false,
      reward: pPick(POI_REWARDS),
      description: pPick(descPool),
    });
  });

  return { regions, factions, npcs: allNpcs, cities: allCities, pois: allPois };
}

/**
 * Ensures data consistency after any mutation (DM edits, Living World events, etc.)
 * Call this after any setData that modifies factions, regions, or cities.
 */
function ensureDataConsistency(data) {
  const d = { ...data };

  // 1. Sync faction colors/names into cities that reference them
  if (d.cities && d.factions) {
    d.cities = d.cities.map(city => {
      const region = (d.regions || []).find(r => r.name === city.region);
      if (region) {
        return { ...city, faction: region.ctrl, threat: region.threat };
      }
      return city;
    });
  }

  // 2. Sync region state into cities
  // Destroyed regions = destroyed cities. Conquered regions = occupied (not destroyed — they have a new ruler).
  if (d.regions && d.cities) {
    d.cities = d.cities.map(city => {
      const region = (d.regions || []).find(r => r.name === city.region);
      if (region && region.state === "destroyed") {
        return { ...city, destroyed: true };
      }
      // Conquered regions are occupied, not destroyed — cities still function under new rule
      if (region && region.state === "conquered") {
        return { ...city, destroyed: false, faction: region.ctrl };
      }
      if (region && region.state !== "destroyed" && city.destroyed) {
        return { ...city, destroyed: false }; // recovered
      }
      return city;
    });
  }

  // 3. Kill NPCs in destroyed regions
  if (d.regions && d.npcs) {
    const destroyedRegions = new Set((d.regions || []).filter(r => r.state === "destroyed").map(r => r.name));
    const destroyedCities = new Set((d.cities || []).filter(c => c.destroyed).map(c => c.name));
    d.npcs = d.npcs.map(npc => {
      if (npc.alive && (destroyedRegions.has(npc.loc) || destroyedCities.has(npc.loc))) {
        // 60% chance of death when region destroyed, leaders more likely to survive
        if (Math.random() < (npc.isLeader ? 0.3 : 0.6)) {
          return { ...npc, alive: false };
        }
        // Survivors flee to a random non-destroyed region
        const safeRegions = (d.regions || []).filter(r => r.state !== "destroyed" && r.state !== "conquered");
        if (safeRegions.length > 0) {
          const safeRegion = safeRegions[Math.floor(Math.random() * safeRegions.length)];
          return { ...npc, loc: safeRegion.name };
        }
      }
      return npc;
    });
  }

  // 4. Update faction power based on controlled regions
  if (d.factions && d.regions) {
    d.factions = d.factions.map(f => {
      const controlledRegions = (d.regions || []).filter(r => r.ctrl === f.name);
      const destroyedCount = controlledRegions.filter(r => r.state === "destroyed" || r.state === "conquered").length;
      const stableCount = controlledRegions.length - destroyedCount;
      // Faction with no stable regions loses power rapidly
      if (controlledRegions.length > 0 && stableCount === 0) {
        return { ...f, power: Math.max(5, f.power - 5), trend: "declining" };
      }
      return f;
    });
  }

  // 5. Ensure region.cities list matches actual cities in that region
  if (d.regions && d.cities) {
    d.regions = d.regions.map(r => ({
      ...r,
      cities: (d.cities || []).filter(c => c.region === r.name).map(c => c.name)
    }));
  }

  return d;
}

window.__ensureDataConsistency = ensureDataConsistency;

// Expose generator for cloud save compaction (campaigns.html uses this to diff)
window.__cmRegensAndFactions = regionsAndFactionsFromMetadata;

/**
 * Delegated proxy for cmCompactForCloud (real function in campaigns.html).
 * This prevents code from breaking if it calls this directly.
 * The campaigns.html version has the sophisticated diff-based compaction.
 */
window.__cmCompactForCloud = function(data) {
  // If campaigns.html hasn't loaded yet, return as-is
  if (typeof cmCompactForCloud !== 'function') return data;
  return cmCompactForCloud(data);
};

// ═══════════════════════════════════════════════════════════════════════════
// LIVING WORLD → TIMELINE AUTO-INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Append a Living World event to the campaign timeline.
 * Groups events into the most recent "Living World" session entry, or creates one.
 * Only major events should be passed here.
 */
function _lwAppendToTimeline(timeline, lwEvent) {
  const tl = [...(timeline || [])];
  const today = new Date().toISOString().slice(0, 10);
  const evObj = {
    id: "lw-" + (lwEvent.id || "") + "-" + Date.now(),
    type: "world_change",
    headline: lwEvent.headline || "World Event",
    text: lwEvent.detail || lwEvent.headline || "",
    outcome: lwEvent.category ? (lwEvent.category.charAt(0).toUpperCase() + lwEvent.category.slice(1) + " event") : "World change",
    dmOnly: false,
    importance: lwEvent.importance || "major",
    scope: "world",
    icon: lwEvent.icon,
  };

  // Find or create today's auto-generated Living World session
  const autoSessionIdx = tl.findIndex(s => s._lwAutoSession && s.date === today);
  if (autoSessionIdx >= 0) {
    // Append event to existing auto-session
    const session = { ...tl[autoSessionIdx] };
    session.events = [...(session.events || []), evObj];
    session.summary = _lwBuildAutoSummary(session.events);
    tl[autoSessionIdx] = session;
  } else {
    // Create a new auto-session for today
    const maxN = tl.reduce((m, s) => Math.max(m, s.n || 0), 0);
    tl.unshift({
      id: Date.now(),
      n: maxN + 1,
      title: "World Events",
      date: today,
      summary: evObj.headline,
      events: [evObj],
      changes: [],
      notes: "",
      dmOnly: false,
      _lwAutoSession: true, // Marker so we can find it later
    });
  }
  return tl;
}

/**
 * Batch-append multiple Living World events to the timeline (used by time-skip).
 * Creates a single "Time Skip" session entry with all major events.
 */
function _lwBatchToTimeline(timeline, lwEvents, skipLabel) {
  const tl = [...(timeline || [])];
  const today = new Date().toISOString().slice(0, 10);
  const majorEvents = lwEvents.filter(e => e.importance === "major");
  if (majorEvents.length === 0) return tl;

  const evObjs = majorEvents.map(e => ({
    id: "lw-" + (e.id || "") + "-" + (e.timestamp || Date.now()),
    type: "world_change",
    headline: e.headline || "World Event",
    text: e.detail || e.headline || "",
    outcome: e.category ? (e.category.charAt(0).toUpperCase() + e.category.slice(1) + " event") : "World change",
    dmOnly: false,
    importance: e.importance || "major",
    scope: "world",
    icon: e.icon,
  }));

  const maxN = tl.reduce((m, s) => Math.max(m, s.n || 0), 0);
  tl.unshift({
    id: Date.now(),
    n: maxN + 1,
    title: skipLabel || "Time Passes",
    date: today,
    summary: majorEvents.length + " major events shaped the world: " + majorEvents.slice(0, 3).map(e => e.headline).join(", ") + (majorEvents.length > 3 ? "..." : ""),
    events: evObjs,
    changes: majorEvents.map(e => e.headline),
    notes: "Auto-generated from Living World time skip (" + lwEvents.length + " total events, " + majorEvents.length + " major).",
    dmOnly: false,
    _lwAutoSession: true,
  });
  return tl;
}

function _lwBuildAutoSummary(events) {
  const majors = events.filter(e => e.importance === "major");
  if (majors.length === 0) return events.length + " world events occurred.";
  return majors.slice(0, 3).map(e => e.headline).join(". ") + (majors.length > 3 ? " and more..." : ".");
}

// ═══════════════════════════════════════════════════════════════════════════
// WORLD STATE
// ═══════════════════════════════════════════════════════════════════════════

function WorldView({ data, setData, onNav, viewRole = "dm", navTarget, clearNavTarget }) {
  const isDM = viewRole === "dm";
  const isLive = data.campaignType === "live";
  const [sel,setSel] = useState(null);
  const [selType,setSelType] = useState(null);
  const [tab,setTab] = useState("map");
  const [atlasProvinceId,setAtlasProvinceId] = useState(null);
  const [editing,setEditing] = useState(false);
  const [addingEntity,setAddingEntity] = useState(false);
  const [worldOverlay,setWorldOverlay] = useState("atlas");
  const [worldSearch,setWorldSearch] = useState("");
  const [routeDraft,setRouteDraft] = useState({ fromId: null, toId: null });
  const [cityPopup,setCityPopup] = useState(null); // { city, screenX, screenY } for map tooltip
  const [regionPopup,setRegionPopup] = useState(null); // { region, territory } for map region tooltip
  const [cityRegionFocus,setCityRegionFocus] = useState(null); // region name to highlight in Cities tab
  const [expandedRegions, setExpandedRegions] = useState({}); // track which regions are expanded in consolidated view
  const [regionDetailCity, setRegionDetailCity] = useState(null); // city selected within a region for detail view
  // ── POI tab state ──
  const [poiFilter, setPoiFilter] = useState("all");
  const [poiSearch, setPoiSearch] = useState("");
  // ── Calendar state ──
  const [calKingdom, setCalKingdom] = useState("all");
  const [calDay, setCalDay] = useState(data.calendarDay || 15);
  const [calMonth, setCalMonth] = useState(data.calendarMonth || 0);
  const [calYear, setCalYear] = useState(data.calendarYear || 1042);
  // ── Hex exploration state ──
  const [hexOrigin, setHexOrigin] = useState("");
  const [hexDest, setHexDest] = useState("");
  const [hexPartyPos, setHexPartyPos] = useState(0); // current hex index on the path (0 = origin)
  const [hexLog, setHexLog] = useState([]); // exploration log entries
  const [hexSelectedHex, setHexSelectedHex] = useState(null); // index of clicked hex for detail
  const [townView,setTownView] = useState(null); // city name string when viewing a town map
  const [townSelBldg,setTownSelBldg] = useState(null); // selected building index in town view
  const [townHovBldg,setTownHovBldg] = useState(null); // hovered building index in town view
  const [townZoom,setTownZoom] = useState(1);
  const [townPan,setTownPan] = useState({ x: 0, y: 0 });
  const townDragRef = useRef(null);
  const townMapContainerRef = useRef(null);
  const [isMapCompact,setIsMapCompact] = useState(() => typeof window !== "undefined" ? window.innerWidth < 860 : false);
  const worldMapState = normalizeWorldMapState(data.worldMap);

  // ── Deep-link navigation from other tabs ──
  useEffect(() => {
    if (!navTarget) return;
    const { subTab, entityType, entityId, entityName } = navTarget;
    if (subTab) setTab(subTab);
    if (entityType && (entityId || entityName)) {
      let entity = null;
      const list = entityType === "faction" ? (data.factions || [])
        : entityType === "npc" ? (data.npcs || [])
        : entityType === "region" ? (data.regions || [])
        : entityType === "city" ? (data.cities || [])
        : [];
      entity = entityId ? list.find(e => e.id === entityId) : list.find(e => e.name === entityName);
      if (entity) {
        setSel(entity);
        setSelType(entityType);
      }
    }
    if (clearNavTarget) clearNavTarget();
  }, [navTarget]);

  // ── Living World Engine state ──
  const [lwActive, setLwActive] = useState(false);
  const [lwEvents, setLwEvents] = useState(() => (data._lwEventLog || []).slice(0, 30)); // visible event ticker items
  const [lwLog, setLwLog] = useState(() => data._lwEventLog || []); // full event history
  const [lwShowLog, setLwShowLog] = useState(false);
  const [lwSpeed, setLwSpeed] = useState(() => {
    const freq = data.modules && data.modules.lwEventFrequency;
    if (freq === "Custom") return parseInt(data.modules.lwEventFrequencyCustom) || 90;
    if (freq) return parseInt(freq) || 90;
    return 90;
  }); // seconds between events
  const [lwTimeSkipOpen, setLwTimeSkipOpen] = useState(false);
  const [lwTimeSkipSummary, setLwTimeSkipSummary] = useState(null); // array of events or null
  const [lwTimeSkipProgress, setLwTimeSkipProgress] = useState(null); // null or { current, total }
  const [lwPartyActionsOpen, setLwPartyActionsOpen] = useState(false); // party actions panel
  const [lwActionTarget, setLwActionTarget] = useState(null); // { actionId, targetFaction?, allyFaction? }
  const lwTimerRef = useRef(null);
  const broadcastRef = useRef(null);
  const realtimeRef = useRef(null);

  // Reset all sub-system state when the map seed changes
  useEffect(function() {
    // Clear selection (old region/city/faction no longer exists)
    setSel(null);
    setSelType(null);
    // Reset POI filters
    setPoiFilter("all");
    setPoiSearch("");
    // Stop and reset living world engine
    setLwActive(false);
    setLwEvents([]);
    setLwLog([]);
    setLwTimeSkipSummary(null);
    setLwTimeSkipProgress(null);
    if (window.livingWorld) { window.livingWorld.stop(); }
  }, [data.atlasMapSeed]);

  // Start/stop the Living World engine
  useEffect(() => {
    if (!isLive) return;
    if (!window.livingWorld) return;
    if ((data.modules || {}).livingWorld === false) return; // Module disabled in settings
    const engine = window.livingWorld;
    if (lwActive && data.factions?.length > 0) {
      engine.setData(data);
      engine.onEvent = (event) => {
        setLwEvents(prev => [event, ...prev].slice(0, 30));
        setLwLog(prev => [event, ...prev]);
        // Persist to campaign data for save/load + auto-add major events to timeline
        setData(d => {
          const updated = {
            ...d,
            _lwEventLog: [
              { ...event, timestamp: Date.now(), mutations: undefined },
              ...(d._lwEventLog || [])
            ].slice(0, 200)
          };
          // Auto-add major events to the timeline for live campaigns
          if (event.importance === "major") {
            updated.timeline = _lwAppendToTimeline(d.timeline || [], event);
          }
          return updated;
        });
      };
      engine.onStateUpdate = (mutator) => {
        setData(d => {
          try {
            const mutated = mutator(d);
            const updated = ensureDataConsistency(mutated);
            // Save living-world engine state (relations, wars, treaties) to campaign data
            const engineState = engine.getSerializedState();
            const withEngineState = { ...updated, _lwEngineState: engineState };
            engine.setData(withEngineState);
            return withEngineState;
          } catch (err) {
            console.error('[LivingWorld] Error applying state mutations:', err);
            // Return data unchanged to prevent state corruption
            return d;
          }
        });
      };
      engine.start(data, { intervalMs: lwSpeed * 1000 });
      // Note: engine.start() now automatically restores persisted state from data._lwEngineState
    } else {
      engine.stop();
    }
    return () => { engine.stop(); };
  }, [data, lwActive, lwSpeed, isLive]);

  // Keep engine's data reference current
  useEffect(() => {
    if (!isLive) return;
    if (window.livingWorld && lwActive) window.livingWorld.setData(data);
  }, [data, lwActive, isLive]);

  // ── Real-time player sync via BroadcastChannel ──
  useEffect(() => {
    if (!isLive) return;
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('campaign-sync-' + (data.id || 'default'));
    broadcastRef.current = channel;

    // Listen for updates from other tabs (DM → Player sync)
    channel.onmessage = (event) => {
      // Validate incoming message has expected shape
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'state-update' && viewRole === 'player') {
        // Player receives DM's state updates
        const payload = event.data.payload;
        if (payload && typeof payload === 'object') {
          setData(d => ({ ...d, ...payload }));
        }
      }
    };

    return () => { channel.close(); broadcastRef.current = null; };
  }, [data.id, viewRole, isLive]);

  // Broadcast state changes when DM modifies data
  useEffect(() => {
    if (!isLive) return;
    if (viewRole !== 'dm' || !broadcastRef.current) return;
    // Debounce broadcasts to avoid flooding
    const timer = setTimeout(() => {
      try {
        // Only broadcast the fields players need (not full data)
        broadcastRef.current.postMessage({
          type: 'state-update',
          payload: {
            regions: data.regions,
            factions: data.factions,
            cities: data.cities?.map(c => ({ ...c, shops: undefined, tavern: undefined })), // strip shop details for perf
            npcs: data.npcs?.filter(n => !n.secret), // strip secrets from player view
            pois: data.pois,
          }
        });
      } catch(e) { /* BroadcastChannel may fail silently */ }
    }, 2000);
    return () => clearTimeout(timer);
  }, [data.regions, data.factions, data.cities, data.npcs, data.pois, viewRole, isLive]);

  // ── Cross-device multiplayer sync via Supabase Realtime ──
  useEffect(() => {
    if (!isLive) return;
    if (typeof PhmurtRealtime === 'undefined' || !PhmurtRealtime) return;
    if (!data.id) return; // Need campaign ID for channel name

    const role = viewRole || 'dm';

    // Store the handle returned by joinBattleMap for proper cleanup
    const handle = PhmurtRealtime.joinBattleMap(data.id, role, (incomingState) => {
      try {
        // Player receives DM state updates via Supabase Realtime
        if (role === 'player' && incomingState) {
          setData(d => {
            const merged = { ...d };
            // Merge incoming fields (DM pushes world state to players)
            if (incomingState.regions) merged.regions = incomingState.regions;
            if (incomingState.factions) merged.factions = incomingState.factions;
            if (incomingState.cities) {
              // Preserve local shop/tavern data, merge rest
              merged.cities = incomingState.cities.map(ic => {
                const local = (d.cities || []).find(c => c.id === ic.id);
                return local ? { ...local, ...ic, shops: local.shops, tavern: local.tavern } : ic;
              });
            }
            if (incomingState.npcs) {
              // Strip secrets for player view
              merged.npcs = incomingState.npcs.map(n => ({ ...n, secret: undefined }));
            }
            if (incomingState.pois) merged.pois = incomingState.pois;
            if (incomingState._lwEvents) {
              // Merge Living World events with deduplication
              setLwEvents(prev => {
                const combined = [...(incomingState._lwEvents || []), ...prev];
                const seen = new Set();
                const deduplicated = combined.filter(evt => {
                  // Use event ID or timestamp as unique key
                  const key = evt.id || evt.timestamp || String(Date.now()) + Math.random();
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                return deduplicated.slice(0, 30);
              });
              setLwLog(prev => [...(incomingState._lwEvents || []), ...prev]);
            }
            // Persist DM's full event history locally
            if (incomingState._lwEventLog && incomingState._lwEventLog.length) {
              merged._lwEventLog = incomingState._lwEventLog;
            }
            return merged;
          });
        }
      } catch (err) {
        console.error('[PhmurtRealtime] Error processing state update:', err);
      }
    });
    realtimeRef.current = handle;

    return () => {
      // Use the handle's leave() method to properly unsubscribe
      if (handle && typeof handle.leave === 'function') {
        handle.leave();
      }
      realtimeRef.current = null;
    };
  }, [data.id, viewRole, isLive]);

  // DM broadcasts world state changes to players via Supabase Realtime
  useEffect(() => {
    if (!isLive) return;
    if (viewRole !== 'dm' || !realtimeRef.current) return;
    if (!data.id || !data.regions) return;

    const timer = setTimeout(() => {
      try {
        const payload = {
          regions: data.regions,
          factions: data.factions,
          cities: (data.cities || []).map(c => {
            const { shops, tavern, ...rest } = c;
            return rest;
          }),
          npcs: (data.npcs || []).map(n => ({ ...n, secret: undefined })),
          pois: data.pois,
          _lwEvents: lwEvents.slice(0, 5), // Last 5 events for quick display
          _lwEventLog: (data._lwEventLog || []).slice(0, 50), // Full history for player persistence
        };
        PhmurtRealtime.broadcastState(data.id, payload);

        // Also save snapshot periodically for late-joining players
        PhmurtRealtime.saveSnapshot(data.id, payload);
      } catch(e) { console.warn('Realtime broadcast failed:', e); }
    }, 3000); // 3s debounce for cross-device (longer than BroadcastChannel)

    return () => clearTimeout(timer);
  }, [data.regions, data.factions, data.cities, data.npcs, data.pois, lwEvents, viewRole, data.id, isLive]);

  // ── (Old map generation modal state removed — now using pre-generated atlas SVGs) ──

  // ── Map state — starts zoomed out to see the whole continent ──
  const [mapZoom, setMapZoom] = useState(0.25);
  const [mapPan, setMapPan] = useState({ x: 60, y: 30 });
  const [dragging, setDragging] = useState(null);
  const mapRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const mapEngineRef = useRef(null);
  const dataRef = useRef(data); // kept in sync for MapEngine callbacks
  dataRef.current = data;
  const mapTouchRef = useRef({ active: false });
  const [zoomLevel, setZoomLevel] = useState("continent"); // continent | kingdom | local | detail

  // Track when town images become available (loaded on demand)
  const [townImagesReady, setTownImagesReady] = useState(() => !!window.TOWN_IMAGES);

  // ── Lazy-load town-images when World tab opens (so buttons appear) ──
  useEffect(() => {
    if (window.TOWN_IMAGES) { setTownImagesReady(true); return; }
    // Trigger lazy load from campaigns.html's loadDataModule function
    if (typeof window.loadDataModule === "function") {
      window.loadDataModule("town-images", "town-images.js")
        .then(() => setTownImagesReady(true))
        .catch(function(err) {
          console.error("[CampaignWorld] Failed to load town-images:", err);
        });
    }
    // Also poll in case it was loaded by something else
    const check = setInterval(() => {
      if (window.TOWN_IMAGES) { setTownImagesReady(true); clearInterval(check); }
    }, 300);
    return () => clearInterval(check);
  }, []);

  // Update zoom level label
  useEffect(() => {
    if (mapZoom < 0.6) setZoomLevel("continent");
    else if (mapZoom < 1.5) setZoomLevel("kingdom");
    else if (mapZoom < 3.0) setZoomLevel("local");
    else setZoomLevel("detail");
  }, [mapZoom]);

  useEffect(() => {
    let resizeTimer = null;
    const onResize = () => {
      // Debounce resize handler to avoid excessive state updates
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMapCompact(window.innerWidth < 860);
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Auto-fit atlas map to show the entire map within the viewport
  const fitAtlasToView = React.useCallback(() => {
    if (!data.atlasMapSeed || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const vw = rect.width || 1200;
    const vh = rect.height || 800;
    // Calculate zoom to fit the entire map within the viewport (Math.min = no cropping)
    const fitZoom = Math.min(vw / MAP_W, vh / MAP_H);
    setMapZoom(fitZoom);
    // Center the map
    setMapPan({
      x: (vw - MAP_W * fitZoom) / 2,
      y: (vh - MAP_H * fitZoom) / 2,
    });
  }, [data.atlasMapSeed]);

  // Re-fit when seed changes
  useEffect(() => { fitAtlasToView(); }, [data.atlasMapSeed]);

  // Re-fit on window resize with debouncing
  useEffect(() => {
    if (!data.atlasMapSeed) return;
    let resizeTimer = null;
    const handle = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => fitAtlasToView(), 150);
    };
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
      clearTimeout(resizeTimer);
    };
  }, [fitAtlasToView]);

  // Auto-generate world data if seed is set but regions/factions/npcs are empty
  // When MapEngine is available, its useEffect handles data generation via the bridge.
  // This fallback only runs when MapEngine hasn't loaded yet (non-map tab on first load).
  useEffect(() => {
    if (!data.atlasMapSeed) return;
    const seedNum = parseInt(data.atlasMapSeed);
    if (isNaN(seedNum)) return;
    // Only auto-generate if the world data is empty (fresh campaign)
    if (data.regions && data.regions.length > 0) return;
    // Skip if MapEngine + bridge are available — the map useEffect will handle it
    if (typeof window.MapEngine === "function" && typeof window.mapEngineToWorldData === "function") return;
    const result = regionsAndFactionsFromMetadata(seedNum);
    const meta = (typeof ATLAS_METADATA !== 'undefined') && ATLAS_METADATA[seedNum];
    if (result) {
      setData(d => ({
        ...d,
        regions: result.regions,
        factions: result.factions,
        npcs: result.npcs || [],
        cities: result.cities || [],
        pois: result.pois || [],
        name: (meta && meta.mapName) || d.name,
      }));
    }
  }, [data.atlasMapSeed]);

  // ── Generate world data from MapEngine whenever seed changes (any tab) ──
  // This ensures regions/factions/cities/npcs/pois always match the procedural map.
  useEffect(() => {
    if (!data.atlasMapSeed) return;
    const seedNum = parseInt(data.atlasMapSeed);
    if (isNaN(seedNum)) return;
    if (typeof window.MapEngine !== "function" || typeof window.mapEngineToWorldData !== "function") return;

    // Use an offscreen canvas for headless generation
    const offscreen = document.createElement("canvas");
    offscreen.width = 200; offscreen.height = 200;
    const engine = new window.MapEngine(offscreen);
    engine.generate(seedNum);

    const worldData = window.mapEngineToWorldData(engine, seedNum);
    if (worldData) {
      setData(function(d) {
        return Object.assign({}, d, {
          regions: worldData.regions,
          factions: worldData.factions,
          npcs: worldData.npcs || [],
          cities: worldData.cities || [],
          pois: worldData.pois || [],
          name: worldData.name || d.name,
          _lwEventLog: [],
          quests: [],
          encounters: [],
          activity: [{ time: "Just now", text: "World map generated (seed " + seedNum + ")" }],
        });
      });
    }

    // Clean up offscreen engine and canvas to prevent memory leaks
    if (engine.renderer) engine.renderer.destroy();
    // Also clean up the engine reference itself
    engine.grid = null;
    engine.territory = null;
    engine.borders = null;
    engine.roads = null;
    // Clear canvas data explicitly to free GPU memory
    const offscreenCtx = offscreen.getContext("2d");
    if (offscreenCtx) {
      offscreenCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    }
  }, [data.atlasMapSeed]);

  // ── MapEngine: create/destroy VISUAL instance when canvas mounts or seed changes ──
  useEffect(() => {
    if (tab !== "map" || !mapCanvasRef.current) return;
    const seedNum = parseInt(data.atlasMapSeed || "1");
    if (isNaN(seedNum)) return;

    // Destroy old engine
    if (mapEngineRef.current && mapEngineRef.current.renderer) {
      mapEngineRef.current.renderer.destroy();
    }

    // Create new engine attached to the visible canvas
    if (typeof window.MapEngine !== "function") return;
    const engine = new window.MapEngine(mapCanvasRef.current);
    mapEngineRef.current = engine;

    // Wire callbacks: when user clicks a region/city on the canvas map, select it in the side panel
    engine.onRegionClick(function(region, faction) {
      if (region) {
        const d = dataRef.current;
        const r = (d.regions || []).find(function(reg) {
          return reg.name === region.name;
        });
        if (r) { setSel(r); setSelType("region"); }
      }
    });
    engine.onCityClick(function(city) {
      if (city) {
        const d = dataRef.current;
        const c = (d.cities || []).find(function(ci) { return ci.name === city.name; });
        if (c) { setSel(c); setSelType("city"); }
      }
    });

    // Generate the map (same seed = same deterministic output as the data generation)
    engine.generate(seedNum);

    return function() {
      if (mapEngineRef.current && mapEngineRef.current.renderer) {
        mapEngineRef.current.renderer.destroy();
      }
      mapEngineRef.current = null;
    };
  }, [tab, data.atlasMapSeed]);

  // ── MapEngine: resize canvas when container resizes ──
  useEffect(() => {
    if (tab !== "map" || !mapCanvasRef.current || !mapEngineRef.current) return;

    let ro = null;
    let debounceTimer = null;

    // Debounce render calls to avoid excessive redraws during rapid resizes
    const scheduleRender = function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        if (mapEngineRef.current && mapEngineRef.current.renderer) {
          mapEngineRef.current.renderer.render();
        }
      }, 100);
    };

    ro = new ResizeObserver(scheduleRender);
    if (mapRef.current) ro.observe(mapRef.current);

    return function() {
      if (ro) ro.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [tab, data.atlasMapSeed]);

  // Build lookup maps once to avoid O(n²) patterns in conns()
  const factionByName = useMemo(() => {
    const map = {};
    (data.factions || []).forEach(f => map[f.name] = f);
    return map;
  }, [data.factions]);

  const regionByName = useMemo(() => {
    const map = {};
    (data.regions || []).forEach(r => map[r.name] = r);
    return map;
  }, [data.regions]);

  const npcsByLocation = useMemo(() => {
    const map = {};
    (data.npcs || []).forEach(n => {
      if (!map[n.loc]) map[n.loc] = [];
      map[n.loc].push(n);
    });
    return map;
  }, [data.npcs]);

  const npcsByFaction = useMemo(() => {
    const map = {};
    (data.npcs || []).forEach(n => {
      if (!map[n.faction]) map[n.faction] = [];
      map[n.faction].push(n);
    });
    return map;
  }, [data.npcs]);

  const regionsByController = useMemo(() => {
    const map = {};
    (data.regions || []).forEach(r => {
      if (!map[r.ctrl]) map[r.ctrl] = [];
      map[r.ctrl].push(r);
    });
    return map;
  }, [data.regions]);

  const questsByRegion = useMemo(() => {
    const map = {};
    (data.quests || []).forEach(q => {
      if (!map[q.region]) map[q.region] = [];
      map[q.region].push(q);
    });
    return map;
  }, [data.quests]);

  const questsByFaction = useMemo(() => {
    const map = {};
    (data.quests || []).forEach(q => {
      if (!map[q.faction]) map[q.faction] = [];
      map[q.faction].push(q);
    });
    return map;
  }, [data.quests]);

  const conns = (type,ent) => {
    const c=[];
    if(type==="region"){
      const f = factionByName[ent.ctrl];
      if(f) c.push({type:"faction",e:f,label:"Controlled by"});
      (npcsByLocation[ent.name] || []).forEach(n=>c.push({type:"npc",e:n,label:"Located here"}));
      (questsByRegion[ent.name] || []).forEach(q=>c.push({type:"quest",e:q,label:"Active quest"}));
    }
    else if(type==="faction"){
      (regionsByController[ent.name] || []).forEach(r=>c.push({type:"region",e:r,label:"Controls"}));
      (npcsByFaction[ent.name] || []).forEach(n=>c.push({type:"npc",e:n,label:"Member"}));
      (questsByFaction[ent.name] || []).forEach(q=>c.push({type:"quest",e:q,label:"Related quest"}));
    }
    else if(type==="npc"){
      if(ent.faction){const f=factionByName[ent.faction]; if(f) c.push({type:"faction",e:f,label:"Member of"});}
      const r=regionByName[ent.loc]; if(r) c.push({type:"region",e:r,label:"Located in"});
    }
    return c;
  };
  const tCols = { low: T.green, medium: T.questGold, high: T.orange, extreme: T.crimson };

  // ── Continental map — 6000×4500 world ──
  const MAP_W = 6000, MAP_H = 4500;

  // Track when atlas images become available (they load async via loadDataModule)
  const [atlasImagesReady, setAtlasImagesReady] = useState(() => !!window.ATLAS_IMAGES);
  useEffect(() => {
    if (atlasImagesReady) return;
    const check = setInterval(() => {
      if (window.ATLAS_IMAGES) { setAtlasImagesReady(true); clearInterval(check); }
    }, 200);
    return () => clearInterval(check);
  }, [atlasImagesReady]);

  // Resolve atlas image source: prefer embedded base64 from atlas-images.js, fall back to file URL
  const atlasImageSrc = React.useMemo(() => {
    const seedNum = parseInt(data.atlasMapSeed);
    if (window.ATLAS_IMAGES && window.ATLAS_IMAGES[seedNum]) {
      return window.ATLAS_IMAGES[seedNum];
    }
    return data.atlasMapSeed ? ("atlas-maps/atlas-" + data.atlasMapSeed + ".webp") : null;
  }, [data.atlasMapSeed, atlasImagesReady]);

  /* ── Custom atlas: if campaign has generated atlas data, use it instead of defaults ── */
  const customAtlas = data.generatedAtlas || null;
  const atlasLandPath = customAtlas?.landPath || ATLAS_LAND_PATH;
  const atlasIslands = customAtlas?.islands || ATLAS_ISLANDS;
  const atlasWaterBodies = customAtlas?.waterBodies || ATLAS_WATER_BODIES;
  const atlasRivers = customAtlas?.rivers || ATLAS_RIVERS;
  const atlasSeaLabels = customAtlas?.seaLabels || ATLAS_SEA_LABELS;
  const atlasRangeLabels = customAtlas?.rangeLabels || ATLAS_RANGE_LABELS;
  const atlasMountainRanges = customAtlas?.mountainRanges || ATLAS_MOUNTAIN_RANGES;
  const atlasProvinces = customAtlas?.provinces || ATLAS_PROVINCES;
  const atlasFactionSeats = customAtlas?.factionSeats || ATLAS_FACTION_SEATS;
  const atlasFreeSeats = customAtlas?.freeSeats || ATLAS_FREE_SEATS;

  /* ── (Old atlas import handler removed — now using pre-generated SVG files) ── */

  // Deterministic hash seed
  const seed = useCallback((s) => { let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;} return h; }, []);
  const seedF = useCallback((x,y,i) => { const v = Math.sin(x*12.9898+y*78.233+i*43758.5453)*43758.5453; return v - Math.floor(v); }, []);

  const getFactionSeatMap = useCallback(() => {
    const seats = {};
    (data.factions || []).forEach((f, idx) => {
      const base = atlasFactionSeats[idx % atlasFactionSeats.length];
      const lap = Math.floor(idx / atlasFactionSeats.length);
      seats[f.name] = {
        ...base,
        x: Math.max(980, Math.min(MAP_W - 980, base.x + lap * 140 * (idx % 2 === 0 ? 1 : -1))),
        y: Math.max(780, Math.min(MAP_H - 780, base.y + lap * 120 * (idx % 3 === 0 ? 1 : -1))),
      };
    });
    return seats;
  }, [data.factions]);

  // ── Region map positions — spread across the continent ──
  const regionPositions = useCallback(() => {
    const pad=560;
    const factionSeats = getFactionSeatMap();
    const seatUsage = {};
    return data.regions.map((r) => {
      const s = seed(String(r.name || "") + String(r.id || "") + String(r.type || ""));
      const freeSeatIndex = Math.abs(s) % atlasFreeSeats.length;
      const seatKey = r.ctrl && factionSeats[r.ctrl] ? r.ctrl : "free-" + freeSeatIndex;
      const seat = factionSeats[r.ctrl] || atlasFreeSeats[freeSeatIndex];
      const used = seatUsage[seatKey] || 0;
      seatUsage[seatKey] = used + 1;
      const layout = ATLAS_REGION_LAYOUTS[r.type] || ATLAS_REGION_LAYOUTS.default;
      const angle = seat.angle + used * 0.92 + ((Math.abs(s) % 120) - 60) / 180;
      const radius = layout.radius * (0.74 + (Math.abs(s) % 100) / 180) + used * 34;
      const x = Math.round(seat.x + Math.cos(angle) * Math.min(seat.spreadX, radius));
      const y = Math.round(seat.y + Math.sin(angle) * Math.min(seat.spreadY, radius * 0.84));
      return {
        ...r,
        mx: Math.max(pad, Math.min(MAP_W-pad, x)),
        my: Math.max(pad, Math.min(MAP_H-pad, y)),
        atlasProvinceId: seat.provinceId || "essear",
        atlasLabel: layout.label,
      };
    });
  }, [data.regions, getFactionSeatMap, seed]);

  const mapRegions = regionPositions();

  // ── Procedural POIs — scattered around province centers (always on land) ──
  const worldPOIs = useCallback(() => {
    const landTypes = ["dungeon","ruins","cave","shrine","tower","grove","monolith","barrow","mine","outpost"];
    const oceanTypes = ["shipwreck","sea_cave","lighthouse","tidal_shrine","sunken_ruins"];
    const landNames = ["Darkhollow Crypt","Shattered Pillar","Serpent's Den","Whispering Grotto",
      "Moonlit Shrine","Dragon's Maw Cave","Old Watchtower","The Twisted Grove","The Standing Stone",
      "Tomb of the Forgotten","Crumbling Bastion","The Bone Pit","Iron Gate Ruins","Crystalvein Cavern",
      "Stormbreak Spire","The Withered Oak","Ancestor's Cairn","Wraithwood Hollow","The Ember Forge",
      "Blightmoor Ruins","Gnarled Root Temple","Shadowpeak Mine","The Silent Obelisk",
      "Windscour Heights","Blackwater Grotto","Duskfall Sanctum","The Petrified Circle","Ironmaw Depths",
      "Thornkeep Ruins","Mistwalker's Shrine","The Frozen Barrow","Starfall Crater","Ashveil Catacombs"];
    const oceanNames = ["The Sunken Vault","Tidal Caves","Stormwreck Reef","Drowned Sailor's Rest",
      "Coral Throne","Siren's Lighthouse","Ghostship Wreckage","The Abyssal Grotto","Seaspray Shrine",
      "Kraken's Maw","Barnacle Keep","The Drowned Temple"];
    // Build anchors from province centers — always on land
    const provs = atlasProvinces;
    const anchorsPerProv = Math.max(2, Math.ceil(12 / Math.max(provs.length, 1)));
    const allAnchors = [];
    provs.forEach((p, pi) => {
      for (let a = 0; a < anchorsPerProv && allAnchors.length < 12; a++) {
        const angle = ((pi * anchorsPerProv + a) / Math.max(provs.length * anchorsPerProv, 1)) * Math.PI * 2 + seedF(pi, a, 7) * 1.2;
        const dist = 80 + seedF(pi, a, 11) * Math.min(p.spreadX || 300, p.spreadY || 250) * 0.7;
        allAnchors.push({
          x: Math.round((p.labelX || p.cityX || 3000) + Math.cos(angle) * dist),
          y: Math.round((p.labelY || p.cityY || 2250) + Math.sin(angle) * dist),
          onLand: true,
        });
      }
    });
    // Add a few ocean/coast POIs near map edges (islands, coastlines)
    const isles = atlasIslands || [];
    if (isles.length > 0) {
      // Place 2-3 ocean POIs near island centers
      for (let ii = 0; ii < Math.min(3, isles.length); ii++) {
        const isleMatch = isles[ii].path.match(/M(\d+),(\d+)/);
        if (isleMatch) {
          allAnchors.push({ x: parseInt(isleMatch[1]), y: parseInt(isleMatch[2]), onLand: false });
        }
      }
    }
    return allAnchors.slice(0, 15).map((anchor, i) => {
      const isOcean = !anchor.onLand;
      const typePool = isOcean ? oceanTypes : landTypes;
      const namePool = isOcean ? oceanNames : landNames;
      return {
        id: `poi-${i}`,
        name: namePool[(Math.abs(seed(namePool[i % namePool.length])) + i) % namePool.length],
        type: typePool[i % typePool.length],
        x: Math.round(anchor.x + seedF(i, 3, 1) * 100 - 50),
        y: Math.round(anchor.y + seedF(i, 5, 2) * 90 - 45),
        threat: ["low","medium","high","extreme"][Math.floor(seedF(i, 9, 4) * 4)],
        isOcean: isOcean,
      };
    });
  }, [seed, seedF, atlasProvinces, atlasIslands]);

  const pois = worldPOIs();

  // ── Weather zones — procedural weather system ──

  // ── Travel distance calculator ──

  // ── Encounter zone generation ──

  // ── Roads: connect regions by faction, proximity, and type — with major/minor classifications ──
  // Memoized to avoid recomputing O(N²) path generation on every render
  const roadList = useMemo(() => {
    const rs = [];
    const mr = mapRegions;
    // Pre-build lookup maps to eliminate nested .some() scans
    const regionByName = {};
    (data.regions || []).forEach(r => { regionByName[r.name] = r; });
    const factionRegions = {};
    (data.factions || []).forEach(f => {
      factionRegions[f.name] = new Set((data.regions || []).filter(r => r.ctrl === f.name).map(r => r.name));
    });
    const questLinks = new Set();
    (data.quests || []).forEach(q => {
      if (!q.region || !q.faction) return;
      const linkedRegions = factionRegions[q.faction];
      if (!linkedRegions) return;
      linkedRegions.forEach(rName => {
        if (rName !== q.region) {
          questLinks.add(q.region + '|' + rName);
          questLinks.add(rName + '|' + q.region);
        }
      });
    });
    for (let i=0; i<mr.length; i++) {
      for (let j=i+1; j<mr.length; j++) {
        const a = mr[i], b = mr[j];
        const shareCtrl = a.ctrl && b.ctrl && a.ctrl === b.ctrl;
        const hasQuestLink = questLinks.has(a.name + '|' + b.name);
        const isRoute = a.type==="route" || b.type==="route";
        const dist = Math.hypot(a.mx-b.mx, a.my-b.my);
        const isMajor = (a.type==="city"||a.type==="kingdom"||a.type==="capital") && (b.type==="city"||b.type==="kingdom"||b.type==="capital");
        if (shareCtrl || hasQuestLink || isRoute || dist < 1200) {
          const segs = dist > 800 ? 3 : dist > 400 ? 2 : 1;
          let path = `M${a.mx},${a.my}`;
          for (let s=0; s<segs; s++) {
            const t1 = (s+0.5)/segs, t2 = (s+1)/segs;
            const cx = a.mx + (b.mx-a.mx)*t1 + Math.sin(a.mx*0.007+b.my*0.011+s*2)*80*(dist/800);
            const cy = a.my + (b.my-a.my)*t1 + Math.cos(a.my*0.009+b.mx*0.013+s*3)*60*(dist/800);
            const ex = a.mx + (b.mx-a.mx)*t2;
            const ey = a.my + (b.my-a.my)*t2;
            path += ` Q${Math.round(cx)},${Math.round(cy)} ${Math.round(ex)},${Math.round(ey)}`;
          }
          rs.push({ from:a, to:b, path, dist, major:isMajor||shareCtrl });
        }
      }
    }
    return rs;
  }, [mapRegions, data.quests, data.factions, data.regions]);

  // ── Zoom / Pan handlers — wider range for continental zoom (0.15x to 8x) ──
  const atlasLocked = false; // zoom & pan always enabled

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    // Proportional zoom speed — faster at high zoom, slower at low zoom
    const factor = e.deltaY > 0 ? 0.88 : 1.14;
    const newZoom = Math.max(0.12, Math.min(8, mapZoom * factor));
    const ratio = newZoom / mapZoom;
    setMapPan(p => ({ x: mx - (mx - p.x) * ratio, y: my - (my - p.y) * ratio }));
    setMapZoom(newZoom);
  }, [mapZoom, atlasLocked]);

  // Attach wheel listener imperatively with { passive: false } so preventDefault() works
  // React's onWheel is passive by default in modern browsers, causing page scroll
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const handler = (e) => handleWheel(e);
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [handleWheel]);

  // Town map wheel handler — same passive:false fix
  useEffect(() => {
    const el = townMapContainerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setTownZoom(z => Math.min(3, Math.max(0.15, (z > 0 ? z : 1) + (e.deltaY > 0 ? -0.08 : 0.08))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (atlasLocked) return;
    if (e.button !== 0) return;
    setDragging({ startX: e.clientX, startY: e.clientY, panX: mapPan.x, panY: mapPan.y });
  }, [mapPan, atlasLocked]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setMapPan({ x: dragging.panX + (e.clientX - dragging.startX), y: dragging.panY + (e.clientY - dragging.startY) });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const getMapPoint = (e) => {
    const p = e?.touches?.[0] || e?.changedTouches?.[0] || e || { clientX: 0, clientY: 0 };
    return { clientX: p.clientX || 0, clientY: p.clientY || 0 };
  };

  const getMapPinchMetrics = (e) => {
    if (!mapRef.current || !e?.touches || e.touches.length < 2) return null;
    const rect = mapRef.current.getBoundingClientRect();
    const a = e.touches[0];
    const b = e.touches[1];
    const centerX = ((a.clientX + b.clientX) / 2) - rect.left;
    const centerY = ((a.clientY + b.clientY) / 2) - rect.top;
    const distance = Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY));
    return {
      centerX,
      centerY,
      distance,
      worldX: (centerX - mapPan.x) / mapZoom,
      worldY: (centerY - mapPan.y) / mapZoom,
    };
  };

  const handleMapTouchStart = useCallback((e) => {
    e.preventDefault();
    if (atlasLocked) return;
    if (e.touches && e.touches.length >= 2) {
      const pinch = getMapPinchMetrics(e);
      if (!pinch) return;
      mapTouchRef.current = {
        active: true,
        mode: "pinch",
        distance: pinch.distance,
        zoom: mapZoom,
        worldX: pinch.worldX,
        worldY: pinch.worldY,
      };
      setDragging(null);
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;
    const p = getMapPoint(e);
    mapTouchRef.current = { active: true, mode: "drag" };
    handleMouseDown({ button: 0, clientX: p.clientX, clientY: p.clientY });
  }, [handleMouseDown, mapPan.x, mapPan.y, mapZoom, atlasLocked]);

  const handleMapTouchMove = useCallback((e) => {
    if (!mapTouchRef.current.active) return;
    e.preventDefault();
    if (mapTouchRef.current.mode === "pinch" && e.touches && e.touches.length >= 2) {
      const pinch = getMapPinchMetrics(e);
      if (!pinch) return;
      const baseDistance = mapTouchRef.current.distance || pinch.distance;
      const baseZoom = mapTouchRef.current.zoom || mapZoom;
      const nextZoom = Math.max(0.12, Math.min(8, baseZoom * (pinch.distance / baseDistance)));
      setMapZoom(nextZoom);
      setMapPan({
        x: pinch.centerX - (mapTouchRef.current.worldX || pinch.worldX) * nextZoom,
        y: pinch.centerY - (mapTouchRef.current.worldY || pinch.worldY) * nextZoom,
      });
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;
    const p = getMapPoint(e);
    handleMouseMove({ clientX: p.clientX, clientY: p.clientY });
  }, [handleMouseMove, mapPan.x, mapPan.y, mapZoom]);

  const handleMapTouchEnd = useCallback((e) => {
    if (!mapTouchRef.current.active) return;
    e.preventDefault();
    const mode = mapTouchRef.current.mode;
    mapTouchRef.current = { active: false };
    if (mode === "pinch") {
      setDragging(null);
      return;
    }
    handleMouseUp();
  }, [handleMouseUp]);

  const selectRegion = (r) => {
    setSel(r);
    setSelType("region");
    setAtlasProvinceId(r?.atlasProvinceId || null);
    setEditing(false);
  };

  // ── Kingdom territory polygons — merges provinces controlled by the same faction ──
  const territories = useCallback(() => {
    // Step 1: Build per-province territory objects with faction info
    const perProvince = atlasProvinces.map((province) => {
      const nodes = mapRegions.filter((r) => r.atlasProvinceId === province.id);
      const capitalNode = nodes.find((r) => ["kingdom","capital","city"].includes(r.type)) || nodes[0] || null;
      const dominantCtrl = capitalNode?.ctrl || nodes.find((r) => r.ctrl)?.ctrl || province.name;
      return {
        ...province,
        faction: dominantCtrl,
        capitalNode,
        regionCount: nodes.length,
      };
    });

    // Step 2: Group provinces by controlling faction
    const factionGroups = {};
    perProvince.forEach(t => {
      const key = t.faction || t.name;
      if (!factionGroups[key]) factionGroups[key] = [];
      factionGroups[key].push(t);
    });

    // Step 3: Merge same-faction territory groups into unified territories
    const merged = [];
    Object.entries(factionGroups).forEach(([factionName, provs]) => {
      if (provs.length === 1) {
        // Single province — no merging needed
        merged.push(provs[0]);
      } else {
        // Multiple provinces under same faction — merge paths and compute unified label
        // Combined SVG path (draw all polygons as subpaths of a single compound path)
        const mergedPath = provs.map(p => p.path).join(" ");

        // Find the "capital" province (has the most important capital node)
        const capitalProv = provs.find(p => p.capitalNode && ["kingdom","capital"].includes(p.capitalNode.type))
          || provs.find(p => p.capitalNode) || provs[0];

        // Compute weighted centroid for the merged label
        let totalWeight = 0, labelCX = 0, labelCY = 0;
        provs.forEach(p => {
          const w = p.regionCount || 1;
          labelCX += p.labelX * w;
          labelCY += p.labelY * w;
          totalWeight += w;
        });
        labelCX = Math.round(labelCX / totalWeight);
        labelCY = Math.round(labelCY / totalWeight);

        merged.push({
          ...capitalProv,
          id: capitalProv.id,
          path: mergedPath,
          labelX: labelCX,
          labelY: labelCY,
          faction: factionName,
          regionCount: provs.reduce((sum, p) => sum + p.regionCount, 0),
          _mergedProvinces: provs, // Keep originals for click handling
          _isMerged: true,
        });
      }
    });

    return merged;
  }, [mapRegions, atlasProvinces]);

  // SECURITY: All edit/add functions guarded by DM role check (V-003)
  // isDM is already declared at the top of WorldView

  const updateFaction = (id, updates) => {
    if (!isDM) return; // SECURITY: only DM can edit factions
    setData(d=>({...d, factions:d.factions.map(f=>f.id===id?{...f,...updates}:f)}));
    if(sel?.id===id && selType==="faction") setSel(p=>({...p,...updates}));
  };
  const updateRegion = (id, updates) => {
    if (!isDM) return; // SECURITY: only DM can edit regions
    setData(d=>({...d, regions:d.regions.map(r=>r.id===id?{...r,...updates}:r)}));
    if(sel?.id===id && selType==="region") setSel(p=>({...p,...updates}));
  };
  const updateNpc = (id, updates) => {
    if (!isDM) return; // SECURITY: only DM can edit NPCs
    setData(d=>({...d, npcs:d.npcs.map(n=>n.id===id?{...n,...updates}:n)}));
    if(sel?.id===id && selType==="npc") setSel(p=>({...p,...updates}));
  };
  const addEntity = (type, entity) => {
    if (!isDM) return; // SECURITY: only DM can add entities
    const id = uid();
    const newE = { ...entity, id };
    if (type === "npc") newE.actorId = "npc-" + id;
    if(type==="region") setData(d=>({...d,regions:[...d.regions,newE]}));
    if(type==="faction") setData(d=>({...d,factions:[...d.factions,newE]}));
    if(type==="npc") setData(d=>({...d,npcs:[...d.npcs,newE]}));
    if(type==="poi") setData(d=>({...d,pois:[...d.pois||[],newE]}));
    setAddingEntity(false);
  };

  // POI icon renderer for scattered world POIs
  const POISvg = ({ poi, zoom: z }) => {
    const iconSize = z > 3 ? 28 : 22;
    const FI = FANTASY_ICONS[poi.type] || MapIconRuins;
    const threatCol = tCols[poi.threat] || "var(--text-muted)";
    return (
      <g style={{ cursor:"pointer" }} onClick={(e)=>{e.stopPropagation();setSel({...poi,id:poi.id});setSelType("poi");}}>
        <g transform={`translate(${poi.x - iconSize/2},${poi.y - iconSize/2})`}>
          <FI size={iconSize} color={threatCol} />
        </g>
        {z > 2.5 && <text x={poi.x} y={poi.y+18} textAnchor="middle" fill="var(--text-muted)" fontFamily="'Spectral', serif" fontSize="8" fontStyle="italic" opacity="0.7" style={{pointerEvents:"none"}}>{poi.name}</text>}
      </g>
    );
  };

  // roadList is already memoized via useMemo above
  const atlasTerritories = territories();

  const worldNodes = useMemo(() => mapRegions.map((r) => {
    const faction = data.factions.find((f) => f.name === r.ctrl) || null;
    const quests = data.quests.filter((q) => q.region === r.name);
    const activeQuests = quests.filter((q) => q.status !== "completed");
    const npcs = data.npcs.filter((n) => n.loc === r.name);
    const encounters = (data.encounters || []).filter((enc) => enc.location === r.name);
    const timelineEvents = (data.timeline || [])
      .flatMap((session) => (session.events || []).map((ev) => ({
        ...ev,
        sessionTitle: session.title,
        date: session.date,
      })))
      .filter((ev) => ev.location === r.name || (ev.linkedNames || []).some((name) => npcs.some((n) => n.name === name)))
      .slice(0, 4);
    const stateMeta = getWorldStateMeta(r.state);
    const searched = !worldSearch.trim() || [r.name, r.type, r.state, r.ctrl, ...quests.map((q) => q.title), ...npcs.map((n) => n.name)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(worldSearch.trim().toLowerCase());
    return {
      ...r,
      key: "region-" + r.id,
      label: r.name,
      discovered: r.visited || String(r.state || "").toLowerCase() !== "hidden",
      faction,
      quests,
      activeQuests,
      npcs,
      encounters,
      timelineEvents,
      stateMeta,
      searched,
      travelWeight: getWorldTravelCost(r),
      dangerScore: WORLD_THREAT_SCORE[r.threat] || 1,
    };
  }), [mapRegions, data.factions, data.quests, data.npcs, data.encounters, data.timeline, worldSearch]);

  const worldNodesById = useMemo(() => {
    const map = {};
    worldNodes.forEach((node) => { map[node.id] = node; });
    return map;
  }, [worldNodes]);

  const activeRoute = useMemo(() => {
    if (!routeDraft.fromId || !routeDraft.toId || routeDraft.fromId === routeDraft.toId) return null;
    const startNode = worldNodesById[routeDraft.fromId];
    const endNode = worldNodesById[routeDraft.toId];
    if (!startNode || !endNode) return null;

    const graph = {};
    roadList.forEach((rd) => {
      const fromId = rd.from.id;
      const toId = rd.to.id;
      if (!graph[fromId]) graph[fromId] = [];
      if (!graph[toId]) graph[toId] = [];
      const edgeWeight = rd.dist * (((worldNodesById[fromId]?.travelWeight || 1) + (worldNodesById[toId]?.travelWeight || 1)) / 2) * (rd.major ? 0.8 : 1);
      graph[fromId].push({ id: toId, dist: rd.dist, weight: edgeWeight, road: rd });
      graph[toId].push({ id: fromId, dist: rd.dist, weight: edgeWeight, road: rd });
    });

    const distances = { [startNode.id]: 0 };
    const hops = { [startNode.id]: 0 };
    const prev = {};
    const pending = new Set([startNode.id]);
    while (pending.size) {
      let current = null;
      let best = Infinity;
      pending.forEach((id) => {
        const d = distances[id];
        if (d < best) { best = d; current = id; }
      });
      if (current === null || current === endNode.id) break;
      pending.delete(current);
      (graph[current] || []).forEach((edge) => {
        const nextDistance = (distances[current] || 0) + edge.weight;
        if (nextDistance < (distances[edge.id] ?? Infinity)) {
          distances[edge.id] = nextDistance;
          hops[edge.id] = (hops[current] || 0) + edge.dist;
          prev[edge.id] = { id: current, road: edge.road };
          pending.add(edge.id);
        }
      });
    }
    if (!(endNode.id in prev) && startNode.id !== endNode.id) return { from: startNode, to: endNode, segments: [], names:[startNode.name, endNode.name], miles: 0, etaDays: 0, blocked:true, threat:"unknown" };
    const segments = [];
    const pathIds = [endNode.id];
    let cursor = endNode.id;
    while (cursor !== startNode.id && prev[cursor]) {
      segments.unshift(prev[cursor].road);
      cursor = prev[cursor].id;
      pathIds.unshift(cursor);
    }
    const rawMiles = (hops[endNode.id] || Math.hypot(startNode.mx - endNode.mx, startNode.my - endNode.my)) / 18;
    const threatScore = pathIds.reduce((sum, id) => sum + (worldNodesById[id]?.dangerScore || 1), 0) / Math.max(pathIds.length, 1);
    return {
      from: startNode,
      to: endNode,
      segments,
      names: pathIds.map((id) => worldNodesById[id]?.name).filter(Boolean),
      miles: Math.round(rawMiles),
      etaDays: Math.max(0.2, Math.round((rawMiles / 24) * 10) / 10),
      threat: threatScore >= 3.3 ? "extreme" : threatScore >= 2.5 ? "high" : threatScore >= 1.7 ? "medium" : "low",
      blocked: false,
    };
  }, [roadList, routeDraft.fromId, routeDraft.toId, worldNodesById]);

  const selectedWorldNode = useMemo(() => {
    if (!sel) return null;
    if (selType === "region") return worldNodesById[sel.id] || sel;
    if (selType === "poi") return sel;
    return null;
  }, [sel, selType, worldNodesById]);

  const setWorldMapPatch = (patch) => {
    setData((d) => ({
      ...d,
      worldMap: {
        ...normalizeWorldMapState(d.worldMap),
        ...patch,
      },
    }));
  };

  const clearWorldRoute = () => {
    setRouteDraft({ fromId: null, toId: null });
    setWorldMapPatch({ lastRoute: null });
  };

  const focusWorldNode = (node, layer = "region") => {
    if (!node) return;
    const rect = mapRef.current?.getBoundingClientRect();
    const viewportW = rect?.width || 1200;
    const viewportH = rect?.height || 800;
    const targetZoom = WORLD_ZOOM_PRESETS[layer]?.zoom || (layer === "site" ? 4.2 : 1.4);
    setMapZoom(targetZoom);
    setMapPan({
      x: viewportW * (isMapCompact ? 0.5 : 0.42) - node.mx * targetZoom,
      y: viewportH * 0.48 - node.my * targetZoom,
    });
    setSel(node);
    setSelType("region");
    setAtlasProvinceId(node?.atlasProvinceId || null);
    setEditing(false);
    setWorldMapPatch({ lastFocusedRegionId: node.id });
  };

  const queueEncounterLaunch = (encounter, node) => {
    if (!encounter || !node) return;
    setWorldMapPatch({
      pendingLaunch: {
        launchId: "world-launch-" + Date.now(),
        type: "encounter",
        encounterId: encounter.id,
        regionId: node.id,
        location: node.name,
      },
      lastFocusedRegionId: node.id,
    });
    if (onNav) onNav("play");
  };

  useEffect(() => {
    if (activeRoute && !activeRoute.blocked) {
      setWorldMapPatch({
        lastRoute: {
          from: activeRoute.from.name,
          to: activeRoute.to.name,
          miles: activeRoute.miles,
          etaDays: activeRoute.etaDays,
          threat: activeRoute.threat,
        },
      });
    }
  }, [activeRoute?.from?.id, activeRoute?.to?.id, activeRoute?.miles, activeRoute?.etaDays, activeRoute?.threat]);

  // Handle time skip (fast-forward multiple events at once)
  const handleTimeSkip = async (numEvents) => {
    if (!window.livingWorld) return;

    setLwTimeSkipOpen(false);
    setLwTimeSkipProgress({ current: 0, total: numEvents });

    // Simulate progress updates for UI feedback
    const progressInterval = setInterval(() => {
      setLwTimeSkipProgress(p => {
        if (!p) return null;
        const next = Math.min(p.current + 1, p.total);
        if (next >= p.total) clearInterval(progressInterval);
        return { ...p, current: next };
      });
    }, 50);

    // Ensure Living World engine has current data before advancing time
    // This will trigger relation initialization in advanceTime if needed
    window.livingWorld.setData(data);

    // Call advanceTime to generate events
    const result = window.livingWorld.advanceTime(data, numEvents);
    clearInterval(progressInterval);
    setLwTimeSkipProgress(null);

    // Determine skip label for timeline
    const skipLabel = numEvents <= 5 ? "A Week Passes" : numEvents <= 15 ? "A Month Passes" : numEvents <= 50 ? "Months Pass" : "A Year Passes";

    // Apply final data state with event log + auto-update timeline (combined to avoid React batching issues)
    const consistentData = ensureDataConsistency(result.finalData);
    setData(d => {
      const withLog = {
        ...consistentData,
        _lwEventLog: [
          ...result.events.map(e => ({ ...e, mutations: undefined })),
          ...(d._lwEventLog || [])
        ].slice(0, 200),
      };
      // Batch major events into the timeline
      withLog.timeline = _lwBatchToTimeline(d.timeline || [], result.events, skipLabel);
      // Persist living-world engine state (relations, wars, treaties) after time skip
      if (window.livingWorld) {
        withLog._lwEngineState = window.livingWorld.getSerializedState();
      }
      return withLog;
    });

    // Add all generated events to logs
    setLwLog(prev => [...result.events, ...prev]);

    // Add first 5 events to visible ticker
    setLwEvents(prev => [...result.events.slice(0, 5), ...prev].slice(0, 30));

    // Show summary modal
    setLwTimeSkipSummary(result.events);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", gap:0, rowGap:6, flexWrap:"wrap", padding:"0 12px 8px", borderBottom:`1px solid ${T.border}`, flexShrink:0, background:T.bgNav }}>
        {(() => {
          const mods = data.modules || {};
          const coreTabs = ["map","regions","factions","npcs","pois"];
          const moduleTabs = [
            { id:"calendar", label:"Calendar", module:"calendar" },
            { id:"exploration", label:"Explore", module:"hexcrawl" },
          ];
          const activeTabs = [...coreTabs, ...moduleTabs.filter(mt => mods[mt.module] !== false).map(mt => mt.id)];
          const labels = {map:"Atlas",regions:"Kingdoms",factions:"Factions",npcs:"NPCs",pois:"Points of Interest",calendar:"Calendar",exploration:"Explore"};
          return activeTabs.map(t => (
            <button key={t} onClick={()=>{setTab(t);if(t!=="map"){setSel(null);setSelType(null);setAtlasProvinceId(null);setEditing(false);setCityPopup(null);setRegionPopup(null);}}} style={{
              padding:"14px clamp(8px, 1.6vw, 18px)", background:"transparent", border:"none", cursor:"pointer",
              fontFamily:T.ui, fontSize:8, letterSpacing:"1.5px", textTransform:"uppercase", fontWeight:500,
              color:tab===t?T.crimson:T.textMuted, transition:"all 0.3s",
              borderBottom:tab===t?`2px solid ${T.crimson}`:"2px solid transparent",
            }}>{labels[t]||t}</button>
          ));
        })()}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center", justifyContent:"flex-end", flexWrap:"wrap" }}>
          {tab==="map" && <>
            <div style={{ display:"flex", alignItems:"center", gap:2, padding:"2px 4px", background:"rgba(0,0,0,0.2)", border:`1px solid ${T.border}`, borderRadius:"4px" }}>
              <span style={{ fontFamily:T.ui, fontSize:7, color:T.crimson, letterSpacing:"1px", fontWeight:600, padding:"0 6px" }}>{zoomLevel.toUpperCase()}</span>
              <span style={{ fontFamily:T.body, fontSize:9, color:T.textMuted, padding:"0 4px", borderLeft:`1px solid ${T.border}` }}>{Math.round(mapZoom*100)}%</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:0, border:`1px solid ${T.border}`, borderRadius:"4px", overflow:"hidden" }}>
              <button onClick={()=>setMapZoom(z=>Math.min(8,z*1.3))} style={{ padding:"5px 10px", background:T.bgInput, border:"none", borderRight:`1px solid ${T.border}`, color:T.textDim, fontSize:14, fontWeight:300, cursor:"pointer", lineHeight:1, transition:"all 0.15s" }} onMouseEnter={e=>{e.target.style.background="var(--bg-hover)";e.target.style.color="var(--crimson)";}} onMouseLeave={e=>{e.target.style.background="var(--bg-input)";e.target.style.color="var(--text-dim)";}}>+</button>
              <button onClick={()=>setMapZoom(z=>Math.max(0.12,z*0.77))} style={{ padding:"5px 10px", background:T.bgInput, border:"none", borderRight:`1px solid ${T.border}`, color:T.textDim, fontSize:14, fontWeight:300, cursor:"pointer", lineHeight:1, transition:"all 0.15s" }} onMouseEnter={e=>{e.target.style.background="var(--bg-hover)";e.target.style.color="var(--crimson)";}} onMouseLeave={e=>{e.target.style.background="var(--bg-input)";e.target.style.color="var(--text-dim)";}}>−</button>
              <button onClick={()=>{setMapZoom(0.25);setMapPan({x:0,y:0});}} style={{ padding:"5px 10px", background:T.bgInput, border:"none", color:T.textMuted, fontFamily:T.ui, fontSize:7, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.15s" }} onMouseEnter={e=>{e.target.style.background="var(--bg-hover)";e.target.style.color="var(--crimson)";}} onMouseLeave={e=>{e.target.style.background="var(--bg-input)";e.target.style.color="var(--text-muted)";}}>Reset</button>
            </div>
            {false && <button onClick={()=>focusWorldNode(selectedWorldNode?.mx != null ? selectedWorldNode : (worldNodes.find((n)=>n.id===worldMapState.lastFocusedRegionId) || worldNodes[0]), "region")} style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Region</button>}
            {false && <button onClick={()=>focusWorldNode(selectedWorldNode?.mx != null ? selectedWorldNode : (worldNodes.find((n)=>n.id===worldMapState.lastFocusedRegionId) || worldNodes[0]), "local")} style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Local</button>}
            {false && selectedWorldNode?.mx != null && selectedWorldNode?.type === "dungeon" && <button onClick={()=>focusWorldNode(selectedWorldNode, "site")} style={{ padding:"4px 10px", background:"rgba(212,67,58,0.08)", border:`1px solid ${T.crimsonBorder}`, color:T.crimson, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Site</button>}
            {activeRoute && <button onClick={clearWorldRoute} style={{ padding:"4px 10px", background:"rgba(94,224,154,0.08)", border:"1px solid rgba(94,224,154,0.22)", color:T.green, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Clear Route</button>}
            {false && <div style={{ display:"flex", gap:4, padding:"3px", border:`1px solid ${T.border}`, borderRadius:"999px", background:"rgba(0,0,0,0.14)", maxWidth:isMapCompact ? "100%" : 420, overflowX:"auto" }}>
              {WORLD_OVERLAYS.map((overlay) => (
                <button key={overlay.id} onClick={()=>setWorldOverlay(overlay.id)} style={{
                  padding:"5px 10px", border:"none", borderRadius:"999px", cursor:"pointer", whiteSpace:"nowrap",
                  fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase",
                  color:worldOverlay===overlay.id?T.text:T.textFaint,
                  background:worldOverlay===overlay.id?"rgba(212,67,58,0.14)":"transparent",
                  transition:"all 0.15s ease",
                }}>{overlay.label}</button>
              ))}
            </div>}
            <div style={{ position:"relative", minWidth:isMapCompact ? 148 : 220 }}>
              <Search size={11} color={T.textFaint} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}/>
              <input value={worldSearch} onChange={(e)=>setWorldSearch(e.target.value)} placeholder="Find locations, NPCs, quests..."
                style={{
                  width:"100%", padding:"8px 10px 8px 28px", background:"rgba(0,0,0,0.12)", border:`1px solid ${T.border}`,
                  borderRadius:"999px", color:T.text, fontFamily:T.body, fontSize:12, outline:"none", boxSizing:"border-box",
                }} />
            </div>
          </>}
          {tab !== "calendar" && tab !== "exploration" && <CrimsonBtn onClick={()=>setAddingEntity(true)} small><Plus size={11}/> Add</CrimsonBtn>}
        </div>
      </div>

      <div style={{ display: (tab === "calendar" || tab === "exploration") ? "none" : "flex", flex:1, overflow:"hidden", position:"relative" }}>
        {/* ══════════ FANTASY MAP TAB — Multi-scale continental map ══════════ */}
        {tab==="map" && (
          <div ref={mapRef} style={{ flex:1, overflow:"hidden", position:"relative", background:T.bg, touchAction:"none", WebkitUserSelect:"none", userSelect:"none" }}>
            {/* ── New MapEngine Canvas ── */}
            <canvas ref={mapCanvasRef} style={{ width:"100%", height:"100%", display:"block" }} />
            {/* ── Legacy SVG hidden — kept for non-MapEngine fallback ── */}
            <svg width="0" height="0" style={{ display:"none" }}>
              <defs>
                {/* Parchment texture filter */}
                <filter id="parchment">
                  <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#f2ead8" surfaceScale="0.55" result="lit"><feDistantLight azimuth="52" elevation="48"/></feDiffuseLighting>
                  <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0.35" k2="0.2" k3="0" k4="0"/>
                </filter>
                <clipPath id="atlasLandClip">
                  <path d={atlasLandPath} />
                  {atlasIslands.map((isle, idx) => <path key={`atlas-isle-clip-${idx}`} d={isle.path} />)}
                </clipPath>
                <radialGradient id="atlasLandFill" cx="48%" cy="42%" r="78%">
                  <stop offset="0%" stopColor="#e6dcc0" />
                  <stop offset="55%" stopColor="#d8ca9f" />
                  <stop offset="100%" stopColor="#cbb88a" />
                </radialGradient>
                <linearGradient id="atlasSeaFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8aa9a2" />
                  <stop offset="48%" stopColor="#92b0a8" />
                  <stop offset="100%" stopColor="#7d9b94" />
                </linearGradient>
                <pattern id="atlasContourPat" x="0" y="0" width="420" height="300" patternUnits="userSpaceOnUse">
                  <path d="M-20,140 C40,88 112,68 180,84 C250,100 320,82 430,30" stroke="#7a7150" strokeWidth="2.4" fill="none" opacity="0.16"/>
                  <path d="M-10,220 C60,180 130,172 210,192 C300,214 360,204 440,170" stroke="#7a7150" strokeWidth="2.2" fill="none" opacity="0.12"/>
                  <path d="M50,20 C90,62 145,84 210,80 C290,72 350,92 420,132" stroke="#7a7150" strokeWidth="2" fill="none" opacity="0.1"/>
                  <ellipse cx="110" cy="210" rx="42" ry="24" fill="none" stroke="#7a7150" strokeWidth="1.8" opacity="0.10"/>
                  <ellipse cx="310" cy="122" rx="54" ry="30" fill="none" stroke="#7a7150" strokeWidth="1.8" opacity="0.10"/>
                </pattern>
                {/* Water pattern */}
                <pattern id="waterPat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0,40 Q20,35 40,40 Q60,45 80,40" stroke="#6d8f89" strokeWidth="0.45" fill="none" opacity="0.14"/>
                  <path d="M0,55 Q20,50 40,55 Q60,60 80,55" stroke="#6d8f89" strokeWidth="0.28" fill="none" opacity="0.09"/>
                  <path d="M0,25 Q20,20 40,25 Q60,30 80,25" stroke="#6d8f89" strokeWidth="0.28" fill="none" opacity="0.08"/>
                </pattern>
                {/* Glow for cities */}
                <filter id="cityGlow">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>

              <g transform={`translate(${mapPan.x},${mapPan.y}) scale(${mapZoom})`}>
                {/* ═══ LAYER 0: Base map — Python atlas image or JS fallback ═══ */}
                {data.atlasMapSeed ? (
                  <image href={atlasImageSrc} x="0" y="0" width={MAP_W} height={MAP_H} preserveAspectRatio="none" style={{ pointerEvents:"none", imageRendering:"auto" }} />
                ) : (
                  <>
                    <rect x="0" y="0" width={MAP_W} height={MAP_H} rx="10" fill="url(#atlasSeaFill)" filter="url(#parchment)"/>
                    <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#waterPat)" opacity="0.22"/>
                    <path d={atlasLandPath} fill="rgba(218,204,168,0.22)" stroke="#6a9088" strokeWidth="14" opacity="0.55" strokeLinejoin="round"/>
                    <path d={atlasLandPath} fill="url(#atlasLandFill)" stroke="#5a7a73" strokeWidth="3.2" strokeLinejoin="round"/>
                    <path d={atlasLandPath} fill="url(#atlasContourPat)" opacity="0.2" stroke="none"/>
                    {atlasIslands.map((isle, idx) => (
                      <g key={`atlas-isle-${idx}`}>
                        <path d={isle.path} fill={isle.fill || "#d4c9a2"} opacity={isle.opacity || 0.96} stroke="#5a7a73" strokeWidth="2.4" strokeLinejoin="round"/>
                        <path d={isle.path} fill="url(#atlasContourPat)" opacity="0.2" stroke="none"/>
                      </g>
                    ))}
                    {atlasSeaLabels.map((sLabel, idx) => (
                      <text key={`sea-label-${idx}`} x={sLabel.x} y={sLabel.y} textAnchor="middle" fill="#4a6b64" fontFamily="'Spectral', serif" fontSize={sLabel.size} letterSpacing={sLabel.spacing * 0.35} opacity={sLabel.opacity || 0.38} fontStyle="italic" transform={`rotate(${sLabel.rotate} ${sLabel.x} ${sLabel.y})`} style={{ pointerEvents:"none" }}>
                        {sLabel.label}
                      </text>
                    ))}
                  </>
                )}

                {/* ═══ LAYERS 1-3: JS-rendered geography — hidden when Python atlas is active ═══ */}
                {!data.atlasMapSeed && <>
                <g clipPath="url(#atlasLandClip)">
                  {atlasWaterBodies.map((body, idx) => (
                    body.shape === "ellipse"
                      ? <ellipse key={`body-${idx}`} cx={body.cx} cy={body.cy} rx={body.rx} ry={body.ry} fill="#8eb4ac" opacity="0.94" stroke="#5f8a82" strokeWidth="2"/>
                      : <path key={`body-${idx}`} d={body.d} fill="#8eb4ac" opacity="0.94" stroke="#5f8a82" strokeWidth="2" strokeLinejoin="round"/>
                  ))}
                  {mapZoom < 1.85 && atlasWaterBodies.map((body, idx) => body.label && body.lx != null && (
                    <text key={`lake-lbl-${idx}`} x={body.lx} y={body.ly} textAnchor="middle" fill="#4d6f68" fontFamily="'Spectral', serif" fontSize={Math.max(11, 18 / Math.max(mapZoom, 0.4))} fontStyle="italic" letterSpacing="0.6" opacity="0.55" style={{ pointerEvents:"none" }}>{body.label}</text>
                  ))}
                  {atlasRivers.map((riverPath, idx) => (
                    <path key={`atlas-river-${idx}`} d={riverPath} stroke="#5a7d76" strokeWidth={idx < 3 ? 3.2 : 2} fill="none" opacity={idx < 3 ? 0.78 : 0.55} strokeLinecap="round" strokeLinejoin="round"/>
                  ))}
                </g>
                {mapZoom < 1.4 && atlasRangeLabels.map((mLabel, idx) => (
                  <text key={`range-label-${idx}`} x={mLabel.x} y={mLabel.y} textAnchor="middle" fill="#7f714f" fontFamily="'Spectral', serif" fontSize={Math.max(13, 22 / Math.max(mapZoom, 0.35))} letterSpacing="1.8" opacity="0.34" fontStyle="italic" transform={`rotate(${mLabel.rotate} ${mLabel.x} ${mLabel.y})`} style={{ pointerEvents:"none" }}>
                    {mLabel.label}
                  </text>
                ))}

                {/* Kingdom territories — visible at continent/kingdom zoom */}
                {/* Merged territories: provinces under the same faction are drawn as one unified kingdom */}
                {mapZoom < 2.5 && atlasTerritories.map((t,i) => {
                  const activeProvince = atlasProvinceId === t.id || (t._mergedProvinces || []).some(mp => mp.id === atlasProvinceId)
                    || selectedWorldNode?.atlasProvinceId === t.id || (t._mergedProvinces || []).some(mp => mp.id === selectedWorldNode?.atlasProvinceId);
                  // Dynamic faction color — updates when Living World changes territory control
                  const factionForTerritory = data.factions?.find(f => f.name === t.faction);
                  const terrFill = factionForTerritory?.color || t.fill || "#d6c999";
                  // Check if ALL constituent regions are destroyed/conquered/contested
                  const regionData = (data.regions || []).find(r => r.name === t.name);
                  const allRegionNames = t._mergedProvinces ? t._mergedProvinces.map(p => p.name) : [t.name];
                  const regionStates = allRegionNames.map(n => (data.regions || []).find(r => r.name === n)?.state);
                  const isContested = regionStates.some(s => s === "contested");
                  const isDestroyed = regionStates.every(s => s === "destroyed" || s === "conquered") && regionStates.length > 0;

                  return (
                  <g key={`terr-${i}`} clipPath="url(#atlasLandClip)" style={{ cursor:"pointer" }} onClick={(e)=>{ e.stopPropagation(); setCityPopup(null); setAtlasProvinceId(t.id); if (t.capitalNode) selectRegion(t.capitalNode); const regionData = (data.regions || []).find(r => r.name === t.name); setRegionPopup({ territory: t, region: regionData || null }); setSel(null); setSelType(null); }}>
                    {/* Unified fill — all subpaths drawn as one compound shape */}
                    <path d={t.path} fill={terrFill} opacity={isDestroyed ? 0.28 : isContested ? 0.24 : activeProvince ? 0.22 : 0.14} stroke="none" fillRule="nonzero"/>
                    {t._isMerged ? (
                      <>
                        {/* Merged territory: draw each province border, then overlay a strong outer stroke.
                            Internal shared borders get a very subtle dashed line to hint at the original provinces. */}
                        {t._mergedProvinces.map((mp, mi) => (
                          <path key={`inner-${mi}`} d={mp.path} fill="none"
                            stroke={terrFill}
                            strokeWidth={1.2}
                            strokeOpacity={0.15}
                            strokeLinejoin="round"
                            strokeDasharray="8,12"/>
                        ))}
                        {/* Strong outer border for the unified kingdom */}
                        {t._mergedProvinces.map((mp, mi) => (
                          <path key={`outer-${mi}`} d={mp.path} fill="none"
                            stroke={isDestroyed ? "#8b0000" : isContested ? "#c94040" : activeProvince ? terrFill : terrFill}
                            strokeWidth={isDestroyed ? 3.5 : isContested ? 2.8 : activeProvince ? 3.2 : 2.4}
                            strokeOpacity={isDestroyed ? 0.55 : isContested ? 0.4 : activeProvince ? 0.45 : 0.3}
                            strokeLinejoin="round" strokeDasharray={isContested ? "12,6" : "none"}/>
                        ))}
                      </>
                    ) : (
                      /* Single province: normal border rendering */
                      <path d={t.path} fill="none"
                        stroke={isDestroyed ? "#8b0000" : isContested ? "#c94040" : activeProvince ? "#a89870" : "rgba(180,165,130,0.5)"}
                        strokeWidth={isDestroyed ? 3.5 : isContested ? 2.8 : activeProvince ? 2.8 : 1.8}
                        strokeOpacity={isDestroyed ? 0.75 : isContested ? 0.55 : activeProvince ? 0.6 : 0.4}
                        strokeLinejoin="round" strokeDasharray={isContested ? "12,6" : "none"}/>
                    )}
                    {mapZoom < 1.3 && t.labelX != null && (() => {
                      const ctrlFaction = data.factions?.find(f => f.name === t.faction);
                      // Show the controlling faction name (reflects conquests and renames)
                      const displayName = ctrlFaction ? ctrlFaction.name : t.faction || t.name;
                      // Larger font for merged (larger) kingdoms
                      const sizeBoost = t._isMerged ? Math.min(1.4, 1 + (t._mergedProvinces.length - 1) * 0.15) : 1;
                      const fontSize = Math.max(28, 64 / Math.max(mapZoom, 0.36)) * sizeBoost;
                      return (
                        <>
                          <text x={t.labelX} y={t.labelY} textAnchor="middle" fill={isDestroyed ? "#8a3030" : isContested ? "#c94040" : activeProvince ? "#4a3d28" : "#5a4f38"} stroke="rgba(252,248,236,0.55)" strokeWidth={Math.max(1.5, 3 / Math.max(mapZoom, 0.5))} paintOrder="stroke" fontFamily="'Cinzel', serif" fontSize={fontSize} fontWeight="700" letterSpacing="4" opacity={activeProvince ? 0.95 : 0.82} style={{ pointerEvents:"none", textTransform:"uppercase" }}>
                            {displayName}
                          </text>
                          {/* Show government type or state under name when zoomed in */}
                          {mapZoom > 0.45 && ctrlFaction?.govType && (
                            <text x={t.labelX} y={t.labelY + fontSize * 0.65} textAnchor="middle" fill={isDestroyed ? "#6a2020" : "#6b5f4a"} stroke="rgba(252,248,236,0.4)" strokeWidth={1} paintOrder="stroke" fontFamily="'Spectral', serif" fontSize={Math.max(14, 24 / Math.max(mapZoom, 0.36))} fontStyle="italic" letterSpacing="1.5" opacity={0.55} style={{ pointerEvents:"none" }}>
                              {isDestroyed ? "FALLEN" : isContested ? "CONTESTED" : ctrlFaction.govType.charAt(0).toUpperCase() + ctrlFaction.govType.slice(1)}
                            </text>
                          )}
                        </>
                      );
                    })()}
                  </g>
                  );
                })}

                {/* Mountains */}
                <g clipPath="url(#atlasLandClip)">
                  {atlasMountainRanges.map((range) => (
                    <g key={`ridge-${range.id}`}>
                      <path d={range.ridge} fill="none" stroke="#9a8b62" strokeWidth="8" opacity="0.11" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d={range.ridge} fill="none" stroke="#f2ead4" strokeWidth="1.8" opacity="0.14" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  ))}
                </g>
                </>}

                {/* ═══ LAYER 4: Roads — major roads at kingdom zoom, minor at local ═══ */}
                {<g clipPath={!data.atlasMapSeed ? "url(#atlasLandClip)" : undefined} opacity={mapZoom > 0.5 ? Math.min(1, (mapZoom-0.5)*1.5) : 0} style={{ transition:"opacity 0.3s" }}>
                  {roadList.filter(rd=>rd.major).map((rd,i) => (
                    <path key={`mroad-${i}`} d={rd.path} stroke="#b8a67a" strokeWidth={mapZoom > 1.5 ? 1 : 1.8} fill="none" strokeDasharray={mapZoom > 2 ? "12,14" : "22,20"} opacity="0.32" strokeLinecap="round"/>
                  ))}
                </g>}
                {mapZoom > 0.8 && <g clipPath={!data.atlasMapSeed ? "url(#atlasLandClip)" : undefined} opacity={Math.min(1, (mapZoom-0.8)*2)} style={{ transition:"opacity 0.3s" }}>
                  {roadList.filter(rd=>!rd.major).map((rd,i) => (
                    <path key={`road-${i}`} d={rd.path} stroke="#c4b48c" strokeWidth={mapZoom > 2 ? 0.65 : 1} fill="none" strokeDasharray="10,12" opacity="0.18" strokeLinecap="round"/>
                  ))}
                </g>}
                {activeRoute && !activeRoute.blocked && (
                  <g clipPath={!data.atlasMapSeed ? "url(#atlasLandClip)" : undefined}>
                    {activeRoute.segments.map((rd, i) => (
                      <path key={`active-route-${i}`} d={rd.path} stroke="#556e52" strokeWidth={mapZoom > 1.8 ? 2.5 : 4.5} fill="none" opacity="0.62" strokeLinecap="round" strokeDasharray="22,16">
                        {false && <animate attributeName="stroke-dashoffset" from="0" to="-68" dur="2.4s" repeatCount="indefinite" />}
                      </path>
                    ))}
                  </g>
                )}

                {/* ═══ LAYER 5: Region markers — hidden when atlas map is active (Layer 6 handles atlas cities) ═══ */}
                {(!data.atlasMapSeed || (data.cities || []).length === 0) && worldNodes.filter(node => node.searched).map(node => {
                  const r = node;
                  const active = sel?.id===r.id && selType==="region";
                  const threatCol = tCols[r.threat] || "var(--text-muted)";
                  const isBig = r.type==="city"||r.type==="kingdom"||r.type==="capital";
                  const isSmall = r.type==="hamlet"||r.type==="ruins"||r.type==="dungeon";
                  const atlasPlaceVisible = ["city","capital","kingdom","town","castle"].includes(r.type) || (["hamlet","ruins","dungeon"].includes(r.type) && mapZoom > 1.35);
                  const dimUndiscovered = worldOverlay === "discovery" && !r.discovered;
                  if(!atlasPlaceVisible && !active) return null;
                  if(!r.discovered && worldOverlay !== "discovery" && !active) return null;
                  if(isSmall && mapZoom < 0.72 && !active) return null;
                  const sqHalf = Math.max(2.5, Math.min(isBig ? 5.5 : 3.8, (isBig ? 5 : 3.2) / Math.max(mapZoom*0.72, 0.42)));
                  const fontSize = isBig ? Math.max(13, 26/Math.max(mapZoom*0.72,0.35)) : Math.max(9, 15/Math.max(mapZoom*0.8,0.45));
                  const labelYOffset = isBig ? Math.max(30, 38 / Math.max(mapZoom*0.75,0.55)) : Math.max(18, 24 / Math.max(mapZoom*0.85,0.6));
                  return (
                    <g key={r.key || r.id} onClick={(e)=>{e.stopPropagation(); selectRegion(r);}} style={{ cursor:"pointer", opacity: dimUndiscovered ? 0.35 : 1 }}>
                      {active && <rect x={r.mx - sqHalf - 10} y={r.my - sqHalf - 10} width={(sqHalf + 10) * 2} height={(sqHalf + 10) * 2} fill="none" stroke="#7a9088" strokeWidth="2" opacity="0.45" rx="2"/>}
                      {false && activeRoute && activeRoute.names.includes(r.name) && !active && <circle cx={r.mx} cy={r.my} r={isBig?50:35} fill="none" stroke={getWorldThreatColor(activeRoute.threat)} strokeWidth="2.5" opacity="0.35" strokeDasharray="10,7"/>}
                      {false && (worldOverlay==="atlas" && ["corrupted","cursed","blighted","destroyed","conquered"].includes(String(r.state || "").toLowerCase())) && <circle cx={r.mx} cy={r.my} r={isBig?84:58} fill={r.stateMeta?.color || threatCol} opacity="0.08" stroke={r.stateMeta?.color || threatCol} strokeWidth="1" strokeOpacity="0.18"/>}
                      {false && (worldOverlay==="quests" && r.activeQuests?.length > 0 && mapZoom > 0.5) && <circle cx={r.mx} cy={r.my} r={isBig?66:46} fill="none" stroke="#ffd54f" strokeWidth="2" opacity="0.5" strokeDasharray="4,7"/>}
                      {false && ((worldOverlay==="atlas" || worldOverlay==="quests") && r.faction) && <circle cx={r.mx} cy={r.my} r={24} fill={r.faction.color} opacity={isBig && mapZoom < 0.6 ? 0.1 : 0.08}/>}
                      <rect x={r.mx - sqHalf} y={r.my - sqHalf} width={sqHalf * 2} height={sqHalf * 2} fill={active ? "#2e2414" : (dimUndiscovered ? "#6b6454" : "#3d3422")} stroke={active ? "#f5eed8" : "#b5a67e"} strokeWidth={active ? 1.4 : 1}/>
                      {false && (routeDraft.fromId === r.id || routeDraft.toId === r.id) && (
                        <g transform={`translate(${r.mx + (isBig?28:20)},${r.my - (isBig?30:22)})`}>
                          <circle r="10" fill={routeDraft.fromId === r.id ? T.green : T.crimson} opacity="0.95"/>
                          <text x="0" y="3" textAnchor="middle" fill="#0d0f13" fontFamily="'Cinzel', serif" fontSize="8" fontWeight="700">{routeDraft.fromId === r.id ? "A" : "B"}</text>
                        </g>
                      )}
                      {/* Label — always show for kingdoms/cities, show others when zoomed */}
                      {(isBig || mapZoom > (isSmall ? 1.0 : 0.62) || active) && (
                        <text x={r.mx} y={r.my + labelYOffset} textAnchor="middle" fill={dimUndiscovered ? "#6f6a55" : "#4c4025"} stroke="rgba(252,248,236,0.55)" strokeWidth={isBig ? 1.2 : 0.85} paintOrder="stroke" fontFamily="'Spectral', serif" fontSize={fontSize} fontStyle={isBig ? "normal" : "italic"} fontWeight={isBig?"600":"500"} letterSpacing={isBig?"0.35":"0.4"} opacity={active?0.95:0.88} style={{ pointerEvents:"none" }}>
                          {r.discovered ? r.name : "Undiscovered Site"}
                        </text>
                      )}
                      {/* Faction/state subtitle — kingdom zoom+ */}
                      {false && mapZoom > 1.05 && (
                        <text x={r.mx} y={r.my + (isBig?54:40)} textAnchor="middle" fill={r.stateMeta?.color || "var(--text-muted)"} fontFamily="'Spectral', serif" fontSize={Math.max(6,10/Math.max(mapZoom*0.7,0.5))} fontStyle="italic" fontWeight="300" opacity="0.72" style={{ pointerEvents:"none" }}>
                          {r.ctrl || r.atlasLabel || r.type} / {r.stateMeta?.label || r.state || "Stable"}
                        </text>
                      )}
                      {/* Threat pip — local zoom+ */}
                      {false && mapZoom > 1.0 && (
                        <circle cx={r.mx + (isBig?28:20)} cy={r.my - (isBig?24:16)} r="5" fill={r.stateMeta?.color || threatCol} opacity="0.8"/>
                      )}
                      {false && r.activeQuests?.length > 0 && mapZoom > 1.15 && (
                        <g transform={`translate(${r.mx-(isBig?30:22)},${r.my-(isBig?24:18)})`}>
                          <circle r="8" fill="rgba(212,67,58,0.14)" stroke="#ffd54f" strokeWidth="0.8"/>
                          <text x="0" y="3" textAnchor="middle" fill="#ffd54f" fontFamily="'Cinzel', serif" fontSize="7" fontWeight="700">{r.activeQuests.length}</text>
                        </g>
                      )}
                      {false && r.encounters?.length > 0 && mapZoom > 1.1 && (
                        <g transform={`translate(${r.mx+(isBig?44:34)},${r.my+(isBig?18:14)})`}>
                          <circle r="8" fill="rgba(212,67,58,0.16)" stroke={T.crimson} strokeWidth="0.8"/>
                          <path d="M-3,-2 L3,4 M3,-2 L-3,4" stroke={T.crimson} strokeWidth="1.4" strokeLinecap="round"/>
                        </g>
                      )}
                      {/* Visited marker — local zoom+ */}
                      {false && r.discovered && worldOverlay==="discovery" && mapZoom > 1.2 && (
                        <g transform={`translate(${r.mx-(isBig?28:20)},${r.my-(isBig?26:18)})`}>
                          <circle r="6" fill="var(--bg-card)" stroke="var(--text-muted)" strokeWidth="0.7"/>
                          <path d="M-2.5,0 L-0.5,2.5 L3,-2.5" stroke="#5ee09a" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* ═══ LAYER 6: Invisible clickable hit areas — locked to atlas image ═══ */}
                {/* Uses origX/origY (precise SVG-extracted coords) so hit areas align   */}
                {/* exactly with the city dots baked into the atlas .webp image.          */}
                {/* Hit radius is zoom-compensated so it stays ~25 CSS px on screen.      */}
                {data.atlasMapSeed && (data.cities || []).map(city => {
                  const cx = (city.origX != null ? city.origX : city.mapX) * MAP_W;
                  const cy = (city.origY != null ? city.origY : city.mapY) * MAP_H;
                  const hitR = Math.max(15, 25 / Math.max(mapZoom, 0.05));
                  return (
                    <g key={`cityhit-${city.id}`} style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRegionPopup(null);
                        setCityPopup(cityPopup?.city?.id === city.id ? null : { city });
                      }}>
                      <circle cx={cx} cy={cy} r={hitR} fill="transparent" stroke="none" />
                    </g>
                  );
                })}

                {/* ═══ LAYER 6b: Atlas POI markers — clickable ═══ */}
                {data.atlasMapSeed && (data.pois || []).map(poi => {
                  let px = poi.mapX * MAP_W;
                  let py = poi.mapY * MAP_H;
                  // ── Snap ocean POIs toward nearest province center (always on land) ──
                  const provCenters = atlasProvinces.map(p => ({ x: p.labelX || p.cityX, y: p.labelY || p.cityY }));
                  const nearestProv = provCenters.reduce((best, c) => {
                    const d = Math.hypot(px - c.x, py - c.y);
                    return d < best.d ? { ...c, d } : best;
                  }, { x: 3000, y: 2250, d: Infinity });
                  // If POI is far from any province center, pull it toward land
                  const maxDist = 1200; // max distance from any province center before snapping
                  if (nearestProv.d > maxDist) {
                    const ratio = maxDist / nearestProv.d;
                    px = nearestProv.x + (px - nearestProv.x) * ratio;
                    py = nearestProv.y + (py - nearestProv.y) * ratio;
                  }
                  // Check if within continent bounds (rough ellipse test centered at 3000,2250)
                  const cDist = Math.hypot((px - 3000) / 2200, (py - 2250) / 1600);
                  const isOceanPoi = cDist > 1.0;
                  if (isOceanPoi) {
                    // Pull toward continent center
                    const pullRatio = 0.95 / cDist;
                    px = 3000 + (px - 3000) * pullRatio;
                    py = 2250 + (py - 2250) * pullRatio;
                  }
                  const hitR = Math.max(15, 25 / Math.max(mapZoom, 0.05));
                  return (
                    <g key={poi.id} style={{ cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); setSel(poi); setSelType("poi"); }}>
                      <circle cx={px} cy={py} r={hitR} fill="transparent" stroke="none" />
                    </g>
                  );
                })}

                {/* ═══ LAYER 7: Weather overlay ═══ */}
                {false && mapZoom > 0.4 && data.factions.map(wz => (
                  <g key={wz.key} opacity={0.12 + (mapZoom > 1 ? 0.08 : 0)}>
                    {wz.type==="rain" && <><circle cx={wz.x} cy={wz.y} r={wz.r} fill="rgba(110,160,250,0.08)" stroke="rgba(110,160,250,0.15)" strokeWidth="1" strokeDasharray="8,6"/>
                      {mapZoom > 1 && [0,1,2,3,4,5].map(ri => <line key={`r-${ri}`} x1={wz.x-wz.r*0.6+ri*(wz.r*0.24)} y1={wz.y-20} x2={wz.x-wz.r*0.6+ri*(wz.r*0.24)-8} y2={wz.y+20} stroke="rgba(110,160,250,0.2)" strokeWidth="1" strokeLinecap="round"/>)}</>}
                    {wz.type==="storm" && <><circle cx={wz.x} cy={wz.y} r={wz.r} fill="rgba(90,15,150,0.06)" stroke="rgba(90,15,150,0.15)" strokeWidth="1.5" strokeDasharray="4,4"/>
                      {mapZoom > 1 && <path d={`M${wz.x-10},${wz.y-15} L${wz.x+5},${wz.y-2} L${wz.x-5},${wz.y-2} L${wz.x+10},${wz.y+15}`} stroke="rgba(255,220,30,0.3)" strokeWidth="1.5" fill="none"/>}</>}
                    {wz.type==="snow" && <circle cx={wz.x} cy={wz.y} r={wz.r} fill="rgba(210,228,255,0.06)" stroke="rgba(210,228,255,0.15)" strokeWidth="1" strokeDasharray="3,6"/>}
                    {wz.type==="fog" && <ellipse cx={wz.x} cy={wz.y} rx={wz.r*1.3} ry={wz.r*0.6} fill="rgba(190,190,200,0.06)" stroke="rgba(190,190,200,0.1)" strokeWidth="1"/>}
                    {wz.type==="wind" && mapZoom > 0.8 && <path d={`M${wz.x-wz.r*0.8},${wz.y} Q${wz.x},${wz.y-30} ${wz.x+wz.r*0.8},${wz.y}`} stroke="rgba(190,190,200,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
                    {mapZoom > 1.2 && <text x={wz.x} y={wz.y} textAnchor="middle" fill="var(--text-faint)" fontFamily="'Spectral', serif" fontSize="9" fontStyle="italic" opacity="0.5">{wz.type}</text>}
                  </g>
                ))}

                {/* ═══ LAYER 8: Encounter zones — visible at local zoom+ ═══ */}
                {false && mapZoom > 1.8 && [].map(ez => (
                  <g key={ez.key} opacity="0.25" style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();setSel({...ez,id:ez.id});setSelType("encounter");}}>
                    <circle cx={ez.x} cy={ez.y} r={ez.r} fill="rgba(212,67,58,0.04)" stroke="rgba(212,67,58,0.2)" strokeWidth="1" strokeDasharray="6,4"/>
                    {mapZoom > 2.5 && <>
                      <text x={ez.x} y={ez.y-8} textAnchor="middle" fill="var(--crimson)" fontFamily="'Cinzel', serif" fontSize="7" letterSpacing="1" opacity="0.6" style={{textTransform:"uppercase"}}>{ez.type}</text>
                      <text x={ez.x} y={ez.y+6} textAnchor="middle" fill="var(--text-muted)" fontFamily="'Spectral', serif" fontSize="8" fontStyle="italic" opacity="0.5">CR {ez.cr}</text>
                    </>}
                    {mapZoom > 3 && <text x={ez.x} y={ez.y+18} textAnchor="middle" fill="var(--text-faint)" fontFamily="'Spectral', serif" fontSize="7" opacity="0.4">{ez.name}</text>}
                  </g>
                ))}

                {/* ═══ LAYER 9: Travel route overlay (removed) ═══ */}

                {/* ═══ LAYER 10: Compass rose — hidden when atlas map active (Python atlas has its own) ═══ */}
                {!data.atlasMapSeed && <g transform={`translate(${MAP_W-200},${MAP_H-200})`} opacity="0.14" style={{ pointerEvents:"none" }}>
                  <line x1="0" y1="-48" x2="0" y2="48" stroke="#7a7260" strokeWidth="1.2"/>
                  <line x1="-48" y1="0" x2="48" y2="0" stroke="#7a7260" strokeWidth="1.2"/>
                  <line x1="-30" y1="-30" x2="30" y2="30" stroke="#9a9078" strokeWidth="0.6"/>
                  <line x1="30" y1="-30" x2="-30" y2="30" stroke="#9a9078" strokeWidth="0.6"/>
                  <polygon points="0,-52 -6,-36 6,-36" fill="#6b5c42"/>
                  <polygon points="0,52 -4,38 4,38" fill="#9a9078"/>
                  <text x="0" y="-60" textAnchor="middle" fill="#5c5344" fontFamily="'Cinzel', serif" fontSize="12" fontWeight="600">N</text>
                  <text x="58" y="4" textAnchor="middle" fill="#8a8070" fontFamily="'Cinzel', serif" fontSize="9">E</text>
                  <text x="-58" y="4" textAnchor="middle" fill="#8a8070" fontFamily="'Cinzel', serif" fontSize="9">W</text>
                  <text x="0" y="72" textAnchor="middle" fill="#8a8070" fontFamily="'Cinzel', serif" fontSize="9">S</text>
                </g>}

                {/* Map title cartouche — hidden when atlas map active (Python atlas has its own title) */}
                {!data.atlasMapSeed && <g transform={`translate(${MAP_W-980},${MAP_H-300})`}>
                  <text x="0" y="0" textAnchor="start" fill="#5c4a28" fontFamily="'Cinzel', serif" fontSize="118" fontWeight="600" letterSpacing="12" opacity="0.62" style={{ textTransform:"uppercase" }}>
                    {data.name || "The Realm"}
                  </text>
                </g>}

                {/* Scale bar — bottom-right, always visible */}
                <g transform={`translate(${MAP_W-500},${MAP_H-80})`} opacity="0.45" style={{ pointerEvents:"none" }}>
                  <rect x="-10" y="-16" width="224" height="42" rx="4" fill="rgba(14,12,8,0.3)" stroke="none" />
                  <line x1="0" y1="0" x2="200" y2="0" stroke="#b0a488" strokeWidth="1.8"/>
                  <line x1="0" y1="-6" x2="0" y2="6" stroke="#b0a488" strokeWidth="1.4"/>
                  <line x1="100" y1="-4" x2="100" y2="4" stroke="#9a9078" strokeWidth="1"/>
                  <line x1="200" y1="-6" x2="200" y2="6" stroke="#b0a488" strokeWidth="1.4"/>
                  <text x="100" y="18" textAnchor="middle" fill="#b0a488" fontFamily="'Spectral', serif" fontSize="12" fontStyle="italic" stroke="rgba(14,12,8,0.5)" strokeWidth="2" paintOrder="stroke">100 leagues</text>
                </g>
              </g>
            </svg>

            {/* ── City quick-info popup (legacy SVG mode — hidden when MapEngine active) ── */}
            {!mapEngineRef.current && cityPopup && (() => {
              const c = cityPopup.city;
              const rect = mapRef.current?.getBoundingClientRect();
              const popX = ((c.origX != null ? c.origX : c.mapX) * MAP_W * mapZoom + mapPan.x);
              const popY = ((c.origY != null ? c.origY : c.mapY) * MAP_H * mapZoom + mapPan.y);
              const fc = (() => { const f = (data.factions || []).find(f => f.name === c.faction); return f?.color || T.gold; })();
              const cityNpcs = (data.npcs || []).filter(n => c.npcs.includes(n.id));
              return (
                <div style={{
                  position: "absolute", left: popX + 20, top: popY - 20, zIndex: 50,
                  background: "var(--bg-card)", border: `1px solid var(--crimson-border)`, borderRadius: "4px",
                  padding: 0, minWidth: 280, maxWidth: 360,
                  boxShadow: `0 12px 40px rgba(0,0,6,0.50), 0 0 0 1px rgba(0,0,0,0.2)`,
                  backdropFilter: "blur(16px)", overflow: "hidden",
                }} onClick={e => e.stopPropagation()}>
                  {/* Header band */}
                  <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid var(--border)`, background: `linear-gradient(135deg, ${fc}12, transparent)` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", fontFamily: "'Cinzel', serif", letterSpacing: "0.8px" }}>{c.name}</div>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3, fontFamily: "'Cinzel', serif", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                          {(() => { const m = window.TOWN_METADATA?.[c.name]; return m ? (m.isCapital ? "Capital" : m.population >= 4000 ? "City" : m.population >= 1500 ? "Town" : "Village") : (c.isCapital ? "Capital" : "Settlement"); })()} of {c.region} · Pop. {c.population?.toLocaleString?.() || c.population}
                        </div>
                      </div>
                      <button onClick={() => setCityPopup(null)} style={{ background: "var(--bg-input)", border: `1px solid var(--border)`, borderRadius: "3px", color: "var(--text-faint)", cursor: "pointer", fontSize: 13, padding: "2px 8px", lineHeight: 1.2, transition: "all 0.15s" }} onMouseEnter={e=>{e.target.style.borderColor="var(--crimson-border)";e.target.style.color="var(--crimson)";}} onMouseLeave={e=>{e.target.style.borderColor="var(--border)";e.target.style.color="var(--text-faint)";}}>×</button>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding: "12px 18px 16px" }}>
                    <div style={{ borderLeft: `2px solid ${fc}66`, paddingLeft: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: fc, marginBottom: 3, fontFamily: "'Cinzel', serif", letterSpacing: "0.8px", fontWeight: 500 }}>{c.faction}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.55, fontFamily: "'Spectral', serif" }}>{c.description}</div>
                    </div>
                    {c.features && c.features.length > 0 && (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                        {c.features.map((f, fi) => <span key={fi} style={{ fontSize: 8, color: T.gold, background: "rgba(212,67,58,0.08)", border: "1px solid rgba(212,67,58,0.22)", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.5px", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}>{f}</span>)}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 12, marginBottom: 6, fontSize: 10, color: "var(--text-muted)", fontFamily: "'Spectral', serif" }}>
                      <span>Residents: {cityNpcs.length}</span>
                      <span>Shops: {c.shops.length}</span>
                      <span>Tavern: {c.tavern.name}</span>
                    </div>
                    {c.questHooks && c.questHooks.length > 0 && (
                      <div style={{ fontSize: 10, color: T.questGold, fontStyle: "italic", marginBottom: 12, lineHeight: 1.5, fontFamily: "'Spectral', serif", padding: "6px 10px", background: "rgba(212,67,58,0.06)", borderRadius: "3px", border: "1px solid rgba(212,67,58,0.12)" }}>Quest: {c.questHooks[0]}</div>
                    )}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => { setTab("cities"); setSel(c); setSelType("city"); setCityPopup(null); }}
                        style={{
                          flex: 1, padding: "9px 0", background: "var(--bg-input)", border: `1px solid var(--border)`, borderRadius: "4px",
                          color: "var(--text-muted)", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.target.style.borderColor = "var(--crimson-border)"; e.target.style.color = "var(--crimson)"; e.target.style.background = "var(--crimson-soft)"; }}
                        onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; e.target.style.background = "var(--bg-input)"; }}
                      >View Details</button>
                      {townImagesReady && window.TOWN_IMAGES && window.TOWN_IMAGES[c.name] && (
                        <button
                          onClick={() => { setTownView(c.name); setCityPopup(null); setTownSelBldg(null); setTownHovBldg(null); setTownZoom(0); setTownPan({x:0,y:0}); }}
                          style={{
                            flex: 1, padding: "9px 0", background: "linear-gradient(180deg, var(--crimson), var(--crimson-dim))", border: `1px solid var(--crimson-border)`, borderRadius: "4px",
                            color: "var(--text)", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                            transition: "all 0.2s", boxShadow: "0 2px 8px rgba(212,67,58,0.2)",
                          }}
                          onMouseEnter={e => { e.target.style.boxShadow = "0 4px 16px rgba(212,67,58,0.35)"; e.target.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.target.style.boxShadow = "0 2px 8px rgba(212,67,58,0.2)"; e.target.style.transform = "translateY(0)"; }}
                        >Explore Map</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Region quick-info popup (legacy SVG mode — hidden when MapEngine active) ── */}
            {!mapEngineRef.current && regionPopup && (() => {
              const t = regionPopup.territory;
              const r = regionPopup.region;
              const fc = (() => { const f = (data.factions || []).find(f => f.name === t.faction); return f?.color || T.gold; })();
              const popX = (t.labelX || t.cityX || 3000) * mapZoom + mapPan.x;
              const popY = (t.labelY || t.cityY || 2250) * mapZoom + mapPan.y;
              const threatColors = { low: "#6a9955", medium: T.gold, high: "#d97b3c", extreme: "#d4433a" };
              const threatCol = threatColors[r?.threat] || T.gold;
              const typeIcons = { capital: "♔", kingdom: "⚔", city: "⏣", town: "⌂", wilderness: "⚍", dungeon: "☠", route: "⟿" };
              const typeIcon = typeIcons[r?.type] || "\u{1F30D}";
              return (
                <div style={{
                  position: "absolute", left: Math.min(popX + 20, (mapRef.current?.clientWidth || 800) - 340), top: Math.max(popY - 40, 10), zIndex: 50,
                  background: "var(--bg-card)", border: `1px solid var(--crimson-border)`, borderRadius: "4px",
                  padding: 0, minWidth: 300, maxWidth: 380,
                  boxShadow: `0 12px 40px rgba(0,0,6,0.50), 0 0 0 1px rgba(0,0,0,0.2)`,
                  backdropFilter: "blur(16px)", overflow: "hidden",
                }} onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid var(--border)`, background: `linear-gradient(135deg, ${fc}12, transparent)` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", fontFamily: "'Cinzel', serif", letterSpacing: "0.8px" }}>{typeIcon} {t.name}</div>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3, fontFamily: "'Cinzel', serif", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                          {r ? `${r.type} \u00b7 ${r.terrain} \u00b7 Pop. ${r.population}` : t.faction || "Unknown Region"}
                        </div>
                      </div>
                      <button onClick={() => setRegionPopup(null)} style={{ background: "var(--bg-input)", border: `1px solid var(--border)`, borderRadius: "3px", color: "var(--text-faint)", cursor: "pointer", fontSize: 13, padding: "2px 8px", lineHeight: 1.2, transition: "all 0.15s" }} onMouseEnter={e=>{e.target.style.borderColor="var(--crimson-border)";e.target.style.color="var(--crimson)";}} onMouseLeave={e=>{e.target.style.borderColor="var(--border)";e.target.style.color="var(--text-faint)";}}>×</button>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding: "12px 18px 16px" }}>
                    {/* Ruler info */}
                    <div style={{ borderLeft: `2px solid ${fc}66`, paddingLeft: 10, marginBottom: 12 }}>
                      {r?.governor && <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'Spectral', serif" }}>{r.governorTitle || "Ruler"}: <span style={{ color: fc }}>{r.governor}</span></div>}
                      {(() => { const cap = (data.cities||[]).find(c => c.region === (r||{}).name && c.isCapital); return cap ? <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>Capital: <span style={{ color: T.gold }}>{cap.name}</span></div> : null; })()}
                    </div>
                    {/* Climate & Threat */}
                    {r && (
                      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 8, color: "var(--text-muted)", background: "var(--bg-input)", border: "1px solid var(--border)", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.5px", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}>{r.terrain}</span>
                        <span style={{ fontSize: 8, color: threatCol, background: `${threatCol}11`, border: `1px solid ${threatCol}33`, padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.5px", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}>{r.threat} threat</span>
                        <span style={{ fontSize: 8, color: "var(--text-muted)", background: "var(--bg-input)", border: "1px solid var(--border)", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.5px", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}>{r.state}</span>
                      </div>
                    )}
                    {/* Lore snippet */}
                    {r?.lore && (
                      <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.55, fontFamily: "'Spectral', serif", fontStyle: "italic", marginBottom: 12, padding: "8px 10px", background: "rgba(212,67,58,0.04)", borderRadius: "3px", border: "1px solid rgba(212,67,58,0.10)" }}>
                        {r.lore}
                      </div>
                    )}
                    {/* Quick stats */}
                    {r && (
                      <div style={{ display: "flex", gap: 14, marginBottom: 12, fontSize: 10, color: "var(--text-muted)", fontFamily: "'Spectral', serif" }}>
                        <span>Cities: {(r.cities || []).length}</span>
                        <span>Resources: {(r.resources || []).slice(0, 2).join(", ")}</span>
                      </div>
                    )}
                    {/* View Details button */}
                    <button
                      onClick={() => { setTab("regions"); setRegionPopup(null); setExpandedRegions(prev => ({ ...prev, [r?.id || t.name]: true })); }}
                      style={{
                        width: "100%", padding: "9px 0", background: "linear-gradient(180deg, var(--crimson), var(--crimson-dim))", border: `1px solid var(--crimson-border)`, borderRadius: "4px",
                        color: "var(--text)", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                        transition: "all 0.2s", boxShadow: "0 2px 8px rgba(212,67,58,0.2)",
                      }}
                      onMouseEnter={e => { e.target.style.boxShadow = "0 4px 16px rgba(212,67,58,0.35)"; e.target.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.target.style.boxShadow = "0 2px 8px rgba(212,67,58,0.2)"; e.target.style.transform = "translateY(0)"; }}
                    >View Region Details</button>
                  </div>
                </div>
              );
            })()}

            {/* Zoom level indicator + Atlas import button */}
            <div style={{ position:"absolute", top:12, right:12, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, zIndex:10 }}>
              <div style={{ padding:"6px 14px", background:"rgba(8,8,10,0.82)", border:"1px solid var(--border)", borderRadius:"4px", fontFamily:T.ui, fontSize:8, color:"var(--text-muted)", letterSpacing:"2.5px", textTransform:"uppercase", boxShadow:"0 4px 20px rgba(0,0,0,0.4)", backdropFilter:"blur(8px)", pointerEvents:"none" }}>
                {zoomLevel} view
              </div>
              {isDM && (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <select
                      value={data.atlasMapSeed || ""}
                      onChange={e => {
                        const seedVal = e.target.value;
                        if (seedVal) {
                          // Just update the seed — the useEffect will regenerate map + all world data
                          setData(d => ({ ...d, atlasMapSeed: seedVal }));
                        } else {
                          setData(d => { const { atlasMapSeed, generatedAtlas, ...rest } = d; return { ...rest, regions: [], factions: [], npcs: [], cities: [], pois: [], activity: [{ time: "Just now", text: "Reverted to default map" }] }; });
                        }
                      }}
                      style={{ padding:"4px 8px", background:"rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.25)", borderRadius:"4px", fontFamily:T.ui, fontSize:9, color:T.gold, outline:"none", cursor:"pointer", letterSpacing:"1px" }}
                    >
                      {Array.from({length:100}, (_,i) => i+1).map(s => {
                        return <option key={s} value={s}>{`World Seed ${s}`}</option>;
                      })}
                    </select>
                    <button onClick={() => {
                      const current = parseInt(data.atlasMapSeed || "0");
                      const next = (current % 100) + 1;
                      // Just update the seed — the useEffect will regenerate map + all world data
                      setData(d => ({ ...d, atlasMapSeed: String(next) }));
                    }} style={{ padding:"5px 12px", background:"rgba(30,26,22,0.85)", backdropFilter:"blur(8px)", border:"1px solid rgba(212,67,58,0.35)", borderRadius:"4px", fontFamily:T.ui, fontSize:9, color:T.questGold, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.3)", transition:"all 0.2s", whiteSpace:"nowrap" }}
                      onMouseEnter={e => { e.target.style.borderColor = "rgba(212,67,58,0.7)"; e.target.style.color = "#f5d66a"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "rgba(212,67,58,0.35)"; e.target.style.color = T.gold; }}
                      title="Generate a new world with the next seed"
                    >Regenerate</button>
                  </div>
                </>
              )}
              {data.atlasMapSeed && (
                <div style={{ padding:"3px 10px", background:"rgba(8,8,10,0.7)", border:"1px solid var(--border)", borderRadius:"3px", fontFamily:T.ui, fontSize:7, color:"var(--text-faint)", letterSpacing:"1.2px", textTransform:"uppercase", pointerEvents:"none", backdropFilter:"blur(6px)" }}>
                  Seed: {data.atlasMapSeed}
                </div>
              )}
              {false && mapZoom > 2.0 && <div style={{ padding:"4px 10px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"2px", fontFamily:T.body, fontSize:9, color:T.textMuted, fontStyle:"italic", opacity:0.7, pointerEvents:"none" }}>
                {pois.length} points of interest
              </div>}
            </div>

            {/* ── Living World Controls (DM only, requires module enabled) ── */}
            {isLive && isDM && data.factions?.length > 0 && (data.modules || {}).livingWorld !== false && (
              <div style={{ position:"absolute", top:12, left:12, display:"flex", flexDirection:"column", gap:6, zIndex:10 }}>
                <button
                  onClick={() => setLwActive(a => !a)}
                  style={{
                    display:"flex", alignItems:"center", gap:8, padding:"8px 16px",
                    background: lwActive ? "rgba(46,180,92,0.2)" : "rgba(30,26,22,0.9)",
                    border: lwActive ? "1px solid rgba(46,180,92,0.5)" : "1px solid rgba(212,67,58,0.25)",
                    borderRadius:"4px", cursor:"pointer", transition:"all 0.3s",
                  }}
                >
                  <span style={{ width:8, height:8, borderRadius:"50%", background: lwActive ? T.green : T.textFaint, boxShadow: lwActive ? "0 0 8px rgba(74,222,128,0.6)" : "none", transition:"all 0.3s" }} />
                  <span style={{ fontFamily:T.ui, fontSize:10, color: lwActive ? T.green : T.gold, letterSpacing:"1.5px", textTransform:"uppercase" }}>
                    {lwActive ? "World Live" : "Living World"}
                  </span>
                </button>
                {lwActive && (
                  <div style={{ display:"flex", gap:4 }}>
                    <select value={lwSpeed} onChange={e => { setLwSpeed(Number(e.target.value)); if (lwActive) { setLwActive(false); setTimeout(() => setLwActive(true), 100); } }}
                      style={{ padding:"3px 6px", background:"rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.2)", borderRadius:"3px", fontFamily:T.ui, fontSize:8, color:T.gold, outline:"none", cursor:"pointer" }}>
                      <option value={30}>Fast (30s)</option>
                      <option value={60}>Normal (60s)</option>
                      <option value={90}>Slow (90s)</option>
                      <option value={180}>Relaxed (3m)</option>
                      <option value={300}>Slow (5m)</option>
                      <option value={600}>Very Slow (10m)</option>
                    </select>
                    <button onClick={() => setLwShowLog(v => !v)}
                      style={{ padding:"3px 10px", background: lwShowLog ? "rgba(212,67,58,0.2)" : "rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.2)", borderRadius:"3px", fontFamily:T.ui, fontSize:8, color:T.gold, cursor:"pointer", letterSpacing:"1px" }}>
                      {lwShowLog ? "Hide Log" : "Event Log"} ({lwLog.length})
                    </button>
                    <button onClick={() => setLwTimeSkipOpen(v => !v)}
                      style={{ padding:"3px 10px", background: lwTimeSkipOpen ? "rgba(212,67,58,0.2)" : "rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.2)", borderRadius:"3px", fontFamily:T.ui, fontSize:8, color:T.gold, cursor:"pointer", letterSpacing:"1px" }}>
                      ⏭ Skip Forward
                    </button>
                    <button onClick={() => { setLwPartyActionsOpen(v => !v); setLwTimeSkipOpen(false); }}
                      style={{ padding:"3px 10px", background: lwPartyActionsOpen ? "rgba(201,100,60,0.2)" : "rgba(30,26,22,0.9)", border: lwPartyActionsOpen ? "1px solid rgba(201,100,60,0.4)" : "1px solid rgba(212,67,58,0.2)", borderRadius:"3px", fontFamily:T.ui, fontSize:8, color: lwPartyActionsOpen ? T.orange : T.gold, cursor:"pointer", letterSpacing:"1px" }}>
                      ⚔ Party Actions
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Time Skip Dropdown Menu ── */}
            {isLive && isDM && data.factions?.length > 0 && lwTimeSkipOpen && (
              <div style={{
                position:"absolute", top:140, left:12, background:"rgba(20,18,14,0.98)", border:"1px solid rgba(212,67,58,0.25)",
                borderRadius:"6px", zIndex:30, minWidth:140, boxShadow:"0 8px 24px rgba(0,0,0,0.6)"
              }}>
                <div style={{ padding:"8px 0", fontSize:9, fontFamily:T.ui, color:T.gold, letterSpacing:"1px" }}>
                  {[
                    { label: "1 Week", events: 3 },
                    { label: "1 Month", events: 12 },
                    { label: "3 Months", events: 36 },
                    { label: "1 Year", events: 144 },
                  ].map(opt => (
                    <button key={opt.label}
                      onClick={() => {
                        setLwTimeSkipOpen(false);
                        handleTimeSkip(opt.events);
                      }}
                      style={{
                        display:"block", width:"100%", padding:"8px 12px", textAlign:"left",
                        background:"transparent", border:"none", color:T.gold, cursor:"pointer",
                        fontFamily:T.ui, fontSize:9, letterSpacing:"0.5px",
                        borderBottom:"1px solid rgba(212,67,58,0.1)", transition:"all 0.2s"
                      }}
                      onMouseEnter={e => e.target.style.background = "rgba(212,67,58,0.15)"}
                      onMouseLeave={e => e.target.style.background = "transparent"}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <div style={{ padding:"6px 12px", borderTop:"1px solid rgba(212,67,58,0.1)", display:"flex", gap:6, alignItems:"center" }}>
                    <input type="number" min="1" max="365" defaultValue="7" id="customSkipEvents"
                      style={{
                        flex:1, padding:"3px 6px", background:"rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.2)",
                        borderRadius:"3px", color:T.gold, fontFamily:T.ui, fontSize:8, outline:"none"
                      }} />
                    <button onClick={() => {
                      const num = parseInt(document.getElementById("customSkipEvents")?.value || "7");
                      if (num > 0) {
                        setLwTimeSkipOpen(false);
                        handleTimeSkip(num);
                      }
                    }}
                      style={{
                        padding:"3px 8px", background:"rgba(212,67,58,0.2)", border:"1px solid rgba(212,67,58,0.4)",
                        borderRadius:"3px", color:T.gold, cursor:"pointer", fontFamily:T.ui, fontSize:7,
                        letterSpacing:"0.5px", textTransform:"uppercase"
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Party Actions Panel ── */}
            {isLive && isDM && lwPartyActionsOpen && (
              <div style={{
                position:"absolute", top:80, left:12, background:"rgba(20,18,14,0.98)", border:"1px solid rgba(201,100,60,0.3)",
                borderRadius:"6px", zIndex:30, width:320, boxShadow:"0 8px 24px rgba(0,0,0,0.6)",
                maxHeight:"60vh", display:"flex", flexDirection:"column",
              }}>
                <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(201,100,60,0.15)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:11, color:T.orange, fontFamily:T.ui, letterSpacing:"1px" }}>Party Actions</div>
                  <button onClick={() => setLwPartyActionsOpen(false)} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:14, padding:"0 4px" }}>×</button>
                </div>
                <div style={{ padding:"8px 12px", fontSize:9, color:T.textMuted, lineHeight:1.5, borderBottom:"1px solid rgba(201,100,60,0.1)" }}>
                  These actions represent what the adventuring party does in the world. Results are not guaranteed — the world reacts dynamically.
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
                  {!lwActionTarget ? (
                    /* Step 1: Choose action */
                    Object.values(window.PLAYER_ACTIONS || {}).map(action => (
                      <button key={action.id}
                        onClick={() => setLwActionTarget({ actionId: action.id, targetFaction: null, allyFaction: null })}
                        style={{
                          display:"flex", width:"100%", padding:"10px 16px", textAlign:"left", gap:10, alignItems:"flex-start",
                          background:"transparent", border:"none", borderBottom:"1px solid rgba(201,100,60,0.08)", cursor:"pointer",
                          transition:"all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,100,60,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize:18, lineHeight:1, flexShrink:0 }}>{action.icon}</span>
                        <div>
                          <div style={{ fontSize:10, color:T.orange, fontFamily:T.ui, letterSpacing:"0.5px", marginBottom:2 }}>{action.label}</div>
                          <div style={{ fontSize:9, color:T.textMuted, lineHeight:1.4 }}>{action.description}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    /* Step 2: Choose target faction(s) */
                    (() => {
                      const action = (window.PLAYER_ACTIONS || {})[lwActionTarget.actionId];
                      if (!action) return null;
                      const needsSecondFaction = action.requiresTarget === "two_factions" && lwActionTarget.targetFaction && !lwActionTarget.allyFaction;
                      const readyToExecute = action.requiresTarget === "faction" ? !!lwActionTarget.targetFaction
                        : action.requiresTarget === "two_factions" ? !!lwActionTarget.targetFaction && !!lwActionTarget.allyFaction
                        : true;
                      return (
                        <div>
                          <div style={{ padding:"8px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(201,100,60,0.1)" }}>
                            <button onClick={() => setLwActionTarget(null)} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:10, fontFamily:T.ui }}>← Back</button>
                            <span style={{ fontSize:14 }}>{action.icon}</span>
                            <span style={{ fontSize:10, color:T.orange, fontFamily:T.ui, letterSpacing:"0.5px" }}>{action.label}</span>
                          </div>
                          {!readyToExecute && (
                            <div style={{ padding:"8px 16px" }}>
                              <div style={{ fontSize:9, color:T.textMuted, marginBottom:8 }}>
                                {!lwActionTarget.targetFaction ? "Select target faction:" : needsSecondFaction ? "Select second faction:" : ""}
                              </div>
                              {(data.factions || []).filter(f => {
                                if (needsSecondFaction) return f.name !== lwActionTarget.targetFaction;
                                return true;
                              }).map(f => (
                                <button key={f.name}
                                  onClick={() => {
                                    if (!lwActionTarget.targetFaction) {
                                      setLwActionTarget(prev => ({ ...prev, targetFaction: f.name }));
                                    } else if (needsSecondFaction) {
                                      setLwActionTarget(prev => ({ ...prev, allyFaction: f.name }));
                                    }
                                  }}
                                  style={{
                                    display:"flex", width:"100%", padding:"8px 16px", textAlign:"left", gap:8, alignItems:"center",
                                    background:"transparent", border:"none", borderBottom:"1px solid rgba(80,70,55,0.15)", cursor:"pointer",
                                    transition:"all 0.2s",
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,100,60,0.08)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                  <span style={{ width:10, height:10, borderRadius:"50%", background: f.color || T.textFaint, flexShrink:0, border:"1px solid rgba(255,255,255,0.2)" }} />
                                  <span style={{ fontSize:10, color:T.gold, fontFamily:T.ui }}>{f.name}</span>
                                  <span style={{ fontSize:8, color:T.textMuted, marginLeft:"auto" }}>Power: {f.power}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {readyToExecute && (
                            <div style={{ padding:"16px" }}>
                              <div style={{ fontSize:9, color:T.textMuted, marginBottom:8, lineHeight:1.5 }}>
                                {action.label} targeting <span style={{ color:T.orange }}>{lwActionTarget.targetFaction}</span>
                                {lwActionTarget.allyFaction && <> and <span style={{ color:T.orange }}>{lwActionTarget.allyFaction}</span></>}
                              </div>
                              <button
                                onClick={() => {
                                  if (!window.livingWorld) return;
                                  const result = window.livingWorld.triggerPlayerAction(lwActionTarget.actionId, data, {
                                    targetFaction: lwActionTarget.targetFaction,
                                    allyFaction: lwActionTarget.allyFaction,
                                  });
                                  if (result) {
                                    setLwPartyActionsOpen(false);
                                    setLwActionTarget(null);
                                  }
                                }}
                                style={{
                                  width:"100%", padding:"10px 16px", background:"rgba(201,100,60,0.2)", border:"1px solid rgba(201,100,60,0.4)",
                                  borderRadius:"4px", color:T.orange, cursor:"pointer", fontFamily:T.ui, fontSize:10,
                                  letterSpacing:"1px", textTransform:"uppercase", transition:"all 0.2s",
                                }}
                                onMouseEnter={e => e.target.style.background = "rgba(201,100,60,0.35)"}
                                onMouseLeave={e => e.target.style.background = "rgba(201,100,60,0.2)"}
                              >
                                Execute Action
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            )}

            {/* ── Time Skip Progress Overlay ── */}
            {isLive && lwTimeSkipProgress && (
              <div style={{
                position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center",
                zIndex:40, fontFamily:T.ui
              }}>
                <div style={{
                  background:"rgba(20,18,14,0.98)", border:"2px solid rgba(212,67,58,0.5)", borderRadius:"8px",
                  padding:"32px", textAlign:"center", minWidth:300
                }}>
                  <div style={{ fontSize:14, color:T.text, marginBottom:20, letterSpacing:"1px" }}>
                    Traversing the timeline...
                  </div>
                  <div style={{
                    width:"100%", height:24, background:"rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.3)",
                    borderRadius:"4px", overflow:"hidden", position:"relative"
                  }}>
                    <div style={{
                      height:"100%", background:"linear-gradient(90deg, rgba(212,67,58,0.4), rgba(212,67,58,0.8))",
                      width:`${(lwTimeSkipProgress.current / lwTimeSkipProgress.total) * 100}%`,
                      transition:"width 0.1s linear"
                    }} />
                  </div>
                  <div style={{ fontSize:10, color:T.gold, marginTop:12, letterSpacing:"0.5px" }}>
                    {lwTimeSkipProgress.current} / {lwTimeSkipProgress.total} events
                  </div>
                </div>
              </div>
            )}

            {/* ── Time Skip Summary Modal ── */}
            {isLive && lwTimeSkipSummary && (
              <div style={{
                position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center",
                zIndex:40, fontFamily:T.ui, padding:20
              }}>
                <div style={{
                  background:"rgba(20,18,14,0.98)", border:"2px solid rgba(212,67,58,0.4)", borderRadius:"8px",
                  padding:"24px", maxWidth:500, maxHeight:"70vh", overflow:"hidden", display:"flex", flexDirection:"column"
                }}>
                  <div style={{ fontSize:14, color:T.text, marginBottom:16, letterSpacing:"1px", textAlign:"center" }}>
                    Time has passed... {lwTimeSkipSummary.length} events transpired
                  </div>
                  <div style={{
                    flex:1, overflowY:"auto", marginBottom:16, paddingRight:12,
                    borderTop:"1px solid rgba(212,67,58,0.2)", borderBottom:"1px solid rgba(212,67,58,0.2)",
                    paddingTop:12, paddingBottom:12
                  }}>
                    {lwTimeSkipSummary.filter(e => e.importance === "major").map((evt, i) => (
                      <div key={i} style={{
                        display:"flex", gap:10, marginBottom:12, alignItems:"flex-start",
                        paddingBottom:12, borderBottom:"1px solid rgba(212,67,58,0.1)"
                      }}>
                        <span style={{ fontSize:18, flexShrink:0, lineHeight:1 }}>{evt.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:11, color:T.text, fontWeight:500, marginBottom:4 }}>{evt.headline}</div>
                          <div style={{ fontSize:9, color:T.textMuted, lineHeight:1.4 }}>{evt.detail}</div>
                        </div>
                      </div>
                    ))}
                    {lwTimeSkipSummary.length > 0 && lwTimeSkipSummary.filter(e => e.importance === "major").length === 0 && (
                      <div style={{ fontSize:10, color:T.textMuted, fontStyle:"italic", textAlign:"center", padding:"20px 0" }}>
                        No major events. The world remained quiet.
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                    <button onClick={() => {
                      setLwTimeSkipSummary(null);
                      setLwShowLog(true);
                    }}
                      style={{
                        padding:"8px 16px", background:"rgba(212,67,58,0.2)", border:"1px solid rgba(212,67,58,0.4)",
                        borderRadius:"4px", color:T.gold, cursor:"pointer", fontFamily:T.ui, fontSize:9,
                        letterSpacing:"1px", textTransform:"uppercase", transition:"all 0.2s"
                      }}
                      onMouseEnter={e => e.target.style.background = "rgba(212,67,58,0.35)"}
                      onMouseLeave={e => e.target.style.background = "rgba(212,67,58,0.2)"}
                    >
                      View Full Log
                    </button>
                    <button onClick={() => setLwTimeSkipSummary(null)}
                      style={{
                        padding:"8px 16px", background:"rgba(30,26,22,0.9)", border:"1px solid rgba(212,67,58,0.25)",
                        borderRadius:"4px", color:T.gold, cursor:"pointer", fontFamily:T.ui, fontSize:9,
                        letterSpacing:"1px", textTransform:"uppercase", transition:"all 0.2s"
                      }}
                      onMouseEnter={e => e.target.style.background = "rgba(212,67,58,0.1)"}
                      onMouseLeave={e => e.target.style.background = "rgba(30,26,22,0.9)"}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Living World Event Ticker (bottom of map) ── */}
            {isLive && lwActive && lwEvents.length > 0 && (
              <div style={{
                position:"absolute", bottom:0, left:0, right:0, zIndex:20,
                background:"linear-gradient(transparent, rgba(15,12,8,0.95) 30%)",
                padding:"40px 20px 16px", pointerEvents:"none",
              }}>
                <div style={{ display:"flex", flexDirection:"column", gap:8, pointerEvents:"auto" }}>
                  {lwEvents.slice(0, 3).map((evt, i) => (
                    <div key={evt.timestamp + "-" + i} style={{
                      display:"flex", alignItems:"flex-start", gap:12, padding:"10px 16px",
                      background: i === 0 ? "rgba(212,67,58,0.12)" : "rgba(32,28,22,0.8)",
                      border: `1px solid ${i === 0 ? "rgba(212,67,58,0.35)" : "rgba(80,70,55,0.3)"}`,
                      borderRadius:"6px", transition:"all 0.5s ease",
                      opacity: i === 0 ? 1 : 0.7,
                      animation: i === 0 ? "lwSlideIn 0.5s ease" : "none",
                    }}>
                      <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>{evt.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:500, color: i === 0 ? T.text : T.textMuted, fontFamily:T.ui, letterSpacing:"0.3px" }}>{evt.headline}</div>
                        <div style={{ fontSize:10, color:T.textMuted, lineHeight:1.5, marginTop:3, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp: i === 0 ? 3 : 1, WebkitBoxOrient:"vertical" }}>{evt.detail}</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2, flexShrink:0 }}>
                        <span style={{
                          fontSize:8, padding:"2px 6px", borderRadius:"2px", letterSpacing:"0.8px", textTransform:"uppercase",
                          color: evt.importance === "major" ? T.gold : evt.importance === "minor" ? "#6a8070" : "#9a9080",
                          border: `1px solid ${evt.importance === "major" ? "rgba(212,67,58,0.3)" : "rgba(120,110,88,0.3)"}`,
                        }}>{evt.importance}</span>
                        <span style={{ fontSize:8, color:T.textMuted, letterSpacing:"0.5px", textTransform:"uppercase" }}>{evt.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Living World Event Log Panel ── */}
            {isLive && lwShowLog && (
              <div style={{
                position:"absolute", top:0, left:0, bottom:0, width:380, zIndex:30,
                background:"rgba(20,18,14,0.98)", borderRight:"1px solid rgba(212,67,58,0.2)",
                display:"flex", flexDirection:"column", overflow:"hidden",
                boxShadow:"4px 0 24px rgba(0,0,0,0.4)",
              }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(212,67,58,0.15)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:14, color:T.text, fontFamily:T.ui, letterSpacing:"1px" }}>World Events</div>
                    <div style={{ fontSize:9, color:T.textMuted, marginTop:2 }}>{lwLog.length} events this session</div>
                  </div>
                  <button onClick={() => setLwShowLog(false)} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:18, padding:"2px 6px" }}>×</button>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
                  {lwLog.length === 0 && (
                    <div style={{ padding:20, textAlign:"center", color:T.textMuted, fontStyle:"italic", fontSize:11 }}>
                      No events yet. The world is quiet... for now.
                    </div>
                  )}
                  {lwLog.map((evt, i) => (
                    <div key={evt.timestamp + "-" + i} style={{
                      padding:"12px 14px", marginBottom:8,
                      background: "rgba(32,28,22,0.6)", border:"1px solid rgba(80,70,55,0.3)",
                      borderRadius:"4px", borderLeft: `3px solid ${
                        evt.category === "military" ? "#c94040" :
                        evt.category === "political" ? "#4a90d9" :
                        evt.category === "economic" ? "#d4a017" :
                        evt.category === "social" ? "#8b50f0" :
                        evt.category === "arcane" ? "#a569bd" :
                        "#2e8b57"
                      }`,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:16 }}>{evt.icon}</span>
                        <span style={{ fontSize:11, fontWeight:500, color:T.text, fontFamily:T.ui, flex:1 }}>{evt.headline}</span>
                        <span style={{ fontSize:8, color:T.textMuted }}>#{evt.tickNumber}</span>
                      </div>
                      <div style={{ fontSize:10, color:T.textMuted, lineHeight:1.5 }}>{evt.detail}</div>
                      <div style={{ display:"flex", gap:6, marginTop:6 }}>
                        <span style={{ fontSize:8, color:T.textMuted, letterSpacing:"0.5px", textTransform:"uppercase" }}>{evt.category}</span>
                        <span style={{ fontSize:8, color: evt.importance === "major" ? T.questGold : T.textMuted, letterSpacing:"0.5px", textTransform:"uppercase" }}>{evt.importance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Old Atlas Import Modal — removed (now using pre-generated SVGs) */}

            {/* Old Map Generation Modal — removed (now using seed selector + pre-generated atlas SVGs) */}

            {/* Minimap overlay — always visible when zoomed past continent */}
            {false && mapZoom > 0.5 && (
              <div style={{ position:"absolute", bottom:12, left:12, width:200, height:150, background:T.bgCard, border:`1px solid ${T.crimsonBorder}`, borderRadius:"3px", overflow:"hidden", opacity:0.88 }}>
                <svg width="200" height="150" viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
                  <rect width={MAP_W} height={MAP_H} fill="#0b1118" opacity="0.72"/>
                  <path d={atlasLandPath} fill="#1b1815" stroke="rgba(212,67,58,0.16)" strokeWidth="18"/>
                  {atlasIslands.map((isle, i) => <path key={`mm-isle-${i}`} d={isle.path} fill="#171716" opacity="0.82"/>)}
                  {/* Territory fills */}
                  {atlasTerritories.map((t,i) => <path key={`mt-${i}`} d={t.path} fill={t.color} opacity="0.16"/>)}
                  {/* Region dots */}
                  {mapRegions.map(r => <circle key={r.id} cx={r.mx} cy={r.my} r={(r.type==="city"||r.type==="kingdom")?30:18} fill={tCols[r.threat]||"var(--text-muted)"} opacity="0.5"/>)}
                  {/* Viewport indicator */}
                  {(() => {
                    const rect = mapRef.current?.getBoundingClientRect();
                    if(!rect) return null;
                    const vx = -mapPan.x / mapZoom, vy = -mapPan.y / mapZoom;
                    const vw = rect.width / mapZoom, vh = rect.height / mapZoom;
                    return <rect x={vx} y={vy} width={vw} height={vh} fill="none" stroke="var(--crimson)" strokeWidth="8" opacity="0.65" rx="4"/>;
                  })()}
                </svg>
              </div>
            )}

            {/* Travel info panel */}
            {(activeRoute || routeDraft.fromId || routeDraft.toId || worldMapState.lastRoute) && (
              <div style={{
                position:"absolute", left:"50%", bottom:isMapCompact ? 12 : 16, transform:"translateX(-50%)",
                padding:"12px 18px", borderRadius:12, pointerEvents:"auto",
                background:"rgba(248,242,228,0.94)", border:"1px solid rgba(122,110,88,0.35)",
                boxShadow:"0 14px 36px rgba(50,42,28,0.12)",
                display:"flex", alignItems:"center", gap:12, maxWidth:"calc(100% - 24px)",
              }}>
                <MapPin size={14} color="#4a6b52" />
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:T.ui, fontSize:10, letterSpacing:"1.4px", textTransform:"uppercase", color:T.textMuted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {activeRoute
                      ? `${activeRoute.from.name} -> ${activeRoute.to.name}`
                      : (routeDraft.fromId || routeDraft.toId)
                        ? `${worldNodesById[routeDraft.fromId]?.name || "Choose start"} -> ${worldNodesById[routeDraft.toId]?.name || "Choose destination"}`
                        : `${worldMapState.lastRoute?.from || "Route"} -> ${worldMapState.lastRoute?.to || "destination"}`}
                  </div>
                  <div style={{ fontSize:11, color:T.textMuted, fontFamily:T.body, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {(activeRoute && !activeRoute.blocked)
                      ? `${activeRoute.miles} miles - ${activeRoute.etaDays} days - ${activeRoute.threat} risk`
                      : activeRoute?.blocked
                        ? "No connected road route between these locations yet"
                      : (routeDraft.fromId || routeDraft.toId)
                        ? "Pick the other endpoint from any region panel"
                      : worldMapState.lastRoute
                        ? `${worldMapState.lastRoute.miles} miles - ${worldMapState.lastRoute.etaDays} days - ${worldMapState.lastRoute.threat} risk`
                        : "Select a start and destination from a region panel."}
                  </div>
                </div>
                {(activeRoute || routeDraft.fromId || routeDraft.toId) && <button type="button" onClick={clearWorldRoute} style={{
                  border:"none", background:"transparent", color:T.textFaint, cursor:"pointer", padding:4,
                }}><X size={14}/></button>}
              </div>
            )}
          </div>
        )}

        {/* ══════════ LIST TABS (regions / factions / npcs) ══════════ */}
        {tab!=="map" && (
          <div style={{ flex:1, overflowY:"auto", padding:"24px 48px" }}>
            {tab==="regions" && (() => {
              const cities = data.cities || [];
              const mods = data.modules || {};
              const toggleRegion = (rId) => setExpandedRegions(prev => ({ ...prev, [rId]: !prev[rId] }));

              // If a city detail is selected within regions view, show full city detail
              if (regionDetailCity) {
                const c = cities.find(ct => ct.id === regionDetailCity.id) || regionDetailCity;
                const fc = (() => { const f = (data.factions || []).find(f => f.name === c.faction); return f?.color || T.gold; })();
                const cityNpcs = (data.npcs || []).filter(n => (c.npcs || []).includes(n.id));
                return (
                  <div style={{ display:"flex", flexDirection:"column", gap:0, maxWidth:900 }}>
                    <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                      <button onClick={() => setRegionDetailCity(null)} style={{
                        display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                        background:"transparent", border:`1px solid ${T.border}`, borderRadius:"3px", color:T.textMuted,
                        fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer",
                      }}><ArrowLeft size={12}/> Back to Regions</button>
                      <button onClick={() => { setTab("map"); }} style={{
                        display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                        background:"transparent", border:`1px solid ${T.border}`, borderRadius:"3px", color:T.textMuted,
                        fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer",
                      }}>◎ View on Map</button>
                      {townImagesReady && window.TOWN_IMAGES && window.TOWN_IMAGES[c.name] && (
                        <button onClick={() => { setTownView(c.name); setTownSelBldg(null); setTownHovBldg(null); setTownZoom(0); setTownPan({x:0,y:0}); }} style={{
                          display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                          background:"linear-gradient(135deg, rgba(212,67,58,0.15), transparent)", border:"1px solid rgba(212,67,58,0.4)", borderRadius:"3px", color:T.gold,
                          fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer",
                        }}>Explore Town</button>
                      )}
                    </div>
                    <div style={{
                      padding:"24px 28px", marginBottom:20,
                      background:`linear-gradient(135deg, ${fc}12 0%, transparent 60%)`,
                      borderLeft:`4px solid ${fc}`, borderRadius:"4px", border:`1px solid ${T.border}`,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:22, fontWeight:400, color:T.text, fontFamily:T.ui, letterSpacing:"0.5px" }}>{c.name}</span>
                        <span style={{ fontSize:9, color:c.isCapital?T.gold:T.textMuted, border:`1px solid ${c.isCapital?"rgba(212,67,58,0.3)":"rgba(154,144,128,0.3)"}`, padding:"2px 8px", borderRadius:"2px", letterSpacing:"1px" }}>{c.isCapital?"CAPITAL":"SETTLEMENT"}</span>
                      </div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:8 }}>{c.region} · {c.faction} · Pop. {c.population}</div>
                      <div style={{ fontSize:12, color:T.textDim, lineHeight:1.6 }}>{c.description}</div>
                      {c.features && c.features.length > 0 && (
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:12 }}>
                          {c.features.map((f, fi) => <span key={fi} style={{ fontSize:10, color:T.gold, border:"1px solid rgba(212,67,58,0.2)", padding:"3px 9px", borderRadius:"2px" }}>{f}</span>)}
                        </div>
                      )}
                    </div>
                    {/* Tavern */}
                    <div style={{ padding:"20px 24px", marginBottom:16, background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px" }}>
                      <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Tavern & Inn</div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <span style={{ fontSize:16, fontWeight:400, color:T.text, fontFamily:T.body }}>{c.tavern.name}</span>
                        <span style={{ fontSize:11, color:T.textFaint }}>— Innkeeper: {c.tavern.innkeeper} ({c.tavern.innkeeperPersonality})</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                        {c.tavern.services.map((s, si) => (
                          <div key={si} style={{ display:"flex", justifyContent:"space-between", padding:"6px 10px", background:"rgba(0,0,0,0.12)", borderRadius:"3px", fontSize:11 }}>
                            <span style={{ color:T.textMuted }}>{s.name}</span>
                            <span style={{ color:T.gold, fontFamily:T.ui }}>{s.price}</span>
                          </div>
                        ))}
                      </div>
                      {c.tavern.rumor && (
                        <div style={{ fontSize:11, color:T.questGold, fontStyle:"italic", padding:"8px 12px", background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.15)", borderRadius:"3px" }}>
                          Rumor: "{c.tavern.rumor}"
                        </div>
                      )}
                    </div>
                    {/* Shops */}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12, paddingLeft:4 }}>Shops & Merchants ({c.shops.length})</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                        {c.shops.map(shop => (
                          <div key={shop.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", overflow:"hidden" }}>
                            <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${T.border}` }}>
                              <div>
                                <div style={{ fontSize:14, fontWeight:400, color:T.text }}>{shop.name}</div>
                                <div style={{ fontSize:11, color:T.textFaint, marginTop:2 }}>{shop.type} — Owner: {shop.owner} ({shop.ownerPersonality})</div>
                              </div>
                              <span style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui }}>{shop.items.length} items</span>
                            </div>
                            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                              <thead>
                                <tr style={{ background:"rgba(0,0,0,0.15)" }}>
                                  <th style={{ padding:"8px 16px", textAlign:"left", color:T.textFaint, fontWeight:400, fontSize:10, letterSpacing:"1px", textTransform:"uppercase" }}>Item</th>
                                  <th style={{ padding:"8px 12px", textAlign:"center", color:T.textFaint, fontWeight:400, fontSize:10, letterSpacing:"1px", textTransform:"uppercase" }}>Rarity</th>
                                  <th style={{ padding:"8px 12px", textAlign:"right", color:T.textFaint, fontWeight:400, fontSize:10, letterSpacing:"1px", textTransform:"uppercase" }}>Price</th>
                                  <th style={{ padding:"8px 12px", textAlign:"center", color:T.textFaint, fontWeight:400, fontSize:10, letterSpacing:"1px", textTransform:"uppercase" }}>Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {shop.items.map((item, ii) => (
                                  <tr key={ii} style={{ borderTop:`1px solid ${T.border}`, opacity:item.inStock?1:0.4 }}>
                                    <td style={{ padding:"8px 16px", color:T.text }}>{item.name}</td>
                                    <td style={{ padding:"8px 12px", textAlign:"center" }}>
                                      <span style={{ fontSize:10, color:item.rarity==="rare"?T.gold:item.rarity==="uncommon"?T.green:T.textFaint, fontStyle:"italic" }}>{item.rarity}</span>
                                    </td>
                                    <td style={{ padding:"8px 12px", textAlign:"right", color:T.gold, fontFamily:T.ui }}>{item.price}</td>
                                    <td style={{ padding:"8px 12px", textAlign:"center", color:item.inStock?T.textMuted:T.crimson, fontSize:11 }}>{item.inStock?("×"+item.qty):"Out"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Notable NPCs */}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12, paddingLeft:4 }}>Notable Residents ({cityNpcs.length})</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        {cityNpcs.map(n => (
                          <div key={n.id} onClick={() => { setSel(n); setSelType("npc"); setTab("npcs"); setRegionDetailCity(null); }} style={{
                            padding:"12px 16px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", cursor:"pointer",
                          }}>
                            <div style={{ fontSize:13, fontWeight:300, color:T.text, marginBottom:4 }}>{n.name}</div>
                            <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic" }}>{n.role}</div>
                          </div>
                        ))}
                        {c.shops.map(shop => (
                          <div key={"owner-"+shop.id} style={{ padding:"12px 16px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px" }}>
                            <div style={{ fontSize:13, fontWeight:300, color:T.text, marginBottom:4 }}>{shop.owner}</div>
                            <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic" }}>{shop.type} Owner</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Quest Hooks */}
                    {c.questHooks && c.questHooks.length > 0 && (
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12, paddingLeft:4 }}>Quest Hooks</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                          {c.questHooks.map((q, qi) => (
                            <div key={qi} style={{
                              padding:"12px 16px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px",
                              borderLeft:"3px solid T.gold", display:"flex", alignItems:"center", gap:12,
                            }}>
                              <Scroll size={14} color={T.gold} style={{ flexShrink:0 }}/>
                              <span style={{ fontSize:12, color:T.textMuted, lineHeight:1.5, fontStyle:"italic" }}>{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  {data.regions.map(r => {
                    const FantasyIcon = getFantasyIcon(r.type);
                    const active = sel?.id === r.id && selType === "region";
                    const isExpanded = expandedRegions[r.id] || false;
                    const regionNpcs = (data.npcs || []).filter(n => n.loc === r.name);
                    const regionCities = cities.filter(c => c.region === r.name);
                    const factionObj = (data.factions || []).find(f => f.name === r.ctrl);
                    const fc = factionObj?.color || T.gold;
                    regionCities.sort((a, b) => (b.isCapital ? 1 : 0) - (a.isCapital ? 1 : 0) || (b.popNum || 0) - (a.popNum || 0));

                    return (
                      <div key={r.id} style={{
                        borderRadius:"6px", overflow:"hidden",
                        border: active ? `1px solid ${T.crimsonBorder}` : `1px solid ${T.border}`,
                        boxShadow:"0 2px 8px rgba(0,0,0,0.08)", transition:"all 0.2s",
                      }}>
                        {/* Region Header */}
                        <div onClick={() => { setSel(null); setSelType(null); setEditing(false); toggleRegion(r.id); }} style={{
                          padding:"18px 22px", cursor:"pointer",
                          background: `linear-gradient(135deg, ${fc}12 0%, transparent 60%)`,
                          borderLeft: `4px solid ${fc}`,
                        }}>
                          <div style={{ display:"flex", alignItems:"start", gap:14 }}>
                            <div style={{ flexShrink:0, marginTop:2, opacity:0.85 }}>
                              <FantasyIcon size={r.type==="city"||r.type==="kingdom"||r.type==="capital"?36:28} color={tCols[r.threat]}/>
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
                                <span style={{ fontSize:18, fontWeight:400, color:T.text, fontFamily:T.ui, letterSpacing:"0.5px" }}>{r.name}</span>
                                {r.type && <span style={{ fontSize:9, color:fc, border:`1px solid ${fc}44`, padding:"2px 8px", borderRadius:"2px", letterSpacing:"1.2px", textTransform:"uppercase" }}>{r.type}</span>}
                              </div>
                              {r.subtitle && <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic", marginBottom:6, fontWeight:300 }}>{r.subtitle}</div>}
                              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                                <Tag variant={r.threat==="extreme"?"critical":r.threat==="high"?"danger":r.threat==="medium"?"warning":"success"}>{r.threat}</Tag>
                                {r.terrain && <Tag variant="muted">{r.terrain}</Tag>}
                                {r.visited && <Tag variant="info">visited</Tag>}
                              </div>
                              <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:11, color:T.textMuted }}>
                                {(() => { const cap = regionCities.find(c => c.isCapital); return cap ? <span style={{ color:T.gold }}>⚑ Capital: {cap.name}</span> : null; })()}
                                {r.state && <span style={{ fontStyle:"italic" }}>{r.state}</span>}
                                {r.population && <span>Pop. ~{r.population}</span>}
                                {regionCities.length > 0 && <span>{regionCities.length} settlement{regionCities.length !== 1 ? "s" : ""}</span>}
                              </div>
                              {r.governor && <div style={{ fontSize:11, color:T.textDim, marginTop:6 }}>
                                <span style={{ color:T.gold, fontWeight:400 }}>{r.governorTitle || "Governor"}:</span> {r.governor}
                              </div>}
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                              <div style={{ transition:"transform 0.2s", transform:isExpanded?"rotate(180deg)":"rotate(0deg)" }}>
                                <ChevronDown size={16} color={T.textFaint}/>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); setTab("map"); setCityRegionFocus(r.name); }} style={{
                                padding:"4px 10px", background:`${fc}18`, border:`1px solid ${fc}44`, borderRadius:"3px",
                                color:fc, fontFamily:T.ui, fontSize:8, letterSpacing:"1px",
                                textTransform:"uppercase", cursor:"pointer",
                              }}>◎ Map</button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div style={{ background:"rgba(0,0,0,0.04)", borderTop:`1px solid ${T.border}` }}>
                            {/* Cities & Towns */}
                            {regionCities.length > 0 && (
                              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
                                <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                                  Cities & Towns ({regionCities.length})
                                </div>
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                                  {regionCities.map(c => {
                                    const cityFc = (() => { const f = (data.factions || []).find(f => f.name === c.faction); return f?.color || T.gold; })();
                                    return (
                                      <div key={c.id} onClick={(e) => { e.stopPropagation(); setRegionDetailCity(c); }} style={{
                                        padding:"12px 16px", background:T.bgCard,
                                        border:c.isCapital?`1px solid ${cityFc}55`:`1px solid ${T.border}`,
                                        borderLeft:c.isCapital?`3px solid ${cityFc}`:`2px solid ${T.border}22`,
                                        borderRadius:"4px", cursor:"pointer", transition:"border-color 0.2s, box-shadow 0.2s",
                                      }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.2)"}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
                                      >
                                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                                          {c.isCapital
                                            ? <span style={{ fontSize:16, color:cityFc }}>★</span>
                                            : <span style={{ fontSize:14, color:T.textFaint }}>◆</span>}
                                          <span style={{ fontSize:14, fontWeight:c.isCapital?500:300, color:T.text }}>{c.name}</span>
                                          <span style={{ fontSize:8, color:c.isCapital?cityFc:T.textMuted, border:`1px solid ${c.isCapital?cityFc+"44":"rgba(154,144,128,0.3)"}`, padding:"1px 5px", borderRadius:"2px", letterSpacing:"0.5px" }}>{c.isCapital?"CAPITAL":"SETTLEMENT"}</span>
                                        </div>
                                        <div style={{ fontSize:10, color:T.textFaint, marginBottom:7 }}>Pop. {c.population}</div>
                                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:7 }}>
                                          {(c.features || []).slice(0, 2).map((f, fi) => (
                                            <span key={fi} style={{ fontSize:9, color:T.textDim, background:"rgba(0,0,0,0.15)", padding:"2px 6px", borderRadius:"2px" }}>{f}</span>
                                          ))}
                                        </div>
                                        <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:10, color:T.textFaint }}>
                                          <span>{c.shops.length} shops</span>
                                          <span>1 tavern</span>
                                          <span>{(c.npcs || []).length} NPCs</span>
                                          <span>{(c.questHooks || []).length} quests</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Region Details — Climate, Resources, Dangers, Lore */}
                            <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                                {/* Climate & Terrain */}
                                <div>
                                  <div style={{ fontSize:9, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>✦ Climate</div>
                                  <div style={{ fontSize:11, color:T.textMuted, lineHeight:1.5 }}>{r.climate || "Varied climate"}</div>
                                </div>
                                {/* Known Dangers */}
                                <div>
                                  <div style={{ fontSize:9, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>⚠ Known Dangers</div>
                                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                                    {(r.dangers || ["bandits"]).map((d, di) => (
                                      <div key={di} style={{ fontSize:10, color:r.threat==="extreme"||r.threat==="high"?T.crimson:T.textMuted, display:"flex", alignItems:"center", gap:6 }}>
                                        <div style={{ width:4, height:4, borderRadius:"50%", background:r.threat==="extreme"?T.crimson:r.threat==="high"?T.orange:T.green, flexShrink:0 }}/>
                                        {d}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {/* Natural Resources */}
                              {r.resources && r.resources.length > 0 && (
                                <div style={{ marginTop:14 }}>
                                  <div style={{ fontSize:9, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>◫ Natural Resources</div>
                                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                    {r.resources.map((res, ri) => (
                                      <span key={ri} style={{ fontSize:10, color:T.gold, background:"rgba(212,67,58,0.06)", padding:"4px 10px", borderRadius:"3px", border:"1px solid rgba(212,67,58,0.15)" }}>{res}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Lore */}
                              {r.lore && (
                                <div style={{ marginTop:14, padding:"10px 14px", background:"rgba(212,67,58,0.04)", border:"1px solid rgba(212,67,58,0.12)", borderRadius:"3px", borderLeft:"3px solid rgba(212,67,58,0.3)" }}>
                                  <div style={{ fontSize:9, color:T.questGold, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>⸎ Local Lore</div>
                                  <div style={{ fontSize:11, color:T.textDim, fontStyle:"italic", lineHeight:1.5 }}>{r.lore}</div>
                                </div>
                              )}
                            </div>

                            {/* Sub-Factions Operating in Region */}
                            {(() => {
                              const subFacs = (data.factions || []).filter(f => f.isSubFaction && f.parentRegion === r.name);
                              if (subFacs.length === 0) return null;
                              return (
                                <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
                                  <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                                    † Organizations & Influence ({subFacs.length})
                                  </div>
                                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                    {subFacs.map(sf => {
                                      const infLvlColor = sf.influenceLevel === "major" ? T.crimson : sf.influenceLevel === "moderate" ? T.orange : T.green;
                                      return (
                                        <div key={sf.id} style={{ padding:"10px 14px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", borderLeft:`3px solid ${sf.color}` }}>
                                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                            <span style={{ fontSize:12, color:T.text, fontWeight:400 }}>{sf.name}</span>
                                            <span style={{ fontSize:8, color:infLvlColor, border:`1px solid ${infLvlColor}44`, padding:"1px 6px", borderRadius:"2px", letterSpacing:"0.5px", textTransform:"uppercase" }}>{sf.influenceLevel}</span>
                                            <span style={{ fontSize:8, color:T.textFaint, marginLeft:"auto" }}>{sf.govType}</span>
                                          </div>
                                          <div style={{ fontSize:10, color:T.textDim, lineHeight:1.5, marginBottom:6 }}>{sf.desc}</div>
                                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                            {(sf.influence || []).map((inf, ii) => (
                                              <span key={ii} style={{ fontSize:8, color:sf.color, background:`${sf.color}12`, padding:"2px 6px", borderRadius:"2px", border:`1px solid ${sf.color}33` }}>{inf}</span>
                                            ))}
                                            {sf.hierarchy && sf.hierarchy[0] && (
                                              <span style={{ fontSize:9, color:T.textFaint, marginLeft:"auto" }}>Led by {sf.hierarchy[0].name}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Economy Info (if economy module is enabled) */}
                            {mods.economy !== false && (
                              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
                                <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                                  ◆ Regional Economy
                                </div>
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                                  {(r.resources || ["Grain", "Timber", "Iron"]).map((res, ri) => (
                                    <div key={ri} style={{ padding:"8px 12px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"3px", textAlign:"center" }}>
                                      <div style={{ fontSize:10, color:T.textMuted, marginBottom:4 }}>{res}</div>
                                      <div style={{ fontSize:12, color:T.gold, fontFamily:T.ui }}>{(() => { let h = 0; for (let c = 0; c < r.name.length; c++) h = ((h << 5) - h + r.name.charCodeAt(c)) | 0; return Math.abs((h * (ri + 1) * 7) % 8) + 2; })()} gp</div>
                                    </div>
                                  ))}
                                </div>
                                {factionObj && (
                                  <div style={{ marginTop:10, display:"flex", gap:12, fontSize:10, color:T.textMuted }}>
                                    <span>Treasury: <span style={{ color:T.gold }}>{(factionObj.treasury || 0).toLocaleString()} gp</span></span>
                                    <span>Trade Status: <span style={{ color:T.green }}>Active</span></span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Religion Info — Dominant Gods per Region */}
                            {mods.religion !== false && (() => {
                              // Look up deity info from the DEITIES arrays
                              const _p = window.PANTHEON || {};
                              const allDeities = [
                                ...(_p.greater || []),
                                ...(_p.intermediate || []),
                                ...(_p.lesser || [])
                              ];
                              const getDeity = (id) => allDeities.find(d => d.id === id);
                              // Get all temples in this region's cities
                              const regionTemples = (data._temples || []).filter(t => regionCities.some(c => c.name === t.city));
                              // Aggregate devotion by deity
                              const deityDevotionMap = {};
                              regionTemples.forEach(t => {
                                if (!deityDevotionMap[t.deityId]) deityDevotionMap[t.deityId] = { devotion: 0, temples: [], level: "shrine" };
                                deityDevotionMap[t.deityId].devotion += (t.devotion || 30);
                                deityDevotionMap[t.deityId].temples.push(t);
                                const lvlRank = { shrine:1, chapel:2, temple:3, cathedral:4, holy_citadel:5 };
                                if ((lvlRank[t.level] || 0) > (lvlRank[deityDevotionMap[t.deityId].level] || 0)) {
                                  deityDevotionMap[t.deityId].level = t.level;
                                }
                              });
                              // If no temples data, seed deterministically from region name + cities
                              if (regionTemples.length === 0 && regionCities.length > 0 && allDeities.length > 0) {
                                // Use simple hash of region name to pick deities
                                let hash = 0;
                                for (let i = 0; i < r.name.length; i++) hash = ((hash << 5) - hash + r.name.charCodeAt(i)) | 0;
                                const seedIdx = Math.abs(hash);
                                const numDeities = Math.min(2 + Math.floor(regionCities.length / 2), 5, allDeities.length);
                                for (let di = 0; di < numDeities; di++) {
                                  const deity = allDeities[(seedIdx + di * 7) % allDeities.length];
                                  const lvl = di === 0 ? "cathedral" : di === 1 ? "temple" : "chapel";
                                  const devotion = di === 0 ? 80 : di === 1 ? 50 : 30;
                                  deityDevotionMap[deity.id] = {
                                    devotion: devotion, level: lvl,
                                    temples: [{ deityId: deity.id, city: regionCities[di % regionCities.length]?.name || "Unknown", level: lvl, devotion: devotion }]
                                  };
                                }
                              }
                              // Sort by devotion, get top deities
                              const sortedDeities = Object.entries(deityDevotionMap)
                                .sort((a, b) => b[1].devotion - a[1].devotion);
                              const alignColors = { "LG":"#4a90d9", "NG":"#5ee09a", "CG":"#7bc67b", "LN":T.gold, "N":"#9a9080", "CN":T.gold, "LE":"#d44a3a", "NE":"#a83232", "CE":"#8b2020" };

                              return (
                                <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
                                  <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                                    ✠ Faith & Divine Presence
                                  </div>
                                  {sortedDeities.length > 0 ? (
                                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                      {/* Dominant deity highlight */}
                                      {sortedDeities.slice(0, 1).map(([deityId, info]) => {
                                        const deity = getDeity(deityId);
                                        if (!deity) return null;
                                        return (
                                          <div key={deityId} style={{
                                            padding:"14px 16px", background:"linear-gradient(135deg, rgba(232,148,10,0.08), transparent)",
                                            border:"1px solid rgba(232,148,10,0.25)", borderRadius:"4px",
                                            borderLeft:"3px solid #e8940a",
                                          }}>
                                            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                                              <span style={{ fontSize:22 }}>{deity.icon}</span>
                                              <div>
                                                <div style={{ fontSize:13, color:T.text, fontWeight:400 }}>{deity.name}</div>
                                                <div style={{ fontSize:10, color:T.textMuted, fontStyle:"italic" }}>{deity.title}</div>
                                              </div>
                                              <div style={{ marginLeft:"auto", textAlign:"right" }}>
                                                <span style={{ fontSize:8, color:alignColors[deity.alignment] || T.textFaint, border:`1px solid ${(alignColors[deity.alignment] || T.textFaint)}44`, padding:"2px 6px", borderRadius:"2px", letterSpacing:"0.5px" }}>{deity.alignment}</span>
                                              </div>
                                            </div>
                                            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                                              {deity.domains.map((d, di) => (
                                                <span key={di} style={{ fontSize:9, color:T.orange, background:"rgba(232,148,10,0.08)", padding:"2px 8px", borderRadius:"2px", border:"1px solid rgba(232,148,10,0.2)" }}>{d}</span>
                                              ))}
                                              <span style={{ fontSize:9, color:T.textFaint, padding:"2px 8px" }}>Dominant Faith</span>
                                            </div>
                                            <div style={{ fontSize:10, color:T.textDim, lineHeight:1.5, marginBottom:6 }}>{deity.description}</div>
                                            <div style={{ display:"flex", gap:12, fontSize:9, color:T.textMuted }}>
                                              <span>{info.temples.length} {info.temples.length === 1 ? "temple" : "temples"}</span>
                                              <span>Highest: {info.level}</span>
                                              <span>Devotion: {info.devotion}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      {/* Other worshipped deities */}
                                      {sortedDeities.length > 1 && (
                                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                                          {sortedDeities.slice(1, 5).map(([deityId, info]) => {
                                            const deity = getDeity(deityId);
                                            if (!deity) return null;
                                            return (
                                              <div key={deityId} style={{ padding:"10px 12px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"3px" }}>
                                                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                                  <span style={{ fontSize:16 }}>{deity.icon}</span>
                                                  <span style={{ fontSize:11, color:T.text, fontWeight:300 }}>{deity.name}</span>
                                                  <span style={{ fontSize:8, color:alignColors[deity.alignment] || T.textFaint, marginLeft:"auto" }}>{deity.alignment}</span>
                                                </div>
                                                <div style={{ fontSize:9, color:T.textFaint, marginBottom:4 }}>{deity.domains.join(", ")}</div>
                                                <div style={{ fontSize:9, color:T.textMuted }}>
                                                  {info.temples.length} {info.temples.length === 1 ? "site" : "sites"} · Devotion {info.devotion}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      {/* Temple locations */}
                                      {regionTemples.length > 0 && (
                                        <div style={{ marginTop:4 }}>
                                          <div style={{ fontSize:9, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Temple Locations</div>
                                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                            {regionCities.filter(c => regionTemples.some(t => t.city === c.name)).map(city => {
                                              const cityTempleCount = regionTemples.filter(t => t.city === city.name).length;
                                              return (
                                                <span key={city.id} style={{ fontSize:9, color:T.textMuted, padding:"3px 8px", background:"rgba(232,148,10,0.05)", border:"1px solid rgba(232,148,10,0.15)", borderRadius:"2px" }}>
                                                  {city.name} ({cityTempleCount})
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div style={{ fontSize:10, color:T.textFaint, fontStyle:"italic" }}>
                                      {regionCities.length > 0 ? "No established temples — folk religions and local spirits dominate." : "No settlements to house temples."}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Notable NPCs summary */}
                            {regionNpcs.length > 0 && (
                              <div style={{ padding:"16px 22px", borderTop:`1px solid ${T.border}` }}>
                                <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>
                                  Notable Figures ({regionNpcs.length})
                                </div>
                                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                                  {regionNpcs.slice(0, 6).map(n => (
                                    <div key={n.id} onClick={(e) => { e.stopPropagation(); setSel(n); setSelType("npc"); setTab("npcs"); }} style={{
                                      padding:"6px 12px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"3px", cursor:"pointer", transition:"all 0.2s",
                                    }}>
                                      <span style={{ fontSize:11, color:T.text, fontWeight:300 }}>{n.name}</span>
                                      <span style={{ fontSize:9, color:T.textFaint, marginLeft:6, fontStyle:"italic" }}>{n.role}</span>
                                    </div>
                                  ))}
                                  {regionNpcs.length > 6 && (
                                    <span style={{ fontSize:10, color:T.textFaint, padding:"6px 0", alignSelf:"center" }}>+{regionNpcs.length - 6} more</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {data.regions.length === 0 && (
                    <div style={{ padding:40, textAlign:"center", color:T.textFaint, fontStyle:"italic" }}>
                      No regions yet. Select an atlas seed on the Map tab to generate world data.
                    </div>
                  )}
                </div>
              );
            })()}

            {tab==="factions" && (() => {
              const allFactions = data.factions || [];
              const majorFactions = allFactions.filter(f => !f.isSubFaction);
              const subFactions = allFactions.filter(f => f.isSubFaction);
              const regions = data.regions || [];

              // Group by region: each region gets its ruling faction + sub-factions
              const regionGroups = regions.map(r => {
                const ruler = majorFactions.find(f => f.name === r.ctrl);
                const subs = subFactions.filter(sf => sf.parentRegion === r.name);
                return { region: r, ruler, subs };
              });

              // Unaffiliated factions (major factions that don't control any region)
              const controlledNames = new Set(regions.map(r => r.ctrl));
              const unaffiliated = majorFactions.filter(f => !controlledNames.has(f.name));

              const renderFactionCard = (f, isCompact) => {
                const active = sel?.id === f.id && selType === "faction";
                const factionNpcs = (data.npcs || []).filter(n => n.faction === f.name);
                const leaders = factionNpcs.filter(n => n.isLeader);
                const controlledRegions = regions.filter(r => r.ctrl === f.name);
                const govTypeIcons = {
                  "monarchy":"♔", "empire":"⚔", "republic":"⏣", "council":"⸎", "druidic":"⚘",
                  "guild":"◆", "cult":"◎", "theocracy":"✠", "tribal":"⌂", "military junta":"⛨",
                  "oligarchy":"⚖", "criminal syndicate":"†", "shadow government":"◉",
                  "arcane academy":"◎", "mercenary band":"⚔", "trade guild":"◆",
                  "religious order":"✝", "assassin guild":"†", "ranger order":"↝",
                  "craft guild":"⚒", "criminal network":"☠",
                };
                return (
                  <div key={f.id} onClick={() => { setSel(f); setSelType("faction"); setEditing(false); }} style={{
                    background: active ? T.bgHover : T.bgCard, padding: isCompact ? 14 : 20, cursor: "pointer",
                    border: `1px solid ${active ? T.crimsonBorder : T.border}`, borderRadius: "4px",
                    borderLeft: `4px solid ${f.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{govTypeIcons[f.govType] || "⚑"}</span>
                      <span style={{ fontSize: isCompact ? 14 : 17, fontWeight: 400, color: T.text, letterSpacing: "0.5px" }}>{f.name}</span>
                      <Tag variant={f.attitude === "allied" || f.attitude === "friendly" ? "success" : f.attitude === "hostile" ? "danger" : "muted"}>{f.attitude}</Tag>
                      {f.trend === "rising" ? <TrendingUp size={12} color={T.crimson}/> : f.trend === "declining" ? <TrendingDown size={12} color={T.green}/> : <Minus size={12} color={T.textFaint}/>}
                      {f.isSubFaction && f.influenceLevel && (
                        <span style={{ fontSize: 8, color: f.influenceLevel === "major" ? T.crimson : f.influenceLevel === "moderate" ? T.orange : T.green, border: `1px solid currentColor`, padding: "1px 5px", borderRadius: "2px", letterSpacing: "0.5px", textTransform: "uppercase", marginLeft: "auto" }}>{f.influenceLevel}</span>
                      )}
                    </div>
                    {f.govType && <div style={{ fontSize: 10, color: T.gold, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>{f.govType}</div>}
                    <p style={{ fontSize: 12, color: T.textDim, margin: "0 0 10px", fontWeight: 300, fontStyle: "italic", lineHeight: "1.5" }}>{f.desc}</p>

                    {/* Power bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 300, marginBottom: 10 }}>
                      <span style={{ fontFamily: T.ui, fontSize: 8, color: T.textFaint, letterSpacing: "1.5px" }}>PWR</span>
                      <div style={{ flex: 1 }}><PowerBar val={f.power} max={100} color={f.color}/></div>
                      <span style={{ fontSize: 12, color: T.textMuted }}>{f.power}</span>
                    </div>

                    {/* Influence spheres for sub-factions */}
                    {f.isSubFaction && f.influence && f.influence.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                        {f.influence.map((inf, ii) => (
                          <span key={ii} style={{ fontSize: 9, color: f.color, background: `${f.color}12`, padding: "2px 8px", borderRadius: "2px", border: `1px solid ${f.color}33` }}>{inf}</span>
                        ))}
                      </div>
                    )}

                    {/* Leadership hierarchy */}
                    {!isCompact && (f.hierarchy || leaders.length > 0) && (
                      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 4 }}>
                        <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Leadership</div>
                        {(f.hierarchy || leaders.map(l => ({ title: l.role, name: l.name }))).map((h, hi) => (
                          <div key={hi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, paddingLeft: hi === 0 ? 0 : hi * 8 }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: hi === 0 ? f.color : T.textFaint, opacity: hi === 0 ? 1 : 0.5, flexShrink: 0 }}/>
                            <span style={{ fontSize: 11, color: hi === 0 ? T.gold : T.textMuted, fontWeight: hi === 0 ? 400 : 300 }}>{h.title}:</span>
                            <span style={{ fontSize: 11, color: T.text, fontWeight: 300 }}>{h.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resources */}
                    {!isCompact && f.resources && f.resources.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {f.resources.map((res, ri) => (
                          <span key={ri} style={{ padding: "2px 8px", background: "rgba(212,67,58,0.08)", border: "1px solid rgba(212,67,58,0.18)", borderRadius: "3px", fontSize: 10, color: T.gold, letterSpacing: "0.5px" }}>{res}</span>
                        ))}
                      </div>
                    )}

                    {/* Territories & relationships */}
                    {!isCompact && controlledRegions.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 11, color: T.textFaint }}>
                        Territories: {controlledRegions.map(r => r.name).join(", ")}
                      </div>
                    )}
                    {(f.allies?.length > 0 || f.rivals?.length > 0) && (
                      <div style={{ marginTop: 6, display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {f.allies?.length > 0 && <div style={{ fontSize: 11, color: T.allyGreen }}>Allies: {f.allies.join(", ")}</div>}
                        {f.rivals?.length > 0 && <div style={{ fontSize: 11, color: T.crimson }}>Rivals: {f.rivals.join(", ")}</div>}
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  {/* Stats banner */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      { label: "Major Powers", val: majorFactions.length, color: T.gold },
                      { label: "Organizations", val: subFactions.length, color: "#6a0dad" },
                      { label: "Total Factions", val: allFactions.length, color: T.crimson },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: "12px 20px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px", borderTop: `2px solid ${s.color}`, flex: 1, minWidth: 120 }}>
                        <div style={{ fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 24, color: T.text, fontWeight: 300 }}>{s.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Grouped by region */}
                  {regionGroups.map(({ region, ruler, subs }) => (
                    <div key={region.id} style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${T.border}` }}>
                      {/* Region header */}
                      <div style={{
                        padding: "12px 18px",
                        background: `linear-gradient(135deg, ${(ruler?.color || T.gold)}12 0%, transparent 60%)`,
                        borderBottom: `1px solid ${T.border}`,
                        display: "flex", alignItems: "center", gap: 10,
                      }}>
                        <MapPin size={14} color={ruler?.color || T.textFaint}/>
                        <span style={{ fontSize: 14, fontFamily: "'Cinzel', serif", color: T.text, letterSpacing: "0.5px" }}>{region.name}</span>
                        <span style={{ fontSize: 9, color: T.textFaint }}>{region.type}</span>
                        <span style={{ fontSize: 9, color: T.textFaint, marginLeft: "auto" }}>
                          {1 + subs.length} {1 + subs.length === 1 ? "faction" : "factions"}
                        </span>
                      </div>

                      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Ruling faction (full card) */}
                        {ruler && (
                          <div>
                            <div style={{ fontSize: 9, fontFamily: T.ui, letterSpacing: "1.5px", color: T.textFaint, textTransform: "uppercase", marginBottom: 8 }}>Ruling Power</div>
                            {renderFactionCard(ruler, false)}
                          </div>
                        )}

                        {/* Sub-factions (compact cards) */}
                        {subs.length > 0 && (
                          <div>
                            <div style={{ fontSize: 9, fontFamily: T.ui, letterSpacing: "1.5px", color: T.textFaint, textTransform: "uppercase", marginBottom: 8 }}>
                              Organizations & Influence ({subs.length})
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {subs.sort((a, b) => (b.power || 0) - (a.power || 0)).map(sf => renderFactionCard(sf, true))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Unaffiliated factions */}
                  {unaffiliated.length > 0 && (
                    <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${T.border}` }}>
                      <div style={{
                        padding: "12px 18px",
                        background: "rgba(255,255,255,0.02)",
                        borderBottom: `1px solid ${T.border}`,
                        display: "flex", alignItems: "center", gap: 10,
                      }}>
                        <Globe size={14} color={T.textFaint}/>
                        <span style={{ fontSize: 14, fontFamily: "'Cinzel', serif", color: T.text, letterSpacing: "0.5px" }}>Unaffiliated Powers</span>
                      </div>
                      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                        {unaffiliated.map(f => renderFactionCard(f, false))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {tab==="npcs" && (() => {
              /* ── rank ordering for sort ── */
              const RANK_ORDER = { ruler:0, heir:1, general:2, advisor:3, religious:4, noble:5, military:6, scholar:7, merchant:8, criminal:9, commoner:10 };
              const rankOf = (n) => {
                if (n.isLeader) {
                  const roleLc = (n.role || "").toLowerCase();
                  if (Object.keys(NPC_ROLES.ruler).length && NPC_ROLES.ruler.some(r => roleLc.includes(r.toLowerCase()))) return 0;
                  if (NPC_ROLES.heir.some(r => roleLc.includes(r.toLowerCase()))) return 1;
                  if (NPC_ROLES.general.some(r => roleLc.includes(r.toLowerCase()))) return 2;
                  if (NPC_ROLES.advisor.some(r => roleLc.includes(r.toLowerCase()))) return 3;
                  return 1;
                }
                const roleLc = (n.role || "").toLowerCase();
                for (const [cat, titles] of Object.entries(NPC_ROLES)) {
                  if (titles.some(t => roleLc.includes(t.toLowerCase()))) return RANK_ORDER[cat] ?? 10;
                }
                return 10;
              };
              const rankLabel = (rank) => ["Ruler","Heir","General","Advisor","Religious","Noble","Military","Scholar","Merchant","Criminal","Commoner"][rank] || "Other";

              /* ── group NPCs by faction ── */
              const groups = {};
              const unaffiliated = [];
              (data.npcs || []).forEach(n => {
                if (n.faction) {
                  if (!groups[n.faction]) groups[n.faction] = [];
                  groups[n.faction].push(n);
                } else {
                  unaffiliated.push(n);
                }
              });
              /* sort each group by rank then level */
              const sortGroup = arr => [...arr].sort((a, b) => {
                const ra = rankOf(a), rb = rankOf(b);
                if (ra !== rb) return ra - rb;
                return (b.level || 0) - (a.level || 0);
              });

              /* order factions by the order they appear in data.factions */
              const factionOrder = (data.factions || []).map(f => f.name);
              const orderedKeys = factionOrder.filter(k => groups[k]);
              /* add any faction names in NPCs not in factions list */
              Object.keys(groups).forEach(k => { if (!orderedKeys.includes(k)) orderedKeys.push(k); });

              const factionColor = (fname) => {
                const f = (data.factions || []).find(f => f.name === fname);
                return f?.color || T.gold;
              };

              /* ── role → icon + color mapping ── */
              const RANK_ICON_MAP = {
                ruler:    { Icon: Crown,    color: T.gold },
                heir:     { Icon: Crown,    color: "#a08944" },
                general:  { Icon: Swords,   color: "#dc143c" },
                advisor:  { Icon: Eye,      color: "#58aaff" },
                religious:{ Icon: Star,     color: "#e8940a" },
                noble:    { Icon: Shield,   color: "#b574ff" },
                military: { Icon: Swords,   color: "#8b97a8" },
                scholar:  { Icon: BookOpen,  color: "#5ee09a" },
                merchant: { Icon: Package,  color: "#ffd54f" },
                criminal: { Icon: Skull,    color: "#f06858" },
                commoner: { Icon: Users,    color: T.textFaint },
              };
              const rankKeyOf = (n) => {
                const roleLc = (n.role || "").toLowerCase();
                for (const [cat, titles] of Object.entries(NPC_ROLES)) {
                  if (titles.some(t => roleLc.includes(t.toLowerCase()))) return cat;
                }
                return "commoner";
              };

              const renderNpcCard = (n) => {
                const active = sel?.id === n.id && selType === "npc";
                const rk = rankKeyOf(n);
                const iconInfo = RANK_ICON_MAP[rk] || RANK_ICON_MAP.commoner;
                const RoleIcon = !n.alive ? Skull : iconInfo.Icon;
                const roleIconColor = !n.alive ? T.crimson : iconInfo.color;
                return (
                  <div key={n.id} onClick={() => { setSel(n); setSelType("npc"); setEditing(false); }} style={{
                    background: active ? T.bgHover : T.bgCard, padding: "14px 16px", cursor: "pointer", opacity: n.alive ? 1 : 0.45,
                    border: `1px solid ${active ? T.crimsonBorder : T.border}`, borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "start", gap: 10 }}>
                      <RoleIcon size={14} color={roleIconColor} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 15, fontWeight: 300, color: T.text }}>{n.name}</span>
                          {n.level && <span style={{ fontSize: 10, color: T.textFaint, fontFamily: T.ui }}>Lv{n.level}</span>}
                          {n.isLeader && <span style={{ fontSize: 9, color: T.gold, border: "1px solid rgba(212,67,58,0.3)", padding: "1px 5px", borderRadius: "2px", letterSpacing: "0.5px" }}>LEADER</span>}
                        </div>
                        <div style={{ fontSize: 12, color: T.textFaint, marginBottom: 6, fontStyle: "italic", fontWeight: 300 }}>{n.role}{n.loc ? ` — ${n.loc}` : ""}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                          <Tag variant={n.attitude === "allied" || n.attitude === "friendly" ? "success" : n.attitude === "hostile" ? "danger" : n.attitude === "cautious" ? "warning" : "muted"}>{n.attitude}</Tag>
                          {!n.alive && <Tag variant="danger">deceased</Tag>}
                        </div>
                        {n.traits && n.traits.length > 0 && (
                          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
                            {n.traits.map((t, ti) => (
                              <span key={ti} style={{ fontSize: 10, color: T.textDim, fontStyle: "italic" }}>{t}{ti < n.traits.length - 1 ? "," : ""}</span>
                            ))}
                          </div>
                        )}
                        {isDM && n.secret && (
                          <div style={{ fontSize: 10, color: T.gold, marginTop: 6, fontStyle: "italic", opacity: 0.8 }}>
                            Secret: {n.secret}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {orderedKeys.map(fname => {
                    const sorted = sortGroup(groups[fname]);
                    const fc = factionColor(fname);
                    const faction = (data.factions || []).find(f => f.name === fname);
                    const govType = faction?.govType || "";
                    /* sub-group by rank tier */
                    const tiers = {};
                    sorted.forEach(n => {
                      const r = rankOf(n);
                      const label = rankLabel(r);
                      if (!tiers[label]) tiers[label] = [];
                      tiers[label].push(n);
                    });
                    return (
                      <div key={fname} style={{ marginBottom: 28 }}>
                        {/* ── faction header ── */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "12px 16px",
                          background: `linear-gradient(90deg, ${fc}18 0%, transparent 100%)`,
                          borderLeft: `3px solid ${fc}`, borderRadius: "2px",
                        }}>
                          <Shield size={18} color={fc} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontWeight: 400, color: T.text, letterSpacing: "0.5px" }}>{fname}</div>
                            {govType && <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 2 }}>{govType}</div>}
                          </div>
                          <span style={{ fontSize: 11, color: T.textFaint, fontFamily: T.ui }}>{sorted.length} {sorted.length === 1 ? "member" : "members"}</span>
                        </div>
                        {/* ── rank tiers ── */}
                        {Object.entries(tiers).map(([tierLabel, members]) => (
                          <div key={tierLabel} style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 9, color: fc, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6, paddingLeft: 4, opacity: 0.8 }}>{tierLabel}{members.length > 1 ? "s" : ""}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingLeft: 4 }}>
                              {members.map(n => renderNpcCard(n))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {/* ── unaffiliated NPCs ── */}
                  {unaffiliated.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "12px 16px",
                        background: `linear-gradient(90deg, ${T.textFaint}18 0%, transparent 100%)`,
                        borderLeft: `3px solid ${T.textFaint}`, borderRadius: "2px",
                      }}>
                        <Users size={18} color={T.textFaint} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 400, color: T.text, letterSpacing: "0.5px" }}>Unaffiliated</div>
                          <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 2 }}>Independent</div>
                        </div>
                        <span style={{ fontSize: 11, color: T.textFaint, fontFamily: T.ui }}>{unaffiliated.length} {unaffiliated.length === 1 ? "member" : "members"}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingLeft: 4 }}>
                        {sortGroup(unaffiliated).map(n => renderNpcCard(n))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Cities tab removed — cities are now in the Regions tab */}
            {false && (() => {
              const cities = data.cities || [];
              const selectedCity = sel && selType === "city" ? sel : null;

              // Group cities by region
              const regionGroups = {};
              cities.forEach(c => {
                if (!regionGroups[c.region]) regionGroups[c.region] = [];
                regionGroups[c.region].push(c);
              });
              // Sort: capitals first, then by population
              Object.values(regionGroups).forEach(arr => arr.sort((a, b) => (b.isCapital ? 1 : 0) - (a.isCapital ? 1 : 0) || (b.popNum || 0) - (a.popNum || 0)));

              const updateCity = (cityId, updates) => {
                setData(d => ({
                  ...d,
                  cities: (d.cities || []).map(c => c.id === cityId ? { ...c, ...updates } : c),
                }));
                if (selectedCity && selectedCity.id === cityId) setSel(prev => ({ ...prev, ...updates }));
              };

              if (selectedCity) {
                // ── CITY DETAIL VIEW ──
                const c = cities.find(ct => ct.id === selectedCity.id) || selectedCity;
                const fc = (() => { const f = (data.factions || []).find(f => f.name === c.faction); return f?.color || T.gold; })();
                const cityNpcs = (data.npcs || []).filter(n => (c.npcs || []).includes(n.id));
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 900 }}>
                    {/* Back button row */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      <button onClick={() => { setSel(null); setSelType(null); }} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                        background: "transparent", border: `1px solid ${T.border}`, borderRadius: "3px", color: T.textMuted,
                        fontFamily: T.ui, fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                      }}><ArrowLeft size={12} /> All Cities</button>
                      <button onClick={() => { setTab("map"); }} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                        background: "transparent", border: `1px solid ${T.border}`, borderRadius: "3px", color: T.textMuted,
                        fontFamily: T.ui, fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                      }}>◎ View on Map</button>
                      {townImagesReady && window.TOWN_IMAGES && window.TOWN_IMAGES[c.name] && (
                        <button onClick={() => { setTownView(c.name); setTownSelBldg(null); setTownHovBldg(null); setTownZoom(0); setTownPan({x:0,y:0}); }} style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                          background: "linear-gradient(135deg, rgba(212,67,58,0.15), transparent)", border: `1px solid rgba(212,67,58,0.4)`, borderRadius: "3px", color: T.gold,
                          fontFamily: T.ui, fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                        }}>⬡ Explore Town</button>
                      )}
                    </div>

                    {/* City header */}
                    <div style={{
                      padding: "24px 28px", marginBottom: 20,
                      background: `linear-gradient(135deg, ${fc}12 0%, transparent 60%)`,
                      borderLeft: `4px solid ${fc}`, borderRadius: "4px", border: `1px solid ${T.border}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 22, fontWeight: 400, color: T.text, fontFamily: "'Cinzel', serif", letterSpacing: "0.5px" }}>{c.name}</span>
                        <span style={{ fontSize: 9, color: c.isCapital ? T.gold : T.textMuted, border: `1px solid ${c.isCapital ? "rgba(212,67,58,0.3)" : "rgba(154,144,128,0.3)"}`, padding: "2px 8px", borderRadius: "2px", letterSpacing: "1px" }}>{(() => { const m = window.TOWN_METADATA?.[c.name]; return m ? (m.isCapital ? "CAPITAL" : m.population >= 4000 ? "CITY" : m.population >= 1500 ? "TOWN" : "VILLAGE") : (c.isCapital ? "CAPITAL" : "SETTLEMENT"); })()}</span>
                      </div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{c.region} · {c.faction} · Pop. {c.population}</div>
                      <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>{c.description}</div>
                      {c.features && c.features.length > 0 && (
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 12 }}>
                          {c.features.map((f, fi) => <span key={fi} style={{ fontSize: 10, color: T.gold, border: "1px solid rgba(212,67,58,0.2)", padding: "3px 9px", borderRadius: "2px" }}>{f}</span>)}
                        </div>
                      )}
                    </div>

                    {/* ── Tavern / Inn ── */}
                    <div style={{ padding: "20px 24px", marginBottom: 16, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
                      <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Tavern & Inn</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 400, color: T.text, fontFamily: "'Spectral', serif" }}>{c.tavern.name}</span>
                        <span style={{ fontSize: 11, color: T.textFaint }}>— Innkeeper: {c.tavern.innkeeper} ({c.tavern.innkeeperPersonality})</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                        {c.tavern.services.map((s, si) => (
                          <div key={si} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(0,0,0,0.12)", borderRadius: "3px", fontSize: 11 }}>
                            <span style={{ color: T.textMuted }}>{s.name}</span>
                            <span style={{ color: T.gold, fontFamily: T.ui }}>{s.price}</span>
                          </div>
                        ))}
                      </div>
                      {c.tavern.rumor && (
                        <div style={{ fontSize: 11, color: T.questGold, fontStyle: "italic", padding: "8px 12px", background: "rgba(212,67,58,0.06)", border: "1px solid rgba(212,67,58,0.15)", borderRadius: "3px" }}>
                          Rumor: "{c.tavern.rumor}"
                        </div>
                      )}
                    </div>

                    {/* ── Shops ── */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 }}>Shops & Merchants ({c.shops.length})</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {c.shops.map(shop => (
                          <div key={shop.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 400, color: T.text }}>{shop.name}</div>
                                <div style={{ fontSize: 11, color: T.textFaint, marginTop: 2 }}>{shop.type} — Owner: {shop.owner} ({shop.ownerPersonality})</div>
                              </div>
                              <span style={{ fontSize: 10, color: T.textFaint, fontFamily: T.ui }}>{shop.items.length} items</span>
                            </div>
                            <div style={{ padding: "0" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                <thead>
                                  <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                                    <th style={{ padding: "8px 16px", textAlign: "left", color: T.textFaint, fontWeight: 400, fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" }}>Item</th>
                                    <th style={{ padding: "8px 12px", textAlign: "center", color: T.textFaint, fontWeight: 400, fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" }}>Rarity</th>
                                    <th style={{ padding: "8px 12px", textAlign: "right", color: T.textFaint, fontWeight: 400, fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" }}>Price</th>
                                    <th style={{ padding: "8px 12px", textAlign: "center", color: T.textFaint, fontWeight: 400, fontSize: 10, letterSpacing: "1px", textTransform: "uppercase" }}>Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {shop.items.map((item, ii) => (
                                    <tr key={ii} style={{ borderTop: `1px solid ${T.border}`, opacity: item.inStock ? 1 : 0.4 }}>
                                      <td style={{ padding: "8px 16px", color: T.text }}>{item.name}</td>
                                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                        <span style={{ fontSize: 10, color: item.rarity === "rare" ? T.gold : item.rarity === "uncommon" ? T.green : T.textFaint, fontStyle: "italic" }}>{item.rarity}</span>
                                      </td>
                                      <td style={{ padding: "8px 12px", textAlign: "right", color: T.gold, fontFamily: T.ui }}>{item.price}</td>
                                      <td style={{ padding: "8px 12px", textAlign: "center", color: item.inStock ? T.textMuted : T.crimson, fontSize: 11 }}>{item.inStock ? `×${item.qty}` : "Out"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Notable NPCs ── */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 }}>Notable Residents ({cityNpcs.length})</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {cityNpcs.map(n => (
                          <div key={n.id} onClick={() => { setSel(n); setSelType("npc"); setTab("npcs"); }} style={{
                            padding: "12px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px", cursor: "pointer",
                          }}>
                            <div style={{ fontSize: 13, fontWeight: 300, color: T.text, marginBottom: 4 }}>{n.name}</div>
                            <div style={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>{n.role}</div>
                            {n.traits && n.traits.length > 0 && (
                              <div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>{n.traits.join(", ")}</div>
                            )}
                          </div>
                        ))}
                        {/* Shop owners as NPCs too */}
                        {c.shops.map(shop => (
                          <div key={`owner-${shop.id}`} style={{ padding: "12px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
                            <div style={{ fontSize: 13, fontWeight: 300, color: T.text, marginBottom: 4 }}>{shop.owner}</div>
                            <div style={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>{shop.type} Owner</div>
                            <div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>{shop.ownerPersonality}</div>
                          </div>
                        ))}
                        <div style={{ padding: "12px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px" }}>
                          <div style={{ fontSize: 13, fontWeight: 300, color: T.text, marginBottom: 4 }}>{c.tavern.innkeeper}</div>
                          <div style={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>Innkeeper, {c.tavern.name}</div>
                          <div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>{c.tavern.innkeeperPersonality}</div>
                        </div>
                      </div>
                    </div>

                    {/* ── Quest Hooks ── */}
                    {c.questHooks && c.questHooks.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 }}>Quest Hooks</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {c.questHooks.map((q, qi) => (
                            <div key={qi} style={{
                              padding: "12px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px",
                              borderLeft: `3px solid T.gold`, display: "flex", alignItems: "center", gap: 12,
                            }}>
                              <Scroll size={14} color={T.gold} style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, fontStyle: "italic" }}>{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // ── CITY LIST VIEW (grouped by kingdom/region) ──
              // Sort region groups: focused region first, then alphabetical
              const sortedRegionEntries = Object.entries(regionGroups).sort(([a],[b]) => {
                if (a === cityRegionFocus) return -1;
                if (b === cityRegionFocus) return 1;
                return a.localeCompare(b);
              });

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {cities.length === 0 && (
                    <div style={{ padding: 40, textAlign: "center", color: T.textFaint, fontStyle: "italic" }}>
                      No cities generated yet. Select an atlas seed on the Map tab to generate world data.
                    </div>
                  )}
                  {sortedRegionEntries.map(([regionName, regionCities]) => {
                    const region = (data.regions || []).find(r => r.name === regionName);
                    const fc = (() => { const f = (data.factions || []).find(f => f.name === region?.ctrl); return f?.color || T.gold; })();
                    const isFocused = cityRegionFocus === regionName;
                    const capital = regionCities.find(c => c.isCapital);
                    // Faction object for extra info
                    const factionObj = (data.factions || []).find(f => f.name === region?.ctrl);
                    return (
                      <div key={regionName} id={`region-${regionName.replace(/\s+/g,'-')}`} style={{
                        marginBottom: 28,
                        borderRadius: "6px",
                        border: isFocused ? `1px solid ${fc}55` : "1px solid transparent",
                        boxShadow: isFocused ? `0 0 0 2px ${fc}22, 0 4px 24px rgba(0,0,0,0.18)` : "none",
                        transition: "all 0.3s",
                        overflow: "hidden",
                      }}>
                        {/* ── Kingdom header card ── */}
                        <div style={{
                          padding: "16px 20px",
                          background: `linear-gradient(135deg, ${fc}18 0%, ${fc}08 50%, transparent 100%)`,
                          borderLeft: `4px solid ${fc}`,
                          borderBottom: `1px solid ${fc}22`,
                        }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                            <div style={{ flex: 1 }}>
                              {/* Kingdom name + type badge */}
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                <span style={{ fontSize: 18, fontWeight: 400, color: T.text, fontFamily: "'Cinzel', serif", letterSpacing: "0.5px" }}>{regionName}</span>
                                {region && <span style={{ fontSize: 9, color: fc, border: `1px solid ${fc}44`, padding: "2px 8px", borderRadius: "2px", letterSpacing: "1.2px", textTransform: "uppercase" }}>{region.type || "Region"}</span>}
                                {isFocused && <span style={{ fontSize: 9, color: T.textFaint, fontStyle: "italic" }}>← selected from map</span>}
                              </div>
                              {/* Faction + terrain + threat */}
                              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 11, color: T.textMuted, marginBottom: 6 }}>
                                {region?.ctrl && <span style={{ color: fc }}>⚑ {region.ctrl}</span>}
                                {region?.terrain && <span>◈ {region.terrain}</span>}
                                {region?.threat && <span>⚔ Threat: {region.threat}</span>}
                                {capital && <span>★ Capital: {capital.name}</span>}
                              </div>
                              {/* Governor */}
                              {region?.governor && (
                                <div style={{ fontSize: 11, color: T.textDim, fontStyle: "italic", marginBottom: 4 }}>
                                  {region.governorTitle || "Governor"}: {region.governor}
                                </div>
                              )}
                              {/* Faction description snippet */}
                              {factionObj?.description && (
                                <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.5, marginTop: 6, maxWidth: 600 }}>
                                  {factionObj.description.slice(0, 140)}{factionObj.description.length > 140 ? "…" : ""}
                                </div>
                              )}
                            </div>
                            {/* Right side: stats + locate button */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                              <div style={{ fontSize: 11, color: T.textFaint, fontFamily: T.ui }}>
                                {regionCities.length} {regionCities.length === 1 ? "settlement" : "settlements"}
                              </div>
                              {region?.population && (
                                <div style={{ fontSize: 10, color: T.textFaint }}>Pop. {region.population}</div>
                              )}
                              {/* Locate on Map button */}
                              <button onClick={() => { setTab("map"); setCityRegionFocus(regionName); }} style={{
                                padding: "5px 12px", background: `${fc}18`, border: `1px solid ${fc}44`, borderRadius: "3px",
                                color: fc, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "1px",
                                textTransform: "uppercase", cursor: "pointer",
                              }}>
                                ◎ Locate on Map
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ── City cards grid ── */}
                        <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.04)" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {regionCities.map(c => {
                              const cityFc = (() => { const f = (data.factions || []).find(f => f.name === c.faction); return f?.color || T.gold; })();
                              return (
                                <div key={c.id} onClick={() => { setSel(c); setSelType("city"); setCityRegionFocus(c.region); }} style={{
                                  padding: "14px 18px", background: T.bgCard,
                                  border: c.isCapital ? `1px solid ${cityFc}55` : `1px solid ${T.border}`,
                                  borderLeft: c.isCapital ? `3px solid ${cityFc}` : `2px solid ${T.border}22`,
                                  borderRadius: "4px", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 2px 12px rgba(0,0,0,0.2)`}
                                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                    {c.isCapital
                                      ? <span style={{ fontSize: 16, color: cityFc }}>★</span>
                                      : <span style={{ fontSize: 14, color: T.textFaint }}>◆</span>}
                                    <span style={{ fontSize: 14, fontWeight: c.isCapital ? 500 : 300, color: T.text }}>{c.name}</span>
                                    <span style={{ fontSize: 8, color: c.isCapital ? cityFc : T.textMuted, border: `1px solid ${c.isCapital ? cityFc + "44" : "rgba(154,144,128,0.3)"}`, padding: "1px 5px", borderRadius: "2px", letterSpacing: "0.5px" }}>{(() => { const m = window.TOWN_METADATA?.[c.name]; return m ? (m.isCapital ? "CAPITAL" : m.population >= 4000 ? "CITY" : m.population >= 1500 ? "TOWN" : "VILLAGE") : (c.isCapital ? "CAPITAL" : "SETTLEMENT"); })()}</span>
                                  </div>
                                  <div style={{ fontSize: 10, color: T.textFaint, marginBottom: 7 }}>Pop. {c.population}</div>
                                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 7 }}>
                                    {(c.features || []).slice(0, 2).map((f, fi) => (
                                      <span key={fi} style={{ fontSize: 9, color: T.textDim, background: "rgba(0,0,0,0.15)", padding: "2px 6px", borderRadius: "2px" }}>{f}</span>
                                    ))}
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 10, color: T.textFaint }}>
                                    <span>{c.shops.length} shops</span>
                                    <span>1 tavern</span>
                                    <span>{(c.npcs || []).length} NPCs</span>
                                    <span>{(c.questHooks || []).length} quests</span>
                                    {townImagesReady && window.TOWN_IMAGES && window.TOWN_IMAGES[c.name] && (
                                      <span onClick={(e) => { e.stopPropagation(); setTownView(c.name); setTownSelBldg(null); setTownHovBldg(null); setTownZoom(0); setTownPan({x:0,y:0}); }} style={{ marginLeft: "auto", color: T.gold, cursor: "pointer", letterSpacing: "0.5px", fontWeight: 500 }}>⬡ Map</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ── POINTS OF INTEREST TAB ── */}
            {tab==="pois" && (() => {
              const pois = data.pois || [];
              const dangerColors = { 0:"#4ade80", 1:"#86efac", 2:"#fcd34d", 3:"#fb923c", 4:"#f87171", 5:"#dc2626" };
              const dangerLabels = { 0:"Safe", 1:"Low", 2:"Moderate", 3:"Dangerous", 4:"Deadly", 5:"Catastrophic" };
              // poiFilter and poiSearch are declared at component top level
              const uniqueTypes = [...new Set(pois.map(p => p.type))].sort();
              const filtered = pois.filter(p => {
                if (poiFilter !== "all" && p.type !== poiFilter) return false;
                if (poiSearch && !p.name.toLowerCase().includes(poiSearch.toLowerCase()) && !(p.description||"").toLowerCase().includes(poiSearch.toLowerCase())) return false;
                return true;
              });

              // Group filtered POIs by region
              const regionGroups = {};
              const noRegion = [];
              filtered.forEach(p => {
                if (p.region) {
                  if (!regionGroups[p.region]) regionGroups[p.region] = [];
                  regionGroups[p.region].push(p);
                } else {
                  noRegion.push(p);
                }
              });
              // Sort region names alphabetically, put major POIs first within each region
              const regionNames = Object.keys(regionGroups).sort();

              return (
                <div>
                  <div style={{ marginBottom:24 }}>
                    <h2 style={{ fontFamily:T.heading, fontSize:24, color:T.text, marginBottom:4, letterSpacing:"0.5px" }}>Points of Interest</h2>
                    <div style={{ fontSize:12, color:T.textMuted }}>{pois.length} locations discovered across the realm</div>
                  </div>

                  {/* Filters */}
                  <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
                    <input value={poiSearch} onChange={e => setPoiSearch(e.target.value)} placeholder="Search locations..." style={{ flex:"1 1 200px", padding:"8px 12px", background:T.bgInput, border:"1px solid " + T.border, borderRadius:"4px", color:T.text, fontFamily:T.body, fontSize:12, outline:"none" }} />
                    <select value={poiFilter} onChange={e => setPoiFilter(e.target.value)} style={{ padding:"8px 12px", background:T.bgInput, border:"1px solid " + T.border, borderRadius:"4px", color:T.text, fontFamily:T.body, fontSize:12, outline:"none", cursor:"pointer" }}>
                      <option value="all">All Types</option>
                      {uniqueTypes.map(t => <option key={t} value={t}>{t.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
                    </select>
                  </div>

                  {/* Summary stats */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:12, marginBottom:24 }}>
                    <div style={{ padding:"12px 16px", background:T.bgCard, border:"1px solid " + T.border, borderRadius:"4px", textAlign:"center" }}>
                      <div style={{ fontSize:20, color:T.crimson, fontWeight:600, fontFamily:T.ui }}>{pois.length}</div>
                      <div style={{ fontSize:9, color:T.textMuted, letterSpacing:"1px", textTransform:"uppercase" }}>Total</div>
                    </div>
                    <div style={{ padding:"12px 16px", background:T.bgCard, border:"1px solid " + T.border, borderRadius:"4px", textAlign:"center" }}>
                      <div style={{ fontSize:20, color:T.gold, fontWeight:600, fontFamily:T.ui }}>{regionNames.length}</div>
                      <div style={{ fontSize:9, color:T.textMuted, letterSpacing:"1px", textTransform:"uppercase" }}>Regions</div>
                    </div>
                    <div style={{ padding:"12px 16px", background:T.bgCard, border:"1px solid " + T.border, borderRadius:"4px", textAlign:"center" }}>
                      <div style={{ fontSize:20, color:T.crimson, fontWeight:600, fontFamily:T.ui }}>{pois.filter(p=>p.danger>=3).length}</div>
                      <div style={{ fontSize:9, color:T.textMuted, letterSpacing:"1px", textTransform:"uppercase" }}>Dangerous</div>
                    </div>
                  </div>

                  {/* POIs grouped by region */}
                  {regionNames.map(regionName => {
                    const regionPois = regionGroups[regionName].sort((a,b) => (b.major?1:0) - (a.major?1:0) || (b.danger||0) - (a.danger||0));
                    return (
                      <div key={regionName} style={{ marginBottom:28 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:6, borderBottom:"1px solid rgba(212,67,58,0.2)" }}>
                          <span style={{ fontSize:11, color:T.gold, letterSpacing:"2px", textTransform:"uppercase", fontFamily:T.ui }}>{regionName}</span>
                          <span style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui }}>({regionPois.length})</span>
                        </div>
                        <div style={{ display:"grid", gap:8 }}>
                          {regionPois.map(poi => (
                            <div key={poi.id} onClick={() => { setSel(poi); setSelType("poi"); }} style={{ padding: poi.major ? "16px 20px" : "12px 16px", background:T.bgCard, border:"1px solid " + T.border, borderRadius:"4px", cursor:"pointer", transition:"all 0.2s", borderLeft: poi.major ? "3px solid " + T.gold : "3px solid transparent" }}
                              onMouseEnter={e => { e.currentTarget.style.background="var(--bg-hover)"; e.currentTarget.style.borderColor=T.gold; }}
                              onMouseLeave={e => { e.currentTarget.style.background=T.bgCard; e.currentTarget.style.borderColor=T.border; }}
                            >
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: poi.major ? 8 : 4 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ fontSize: poi.major ? 18 : 14 }}>{poi.icon || "📍"}</span>
                                  <span style={{ fontSize: poi.major ? 14 : 13, color:T.text, fontWeight: poi.major ? 400 : 300 }}>{poi.name}</span>
                                  {poi.major && <span style={{ fontSize:8, color:T.gold, letterSpacing:"1px", textTransform:"uppercase", fontFamily:T.ui }}>★ Major</span>}
                                </div>
                                <span style={{ fontSize: poi.major ? 10 : 9, color:dangerColors[poi.danger]||"#aaa", fontFamily:T.ui, letterSpacing:"1px" }}>{dangerLabels[poi.danger]||"Unknown"}</span>
                              </div>
                              <div style={{ fontSize:11, color:T.textMuted, lineHeight:1.5, marginBottom:6 }}>{(poi.description||"").slice(0, poi.major ? 120 : 100)}{(poi.description||"").length>(poi.major?120:100)?"...":""}</div>
                              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                                <span style={{ fontSize:9, color:T.textFaint, letterSpacing:"0.5px" }}>{poi.type ? poi.type.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()) : "Unknown"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* POIs with no region */}
                  {noRegion.length > 0 && (
                    <div style={{ marginBottom:28 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:6, borderBottom:"1px solid " + T.border }}>
                        <span style={{ fontSize:11, color:T.textMuted, letterSpacing:"2px", textTransform:"uppercase", fontFamily:T.ui }}>Uncharted</span>
                        <span style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui }}>({noRegion.length})</span>
                      </div>
                      <div style={{ display:"grid", gap:8 }}>
                        {noRegion.map(poi => (
                          <div key={poi.id} onClick={() => { setSel(poi); setSelType("poi"); }} style={{ padding:"12px 16px", background:T.bgCard, border:"1px solid " + T.border, borderRadius:"4px", cursor:"pointer", transition:"all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background="var(--bg-hover)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background=T.bgCard; }}
                          >
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ fontSize:14 }}>{poi.icon || "📍"}</span>
                                <span style={{ fontSize:13, color:T.text }}>{poi.name}</span>
                              </div>
                              <span style={{ fontSize:9, color:dangerColors[poi.danger]||"#aaa", fontFamily:T.ui }}>{dangerLabels[poi.danger]||"?"}</span>
                            </div>
                            <div style={{ fontSize:11, color:T.textMuted, lineHeight:1.4 }}>{(poi.description||"").slice(0,100)}{(poi.description||"").length>100?"...":""}</div>
                            <div style={{ display:"flex", gap:12, marginTop:4, flexWrap:"wrap" }}>
                              <span style={{ fontSize:9, color:T.textFaint }}>{poi.type ? poi.type.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase()) : "Unknown"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filtered.length === 0 && (
                    <div style={{ textAlign:"center", padding:"60px 20px", color:T.textFaint }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>🗺</div>
                      <div style={{ fontSize:14, marginBottom:4 }}>No points of interest found</div>
                      <div style={{ fontSize:11 }}>{poiSearch || poiFilter !== "all" ? "Try adjusting your filters" : "Generate a world map to populate locations"}</div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Party tab moved to Relations view */}
          </div>
        )}

        {/* ══════════ DETAIL PANEL (right side) ══════════ */}
        <div style={{
          width: (sel && tab !== "calendar" && tab !== "exploration") ? ((tab==="map" && isMapCompact) ? "100%" : 360) : 0,
          overflowY:"auto",
          overflowX:"hidden",
          transition:"width 0.25s ease, max-height 0.25s ease, transform 0.25s ease",
          flexShrink:0,
          borderLeft:(sel && !(tab==="map" && isMapCompact))?`1px solid ${T.border}`:"none",
          position:(sel && tab==="map" && isMapCompact) ? "absolute" : "relative",
          right:0,
          bottom:0,
          left:(sel && tab==="map" && isMapCompact) ? 0 : "auto",
          zIndex:(sel && tab==="map" && isMapCompact) ? 20 : 1,
          maxHeight:(sel && tab==="map" && isMapCompact) ? "58%" : "none",
          background:(sel && tab==="map" && isMapCompact) ? "rgba(7,8,12,0.96)" : "transparent",
          borderTop:(sel && tab==="map" && isMapCompact) ? `1px solid ${T.crimsonBorder}` : "none",
          boxShadow:(sel && tab==="map" && isMapCompact) ? "0 -24px 60px rgba(0,0,0,0.45)" : "none",
          borderRadius:(sel && tab==="map" && isMapCompact) ? "18px 18px 0 0" : 0,
          backdropFilter:(sel && tab==="map" && isMapCompact) ? "blur(14px)" : "none",
        }}>
          {sel && tab !== "calendar" && tab !== "exploration" && (
            <div style={{ padding: tab==="map" && isMapCompact ? 18 : 24, width: (tab==="map" && isMapCompact) ? "100%" : 360, boxSizing:"border-box" }}>
              <Section>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {selType==="region" && (() => { const FI = getFantasyIcon(sel.type); return <FI size={28} color={T.crimson} />; })()}
                    {selType==="poi" && <span style={{ fontSize:24 }}>{sel.icon || "📍"}</span>}
                    <div style={{ fontSize:18, color:T.text, fontWeight:300 }}>{sel.name}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>setEditing(!editing)} style={{ background:"none", border:"none", cursor:"pointer", color:editing?T.crimson:T.textFaint }}><Edit3 size={14}/></button>
                    <button onClick={()=>setSel(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint }}><X size={14}/></button>
                  </div>
                </div>

                {editing ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                    {selType==="faction" && <>
                      <Input value={sel.name} onChange={v=>{updateFaction(sel.id,{name:v});setSel(p=>({...p,name:v}));}} placeholder="Faction Name" />
                      <Textarea value={sel.desc || ""} onChange={v=>{updateFaction(sel.id,{desc:v});setSel(p=>({...p,desc:v}));}} placeholder="Description" rows={3} />
                      <Select value={sel.attitude} onChange={v=>{updateFaction(sel.id,{attitude:v});setSel(p=>({...p,attitude:v}));}} style={{ width:"100%" }}>
                        {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
                      </Select>
                      <div>
                        <span style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1px" }}>POWER: {sel.power}</span>
                        <input type="range" min="0" max="100" value={sel.power} onChange={e=>{const v=parseInt(e.target.value);updateFaction(sel.id,{power:v});setSel(p=>({...p,power:v}));}} style={{ width:"100%" }} />
                      </div>
                      <Select value={sel.trend} onChange={v=>{updateFaction(sel.id,{trend:v});setSel(p=>({...p,trend:v}));}} style={{ width:"100%" }}>
                        {["rising","stable","declining"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Select value={sel.govType || ""} onChange={v=>{updateFaction(sel.id,{govType:v});setSel(p=>({...p,govType:v}));}} style={{ width:"100%" }}>
                        {["monarchy","empire","republic","council","druidic","guild","cult","theocracy","tribal","military junta","oligarchy"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Input value={sel.color || "#a4b5cc"} onChange={v=>{updateFaction(sel.id,{color:v});setSel(p=>({...p,color:v}));}} placeholder="Color (#hex)" />
                      {sel.hierarchy && sel.hierarchy.length > 0 && (
                        <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:4 }}>
                          <span style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1.5px" }}>LEADERSHIP</span>
                          {sel.hierarchy.map((h, hi) => (
                            <div key={hi} style={{ display:"flex", gap:4, marginTop:6 }}>
                              <Input value={h.title} onChange={v=>{const nh=[...sel.hierarchy];nh[hi]={...nh[hi],title:v};updateFaction(sel.id,{hierarchy:nh});setSel(p=>({...p,hierarchy:nh}));}} placeholder="Title" style={{ flex:1 }} />
                              <Input value={h.name} onChange={v=>{const nh=[...sel.hierarchy];nh[hi]={...nh[hi],name:v};updateFaction(sel.id,{hierarchy:nh});setSel(p=>({...p,hierarchy:nh}));}} placeholder="Name" style={{ flex:1 }} />
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Allies & Rivals editing */}
                      <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:4 }}>
                        <span style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1.5px" }}>RELATIONSHIPS</span>
                        <div style={{ marginTop:6 }}>
                          <span style={{ fontSize:10, color:T.green, marginBottom:2, display:"block" }}>Allies</span>
                          {(data.factions || []).filter(f => f.id !== sel.id).map(f => {
                            const isAlly = (sel.allies || []).includes(f.name);
                            return (
                              <label key={f.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", cursor:"pointer", fontSize:12, color: isAlly ? T.green : T.textFaint }}>
                                <input type="checkbox" checked={isAlly} onChange={() => {
                                  const newAllies = isAlly ? (sel.allies || []).filter(a => a !== f.name) : [...(sel.allies || []), f.name];
                                  updateFaction(sel.id, { allies: newAllies });
                                  setSel(p => ({ ...p, allies: newAllies }));
                                }} />
                                {f.name}
                              </label>
                            );
                          })}
                        </div>
                        <div style={{ marginTop:8 }}>
                          <span style={{ fontSize:10, color:T.crimson, marginBottom:2, display:"block" }}>Rivals</span>
                          {(data.factions || []).filter(f => f.id !== sel.id).map(f => {
                            const isRival = (sel.rivals || []).includes(f.name);
                            return (
                              <label key={f.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", cursor:"pointer", fontSize:12, color: isRival ? T.crimson : T.textFaint }}>
                                <input type="checkbox" checked={isRival} onChange={() => {
                                  const newRivals = isRival ? (sel.rivals || []).filter(r => r !== f.name) : [...(sel.rivals || []), f.name];
                                  updateFaction(sel.id, { rivals: newRivals });
                                  setSel(p => ({ ...p, rivals: newRivals }));
                                }} />
                                {f.name}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>}
                    {selType==="region" && <>
                      <Input value={sel.name} onChange={v=>{updateRegion(sel.id,{name:v});setSel(p=>({...p,name:v}));}} placeholder="Region Name" />
                      <Input value={sel.subtitle || ""} onChange={v=>{updateRegion(sel.id,{subtitle:v});setSel(p=>({...p,subtitle:v}));}} placeholder="Subtitle (e.g. Kingdom of...)" />
                      <Select value={sel.type} onChange={v=>{updateRegion(sel.id,{type:v});setSel(p=>({...p,type:v}));}} style={{ width:"100%" }}>
                        {["capital","city","town","hamlet","kingdom","castle","wilderness","forest","mountain","dungeon","ruins","route"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Select value={sel.terrain || ""} onChange={v=>{updateRegion(sel.id,{terrain:v});setSel(p=>({...p,terrain:v}));}} style={{ width:"100%" }}>
                        {["plains","forest","mountains","swamp","desert","coast","tundra","hills","volcanic","arctic","jungle","steppe"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Select value={sel.threat} onChange={v=>{updateRegion(sel.id,{threat:v});setSel(p=>({...p,threat:v}));}} style={{ width:"100%" }}>
                        {["low","medium","high","extreme"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Input value={sel.state} onChange={v=>{updateRegion(sel.id,{state:v});setSel(p=>({...p,state:v}));}} placeholder="State (e.g. stable, contested)" />
                      <Input value={sel.ctrl || ""} onChange={v=>{updateRegion(sel.id,{ctrl:v});setSel(p=>({...p,ctrl:v}));}} placeholder="Controlling Faction" />
                      <Input value={sel.population || ""} onChange={v=>{updateRegion(sel.id,{population:v});setSel(p=>({...p,population:v}));}} placeholder="Population" />
                      <Input value={sel.governor || ""} onChange={v=>{updateRegion(sel.id,{governor:v});setSel(p=>({...p,governor:v}));}} placeholder="Governor Name" />
                      <Input value={sel.governorTitle || ""} onChange={v=>{updateRegion(sel.id,{governorTitle:v});setSel(p=>({...p,governorTitle:v}));}} placeholder="Governor Title" />
                      <ToggleSwitch on={sel.visited} onToggle={()=>{updateRegion(sel.id,{visited:!sel.visited});setSel(p=>({...p,visited:!p.visited}));}} label="Visited" />
                    </>}
                    {selType==="npc" && <>
                      <Input value={sel.name} onChange={v=>{updateNpc(sel.id,{name:v});setSel(p=>({...p,name:v}));}} placeholder="Name" />
                      <Input value={sel.role} onChange={v=>{updateNpc(sel.id,{role:v});setSel(p=>({...p,role:v}));}} placeholder="Role / Title" />
                      <Select value={sel.attitude} onChange={v=>{updateNpc(sel.id,{attitude:v});setSel(p=>({...p,attitude:v}));}} style={{ width:"100%" }}>
                        {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
                      </Select>
                      <Input value={sel.loc || ""} onChange={v=>{updateNpc(sel.id,{loc:v});setSel(p=>({...p,loc:v}));}} placeholder="Location" />
                      <Input value={sel.faction || ""} onChange={v=>{updateNpc(sel.id,{faction:v});setSel(p=>({...p,faction:v}));}} placeholder="Faction" />
                      <Input value={String(sel.level || "")} onChange={v=>{const lv=parseInt(v)||0;updateNpc(sel.id,{level:lv});setSel(p=>({...p,level:lv}));}} placeholder="Level" />
                      <Textarea value={(sel.traits || []).join(", ")} onChange={v=>{const t=v.split(",").map(s=>s.trim()).filter(Boolean);updateNpc(sel.id,{traits:t});setSel(p=>({...p,traits:t}));}} placeholder="Traits (comma separated)" rows={2} />
                      <Textarea value={sel.secret || ""} onChange={v=>{updateNpc(sel.id,{secret:v});setSel(p=>({...p,secret:v}));}} placeholder="Secret (DM only)" rows={2} />
                      <ToggleSwitch on={sel.alive} onToggle={()=>{updateNpc(sel.id,{alive:!sel.alive});setSel(p=>({...p,alive:!p.alive}));}} label="Alive" />
                      <ToggleSwitch on={sel.isLeader || false} onToggle={()=>{updateNpc(sel.id,{isLeader:!sel.isLeader});setSel(p=>({...p,isLeader:!p.isLeader}));}} label="Faction Leader" />
                    </>}
                  </div>
                ) : (!(tab==="map" && selType==="region" && selectedWorldNode) && (
                  <div style={{ padding:14, background:T.bg, border:`1px solid ${T.crimsonBorder}`, borderRadius:"2px", marginBottom:20 }}>
                    {selType==="region" && !(tab==="map" && selectedWorldNode) && <>
                      {sel.subtitle && <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic", marginBottom:8 }}>{sel.subtitle}</div>}
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Type: <span style={{color:T.textDim}}>{sel.type}</span></div>
                      {sel.terrain && <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Terrain: <span style={{color:T.textDim}}>{sel.terrain}</span></div>}
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>State: <span style={{color:T.textDim,fontStyle:"italic"}}>{sel.state}</span></div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Threat: <Tag variant={sel.threat==="extreme"?"critical":sel.threat==="high"?"danger":sel.threat==="medium"?"warning":"success"}>{sel.threat}</Tag></div>
                      {(() => { const cap = (data.cities||[]).find(c => c.region === sel.name && c.isCapital); return cap ? <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Capital: <span style={{color:T.gold}}>{cap.name}</span></div> : null; })()}
                      {sel.population && <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Population: <span style={{color:T.textDim}}>~{sel.population}</span></div>}
                      {sel.governor && <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>{sel.governorTitle || "Ruler"}: <span style={{color:T.gold}}>{sel.governor}</span></div>}
                      {sel.cities && sel.cities.length > 0 && <div style={{ fontSize:12, color:T.textMuted }}>Settlements: <span style={{color:T.textDim}}>{[...new Set(sel.cities)].join(", ")}</span></div>}
                    </>}
                    {selType==="faction" && <>
                      {sel.govType && <div style={{ fontSize:10, color:T.gold, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>{sel.govType}</div>}
                      <p style={{ fontSize:13, color:T.textDim, margin:"0 0 10px", fontWeight:300, fontStyle:"italic", lineHeight:"1.5" }}>{sel.desc}</p>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Power: <span style={{color:T.textDim}}>{sel.power}/100</span></div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Trend: <span style={{color:T.textDim}}>{sel.trend}</span></div>
                      {sel.hierarchy && sel.hierarchy.length > 0 && (
                        <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:8 }}>
                          <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>Leadership</div>
                          {sel.hierarchy.map((h, hi) => (
                            <div key={hi} style={{ fontSize:12, color:T.textMuted, marginBottom:3, paddingLeft: hi * 8 }}>
                              <span style={{ color: hi === 0 ? T.gold : T.textDim }}>{h.title}:</span> {h.name}
                            </div>
                          ))}
                        </div>
                      )}
                      {sel.resources && sel.resources.length > 0 && (
                        <div style={{ marginTop:8, display:"flex", gap:4, flexWrap:"wrap" }}>
                          {sel.resources.map((r, ri) => <span key={ri} style={{ padding:"2px 6px", background:"rgba(212,67,58,0.08)", border:"1px solid rgba(212,67,58,0.18)", borderRadius:"3px", fontSize:10, color:T.gold }}>{r}</span>)}
                        </div>
                      )}
                      {(sel.allies?.length > 0 || sel.rivals?.length > 0) && (
                        <div style={{ marginTop:8, borderTop:`1px solid ${T.border}`, paddingTop:8 }}>
                          {sel.allies?.length > 0 && <div style={{ fontSize:11, color:T.green, marginBottom:3 }}>Allies: {sel.allies.join(", ")}</div>}
                          {sel.rivals?.length > 0 && <div style={{ fontSize:11, color:T.crimson }}>Rivals: {sel.rivals.join(", ")}</div>}
                        </div>
                      )}
                    </>}
                    {selType==="npc" && <>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:12, color:T.textMuted }}>Role: <span style={{color:T.textDim}}>{sel.role}</span></span>
                        {sel.level && <span style={{ fontSize:10, color:T.textFaint }}>Lv{sel.level}</span>}
                        {sel.isLeader && <span style={{ fontSize:9, color:T.gold, border:"1px solid rgba(212,67,58,0.3)", padding:"1px 5px", borderRadius:"2px" }}>LEADER</span>}
                      </div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Location: <span style={{color:T.textDim}}>{sel.loc}</span></div>
                      {sel.faction && <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Faction: <span style={{color:T.textDim}}>{sel.faction}</span></div>}
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Status: <span style={{color: sel.alive ? T.green : T.crimson}}>{sel.alive?"Alive":"Deceased"}</span></div>
                      {sel.traits && sel.traits.length > 0 && <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Traits: <span style={{color:T.textDim, fontStyle:"italic"}}>{sel.traits.join(", ")}</span></div>}
                      {isDM && sel.secret && <div style={{ fontSize:12, color:T.gold, marginTop:6, fontStyle:"italic" }}>Secret: {sel.secret}</div>}
                    </>}
                  </div>
                ))}

                {tab==="map" && selType==="region" && selectedWorldNode && !editing && (
                  <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                      {[
                        { label:"Quests", value:selectedWorldNode.activeQuests?.length || 0, color: T.bonusGold },
                        { label:"NPCs", value:selectedWorldNode.npcs?.length || 0, color: T.moveBlue },
                        { label:"Encounters", value:selectedWorldNode.encounters?.length || 0, color: T.crimson },
                      ].map((stat) => (
                        <div key={stat.label} style={{
                          padding:"10px 8px", borderRadius:12, textAlign:"center",
                          border:`1px solid ${T.border}`, background:"rgba(0,0,0,0.12)",
                        }}>
                          <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1.2px", color:T.textFaint, textTransform:"uppercase", marginBottom:6 }}>{stat.label}</div>
                          <div style={{ fontFamily:T.ui, fontSize:18, color:stat.color, fontWeight:700 }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      padding:14, borderRadius:14,
                      border:`1px solid ${selectedWorldNode.stateMeta?.color || T.border}`,
                      background:selectedWorldNode.stateMeta?.glow || "rgba(255,255,255,0.03)",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:10 }}>
                        <div style={{ fontFamily:T.ui, fontSize:11, letterSpacing:"1px", textTransform:"uppercase", color:selectedWorldNode.stateMeta?.color || T.textMuted }}>
                          {selectedWorldNode.stateMeta?.label || selectedWorldNode.state}
                        </div>
                        <Tag variant={selectedWorldNode.threat==="extreme"?"critical":selectedWorldNode.threat==="high"?"danger":selectedWorldNode.threat==="medium"?"warning":"success"}>{selectedWorldNode.threat}</Tag>
                      </div>
                      <div style={{ fontSize:13, color:T.textDim, fontStyle:"italic", lineHeight:1.55 }}>
                        {selectedWorldNode.discovered
                          ? `${selectedWorldNode.name} is currently ${String(selectedWorldNode.stateMeta?.label || selectedWorldNode.state || "stable").toLowerCase()} under ${selectedWorldNode.ctrl || "independent control"}.`
                          : "This location has been marked on the campaign map but has not been discovered by the party yet."}
                      </div>
                    </div>

                    {activeRoute && (
                      <div style={{ padding:14, borderRadius:14, border:"1px solid rgba(94,224,154,0.2)", background:"rgba(94,224,154,0.06)" }}>
                        <div style={{ fontFamily:T.ui, fontSize:10, letterSpacing:"1.3px", textTransform:"uppercase", color:T.green, marginBottom:8 }}>Route Plan</div>
                        {activeRoute.blocked ? (
                          <div style={{ fontSize:12, color:T.textMuted, fontStyle:"italic" }}>No connected road route between those locations yet.</div>
                        ) : (
                          <>
                            <div style={{ fontSize:18, color:T.text, fontFamily:T.ui, marginBottom:6 }}>{activeRoute.from.name} -> {activeRoute.to.name}</div>
                            <div style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>
                              {activeRoute.miles} miles - {activeRoute.etaDays} days by road - Risk <span style={{ color:getWorldThreatColor(activeRoute.threat), textTransform:"capitalize" }}>{activeRoute.threat}</span>
                            </div>
                            <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic", marginTop:8 }}>{activeRoute.names.join(" -> ")}</div>
                          </>
                        )}
                      </div>
                    )}

                    <div style={{ display:"grid", gridTemplateColumns:isMapCompact?"1fr 1fr":"1fr 1fr", gap:8 }}>
                      <CrimsonBtn small onClick={()=>setRouteDraft((p)=>({ ...p, fromId:selectedWorldNode.id }))} secondary={routeDraft.fromId!==selectedWorldNode.id}>
                        <MapPin size={12}/> Set Start
                      </CrimsonBtn>
                      <CrimsonBtn small onClick={()=>setRouteDraft((p)=>({ ...p, toId:selectedWorldNode.id }))} secondary={routeDraft.toId!==selectedWorldNode.id}>
                        <Target size={12}/> Set Destination
                      </CrimsonBtn>
                      <CrimsonBtn small onClick={()=>focusWorldNode(selectedWorldNode, selectedWorldNode.type==="dungeon" ? "site" : selectedWorldNode.type==="city" ? "local" : "region")} secondary>
                        <Eye size={12}/> Drill In
                      </CrimsonBtn>
                      {selectedWorldNode.encounters?.length === 1 ? (
                        <CrimsonBtn small onClick={()=>queueEncounterLaunch(selectedWorldNode.encounters[0], selectedWorldNode)}>
                          <Swords size={12}/> Launch Encounter
                        </CrimsonBtn>
                      ) : (
                        <CrimsonBtn small onClick={()=>onNav && onNav("play")} secondary>
                          <Swords size={12}/> Open Play
                        </CrimsonBtn>
                      )}
                    </div>

                    {(selectedWorldNode.activeQuests?.length > 0 || selectedWorldNode.encounters?.length > 0 || selectedWorldNode.npcs?.length > 0 || selectedWorldNode.timelineEvents?.length > 0) && (
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {selectedWorldNode.activeQuests?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Active Quests</div>
                            {selectedWorldNode.activeQuests.map((q) => (
                              <div key={"world-q-" + q.id} style={{ padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10, background:"rgba(0,0,0,0.08)", marginBottom:6 }}>
                                <div style={{ fontSize:13, color:T.text, fontWeight:300 }}>{q.title}</div>
                                <div style={{ marginTop:4, display:"flex", gap:6, flexWrap:"wrap" }}>
                                  <Tag variant={q.urgency==="critical"?"critical":q.urgency==="high"?"danger":q.urgency==="medium"?"warning":"muted"}>{q.urgency}</Tag>
                                  <Tag variant="muted">{q.status}</Tag>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedWorldNode.encounters?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Encounters</div>
                            {selectedWorldNode.encounters.map((enc) => (
                              <div key={"world-enc-" + enc.id} style={{ padding:"10px 12px", border:"1px solid rgba(212,67,58,0.22)", borderRadius:10, background:"rgba(212,67,58,0.05)", marginBottom:6 }}>
                                <div style={{ fontSize:13, color:T.text, fontWeight:300 }}>{enc.name}</div>
                                <div style={{ fontSize:11, color:T.textFaint, marginTop:4, fontStyle:"italic" }}>{enc.notes || "Ready to stage in Play Mode."}</div>
                                <div style={{ marginTop:8 }}>
                                  <LinkBtn onClick={()=>queueEncounterLaunch(enc, selectedWorldNode)}><Swords size={10}/> Launch This Encounter</LinkBtn>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedWorldNode.npcs?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>NPCs On Site</div>
                            {selectedWorldNode.npcs.map((n) => (
                              <button key={"world-n-" + n.id} onClick={()=>{setSel(n);setSelType("npc");setEditing(false);}} style={{
                                width:"100%", textAlign:"left", padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10,
                                background:"rgba(0,0,0,0.08)", color:T.text, cursor:"pointer", marginBottom:6,
                              }}>
                                <div style={{ fontSize:13, fontWeight:300 }}>{n.name}</div>
                                <div style={{ fontSize:11, color:T.textFaint, marginTop:4, fontStyle:"italic" }}>{n.role || "NPC"} - {n.faction || "Independent"}</div>
                              </button>
                            ))}
                          </div>
                        )}
                        {selectedWorldNode.timelineEvents?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Recent Events</div>
                            {selectedWorldNode.timelineEvents.map((ev) => (
                              <div key={"world-ev-" + ev.id} style={{ padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10, background:"rgba(0,0,0,0.08)", marginBottom:6 }}>
                                <div style={{ fontSize:12, color:T.textDim, fontStyle:"italic" }}>{ev.headline || ev.text || "Campaign event"}</div>
                                <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1px", marginTop:6, textTransform:"uppercase" }}>{ev.sessionTitle || "Session"} - {ev.date || ""}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!(tab==="map" && selType==="region" && selectedWorldNode) && <>
                  <SectionTitle icon={Layers}>Connections</SectionTitle>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {conns(selType,sel).map((c,i) => (
                      <div key={i} onClick={()=>{setSel(c.e);setSelType(c.type);setEditing(false);}} style={{
                        padding:"12px 14px", background:T.bg, cursor:"pointer", borderRadius:"2px",
                        border:`1px solid ${T.border}`, borderLeft:`3px solid ${c.type==="faction"?(c.e.color||T.crimson):T.textFaint}`,
                        transition:"all 0.15s",
                      }}>
                        <span style={{ fontFamily:T.ui, fontSize:7, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", display:"block", marginBottom:3 }}>{c.label}</span>
                        <span style={{ fontSize:13, fontWeight:300, color:T.text }}>{c.e.name||c.e.title}</span>
                      </div>
                    ))}
                    {conns(selType,sel).length===0 && <p style={{ fontSize:12, color:T.textFaint, fontStyle:"italic", fontWeight:300 }}>No connections.</p>}
                  </div>
                </>}

                {/* POI details — full panel with lore, quests, rewards */}
                {selType==="poi" && !editing && (() => {
                  const p = sel;
                  const dangerLevel = typeof p.danger === "number" ? p.danger : 0;
                  const dangerLabel = ["Safe","Low","Moderate","Dangerous","Deadly","Catastrophic"][dangerLevel] || "Unknown";
                  const tCol = dangerLevel >= 4 ? "#d04040" : dangerLevel >= 3 ? "#e89430" : dangerLevel >= 2 ? T.gold : "#6a8a60";
                  return (
                  <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                    {/* Back + View on Map */}
                    <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                      <button onClick={() => { setSel(null); setSelType(null); }} style={{
                        display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                        background:"transparent", border:`1px solid ${T.border}`, borderRadius:"3px", color:T.textMuted,
                        fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer",
                      }}>{ArrowLeft && <ArrowLeft size={12}/>} Back</button>
                      <button onClick={() => { setTab("map"); }} style={{
                        display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                        background:"transparent", border:`1px solid ${T.border}`, borderRadius:"3px", color:T.textMuted,
                        fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer",
                      }}>◎ View on Map</button>
                    </div>
                    {/* Header */}
                    <div style={{
                      padding:"24px 28px", marginBottom:20,
                      background:`linear-gradient(135deg, ${tCol}18 0%, transparent 60%)`,
                      borderLeft:`4px solid ${tCol}`, borderRadius:"4px", border:`1px solid ${T.border}`,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:22, fontWeight:400, color:T.text, fontFamily:T.ui, letterSpacing:"0.5px" }}>{p.name}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                        <span style={{ fontSize:10, color:tCol, border:`1px solid ${tCol}44`, padding:"2px 8px", borderRadius:"2px", letterSpacing:"1px", textTransform:"uppercase" }}>{p.type}</span>
                        <span style={{ fontSize:10, color:T.textMuted }}>·</span>
                        <span style={{ fontSize:10, color:T.textMuted }}>{p.region}</span>
                        <span style={{ fontSize:10, color:T.textMuted }}>·</span>
                        <Tag variant={dangerLevel>=4?"critical":dangerLevel>=3?"danger":dangerLevel>=2?"warning":"success"}>{dangerLabel}</Tag>
                      </div>
                      <div style={{ fontSize:12, color:T.textDim, lineHeight:1.7, fontStyle:"italic" }}>{p.description}</div>
                    </div>
                    {/* Lore */}
                    {p.lore && (
                      <div style={{ padding:"20px 24px", marginBottom:16, background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px" }}>
                        <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12 }}>Lore & History</div>
                        <div style={{ fontSize:12, color:T.textDim, lineHeight:1.8, fontWeight:300 }}>{p.lore}</div>
                      </div>
                    )}
                    {/* Quest Hook */}
                    {p.hook && (
                      <div style={{ padding:"16px 20px", marginBottom:16, background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.15)", borderRadius:"4px", borderLeft:"3px solid " + T.gold }}>
                        <div style={{ fontSize:10, color:T.gold, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Adventure Hook</div>
                        <div style={{ fontSize:12, color:T.textDim, lineHeight:1.7, fontStyle:"italic", fontWeight:300 }}>{p.hook}</div>
                      </div>
                    )}
                    {/* Quests */}
                    {p.quests && p.quests.length > 0 && (
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:10, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:12, paddingLeft:4 }}>Available Quests ({p.quests.length})</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                          {p.quests.map((q, qi) => (
                            <div key={qi} style={{ padding:"16px 20px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px" }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                                <span style={{ fontSize:14, fontWeight:400, color:T.text, fontFamily:T.body }}>{q.title}</span>
                                <span style={{ fontSize:9, color:tCol, border:`1px solid ${tCol}33`, padding:"2px 8px", borderRadius:"2px", letterSpacing:"0.5px" }}>{q.difficulty}</span>
                              </div>
                              <div style={{ fontSize:11, color:T.textDim, lineHeight:1.7, marginBottom:10 }}>{q.desc}</div>
                              <div style={{ fontSize:10, color:T.gold, fontStyle:"italic" }}>Reward: {q.reward}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Reward */}
                    {p.reward && (
                      <div style={{ padding:"14px 20px", background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.18)", borderRadius:"4px", marginBottom:16 }}>
                        <div style={{ fontSize:10, color:T.gold, letterSpacing:"1px", marginBottom:4 }}>POTENTIAL REWARD</div>
                        <div style={{ fontSize:13, color:T.text, fontFamily:T.body }}>{p.reward}</div>
                      </div>
                    )}
                  </div>
                  );
                })()}
                {/* Encounter zone details */}
                {selType==="encounter" && !editing && (
                  <div style={{ padding:14, background:T.bg, border:`1px solid ${T.crimsonBorder}`, borderRadius:"2px", marginBottom:20 }}>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Type: <span style={{color:T.textDim}}>{sel.type}</span></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Challenge: <Tag variant={sel.cr>10?"critical":sel.cr>7?"danger":sel.cr>3?"warning":"success"}>CR {sel.cr}</Tag></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Name: <span style={{color:T.textDim,fontStyle:"italic"}}>{sel.name}</span></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:10, fontStyle:"italic", fontWeight:300 }}>An area known for dangerous encounters.</div>
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>
      </div>

      {/* Economy panel removed — economy info is now in the Regions tab */}
      {false && (
        <div style={{ flex:1, overflowY:"auto", padding:"24px 48px" }}>
          <div style={{ marginBottom:40 }}>
            {/* Header & World Treasury */}
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontFamily:T.heading, fontSize:24, color:T.text, marginBottom:4, letterSpacing:"0.5px" }}>Regional Economy</h2>
              <div style={{ fontSize:12, color:T.textMuted }}>World Treasury & Trade Networks</div>
            </div>

            {/* World Treasury Summary */}
            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:20, marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>Total Treasury</div>
              <div style={{ fontSize:32, color:T.gold, fontFamily:T.ui, fontWeight:600 }}>
                {(data.factions || []).reduce((sum, f) => sum + (f.treasury || 0), 0).toLocaleString()} gp
              </div>
              <div style={{ fontSize:11, color:T.textMuted, marginTop:8 }}>{data.factions?.length || 0} factions managing wealth</div>
            </div>

            {/* Faction Treasuries Row */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Faction Treasuries</div>
              <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8 }}>
                {(data.factions || []).map(f => (
                  <div key={f.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16, minWidth:200, flexShrink:0 }}>
                    <div style={{ fontSize:11, color:T.textMuted, marginBottom:4 }}>{f.name}</div>
                    <div style={{ fontSize:18, color:T.gold, fontFamily:T.ui, fontWeight:600, marginBottom:8 }}>{(f.treasury || 0).toLocaleString()} gp</div>
                    <div style={{ fontSize:10, color:f.trend==="rising"?T.green:f.trend==="falling"?T.crimson:T.textMuted, display:"flex", gap:4, alignItems:"center" }}>
                      {f.trend==="rising"?"▲":"▼"} {f.income || 0} gp/tick
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Prices Section */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Market Prices by Region</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {(data.regions || []).slice(0, 6).map(r => (
                  <div key={r.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16 }}>
                    <div style={{ fontSize:12, color:T.text, fontWeight:400, marginBottom:10 }}>{r.name}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      <div style={{ fontSize:10, color:T.textMuted }}>Grain: <span style={{ color:T.green }}>2gp</span></div>
                      <div style={{ fontSize:10, color:T.textMuted }}>Steel: <span style={{ color:T.crimson }}>8gp</span></div>
                      <div style={{ fontSize:10, color:T.textMuted }}>Luxury: <span style={{ color:T.gold }}>15gp</span></div>
                    </div>
                    <div style={{ marginTop:10, width:"100%", height:6, background:"rgba(0,0,0,0.3)", borderRadius:"2px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:"60%", background: T.green }} />
                    </div>
                    <div style={{ fontSize:8, color:T.textFaint, marginTop:6 }}>Supply: Good</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade Routes Section */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Active Trade Routes</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {data.factions?.length ? (
                  data.factions.slice(0, 3).map(f => (
                    <div key={f.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:14 }}>
                      <div style={{ fontSize:11, color:T.text, marginBottom:6 }}>
                        {data.cities?.[0]?.name || "City A"} → {data.cities?.[1]?.name || "City B"}
                      </div>
                      <div style={{ fontSize:10, color:T.textMuted, marginBottom:4 }}>Goods: Spices, Silks</div>
                      <div style={{ fontSize:10, color:T.green }}>Profit: 12 gp/tick</div>
                      <div style={{ fontSize:9, color:T.textFaint }}>Controlled by: {f.name}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color:T.textMuted, fontStyle:"italic", fontSize:11, padding:10 }}>No trade routes established yet.</div>
                )}
              </div>
            </div>

            {/* Economy Events Log */}
            <div>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Recent Economy Events</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ background:"rgba(94,224,154,0.06)", border:"1px solid rgba(94,224,154,0.2)", borderRadius:"4px", padding:12 }}>
                  <div style={{ fontSize:10, color:T.green, marginBottom:4 }}>Bumper Harvest</div>
                  <div style={{ fontSize:9, color:T.textMuted }}>Grain prices dropped 3gp due to surplus.</div>
                </div>
                <div style={{ background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.2)", borderRadius:"4px", padding:12 }}>
                  <div style={{ fontSize:10, color:T.crimson, marginBottom:4 }}>Bandit Activity</div>
                  <div style={{ fontSize:9, color:T.textMuted }}>Trade disrupted on northern route.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CALENDAR PANEL ══════════ */}
      {tab==="calendar" && (() => {
        // ── Kingdom Cultural Calendar System ──
        // Each faction/kingdom can have its own calendar naming, holidays, and cultural events
        const facs = (data.factions || []).filter(f => !f.isSubFaction);
        const seedHash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h); };

        // Universal months (shared structure) with kingdom-specific names
        const universalMonths = [
          { name: "Frostdeep", season: "Winter", icon: "✧", days: 30, effects: { move: -20, crops: -50, trade: -10 } },
          { name: "Thawmere", season: "Winter", icon: "◇", days: 28, effects: { move: -10, crops: -20, trade: 0 } },
          { name: "Bloomsreach", season: "Spring", icon: "❦", days: 31, effects: { move: 10, crops: 30, trade: 15 } },
          { name: "Greenspire", season: "Spring", icon: "⚘", days: 30, effects: { move: 15, crops: 40, trade: 20 } },
          { name: "Highsun", season: "Summer", icon: "✦", days: 31, effects: { move: 5, crops: 25, trade: 25 } },
          { name: "Embertide", season: "Summer", icon: "⟡", days: 30, effects: { move: 0, crops: 10, trade: 30 } },
          { name: "Goldfall", season: "Autumn", icon: "❧", days: 31, effects: { move: 5, crops: 50, trade: 20 } },
          { name: "Harvestwane", season: "Autumn", icon: "⚌", days: 30, effects: { move: 0, crops: 20, trade: 10 } },
          { name: "Dimtober", season: "Autumn", icon: "⊛", days: 31, effects: { move: -5, crops: -10, trade: 5 } },
          { name: "Gloomhearth", season: "Winter", icon: "☽", days: 30, effects: { move: -15, crops: -40, trade: -5 } },
          { name: "Stillnight", season: "Winter", icon: "☾", days: 31, effects: { move: -25, crops: -60, trade: -15 } },
          { name: "Dawncrest", season: "Spring", icon: "✶", days: 28, effects: { move: 5, crops: 10, trade: 10 } }
        ];

        // Generate kingdom-specific cultural data from faction names
        const kingdomCalendars = {};
        facs.forEach(f => {
          const h = seedHash(f.name);
          const culturalPrefixes = ["The Month of", "Season of", "Time of", "The", "Days of"];
          const culturalSuffixes = [" Blades", " Crowns", " Hammers", " Shields", " Stars", " Flames", " Shadows", " Oaths", " Tides", " Songs", " Wolves", " Eagles"];
          const holidayTypes = ["Coronation Day", "Founding Festival", "Battle Remembrance", "Harvest Feast", "Night of Vigils", "Grand Tournament", "Sacred Rite", "Market Week", "Spirit Calling", "Oath Renewal", "Blood Moon Rites", "Ancestor's Wake"];

          const monthNames = universalMonths.map((m, mi) => {
            const pIdx = (h + mi * 7) % culturalPrefixes.length;
            const sIdx = (h + mi * 13) % culturalSuffixes.length;
            return culturalPrefixes[pIdx] + culturalSuffixes[sIdx];
          });

          const holidays = [];
          const numHolidays = 3 + (h % 4);
          for (let hi = 0; hi < numHolidays; hi++) {
            const hMonth = (h * (hi + 1) * 3) % 12;
            const hDay = 1 + ((h * (hi + 1) * 7) % universalMonths[hMonth].days);
            const hType = holidayTypes[(h + hi * 5) % holidayTypes.length];
            holidays.push({ month: hMonth, day: hDay, name: `${f.name} ${hType}`, desc: `A cultural event of the ${f.name}`, color: f.color });
          }

          kingdomCalendars[f.name] = { monthNames, holidays, color: f.color };
        });

        const curMonth = universalMonths[calMonth];
        const seasonColor = curMonth.season === "Winter" ? T.moveBlue : curMonth.season === "Spring" ? T.green : curMonth.season === "Summer" ? T.questGold : T.orange;
        const daysInMonth = curMonth.days;

        // Get holidays for current month from selected kingdom or all
        const curHolidays = [];
        if (calKingdom === "all") {
          Object.entries(kingdomCalendars).forEach(([fname, cal]) => {
            cal.holidays.filter(h => h.month === calMonth).forEach(h => curHolidays.push(h));
          });
        } else {
          const cal = kingdomCalendars[calKingdom];
          if (cal) cal.holidays.filter(h => h.month === calMonth).forEach(h => curHolidays.push(h));
        }

        // Timeline events for this month
        const timelineEvents = (data.timeline || []).flatMap(s => (s.events || []).map(ev => ({ ...ev, sessionDate: s.date, sessionTitle: s.title }))).slice(0, 20);

        const advanceDay = (days) => {
          let d = calDay + days;
          let m = calMonth;
          let y = calYear;
          while (d > universalMonths[m].days) {
            d -= universalMonths[m].days;
            m++;
            if (m >= 12) { m = 0; y++; }
          }
          while (d < 1) {
            m--;
            if (m < 0) { m = 11; y--; }
            d += universalMonths[m].days;
          }
          setCalDay(d); setCalMonth(m); setCalYear(y);
          setData(prev => ({ ...prev, calendarDay: d, calendarMonth: m, calendarYear: y }));
        };

        const displayMonthName = calKingdom !== "all" && kingdomCalendars[calKingdom]
          ? kingdomCalendars[calKingdom].monthNames[calMonth]
          : curMonth.name;

        // Day names vary by kingdom
        const dayNamesUniversal = ["Moonday", "Fireday", "Earthday", "Windday", "Starday", "Lightday", "Restday"];
        const dayNamesForKingdom = calKingdom !== "all" && kingdomCalendars[calKingdom]
          ? dayNamesUniversal.map((d, i) => { const h = seedHash(calKingdom); const suffixes = ["day","morn","dusk","tide","mark","end","rise"]; return d.slice(0, 3) + suffixes[(h + i) % suffixes.length]; })
          : dayNamesUniversal;

        // Seeded weather per region
        const regionWeathers = (data.regions || []).slice(0, 8).map(r => {
          const ws = ["Clear Skies","Partly Cloudy","Overcast","Light Rain","Heavy Rain","Thick Fog","Strong Winds","Thunderstorm","Snow","Blizzard"];
          const sIdx = curMonth.season === "Winter" ? [0,2,5,6,8,9] : curMonth.season === "Summer" ? [0,0,1,3,6,7] : [0,1,2,3,4,5];
          const wIdx = (seedHash(r.name + calMonth + calDay) % sIdx.length);
          return { name: r.name, weather: ws[sIdx[wIdx]], terrain: r.terrain || "temperate" };
        });

        return (
        <div style={{ flex:1, overflowY:"auto", padding:"24px 48px", minHeight:0 }}>
          <div style={{ paddingBottom:40 }}>
            {/* Kingdom Selector */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              <div style={{ fontSize:9, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase" }}>View As:</div>
              <button onClick={() => setCalKingdom("all")} style={{
                padding:"5px 12px", fontSize:10, fontFamily:T.ui, letterSpacing:"0.5px",
                border: calKingdom === "all" ? `1px solid ${T.crimson}` : `1px solid ${T.border}`,
                background: calKingdom === "all" ? "rgba(212,67,58,0.12)" : "transparent",
                color: calKingdom === "all" ? T.crimson : T.textFaint, borderRadius:3, cursor:"pointer"
              }}>Universal</button>
              {facs.map(f => (
                <button key={f.id} onClick={() => setCalKingdom(f.name)} style={{
                  padding:"5px 12px", fontSize:10, fontFamily:T.ui, letterSpacing:"0.5px",
                  border: calKingdom === f.name ? `1px solid ${f.color}` : `1px solid ${T.border}`,
                  background: calKingdom === f.name ? (f.color + "20") : "transparent",
                  color: calKingdom === f.name ? f.color : T.textFaint, borderRadius:3, cursor:"pointer"
                }}>{f.name}</button>
              ))}
            </div>

            {/* Current Date Display */}
            <div style={{ marginBottom:28, textAlign:"center" }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                {calKingdom !== "all" ? `${calKingdom} Reckoning` : "Common Reckoning"}
              </div>
              <div style={{ fontSize:36, color:T.gold, fontFamily:T.ui, fontWeight:600, marginBottom:4, letterSpacing:"1px" }}>
                {calDay}{calDay === 1 || calDay === 21 || calDay === 31 ? "st" : calDay === 2 || calDay === 22 ? "nd" : calDay === 3 || calDay === 23 ? "rd" : "th"} of {displayMonthName}
              </div>
              <div style={{ fontSize:18, color:T.text, fontFamily:T.heading }}>Year {calYear}</div>
              <div style={{ fontSize:12, color:seasonColor, marginTop:8 }}>{curMonth.icon} {curMonth.season} Season</div>
            </div>

            {/* Season Effects Card */}
            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:4, padding:20, marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:13, color:T.text }}>{curMonth.season} — {curMonth.name}</div>
                  <div style={{ fontSize:10, color:T.textFaint, marginTop:2 }}>Day {calDay} of {daysInMonth}</div>
                </div>
                <div style={{ fontSize:28 }}>{curMonth.icon}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
                {[
                  { label: "Movement", val: curMonth.effects.move, suffix: "%" },
                  { label: "Crop Yield", val: curMonth.effects.crops, suffix: "%" },
                  { label: "Trade", val: curMonth.effects.trade, suffix: "%" }
                ].map(e => (
                  <div key={e.label} style={{ textAlign:"center", padding:"10px 8px", background:"rgba(0,0,0,0.1)", borderRadius:3 }}>
                    <div style={{ fontSize:16, color: e.val > 0 ? T.green : e.val < 0 ? T.crimson : T.textFaint, fontFamily:T.ui }}>
                      {e.val > 0 ? "+" : ""}{e.val}{e.suffix}
                    </div>
                    <div style={{ fontSize:8, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase", marginTop:4 }}>{e.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ width:"100%", height:6, background:"rgba(0,0,0,0.3)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(calDay / daysInMonth) * 100}%`, background:seasonColor, borderRadius:3, transition:"width 0.3s" }} />
              </div>
              <div style={{ fontSize:9, color:T.textFaint, marginTop:6, textAlign:"right" }}>{daysInMonth - calDay} days remaining in {curMonth.name}</div>
            </div>

            {/* DM Advance Controls */}
            {isDM && (
              <div style={{ marginBottom:24, display:"flex", gap:8, flexWrap:"wrap" }}>
                {[
                  { label: "−1 Day", days: -1 },
                  { label: "+1 Day", days: 1 },
                  { label: "+1 Week", days: 7 },
                  { label: "+1 Month", days: daysInMonth - calDay + 1 },
                  { label: "Next Season", days: (() => { let d = 0; let m = calMonth; const curSeason = curMonth.season; while (universalMonths[m % 12].season === curSeason) { d += universalMonths[m % 12].days; m++; } return d - calDay + 1; })() }
                ].map(b => (
                  <button key={b.label} onClick={() => advanceDay(b.days)} style={{
                    padding:"8px 14px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:3,
                    color:T.text, fontFamily:T.ui, fontSize:9, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer"
                  }}>{b.label}</button>
                ))}
              </div>
            )}

            {/* Month Navigation + Calendar Grid */}
            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:4, padding:20, marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <button onClick={() => { const prev = calMonth - 1; if (prev < 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(prev); setCalDay(1); }} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:16, padding:"4px 8px" }}>◄</button>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:14, color:T.text, fontFamily:T.heading }}>{displayMonthName}</div>
                  <div style={{ fontSize:9, color:T.textFaint }}>{curMonth.name} · {curMonth.season} · {daysInMonth} days</div>
                </div>
                <button onClick={() => { const next = calMonth + 1; if (next >= 12) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(next); setCalDay(1); }} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:16, padding:"4px 8px" }}>►</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:3, marginBottom:8 }}>
                {dayNamesForKingdom.map(d => (
                  <div key={d} style={{ textAlign:"center", fontSize:8, color:T.textFaint, fontWeight:600, padding:4, fontFamily:T.ui, letterSpacing:"0.5px" }}>{d.slice(0, 4)}</div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:3 }}>
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === calDay;
                  const holiday = curHolidays.find(h => h.day === day);
                  return (
                    <div key={i} onClick={() => { if (!isDM) return; setCalDay(day); setData(prev => ({ ...prev, calendarDay: day })); }} style={{
                      padding:"6px 4px", textAlign:"center", position:"relative",
                      background: isToday ? "rgba(212,67,58,0.14)" : holiday ? (holiday.color || T.gold) + "10" : "transparent",
                      border:`1px solid ${isToday ? T.crimson : holiday ? (holiday.color || T.gold) + "30" : T.border}`,
                      borderRadius:2, color: isToday ? T.crimson : holiday ? (holiday.color || T.gold) : T.textMuted,
                      fontSize:9, cursor:"pointer", minHeight:32
                    }}>
                      {day}
                      {holiday && <div style={{ width:4, height:4, borderRadius:"50%", background: holiday.color || T.gold, margin:"2px auto 0" }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regional Weather */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Regional Weather</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:10 }}>
                {regionWeathers.map(r => {
                  const wIcon = r.weather.includes("Snow") || r.weather.includes("Blizzard") ? "✧" : r.weather.includes("Rain") || r.weather.includes("Thunder") ? "⏐" : r.weather.includes("Fog") ? "≡" : r.weather.includes("Wind") ? "∿" : r.weather.includes("Cloud") || r.weather.includes("Overcast") ? "◌" : "✦";
                  return (
                    <div key={r.name} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:4, padding:12, textAlign:"center" }}>
                      <div style={{ fontSize:22, marginBottom:4 }}>{wIcon}</div>
                      <div style={{ fontSize:10, color:T.text, marginBottom:2 }}>{r.name}</div>
                      <div style={{ fontSize:9, color:T.textMuted }}>{r.weather}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kingdom Holidays & Events */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              {/* This Month's Holidays */}
              <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:4, padding:20 }}>
                <div style={{ fontSize:10, color:T.gold, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                  Holidays & Festivals — {displayMonthName}
                </div>
                {curHolidays.length > 0 ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {curHolidays.map((h, i) => (
                      <div key={i} style={{ padding:"10px 12px", borderRadius:3, borderLeft:`3px solid ${h.color || T.gold}`, background:(h.color || T.gold) + "08" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ fontSize:11, color:T.text }}>{h.name}</div>
                          <div style={{ fontSize:9, color:T.textFaint }}>Day {h.day}</div>
                        </div>
                        <div style={{ fontSize:9, color:T.textMuted, marginTop:3 }}>{h.desc}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic" }}>No holidays this month</div>
                )}
              </div>

              {/* Recent World Events */}
              <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:4, padding:20 }}>
                <div style={{ fontSize:10, color:T.crimson, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>
                  Recent World Events
                </div>
                {timelineEvents.length > 0 ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {timelineEvents.slice(0, 6).map((ev, i) => {
                      const catColor = ev.category === "military" ? T.crimson : ev.category === "political" ? T.gold : ev.category === "economic" ? T.green : T.textMuted;
                      return (
                        <div key={i} style={{ padding:"8px 10px", borderRadius:3, borderLeft:`2px solid ${catColor}`, background:"rgba(0,0,0,0.06)" }}>
                          <div style={{ fontSize:10, color:T.text }}>{ev.headline || ev.text}</div>
                          <div style={{ fontSize:8, color:T.textFaint, marginTop:3 }}>
                            {ev.category && <span style={{ color:catColor, textTransform:"capitalize" }}>{ev.category}</span>}
                            {ev.location && <span> · {ev.location}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic" }}>No world events recorded yet</div>
                )}
              </div>
            </div>

            {/* Kingdom Calendar Comparison */}
            {facs.length > 1 && (
              <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:4, padding:20 }}>
                <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:14 }}>
                  Cultural Calendar Comparison — {curMonth.name}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 80px 60px", gap:12, padding:"6px 10px", fontSize:8, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase" }}>
                    <span>Kingdom</span><span>Local Name</span><span>Holidays</span><span>Season</span>
                  </div>
                  {facs.map((f, fi) => {
                    const cal = kingdomCalendars[f.name];
                    if (!cal) return null;
                    const hCount = cal.holidays.filter(h => h.month === calMonth).length;
                    return (
                      <div key={f.id} onClick={() => setCalKingdom(f.name)} style={{
                        display:"grid", gridTemplateColumns:"140px 1fr 80px 60px", gap:12,
                        padding:"10px", borderRadius:3, cursor:"pointer",
                        background: calKingdom === f.name ? (f.color + "10") : fi % 2 === 0 ? "transparent" : "rgba(0,0,0,0.04)",
                        borderLeft: calKingdom === f.name ? `3px solid ${f.color}` : "3px solid transparent"
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:f.color, flexShrink:0 }} />
                          <span style={{ fontSize:11, color:T.text }}>{f.name}</span>
                        </div>
                        <span style={{ fontSize:10, color:T.textMuted, fontStyle:"italic" }}>{cal.monthNames[calMonth]}</span>
                        <span style={{ fontSize:10, color: hCount > 0 ? T.gold : T.textFaint }}>{hCount > 0 ? hCount + " festivals" : "None"}</span>
                        <span style={{ fontSize:10, color:seasonColor }}>{curMonth.season}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        );
      })()}

      {/* Religion panel removed — religion info is now in the Regions tab */}
      {false && (
        <div style={{ flex:1, overflowY:"auto", padding:"24px 48px" }}>
          <div style={{ marginBottom:40 }}>
            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontFamily:T.heading, fontSize:24, color:T.text, marginBottom:4, letterSpacing:"0.5px" }}>Divine Pantheon</h2>
              <div style={{ fontSize:12, color:T.textMuted }}>Deities, Faith & Divine Favor</div>
            </div>

            {/* Greater Deities */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Greater Deities</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[{emoji:"⚔", name:"Valorath", domain:"War", align:"Chaotic Good"},
                  {emoji:"☽", name:"Nocturnia", domain:"Night", align:"Neutral Evil"},
                  {emoji:"⚌", name:"Eldora", domain:"Life", align:"Lawful Good"}].map((d, i) => (
                  <div key={i} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16, cursor:"pointer", transition:"all 0.2s" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{d.emoji}</div>
                    <div style={{ fontSize:12, color:T.text, fontWeight:400, marginBottom:2 }}>{d.name}</div>
                    <div style={{ fontSize:9, color:T.textMuted, marginBottom:8 }}>{d.domain}</div>
                    <div style={{ fontSize:8, color:T.textFaint, marginBottom:10 }}>{d.align}</div>
                    <div style={{ fontSize:9, color:T.green }}>Favor: +45</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesser Deities */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Lesser Deities</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[{emoji:"⌂", name:"Civitas", domain:"Cities", align:"Lawful Neutral"},
                  {emoji:"⊛", name:"Jestara", domain:"Trickery", align:"Chaotic Neutral"},
                  {emoji:"≡", name:"Scrolliana", domain:"Magic", align:"Neutral"}].map((d, i) => (
                  <div key={i} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16, cursor:"pointer", transition:"all 0.2s" }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{d.emoji}</div>
                    <div style={{ fontSize:12, color:T.text, fontWeight:400, marginBottom:2 }}>{d.name}</div>
                    <div style={{ fontSize:9, color:T.textMuted, marginBottom:8 }}>{d.domain}</div>
                    <div style={{ fontSize:8, color:T.textFaint, marginBottom:10 }}>{d.align}</div>
                    <div style={{ fontSize:9, color:T.textMuted }}>Favor: 0</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Temple Map */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Major Temples</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(data.cities || []).slice(0, 3).map(city => (
                  <div key={city.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:14 }}>
                    <div style={{ fontSize:11, color:T.text, marginBottom:8 }}>{city.name}</div>
                    <div style={{ fontSize:9, color:T.textMuted, marginBottom:6 }}>Cathedral of Valorath</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ flex:1, height:6, background:"rgba(0,0,0,0.3)", borderRadius:"2px", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:"75%", background: T.orange }} />
                      </div>
                      <div style={{ fontSize:8, color:T.textFaint }}>Level 3</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divine Favor Tracker */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Faction Divine Standing</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {(data.factions || []).slice(0, 2).map(f => (
                  <div key={f.id} style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:14 }}>
                    <div style={{ fontSize:10, color:T.text, marginBottom:10 }}>{f.name}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
                      {[{name:"Valorath", val:45}, {name:"Nocturnia", val:-30}, {name:"Eldora", val:20}].map(d => (
                        <div key={d.name} style={{ background:"rgba(0,0,0,0.2)", borderRadius:"2px", padding:8, textAlign:"center" }}>
                          <div style={{ fontSize:8, color:T.textMuted, marginBottom:4 }}>{d.name}</div>
                          <div style={{ fontSize:10, color:d.val>0?T.green:d.val<0?T.crimson:T.textMuted, fontWeight:600 }}>{d.val>0?"+":""}{d.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Religion Actions (DM) */}
            {isDM && (
              <div style={{ marginBottom:28, display:"flex", gap:10, flexWrap:"wrap" }}>
                <button style={{ padding:"10px 16px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", color:T.text, fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}>
                  Trigger Divine Event
                </button>
                <button style={{ padding:"10px 16px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", color:T.text, fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}>
                  Build Temple
                </button>
                <button style={{ padding:"10px 16px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", color:T.text, fontFamily:T.ui, fontSize:10, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}>
                  Desecrate
                </button>
              </div>
            )}

            {/* Divine Events Log */}
            <div>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Recent Divine Events</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ background:"rgba(94,224,154,0.06)", border:"1px solid rgba(94,224,154,0.2)", borderRadius:"4px", padding:12 }}>
                  <div style={{ fontSize:10, color:T.green, marginBottom:4 }}>Blessing Bestowed</div>
                  <div style={{ fontSize:9, color:T.textMuted }}>Valorath blessed the warriors with courage.</div>
                </div>
                <div style={{ background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.2)", borderRadius:"4px", padding:12 }}>
                  <div style={{ fontSize:10, color:T.crimson, marginBottom:4 }}>Temple Desecrated</div>
                  <div style={{ fontSize:9, color:T.textMuted }}>Nocturnia's shrine was corrupted by dark magic.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ EXPLORATION PANEL ══════════ */}
      {tab==="exploration" && (() => {
        const cities = data.cities || [];
        const regions = data.regions || [];
        // ── Seeded hex RNG from origin+dest names ──
        const hexSeedStr = (hexOrigin || "a") + (hexDest || "b");
        const hexRng = (() => { let h = 0; for (let i = 0; i < hexSeedStr.length; i++) h = ((h << 5) - h + hexSeedStr.charCodeAt(i)) | 0; return () => { h = (h * 16807 + 0) % 2147483647; return (h & 0x7fffffff) / 0x7fffffff; }; })();
        const hexPick = (arr) => arr[Math.floor(hexRng() * arr.length)];

        // ── Generate hex grid data when both cities are selected ──
        const hasRoute = hexOrigin && hexDest && hexOrigin !== hexDest;
        const hexTerrains = ["plains","forest","hills","mountains","swamp","desert","coast","tundra","jungle","badlands","river_valley","grassland"];
        const hexIcons = { plains:"⚌", forest:"⚍", hills:"△", mountains:"▲", swamp:"≋", desert:"∷", coast:"〜", tundra:"✧", jungle:"⚍", badlands:"⊿", river_valley:"≈", grassland:"⚌" };
        const hexColors = { plains:"rgba(139,195,74,0.18)", forest:"rgba(46,125,50,0.22)", hills:"rgba(168,140,80,0.18)", mountains:"rgba(120,120,140,0.22)", swamp:"rgba(60,100,60,0.22)", desert:"rgba(210,180,100,0.20)", coast:"rgba(70,150,200,0.18)", tundra:"rgba(180,210,230,0.18)", jungle:"rgba(20,120,40,0.24)", badlands:"rgba(160,80,40,0.20)", river_valley:"rgba(60,140,180,0.16)", grassland:"rgba(160,200,60,0.16)" };
        const moveCosts = { plains:1, forest:1.5, hills:2, mountains:3, swamp:2, desert:2, coast:1, tundra:2.5, jungle:2, badlands:2, river_valley:1, grassland:1 };
        const hexDangers = { plains:["bandits","wolves","wild horses","stampede"], forest:["owlbears","giant spiders","elf patrol","dire wolves","treant"], hills:["goblins","wyvern","rockslide","hill giant","harpy nest"], mountains:["drake","stone giant","avalanche","griffon","orc warband"], swamp:["hydra","cultists","will-o-wisp","black dragon","bog hag"], desert:["sandworm","nomad raiders","mirage","scorpion swarm","mummy"], coast:["pirates","sea serpent","storm","merfolk ambush","kraken spawn"], tundra:["yeti","frost wolves","blizzard","ice troll","white dragon"], jungle:["yuan-ti","panther pack","poison dart trap","dinosaur","vine blight"], badlands:["gnolls","dust devil","basilisk","vulture flock","bandit lord"], river_valley:["river trolls","nixies","flash flood","crocodile","water elemental"], grassland:["centaur patrol","bulette","grass fire","ankheg","horseback raiders"] };
        const hexFeatures = ["river crossing","ancient waystone","abandoned camp","hidden cave","merchant trail","standing stones","old watchtower","sacred grove","mineral vein","crossroads","ruined bridge","druid circle","old battlefield","hermit's hut","hot springs","fairy ring","ancient tree","collapsed mine","refugee camp","signal tower","border marker","abandoned shrine","bandit hideout","hunter's lodge"];
        const hexWeathers = ["Clear Skies","Partly Cloudy","Overcast","Light Rain","Heavy Rain","Thick Fog","Strong Winds","Thunderstorm","Drizzle","Haze"];
        const hexDescriptions = { plains:"Wide open grasslands stretch to the horizon, dotted with wildflowers and low brush.", forest:"Dense canopy overhead filters the sunlight into dappled patterns on the forest floor.", hills:"Rolling terrain rises and falls in gentle waves, offering vistas of the surrounding lands.", mountains:"Jagged peaks and narrow passes dominate this unforgiving landscape.", swamp:"Murky water and gnarled roots make every step treacherous in this fetid marsh.", desert:"An endless expanse of sun-scorched sand and rock, shimmering with heat.", coast:"Salt-crusted cliffs overlook churning waves and sandy coves.", tundra:"Frozen wasteland of permafrost and biting winds under a pale sky.", jungle:"Thick tropical vegetation creates a wall of green, alive with strange calls.", badlands:"Eroded canyons and crumbling mesas of red and orange stone.", river_valley:"A fertile floodplain hugging a wide, slow-moving river.", grassland:"Tall grass sways in the wind like a golden sea." };

        // Generate path hexes — more hexes, wider grid
        const hexCount = hasRoute ? 8 + Math.floor(hexRng() * 8) : 0;
        const GRID_COLS = Math.min(hexCount, 8);
        const GRID_ROWS = Math.ceil(hexCount / GRID_COLS);
        const originRegion = regions.find(r => (r.cities || []).includes(hexOrigin));
        const destRegion = regions.find(r => (r.cities || []).includes(hexDest));

        const hexes = [];
        for (let hi = 0; hi < hexCount; hi++) {
          const pct = hi / Math.max(hexCount - 1, 1);
          const baseT = originRegion?.terrain || "plains";
          const endT = destRegion?.terrain || "forest";
          // Terrain transitions: start region → mixed middle → end region
          let terrain;
          if (hi === 0) terrain = baseT;
          else if (hi === hexCount - 1) terrain = endT;
          else if (pct < 0.3) terrain = hexRng() < 0.7 ? baseT : hexPick(hexTerrains);
          else if (pct > 0.7) terrain = hexRng() < 0.7 ? endT : hexPick(hexTerrains);
          else terrain = hexPick(hexTerrains);

          const dangerRoll = hexRng();
          const danger = dangerRoll < 0.35 ? hexPick(hexDangers[terrain] || hexDangers.plains) : null;
          const dangerCR = danger ? (2 + Math.floor(hexRng() * 10)) : 0;
          const featureRoll = hexRng();
          const feature = featureRoll < 0.5 ? hexPick(hexFeatures) : null;
          const weather = hexPick(hexWeathers);
          const elevation = terrain === "mountains" ? "High" : terrain === "hills" ? "Elevated" : terrain === "coast" || terrain === "swamp" || terrain === "river_valley" ? "Low" : "Normal";
          const moveCost = moveCosts[terrain] || 1;
          const restSafe = !danger && hexRng() > 0.3;

          hexes.push({
            idx: hi, terrain, danger, dangerCR, feature, weather, elevation, moveCost, restSafe,
            explored: hi <= hexPartyPos,
            icon: hexIcons[terrain] || "◎",
            color: hexColors[terrain] || hexColors.plains,
            description: hexDescriptions[terrain] || "Unknown terrain.",
          });
        }

        // ── Pointy-top hex geometry helper (better for grid layout) ──
        const HEX_R = 36;
        const HEX_W = Math.sqrt(3) * HEX_R;
        const HEX_H = HEX_R * 2;
        const hexPointsStr = (cx, cy) => {
          const pts = [];
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 180) * (60 * a - 30);
            pts.push(`${cx + HEX_R * Math.cos(angle)},${cy + HEX_R * Math.sin(angle)}`);
          }
          return pts.join(" ");
        };

        // Arrange hexes in a proper hex grid (offset rows)
        const hexPositions = hexes.map((h, i) => {
          const col = i % GRID_COLS;
          const row = Math.floor(i / GRID_COLS);
          const xOff = row % 2 === 1 ? HEX_W * 0.5 : 0;
          return { x: 55 + col * HEX_W + xOff, y: 55 + row * (HEX_H * 0.75), ...h };
        });
        const svgW = 55 + GRID_COLS * HEX_W + HEX_W * 0.5 + 20;
        const svgH = 55 + GRID_ROWS * (HEX_H * 0.75) + HEX_R + 10;
        const totalMoveCost = hexes.reduce((s, h) => s + h.moveCost, 0);

        const currentHex = hexes[hexPartyPos] || null;
        const detailHex = hexSelectedHex != null ? hexes[hexSelectedHex] : null;

        return (
        <div style={{ flex:1, overflowY:"auto", padding:"24px 48px", minHeight:0 }}>
          <div style={{ paddingBottom:40 }}>
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontFamily:T.heading, fontSize:24, color:T.text, marginBottom:4, letterSpacing:"0.5px" }}>Wilderness Exploration</h2>
              <div style={{ fontSize:12, color:T.textMuted }}>Hexcrawl & Discovery</div>
            </div>

            {/* Travel Planner */}
            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:20, marginBottom:24 }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Travel Planner</div>
              <div style={{ display:"flex", gap:12, alignItems:"flex-end", flexWrap:"wrap", marginBottom:12 }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontSize:9, color:T.textMuted, marginBottom:4 }}>From</div>
                  <select value={hexOrigin} onChange={e => { setHexOrigin(e.target.value); setHexPartyPos(0); setHexSelectedHex(null); setHexLog([]); }} style={{ width:"100%", padding:"8px", background:T.bgInput, border:`1px solid ${T.border}`, borderRadius:"3px", color:T.text, fontFamily:T.body, fontSize:10 }}>
                    <option value="">Select origin city...</option>
                    {cities.map(c => <option key={c.id} value={c.name}>{c.name} ({c.region})</option>)}
                  </select>
                </div>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontSize:9, color:T.textMuted, marginBottom:4 }}>To</div>
                  <select value={hexDest} onChange={e => { setHexDest(e.target.value); setHexPartyPos(0); setHexSelectedHex(null); setHexLog([]); }} style={{ width:"100%", padding:"8px", background:T.bgInput, border:`1px solid ${T.border}`, borderRadius:"3px", color:T.text, fontFamily:T.body, fontSize:10 }}>
                    <option value="">Select destination city...</option>
                    {cities.filter(c => c.name !== hexOrigin).map(c => <option key={c.id} value={c.name}>{c.name} ({c.region})</option>)}
                  </select>
                </div>
              </div>
              {hasRoute && (
                <div style={{ padding:12, background:"rgba(0,0,0,0.2)", borderRadius:"3px", marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                    <div style={{ fontSize:10, color:T.textMuted }}>Route: <span style={{ color:T.text }}>{hexOrigin} → {hexDest}</span></div>
                    <div style={{ display:"flex", gap:12 }}>
                      <span style={{ fontSize:9, color:T.gold, fontFamily:T.ui, letterSpacing:"0.5px" }}>{hexCount} hexes</span>
                      <span style={{ fontSize:9, color:T.textMuted, fontFamily:T.ui, letterSpacing:"0.5px" }}>~{Math.round(totalMoveCost)} days travel</span>
                      <span style={{ fontSize:9, color:T.crimson, fontFamily:T.ui, letterSpacing:"0.5px" }}>{hexes.filter(h => h.danger).length} threats</span>
                    </div>
                  </div>
                  <div style={{ width:"100%", height:4, background:"rgba(0,0,0,0.3)", borderRadius:"2px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${hexCount > 1 ? (hexPartyPos / (hexCount - 1)) * 100 : 0}%`, background:T.crimson, transition:"width 0.3s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* ═══ HEX MAP ═══ */}
            <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", marginBottom:24, overflow:"hidden" }}>
              {hasRoute ? (
                <div style={{ overflowX:"auto", padding:"20px 16px" }}>
                  <svg width={svgW} height={svgH} style={{ display:"block", minWidth:svgW }}>
                    <defs>
                      <filter id="hexGlow"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(212,67,58,0.5)"/></filter>
                      <filter id="hexFog"><feGaussianBlur stdDeviation="2"/></filter>
                    </defs>
                    {/* Path connections — sequential hex path */}
                    {hexPositions.slice(0, -1).map((h, i) => {
                      const next = hexPositions[i + 1];
                      const traveled = i < hexPartyPos;
                      return <line key={`path-${i}`} x1={h.x} y1={h.y} x2={next.x} y2={next.y} stroke={traveled ? "rgba(212,67,58,0.6)" : "rgba(255,255,255,0.08)"} strokeWidth={traveled ? 2.5 : 1.2} strokeDasharray={traveled ? "none" : "4,6"} />;
                    })}
                    {/* Hexes */}
                    {hexPositions.map((h, i) => {
                      const isParty = i === hexPartyPos;
                      const isSelected = i === hexSelectedHex;
                      const isExplored = h.explored;
                      const isAdjacent = Math.abs(i - hexPartyPos) === 1;
                      const isNext = i === hexPartyPos + 1;
                      return (
                        <g key={`hex-${i}`} style={{ cursor:"pointer" }} onClick={() => setHexSelectedHex(isSelected ? null : i)}>
                          {/* Hex shape */}
                          <polygon points={hexPointsStr(h.x, h.y)}
                            fill={isParty ? "rgba(212,67,58,0.22)" : isExplored ? h.color : "rgba(255,255,255,0.02)"}
                            stroke={isSelected ? "rgba(212,67,58,0.8)" : isParty ? "rgba(212,67,58,0.7)" : isNext ? "rgba(212,67,58,0.3)" : isExplored ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}
                            strokeWidth={isSelected ? 2.5 : isParty ? 2 : isNext ? 1.5 : 0.8}
                            filter={isParty ? "url(#hexGlow)" : "none"}
                          />
                          {/* Fog overlay for unexplored */}
                          {!isExplored && <polygon points={hexPointsStr(h.x, h.y)} fill="rgba(8,8,12,0.55)" stroke="none" style={{pointerEvents:"none"}} />}
                          {/* Terrain icon */}
                          <text x={h.x} y={h.y - 2} textAnchor="middle" fontSize={isExplored ? 20 : 12} style={{ pointerEvents:"none", opacity: isExplored ? 1 : 0.3 }}>{isExplored ? h.icon : "?"}</text>
                          {/* Label */}
                          <text x={h.x} y={h.y + 18} textAnchor="middle" fontSize={6.5} fill={isExplored ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)"} style={{ pointerEvents:"none", fontFamily:T.ui, letterSpacing:"0.5px", textTransform:"uppercase" }}>
                            {i === 0 ? hexOrigin.slice(0, 9) : i === hexCount - 1 ? hexDest.slice(0, 9) : isExplored ? h.terrain.replace("_"," ").slice(0, 9) : "???"}
                          </text>
                          {/* Party marker */}
                          {isParty && <text x={h.x} y={h.y - 20} textAnchor="middle" fontSize={16} style={{ pointerEvents:"none" }}>⚔</text>}
                          {/* Danger indicator */}
                          {h.danger && isExplored && <><circle cx={h.x + HEX_R * 0.55} cy={h.y - HEX_R * 0.45} r={6} fill="rgba(212,67,58,0.85)" /><text x={h.x + HEX_R * 0.55} y={h.y - HEX_R * 0.45 + 3} textAnchor="middle" fontSize={7} fill="#fff" style={{pointerEvents:"none"}}>!</text></>}
                          {/* Feature indicator */}
                          {h.feature && isExplored && <><circle cx={h.x - HEX_R * 0.55} cy={h.y - HEX_R * 0.45} r={6} fill="rgba(212,67,58,0.85)" /><text x={h.x - HEX_R * 0.55} y={h.y - HEX_R * 0.45 + 3} textAnchor="middle" fontSize={7} fill="#fff" style={{pointerEvents:"none"}}>★</text></>}
                          {/* Move cost badge */}
                          {isExplored && h.moveCost > 1 && <><rect x={h.x - 8} y={h.y + 22} width={16} height={10} rx={2} fill="rgba(0,0,0,0.5)" /><text x={h.x} y={h.y + 30} textAnchor="middle" fontSize={6} fill="rgba(255,200,100,0.8)" style={{pointerEvents:"none"}}>{h.moveCost}d</text></>}
                          {/* Safe rest indicator */}
                          {isExplored && h.restSafe && !h.danger && <circle cx={h.x + HEX_R * 0.55} cy={h.y + HEX_R * 0.35} r={4} fill="rgba(94,224,154,0.6)" />}
                          {/* Hex number */}
                          <text x={h.x} y={h.y - HEX_R + 10} textAnchor="middle" fontSize={5} fill="rgba(255,255,255,0.2)" style={{pointerEvents:"none"}}>{i + 1}</text>
                        </g>
                      );
                    })}
                    {/* Legend */}
                    <g transform={`translate(${svgW - 110}, ${svgH - 50})`}>
                      <rect x={0} y={0} width={100} height={45} rx={3} fill="rgba(0,0,0,0.4)" />
                      <circle cx={12} cy={12} r={4} fill="rgba(212,67,58,0.85)" /><text x={20} y={15} fontSize={5.5} fill="rgba(255,255,255,0.5)" style={{fontFamily:"'Cinzel',serif"}}>Danger</text>
                      <circle cx={12} cy={24} r={4} fill="rgba(212,67,58,0.85)" /><text x={20} y={27} fontSize={5.5} fill="rgba(255,255,255,0.5)" style={{fontFamily:"'Cinzel',serif"}}>Feature</text>
                      <circle cx={12} cy={36} r={4} fill="rgba(94,224,154,0.6)" /><text x={20} y={39} fontSize={5.5} fill="rgba(255,255,255,0.5)" style={{fontFamily:"'Cinzel',serif"}}>Safe Rest</text>
                    </g>
                  </svg>
                </div>
              ) : (
                <div style={{ padding:40, textAlign:"center" }}>
                  <div style={{ fontSize:14, color:T.textMuted, fontStyle:"italic", marginBottom:8 }}>Select an origin and destination to generate the hex map</div>
                  <div style={{ fontSize:10, color:T.textFaint }}>Each hex represents a day's travel through varied terrain</div>
                </div>
              )}
            </div>

            {hasRoute && (
              <div style={{ display:"grid", gridTemplateColumns:detailHex ? "1fr 1fr" : "1fr", gap:16, marginBottom:24 }}>
                {/* Current Position / Actions */}
                <div>
                  {/* Current Hex Info */}
                  {currentHex && (
                    <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16, marginBottom:16 }}>
                      <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Current Position — Hex {hexPartyPos + 1}/{hexCount}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                        <span style={{ fontSize:28 }}>{currentHex.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, color:T.text, fontWeight:400, textTransform:"capitalize" }}>{currentHex.terrain.replace("_"," ")}</div>
                          <div style={{ fontSize:10, color:T.textMuted }}>Weather: {currentHex.weather} · Elevation: {currentHex.elevation}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:16, color:T.gold, fontFamily:T.ui }}>{currentHex.moveCost}d</div>
                          <div style={{ fontSize:7, color:T.textFaint }}>TRAVEL</div>
                        </div>
                      </div>
                      {currentHex.description && <div style={{ fontSize:10, color:T.textDim, fontStyle:"italic", lineHeight:1.5, marginBottom:10, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>{currentHex.description}</div>}
                      {currentHex.feature && <div style={{ fontSize:10, color:T.gold, marginBottom:6, padding:"6px 8px", background:"rgba(212,67,58,0.06)", borderRadius:3, border:"1px solid rgba(212,67,58,0.12)" }}>★ Feature: {currentHex.feature}</div>}
                      {currentHex.danger && (
                        <div style={{ padding:"8px 10px", background:"rgba(212,67,58,0.06)", borderRadius:3, border:"1px solid rgba(212,67,58,0.12)", marginBottom:6 }}>
                          <div style={{ fontSize:10, color:T.crimson, marginBottom:6 }}>⚠ {currentHex.danger} (CR {currentHex.dangerCR})</div>
                          {/* Decision buttons for encounters */}
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            <button onClick={() => {
                              const enc = { id: "enc-hex-" + Date.now(), name: `${currentHex.danger} (Hex ${hexPartyPos + 1})`, location: `${hexOrigin} → ${hexDest} route`, notes: `Terrain: ${currentHex.terrain}, Weather: ${currentHex.weather}, CR ${currentHex.dangerCR}`, participants: [{ type:"partyAll" }] };
                              setData(d => ({ ...d, encounters: [...(d.encounters || []), enc], activity: [{ time:"Just now", text:`Encounter added: ${currentHex.danger}` }, ...(d.activity || [])].slice(0, 20) }));
                              setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text:`⚔ FIGHT — Engaged ${currentHex.danger}! Encounter added to Play tab.`, type:"combat" }, ...prev].slice(0, 30));
                            }} style={{ padding:"6px 12px", background:"rgba(212,67,58,0.15)", border:`1px solid ${T.crimsonBorder}`, borderRadius:3, color:T.crimson, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontWeight:600 }}>
                              ⚔ Fight
                            </button>
                            <button onClick={() => {
                              const roll = Math.floor(Math.random() * 20) + 1;
                              const dc = 8 + currentHex.dangerCR;
                              const success = roll >= dc;
                              setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text: success ? `⚖ NEGOTIATE (${roll} vs DC ${dc}) — Resolved ${currentHex.danger} peacefully.` : `⚖ NEGOTIATE (${roll} vs DC ${dc}) — Failed! ${currentHex.danger} attacks!`, type: success ? "success" : "combat" }, ...prev].slice(0, 30));
                              if (!success) {
                                const enc = { id: "enc-hex-" + Date.now(), name: `${currentHex.danger} — Failed Negotiation`, location: `${hexOrigin} → ${hexDest} route`, notes: `Failed negotiate DC ${dc}. Terrain: ${currentHex.terrain}, CR ${currentHex.dangerCR}`, participants: [{ type:"partyAll" }] };
                                setData(d => ({ ...d, encounters: [...(d.encounters || []), enc], activity: [{ time:"Just now", text:`Encounter: ${currentHex.danger} (failed negotiate)` }, ...(d.activity || [])].slice(0, 20) }));
                              }
                            }} style={{ padding:"6px 12px", background:"rgba(212,67,58,0.1)", border:`1px solid rgba(212,67,58,0.2)`, borderRadius:3, color:T.gold, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
                              ⚖ Negotiate
                            </button>
                            <button onClick={() => {
                              const roll = Math.floor(Math.random() * 20) + 1;
                              const dc = 10 + Math.floor(currentHex.dangerCR / 2);
                              const success = roll >= dc;
                              setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text: success ? `⊘ SNEAK (${roll} vs DC ${dc}) — Bypassed ${currentHex.danger} undetected.` : `⊘ SNEAK (${roll} vs DC ${dc}) — Spotted by ${currentHex.danger}! Disadvantaged fight!`, type: success ? "success" : "combat" }, ...prev].slice(0, 30));
                              if (!success) {
                                const enc = { id: "enc-hex-" + Date.now(), name: `${currentHex.danger} — Ambush (spotted)`, location: `${hexOrigin} → ${hexDest} route`, notes: `Failed stealth DC ${dc}. Party surprised! CR ${currentHex.dangerCR}`, participants: [{ type:"partyAll" }] };
                                setData(d => ({ ...d, encounters: [...(d.encounters || []), enc], activity: [{ time:"Just now", text:`Ambush: ${currentHex.danger} (failed sneak)` }, ...(d.activity || [])].slice(0, 20) }));
                              }
                            }} style={{ padding:"6px 12px", background:"rgba(0,0,0,0.08)", border:`1px solid ${T.border}`, borderRadius:3, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
                              ⊘ Sneak
                            </button>
                            <button onClick={() => {
                              const roll = Math.floor(Math.random() * 20) + 1;
                              const dc = 8 + Math.floor(currentHex.dangerCR / 3);
                              const success = roll >= dc;
                              setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text: success ? `↺ FLEE (${roll} vs DC ${dc}) — Escaped ${currentHex.danger}! Retreated 1 hex.` : `↺ FLEE (${roll} vs DC ${dc}) — Cannot escape! Forced to fight ${currentHex.danger}!`, type: success ? "neutral" : "combat" }, ...prev].slice(0, 30));
                              if (success) { setHexPartyPos(p => Math.max(0, p - 1)); }
                              else {
                                const enc = { id: "enc-hex-" + Date.now(), name: `${currentHex.danger} — Failed Escape`, location: `${hexOrigin} → ${hexDest} route`, notes: `Failed flee DC ${dc}. No retreat possible! CR ${currentHex.dangerCR}`, participants: [{ type:"partyAll" }] };
                                setData(d => ({ ...d, encounters: [...(d.encounters || []), enc], activity: [{ time:"Just now", text:`Forced fight: ${currentHex.danger} (failed flee)` }, ...(d.activity || [])].slice(0, 20) }));
                              }
                            }} style={{ padding:"6px 12px", background:"rgba(0,0,0,0.08)", border:`1px solid ${T.border}`, borderRadius:3, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer" }}>
                              ↺ Flee
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Action buttons */}
                      <div style={{ display:"flex", gap:6, marginTop:10, paddingTop:10, borderTop:`1px solid ${T.border}` }}>
                        <button onClick={() => {
                          const roll = Math.floor(Math.random() * 20) + 1;
                          const dc = currentHex.terrain === "forest" || currentHex.terrain === "jungle" || currentHex.terrain === "grassland" ? 10 : currentHex.terrain === "desert" || currentHex.terrain === "tundra" ? 18 : 13;
                          const success = roll >= dc;
                          setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text: success ? `⚘ FORAGE (${roll} vs DC ${dc}) — Found food and water. Party resupplied.` : `⚘ FORAGE (${roll} vs DC ${dc}) — Found nothing useful.`, type: success ? "success" : "neutral" }, ...prev].slice(0, 30));
                        }} style={{ padding:"6px 10px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:3, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"0.5px", textTransform:"uppercase", cursor:"pointer" }}>
                          ⚘ Forage
                        </button>
                        <button onClick={() => {
                          if (hexPartyPos < hexCount - 1) {
                            const nextH = hexes[hexPartyPos + 1];
                            setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text: `⊙ SCOUT — Hex ${hexPartyPos + 2}: ${nextH.terrain.replace("_"," ")}${nextH.danger ? `, ⚠ ${nextH.danger} present!` : ""}${nextH.feature ? `, ★ ${nextH.feature}` : ""}`, type: nextH.danger ? "danger" : "success" }, ...prev].slice(0, 30));
                            nextH.explored = true;
                            setHexSelectedHex(hexPartyPos + 1);
                          }
                        }} disabled={hexPartyPos >= hexCount - 1} style={{ padding:"6px 10px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:3, color:hexPartyPos >= hexCount - 1 ? T.textFaint : T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"0.5px", textTransform:"uppercase", cursor: hexPartyPos >= hexCount - 1 ? "not-allowed" : "pointer", opacity: hexPartyPos >= hexCount - 1 ? 0.5 : 1 }}>
                          ⊙ Scout Ahead
                        </button>
                        <button onClick={() => {
                          const restSafe = currentHex.restSafe;
                          const ambushRoll = Math.floor(Math.random() * 20) + 1;
                          const ambush = !restSafe && ambushRoll <= 5;
                          if (ambush) {
                            const ambushDanger = currentHex.danger || "night prowlers";
                            setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text:`⌂ CAMP — Ambushed during the night by ${ambushDanger}!`, type:"combat" }, ...prev].slice(0, 30));
                            const enc = { id: "enc-hex-" + Date.now(), name: `Night Ambush: ${ambushDanger}`, location: `${hexOrigin} → ${hexDest} route, Hex ${hexPartyPos + 1}`, notes: `Night ambush while camping in ${currentHex.terrain}. Party may be surprised.`, participants: [{ type:"partyAll" }] };
                            setData(d => ({ ...d, encounters: [...(d.encounters || []), enc], activity: [{ time:"Just now", text:`Night ambush: ${ambushDanger}` }, ...(d.activity || [])].slice(0, 20) }));
                          } else {
                            setHexLog(prev => [{ time:`Hex ${hexPartyPos + 1}`, text: restSafe ? "⌂ CAMP — Restful night. Party recovered." : `⌂ CAMP — Uneasy rest (watch roll: ${ambushRoll}). Party recovered but exhausted.`, type: restSafe ? "success" : "neutral" }, ...prev].slice(0, 30));
                          }
                        }} style={{ padding:"6px 10px", background: currentHex.restSafe ? "rgba(94,224,154,0.06)" : "rgba(0,0,0,0.08)", border:`1px solid ${currentHex.restSafe ? "rgba(94,224,154,0.15)" : T.border}`, borderRadius:3, color: currentHex.restSafe ? T.green : T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"0.5px", textTransform:"uppercase", cursor:"pointer" }}>
                          ⌂ Make Camp
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Movement Controls */}
                  <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                    <button disabled={hexPartyPos <= 0} onClick={() => { setHexPartyPos(p => Math.max(0, p - 1)); setHexSelectedHex(null); }} style={{ flex:1, padding:"10px", background:hexPartyPos <= 0 ? "rgba(0,0,0,0.1)" : T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", color:hexPartyPos <= 0 ? T.textFaint : T.text, fontFamily:T.ui, fontSize:9, letterSpacing:"1px", textTransform:"uppercase", cursor:hexPartyPos <= 0 ? "not-allowed" : "pointer", opacity:hexPartyPos <= 0 ? 0.5 : 1 }}>
                      ◄ Retreat
                    </button>
                    <button disabled={hexPartyPos >= hexCount - 1} onClick={() => {
                      const nextPos = hexPartyPos + 1;
                      const nextHex = hexes[nextPos];
                      setHexPartyPos(nextPos);
                      setHexSelectedHex(null);
                      if (nextHex) {
                        const entries = [];
                        entries.push({ time: `Hex ${nextPos + 1}`, text: `Entered ${nextHex.terrain.replace("_"," ")} — ${nextHex.weather}`, type:"neutral" });
                        if (nextHex.feature) entries.push({ time: `Hex ${nextPos + 1}`, text: `★ Discovered: ${nextHex.feature}`, type:"feature" });
                        if (nextHex.danger) entries.push({ time: `Hex ${nextPos + 1}`, text: `⚠ ${nextHex.danger} blocks the path! (CR ${nextHex.dangerCR})`, type:"danger" });
                        setHexLog(prev => [...entries.reverse(), ...prev].slice(0, 30));
                      }
                    }} style={{ flex:2, padding:"10px", background:hexPartyPos >= hexCount - 1 ? "rgba(0,0,0,0.1)" : "linear-gradient(135deg, rgba(212,67,58,0.2), transparent)", border:`1px solid ${hexPartyPos >= hexCount - 1 ? T.border : T.crimsonBorder}`, borderRadius:"4px", color:hexPartyPos >= hexCount - 1 ? T.textFaint : T.crimson, fontFamily:T.ui, fontSize:9, letterSpacing:"1.5px", textTransform:"uppercase", cursor:hexPartyPos >= hexCount - 1 ? "not-allowed" : "pointer", fontWeight:600, opacity:hexPartyPos >= hexCount - 1 ? 0.5 : 1 }}>
                      {hexPartyPos >= hexCount - 1 ? `✓ Arrived at ${hexDest}` : "Advance ►"}
                    </button>
                  </div>
                  {/* Journey Log */}
                  {hexLog.length > 0 && (
                    <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16 }}>
                      <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:10 }}>Journey Log</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        {hexLog.slice(0, 12).map((entry, i) => (
                          <div key={i} style={{ fontSize:10, color:T.textMuted, borderLeft:`2px solid ${entry.type === "combat" || entry.type === "danger" ? T.crimson : entry.type === "feature" || entry.type === "success" ? T.gold : T.border}`, paddingLeft:8, lineHeight:1.5 }}>
                            <span style={{ color:T.textFaint, marginRight:8 }}>{entry.time}</span>{entry.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Hex Detail */}
                {detailHex && (
                  <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"4px", padding:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div style={{ fontSize:10, color:T.textFaint, fontFamily:T.ui, letterSpacing:"1.5px", textTransform:"uppercase" }}>Hex {hexSelectedHex + 1} Details</div>
                      <button onClick={() => setHexSelectedHex(null)} style={{ background:"none", border:"none", color:T.textFaint, cursor:"pointer", fontSize:14 }}>×</button>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                      <span style={{ fontSize:32 }}>{detailHex.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:16, color:T.text, fontFamily:T.heading, textTransform:"capitalize" }}>{detailHex.terrain}</div>
                        <div style={{ fontSize:10, color:T.textMuted }}>{detailHex.explored ? `Weather: ${detailHex.weather}` : "Unexplored territory"}</div>
                      </div>
                      {detailHex.explored && (
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:18, color:T.gold, fontFamily:T.ui }}>{detailHex.moveCost || 1}d</div>
                          <div style={{ fontSize:8, color:T.textFaint, letterSpacing:"0.5px" }}>TRAVEL</div>
                        </div>
                      )}
                    </div>
                    {detailHex.explored ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {/* Description */}
                        {detailHex.description && (
                          <div style={{ fontSize:11, color:T.textDim, lineHeight:1.6, fontStyle:"italic", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                            {detailHex.description}
                          </div>
                        )}
                        {/* Stats Row */}
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                          <div style={{ textAlign:"center", padding:"8px 4px", background:T.bgHover, borderRadius:"3px" }}>
                            <div style={{ fontSize:14, color:T.text, fontFamily:T.ui }}>{detailHex.elevation || "—"}</div>
                            <div style={{ fontSize:7, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginTop:2 }}>Elevation</div>
                          </div>
                          <div style={{ textAlign:"center", padding:"8px 4px", background:T.bgHover, borderRadius:"3px" }}>
                            <div style={{ fontSize:14, color:detailHex.dangerCR ? T.crimson : T.textFaint, fontFamily:T.ui }}>{detailHex.dangerCR || "—"}</div>
                            <div style={{ fontSize:7, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginTop:2 }}>Threat CR</div>
                          </div>
                          <div style={{ textAlign:"center", padding:"8px 4px", background:detailHex.restSafe ? "rgba(94,224,154,0.08)" : T.bgHover, borderRadius:"3px", border:detailHex.restSafe ? "1px solid rgba(94,224,154,0.2)" : "none" }}>
                            <div style={{ fontSize:14, color:detailHex.restSafe ? T.green : T.textFaint, fontFamily:T.ui }}>{detailHex.restSafe ? "✓" : "✗"}</div>
                            <div style={{ fontSize:7, color:T.textFaint, letterSpacing:"1px", textTransform:"uppercase", marginTop:2 }}>Safe Rest</div>
                          </div>
                        </div>
                        {detailHex.feature && (
                          <div style={{ padding:"10px 12px", background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.15)", borderRadius:"3px" }}>
                            <div style={{ fontSize:9, color:T.gold, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Feature</div>
                            <div style={{ fontSize:11, color:T.textMuted, textTransform:"capitalize" }}>{detailHex.feature}</div>
                          </div>
                        )}
                        {detailHex.danger && (
                          <div style={{ padding:"10px 12px", background:"rgba(212,67,58,0.06)", border:"1px solid rgba(212,67,58,0.15)", borderRadius:"3px" }}>
                            <div style={{ fontSize:9, color:T.crimson, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Danger — CR {detailHex.dangerCR || "?"}</div>
                            <div style={{ fontSize:11, color:T.textMuted, textTransform:"capitalize" }}>{detailHex.danger}</div>
                          </div>
                        )}
                        {!detailHex.feature && !detailHex.danger && (
                          <div style={{ fontSize:10, color:T.textFaint, fontStyle:"italic" }}>No notable features or dangers in this hex.</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ fontSize:10, color:T.textFaint, fontStyle:"italic", textAlign:"center", padding:20 }}>
                        This hex has not been explored yet. Advance the party to reveal its contents.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        );
      })()}

      {/* ══════════ TOWN MAP OVERLAY ══════════ */}
      {townView && (() => {
        const cityObj = (data.cities || []).find(c => c.name === townView);
        // Check if this city's region is destroyed/conquered — use destroyed map variant (only for live campaigns)
        const cityRegion = (data.regions || []).find(r => r.name === cityObj?.region);
        const isDestroyed = isLive && cityRegion && (cityRegion.state === "destroyed" || cityRegion.state === "conquered");
        const townImgKey = isDestroyed && window.TOWN_IMAGES?.[townView + "_destroyed"] ? townView + "_destroyed" : townView;
        const townImg = window.TOWN_IMAGES?.[townImgKey];
        const townMeta = window.TOWN_METADATA?.[townView];
        if (!townImg) return null;

        const buildings = townMeta?.buildings || [];
        const townCW = townMeta?.canvasWidth || 1600;
        const townCH = townMeta?.canvasHeight || 1200;
        // Auto-fit: if zoom is 0, calculate zoom to fit viewport (~80% of window)
        const effectiveZoom = townZoom > 0 ? townZoom : Math.min(
          (typeof window !== "undefined" ? window.innerWidth * 0.75 : 1200) / townCW,
          (typeof window !== "undefined" ? window.innerHeight * 0.80 : 900) / townCH
        );
        const hovBldg = townHovBldg;
        const setHovBldg = setTownHovBldg;
        const selBldg = townSelBldg;
        const setSelBldg = setTownSelBldg;

        // Map building metadata types to matching city data
        const shopData = cityObj?.shops || [];
        const tavernData = cityObj?.tavern || null;

        const getBuildingDetail = (bldg) => {
          if (bldg.type === "shop") {
            const match = shopData.find(s => s.type?.toLowerCase().includes(bldg.name?.toLowerCase()?.split(" ")[0]) || s.name?.toLowerCase().includes(bldg.name?.toLowerCase()?.split(" ")[0]));
            if (match) return { ...bldg, detail: match, detailType: "shop" };
          }
          if (bldg.type === "tavern" && tavernData) {
            return { ...bldg, detail: tavernData, detailType: "tavern" };
          }
          return { ...bldg, detail: null, detailType: bldg.type };
        };

        return (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
            background: "rgba(15,12,8,0.95)", display: "flex", flexDirection: "column",
          }}>
            {/* Header bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 24px", background: "rgba(32,28,22,0.95)",
              borderBottom: "1px solid rgba(212,67,58,0.2)", flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => { setTownView(null); }} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                  background: "transparent", border: `1px solid ${T.border}`, borderRadius: "3px",
                  color: T.textMuted, fontFamily: T.ui, fontSize: 10, letterSpacing: "1.5px",
                  textTransform: "uppercase", cursor: "pointer",
                }}><ArrowLeft size={12} /> Back to Atlas</button>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 400, color: T.text, fontFamily: "'Cinzel', serif", letterSpacing: "1px" }}>{townView}</div>
                  <div style={{ fontSize: 10, color: T.textFaint, marginTop: 2 }}>
                    {townMeta ? (townMeta.isCapital ? "Capital" : townMeta.population >= 4000 ? "City" : townMeta.population >= 1500 ? "Town" : "Village") : "Settlement"} · Pop. ~{(townMeta?.population || 0).toLocaleString()}
                    {cityObj ? ` · ${cityObj.region}` : ""}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setTownZoom(z => Math.max(0.15, (z > 0 ? z : effectiveZoom) - 0.15))} style={{
                  padding: "4px 10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
                  borderRadius: "3px", color: T.textMuted, cursor: "pointer", fontSize: 14,
                }}>−</button>
                <span style={{ fontSize: 10, color: T.textFaint, fontFamily: T.ui, minWidth: 40, textAlign: "center" }}>{Math.round(effectiveZoom * 100)}%</span>
                <button onClick={() => setTownZoom(z => Math.min(3, (z > 0 ? z : effectiveZoom) + 0.15))} style={{
                  padding: "4px 10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
                  borderRadius: "3px", color: T.textMuted, cursor: "pointer", fontSize: 14,
                }}>+</button>
                {cityObj && (
                  <button onClick={() => { setTownView(null); setTab("cities"); setSel(cityObj); setSelType("city"); }} style={{
                    padding: "6px 14px", background: "rgba(212,67,58,0.12)", border: "1px solid rgba(212,67,58,0.35)",
                    borderRadius: "3px", color: T.gold, fontFamily: T.ui, fontSize: 10,
                    letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
                  }}>City Details</button>
                )}
              </div>
            </div>

            {/* Main content: map + optional detail panel */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Map area */}
              <div ref={townMapContainerRef} style={{
                flex: 1, position: "relative", overflow: "hidden", cursor: "default",
              }}
              >
                <div style={{
                  transform: `scale(${effectiveZoom})`,
                  transformOrigin: "center center", transition: "transform 0.15s ease",
                  width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div style={{ position: "relative", width: townCW, height: townCH }}>
                    <img src={townImg} style={{ width: townCW, height: townCH, display: "block", imageRendering: "auto" }} draggable={false} />

                    {/* Interactive building markers */}
                    {buildings.filter(b => b.type !== "house").map((bldg, bi) => {
                      const bx = bldg.x * townCW;
                      const by = bldg.y * townCH;
                      const bw = bldg.w * townCW;
                      const bh = bldg.h * townCH;
                      const isHov = hovBldg === bi;
                      const isSel = selBldg === bi;
                      const typeColor = bldg.type === "shop" ? T.gold : bldg.type === "tavern" ? "#c88040" : bldg.type === "special" ? "#a06848" : bldg.type === "poi" ? "#4a7a90" : "#888";
                      return (
                        <div key={bi}
                          style={{
                            position: "absolute", left: bx - 4, top: by - 4,
                            width: bw + 8, height: bh + 8,
                            border: `2px solid ${isSel ? typeColor : isHov ? typeColor + "88" : "transparent"}`,
                            borderRadius: "4px", cursor: "pointer",
                            background: isSel ? typeColor + "18" : isHov ? typeColor + "0c" : "transparent",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={() => setHovBldg(bi)}
                          onMouseLeave={() => setHovBldg(null)}
                          onClick={(e) => { e.stopPropagation(); setSelBldg(isSel ? null : bi); }}
                        >
                          {/* Tooltip on hover */}
                          {isHov && !isSel && (
                            <div style={{
                              position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "calc(100% + 8px)",
                              background: "rgba(32,28,22,0.95)", border: `1px solid ${typeColor}44`, borderRadius: "4px",
                              padding: "6px 12px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20,
                            }}>
                              <div style={{ fontSize: 11, color: T.text, fontFamily: "'Cinzel', serif" }}>{bldg.name}</div>
                              <div style={{ fontSize: 9, color: typeColor, textTransform: "uppercase", letterSpacing: "1px" }}>{bldg.type}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Detail side panel when a building is selected */}
              {selBldg !== null && (() => {
                const bldg = buildings[selBldg];
                if (!bldg) return null;
                const bd = getBuildingDetail(bldg);
                const typeColor = bldg.type === "shop" ? T.gold : bldg.type === "tavern" ? "#c88040" : bldg.type === "special" ? "#a06848" : bldg.type === "poi" ? "#4a7a90" : "#888";
                return (
                  <div style={{
                    width: 320, flexShrink: 0, background: "rgba(32,28,22,0.98)",
                    borderLeft: `1px solid ${typeColor}33`, padding: "20px",
                    overflowY: "auto", display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 9, color: typeColor, textTransform: "uppercase", letterSpacing: "2px", border: `1px solid ${typeColor}33`, padding: "3px 8px", borderRadius: "2px" }}>{bldg.type}</span>
                      <button onClick={() => setSelBldg(null)} style={{ background: "none", border: "none", color: T.textFaint, cursor: "pointer", fontSize: 16 }}>×</button>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 400, color: T.text, fontFamily: "'Cinzel', serif", letterSpacing: "0.5px" }}>{bldg.name}</div>

                    {bd.detailType === "shop" && bd.detail && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Owner: <span style={{ color: T.text }}>{bd.detail.owner}</span></div>
                        {bd.detail.ownerPersonality && <div style={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>{bd.detail.ownerPersonality}</div>}
                        {bd.detail.items && bd.detail.items.length > 0 && (
                          <div>
                            <div style={{ fontSize: 9, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Inventory</div>
                            {bd.detail.items.slice(0, 8).map((item, ii) => (
                              <div key={ii} style={{
                                display: "flex", justifyContent: "space-between", padding: "6px 10px",
                                background: "rgba(0,0,0,0.15)", borderRadius: "3px", marginBottom: 4, fontSize: 11,
                              }}>
                                <span style={{ color: T.textMuted }}>{item.name}</span>
                                <span style={{ color: T.gold, fontFamily: T.ui }}>{item.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {bd.detailType === "tavern" && bd.detail && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ fontSize: 14, color: T.text, fontFamily: "'Spectral', serif" }}>{bd.detail.name}</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Innkeeper: <span style={{ color: T.text }}>{bd.detail.innkeeper}</span></div>
                        {bd.detail.innkeeperPersonality && <div style={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>{bd.detail.innkeeperPersonality}</div>}
                        {bd.detail.services && bd.detail.services.length > 0 && (
                          <div>
                            <div style={{ fontSize: 9, color: T.textFaint, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Services</div>
                            {bd.detail.services.map((s, si) => (
                              <div key={si} style={{
                                display: "flex", justifyContent: "space-between", padding: "6px 10px",
                                background: "rgba(0,0,0,0.15)", borderRadius: "3px", marginBottom: 4, fontSize: 11,
                              }}>
                                <span style={{ color: T.textMuted }}>{s.name}</span>
                                <span style={{ color: T.gold, fontFamily: T.ui }}>{s.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {bd.detail.rumor && (
                          <div style={{ fontSize: 11, color: T.questGold, fontStyle: "italic", padding: "8px 12px", background: "rgba(212,67,58,0.06)", border: "1px solid rgba(212,67,58,0.15)", borderRadius: "3px", lineHeight: 1.5 }}>
                            Rumor: "{bd.detail.rumor}"
                          </div>
                        )}
                      </div>
                    )}

                    {bd.detailType === "special" && (
                      <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
                        {(() => {
                          const SPECIAL_DESCRIPTIONS = {
                            "Castle": "The seat of power in this region, a formidable stone fortress with thick curtain walls, corner towers, and a central keep rising above the town. The lord's court convenes in the great hall, where petitions are heard and justice dispensed. A garrison of elite soldiers patrols the battlements day and night. The castle cellars hold armories, dungeons, and passages whose full extent is known only to the castellan.",
                            "Cathedral": "A grand place of worship whose soaring spires pierce the skyline, visible from every corner of town. Stained glass windows cast colored light across stone floors worn smooth by centuries of worshippers. The high clergy perform rites of healing, blessing, and consecration here. A choir fills the nave with hymns at dawn and dusk, and the crypt below holds the remains of the town's most revered figures.",
                            "Mage Tower": "A slender tower that crackles with arcane energy, its upper floors wreathed in faint luminescence on clear nights. The resident mages study the arcane arts within, conducting experiments that occasionally produce alarming sounds and smells. The tower's library contains rare grimoires and spell components, and its observatory tracks celestial events that may influence magical currents.",
                            "Barracks": "The garrison headquarters where the town's soldiers live, train, and equip themselves. Rows of bunks line the upper floors while the ground level holds an armory, mess hall, and briefing room. The watch captain coordinates patrols and guard rotations from a planning chamber covered in maps. In times of crisis, the barracks becomes the military command center for the entire settlement.",
                            "Town Hall": "The center of local governance, a dignified stone building where the town council convenes to debate policy, settle disputes, and manage civic affairs. Tax records, property deeds, and census rolls are stored in vaults below. A public notice board outside announces new ordinances, and the town crier delivers important proclamations from its steps each morning.",
                            "Temple": "A sacred site dedicated to the local deity, its interior filled with the scent of incense and the soft glow of votive candles. Priests and acolytes minister to the faithful, offering spiritual counsel, divine healing, and funeral rites. The temple also serves as a sanctuary in times of danger — its consecrated ground is said to repel undead and fiends.",
                            "Grand Market Hall": "A vast covered marketplace where merchants from across the region gather to trade. The vaulted ceiling echoes with the calls of vendors and the clink of coin. Stalls offer everything from common provisions to exotic imports, and a market court resolves disputes between traders. The hall is busiest on festival days, when traveling merchants arrive with rare goods.",
                            "Guildhall": "The administrative heart of the town's trade guilds, where master craftspeople meet to set standards, arbitrate disputes, and govern the apprenticeship system. The building houses meeting halls, records offices, and a ceremonial chamber for inducting new masters. Its archives contain centuries of economic history and trade agreements.",
                          };
                          return SPECIAL_DESCRIPTIONS[bldg.name] || `A notable structure of importance to ${townView}. This ${bldg.name.toLowerCase()} serves a vital role in the community's governance, defense, or spiritual life.`;
                        })()}
                      </div>
                    )}

                    {bd.detailType === "poi" && (
                      <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
                        {(() => {
                          const POI_DESCRIPTIONS = {
                            "Town Well": "The communal well sits at a crossroads where neighbors gather each morning. The water is cold and clean, drawn from a deep aquifer. It serves as the town's unofficial meeting place — more deals are struck here than in any merchant's shop, and more secrets spilled than at any tavern.",
                            "Fountain": "An ornamental fountain carved from local stone, its basin worn smooth by generations of children sitting on its edge. The central figure — a water nymph or local hero, depending on who you ask — spouts a gentle arc of water that catches the light. Coins glint at the bottom, each one a wish made and forgotten.",
                            "Statue": "A weathered stone statue of a figure in heroic pose, commemorating a deed so great — or so old — that the details have blurred into legend. Pigeons roost on its shoulders, and children play at its base. The inscription, half-eroded, hints at a sacrifice that saved the town in a darker age.",
                            "Notice Board": "A large wooden board bristling with parchments, nails, and wax seals. Job postings compete for space with wanted posters, lost pet notices, and cryptic personal messages. Adventurers check it daily for work, and the town crier updates it each morning with fresh bounties and announcements.",
                            "Shrine": "A small stone shrine set back from the road, adorned with dried flowers, small coins, and handwritten prayers. The carved figure at its center represents a local patron saint or minor deity. Travelers pause here to ask for blessing before long journeys, and mourners come to remember the departed.",
                            "Guard Post": "A fortified checkpoint manned by town guards in rotation. A heavy log barrier can be swung across the road at need. The guards here check cargo for contraband, collect tolls from merchants, and keep a watchful eye for troublemakers. A logbook records all notable comings and goings.",
                            "Market Stall": "A bustling open-air stall with a canvas awning and rough-hewn counters piled with local goods — seasonal produce, cured meats, clay pots, and woven baskets. The vendor calls out prices in a practiced singsong, haggling with regulars and sizing up strangers for what they might pay.",
                            "Horse Stable": "A sturdy timber stable with individual stalls for mounts, a hay loft above, and a small paddock out back. The stable master knows every horse in town by name and temperament. Travelers can board their mounts here, and a selection of riding horses and pack mules are available for purchase or hire.",
                            "Stable": "A well-maintained stable block smelling of fresh hay and horse leather. Stalls line both sides of a central aisle, each with its own water trough and feed bag. The stable hands are skilled with animals and can tend to minor injuries. Mounts can be boarded, purchased, or hired for the road ahead.",
                            "Library": "Floor-to-ceiling shelves hold a collection accumulated over generations — histories, bestiaries, herbalism guides, and a locked cabinet of texts deemed too dangerous for casual reading. The librarian maintains a meticulous catalog and will assist researchers, though certain sections require special permission to access.",
                            "Graveyard": "Rows of headstones lean at weathered angles behind a low iron fence. Older plots near the back are moss-covered and illegible, while newer markers bear fresh flowers. A small chapel stands at the entrance for funeral rites. The groundskeeper insists the cemetery is peaceful, though he refuses to work past sundown.",
                            "Training Ground": "A dirt yard packed hard by countless boots, surrounded by weapon racks, archery targets, and practice dummies stuffed with straw. Town guards and militia drill here at dawn, and the training master offers instruction to anyone willing to take a few bruises. Spectators watch from the fence, placing bets on sparring matches.",
                            "Watchtower": "A tall stone tower rising above the rooftops, offering an unobstructed view of the surrounding countryside. Guards rotate shifts around the clock, scanning for approaching threats, signal fires, or incoming caravans. A brass bell at the top can be heard throughout the town — it rings only for genuine emergencies.",
                            "Garden": "A walled garden lovingly tended by local residents, its paths winding between beds of medicinal herbs, flowering shrubs, and a few ancient fruit trees. Benches tucked into leafy alcoves offer quiet spots for contemplation. The garden is communal, and anyone may pick herbs for personal use — but taking more than your share earns sharp looks.",
                            "Prison": "A squat stone building with barred windows and a heavy iron door. Inside, a handful of cells hold petty criminals, drunks sleeping off bad decisions, and occasionally someone far more dangerous awaiting transport to a larger facility. The jailer is both warden and counselor, and knows everyone's story.",
                            "Warehouse": "A large, practical building used for storing trade goods, seasonal harvests, and supplies. The interior is organized with wooden shelving, marked crates, and a loading dock accessible by cart. The warehouse master keeps detailed inventory logs, and the building is locked and guarded at night to prevent theft.",
                            "Granary": "A raised stone-and-timber building designed to keep grain dry and safe from vermin. The town's food reserves are stored here — enough to last through a harsh winter or short siege. The granary master monitors stores closely and reports to the town council on supply levels. It is one of the most strategically important buildings in town.",
                            "Windmill": "A tall wooden windmill whose cloth-sailed arms turn steadily in the breeze, grinding grain into flour for the town's bakers and households. The miller works long hours during harvest season and is one of the town's essential tradespeople. The rhythmic creaking of the mechanism can be heard across the neighborhood.",
                            "Bathhouse": "A public bathing house heated by a wood-fired furnace beneath stone tubs. Separate areas for men and women offer hot soaks, cold plunges, and steam rooms. The bathhouse is a social institution — townsfolk come to wash, gossip, conduct quiet business, and recover from the aches of hard labor.",
                            "Clocktower": "A handsome stone tower housing a mechanical clock whose chimes mark each hour. The mechanism was built by a master clockmaker and requires daily winding. The tower also serves as a landmark and meeting point — 'meet me at the clocktower' is the most common arrangement in town.",
                            "Dovecote": "A tall, cylindrical stone structure honeycombed with nesting holes for messenger pigeons. The keeper maintains a flock trained to carry messages to several nearby settlements. In times of siege or emergency, these birds become the town's most vital link to the outside world.",
                            "Herbalist Garden": "A meticulously organized garden of medicinal and magical plants, each bed labeled with both common and alchemical names. The herbalist who tends it supplies the local apothecary and healer with ingredients. Some plants are kept behind locked gates — not all herbs here are benign.",
                            "Amphitheater": "A semicircular stone seating area built into a natural slope, used for public performances, town assemblies, and festival celebrations. The acoustics are remarkably good — a speaker at the center can be heard clearly from the highest seats. On market days, traveling bards and theater troupes perform here.",
                            "Pillory": "A wooden restraining device set in a public square, used to punish minor offenders through public humiliation. The stocks hold the convicted in view of passing townsfolk, who may jeer, throw rotten produce, or occasionally offer sympathy. It serves as both punishment and deterrent.",
                            "Wishing Well": "A deep stone well in the town square, its inner walls glinting with hundreds of coins thrown in over generations. Legend holds that wishes made here come true if the coin strikes the bottom without bouncing. Children gather around it on festival days, and even skeptical adults have been known to toss a copper or two.",
                            "Memorial": "A stone monument inscribed with the names of townsfolk lost to war, plague, or disaster. Wreaths and candles are placed here on remembrance days, and families come to trace the names of ancestors with their fingers. The memorial serves as a sobering reminder of the town's resilience through hardship.",
                            "Kennels": "A fenced compound housing the town's working dogs — hunting hounds, guard mastiffs, and herding dogs bred for the surrounding farmland. The kennelmaster breeds and trains animals for both the militia and private buyers. The sound of barking carries across the neighborhood at feeding time.",
                            "Brewery": "A sturdy stone building where local grain and hops are transformed into the ale that fuels the town's taverns. The brewmaster takes pride in several signature recipes passed down through generations. The sweet, yeasty smell of brewing day is a beloved — or dreaded — feature of the neighborhood.",
                            "Smithy Yard": "An open yard adjacent to the main forge where larger metalwork is assembled — gates, wagon fittings, plow blades, and occasionally armor for the guard. An anvil stands on a stump in the center, and the ring of hammer on metal is a constant background rhythm during working hours.",
                            "Lumber Yard": "Stacks of seasoned timber and fresh-cut logs fill this open yard near the town's edge. The lumber merchant supplies builders, carpenters, and coopers throughout the settlement. A large saw pit and drying racks occupy one corner, staffed by burly workers year-round.",
                            "Fish Market": "A stone-floored open market where the day's catch is displayed on beds of crushed ice and wet seaweed. Fishmongers call out their wares in competitive chorus as housewives and cooks pick through the selection. The market opens at dawn and is packed away by midday — fresh fish waits for no one.",
                            "Dye Works": "A pungent workshop where raw textiles are transformed into vibrant fabrics. Vats of indigo, madder, and woad line the yard, and the workers' hands are permanently stained in rainbow hues. The runoff is carefully channeled away from the town's water supply, though the smell is harder to contain.",
                            "Tannery Yard": "A working yard where raw animal hides are transformed into leather through soaking, stretching, and curing. The process is essential but malodorous, which is why the tannery sits downwind of the main settlement. The tanners are skilled craftspeople whose work supplies cobblers, saddlers, and armorers throughout the region.",
                            "Grand Market Hall": "A large covered hall where merchants gather to trade goods in all weather. Stalls line the interior walls, and the central floor hosts auctions, trade negotiations, and seasonal fairs. The market master enforces fair dealing and collects modest fees from vendors.",
                            "Guildhall": "The administrative center of the local trade guilds. Master craftspeople meet here to set prices, resolve disputes, apprentice new members, and coordinate the town's economic life. The building also serves as a court for commercial matters and hosts lavish feasts on guild holidays.",
                          };
                          return POI_DESCRIPTIONS[bldg.name] || `A notable point of interest in ${townView}. This ${bldg.name.toLowerCase()} serves the community and adds character to the settlement.`;
                        })()}
                      </div>
                    )}

                    {!bd.detail && !["special", "poi"].includes(bd.detailType) && (
                      <div style={{ fontSize: 12, color: T.textDim, fontStyle: "italic" }}>A {bldg.type} in {townView}.</div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}

      {/* Add Entity Modal */}
      <AddEntityModal open={addingEntity} onClose={()=>setAddingEntity(false)} tab={tab==="map"?"regions":tab} onAdd={addEntity} data={data} />
    </div>
  );
}

function AddEntityModal({ open, onClose, tab, onAdd, data }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    if (tab==="regions") setForm({ name:"", type:"town", ctrl:"", threat:"low", state:"stable", visited:false, terrain:"" });
    else if (tab==="factions") setForm({ name:"", attitude:"neutral", power:50, trend:"stable", desc:"", color:"#a4b5cc" });
    else if (tab==="pois") setForm({ name:"", type:"ruin", description:"", hook:"", danger:0, major:false, icon:"📍", region:"" });
    else setForm({ name:"", faction:null, loc:"", attitude:"neutral", role:"", alive:true });
  }, [tab, open]);

  return (
    <Modal open={open} onClose={onClose} title={`Add ${tab.slice(0,-1)}`}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <Input value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Name" />
        {tab==="regions" && <>
          <Select value={form.type||"town"} onChange={v=>setForm(p=>({...p,type:v}))} style={{ width:"100%" }}>
            {["city","town","hamlet","kingdom","castle","wilderness","forest","mountain","dungeon","ruins","route"].map(t=><option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={form.ctrl||""} onChange={v=>setForm(p=>({...p,ctrl:v}))} style={{ width:"100%" }}>
            <option value="">No controller</option>
            {data.factions.map(f=><option key={f.id} value={f.name}>{f.name}</option>)}
          </Select>
          <Select value={form.threat||"low"} onChange={v=>setForm(p=>({...p,threat:v}))} style={{ width:"100%" }}>
            {["low","medium","high","extreme"].map(t=><option key={t} value={t}>{t}</option>)}
          </Select>
        </>}
        {tab==="factions" && <>
          <Textarea value={form.desc||""} onChange={v=>setForm(p=>({...p,desc:v}))} placeholder="Description..." rows={2} />
          <Select value={form.attitude||"neutral"} onChange={v=>setForm(p=>({...p,attitude:v}))} style={{ width:"100%" }}>
            {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
          </Select>
        </>}
        {tab==="pois" && <>
          <Select value={form.type||"ruin"} onChange={v=>setForm(p=>({...p,type:v}))} style={{ width:"100%" }}>
            {["ruin","dungeon","shrine","landmark","cave","tower","grove","battlefield","portal","cataclysm_site"].map(t=><option key={t} value={t}>{t.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
          </Select>
          <Textarea value={form.description||""} onChange={v=>setForm(p=>({...p,description:v}))} placeholder="Description..." rows={2} />
          <Input value={form.hook||""} onChange={v=>setForm(p=>({...p,hook:v}))} placeholder="Adventure hook..." />
          <Select value={form.danger||0} onChange={v=>setForm(p=>({...p,danger:parseInt(v)}))} style={{ width:"100%" }}>
            {[0,1,2,3,4,5].map(d=><option key={d} value={d}>{["Safe","Low","Moderate","Dangerous","Deadly","Catastrophic"][d]}</option>)}
          </Select>
          <Select value={form.region||""} onChange={v=>setForm(p=>({...p,region:v}))} style={{ width:"100%" }}>
            <option value="">No region</option>
            {data.regions.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
          </Select>
        </>}
        {tab==="npcs" && <>
          <Input value={form.role||""} onChange={v=>setForm(p=>({...p,role:v}))} placeholder="Role (e.g., quest giver, ally)" />
          <Input value={form.loc||""} onChange={v=>setForm(p=>({...p,loc:v}))} placeholder="Location" />
          <Select value={form.faction||""} onChange={v=>setForm(p=>({...p,faction:v||null}))} style={{ width:"100%" }}>
            <option value="">No faction</option>
            {data.factions.map(f=><option key={f.id} value={f.name}>{f.name}</option>)}
          </Select>
          <Select value={form.attitude||"neutral"} onChange={v=>setForm(p=>({...p,attitude:v}))} style={{ width:"100%" }}>
            {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
          </Select>
        </>}
        <CrimsonBtn onClick={()=>{if(form.name) onAdd(tab.slice(0,-1),form);}}><Plus size={12}/> Add</CrimsonBtn>
      </div>
    </Modal>
  );
}

// Register for lazy-loader
window.CampaignWorldView = WorldView;

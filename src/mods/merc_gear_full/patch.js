import modder from '../../js/modder.js'

var mod_merc_gear_full = {
    update_inventory_txt: function (mod, targetFiles) {
        // get file headers and offsets
        var fileLines = targetFiles['inventory.txt']
        const col = modder.get_column_index(targetFiles, 'inventory.txt')

        // find rows to update
        const rowToUpdateHireling = modder.find_row_value(fileLines, 'class', 'Hireling')
        const rowToUpdateHireling2 = modder.find_row_value(fileLines, 'class', 'Hireling2')

        // prepare file operation
        const oplist = [{
            "find": fileLines[rowToUpdateHireling],
            "replace": "columns",
            "columns": [
                // Neck
                { "col": col('neckLeft'), "val": 208 },
                { "col": col('neckRight'), "val": 208 + 25 },
                { "col": col('neckTop'), "val": 32 },
                { "col": col('neckBottom'), "val": 32 + 26 },
                { "col": col('neckWidth'), "val": 25 },
                { "col": col('neckHeight'), "val": 26 },
                // right hand (shown in left hand slot)
                { "col": col('rHandLeft'), "val": 208 },
                { "col": col('rHandRight'), "val": 208 + 25 },
                { "col": col('rHandTop'), "val": 121 },
                { "col": col('rHandBottom'), "val": 121 + 24 },
                { "col": col('rHandWidth'), "val": 25 },
                { "col": col('rHandHeight'), "val": 26 },
                // belt
                { "col": col('beltLeft'), "val": 136 },
                { "col": col('beltRight'), "val": 136 + 56 },
                { "col": col('beltTop'), "val": 154 },
                { "col": col('beltBottom'), "val": 154 + 25 },
                { "col": col('beltWidth'), "val": 56 },
                { "col": col('beltHeight'), "val": 25 },
                // glove
                { "col": col('glovesLeft'), "val": 20 },
                { "col": col('glovesRight'), "val": 20 + 55 },
                { "col": col('glovesTop'), "val": 121 },
                { "col": col('glovesBottom'), "val": 121 + 56 },
                { "col": col('glovesWidth'), "val": 55 },
                { "col": col('glovesHeight'), "val": 56 },
                // boots
                { "col": col('feetLeft'), "val": 251 },
                { "col": col('feetRight'), "val": 251 + 55 },
                { "col": col('feetTop'), "val": 122 },
                { "col": col('feetBottom'), "val": 122 + 56 },
                { "col": col('feetWidth'), "val": 55 },
                { "col": col('feetHeight'), "val": 56 },
                // torso
                { "col": col('torsoLeft'), "val": 136 },
                { "col": col('torsoRight'), "val": 136 + 55 },
                { "col": col('torsoTop'), "val": 64 },
                { "col": col('torsoBottom'), "val": 64 + 83 },
                { "col": col('torsoWidth'), "val": 55 },
                { "col": col('torsoHeight'), "val": 83 },
                // right arm
                { "col": col('rArmLeft'), "val": 20 },
                { "col": col('rArmRight'), "val": 20 + 55 },
                { "col": col('rArmTop'), "val": 4 },
                { "col": col('rArmBottom'), "val": 4 + 112 },
                { "col": col('rArmWidth'), "val": 55 },
                { "col": col('rArmHeight'), "val": 112 },
                // left arm
                { "col": col('lArmLeft'), "val": 251 },
                { "col": col('lArmRight'), "val": 251 + 56 },
                { "col": col('lArmTop'), "val": 4 },
                { "col": col('lArmBottom'), "val": 4 + 112 },
                { "col": col('lArmWidth'), "val": 56 },
                { "col": col('lArmHeight'), "val": 112 },
            ]
        },
        {
            "find": fileLines[rowToUpdateHireling2],
            "replace": "columns",
            "columns": [
                // Neck
                { "col": col('neckLeft'), "val": 288 },
                { "col": col('neckRight'), "val": 288 + 25 },
                { "col": col('neckTop'), "val": 92 },
                { "col": col('neckBottom'), "val": 92 + 26 },
                { "col": col('neckWidth'), "val": 25 },
                { "col": col('neckHeight'), "val": 26 },
                // right hand (shown in left hand slot)
                { "col": col('rHandLeft'), "val": 288 },
                { "col": col('rHandRight'), "val": 288 + 25 },
                { "col": col('rHandTop'), "val": 181 },
                { "col": col('rHandBottom'), "val": 181 + 26 },
                { "col": col('rHandWidth'), "val": 25 },
                { "col": col('rHandHeight'), "val": 26 },
                // belt
                { "col": col('beltLeft'), "val": 216 },
                { "col": col('beltRight'), "val": 216 + 55 },
                { "col": col('beltTop'), "val": 214 },
                { "col": col('beltBottom'), "val": 214 + 24 },
                { "col": col('beltWidth'), "val": 56 },
                { "col": col('beltHeight'), "val": 24 },
                // glove
                { "col": col('glovesLeft'), "val": 100 },
                { "col": col('glovesRight'), "val": 100 + 55 },
                { "col": col('glovesTop'), "val": 181 },
                { "col": col('glovesBottom'), "val": 181 + 56 },
                { "col": col('glovesWidth'), "val": 55 },
                { "col": col('glovesHeight'), "val": 56 },
                // boots
                { "col": col('feetLeft'), "val": 331 },
                { "col": col('feetRight'), "val": 331 + 55 },
                { "col": col('feetTop'), "val": 182 },
                { "col": col('feetBottom'), "val": 182 + 56 },
                { "col": col('feetWidth'), "val": 55 },
                { "col": col('feetHeight'), "val": 56 },
                // torso
                { "col": col('torsoLeft'), "val": 216 },
                { "col": col('torsoRight'), "val": 216 + 55 },
                { "col": col('torsoTop'), "val": 124 },
                { "col": col('torsoBottom'), "val": 124 + 83 },
                { "col": col('torsoWidth'), "val": 55 },
                { "col": col('torsoHeight'), "val": 83 },
                // right arm
                { "col": col('rArmLeft'), "val": 100 },
                { "col": col('rArmRight'), "val": 100 + 55 },
                { "col": col('rArmTop'), "val": 64 },
                { "col": col('rArmBottom'), "val": 64 + 112 },
                { "col": col('rArmWidth'), "val": 55 },
                // left arm
                { "col": col('lArmLeft'), "val": 331 },
                { "col": col('lArmRight'), "val": 331 + 56 },
                { "col": col('lArmTop'), "val": 64 },
                { "col": col('lArmBottom'), "val": 64 + 112 },
                { "col": col('lArmWidth'), "val": 56 },
                { "col": col('lArmHeight'), "val": 112 },
                
            ]
        },
        ]

        // apply file operation
        modder.applySearchAndReplace(oplist, 'inventory.txt', targetFiles);
    },

    update_itemtypes_txt: function (mod, targetFiles) {
        // get file headers and offsets
        var fileLines = targetFiles['itemtypes.txt']
        const col = modder.get_column_index(targetFiles, 'itemtypes.txt')

        // find row to copy - need to copy row before changes are made
        const rowToCopyIndex = modder.find_row_value(fileLines, 'ItemType', 'Helm')
        const rowToCopy = fileLines[rowToCopyIndex]

        // find rows to update
        const updateAmuletRow = modder.find_row_value(fileLines, 'ItemType', 'Amulet')
        const updateRingRow = modder.find_row_value(fileLines, 'ItemType', 'Ring')
        const updateBeltRow = modder.find_row_value(fileLines, 'ItemType', 'Belt')
        const updateGlovesRow = modder.find_row_value(fileLines, 'ItemType', 'Gloves')
        const updateBootsRow = modder.find_row_value(fileLines, 'ItemType', 'Boots')
        const updateHelmRow = modder.find_row_value(fileLines, 'ItemType', 'Helm')

        // prepare file operation
        const oplist = [
            {
                "find": fileLines[updateAmuletRow],
                "replace": "columns",
                "columns": [{ "col": col('Equiv2'), "val": 'merc' }]
            },
            {
                "find": fileLines[updateRingRow],
                "replace": "columns",
                "columns": [{ "col": col('Equiv2'), "val": 'merc' }]
            },
            {
                "find": fileLines[updateBeltRow],
                "replace": "columns",
                "columns": [{ "col": col('Equiv2'), "val": 'merc' }]
            },
            {
                "find": fileLines[updateGlovesRow],
                "replace": "columns",
                "columns": [{ "col": col('Equiv2'), "val": 'merc' }]
            },
            {
                "find": fileLines[updateBootsRow],
                "replace": "columns",
                "columns": [{ "col": col('Equiv2'), "val": 'merc' }]
            },
            {
                "find": fileLines[updateHelmRow],
                "replace": "columns",
                "columns": [
                    { "col": col('Code'), "val": 'merc' },
                    { "col": col('Equiv1'), "val": '' },
                    { "col": col('StorePage'), "val": '' },
                ]
            },
        ]

        // apply file operation
        modder.applySearchAndReplace(oplist, 'itemtypes.txt', targetFiles);

        // Second part
        // Compose new line
        const columns = rowToCopy.split('\t')
        columns[col('ItemType')] = 'Merc Gear';
        columns[col('Code')] = 'helm';
        columns[col('Equiv1')] = 'armo';
        columns[col('Equiv2')] = 'merc';
        columns[col('MaxSockets1')] = '2';
        const newLine = columns.join('\t');

        // add new line to file
        var content = targetFiles['itemtypes.txt']
        const newContent = content.concat(newLine);
        targetFiles['itemtypes.txt'] = newContent;
    },
}

export default function applyPatch(mod, targetFiles, sourceFiles) {
    mod_merc_gear_full.update_inventory_txt(mod, targetFiles)
    mod_merc_gear_full.update_itemtypes_txt(mod, targetFiles)

    if (modder.MOD_TARGET === 'd2r') {
        const copyList = [
            { "source": "npcinv.dc6", "destination": "mods/diymod/diymod.mpq/data/global/ui/panel/npcinv.dc6" },
            { "source": "hirelingpanel.sprite", "destination": "mods/diymod/diymod.mpq/data/hd/global/ui/panel/hireling/hirelingpanel.sprite" },
            { "source": "hirelinginventorypanel.json", "destination": "mods/diymod/diymod.mpq/data/global/ui/layouts/hirelinginventorypanel.json" },
            { "source": "hirelinginventorypanelhd.json", "destination": "mods/diymod/diymod.mpq/data/global/ui/layouts/hirelinginventorypanelhd.json" }
        ]
        modder.fileCopy(mod, copyList, sourceFiles, targetFiles);
    } else {
        const copyList = [
            { "source": "npcinv.dc6", "destination": "data/global/ui/panel/npcinv.dc6" }
        ]
        modder.fileCopy(mod, copyList, sourceFiles, targetFiles);
    }
}

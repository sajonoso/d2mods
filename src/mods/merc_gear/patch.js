import modder from '../../js/modder.js'

var mod_merc_gear = {
    update_inventory_txt: function (mod, targetFiles) {
        // get file headers and offsets
        var fileLines = targetFiles['inventory.txt']

        // find rows to update
        const rowToUpdateHireling = modder.find_row_value(fileLines, 'class', 'Hireling')
        const rowToUpdateHireling2 = modder.find_row_value(fileLines, 'class', 'Hireling2')

        // prepare file operation
        const oplist = [{
            "find": fileLines[rowToUpdateHireling],
            "replace": "columns",
            "columns": [
                // Neck
                { "col": 'neckLeft', "val": 208 },
                { "col": 'neckRight', "val": 208 + 25 },
                { "col": 'neckTop', "val": 32 },
                { "col": 'neckBottom', "val": 32 + 26 },
                { "col": 'neckWidth', "val": 25 },
                { "col": 'neckHeight', "val": 26 },
                // right hand (shown in left hand slot)
                { "col": 'rHandLeft', "val": 208 },
                { "col": 'rHandRight', "val": 208 + 25 },
                { "col": 'rHandTop', "val": 121 },
                { "col": 'rHandBottom', "val": 121 + 24 },
                { "col": 'rHandWidth', "val": 25 },
                { "col": 'rHandHeight', "val": 26 },
                // invLeft	invRight	invTop	invBottom	gridX	gridY	gridLeft	gridRight	gridTop	gridBottom	gridBoxWidth	gridBoxHeight
                // Inventory slots
                { "col": 'invLeft', "val": 90 },
                { "col": 'invRight', "val": 90 + (29 * 1) + (2 * 4) },
                { "col": 'invTop', "val": 60 },
                { "col": 'invBottom', "val": 60 + (29 * 3) + (2 * 4) },
                { "col": 'gridX', "val": 1 },
                { "col": 'gridY', "val": 3 },
                { "col": 'gridLeft', "val": (90 + 4) },
                { "col": 'gridRight', "val": (90 + 4) + (29 * 1) },
                { "col": 'gridTop', "val": (60 + 4) },
                { "col": 'gridBottom', "val": (60 + 4) + (29 * 3) },
                { "col": 'gridBoxWidth', "val": 29 },
                { "col": 'gridBoxHeight', "val": 29 },
            ]
        },
        {
            "find": fileLines[rowToUpdateHireling2],
            "replace": "columns",
            "columns": [
                // Neck
                { "col": 'neckLeft', "val": 288 },
                { "col": 'neckRight', "val": 288 + 25 },
                { "col": 'neckTop', "val": 92 },
                { "col": 'neckBottom', "val": 92 + 26 },
                { "col": 'neckWidth', "val": 25 },
                { "col": 'neckHeight', "val": 26 },
                // right hand (shown in left hand slot)
                { "col": 'rHandLeft', "val": 288 },
                { "col": 'rHandRight', "val": 288 + 25 },
                { "col": 'rHandTop', "val": 181 },
                { "col": 'rHandBottom', "val": 181 + 26 },
                { "col": 'rHandWidth', "val": 25 },
                { "col": 'rHandHeight', "val": 26 },
                // Inventory slots
                { "col": 'invLeft', "val": 170 },
                { "col": 'invRight', "val": 170 + (29 * 1) + (2 * 4) },
                { "col": 'invTop', "val": 60 },
                { "col": 'invBottom', "val": 60 + (29 * 3) + (2 * 4) },
                { "col": 'gridX', "val": 1 },
                { "col": 'gridY', "val": 3 },
                { "col": 'gridLeft', "val": (170 + 4) },
                { "col": 'gridRight', "val": (170 + 4) + (29 * 1) },
                { "col": 'gridTop', "val": (60 + 4) },
                { "col": 'gridBottom', "val": (60 + 4) + (29 * 3) },
                { "col": 'gridBoxWidth', "val": 29 },
                { "col": 'gridBoxHeight', "val": 29 },
            ]
        }]

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
        const updateHelmRow = modder.find_row_value(fileLines, 'ItemType', 'Helm')
        const updateAmuletRow = modder.find_row_value(fileLines, 'ItemType', 'Amulet')
        const updateRingRow = modder.find_row_value(fileLines, 'ItemType', 'Ring')

        // prepare file operation
        const oplist = [
            {
                "find": fileLines[updateHelmRow],
                "replace": "columns",
                "columns": [
                    { "col": 'Code', "val": 'merc' },
                    { "col": 'Equiv1', "val": '' },
                    { "col": 'StorePage', "val": '' },
                ]
            },
            {
                "find": fileLines[updateAmuletRow],
                "replace": "columns",
                "columns": [{ "col": 'Equiv2', "val": 'merc' }]
            },
            {
                "find": fileLines[updateRingRow],
                "replace": "columns",
                "columns": [{ "col": 'Equiv2', "val": 'merc' }]
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
    mod_merc_gear.update_inventory_txt(mod, targetFiles)
    mod_merc_gear.update_itemtypes_txt(mod, targetFiles)

    if (modder.MOD_TARGET === 'd2r') {
        const copyList = [
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

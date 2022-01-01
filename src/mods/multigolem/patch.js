modder.currentPatch = function applyPatch(mod, targetFiles) {
    var fileLines = targetFiles['pettype.txt']
    var maxID = modder.get_max_column(fileLines, 'idx');

    var additions = [
        "claygolem\t" + (maxID + 1) + "\t\t0\t1\t\t1\t1\t1\tStrUI0\t1\t3\tearthgolumicon\t289\tearthgolumicon\t\t\t\t\t\t\t0",
        "bloodgolem\t" + (maxID + 2) + "\t\t0\t1\t\t1\t1\t1\tStrUI0\t1\t3\tbloodgolumicon\t290\tbloodgolumicon\t\t\t\t\t\t\t0",
        "firegolem\t" + (maxID + 3) + "\t\t0\t1\t\t1\t1\t1\tStrUI0\t1\t3\tfiregolumicon\t292\tfiregolumicon\t\t\t\t\t\t\t0",
    ]

    targetFiles['pettype.txt'] = fileLines.concat(additions)
}

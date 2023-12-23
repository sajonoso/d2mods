import modder from '../../js/modder.js'

// Cell sizes are 29px and 96px (hd) in size. subtract from X and Y when adding columns or rows

export default function applyPatch(mod, targetFiles, sourceFiles) {
  if (modder.MOD_TARGET === 'd2r') {
    const copyList = [
      { "source": "supertransmogrifier.dc6", "destination": "mods/diymod/diymod.mpq/data/global/ui/panel/supertransmogrifier.dc6" },
      { "source": "ui/controller/panel/horadriccube/v2/horadriccubebg.lowend.sprite", "destination": "mods/diymod/diymod.mpq/data/hd/global/ui/controller/panel/horadriccube/v2/horadriccubebg.lowend.sprite" },
      { "source": "ui/controller/panel/horadriccube/v2/horadriccubebg.sprite", "destination": "mods/diymod/diymod.mpq/data/hd/global/ui/controller/panel/horadriccube/v2/horadriccubebg.sprite" },
      { "source": "ui/panel/horadric_cube/horadriccube_bg.lowend.sprite", "destination": "mods/diymod/diymod.mpq/data/hd/global/ui/panel/horadric_cube/horadriccube_bg.lowend.sprite" },
      { "source": "ui/panel/horadric_cube/horadriccube_bg.sprite", "destination": "mods/diymod/diymod.mpq/data/hd/global/ui/panel/horadric_cube/horadriccube_bg.sprite" },
      { "source": "horadriccubelayout.json", "destination": "mods/diymod/diymod.mpq/data/global/ui/layouts/horadriccubelayout.json" },
      { "source": "horadriccubelayouthd.json", "destination": "mods/diymod/diymod.mpq/data/global/ui/layouts/horadriccubelayouthd.json" }
    ]
    modder.fileCopy(mod, copyList, sourceFiles, targetFiles);
  } else {
    const copyList = [
      { "source": "supertransmogrifier.dc6", "destination": "data/global/ui/panel/supertransmogrifier.dc6" }
    ]
    modder.fileCopy(mod, copyList, sourceFiles, targetFiles);
  }
}
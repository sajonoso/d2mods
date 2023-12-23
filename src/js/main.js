import '../mods.zip.js'

// import './polyfills.js'
import JSZip from '../libs/jszip.min.js'
import '../libs/FileSaver.min.js'
import modder from './modder.js'

const prnt = console.log

const FILENAME_D2X = 'diymod_d2x.zip';
const FILENAME_D2R = 'diymod_d2r.zip';


// Global variables
DATA_UNZIPPED = {} // unzipped source content for patches and source files


window.ID = function (o) { return document.getElementById(o) }

// Get option for a specific mod on the web page
function getModOptions(modId) {
  if (modId === "multivalkyrie") {
    const maxValk = ID("multivalkyrie_limit").value;
    return { maxValk: maxValk };
  }

  if (modId === "merc_gear") {
    const mercOptions = ID("merc_gear_option").value;
    return { mercOptions: mercOptions };
  }

  if (modId === "side_kick1") {
    const summonSkill = document.querySelector(
      "#side_kick1 input[name=sidekick1_skill]:checked"
    ).value;
    const summonType = document.querySelector(
      "#side_kick1 input[name=sidekick1_type]:checked"
    ).value;
    return { summonSkill: summonSkill, summonType: summonType, id: 1 };
  }

  if (modId === "side_kick2") {
    const summonSkill = document.querySelector(
      "#side_kick2 input[name=sidekick2_skill]:checked"
    ).value;
    const summonType = document.querySelector(
      "#side_kick2 input[name=sidekick2_type]:checked"
    ).value;
    return { summonSkill: summonSkill, summonType: summonType, id: 2 };
  }

  if (modId === "mob_density") {
    const mult = ID("mob_density_multiplier").value
    return { multiplier: mult }
  }

  return {};
}

// Get all GUI options and create a JSON object 
function getOptions(modTarget) {
  const allMods = document.querySelectorAll(".mod-option");

  var enabled_patches = [];
  allMods.forEach(function (mod) {
    if (modTarget === 'd2x' && mod.className.indexOf('show-d2r') > 0) return;
    if (modTarget === 'd2r' && mod.className.indexOf('show-d2x') > 0) return;

    if (mod.getElementsByTagName("input")[0].checked) {
      const modOptions = getModOptions(mod.id);
      let modName = mod.id === 'side_kick2' || mod.id === 'side_kick1' ? 'side_kick' : mod.id
      if (modName === 'merc_gear' && modOptions.mercOptions === 'full') modName = 'merc_gear_full';
      enabled_patches.push({ name: modName, options: modOptions });
    }
  });

  return enabled_patches;
};

window.filedownload_click = function () {
  window.setPageBusy(true);
  const sourceFiles = DATA_UNZIPPED
  const modTarget = ID('mod_target').value
  const modSettings = {
    target: modTarget,
    enabledMods: getOptions(modTarget)
  }
  var targetZip = new JSZip();

  // add file listing options selected
  const prefix = modSettings.target === 'd2r' ? 'mods/diymod' : 'data'
  targetZip.file(prefix + '/modoptions.txt', JSON.stringify(modSettings, null, 2))
  if (modSettings.target === 'd2r') targetZip.file('mods/diymod/diymod.mpq/modinfo.json', '{"name": "diymod","savepath": "diymod/"}')

  modder.ApplyMods(modSettings, sourceFiles, targetZip)

  const modFilename = modTarget === 'd2r' ? FILENAME_D2R : FILENAME_D2X;

  targetZip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 5 } })
    .then(function (blob) {
      window.setPageBusy(false);
      saveAs(blob, modFilename);
      location.reload();
    }, function (err) {
      window.setPageBusy(false);
      ID("#output").innerHTML = err;
    });
}


window.target_onchange = function (evt) {
  const isD2R = evt.target.value === 'd2r'
  const classRemove = isD2R ? 'prod-d2x' : 'prod-d2r'
  const classAdd = isD2R ? 'prod-d2r' : 'prod-d2x'
  document.body.classList.remove(classRemove)
  document.body.classList.add(classAdd)
}

window.setPageBusy = function (isBusy) {
  const classAdd = isBusy ? 'busy-on' : 'busy-off'
  const classRemove = isBusy ? 'busy-off' : 'busy-on'
  document.body.classList.remove(classRemove)
  document.body.classList.add(classAdd)
}

// const zipDataBinary = window.atob(DATA_ZIP)


// Unzip all files in data zip file
function GetAllZipfiles(zip, ZipfileList) {
  var Promise = JSZip.external.Promise;

  const unzipList = ZipfileList.map(function (item) {
    const extension3 = item.substr(-3).toLowerCase()
    const extension4 = item.substr(-4).toLowerCase()
    const extension5 = item.substr(-5).toLowerCase()
    const contentType = (extension3 === '.js' || extension4 === ".txt" || extension5 === ".json") ?
      'string' : 'uint8array'
    return zip.file(item).async(contentType).then(function (data) {
      return { file: item, content: data }
    })
  })

  Promise.all(unzipList).then(function (unzippedFiles) {
    DATA_UNZIPPED = {}
    unzippedFiles.forEach(function (item) {
      DATA_UNZIPPED[item.file.toLowerCase()] = item.content;
    })

    prnt('Ready!');
    window.setPageBusy(false);
  });
}

function setMutualExclusiveOptions() {
  const merc_opt = document.querySelector("#merc_gear input");
  const merc_full_opt = document.querySelector("#merc_gear_full input");

  merc_opt.addEventListener('change', function (event) {
    if (event.currentTarget.checked) {
      merc_full_opt.checked = false;
    }
  })

  merc_full_opt.addEventListener('change', function (event) {
    if (event.currentTarget.checked) {
      merc_opt.checked = false;
    }
  })
}

function main() {
  // setMutualExclusiveOptions();
  window.setPageBusy(true);
  // set target select options
  window.target_onchange({ target: { value: 'd2x' } })

  // Get all files in Zip file
  JSZip.loadAsync(DATA_ZIP, { base64: true, checkCRC32: true })
    .then(function (zip) {
      const fileList = Object.keys(zip.files).filter(function (fileName) {
        return (fileName.substr(-1) !== '/') // directorys return false
      })
      GetAllZipfiles(zip, fileList)
    })
}

main();
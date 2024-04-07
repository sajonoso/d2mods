// import JSZip from '../libs/jszip.min.js'
import '../libs/FileSaver.min.js'
// import modder from './modder.mjs'
import { generateZipFile } from './d2zip_generator.mjs'


const println = console.log


// Global variables
window.ID = function (o) { return document.getElementById(o) }


// ##### UI handling functions start here

// Get option for a specific mod on the web page
function getModOptions(modId) {
  if (modId === "multivalkyrie") {
    const maxValk = ID("multivalkyrie_limit").value;
    return { maxValk: maxValk };
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
      let modName = mod.id === 'side_kick2' || mod.id === 'side_kick1' ? 'sidekick' : mod.id
      enabled_patches.push({ name: modName, options: modOptions });
    }
  });

  return enabled_patches;
};

function setDisplay(isD2R) {
  const classRemove = isD2R ? 'prod-d2x' : 'prod-d2r'
  const classAdd = isD2R ? 'prod-d2r' : 'prod-d2x'
  document.body.classList.remove(classRemove)
  document.body.classList.add(classAdd)
}

window.target_onchange = function (evt) {
  const isD2R = evt.target.value === 'd2r'
  setDisplay(isD2R)
}

window.setPageBusy = function (isBusy) {
  const classAdd = isBusy ? 'busy-on' : 'busy-off'
  const classRemove = isBusy ? 'busy-off' : 'busy-on'
  document.body.classList.remove(classRemove)
  document.body.classList.add(classAdd)
}


// ##### Mod generating functions start here

window.filedownload_click = function () {
  let timeCount = 99
  const counter = ID('counter')

  const counterId = setInterval(() => {
    counter.innerText = `${timeCount}`
    timeCount--
  },1000)
  window.setPageBusy(true);

  const D2_VERSION = ID('mod_target').value
  const MOD_OPTIONS = getOptions(D2_VERSION)

  setTimeout(() => {
    const { zipWriter, newFilename, newZipFile } = generateZipFile(D2_VERSION, MOD_OPTIONS)
    window.setPageBusy(false);
    clearInterval(counterId);

    println(`File size: ${newZipFile.length}`)
    saveAs(new Blob([newZipFile]), newFilename);
    zipWriter.close()

    println('Done!', new Date());
  }, 100);
}

function main() {
  setDisplay(false)
  window.setPageBusy(false);
}

main();